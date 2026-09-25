# 92. Portfolio World Rebuild — Handoff

Updated: 2026-09-25

## State

**PHASE R0 (Skill Qualification) and PHASE R1 (Visual Brief + Skill Foundation) are COMPLETE.** No runtime, asset, or v1 file was created or modified by either phase. `feature/portfolio-world-concept-vertical-slice` (v1's full history) is untouched and preserved as reference.

```text
R0_SKILL_QUALIFICATION = COMPLETE
R1_VISUAL_BRIEF         = DRAFT — AWAITING_HUMAN_GATE_1
R1_ART_BIBLE            = DRAFT — AWAITING_HUMAN_GATE_1
R1_SKILL_STACK          = PREPARED, project-local, not yet activated into .claude/skills or .codex/skills
NEXT                    = HUMAN_GATE_1
GATE                    = READY_FOR_REBUILD_VISUAL_BRIEF_HUMAN_REVIEW
```

## What R1 Actually Changed

New files only, all under three new trees:

- `docs/portfolio-world-rebuild/` — 7 canonical docs (`00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, `02_SKILL_STACK.md`, `03_REBUILD_WORKFLOW.md`, `90_DECISIONS.md`, `91_STATUS.md`, `92_HANDOFF.md`).
- `tools/agent-skills/` — vendored skill sources with per-source `PROVENANCE.md`, one project-authored QA profile, one Node sync script, one top-level README.
- `reports/portfolio-world-rebuild/r1-visual-brief-skill-foundation.md` — this phase's report (in addition to the R0 `skill-qualification-report.md` already on this branch).

## Key Decisions a Reader Needs Before Continuing

1. **v1's cardinal cross layout is not the v2 baseline.** Asymmetry is the default, bounded by a hard navigability requirement (`00_VISUAL_BRIEF.md` §8).
2. **v1's water-contact fix does not carry forward.** Its jagged wave-crest treatment was acceptable under v1's own direction but is explicitly incompatible with v2's sheltered-harbor water rule (`00_VISUAL_BRIEF.md` §11). This is a named example, not an implication that v1's other work is invalid.
3. **No numeric tuning value from v1 is reused.** Camera angle, tile scale, water/vessel parameters are all deliberately unlocked pending native-scale validation against the qualitative rules (`01_ART_BIBLE.md` §9, `90_DECISIONS.md` item 3).
4. **`phaser4-gamedev`'s license status is unresolved** — its vendored skills are reference-only until confirmed (`90_DECISIONS.md` item 1). Do not ship `phaser-playtest/scripts/playtest.mjs` in a release build before this is closed.
5. **The original Concept Image #1 was searched for and not found** anywhere in this repository's history; the written v1 art-direction description is the canonical fallback (`00_VISUAL_BRIEF.md` §2, `90_DECISIONS.md` item 2).
6. **Human review is two gates, not per-asset**, by explicit instruction — see `03_REBUILD_WORKFLOW.md` for why this is safe given the new pre/post validation steps.

## Next Recommended Step

Human Gate 1 review of `00_VISUAL_BRIEF.md` + `01_ART_BIBLE.md`. On approval, proceed to `03_REBUILD_WORKFLOW.md` step 2 (`phaser-architect`). On requested revision, update the two documents in place and re-request Gate 1 — do not start R2 implementation against an unapproved brief.

## Do Not

- Modify `portfolio-world/**`, `world/**`, or any v1 asset/runtime source from this branch.
- Copy a v1 implementation tuning value into `00_VISUAL_BRIEF.md` or `01_ART_BIBLE.md` "to save time" — that is the exact process failure these documents exist to prevent (`00_VISUAL_BRIEF.md` §13).
- Run any vendored skill source's own installer (each pulls in far more than the specifically-vendored skill folders).
