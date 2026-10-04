# Gate C — Supporting Fleet + Foundation Visual Integration

## Outcome

Gate C's visual-analysis package is complete. It supplies normalized fleet candidates, reusable foundation modules, and static integration evidence at the existing Blueprint coordinates. This is not a Phaser or Graybox change: no runtime code, collision, navigation, topology, canonical target, or locked Landmark asset was edited.

The static recommendation is **Secondary-B** and **Workboat-A**. Both remain `PENDING_HUMAN`; this report does not silently promote them to canonical selections.

## Sources and method

- Canonical visual target: `docs/portfolio-world-rebuild/00_VISUAL_BRIEF.md`
- Machine-readable placement/zone source: `data/portfolio-world/canonical-target-implementation-blueprint.json`
- Composition reference: `evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png`
- Locked assets retained without modification: Hall-B, Workshop-C, Hero-B.

The `environment-art` skill kept the foundation as a layered, tileable/separable family rather than a flattened scene. `create-game-assets` guided transparent normalization, native-scale comparison boards, and the Tier 1/2/3 hierarchy check. `portfolio-world-visual-qa` guided the static comparison, geometry-overlay, player-route, and native-scale reviews. Fleet sources were created with built-in image generation and normalized to target transparent canvases; foundation sources are hand-authored deterministic modules. No direct image API was used, so direct-API availability is unverified.

## Supporting fleet

| Candidate | Bound / target placement | Read | Score | Result |
|---|---:|---|---:|---|
| Secondary-A | 275×255 / (1045, 240) | Tall, ornate, and too close to Hero-B's visual weight. | 18/30 | Keep as alternate |
| **Secondary-B** | **275×255 / (1045, 240)** | Broad, lower hull and clearest Tier-2 read below Hero-B. | **25/30** | **Recommended; pending human** |
| Secondary-C | 275×255 / (1045, 240) | Strong material match, but its mast grouping competes with the hero. | 21/30 | Keep as alternate |
| **Workboat-A** | **140×75 / (1140, 470)** | Smallest, most legible utility silhouette; reads Tier 3. | **27/30** | **Recommended; pending human** |
| Workboat-B | 140×75 / (1140, 470) | Attractive cargo detail, marginally busier at target size. | 24/30 | Keep as alternate |
| Workboat-C | 140×75 / (1140, 470) | Canopy pulls focus above its intended tier. | 22/30 | Keep as alternate |

Both selected-size canvases record an explicit visual water-contact baseline: secondary `(137.5, 255)` within its 275×255 canvas and workboat `(70, 75)` within its 140×75 canvas. These are visual anchors only, not collision bodies.

The hierarchy remains deliberate: Hero-B is Tier 1 at 595×685, Secondary-B is Tier 2 at 275×255, and Workboat-A is Tier 3 at 140×75. The player marker stays fixed at 56 px, without perspective scaling, at the Blueprint anchors P1, P5, P6, and P7.

## Foundation family

| Family | Direction and use |
|---|---|
| F1 Fine limestone paving | Repeating, warm pale paving for Hall Plaza and Lower Plaza. |
| F2 Quay surface | Larger, quieter stone module for Central Quay and Hero Quay. |
| F3 Quay / water edge | Separate vertical facing; preserves a readable shore edge. |
| F4 Main stairs | Short stair connector at the existing P4 transition. |
| F5 Retaining wall | Reusable elevation edge rather than baked ground shading. |
| F6 Gangway access | Separate mooring/gangway support at Hero-B. |
| W1 Sheltered turquoise water | Reusable gentle-ripple direction tile; it communicates enclosed harbor water, not open-sea waves. |

The integration board uses the existing foundation polygons: Hall Plaza and Lower Plaza are paved; Central and Hero Quays are quiet stone; the inner harbor, hero berth, secondary berth, and workboat berth retain distinct water zones. Asset files are individual transparent modules—not a whole-scene plate—and contain no collision or traversal data.

## Visual evidence and QA

- [Secondary ship native-scale comparison](evidence/gate-c-foundation-fleet/fleet/secondary-candidate-sheet.png)
- [Small workboat native-scale comparison](evidence/gate-c-foundation-fleet/workboats/small-boat-candidate-sheet.png)
- [Foundation module family](evidence/gate-c-foundation-fleet/foundation/foundation-module-sheet.png)
- [Full 1920×1080 integration board](evidence/gate-c-foundation-fleet/integration/03-full-integration-board.png)
- [Canonical target vs. integration board](evidence/gate-c-foundation-fleet/integration/04-canonical-side-by-side.png)
- [Asset bounds and foundation/water geometry overlay](evidence/gate-c-foundation-fleet/integration/05-canonical-geometry-overlay.png)
- [Fixed-56px player route review](evidence/gate-c-foundation-fleet/integration/06-player-route-review.png)

Static review findings:

- All Landmark, fleet, and player placements use the Blueprint board coordinates; the overlay makes those bounds and zone polygons inspectable.
- Secondary-B and Workboat-A remain subordinate to Hero-B at native size.
- P1/P5/P6/P7 remain readable at fixed 56 px. The route board is evidence only; it changes neither routes nor navigation.
- Foundation/water boundaries are readable without introducing a broad open-water treatment.

## Runtime feasibility and risks

The intended runtime decomposition is planned only: secondary ship = hull, mast/rigging, deck detail, water contact; workboat = hull, cargo/oars, water contact; foundation = discrete paving, quay, edge, stair, retaining, gangway, and water layers. This preserves later depth sorting, collision ownership, and water exclusion decisions instead of baking them into art.

Main risks for human review are (1) whether Secondary-B's rigging is still too detailed against the Hero-B silhouette, (2) whether Workboat-A needs more local harbor color after runtime lighting is known, and (3) the exact module tiling/edge cadence once the runtime renderer is implemented. None justify changing the approved topology or entering runtime rebuild before Gate C approval.

## Gate

```text
GATE_A_LANDMARK_SELECTION = APPROVED
GATE_B_LANDMARK_CALIBRATION = APPROVED
GATE_C_ANALYSIS = COMPLETE
SUPPORTING_FLEET_SELECTION = PENDING_HUMAN
FOUNDATION_VISUAL_APPROVAL = PENDING_HUMAN
RUNTIME_REBUILD = BLOCKED
NEXT = GATE_C_FOUNDATION_FLEET_HUMAN_REVIEW
GATE = READY_FOR_GATE_C_HUMAN_REVIEW
```
