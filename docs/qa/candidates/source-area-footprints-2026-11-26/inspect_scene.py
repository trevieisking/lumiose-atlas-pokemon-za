"""Decode relevant public Trinity scene fields using published pkNX ZA schemas.

Schema source: kwsch/pkNX 3bc649eea311ab1f249af43a562f8d70fe90ed9b,
FlatBuffers/ZA/Trinity/Schemas/{TrinitySceneObjectTemplate,TrinitySceneObject,
TrinityComponent}.fbs and shared Geometry/SRT.fbs, Math/PackedVec3f.fbs.
Research only; output is not approved Atlas geometry.
"""
from pathlib import Path
import json
import struct
import sys


class FB:
    def __init__(self, buf):
        self.b = buf
        self.root = self.u32(0)
        assert 0 < self.root < len(buf)

    def u32(self, p):
        return struct.unpack_from('<I', self.b, p)[0]

    def field(self, table, idx):
        vt = table - struct.unpack_from('<i', self.b, table)[0]
        n = struct.unpack_from('<H', self.b, vt)[0]
        if idx * 2 + 4 >= n:
            return None
        d = struct.unpack_from('<H', self.b, vt + 4 + idx * 2)[0]
        return table + d if d else None

    def pointer(self, table, idx):
        p = self.field(table, idx)
        return p + self.u32(p) if p is not None else None

    def string(self, table, idx):
        p = self.pointer(table, idx)
        if p is None:
            return None
        n = self.u32(p)
        assert p + 4 + n <= len(self.b)
        return self.b[p+4:p+4+n].decode('utf-8')

    def byte(self, table, idx):
        p = self.field(table, idx)
        return self.b[p] if p is not None else 0

    def vector(self, table, idx):
        p = self.pointer(table, idx)
        if p is None:
            return []
        n = self.u32(p)
        assert p + 4 + 4*n <= len(self.b)
        return [p + 4 + 4*i + self.u32(p + 4 + 4*i) for i in range(n)]

    def raw(self, table, idx):
        p = self.pointer(table, idx)
        assert p is not None
        n = self.u32(p)
        assert p + 4 + n <= len(self.b)
        return self.b[p+4:p+4+n]

    def vec3(self, table, idx):
        p = self.field(table, idx)
        return list(struct.unpack_from('<3f', self.b, p)) if p is not None else None


def decode_scene(path):
    fb = FB(path.read_bytes())
    entries = fb.vector(fb.root, 4)
    result = []
    for table in entries:
        kind = fb.string(table, 0)
        if kind not in ['trinity_SceneObject','trinity_ObjectTemplate']:
            continue
        alias=None
        if kind == 'trinity_ObjectTemplate':
            template=FB(fb.raw(table,1))
            assert template.string(template.root,4)=='trinity_SceneObject'
            alias=template.string(template.root,0)
            sf=FB(template.raw(template.root,5))
        else:
            sf = FB(fb.raw(table, 1))
        srt = sf.pointer(sf.root, 1)
        row = dict(name=alias or sf.string(sf.root, 0), apply_srt=sf.byte(sf.root, 3),
                   scale=sf.vec3(srt, 0), rotation=sf.vec3(srt, 1), translation=sf.vec3(srt, 2),
                   collisions=[])
        for sub in fb.vector(table, 2):
            sk = fb.string(sub, 0)
            if sk != 'trinity_CollisionComponent':
                continue
            cf = FB(fb.raw(sub, 1))
            assert cf.byte(cf.root, 0) == 1
            ct = cf.pointer(cf.root, 1)
            st = cf.pointer(ct, 1)
            kind = cf.byte(ct, 0)
            if kind == 4:
                shape = dict(type='Havok', path=cf.string(st, 0), transform=cf.vec3(st, 1),
                             rotation=cf.vec3(st, 2), scale=cf.vec3(st, 3))
            elif kind == 2:
                shape = dict(type='Box', transform=cf.vec3(st, 0), size=cf.vec3(st, 1), rotation=cf.vec3(st, 2))
            else:
                shape = dict(type='unsupported', kind=kind)
            row['collisions'].append(shape)
        result.append(row)
    subscenes=[]
    for p in fb.vector(fb.root,5):
        n=fb.u32(p)
        subscenes.append(fb.b[p+4:p+4+n].decode('utf-8'))
    return dict(root_entry_count=len(entries), subscenes=subscenes,decoded_scene_objects=result)


if __name__ == '__main__':
    p = Path(sys.argv[1])
    result = decode_scene(p)
    p.with_suffix('.analysis.json').write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps(dict(root_entry_count=result['root_entry_count'], object_count=len(result['decoded_scene_objects']),
                         sample=result['decoded_scene_objects'][:3]), indent=2))
