# 91. Portfolio World Rebuild — Project Status

Updated: 2026-09-26

## Phase

PORTFOLIO WORLD REBUILD — PHASE R0 COMPLETE; PHASE R1 COMPLETE; PHASE R1.1 COMPLETE; HUMAN GATE 1 = APPROVED; PHASE R2A (ARCHITECTURE + VISUAL BLOCKOUT DESIGN) COMPLETE

```text
R0_SKILL_QUALIFICATION   = COMPLETE
R1_VISUAL_BRIEF          = APPROVED (Human Gate 1)
R1_ART_BIBLE             = APPROVED (Human Gate 1)
R1_1_SKILL_STACK         = CORRECTED
HUMAN_GATE_1             = APPROVED
R2A_ARCHITECTURE         = COMPLETE
R2A_BLOCKOUT_SPEC        = COMPLETE — Candidate A "Crescent Harbor" selected
R2A_CALIBRATION_PLAN     = COMPLETE
R2A_RUNTIME_QA_PLAN      = COMPLETE (plan only, harness not implemented)
R2_RUNTIME               = NOT_STARTED (explicitly out of scope for R2A)
NEXT                     = R2B_BLOCKOUT_IMPLEMENTATION
GATE                     = READY_FOR_R2B_BLOCKOUT_IMPLEMENTATION
```

## Current Work Unit

R2A (Architecture + Visual Blockout Design) is complete on `feature/portfolio-world-rebuild-v2`, following Human Gate 1's approval of `00_VISUAL_BRIEF.md`/`01_ART_BIBLE.md`. No runtime, asset, or v1 file was touched.

Produced:
- `docs/portfolio-world-rebuild/04_ARCHITECTURE_V2.md` — verified (not guessed) v2 source/output paths (`portfolio-world-v2/` → `world-v2/`, mirroring v1's actual `vite.config.ts`/outDir pattern), a minimal 2-scene model, and the depth/layer band list.
- `docs/portfolio-world-rebuild/05_HARBOR_BLOCKOUT_SPEC.md` — three evaluated macro-layout candidates; selected Candidate A "Crescent Harbor"; Hero Ship placement concept; per-destination semantic placement; Exhibition Hall selected (evaluated, not defaulted to) as the first representative destination; the R2B blockout scope.
- `docs/portfolio-world-rebuild/06_SCALE_CAMERA_CALIBRATION_PLAN.md` — a camera-elevation test matrix (not inheriting v1's 15°) and a scale-calibration judging method with required calibration screenshots, none of it locking a number.
- `docs/portfolio-world-rebuild/07_RUNTIME_QA_PLAN.md` — the project-owned functional QA harness plan (check goals, suggested shape) and the visual QA contract for the blockout (4 required screenshots, 6 PASS conditions), explicit that functional PASS ≠ visual PASS.
- `docs/portfolio-world-rebuild/90_DECISIONS.md` — Human Gate 1 approval recorded; skill materialization run and its discovery result recorded honestly (session-local Skill-tool lookup returned `Unknown skill` for the newly-copied skills — files on disk are correct, live discovery needs a fresh session); layout/destination/scene-model decisions recorded; new open items.
- `.gitignore` — `.claude/skills/` and `.codex/skills/` added (materialized skill copies are regeneratable, not a second tracked copy; source of truth stays `tools/agent-skills/`).
- `reports/portfolio-world-rebuild/r2a-architecture-blockout-design.md` — this phase's official report.

`node tools/agent-skills/sync-skills.mjs --write` was run: the dry-run plan mapped exactly the 9 intended skills with no unintended copy, so `--write` was executed. The skills exist correctly on disk in `.claude/skills/` and `.codex/skills/` but were **not** discovered by this session's own Skill tool (tested directly: `Unknown skill` for both `environment-art` and `portfolio-world-visual-qa`) — recorded as an open item, not glossed over.

## Next

R2B: implement the visual blockout per `05_HARBOR_BLOCKOUT_SPEC.md` §7, using `04_ARCHITECTURE_V2.md`'s scene/path proposal, tested against `06_SCALE_CAMERA_CALIBRATION_PLAN.md` and `07_RUNTIME_QA_PLAN.md`. This is the first phase permitted to create `portfolio-world-v2/`/`world-v2/`.
