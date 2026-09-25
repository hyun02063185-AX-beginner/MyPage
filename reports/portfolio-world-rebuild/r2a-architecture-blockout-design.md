# Portfolio World Rebuild — R2A: Architecture + Visual Blockout Design

Date: 2026-09-26
Role: Game Environment Architect / Phaser Technical Planner. No production code or production art was created.

## Starting Point

Branch `feature/portfolio-world-rebuild-v2`. Human Gate 1 approved: `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, `02_SKILL_STACK.md`, `03_REBUILD_WORKFLOW.md`, `90_DECISIONS.md` are the production contract and were not reinterpreted or weakened in this phase.

## Skill Activation

`node tools/agent-skills/sync-skills.mjs` (dry run) mapped exactly the 9 intended skills (`environment-art`, `create-game-assets`, `game-setup-and-config`, `scenes`, `cameras`, `loading-assets`, `sprites-and-images`, `input-keyboard-mouse-touch`, `portfolio-world-visual-qa`) into `.claude/skills/` and `.codex/skills/`, with no unintended source repo installed wholesale. `--write` was then run and the files confirmed on disk.

**Discovery check (per the brief's explicit instruction not to silently pretend a skill was used)**: this session's own `Skill` tool was invoked directly against `environment-art` and `portfolio-world-visual-qa` immediately after materialization. Both returned `Unknown skill: <name>`. This confirms the copy step is correct but this running session's skill listing is fixed at session start and does not hot-reload from a filesystem write mid-session — live discovery needs a fresh Claude Code/Codex session started in this repository. All R2A design decisions below that draw on `environment-art`, `create-game-assets`, the official Phaser skills, or `portfolio-world-visual-qa` were produced by **reading their vendored `SKILL.md`/reference files directly** (Read tool), not by a live Skill-tool invocation. Recorded in `90_DECISIONS.md` as an open item for whoever runs R2B.

## Architecture Documents Created

- `docs/portfolio-world-rebuild/04_ARCHITECTURE_V2.md`
- `docs/portfolio-world-rebuild/05_HARBOR_BLOCKOUT_SPEC.md`
- `docs/portfolio-world-rebuild/06_SCALE_CAMERA_CALIBRATION_PLAN.md`
- `docs/portfolio-world-rebuild/07_RUNTIME_QA_PLAN.md`

Plus updates to `90_DECISIONS.md`, `91_STATUS.md`, `92_HANDOFF.md`, and `.gitignore` (excluding the materialized `.claude/skills/`/`.codex/skills/` copies from tracking — source of truth stays `tools/agent-skills/`).

## Three Macro-Layout Candidates (full detail: `05_HARBOR_BLOCKOUT_SPEC.md`)

- **A — Crescent Harbor**: one enclosed crescent basin; settlement wraps the inner arc; Harbor Square set back at the arc's midpoint; Hero Ship at a pier on the diagonal sightline from the square; four destinations strung unevenly along the arc.
- **B — Twin Basin Peninsula**: an off-center peninsula splits the water into an unequal working basin and quiet cove; Exhibition Hall sits on the peninsula itself; Hero Ship berths at the peninsula's tip (the single strongest ship-as-landmark composition of the three).
- **C — Single Sweep Waterfront**: one long curving waterfront with the settlement spine parallel to it; a working cove interrupts the sweep; Hero Ship at a "grand quay" a third of the way along.

## Selected Layout

**Candidate A, "Crescent Harbor."** It was the only candidate that scored well on every evaluated criterion (harbor first-read, Hero Ship prominence, asymmetry, wayfinding, portfolio navigation, visual balance, negative space, future scalability) without a serious offsetting risk. B has the strongest single Hero Ship moment but the highest first-blockout complexity and a real risk of repeating v1's "thin water strip" mistake across two basins instead of one. C is simplest and safest for wayfinding but under-delivers on the brief's explicit demand that water be a major, *enclosing* element rather than an edge. Both rejected candidates are recorded, not discarded — B as a later-expansion idea, C as a fallback.

## Hero Ship Placement Concept

Berthed at a pier extending from the crescent's inner curve, positioned on the diagonal sightline from Harbor Square (roughly a rule-of-thirds placement, not centered), with open negative water space visible beyond it. Chosen over a foreground-side placement (rejected: reads as "parked next to the map") and an off-center berth with no diagonal relationship (rejected: loses a free leading-line composition value).

## First Representative Destination

**Exhibition Hall** — evaluated against all four, not defaulted to the brief's own suggestion. It sits nearest the Hero Ship's pier in Candidate A, so one blockout view validates Harbor Square, the waterfront, the Hero Ship, and a destination-building relationship simultaneously; its "clean/elegant" identity is also the least texturally demanding of the four for a flat-shape blockout stage. Guild Hall (weakest water relationship), Workshop (secondary-tier), and Academy (deliberately furthest from water in Candidate A) were each considered and rejected for this specific first-test role.

## Camera Test Matrix (full detail: `06_SCALE_CAMERA_CALIBRATION_PLAN.md`)

Three candidate elevations to render against Candidate A's actual composition, none adopted by default: **Low (~10°)** — risks the water plane collapsing thin; **Mid (~15°)** — v1's historical value, tested as a comparison baseline only; **High (~22–25°)** — risks facade readability. Five acceptance questions (facade readability, hull+deck readability, water presence, player readability, destination-approach clarity) decide the winner from the render, not from this document.

## Scale Calibration Method

Qualitative judgment first, a number only after: render Player + Bench + Door + Lamp + Hero Ship + Medium Vessel + Small Boat + destination building + dock width together at the normal gameplay camera, open and inspect the actual screenshot, apply the squint test, then answer four fixed questions (does the Hero Ship feel major without erasing buildings; does a door make human scale obvious; does pavement read as texture not blocks; do small boats read as small craft). Two required screenshots specified (a door/bench/lamp frame; a harbor-scale frame with Hero Ship + Medium Vessel + Small Boat together), both at a fixed, reproducible camera state.

## Proposed V2 Source/Output Paths

`portfolio-world-v2/` (source) → `world-v2/` (committed Pages artifact) — verified against v1's actual `portfolio-world/vite.config.ts` (`base: "/MyPage/world/"`, `outDir: "../world"`) and root `index.html`'s existing relative link to `world/`, not proposed blind. No root `package.json`; root `index.html` untouched by this proposal. Neither directory was created in R2A.

## Runtime QA Harness Plan

Project-owned (not the removed third-party script). Minimum check goals: page boot, canvas existence, active scene, zero console errors, zero asset-load failures, fixed-viewport capture, stable screenshot path, restorable world-coordinate/camera state. Explicitly functional-only — visual judgment stays with `portfolio-world-visual-qa`. Full detail and the 4-screenshot / 6-condition blockout PASS contract: `07_RUNTIME_QA_PLAN.md`.

## Files Changed

New: `docs/portfolio-world-rebuild/{04_ARCHITECTURE_V2,05_HARBOR_BLOCKOUT_SPEC,06_SCALE_CAMERA_CALIBRATION_PLAN,07_RUNTIME_QA_PLAN}.md`, this report. Modified: `docs/portfolio-world-rebuild/{90_DECISIONS,91_STATUS,92_HANDOFF}.md`, `.gitignore`. Materialized-but-gitignored: `.claude/skills/`, `.codex/skills/`. No file under `portfolio-world/**`, `world/**`, or any other pre-existing runtime path was touched.

## Architecture Gate Self-Check

The four new documents answer WHERE (`04`), WHAT-IT-LOOKS-LIKE (`05`), WHAT-TO-TEST (`06`), and WHAT-COUNTS-AS-PASS (`07`) without specifying exact production pixels, per the R2A brief's own framing. No production code, no production art, no `portfolio-world-v2/`/`world-v2/` directory exists yet.

## Next Gate

```text
READY_FOR_R2B_BLOCKOUT_IMPLEMENTATION
```
