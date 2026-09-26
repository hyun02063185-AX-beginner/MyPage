# 91. Portfolio World Rebuild — Project Status

Updated: 2026-09-26 (R2D)

## Phase

PORTFOLIO WORLD REBUILD — R0/R1/R1.1 COMPLETE; HUMAN GATE 1 = APPROVED; R2A/R2A.1 COMPLETE; R2B BLOCKOUT IMPLEMENTATION COMPLETE; R2C INDEPENDENT VISUAL QA COMPLETE; R2D BLOCKOUT REPAIR IMPLEMENTED — AWAITING INDEPENDENT RECHECK

```text
R0_SKILL_QUALIFICATION   = COMPLETE
HUMAN_GATE_1             = APPROVED
R2A_ARCHITECTURE         = COMPLETE
R2A_1_LAYOUT_CORRECTION  = COMPLETE
R2A_BLOCKOUT_SPEC        = COMPLETE — Candidate A+ "Crescent Harbor with Hero Quay" selected (supersedes Candidate A)
R2A_CALIBRATION_PLAN     = COMPLETE — camera terminology corrected (illustrated projection elevation, not a Phaser camera property)
R2A_RUNTIME_QA_PLAN      = COMPLETE — Blockout PASS conditions expanded to 8
R2B_BLOCKOUT_RUNTIME     = COMPLETE — isolated Candidate A+ Graphics blockout in portfolio-world-v2/ and world-v2/
R2B_FUNCTIONAL_QA        = COMPLETE — dev + build fixed-viewport harness clean; deterministic evidence captured
R2B_VISUAL_QA            = COMPLETE — independent R2C review; 3/8 conditions carry a Major failure
R2D_BLOCKOUT_REPAIR      = IMPLEMENTED — junction separation, door/player scale fix, widened projection variants; dev + build functional QA clean
R2D_VISUAL_QA            = NOT DONE — no Visual PASS claimed by the implementer
NEXT                     = R2D_INDEPENDENT_RECHECK
GATE                     = READY_FOR_R2D_INDEPENDENT_RECHECK
```

## Current Work Unit (R2D)

R2D repaired the three R2C Majors without redesigning Candidate A+ (`reports/portfolio-world-rebuild/r2d-blockout-repair.md`):

1. **Junctions** — branch origins are now spine vertices in shared route constants. Order: working dock -> Guild stub -> Harbor Square (moved west, a widening on the spine) -> Academy branch (275 px past the Square) -> Exhibition Hall -> Hero Quay. Guild->Academy origin gap 386 -> 555 px; Academy origin no longer touches the Square.
2. **Door/player** — door 38 x 68 px (~1.26x the 54 px player), fixed; player stands beside it on the same ground line in the `scale` state.
3. **Projection** — LOW/MID/HIGH exchange facade/hull side for roof/deck top plane on the hall, Hero Ship and quay; pixel change vs R2B rose from <1% to 2–4% (Level C only).

Also fixed: the drawn route was not walkable through the basin edge in R2B; corridors now derive from the route constants. Harness gained `--set <phase>` (default `r2d`, `r2b` protected).

Evidence: `reports/portfolio-world-rebuild/evidence/r2d/` (7 PNGs, 1280 x 720, build-mode run, all opened). Functional QA: typecheck, build, dev QA, build QA all pass. **No Visual PASS.** Independent CC recheck owns whether the layout now reads as a spine with branches, whether the door reads as a human doorway, and whether the variants are judgeable.

## Prior Work Unit (R2C)

R2C performed independent visual QA of the R2B blockout evidence (`reports/portfolio-world-rebuild/r2c-independent-blockout-visual-qa.md`). All seven evidence PNGs were opened and inspected. Result: 5 of 8 Blockout PASS conditions pass or partially pass; **3 carry a documented Major failure** —

- Condition 3 (Harbor Square not the geometric center) and condition 4 (destinations not cardinal/quadrant around the square): the four destination branches converge on one small junction cluster and fan out in four compass-like directions (Academy N/NE, Guild Hall NW, Workshop SW, Exhibition E) — the same perceptual pattern the R2A.1 correction was written to eliminate from the original Candidate A.
- Condition 7 (player/building/vessel scale): the `D-scale-calibration.png` capture shows the player sprite overlapping the Exhibition Hall door placeholder, and the visible door height reads as roughly 2–3x the player's height rather than a human-scaled doorway.

The Low/Mid/High illustrated-projection comparison also produced no visually differentiable evidence (pixel diff <1% in every pairwise comparison) — recorded as `NO_VARIANT_READY`.

**Final Gate: `NEEDS_R2B_BLOCKOUT_REPAIR`.** Smallest recommended scope: separate the destination-branch junctions further along the spine; fix the door/player overlap and door proportion in the scale-calibration capture; widen the projection-elevation delta enough to be judgeable. This does not reopen the Candidate A+ layout decision itself — only its current numeric implementation.

## Prior Work Unit (R2B)

R2B created the first v2 runtime without touching v1: `portfolio-world-v2/` is the source project and `world-v2/` is its committed Pages artifact. It implements Candidate A+ as a flat-shape, one-basin harbor blockout with a bent walking spine, off-center Harbor Square, Exhibition Hall mass, Hero Quay/ship relationship, calibration placeholders, WASD/arrow movement, and simple main-basin exclusion.

The project-owned Node/CDP Edge harness now captures fixed 1280 × 720 dev and built-preview evidence at deterministic entry, overview, Hero Quay, scale, and low/mid/high projection states. Canvas, `WorldScene`, console/exception, and failed-request checks are clean. Required screenshots are in `reports/portfolio-world-rebuild/evidence/r2b/` and the implementation report is `reports/portfolio-world-rebuild/r2b-blockout-implementation.md`.

R2B opened the captures during implementation but did not grant `VISUAL_PASS` — R2C (above) is that independent judgment.

## Prior Work Unit (R2A.1)

R2A.1 (Director Layout Correction) corrected four design contradictions found in R2A, on `feature/portfolio-world-rebuild-v2`, still ahead of any runtime creation. No runtime, asset, or v1 file was touched.

Corrections made:
1. **Hidden cardinal-layout risk fixed.** R2A's Candidate A, despite being a crescent, still placed the four destinations at roughly north/west/south-east/south-west *of Harbor Square* — a quadrant structure with the square as an implicit center. Corrected to **Candidate A+ "Crescent Harbor with Hero Quay"** (`05_HARBOR_BLOCKOUT_SPEC.md` §4): Harbor Square is now explicitly off-center, on the settlement's walking spine, not a hub; every destination is placed relative to the spine/basin/quay/another destination's branch, never relative to a compass direction from the square.
2. **Hero Ship anchoring strengthened.** Imported Candidate B's single best property (ship anchored to real land/water geometry) without adopting B's twin-basin structure: the Hero Ship now berths at an asymmetrical quay/pier tongue, not merely "on a diagonal sightline" (`05_HARBOR_BLOCKOUT_SPEC.md` §5).
3. **Camera terminology corrected.** "Camera elevation" was imprecise — renamed to **illustrated projection / asset view elevation**, an illustration-grammar choice, not a Phaser runtime camera property. The Phaser runtime camera stays a 2D orthographic canvas camera at every candidate (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §1).
4. **Blockout/calibration scope mismatch resolved.** The Scale Calibration Plan required reference elements (Bench, Lamp, Door, Medium Vessel, Small Boat, paving) the original blockout scope never included. Added as explicit **calibration placeholders** — simple flat shapes, not production assets (`05_HARBOR_BLOCKOUT_SPEC.md` §8).

Blockout PASS conditions (`07_RUNTIME_QA_PLAN.md` §2) expanded from 6 to 8 to make the "square is not the center" and "destinations are not organized cardinally" checks explicit rather than implicit in the old "not a cardinal cross" wording.

Files updated: `05_HARBOR_BLOCKOUT_SPEC.md`, `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, `07_RUNTIME_QA_PLAN.md`, `90_DECISIONS.md`, `91_STATUS.md` (this file), `92_HANDOFF.md`. `04_ARCHITECTURE_V2.md` required no change (checked — no camera-terminology or layout claim in it needed correction). New: `reports/portfolio-world-rebuild/r2a1-director-layout-correction.md`.

## Next

Independent R2D recheck (not self-graded): open all seven `evidence/r2d/` frames, judge Blockout PASS conditions 3, 4 and 7 and the LOW/MID/HIGH comparison against `00_VISUAL_BRIEF.md`, and only then decide whether to proceed to `READY_FOR_REPRESENTATIVE_VISUAL_TARGET`.
