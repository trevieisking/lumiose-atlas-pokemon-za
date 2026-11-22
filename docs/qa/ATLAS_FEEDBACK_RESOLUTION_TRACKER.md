# Pokémon Atlas — private feedback resolution tracker

**Established:** 22 November 2026
**Tracking identity:** AT-259
**Source of truth for report status:** Supabase project xzxqfrvqdgkzwujbkdbk, owner-only schema **atlas_internal**
**Two distinct delivery targets:** B = independently deployed GitHub guide; A = original ChatGPT Workspace Site.
**Original Site:** https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/
**GitHub guide:** https://trevieisking.github.io/lumiose-atlas-pokemon-za/
**Canonical parity ledger:** [ATLAS_DUAL_SITE_FIX_LEDGER.md](../../ATLAS_DUAL_SITE_FIX_LEDGER.md)

## Why this exists

A player's report should remain recorded even after its underlying guide problem is fixed. Previously **public.atlas_reports** had only the submission fields (id, page, category, details, email_status and created_at), not a durable owner resolution state. It was impossible to tell from Supabase whether GitHub, the original Workspace Site, or both had been fixed.

On 22 November 2026 a separate, private status tracker was created. The original feedback forms, two production Edge Functions, database report rows, ratings, authentication, styling, URL and player progress were **not** changed. The original ChatGPT Site remains separately deployed and cannot be assumed to inherit GitHub changes.

## Private database design (deployed, independently verified)

- **public.atlas_reports** is still the original submission source. All reports and messages are preserved as submitted.
- **atlas_internal.report_resolutions** stores owner-only metadata keyed by original report ID, with a restrictive foreign key to the report (ON DELETE RESTRICT). Its fields include report_kind (player_issue/test), tracking_ref, tracking_url, independent github_status and workspace_status, evidence URLs, exact GitHub commit, Workspace release reference, site-specific verification timestamps, notes and updated_at.
- **atlas_internal.report_resolution_queue** is a security-invoker read-only view. It displays **every incoming report**, including reports that do not yet have a metadata row, and treats those as OPEN. It excludes the private message body. The derived overall_status reads OPEN, IN PROGRESS, GITHUB VERIFIED / WORKSPACE PENDING, WORKSPACE VERIFIED / GITHUB PENDING, or FIXED — BOTH VERIFIED.
- Both independent site status columns accept **open**, **in_progress**, **verified**. A VERIFIED status requires the appropriate evidence URL and timestamp; GitHub VERIFIED also requires the exact reviewed/deployed commit SHA.
- **Security verified:** the internal schema has no USAGE grants to anon/authenticated; the tracker table and view have no SELECT grants to anon/authenticated. The tracker table has RLS enabled. There is no public feedback-status API and **players need no accounts**.
- The private table must be queried or changed through authorised Supabase project-owner access (dashboard SQL Editor or connected privileged assistant). An unrelated public page, anon key, or Workspace browser session is not authorised to read or write it.

## Verified status at creation

| Report | What needs attention | GitHub (B) | Workspace Site (A) | Evidence |
| --- | --- | --- | --- | --- |
| **#13 — AT-002** | Mission 24 Hotel Z dialogue after Corbeau | Open | Open | [Existing issue #6](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/6) |
| **#14 — AT-003** | Mission 25 Lida/Naveen opponent recommendations | Open | Open | [Existing issue #6](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/6) |
| **#18 — AT-047** | Missing Ivor/Gwynn three-Mega ally battle, between missions 36 and 37 | Open | Open | [Issue #82](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/82) |
| **#19 — PR-84** | Owner's feedback-label test: “Page link to investigate” | **Verified** | **Open** | [PR #84](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/84), [successful Pages deployment #45058176075](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45058176075), main SHA **20e6dadea42123b2613a7eff91f9b952b2760367** |

The original private test submission #19 remains saved and is tagged **test**, not a genuine walkthrough defect. All four rows in public.atlas_reports remained intact after creating and testing the tracking table.

**IMPORTANT:** Report #18's GitHub issue records a proposed, researched fix, **not** a shipped walkthrough correction. Do not label it VERIFIED until the actual mission content is updated, deployed and tested. Do not mark report #19 fixed on the original Site until that Site's own form and content are inspected and the equivalent change is deployed and verified there. Do not mark anything BOTH VERIFIED simply because a GitHub commit exists.

## Read-only owner / Workspace query

Authorised Supabase project personnel can run this in the **private Supabase SQL Editor**, or via a privileged Supabase connector:

~~~sql
select report_id, report_received_at, report_kind,
       github_status, workspace_status, overall_status,
       tracking_ref, tracking_url, github_revision,
       github_evidence_url, github_verified_at,
       workspace_release_ref, workspace_evidence_url, workspace_verified_at,
       notes
from atlas_internal.report_resolution_queue
order by report_received_at desc, report_id desc;
~~~

This intentionally excludes **details**, so a Workspace migration checklist can inspect progress without copying private user messages into GitHub. The view automatically lists newly submitted reports as OPEN even before they receive an explicit tracking entry. This Markdown table is a **dated checkpoint**, not a real-time feed; use the SQL view for current truth.

## Protocol for every new feedback submission

1. **Keep the original submission** in public.atlas_reports. Do not erase it when work begins or when a fix is delivered.
2. **Read the owner-only resolution queue**. New reports already show as OPEN. On first triage, add a private tracker row for its report ID and assign the existing ledger AT number / GitHub issue link where available. Tag deliberate tests as test, not player_issue.
3. **Before coding**, reproduce the problem, identify the exact Site (A/B), confirm facts and original content, and isolate the smallest correct fix.
4. **Set GitHub to in_progress** while working. Only after a tested, deployed commit and on-site checks should the owner set github_status to verified, record the exact deployed commit SHA, evidence URL, and GitHub verification time.
5. **Independently verify the original ChatGPT Site** after Workspace access is restored: inspect original source, preserve user progress, implement only missing equivalent fixes, publish safely and check the original URL on a phone and desktop. Then record the Workspace release reference, Site-specific evidence URL, timestamp and workspace_status = verified.
6. **Read the derived overall_status**. Only when both independent statuses are VERIFIED does the queue return fixed_both_verified.
7. **Never silently delete old reports.** Historical evidence and messages remain saved, including test submissions, unless the owner separately requests a scoped cleanup after checking impact.

### Templates — owner-only SQL; replace placeholders after verification

First-time tracking row for a *real existing* report:

~~~sql
insert into atlas_internal.report_resolutions
  (report_id, report_kind, tracking_ref, tracking_url, notes)
values (<REPORT_ID>, 'player_issue', '<AT-NNN>', '<TRACKING_URL>', '<RESEARCH_NOTE>')
on conflict (report_id) do nothing;
~~~

Record tested/deployed GitHub verification (only after actual checks, never at PR creation):

~~~sql
update atlas_internal.report_resolutions
set github_status = 'verified',
    github_revision = '<EXACT_DEPLOYED_MAIN_SHA>',
    github_evidence_url = '<GITHUB_DEPLOYMENT_AND_TEST_EVIDENCE_URL>',
    github_verified_at = now(),
    updated_at = now()
where report_id = <REPORT_ID>;
~~~

Record independent live Workspace verification (only after original Site publication and manual checks):

~~~sql
update atlas_internal.report_resolutions
set workspace_status = 'verified',
    workspace_release_ref = '<WORKSPACE_SITE_VERSION_OR_CHECKPOINT>',
    workspace_evidence_url = '<ORIGINAL_SITE_VERIFICATION_EVIDENCE_URL>',
    workspace_verified_at = now(),
    updated_at = now()
where report_id = <REPORT_ID>;
~~~

**Never run templates with placeholders.** Check that the report ID exists, the correct edition has genuinely passed manual checks, the evidence link refers to that edition, and the resulting queue state is accurate. Updates to this table must be made through a privileged, authenticated owner workflow — **never** by exposing privileged write access to the public guide.

## Workspace integration boundary

This is the handoff record for the original ChatGPT Workspace Site when editable source access returns. Workspace should read this document **and** the private Supabase resolution queue using authorised access, then compare its *actual original source* with GitHub before applying any change. A read-only export or reopening Workspace will **not** automatically sync the Site with GitHub or merge progress across browser origins.

**Do not modify the original Site merely to access this tracker.** No changes to either Site's layout, user localStorage/progress, original feedback submission API, ratings, DNS, or published URL are needed for the status tracker. If Workspace cannot access the privileged Supabase SQL Editor, this dated document shows the last known checkpoint and a connected owner can supply a fresh metadata-only status export. Never put secret keys or raw private report bodies in the repository.

## Independent verification on creation

- Read-only preflight found **four existing reports**, no pre-existing resolution table, and RLS protecting the reports.
- After applying the private tracking schema, a read-only query returned **four reports and four tracking rows**, preserving IDs #13, #14, #18 and #19.
- The queue returned #13/#14/#18 as OPEN / OPEN, and #19 as **GitHub VERIFIED / Workspace OPEN**.
- Post-change privilege checks confirmed **no anon/authenticated schema USAGE and no tracker/view SELECT**.
- The previously deployed [feedback label correction PR #84](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/84) and its [GitHub Pages workflow](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45058176075) were successful before recording GitHub verification for #19.

**This file documents a completed private Supabase metadata improvement; it is not a claim that the original ChatGPT Site has been updated.**
