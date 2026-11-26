#!/usr/bin/env python3
"""Recompute the WZ04 review supplement; never edits production or original inputs."""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.optimize import least_squares

parser = argparse.ArgumentParser()
parser.add_argument('--repo', type=Path, required=True)
args = parser.parse_args()
root = args.repo.resolve()
out = Path(__file__).resolve().parent
packet = 'docs/qa/candidates/wz04-2026-11-26'
published = packet + '/selection-review'

def read(path):
    return json.loads(path.read_text())

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def write(name, value):
    (out / name).write_text(json.dumps(value, indent=2) + '\n')

c = read(root / packet / 'candidate-evidence.json')
original = read(root / packet / 'manual-observations.json')
observation = read(out / 'southwest-refined-observation.json')
H = np.array(c['registration']['source_to_native_matrix'], dtype=float)

def project(point, matrix=H):
    q = matrix @ np.r_[point, 1.0]
    return q[:2] / q[2]

verified = []
for record in c['sources'] + c['review_artifacts']:
    actual = sha(root / record['path'])
    assert actual == record['sha256'], record['path']
    verified.append({'path': record['path'], 'sha256': actual, 'matches': True})
assert sha(root / packet / 'manual-observations.json') == c['reproducibility']['observations_sha256']
assert sha(root / packet / 'reproduce.py') == c['reproducibility']['script_sha256']

# Independently derive the supplementary landmark from fixed original-pixel
# windows. These calculations do not use the homography or its residuals.
source_luma = np.array(Image.open(root / observation['source_path']).convert('L'), dtype=float)
native_luma = np.array(Image.open(root / observation['native_path']).convert('L'), dtype=float)
source_corner = [50 + int(np.argmin(np.median(source_luma[658:667, 50:70], axis=0))),
                 665 + int(np.argmin(np.median(source_luma[665:679, 40:55], axis=1)))]
native_corner = [918 + int(np.argmin(np.median(native_luma[341:347, 918:936], axis=0))),
                 345 + int(np.argmin(np.median(native_luma[345:356, 918:926], axis=1)))]
assert source_corner == observation['source_xy']
assert native_corner == observation['native_xy']
projection = project(source_corner)
supplement_error = float(np.linalg.norm(projection - native_corner))
result = dict(observation, candidate_projection_native_xy=projection.tolist(),
              residual_px=supplement_error, fit_changed=False, candidate_vertices_changed=False)
write('southwest-refined-check-result.json', result)

metrics = {}
residuals = {}
for role in ['fit', 'architecture_holdout', 'border_holdout']:
    rows = [x for x in original['points'] if x['role'] == role]
    values = [float(np.linalg.norm(project(x['source_xy']) - x['native_xy'])) for x in rows]
    if role == 'architecture_holdout':
        values.append(supplement_error)
    residuals[role] = values
    metrics[role] = {'count': len(values), 'rms_px': float(np.sqrt(np.mean(np.square(values)))),
                     'max_px': max(values)}
vertices = c['candidate']['native_vertices']
source_vertices = np.array([v['xy'] for v in original['source_perimeter_vertices']])
projection_error = float(np.max(np.linalg.norm(np.array([project(v) for v in source_vertices]) - vertices, axis=1)))
assert projection_error < 1e-9

# Diagnostic only: alternative fits are not adopted. A missing northeast anchor
# produces an invalid alternative that the unchanged independent checks reject.
fit_rows = [x for x in original['points'] if x['role'] == 'fit']
S = np.array([x['source_xy'] for x in fit_rows], dtype=float)
D = np.array([x['native_xy'] for x in fit_rows], dtype=float)
check_rows = [x for x in original['points'] if x['role'] in ['architecture_holdout', 'border_holdout']]
check_rows.append({'source_xy': source_corner, 'native_xy': native_corner})
sensitivity = []
for i in range(len(S)):
    s, d = np.delete(S, i, axis=0), np.delete(D, i, axis=0)
    def residual(v):
        matrix = np.r_[v, 1.0].reshape(3, 3)
        return (np.array([project(p, matrix) for p in s]) - d).ravel()
    opt = least_squares(residual, H.ravel()[:8], method='lm', xtol=1e-12, ftol=1e-12,
                        gtol=1e-12, max_nfev=3000)
    alternative = np.r_[opt.x, 1.0].reshape(3, 3)
    shifts = np.linalg.norm(np.array([project(p, alternative) for p in source_vertices]) - vertices, axis=1)
    sensitivity.append({'omitted_control': fit_rows[i]['id'], 'success': bool(opt.success),
                        'max_vertex_shift_px': float(max(shifts)), 'southwest_shift_px': float(shifts[9]),
                        'independent_check_max_px': max(float(np.linalg.norm(project(x['source_xy'], alternative) - x['native_xy'])) for x in check_rows)})

panel = Image.new('RGB', (1060, 585), '#111827')
draw = ImageDraw.Draw(panel)
draw.text((12, 10), 'WZ04 independent southwest roof CORNER; original stroke-centre check; unchanged candidate transform', fill='white')
parts = [('Original closeup: roof outline intersection', observation['source_path'], (30, 625, 90, 685), 7, source_corner, None),
         ('Original native map: same roof corner', observation['native_path'], (911, 334, 943, 366), 13, native_corner, projection)]
for i, (name, path, box, scale, picked, projected) in enumerate(parts):
    x, y = 15 + i * 530, 65
    raster = Image.open(root / path).convert('RGB').crop(box)
    raster = raster.resize(((box[2] - box[0]) * scale, (box[3] - box[1]) * scale), Image.Resampling.NEAREST)
    panel.paste(raster, (x, y))
    draw.text((x, 40), name, fill='white')
    for point, colour in [(picked, 'cyan'), (projected, 'magenta')]:
        if point is None:
            continue
        cx, cy = x + (point[0] - box[0]) * scale, y + (point[1] - box[1]) * scale
        draw.line((cx - 11, cy, cx + 11, cy), fill=colour, width=2)
        draw.line((cx, cy - 11, cx, cy + 11), fill=colour, width=2)
    draw.text((x, 495), 'Cyan independently picked stroke intersection: ' + str(picked), fill='white')
    if projected is not None:
        draw.text((x, 515), 'Magenta projection: ' + str([round(float(v), 4) for v in projected]), fill='white')
draw.text((15, 548), 'Residual %.6f native px. Initial source edge pick was rejected and retained; no fit/geometry changed.' % supplement_error, fill='white')
draw.text((15, 565), 'Image check only; no walking, spawn, floor or physical-accuracy claim.', fill='white')
panel.save(out / 'southwest-refined-check-review.png')

review = {
    'id': 'WZ04-INDEPENDENT-SELECTION-REVIEW-2026-11-26',
    'date': '2026-11-26',
    'reviewer': 'geometry_evidence_independent_original_image_review',
    'decision': 'approved_for_rendered_map_selection_only',
    'scope': c['scope'].replace(' candidate', ''),
    'candidate_evidence_sha256': sha(root / packet / 'candidate-evidence.json'),
    'manual_observations_sha256': sha(root / packet / 'manual-observations.json'),
    'historical_hold_sha256': sha(root / packet / 'independent-review.json'),
    'historical_hold_preserved': True,
    'change_from_hold': 'The same limited entry-opening convention already approved for WZ02/03/05/11/16 is applied explicitly to the existing WZ04 connector segments; a new independent southwest roof-corner check addresses the prior absence of southwest architectural checking. Original candidate, original hold, controls, transform, source bytes and fourteen vertices are unchanged.',
    'review': {'boundary': True, 'registration': True, 'independent': True, 'occlusion': True},
    'observations': [
        'The original closeup shows all four green perimeter corners. Its interior cursor does not cover the west or southwest perimeter hidden by the cursor on the native map.',
        'The original overview independently shows the same rectangle and southwest corner; its Travel Here control covers only part of the southern span, which the closeup supplies.',
        'The two retained PR200 owner views corroborate footprint and gate positions. Their higher-error affine registrations are contextual only and do not determine or refine the approved geometry.',
        'All six fitted architectural correspondences are identifiable. Original H4 remains rejected as a plain edge, and all first-pass B4/B5 picks and corrections remain recorded.',
        'The new southwest check is outside the native cursor. An initial source point above the actual corner was rejected despite a low residual. Independent original-pixel stroke intersections identify the replacement without fitting or modifying the transform.',
        'North connector 1-2 joins the visible line approaches; south connector 6-7 and west connector 11-12 join visible inner shoulders. These are explicitly accepted display-footprint closures, not newly observed continuous physical boundary lines. Gate square/arrow decorations are excluded.',
        'Three native pixels is the same declared raster/manual digitization tolerance used by current approvals. It is not a confidence interval, geographic error bound, or proof of walkability/spawn extent.'
    ],
    'registration': {'source_to_native_matrix': c['registration']['source_to_native_matrix'],
                     'original_metrics_preserved': c['registration']['metrics'],
                     'metrics_including_new_southwest_check': metrics,
                     'new_southwest_check': result,
                     'threshold_px': 3, 'declared_raster_digitization_tolerance_px': 3,
                     'candidate_projection_difference_max_px': projection_error},
    'accepted_display_connector_segments': [{
        'from_vertex': segment['from_vertex'],
        'to_vertex': segment['to_vertex'],
        'historical_candidate_reason': segment['reason'],
        'selection_review_decision': 'accepted_for_rendered_map_selection_only',
        'selection_review_reason': {
            (1, 2): 'The unchanged straight connector joins the two visible north green-line approaches across the gate symbol. Accept it as bounded display-footprint closure under the existing entry-opening convention; no continuous hidden line, traversable entrance or physical boundary is claimed.',
            (6, 7): 'The unchanged connector joins the visible south inner shoulders and excludes the gate arrow and filled-square decorations. Accept it as bounded display-footprint closure under the existing entry-opening convention; no route or observed hidden physical edge is claimed.',
            (11, 12): 'The unchanged connector joins the visible west inner shoulders exposed by the original closeup and excludes the gate decorations. Accept it as bounded display-footprint closure under the existing entry-opening convention; no entrance-accessibility or observed hidden physical edge is claimed.'
        }[(segment['from_vertex'], segment['to_vertex'])]
    } for segment in c['candidate']['unresolved_segments']],
    'geometry_unchanged': {'native_vertices': vertices, 'topology': c['topology']},
    'source_and_original_panel_hashes_verified': verified,
    'supplementary_artifacts': [{'path': published + '/' + name, 'sha256': sha(out / name)} for name in
                              ['southwest-refined-observation.json', 'southwest-refined-check-result.json', 'southwest-refined-check-review.png', 'build_independent_review.py']],
    'sensitivity_analysis': {'scope': 'Diagnostic alternative fits only; no alternative adopted and no uniform error bound inferred.',
                             'results': sensitivity,
                             'interpretation': 'Omitting F4 creates a weak alternative with large errors; the independent northeast checks reject it. F4 itself is an identifiable corner and remains in the unchanged full fit. Other omissions and all residuals are retained rather than selectively hidden.'},
    'release_effect': 'One additional reviewed selection outline, WZ04. No roster completion, route, floor, spawn extent, precise pickup, other boundary, live publication or final CI approval.'
}
write('independent-selection-review.json', review)

claims = {
    'maps/lumiose-game-map.jpg': 'Original native map identity and visible green perimeter; native cursor-occluded west/southwest spans are supplied by the owner closeup.',
    'assets/atlas/wild-zones/wild-zone-04-closeup.png': 'Owner closeup supplies all four corners and visible gate shoulders; six architectural fit controls and nine independent checks support registration.',
    'assets/atlas/wild-zones/wild-zone-04-overview.png': 'Owner overview independently corroborates identity, footprint and southwest corner; its Travel Here overlay is excluded.',
    'assets/atlas/city-overview/owner-crops-2026-11-26/1000028696.jpg': 'Independent owner context corroborates rectangle and gate positions; its higher-error affine registration does not determine the polygon.',
    'assets/atlas/city-overview/owner-crops-2026-11-26/1000028700.jpg': 'Independent owner context corroborates rectangle and gate positions; its higher-error affine registration does not determine the polygon.'
}
max_error = max(v for values in residuals.values() for v in values)
all_checks = residuals['architecture_holdout'] + residuals['border_holdout']
record = {
    'area_id': 'wz-04', 'status': 'approved', 'kind': 'zone', 'coordinateSpace': 'atlas-native-pixels',
    'mapSha256': c['sources'][0]['sha256'],
    'geometry': {'type': 'Polygon', 'coordinates': [vertices + [vertices[0]]]},
    'sources': [{'path': s['path'], 'sha256': s['sha256'], 'claim': claims[s['path']]} for s in c['sources'] if s['path'] in claims],
    'registration': {
        'method': 'Unchanged six-control architecture homography; five border and four independent architecture checks, including a new southwest roof corner. Visible source perimeter and bounded gate-shoulder closures reviewed separately.',
        'control_count': 6, 'holdout_count': 9, 'max_error_px': max_error, 'uncertainty_px': 3, 'threshold_px': 3,
        'fit_rms_px': metrics['fit']['rms_px'], 'holdout_rms_px': float(np.sqrt(np.mean(np.square(all_checks)))),
        'holdout_max_px': max(all_checks), 'border_holdout_count': 5,
        'independent_architecture_holdout_count': 4,
        'independent_architecture_rms_px': metrics['architecture_holdout']['rms_px'],
        'independent_architecture_max_px': metrics['architecture_holdout']['max_px'],
        'evidence_id': review['id'], 'evidence_path': published + '/independent-selection-review.json'
    },
    'review': review['review'],
    'notes': [
        'Rendered map-selection footprint only; not a traversal boundary, floor, route, entrance-accessibility, physical-geography or species encounter extent. Full area scope remains incomplete.',
        'Three native pixels is stated raster/manual digitization tolerance for finite green line width, antialiasing and entry-opening treatment, not a statistical bound on world position.',
        'Existing approximate marker centre, original source bytes, six-control transform and fourteen candidate vertices are unchanged.',
        'Three short gate-symbol spans are accepted display-footprint closures between observed line approaches or shoulders. Their hidden continuous line is not claimed as directly observed, and they create no walking route.',
        'The native cursor obscures the west/southwest perimeter. Original owner closeup supplies those edges; a separate southwest roof-corner check supports the registration in that region.',
        'The prior HOLD and rejected automatic contours remain as historical evidence; the later independent selection review records the narrowed decision and additional southwest check.'
    ],
    'independent_review': {
        'date': review['date'], 'reviewer': review['reviewer'],
        'review_panel_path': packet + '/registered-source-review.png',
        'review_panel_sha256': sha(root / packet / 'registered-source-review.png'),
        'supplementary_review_panel_path': published + '/southwest-refined-check-review.png',
        'supplementary_review_panel_sha256': sha(out / 'southwest-refined-check-review.png'),
        'decision': review['decision'],
        'review_receipt_path': published + '/independent-selection-review.json',
        'review_receipt_sha256': sha(out / 'independent-selection-review.json')
    }
}
assert len(record['registration']['method']) <= 240
write('wz04-approved-record.json', record)
print(json.dumps({'decision': review['decision'], 'exact_candidate_preserved': True,
                  'metrics': metrics, 'ready_record': str(out / 'wz04-approved-record.json'),
                  'review_receipt': str(out / 'independent-selection-review.json')}, indent=2))
