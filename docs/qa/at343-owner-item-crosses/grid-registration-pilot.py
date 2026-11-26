#!/usr/bin/env python3
"""Bounded read-only Vert map/grid replay. Requires OpenCV and NumPy.
Only --output is written. All measurements are original photograph pixels.
"""
import argparse, datetime, hashlib, json
from pathlib import Path
import cv2
import numpy as np

def pairs(images,masks,scale,ratio,nfeatures):
    sift=cv2.SIFT_create(nfeatures=nfeatures); ff=[]
    for im,mask in zip(images,masks):
        ff.append(sift.detectAndCompute(cv2.resize(im,None,fx=scale,fy=scale),cv2.resize(mask,None,fx=scale,fy=scale,interpolation=cv2.INTER_NEAREST)))
    good=[x for x,y in cv2.BFMatcher().knnMatch(ff[0][1],ff[1][1],k=2) if x.distance<ratio*y.distance]
    return [np.float64([ff[i][0][getattr(m,'queryIdx' if i==0 else 'trainIdx')].pt for m in good])/scale for i in range(2)]

def metrics(e):
    return dict(rms=float(np.sqrt(np.mean(e**2))),median=float(np.median(e)),p95=float(np.percentile(e,95)),max=float(e.max()))

def responses(images):
    k=np.zeros((1,17),np.float32);k[0,:4]=1/8;k[0,-4:]=1/8;k[0,7:10]=-1/3; out=[]
    for im in images:
        im=im.astype(np.float32)
        v=cv2.boxFilter(cv2.filter2D(im,-1,k),-1,(1,47));h=cv2.boxFilter(cv2.filter2D(im,-1,k.T),-1,(47,1))
        out.append(np.minimum(v,h))
    return out

def refine(response,seed):
    x,y=seed;patch=response[y-25:y+26,x-25:x+26];iy,ix=np.unravel_index(patch.argmax(),patch.shape)
    return [int(x-25+ix),int(y-25+iy)],float(patch[iy,ix])

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source-dir',type=Path,default=Path(__file__).resolve().parent/'sources')
    ap.add_argument('--source-a',default='20261126_141528.jpg');ap.add_argument('--source-b',default='20261126_141757.jpg')
    ap.add_argument('--output',type=Path,default=Path('grid_registration_pilot_replay.json'))
    args=ap.parse_args();cv2.setRNGSeed(343)
    paths=[args.source_dir/args.source_a,args.source_dir/args.source_b]
    images=[cv2.imread(str(p),0)for p in paths]
    assert all(im is not None for im in images),'Both original photographs required'
    assert [im.shape for im in images]==[(2148,4000),(2218,4000)],'Masks apply only to these original4000px photos'
    masks=[np.zeros(im.shape,np.uint8)for im in images]
    rectangles=[[100,1480,3950,2140],[100,0,3900,670]]
    excluded=[[[440,1660,820,1760],[1040,1790,1410,1900],[1710,1480,2420,1690],[2600,1960,4000,2150]],[[270,100,710,260],[910,280,1320,410],[1620,0,2300,175],[1800,460,2110,780]]]
    grid_exclusions=[dict(xs=[430,942,1461,1962,2460,2956,3460,3980],ys=[1370,1872]),dict(xs=[328,842,1356,1875,2405,2938,3480,3990],ys=[375,895])]
    for mask,(x0,y0,x1,y1),rects,grid in zip(masks,rectangles,excluded,grid_exclusions):
        cv2.rectangle(mask,(x0,y0),(x1,y1),255,-1)
        for x0,y0,x1,y1 in rects:cv2.rectangle(mask,(x0,y0),(x1,y1),0,-1)
        for x in grid['xs']:
            for y in grid['ys']:cv2.circle(mask,(x,y),85,0,-1)
    all_a,all_b=pairs(images,masks,.5,.68,10000)
    # First exploratory fit retained South Boulevard label letters. The entire
    # right strip is excluded from the authoritative architecture fit below.
    strict=(all_a[:,0]<3300)&(all_b[:,0]<3400);a=all_a[strict];b=all_b[strict]
    H,sel=cv2.findHomography(a,b,cv2.RANSAC,4.0,maxIters=10000,confidence=.999)
    assert H is not None;sel=sel[:,0].astype(bool)
    mapped=cv2.perspectiveTransform(a.reshape(-1,1,2),H).reshape(-1,2);err=np.linalg.norm(mapped-b,axis=1)
    hull=cv2.convexHull(a[sel].astype(np.float32))
    seeds=[dict(name='Vert5 roof cross',source=[1463,1871],target=[1357,375]),dict(name='east canal cross',source=[1959,1870],target=[1875,376]),dict(name='eastern street cross',source=[2956,1868],target=[2938,368]),dict(name='South Boulevard edge cross',source=[3455,1865],target=[3480,359])]
    rr=responses(images);holdouts=[]
    for row in seeds:
        p,sp=refine(rr[0],row['source']);q,sq=refine(rr[1],row['target']);pred=H@np.r_[p,1.0];pred=pred[:2]/pred[2]
        distance=float(cv2.pointPolygonTest(hull,tuple(map(float,p)),True))
        holdouts.append(dict(**row,source_refined=p,target_refined=q,source_line_score=sp,target_line_score=sq,target_from_architecture=pred.tolist(),residual_photo_px=float(np.linalg.norm(pred-q)),inside_architecture_inlier_convex_hull=distance>=0,signed_distance_to_source_inlier_hull_photo_px=distance))
    hm=[np.zeros(im.shape,np.uint8)for im in images];hud_rectangles=[[2650,1970,3999,2135],[2500,2070,3999,2217]]
    for mask,(x0,y0,x1,y1)in zip(hm,hud_rectangles):cv2.rectangle(mask,(x0,y0),(x1,y1),255,-1)
    ha,hb=pairs(images,hm,1,.65,5000)
    M,hs=cv2.estimateAffinePartial2D(ha,hb,method=cv2.RANSAC,ransacReprojThreshold=3,maxIters=10000,confidence=.999)
    assert M is not None;hs=hs[:,0].astype(bool);he=np.linalg.norm(ha@M[:,:2].T+M[:,2]-hb,axis=1)
    viewport=[]
    for seed,source in [([2915,1940],holdouts[2]['source_refined']),([3445,1948],holdouts[3]['source_refined'])]:
        q,score=refine(rr[1],seed);pred=M[:,:2]@source+M[:,2]
        viewport.append(dict(source_cross=source,nearest_observed_target_grid_seed=seed,target_grid_cross_refined=q,target_line_score=score,target_if_fixed_to_HUD=pred.tolist(),separation_photo_px=float(np.linalg.norm(pred-q))))
    result=dict(id='AT343-BOUNDED-VERT-CROSS-GRID-PILOT',created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        software=dict(opencv=cv2.__version__,numpy=np.__version__,rng_seed=343),
        sources=[dict(filename=p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),size=[im.shape[1],im.shape[0]])for p,im in zip(paths,images)],
        method='Fit shared architecture excluding cross neighborhoods,cursor,HUD and mapped labels; discard entire South Boulevard label strip; evaluate cross centers only after fitting.',
        parameters=dict(architecture_rectangles=rectangles,excluded_rectangles=excluded,grid_exclusions=grid_exclusions,cross_exclusion_radius=85,strict_feature_filter='source_x<3300 and target_x<3400',sift_feature_limit=10000,sift_scale=.5,match_ratio=.68,ransac_threshold_photo_px=4.0,ransac_max_iterations=10000,ransac_confidence=.999,cross_refinement='Within25px of manual seed,maximise minimum of perpendicular dark47px line responses;17px contrast kernel with4px positive wings and3px negative center.'),
        architecture_fit=dict(exploratory_matches_before_strip_exclusion=len(all_a),strict_candidate_feature_matches=len(a),inlier_feature_matches=int(sel.sum()),unique_source_inlier_locations_rounded_2dp=len(np.unique(np.round(a[sel],2),axis=0)),count_qualification='Feature correspondences,not unique named landmarks;multiple SIFT orientations can share a location.',inlier_error_photo_px=metrics(err[sel]),matrix_source_to_target=H.tolist(),source_inlier_convex_hull_photo_px=hull[:,0,:].tolist(),source_inlier_extent_photo_px=[a[sel].min(axis=0).tolist(),a[sel].max(axis=0).tolist()]),
        cross_holdouts=holdouts,
        independent_viewport_reference=dict(method='Similarity fit of unchanged PlacePin/CurrentLocation/Close HUD;not used to fit map or crosses.',rectangles=hud_rectangles,sift_feature_limit=5000,sift_scale=1,match_ratio=.65,ransac_threshold_photo_px=3,candidate_feature_matches=len(ha),inlier_feature_matches=int(hs.sum()),inlier_error_photo_px=metrics(he[hs]),matrix=M.tolist(),source_inlier_extent=[ha[hs].min(axis=0).tolist(),ha[hs].max(axis=0).tolist()],grid_comparison=viewport,qualification='Local fixed-HUD similarity model,not full-screen camera calibration;supporting check only.'),
        finding='This bounded overlap supports a map-relative reference lattice,usable as a secondary alignment check after unique architecture establishes correspondence.',
        limits=['Only this single Vert pair tested;no citywide/all-zoom certification.','Only crosses inside actual architecture-inlier convex hull are local holdout evidence;outside crosses are extrapolated diagnostics.','Photograph perspective/lens/display distortions can limit one homography,as distant residuals show.','An unnumbered repeating lattice has whole-cell ambiguity and supplies no physical/game unit or unique world origin.','Errors are photograph pixels,not certified Atlas or ground accuracy.','No Atlas-native transform,new item/structure coordinate,production change or promotion.'],
        architecture_feature_matches=[dict(source=p.tolist(),target=q.tolist(),inlier=bool(k),error_photo_px=float(e))for p,q,k,e in zip(a,b,sel,err)],
        hud_feature_matches=[dict(source=p.tolist(),target=q.tolist(),inlier=bool(k),error_photo_px=float(e))for p,q,k,e in zip(ha,hb,hs,he)])
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(dict(output=str(args.output),architecture_fit=result['architecture_fit'],cross_holdouts=holdouts,viewport_grid_comparison=viewport),indent=2))
if __name__=='__main__':main()
