# 92. Portfolio World Rebuild — Handoff

Updated: 2026-09-26

## State

**PHASE R0, R1, R1.1 are COMPLETE. HUMAN GATE 1 = APPROVED. PHASE R2A (Architecture + Visual Blockout Design) is COMPLETE.** No runtime, asset, or v1 file was created or modified by any phase through R2A. `feature/portfolio-world-concept-vertical-slice` (v1's full history) is untouched and preserved as reference.

```text
R0_SKILL_QUALIFICATION = COMPLETE
HUMAN_GATE_1            = APPROVED
R1_1_CORRECTION         = COMPLETE
R2A_ARCHITECTURE        = COMPLETE
NEXT                    = R2B_BLOCKOUT_IMPLEMENTATION
GATE                    = READY_FOR_R2B_BLOCKOUT_IMPLEMENTATION
```

## What R2A Actually Produced

- 4 new architecture/design docs (`04_ARCHITECTURE_V2.md` through `07_RUNTIME_QA_PLAN.md`) — see `91_STATUS.md` for what each contains.
- `90_DECISIONS.md`/`91_STATUS.md`/`92_HANDOFF.md` updated.
- `.gitignore` updated (materialized skill copies excluded from tracking).
- `reports/portfolio-world-rebuild/r2a-architecture-blockout-design.md`.
- **No code, no `portfolio-world-v2/`, no `world-v2/`.** R2A is architecture-and-plan only, per its own Architecture Gate.

## Key Decisions R2B Needs Before Writing Code

1. **Selected macro layout: Candidate A, "Crescent Harbor."** One enclosed crescent basin, Harbor Square set back from its inner arc, Hero Ship at a pier on the diagonal sightline from the square, four destinations strung unevenly along the arc. Not a cardinal cross, not evenly spaced. Full rationale and the two rejected alternatives: `05_HARBOR_BLOCKOUT_SPEC.md`.
2. **First blockout = Harbor Square + basin + waterfront + Hero Ship + Exhibition Hall only.** No other destination, no polished art, flat shapes are correct at this stage (`05_HARBOR_BLOCKOUT_SPEC.md` §7).
3. **Camera elevation is not decided — a 3-point test matrix is** (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §1). Do not default to v1's 15°; render the low/mid/high candidates against Candidate A's actual composition and pick from the render.
4. **Scale is judged qualitatively first, numerically second** — the exact ordering mistake v1 made three times over (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2). Two specific calibration screenshots are required before any size number is treated as final.
5. **v2 source/output = `portfolio-world-v2/` / `world-v2/`**, verified against v1's actual build config, not guessed (`04_ARCHITECTURE_V2.md`). No root `package.json`. Root `index.html`'s link to v1's `world/` is untouched — whether/when `world-v2/` replaces it is a later, separate decision (`90_DECISIONS.md` item 6).
6. **Scene model stays minimal: `BootScene` + `WorldScene`.** Destination pages stay external HTML, reached by leaving the canvas — unless a new requirement says otherwise (`04_ARCHITECTURE_V2.md` §3).
7. **Functional PASS ≠ Visual PASS, structurally.** `07_RUNTIME_QA_PLAN.md` §1 (not yet implemented as code) only proves the game runs. `07_RUNTIME_QA_PLAN.md` §2 + `tools/agent-skills/profiles/portfolio-world-visual-qa/` is the only thing that can grant a visual PASS, against 6 named conditions and 4 required, opened, inspected screenshots.
8. **Vendored skills are materialized on disk (`.claude/skills/`, `.codex/skills/`) but were not discovered by the R2A session's own Skill tool.** Start a fresh Claude Code/Codex session in this repository for live skill discovery, or continue reading the vendored `SKILL.md` files directly as R2A did. These materialized copies are gitignored — edit `tools/agent-skills/{vendor,profiles}/` and re-run `sync-skills.mjs --write`, never the copies directly.

## Next Recommended Step

R2B: implement the blockout. Start from `04_ARCHITECTURE_V2.md` (where/how), `05_HARBOR_BLOCKOUT_SPEC.md` (what it looks like), `06_SCALE_CAMERA_CALIBRATION_PLAN.md` (what to test), `07_RUNTIME_QA_PLAN.md` (what counts as PASS) — these should answer every layout/architecture question R2B would otherwise have to invent.

## Do Not

- Modify `portfolio-world/**`, `world/**`, or any v1 asset/runtime source from this branch.
- Default to v1's numeric values (15° camera, 32px logical unit, any prior tile/water/vessel tuning) — they are historical evidence only, not defaults (`90_DECISIONS.md` item 2).
- Create a root `package.json`, or touch root `index.html`'s existing `world/` link.
- Grant a visual PASS from a functional harness result, a code value, or an unopened screenshot.
- Hand-edit `.claude/skills/`/`.codex/skills/` directly — edit `tools/agent-skills/` and re-sync.
