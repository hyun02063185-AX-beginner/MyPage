# Portfolio World Rebuild — R1: Visual Brief + Minimal Skill Stack Foundation

Date: 2026-09-25
Role: Pre-production Art Pipeline Lead. No runtime, asset, or v1 file was created or modified.

## Branch

`feature/portfolio-world-rebuild-v2`, branched from `feature/portfolio-world-concept-vertical-slice` @ `92085e2edb4db8edf84d7cc2799b0b0d754abc3d` (the R0 skill-qualification commit). v1's full history is preserved untouched on its own branch.

## Selected Skills, Exact Source, Commit/Version, License

| Skill | Source repo | License | Vendored commit | Notes |
| --- | --- | --- | --- | --- |
| `environment-art` | `omer-metin/skills-for-antigravity` | Apache-2.0 | `e8dcf4e8737921a10088bd5c9eb65e81f74c051f` (2026-01-22) | Skill + all 3 references (`patterns.md`, `sharp_edges.md`, `validations.md`) reviewed in full |
| `create-game-assets` | `gamedev-skills/awesome-gamedev-agent-skills` | Apache-2.0 | `b105e1cf617adf0b68ed98790a716bbb60993179` (2026-09-10) | Only this skill vendored, not the router or other 72 |
| `phaser-architect` | `Yakoub-ai/phaser4-gamedev` | **none detected** | `1c1bf45dec3f0acbe8b2a963cc6dab93be31253a` (2026-08-27) | See "Open Decisions" |
| `phaser-coder` | `Yakoub-ai/phaser4-gamedev` | **none detected** | same | |
| `phaser-playtest` | `Yakoub-ai/phaser4-gamedev` | **none detected** | same | |
| `phaser-asset-advisor` (optional) | `Yakoub-ai/phaser4-gamedev` | **none detected** | same | |

`frontend-visual-qa` (`daymade/claude-code-skills`, MIT) was **not vendored** — its evidence discipline was written directly into a project-authored profile (`tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md`) because its bundled DOM-sweep script does not apply to Phaser canvas content (a canvas is one opaque bitmap to the DOM).

`level-design` (`gamedev-skills`) remains the R0-identified optional 7th item — not prepared in this phase.

## Project-local Setup

```text
tools/agent-skills/
  README.md, sync-skills.mjs
  vendor/{omer-metin-skills-for-antigravity, gamedev-skills-awesome-gamedev-agent-skills,
          yakoub-ai-phaser4-gamedev}/  (each with its own PROVENANCE.md)
  profiles/portfolio-world-visual-qa/SKILL.md
```

`sync-skills.mjs` is a small, dependency-free Node script (uses only `node:fs`/`node:path`) that copies — never symlinks — the vendored/profile skills into `.claude/skills/` and `.codex/skills/`. Verified with a dry run in this session (`node tools/agent-skills/sync-skills.mjs`, no `--write`); output confirmed correct target mapping for all 7 skills × 2 target roots. **Not run with `--write`** — activating the skills into a live runtime location is left as an open decision for whoever starts R2 (`90_DECISIONS.md` item 4).

## Visual Brief Summary

`docs/portfolio-world-rebuild/00_VISUAL_BRIEF.md`. Core contract: Portfolio World is a walkable portfolio interface, not the product itself. Theme stays Retro Harbor Campus / Refined Retro Harbor. The original Concept Image #1 binary was searched for across the full repository and its entire git history (`find`, `git log --all --diff-filter=A --name-only`) and **not found**; the v1 art-direction document's written description is recorded as the canonical fallback. Three hard rules carried forward as v2 mandates, none as v1 numbers: (1) asymmetric composition, cardinal cross explicitly rejected as a baseline, navigability non-negotiable; (2) sheltered-harbor water — calm/broad/rounded, jagged wave crests explicitly forbidden, with v1's own final water-contact fix named as a real example of a treatment that no longer qualifies under this rule; (3) plaza stone as surface texture, not competing objects, with v1's three-round tile-scale saga named as the process failure this rule exists to prevent.

## Art Bible Summary

`docs/portfolio-world-rebuild/01_ART_BIBLE.md`. Defines visual pillars, shape language, a composition hierarchy adapted from `environment-art`'s Hero/Unique/Modular/Dressing tiering, harbor silhouette, water/fleet/architecture language, materials, texture-density/tiling-discipline (directly operationalizing Visual Brief §12–13), landmark hierarchy/wayfinding, UI/world relationship, `create-game-assets`' asset-family rules, and reference policy. No v1 tuning number appears anywhere in the document.

## `environment-art` Review Result

Read in full: `SKILL.md` + `references/patterns.md` (17.7KB) + `references/sharp_edges.md` (20.8KB) + `references/validations.md` (9.9KB). Finding, recorded in both `01_ART_BIBLE.md` §15 and the skill's own `PROVENANCE.md`: this skill is authored for **3D real-time engine production** (Unreal/Unity terminology throughout — meters, DCC pivot points, lightmaps, LODs, draw calls, cubemap skyboxes, `.uasset`/`.meta`/`.prefab` regex validation targets).

- `patterns.md` — broadly transferable: squint test, asset-tier budgeting, "centering everything" and "ignoring negative space" anti-patterns, composition framing, environmental storytelling. Adopted into the Art Bible.
- `sharp_edges.md` — only 3 of ~10 entries apply to a 2D Phaser project (tiling artifacts, scale inconsistency, over-cluttering — all three map directly onto v1's own documented incidents). The remaining ~7 (z-fighting, collision-mesh mismatch, draw-call/GPU-instancing, DCC pivot-origin, VRAM budgets, POT-for-GPU-padding, skybox seams, lightmap bleeding, vertex-color density) describe failure modes that do not exist in this project's rendering pipeline.
- `validations.md` — **not applicable as written.** Every rule is a regex check against Unity/Unreal asset-metadata file extensions this project never produces. None should be run against Portfolio World v2 files.

Verdict: **adopt with a filter**, not wholesale — recorded explicitly rather than silently applying only the useful third and calling it "adopted" without qualification.

## Open Decisions (full list: `docs/portfolio-world-rebuild/90_DECISIONS.md`)

1. `Yakoub-ai/phaser4-gamedev` has no detected license (GitHub license API: none; no `LICENSE` file at the vendored commit). Its 4 vendored skills are reference-only until this is resolved — do not ship `phaser-playtest/scripts/playtest.mjs` in a release build before then.
2. Original Concept Image #1 binary not found anywhere in this repository's history — written fallback in use.
3. No numeric tuning value (camera angle, tile scale, water/vessel parameters) is locked in R1; each must be validated at actual gameplay render scale before being treated as final.
4. Vendored skills are not yet activated into `.claude/skills/`/`.codex/skills/` — `sync-skills.mjs --write` was not run.
5. `level-design` remains unadopted pending a stripped-down, no-combat profile.
6. No license audit was performed beyond each source repo's top-level license field.

## Files Changed

New files only (verified via `git status --short` before staging — see the commits for the exact list):

- `docs/portfolio-world-rebuild/{00_VISUAL_BRIEF,01_ART_BIBLE,02_SKILL_STACK,03_REBUILD_WORKFLOW,90_DECISIONS,91_STATUS,92_HANDOFF}.md`
- `tools/agent-skills/{README.md,sync-skills.mjs}`
- `tools/agent-skills/vendor/omer-metin-skills-for-antigravity/{PROVENANCE.md,skills/environment-art/**}`
- `tools/agent-skills/vendor/gamedev-skills-awesome-gamedev-agent-skills/{PROVENANCE.md,skills/disciplines/create-game-assets/**}`
- `tools/agent-skills/vendor/yakoub-ai-phaser4-gamedev/{PROVENANCE.md,skills/**,agents/**}`
- `tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md`
- `reports/portfolio-world-rebuild/r1-visual-brief-skill-foundation.md` (this file)

No file under `portfolio-world/**`, `world/**`, or any other pre-existing path was touched.

## Next Gate

```text
READY_FOR_REBUILD_VISUAL_BRIEF_HUMAN_REVIEW
```
