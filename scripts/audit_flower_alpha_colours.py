#!/usr/bin/env python3
"""Verify the scoped Alpha Flabébé colour split and generated Fairy catch bands."""
from collections import defaultdict
from pathlib import Path
import argparse
from audit_city_alpha_points import load
from audit_hyperspace_encounters import audit, source


def main(point_folder, typed_folder):
    points = {p['Name']: p for p in load(point_folder, 'point')}
    for name, zone, forms, low in (
        ('spn_outzone_a0502_506', 'Jaune Sector 2', {0, 4}, 20),
        ('spn_outzone_a0501_504', 'Jaune Sector 3', {1, 2, 3}, 21),
    ):
        p = points[name]
        assert (p['SpawnCountMin'], p['SpawnCountMax'], p['Location']) == (1, 1, zone)
        assert 'time_' not in p['Conditions'] and 'weather_' not in p['Conditions']
        assert {s['Form'] for s in p['Spawns']} == forms
        assert all((s['Species'], s['AlphaProbability'], s['ConditionTime'], s['ConditionWeather'],
                    s['LevelMin'] + s['LevelBoostIfAlpha'] + s['LevelBoostFromArea'],
                    s['LevelMax'] + s['LevelBoostIfAlpha'] + s['LevelBoostFromArea']) ==
                   (669, 100, 0, 0, low, 23) for s in p['Spawns'])
    expected = {(669, 2): (16, 18), (669, 3): (20, 22), (670, 3): (24, 26),
                (671, 3): (28, 30), (670, 4): (37, 39), (671, 4): (39, 41)}
    rows = [r for r in audit(typed_folder)['candidateRows'] if r['national'] in {669, 670, 671}]
    assert len(rows) == 80
    forms = defaultdict(set)
    for r in rows:
        key = r['national'], r['rank']
        assert r['type'] == 'Fairy' and tuple(r['captureLevels']) == expected[key]
        assert r['alphaCaptureLevels'] == [n + 9 for n in r['captureLevels']]
        assert r['rawAlphaProbability'] == 1
        forms[key].add(r['form'])
    assert dict(forms) == {key: set(range(5)) for key in expected}
    family = {669: {}, 670: {}}
    for p in source(typed_folder, 'personal'):
        info = p['Info']
        if info['SpeciesNational'] in family:
            family[info['SpeciesNational']][info['Form']] = p['Evolutions']
    for species, method, level in ((669, 4, 19), (670, 8, 0)):
        for idx in range(5):
            [evo] = family[species][idx]
            assert (evo['SpeciesInternal'], evo['Form'], evo['Method'], evo['Level']) == (species + 1, idx, method, level)
    print('Two rooftop rotations and 30 direct Fairy form/rank rows match.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('point_folder', type=Path)
    parser.add_argument('typed_folder', type=Path)
    cfg = parser.parse_args()
    main(cfg.point_folder, cfg.typed_folder)
