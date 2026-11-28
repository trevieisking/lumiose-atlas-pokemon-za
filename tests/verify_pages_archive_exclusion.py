"""Check actual Jekyll output, not just the authored HTML guide."""
from pathlib import Path
import re
import hashlib
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

# AT-348: verify restored originals in the actual built site, not archive URLs.
originals = (
    ("assets/atlas/wild-zones/originals/wild-zone-15-overview.jpg", "20261125_165929.jpg", "7d86a7863b52cf9fa45c223655f524e0fcf9917a72260034a8fde3804ca2891a"),
    ("assets/atlas/wild-zones/originals/wild-zone-17-overview.jpg", "20261125_170158.jpg", "f6c2cf3ed37d362dfc54890c3730614b35f4a709b378e8eeffcc3e47363b9ee5"),
    ("assets/atlas/wild-zones/originals/wild-zone-17-closeup.jpg", "20261125_170238.jpg", "57a4746a3896f8f4abf664486aa79f740d884e2cfe8bc73608f57d1085e38617"),
)
for rel, filename, expected_hash in originals:
    archive = Path("docs/qa/at344-sector-source-survey/sources") / filename
    assert not (dist / archive).exists(), f"Research archive unexpectedly hosted: {archive}"
    original = archive.read_bytes()
    assert hashlib.sha256(original).hexdigest() == expected_hash, filename
    assert Path(rel).read_bytes() == original, rel
    assert (dist / rel).is_file(), rel
    assert (dist / rel).read_bytes() == original, rel

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
