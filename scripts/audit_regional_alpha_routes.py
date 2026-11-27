#!/usr/bin/env python3
"""Extract verified regional-form Alpha catch routes from the pinned four-table join."""
import argparse
import json
from pathlib import Path

from audit_hyperspace_encounters import audit

# National ID and actual form ID, not a rule that a regional form is always form 1.
FORMS = {
    (26, 1): 'Alolan Raichu',
    (52, 1): 'Alolan Meowth',
    (53, 1): 'Alolan Persian',
    (105, 1): 'Alolan Marowak',
    (52, 2): 'Galarian Meowth',
    (79, 1): 'Galarian Slowpoke',
    (80, 2): 'Galarian Slowbro',
    (199, 1): 'Galarian Slowking',
    (83, 1): 'Galarian Farfetch’d',
    (122, 1): 'Galarian Mr. Mime',
    (562, 1): 'Galarian Yamask',
    (618, 1): 'Galarian Stunfisk',
    (211, 1): 'Hisuian Qwilfish',
    (705, 1): 'Hisuian Sliggoo',
    (706, 1): 'Hisuian Goodra',
    (713, 1): 'Hisuian Avalugg',
    (863, 0): 'Perrserker',
    (866, 0): 'Mr. Rime',
    (904, 0): 'Overqwil',
}


def regional_routes(directory):
    rows = set()
    result = audit(directory)
    for row in result['candidateRows']:
        form = row['national'], row['form']
        if form not in FORMS:
            continue
        base, alpha = row['captureLevels'], row['alphaCaptureLevels']
        assert row['rawAlphaProbability'] == 1 and alpha == [level + 9 for level in base]
        rows.add((form, row['rank'], row['type'], tuple(base), tuple(alpha)))
    assert len(rows) == 25
    assert {r[0] for r in rows} == set(FORMS)
    assert not {865, 867} & {r['national'] for r in result['candidateRows']}
    order = {key: index for index, key in enumerate(FORMS)}
    return [{'name': FORMS[form], 'national': form[0], 'form': form[1], 'rank': rank,
             'type': typ, 'ordinary': base, 'alpha': alpha}
            for form, rank, typ, base, alpha in sorted(rows, key=lambda r: (order[r[0]], *r[1:]))]


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input_dir', type=Path)
    print(json.dumps(regional_routes(parser.parse_args().input_dir), indent=2, ensure_ascii=False))
