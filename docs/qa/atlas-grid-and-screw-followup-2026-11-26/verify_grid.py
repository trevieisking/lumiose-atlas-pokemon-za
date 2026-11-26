"""Fixture tests for local cell lookup, not gameplay proof."""
from grid_reference import locate, HASH
get=lambda x,y,e:locate(x,y,e,reference_hash=HASH)
a=get(2004,2004,2)
assert a['status']=='one_search_subcell'
assert a['cells']==[dict(column=0,row=0,subcolumn=3,subrow=3)]
assert a['exact_map_pin'] is False
assert len(get(1992,1992,2)['cells'])==4
assert {c['column'] for c in get(1920,2030,2)['cells']}=={-1,0}
assert get(2400,1920,2)['status']=='outside_local_calibration'
for args in [(1,2,0,HASH),(1,2,float('nan'),HASH),(2004,2004,2,'wrong')]:
    try:
        locate(*args[:3],reference_hash=args[3])
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid input was accepted')
print('PASS: local cell, boundaries, uncertainty, coverage, and wrong reference hash')
