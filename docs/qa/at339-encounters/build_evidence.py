"""Build an additive, bounded encounter evidence register. Does not write to the repository."""
from pathlib import Path
import json, hashlib, re, unicodedata, subprocess
from collections import Counter

ROOT = Path('/workspace/scratch/d158a14f0daf/atlas')
OUT = Path(__file__).parent
BASE = 'ee87bd2234d394e2dbc4197eb26610e6367e352b'
P322 = 'docs/qa/ATLAS_AT322_POKEMAPS_REFERENCE_REGISTER.json'
P323 = 'docs/qa/ATLAS_AT323_BOUNDARY_AND_ENCOUNTER_REGISTER.json'
P324 = 'docs/qa/ATLAS_AT324_LOCATION_IDENTITY_REGISTER.json'
d322 = json.loads((ROOT / P322).read_text())
d323 = json.loads((ROOT / P323).read_text())
d324 = json.loads((ROOT / P324).read_text())
baseline = json.loads((OUT / 'baseline-wild-zone-records.json').read_text())
catalog = json.loads((OUT / 'baseline-species-catalog.json').read_text())
species_names = {r['name'] for r in catalog}

def slug(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def src(path, claim):
    return {'url' if path.startswith('https://') else 'path': path, 'claim': claim}

def bulb(n):
    return f'https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_{n}'

def serebii(n):
    return f'https://www.serebii.net/pokearth/lumiosecity/wildzone{n}.shtml'

def photo(n):
    return f'assets/atlas/wild-zones/wild-zone-{n:02}-overview.png'

areas = {}
area_names = {}
for a in d323['sectors'] + d323['wild_zones']:
    aid = a['id']
    areas[aid] = {'area_id': aid, 'roster_status': 'not_comprehensive', 'encounters': [], 'notes': []}
    area_names[a['name'].replace('Wild Zone 0', 'Wild Zone ')] = aid

def add(aid, species, klass, status, sources, notes=(), form=None, time=None, weather=None,
        floor=None, unlock=None, condition_notes=(), suffix=None):
    row = {
        'id': f'g3-evidence-{aid}-{slug(species)}-{suffix or slug(klass)}',
        'species': species,
        'encounter_class': klass,
        'form': form,
        'condition': {'time': time, 'weather': weather, 'floor': floor, 'unlock': unlock,
                      'notes': list(condition_notes)},
        'evidence_status': status,
        'sources': list(sources),
        'notes': list(notes),
    }
    assert species in species_names, species
    assert not any(r['id'] == row['id'] for r in areas[aid]['encounters']), row['id']
    areas[aid]['encounters'].append(row)
    return row

# The following lists were visually read from the owner's actual image bytes on 2026-11-26.
# They are survey-card observations, not a new claim of comprehensive encounter coverage.
cards = {
    1: ['Weedle','Pichu','Scatterbug','Fletchling','Pidgey','Mareep','Bunnelby'],
    2: ['Kakuna','Patrat','Binacle','Staryu','Magikarp','Budew'],
    3: ['Skiddo','Pancham','Litleo','Espurr','Flabébé','Pikachu'],
    4: ['Patrat','Gastly','Honedge','Spewpa','Ekans','Spinarak'],
    5: ['Pidgeotto','Venipede','Electrike','Bellsprout','Abra','Pidgey','Bunnelby'],
    6: ['Binacle','Meditite','Buneary','Magikarp','Houndour','Swablu','Flaaffy'],
    7: ['Hippopotas','Audino','Vanillite','Kakuna','Floette','Roselia','Shuppet'],
    8: ['Krokorok','Sandile','Gible','Drilbur','Machop','Numel'],
    9: ['Carbink','Espurr','Fletchinder','Kadabra','Sableye','Mawile'],
    10: ['Slowpoke','Arbok','Watchog','Bellsprout','Carvanha','Staryu','Tynamo'],
    11: ['Gyarados','Clauncher','Furfrou','Inkay','Slowpoke','Stunfisk'],
    12: ['Delibird','Machop','Snover','Bergmite','Vanillite','Gogoat','Snorunt','Machoke'],
    13: ['Phantump','Vivillon','Heracross','Pinsir','Weepinbell','Scyther'],
    14: ['Helioptile','Drilbur','Onix','Aron','Lairon','Excadrill','Emolga'],
    15: ['Pumpkaboo','Shuppet','Scolipede','Haunter','Whirlipede','Beedrill','Larvitar'],
    16: ['Falinks','Flaaffy','Starmie','Barbaracle','Medicham','Florges','Froakie'],
    17: ['Klefki','Lampent','Skarmory','Pyroar','Diggersby','Chespin'],
    18: ['Noibat','Fennekin','Bagon','Altaria','Noivern','Swablu'],
    19: ['Eevee','Furfrou','Drampa','Kangaskhan','Audino','Clefairy','Cleffa'],
    20: ['Malamar','Dragalge','Charmander','Tepig','Lucario','Hippowdon','Squirtle','Totodile',
         'Bulbasaur','Roserade','Gardevoir','Chikorita','Aggron','Scrafty','Garbodor'],
}
survey_observations = []
for n, names in cards.items():
    aid = f'wz-{n:02}'
    original = (ROOT / photo(n)).read_bytes()
    git_blob = hashlib.sha1(b'blob ' + str(len(original)).encode() + b'\0' + original).hexdigest()
    survey_observations.append({
        'area_id': aid, 'path': photo(n), 'sha256': hashlib.sha256(original).hexdigest(),
        'git_blob_sha1': git_blob, 'reviewed_on': '2026-11-26', 'survey_badge': '100%',
        'visible_species_icons': names, 'visible_species_count': len(names),
        'limitations': [
            'Species icons corroborate this recorded survey card; they do not identify every encounter class.',
            'Absence from this card does not prove absence from all floors, times, weather, story states, or special encounters.',
            'No exact spawn coordinate, walking route, capture probability, or form distribution is inferred.',
        ],
    })
    areas[aid]['notes'].extend([
        'This encounter list is not comprehensive. The original species list and Alpha records are preserved separately.',
        f"The owner's 100% survey card shows {len(names)} species icons: {', '.join(names)}.",
        'The survey card does not establish every special encounter, time, weather, floor, or form. Missing icons do not prove a species is absent.',
    ])
    for name in names:
        row = add(aid, name, 'ordinary', 'owner_survey_correlated', [
            src(photo(n), 'Visible species icon on the owner survey card.'),
            src(bulb(n), 'Ordinary roster entry; reviewed 26 November 2026.'),
        ], notes=['The image corroborates the species; the written table supplies the ordinary encounter class. Conditions not established here remain unknown.'])
        if n == 13 and name == 'Vivillon':
            row['form'] = 'Meadow Pattern'
            row['notes'].append('The source names Meadow Pattern; the owner icon is consistent with that pattern. Other patterns are not established here.')
        if n == 17 and name == 'Pyroar':
            row['notes'].append('Ordinary Pyroar is corroborated at species level. The survey artwork does not establish spawn gender; differing form and fixed Alpha listings remain unresolved.')

# Explicitly retain partial sector research without spreading a Wild Zone citation to unrelated sectors.
samples = {s['species']: s for s in d322['species_reference_samples']}
for a in d322['areas']:
    if a['kind'] != 'sector':
        continue
    aid = a['id']
    for lead in a['species_reference_leads']:
        name = lead['species']
        sample = samples[name]
        corroborated = name in {'Eevee', 'Riolu'} and sample['status'] == 'area_membership_corroborated'
        sources = [src(lead['source'], 'Species page names this sector; scope recorded in AT322.'),
                   src(P322, 'Area membership review and source limitations.')]
        if corroborated:
            sources += [src(url, 'Independent area-membership corroboration recorded in AT322.') for url in sample.get('check', [])]
        notes = ['This is partial area-membership evidence, not a complete sector roster or an exact spawn position.']
        if name == 'Riolu':
            notes.append('Sunny daytime roof reports concern particular encounters, not every listed sector. Side Mission 24 trade is a separate acquisition method.')
        elif name == 'Eevee' and aid == 'bleu-sector-7':
            notes.append('Rooftop access is reported in written guides; exact spawn placement and encounter conditions need their own evidence.')
        elif name == 'Absol':
            notes.append('A source label such as static does not establish an ordinary or repeatable wild encounter.')
        elif name == 'Bunnelby':
            notes.append('Story capture and any static entries must remain separate from repeatable wild encounters.')
        elif name == 'Pikachu':
            notes.append('Evidence for Pikachu in other Wild Zones does not independently verify this sector claim.')
        add(aid, name, 'ordinary' if corroborated else 'unclassified_lead',
            'source_corroborated' if corroborated else 'source_lead', sources, notes=notes, suffix='sector-membership')

# Reviewed area-specific tables: source wording is not silently converted into a guaranteed wild catch.
add('bleu-sector-1', 'Ariados', 'ordinary', 'source_lead', [
    src('https://pokemaps.net/maps/lza/lumiose/bleu-sector-1', 'Reported walking encounter.'),
    src(P322, 'Reviewed area-page lead; conditions unresolved.')],
    notes=['Exact floor, level, repeatability, and encounter conditions are not independently established.'])
add('bleu-sector-1', 'Whirlipede', 'unclassified_lead', 'source_lead', [
    src('https://pokemaps.net/maps/lza/lumiose/bleu-sector-1', 'Reported static encounter.'),
    src(P322, 'Static classification remains unresolved.')],
    notes=['Static is a provider label. It does not establish fixed Alpha, random Alpha, or ordinary encounter class.'])
for name in ['Fletchling', 'Pidgey']:
    add('bleu-sector-6', name, 'ordinary', 'source_lead', [
        src('https://pokemaps.net/maps/lza/lumiose/bleu-sector-6', 'Walking encounter, levels 6–9.'),
        src(P322, 'Reviewed area table; exact conditions unresolved.')],
        condition_notes=['The source reports levels 6–9; exact floor and timing have not been independently checked.'])
add('bleu-sector-6', 'Nickit', 'unclassified_lead', 'source_lead', [
    src('https://pokemaps.net/maps/lza/lumiose/bleu-sector-6', 'Static level-15 listing.'),
    src('https://bulbapedia.bulbagarden.net/wiki/List_of_in-game_event_Pok%C3%A9mon_in_Pok%C3%A9mon_Legends%3A_Z-A', 'Event location and level corroboration recorded in AT322.'),
    src(P322, 'Availability and acquisition method still require a separate check.')],
    notes=['An event listing is not proof of an ordinary or repeatable wild spawn.'])
add('magenta-sector-6', 'Mawile', 'scripted_boss', 'source_corroborated', [
    src('https://pokemaps.net/maps/lza/lumiose/magenta-sector-6', 'Scripted encounter listing.'),
    src('https://bulbapedia.bulbagarden.net/wiki/Magenta_Sector_6', 'Rogue Mega Mawile location.'),
    src('https://www.serebii.net/pokearth/lumiosecity/magentadistrict.shtml', 'Rogue Mega Mawile boss context.'),
    src(P322, 'Boss classification checked in the area-page review.')], form='Mega',
    notes=['This is the Rogue Mega Mawile story battle. It is not an ordinary repeatable habitat record.'],
    condition_notes=['The reviewed provider row gives levels 48–52; it must remain a scripted boss record.'])

# Specific written access/condition leads from AT323 and AT324.
add('vert-sector-1', 'Hawlucha', 'ordinary', 'source_lead', [
    src('https://www.bisafans.de/routendex/illumina-city/verte-bezirk-1.php', 'Roof encounter north of Wild Zone 2; levels 21–24.'),
    src(P323, 'Encounter and roof-access lead; not a certified position.')], floor='roof (source-reported)',
    notes=['The reported roof and odds have not been verified in game. No coordinates are inferred.'])
for name, floor, cond in [
    ('Larvitar', 'roof (source-reported)', 'Level 12; roof grass reached using a yellow lift.'),
    ('Goomy', None, 'Reported near water when it is raining.'),
    ('Scatterbug', None, 'Reported grass near stairs by Nouveau Café Truck No. 2.'),
    ('Spewpa', None, 'Reported grass near stairs by Nouveau Café Truck No. 2.'),
]:
    add('bleu-sector-7', name, 'ordinary', 'source_lead', [
        src('https://www.bisafans.de/routendex/illumina-city/cyan-bezirk-7.php', cond),
        src(P323, 'Partial encounter and access lead.')], floor=floor,
        weather='rain (source-reported)' if name == 'Goomy' else None,
        condition_notes=[cond], notes=['Source-reported conditions and access need independent verification; this does not establish an exact spawn.'])
for row in areas['bleu-sector-7']['encounters']:
    if row['species'] in {'Eevee', 'Ralts'}:
        claim = 'Eevee levels 15–17 on a roof.' if row['species'] == 'Eevee' else 'Ralts levels 10–13 in a courtyard south of Wild Zone 12.'
        row['sources'] += [src('https://www.bisafans.de/routendex/illumina-city/cyan-bezirk-7.php', claim), src(P323, 'Source-reported access lead.')]
        row['condition']['notes'].append(claim + ' Access and exact placement need independent verification.')
add('rouge-sector-7', 'Larvitar', 'ordinary', 'source_lead', [
    src('https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-7.php', 'Roof encounter lead east of Wild Zone 13.'),
    src(P323, 'Time and access not independently established.')], floor='roof (source-reported)',
    notes=['The source also describes elemental monkey Alpha leads, but species, times, and repeatability need a separate check.'])
for aid, claim in [
    ('vert-sector-6', 'Reported on the Restaurant Le Nah roof.'),
    ('bleu-sector-9', 'Reported roof destination approached from Bleu Sector 6 construction.'),
    ('jaune-sector-3', 'Reported roof destination reached after obtaining Roto-Glide in Main Mission 16.'),
]:
    add(aid, 'Dratini', 'ordinary', 'source_lead', [
        src('https://game8.jp/pokemon-legends-z-a/729719', claim),
        src(P324, 'AT324-E02 preserves approach versus encounter-area distinction.')], floor='roof (source-reported)',
        unlock='Roto-Glide, obtained in Main Mission 16 (source-reported)' if aid == 'jaune-sector-3' else None,
        condition_notes=[claim], notes=['An approach sector is not automatically the encounter sector; exact placement remains unverified.'])
areas['bleu-sector-6']['notes'].append('Bleu Sector 6 is reported as an approach to a Dratini roof in Bleu Sector 9; that route lead does not establish a Dratini spawn in Bleu Sector 6.')
areas['bleu-sector-7']['notes'].append('Riolu guides mix the Bleu Sector 7 approach label with the Bleu Sector 5 encounter destination. No Riolu spawn is added here solely from an approach label.')

# Written ordinary rows not represented on the survey card remain explicit source claims.
for n, names in {5:['Patrat','Fletchling','Fletchinder','Binacle'],10:['Sharpedo'],12:['Avalugg']}.items():
    for name in names:
        add(f'wz-{n:02}', name, 'ordinary', 'source_lead', [
            src(bulb(n), 'Listed as an ordinary encounter.'), src(photo(n), 'Not among the visible survey icons.')],
            notes=['The written table reports an ordinary encounter, but the survey card does not independently establish this class or its conditions. The preserved species list is unchanged.'],
            suffix='additional-ordinary-claim')
    areas[f'wz-{n:02}']['notes'].append('The written table contains additional ordinary entries beyond the visible survey icons. Floor, timing, and survey-count differences remain to be checked.')

# High-priority conflicts are explicit; none replaces the baseline roster.
add('wz-07', 'Gastly', 'ordinary', 'disputed', [
    src(serebii(7), 'Gastly listed at levels 19–21.'),
    src(bulb(7), 'Gastly listed in the ordinary table.'),
    src(photo(7), 'Gastly is not among the seven visible survey icons.'),
    src('https://pokemaps.net/maps/lza/lumiose/gastly', 'The current species page omits Wild Zone 7.'),
    src(P324, 'AT324-E04 records disagreement among written guides.')],
    time='night (source-reported; unresolved)',
    notes=['Gastly remains in the original species list. Sources disagree about the ordinary encounter, and the missing survey icon is not proof of absence.'],
    condition_notes=['The reported levels are 19–21. A naturally encountered specimen with its met-location and time would resolve the remaining claim.'])
areas['wz-07']['notes'].append('Gastly remains a disputed ordinary-encounter claim. Do not remove the preserved entry or present a new verified spawn position.')
add('wz-17', 'Talonflame', 'unclassified_lead', 'disputed', [
    src(bulb(17), 'Lists Talonflame levels 45–46.'),
    src(serebii(17), 'The reviewed zone table does not list Talonflame.'),
    src('https://rotomlabs.net/locations/legends-z-a/wild-zone-17', 'The reviewed zone list does not list Talonflame.'),
    src(photo(17), 'Talonflame is not among the six visible survey icons.')],
    notes=['Area membership is disputed. This claim is not an addition to the preserved confirmed roster or a verified habitat.'])
add('wz-17', 'Mawile', 'ordinary', 'disputed', [
    src(serebii(17), 'Includes a levels-44–47 row as well as fixed Alpha levels 56–57.'),
    src(bulb(17), 'Lists Mawile as fixed Alpha, not in the ordinary table.'),
    src(photo(17), 'Mawile is not among the six visible survey icons.')],
    notes=['Only the additional ordinary claim is disputed. The original fixed Alpha Mawile row is preserved.'])
areas['wz-17']['notes'].extend([
    'The original two fixed Alpha Pyroar rows are retained. Their form identities are unresolved; they must not be deduplicated by species name.',
    'Several guides distinguish ordinary female Pyroar from fixed Alpha male Pyroar, while the preserved Serebii-derived data contains two fixed rows. The survey artwork cannot settle spawn gender.',
    'Talonflame membership and ordinary Mawile availability remain disputed. The Side Mission 114 Skarmory battle is separate from the ordinary Skarmory encounter.',
])
add('wz-18', 'Gastly', 'unclassified_lead', 'disputed', [
    src('https://pokemaps.net/maps/lza/lumiose/gastly', 'The current page lists Wild Zone 18.'),
    src(bulb(18), 'The ordinary and fixed Alpha tables do not list Gastly.'),
    src(serebii(18), 'The reviewed standard zone roster does not list Gastly.'),
    src('https://rotomlabs.net/locations/legends-z-a/wild-zone-18', 'The reviewed zone list does not list Gastly.'),
    src(photo(18), 'The owner card shows six other species and no Gastly icon.'),
    src('docs/consolidation/2026-11-26/branch-sources/pr-172/PROVENANCE.json', 'Archived PR172 owner-survey corroboration.')],
    notes=['Not promoted into the preserved species roster. The photograph corroborates the six ordinary survey species; it cannot exclude every special condition.'])
areas['wz-18']['notes'].append('PR172’s bounded owner-survey observation is corroborated by the original image bytes. It does not settle the separate Gastly claim.')

# Form fields are source-qualified additions; no form is guessed from generic species artwork.
for n, name, forms in [
    (3,'Flabébé',['Red Flower','Blue Flower','White Flower']),
    (7,'Floette',['Red Flower','Orange Flower']),
    (16,'Florges',['Blue Flower','White Flower']),
]:
    for form in forms:
        add(f'wz-{n:02}', name, 'ordinary', 'source_lead', [
            src(bulb(n), 'Ordinary table names this flower form.'),
            src(P323, 'Form-specific source claim, separate from species membership.')], form=form,
            notes=['The written source names this form. The general survey icon does not verify the complete form distribution.'],
            suffix='form-' + slug(form))
for form, time in [('Male','night'),('Female','day')]:
    add('wz-09', 'Meowstic', 'fixed_alpha', 'source_lead', [
        src(bulb(9), 'Two separate fixed Alpha form rows.'),
        src(P323, 'Reports male at night and female by day.')], form=form,
        time=time + ' (source-reported)',
        notes=['Keep both original Meowstic rows. The published form/time correspondence still needs in-game confirmation.'],
        condition_notes=['The fixed Alpha rows report levels 41–42.'], suffix='form-' + form.lower())
add('wz-15', 'Gourgeist', 'fixed_alpha', 'source_lead', [
    src(bulb(15), 'Fixed Alpha row names Medium Variety at levels 52–53.')], form='Medium Variety',
    notes=['Written form claim; the original fixed Alpha record remains unchanged.'], suffix='form-medium-variety')
for name, levels in [('Trevenant', '40–41'), ('Noibat', '41–43'), ('Banette', '42–43')]:
    add('wz-15', name, 'ordinary', 'disputed', [
        src(serebii(15), f'Ordinary encounter row, levels {levels}.'),
        src(bulb(15), 'Not listed as ordinary in the reviewed table.'),
        src(photo(15), 'Not among the seven visible survey icons.'),
        src(P323, 'AT323 records the rooftop/ordinary roster discrepancy.')],
        notes=['The additional ordinary claim is unresolved. The original species union is retained; fixed Alpha Banette is a separate preserved record.'],
        suffix='additional-ordinary-claim')
for row in areas['wz-15']['encounters']:
    if row['species'] == 'Larvitar' and row['encounter_class'] == 'ordinary':
        row['sources'] += [src('https://www.bisafans.de/routendex/illumina-city/wildsektor-15.php', 'Roof/lift access and Side Mission 80 lead.'), src(P323, 'Access prerequisite remains source-reported.')]
        row['condition']['notes'].append('A roof/lift approach involving Side Mission 80 is reported; this is not verified as a universal encounter prerequisite.')
areas['wz-15']['notes'].append('Some ordinary-roster and roof-access claims differ between guides. Fixed Alpha Banette and Gourgeist must not be relabelled as ordinary merely because they appear in the species union.')

# WZ14 survey membership and written timing/weather evidence serve separate purposes.
for row in areas['wz-14']['encounters']:
    if row['id'] == 'g3-evidence-wz-14-helioptile-ordinary':
        row['condition']['time'] = 'daytime (source-corroborated)'
        row['condition']['weather'] = 'clear skies (source-corroborated)'
        row['condition']['notes'].append('Check around the Electrical Substation equipment in daytime under clear skies. Published ordinary levels are 37–38. An exact spawn point and the full weather-icon rules are not verified.')
        row['sources'] += [
            src('https://gamewith.jp/pokemon-za/524504', 'Lists ordinary levels 37–38 and distinguishes clear skies from less-clear weather in daytime.'),
            src('https://www.powerpyx.com/pokemon-legends-z-a-helioptile-location/', 'Independent first-hand catch guide reports sunny daytime and an approach by a small building.'),
            src('https://pente.koro-pokemon.com/legendsz-a/map-wild-zone-14.shtml', 'Independent ordinary encounter table lists daytime and sunny weather.'),
        ]
        row['notes'].append('The survey icon shows membership; the written references support the daytime clear-sky guidance, not a fixed point.')

# The observable progression event is clearer than an isolated mission number.
unlock_sources = [
    src('https://www.thonky.com/pokemon-legends-z-a/main-mission-31-a-summons-from-vinnie', 'After promotion to Rank B, Wild Zones 18 and 19 are available.'),
    src('https://www.powerpyx.com/pokemon-legends-z-a-all-wild-zone-locations/', 'Zones 18 and 19 open after Main Mission 30.'),
]
for n in [18,19]:
    areas[f'wz-{n:02}']['notes'].append('Written guides agree on availability after promotion to Rank B: after Main Mission 30 and at the start of Main Mission 31. The legacy guide’s number-only unlock label is preserved; the exact gate transition has not been observed in game.')
    for row in areas[f'wz-{n:02}']['encounters']:
        if row['encounter_class'] == 'ordinary' and row['evidence_status'] != 'disputed':
            row['condition']['unlock'] = 'After promotion to Rank B; after Main Mission 30 / start of Main Mission 31 (source-corroborated)'
            row['sources'] += [
                src(unlock_sources[0]['url'], 'Rank B availability.'),
                src(unlock_sources[1]['url'], 'Availability after Mission 30.'),
            ]
for row in areas['wz-19']['encounters']:
    if row['species'] == 'Drampa':
        row['condition']['time'] = 'morning (source-corroborated)'
        row['sources'] += [
            src('https://gamewith.jp/pokemon-za/525078', 'Marks Drampa as morning-only.'),
            src('https://www.gamerguides.com/pokemon-legends-z-a/guide/wild-zones/magenta-sector-9', 'Morning pavilion encounter recorded in AT324.'),
            src(P324, 'AT324-E05 separates ordinary Drampa from the conditional fixed Alpha Furfrou slot.'),
        ]
        row['notes'].append('This is ordinary Drampa, not a guaranteed Alpha. The pavilion/slot description is source-reported, not a new coordinate.')
areas['wz-19']['notes'].append('Clefairy and Furfrou have ordinary records as well as preserved fixed Alpha records. Ordinary Drampa is reported in the morning; do not turn it into a permanent Alpha slot.')
areas['wz-20']['notes'].extend([
    'The preserved 15 ordinary species and 67 possible rotating Alpha species remain separate. A pool of possible species does not mean they appear simultaneously or are guaranteed.',
    'Nine species belong to both preserved classes. Name-only deduplication would lose encounter information.',
    'Some guides label the rotating pool with a generic fixed Alpha heading. Atlas retains the existing rotating class and does not create permanent species-specific pins from that heading.',
])

# Mission encounters stay separate even when a species also has a repeatable ordinary entry.
mission_rows = [
    (1,'Mareep','Side Mission 17',None,None,'Scripted shiny Mareep encounter; level 11. It is separate from ordinary Mareep.'),
    (3,'Steelix','Main Mission 40',None,None,'Mission-only level-70 encounter; not a repeatable ordinary roster addition.'),
    (4,'Sableye','Side Mission 3',None,None,'Mission encounter at level 10; the source allows catching or defeating it.'),
    (4,'Houndstone','Side Mission 148',None,'night','Mission battle at level 75; the source states it cannot be caught.'),
    (4,'Greavard','Side Mission 148',None,'night','Four opponents are reported at level 50; none is catchable in this mission battle.'),
    (5,'Gallade','Main Mission 40',None,None,'Mission-only level-70 encounter; not a repeatable ordinary roster addition.'),
    (6,'Annihilape','Side Mission 180',None,None,'Alpha Annihilape mission battle at level 99; the source states it cannot be caught.'),
    (9,'Pangoro','Main Mission 40',None,None,'Mission-only level-70 encounter; not a repeatable ordinary roster addition.'),
    (11,'Xerneas','Main Mission 40',None,None,'Required legendary capture during the mission; separate from the ordinary roster.'),
    (17,'Skarmory','Side Mission 114',None,None,'Mission battle at level 65; the source states it cannot be caught.'),
    (20,'Zygarde','Main Mission 42',None,None,'Story battle and subsequent capture below the former Prism Tower; not an ordinary spawn or rotating Alpha.'),
]
for n, name, mission, form, time, note in mission_rows:
    add(f'wz-{n:02}', name, 'mission', 'source_lead', [src(bulb(n), note)], form=form,
        time=time + ' (source-reported)' if time else None, unlock=mission,
        notes=[note, 'This special encounter does not authorize an ordinary habitat highlight.'],
        suffix=slug(mission))

# Targeted follow-up for the nine sectors with no additive claims in the first draft.
# These are individually reviewed claims, not a copied district-wide roster.
def rotom(district):
    return f'https://rotomlabs.net/locations/legends-z-a/{district}-district'

def sector_page(district, number):
    return f'https://bulbapedia.bulbagarden.net/wiki/{district.title()}_Sector_{number}'

add('vert-sector-3', 'Cleffa', 'ordinary', 'source_corroborated', [
    src('https://www.bisafans.de/routendex/illumina-city/verte-bezirk-3.php', 'Roof east of Wild Zone 2.'),
    src(rotom('vert'), 'Sector 3 walking entry.')], floor='roof (source-reported)',
    condition_notes=['Published level ranges differ: Bisafans 12–15; RotomLabs 10–13. No level restriction is promoted.'],
    notes=['Sector membership is corroborated. The roof, conditions, and exact position still need direct verification.'], suffix='targeted-sector-membership')
add('vert-sector-3', 'Patrat', 'unclassified_lead', 'source_corroborated', [
    src('https://www.bisafans.de/routendex/illumina-city/verte-bezirk-3.php', 'Area-specific Alpha entry.'),
    src(rotom('vert'), 'Sector 3 separate Alpha entry.')],
    notes=['Two sources report an Alpha here, but neither reviewed heading establishes fixed versus random Alpha. The original zone rosters are unaffected.'],
    condition_notes=['Published Alpha levels are 21–23 and 21–24.'], suffix='alpha-class-unresolved')
add('vert-sector-3', 'Dragonite', 'scripted_boss', 'source_lead', [
    src(sector_page('vert', 3), 'Rogue Mega Dragonite story battle.')], form='Mega', unlock='Main Mission 32',
    notes=['Level-59 scripted battle. This is not an ordinary repeatable habitat.'], suffix='main-mission-32')
add('vert-sector-3', 'Squawkabilly', 'mission', 'source_lead', [
    src(sector_page('vert', 3), 'Side Mission 134 rooftop battle.')], floor='roof (source-reported)', unlock='Side Mission 134',
    notes=['Four level-75 opponents are reported; none can be caught in this battle. Plumage forms are not inferred.'], suffix='side-mission-134')

add('magenta-sector-2', 'Larvitar', 'ordinary', 'source_corroborated', [
    src('https://www.bisafans.de/routendex/illumina-city/rose-bezirk-2.php', 'Roof east of Wild Zone 7.'),
    src(rotom('magenta'), 'Sector 2 walking entry, distinct from its Alpha row.')], floor='roof (source-reported)',
    condition_notes=['Published ordinary level ranges differ: Bisafans 12–16; RotomLabs 22–24. No level restriction is promoted.'],
    notes=['Sector membership is corroborated; exact floor access and encounter conditions are not established.'], suffix='targeted-sector-membership')
for name in ['Alakazam', 'Aerodactyl', 'Metagross']:
    add('magenta-sector-2', name, 'scripted_boss', 'source_lead', [
        src(sector_page('magenta', 2), 'Rogue Mega battle during Main Mission 37.')], form='Mega', unlock='Main Mission 37',
        notes=['The source lists level 62. A story boss is not an ordinary wild-habitat record.'], suffix='main-mission-37')
add('magenta-sector-2', 'Fennekin', 'gift', 'source_lead', [
    src(rotom('magenta'), 'Sector 2 gift listing, separate from walking encounters.')],
    notes=['The source lists level 14. The acquisition prerequisite and exact place have not been independently verified; this gift does not authorize wild habitat.'],
    suffix='gift-source-lead')

add('rouge-sector-1', 'Goomy', 'ordinary', 'source_corroborated', [
    src('https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-1.php', 'Roof west of Rouge Plaza beside the fountain.'),
    src(rotom('rouge'), 'Sector 1 walking entry.')], floor='roof (source-reported)',
    notes=['Area membership is corroborated. Published levels differ; exact timing, weather, access, and position remain unverified.'], suffix='targeted-sector-membership')
add('rouge-sector-6', 'Ampharos', 'scripted_boss', 'source_corroborated', [
    src(sector_page('rouge', 6), 'Rogue Mega Ampharos, Main Mission 23.'),
    src('https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-6.php', 'Ampharosite reward associated with that mission.')], form='Mega', unlock='Main Mission 23',
    notes=['The sector page lists the level-48 story boss. This is separate from repeatable wild encounters.'], suffix='main-mission-23')
for name, levels in [('Abra', '18–20'), ('Trubbish', '12–14')]:
    add('rouge-sector-6', name, 'ordinary', 'source_lead', [src(rotom('rouge'), f'Sector 6 walking entry, levels {levels}.')],
        notes=['A bounded written-source lead; no comprehensive sector roster, exact location, or condition is established.'], suffix='targeted-walking-lead')

for name in ['Weedle', 'Pidgey']:
    add('jaune-sector-1', name, 'ordinary', 'source_lead', [src(rotom('jaune'), 'Sector 1 walking entry, levels 7–9.')],
        notes=['Only this source-qualified membership is recorded. An open or building-free sector is not evidence that no Pokémon occur there.'], suffix='targeted-walking-lead')
add('jaune-sector-5', 'Dratini', 'ordinary', 'source_corroborated', [
    src('https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-5.php', 'Sunny-weather roof west of Wild Zone 19.'),
    src('https://www.gamerguides.com/pokemon-legends-z-a/database/pokedex/pokemon/dratini', 'Names Jaune Sector 5 rooftops.'),
    src('https://bulbapedia.bulbagarden.net/wiki/Dratini', 'Lists Jaune Sector 5 among locations.')],
    floor='roof (source-corroborated)', weather='sunny (source-reported)',
    notes=['Area and roof reports agree, but the weather restriction, precise route, and position have not been independently confirmed.'], suffix='targeted-sector-membership')
add('jaune-sector-5', 'Garbodor', 'unclassified_lead', 'source_lead', [
    src('https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-5.php', 'Area-specific Alpha entry, levels 39–40.')],
    notes=['Alpha is reported; fixed versus random Alpha is not established by the reviewed source.'], suffix='alpha-class-unresolved')
for name, levels in [('Pansage','14–17'),('Pansear','14–17'),('Panpour','14–17'),('Fletchling','6–9'),('Scatterbug','6–9'),('Vivillon','13–16')]:
    add('jaune-sector-12', name, 'ordinary', 'source_lead', [src(rotom('jaune'), f'Sector 12 walking entry, levels {levels}.')],
        form='Meadow Pattern' if name == 'Vivillon' else None,
        notes=['The numbered-sector heading supports this source lead. It is not copied from the nearby Wild Zone 6 roster or a district-wide list.'], suffix='targeted-walking-lead')

areas['bleu-sector-10']['notes'].append('Reviewed sector pages place Wild Zone 10 over much of Bleu Sector 10. They do not establish a separate complete outdoor roster or prove there are no encounters outside the zone.')
areas['magenta-sector-5']['notes'].append('Reviewed sector pages place Wild Zone 9 over most of Magenta Sector 5. The zone roster is not copied into the sector; separate outdoor availability remains unverified.')
areas['jaune-sector-12']['notes'].append('Wild Zone 6 occupies part of this sector. The sector-specific written walking leads and the Wild Zone roster retain their different area identities.')

# Plain-language notes for all 48 sectors, including empty rosters.
for aid, area in areas.items():
    if not aid.startswith('wz-'):
        has = bool(area['encounters'])
        area['notes'].insert(0, 'This sector roster is not comprehensive. ' + (
            'Only the individually sourced claims below have been reviewed.' if has else
            'No encounter roster has been verified here; an empty list means missing evidence, not no Pokémon.'))
        area['notes'].append('Sector identity, boundary, walking route, and species encounter evidence are separate. A nearby Wild Zone does not prove the entire sector is a habitat.')
    if not area['encounters'] and aid.startswith('wz-'):
        raise AssertionError(aid)
for aid in ['bleu-sector-1','bleu-sector-2']:
    areas[aid]['notes'].append('Wild Zone 5 overlaps these numbered sectors and the street between them. Its roster is not automatically a whole-sector roster.')
for aid in ['jaune-sector-10','vert-sector-6']:
    areas[aid]['notes'].append('Wild Zone 11 spans parts of two districts on opposite canal banks. The shared zone roster does not establish every encounter throughout this sector or a direct walking crossing.')
areas['wz-05']['notes'].append('The zone and Bleu Sectors 1 and 2 overlap but remain different area identities; sewer access and rooftop encounters require separate location evidence.')
areas['wz-11']['notes'].append('The owner card and written geography cover opposite canal banks. No direct crossing route or whole-sector habitat is inferred.')
areas['wz-14']['notes'].append('The current written page and owner image agree on Electrical Substation in Magenta District. The old district-label discrepancy is historical; precise boundary registration remains a separate task.')

# Keep all rows deterministic and make the status vocabulary explicit in the audit sidecar.
for area in areas.values():
    area['encounters'].sort(key=lambda r:(r['species'],r['encounter_class'],r['form'] or '',r['id']))
    area['notes'] = list(dict.fromkeys(area['notes']))
payload = {'schemaVersion': 1, 'areas': list(areas.values())}
assert len(payload['areas']) == 68
assert len([a for a in payload['areas'] if a['area_id'].startswith('wz-')]) == 20
all_rows = [r for a in payload['areas'] for r in a['encounters']]
assert len({r['id'] for r in all_rows}) == len(all_rows)
assert all(a['roster_status'] == 'not_comprehensive' for a in payload['areas'])
assert sum(len(x) for x in cards.values()) == 140
for row in all_rows:
    for source in row['sources']:
        assert ('url' in source) != ('path' in source)
        if 'path' in source:
            assert (ROOT / source['path']).is_file(), source
        else:
            assert source['url'].startswith('https://')
            assert not any(x in source['url'].lower() for x in ['youtube','youtu.be','vimeo']), source

summary = {
    'as_of': '2026-11-26', 'baseline_main_sha': BASE,
    'register_status': 'additive_source_review_not_complete_release_evidence',
    'g3_complete': False,
    'area_count': len(areas), 'sector_count': 48, 'wild_zone_count': 20,
    'complete_rosters': 0,
    'sectors_with_additive_claims': sum(not aid.startswith('wz-') and bool(a['encounters']) for aid,a in areas.items()),
    'sectors_without_additive_claims': [aid for aid,a in areas.items() if not aid.startswith('wz-') and not a['encounters']],
    'additive_claims': len(all_rows),
    'by_encounter_class': dict(Counter(r['encounter_class'] for r in all_rows)),
    'by_evidence_status': dict(Counter(r['evidence_status'] for r in all_rows)),
    'owner_survey_images_reviewed': 20, 'owner_survey_species_area_icons': 140,
    'preserved_baseline': {
        'wild_zone_records': len(baseline),
        'species_area_memberships': sum(len(z['species']) for z in baseline),
        'fixed_alpha_rows': sum(len(z['fixedAlphas']) for z in baseline),
        'rotating_alpha_candidates': sum(len(z['rotatingAlphas']) for z in baseline),
        'wild_zone_20_ordinary_species': len(baseline[-1]['species']),
        'wild_zone_20_ordinary_rotating_overlap': sorted(set(baseline[-1]['species']) & set(baseline[-1]['rotatingAlphas'])),
        'baseline_module_sha256': hashlib.sha256((OUT/'baseline-fieldbook.mjs').read_bytes()).hexdigest(),
    },
    'status_meanings': {
        'owner_survey_correlated': 'Species is visibly on the owner survey card and a written zone table supplies the ordinary class; missing conditions remain unknown.',
        'source_corroborated': 'The stated bounded claim is supported by multiple written sources in the referenced audit; it is not in-game capture or geometry evidence.',
        'source_lead': 'A source reports this claim; required independent verification or classification is incomplete.',
        'disputed': 'Reviewed sources disagree or the species/area/class remains unresolved; do not treat as a verified catchable habitat.',
    },
    'integration_invariants': [
        'Never replace or sort/deduplicate the original wildZoneRecords arrays in place.',
        'Preserve both same-name fixed Pyroar and Meowstic rows and their original conditions.',
        'Do not classify ordinary membership by subtracting fixed Alpha names from the species union.',
        'Do not authorize geometry from a source lead, disputed claim, gift, trade, mission, or scripted boss.',
        'Unknown time, weather, floor, form, and unlock are null, not unrestricted availability.',
        'A route approach label is not an encounter-area identity.',
        'A survey card does not prove absence of species outside its icons.',
        'No random session-dependent distortion becomes a permanent map point.',
    ],
    'source_registers': [P322,P323,P324],
    'current_source_notes': [
        'Current PokéMaps Gastly page still lists WZ18 and omits WZ7.',
        'Current Bulbapedia WZ14 infobox and prose now agree on Magenta District; original owner image agrees on Electrical Substation and adjacent Magenta Sector 6.',
        'WZ18/19 unlock is source-corroborated as after reaching Rank B; legacy mission labels remain unchanged.',
        'Serebii district pages expose district-wide spawn tables and sector-specific trainer/item sections. District-wide species must not be copied into every numbered sector.',
    ],
    'unresolved_release_requirements': [
        'Comprehensive class-aware encounter review for each of 48 sectors and 20 zones.',
        'Explicit time/weather/floor/form and progression checks where sources are incomplete or conflicting.',
        'WZ7 Gastly, WZ17 Talonflame and ordinary Mawile / fixed Pyroar forms, WZ18 Gastly.',
        'WZ5, WZ10, WZ12 and WZ15 supplementary table entries and survey-card differences.',
        'Independent geometry and exact spawn/route evidence; no new polygon or coordinate is supplied here.',
    ],
}
assert summary['preserved_baseline']['fixed_alpha_rows'] == 38
assert summary['preserved_baseline']['rotating_alpha_candidates'] == 67
assert summary['preserved_baseline']['species_area_memberships'] == 167
assert len(summary['preserved_baseline']['wild_zone_20_ordinary_rotating_overlap']) == 9

unassigned = {
    'schemaVersion': 1,
    'status': 'retained_research_outside_the_68_area_register',
    'reason': 'These named places, gifts, trades, or route approaches must not be forced into a numbered sector without location evidence.',
    'records': [
        {'species':'Lucario','place':'Hotel Z, Room 202','encounter_class':'gift','condition':'Level-50 post-story gift',
         'sources':[src('https://www.serebii.net/legendsz-a/giftpokemon.shtml','Post-story gift.'),src('https://bulbapedia.bulbagarden.net/wiki/Hotel_Z','Room 202 gift context.'),src(P322,'Gift classification corroborated in the original audit.')]},
        {'species':'Riolu','place':None,'encounter_class':'trade','condition':'Side Mission 24; exact numbered-sector identity not assigned here',
         'sources':[src(P324,'AT324-E01 separates the trade from wild roof encounters.')]},
        {'species':'Gastly','place':'Espace Vide','encounter_class':'unclassified_lead','condition':'Provider reports levels 15–18; floor and exact area identity need verification',
         'sources':[src('https://pokemaps.net/maps/lza/lumiose/espace-vide','Area-page lead.'),src(P322,'No numbered sector assigned by this review.')]},
        {'species':'Gastly','place':'Lumiose Sewers','encounter_class':'unclassified_lead','condition':'Walking and static labels require separate classification',
         'sources':[src('https://pokemaps.net/maps/lza/lumiose/gastly','Sewer rows use walking and static labels.')]},
        {'species':'Litwick','place':'Lumiose Sewers','encounter_class':'unclassified_lead','condition':'Interior floor and access prerequisites unresolved',
         'sources':[src('https://pokemaps.net/locations/litwick','Named-location lead.'),src(P322,'Interior access not established.')]},
    ],
}
for filename, value in [
    ('atlas-area-evidence.json',payload),
    ('owner-survey-observations.json',{'schemaVersion':1,'observations':survey_observations}),
    ('encounter-audit-summary.json',summary),
    ('unassigned-encounter-leads.json',unassigned),
]:
    (OUT/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
