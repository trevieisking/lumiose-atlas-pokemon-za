"""Verify owner-image integrity and prevent the research data masquerading as live points."""
from pathlib import Path
import hashlib
import json
import math

root = Path(__file__).resolve().parents[1]
folder = root / "assets/atlas/city-overview/owner-crops-2026-11-26"
manifest = json.loads((folder / "manifest.json").read_text())
assert manifest["status"] == "candidate_G2_source_registration_not_production"


def verify_jpeg(data, size):
    assert data.startswith(b"\xff\xd8") and data.endswith(b"\xff\xd9")
    i = 2
    while i + 8 < len(data) and data[i] == 255:
        marker = data[i + 1]
        length = int.from_bytes(data[i + 2:i + 4], "big")
        assert length >= 2
        if marker in {0xC0, 0xC1, 0xC2}:
            height = int.from_bytes(data[i + 5:i + 7], "big")
            width = int.from_bytes(data[i + 7:i + 9], "big")
            assert (width, height) == size
            return
        i += 2 + length
    raise AssertionError("No JPEG frame header")


records = manifest["records"]
assert [x["source_name"] for x in records] == [f"{i}.jpg" for i in range(1000028696, 1000028704)]
assert len({x["sha256"] for x in records}) == 8
for row in records:
    file = folder / row["source_name"]
    assert root / row["path"] == file and row["format"] == "JPEG"
    data = file.read_bytes()
    assert len(data) == row["bytes"]
    assert hashlib.sha256(data).hexdigest() == row["sha256"]
    git = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
    assert git == row["git_blob_sha"]
    verify_jpeg(data, (row["width"], row["height"]))
    assert row["width"] == 2048
    reg = row["candidate_registration"]
    fit, hold = reg["fit_points"], reg["held_out_points"]
    assert len(fit) >= 4 and len(hold) >= 4
    assert not {tuple(p["source_xy"]) for p in fit} & {tuple(p["source_xy"]) for p in hold}
    a = reg["candidate_affine"]
    assert a[2] == [0, 0, 1] and a[0][0] * a[1][1] - a[1][0] * a[0][1] > 0
    for group in (fit, hold):
        first, second = (group[i]["source_xy"] for i in (0, 1))
        assert any((second[0] - first[0]) * (q["source_xy"][1] - first[1])
                   != (second[1] - first[1]) * (q["source_xy"][0] - first[0]) for q in group[2:])
        for p in group:
            x, y = p["source_xy"]
            xy = [a[i][0] * x + a[i][1] * y + a[i][2] for i in range(2)]
            assert 0 <= x < row["width"] and 0 <= y < row["height"]
            assert all(0 <= v < 1920 for v in p["base_xy"])
            assert abs(math.dist(xy, p["base_xy"]) - p["residual_px"]) < 0.001

qa = root / "docs/qa"
wz5 = json.loads((qa / "ATLAS_WZ05_OWNER_OVERVIEW_OUTLINE.json").read_text())
assert wz5["state"] == "cross_checked_candidate_visible_outline_not_production"
assert len(wz5["sources"]) == 4
assert wz5["candidate_reference_outline"][0] == wz5["candidate_reference_outline"][-1]
early = json.loads((qa / "ATLAS_EARLY_ZONE_OUTLINE_SCREENING.json").read_text())
assert [r["zone"] for r in early["screening"]] == [1, 2, 3, 4, 6]
assert early["approved_polygons"] == early["approved_pickup_pins"] == 0
for path in ("atlas-explorer.js", "atlas-explorer-data.json", "atlas-collectibles-data.json", "maps.js"):
    body = (root / path).read_text()
    assert "owner-crops-2026-11-26" not in body and "ATLAS_WZ05_OWNER_OVERVIEW_OUTLINE" not in body
print("PASS: eight exact owner crops, independent registrations, research-only outline records.")
