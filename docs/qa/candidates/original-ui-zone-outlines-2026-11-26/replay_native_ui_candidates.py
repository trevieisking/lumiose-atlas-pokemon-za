"""Rebuild the eleven held native candidates and independently replay distances.

Uses only committed derived geometry/metadata and the unchanged prior raster
registration. The default is a byte comparison; --write writes only this packet's
candidate JSON. It cannot modify Atlas runtime or approve a boundary.
"""
from pathlib import Path
import argparse,hashlib,json,math

HERE=Path(__file__).resolve().parent
NEW_ZONES={1,6,7,8,9,10,12,15,17,18,19}
PRESERVED_ZONES={2,3,4,5,11,13,14,16,20}
MAP_SHA='4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade'

def read(path):return json.loads((HERE/path).read_text())

def segment_distance(point,a,b):
    dx,dy=b[0]-a[0],b[1]-a[1]
    t=max(0,min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/(dx*dx+dy*dy)))
    return math.dist(point,[a[0]+t*dx,a[1]+t*dy])

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--write',action='store_true');args=parser.parse_args()
    source=read('source-provenance.json')
    candidate_path=HERE/'original-ui-contour-candidates-first.json'
    assert hashlib.sha256(candidate_path.read_bytes()).hexdigest()==source['first_source_contour_sha256']
    first=read('original-ui-contour-candidates-first.json')
    facts={r['zone']:r for r in read('original-ui-placement-facts.json')['records']}
    observed_path=HERE/'validation/native-green-checks-fixed.json'
    assert hashlib.sha256(observed_path.read_bytes()).hexdigest()==source['independent_native_observations_sha256']
    observed=read('validation/native-green-checks-fixed.json')['checks']
    expected=read('first-ui-contour-independent-checks.json')
    expected_by_id={r['id']:r for r in expected['checks']}
    registration=read('../source-area-footprints-2026-11-26/texture-native-registration.json')
    matrix=registration['texture_to_native_affine']
    approvals=read('validation/independent-ui-contour-review.json')
    assert approvals['decision']=='APPROVE_SCOPED_ORIGINAL_UI_OUTLINES_11'
    rows=[];all_errors=[]
    for item in first['records']:
        zone=item['zone'];fact=facts[zone];place=fact['fixed_texture_to_original_map']
        ring=item['texture_geometry']['coordinates'][0]
        assert ring[0]==ring[-1]
        native=[]
        for x,y in ring:
            u=place['offset'][0]+place['scale'][0]*x+place['pixel_center_correction'][0]
            v=place['offset'][1]+place['scale'][1]*y+place['pixel_center_correction'][1]
            native.append([matrix[0][0]*u+matrix[0][1]*v+matrix[0][2],matrix[1][0]*u+matrix[1][1]*v+matrix[1][2]])
        actual=item['native_geometry']['coordinates'][0]
        assert len(native)==len(actual)
        assert max(math.dist(a,b)for a,b in zip(native,actual))<1e-10
        assert all(0<=n<=1920 for point in actual for n in point)
        if zone not in NEW_ZONES:
            assert zone in PRESERVED_ZONES
            continue
        checks=[r for r in observed if r['zone']==zone]
        errors=[min(segment_distance(r['native_xy'],a,b)for a,b in zip(actual[:-1],actual[1:]))for r in checks]
        assert len(checks)>=3 and max(errors)<=3
        for check,error in zip(checks,errors):
            assert abs(error-expected_by_id[check['id']]['distance_to_fixed_candidate_boundary_px'])<1e-9
        all_errors.extend(errors)
        rows.append(dict(area_id=item['area_id'],kind='zone',status='candidate_pending_root_review',
            representation='map_selection_outline',coordinateSpace='atlas-native-pixels',mapSha256=MAP_SHA,
            geometry=item['native_geometry'],review=dict(boundary=True,registration=True,independent=True,occlusion=True),
            registration=dict(method='Original UI pane/material placement; fixed reviewed texture-to-native affine; independently checked green UI perimeter.',
                control_count=31,holdout_count=4+len(checks),max_error_px=max(registration['fit_max_px'],registration['independent_holdout_max_px'],max(errors)),
                uncertainty_px=3,threshold_px=3),
            sources=[dict(path='maps/lumiose-game-map.jpg',sha256=MAP_SHA,
                claim='Owner-native architecture calibration and independently frozen visible green-stroke checks; badge-hidden geometry comes from the cited original UI layer.')],
            semantic_source=dict(source_commit=source['source_commit'],source_path=next(r['source_path']for r in source['assets']if r['local_file']=='map_top_00.arc'),
                source_git_blob_sha=next(r['git_blob_sha']for r in source['assets']if r['local_file']=='map_top_00.arc'),source_sha256=next(r['sha256']for r in source['assets']if r['local_file']=='map_top_00.arc'),
                pane_name=fact['pane_name'],name_key=fact['name_key'],source_numeric_id=zone,
                ordinary_texture=fact['texture']['name'],glow_texture=fact['glow_texture']['name']),
            evidence_receipt='docs/qa/candidates/original-ui-zone-outlines-2026-11-26/README.md',
            limitations=['A digitized map selection perimeter, not a collision, traversability or encounter boundary.',
                'The continuous original UI glow supplies the closed perimeter through gate openings; decorative gate bars and arrows are excluded.',
                'Observed raster/digitization checks are within 3 native pixels; this is not a statistical confidence interval or an exact physical world-border claim.']))
    assert len(rows)==11 and {int(r['area_id'][3:])for r in rows}==NEW_ZONES
    assert len(all_errors)==43
    output=dict(status='Additive documentation-only candidates; independent source/native review passed; root runtime and release review still required.',
        add_only_area_ids=[r['area_id']for r in rows],preserve_existing_zone_ids=sorted(PRESERVED_ZONES),
        first_source_contour_sha256=source['first_source_contour_sha256'],geometries=rows)
    encoded=(json.dumps(output,indent=2)+'\n').encode()
    target=HERE/'native-ui-outline-candidates.json'
    if args.write:target.write_bytes(encoded)
    else:assert encoded==target.read_bytes()
    print(json.dumps(dict(status='PASS',count=len(rows),vertices=sum(len(r['geometry']['coordinates'][0])for r in rows),
        checks=len(all_errors),native_check_rms_px=math.sqrt(sum(e*e for e in all_errors)/len(all_errors)),
        native_check_max_px=max(all_errors),candidate_sha256=hashlib.sha256(encoded).hexdigest())))

if __name__=='__main__':main()
