# Lumiose Atlas — Pokémon Legends: Z-A

**Repository status:** Import staging for an independently reconstructed, editable fan guide.

The existing ChatGPT Site is **not** hosted, modified, or replaced by this repository:
https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/

## Importing the recovered source

This repository is prepared to import `lumiose-atlas-rebuild-stage1.zip`, a 6.6 MB snapshot recovered from the guide owner's saved website files. Upload that exact ZIP to the **root of the `main` branch** using **Add file → Upload files → Commit changes**.

A GitHub Actions importer will validate the archive structure, extract the HTML, CSS, JavaScript, maps, images, and editable sections, run the static checks, and commit the source files. It removes the ZIP from the new commit after extraction. Watch progress in the **Actions** tab.

The ZIP must contain a top-level `lumiose-atlas-rebuild/` folder and the source files created for Stage 1. Do not upload a raw webpage capture or an unrelated ZIP.

## What this is — and isn't

This is a new independent reconstruction based on a saved MHTML webpage capture, **not the original ChatGPT Site project export**. It preserves what could be recovered and identifies incomplete routes. Ratings, reports, live Supabase functions, some standalone guide articles, and the separately loaded Hyperspace Pokédex are **not** restored. Do not deploy or point the existing domain at this repository.

Once imported, follow the full `README.md` and `RECOVERY_STATUS.md` included in the guide.

No secrets or database credentials should be uploaded. Before wider publication, review ownership and licensing of Pokémon images.
