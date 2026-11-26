#!/usr/bin/env python3
"""Replay the frozen architecture-only local grid measurement (NumPy/SciPy).

This reads measurement selections, not original media, and prints numerical
results. It never writes to runtime data or promotes a coordinate.
"""
from pathlib import Path
import argparse
import json
import numpy as np
from scipy.optimize import least_squares


def project(matrix, points):
    points = np.asarray(points, dtype=float)
    projected = np.c_[points, np.ones(len(points))] @ matrix.T
    return projected[:, :2] / projected[:, 2:]


def normalized_dlt(source, target):
    def normalize(points):
        center = points.mean(axis=0)
        scale = np.sqrt(2) / np.linalg.norm(points - center, axis=1).mean()
        matrix = np.array([[scale, 0, -scale * center[0]],
                           [0, scale, -scale * center[1]], [0, 0, 1.]])
        return np.c_[points, np.ones(len(points))] @ matrix.T, matrix

    a, source_matrix = normalize(source)
    b, target_matrix = normalize(target)
    equations = []
    for (x, y, _), (u, v, _) in zip(a, b):
        equations.extend([[-x, -y, -1, 0, 0, 0, u*x, u*y, u],
                          [0, 0, 0, -x, -y, -1, v*x, v*y, v]])
    _, _, vt = np.linalg.svd(equations)
    matrix = np.linalg.inv(target_matrix) @ vt[-1].reshape(3, 3) @ source_matrix
    return matrix / matrix[2, 2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--measurements', type=Path,
                        default=Path(__file__).with_name('registration.json'))
    args = parser.parse_args()
    packet = json.loads(args.measurements.read_text())
    source = np.array([p['video_xy'] for p in packet['controls']], dtype=float)
    target = np.array([p['reference_xy'] for p in packet['controls']], dtype=float)
    fit = np.array([p['role'] == 'fit' for p in packet['controls']])
    initial = normalized_dlt(source[fit], target[fit])
    result = least_squares(
        lambda p: (project(np.r_[p, 1.].reshape(3, 3), source[fit]) - target[fit]).ravel(),
        initial.ravel()[:8], x_scale='jac', max_nfev=500)
    matrix = np.r_[result.x, 1.].reshape(3, 3)
    residuals = np.linalg.norm(project(matrix, source) - target, axis=1)
    crosses = {p['id']: project(matrix, [p['video_xy']])[0]
               for p in packet['crosses']}
    intervals = {name: float(np.linalg.norm(crosses[p['end']] - crosses[p['start']]))
                 for name, p in packet['intervals'].items()}
    differences = [abs(value - packet['intervals'][name]['reference_distance'])
                   for name, value in intervals.items()]
    if max(differences) > 0.001:
        raise SystemExit('Replay does not reproduce the frozen interval measurements.')
    print(json.dumps({
        'status': 'reproduced_research_measurement_only',
        'fit_count': int(fit.sum()),
        'holdout_count': int((~fit).sum()),
        'fit_rms_reference_pixels': float(np.sqrt(np.mean(residuals[fit]**2))),
        'holdout_rms_reference_pixels': float(np.sqrt(np.mean(residuals[~fit]**2))),
        'holdout_max_reference_pixels': float(residuals[~fit].max()),
        'intervals_reference_pixels': intervals,
        'maximum_interval_replay_difference': max(differences),
        'native_atlas_coordinates_or_world_units_promoted': False,
    }, indent=2))


if __name__ == '__main__':
    main()
