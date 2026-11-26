"""Research-only WZ5 visible overlay trace. No world/map runtime edits."""
from PIL import Image,ImageDraw
from scipy import ndimage as ndi
from scipy.spatial import cKDTree
import contourpy as contour
from pathlib import Path
import json,sys,numpy as np
base_path,source_manifest,outdir=map(Path,sys.argv[1:4])
B=Image.open(base_path).convert('RGB')
outdir.mkdir(parents=True,exist_ok=True)
S=source_manifest.parent
atlas_box=(600,990,980,1310)
w=380;h=320
shift=np.array(atlas_box[:2])
zone_exclusion=np.array([586,965,992,1329])
fitted=[]
def contour_of(img):
 rgb=np.asarray(img,dtype=float);g=rgb[:,:,1];r=rgb[:,:,0];b=rgb[:,:,2]
 mask=(g-r>21)&(g-b>12)
 st=ndi.generate_binary_structure(2,1)
 mask=ndi.binary_opening(ndi.binary_closing(mask,st,iterations=2),st,iterations=1)
 labels,_=ndi.label(mask)
 counts=np.bincount(labels.ravel());counts[0]=0
 lab=np.argmax(counts)
 item=ndi.binary_fill_holes(labels==lab)
 path=max(contour.contour_generator(z=item.astype(float)).lines(.5),key=len)+shift
 if len(path)<300 or np.linalg.norm(path[0]-path[-1])>1:raise ValueError("Incomplete outline")
 return path
def sample(path):
 dist=np.r_[0,np.cumsum(np.linalg.norm(np.diff(path,axis=0),axis=1))]
 t=np.arange(0,dist[-1],1.0)
 return np.column_stack([np.interp(t,dist,path[:,i]) for i in (0,1)])
def dist(a,b):
 a,b=sample(a),sample(b)
 zz=np.r_[cKDTree(a).query(b)[0],cKDTree(b).query(a)[0]]
 return dict(rms_px=round(float(np.sqrt(np.mean(zz**2))),3),p95_px=round(float(np.percentile(zz,95)),3),max_px=round(float(np.max(zz)),3))
def rdp(p,tol):
 if len(p)<=2:return p
 ab=p[-1]-p[0]
 t=np.clip((p-p[0])@ab/max(1e-10,ab@ab),0,1)
 d=np.linalg.norm(p-(p[0]+t[:,None]*ab),axis=1);i=np.argmax(d)
 if d[i]<=tol:return p[[0,-1]]
 return np.vstack([rdp(p[:i+1],tol)[:-1],rdp(p[i:],tol)])
base=contour_of(B.crop(atlas_box))
rows=[r['candidate_registration'] for r in json.loads(source_manifest.read_text())['records']]
panels=[('Current basemap', B.crop(atlas_box),base)]
for k in (2,3,6,7):
 row=rows[k-1]
 def spatial_out(p):
  x,y=p['base_xy']; return not (zone_exclusion[0]<=x<=zone_exclusion[2] and zone_exclusion[1]<=y<=zone_exclusion[3])
 tr=[p for p in row['fit_points'] if spatial_out(p)]
 ho=[p for p in row['held_out_points'] if spatial_out(p)]
 def design(points):return np.c_[np.array([p['source_xy'] for p in points]),np.ones(len(points))]
 def target(points):return np.array([p['base_xy'] for p in points])
 A=design(tr)
 if len(tr)<4 or len(ho)<4 or np.linalg.matrix_rank(A)!=3:raise ValueError('Insufficient controls')
 mat=np.vstack([np.linalg.lstsq(A,target(tr),rcond=None)[0].T,[0,0,1]])
 residual=np.linalg.norm(design(ho)@mat[:2].T-target(ho),axis=1)
 T=np.linalg.inv(mat)@np.array([[1,0,atlas_box[0]],[0,1,atlas_box[1]],[0,0,1]])
 warped=Image.open(S/row['file']).convert('RGB').transform((w,h),Image.Transform.PERSPECTIVE,tuple(T.ravel()[:8]),Image.Resampling.BICUBIC)
 extracted=contour_of(warped)
 fitted.append(dict(file=row['file'],fit_points=len(tr),holdout_points=len(ho),holdout_rms_px=round(float(np.sqrt(np.mean(residual**2))),3),holdout_max_px=round(float(max(residual)),3),outline_vs_basemap=dist(base,extracted),affine=mat.round(9).tolist(),extent=[extracted.min(0).tolist(),extracted.max(0).tolist()]))
 panels.append((row['file'],warped,extracted))
polygon=rdp(base,1.6)
result={'basis':'Visible green game-map outline; not spatial collision or true encounter geometry.', 'crop_native':atlas_box,'excluded_registration_control_window':zone_exclusion.tolist(),'candidate_reference_outline':polygon.tolist(),'sources':fitted}
(outdir/'wz5-evidence.json').write_text(json.dumps(result,indent=2)+'\n')
out=Image.new('RGB',(3*w,2*h),'#182231')
for i,(label,img,path) in enumerate(panels):
 d=ImageDraw.Draw(img)
 d.line([tuple(x-shift) for x in polygon],fill='#f53c75',width=2)
 if i:d.line([tuple(x-shift) for x in path],fill='#50deff',width=1)
 d.text((8,8),label,fill='white',stroke_width=2,stroke_fill='black')
 out.paste(img,((i%3)*w,(i//3)*h))
out.save(outdir/'wz5-traces.jpg',quality=94)

