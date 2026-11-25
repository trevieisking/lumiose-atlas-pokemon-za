"""Recheck AT-328 stored matrices and regenerate research overlays only.
Usage from repo root: python docs/qa/regenerate_at328_overviews.py /tmp/atlas-overview-qa
Requires cv2 and numpy. Does not change live assets.
"""
import hashlib, json, sys
from pathlib import Path
import cv2
import numpy as np

root = Path(__file__).resolve().parents[2]
out = Path(sys.argv[1]).resolve()
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((root / 'assets/atlas/city-overview/manifest.json').read_text())
reg = json.loads((root / 'docs/qa/ATLAS_AT328_CITY_OVERVIEW_REGISTRATION.json').read_text())

def load(record):
    raw = (root / record['path']).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == record['sha256']
    if 'git_blob_sha' in record:
        assert len(raw) == record['bytes']
        assert hashlib.sha1((('blob %d' % len(raw)).encode() + bytes([0])) + raw).hexdigest() == record['git_blob_sha']
    return cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)

base = load(reg['base_map'])
assert base.shape[:2] == (1920, 1920)
for f in reg['frames']:
    r = next(r for r in manifest['records'] if r['part'] == f['part'])
    im = load(r)
    assert im.shape[:2] == (r['height'], r['width'])
    H = np.array(f['matrix'])
    pts = np.array(f['holdout_points'])
    mapped = cv2.perspectiveTransform(pts[:, :2].copy().reshape(-1, 1, 2), H).reshape(-1, 2)
    errors = np.linalg.norm(mapped - pts[:, 2:4], axis=1)
    assert np.max(np.abs(errors - pts[:, 4])) < 0.002
    warp = cv2.warpPerspective(im, H, (1920, 1920))
    valid = cv2.warpPerspective(np.full(im.shape[:2], 255, np.uint8), H, (1920, 1920)) > 0
    blend = base.copy()
    blend[valid] = cv2.addWeighted(base, .5, warp, .5, 0)[valid]
    panel = np.hstack([cv2.resize(x, (640, 640)) for x in (base, warp, blend)])
    assert cv2.imwrite(str(out / (f['part'] + '-registration.png')), panel)
    print(f['part'], len(errors), 'held-out candidates;', sum(errors <= 3), 'within 3 native px')
