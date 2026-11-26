"""Verify the complete 48 source joins and perimeters from pinned public bytes.

Requires Shapely 2.2.0. Recovered bytes and full XYZ faces remain outside Atlas;
the retained face hashes permit exact replay without shipping those payloads.
"""
from pathlib import Path
import argparse, hashlib, json, struct
from inspect_scene import FB, decode_scene
from decode_sector_meshes import decode

HERE = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--public-assets', type=Path, required=True)
args = parser.parse_args()
assets = args.public_assets
read = lambda n: json.loads((HERE/n).read_text())
provenance = read('source-provenance.json')
source_rows = read('public-sector-assets-receipt.json')['assets']
for row in provenance['shared_assets'] + source_rows:
    if row['local_file'] == 'map_field_00.arc':
        continue
    data = (assets/row['local_file']).read_bytes()
    assert len(data) == row['bytes'] and hashlib.sha256(data).hexdigest() == row['sha256']
    assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest() == row['git_blob_sha']
scenes = {s['name']: s for s in decode_scene(assets/'t1_field_area_0.trscn')['decoded_scene_objects']}
fb = FB((assets/'field_sub_area_array.bin').read_bytes())
joins = {}
for t in fb.vector(fb.root, 0):
    ai = fb.pointer(t, 0)
    joins[fb.string(ai, 0)] = (fb.string(ai, 25), fb.byte(t, 1))
tbl = (assets/'place_name.tbl').read_bytes()
assert tbl[:4] == b'AHTB'
labels = []
pos = 8
for index in range(struct.unpack_from('<I', tbl, 4)[0]):
    hash64, size = struct.unpack_from('<QH', tbl, pos)
    pos += 10
    label = tbl[pos:pos+size].rstrip(b'\0').decode('utf-8')
    labels.append((label, f'{hash64:016X}'))
    pos += size
assert pos == len(tbl)
dat = (assets/'place_name.dat').read_bytes()
sections, count, _, initial, section_offset = struct.unpack_from('<HHIII', dat)
assert sections == 1 and initial == 0

def english(index):
    assert 0 <= index < count
    offset, units, _ = struct.unpack_from('<IHH', dat, section_offset+4+8*index)
    key = (0x7C89 + 0x2983*index) & 0xffff
    result = []
    for unit in struct.unpack_from('<'+str(units)+'H', dat, section_offset+offset):
        result.append(unit ^ key)
        key = ((key << 3) | (key >> 13)) & 0xffff
    assert result[-1] == 0
    return struct.pack('<'+str(len(result))+'H', *result).decode('utf-16-le').rstrip('\0')

names = {x['name']: x for x in read('sector-name-crosswalk.json')['sectors']}
expected = {x['area_name']: x for x in read('derived-sector-footprints.json')['records']}
for row in source_rows:
    name = row['area_name']
    key, layer = joins[name]
    target = expected[name]
    nm = names[key]
    assert layer == 2 and labels[nm['index']] == (key, nm['hash'])
    assert english(nm['index']) == row['label'] == target['label']
    scene = scenes[name]
    assert scene == row['scene']
    found = decode(assets/row['local_file'], scene)
    assert found['geometry'] == target['geometry'] or json.loads(json.dumps(found['geometry'])) == target['geometry']
    assert found['world_y_range'] == target['world_y_range']
    assert found['mesh_vs_tree_max_axis_delta'] == 0
    face_hash = hashlib.sha256(json.dumps(found['faces_xyz'], separators=(',', ':')).encode()).hexdigest()
    assert face_hash == target['full_source_faces_xyz_sha256']
assert len(source_rows) == len(expected) == 48
print(json.dumps(dict(status='PASS', sectors=48, raw_asset_hashes=True, original_name_and_layer_joins=True,
    exact_XZ_perimeters=True, full_XYZ_face_hashes=True, tree_bounds_max_delta=0)))
