"""Render the shared rank data as offline HTML. Run build.py afterwards."""
from pathlib import Path
from html import escape
import json
import re

root = Path(__file__).resolve().parents[1]
milestones = json.loads((root / 'docs/qa/ATLAS_STORY_OBEDIENCE.json').read_text())['milestones']
block = re.compile(r'<!-- obedience:start -->.*?<!-- obedience:end -->\n?', re.S)
cards = {
    'src/sections/walkthrough.html': (r'<article class="mission" id="mission-(\d+)">', '<div class="mission-body">', '<div class="toolbar">'),
    'walkthrough.html': (r'<article class="route-index-card" id="mission-(\d+)"[^>]*>', '<details class="route-index-details">', '<div class="route-index-no-results"'),
    'journey.html': (r'<article class="journey-card" id="journey-mission-(\d+)"[^>]*>', '<ol class="journey-steps">', '<div id="journeyNoResults"'),
}
def cap(row):
    return f'through Lv. {row["cap"]}' if row['cap'] is not None else 'all levels'

def label(mission, local):
    i = max(i for i, m in enumerate(milestones) if m['mission'] <= mission)
    m = milestones[i]
    when = f'After beating {m["battle"]}' if m['mission'] == mission else 'After this mission'
    previous = f' (was Rank {milestones[i-1]["rank"]}, {cap(milestones[i-1])})' if m['mission'] == mission else ''
    href = '#rank-obedience' if local else 'walkthrough.html#rank-obedience'
    return (f'<p class="obedience-note" data-obedience-mission="{mission}"><strong>{escape(when)}:</strong> '
            f'Rank {m["rank"]} · caught Pokémon obey {cap(m)}{previous}. '
            f'<a href="{href}">Obedience limits</a></p>')

def wrapper(text):
    return '<!-- obedience:start -->'+text+'<!-- obedience:end -->'

table = ['<details class="journey-callout" id="rank-obedience" open><summary><strong>What level will obey?</strong></summary>',
         '<p>For wild Pokémon you catch, check their <strong>level when caught</strong>, not their current level. A Pokémon caught within the limit still obeys if you train it above the limit later. Check your current limit in the in-game Save screen.</p>',
         '<p>The limit rises after you win the promotion match. Mission 09 leaves you at Rank V; defeating Vinnie during Mission 10 takes you straight to Rank F.</p>',
         '<table><caption>Z-A Royale obedience milestones</caption><thead><tr><th scope="col">When</th><th scope="col">Rank</th><th scope="col">Caught Pokémon obey</th></tr></thead><tbody>']
for m in milestones:
    when = f'Mission {m["mission"]:02d}: beat {m["battle"]}' if m['mission'] else 'Start of the game'
    table.append(f'<tr><th scope="row">{when}</th><td>{m["rank"]}</td><td>{cap(m)}</td></tr>')
table += ['</tbody></table>',
          '<p><strong>Example:</strong> Lv. 38–39 Alpha Dratini is within Rank V’s limit of 40 after beating Rintaro in Mission 08. At Rank W the limit is 35. Being able to reach a rooftop is a separate question.</p></details>']
for path, (card_pattern, slot, overview) in cards.items():
    p = root / path
    doc = block.sub('',p.read_text())
    local = path == 'walkthrough.html'
    overview_html = ''.join(table) if local else '<p><a href="walkthrough.html#rank-obedience">Check the obedience limit for each Royale rank</a>.</p>'
    idx = doc.index(overview)
    doc = doc[:idx] + wrapper(overview_html) + doc[idx:]
    pattern = re.compile(r'('+card_pattern+r'(?:(?!</article>).)*?)('+re.escape(slot)+r')',re.S)
    missions = []
    def add(match):
        mission = int(match[2]);missions.append(mission)
        note = wrapper(label(mission,local))
        return match[1]+match[3]+note if slot == '<div class="mission-body">' else match[1]+note+match[3]
    doc = pattern.sub(add, doc)
    assert missions == list(range(1,43)), (path, missions)
    p.write_text(doc)
