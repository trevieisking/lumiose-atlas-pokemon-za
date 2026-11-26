"""Retain every source ridge interval >3 px from the ordinary opaque stroke.

This is diagnostic only. It does not read native observations or change any
source mask, candidate contour, transform, or approximation parameter.
"""
from pathlib import Path
import hashlib,json,sys
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parent/'python-deps'))
import cv2,numpy as np
from PIL import Image,ImageDraw,ImageFont

def main():
    candidate_path=HERE/'original-ui-contour-candidates-first.json'
    candidates=json.loads(candidate_path.read_text())
    target=HERE/'ui-contour-review';target.mkdir(exist_ok=True)
    rows=[]
    for row in candidates['records']:
        n=row['zone'];raw=Image.open(HERE/'ui-zone-textures'/f'wild-zone-{n}-rgba.png').convert('RGBA')
        rgba=np.array(raw);stroke=((rgba[:,:,0]<=35)&(rgba[:,:,3]>=230)).astype(np.uint8)
        dist=cv2.distanceTransform(1-stroke,cv2.DIST_L2,cv2.DIST_MASK_PRECISE)
        ridge=np.array(Image.open(HERE/'ui-zone-textures'/f'wild-zone-{n}-derived-ridge.png'))
        cs,_=cv2.findContours(ridge,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
        assert len(cs)==1
        pts=cs[0].reshape(-1,2);d=dist[pts[:,1],pts[:,0]];bad=d>3
        segments=[]
        # Start at an accepted point so a circular interval cannot be split.
        offset=int(np.flatnonzero(~bad)[0]);pts=np.roll(pts,-offset,axis=0);d=np.roll(d,-offset);bad=np.roll(bad,-offset)
        starts=np.flatnonzero(bad&~np.roll(bad,1));ends=np.flatnonzero(bad&~np.roll(bad,-1))
        assert len(starts)==len(ends)
        for i,(lo,hi)in enumerate(zip(starts,ends),1):
            p=pts[lo:hi+1];v=d[lo:hi+1];box=[int(p[:,0].min()),int(p[:,1].min()),int(p[:,0].max()),int(p[:,1].max())]
            segments.append(dict(id=f'WZ{n:02}-S{i:02}',ridge_point_count=len(p),source_bbox=box,
                max_distance_source_px=float(v.max()),points=p.tolist(),distances_source_px=v.tolist(),classification='independent source visual review pending'))
        bg=Image.new('RGBA',raw.size,(210,210,210,255));bg.alpha_composite(raw);bg=bg.convert('RGB').resize((raw.width*2,raw.height*2))
        draw=ImageDraw.Draw(bg)
        for seg in segments:
            for x,y in seg['points']:draw.ellipse((x*2-2,y*2-2,x*2+2,y*2+2),fill=(0,90,255))
            x0,y0,x1,y1=seg['source_bbox'];draw.rectangle((x0*2-6,y0*2-6,x1*2+6,y1*2+6),outline=(245,0,140),width=2)
            draw.text((x0*2+8,y0*2-4),seg['id'],fill=(0,50,140))
        bg.save(target/f'private-wz{n:02}-source-difference-intervals.png')
        rows.append(dict(zone=n,total_ridge_points=len(pts),max_distance_source_px=float(d.max()),
            intervals_over3_source_px=segments,source_stroke_predicate='R<=35 and alpha>=230; original decoded ordinary BC5 material channels',
            threshold_scope='Diagnostic threshold only; no candidate is moved or discarded. Source gate interruption versus other discrepancy requires visual classification.'))
        print(n,len(segments),float(d.max()),flush=True)
    (target/'source-difference-intervals-first.json').write_text(json.dumps(dict(
        candidate_sha256=hashlib.sha256(candidate_path.read_bytes()).hexdigest(),records=rows),indent=2)+'\n')

if __name__=='__main__':main()
