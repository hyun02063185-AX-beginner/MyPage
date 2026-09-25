# Provenance — gamedev-skills/awesome-gamedev-agent-skills

- **Source repository**: https://github.com/gamedev-skills/awesome-gamedev-agent-skills
- **Source commit (HEAD at vendor time)**: `b105e1cf617adf0b68ed98790a716bbb60993179` (2026-09-10)
- **License**: Apache License 2.0 (per GitHub repository license metadata)
- **Vendored path**: `skills/disciplines/create-game-assets/` → `skills/disciplines/create-game-assets/` (unchanged relative path)
- **Vendored on**: 2026-09-25
- **Vendored files**:
  - `SKILL.md`
  - `agents/openai.yaml`
  - `assets/art-direction-brief.md`
  - `assets/asset-manifest.json`
  - `references/art-direction.md`
  - `references/provenance.md`
  - `references/raster-pipeline.md`
  - `references/three-d-pipeline.md`
  - `scripts/asset_report.py`
  - `scripts/build_preview_sheet.py`
  - `scripts/requirements.txt`
- **Modifications from source**: none. Files are byte-identical to the fetched source at the commit above.
- **Not vendored**: the repo's `router/` and all other 72 skills. Only `create-game-assets` was selected per the R0 qualification report and the R1 brief. Do not run this repo's own installer (it bundles the router plus all 73 skills).
- **Runtime dependency**: `scripts/asset_report.py` and `scripts/build_preview_sheet.py` require Python 3.10+ and Pillow (`scripts/requirements.txt`). No network access required; both scripts operate on local raster files only.

## Applicability note

Engine-neutral by design; applies to Portfolio World's Phaser/2D-sprite pipeline without modification. `references/three-d-pipeline.md` (glTF/GLB, topology, LODs) is not applicable to this project and can be skipped; `references/raster-pipeline.md` and `references/art-direction.md` are the two files actually relevant to a sprite/tile-based rebuild.
