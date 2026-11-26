"""Research replay only; never writes player-facing data.
Usage from repo root: python3 path/to/replay.py EXTERIOR.tsv INTERIOR.tsv SWIFT_MAP.jpg OUTPUT_DIR
Needs numpy, scipy and Pillow. The supplied Swift guide still is not redistributed.
"""
import csv, hashlib, json, math, sys
from pathlib import Path
from io import StringIO
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, map_coordinates

ext,int_,shot,out=map(Path,sys.argv[1:])
out.mkdir(parents=True,exist_ok=True)
cal=Path("docs/qa/candidates/source-area-footprints-2026-11-26/calibration/independent-texture-native-review.json")
maps=Path("maps/lumiose-game-map.jpg")
photo=Path("assets/atlas/wild-zones/wild-zone-02-closeup.png")
reg=Path("docs/qa/at339-geometry/wild_zone_registration_candidates.json")
fingerprints={
 ext:"1b11ad05caeb65d55c10bf9724db51477f5aa6b045a29c56e02a7f9cf041e61d",
 int_:"77d4c540d22d590da4cd3ba910d1aa13789069a73f716adc9aabb73136b3dad2",
 shot:"fde7efa72dfdb853e53ba3f5fa7e3d7e368c93bb2b042f1c5a5e28b75e6cdff2",
 maps:"4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade",
 photo:"22cb8f4cf662e1504adaf7ba2706cf8a3e96e7728074f2b3c9f66bbafc79b48b",
}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for p,h in fingerprints.items():assert sha(p)==h,(p,sha(p))
def read(p):return json.loads(p.read_text())
def rows(p):
    return [{"spawner":r["Spawner"],"item_id":int(r["Item ID"]),"xyz":[float(r[k]) for k in ("X","Y","Z")]}
            for r in csv.DictReader(StringIO(p.read_text()),delimiter="\t")]
def apply(m,v):
    a=np.asarray(m)@[*v,1.]
    return a[:2]/a[2]
def point(v):return [round(float(z),4) for z in v]
def inside(xy,poly):
    x,y=xy; yes=False
    for (a,b),(c,d) in zip(poly,poly[1:]+poly[:1]):
        if (b>y)!=(d>y) and x<(c-a)*(y-b)/(d-b)+a:yes=not yes
    return yes
def filtered(a,s):
    a=np.asarray(Image.open(a).convert("L"),dtype=float)
    return gaussian_filter(a,s)-gaussian_filter(a,s*3)
exterior=rows(ext); interiors=rows(int_)
assert len(exterior)==len(set(r["spawner"] for r in exterior))==1153
assert sum(r["item_id"]==2619 for r in exterior)==99
interior_screws=[r for r in interiors if r["item_id"]==2619]
assert len(interior_screws)==1
poly=next(g["geometry"]["coordinates"][0] for g in read(Path("atlas-area-evidence.json"))["geometries"] if g["area_id"]=="wz-02")
m=read(cal)["matrix"]
old=next(r for r in read(reg)["frames"] if r["zone"]==2 and r["view"]=="closeup")
inv=np.linalg.inv(old["matrix"])
candidates=[]
for r in exterior:
    x,_,z=r["xyz"]
    pixel=apply(m,(78-3.94*x,78-3.94*z))
    if inside(pixel,poly):
        candidates.append({**r,"native_xy":point(pixel),"owner_closeup_candidate_xy":point(apply(inv,pixel))})
assert len(candidates)==8
archive=[1242.432,1340.16]
ids={
 "itb_a0103_01":("W","West Great Ball"),
 "itb_a0103_14":("E","East Great Ball"),
 "itb_a0103_02":("S","Swift TM027"),
}
for r in candidates:
    if r["spawner"] in ids: r["label"]=ids[r["spawner"]][1]
    if r["item_id"]==3:r["archive_2_5_separation_px"]=round(math.dist(archive,r["native_xy"]),4)
A=filtered(shot,1.6); B=filtered(maps,.8)
patches=[(187,291,"west angular building tip","fit"),(46,356,"west fountain left corner","holdout"),(180,337,"west fountain bevel","fit"),(700,190,"east pool upper edge","fit"),(696,228,"east pool lower edge","holdout"),(684,300,"east stairs","fit"),(733,282,"east building corner","fit"),(637,472,"southeast streets junction","screen"),(534,490,"south canal bevel","fit"),(229,415,"southwest building bend","fit"),(300,491,"southwest road spur","holdout"),(742,157,"northeast building angle","fit")]
yy,xx=np.mgrid[-12:13,-12:13]
def match(x,y):
    p=map_coordinates(A,[y+yy/.47,x+xx/.47],order=1)
    p-=p.mean();p/=np.linalg.norm(p)
    u=round(977+.4685*x);v=round(1159+.4685*y)
    scores=[]
    for du in range(-13,14):
        for dv in range(-13,14):
            q=B[v+dv-12:v+dv+13,u+du-12:u+du+13].copy()
            q-=q.mean()
            scores.append((float(np.sum(p*q)/np.linalg.norm(q)),u+du,v+dv))
    return max(scores)
obs=[]
for x,y,name,role in patches:
    corr,u,v=match(x,y)
    obs.append({"landmark":name,"role":role,"still_xy":[x,y],"native_xy":[u,v],"correlation":round(corr,5)})
fit=[r for r in obs if r["role"]=="fit"]
assert all(r["correlation"]>=.85 for r in fit)
aff=np.linalg.lstsq(np.array([r["still_xy"]+[1.] for r in fit]),np.array([r["native_xy"] for r in fit]),rcond=None)[0].T
for r in obs:r["residual_native_px"]=round(math.dist(aff@[*r["still_xy"],1.],r["native_xy"]),4)
swift=next(r for r in candidates if r["spawner"]=="itb_a0103_02")
ring=[512,287]
player_triangle_approx=[498,283]
assert max(r["residual_native_px"] for r in obs if r["role"]=="holdout") < 2
result={
 "scope":"Source and local projection pilot only. No exact collectible pins, progress changes, runtime data changes or scene joins.",
 "exterior":{"sha256":sha(ext),"unique_spawners":len(exterior),"colorful_screw_spawners":99},
 "interior_t1_i011":{"sha256":sha(int_),"scene_local_only":True,"colorful_screw_spawners":interior_screws},
 "native_sha256":sha(maps),"coordinate_formula":"u=78-3.94X; v=78-3.94Z; texture-to-native affine",
 "affine":m,"zone_polygon_source":"atlas-area-evidence.json:geometries[wz-02]","wz02_candidates":candidates,
 "archive_2_5_native_xy":archive,
 "owner_closeup":{"sha256":sha(photo),"unapproved_candidate_register":str(reg),"role":"illustrative overlay only","candidate_holdout_within_3px":old["holdout_within_3px"],"candidate_holdout_total":old["holdout_candidates"]},
 "swift_still":{"sha256":sha(shot),"still_source":"https://raiderking.com/wp-content/uploads/2025/10/Pokemon-Legends-Z-A-All-TMs-Locations-Exploration-3-1024x576.jpg",
    "affine_still_to_native":aff.tolist(),"patch_matches":obs,"map_reticle_still_xy":ring,
    "reticle_to_candidate_native_px":round(math.dist(aff@[*ring,1.],swift["native_xy"]),4),
    "player_triangle_approx_still_xy":player_triangle_approx,
    "player_triangle_to_candidate_native_px":round(math.dist(aff@[*player_triangle_approx,1.],swift["native_xy"]),4),
    "limit":"Map ring is UI focus; triangle is player icon, not the pickup. The still corroborates neighborhood, not exact item placement."}
}
(out/"pilot.json").write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n")
base=Image.open(photo).convert("RGB");d=ImageDraw.Draw(base)
colors={"W":"#ffb947","E":"#fc7c83","S":"#d1e84c","A":"#ffffff"}
def mark(x,y,k):
    d.ellipse((x-14,y-14,x+14,y+14),outline="#091018",width=7)
    d.ellipse((x-12,y-12,x+12,y+12),outline=colors[k],width=3)
    d.text((x+15,y-20),k,fill=colors[k],stroke_width=3,stroke_fill="#091018",font_size=23)
for r in candidates:
    if r["spawner"] in ids:mark(*r["owner_closeup_candidate_xy"],ids[r["spawner"]][0])
mark(*apply(inv,archive),"A")
d.rectangle((0,0,base.width,39),fill="#091018")
d.text((13,7),"ATLAS QA ONLY | W: West Great Ball  E: East Great Ball  S: Swift  A: archived 2-5",fill="white",font_size=21)
base.save(out/"owner-closeup-pilot.jpg",quality=90)
print(json.dumps(result["swift_still"],indent=2))
