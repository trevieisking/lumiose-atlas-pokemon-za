#!/usr/bin/env python3
"""Check survey gates and existing Fieldbook level coverage against pinned game data."""
from collections import Counter
from hashlib import sha1
import json
from pathlib import Path
import re
import sys


def pinned(path, expected):
    data = Path(path).read_bytes()
    if sha1(f'blob {len(data)}\0'.encode() + data).hexdigest() != expected:
        raise ValueError(f'{Path(path).name}: unexpected source blob')
    return json.loads(data)


def main(point_file, encounter_file, personal_file=None):
    points = pinned(point_file, '314258d07929b23026a73e435e0cc190d3d92c2b')
    encounter = pinned(encounter_file, '435502d116a7941096c7d589a92e65d0fcde0996')
    zone_points = [p for p in points if re.fullmatch(r'Wild Zone \d+', p['Location'])]
    zone_rows = [(p, s) for p in zone_points for s in p['Spawns']]
    assert len(zone_points) == 352
    assert Counter(s['AlphaProbability'] for _, s in zone_rows) == {5: 439, 100: 175, 0: 12}
    for p, s in zone_rows:
        if s['AlphaProbability'] == 5:
            zone = p['Location'].split()[-1]
            assert f'momiji_wild_zone_condition - 1 - "{zone}"' in s['Condition']

    story_alpha = {
        'ect_a0403_w01_v01_z208_Alpha', 'ect_a0202_w02_v01_z475_Alpha',
        'ect_a0301_w02_v01_z675_Alpha',
    }
    fixed = [(p, s) for p, s in zone_rows if s['AlphaProbability'] == 100
             and p['Location'] != 'Wild Zone 20' and s['Id'] not in story_alpha]
    assert len(fixed) == 38
    assert sum(s['Id'] in story_alpha for _, s in zone_rows if s['AlphaProbability'] == 100) == 3
    assert sum(p['Location'] == 'Wild Zone 20' and s['AlphaProbability'] == 100
               for p, s in zone_rows) == 134
    repo = Path(__file__).resolve().parents[1]
    roster = (repo / 'home-dex-data.js').read_text()
    records = json.JSONDecoder().raw_decode(roster.split(' = ', 1)[1])[0]['records']
    names = {r['number']: r['name'] for r in records}
    actual = Counter()
    for p, s in fixed:
        boost = s['LevelBoostFromArea'] + s['LevelBoostIfAlpha']
        actual[(int(p['Location'].split()[-1]), names[s['Species']],
                s['LevelMin'] + boost, s['LevelMax'] + boost)] += 1

    fieldbook = (repo / 'alphas.html').read_text()
    expected = Counter()
    for zone, body in re.findall(r'id="zone-(\d+)" data-alpha-zone="\d+"(.*?)</article>', fieldbook, re.S):
        if int(zone) == 20:
            continue
        for name, low, high in re.findall(r'alpha-target-name">([^<]+)</span><span class="alpha-level">Lv\. (\d+)–(\d+)', body):
            expected[(int(zone), name, int(low), int(high))] += 1
    assert expected == actual, {'fieldbook_only': expected - actual, 'source_only': actual - expected}

    gourgeist = 'ect_a0501_w01_v01_z711_Alpha'
    point, spawn = next((p, s) for p, s in fixed if s['Id'] == gourgeist)
    raw = next(r for t in encounter['Table'] for r in t['Table'] if r['Id'] == gourgeist)
    assert point['Name'] == 'spn_a0501_w01_v01_141'
    assert (spawn['ConditionTime'], spawn['ConditionWeather']) == (0, 0)
    assert {'Condition': 'momiji_wild_zone_condition', 'Op': 1, 'Param': ['15']} in [
        c for a in raw['ActivationConditionArray'] for group in a['Element'] for c in group['Param']
    ]
    pyroar = [(p['Name'], s['Gender'], s['ConditionTime']) for p, s in fixed
              if s['Id'] == 'ect_a0101_w01_v01_z668_m_Alpha']
    assert sorted(pyroar) == [('spn_a0101_w01_v01_041', 0, 1), ('spn_a0101_w01_v01_046', 0, 2)]
    pumpkaboo = [(p, s) for p, s in zone_rows
                if p['Location'] == 'Wild Zone 15' and s['Species'] == 710]
    assert Counter(p['Name'].rsplit('_', 1)[-1] for p, _ in pumpkaboo) == {
        key: 4 for key in ('121', '122', '123', '124', '125', '127', '128')
    }
    assert Counter((s['Form'], s['ConditionTime']) for _, s in pumpkaboo) == {
        (0, 1): 7, (1, 1): 7, (2, 2): 7, (3, 2): 7
    }
    assert all((s['LevelMin'], s['LevelMax'], s['LevelBoostFromArea'],
                s['LevelBoostIfAlpha'], s['AlphaProbability']) == (42, 43, 0, 10, 5)
               for _, s in pumpkaboo)
    assert raw['FormNo'] == 0
    if personal_file:
        personal = pinned(personal_file, 'ddbe44da3d5ae479129a26953c6597b4a308e0b0')['Table']
        sizes = {r['Info']['Form']: (r['Info']['Height'], r['Info']['Weight'])
                 for r in personal if r['Info']['SpeciesNational'] == 711}
        assert sizes == {0: (90, 125), 1: (70, 95), 2: (110, 140), 3: (170, 390)}
        evo = [(r['Info']['Form'], e['Form'], e['Method'], e['SpeciesInternal'])
               for r in personal if r['Info']['SpeciesNational'] == 710 for e in r['Evolutions']]
        assert sorted(evo) == [(f, f, 5, 711) for f in range(4)]
    print('38 fixed rows match; 439 eligible chance rows have survey gates; 28 Pumpkaboo rows match time and form.')


if __name__ == '__main__':
    if len(sys.argv) not in (3, 4):
        raise SystemExit('Usage: audit_wild_zone_alpha_surveys.py POINT_JSON ENCOUNTER_JSON [PERSONAL_JSON]')
    main(*sys.argv[1:])
