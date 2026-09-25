# Portfolio World Rebuild — R2A.1: Director Layout Correction

Date: 2026-09-26
Role: Director correction pass on R2A's architecture/blockout design. No runtime, asset, or v1 file was created or modified.

## Starting Point

Branch `feature/portfolio-world-rebuild-v2` @ `605bdea` (R2A's completed architecture design). R2A's overall structure is kept; this pass corrects four specific design contradictions identified before Codex begins R2B implementation.

## 1. Changed Layout Concept

R2A's Candidate A ("Crescent Harbor") was correctly asymmetric in *basin shape* but not in *destination placement*: Academy, Guild Hall, Exhibition Hall, and Workshop were still describable as roughly north/west/south-east/south-west *of Harbor Square* — a quadrant structure with the square as an implicit geometric center, the same underlying risk `00_VISUAL_BRIEF.md` §8 exists to prevent, just bent into a curve instead of a cross.

The fix keeps everything that made Candidate A win the original three-way comparison (one continuous crescent basin, strong negative space, simple wayfinding, easy future extension) and does not re-open that comparison or adopt Candidate B's twin-basin structure.

## 2. Updated Candidate A+ Diagram

**"Crescent Harbor with Hero Quay"** (`05_HARBOR_BLOCKOUT_SPEC.md` §4). Structural change: Harbor Square is now explicitly off-center and sits *on* the settlement's walking spine as one node, not a hub four destinations radiate from. Every destination's placement is now described relative to the spine, the basin, the quay, or another destination's branch — never relative to a compass direction from the square. Guild Hall and Academy branch inland at different points and different distances (not mirrored arms of a cross); Workshop sits at the working-dock end of the basin; Exhibition Hall sits on the waterfront side near the quay. `05_HARBOR_BLOCKOUT_SPEC.md` §6 records an explicit check: no two destinations may be mirror-image opposites through Harbor Square, and R2B must re-verify this property when deriving real coordinates, not just at the schematic stage.

## 3. Hero Quay Relationship

Imported Candidate B's single best property — the Hero Ship anchored to unmistakable land/water geometry — without adopting B's twin-basin structure. The ship now berths at or beside an asymmetrical quay/pier tongue jutting from the shoreline near the spine's waterfront end, not merely "on a diagonal sightline from the square" (R2A's original, insufficiently anchored concept). Open water remains visible behind the ship. Masts/sails overlapping land/background visual space is explicitly permitted, per the correction brief §3 — not a defect to avoid.

## 4. Projection Terminology Correction

R2A's `06_SCALE_CAMERA_CALIBRATION_PLAN.md` called its Low/Mid/High test values "camera elevation," implying a Phaser runtime camera transform. Corrected: these are **illustrated projection / asset view elevation** values — an illustration-grammar choice baked into how a building or ship is *drawn* (the same kind of choice the Hybrid Orthographic 2.5D concept already names), not a property applied to the Phaser scene camera at runtime. The document now states explicitly that the Phaser runtime camera is, and remains, a plain 2D orthographic canvas camera with no rotation or perspective simulation at any candidate elevation, and that the test method is a comparison of drawn silhouettes/representative planes, not a camera-side rotation implementation.

## 5. Calibration Placeholders Added

The Scale Calibration Plan (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2) required Player, Bench, Door, Lamp, Hero Ship, Medium Vessel, Small Boat, a destination building, and dock width all in frame — but R2A's original blockout scope named only Hero Ship and Exhibition Hall. `05_HARBOR_BLOCKOUT_SPEC.md` §8 now adds the missing elements as explicit **calibration placeholders**: simple flat shapes/silhouettes/rectangles for Medium Vessel, Small Boat, Bench, Lamp, Door, and a paving reference, each labeled as not-a-production-asset so their appearance is never mistaken for an approved design direction on those categories.

## 6. Blockout PASS Conditions Updated

`07_RUNTIME_QA_PLAN.md` §2's PASS list expanded from 6 to 8 conditions, making explicit what was previously only implicit in "layout is not a cardinal cross": Harbor Square must not look like the world's geometric center (new condition 3), the four destinations must not be organized cardinally/in quadrants around it (new condition 4), and functional-PASS-vs-visual-PASS separation is now its own numbered condition (8) rather than a closing caveat.

## Files Changed

Modified: `docs/portfolio-world-rebuild/{05_HARBOR_BLOCKOUT_SPEC,06_SCALE_CAMERA_CALIBRATION_PLAN,07_RUNTIME_QA_PLAN,90_DECISIONS,91_STATUS,92_HANDOFF}.md`. New: this report. Checked, no change needed: `04_ARCHITECTURE_V2.md` (no camera-terminology or layout-center claim required correction). No file under `portfolio-world/**`, `world/**`, or any other pre-existing runtime path was touched. No `portfolio-world-v2/` or `world-v2/` directory was created.

## Do-Not Compliance

Candidate A was not discarded (kept as the comparison record in `05_HARBOR_BLOCKOUT_SPEC.md` §1–3); Candidate B's twin-basin structure was not adopted (only its ship-anchoring idea was imported); no exact production pixel coordinate was locked; 15° was not re-adopted as a default; no runtime/asset/v1 file was touched.

## Final Gate

```text
READY_FOR_R2B_BLOCKOUT_IMPLEMENTATION
```
