# Provenance — omer-metin/skills-for-antigravity

- **Source repository**: https://github.com/omer-metin/skills-for-antigravity
- **Source commit (HEAD at vendor time)**: `e8dcf4e8737921a10088bd5c9eb65e81f74c051f` (2026-01-22)
- **License**: Apache License 2.0 (per GitHub repository license metadata)
- **Vendored path**: `skills/environment-art/` → `skills/environment-art/` (unchanged relative path)
- **Vendored on**: 2026-09-25
- **Vendored files**:
  - `skills/environment-art/SKILL.md`
  - `skills/environment-art/references/patterns.md`
  - `skills/environment-art/references/sharp_edges.md`
  - `skills/environment-art/references/validations.md`
- **Modifications from source**: none. Files are byte-identical to the fetched source at the commit above.

## Applicability note (read before using this skill for Portfolio World)

This skill is authored for **3D real-time engine production** (Unreal/Unity terminology throughout: meters, DCC pivot points, lightmaps, LODs, draw calls, GPU instancing, cubemap skyboxes, `.uasset`/`.meta`/`.prefab` file patterns).

- `references/patterns.md` — **broadly transferable**: the squint test, hero/unique/modular/dressing asset-tier budgeting, the "centering everything" and "ignoring negative space" anti-patterns, composition framing (rule of thirds, leading lines, depth layers), and environmental-storytelling staging all translate directly to 2D Phaser composition. The power-of-2 modular-grid, trim-sheet UV-strip, and vertex-color sections are 3D-DCC-specific and do not apply.
- `references/sharp_edges.md` — **mostly not transferable**. Only "Envart Tiling Artifacts" (directly matches this project's own promenade-seam history), "Envart Scale Inconsistency" (directly matches this project's own pavement-scale history), and "Envart Over Cluttering" apply as written. Z-fighting, collision-mesh mismatch, draw-call explosion, pivot-origin, memory-budget-in-VRAM, non-power-of-2-for-GPU-padding, skybox-cubemap-seams, lightmap-bleeding, and vertex-density entries describe failure modes that do not exist in this project's 2D Phaser/canvas rendering pipeline.
- `references/validations.md` — **not transferable as written**. Every rule is a regex check against Unity/Unreal asset-metadata file types (`*.meta`, `*.asset`, `*.uasset`, `*.prefab`) that do not exist in this project. None of these validations should be run against Portfolio World v2 files; see `docs/portfolio-world-rebuild/02_SKILL_STACK.md` for the filtered subset actually adopted.
