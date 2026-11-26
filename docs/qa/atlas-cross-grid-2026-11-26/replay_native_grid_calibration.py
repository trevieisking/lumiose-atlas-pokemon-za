#!/usr/bin/env python3
"""Replay Atlas native-grid calibration without changing any input.
Requires numpy. --redetect-native additionally requires OpenCV5.1.
Usage: python replay_native_grid_calibration.py --repo /path/to/atlas --redetect-native
"""
import argparse,hashlib,json
from pathlib import Path
import numpy as np

def project(matrix,xy):
 q=np.asarray(matrix,float)@np.r_[xy,1.0]
 return q[:2]/q[2]

def stats(values):
 a=np.asarray(values,float)
 return {'count':len(a),'rms':float(np.sqrt(np.mean(a*a))),'max':float(a.max())}

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,required=True);p.add_argument('--packet',type=Path,default=Path(__file__).with_name('native-grid-registration.json'));p.add_argument('--redetect-native',action='store_true');p.add_argument('--output',type=Path);args=p.parse_args()
 evidence=json.loads(args.packet.read_text());records=evidence['native_lattice']['observations'];fits=[x for x in records if x['role']=='fit'];A=np.asarray([x['index']+[1]for x in fits],float);B=np.asarray([x['xy']for x in fits],float);M=np.vstack([np.linalg.lstsq(A,B,rcond=None)[0].T,[0,0,1]])
 assert np.allclose(M,evidence['native_lattice']['grid_to_native_affine'],atol=1e-10,rtol=0),'Native fit changed'
 source_checks=[]
 for source in evidence['sources']:
  path=args.repo/source['repository_path'];actual=hashlib.sha256(path.read_bytes()).hexdigest();assert actual==source['sha256'],f'Unexpected source hash: {path}';source_checks.append({'path':source['repository_path'],'sha256':actual})
 report={'status':'pass','source_hashes_verified':source_checks,'matrix_replayed':M.tolist()}
 for role in ['fit','holdout']:
  report['native_'+role]=stats([np.linalg.norm(project(M,x['index'])-x['xy'])for x in records if x['role']==role])
 report['interior_holdout']=stats([np.linalg.norm(project(M,x['index'])-x['xy'])for x in evidence['native_interior_checks']['observations']])
 h=evidence['source26_native_architecture_fit']['H'];h25=evidence['source25_to_source26_architecture_fit']['H']
 report['source26_cross_holdout_inside_hull']=stats([np.linalg.norm(project(h,x['photo_xy'])-project(M,x['grid_index']))for x in evidence['cross_checks']['photo26_to_native_cross_checks']if x['inside_architecture_convex_hull']])
 report['source25_overlap_cross_holdout_inside_hull']=stats([np.linalg.norm(project(h25,x['photo25_xy'])-x['photo26_xy'])for x in evidence['cross_checks']['photo25_to_photo26_cross_checks']if x['inside_overlap_architecture_convex_hull']])
 assert report['native_holdout']['max']<2 and report['interior_holdout']['max']<2,'Native visible-cross alignment check failed'
 assert report['source26_cross_holdout_inside_hull']['max']<2,'Local photo alignment check failed'
 if args.redetect_native:
  import cv2
  cfg=evidence['native_lattice']['method_details'];path=args.repo/evidence['native_lattice']['source'];rgb=cv2.imread(str(path));gray=cv2.cvtColor(rgb,cv2.COLOR_BGR2GRAY).astype(np.float32);k=np.asarray([cfg['kernel']],np.float32);n=cfg['line_average_pixels'];v=cv2.boxFilter(cv2.filter2D(gray,-1,k),-1,(1,n));h=cv2.boxFilter(cv2.filter2D(gray,-1,k.T),-1,(n,1));response=np.minimum(v,h);detected=[];rad=cfg['seed_search_radius_px']
  for c in range(18):
   for r in range(18):
    sx=round(cfg['seed_native_origin_xy'][0]+cfg['seed_spacing_xy'][0]*c);sy=round(cfg['seed_native_origin_xy'][1]+cfg['seed_spacing_xy'][1]*r)
    if np.hypot(sx-955,sy-960)<962:continue
    patch=response[sy-rad:sy+rad+1,sx-rad:sx+rad+1];iy,ix=np.unravel_index(patch.argmax(),patch.shape)
    if patch[iy,ix]<cfg['minimum_line_contrast']:continue
    detected.append({'index':[c,r],'xy':[sx-rad+int(ix),sy-rad+int(iy)]})
  expected=[{'index':x['index'],'xy':x['xy']}for x in records];assert detected==expected,'Native image detector no longer reproduces frozen crossings';report['native_image_redetection']={'status':'pass','count':len(detected),'opencv':cv2.__version__}
 text=json.dumps(report,indent=2)+'\n'
 if args.output:args.output.write_text(text)
 print(text)
if __name__=='__main__':main()
