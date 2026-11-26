"""Append-only WZ04 review supplement; never changes the previous HOLD or runtime."""
from pathlib import Path
import hashlib
import json
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
old_path = HERE / "candidate-evidence.json"
old = json.loads(old_path.read_text())
obs = json.loads((HERE / "manual-observations.json").read_text())
H = np.array(old["registration"]["source_to_native_matrix"])
source_xy = [58.5, 669.5]
native_xy = [928.5, 349.5]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def project(points, matrix):
    q = np.column_stack([np.asarray(points, float), np.ones(len(points))]) @ matrix.T
    return q[:, :2]/q[:, 2:]


def font(size):
    return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)


def label(draw, xy, text, size=17):
    draw.text(xy, text, font=font(size), fill="white", stroke_width=1, stroke_fill="#101827")


def mark(draw, xy, color):
    x, y = xy
    draw.line((x-7, y, x+7, y), fill=color, width=2)
    draw.line((x, y-7, x, y+7), fill=color, width=2)


projected = project([source_xy], H)[0]
residual = float(np.linalg.norm(projected-native_xy))
base = Image.open(ROOT / obs["native_map"]).convert("RGB")
photo = Image.open(ROOT / obs["source"]).convert("RGB")
# The source hashes are locked to the earlier candidate, not refreshed silently.
for key in ["native_map", "source"]:
    prior = next(s for s in old["sources"] if s["path"] == obs[key])
    assert sha(ROOT / obs[key]) == prior["sha256"]

panel = Image.new("RGB", (1480, 640), "#101827")
draw = ImageDraw.Draw(panel)
label(draw, (15, 12), "AT341 WZ04: additional southwest architectural holdout, unchanged original transform", 23)
label(draw, (15, 48), f"Lower-west roof southeast corner | residual {residual:.3f} native px | cyan observed, magenta projected", 20)
for col, (raw, point, box, title) in enumerate([
    (photo, source_xy, [0, 460, 110, 725], "Original closeup: stepped lower-west roof"),
    (base, native_xy, [900, 300, 985, 380], "Native map: corner is left of the red cursor")]):
    left, top, right, bottom = box
    scale = min(650/(right-left), 480/(bottom-top))
    crop = raw.crop(box).resize((round((right-left)*scale), round((bottom-top)*scale)), Image.Resampling.NEAREST)
    cd = ImageDraw.Draw(crop)
    mark(cd, ((point[0]-left)*scale, (point[1]-top)*scale), "#40e9ff")
    if col:
        mark(cd, ((projected[0]-left)*scale, (projected[1]-top)*scale), "#ff40cd")
    panel.paste(crop, (20+col*740, 125))
    label(draw, (20+col*740, 90), title, 18)
    label(draw, (20+col*740, 610), "Observed pixel: "+str(point), 17)
panel.save(HERE / "AT341-southwest-holdout-review.png")

vertices = np.array(old["candidate"]["native_vertices"])
source_vertices = np.array([p["xy"] for p in obs["source_perimeter_vertices"]])
segments = []
for name, i, j, outer_i, outer_j in [("north", 1, 2, 0, 3), ("south", 6, 7, 5, 8), ("west", 11, 12, 10, 13)]:
    a, b = vertices[outer_i], vertices[outer_j]
    u = b-a
    def perpendicular(p):
        v = p-a
        return abs(float(u[0]*v[1]-u[1]*v[0]))/float(np.linalg.norm(u))
    segments.append({"id": name, "from_vertex": i, "to_vertex": j,
                     "native_endpoints": vertices[[i, j]].tolist(),
                     "modeled_connector_length_native_px": float(np.linalg.norm(vertices[j]-vertices[i])),
                     "offset_from_outer_approach_chord_native_px": [perpendicular(vertices[i]), perpendicular(vertices[j])],
                     "interpretation": "Straight selection-outline connection between the source-observed approach/inner-shoulder endpoints, excluding arrows and decorative square extents. Not a route or an assertion of hidden physical boundary pixels.",
                     "status": "pending_new_independent_review_of_explicit_rendered_selection_interpretation"})

# Show original closeup and native gate pixels without warping; annotate only the
# two existing proposed endpoints and dashed connector. Raw source files stay intact.
gates = Image.new("RGB", (1500, 1080), "#101827")
gd = ImageDraw.Draw(gates)
label(gd, (15, 10), "WZ04 existing connector interpretations | original pixels, separate native/source scales", 23)
for row, segment in enumerate(segments):
    i, j = segment["from_vertex"], segment["to_vertex"]
    label(gd, (15, 57+row*340), f'{segment["id"]}: {segment["modeled_connector_length_native_px"]:.3f} native-pixel modeled span', 19)
    for col, (raw, vv, span, caption) in enumerate([(photo, source_vertices, 150, "Original closeup"), (base, vertices, 40, "Native map; original icon occlusion retained")]):
        mid = (vv[i]+vv[j])/2
        left, top = math.floor(mid[0]-span/2), math.floor(mid[1]-span/2)
        crop = raw.crop((left, top, left+span, top+span)).resize((270, 270), Image.Resampling.NEAREST)
        cd = ImageDraw.Draw(crop)
        xy = (vv[[i, j]]-[left, top])*270/span
        for k in range(10):
            a = xy[0]+(xy[1]-xy[0])*k/10
            b = xy[0]+(xy[1]-xy[0])*(k+.55)/10
            cd.line([tuple(a), tuple(b)], fill="#ffad42", width=2)
        for point in xy:
            mark(cd, point, "#40e9ff")
        gates.paste(crop, (20+col*740, 95+row*340))
        label(gd, (310+col*740, 125+row*340), caption, 16)
        label(gd, (310+col*740, 160+row*340), "Orange is modeled closure.\nCyan marks existing endpoints.\nNo geometry changed.", 16)
gates.save(HERE / "AT341-gate-interpretation-review.png")

ring = vertices.tolist()+[vertices[0].tolist()]
geom = {"type": "Polygon", "coordinates": [ring]}
(HERE / "AT341-candidate-geometry.json").write_text(json.dumps(geom, indent=2)+"\n")
old_arch = [p for p in old["registration"]["points"] if p["role"] == "architecture_holdout"]
errors = [p["residual_px"] for p in old_arch]+[residual]
receipt = {
    "id": "AT341-WZ04-APPEND-ONLY-REVIEW-SUPPLEMENT", "date": "2026-11-26",
    "baseline_commit": "e003f5ffa8629c7a9c52da1bbd7bd78b9103354d", "area_id": "wz-04",
    "status": "new_evidence_pending_independent_review_historical_hold_preserved",
    "approved": False, "production_geometry": None,
    "scope": "Rendered map-selection outline only. No physical barrier, doorway, spawn extent, route, floor or traversal claim.",
    "historical_candidate": {"path": str(old_path.relative_to(ROOT)), "sha256": sha(old_path)},
    "historical_hold": {"path": str((HERE / "independent-review.json").relative_to(ROOT)), "sha256": sha(HERE / "independent-review.json"), "unchanged": True},
    "source_records": [s for s in old["sources"] if s["path"] in [obs["native_map"], obs["source"]]],
    "new_architecture_holdout": {"id": "AT341-SW1", "label": "Lower-west stepped roof southeast corner", "role": "architecture_holdout",
                                 "source_xy": source_xy, "native_xy": native_xy, "projected_native_xy": projected.tolist(),
                                 "residual_px": residual, "fit_changed": False,
                                 "observation": "The corner is visible left of the native red-cursor ring and below the existing west-side controls. It is a roof corner, unlike the earlier rejected H4 pavement-edge attempt. This newly checked point is not used for fitting or point selection."},
    "combined_architecture_holdouts": {"count": len(errors), "rms_px": math.sqrt(sum(x*x for x in errors)/len(errors)), "max_px": max(errors)},
    "unchanged_registration": {"matrix": H.tolist(), "fit": old["registration"]["metrics"]["fit"], "border_holdout": old["registration"]["metrics"]["border_holdout"]},
    "gate_connector_review": segments,
    "tolerance": {"raster_native_px": 3, "meaning": "Existing rendered-raster digitization tolerance, not physical-world uncertainty.",
                  "west_choice_note": "The western inner-shoulder connector lies up to 3.190 native px inward from the alternative outer-approach chord. That difference is explicitly reported, not rounded down to pass a three-pixel limit; the reviewer must assess the observed notch interpretation, not treat two different candidate closure choices as identical."},
    "recommendation": "Reconsider WZ04 for rendered-selection-only approval using the new southwest architectural holdout and explicit per-gate closure interpretations under the same contract used for WZ11. Do not overwrite or relabel the earlier HOLD as an approval. No independent decision is claimed here.",
    "candidate_geometry_path": str((HERE / "AT341-candidate-geometry.json").relative_to(ROOT)),
    "candidate_geometry_sha256": sha(HERE / "AT341-candidate-geometry.json"),
    "geometry_changes_from_prior": "None; copied prior projected vertices and appended the first vertex solely to express an explicitly closed GeoJSON polygon.",
    "review_artifacts": [{"path": str((HERE / name).relative_to(ROOT)), "sha256": sha(HERE/name)} for name in ["AT341-southwest-holdout-review.png", "AT341-gate-interpretation-review.png"]],
    "reproducibility": {"script_sha256": sha(HERE / "AT341-supplement-reproduce.py")},
    "independent_review": {"decision": None, "approved": False, "required": "Fresh inspection of SW1 originals, unchanged transform/holdouts, and the three modeled connectors with explicit selection-only interpretation. Preserve the historical decision."},
    "preservation": {"prior_packet_edited": False, "source_images_edited": False, "runtime_edited": False, "plans_edited": False}
}
(HERE / "AT341-supplement.json").write_text(json.dumps(receipt, indent=2)+"\n")
print(json.dumps({"new_holdout": receipt["new_architecture_holdout"], "combined": receipt["combined_architecture_holdouts"], "gate_spans": segments}, indent=2))
