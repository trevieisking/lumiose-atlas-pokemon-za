"""Check actual Jekyll output, not just the authored HTML guide."""
from pathlib import Path
import re
import hashlib
import sys
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

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

# A1-03: verify actual hosted images on every root player-facing HTML surface.
# External artwork is inventoried, not fetched or conflated with owner photos.
image_suffixes = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".ico"}
class GuideImages(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "img" and attrs.get("src"):
            self.references.append(attrs["src"])
        if tag == "a" and attrs.get("href") and Path(urlsplit(attrs["href"]).path).suffix.lower() in image_suffixes:
            self.references.append(attrs["href"])

source_pages = sorted(Path(".").glob("*.html"))
assert len(source_pages) >= 27, "Existing player guide pages must remain present"
local_images, external_images = set(), set()
for page in source_pages:
    built = dist / page
    assert built.is_file() and built.read_bytes() == page.read_bytes(), page
    scan = GuideImages()
    scan.feed(built.read_text(encoding="utf-8"))
    for raw in scan.references:
        parsed = urlsplit(raw)
        if parsed.scheme or parsed.netloc:
            external_images.add(raw)
            continue
        rel = Path(unquote(parsed.path))
        assert not rel.is_absolute() and ".." not in rel.parts, (page, raw)
        assert rel.is_file(), (page, raw, "missing source image")
        local_images.add(rel)

# The shared modules choose these gallery images dynamically. Check the entire
# runtime inventory as well as the static HTML references, preserving duplicates
# that are deliberate wider views, source fallbacks or separate capture roles.
for folder in ("wild-zones", "holovators", "sector-context", "sector-streets", "ladders"):
    root = Path("assets/atlas") / folder
    assert root.is_dir(), root
    local_images.update(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in image_suffixes)
for rel in sorted(local_images):
    built = dist / rel
    assert built.is_file(), (rel, "missing from actual Pages output")
    assert built.read_bytes() == rel.read_bytes(), (rel, "changed by Pages build")
assert len(local_images) >= 200, "Photo/image inventory coverage unexpectedly fell"
print(f"A1-03: {len(source_pages)} guide HTML pages; {len(local_images)} local image assets present byte-for-byte; {len(external_images)} external image URLs inventoried (not network-verified).")

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
