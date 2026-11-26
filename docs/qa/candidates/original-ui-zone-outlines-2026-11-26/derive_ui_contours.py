"""Derive fixed source UI perimeter candidates, before native validation.

The explicitly joined P_zone_04 glow texture has a continuous perimeter ridge,
without the decorative gate bars/arrows in the ordinary sprite. Threshold its
half-intensity ridge band at128, thin without moving the layer, and simplify the
pixel-centre path by at most0.75 source pixels. No native observation is read.
"""
from pathlib import Path
import hashlib,json,sys
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'python-deps'))
import cv2,numpy as np
from PIL import Image
from shapely.geometry import Polygon,mapping

HERE=Path(__file__).resolve().parent

def thin(mask):
    # Two-pass connectivity-preserving Zhang-Suen thinning of a binary band.
    a=np.pad(mask.astype(np.uint8),1)
    iterations=0
    while True:
        changed=0
        for phase in (0,1):
            p2=a[:-2,1:-1];p3=a[:-2,2:];p4=a[1:-1,2:];p5=a[2:,2:]
            p6=a[2:,1:-1];p7=a[2:,:-2];p8=a[1:-1,:-2];p9=a[:-2,:-2]
            p=[p2,p3,p4,p5,p6,p7,p8,p9,p2]
            count=sum(p[:-1]);turns=sum(((p[i]==0)&(p[i+1]==1)).astype(np.uint8)for i in range(8))
            remove=(a[1:-1,1:-1]==1)&(count>=2)&(count<=6)&(turns==1)
            if phase==0:remove&=(p2*p4*p6==0)&(p4*p6*p8==0)
            else:remove&=(p2*p4*p8==0)&(p2*p6*p8==0)
            changed+=int(remove.sum());a[1:-1,1:-1][remove]=0
        iterations+=1
        if not changed:return a[1:-1,1:-1],iterations
        assert iterations<100

def main():
    source=json.loads((HERE/'original-ui-zone-placement.json').read_text())
    affine=np.array(json.loads((HERE/'texture-native-registration.json').read_text())['texture_to_native_affine'])
    out=[]
    for row in source['records']:
        n=row['source_numeric_id'];path=HERE/'ui-zone-textures'/f'wild-zone-{n}-glow-alpha.png'
        image=np.array(Image.open(path));assert hashlib.sha256(image.tobytes()).hexdigest()==row['glow_texture']['decoded_alpha_sha256']
        mask=(image>=128).astype(np.uint8)
        count,labels,stats,_=cv2.connectedComponentsWithStats(mask,connectivity=8)
        assert count==2,(n,count,stats[:,4].tolist())
        ridge,iterations=thin(mask)
        contours,_=cv2.findContours(ridge,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
        assert len(contours)==1,(n,len(contours))
        points=cv2.approxPolyDP(contours[0],.75,True).reshape(-1,2).astype(float)
        points=np.vstack([points,points[0]])
        poly=Polygon(points);assert poly.is_valid and poly.area>0,(n,poly)
        place=row['fixed_texture_to_original_map']
        texture=points*np.array(place['scale'])+np.array(place['offset'])+np.array(place['pixel_center_correction'])
        native=(np.c_[texture,np.ones(len(texture))]@affine.T)[:,:2]
        native_poly=Polygon(native);assert native_poly.is_valid
        raw=np.array(Image.open(HERE/'ui-zone-textures'/f'wild-zone-{n}-rgba.png'))
        opaque_black=((raw[:,:,0]<=35)&(raw[:,:,3]>=230)).astype(np.uint8)
        distances=cv2.distanceTransform(1-opaque_black,cv2.DIST_L2,cv2.DIST_MASK_PRECISE)
        sample=contours[0].reshape(-1,2);dd=distances[sample[:,1],sample[:,0]]
        out.append(dict(zone=n,area_id=f'wz-{n:02}',label=row['label'],name_key=row['name_key'],
            pane_name=row['pane_name'],ordinary_texture=row['texture']['name'],glow_texture=row['glow_texture']['name'],
            texture_geometry=mapping(poly),original_map_geometry=dict(type='Polygon',coordinates=[texture.tolist()]),
            native_geometry=mapping(native_poly),
            source_processing=dict(ridge_threshold=128,thinning='two-pass Zhang-Suen; preserves8-neighbour band connectivity',
                iterations=iterations,pre_simplification_points=len(contours[0]),simplification_max_source_px=.75,
                pixel_convention='integer pixel centres; source UI placement adds (scale-1)/2',
                unoccluded_ordinary_stroke_diagnostic=dict(median_distance_source_px=float(np.median(dd)),
                    p90_distance_source_px=float(np.percentile(dd,90)),max_distance_source_px=float(dd.max()),
                    note='Decorative gates interrupt ordinary strokes, while the original glow layer remains continuous. All differences retained.'))))
        Image.fromarray(ridge*255).save(HERE/'ui-zone-textures'/f'wild-zone-{n}-derived-ridge.png')
        print(n,len(points),iterations,float(np.median(dd)),float(dd.max()),flush=True)
    packet=dict(status='fixed source UI perimeter candidates; independent native validation and review pending',
        ui_placement_sha256=hashlib.sha256((HERE/'original-ui-zone-placement.json').read_bytes()).hexdigest(),
        raster_registration_sha256=hashlib.sha256((HERE/'texture-native-registration.json').read_bytes()).hexdigest(),
        no_native_validation_points_used=True,records=out)
    (HERE/'original-ui-contour-candidates-first.json').write_text(json.dumps(packet,indent=2)+'\n')

if __name__=='__main__':main()
