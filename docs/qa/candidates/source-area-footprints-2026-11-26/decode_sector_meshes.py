"""Research-only exact mesh-face projection of public named-sector candidates.

Reads self-describing Havok TAG0 types/items (inspect_havok.py), original
triangle/quad primitives, and float or quantized vertex buffers. It does not
substitute bounding boxes for boundaries. Float sentinel/quantization reference:
nvnprogram/HoianViewer 8a1eeb215a65ddc74d7cb9f07f2cf0c707f9d4d1
PlayerViewer/Phive/PhiveConvert.Shape.cs; nvnprogram/PhiveConverter
03faf4be678a42d18b1786bef6321b52dfbcd10b source/fivex/MeshShapeBuilder.cpp.

No native-map coordinates or runtime approvals are produced here.
"""
from pathlib import Path
import hashlib
import json
import math
import struct
import sys
import shapely
from shapely.geometry import Polygon, mapping
from shapely.ops import unary_union
from inspect_havok import read_tagfile

HERE=Path(__file__).resolve().parent


def decode(path, scene):
    raw=path.read_bytes()
    data, types, items=read_tagfile(raw)
    meshes=[x for x in items if x['name']=='hknpMeshShape']
    assert len(meshes)==1 and meshes[0]['count']==1
    mesh=meshes[0]

    def field(t, name):
        matches=[x for x in types[t]['fields'] if x['name']==name]
        if not matches and types[t].get('parent'):
            return field(types[t]['parent'],name)
        assert len(matches)==1,(types[t]['name'],name)
        return matches[0]

    def ptr(at):
        idx=struct.unpack_from('<I',data,at)[0]
        assert 0<idx<len(items),idx
        return items[idx]

    def blob(item):
        t=types[item['type']]
        while 'size' not in t and t.get('parent'):
            t=types[t['parent']]
        size=t['size']
        return data[item['offset']:item['offset']+item['count']*size]

    conv=field(mesh['type'],'vertexConversionUtil')
    inv=field(conv['type'],'bitScale16Inv')
    inv_scale=struct.unpack_from('<4f',data,mesh['offset']+conv['offset']+inv['offset'])
    sec=ptr(mesh['offset']+field(mesh['type'],'geometrySections')['offset'])
    assert sec['name']=='hknpMeshShape::GeometrySection'
    assert len(scene['collisions'])==1
    local=scene['collisions'][0]
    assert local['type']=='Havok'
    assert local['transform']==[0,0,0] and local['rotation']==[0,0,0] and local['scale']==[1,1,1]
    assert scene['rotation'][0]==0 and scene['rotation'][2]==0,scene
    yaw=scene['rotation'][1]
    c,s=math.cos(yaw),math.sin(yaw)

    def world(v):
        x,y,z=[v[i]*scene['scale'][i] for i in range(3)]
        return [x*c+z*s+scene['translation'][0],y+scene['translation'][1],-x*s+z*c+scene['translation'][2]]

    faces=[]
    raw_vertices=[]
    world_vertices=[]
    sections=[]
    triangles=[]
    degenerate_projected_triangles=0
    for si in range(sec['count']):
        at=sec['offset']+si*types[sec['type']]['size']
        prim=ptr(at+field(sec['type'],'primitives')['offset'])
        verts=ptr(at+field(sec['type'],'vertexBuffer')['offset'])
        assert prim['name']=='hknpMeshShape::GeometrySection::Primitive'
        qoffset=struct.unpack_from('<3i',data,at+field(sec['type'],'sectionOffset')['offset'])
        vb=blob(verts)
        primitive_ids=list(struct.iter_unpack('<4B',blob(prim)))
        max_id=max(max(x) for x in primitive_ids)
        if qoffset==(2147483647,)*3:
            assert len(vb)%12==0
            vs=list(struct.iter_unpack('<3f',vb));encoding='float32'
        else:
            assert len(vb)%6 in [0,2]
            vs=[[ (v[i]+qoffset[i])*inv_scale[i] for i in range(3)] for v in struct.iter_unpack('<3H',vb[:len(vb)//6*6])]
            encoding='uint16+offset+inverse-scale'
        assert max_id<len(vs),(max_id,len(vs))
        assert all(math.isfinite(q) for v in vs for q in v)
        ws=[world(v) for v in vs]
        raw_vertices.extend(vs);world_vertices.extend(ws)
        for ids in primitive_ids:
            ids=ids[:3] if ids[2]==ids[3] else ids
            face=[ws[k] for k in ids]
            faces.append(face)
            tris=[(0,1,2)] if len(ids)==3 else [(0,1,2),(0,2,3)]
            for tri in tris:
                p=Polygon([(face[k][0],face[k][2]) for k in tri])
                # A vertical source face can project to a zero-area segment.
                # Keep its full XYZ face above; it does not add planar area.
                if p.area<=1e-10:
                    degenerate_projected_triangles+=1
                    continue
                assert p.is_valid,(path.name,face,tri)
                triangles.append(p)
        sections.append(dict(section_index=si,vertex_count=len(vs),primitive_count=len(primitive_ids),encoding=encoding,
                             source_section_offset=list(qoffset)))
    geom=unary_union(triangles)
    assert geom.is_valid and not geom.is_empty and geom.geom_type in ['Polygon','MultiPolygon'],geom
    # Decoder cross-check against the independently stored top-level tree bounds.
    top=field(mesh['type'],'topLevelTree')
    nodes=ptr(mesh['offset']+top['offset']+field(top['type'],'nodes')['offset'])
    ntype=nodes['type']
    assert nodes['name']=='hkcdSimdTree::Node'
    aabb=[]
    for ni in range(nodes['count']):
        at=nodes['offset']+ni*types[ntype]['size']
        vec={name:struct.unpack_from('<4f',data,at+field(ntype,name)['offset']) for name in ['lx','hx','ly','hy','lz','hz']}
        for k in range(4):
            lo=[vec['l'+axis][k] for axis in 'xyz'];hi=[vec['h'+axis][k] for axis in 'xyz']
            if all(lo[j]<=hi[j] for j in range(3)):
                aabb.append((lo,hi))
    mesh_min=[min(v[j] for v in raw_vertices) for j in range(3)]
    mesh_max=[max(v[j] for v in raw_vertices) for j in range(3)]
    tree_min=[min(b[0][j] for b in aabb) for j in range(3)]
    tree_max=[max(b[1][j] for b in aabb) for j in range(3)]
    bound_delta=max(abs(a-b) for a,b in zip(mesh_min+mesh_max,tree_min+tree_max))
    assert bound_delta<0.02,dict(mesh_min=mesh_min,mesh_max=mesh_max,tree_min=tree_min,tree_max=tree_max)
    return dict(sha256=hashlib.sha256(raw).hexdigest(),geometry=mapping(geom),scene_transform=scene,
                sections=sections,faces_xyz=faces,world_y_range=[min(v[1] for v in world_vertices),max(v[1] for v in world_vertices)],
                mesh_vs_tree_max_axis_delta=bound_delta,planar_area=geom.area,
                component_count=1 if geom.geom_type=='Polygon' else len(geom.geoms),
                degenerate_projected_triangles=degenerate_projected_triangles,
                triangle_area_sum=sum(p.area for p in triangles),triangle_union_area=geom.area)


def main():
    receipt=json.loads((HERE/'public-sector-assets-receipt.json').read_text())
    records=[]
    for row in receipt['assets']:
        result=decode(HERE/'public-assets'/row['local_file'],row['scene'])
        result.update(label=row['label'],name_key=row['name'],area_name=row['area_name'],git_blob_sha=row['git_blob_sha'])
        records.append(result)
        print(row['label'],result['component_count'],result['world_y_range'],result['mesh_vs_tree_max_axis_delta'],flush=True)
    out=dict(status='source mesh candidates only; native registration and semantic boundary review incomplete',
             source_commit=receipt['source_commit'],source_version_claim=receipt['publisher_declared_version'],
             shapely_version=shapely.__version__,coordinate_system='world XYZ after original scene SRT; polygons project XZ',
             records=records)
    (HERE/'decoded-sector-candidates.json').write_text(json.dumps(out,indent=2)+'\n')


if __name__=='__main__':
    main()
