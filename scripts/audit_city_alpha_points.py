#!/usr/bin/env python3
"""Compare named city Alpha rows with the source's stable spawner points."""
from collections import Counter
from hashlib import sha1
import json
from pathlib import Path
import re
import sys

HASHES = {
    'point': '314258d07929b23026a73e435e0cc190d3d92c2b',
    'slots': 'd03f6ded0a7c3958d94b028750c85651944c9034',
}


def load(folder, name):
    content = (folder / (name + '.json')).read_bytes()
    if sha1(f'blob {len(content)}\0'.encode() + content).hexdigest() != HASHES[name]:
        raise ValueError(f'{name}: not the pinned source blob')
    return json.loads(content)


def city(location):
    return not location.startswith('Wild Zone ')


def main(folder):
    points, slots = (load(folder, name) for name in ('point', 'slots'))
    rows = []
    for point in points:
        location = point['Location']
        if not city(location):
            continue
        for spawn in point['Spawns']:
            if spawn['AlphaProbability'] <= 0:
                continue
            bonus = spawn['LevelBoostFromArea'] + spawn['LevelBoostIfAlpha']
            rows.append((point, spawn, (
                location, spawn['Species'], spawn['Form'],
                spawn['LevelMin'] + bonus, spawn['LevelMax'] + bonus,
            )))
    named = Counter()
    for key, entries in slots.items():
        location = re.sub(r' \(\d+\)$', '', key)
        if city(location):
            named.update((location, r['Species'], r['Form'], r['LevelMin'], r['LevelMax'])
                         for r in entries if r['IsAlpha'])
    actual = Counter(row for _, _, row in rows)
    assert actual == named, {'point_only': actual - named, 'slot_only': named - actual}
    assert len(points) == 1087
    assert len(rows) == 114 and len({p['Name'] for p, _, _ in rows}) == 81
    assert len(actual) == 103 and len({r[0] for r in actual}) == 43
    assert len({r[1:3] for r in actual}) == 25
    assert sum(s['AlphaProbability'] == 100 for _, s, _ in rows) == 18
    dratini = [(p, s, r) for p, s, r in rows if r[:2] == ('Jaune Sector 5', 147)]
    assert len(dratini) == 1
    point, spawn, row = dratini[0]
    assert point['Name'] == 'spn_outzone_a0501_K00'
    assert row[-2:] == (38, 39)
    assert all(x in point['Conditions'] for x in ('time_noon_condition', 'sunny', 'clear_sunny', 'rainbow'))
    assert (spawn['ConditionTime'], spawn['ConditionWeather']) == (1, 1)
    le_nah = [r for p, _, r in rows if p['Name'] == 'spn_outzone_a0101_K50']
    assert any(r[1] == 148 and r[-2:] == (40, 42) for r in le_nah)
    rain = [(p, s, r) for p, s, r in rows if p['Name'] in {
        'spn_outzone_a0502_L01', 'spn_outzone_a0502_L03',
    }]
    assert len(rain) == 4
    assert all('rain' in p['Conditions'] and 'time_' not in p['Conditions']
               and s['ConditionTime'] == 0 for p, s, _ in rain)
    assert {(r[1], r[-2:]) for _, _, r in rain} == {(704, (45, 49)), (705, (51, 53))}
    print('114 matched city rows; 81 objects; 103 distinct leads; 43 locations; 25 species/form pairs.')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: audit_city_alpha_points.py PATH_TO_POINT_AND_SLOTS_JSON')
    main(Path(sys.argv[1]))
