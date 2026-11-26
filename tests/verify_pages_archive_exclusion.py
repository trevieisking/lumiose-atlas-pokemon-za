"""Check actual Jekyll output, not just the authored HTML guide."""
from pathlib import Path
import re
import sys

dist = Path(sys.argv[1])
# The live guide contents must be copied unchanged by the hosting config.
pages = (
    "index.html", "walkthrough.html", "side-missions.html", "maps.html",
    "atlas-explorer.html", "sector-maps.html", "items.html", "feedback.html",
    "maps/lumiose-game-map.jpg", "atlas-collectibles-data.json",
)
for rel in pages:
    assert (dist / rel).is_file(), rel
    assert (dist / rel).read_bytes() == Path(rel).read_bytes(), rel

rules = Path("_config.yml").read_text().splitlines()
excluded = [m[1] for line in rules if (m := re.fullmatch(r"  - '(.+\.md)'", line))]
assert len(excluded) == 7, excluded
for rel in excluded:
    assert Path(rel).is_file(), rel
    assert not (dist / rel).exists(), rel
    assert not (dist / Path(rel).with_suffix(".html")).exists(), rel

provider = re.compile(r"youtube(?:-nocookie)?\.com|youtu\.be|buddyvidz|maestro\.tv|mux\.com|<\s*video\b", re.I)
bad = []
for file in dist.rglob("*.html"):
    if provider.search(file.read_text(encoding="utf-8", errors="replace")):
        bad.append(str(file.relative_to(dist)))
assert not bad, "Archived media references still served: " + ", ".join(bad)
print("PASS: seven archive pages unhosted, no public HTML media references, canonical guide assets unchanged.")
