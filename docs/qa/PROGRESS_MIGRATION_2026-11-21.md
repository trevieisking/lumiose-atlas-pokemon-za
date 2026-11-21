# Lumiose Atlas player progress migration and backups
**Opened:** 21 November 2026  
**Status:** Implementation staged in draft PR, NOT merged or deployed. Original Site export workaround still requires real-world compatibility test.

## Why this matters
The existing original ChatGPT Site has real users, including mobile players, with progress that should not be reset when the independently reconstructed guide is eventually published. Progress may be browser-local and is not automatically shared between two domains, devices or browsers.

## Source evidence from the recovered original site
The owner's saved 20 November MHTML page contains **976** checkbox elements representing **634 unique progress IDs**:
- 42 main mission checkboxes (`data-check`).
- 203 side/EX mission checkboxes (`data-side-check`).
- 25 legendary checkboxes (`data-legend-check`).
- 606 rendered item checkbox elements, for **264 unique** item IDs (`data-pickup`) because some are repeated in mission and item panels.
- 100 Colorful Screw checkboxes (`data-screw`).

The MHTML did **not** include the original executable JavaScript or localStorage schema. Therefore **do not assume the original stored key is the same as the new site's**, and do not claim the new origin can access old-origin browser data.

## What was implemented on the rebuilt guide
- `progress-backup.html` with a visible **Backup & Restore** link in sidebar, homepage and footer.
- Export of local completion progress as versioned `.json`, with five original progress categories plus separate, unambiguously identified numbered map-pin data.
- Strict JSON input size/type/schema checks and exact ID whitelist (`progress-keys.js` is generated from the recovered guide section IDs).
- **Import preview** showing how many completed checkboxes are recognised and how many will be added; no write until an explicit Merge button.
- **Non-destructive merge**: only imported `true` completions are added; existing `true` states are never cleared. An on-device pre-import recovery copy is stored before writes.
- Unknown valid IDs from future versions are retained under a separate local-only namespace, surfaced in the preview, and included in subsequent backups rather than silently discarded.
- Mapped pin tracking is included; 111 uniquely matched pins map into existing item IDs, while other pins have separate progress storage.
- No login, HTTP request, API key, database write, Supabase migration, changed domain or modification to the old ChatGPT Site.

## Migrating an individual user's original-site progress
1. **On the device and browser that actually holds the original checkmarks**, open the original `lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/#home` URL.
2. The new backup page supplies a copyable **old-page bookmarklet**: it runs only while viewing the original hostname, reads checked inputs from the five known `data-*` categories and downloads a versioned JSON file. It never reads other localStorage keys, cookies or credentials and makes no network calls.
3. Confirm a file was downloaded. **Do not delete or reset the old site/browser data.** Some browsers may restrict bookmarklets, and the locked original site's compatibility cannot yet be guaranteed.
4. On the new guide, select that file, inspect the import preview and confirm Merge. Every previously completed new-site item remains ticked.
5. Export a new guide backup periodically, particularly before moving to another device.

## Critical limitations and release conditions
- The original Site editor is inaccessible; no native one-click Export button has been installed there. The bookmarklet is a **user-run migration workaround** and must be tested on the actual original website/browser, including Android.
- The browser may store progress in IndexedDB or remote services not reflected in rendered checkbox state; the workaround can only capture currently checked inputs from a fully hydrated old guide page.
- Old-site feedback, ratings, accounts, event history and submissions are **not** in a progress backup and remain separate in Stream Bandit's Supabase project.
- Any user who cannot run the exporter must keep using the old site until a supported solution is available; never reset their storage or claim the transfer completed.
- Run `python3 tests/validate_backup.py`, existing static validation and mobile browser acceptance before merging. Test synthetic fixture import, double import (idempotence), conflict merge, malformed JSON rejection, cross-device recovery, map-pin progress and storage rollback.
- PR dependency order: walkthrough #3 → maps #4 → this backup PR. The original ChatGPT Site, GitHub Pages `main`, Stream Bandit and Supabase are unchanged by these drafts.
