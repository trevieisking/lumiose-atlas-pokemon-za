"""Rebuild research-only search cells from the unchanged spawner export."""
import csv
from hashlib import sha256
import json
from math import floor,dist
from pathlib import Path
import sys

root=Path(__file__).resolve().parents[3]
p=root/'docs/qa/candidates/source-area-footprints-2026-11-26'
a=json.loads((p/'calibration/independent-texture-native-review.json').read_text())
geometries=json.loads((p/'native-sector-footprint-candidates.json').read_text())['geometries']
grid_path=root/'atlas-cross-grid.json'
assert sha256(grid_path.read_bytes()).hexdigest()=='f4e851f22e52ca9aec6889221bda0ea762fbd185404a00b1a62952bae7dcb2e5'
grid=json.loads(grid_path.read_text())
assert grid['native_sha256']==a['native_sha256']
export=Path(sys.argv[1])
assert sha256(export.read_bytes()).hexdigest()=='1b11ad05caeb65d55c10bf9724db51477f5aa6b045a29c56e02a7f9cf041e61d'
rows={}
for row in csv.DictReader(export.open(),delimiter='\t'):
    if row['Item ID']!='2619':continue
    x,y,z=(float(row[k]) for k in 'XYZ')
    u,v=78-3.94*x,78-3.94*z
    xy=[m[0]*u+m[1]*v+m[2] for m in a['matrix'][:2]]
    rows[row['Spawner']]=([x,y,z],xy)
assert len(rows)==99

def inside(p,ring):
    x,y=p
    return sum((a[1]>y)!=(b[1]>y) and x < (b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]
               for a,b in zip(ring,ring[1:]+ring[:1]))%2==1

def cell(point):
    dx,dy=[v-o for v,o in zip(point,grid['origin_native_xy'])]
    ex,ey=grid['column_vector_native_xy'];sx,sy=grid['row_vector_native_xy']
    d=ex*sy-ey*sx
    c,r=floor((dx*sy-dy*sx)/d),floor((dy*ex-dx*ey)/d)
    return chr(65+c)+str(1+r) if 0<=c<grid['columns'] and 0<=r<grid['rows'] else None

def route(n,sp,phase,area,comparator,status):
    xyz,xy=rows[sp]
    ring=next(g['geometry']['coordinates'][0] for g in geometries if g['area_id']==area)
    assert inside(xy,ring)
    nearest=min((dist(xy,pt),o) for o,(_,pt) in rows.items() if o!=sp)
    in_scope=[o for o,(_,pt) in rows.items() if inside(pt,ring)]
    if comparator:
        ll,lxy=rows[comparator]
        comp=dict(id=comparator,projected_native_xy=lxy,world_height=ll[1],separation_native_px=dist(xy,lxy),search_cell=cell(lxy))
    else:comp=None
    return dict(atlas_number=n,spawner=sp,phase_argument=phase,area=area,hypothesis=status,
      world_xyz=xyz,projected_native_xy=xy,search_cell=cell(xy),in_area=in_scope,
      nearest_other=dict(id=nearest[1],distance_native_px=nearest[0]),paired_candidate=comp,exact_pin_approved=False)

out=[
 route(69,'itb_a0502_98',40000,'jaune-sector-10',None,'strong_roof_identity_candidate'),
 route(18,'itb_a0101_83',30000,'vert-sector-7','itb_a0101_105','scaffold_candidate_corroborated_by_reticle_area'),
 route(3,'itb_a0102_131',30100,'vert-sector-8','itb_a0101_106','provisional_scaffold_candidate'),
]
assert len(out[0]['in_area'])==1 and len(out[1]['in_area'])==2
print(json.dumps(out,indent=2))
