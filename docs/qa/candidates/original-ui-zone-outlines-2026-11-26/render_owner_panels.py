"""Render derived outlines over the existing Atlas owner-native map only."""
from pathlib import Path
import argparse,hashlib,json,math
from PIL import Image
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

HERE=Path(__file__).resolve().parent

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--atlas-root',type=Path,default=HERE.parents[3]);args=parser.parse_args()
    path=args.atlas_root/'maps/lumiose-game-map.jpg'
    assert hashlib.sha256(path.read_bytes()).hexdigest()=='4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade'
    native=Image.open(path)
    records={r['zone']:r for r in json.loads((HERE/'original-ui-contour-candidates-first.json').read_text())['records']}
    checks=json.loads((HERE/'validation/native-green-checks-fixed.json').read_text())['checks']
    for page,zones in enumerate([[1,6,7,8,9,10],[12,15,17,18,19]],1):
        fig,axes=plt.subplots(2,3,figsize=(15,10),dpi=150)
        for ax in axes.flat:ax.axis('off')
        for ax,zone in zip(axes.flat,zones):
            ring=records[zone]['native_geometry']['coordinates'][0]
            xs,ys=zip(*ring);box=(max(0,math.floor(min(xs)-12)),max(0,math.floor(min(ys)-12)),min(1920,math.ceil(max(xs)+12)),min(1920,math.ceil(max(ys)+12)))
            ax.imshow(native.crop(box),extent=(box[0],box[2],box[3],box[1]),interpolation='nearest')
            ax.plot(xs,ys,color='#b600dc',linewidth=1.05)
            for check in checks:
                if check['zone']!=zone:continue
                x,y=check['native_xy'];ax.plot(x,y,'x',color='#ff3b42',markersize=4)
                ax.text(x+2,y-2,check['id'].split('-')[-1],fontsize=7,color='red',bbox=dict(facecolor='white',alpha=.72,edgecolor='none',pad=1))
            ax.set_title(f'Wild Zone {zone:02}',fontsize=12,pad=6)
        fig.suptitle('Owner-native evidence: fixed original UI perimeter (magenta) and reserved native stroke checks (red)',fontsize=12,y=.99)
        fig.tight_layout(rect=(0,0,1,.965),pad=1.0)
        fig.savefig(HERE/f'owner-native-new-ui-contours-{page}.png');plt.close(fig)

if __name__=='__main__':main()
