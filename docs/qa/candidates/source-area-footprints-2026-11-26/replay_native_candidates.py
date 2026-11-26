"""Rebuild held native candidates from derived source perimeters; no network.

The fixed published world mapping is evaluated directly. The raster affine was
independently reviewed against four frozen architecture holdouts; this script
does not fit semantic boundaries or change any approval/runtime file.
"""
from pathlib import Path
import hashlib
import json
import math

HERE = Path(__file__).resolve().parent
MAP_SHA = '4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade'

def read(name):
    return json.loads((HERE / name).read_text())

def project(matrix, point):
    x, y = point
    return [matrix[0][0]*x + matrix[0][1]*y + matrix[0][2],
            matrix[1][0]*x + matrix[1][1]*y + matrix[1][2]]

def main():
    reg = read('texture-native-registration.json')
    review = read('calibration/independent-sector-footprint-review.json')
    matrix = review['coordinate_composition']['composed_world_to_native']
    affine = reg['texture_to_native_affine']
    expected = [[-3.94*affine[i][0], -3.94*affine[i][1],
                 78*affine[i][0]+78*affine[i][1]+affine[i][2]] for i in range(2)] + [[0, 0, 1]]
    assert max(abs(a-b) for row, er in zip(matrix, expected) for a, b in zip(row, er)) < 1e-12
    fit = [p for p in reg['fit_points'] if p['fit_inlier']]
    holdouts = read('calibration/fixed-global-map-holdouts.json')['points']
    residuals = [math.dist(project(affine, h['source_xy']), h['native_xy']) for h in holdouts]
    assert len(fit) == 31 and len(holdouts) == 4
    assert abs(max(residuals)-reg['independent_holdout_max_px']) < 1e-10
    assert reg['fit_max_px'] <= 3 and max(residuals) <= 3
    original = read('derived-sector-footprints.json')['records']
    assets = {a['area_name']: a for a in read('public-sector-assets-receipt.json')['assets']}
    names = {a['name']: a for a in read('sector-name-crosswalk.json')['sectors']}
    joins = {a['area_name']: a for a in read('decoded-original-subarea-identities.json')}
    rows = []
    for item in original:
        district, _, number = item['label'].split()
        area_id = f'{district.lower()}-sector-{number}'
        assert names[item['name_key']]['label'] == item['label']
        assert joins[item['area_name']]['subarea_name'] == item['name_key']
        assert joins[item['area_name']]['layer'] == 2
        assert assets[item['area_name']]['sha256'] == item['sha256']
        assert item['geometry']['type'] == 'Polygon'
        rings = [[project(matrix, point) for point in ring] for ring in item['geometry']['coordinates']]
        assert all(ring[0] == ring[-1] for ring in rings)
        assert all(0 <= value <= 1920 for ring in rings for p in ring for value in p)
        rows.append(dict(
            area_id=area_id, kind='sector', status='candidate_pending_root_review',
            representation='source_area_footprint', coordinateSpace='atlas-native-pixels', mapSha256=MAP_SHA,
            geometry=dict(type='Polygon', coordinates=rings),
            review=dict(boundary=True, registration=True, independent=True, occlusion=True),
            registration=dict(method='Fixed published world→texture map; reviewed affine texture→Atlas architecture. Metric scope: raster registration only.',
                control_count=len(fit), holdout_count=len(holdouts),
                max_error_px=max(reg['fit_max_px'], max(residuals)), uncertainty_px=3, threshold_px=3),
            sources=[dict(path='maps/lumiose-game-map.jpg', sha256=MAP_SHA,
                claim='Owner-native architectural calibration reference. Semantic perimeter comes from the separately cited original area mesh, not from tracing buildings in this image.')],
            semantic_source=dict(area_name=item['area_name'], name_key=item['name_key'], layer=2,
                world_y_range=item['world_y_range'], source_sha256=item['sha256'],
                source_git_blob_sha=item['git_blob_sha'],
                source_commit='e44a63db22a9f295d43c34db3f67695d31ae8e7a',
                source_path=assets[item['area_name']]['source_path']),
            evidence_receipt='docs/qa/candidates/source-area-footprints-2026-11-26/README.md',
            limitations=['A 2-D projection of the source area mesh. Heights and overlapping area rules can affect the in-game name.',
                'Not an exclusive sector partition, walkability/spawn border, or a rendered green Wild Zone outline.',
                'The 3 px metric describes observed texture-to-native architectural calibration. Separate source-versus-green differences remain in the review receipt.']))
    assert len(rows) == 48 and len({r['area_id'] for r in rows}) == 48
    out = dict(status='documentation-only candidates; root integration/wording/runtime/CI review still required',
        representation='source_area_footprint', geometries=rows)
    target = HERE / 'native-sector-footprint-candidates.json'
    target.write_text(json.dumps(out, indent=2) + '\n')
    print(json.dumps(dict(count=len(rows), vertices=sum(len(ring) for r in rows for ring in r['geometry']['coordinates']),
        max_raster_holdout_px=max(residuals), output_sha256=hashlib.sha256(target.read_bytes()).hexdigest())))

if __name__ == '__main__':
    main()
