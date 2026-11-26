#!/usr/bin/env python3
"""Verify frozen WZ13 evidence and deterministically rebuild its review/record.

Run: python reproduce_review.py --repo /path/to/atlas
Requires numpy, scipy and Pillow. It never edits the repository supplied by
--repo, refits using holdouts, or modifies any historical candidate/first fit.
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
DEST = "docs/qa/candidates/wz13-2026-11-26"
ID = "WZ13-SELECTION-REVIEW-2026-11-26"
MAP_HASH = "4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade"


def read(name):
    return json.loads((HERE / name).read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(name, value):
    (HERE / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")


def project(matrix, points):
    points = np.asarray(points, dtype=float)
    q = np.column_stack([points, np.ones(len(points))]) @ matrix.T
    return q[:, :2] / q[:, 2:]


def stats(errors):
    a = np.asarray(errors)
    return {"count": len(a), "rms_px": float(np.sqrt(np.mean(a*a))), "max_px": float(a.max())}


def refit_diagnostic(points, target_key, initializer):
    fit = [x for x in points if x['role'] == 'fit']
    src = np.array([x['source_xy'] for x in fit])
    tar = np.array([x[target_key] for x in fit])
    def residual(params):
        h = np.r_[params, 1].reshape((3, 3))
        return (project(h, src) - tar).ravel()
    result = least_squares(residual, np.asarray(initializer).ravel()[:8], method='lm')
    assert result.success
    return np.r_[result.x, 1].reshape((3, 3))


def cross(a, b):
    return float(a[0]*b[1] - a[1]*b[0])


def topology(vertices):
    n = len(vertices)
    crossings = []
    for i in range(n):
        a, b = vertices[i], vertices[(i+1) % n]
        for j in range(i+1, n):
            if j in (i, (i+1) % n) or (j+1) % n == i:
                continue
            c, d = vertices[j], vertices[(j+1) % n]
            if cross(b-a, c-a)*cross(b-a, d-a) < 0 and cross(d-c, a-c)*cross(d-c, b-c) < 0:
                crossings.append([i, j])
    area = abs(sum(cross(vertices[i], vertices[(i+1) % n]) for i in range(n))) / 2
    assert not crossings and area > 0
    assert np.isfinite(vertices).all() and ((vertices >= 0) & (vertices <= 1920)).all()
    assert len(set(map(tuple, vertices))) == n
    return {"unique_vertex_count": n, "finite": True, "in_native_bounds": True,
            "self_intersections": crossings, "area_native_px2": area}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', required=True, type=Path)
    args = parser.parse_args()
    repo = args.repo.resolve()
    frozen = read('frozen-input-hashes.json')
    for item in frozen['files']:
        base = repo if item['base'] == 'repository' else HERE
        assert sha(base / item['path']) == item['sha256'], f"Frozen input changed: {item['path']}"

    overview_observations = read('overview-manual-observations.json')
    closeup_observations = read('closeup-manual-observations.json')
    direct_observations = read('independent-native-checks.json')
    original_overview = read('overview-first-fit.json')
    original_closeup = read('closeup-first-fit.json')
    previous = read('reviewed-registration.json')
    candidate = read('perimeter-candidate.json')
    N = np.array(original_overview['source_to_native_matrix'])
    L = np.array(original_closeup['closeup_to_overview_matrix'])
    H = np.array(original_closeup['composed_closeup_to_native_matrix'])
    composed = N @ L
    composed /= composed[2, 2]
    assert np.allclose(H, composed, rtol=0, atol=1e-12)

    # Corrected holdouts are separate, immutable observations. Neither stage is
    # refitted after these feature-identity corrections. All first picks remain.
    overview = copy.deepcopy(overview_observations['points'])
    for point in overview:
        for correction in direct_observations['overview_holdout_corrections']:
            if point['id'] == correction['id']:
                for key in ('source_xy', 'native_xy'):
                    if 'reviewed_' + key in correction:
                        point[key] = correction['reviewed_' + key]
        if point['native_xy'] is not None:
            pred = project(N, [point['source_xy']])[0]
            point['projected_native_xy'] = pred.tolist()
            point['residual_px'] = float(np.linalg.norm(pred - point['native_xy']))
    closeup = copy.deepcopy(closeup_observations['points'])
    for point in closeup:
        for correction in direct_observations['closeup_holdout_corrections']:
            if point['id'] == correction['id']:
                point['overview_xy'] = correction['reviewed_overview_xy']
        if point['overview_xy'] is not None:
            pred = project(L, [point['source_xy']])[0]
            point['projected_overview_xy'] = pred.tolist()
            point['residual_overview_px'] = float(np.linalg.norm(pred - point['overview_xy']))
            point['residual_native_equivalent_px'] = float(np.linalg.norm(
                project(N, [pred])[0] - project(N, [point['overview_xy']])[0]))
    direct = copy.deepcopy(direct_observations['points'])
    for point in direct:
        pred = project(H, [point['source_xy']])[0]
        point['projected_native_xy'] = pred.tolist()
        point['residual_px'] = float(np.linalg.norm(pred - point['native_xy']))

    metrics = {}
    for name, points, key in [('overview', overview, 'residual_px'),
                               ('closeup', closeup, 'residual_native_equivalent_px'),
                               ('native', direct, 'residual_px')]:
        metrics[name] = {}
        for role in ('fit', 'architecture_holdout', 'border_holdout'):
            values = [p[key] for p in points if p['role'] == role]
            if values:
                metrics[name][role] = stats(values)
                assert metrics[name][role]['max_px'] <= 3
                assert np.isclose(metrics[name][role]['rms_px'], previous[name + '_metrics'][role]['rms_px'], atol=1e-10)
    all_direct = stats([p['residual_px'] for p in direct])

    # Reproduce the deterministic north-curve sampling from actual source pixels.
    source = np.asarray(Image.open(repo / closeup_observations['source']).convert('RGB'), dtype=int)
    samples = []
    for x in range(180, 1201, 60):
        rgb = source[180:420, x]
        green = (rgb[:, 1] - rgb[:, 0] > 25) & (rgb[:, 1] - rgb[:, 2] > 15) & (rgb[:, 1] > 50)
        first = np.flatnonzero(green)[0] + 180
        ys = np.arange(first, first+15)
        pixels = source[ys, x]
        eligible = (pixels[:, 1]-pixels[:, 0] > 25) & (pixels[:, 1]-pixels[:, 2] > 15) & (pixels[:, 1] > 50)
        # The initial sampler used unweighted RGB mean for dark-stroke
        # selection; do not substitute a different colour-space luminance.
        luminance = pixels.mean(axis=1)
        luminance[~eligible] = np.inf
        picked = int(ys[np.argmin(luminance)])
        samples.append({'x': x, 'first_green_y': int(first), 'picked_line_y': picked})
    assert samples == candidate['north_trace_samples']
    source_vertices = np.array(candidate['source_vertices'], dtype=float)
    assert source_vertices[1:19].tolist() == [[s['x'], s['picked_line_y']] for s in samples]
    vertices = project(H, source_vertices)
    difference = float(np.linalg.norm(vertices - candidate['native_vertices'], axis=1).max())
    assert difference < 1e-10
    topo = topology(vertices)

    # Independent reproduction of the original fits is a diagnostic only. The
    # exact first-fit matrices above determine the record and are never replaced.
    N_again = refit_diagnostic(overview_observations['points'], 'native_xy', read('retained-raw-via-city-candidate.json')['matrix'])
    L_again = refit_diagnostic(closeup_observations['points'], 'overview_xy', read('closeup-landmark-plan-before-fit.json')['context_only_transform'])
    H_again = N_again @ L_again
    H_again /= H_again[2, 2]
    replay_shift = float(np.linalg.norm(project(H_again, source_vertices)-vertices, axis=1).max())
    assert replay_shift < .001, replay_shift

    # This alternative hidden-corner construction is NOT adopted geometry and is
    # not evidence about the game. It makes the southeast closure choice visible.
    a, b, c, d = source_vertices[[21, 22, 23, 24]]
    t = np.linalg.solve(np.column_stack([b-a, -(d-c)]), c-a)
    diagnostic = a + t[0]*(b-a)
    q, u, v = project(H, [diagnostic, b, c])
    connector_alternative_distance = abs(cross(v-u, q-u))/np.linalg.norm(v-u)
    connector_notes = [
        "Joins the two visible northeast green-line approaches across the entrance icon. The approaches support a near-straight display closure; no continuous hidden physical line is asserted.",
        "Joins the visible southeast vertical and lower green-line approaches across two entrance squares. The actual intervening corner is obscured. This short diagonal is an explicit display closure, not a newly observed hidden corner or a game-world boundary.",
        "Joins the two visible western green-line approaches across the entrance icon; the filled square and arrow decorations are excluded. This is a display closure, not an accessible entrance or route claim."
    ]
    connectors = []
    for item, reason in zip(candidate['connectors'], connector_notes):
        entry = dict(item)
        entry['selection_review_decision'] = 'accepted_for_rendered_map_selection_only'
        entry['selection_review_reason'] = reason
        entry['native_endpoint_distance_px'] = float(np.linalg.norm(vertices[item['to_vertex']]-vertices[item['from_vertex']]))
        connectors.append(entry)

    receipt = {
        'id': ID, 'date': '2026-11-26',
        'reviewer': 'geometry_evidence_original_image_review',
        'decision': 'approved_for_rendered_map_selection_only',
        'scope': 'Rendered map-selection footprint only. No physical, spawn, walking, floor, route, accessible-entrance or comprehensive encounter-extent claim.',
        'review': {'boundary': True, 'registration': True, 'independent': True, 'occlusion': True},
        'root_visual_review': {
            'date': '2026-11-26', 'reviewer': 'root',
            'observed_panels': ['source-perimeter-review.png', 'registered-native-panel.png', 'registered-closeup-panel.png', 'registered-overview-panel.png', 'overview-landmarks-1.png', 'overview-landmarks-2.png', 'overview-landmarks-3.png', 'closeup_native-landmarks-1.png', 'closeup_native-landmarks-2.png'],
            'finding': 'Root directly inspected the perimeter, registration and landmark panels. The trace follows the visible green perimeter; mapped visible approaches and architecture correspondences align; rejected H5/B3 are correctly excluded. NC5/6 show finite raster-pick uncertainty and do not establish a hidden-edge bound. The three orange entrance spans retain the display-closure distinction including the southeast occlusion. No material issue observed.'
        },
        'observations': [
            'The original closeup exposes the curved north edge and all non-entrance perimeter bends. Its cursor and zone badge are internal to the footprint. The larger native badge obscures much of the central perimeter; those segments come from the registered original closeup, not the badge silhouette.',
            'The original overview independently corroborates the visible east, west and southwest footprint and north approaches. Its badge/cursor and Travel Here control are excluded from geometry and matching.',
            'Seven manually identified architecture controls register the overview to the native map. A separate seven architecture controls register the closeup to the overview. No perimeter vertices, text, badges, gate squares or arrows are fitted.',
            'Five architecture and three perimeter observations check the first stage, including a north street-notch check; four architecture and five perimeter observations check the second stage, including a northern seam. Seven separately selected direct native targets check the composed registration, covering west, southwest, southeast, northeast and northwest.',
            'The four architecture direct-native checks reuse identifiable source landmarks from the closeup fit, but their native target positions were withheld from both fits. The three perimeter direct-native checks reuse first-stage border targets. These sets are correlated; they are not summed into a fictional independent sample count.',
            'The first H3 native pick was on the horizontal roof stroke rather than its corner. The first northwest border picks followed the adjacent grey/brown wall junction rather than the green approach. Original-pixel grids establish the documented corrections. All first picks and errors remain; no matrix or fit control changed.',
            'The retained descriptor candidate has many false repeated-architecture/badge correspondences (all-heldout median 154.18 native pixels). It supplied crop context only. None of its point set or its matrix was adopted as approved registration.',
            'The north curve uses fixed source x samples of the original dark green stroke, selected by unweighted RGB mean brightness and reviewed against original pixels. No circle, ellipse, inferred map-sector ownership or semantic game area volume is imposed.',
            'Three native pixels is the unchanged observed-landmark/raster digitization tolerance, not a statistical bound on every hidden edge. The separate entry-opening convention deliberately closes short observed approaches for selection display.'
        ],
        'registration': {
            'overview_to_native_matrix': N.tolist(), 'closeup_to_overview_matrix': L.tolist(),
            'composed_closeup_to_native_matrix': H.tolist(), 'first_fit_matrices_unchanged': True,
            'controls_per_stage': {'overview_to_native': 7, 'closeup_to_overview': 7},
            'holdout_accounting': 'Seven direct native checks; stage-specific checks reported separately, not added as independent samples.',
            'metrics': metrics, 'direct_native_combined': all_direct,
            'threshold_px': 3, 'declared_raster_digitization_tolerance_px': 3,
            'original_fit_replay_max_vertex_difference_px': replay_shift,
            'candidate_projection_difference_max_px': difference
        },
        'accepted_display_connector_segments': connectors,
        'southeast_closure_sensitivity': {
            'method': 'Diagnostic intersection of the two visible straight approach strokes. Not an observed point, not adopted as a vertex, and not evidence of the hidden physical corner.',
            'diagnostic_source_intersection': diagnostic.tolist(),
            'diagnostic_native_intersection': q.tolist(),
            'distance_from_display_connector_px': float(connector_alternative_distance),
            'interpretation': 'The approximately 3.58 px alternative-corner distance describes a display convention choice. It is not an observed registration error. The receipt does not claim the hidden southeast edge lies within the 3 px landmark tolerance.'
        },
        'geometry': {'source_vertices': source_vertices.tolist(), 'native_vertices': vertices.tolist(), 'topology': topo},
        'correction_history': {
            'overview': direct_observations['overview_holdout_corrections'],
            'closeup': direct_observations['closeup_holdout_corrections'],
            'first_native_northwest_error_px': 4.21338123716532,
            'no_controls_or_matrices_changed': True
        },
        'frozen_inputs_verified': frozen,
        'reproduction_script': {'path': DEST + '/reproduce_review.py', 'sha256': sha(HERE / 'reproduce_review.py')},
        'release_effect': 'One additional reviewed selection outline, WZ13. Original source bytes, existing approximate center, player state and rosters are unchanged. This is not full master-plan completion, live publication, or final CI approval.'
    }
    write('selection-review-receipt.json', receipt)
    sources = [
        {'path': 'maps/lumiose-game-map.jpg', 'claim': 'Native map identity and independently picked architecture/perimeter targets. Its central badge occlusion is supplied by the registered original closeup.'},
        {'path': overview_observations['source'], 'claim': 'Owner overview supplies seven architectural fit controls, eight stage holdouts and independent visible-footprint corroboration. Badge/cursor and Travel Here overlays are excluded.'},
        {'path': closeup_observations['source'], 'claim': 'Owner closeup supplies the curved perimeter and observed gate approaches, seven closeup-to-overview architecture controls, nine local holdouts and seven separately checked native targets.'}
    ]
    for item in sources:
        item['sha256'] = sha(repo / item['path'])
    assert sources[0]['sha256'] == MAP_HASH
    record = {
        'area_id': 'wz-13', 'status': 'approved', 'kind': 'zone',
        'coordinateSpace': 'atlas-native-pixels', 'mapSha256': MAP_HASH,
        'geometry': {'type': 'Polygon', 'coordinates': [vertices.tolist() + [vertices[0].tolist()]]},
        'sources': sources,
        'registration': {
            'method': 'Two-stage architecture homography: seven controls in each stage, with separate local holdouts. Seven direct native checks validate the composed transform. Visible perimeter and three display closures reviewed separately.',
            'control_count': 7, 'holdout_count': 7,
            'control_count_semantics': 'Seven per stage, fourteen total architecture correspondences; not fourteen direct native controls.',
            'max_error_px': max(m['max_px'] for group in metrics.values() for m in group.values()),
            'uncertainty_px': 3, 'threshold_px': 3,
            'holdout_rms_px': all_direct['rms_px'], 'holdout_max_px': all_direct['max_px'],
            'border_holdout_count': 3, 'independent_architecture_holdout_count': 4,
            'stage_metrics': metrics, 'evidence_id': ID,
            'evidence_path': DEST + '/selection-review-receipt.json'
        },
        'review': receipt['review'],
        'notes': [
            'Rendered map-selection footprint only; no physical, walking, floor, accessible-entrance, route, spawn or comprehensive encounter extent claim. Full area scope remains incomplete.',
            'Three native pixels describes observed landmark/raster digitization tolerance, not a uniform confidence interval or bound on hidden edges. Stage and direct-native checks are reported separately to avoid double-counting correlated observations.',
            'The native badge obscures central perimeter spans. The registered original closeup supplies those spans; its own cursor and badge are inside the footprint. No icon silhouette defines the outline.',
            'Three entrance-symbol spans are explicit display closures between observed approaches. The southeast corner is obscured; a short diagonal closure is chosen without inventing a hidden corner. Its separate sensitivity diagnostic is retained in the receipt.',
            'Original approximate marker center, source bytes, roster status and player data are unchanged. Raw failed descriptor matches and all original manual picks/corrections are retained.'
        ],
        'independent_review': {
            'date': '2026-11-26', 'reviewer': 'geometry_evidence_original_image_review_with_root_visual_crosscheck',
            'review_panel_path': DEST + '/source-perimeter-review.png',
            'review_panel_sha256': sha(HERE / 'source-perimeter-review.png'),
            'supplementary_review_panel_path': DEST + '/registered-source-review.png',
            'supplementary_review_panel_sha256': sha(HERE / 'registered-source-review.png'),
            'decision': 'approved_for_rendered_map_selection_only',
            'review_receipt_path': DEST + '/selection-review-receipt.json',
            'review_receipt_sha256': sha(HERE / 'selection-review-receipt.json')
        }
    }
    assert len(record['registration']['method']) <= 240
    write('wz13-approved-record.json', record)
    print(json.dumps({'decision': receipt['decision'], 'vertices': len(vertices),
                      'max_observed_error_px': record['registration']['max_error_px'],
                      'direct_native_metrics': all_direct, 'fit_replay_vertex_difference_px': replay_shift,
                      'receipt_sha256': sha(HERE / 'selection-review-receipt.json'),
                      'record_sha256': sha(HERE / 'wz13-approved-record.json')}, indent=2))


if __name__ == '__main__':
    main()
