from PIL import Image,ImageDraw
from scipy import ndimage as ndi
from scipy.spatial import cKDTree
import contourpy
import json,sys,numpy as np
from pathlib import Path
base_path,manifest_path,out_path=map(Path,sys.argv[1:4])
D=manifest_path.parent
B=Image.open(base_path).convert('RGB')
rows=[r['candidate_registration'] for r in json.loads(manifest_path.read_text())['records']]
cases={1:((948,1680,1325,1828),(2,6,7)),2:((1065,1165,1300,1405),(2,3,6,7)),3:((850,430,1060,631),(1,4,5,8)),4:((945,204,1220,373),(1,5)),6:((1610,850,1860,1180),(3,5))}
def trace(im):
 p=np.asarray(im,dtype=float)
 c=(p[:,:,1]-p[:,:,0]>21)&(p[:,:,1]-p[:,:,2]>12)
 st=ndi.generate_binary_structure(2,1)
 c=ndi.binary_opening(ndi.binary_closing(c,st,iterations=2),st,iterations=1)
 l,_=ndi.label(c)
 counts=np.bincount(l.ravel());counts[0]=0
 if counts.max()<500:return None
 m=ndi.binary_fill_holes(l==np.argmax(counts))
 if np.any(m[[0,1,-2,-1],:]) or np.any(m[:,[0,1,-2,-1]]):return None
 p=max(contourpy.contour_generator(z=m.astype(float)).lines(.5),key=len)
 if len(p)<170 or np.linalg.norm(p[0]-p[-1])>.05:return None
 return p
def diff(a,b):
 d=np.r_[cKDTree(a).query(b)[0],cKDTree(b).query(a)[0]]
 return [round(float(v),2) for v in (np.sqrt(np.mean(d*d)),np.quantile(d,.95),d.max())]
out=Image.new('RGB',(1250,1200),'#192333')
outrows=[]
for idx,(z,(box,nums)) in enumerate(cases.items()):
 l,t,r,b=box
 target=B.crop(box)
 orig=trace(target)
 p=ImageDraw.Draw(target)
 if orig is not None:p.line([tuple(v) for v in orig],fill='#ff488f',width=2)
 p.text((4,4),f'WZ{z}: basemap',fill='white',stroke_fill='black',stroke_width=1)
 target.thumbnail((246,235));out.paste(target,(3,idx*240))
 zs=[]
 for col,k in enumerate(nums,start=1):
  row=rows[k-1]
  def outside(p):
   x,y=p['base_xy'];return not(l-48<=x<=r+48 and t-48<=y<=b+48)
  fit=[s for s in row['fit_points'] if outside(s)];ho=[s for s in row['held_out_points'] if outside(s)]
  A=np.array([s['source_xy']+[1] for s in fit]);Y=np.array([s['base_xy'] for s in fit])
  H=np.vstack([np.linalg.lstsq(A,Y,rcond=None)[0].T,[0,0,1]])
  hold=np.array([s['source_xy']+[1] for s in ho])@H[:2].T-np.array([s['base_xy'] for s in ho])
  h=float(np.sqrt(np.mean(np.sum(hold**2,axis=1))))
  M=np.linalg.inv(H)@np.array([[1,0,l],[0,1,t],[0,0,1]])
  raw=Image.open(D/row['file']).convert('RGB')
  corners=np.array([[0,0,1],[r-l,0,1],[0,b-t,1],[r-l,b-t,1]])@M.T
  contained=(min(corners[:,0])>=0 and max(corners[:,0])<raw.width and min(corners[:,1])>=0 and max(corners[:,1])<raw.height)
  warped=raw.transform((r-l,b-t),Image.Transform.PERSPECTIVE,tuple(M.ravel()[:8]),Image.Resampling.BICUBIC)
  traced=trace(warped)
  d=ImageDraw.Draw(warped)
  if orig is not None:d.line([tuple(v) for v in orig],fill='#ff488f',width=2)
  if traced is not None:d.line([tuple(v) for v in traced],fill='#4eeaff',width=1)
  d.text((4,4),f'{row["file"]}',fill='white',stroke_fill='black',stroke_width=1)
  warped.thumbnail((246,235));out.paste(warped,(col*250+3,idx*240))
  rowout={'file':row['file'],'fit_count':len(fit),'held_out_count':len(ho),'held_out_rms':round(h,2),'whole_box_visible':bool(contained),'contour_present':traced is not None,'contour_vs_basemap_rms_p95_max_px':diff(orig,traced) if orig is not None and traced is not None and contained else None}
  zs.append(rowout)
 outrows.append({'zone':z,'crop_native':list(box),'sources':zs})
out.save(out_path,quality=93)
print(json.dumps(outrows,indent=2))
