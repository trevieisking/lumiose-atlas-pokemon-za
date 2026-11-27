#!/usr/bin/env python3
"""Project the pinned AT-346 encounter audit into a research-only review register."""
import argparse
from collections import defaultdict
import json
from pathlib import Path
from audit_hyperspace_encounters import audit, ROOT

def project(directory):
    data = audit(directory)
    home = (ROOT / "home-dex-data.js").read_text(encoding="utf-8")
    roster = json.loads(home.split("window.ATLAS_HOME_SOURCE = ", 1)[1].strip().removesuffix(";"))["records"]
    regional = {r["number"] for r in roster if r["group"] == "Hyperspace"}
    grouped = defaultdict(set)
    for row in data["candidateRows"]:
        if row["national"] not in regional:
            continue
        key = (row["national"], row["form"], row["type"], row["rank"], *row["captureLevels"], *row["alphaCaptureLevels"])
        grouped[key].add(row["pattern"])
    species = []
    for record in roster:
        n = record["number"]
        if n not in regional:
            continue
        routes = []
        for (national, form, typ, rank, low, high, alo, ahi), patterns in grouped.items():
            if national == n:
                routes.append(dict(form=form, type=typ, rank=rank, catch=[low, high], alpha=[alo, ahi], patterns=sorted(patterns)))
        if routes:
            routes.sort(key=lambda r: (r["rank"], r["type"], r["form"], r["catch"][0]))
            species.append(dict(national=n, dexIndex=record["dexIndex"], name=record["name"], routes=routes))
    if len(species) != 105 or sum(len(s["routes"]) for s in species) != 202:
        raise ValueError("Unexpected research register counts")
    return dict(schema="atlas-hyperspace-typed-route-review-v1",
                status="research_only_individual_route_cross_checks_pending",
                sourceCommit=data["sourceCommit"], sourceGitBlobs=data["sourceGitBlobs"],
                fullJoinCounts=data["summary"], hyperspaceSpecies=len(species),
                uniqueRoutes=sum(len(s["routes"]) for s in species),
                limits="Generated typed pools only. No portal guarantees, field odds, exact coordinates, time/weather interpretation or full acquisition claims. Form numbers are source IDs, not localized labels. Capture levels, not combat levels.",
                species=species)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.write_text(json.dumps(project(args.input_dir), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
