#!/usr/bin/env python3
"""Apply the reviewed Bleu/Magenta encounter delta without replacing other evidence.

The input is an authored, cited observation packet. This script does not fetch or
scrape third-party data. The original AT-339 packet and all geometry stay intact.
"""
from pathlib import Path
from copy import deepcopy
from collections import Counter
import argparse
import hashlib
import json
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
PACKET = ROOT / 'docs/qa/sector-reconciliation-2026-11-26'
BASELINE = ROOT / 'docs/qa/at339-encounters/atlas-area-evidence.json'
RUNTIME = ROOT / 'atlas-area-evidence.json'
REVIEW = 'docs/qa/sector-reconciliation-2026-11-26/REVIEW.md'


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def digest(value):
    return hashlib.sha256(encoded(value)).hexdigest()


def slug(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')


def append_unique(values, value):
    if value not in values:
        values.append(value)


def source(row, url, claim):
    # Preserve an older source claim rather than rewriting its reviewed wording.
    if not any(s.get('url') == url for s in row['sources']):
        row['sources'].append({'url': url, 'claim': claim})


def blank_row(area_id, species, klass, suffix, form=None):
    return {
        'id': f'g3-sector-20261126-{area_id}-{slug(species)}-{suffix}',
        'species': species,
        'encounter_class': klass,
        'form': form,
        'condition': {'time': None, 'weather': None, 'floor': None, 'unlock': None, 'notes': []},
        'evidence_status': 'source_lead',
        'sources': [],
        'notes': [],
    }


def make_packet(observations, reviewed):
    areas = {a['area_id']: a for a in reviewed['areas']}
    crosschecks = {(r['area_id'], r['species']): r for r in observations['ordinary_crosschecks']}
    updates, additions, coverage = [], [], []
    for table in observations['tables']:
        aid = table['area_id']
        assert aid.startswith(('bleu-sector-', 'magenta-sector-'))
        seen = set()
        for raw in table['rows']:
            parts = raw.split('|')
            species, levels = parts[:2]
            source_form = parts[2] if len(parts) > 2 else None
            form = 'Meadow Pattern' if species == 'Vivillon' and source_form == 'Meadow' else source_form
            if species in {'Scatterbug', 'Spewpa'}:
                form = None
            assert (species, form) not in seen, (aid, species, form)
            seen.add((species, form))

            # An older unclassified/static source row is not silently converted.
            # Only an existing ordinary row of the same species and form is enriched.
            matches = [r for r in areas[aid]['encounters'] if r['species'] == species
                       and r['encounter_class'] == 'ordinary' and r['form'] == form]
            assert len(matches) <= 1, (aid, species, form)
            before = matches[0] if matches else None
            suffix = 'walking' + ('-' + slug(form) if form else '')
            row = deepcopy(before) if before else blank_row(aid, species, 'ordinary', suffix, form)
            source(row, table['url'], f"{table['section']}: ordinary encounter report, levels {levels}.")
            append_unique(row['condition']['notes'], f'RotomLabs reports levels {levels} in the named-sector Walking table; this is an attributed level range.')
            append_unique(row['notes'], 'The numbered-sector Walking table supplies the ordinary class. This does not certify an exact spawn, unrestricted conditions or a comprehensive roster.')
            if source_form == 'Meadow' and species in {'Scatterbug', 'Spewpa'}:
                append_unique(row['notes'], 'The source groups this species under Meadow evolution-pattern data; no distinct visible species form is asserted.')
            elif form:
                append_unique(row['notes'], 'The form label is source-reported; a complete local form distribution has not been established.')

            cross = crosschecks.get((aid, species))
            if cross:
                row['evidence_status'] = 'source_corroborated'
                source(row, cross['url'], cross['claim'])
                append_unique(row['notes'], 'The cited named-area sources corroborate ordinary membership. Individual conditions and level ranges retain their stated limitations.')
                for field in ['time', 'weather', 'floor']:
                    if cross.get(field) and row['condition'].get(field) is None:
                        row['condition'][field] = cross[field]
                if cross.get('level_range') and cross['level_range'] != levels:
                    append_unique(row['condition']['notes'], f"The corroborating area guide reports {cross['level_range']}; the level reports differ, so no exact level is certified.")
                append_unique(row['condition']['notes'], cross['claim'])
            elif row['evidence_status'] == 'source_lead':
                append_unique(row['notes'], 'This ordinary claim remains attributed research until independently corroborated; it does not establish a supported habitat highlight.')

            row['sources'].append({'path': REVIEW, 'claim': 'Named-sector comparison, source boundaries and level differences reviewed on 26 November 2026.'})
            if before:
                updates.append({'area_id': aid, 'id': row['id'], 'before_sha256': digest(before), 'after': row})
            else:
                additions.append({'area_id': aid, 'row': row})
        coverage.append({'area_id': aid, 'walking_rows_reviewed': len(table['rows']), 'roster_complete': False})

    for lead in observations['additional_bounded_leads']:
        aid, species = lead['area_id'], lead['species']
        alpha = len(lead['urls']) > 1
        row = blank_row(aid, species, 'unclassified_lead', 'alpha-class-unresolved' if alpha else 'membership-unresolved')
        row['evidence_status'] = lead['status']
        row['notes'] = [lead['claim'], 'A membership or Alpha report with unresolved encounter class cannot establish an ordinary, fixed Alpha or rotating Alpha habitat.']
        row['sources'] = [{'url': url, 'claim': lead['claim']} for url in lead['urls']]
        row['sources'].append({'path': REVIEW, 'claim': 'Specific unresolved claim retained separately from the Walking tables.'})
        additions.append({'area_id': aid, 'row': row})

    ids = [r['id'] for a in reviewed['areas'] for r in a['encounters']]
    added_ids = [a['row']['id'] for a in additions]
    assert len(set(ids + added_ids)) == len(ids) + len(added_ids), 'Duplicate encounter ID'
    catalog = {r['name'] for r in json.loads((ROOT / 'docs/qa/at339-encounters/baseline-species-catalog.json').read_text())}
    assert all(r['species'] in catalog for r in [u['after'] for u in updates] + [a['row'] for a in additions])
    return {
        'id': observations['id'], 'reviewed_on': observations['reviewed_on'],
        'review_base': observations['review_base'],
        'observations_sha256': hashlib.sha256((PACKET / 'observations.json').read_bytes()).hexdigest(),
        'original_packet_unchanged': True,
        'scope': 'Only named Bleu/Magenta sector encounter rows; no geometry, Wild Zone, photo or progress changes.',
        'coverage': coverage,
        'updates': updates, 'additions': additions,
    }


def apply_packet(runtime, packet):
    result = deepcopy(runtime)
    areas = {a['area_id']: a for a in result['areas']}
    for update in packet['updates']:
        rows = areas[update['area_id']]['encounters']
        matches = [i for i, row in enumerate(rows) if row['id'] == update['id']]
        assert len(matches) == 1, f"Missing or duplicate original row: {update['id']}"
        i = matches[0]
        if rows[i] != update['after']:
            assert digest(rows[i]) == update['before_sha256'], f"Concurrent source change requires review: {update['id']}"
            rows[i] = deepcopy(update['after'])
    for addition in packet['additions']:
        rows = areas[addition['area_id']]['encounters']
        existing = [r for r in rows if r['id'] == addition['row']['id']]
        if existing:
            assert len(existing) == 1 and existing[0] == addition['row'], 'Conflicting new encounter row'
        else:
            rows.append(deepcopy(addition['row']))
    assert result.get('geometries') == runtime.get('geometries')
    assert all(a == b for a, b in zip(runtime['areas'], result['areas']) if not a['area_id'].startswith(('bleu-sector-', 'magenta-sector-')))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Write the reviewed packet and bounded runtime delta.')
    args = parser.parse_args()
    observations = json.loads((PACKET / 'observations.json').read_text())
    reviewed = json.loads(BASELINE.read_text())
    packet = make_packet(observations, reviewed)
    runtime = json.loads(RUNTIME.read_text())
    result = apply_packet(runtime, packet)
    original_rows = [r for a in reviewed['areas'] for r in a['encounters']]
    # Preserve this dated checkpoint's totals when later packets add other areas.
    checkpoint = apply_packet(reviewed, packet)
    rows = [r for a in checkpoint['areas'] for r in a['encounters']]
    summary = {
        'numbered_sector_tables_reviewed': len(packet['coverage']),
        'walking_rows_reviewed': sum(r['walking_rows_reviewed'] for r in packet['coverage']),
        'original_row_updates': len(packet['updates']), 'new_rows': len(packet['additions']),
        'source_rows_before': len(original_rows), 'source_rows_after': len(rows),
        'status_before': dict(Counter(r['evidence_status'] for r in original_rows)),
        'status_after': dict(Counter(r['evidence_status'] for r in rows)),
        'class_before': dict(Counter(r['encounter_class'] for r in original_rows)),
        'class_after': dict(Counter(r['encounter_class'] for r in rows)),
        'comprehensive_rosters_added': 0, 'geometry_records_changed': 0,
    }
    packet['summary'] = summary
    if args.write:
        (PACKET / 'reconciliation.json').write_bytes(encoded(packet))
        RUNTIME.write_bytes(encoded(result))
    else:
        assert json.loads((PACKET / 'reconciliation.json').read_text()) == packet, 'Review packet is stale'
        assert runtime == result, 'Runtime evidence is missing the reviewed delta'
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
