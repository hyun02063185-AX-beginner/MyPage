# 91. Portfolio World Rebuild — Project Status

Updated: 2026-09-26 (R2B)

## Phase

PORTFOLIO WORLD REBUILD — R0/R1/R1.1 COMPLETE; HUMAN GATE 1 = APPROVED; R2A/R2A.1 COMPLETE; R2B BLOCKOUT IMPLEMENTATION COMPLETE

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
R2B_VISUAL_QA            = NOT_STARTED — functional evidence is not a visual verdict
NEXT                     = R2B_INDEPENDENT_VISUAL_QA
GATE                     = READY_FOR_R2B_INDEPENDENT_VISUAL_QA
```

## Current Work Unit

R2B created the first v2 runtime without touching v1: `portfolio-world-v2/` is the source project and `world-v2/` is its committed Pages artifact. It implements Candidate A+ as a flat-shape, one-basin harbor blockout with a bent walking spine, off-center Harbor Square, Exhibition Hall mass, Hero Quay/ship relationship, calibration placeholders, WASD/arrow movement, and simple main-basin exclusion.

The project-owned Node/CDP Edge harness now captures fixed 1280 × 720 dev and built-preview evidence at deterministic entry, overview, Hero Quay, scale, and low/mid/high projection states. Canvas, `WorldScene`, console/exception, and failed-request checks are clean. Required screenshots are in `reports/portfolio-world-rebuild/evidence/r2b/` and the implementation report is `reports/portfolio-world-rebuild/r2b-blockout-implementation.md`.

The actual captures were opened during implementation, but R2B does **not** grant `VISUAL_PASS`: the next independent visual-QA owner must judge Candidate A+ against the Visual Brief and the eight qualitative conditions in `07_RUNTIME_QA_PLAN.md` §2.

## Prior Work Unit

R2A.1 (Director Layout Correction) corrected four design contradictions found in R2A, on `feature/portfolio-world-rebuild-v2`, still ahead of any runtime creation. No runtime, asset, or v1 file was touched.

Corrections made:
1. **Hidden cardinal-layout risk fixed.** R2A's Candidate A, despite being a crescent, still placed the four destinations at roughly north/west/south-east/south-west *of Harbor Square* — a quadrant structure with the square as an implicit center. Corrected to **Candidate A+ "Crescent Harbor with Hero Quay"** (`05_HARBOR_BLOCKOUT_SPEC.md` §4): Harbor Square is now explicitly off-center, on the settlement's walking spine, not a hub; every destination is placed relative to the spine/basin/quay/another destination's branch, never relative to a compass direction from the square.
2. **Hero Ship anchoring strengthened.** Imported Candidate B's single best property (ship anchored to real land/water geometry) without adopting B's twin-basin structure: the Hero Ship now berths at an asymmetrical quay/pier tongue, not merely "on a diagonal sightline" (`05_HARBOR_BLOCKOUT_SPEC.md` §5).
3. **Camera terminology corrected.** "Camera elevation" was imprecise — renamed to **illustrated projection / asset view elevation**, an illustration-grammar choice, not a Phaser runtime camera property. The Phaser runtime camera stays a 2D orthographic canvas camera at every candidate (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §1).
4. **Blockout/calibration scope mismatch resolved.** The Scale Calibration Plan required reference elements (Bench, Lamp, Door, Medium Vessel, Small Boat, paving) the original blockout scope never included. Added as explicit **calibration placeholders** — simple flat shapes, not production assets (`05_HARBOR_BLOCKOUT_SPEC.md` §8).

Blockout PASS conditions (`07_RUNTIME_QA_PLAN.md` §2) expanded from 6 to 8 to make the "square is not the center" and "destinations are not organized cardinally" checks explicit rather than implicit in the old "not a cardinal cross" wording.

Files updated: `05_HARBOR_BLOCKOUT_SPEC.md`, `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, `07_RUNTIME_QA_PLAN.md`, `90_DECISIONS.md`, `91_STATUS.md` (this file), `92_HANDOFF.md`. `04_ARCHITECTURE_V2.md` required no change (checked — no camera-terminology or layout claim in it needed correction). New: `reports/portfolio-world-rebuild/r2a1-director-layout-correction.md`.

## Next

Run independent R2B visual QA against the actual evidence, `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, and the eight-condition contract in `07_RUNTIME_QA_PLAN.md` §2. Keep its visual verdict separate from the completed functional harness result.
