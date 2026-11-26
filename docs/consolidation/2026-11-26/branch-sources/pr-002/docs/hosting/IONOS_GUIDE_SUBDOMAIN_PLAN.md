# Hosting Lumiose Atlas through Stream Bandit + IONOS — staging plan

**Status:** Design only. No IONOS DNS, GitHub Pages custom-domain settings, original ChatGPT Site, main Stream Bandit repository or Supabase settings have been changed.

## Known facts

**Brand ownership:** Chatterfriends is the overarching label; Stream Bandit is a Chatterfriends platform; Lumiose Atlas is a Stream Bandit gaming guide. The guide is intended to reuse **the existing Stream Bandit Supabase project**, not establish a separate database. This does not authorise modifying the connection, permissions or data. Full record: [`docs/architecture/CHATTERFRIENDS_STREAM_BANDIT_ATLAS.md`](../architecture/CHATTERFRIENDS_STREAM_BANDIT_ATLAS.md).


- Stream Bandit repository: `trevieisking/stream-bandit`; its `CNAME` file declares `chatterfriendsstreambandit.co.uk` for the existing home page. **Do not edit, rename, or repoint this root domain.**
- Guide repository: `trevieisking/lumiose-atlas-pokemon-za`, using GitHub Pages from `main` at the repository root. Recovered static site is a reconstruction under accuracy audit.
- Old ChatGPT Site: `https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/#home`; this name is controlled by the ChatGPT Site platform, **not** by IONOS or GitHub. A separate DNS entry cannot take over this address.
- Proposed distinct guide address (NOT active): `https://guide.chatterfriendsstreambandit.co.uk/`.
- The original guide's Supabase ratings, reports and submissions are **not connected** to the GitHub reconstruction. Do not migrate or rewrite database records without independent schema/RLS review.

## Safe configuration sequence — only after the guide is reviewed

1. Ensure the guide homepage, 19 standalone routes, all mission links, images, maps, navigation and phone layout work independently; check `README.md`, `RECOVERY_STATUS.md` and the QA register.
2. Confirm control of `chatterfriendsstreambandit.co.uk` in IONOS Domains & SSL, determine whether IONOS currently hosts its nameservers and whether the hostname `guide` is unused. **Do not edit `@`, `www`, wildcard, mail or Stream Bandit application records.**
3. In the guide repository’s **Settings → Pages → Custom domain**, save `guide.chatterfriendsstreambandit.co.uk` *before* pointing DNS. GitHub's UI will create the guide repository `CNAME` file for branch-based publication.
4. In the **domain's authoritative DNS provider** (IONOS if it manages nameservers), create a **single new CNAME**: hostname `guide`; target `trevieisking.github.io` (without scheme or `/lumiose-atlas-pokemon-za`). Never point this record at the Stream Bandit root. Do not overwrite an existing `guide` record without checking who uses it.
5. Verify resolution and ownership, HTTPS availability, and that `https://guide.chatterfriendsstreambandit.co.uk/` serves the guide while `https://chatterfriendsstreambandit.co.uk/` still serves the original Stream Bandit homepage.
6. Update the guide's Open Graph `og:image`, `og:url` and Twitter image URLs to the **validated canonical subdomain**; test the card at Meta Sharing Debugger. Current provisional sharing metadata points to the GitHub Pages preview and uses the saved 512×512 `atlas-logo.png` asset.
7. Preserve the old `chatgpt.site` website while users still follow that URL. Existing posts and links cannot be silently moved by DNS; redirecting requires editable control of the original Site, and may not be possible with current access.
8. Only publish the new subdomain broadly after all pages and integrations pass acceptance checks. The original site and main Stream Bandit domain must remain usable throughout.

## References

- GitHub Pages custom domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- IONOS subdomain CNAME instructions: https://www.ionos.com/help/domains/configuring-cname-records-for-subdomains/configuring-a-cname-record-for-a-subdomain/
- Meta Sharing Debugger: https://developers.facebook.com/tools/debug/

**Safety gate:** Do not deploy, change DNS, change the old site, or touch Supabase while work is under fact-check. Release decision should be evidence-based.
