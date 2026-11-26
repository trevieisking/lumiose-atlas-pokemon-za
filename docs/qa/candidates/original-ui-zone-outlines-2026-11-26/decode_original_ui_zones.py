"""Read original zone pane/material joins and texture channels in scratch.

This is separate from collision-mesh geometry. No contour is approved here.
Layout field order is checked against Switch-Toolbox 2899b5d PAN1, PRT1,
PIC1, MAT1 and TextureRef readers. The metadata is decoded directly from the
pinned original SARC, BFLYT and BNTX assets; visible zone suffixes are not guessed.
"""
from pathlib import Path
import hashlib, json, re, struct
import numpy as np
from PIL import Image
from inspect_scene import FB
from za_formats_reference import parse_sarc, Bntx, parse_tbl, decode_msg

HERE = Path(__file__).resolve().parent
ASSETS = HERE / 'public-assets'
OUT = HERE / 'ui-zone-textures'

def cstr(data, p, n=None):
    return data[p:p+n if n is not None else data.index(b'\0', p)].split(b'\0', 1)[0].decode('utf-8')

def pane(data, pos):
    return dict(kind=data[pos:pos+4].decode(), byte_offset=pos, name=cstr(data,pos+12,24),
        flags=list(data[pos+8:pos+12]), translation=list(struct.unpack_from('<3f',data,pos+44)),
        rotation=list(struct.unpack_from('<3f',data,pos+56)), scale=list(struct.unpack_from('<2f',data,pos+68)),
        size=list(struct.unpack_from('<2f',data,pos+76)))

def layout(data):
    assert data[:6] == b'FLYT\xff\xfe' and data[11] == 9
    blocks=[];pos=struct.unpack_from('<H',data,6)[0]
    while pos<len(data):
        kind=data[pos:pos+4].decode();size=struct.unpack_from('<I',data,pos+4)[0]
        assert size>=8 and pos+size<=len(data)
        blocks.append((kind,pos,size));pos+=size
    assert pos==len(data)
    tx=next(p for k,p,s in blocks if k=='txl1');n=struct.unpack_from('<H',data,tx+8)[0]
    textures=[cstr(data,tx+12+o)for o in struct.unpack_from('<'+str(n)+'I',data,tx+12)]
    mt=next(p for k,p,s in blocks if k=='mat1');n=struct.unpack_from('<H',data,mt+8)[0]
    materials=[]
    for index,off in enumerate(struct.unpack_from('<'+str(n)+'I',data,mt+12)):
        p=mt+off;flags=struct.unpack_from('<I',data,p+28)[0];nt=flags&3;nm=(flags>>2)&3
        refs=[struct.unpack_from('<hBB',data,p+44+4*j)for j in range(nt)]
        mtx=[list(struct.unpack_from('<5f',data,p+44+4*nt+20*j))for j in range(nm)]
        materials.append(dict(index=index,name=cstr(data,p,28),flags=flags,
            black_rgba=list(data[p+36:p+40]),white_rgba=list(data[p+40:p+44]),
            textures=[dict(index=i,name=textures[i],wrap_filter_s=s,wrap_filter_t=t)for i,s,t in refs],
            texture_transforms=mtx))
    panes=[];stack=[];last=None
    for k,p,size in blocks:
        if k in ['pan1','pic1','prt1','txt1','wnd1','bnd1']:
            row=pane(data,p);row['parents']=list(stack);last=row
            if k=='prt1':
                count=struct.unpack_from('<I',data,p+84)[0]
                row['magnification']=list(struct.unpack_from('<2f',data,p+88))
                row['layout_file']=cstr(data,p+96+40*count)
                row['overrides']=[]
                for j in range(count):
                    at=p+96+40*j;name=cstr(data,at,24);of=struct.unpack_from('<I',data,at+28)[0]
                    flags=list(data[at+24:at+28])
                    if not of:continue
                    sub=pane(data,p+of);assert sub['name']==name
                    assert sub['kind']=='pic1'
                    index=struct.unpack_from('<H',data,p+of+100)[0]
                    uvcount=data[p+of+102]
                    sub.update(override_flags=flags,material=materials[index],
                        vertex_rgba=[list(data[p+of+84+4*i:p+of+88+4*i])for i in range(4)],
                        uv_sets=[list(struct.unpack_from('<8f',data,p+of+104+32*i))for i in range(uvcount)])
                    row['overrides'].append(sub)
            panes.append(row)
        elif k=='pas1':stack.append({key:last[key]for key in ['name','translation','rotation','scale','size','flags']})
        elif k=='pae1':stack.pop()
    assert not stack
    return dict(textures=textures,materials=materials,panes=panes)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    top_raw=(ASSETS/'map_top_00.arc').read_bytes();top_members=dict(parse_sarc(top_raw))
    top=layout(top_members['blyt/map_top_00.bflyt'])
    field_members=dict(parse_sarc((ASSETS/'map_field_00.arc').read_bytes()))
    field=layout(field_members['blyt/map_field_00.bflyt'])
    bntx=Bntx(top_members['timg/__Combined.bntx'])
    textures={t.name:t for t in bntx.textures}
    fb=FB((ASSETS/'map_zone_pane.bin').read_bytes())
    joins=[dict(zone_id=fb.string(t,0),source_numeric_id=struct.unpack_from('<I',fb.b,fb.field(t,1))[0]if fb.field(t,1)is not None else 0,
                pane_name=fb.string(t,2))for t in fb.vector(fb.root,0)]
    names=dict(zip(parse_tbl((ASSETS/'place_name.tbl').read_bytes()),decode_msg((ASSETS/'place_name.dat').read_bytes())))
    rows=[]
    for join in joins:
        if not join['pane_name'].startswith('L_w_'):continue
        p=next(p for p in top['panes']if p['name']==join['pane_name'])
        assert p['layout_file']=='map_zone_00'
        if p['overrides']:
            picture=next(x for x in p['overrides']if x['name']=='P_zone_00')
            glow_picture=next(x for x in p['overrides']if x['name']=='P_zone_04')
            texnames=[x['name']for x in picture['material']['textures']if re.fullmatch(r'map_zone_\d+\^t',x['name'])]
            assert len(texnames)==1
            texname=texnames[0]
        else:
            default=layout(top_members['blyt/map_zone_00.bflyt'])
            picture=next(x for x in default['panes']if x['name']=='P_zone_00')
            # The default picture's material is held in the common layout.
            at=picture['byte_offset'];idx=struct.unpack_from('<H',top_members['blyt/map_zone_00.bflyt'],at+100)[0]
            picture['material']=default['materials'][idx]
            glow_picture=next(x for x in default['panes']if x['name']=='P_zone_04')
            gidx=struct.unpack_from('<H',top_members['blyt/map_zone_00.bflyt'],glow_picture['byte_offset']+100)[0]
            glow_picture['material']=default['materials'][gidx]
            texnames=[x['name']for x in picture['material']['textures']if re.fullmatch(r'map_zone_\d+\^t',x['name'])]
            assert len(texnames)==1;texname=texnames[0]
        t=textures[texname]
        glow_names=[x['name']for x in glow_picture['material']['textures']if re.fullmatch(r'map_zone_glow_\d+\^s',x['name'])]
        assert len(glow_names)==1
        gt=textures[glow_names[0]]
        assert glow_picture['size']==picture['size'] and [gt.width,gt.height]==[t.width,t.height]
        assert glow_picture['translation']==[0,0,0] and glow_picture['rotation']==[0,0,0] and glow_picture['scale']==[1,1]
        raw=t.decode(apply_comp_sel=False);mapped=t.decode()
        key='PLACENAME_wild_'+join['zone_id'];label=names[key]
        assert join['source_numeric_id']==int(label.split()[-1])
        mapped.save(OUT/(label.lower().replace(' ','-')+'-rgba.png'))
        glow=gt.decode().getchannel('A')
        glow.save(OUT/(label.lower().replace(' ','-')+'-glow-alpha.png'))
        a=np.array(raw)
        Image.fromarray(a[:,:,0]).save(OUT/(label.lower().replace(' ','-')+'-red.png'))
        Image.fromarray(a[:,:,1]).save(OUT/(label.lower().replace(' ','-')+'-green.png'))
        for transform in [p,picture,*p['parents']]:assert transform['rotation']==[0,0,0]
        assert p['scale']==[1,1] and p['magnification']==[1,1]
        assert picture['translation']==[0,0,0] and picture['scale']==[1,1] and picture['flags'][1]==0
        rows.append(dict(**join,name_key=key,label=label,pane=p,picture=picture,glow_picture=glow_picture,
            texture=dict(name=texname,width=t.width,height=t.height,format=t.format_name,
                component_selectors=t.comp_sel,decoded_rgba_sha256=hashlib.sha256(mapped.tobytes()).hexdigest()),
            glow_texture=dict(name=gt.name,width=gt.width,height=gt.height,format=gt.format_name,
                component_selectors=gt.comp_sel,decoded_alpha_sha256=hashlib.sha256(glow.tobytes()).hexdigest()),
            fixed_texture_to_original_map=dict(offset=[2048+p['translation'][0]-picture['size'][0]/2,
                2048-p['translation'][1]-picture['size'][1]/2],
                scale=[picture['size'][0]/t.width,picture['size'][1]/t.height],
                pixel_center_correction=[(picture['size'][0]/t.width-1)/2,(picture['size'][1]/t.height-1)/2],
                convention='Pixel-center indices in both texture and original4096 image; offset+scale*index+(scale-1)/2.'),
            placement_scope='Fixed original UI pane placement relative to the shared map origin; no green-outline fit.'))
    assert len(rows)==20
    rows.sort(key=lambda r:int(r['label'].split()[-1]))
    out=dict(status='unapproved original rendered-UI source metadata; no contour or transform fit',
        source_commit='e44a63db22a9f295d43c34db3f67695d31ae8e7a',
        map_top_sha256=hashlib.sha256(top_raw).hexdigest(),
        layout_sha256=hashlib.sha256(top_members['blyt/map_top_00.bflyt']).hexdigest(),
        original_zone_pane_sha256=hashlib.sha256((ASSETS/'map_zone_pane.bin').read_bytes()).hexdigest(),
        original_shared_map_panes=[p for p in field['panes']if p['name']in ['N_zoom_00','N_pos_00','P_map_00','N_map_range_00']],
        original_shared_map_material=field['materials'][0],
        pane_joins=joins,records=rows)
    (HERE/'original-ui-zone-placement.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps([dict(label=r['label'],pane=r['pane_name'],texture=r['texture']['name'],picture_size=r['picture']['size'],placement=r['fixed_texture_to_original_map'])for r in rows],indent=2))

if __name__=='__main__':main()
