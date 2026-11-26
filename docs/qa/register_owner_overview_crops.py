"""Research-only alignment of the eight owner overview JPEGs to the stable basemap.

Usage: python register_owner_overview_crops.py BASEMAP SOURCE_DIRECTORY
Requires Pillow, NumPy and SciPy. Prints calibration candidates, not geometry.
"""
from PIL import Image
from scipy.ndimage import gaussian_filter
from scipy.signal import fftconvolve,correlate
import numpy as np
from pathlib import Path
import json,sys
B=Image.open(sys.argv[1]).convert('RGB')
inputs=Path(sys.argv[2])
def grad(im,scale=1):
 a=np.array(im.convert('L'),dtype=float)
 return gaussian_filter(a,.54*scale)-gaussian_filter(a,2.2*scale)
b=grad(B)
bc=grad(B.resize((384,384),Image.Resampling.BICUBIC))
def coarse(S,scale):
 m=S.resize((round(S.width*scale/5),round(S.height*scale/5)),Image.Resampling.BICUBIC)
 rgb=np.array(m,dtype=float)
 a=grad(m)
 # suppress water, outside border and UI bands for the translation estimate
 mask=(np.mean(rgb,axis=2)>115)&((rgb[:,:,0]-rgb[:,:,2])>0)
 mask[:round(27*scale/5),:]=0
 mask[-round(80*scale/5):,:]=0
 mask[:round(255*scale/5),:round(695*scale/5)]=0
 a=np.clip(a,-11,11)*mask
 cc=fftconvolve(np.clip(bc,-11,11),a[::-1,::-1],mode='full') / np.sqrt((a*a).sum())
 y,x=np.unravel_index(cc.argmax(),cc.shape)
 return cc[y,x],(x-a.shape[1]+1)*5,(y-a.shape[0]+1)*5
def search(S,sc,tx,ty):
 W=round(S.width*sc); V=round(S.height*sc)
 a=grad(S.resize((W,V),Image.Resampling.BICUBIC))
 h=27; rad=18; total=h+rad
 results=[]
 for j,v in enumerate(range(145,S.height-100,112)):
  for i,u in enumerate(range(90,S.width-80,132)):
   if (u<690 and v<320): continue # no launch HUD on source
   x,y=round(u*W/S.width),round(v*V/S.height)
   X,Y=x+tx,y+ty
   if min(X,Y)<total or max(X,Y)>=1920-total:continue
   q=a[y-h:y+h+1,x-h:x+h+1].copy()
   if q.std()<2.3:continue
   q-=q.mean()
   win=b[Y-total:Y+total+1,X-total:X+total+1]
   ones=np.ones(q.shape)
   corr=correlate(win,q,'valid')
   den=np.sqrt(np.maximum(correlate(win**2,ones,'valid')-correlate(win,ones,'valid')**2/q.size,1e-10)*np.sum(q**2))
   rr=corr/den
   iy,ix=np.unravel_index(rr.argmax(),rr.shape);score=float(rr[iy,ix])
   if score>=.68 and 0<ix<2*rad and 0<iy<2*rad:results.append([i,j,u,v,X-rad+int(ix),Y-rad+int(iy),score])
 return np.array(results)
records=[]
for p in sorted(inputs.rglob('*.jpg')):
 S=Image.open(p).convert('RGB')
 score,sc,tx,ty=max((ca[0],sc,ca[1],ca[2]) for sc in np.arange(.94,1.161,.01) for ca in [coarse(S,sc)])
 z=search(S,sc,tx,ty)
 if len(z)<6: raise ValueError(f"Insufficient matches for {p.name}: {len(z)}")
 A=np.c_[z[:,2:4],np.ones(len(z))]
 train=np.flatnonzero((z[:,0]+z[:,1])%2==0); ho=np.flatnonzero((z[:,0]+z[:,1])%2!=0)
 if len(train)<5 or len(ho)<4: raise ValueError(f"Insufficient independent matches for {p.name}")
 # Fit only one parity; report residuals for all held out points.
 for _ in range(3):
  H=np.linalg.lstsq(A[train],z[train,4:6],rcond=None)[0]
  e=np.linalg.norm(A@H-z[:,4:6],axis=1)
  if len(train)>5 and e[train].max()>9:train=train[e[train]<=max(8,np.quantile(e[train],.72))]
 H=np.linalg.lstsq(A[train],z[train,4:6],rcond=None)[0]
 e=np.linalg.norm(A@H-z[:,4:6],axis=1)
 matrix=np.vstack([H.T,[0,0,1]])
 def pts(ids):
  return [{'source_xy':z[i,2:4].astype(int).tolist(),'base_xy':z[i,4:6].astype(int).tolist(),'patch_score':round(float(z[i,6]),4),'residual_px':round(float(e[i]),4)} for i in ids]
 records.append({'file':p.name,'candidate_affine':matrix.round(9).tolist(),'fit_points':pts(train),'held_out_points':pts(ho),'fit_rms_px':round(float(np.sqrt(np.mean(e[train]**2))),4),'held_out_rms_px':round(float(np.sqrt(np.mean(e[ho]**2))),4),'held_out_max_px':round(float(e[ho].max()),4),'rejected_fit_points':pts(np.setdiff1d(np.flatnonzero((z[:,0]+z[:,1])%2==0),train))})
print(json.dumps(records,indent=2))
