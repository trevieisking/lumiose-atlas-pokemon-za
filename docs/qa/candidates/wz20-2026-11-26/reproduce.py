"""Reproduce the AT341 WZ20 rendered-selection candidate, never runtime geometry.

Run from any directory with Python, Pillow, NumPy and OpenCV installed:
    python docs/qa/candidates/wz20-2026-11-26/reproduce.py

Only generated evidence in this candidate directory is written. Input rasters,
failed trials, production JSON, canonical plans and review decisions are untouched.
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
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
EXPECTED = {
    "native_map": "4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade",
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def font(size):
    return ImageFont.truetype(FONT, size) if Path(FONT).exists() else ImageFont.load_default()


def project(points, matrix):
    p = np.column_stack([np.asarray(points, float), np.ones(len(points))]) @ matrix.T
    return p[:, :2] / p[:, 2:]


def stats(values):
    a = np.asarray(values, float)
    return {"count": len(a), "rms_px": float(np.sqrt(np.mean(a*a))),
            "max_px": float(a.max()), "median_px": float(np.median(a))}


def fit_registration(spec):
    fit = [p for p in spec["points"] if p["role"] == "fit"]
    matrix, _ = cv2.findHomography(np.array([p["source_xy"] for p in fit], float),
                                   np.array([p["target_xy"] for p in fit], float), 0)
    assert matrix is not None
    points = []
    for point in spec["points"]:
        q = project([point["source_xy"]], matrix)[0]
        points.append({**point, "projected_target_xy": q.tolist(),
                       "residual_px": float(np.linalg.norm(q-point["target_xy"]))})
    return {**spec, "matrix": matrix.tolist(), "points": points,
            "metrics": {role: stats([p["residual_px"] for p in points if p["role"] == role])
                        for role in ["fit", "holdout"]}}


sources = []
images = {}
for key in ["native_map", "overview", "closeup"]:
    path = ROOT / OBS[key]
    assert digest(path) == OBS["source_sha256"][key]
    if key in EXPECTED:
        assert digest(path) == EXPECTED[key]
    raw = path.read_bytes()
    images[key] = cv2.imread(str(path))
    sources.append({"role": key, "path": OBS[key], "sha256": digest(path), "bytes": len(raw),
                    "git_blob_sha1": hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest(),
                    "dimensions": list(Image.open(path).size)})
primary = fit_registration(OBS["primary_registration"])
closeup = fit_registration(OBS["closeup_registration"])
H = np.array(primary["matrix"])
C = H @ np.array(closeup["matrix"])
closeup["composed_source_to_native_matrix"] = C.tolist()
for p in closeup["points"]:
    q = project([p["source_xy"]], C)[0]
    n = project([p["target_xy"]], H)[0]
    p["composed_native_residual_px"] = float(np.linalg.norm(q-n))
closeup["composed_native_metrics"] = {
    role: stats([p["composed_native_residual_px"] for p in closeup["points"] if p["role"] == role])
    for role in ["fit", "holdout"]}


def masked(deg, spans):
    return any(abs((deg-a+180) % 360-180) <= width for a, width in spans)


def trace(which):
    spec = OBS["trace"][which]
    raw = images["native_map" if which == "native" else which]
    start, end, step = spec["radial_range"]
    radii = np.arange(start, end+step/2, step)
    rows = []
    for i, deg in enumerate(np.arange(0, 360, spec["angle_step_degrees"])):
        if masked(deg, spec["exclude_angle_spans_center_halfwidth"]):
            continue
        v = np.array([math.cos(math.radians(deg)), math.sin(math.radians(deg))])
        points = np.array(spec["seed"])+radii[:, None]*v
        colors = cv2.remap(raw, points[:, 0].astype("float32").reshape(1, -1),
                           points[:, 1].astype("float32").reshape(1, -1), cv2.INTER_LINEAR)[0].astype(float)
        if which == "native":
            valid = (colors[:, 1]-colors[:, 2] > 27) & (colors[:, 1]-colors[:, 0] > 10)
            assert valid.any(), f"Unobserved native ray at {deg}; inspect source and retain a failure."
            score = colors.mean(axis=1)
            score[~valid] = 1000
            k = int(np.argmin(score))
        else:
            score = colors[:, 1]-(colors[:, 0]+colors[:, 2])/2
            k = int(np.argmax(score))
        rows.append({"angle_degrees": float(deg), "xy": points[k].tolist(),
                     "role": "fit" if which == "native" and i % 2 == 0 else "holdout"})
    return rows


native_trace = trace("native")
fit_points = np.array([p["xy"] for p in native_trace if p["role"] == "fit"], dtype="float32")
ellipse = cv2.fitEllipse(fit_points)
(cx, cy), (diameter_a, diameter_b), rotation = ellipse
a, b = diameter_a/2, diameter_b/2
r = math.radians(rotation)
T = np.array([[math.cos(r), -math.sin(r)], [math.sin(r), math.cos(r)]])


def curve_error(points):
    points = np.asarray(points, float)
    local = (points-[cx, cy]) @ T
    theta = np.arctan2(local[:, 1]/b, local[:, 0]/a)
    q = np.column_stack([a*np.cos(theta), b*np.sin(theta)]) @ T.T+[cx, cy]
    return np.linalg.norm(q-points, axis=1)


for p, e in zip(native_trace, curve_error([p["xy"] for p in native_trace])):
    p["curve_residual_native_px"] = float(e)
source_traces = {}
for name, matrix in [("overview", H), ("closeup", C)]:
    rows = trace(name)
    native = project([p["xy"] for p in rows], matrix)
    for p, xy, e in zip(rows, native, curve_error(native)):
        p["projected_native_xy"] = xy.tolist()
        p["curve_residual_native_px"] = float(e)
    source_traces[name] = {"method": OBS["trace"][name], "points": rows,
                           "metrics_native_px": stats([p["curve_residual_native_px"] for p in rows])}

angles = np.linspace(0, 2*np.pi, 129)
ring = np.column_stack([a*np.cos(angles), b*np.sin(angles)]) @ T.T+[cx, cy]
ring = np.round(ring, 2)
ring[-1] = ring[0]
geometry = {"type": "Polygon", "coordinates": [ring.tolist()]}
(HERE / "candidate-geometry.json").write_text(json.dumps(geometry, indent=2)+"\n")

# Panels expose every control and withheld observation; no low-error filtering.
def mark(im, xy, color, radius=5):
    d = ImageDraw.Draw(im)
    x, y = xy
    d.line((x-radius, y, x+radius, y), fill=color, width=2)
    d.line((x, y-radius, x, y+radius), fill=color, width=2)


def label(draw, xy, message, size=15, color="white"):
    draw.text(xy, message, font=font(size), fill=color, stroke_width=1, stroke_fill="#101827")


def controls_panel(registration, source_key, target_key, source_span, target_span, name):
    points = registration["points"]
    canvas = Image.new("RGB", (1710, 45+math.ceil(len(points)/3)*265), "#101827")
    draw = ImageDraw.Draw(canvas)
    label(draw, (10, 8), name+" | cyan: manual observation | magenta: projection | all points retained", 18)
    for i, point in enumerate(points):
        tile = Image.new("RGB", (570, 265), "#172238")
        td = ImageDraw.Draw(tile)
        label(td, (8, 4), f'{point["id"]} {point["role"]} {point["residual_px"]:.3f} target px', 16)
        label(td, (8, 27), point["label"], 15)
        for col, (key, xy, span) in enumerate([(source_key, point["source_xy"], source_span),
                                              (target_key, point["target_xy"], target_span)]):
            raw = Image.fromarray(images[key][:, :, ::-1])
            x, y = xy
            left, top = int(x-span/2), int(y-span/2)
            crop = raw.crop((left, top, left+span, top+span)).resize((180, 180), Image.Resampling.NEAREST)
            mark(crop, ((x-left)*180/span, (y-top)*180/span), "#40e9ff")
            if col:
                q = point["projected_target_xy"]
                mark(crop, ((q[0]-left)*180/span, (q[1]-top)*180/span), "#ff40cd", 3)
            tile.paste(crop, (10+col*280, 53))
            label(td, (10+col*280, 238), key+" "+str([round(x, 3), round(y, 3)]), 13)
        canvas.paste(tile, ((i % 3)*570, 45+(i//3)*265))
    canvas.save(HERE / name)


controls_panel(primary, "overview", "native_map", 40, 20, "primary-landmark-review.png")
controls_panel(closeup, "closeup", "overview", 40, 30, "closeup-landmark-review.png")


def draw_curve(im, xy, native_vertices, scale=1, width=2):
    d = ImageDraw.Draw(im)
    for i in range(len(xy)-1):
        midpoint = (native_vertices[i]+native_vertices[i+1])/2
        angle = math.degrees(math.atan2(midpoint[1]-cy, midpoint[0]-cx))
        hidden = masked(angle, OBS["trace"]["native"]["exclude_angle_spans_center_halfwidth"])
        color = "#ffad42" if hidden else "#ff40cd"
        if not hidden or i % 2 == 0:
            d.line([tuple(xy[i]), tuple(xy[i+1])], fill=color, width=width)


box = OBS["review_crop_native"]
l, t, right, bottom = box
canvas = Image.new("RGB", (1920, 775), "#101827")
d = ImageDraw.Draw(canvas)
label(d, (15, 10), "WZ20 candidate only | magenta measured circular footprint; orange dashed modeled UI spans", 22)
views = [("native_map", np.eye(3), "Native measured circular selection line"),
         ("overview", H, "Owner overview: separate architecture calibration"),
         ("closeup", C, "Owner closeup: corroborating composed calibration")]
for col, (key, matrix, title) in enumerate(views):
    warped = cv2.warpPerspective(images[key], matrix, (1920, 1920))
    crop = Image.fromarray(warped[t:bottom, l:right, ::-1]).resize(((right-l)*2, (bottom-t)*2), Image.Resampling.NEAREST)
    draw_curve(crop, (ring-[l, t])*2, ring)
    canvas.paste(crop, (10+col*640, 90))
    label(d, (10+col*640, 52), title, 16)
label(d, (15, 718), "Same fitted native curve in every view. Gate icons do not establish routes; missing sector boundaries remain missing.", 18)
label(d, (15, 746), "3 native px is rendered-raster tolerance. Independent review is required before any production use.", 18)
canvas.save(HERE / "registered-source-review.png")
for key, matrix, output in [("overview", H, "overview-original-review.png"), ("closeup", C, "closeup-original-review.png")]:
    raw = Image.fromarray(images[key][:, :, ::-1])
    draw_curve(raw, project(ring, np.linalg.inv(matrix)), ring, width=2)
    label(ImageDraw.Draw(raw), (15, 10), "WZ20 CANDIDATE | originals unchanged | orange = modeled masked UI spans", 22)
    raw.save(HERE / output)

# Geometric validity is separate from visual evidence/approval.
p = ring[:-1]
area = abs(float(np.sum(p[:, 0]*np.roll(p[:, 1], -1)-p[:, 1]*np.roll(p[:, 0], -1))))/2
turns = []
for i in range(len(p)):
    u, v = p[(i+1) % len(p)]-p[i], p[(i+2) % len(p)]-p[(i+1) % len(p)]
    turns.append(float(u[0]*v[1]-u[1]*v[0]))
topology = {"closed": bool(np.array_equal(ring[0], ring[-1])), "vertex_count_including_closure": len(ring),
            "finite": bool(np.isfinite(ring).all()), "in_native_bounds": bool((ring >= 0).all() and (ring < 1920).all()),
            "strictly_convex": bool(all(v > 0 for v in turns) or all(v < 0 for v in turns)),
            "self_intersections": 0 if all(v > 0 for v in turns) or all(v < 0 for v in turns) else "requires_review",
            "area_native_px2": area}
artifacts = ["primary-landmark-review.png", "closeup-landmark-review.png", "registered-source-review.png",
             "overview-original-review.png", "closeup-original-review.png", "candidate-geometry.json"]
trials = ["initial-manual-trial.json", "initial-outermost-mask-trial.json", "initial-first-mask-run-trial.json",
          "initial-closeup-mask-trial.json", "rejected-cross-palette-descriptor-candidates.json", "raw-closeup-descriptor-candidates.json"]
receipt = {
    "id": "AT341-WZ20-NATIVE-PERIMETER-CANDIDATE", "date": OBS["date"], "baseline_commit": OBS["baseline_commit"],
    "area_id": OBS["area_id"], "status": "candidate_pending_independent_boundary_and_occlusion_review",
    "approved": False, "production_geometry": None,
    "scope": "Rendered game-map selection footprint only; no physical perimeter, spawn, floor, route or walkability claim.",
    "sources": sources, "primary_registration": primary, "closeup_corroboration": closeup,
    "native_trace": {"method": OBS["trace"]["native"], "ellipse_center": [cx, cy], "ellipse_semiaxes": [a, b],
                     "ellipse_rotation_degrees": rotation, "points": native_trace,
                     "metrics": {role: stats([p["curve_residual_native_px"] for p in native_trace if p["role"] == role])
                                 for role in ["fit", "holdout"]}},
    "independent_source_perimeter_checks": source_traces,
    "geometry_path": str((HERE / "candidate-geometry.json").relative_to(ROOT)),
    "geometry_sha256": digest(HERE / "candidate-geometry.json"), "topology": topology,
    "raster_tolerance_native_px": OBS["raster_tolerance_native_px"], "uncertainty_scope": OBS["uncertainty_scope"],
    "review": {"registration_author_checked": True, "boundary_author_checked": True,
               "independent": False, "production_approved": False, "decision": None,
               "required": "Inspect both original photos, all controls and held-out points, registered curve, native/owner glyph occlusions and masked modeled circle continuations. Decide only for rendered selection scope under the existing three-pixel raster contract."},
    "preserved_trials": [{"path": str((HERE/name).relative_to(ROOT)), "sha256": digest(HERE/name)} for name in trials],
    "trial_findings": [
        "Cross-palette SIFT screening produced repeated/UI and boundary matches; none defines the primary registration.",
        "First radial outermost-mask method selected two neighboring WZ05 pixels; first-mask-run method selected an interior/tower feature. Both full outputs are preserved; final narrow observed-perimeter window is documented, not residual-based filtering.",
        "Initial closeup angular mask included place-name lettering and southwest gate pixels. Final masks explicitly cover those original UI elements. All retained rays and residuals are published.",
        "F5/F6 first-pass source picks were above the bottom chamfer stroke; corrected to the visually observed stroke-center intersections. Every primary holdout remained unchanged."
    ],
    "review_artifacts": [{"path": str((HERE/name).relative_to(ROOT)), "sha256": digest(HERE/name)} for name in artifacts],
    "reproducibility": {"script_sha256": digest(HERE / "reproduce.py"), "observations_sha256": digest(HERE / "manual-observations.json"),
                        "dependencies": {"opencv": cv2.__version__, "numpy": np.__version__}},
    "gates": {"G2": "partial", "G3": "partial", "G5": "blocked", "A0": "blocked",
              "reason": "No independent WZ20 approval in this packet; other unresolved zone and all 48 sector perimeters are not supplied by this candidate."},
    "preservation": {"original_source_images_edited": False, "runtime_files_edited": False, "pins_or_routes_edited": False,
                     "encounter_records_edited": False, "canonical_plans_edited": False}
}
(HERE / "candidate-evidence.json").write_text(json.dumps(receipt, indent=2)+"\n")
print(json.dumps({"status": receipt["status"], "primary": primary["metrics"],
                  "closeup_native": closeup["composed_native_metrics"], "native_trace": receipt["native_trace"]["metrics"],
                  "source_trace": {k: v["metrics_native_px"] for k, v in source_traces.items()}, "topology": topology}, indent=2))
