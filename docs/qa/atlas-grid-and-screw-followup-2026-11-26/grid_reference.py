"""Read-only Wild Zone 20 reference-grid pilot. No runtime or pin output."""
import argparse
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
REFERENCE = ROOT / 'docs/qa/at343-video-grid-2026-11-26/registration.json'
REG = json.loads(REFERENCE.read_text())
ORIGIN = (1920, 1920)
STEP = 240
N = 10
FRAME = 'wz20-frame-014'
HASH = REG['reference']['sha256']


def cross(o, a, b):
    return (a[0]-o[0]) * (b[1]-o[1]) - (a[1]-o[1]) * (b[0]-o[0])


def hull(points):
    pts = sorted(set(tuple(p) for p in points))
    def side(seq):
        out = []
        for p in seq:
            while len(out) > 1 and cross(out[-2], out[-1], p) <= 0:
                out.pop()
            out.append(p)
        return out
    return side(pts)[:-1] + side(reversed(pts))[:-1]


POLYGON = hull(c['reference_xy'] for c in REG['controls'] if c['role'] == 'fit')


def locate(x, y, radius, *, reference_hash):
    if reference_hash != HASH:
        raise ValueError('Reference hash does not match the frozen 4096 raster')
    if not all(math.isfinite(v) for v in (x, y, radius)) or radius <= 0:
        raise ValueError('Require finite coordinates and a positive uncertainty radius')
    # The full square enclosing the supplied uncertainty disk must be within
    # the architecture-control hull, not just the estimated centre.
    corners = [(x+dx, y+dy) for dx in (-radius, radius) for dy in (-radius, radius)]
    if any(cross(a, b, p) < 0 for p in corners for a, b in zip(POLYGON, POLYGON[1:]+POLYGON[:1])):
        return {'frame':FRAME, 'status':'outside_local_calibration', 'cells':[]}
    def index(v, origin):
        return math.floor((v-origin)/(STEP/N))
    u0,u1 = index(x-radius,ORIGIN[0]),index(x+radius,ORIGIN[0])
    v0,v1 = index(y-radius,ORIGIN[1]),index(y+radius,ORIGIN[1])
    cells = [{'column':u//N, 'row':v//N, 'subcolumn':u%N, 'subrow':v%N}
             for v in range(v0,v1+1) for u in range(u0,u1+1)]
    return {'frame':FRAME,'status':'one_search_subcell' if len(cells)==1 else 'multiple_search_subcells',
            'cells':cells,'input_reference_pixels':[x,y],'supplied_radius_reference_pixels':radius,
            'exact_map_pin':False}


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('x',type=float)
    p.add_argument('y',type=float)
    p.add_argument('--radius',type=float,required=True)
    p.add_argument('--reference-sha256',required=True)
    a=p.parse_args()
    print(json.dumps(locate(a.x,a.y,a.radius,reference_hash=a.reference_sha256),indent=2))
