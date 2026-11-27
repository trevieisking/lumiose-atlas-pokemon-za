#!/usr/bin/env python3
"""Reproduce Atlas AT-346's offline generated Hyperspace audit.

Run from the repository with the four pinned JSON files in INPUT_DIR. The
output is research evidence, not a public encounter database or a game guide.
"""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_COMMIT = "eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f"
BLOBS = {
    "wild": "bf63f7f4f687664fb9cfc3a78c04c79be9e2dfe6",
    "spawner": "285b0cd4e7baf95ea8bab77a5c89700f4de7e5c0",
    "encounter": "435502d116a7941096c7d589a92e65d0fcde0996",
    "personal": "ddbe44da3d5ae479129a26953c6597b4a308e0b0",
}
STATS = ("HP", "ATK", "DEF", "SPA", "SPD", "SPE")
TYPES = "Normal Fighting Flying Poison Ground Rock Bug Ghost Steel Fire Water Grass Electric Psychic Ice Dragon Dark Fairy".split()
ROSTER_DIGEST = "a36169f8a22e9e0d8ec1369f4da29966e5b32b4f3dad5c5396d31b2a319f7cc5"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def source(directory, name):
    contents = (directory / (name + ".json")).read_bytes()
    prefix = f"blob {len(contents)}\0".encode()
    git_id = hashlib.sha1(prefix + contents).hexdigest()
    require(git_id == BLOBS[name], f"Unexpected {name} source blob: {git_id}")
    return json.loads(contents)["Table"]


def unique(rows, key):
    result = {}
    for row in rows:
        identity = key(row)
        require(identity not in result, f"Duplicate key: {identity!r}")
        result[identity] = row
    return result


def audit(directory):
    home = (ROOT / "home-dex-data.js").read_text(encoding="utf-8")
    roster = json.loads(home.split("window.ATLAS_HOME_SOURCE = ", 1)[1].strip().removesuffix(";"))["records"]
    require(len(roster) == 364, "Wrong Atlas roster size")
    canonical = "".join(f'{r["number"]:04}|{r["group"]}|{r["name"]}|{r["types"]}\n' for r in roster)
    require(hashlib.sha256(canonical.encode()).hexdigest() == ROSTER_DIGEST, "Unexpected Atlas roster")
    by_number = unique(roster, lambda row: row["number"])
    require(Counter(r["group"] for r in roster) == {"Lumiose": 232, "Hyperspace": 132}, "Unexpected groups")

    personal = source(directory, "personal")
    by_internal = unique(personal, lambda r: (r["Info"]["SpeciesInternal"], r["Info"]["Form"]))
    by_form = unique(personal, lambda r: (r["Info"]["SpeciesNational"], r["Info"]["Form"]))
    require(by_internal[1000, 0]["Info"]["SpeciesNational"] == 957, "Tinkatink internal ID regression")
    require(by_internal[976, 0]["Info"]["SpeciesNational"] == 999, "Gimmighoul internal ID regression")
    form_zero_stats = []
    for r in roster:
        p = by_form[r["number"], 0]
        expected = r["dexIndex"] + (232 if r["group"] == "Hyperspace" else 0)
        require(p["Dex"] == {"Index": expected, "Group": 0}, f"Dex index mismatch: {r['name']}")
        stats = [p["Base"][field] for field in STATS]
        require(p["IsPresentInGame"] and all(isinstance(v, int) and v > 0 for v in stats), f"Invalid stats: {r['name']}")
        form_zero_stats.append({"national": r["number"], "group": r["group"], "dexIndex": r["dexIndex"], "stats": stats})

    spawners = unique((r for group in source(directory, "spawner") for r in group["Table"]), lambda r: r["Id"])
    encounters = unique((r for group in source(directory, "encounter") for r in group["Table"]), lambda r: r["Id"])
    source_rows = []
    clusters, definitions, patterns = set(), set(), set()
    for typed in source(directory, "wild")[0]["Table"]:
        type_id = typed["PokeType"]
        for rank in typed["RankItems"]:
            rank_star = rank["Rank"] + 1
            require(1 <= rank_star <= 5, "Unsupported portal rank")
            for pattern in rank.get("PatternItems", []):
                if pattern["LotteryWeight"] <= 0:
                    continue
                key = (type_id, rank_star, pattern["PatternNo"])
                require(key not in patterns, f"Duplicate portal pattern {key}")
                patterns.add(key)
                require(len(pattern["SpawnerItems"]) == 3, f"Unexpected cluster count {key}")
                for slot, cluster in enumerate(pattern["SpawnerItems"], 1):
                    cid = cluster["SpawnerDataId"]
                    require(cluster["LotteryWeight"] > 0, f"Disabled cluster in live pattern {key}")
                    clusters.add(cid)
                    for i, child in enumerate(spawners[cid]["EncountDataInfoList"], 1):
                        eid = child["EncountDataId"]
                        definitions.add(eid)
                        e = encounters[eid]
                        p = by_internal[e["DevNo"], e["FormNo"]]
                        number = p["Info"]["SpeciesNational"]
                        require(number in by_number and p["IsPresentInGame"], f"Unexpected species: {eid}")
                        ranges = [e[v] + child["AdditionalLevel"] for v in ("MinLevel", "MaxLevel")]
                        require(child["Weight"] > 0 and 1 <= ranges[0] <= ranges[1] <= 100, f"Unexpected child {eid}")
                        alpha = e["OyabunProbability"]
                        row = {
                            "type": TYPES[type_id], "rank": rank_star, "pattern": pattern["PatternNo"], "slot": slot,
                            "patternWeight": pattern["LotteryWeight"], "cluster": cid,
                            "clusterWeight": cluster["LotteryWeight"], "child": i,
                            "encounter": eid, "childWeight": child["Weight"], "national": number,
                            "internal": e["DevNo"], "form": e["FormNo"], "captureLevels": ranges,
                            "rawAlphaProbability": alpha, "rawAlphaAddedLevel": e["OyabunAdditionalLevel"],
                            "rawTime": child["AppearedTimeCondition"], "rawWeather": child["AppearedWeatherCondition"],
                        }
                        if alpha > 0:
                            row["alphaCaptureLevels"] = [x + e["OyabunAdditionalLevel"] for x in ranges]
                        source_rows.append(row)

    generated = {r["national"] for r in source_rows}
    forms = {(r["national"], r["form"]) for r in source_rows}
    coverage = Counter(by_number[n]["group"] for n in generated)
    observed = (len(patterns), len(clusters), len(definitions), len(source_rows), len(generated), len(forms))
    require(observed == (500, 476, 369, 2377, 328, 368), f"Unexpected join totals: {observed}")
    require(coverage == {"Lumiose": 223, "Hyperspace": 105}, f"Unexpected roster coverage: {coverage}")
    require({(r["rawAlphaProbability"], r["rawAlphaAddedLevel"], r["rawTime"], r["rawWeather"]) for r in source_rows} == {(1, 9, 0, 0)}, "Raw Alpha/time/weather values changed")
    pilots = (
        (56, 0, "Fighting", 1, [16, 18], [25, 27]),
        (56, 0, "Fighting", 3, [22, 24], [31, 33]),
        (666, 4, "Flying", 1, [15, 17], [24, 26]),
        (666, 4, "Bug", 1, [15, 17], [24, 26]),
        (999, 0, "Ghost", 5, [62, 64], [71, 73]),
    )
    for result in pilots:
        require(any(tuple(r[k] for k in ("national", "form", "type", "rank", "captureLevels", "alphaCaptureLevels"))
                    == result for r in source_rows), f"Missing pilot: {result}")
    return {
        "schema": "atlas-hyperspace-research-v1", "sourceCommit": SOURCE_COMMIT,
        "sourceGitBlobs": BLOBS, "atlasRosterDigest": ROSTER_DIGEST, "statOrder": STATS,
        "summary": dict(zip(("patterns", "spawnerIds", "encounterIds", "candidateRows", "species", "speciesForms"), observed)),
        "coverage": dict(coverage), "verifiedDefaultStatRecords": len(form_zero_stats),
        "notInTypedGeneratedTable": [
            {k: r[k] for k in ("number", "name", "group", "dexIndex")} for r in roster if r["number"] not in generated
        ],
        "pilotKeys": pilots, "formZeroStats": form_zero_stats, "candidateRows": source_rows,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("--output", type=Path, help="Write full research-only JSON to this local file")
    args = parser.parse_args()
    result = audit(args.input_dir)
    if args.output:
        args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: result[k] for k in ("summary", "coverage", "verifiedDefaultStatRecords", "notInTypedGeneratedTable", "pilotKeys")}, ensure_ascii=False, indent=2))
