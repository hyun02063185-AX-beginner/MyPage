# 91. Portfolio World Rebuild — Project Status

Updated: 2026-09-26 (R2A.1)

## Phase

PORTFOLIO WORLD REBUILD — R0/R1/R1.1 COMPLETE; HUMAN GATE 1 = APPROVED; R2A COMPLETE; R2A.1 (DIRECTOR LAYOUT CORRECTION) COMPLETE

```text
R0_SKILL_QUALIFICATION   = COMPLETE
HUMAN_GATE_1             = APPROVED
R2A_ARCHITECTURE         = COMPLETE
R2A_1_LAYOUT_CORRECTION  = COMPLETE
R2A_BLOCKOUT_SPEC        = COMPLETE — Candidate A+ "Crescent Harbor with Hero Quay" selected (supersedes Candidate A)
R2A_CALIBRATION_PLAN     = COMPLETE — camera terminology corrected (illustrated projection elevation, not a Phaser camera property)
R2A_RUNTIME_QA_PLAN      = COMPLETE — Blockout PASS conditions expanded to 8
R2_RUNTIME               = NOT_STARTED (explicitly out of scope through R2A.1)
NEXT                     = R2B_BLOCKOUT_IMPLEMENTATION
GATE                     = READY_FOR_R2B_BLOCKOUT_IMPLEMENTATION
```

## Current Work Unit

R2A.1 (Director Layout Correction) corrected four design contradictions found in R2A, on `feature/portfolio-world-rebuild-v2`, still ahead of any runtime creation. No runtime, asset, or v1 file was touched.

Corrections made:
1. **Hidden cardinal-layout risk fixed.** R2A's Candidate A, despite being a crescent, still placed the four destinations at roughly north/west/south-east/south-west *of Harbor Square* — a quadrant structure with the square as an implicit center. Corrected to **Candidate A+ "Crescent Harbor with Hero Quay"** (`05_HARBOR_BLOCKOUT_SPEC.md` §4): Harbor Square is now explicitly off-center, on the settlement's walking spine, not a hub; every destination is placed relative to the spine/basin/quay/another destination's branch, never relative to a compass direction from the square.
2. **Hero Ship anchoring strengthened.** Imported Candidate B's single best property (ship anchored to real land/water geometry) without adopting B's twin-basin structure: the Hero Ship now berths at an asymmetrical quay/pier tongue, not merely "on a diagonal sightline" (`05_HARBOR_BLOCKOUT_SPEC.md` §5).
3. **Camera terminology corrected.** "Camera elevation" was imprecise — renamed to **illustrated projection / asset view elevation**, an illustration-grammar choice, not a Phaser runtime camera property. The Phaser runtime camera stays a 2D orthographic canvas camera at every candidate (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §1).
4. **Blockout/calibration scope mismatch resolved.** The Scale Calibration Plan required reference elements (Bench, Lamp, Door, Medium Vessel, Small Boat, paving) the original blockout scope never included. Added as explicit **calibration placeholders** — simple flat shapes, not production assets (`05_HARBOR_BLOCKOUT_SPEC.md` §8).

Blockout PASS conditions (`07_RUNTIME_QA_PLAN.md` §2) expanded from 6 to 8 to make the "square is not the center" and "destinations are not organized cardinally" checks explicit rather than implicit in the old "not a cardinal cross" wording.

Files updated: `05_HARBOR_BLOCKOUT_SPEC.md`, `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, `07_RUNTIME_QA_PLAN.md`, `90_DECISIONS.md`, `91_STATUS.md` (this file), `92_HANDOFF.md`. `04_ARCHITECTURE_V2.md` required no change (checked — no camera-terminology or layout claim in it needed correction). New: `reports/portfolio-world-rebuild/r2a1-director-layout-correction.md`.

## Next

R2B: implement the visual blockout per `05_HARBOR_BLOCKOUT_SPEC.md` §8 (Candidate A+, with calibration placeholders), using `04_ARCHITECTURE_V2.md`'s scene/path proposal, tested against `06_SCALE_CAMERA_CALIBRATION_PLAN.md` (corrected terminology) and `07_RUNTIME_QA_PLAN.md` (8-condition PASS contract). This remains the first phase permitted to create `portfolio-world-v2/`/`world-v2/`.
