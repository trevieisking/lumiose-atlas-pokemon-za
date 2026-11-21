#!/usr/bin/env python3
"""Source-integrity check for the independent static reconstruction."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re, sys, hashlib
ROOT=Path(__file__).resolve().parents[1]
VIEWS=['home','walkthrough','sidequests','dimension','bosses','alphas','maps','items','legends','berries','starters','pokedex','essentials','secrets','rewards','battles','sources']
class Scan(HTMLParser):
    def __init__(self):super().__init__();self.src=[];self.href=[];self.ids=set();self.sections=[];self.tagstack=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):self.ids.add(attrs['id'])
        if tag=='section':self.sections.append(attrs.get('id'))
        for key,into in [('src',self.src),('href',self.href)]:
            if attrs.get(key):into.append(attrs[key])

errors=[]
index=ROOT/'index.html'
if not index.exists():errors.append('Run python3 scripts/build.py to generate index.html')
else:
    doc=index.read_text(encoding='utf8')
    scan=Scan();scan.feed(doc)
    if scan.sections!=VIEWS:errors.append('17 section order/names do not match manifest')
    if len(re.findall(r'class="mission"',doc))!=42:errors.append('Expected 42 missions')
    if len(re.findall(r'data-side-check=',doc))!=203:errors.append('Expected 203 side missions')
    if len(re.findall(r'class="dex-card"',doc))!=232:errors.append('Expected 232 visible Pokédex cards')
    if len(re.findall(r'data-select-zone=',doc))<20:errors.append('Expected 20 city map pins')
    for link in scan.src+scan.href:
        if link.startswith(('https://','http://','mailto:','tel:','data:','javascript:','#')):continue
        u=urlsplit(link);p=unquote(u.path)
        if not p:continue
        file=(ROOT/p)
        if not file.exists():errors.append(f'Missing referenced file: {link}')
    for k in ['sb_publishable_','service_role_key','sk-proj-','ghp_','eyJhbGciOi']:
        if k in doc or k in (ROOT/'app.js').read_text():errors.append(f'Credential-like string in generated site: {k}')
    if 'fetch(' in (ROOT/'app.js').read_text():errors.append('Unexpected fetch() in offline controller')
    for id in VIEWS:
        if not (ROOT/'src/sections'/f'{id}.html').exists():errors.append(f'Missing editable section {id}')
    routes=json.loads((ROOT/'routes.json').read_text())
    for path in routes['standalone_paths_not_recovered']:
        if not (ROOT/path).exists():errors.append(f'Missing placeholder route {path}')
    manifest=json.loads((ROOT/'source-assets-manifest.json').read_text())
    for asset in manifest['files']:
        path=ROOT/asset['path']
        if not path.is_file():errors.append('Missing saved resource '+str(path))
        elif hashlib.sha256(path.read_bytes()).hexdigest()!=asset['sha256']:errors.append('Modified saved resource '+str(path))
    print(f'Parsed {len(scan.sections)} sections, {len(scan.href)} page links, {len(scan.src)} image/script references and {len(manifest["files"])} captured resources.')

# Verify the first independently researched article; guard against regressions
# to the recovered placeholder or accidentally incomplete level tables.
mable_page=ROOT/'mable-research.html'
if not mable_page.exists():
    errors.append("Mable's Research page missing")
else:
    mable_text=mable_page.read_text(encoding='utf-8')
    research_levels=re.findall(r'<tr id="research-level-(\\d+)"',mable_text)
    if research_levels != [str(n) for n in range(2,51)]:
        errors.append("Mable research levels 2–50 must each occur once in order")
    for marker in [
        'Gold Bottle Cap ×3', 'Master Ball ×1', 'Shiny Charm ×1',
        'TM102 — Focus Blast', 'href="index.html#walkthrough"',
        '<aside aria-label="Guide navigation"',
    ]:
        if marker not in mable_text:
            errors.append("Mable's Research missing verified field: "+marker)
    if 'ARTICLE NOT YET RECOVERED' in mable_text:
        errors.append("Mable's Research has regressed to a placeholder")
    if 'service_role_key' in mable_text or 'sk-proj-' in mable_text:
        errors.append("Mable's Research contains credentials")

if errors:
    print('FAILED:',*errors,sep='\n- ')
    sys.exit(1)
print('PASS: offline build, local link completeness, source manifest and secret-pattern checks')
