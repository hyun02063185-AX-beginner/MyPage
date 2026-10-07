# Runtime R3 Phase B.1 — Scenic Compositing Parity Repair

## Human-gate failure and root cause

R3 Phase B booted, preserved gameplay, and used the approved prop mix, but failed the Human Visual Gate because its scenic presentation diverged visibly from Static C3. `CanonicalRuntimeR3Scene.drawScenic()` had created four fully opaque `Graphics.fillRect()` colour bands, while runtime did not load the approved C3 scenic composite. Five near-opaque R2 berth water images further imposed hard polygon/diagonal boundaries above the scenic layer.

## Repair

- Promoted the approved scenic-only `scenic-a-final-composite.png` to `canonical-r3/runtime/scenic/` and loaded it as `r3-scenic-a-final-composite`.
- Removed the multi-`fillRect` scenic colour stack and all R2 berth-image overlays from R3.
- Kept a neutral, hidden deep-coastal fallback beneath the C3 composite only for impossible alpha gaps.
- Replaced dynamic water with one full-world R2 water texture at `0.065 ± 0.01` alpha. It supplies subtle movement only; Static C3 supplies water colour, sea-to-harbor transition, cliffs, and coverage.
- No geometry, Foundation Master B, buildings, ships, fountain, props, camera, player, interaction, route, or collision change was made.

## Actual-browser QA

Level-A built/dev-browser captures were opened for the overview and the before/after comparison. The cyan bands and diagonal outer-water edge are removed. The Hall, Hero Ship, Workshop, and Office hierarchy remains intact, while the scenic composite restores the left/lower cliff continuation and lighthouse coast. Browser console was clean.

The remaining difference from Static C3 is limited to a slightly cooler, lower-contrast lower-harbor water read caused by live Foundation/ship transparency and the deliberately very-low dynamic overlay. It is not a hard seam, crop edge, or cyan geometry.

## Regression and gate

- `npm run typecheck`, `npm run build`, and `npm test` pass.
- New regression assertions require the C3 composite key, prohibit `fillRect`/`fillPoints` in the R3 scenic path, prohibit the five berth overlays in R3, retain Foundation B, preserve P1–P8 geometry, Fountain B vector collision, approved props, routes A–D, and four visitable points.

Evidence: [runtime-r31-scenic-parity-repair](evidence/runtime-r31-scenic-parity-repair/).

`READY_FOR_R3_1_ACTUAL_RUNTIME_HUMAN_VISUAL_GATE`
