# 04. Portfolio World Rebuild — Architecture V2

Status: **PROPOSED — architecture only, no runtime created**
Updated: 2026-09-26

This document is the WHERE/HOW answer for R2B implementation. It does not create any runtime directory, package.json, or code. Every path below is a proposal, verified against the existing repository's actual structure — not invented in the abstract.

## 1. Verified Existing Structure (read before proposing anything)

```text
/ (repo root, static site, NO package.json)
  index.html                      -> links to "world/" (relative)
  world/                          -> v1's committed Vite build OUTPUT (not gitignored)
  portfolio-world/                -> v1's Vite/Phaser SOURCE (own package.json)
    vite.config.ts                -> base: "/MyPage/world/" (build) | outDir: "../world"
    package.json                  -> scripts: dev/build/typecheck/test; Phaser 4.2.1
  .gitignore                      -> ignores portfolio-world/{node_modules,dist,.vite}
                                      (NOT ../world — the build output is committed)
```

Root Pages serving has no `.github/workflows` — GitHub Pages serves the branch root directly, and `world/` is a **committed** build artifact, not a CI-generated one. This shapes every proposal below.

## 2. Proposed V2 Source/Output Locations

```text
portfolio-world-v2/    -> source (own package.json, own vite.config.ts)
world-v2/              -> generated, COMMITTED Pages artifact (mirrors v1's "world/" pattern)
```

Mirrors v1's exact pattern: `vite.config.ts` → `base: "/MyPage/world-v2/"` (build), `outDir: "../world-v2"`; `package.json` scripts `dev`/`build`/`typecheck`/`test` (Phaser 4.x). **No root `package.json`** — the repo root stays a static site, per the R2A brief's hard constraint.

**Root `index.html` is not touched by this proposal.** v1's `world/` link stays exactly as-is. Whether `world-v2/` eventually replaces `world/` (and how root `index.html` re-points) is an explicit **open decision**, not decided here — see `90_DECISIONS.md`. R2A/R2B run `portfolio-world-v2` and `world-v2` alongside v1 with zero interference: v1's build, v1's link, and v1's committed output are all untouched.

**Not created in R2A**: neither `portfolio-world-v2/` nor `world-v2/` exists yet. This is a verified proposal for R2B to execute, not an architecture proof implemented early — the brief's §15 explicitly prefers "architecture docs only in R2A."

## 3. Scene Model (Minimum, Not Maximal)

Evaluated against "avoid needless complexity — do not create many scenes merely because Phaser supports them":

```text
BootScene   -> preload + BASE_URL-safe asset registration, then start WorldScene
WorldScene  -> the single harbor world: camera, input, layout, depth, destination
               interaction (E/Enter/click -> external portfolio HTML page)
```

**Two scenes, matching v1's own minimal structure exactly** — not because v1 is copied, but because the brief's own scene-model question ("does v2 need more?") has the same answer v1 already validated: this project has one continuous playable world (no separate loading levels, no minigame sub-scenes, no menu scene beyond the root portfolio page itself). Destination pages (`career.html`, `teaching.html`, `making.html`, `gallery.html`) remain **external content destinations** reached by leaving the Phaser canvas entirely, exactly as in v1 — the brief confirms this unless a new requirement says otherwise, and none has been stated. Revisit only if a concrete new requirement (an in-world dialog scene, a settings overlay scene) is specified; do not add a scene speculatively.

## 4. Depth / Layer Model

Minimum explicit layer band list needed for a believable 2D harbor, evaluated against "avoid another large renderer rewrite":

```text
1. Ground / water            (terrain plate, water plate — lowest)
2. Shoreline                 (wet-edge/foam overlay, above water, below structures)
3. Lower environment         (paving, dock/pier decking, ground props with no height)
4. Structures / vessel bodies (buildings, ship hulls — the "standing height" band)
5. Player relationship       (player sprite, y-ordered against structures/vessels it
                              passes in front of or behind)
6. Upper structure           (roofs, masts, sails, rigging — extends above band 4
                              without moving band 4's world position)
7. Foreground                (any element deliberately in front of the player, e.g.
                              a near-camera framing element — used sparingly)
8. Labels / UI                (destination name text, world-space UI — highest)
```

This is the same *band concept* v1 already validated (semantic depth bands + y-aware ordering within a band), kept because it is a sound, minimal answer to a real requirement (a harbor scene needs ships partially behind/in front of the player and other ships, and buildings whose roofs must not be treated as the same depth as their footprint) — not because v1's specific numeric depth values are being copied (they are not; `90_DECISIONS.md`). R2B implements this band list with fresh numeric values sized to v2's own scene, validated against the actual asymmetric crescent-harbor composition (`05_HARBOR_BLOCKOUT_SPEC.md`), not against v1's.

## 5. What R2B Must NOT Invent

Per the R2A brief's Architecture Gate: R2B should not need to invent layout or architecture decisions. Everything above is intentionally the WHERE/HOW; the WHAT-IT-LOOKS-LIKE is `05_HARBOR_BLOCKOUT_SPEC.md`, the WHAT-SCALE-TO-TEST is `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, and the WHAT-COUNTS-AS-PASS is `07_RUNTIME_QA_PLAN.md` + `tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md`.

## 6. Status

```text
ARCHITECTURE_V2_STATUS = PROPOSED
RUNTIME_CREATED = NO
```
