# R4 — Golden Master representative runtime vertical slice

## Canonical reference

`world.reference.golden-master.r4` is the user-supplied Leonardo image recorded in `portfolio-world-v2/public/assets/world/reference/golden-master-r4-provenance.md`. It is the only R4 visual reference. Other provider benchmarks remain historical evidence and were not used as a substitute.

## Production choice

R4 uses **scene plate + authored interaction layers**. The Golden Master preserves the required integrated harbor composition; Phaser provides a separate player, route constraints, water/structure exclusion, foreground cargo occlusion, keyboard/pointer movement, Exhibition Hall hotspot, and deterministic QA states. This is not a free-walk-on-background implementation.

## Slice

Harbor Square → Exhibition Hall → Hero Quay → Hero Ship. The player is constrained to mapped plaza, hall-approach, quay, and dock-apron regions. `E` activates the Exhibition Hall portfolio hotspot; pointer drag supplies the same movement intent abstraction for touch-oriented input.

## Functional evidence

`npm run typecheck`, `npm run build`, and the build-mode R4 harness passed. The harness verifies each capture reaches `WorldScene`, produces no browser errors, has the intended camera/player state, reports all three route checks, and activates the deterministic Exhibition Hall hotspot state.

Evidence: `reports/portfolio-world-rebuild/evidence/r4/`.

## R4.2 closeout

R4.2 keeps the locked Golden Master and scene-plate method unchanged. The player anchors were corrected against visible ground in the plate: plaza route anchor `(825,540)`, Hero Quay `(1390,735)`, and Exhibition Hall stair landing/hotspot `(705,410)`. The approved R4.1 player source remains preserved; a separate muted local derivative and two-layer warm contact shadow reduce sticker-like contrast while retaining alpha, silhouette, collision, input, cargo occlusion, and camera-bound behavior.

Final evidence is `reports/portfolio-world-rebuild/evidence/r4-2/`. Typecheck, build, build-mode QA, dev-mode QA, walkability/collision mapping, hotspot activation, and browser/console checks passed. Human Gate 2 is approved.

## Historical R4 gate

`FUNCTIONAL_PASS`; `VISUAL_REVIEW_REQUIRED`. The implementation does not self-grant Visual PASS or Human Gate 2. Review the R4 screenshots against the Golden Master contract before escalation.
