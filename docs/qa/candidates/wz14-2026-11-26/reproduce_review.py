#!/usr/bin/env python3
"""Deterministically verify/rebuild the WZ14 selection-outline receipt/record.

python reproduce_review.py --repo /path/to/atlas
Only this evidence directory receives writes. Historical observations, first fit,
candidate geometry, source files and reviewed panels remain unchanged.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.optimize import least_squares

HERE = Path(__file__).resolve().parent
DEST = 'docs/qa/candidates/wz14-2026-11-26'
ID = 'WZ14-SELECTION-REVIEW-2026-11-26'
MAP_HASH = '4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade'


def read(name):
    return json.loads((HERE / name).read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(name, data):
    (HERE / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')


def project(matrix, points):
    points = np.asarray(points, dtype=float)
    q = np.column_stack([points, np.ones(len(points))]) @ matrix.T
    return q[:, :2] / q[:, 2:]


def stats(errors):
    x = np.array(errors)
    return {'count': len(x), 'rms_px': float(np.sqrt(np.mean(x*x))), 'max_px': float(x.max())}


def cross(a, b):
    return float(a[0]*b[1] - a[1]*b[0])


def topology(vertices):
    n = len(vertices)
    intersections = []
    for i in range(n):
        a, b = vertices[i], vertices[(i+1) % n]
        for j in range(i+1, n):
            if j == i+1 or (j+1) % n == i:
                continue
            c, d = vertices[j], vertices[(j+1) % n]
            if cross(b-a, c-a)*cross(b-a, d-a) < 0 and cross(d-c, a-c)*cross(d-c, b-c) < 0:
                intersections.append([i, j])
    area = abs(sum(cross(vertices[i], vertices[(i+1) % n]) for i in range(n))) / 2
    assert not intersections and area > 0
    assert np.isfinite(vertices).all() and ((vertices >= 0) & (vertices <= 1920)).all()
    assert len(set(map(tuple, vertices))) == n
    return {'unique_vertex_count': n, 'finite': True, 'in_native_bounds': True,
            'self_intersections': intersections, 'area_native_px2': area}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', required=True, type=Path)
    repo = parser.parse_args().repo.resolve()
    frozen = read('frozen-input-hashes.json')
    for item in frozen['files']:
        base = repo if item['base'] == 'repository' else HERE
        assert sha(base / item['path']) == item['sha256'], 'Changed frozen input: ' + item['path']

    original = read('manual-observations.json')
    first_fit = read('first-fit.json')
    previous_review = read('reviewed-registration.json')
    correction = read('h2-correction-result.json')
    candidate = read('perimeter-candidate.json')
    H = np.array(first_fit['source_to_native_matrix'])
    points = copy.deepcopy(original['points'])
    for point in points:
        if point['id'] == correction['id']:
            assert point['role'] == 'architecture_holdout'
            assert point['source_xy'] == correction['source_xy_unchanged']
            point['native_xy'] = correction['reviewed_native_xy']
            point['first_native_xy'] = correction['first_native_xy']
            point['first_error_px'] = correction['first_error_px']
        pred = project(H, [point['source_xy']])[0]
        point['projected_native_xy'] = pred.tolist()
        point['residual_px'] = float(np.linalg.norm(pred - point['native_xy']))
    metrics = {}
    for role in ('fit', 'architecture_holdout', 'border_holdout'):
        metrics[role] = stats([x['residual_px'] for x in points if x['role'] == role])
        assert metrics[role]['max_px'] <= 3
        assert np.isclose(metrics[role]['rms_px'], previous_review['metrics'][role]['rms_px'], atol=1e-10)
    combined = stats([x['residual_px'] for x in points if x['role'] != 'fit'])
    assert metrics['fit']['count'] == 7 and combined['count'] == 9

    # Rebuild the original fixed fit from original controls and initializer only.
    fit = [x for x in original['points'] if x['role'] == 'fit']
    src = np.array([x['source_xy'] for x in fit])
    tar = np.array([x['native_xy'] for x in fit])
    initializer = read('landmark-plan-before-fit.json')['context_only_transform']
    def residual(params):
        return (project(np.r_[params, 1].reshape(3, 3), src) - tar).ravel()
    replay = least_squares(residual, np.asarray(initializer).ravel()[:8], method='lm')
    assert replay.success
    replay_H = np.r_[replay.x, 1].reshape(3, 3)

    # Rebuild the nine western curve samples from original image pixels.
    image = np.asarray(Image.open(repo / original['source']).convert('RGB'), dtype=int)
    samples = []
    for y in range(180, 661, 60):
        row = image[y, 300:530]
        green = (row[:, 1]-row[:, 0] > 25) & (row[:, 1]-row[:, 2] > 15) & (row[:, 1] > 50)
        first = int(np.flatnonzero(green)[0] + 300)
        xs = np.arange(first, first+15)
        pixels = image[y, xs]
        valid = (pixels[:, 1]-pixels[:, 0] > 25) & (pixels[:, 1]-pixels[:, 2] > 15) & (pixels[:, 1] > 50)
        brightness = pixels.mean(axis=1)
        brightness[~valid] = np.inf
        samples.append({'y': y, 'first_green_x': first, 'picked_line_x': int(xs[np.argmin(brightness)])})
    assert samples == candidate['west_trace_samples']
    source_vertices = np.array(candidate['source_vertices'], dtype=float)
    assert source_vertices[11:].tolist() == [[x['picked_line_x'], x['y']] for x in reversed(samples)]
    vertices = project(H, source_vertices)
    projection_difference = float(np.linalg.norm(vertices - candidate['native_vertices'], axis=1).max())
    replay_difference = float(np.linalg.norm(vertices - project(replay_H, source_vertices), axis=1).max())
    assert projection_difference < 1e-10 and replay_difference < .001
    topo = topology(vertices)
    connector = dict(candidate['connectors'][0])
    connector['selection_review_decision'] = 'accepted_for_rendered_map_selection_only'
    connector['selection_review_reason'] = 'The original closeup and overview expose both northern green-line approaches. Their short straight connection closes the rendered footprint across the entrance squares. Squares/arrows do not define geometry, and no continuous hidden physical boundary or traversable entrance is claimed.'
    connector['native_endpoint_distance_px'] = float(np.linalg.norm(vertices[2] - vertices[1]))

    receipt = {
        'id': ID, 'date': '2026-11-26', 'reviewer': 'geometry_evidence_original_image_review',
        'decision': 'approved_for_rendered_map_selection_only',
        'scope': 'Rendered map-selection footprint only. No physical, spawn, walking, floor, route, accessible-entrance or comprehensive encounter-extent claim.',
        'review': {'boundary': True, 'registration': True, 'independent': True, 'occlusion': True},
        'root_visual_review': read('root-visual-review.json'),
        'observations': [
            'The closeup exposes the entire west curve, northwest corner, northeast bevel and southwest/south corners. The interior zone badge is excluded. The red cursor ring interrupts only two short portions of the eastern green line; the line inside the ring remains visible, and the original overview exposes the corresponding eastern span.',
            'The native badge covers central/eastern perimeter segments. Those segments come from the registered closeup and overview corroboration; no badge/cursor silhouette is traced.',
            'Seven independently picked architectural controls determine the closeup-to-native homography. Five architecture and four perimeter observations were held out with roles fixed before fitting. No green boundary, gate icon, text, badge or cursor was fitted.',
            'Provisional context crops and first inaccurate stroke picks were refined by inspecting original pixels before the first architecture fit. All provisional plans, first picks, panels and original fixed observations remain.',
            'H2 was the sole failing first-fit heldout check (4.855321 px). Original pixels show its first native target in the light green gap west of the intended roof. The separate corrected roof-junction pick, confirmed by root against its original source counterpart, gives 1.039512 px. No fit, control, source point or matrix changed, and the failure remains recorded.',
            'All other control and holdout points remain as originally fixed. The reviewed maximum observed error is 2.458116 px; the same 3 px raster/manual digitization tolerance applies. This is not a statistical confidence interval or proof of physical game boundaries.',
            'The west curve is traced at fixed y samples from original green stroke pixels, not forced into a straight quadrilateral, circle or ellipse.',
            'The north entrance span is explicitly a display closure between observed line approaches. It does not invent an accessible entrance or claim the hidden physical line was observed.',
            'All six retained indirect descriptor candidates remain unapproved. They supplied source context only and did not determine fitted controls or the approved transform.'
        ],
        'registration': {'source_to_native_matrix': H.tolist(), 'original_matrix_unchanged': True,
                         'metrics': metrics, 'combined_holdouts': combined, 'threshold_px': 3,
                         'declared_raster_digitization_tolerance_px': 3,
                         'original_fit_replay_max_vertex_difference_px': replay_difference,
                         'candidate_projection_difference_max_px': projection_difference},
        'accepted_display_connector_segments': [connector],
        'reviewed_cursor_occlusions': candidate['cursor_occlusion_spans'],
        'h2_correction': correction,
        'geometry': {'source_vertices': source_vertices.tolist(), 'native_vertices': vertices.tolist(), 'topology': topo},
        'frozen_inputs_verified': frozen,
        'reproduction_script': {'path': DEST + '/reproduce_review.py', 'sha256': sha(HERE / 'reproduce_review.py')},
        'release_effect': 'One additional reviewed selection outline, WZ14. Original photographs, approximate marker center, rosters and player state remain unchanged. No full-plan completion, live publication or final CI claim.'
    }
    write('selection-review-receipt.json', receipt)
    sources = [
        {'path': 'maps/lumiose-game-map.jpg', 'claim': 'Native map identity and independently selected architecture/perimeter targets. Large badge occlusions are supplied by original owner images.'},
        {'path': original['source'], 'claim': 'Original owner closeup supplies seven architecture controls, nine heldout checks, west-curve samples and visible perimeter/gate approaches. Badge and cursor decorations are excluded.'},
        {'path': 'assets/atlas/wild-zones/wild-zone-14-overview.png', 'claim': 'Original owner overview corroborates zone identity, north/west footprint and the eastern line partly crossed by the closeup cursor. Its own badge/Travel Here overlays are excluded; it is not fitted calibration.'}
    ]
    for item in sources:
        item['sha256'] = sha(repo / item['path'])
    assert sources[0]['sha256'] == MAP_HASH
    record = {
        'area_id': 'wz-14', 'status': 'approved', 'kind': 'zone',
        'coordinateSpace': 'atlas-native-pixels', 'mapSha256': MAP_HASH,
        'geometry': {'type': 'Polygon', 'coordinates': [vertices.tolist() + [vertices[0].tolist()]]},
        'sources': sources,
        'registration': {
            'method': 'Seven-control architecture homography; five architecture and four perimeter holdouts. Original-pixel correction of one heldout roof corner leaves the fit unchanged. Visible curve, cursor occlusions and north display closure reviewed.',
            'control_count': 7, 'holdout_count': 9,
            'max_error_px': max(x['max_px'] for x in metrics.values()), 'uncertainty_px': 3, 'threshold_px': 3,
            'fit_rms_px': metrics['fit']['rms_px'], 'holdout_rms_px': combined['rms_px'], 'holdout_max_px': combined['max_px'],
            'border_holdout_count': 4, 'independent_architecture_holdout_count': 5,
            'independent_architecture_rms_px': metrics['architecture_holdout']['rms_px'],
            'independent_architecture_max_px': metrics['architecture_holdout']['max_px'],
            'evidence_id': ID, 'evidence_path': DEST + '/selection-review-receipt.json'
        },
        'review': receipt['review'],
        'notes': [
            'Rendered map-selection footprint only; no physical, walking, floor, accessible-entrance, route, spawn or complete encounter-extent claim. Full area scope remains incomplete.',
            'Three native pixels is observed raster/manual digitization tolerance, not a statistical confidence interval or guarantee about hidden game-world edges.',
            'Original closeup supplies the curved west side and corners. Its two short eastern cursor-ring crossings are checked against visible approaches/internal line and the matching original overview. Native badge silhouette is excluded.',
            'One northern gate-symbol span is an explicit display closure between observed approaches. No continuous hidden physical line or accessible entrance is asserted.',
            'The failed first H2 pick/error and original fit are retained. Only the demonstrably misplaced heldout target was corrected from original pixel identity; no control, fitted matrix or perimeter candidate changed.',
            'Existing approximate marker center, original source bytes, player state and roster status are unchanged.'
        ],
        'independent_review': {
            'date': '2026-11-26', 'reviewer': 'geometry_evidence_original_image_review_with_root_visual_crosscheck',
            'review_panel_path': DEST + '/source-perimeter-review.png', 'review_panel_sha256': sha(HERE / 'source-perimeter-review.png'),
            'supplementary_review_panel_path': DEST + '/h2-matching-source-pair.png', 'supplementary_review_panel_sha256': sha(HERE / 'h2-matching-source-pair.png'),
            'decision': 'approved_for_rendered_map_selection_only',
            'review_receipt_path': DEST + '/selection-review-receipt.json', 'review_receipt_sha256': sha(HERE / 'selection-review-receipt.json')
        }
    }
    assert len(record['registration']['method']) <= 240
    write('wz14-approved-record.json', record)
    print(json.dumps({'vertices': len(vertices), 'metrics': metrics, 'combined_holdouts': combined,
                      'replay_max_vertex_difference_px': replay_difference,
                      'receipt_sha256': sha(HERE / 'selection-review-receipt.json'),
                      'record_sha256': sha(HERE / 'wz14-approved-record.json')}, indent=2))


if __name__ == '__main__':
    main()
