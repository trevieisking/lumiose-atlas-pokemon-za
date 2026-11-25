"""AT-327: regenerate research-only comparison images. Run from repository root.
Requires Python + NumPy + OpenCV (research environment used cv2 4.13.0).
No production writes. Usage: python docs/qa/regenerate_at327_registration.py OUTPUT_DIRECTORY
"""
import hashlib
import json
import sys
from pathlib import Path
import cv2
import numpy as np

root = Path(__file__).resolve().parents[2]
record = json.loads((root / "docs/qa/ATLAS_AT327_REGISTRATION_PILOTS.json").read_text())
out = Path(sys.argv[1]).resolve()
out.mkdir(parents=True, exist_ok=True)

def verified_bytes(path, expected):
    value = (root / path).read_bytes()
    if hashlib.sha256(value).hexdigest() != expected:
        raise ValueError("Source hash mismatch: " + path)
    return value

def decode(path, expected):
    return cv2.imdecode(np.frombuffer(verified_bytes(path, expected), np.uint8), cv2.IMREAD_COLOR)

base = decode(record["base_map"]["path"], record["base_map"]["sha256"])
assert base.shape[:2] == (1920, 1920)
for frame in record["frames"]:
    photo = decode(frame["path"], frame["photo_sha256"])
    assert photo.shape[:2] == (865, 1536)
    fit = [p for p in frame["points"] if p[5] == "f"]
    hold = [p for p in frame["points"] if p[5] == "h"]
    H, _ = cv2.findHomography(np.array([p[1:3] for p in fit], float),
                              np.array([p[3:5] for p in fit], float), 0)
    points = np.array([p[1:3] for p in hold], float)
    expected = np.array([p[3:5] for p in hold], float)
    projected = cv2.perspectiveTransform(points.reshape(-1, 1, 2), H).reshape(-1, 2)
    error = np.linalg.norm(projected - expected, axis=1)
    rms = float(np.sqrt(np.mean(error ** 2)))
    assert abs(rms - frame["holdout_rms"]) < .02
    warp = cv2.warpPerspective(photo, H, (1920, 1920))
    mask = cv2.warpPerspective(np.full(photo.shape[:2], 255, np.uint8), H, (1920, 1920)) > 0
    blend = base.copy()
    blend[mask] = cv2.addWeighted(base, .5, warp, .5, 0)[mask]
    x0, y0, x1, y1 = frame["crop_native"]
    panel = np.hstack([im[y0:y1, x0:x1] for im in (base, warp, blend)])
    panel = cv2.resize(panel, None, fx=1.4, fy=1.4, interpolation=cv2.INTER_NEAREST)
    path = out / ("wz%02d-%s-registration.png" % (frame["zone"], frame["view"]))
    assert cv2.imwrite(str(path), panel)
    print(path, "held-out RMS native px:", round(rms, 3), "max:", round(float(error.max()), 3))
