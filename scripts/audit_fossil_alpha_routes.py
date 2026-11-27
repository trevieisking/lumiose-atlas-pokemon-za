#!/usr/bin/env python3
"""Replay fossil catch ranges and evolution rules against the pinned export."""
import argparse
from pathlib import Path
from audit_hyperspace_encounters import audit, source

EXPECTED = {
    (696, 3, 'Rock', (24, 26)), (698, 3, 'Rock', (24, 26)),
    (698, 4, 'Ice', (37, 39)), (142, 5, 'Rock', (53, 55)),
    (696, 5, 'Rock', (52, 54)), (698, 5, 'Rock', (52, 54)),
    (697, 5, 'Rock', (55, 57)), (699, 5, 'Rock', (55, 57)),
}


def main(folder):
    roster = {row[0] for row in EXPECTED}
    rows = [r for r in audit(folder)['candidateRows'] if r['national'] in roster]
    assert len(rows) == 11
    assert all(r['form'] == 0 and r['rawAlphaProbability'] == 1
               and r['alphaCaptureLevels'] == [x + 9 for x in r['captureLevels']] for r in rows)
    assert {(r['national'], r['rank'], r['type'], tuple(r['captureLevels'])) for r in rows} == EXPECTED
    rock3 = {n: {r['pattern'] for r in rows if r['rank'] == 3 and r['national'] == n}
             for n in (696, 698)}
    assert rock3 == {696: {3, 6}, 698: {4, 7}}
    personal = {p['Info']['SpeciesNational']: p for p in source(folder, 'personal')
                if p['Info']['Form'] == 0 and p['Info']['SpeciesNational'] in (696, 698)}
    for national, method, evolved in ((696, 32, 697), (698, 33, 699)):
        rows = personal[national]['Evolutions']
        assert [(r['Level'], r['Method'], r['SpeciesInternal'], r['Form']) for r in rows] == [(39, method, evolved, 0)]
    print('Eight fossil catch routes from 11 source rows; both level-39 evolution rules match.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input_dir', type=Path)
    main(parser.parse_args().input_dir)
