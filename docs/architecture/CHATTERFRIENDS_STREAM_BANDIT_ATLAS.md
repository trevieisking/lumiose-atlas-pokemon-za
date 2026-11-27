# Brand ownership and Stream Bandit database architecture

**Owner direction — 21 November 2026**  
**Status:** Agreed brand hierarchy and proposed integration policy. **No database writes, credentials, production DNS, or original ChatGPT Site changes authorised by this document.**

## Brand relationship — preserve in every future design

- **Chatterfriends** — overarching label / parent brand.
- **Stream Bandit** — a Chatterfriends product and entertainment/community/gaming platform.
- **Lumiose Atlas** — Pokémon Legends: Z-A guide **within Stream Bandit**, built for players' enjoyment and game time.
- Do **not** describe Stream Bandit as the parent of Chatterfriends, and do **not** present Lumiose Atlas as an unrelated company.
- Preserve Lumiose Atlas's existing LA compass identity and substantive user-facing description. When a footer or acknowledgement is introduced, use an accurate attribution such as **“Lumiose Atlas — a Stream Bandit gaming guide, part of Chatterfriends.”** Avoid changing the visible logo or branding without reviewing the result.

## Hosting and platform choices — user confirmed

- **No Render hosting** for this guide or Stream Bandit. The previous Render-backed social platform was retired because the cost was unacceptable; do not reintroduce Render as a default dependency or deployment.
- **Supabase is preferred** for the shared Stream Bandit data platform, using the existing project and isolated Atlas tables with appropriate RLS and grants. The owner's approximate budget preference is not a guaranteed current price.
- Use the GitHub repository for version-controlled source; IONOS-managed DNS and a separately validated static host can present the guide under Chatterfriends/Stream Bandit without disturbing the main site.
- Keep the name **Chatterfriends**; do not confuse it with the old name **Chatternet**.

## Code and hosting: separate deployment, shared family

- Editable guide source: `trevieisking/lumiose-atlas-pokemon-za` (independent repository so edits to the guide cannot accidentally modify the Stream Bandit main site or TCG).
- Main platform: `trevieisking/stream-bandit`; its `CNAME` currently points to `chatterfriendsstreambandit.co.uk`.
- Proposed future guide URL: `guide.chatterfriendsstreambandit.co.uk`; **not yet configured**. Use a dedicated subdomain without repointing the main Stream Bandit domain.
- Preserve the old public ChatGPT Site URL and its existing audience while the rebuilt guide is under audit. Never claim an IONOS DNS change could take ownership of a `chatgpt.site` domain.

## Shared Stream Bandit database — verified, read-only

The existing **Stream Bandit** Supabase project (EU London region) includes these **public-schema Atlas-specific tables**:

| Table | Existing purpose | Read-only observation |
|---|---|---|
| `atlas_interactions` | Page interactions and click/view tracking | Table exists; row-level security enabled |
| `atlas_ratings` | Guide ratings (1–5) | Table exists; row-level security enabled |
| `atlas_reports` | Player feedback and correction reports | Table exists; row-level security enabled |

These facts were checked against the connected Supabase **metadata only** on 21 November 2026. No user-submitted record contents were read, and **no SQL mutations were made**. RLS being enabled does not by itself prove the policies are appropriate for public visitors.

**Intended architecture:** the rebuilt Lumiose Atlas should use **the same existing Stream Bandit Supabase project**, with Atlas-specific tables and correctly scoped permissions; it should **not** create a parallel Supabase project or modify unrelated Stream Bandit, TCG, Code Labs or other product tables.

## Mandatory safe integration gates

1. Inspect existing Atlas column contracts, RLS policies, public grants and API access **read-only** before writing client code.
2. Establish the existing public site’s ratings/form semantics, spam safeguards and displayed averages, without exposing message contents or PII.
3. Use only a publishable/anon key in client code, never `service_role` or privileged keys. No secrets in GitHub.
4. Preserve existing records. Never delete old ratings, reports or interactions to make a test pass; any data cleanup needs separate evidence and user approval.
5. Keep separate Atlas table namespaces; avoid direct coupling to Stream Bandit authentication, TCG matches, rewards or creator functions unless explicitly designed and tested.
6. Verify CORS, rate limiting, abuse handling, mobile rating display and form submission/visibility; test staging before a live connection.
7. Do not apply migrations, change RLS or connect the public rebuilt site until the data flow and permissions are reviewed.
8. Record exactly which guide deployment, GitHub commit and Supabase interface version have been tested before any public cutover.

## Priority

Make the guide **accurate for real playthroughs** (Canari/Ivor-level mission detail) and preserve the visitors of the existing site. Integration and branded URL follow once independent verification passes.

**Source of these ownership instructions:** user statement in this conversation, 21 November 2026. Database/project evidence from read-only connected Supabase metadata; domain and repository evidence from connected GitHub.
