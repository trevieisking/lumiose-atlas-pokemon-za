#!/usr/bin/env python3
"""Prepare the AT342 post-release documentation checkpoint; never publish anything.

This script was deliberately reconciled after the exact PR204 integration at
f030c4a was materialized and reviewed. The earlier377fb91 candidate and its
evidence retain historical scope. It does not contain, infer, or manufacture
successful release evidence for the new candidate.

Usage (after the root reviewer has collected actual proof):
  python prepare_at342_release_docs.py --schema
  python prepare_at342_release_docs.py --repo /absolute/path/to/atlas \
      --facts /absolute/path/to/atlas/docs/qa/ATLAS_AT342_RELEASE_RECEIPT.json
  # The preceding invocation is a read-only dry run. Review its diff, then:
  python prepare_at342_release_docs.py --repo /absolute/path/to/atlas \
      --facts /absolute/path/to/atlas/docs/qa/ATLAS_AT342_RELEASE_RECEIPT.json --apply

The input is the root's actual, already saved release-facts receipt, inside the
repository. Its hash is recorded in the updated current metadata. Every input
receipt and the already prepared single Workspace prompt must exist and match
its supplied SHA-256. No network, Git writes, database writes, commits, staging,
merges, deployments, Workspace edits, prompt generation, or messages occur here.

Only thirteen named documentation files may change: the ten canonical files,
the 67-ID coverage register, the current AT342 resume checkpoint, and its current
requirement dispositions. Original source requirements, acceptance text, coverage
mapping/actions/rules, historical receipts, runtime, and image inventories remain
untouched. Changed current metadata is saved as historical Manifest90/Ledger98.

Remaining judgment belongs to the root reviewer: the script checks consistency,
hashes, and explicit recorded attestations; it cannot inspect screenshots or
independently decide whether CI/live behavior satisfies the original acceptance.
The original Workspace A1-A7 duties and broader guide/Alpha audits stay open.
"""

from __future__ import annotations

import argparse
import copy
import datetime as dt
import difflib
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile


REPOSITORY = "trevieisking/lumiose-atlas-pokemon-za"
PR = 204
PREPARED_HEAD = "f030c4ae3e33259105bf351885c386f6b53900d9"
PREPARED_TREE = "0288e63d1d52fe5f95dc76e0c01631715310e54a"
EXPECTED_RUNTIME_FILE_COUNT = 24
EXPECTED_LOCAL_NODE_COUNT = 155
REQUIREMENTS = "docs/consolidation/2026-11-26/requirements.json"
REQUIREMENTS_SHA256 = "329d12c1f525bd949e7200af1455763efb1a3c2dc6d7ed5fd1b24436eb9d1a3a"
MANIFEST = "MAPS_UPGRADE_MANIFEST.json"
GATE = "docs/qa/ATLAS_AT325_RELEASE_GATE.json"
CHECKPOINT_341 = "docs/qa/ATLAS_AT341_COMPLETION_CHECKPOINT.json"
COVERAGE = "docs/qa/ATLAS_FINAL_PLAN_COVERAGE.json"
RESUME = "docs/qa/ATLAS_AT342_RESUME_CHECKPOINT.json"
DISPOSITIONS = "docs/qa/ATLAS_AT342_REQUIREMENT_DISPOSITIONS.json"
DRATINI = "docs/qa/ATLAS_AT342_CITY_ALPHA_DRATINI_REVIEW.json"
RUNTIME_HASHES = "docs/qa/at342-resume/runtime-file-hashes.json"
PRESERVED_IMAGES = "docs/qa/at342-resume/preserved-runtime-image-blobs.json"
NAVIGATION_CORRECTION = "docs/qa/ATLAS_AT342_BROWSER_NAVIGATION_CORRECTION.json"
SCROLL_CORRECTION = "docs/qa/ATLAS_AT342_OVERLAP_SCROLL_CORRECTION.json"
FINAL_INTEGRATION = "docs/qa/ATLAS_AT342_FINAL_INTEGRATION.json"
VISIBLE_FRAME_REVIEW = "docs/qa/ATLAS_AT342_VISIBLE_FRAME_REVIEW.json"
OVERLAP_VISIBILITY_REVIEW = "docs/qa/ATLAS_AT342_OVERLAP_VISIBILITY_REVIEW.json"
COMBINED_NODE_LOG = "docs/qa/at342-resume/combined-final-unit-tests.txt"
OLD_TRACKER = "docs/qa/ATLAS_AT342_TRACKER_RECEIPT.json"
WORKSPACE_PROJECT = "appgprj_6afda588d5948191b4143e40a1f9c291"
WORKSPACE_URL = "https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site"
HISTORY = "historical_current_checkpoint_90_98"
MARKER_OLD = "<!-- AT342_CURRENT_90_98 -->"
MARKER_OLD_END = "<!-- END_AT342_CURRENT_90_98 -->"
MARKER_NEW = "<!-- AT342_CURRENT_91_99 -->"
MARKER_NEW_END = "<!-- END_AT342_CURRENT_91_99 -->"

# These are the exact current documentation bytes at preparation. Refuse drift
# instead of silently overwriting a concurrent edit. If the candidate changes,
# re-review it and update this script deliberately; do not bypass this guard.
EXPECTED_DOCUMENT_HASHES = {
    "FINAL_WORKSPACE_PLAN.md": "cd22136a0ca918e644583979567d8285370f22dff54164fed542b179ed6f3d51",
    "MAPS_SECTOR_UPGRADE_MASTER_PLAN.md": "5cc6ec35f34b8ffdc43f6f65271ca187ca1b8608ac84956e0ea359296a35316c",
    MANIFEST: "137f7650bc140878d2538b0a0041157f527c92d10d2744ec39cf9965a2d16d43",
    "ATLAS_DUAL_SITE_FIX_LEDGER.md": "c8adb94650fca4190795bfdab73f14352adf1a384d13ac3620339b695e44ce33",
    "ATLAS_RELEASE_HANDOFF.md": "fa84ba2d86a23006a95b036ae56170965003f068c5483a91d834a32cb04c76aa",
    "WORKSPACE_ACCESS_HANDOFF.md": "6a33263b1726a8b20194e324fd6bb34fac1d3ca0d51f57bf9750271571527b07",
    GATE: "5624b24bfa9b71b8fe0fa371eae7cb9d86f72fafab6363d2649bbde51706bad3",
    "docs/qa/ATLAS_AT325_GITHUB_FIRST_WORKSPACE_RELEASE_GATE.md": "16b72f978807adb3e6cc35815c8cc77b768aa85d27fa00a9cdb2f886702e86b4",
    CHECKPOINT_341: "66193865d03ca48ddf3b8b3b311e1e3fad737a15a6c3d0195e0489dca9c8ba6d",
    "docs/consolidation/2026-11-26/WORKSPACE_PROMPT_READINESS.md": "f74e251e17eb8f11c3e18bf182f986098ca4df91418ddf58d9c8cb1c26ec1e67",
    COVERAGE: "2e40bfa1e18d5d21df0435d9fd1336f8ee3b5f8b347b97d862963350e2efef0f",
    RESUME: "2d1d3f5fae2c809b9f100afaeaa3690f23a176ba8a260a4eb28acf28b9bbcc69",
    DISPOSITIONS: "efe7e42ac4b87723ce5f18a99a6677f4a15f8e343c616faa1275438c70d3974d",
}

# Incoming integration receipts are historical evidence, not editable release
# approvals. The post-release script must preserve their current bytes too.
EXPECTED_INTEGRATION_EVIDENCE_HASHES = {
    FINAL_INTEGRATION: "383804029d1ed6960a69bd2a1ba7dde4574bad09bb529eef731c6f5e285fe159",
    VISIBLE_FRAME_REVIEW: "7684250165dd499f543feb705aeb8b63b4bc3fa309f1e9f36bfbec6804c54a2c",
    OVERLAP_VISIBILITY_REVIEW: "cb4a6405455130833068a49751379a5b92467f843baa6eca639593c912cd3e5d",
    COMBINED_NODE_LOG: "d2f9b67aaa71651a17e5c5c47aec6b3ff294f1fab2eb9f3ce4bb1b295b9bf4f2",
}

# --schema prints this contract. "ref" is always a repository-relative path and
# the SHA-256 of an actual existing evidence file; placeholder values fail.
INPUT_SCHEMA = {
    "schema_version": 1,
    "repository": REPOSITORY,
    "pr": PR,
    "recorded_at": "Actual ISO-8601 timestamp with UTC offset, after the proofs",
    "tested": {
        "head_sha": PREPARED_HEAD,
        "tree_sha": PREPARED_TREE,
        "base_sha": "Actual 40-character reviewed base SHA",
        "required_workflow_names": ["Exact required workflow names actually checked"],
        "ci_runs": [{
            "id": "integer run ID", "name": "exact workflow name",
            "head_sha": "must equal tested.head_sha", "conclusion": "success",
            "url": "actual GitHub Actions run URL",
        }],
        "changed_files": ["Reviewed PR changed-file allowlist, relative paths"],
    },
    "merge": {
        "sha": "Actual merged commit SHA", "tree_sha": "Actual merged tree SHA",
        "expected_head_sha": "must equal tested.head_sha",
        "base_sha": "must equal tested.base_sha",
        "merged_at": "Actual ISO-8601 timestamp with UTC offset",
        "receipt": {"path": "actual merge receipt", "sha256": "actual hash"},
    },
    "pages": {
        "run_id": "integer run ID", "head_sha": "must equal merge.sha",
        "conclusion": "success", "url": "actual Actions Pages run URL",
        "site_url": "actual GitHub Pages URL",
        "completed_at": "Actual ISO-8601 timestamp with UTC offset",
        "receipt": {"path": "actual Pages receipt", "sha256": "actual hash"},
    },
    "visual": {
        "tested_head_sha": "must equal tested.head_sha",
        "mobile_reviewed": True, "desktop_reviewed": True,
        "blocking_findings": [], "artifact_ids": ["actual artifact IDs"],
        "reviewed_at": "Actual ISO-8601 timestamp with UTC offset",
        "receipt": {"path": "actual screenshot review", "sha256": "actual hash"},
    },
    "live": {
        "deployment_sha": "must equal merge.sha", "verified": True,
        "site_url": "must equal pages.site_url",
        "checked_at": "Actual ISO-8601 timestamp with UTC offset",
        "scope": "Precisely what the independent read-only live checks establish",
        "receipt": {"path": "actual live-check receipt", "sha256": "actual hash"},
    },
    "tracker_receipt": {
        "path": "new guarded Manifest91 receipt; never the old Manifest90 receipt",
        "sha256": "actual hash",
    },
    "release_review": {
        "original_gates_satisfied": ["G0", "G1", "G2", "G3", "G4", "G5"],
        "scope": "finite_Interactive_Map_2_0",
        "unresolved_mandatory_map_findings": [],
        "existing_assets_progress_integrations_preserved": True,
        "whole_historical_master_plan_complete": False,
        "independent_workspace_upgrade_complete": False,
        "reviewed_by": "actual root reviewer identity/role",
        "summary": "Evidence-based assessment of the unchanged original acceptance",
    },
    "workspace_prompt": {
        "path": "actual single final prompt already saved after G5 proof",
        "sha256": "actual hash", "approved_release_sha": "must equal merge.sha",
        "reviewed_against_A0": True,
    },
    "rollback": {
        "base_sha": "must equal tested.base_sha",
        "instructions": "Actual reviewed rollback instructions for this merge",
    },
    "tracker_receipt_required_content": {
        "note": "This entry describes the referenced receipt; omit it from facts",
        "status": "verified_guarded_metadata_update_and_fresh_readback",
        "manifest_revision": 91, "row_count": 48,
        "executed_at": "actual timestamp", "readback_at": "actual timestamp",
        "status_counts": {"verified": "actual count", "in_progress": "actual count", "open": "actual count"},
        "operation": "actual guarded operation; no blanket status promotion inferred",
        "all_previous_notes_preserved": True,
        "all_workspace_fields_unchanged": True,
        "schema_or_public_player_feedback_data_changed": False,
        "proof_preservation": "Either all_github_proof_fields_unchanged:true or prior_github_proofs_preserved:true",
    },
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def utc(value, field):
    require(isinstance(value, str), f"{field}: timestamp required")
    result = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    require(result.tzinfo is not None, f"{field}: timezone required")
    return result.astimezone(dt.timezone.utc)


def full_sha(value, field, size=40):
    require(isinstance(value, str) and re.fullmatch(rf"[0-9a-f]{{{size}}}", value),
            f"{field}: an actual lower-case {size}-character hash is required")
    require(set(value) != {"0"}, f"{field}: placeholder hash")
    return value


def repo_file(repo, relative):
    require(isinstance(relative, str) and relative and not Path(relative).is_absolute(),
            f"Repository-relative path required: {relative!r}")
    require(".." not in Path(relative).parts, f"Parent traversal forbidden: {relative}")
    path = repo / relative
    require(path.resolve().is_relative_to(repo), f"Path escapes repository: {relative}")
    require(path.is_file() and not path.is_symlink(), f"Existing regular file required: {relative}")
    return path


def ref(repo, value, field):
    require(isinstance(value, dict), f"{field}: path/hash reference required")
    path = repo_file(repo, value["path"])
    full_sha(value["sha256"], field + ".sha256", 64)
    require(sha256(path.read_bytes()) == value["sha256"], f"Receipt hash mismatch: {field}")
    return path


def github_run_url(url, run_id):
    return url == f"https://github.com/{REPOSITORY}/actions/runs/{run_id}"


def validate_facts(repo, facts_path, f):
    require(f.get("schema_version") == 1 and f.get("repository") == REPOSITORY
            and f.get("pr") == PR, "Wrong input version, repository, or PR")
    recorded = utc(f["recorded_at"], "recorded_at")
    tested = f["tested"]
    require(tested["head_sha"] == PREPARED_HEAD and tested["tree_sha"] == PREPARED_TREE,
            "Candidate changed since script preparation; re-review and regenerate, do not bypass")
    full_sha(tested["base_sha"], "tested.base_sha")
    names = tested["required_workflow_names"]
    require(names and len(names) == len(set(names)), "List exact required workflow names once")
    runs = tested["ci_runs"]
    require(runs and set(names).issubset({run["name"] for run in runs}),
            "Missing one or more required current-head workflow results")
    for run in runs:
        require(type(run["id"]) is int and run["id"] > 0, "Actual CI run ID required")
        require(run["head_sha"] == tested["head_sha"] and run["conclusion"] == "success",
                "Every claimed current-head CI success must belong to the tested head")
        require(github_run_url(run["url"], run["id"]), "CI run URL/ID/repository mismatch")
    changed = tested["changed_files"]
    require(changed and len(changed) == len(set(changed)), "Reviewed changed-file allowlist required")
    for name in changed:
        require(isinstance(name, str) and not Path(name).is_absolute()
                and ".." not in Path(name).parts, "Invalid changed-file path")
    merge = f["merge"]
    full_sha(merge["sha"], "merge.sha")
    full_sha(merge["tree_sha"], "merge.tree_sha")
    require(merge["expected_head_sha"] == tested["head_sha"]
            and merge["base_sha"] == tested["base_sha"], "Expected-head/base merge mismatch")
    require(merge["tree_sha"] == tested["tree_sha"],
            "Merged tree differs from tested tree; review/retest instead of inferring equivalence")
    merged_at = utc(merge["merged_at"], "merge.merged_at")
    ref(repo, merge["receipt"], "merge.receipt")
    pages = f["pages"]
    require(type(pages["run_id"]) is int and pages["run_id"] > 0, "Actual Pages run ID required")
    require(pages["head_sha"] == merge["sha"] and pages["conclusion"] == "success",
            "Pages must be a successful deployment of the actual merge")
    require(github_run_url(pages["url"], pages["run_id"]), "Pages URL/ID/repository mismatch")
    require(pages["site_url"].startswith("https://") and "github.io" in pages["site_url"],
            "Actual GitHub Pages origin required; original Workspace is a separate release")
    deployed_at = utc(pages["completed_at"], "pages.completed_at")
    require(merged_at <= deployed_at <= recorded, "Merge/Pages/receipt timestamp order is inconsistent")
    ref(repo, pages["receipt"], "pages.receipt")
    visual = f["visual"]
    require(visual["tested_head_sha"] == tested["head_sha"]
            and visual["mobile_reviewed"] is True and visual["desktop_reviewed"] is True
            and visual["blocking_findings"] == [] and visual["artifact_ids"],
            "Actual mobile/desktop review of the tested artifact with no outstanding material finding required")
    require(utc(visual["reviewed_at"], "visual.reviewed_at") <= merged_at,
            "The recorded screenshot review must precede the claimed reviewed-head merge")
    ref(repo, visual["receipt"], "visual.receipt")
    live = f["live"]
    require(live["verified"] is True and live["deployment_sha"] == merge["sha"]
            and live["site_url"] == pages["site_url"] and live["scope"].strip(),
            "Independent live receipt must identify the deployed merge and actual check scope")
    require(deployed_at <= utc(live["checked_at"], "live.checked_at") <= recorded,
            "Live-check time must follow the Pages deployment")
    ref(repo, live["receipt"], "live.receipt")
    review = f["release_review"]
    require(set(review["original_gates_satisfied"]) == {"G0", "G1", "G2", "G3", "G4", "G5"}
            and review["scope"] == "finite_Interactive_Map_2_0"
            and review["unresolved_mandatory_map_findings"] == []
            and review["existing_assets_progress_integrations_preserved"] is True
            and review["whole_historical_master_plan_complete"] is False
            and review["independent_workspace_upgrade_complete"] is False
            and review["reviewed_by"].strip() and review["summary"].strip(),
            "Root's explicit, finite, original-acceptance release assessment is required")
    tracker_path = ref(repo, f["tracker_receipt"], "tracker_receipt")
    require(f["tracker_receipt"]["path"] != OLD_TRACKER, "Preserve the Manifest90 receipt as history")
    tracker = json.loads(tracker_path.read_text())
    require(tracker["status"] == "verified_guarded_metadata_update_and_fresh_readback"
            and tracker["manifest_revision"] == 91 and tracker["row_count"] == 48,
            "Actual guarded 48-row Manifest91 tracker readback required")
    counts = tracker["status_counts"]
    require(set(counts) == {"verified", "in_progress", "open"}
            and all(type(v) is int and v >= 0 for v in counts.values())
            and sum(counts.values()) == 48, "Tracker status counts must match actual 48-row readback")
    require(tracker["all_previous_notes_preserved"] is True
            and tracker["all_workspace_fields_unchanged"] is True
            and tracker["schema_or_public_player_feedback_data_changed"] is False
            and (tracker.get("all_github_proof_fields_unchanged") is True
                 or tracker.get("prior_github_proofs_preserved") is True),
            "Tracker receipt must preserve prior notes/proofs, Workspace fields and public/player data")
    require(utc(tracker["executed_at"], "tracker.executed_at")
            <= utc(tracker["readback_at"], "tracker.readback_at") <= recorded,
            "Tracker transaction/readback/receipt timestamps are inconsistent")
    prompt = f["workspace_prompt"]
    prompt_path = ref(repo, prompt, "workspace_prompt")
    require(prompt["approved_release_sha"] == merge["sha"] and prompt["reviewed_against_A0"] is True,
            "The existing single prompt must be reviewed against A0 and pin the actual release")
    prompt_text = prompt_path.read_text()
    require(merge["sha"] in prompt_text and WORKSPACE_PROJECT in prompt_text,
            "Final prompt must actually contain the approved immutable SHA and original project ID")
    require(f["rollback"]["base_sha"] == tested["base_sha"]
            and f["rollback"]["instructions"].strip(), "Actual release rollback instructions required")
    local_tree = subprocess.check_output(
        ["git", "-C", str(repo), "rev-parse", "HEAD^{tree}"], text=True).strip()
    require(local_tree == merge["tree_sha"],
            "Local checkout tree must equal the tested/merged tree before documentation reconciliation")
    require(facts_path.resolve().is_relative_to(repo), "Facts receipt must already exist inside the repository")
    require(facts_path.relative_to(repo).as_posix() not in EXPECTED_DOCUMENT_HASHES,
            "Release facts must be a separate immutable receipt, not an output document")
    return tracker


def json_spans(text):
    """Locate JSON values without normalizing untouched text or arrays."""
    decoder = json.JSONDecoder()
    spans = {}

    def skip(pos):
        while pos < len(text) and text[pos].isspace():
            pos += 1
        return pos

    def walk(pos, path):
        pos = skip(pos)
        start = pos
        if text[pos] == "{":
            pos = skip(pos + 1)
            while text[pos] != "}":
                key, pos = decoder.raw_decode(text, pos)
                pos = skip(pos)
                require(text[pos] == ":", "Malformed JSON object")
                pos = skip(walk(pos + 1, path + (key,)))
                if text[pos] != ",":
                    break
                pos = skip(pos + 1)
            require(text[pos] == "}", "Malformed JSON closing object")
            pos += 1
        elif text[pos] == "[":
            pos = skip(pos + 1)
            index = 0
            while text[pos] != "]":
                pos = skip(walk(pos, path + (index,)))
                index += 1
                if text[pos] != ",":
                    break
                pos = skip(pos + 1)
            require(text[pos] == "]", "Malformed JSON closing array")
            pos += 1
        else:
            _, pos = decoder.raw_decode(text, pos)
        spans[path] = (start, pos)
        return pos

    walk(0, ())
    return spans


def patch_json(original, before, after):
    """Replace changed values only; preserve the literal untouched JSON bytes."""
    spans = json_spans(original)
    patches = []

    def encoded(value, start):
        line = original[original.rfind("\n", 0, start) + 1:start]
        indent = len(line) - len(line.lstrip())
        rendered = json.dumps(value, ensure_ascii=False, indent=2)
        return rendered.replace("\n", "\n" + " " * indent)

    def walk(old, new, path):
        if old == new:
            return
        if isinstance(old, dict) and isinstance(new, dict) and old.keys() == new.keys():
            for key in old:
                walk(old[key], new[key], path + (key,))
        elif isinstance(old, list) and isinstance(new, list) and len(old) == len(new):
            for index, (left, right) in enumerate(zip(old, new)):
                walk(left, right, path + (index,))
        else:
            start, end = spans[path]
            patches.append((start, end, encoded(new, start)))

    require(set(before).issubset(after), "No original top-level field may be deleted")
    for key in before:
        walk(before[key], after[key], (key,))
    additions = [(key, value) for key, value in after.items() if key not in before]
    if additions:
        end = max(spans[(key,)][1] for key in before)
        rendered = []
        for key, value in additions:
            value_text = json.dumps(value, ensure_ascii=False, indent=2).replace("\n", "\n  ")
            rendered.append("  " + json.dumps(key) + ": " + value_text)
        patches.append((end, end, ",\n" + ",\n".join(rendered)))
    result = original
    for start, end, value in sorted(patches, reverse=True):
        result = result[:start] + value + result[end:]
    require(json.loads(result) == after, "JSON patch failed its semantic check")
    return result


def preserve_current(document, keys, captured_at):
    require(HISTORY not in document, "Manifest90/Ledger98 history already exists; review before rerunning")
    document[HISTORY] = {
        "snapshot_scope": "Actual pre-release Manifest90/Ledger98 current metadata; historical after this reconciliation",
        "superseded_at": captured_at,
        "manifest_revision": 90,
        "ledger_revision": 98,
        "fields": {key: copy.deepcopy(document[key]) for key in keys if key in document},
    }


def revised_source(source, f, release_path):
    result = copy.deepcopy(source)
    result.update({
        "manifest_revision": 91, "ledger_revision": 99,
        "current_validation": "Exact tested-head CI and reviewed mobile/desktop artifacts passed; expected-head merge, exact Pages deployment and independent live checks are recorded.",
        "approved_full_scope_sha": f["merge"]["sha"],
        "approved_full_scope_tree": f["merge"]["tree_sha"],
        "full_scope_release_complete": True,
        "completion_scope": "finite_Interactive_Map_2_0_original_G0_G5_acceptance",
        "whole_historical_master_plan_complete": False,
        "final_workspace_prompt": f["workspace_prompt"]["path"],
        "release_receipt": release_path,
    })
    return result


def revised_broader(scope):
    result = copy.deepcopy(scope)
    result["whole_historical_master_plan_complete"] = False
    for obligation in result["uncompleted_required_obligations"]:
        if obligation["id"] == "CHAT-CITY-ALPHAS":
            # Preserve the incoming bounded status and its Markdown receipt;
            # add the structured sidecar without reverting either correction.
            obligation["status"] = "targeted_dratini_review_complete_with_labelled_limits_broader_city_alpha_route_inventory_open"
            obligation["targeted_review_receipt"] = "docs/qa/ATLAS_AT342_CITY_ALPHA_DRATINI_REVIEW.md"
            obligation["targeted_review"] = DRATINI
            obligation["broader_requirement_complete"] = False
    result["scope_rule"] = (
        "The verified Interactive Map 2.0 release certifies its recorded finite source and runtime scope. "
        "It does not certify all 67 historical requirements, complete game inventories, every guide page, "
        "or the independent original Workspace upgrade. The broader guide, walkthrough-depth and city-Alpha "
        "audits remain required and open; they are not relabelled optional appearance work."
    )
    return result


def revised_candidate(candidate, f, source, tracker, broader, release_ref):
    result = copy.deepcopy(candidate)
    result.update({
        "stage": "finite_map_release_merged_deployed_live_verified_original_workspace_pending",
        "observed_main_sha": f["merge"]["sha"],
        "last_observed_remote_head": f["tested"]["head_sha"],
        "tested_tree": f["tested"]["tree_sha"],
        "source_review": copy.deepcopy(source), "private_tracker": copy.deepcopy(tracker),
        "full_release_verified": True, "final_workspace_prompt_ready": True,
        "release_scope": "finite_Interactive_Map_2_0",
        "approved_release_sha": f["merge"]["sha"],
        "approved_release_tree": f["merge"]["tree_sha"],
        "release_receipt": release_ref, "broader_requirement_scope": copy.deepcopy(broader),
        "workspace_changed_by_this_continuation": False,
        "previous_exact_head_CI_scope": "Earlier candidate successes/failures retain their original historical scope; current proof is attached to the exact tested remote head recorded here.",
    })
    return result


def build_changes(repo, facts_path, f, tracker_raw, original):
    docs = {path: json.loads(text) for path, text in original.items() if path.endswith(".json")}
    old_docs = copy.deepcopy(docs)
    release_path = facts_path.relative_to(repo).as_posix()
    release_ref = {"path": release_path, "sha256": sha256(facts_path.read_bytes())}
    phases = {
        "G0": "canonical_Manifest91_Ledger99_and_guarded_48_row_private_sync_verified",
        "G1": "released_baseline_combined_changes_and_preservation_verified",
        "G2": "scoped_source_review_complete_48_sector_footprints_20_zone_selection_outlines",
        "G3": "finite_encounter_review_complete_68_area_dispositions_qualifications_retained",
        "G4": "exact_tested_head_mobile_desktop_map_runtime_validated",
        "G5": "expected_head_merge_exact_Pages_deployment_and_independent_live_checks_verified",
        "A0": "single_final_prompt_ready_pinned_to_actual_approved_map_release",
        "A1-A7": "independent_original_Workspace_source_access_backup_adaptation_preview_publication_and_live_verification_pending",
    }
    tracker = copy.deepcopy(tracker_raw)
    tracker.update({"receipt": f["tracker_receipt"]["path"],
                    "receipt_sha256": f["tracker_receipt"]["sha256"],
                    "verified_at": tracker_raw["readback_at"],
                    "github_status_counts": copy.deepcopy(tracker_raw["status_counts"]),
                    "release_state": "Private metadata and per-row proof only; no blanket completion or original Workspace publication is inferred."})
    broader = revised_broader(docs[COVERAGE]["broader_requirement_scope"])
    source = revised_source(docs[CHECKPOINT_341]["source_completion_checkpoint"], f, release_path)
    candidate = revised_candidate(docs[MANIFEST]["at_342_resume_checkpoint"], f, source, tracker, broader, release_ref)
    combined_local = copy.deepcopy(docs[RESUME]["validation"]["combined_final_node"])
    combined_local["integration_receipt"] = FINAL_INTEGRATION
    combined_local["scope"] = "Current combined integration local validation; final current-head CI and deployment evidence remain separate."
    candidate["combined_local_validation"] = copy.deepcopy(combined_local)
    candidate["visible_framing_integration"] = FINAL_INTEGRATION
    prompt = {
        "state": "ready_after_actual_finite_Map2_G0_G5_release_proof",
        "required_approved_github_release_sha": f["merge"]["sha"],
        "required_exact_deployment_evidence": copy.deepcopy(f["pages"]),
        "required_full_scope_signoff": release_ref,
        "full_scope_signoff_scope": "finite_Interactive_Map_2_0_original_G0_G5_acceptance",
        "whole_historical_master_plan_complete": False,
        "final_prompt_path": f["workspace_prompt"]["path"],
        "final_prompt_sha256": f["workspace_prompt"]["sha256"],
        "allowed_to_send_or_execute": True,
        "execution_scope": "This reviewed prompt is unblocked. Original-site changes still follow A1-A7 actual access/source, backup, compatibility, preview, publication and live-verification duties.",
        "release_policy": "One prompt pinned to the approved immutable release; preserve the original project and URL, without automatic GitHub-to-Workspace publication.",
        "readiness_contract": "docs/consolidation/2026-11-26/WORKSPACE_PROMPT_READINESS.md",
    }
    latest = {
        "observed_main": f["merge"]["sha"], "main_pr": PR,
        "last_observed_remote_candidate": f["tested"]["head_sha"],
        "tested_tree": f["tested"]["tree_sha"], "approved_release_tree": f["merge"]["tree_sha"],
        "scope": "Actual expected-head PR204 merge and deployed finite Interactive Map 2.0 release; original Workspace remains separate.",
        "current_checkpoint": RESUME, "exact_current_head_validation": release_ref,
    }

    manifest = docs[MANIFEST]
    preserve_current(manifest, ["revision", "status", "current_phase", "non_destructive_release_policy",
        "at_325_github_first_workspace_gate", "at_341_completion_checkpoint", "at_342_resume_checkpoint",
        "latest_main_reconciliation", "current_requirement_dispositions"], f["recorded_at"])
    manifest.update({"revision": 91,
        "status": "finite_Map2_release_verified_original_Workspace_and_broader_audits_pending",
        "current_phase": "AT-342 finite Interactive Map 2.0 G0-G5 release verified. Manifest91/Ledger99 and guarded private tracker readback agree. A0 single prompt is pinned to the actual release; A1-A7 and broader required guide/city-Alpha audits remain open.",
        "current_phase_assessment": phases, "current_release": release_ref,
        "latest_main_reconciliation": copy.deepcopy(latest),
        "at_342_resume_checkpoint": copy.deepcopy(candidate),
        "current_requirement_dispositions": DISPOSITIONS,
        "broader_requirement_scope": copy.deepcopy(broader),
    })
    policy = manifest["non_destructive_release_policy"]
    policy.update({"documentation_only_this_revision": True, "site_code_changed": False,
        "released_runtime_changed": True, "released_runtime_file_count": EXPECTED_RUNTIME_FILE_COUNT,
        "supabase_changed": True, "supabase_private_feature_metadata_update_planned": False,
        "supabase_private_feature_metadata_update_verified": True,
        "supabase_private_feature_metadata_receipt": f["tracker_receipt"]["path"],
        "supabase_private_feature_metadata_verified_at": tracker_raw["readback_at"],
        "supabase_scope": tracker_raw["operation"] + " Previous notes/proofs and all Workspace fields preserved; no schema, public, player or feedback changes.",
        "checkpoint_scope": f"This revision reconciles documentation and the actual guarded private tracker receipt. The separately tested and deployed PR204 release changed {EXPECTED_RUNTIME_FILE_COUNT} runtime files; no runtime changes are made by this documentation update."})
    m_gate = manifest["at_325_github_first_workspace_gate"]
    m_gate.update({"status": "finite_Map2_G0_G5_verified_A0_prompt_ready_A1_A7_pending",
        "phase_states": [{"id": key, "state": value} for key, value in phases.items()],
        "workspace_prompt": copy.deepcopy(prompt), "current_source_review": copy.deepcopy(source),
        "current_private_tracker": copy.deepcopy(tracker), "release_receipt": release_ref,
        "private_checklist_intent": "Actual guarded Manifest91 release metadata and fresh readback; preserve prior proof and Workspace state. Only specifically evidenced GitHub row changes are represented by the receipt."})
    manifest["at_341_completion_checkpoint"].update({"status": "superseded_by_verified_finite_AT342_release",
        "manifest_revision": 91, "ledger_revision": 99, "source_review": copy.deepcopy(source),
        "full_implementation_complete": True, "completion_scope": "finite_Interactive_Map_2_0",
        "whole_historical_master_plan_complete": False,
        "supabase_private_planning_sync": copy.deepcopy(tracker), "release_receipt": release_ref})

    gate = docs[GATE]
    preserve_current(gate, ["manifest_revision", "ledger_revision", "current_state", "phases", "workspace_prompt",
        "preservation", "current_consolidation", "current_completion_plan", "current_phase_assessment",
        "at342", "latest_main_reconciliation"], f["recorded_at"])
    gate.update({"manifest_revision": 91, "ledger_revision": 99,
        "current_state": "finite_Map2_release_verified_single_Workspace_prompt_ready_independent_Workspace_pending",
        "workspace_prompt": copy.deepcopy(prompt), "current_phase_assessment": copy.deepcopy(phases),
        "at342": copy.deepcopy(candidate), "latest_main_reconciliation": copy.deepcopy(latest),
        "current_release": release_ref, "whole_historical_master_plan_complete": False})
    for phase in gate["phases"]:
        phase["state"] = phases[phase["id"]]
    gate["preservation"].update({"runtime_changed": True,
        "checkpoint_scope": "Preservation applies to the released PR204 runtime; this Manifest91/Ledger99 reconciliation changes documentation only.",
        "released_runtime_file_count": EXPECTED_RUNTIME_FILE_COUNT, "current_release_receipt": release_ref})
    gate["current_consolidation"].update({"current_phase_states": copy.deepcopy(phases), "release_receipt": release_ref})
    completion = gate["current_completion_plan"]
    completion.update({"manifest_revision": 91, "ledger_revision": 99, **phases,
        "full_implementation_complete": True, "completion_scope": "finite_Interactive_Map_2_0",
        "whole_historical_master_plan_complete": False, "source_completion_checkpoint": copy.deepcopy(source),
        "approved_full_scope_sha": f["merge"]["sha"], "approved_full_scope_tree": f["merge"]["tree_sha"],
        "final_prompt_path": f["workspace_prompt"]["path"], "full_scope_release_complete": True,
        "private_feature_metadata_sync": tracker_raw["status"],
        "private_feature_metadata_receipt": f["tracker_receipt"]["path"],
        "private_feature_metadata_verified_at": tracker_raw["readback_at"],
        "broader_requirement_scope": copy.deepcopy(broader), "release_receipt": release_ref})

    c341 = docs[CHECKPOINT_341]
    preserve_current(c341, ["manifest_revision", "ledger_revision", "stage", "status", "full_upgrade_complete",
        "full_release_sha", "workspace_prompt_ready", "required_remaining", "source_completion_checkpoint",
        "final_candidate", "private_tracker_observation", "completed_current_private_sync",
        "latest_main_reconciliation", "broader_requirement_scope", "release_policy", "prior_sync_receipt_scope"], f["recorded_at"])
    c341.update({"manifest_revision": 91, "ledger_revision": 99,
        "stage": candidate["stage"], "status": "superseded_by_verified_finite_AT342_map_release",
        "full_upgrade_complete": False, "full_map_release_complete": True,
        "full_release_sha": f["merge"]["sha"], "full_release_scope": "finite_Interactive_Map_2_0",
        "workspace_prompt_ready": True, "workspace_publication": False,
        "source_completion_checkpoint": copy.deepcopy(source), "final_candidate": copy.deepcopy(candidate),
        "private_tracker_observation": copy.deepcopy(tracker), "completed_current_private_sync": copy.deepcopy(tracker),
        "supabase_manifest_91_sync": copy.deepcopy(tracker), "latest_main_reconciliation": copy.deepcopy(latest),
        "broader_requirement_scope": copy.deepcopy(broader), "current_release": release_ref,
        "release_policy": "The original finite Interactive Map2.0 G0-G5 acceptance is supported by exact-head tests, reviewed artifacts, expected-head merge, exact Pages deployment and independent live proof. A0 single prompt is ready; original Workspace A1-A7 and broader required guide/Alpha audits remain open. Optional unverified inventories do not add a universal census gate.",
        "prior_sync_receipt_scope": "supabase_preflight and supabase_manifest_87_sync, supabase_manifest_89_sync and supabase_manifest_90_sync retain historical observations. The current Manifest91 proof is supabase_manifest_91_sync and its independent tracker receipt."})
    c341["required_remaining"].update({
        "runtime_validation": "Verified for the exact tested remote head; see current release receipt.",
        "release": "Expected-head merge, exact Pages deployment and independent live checks verified; see current release receipt.",
        "workspace_prompt": "One final prompt prepared and reviewed against A0; original-source A1-A7 upgrade remains pending.",
        "broader_required_obligations": copy.deepcopy(broader["uncompleted_required_obligations"]),
        "independent_original_Workspace_upgrade": "pending_A1_A7"})

    cov = docs[COVERAGE]
    preserve_current(cov, ["status", "manifest_revision", "ledger_revision", "workspace_prompt_ready",
        "approved_full_scope_github_sha", "final_executable_workspace_prompt", "current_candidate",
        "latest_main_reconciliation", "current_phase_assessment", "broader_requirement_scope"], f["recorded_at"])
    cov.update({"manifest_revision": 91, "ledger_revision": 99,
        "status": "all_67_requirements_preserved_finite_Map2_release_verified_broader_and_Workspace_obligations_open",
        "workspace_prompt_ready": True, "approved_full_scope_github_sha": f["merge"]["sha"],
        "final_executable_workspace_prompt": f["workspace_prompt"]["path"],
        "current_phase_assessment": copy.deepcopy(phases), "latest_main_reconciliation": copy.deepcopy(latest),
        "broader_requirement_scope": copy.deepcopy(broader), "current_release": release_ref})
    cov["current_candidate"].update({"stage": candidate["stage"], "pending": [],
        "full_map_release_verified": True, "workspace_prompt_ready": True,
        "private_tracker": copy.deepcopy(tracker), "broader_requirement_scope": copy.deepcopy(broader),
        "combined_local_validation": copy.deepcopy(combined_local),
        "visible_framing_integration": FINAL_INTEGRATION,
        "release_receipt": release_ref, "approved_release_sha": f["merge"]["sha"],
        "remaining_scope": "Broader required guide/Alpha audits and independent original Workspace A1-A7 remain open."})

    resume = docs[RESUME]
    preserve_current(resume, ["manifest_revision", "ledger_revision", "source_state", "validation",
        "private_tracker_receipt", "private_tracker_state", "full_map_release_state",
        "final_workspace_prompt_ready", "rollback"], f["recorded_at"])
    resume.update({"manifest_revision": 91, "ledger_revision": 99,
        "source_state": "Recovered combined PR204 candidate is now the reviewed, merged, Pages-deployed and independently live-checked finite Map2.0 release.",
        "private_tracker_receipt": f["tracker_receipt"]["path"],
        "private_tracker_state": "Actual guarded Manifest91 metadata transaction and fresh readback; no blanket completion or Workspace publication inferred.",
        "broader_master_plan_complete": False, "full_map_release_state": "finite_Interactive_Map_2_0_release_verified",
        "final_workspace_prompt_ready": True, "final_workspace_prompt": copy.deepcopy(f["workspace_prompt"]),
        "current_phase_assessment": copy.deepcopy(phases), "broader_requirement_scope": copy.deepcopy(broader),
        "current_release": release_ref, "rollback": copy.deepcopy(f["rollback"]),
        "targeted_Alpha_Dratini_review": DRATINI})
    resume["validation"].update({"final_head_ci": copy.deepcopy(f["tested"]),
        "final_screenshot_review": copy.deepcopy(f["visual"]), "expected_head_merge": copy.deepcopy(f["merge"]),
        "pages_deployment": copy.deepcopy(f["pages"]), "deployed_live_checks": copy.deepcopy(f["live"]),
        "runtime_file_hash_count": EXPECTED_RUNTIME_FILE_COUNT,
        "current_local_node": copy.deepcopy(combined_local),
        "historical_local_validation_fields": ["local_node", "scroll_correction_local_node", "fresh_independent_runtime_review", "direct_preview"],
        "earlier_local_validation_scope": "Local preview/test observations above retain their earlier checkpoint meaning; final release proof is the exact-head/deployment evidence recorded here."})

    disp = docs[DISPOSITIONS]
    preserve_current(disp, ["scope", "groups", "broader_master_plan_complete", "workspace_upgrade_complete"], f["recorded_at"])
    groups = disp["groups"]
    renames = {
        "candidate_or_preserved_behavior_needs_final_head_validation": "released_or_preserved_behavior_validated_for_scoped_Map2_release",
        "release_gate_blocked_pending_current_proof": "finite_Map2_release_gate_satisfied_single_Workspace_prompt_ready",
        "city_alpha_targeted_review_not_fully_demonstrated": "targeted_Dratini_review_complete_broader_city_Alpha_inventory_open",
    }
    disp["groups"] = {renames.get(key, key): value for key, value in groups.items()}
    disp.update({"scope": "All original 67 requirements remain mapped. G0-G5 finite Interactive Map 2.0 release is verified and A0 single prompt is ready. Broader guide, mission-depth and city-Alpha obligations and original Workspace A1-A7 remain independently required and open.",
        "manifest_revision": 91, "ledger_revision": 99, "broader_master_plan_complete": False,
        "workspace_upgrade_complete": False, "finite_map_release_complete": True,
        "current_phase_assessment": copy.deepcopy(phases), "current_release": release_ref,
        "targeted_Alpha_Dratini_review": DRATINI, "broader_requirement_scope": copy.deepcopy(broader)})

    outputs = {}
    for path, after in docs.items():
        outputs[path] = patch_json(original[path], old_docs[path], after)
    for path in original:
        if path.endswith(".md"):
            outputs[path] = patch_markdown(path, original[path], f, tracker_raw, release_path)

    # Hard invariants: acceptance/mapping bytes, source rows, old JSON histories,
    # and the complete original Markdown bodies survive. No numeric recoloring
    # of unknown inventories or broad "all requirements complete" is permitted.
    for path in (MANIFEST, GATE):
        before_spans, after_spans = json_spans(original[path]), json_spans(outputs[path])
        for index, phase in enumerate(old_docs[path]["phases"]):
            pointer = ("phases", index, "acceptance")
            a, b = before_spans[pointer]
            c, d = after_spans[pointer]
            require(original[path][a:b] == outputs[path][c:d], f"Original acceptance bytes changed: {path} {phase['id']}")
    for key in ("mapping", "coverage", "actions", "rules"):
        a, b = json_spans(original[COVERAGE])[(key,)]
        c, d = json_spans(outputs[COVERAGE])[(key,)]
        require(original[COVERAGE][a:b] == outputs[COVERAGE][c:d], f"Original coverage {key} bytes changed")
    inventory_pointer = old_docs[MANIFEST]["at_325_github_first_workspace_gate"]["owner_photo_inventory_scope"]
    require(docs[MANIFEST]["at_325_github_first_workspace_gate"]["owner_photo_inventory_scope"] == inventory_pointer,
            "Incoming current source-inventory pointer correction must remain unchanged")
    for field in ("local_node", "scroll_correction_local_node", "combined_final_node", "visible_framing_integration"):
        require(docs[RESUME]["validation"][field] == old_docs[RESUME]["validation"][field],
                f"Incoming/current or historical local validation observation changed: {field}")
    before_ids = [item for values in old_docs[DISPOSITIONS]["groups"].values() for item in values]
    after_ids = [item for values in docs[DISPOSITIONS]["groups"].values() for item in values]
    require(len(after_ids) == len(set(after_ids)) == 67 and set(before_ids) == set(after_ids),
            "67 original requirement IDs must remain mapped exactly once")
    require({item["requirement_id"] for item in docs[COVERAGE]["mapping"]} == set(after_ids),
            "Requirement disposition IDs differ from original coverage mappings")
    for path, before in old_docs.items():
        for key in before:
            if key.startswith("historical_") or key in ("supabase_manifest_87_sync", "supabase_manifest_89_sync", "supabase_manifest_90_sync"):
                require(docs[path][key] == before[key], f"Existing historical receipt changed: {path}:{key}")
    return outputs


def patch_markdown(path, original, f, tracker, release_path):
    require(original.count(MARKER_OLD) == original.count(MARKER_OLD_END) == 1,
            f"Exactly one90/98 current marker pair required: {path}")
    require(MARKER_NEW not in original, f"91/99 section already exists: {path}")
    start = original.index(MARKER_OLD)
    end = original.index(MARKER_OLD_END) + len(MARKER_OLD_END)
    old_block = original[start:end]
    parent = str(Path(path).parent)

    def link(label, target):
        return f"[{label}]({os.path.relpath(target, parent).replace(os.sep, '/')})"

    when = utc(f["recorded_at"], "recorded_at").strftime("%d %B %Y, %H:%M UTC")
    runs = "; ".join(f"[{run['name']} #{run['id']}]({run['url']})" for run in f["tested"]["ci_runs"])
    counts = tracker["status_counts"]
    new_block = f'''{MARKER_NEW}
## Current release — AT-342 / Manifest 91 / Ledger 99

**{when}: the finite Interactive Map 2.0 GitHub release is merged, deployed and independently live checked.** [PR #204](https://github.com/{REPOSITORY}/pull/204) tested remote head `{f['tested']['head_sha']}`, tree `{f['tested']['tree_sha']}`, against base `{f['tested']['base_sha']}`. The expected-head merge is `{f['merge']['sha']}` with the same tested tree. [Pages run #{f['pages']['run_id']}]({f['pages']['url']}) deployed that actual merge to [GitHub Pages]({f['pages']['site_url']}). The {link('actual release receipt', release_path)} records the exact proof and rollback instructions.

**G0–G5 are satisfied for the original finite Map 2.0 scope.** Current-head CI: {runs}. The {link('genuine mobile/desktop screenshot review', f['visual']['receipt']['path'])} and {link('independent deployed live checks', f['live']['receipt']['path'])} belong to the recorded tested/deployed versions. The final runtime inventory contains **{EXPECTED_RUNTIME_FILE_COUNT} files**, including the chooser scroll-clearance correction, visible sector framing, and the bounded source-description changes. The {link('combined integration receipt', FINAL_INTEGRATION)} records **{EXPECTED_LOCAL_NODE_COUNT} local tests passed** and the frozen eleven-outline replay; the earlier 154-test and prior-candidate observations retain their historical scope. Only the current tested head's CI and screenshots approve this release.

The approved source scope remains **48 sector footprints, 20 Wild Zone selection outlines and 68 finite encounter-area dispositions**: 45 named sector tables, three qualified related-zone links and 20 standard-table comparisons. **748 attributed claims plus 272 preserved originals give 1,020 encounter records.** Written/photo approaches cover all 68 areas with **42 routes, 217 steps and 97 leads**. Sector projections may overlap; zone selection outlines do not establish spawn extents, floors or traversable paths. Hidden-gate qualifications, eight disputes, unknown conditions and `not_comprehensive` roster status remain visible. No new exact pickup positions or complete access-structure inventory are claimed.

**G0 tracker synchronization:** the {link('actual Manifest 91 tracker receipt', f['tracker_receipt']['path'])} records the guarded update of 48 existing private rows and readback at `{tracker['readback_at']}`. Actual counts are **{counts['verified']} verified, {counts['in_progress']} in progress and {counts['open']} open**. Previous notes/proofs and every Workspace field were preserved. This does not promote all rows or certify the whole historical plan.

**A0 is ready:** the {link('single final Workspace prompt', f['workspace_prompt']['path'])} is reviewed against A0 and pinned to approved GitHub release `{f['merge']['sha']}`. **A1–A7 remain pending for the original Workspace.** Its last recorded state is version 38, source `6f7808db2d3cfaa2bb660f381b13dbab452332ce`, following the separate filter/photo hotfix; that is historical evidence to reconfirm, not a new source/access verification. Target only existing project `{WORKSPACE_PROJECT}` and [the original URL]({WORKSPACE_URL}). Reconfirm access/source and backup, preserve progress and Supabase/feedback contracts, apply only compatible bounded changes, preview/test, publish through the original editor and verify that edition independently.

**The larger historical master plan remains open.** `CHAT-FULL-GUIDE` and `CHAT-WALKTHROUGH-DEPTH` are not certified complete. The {link('targeted Alpha Dratini review', DRATINI)} is complete with labelled limits, while the broader `CHAT-CITY-ALPHAS` city/roof inventory remains required and open. All 67 original requirements remain mapped in the {link('current dispositions', DISPOSITIONS)} and {link('unchanged coverage mapping', COVERAGE)}. Optional unverified pickups/inventories and deferred expansions retain their original scope; no universal census gate has been added. Videos and YouTube remain paused. Original maps, photographs, markers, IDs, progress, accounts, feedback and Supabase runtime contracts remain preserved.

The earlier Manifest90/Ledger98 section below is retained as a dated pre-release snapshot; its pending status statements describe that earlier checkpoint.
{MARKER_NEW_END}'''
    history = ("<!-- AT342_HISTORICAL_90_98 -->\n<details>\n"
               "<summary>Historical pre-release checkpoint — Manifest90 / Ledger98</summary>\n\n"
               + old_block + "\n\n</details>\n<!-- END_AT342_HISTORICAL_90_98 -->")
    result = original[:start] + new_block + "\n\n" + history + original[end:]
    require(old_block in result and result.endswith(original[end:]), f"Historical Markdown was altered: {path}")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--repo", type=Path)
    parser.add_argument("--facts", type=Path)
    parser.add_argument("--schema", action="store_true", help="Print the exact expected input contract; no repository reads/writes")
    parser.add_argument("--apply", action="store_true", help="Write the reviewed13-document change; default is dry-run diff only")
    args = parser.parse_args()
    if args.schema:
        print(json.dumps(INPUT_SCHEMA, ensure_ascii=False, indent=2))
        return
    require(args.repo is not None and args.facts is not None, "--repo and --facts are required")
    repo = args.repo.resolve()
    facts_path = args.facts.resolve()
    facts_bytes = facts_path.read_bytes()
    f = json.loads(facts_bytes)
    tracker = validate_facts(repo, facts_path, f)
    require(sha256(repo_file(repo, REQUIREMENTS).read_bytes()) == REQUIREMENTS_SHA256,
            "Original source requirements file changed; do not rewrite its67 original requirements")
    original = {}
    for path, expected in EXPECTED_DOCUMENT_HASHES.items():
        data = repo_file(repo, path).read_bytes()
        require(sha256(data) == expected, f"Concurrent/current-document drift: {path}")
        original[path] = data.decode("utf-8")
    require(json.loads(original[MANIFEST])["revision"] == 90
            and json.loads(original[GATE])["ledger_revision"] == 98,
            "Expected the unreconciled Manifest90/Ledger98 current checkpoint")
    runtime = json.loads(repo_file(repo, RUNTIME_HASHES).read_text())
    require(len(runtime) == EXPECTED_RUNTIME_FILE_COUNT and "atlas-area.css" in runtime
            and "atlas-guide-links.mjs" in runtime,
            f"Final {EXPECTED_RUNTIME_FILE_COUNT}-file runtime inventory required")
    for path, expected in runtime.items():
        require(sha256(repo_file(repo, path).read_bytes()) == expected,
                f"Runtime changed after final tested inventory: {path}")
    images = json.loads(repo_file(repo, PRESERVED_IMAGES).read_text())
    require(images["count"] == 783 and images["all_unchanged"] is True,
            "Preserve the explicit783 runtime-image scope; do not substitute the older787 broader inventory")
    require(set(runtime).issubset(set(f["tested"]["changed_files"])),
            f"Reviewed changed-file allowlist must include every one of the {EXPECTED_RUNTIME_FILE_COUNT} runtime files")
    for path, expected in EXPECTED_INTEGRATION_EVIDENCE_HASHES.items():
        require(sha256(repo_file(repo, path).read_bytes()) == expected,
                f"Incoming integration evidence changed: {path}")
    integration = json.loads(repo_file(repo, FINAL_INTEGRATION).read_text())
    require(integration["validation"]["node_passed"] == EXPECTED_LOCAL_NODE_COUNT
            and integration["validation"]["node_failed"] == 0
            and integration["validation"]["node_log"] == COMBINED_NODE_LOG
            and integration["validation"]["frozen_ui_replay"] ==
                {"outlines": 11, "vertices": 832, "checks": 43, "passed": True},
            "Current combined 155-test and eleven-outline replay observations must match their retained receipt")
    resume_validation = json.loads(original[RESUME])["validation"]
    require(resume_validation["combined_final_node"] == {
                "passed": EXPECTED_LOCAL_NODE_COUNT, "failed": 0,
                "command": "node --test tests/*.test.mjs", "log": COMBINED_NODE_LOG}
            and resume_validation["visible_framing_integration"] == FINAL_INTEGRATION,
            "Current combined local validation pointer/count must be preserved")
    dratini = json.loads(repo_file(repo, DRATINI).read_text())
    require(dratini["requirement_state"] == "targeted_dratini_review_complete_with_labelled_limits; broader_city_alpha_route_inventory_open"
            and dratini["broader_requirement_complete"] is False,
            "Targeted Dratini evidence or broader open-scope boundary changed")
    # These receipts/inventories are read-only inputs. The old22-file navigation
    # receipt and783-image scope must never be changed to fit a new claim.
    protected_paths = [REQUIREMENTS, DRATINI, RUNTIME_HASHES, PRESERVED_IMAGES,
                       NAVIGATION_CORRECTION, SCROLL_CORRECTION, OLD_TRACKER,
                       FINAL_INTEGRATION, VISIBLE_FRAME_REVIEW, OVERLAP_VISIBILITY_REVIEW, COMBINED_NODE_LOG,
                       f["tracker_receipt"]["path"], f["workspace_prompt"]["path"],
                       facts_path.relative_to(repo).as_posix()]
    protected = {path: sha256(repo_file(repo, path).read_bytes()) for path in protected_paths}
    outputs = build_changes(repo, facts_path, f, tracker, original)
    require(set(outputs) == set(EXPECTED_DOCUMENT_HASHES), "Output escaped the13-document allowlist")
    require(facts_path.read_bytes() == facts_bytes, "Input receipt changed during preparation")
    for path, expected in protected.items():
        require(sha256(repo_file(repo, path).read_bytes()) == expected, f"Protected input changed: {path}")
    for path, old in original.items():
        require(repo_file(repo, path).read_text() == old, f"Concurrent modification during preparation: {path}")
    if not args.apply:
        for path in EXPECTED_DOCUMENT_HASHES:
            sys.stdout.writelines(difflib.unified_diff(original[path].splitlines(True), outputs[path].splitlines(True),
                                                     fromfile="a/" + path, tofile="b/" + path))
        print("\nDRY RUN: no files changed; review actual evidence and the complete diff before --apply.")
        return
    # Prepare all replacement bytes first. Restore all originals if a write fails.
    # There are no Git/index/remote operations here.
    temporary = {}
    written = []
    try:
        for path, text in outputs.items():
            target = repo / path
            fd, temp_name = tempfile.mkstemp(prefix=".at342-docs-", dir=target.parent)
            with os.fdopen(fd, "w", encoding="utf-8", newline="") as handle:
                handle.write(text)
                handle.flush()
                os.fsync(handle.fileno())
            temporary[path] = Path(temp_name)
        for path, temp_path in temporary.items():
            os.replace(temp_path, repo / path)
            written.append(path)
    except Exception:
        for path in written:
            (repo / path).write_bytes(original[path].encode("utf-8"))
        raise
    finally:
        for path in temporary.values():
            path.unlink(missing_ok=True)
    print(json.dumps({"status": "documentation_updated_only", "manifest_revision": 91,
        "ledger_revision": 99, "finite_map_release_sha": f["merge"]["sha"],
        "whole_historical_master_plan_complete": False, "workspace_upgrade_complete": False,
        "files": {path: {"before_sha256": sha256(original[path].encode()),
                         "after_sha256": sha256(outputs[path].encode())} for path in outputs}}, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, TypeError, OSError, json.JSONDecodeError, subprocess.CalledProcessError) as error:
        print(f"STOP: {error}", file=sys.stderr)
        sys.exit(1)
