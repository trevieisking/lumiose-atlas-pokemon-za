#!/usr/bin/env python3
"""Generate the static homepage from individually editable recovered guide sections.
No internet, API access, dependencies, or deployment steps.
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
template=(root/'src/template.html').read_text(encoding='utf-8')
needed=re.findall(r'<!--\s*SECTION:([a-z0-9_-]+)\s*-->', template)
if len(needed)!=17:raise SystemExit(f'Expected 17 section slots, got {len(needed)}')
for name in needed:
    content=(root/'src/sections'/f'{name}.html').read_text(encoding='utf-8')
    template=re.sub(r'<!--\s*SECTION:'+re.escape(name)+r'\s*-->', lambda _:content, template, count=1)
(root/'index.html').write_text(template,encoding='utf-8')
print(f'Built index.html with {len(needed)} recovered sections ({len(template):,} characters).')
