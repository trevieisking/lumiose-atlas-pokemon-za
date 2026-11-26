#!/usr/bin/env python3
"""Apply the cited Vert/Rouge/Jaune continuation after the Bleu/Magenta checkpoint.

Authored source observations remain separate from runtime habitat eligibility.
No source fetch, original evidence replacement, geometry or progress mutation.
"""
from pathlib import Path
from copy import deepcopy
from collections import Counter
import argparse
import hashlib
import json

import reconcile_sector_encounters as first

ROOT = Path(__file__).resolve().parents[1]
PACKET = ROOT / 'docs/qa/sector-continuation-2026-11-26'
RUNTIME = ROOT / 'atlas-area-evidence.json'
REVIEW = 'docs/qa/sector-continuation-2026-11-26/REVIEW.md'
PREFIXES = ('vert-sector-', 'rouge-sector-', 'jaune-sector-')


def checkpoint():
    original = json.loads(first.BASELINE.read_text())
    previous_packet = json.loads((first.PACKET / 'reconciliation.json').read_text())
    return first.apply_packet(original, previous_packet)


def make_packet(observations, before):
    areas = {a['area_id']: a for a in before['areas']}
    crosschecks = {(r['area_id'], r['species']): r for r in observations['ordinary_crosschecks']}
    qualifications = {(r['area_id'], r['species'], r['form']): r['note']
                      for r in observations['row_qualifications']}
    updates, additions, coverage = [], [], []

    def retain(row, old, aid):
        first.append_unique(row['sources'], {
            'path': REVIEW,
            'claim': 'Named-sector continuation, source boundaries, form labels and disagreements reviewed on 26 November 2026.',
        })
        if old:
            updates.append({'area_id': aid, 'id': row['id'],
                            'before_sha256': first.digest(old), 'after': row})
        else:
            additions.append({'area_id': aid, 'row': row})

    for table in observations['tables']:
        aid = table['area_id']
        assert aid.startswith(PREFIXES), aid
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
            # A separate old membership/Alpha/mission claim retains its own identity.
            matches = [r for r in areas[aid]['encounters'] if r['species'] == species
                       and r['encounter_class'] == 'ordinary' and r['form'] == form]
            assert len(matches) <= 1, (aid, species, form)
            old = matches[0] if matches else None
            suffix = 'walking' + ('-' + first.slug(form) if form else '')
            row = deepcopy(old) if old else first.blank_row(aid, species, 'ordinary', suffix, form)
            first.source(row, table['url'], f"{table['section']}: ordinary encounter report, levels {levels}.")
            first.append_unique(row['condition']['notes'],
                                f'RotomLabs reports levels {levels} in the named-sector Walking table; this is an attributed level range.')
            first.append_unique(row['notes'], 'The numbered-sector Walking table supplies the ordinary class. This does not certify an exact spawn, unrestricted conditions or a comprehensive roster.')
            if source_form == 'Meadow' and species in {'Scatterbug', 'Spewpa'}:
                first.append_unique(row['notes'], 'The source groups this species under Meadow evolution-pattern data; no distinct visible species form is asserted.')
            elif form:
                first.append_unique(row['notes'], 'The form label is source-reported; a complete local form distribution has not been established.')
            qualification = qualifications.get((aid, species, form))
            if qualification:
                first.append_unique(row['notes'], qualification)
            cross = crosschecks.get((aid, species))
            if cross:
                row['evidence_status'] = 'source_corroborated'
                first.source(row, cross['url'], cross['claim'])
                first.append_unique(row['notes'], 'The cited named-area sources corroborate ordinary membership. Individual conditions and level ranges retain their stated limitations.')
                for field in ['time', 'weather', 'floor']:
                    if cross.get(field) and row['condition'].get(field) is None:
                        row['condition'][field] = cross[field]
                if cross.get('level_range') and cross['level_range'] != levels:
                    first.append_unique(row['condition']['notes'], f"The corroborating area guide reports {cross['level_range']}; the level reports differ, so no exact level is certified.")
                first.append_unique(row['condition']['notes'], cross['claim'])
            elif row['evidence_status'] == 'source_lead':
                first.append_unique(row['notes'], 'This ordinary claim remains attributed research until independently corroborated; it does not establish a supported habitat highlight.')
            retain(row, old, aid)
        coverage.append({'area_id': aid, 'walking_rows_reviewed': len(table['rows']), 'roster_complete': False})

    for lead in observations['additional_bounded_leads']:
        aid, species, form = lead['area_id'], lead['species'], lead.get('form')
        assert aid.startswith(PREFIXES), aid
        assert lead['kind'] in {'alpha_class_unresolved', 'membership_unresolved'}
        if lead['kind'] == 'alpha_class_unresolved':
            assert len(set(lead['urls'])) >= 2 and lead['status'] == 'source_corroborated'
            assert any(r['area_id'] == aid and r['species'] == species and r['form'] == form
                       and r['heading'] == 'Alpha' for r in observations['source_special_heading_inventory'])
        matches = [r for r in areas[aid]['encounters'] if r['id'] == lead.get('existing_id')]
        assert len(matches) == (1 if lead.get('existing_id') else 0)
        old = matches[0] if matches else None
        if old:
            assert (old['species'], old['encounter_class'], old['form']) == (species, 'unclassified_lead', form)
        suffix = lead['kind'].replace('_', '-') + ('-' + first.slug(form) if form else '')
        row = deepcopy(old) if old else first.blank_row(aid, species, 'unclassified_lead', suffix, form)
        row['evidence_status'] = lead['status']
        first.append_unique(row['notes'], lead['claim'])
        first.append_unique(row['notes'], 'A membership or Alpha report with unresolved encounter class cannot establish an ordinary, fixed Alpha or rotating Alpha habitat.')
        for url in lead['urls']:
            first.source(row, url, lead['claim'])
        retain(row, old, aid)

    old_ids = [r['id'] for a in before['areas'] for r in a['encounters']]
    new_ids = [a['row']['id'] for a in additions]
    assert len(set(old_ids + new_ids)) == len(old_ids) + len(new_ids), 'Duplicate encounter ID'
    assert len({u['id'] for u in updates}) == len(updates), 'Repeated update'
    catalog = {r['name'] for r in json.loads((ROOT / 'docs/qa/at339-encounters/baseline-species-catalog.json').read_text())}
    assert all(r['species'] in catalog for r in [u['after'] for u in updates] + [a['row'] for a in additions])
    return {
        'id': observations['id'], 'reviewed_on': observations['reviewed_on'],
        'review_base': observations['review_base'],
        'preceding_packet': observations['preceding_packet'],
        'observations_sha256': hashlib.sha256((PACKET / 'observations.json').read_bytes()).hexdigest(),
        'original_packet_unchanged': True, 'bleu_magenta_checkpoint_unchanged': True,
        'scope': 'Only named Vert/Rouge/Jaune sector encounter rows; no geometry, Wild Zone, photo or progress changes.',
        'coverage': coverage, 'updates': updates, 'additions': additions,
    }


def apply_packet(runtime, packet):
    result = deepcopy(runtime)
    areas = {a['area_id']: a for a in result['areas']}
    for update in packet['updates']:
        assert update['area_id'].startswith(PREFIXES)
        rows = areas[update['area_id']]['encounters']
        matches = [i for i, row in enumerate(rows) if row['id'] == update['id']]
        assert len(matches) == 1, f"Missing or duplicate original row: {update['id']}"
        i = matches[0]
        if rows[i] != update['after']:
            assert first.digest(rows[i]) == update['before_sha256'], f"Concurrent source change requires review: {update['id']}"
            rows[i] = deepcopy(update['after'])
    for addition in packet['additions']:
        assert addition['area_id'].startswith(PREFIXES)
        rows = areas[addition['area_id']]['encounters']
        existing = [r for r in rows if r['id'] == addition['row']['id']]
        if existing:
            assert len(existing) == 1 and existing[0] == addition['row'], 'Conflicting new encounter row'
        else:
            rows.append(deepcopy(addition['row']))
    assert result.get('geometries') == runtime.get('geometries')
    assert all(a == b for a, b in zip(runtime['areas'], result['areas']) if not a['area_id'].startswith(PREFIXES))
    assert all(a['notes'] == b['notes'] and a['roster_status'] == b['roster_status']
               for a, b in zip(runtime['areas'], result['areas']))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Write the reviewed continuation and bounded runtime delta.')
    args = parser.parse_args()
    observations = json.loads((PACKET / 'observations.json').read_text())
    before = checkpoint()
    packet = make_packet(observations, before)
    runtime = json.loads(RUNTIME.read_text())
    result = apply_packet(runtime, packet)
    # Dated checkpoint totals must not depend on later, unrelated runtime packets.
    after = apply_packet(before, packet)
    previous_rows = [r for a in before['areas'] for r in a['encounters']]
    rows = [r for a in after['areas'] for r in a['encounters']]
    supported = lambda values: sum(r['encounter_class'] == 'ordinary' and r['evidence_status'] == 'source_corroborated' for r in values)
    summary = {
        'numbered_sector_tables_reviewed': len(packet['coverage']),
        'walking_rows_reviewed': sum(r['walking_rows_reviewed'] for r in packet['coverage']),
        'original_row_updates': len(packet['updates']), 'new_rows': len(packet['additions']),
        'source_rows_before': len(previous_rows), 'source_rows_after': len(rows),
        'status_before': dict(Counter(r['evidence_status'] for r in previous_rows)),
        'status_after': dict(Counter(r['evidence_status'] for r in rows)),
        'class_before': dict(Counter(r['encounter_class'] for r in previous_rows)),
        'class_after': dict(Counter(r['encounter_class'] for r in rows)),
        'new_supported_ordinary_memberships': supported(rows) - supported(previous_rows),
        'combined_sector_index_entries_reviewed': len(observations['combined_numbered_sector_source_index']),
        'combined_numbered_walking_sections': sum(r['numbered_walking_table_present'] for r in observations['combined_numbered_sector_source_index']),
        'combined_walking_rows_reviewed': sum(r['walking_rows'] or 0 for r in observations['combined_numbered_sector_source_index']),
        'comprehensive_rosters_added': 0, 'geometry_records_changed': 0,
    }
    packet['summary'] = summary
    if args.write:
        (PACKET / 'reconciliation.json').write_bytes(first.encoded(packet))
        RUNTIME.write_bytes(first.encoded(result))
    else:
        assert json.loads((PACKET / 'reconciliation.json').read_text()) == packet, 'Continuation packet is stale'
        assert runtime == result, 'Runtime evidence is missing the reviewed continuation'
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
