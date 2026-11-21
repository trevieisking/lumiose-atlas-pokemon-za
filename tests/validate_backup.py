#!/usr/bin/env python3
"""Source integrity and non-loss checks for Lumiose Atlas local progress backups."""
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def read(name):
    path = ROOT / name
    assert path.exists(), f"Missing {name}"
    return path.read_text(encoding="utf-8")
manifest = read("progress-keys.js")
match = re.search(r'window\.LUMIOSE_PROGRESS_KEYS\s*=\s*(\{[\s\S]*\});',manifest)
assert match, "Progress manifest missing"
keys = json.loads(match.group(1))
assert keys["version"] == 1
categories = {"check":"data-check","sideCheck":"data-side-check","legendCheck":"data-legend-check","pickup":"data-pickup","screw":"data-screw"}
sources = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT/"src/sections").glob("*.html"))
expected = {"check":42,"sideCheck":203,"legendCheck":25,"pickup":264,"screw":100}
for kind, attribute in categories.items():
    seen = set(re.findall(rf'{re.escape(attribute)}="([^"]+)"',sources))
    saved = keys["keys"][kind]
    assert set(saved) == seen, f"{kind}: manifest differs from actual checklist IDs"
    assert len(saved) == len(set(saved)) == expected[kind], f"{kind}: unexpected checklist count"
main = read("index.html")
template = read("src/template.html")
backup = read("progress-backup.html")
controller = read("progress-backup.js")
assert 'href="progress-backup.html"' in main
assert 'href="progress-backup.html"' in template
assert 'href="progress-backup.html"' in read("src/sections/home.html")
for filename in ["progress-keys.js","map-pin-index.js","progress-backup.js","progress-backup.css"]:
    assert filename in backup, f"Missing backup page resource {filename}"
for id in ["downloadBackup","copyLegacyExporter","legacyBookmarkletCode",
           "backupInput","importPreview","confirmBackupImport","downloadPreImport"]:
    assert f'id="{id}"' in backup, f"Missing safety UI {id}"
assert "original-site-checkboxes" in controller
assert "lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site" in controller
assert "data-check" in controller and "data-side-check" in controller
assert "lumiose-atlas-reconstruction-v1" in controller
assert "lumiose-atlas-mapped-pins-v1" in controller
assert "lumiose-atlas-last-pre-import-v1" in controller
assert "Merge completed progress safely" in backup
assert "sendBeacon" not in controller and "XMLHttpRequest" not in controller
assert "fetch(" not in controller
assert "localStorage.setItem(PREVIOUS" in controller, "Import must save recovery snapshot first"
assert "localStorage.setItem(CURRENT" in controller, "Import must update existing state"
assert "if (!value) continue" in controller, "Import must preserve true checkmarks"
assert "type=\"file\"" in backup
assert (ROOT / "map-pin-index.js").exists(), "Numbered map state must be included"
print("Progress backup integrity checks passed: 634 exact progress keys, 5 categories, safe local-only importer.")
