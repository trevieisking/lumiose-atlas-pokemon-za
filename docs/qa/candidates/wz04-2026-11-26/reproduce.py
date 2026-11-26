"""Reproduce an UNAPPROVED WZ04 image-registration/outline candidate.

Requires Python, Pillow, NumPy and OpenCV. Run from any working directory:
    python docs/qa/candidates/wz04-2026-11-26/reproduce.py

Only files in this candidate directory are written. Original images, rejected
screening evidence, runtime geometry, approvals and other areas are untouched.
"""
from pathlib import Path
import hashlib
import json
import math

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
OBS = json.loads((HERE / "manual-observations.json").read_text())
MANIFEST = "assets/atlas/city-overview/owner-crops-2026-11-26/manifest.json"
manifest = json.loads((ROOT / MANIFEST).read_text())
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size):
    return ImageFont.truetype(FONT_PATH, size) if Path(FONT_PATH).exists() else ImageFont.load_default()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def project(points, matrix):
    p = np.column_stack([np.asarray(points, float), np.ones(len(points))]) @ matrix.T
    return p[:, :2] / p[:, 2:]


def stats(values):
    a = np.asarray(values, float)
    return {"count": len(a), "rms_px": float(np.sqrt(np.mean(a*a))), "max_px": float(a.max())}


fit = [p for p in OBS["points"] if p["role"] == "fit"]
H, _ = cv2.findHomography(np.array([p["source_xy"] for p in fit], float),
                         np.array([p["native_xy"] for p in fit], float), 0)
assert H is not None
points = []
for p in OBS["points"]:
    q = project([p["source_xy"]], H)[0]
    r = {**p, "projected_native_xy": q.tolist(), "residual_px": float(np.linalg.norm(q-p["native_xy"]))}
    if "first_pass_native_xy" in p:
        r["first_pass_residual_px"] = float(np.linalg.norm(q-p["first_pass_native_xy"]))
    points.append(r)
metrics = {role: stats([p["residual_px"] for p in points if p["role"] == role])
           for role in ["fit", "architecture_holdout", "border_holdout"]}
source_poly = np.array([v["xy"] for v in OBS["source_perimeter_vertices"]], float)
native_poly = project(source_poly, H)
uncertain = {(s["from_vertex"], s["to_vertex"]) for s in OBS["unresolved_gate_connector_segments"]}

base = Image.open(ROOT / OBS["native_map"]).convert("RGB")
photo = Image.open(ROOT / OBS["source"]).convert("RGB")
source_records = []
paths = [OBS["native_map"], OBS["source"], "assets/atlas/wild-zones/wild-zone-04-overview.png", MANIFEST,
         *OBS["preserved_rejections"]]
owner = []
screen_box = (945, 204, 1220, 373)
for name in OBS["corroborating_owner_files"]:
    row = next(r for r in manifest["records"] if r["source_name"] == name)
    paths.append(row["path"])
    reg = row["candidate_registration"]
    def outside(p):
        x, y = p["base_xy"]
        l, t, r, b = screen_box
        return not (l-48 <= x <= r+48 and t-48 <= y <= b+48)
    fp = [p for p in reg["fit_points"] if outside(p)]
    hp = [p for p in reg["held_out_points"] if outside(p)]
    A = np.array([p["source_xy"]+[1] for p in fp])
    Y = np.array([p["base_xy"] for p in fp])
    M = np.vstack([np.linalg.lstsq(A, Y, rcond=None)[0].T, [0, 0, 1]])
    er = np.linalg.norm(project([p["source_xy"] for p in hp], M) - [p["base_xy"] for p in hp], axis=1)
    owner.append({"path": row["path"], "source_sha256": row["sha256"],
                  "matrix": M.tolist(), "fit_count": len(fp), "held_out": stats(er),
                  "method": "Unchanged PR200 screening procedure: least-squares affine, target crop plus 48-native-pixel margin excluded from fit and holdout. Alternate-grid patch correspondences are contextual corroboration; they are not new named manual controls and do not determine this outline.",
                  "fit_points": fp, "held_out_points": hp})
for rel in paths:
    path = ROOT / rel
    r = {"path": rel, "sha256": digest(path), "bytes": path.stat().st_size}
    if path.suffix.lower() in [".jpg", ".png"]:
        r["dimensions"] = list(Image.open(path).size)
    source_records.append(r)
for r in owner:
    assert digest(ROOT / r["path"]) == r["source_sha256"]
assert digest(ROOT / OBS["native_map"]) == "4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade"
assert digest(ROOT / OBS["source"]) == "d46ebad35a9e2e17a84bb70b990a1b37f3e33200736342e7393871a6228faa36"


def draw_outline(im, poly, width=3):
    d = ImageDraw.Draw(im)
    for i, a in enumerate(poly):
        j = (i+1) % len(poly)
        b = poly[j]
        if (i, j) in uncertain:
            # Dashed orange denotes an unresolved connector; never fills it.
            length = float(np.linalg.norm(b-a))
            n = max(1, math.ceil(length/12))
            for k in range(n):
                u, v = k/n, min((k+.55)/n, 1)
                d.line([tuple(a+(b-a)*u), tuple(a+(b-a)*v)], fill="#ffad42", width=width)
        else:
            d.line([tuple(a), tuple(b)], fill="#ff40cd", width=width)


def mark(im, xy, color, radius=6):
    x, y = xy
    d = ImageDraw.Draw(im)
    d.line((x-radius, y, x+radius, y), fill=color, width=2)
    d.line((x, y-radius, x, y+radius), fill=color, width=2)


def label(d, xy, text, size=17, fill="white"):
    d.text(xy, text, font=font(size), fill=fill, stroke_width=2, stroke_fill="#111827")


# Review all observations, including awkward checks: no point is hidden/dropped.
tiles = []
for p in points:
    tile = Image.new("RGB", (570, 265), "#172238")
    d = ImageDraw.Draw(tile)
    label(d, (8, 5), f'{p["id"]} | {p["role"]} | {p["residual_px"]:.3f} native px', 16)
    label(d, (8, 27), p["label"], 15)
    for col, (raw, xy, span) in enumerate([(photo, p["source_xy"], 60), (base, p["native_xy"], 15)]):
        x, y = xy
        crop = raw.crop((int(x-span/2), int(y-span/2), int(x-span/2)+span, int(y-span/2)+span))
        crop = crop.resize((180,180), Image.Resampling.NEAREST)
        actual = ((x-int(x-span/2))*180/span, (y-int(y-span/2))*180/span)
        mark(crop, actual, "#40e9ff", 8)
        if col == 1:
            q = p["projected_native_xy"]
            mark(crop, ((q[0]-int(x-span/2))*180/span, (q[1]-int(y-span/2))*180/span), "#ff40cd", 6)
        tile.paste(crop, (12+col*280, 56))
        label(d, (12+col*280, 238), ("photo " if col == 0 else "native ") + str(xy), 14)
    tiles.append(tile)
montage = Image.new("RGB", (1710, len(tiles)//3*265+45), "#101827")
label(ImageDraw.Draw(montage), (12, 9), "WZ04 CANDIDATE | cyan: manually observed point | magenta: projected point | original rasters enlarged", 20)
for i, tile in enumerate(tiles):
    montage.paste(tile, ((i%3)*570, 45+(i//3)*265))
montage.save(HERE / "landmark-review.png")

# Registered views all show the same outline; orange spans require a decision.
box = OBS["review_crop_native"]
l, t, r, b = box
scale = 3
can = Image.new("RGB", (2400, 1390), "#101827")
d = ImageDraw.Draw(can)
label(d, (20, 12), "WZ04 CANDIDATE ONLY — NO RUNTIME CHANGE OR APPROVAL", 28)
label(d, (20, 52), "Magenta: visible-source outline; orange dashed: unresolved gate-symbol connectors. Original rasters remain unchanged.", 21)
views = [("Native map: west cursor occlusion retained", base, np.eye(3)),
         ("Original WZ04 closeup registered using six architecture controls", photo, H)]
for row in owner:
    views.append((Path(row["path"]).name + " | independent PR200 contextual view", Image.open(ROOT/row["path"]).convert("RGB"), np.array(row["matrix"])))
for i, (title, raw, matrix) in enumerate(views):
    aligned = cv2.warpPerspective(np.asarray(raw), matrix, base.size)
    crop = Image.fromarray(aligned).crop(box).resize(((r-l)*scale, (b-t)*scale), Image.Resampling.NEAREST)
    draw_outline(crop, (native_poly-[l,t])*scale, 3)
    x, y = 20+(i%2)*1200, 120+(i//2)*630
    can.paste(crop, (x,y))
    label(d, (x,y-30), title, 20)
can.save(HERE / "registered-source-review.png")

full = photo.copy()
draw_outline(full, source_poly, 4)
d = ImageDraw.Draw(full)
label(d, (20,30), "WZ04 CANDIDATE | orange dashed spans unresolved", 25)
for p in points:
    rejected = p["role"].startswith("rejected")
    color = "#ff8379" if rejected else "#40e9ff" if p["role"] == "fit" else "#ffee59"
    mark(full, p["source_xy"], color)
    x, y = p["source_xy"]
    label(d, (min(x+7,1460), max(0,y-23)), p["id"] + (" rejected" if rejected else ""), 17, color)
full.save(HERE / "original-closeup-review.png")

# Only topology is checked automatically; this does not approve any geometry.
def orient(a, b, c):
    u, v = b-a, c-a
    return float(u[0]*v[1]-u[1]*v[0])
crossings = []
for i in range(len(native_poly)):
    j = (i+1) % len(native_poly)
    for k in range(i+1,len(native_poly)):
        q = (k+1) % len(native_poly)
        if len({i,j,k,q}) < 4:
            continue
        a, bb, c, dd = native_poly[[i,j,k,q]]
        if orient(a,bb,c)*orient(a,bb,dd) < 0 and orient(c,dd,a)*orient(c,dd,bb) < 0:
            crossings.append([i,k])
area = float(abs(np.sum(native_poly[:,0]*np.roll(native_poly[:,1],-1)-native_poly[:,1]*np.roll(native_poly[:,0],-1)))/2)
receipt = {
    "id": "WZ04-MANUAL-CANDIDATE-2026-11-26",
    "status": "candidate_pending_independent_review_with_three_unresolved_gate_connectors",
    "baseline_commit": OBS["baseline_commit"], "area_id": OBS["area_id"],
    "approved": False, "production_geometry": None,
    "scope": "Only a rendered map-selection outline candidate. No spawn, walkability, floor, route, entrance-accessibility, encounter or physical-geography claim.",
    "registration": {"method": OBS["method"], "source_to_native_matrix": H.tolist(), "metrics": metrics, "points": points},
    "candidate": {"native_vertices": native_poly.tolist(), "source_vertices": OBS["source_perimeter_vertices"],
                  "unresolved_segments": OBS["unresolved_gate_connector_segments"], "closed_for_review_only": True,
                  "uncertainty": "Manual/raster picks are not subpixel physical truth. Residuals measure these image correspondences only, not a geographic accuracy bound. Review the 1.6–1.7 px southeast fit disagreement, native cursor-occluded west edge, and all three gate connectors. No uniform uncertainty radius is certified."},
    "topology": {"vertex_count": len(native_poly), "finite": bool(np.isfinite(native_poly).all()),
                 "in_native_bounds": bool((native_poly>=0).all() and (native_poly<1920).all()),
                 "self_intersections": crossings, "area_native_px2": area},
    "owner_corroboration": owner,
    "occlusions": OBS["occlusions"], "sources": source_records,
    "preserved_rejections": OBS["preserved_rejections"],
    "review_artifacts": [{"path": str(p.relative_to(ROOT)), "sha256": digest(p)} for p in [HERE/"landmark-review.png", HERE/"registered-source-review.png", HERE/"original-closeup-review.png"]],
    "reproducibility": {"script_sha256": digest(HERE/"reproduce.py"), "observations_sha256": digest(HERE/"manual-observations.json"),
                        "python_dependencies": {"opencv": cv2.__version__, "numpy": np.__version__}},
    "independent_review": {"decision": None, "reviewer": None, "required": "Review original point pairs, source agreement and three gate connectors before considering any runtime geometry. The gate connectors must not be silently described as directly observed."}
}
(HERE / "candidate-evidence.json").write_text(json.dumps(receipt, indent=2)+"\n")
print(json.dumps({"status": receipt["status"], "metrics": metrics, "topology": receipt["topology"],
                  "owner_holdouts": [{"path":o["path"],"fit_count":o["fit_count"],**o["held_out"]} for o in owner],
                  "evidence_sha256": digest(HERE/"candidate-evidence.json")}, indent=2))
