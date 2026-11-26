#!/usr/bin/env python3
"""Verify the recovered immutable source archive from any checkout location."""

import hashlib
import json
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


packet = Path(__file__).resolve().parent
root = packet.parents[2]
recovery = json.loads((packet / "source-recovery.json").read_text())
preserved = json.loads((packet / "preserved-files.json").read_text())
failures = []
checks = 0

for entry in recovery["entries"]:
    path = root / entry["repository_path"]
    checks += 1
    if not path.is_file() or digest(path) != entry["sha256"]:
        failures.append(entry["repository_path"])
    for version in entry["other_preserved_versions"]:
        path = root / version["repository_path"]
        checks += 1
        if not path.is_file() or digest(path) != version["sha256"]:
            failures.append(version["repository_path"])

for entry in preserved["files"]:
    path = root / entry["path"]
    checks += 1
    if not path.is_file() or digest(path) != entry["sha256"]:
        failures.append(entry["path"])

sector_register = json.loads(
    (root / "docs/qa/at344-sector-source-survey/sector-coverage.json").read_text()
)
sectors = sector_register["sectors"]
if len(sectors) != 48 or len({entry["sector_id"] for entry in sectors}) != 48:
    failures.append("The preserved sector register must contain 48 distinct sector IDs.")
if len(recovery["entries"]) != 26:
    failures.append("The recovered collection must contain all 26 JPEG originals.")

print(json.dumps({
    "status": "FAIL" if failures else "PASS",
    "file_hash_checks": checks,
    "original_sources": len(recovery["entries"]),
    "historical_packet_files": len(preserved["files"]),
    "preserved_full_frame_versions": sum(
        len(entry["other_preserved_versions"]) for entry in recovery["entries"]
    ),
    "sector_ids": len(sectors),
    "failures": failures,
}, indent=2))
raise SystemExit(bool(failures))
