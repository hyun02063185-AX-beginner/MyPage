# Runtime R2 — Canonical Core Visual Integration

## Purpose and preservation

R2 introduces `CanonicalRuntimeR2Scene` behind `?canonical=2`; `?canonical=1` remains the untouched R1 reference. R2 copies the approved 1920×1080 world, 1280×720 viewport, P1–P8 anchors, four visitable points, walkable/water/obstacle polygons, two-level topology, player footprint, and camera values from R1. Art is not used as collision.

## Runtime architecture and asset mapping

All runtime-consumed files are explicit copies under `portfolio-world/public/assets/canonical-r2/`; the scene never loads evidence files.

| Runtime family | Selected source / implementation |
| --- | --- |
| Hall / Workshop / Office | Hall-B, Workshop-C, Office-B at locked placement and size |
| Fleet | Hero-B, Secondary-B, Workboat-A at locked placement and size |
| Foundation | F1 paving, F2 quay, F3 edge, F4 stairs, F5 retaining wall, F6 gangway |
| Water | W1 as two bounded, very-low-speed tiled layers over vector water zones |
| Player | `player-a.png`, generated transparent 28×56 temporary visual baseline |

Foundation is modular: bounded `TileSprite` envelopes, separate retaining-wall face/cap/shadow, discrete stairs and gangway, and separately drawn water contacts. Phaser 4 WebGL rejected legacy `setMask` geometry masks, so R2 uses bounded modular envelopes rather than a masked scene plate. Collision remains R1 vector geometry.

## Depth and player

The order implements L0–L8: scenery, water, foundation, architecture, support fleet, player, front props, Hero foreground, and UI. Player depth remains `50 + ground-anchor-y / 1000`. Hero-B uses separate hull-water contact, gangway, and a source-preserving foreground crop. This is a baseline semantic split, not a claim of complete rigging extraction. The blue rectangle is removed; player-a is not final character approval.

## Runtime QA and evidence status

An actual Phaser R2 P1 gameplay render was opened in Chrome at native runtime scale. It showed Workshop, Office, low-energy turquoise berth treatment, contact shadows, paving modules, player silhouette, and the `[E] Workshop` prompt. The legacy-mask warning was corrected before the subsequent check. This is a runtime-boot observation only, not a final visual approval.

The browser canvas export helper still produces black PNGs in this Chrome / Phaser WebGL capture path. Four downloads were opened, inspected, and rejected; they are not copied to the repository. Thus none of the required R2 evidence files exists, and no comparison composite was created.

## R1 evidence debt and regression record

| Item | Result |
| --- | --- |
| Route A: P1 → P2 → P8 → P4 → P5 → P6 | PENDING actual runtime traversal |
| Route B: P1 → P2 → P8 → P3 → P7 | PENDING actual runtime traversal |
| Route C: P6 → P5 → P4 → P8 → P1 | PENDING actual runtime traversal |
| Route D: P7 → P3 → P8 → P2 | PENDING actual runtime traversal |
| Collision | R1 vector geometry unchanged; prior R1 result remains VERIFIED |
| Interactions | R1 prompt/event contract preserved by source review and boot check |
| Camera | R1 follow, bounds, zoom, deadzone, and overview contract preserved |

The supplied R1 human playtest stays recorded as PASS for player movement, camera feel, fixed player scale, and general traversal. It does not substitute for outstanding A–D actual traversal records.

## Skills used

- `environment-art`: hierarchy, modular-family treatment, retaining wall and harbor-composition review.
- `create-game-assets`: selected-source provenance, normalization, and the temporary player baseline (built-in generation, one candidate).
- `portfolio-world-visual-qa`: real canvas inspection, Visual Brief comparison, and rejection of black exports as non-evidence.
- Phaser scenes, sprites/images, and cameras guidance: separate lifecycle, explicit loading, depth, fixed player display size, and R1 camera preservation.

## Remaining gap and recommendation

The largest remaining gap is a reliable persisted Phaser canvas capture pipeline, followed by human inspection of the modular-envelope seams and Hero-B foreground split. Do not advance to R3. Repair/export evidence, perform A–D runtime traversal, then present R2 to the human visual gate.

```text
RUNTIME_R2_CORE_VISUAL = COMPLETE_PENDING_EVIDENCE
FOUNDATION_RUNTIME = IMPLEMENTED
WATER_RUNTIME = IMPLEMENTED
LANDMARK_RUNTIME = IMPLEMENTED
FLEET_RUNTIME = IMPLEMENTED
HERO_DEPTH_BASELINE = IMPLEMENTED
PLAYER_RECTANGLE_PLACEHOLDER = REMOVED
PLAYER_R2_BASELINE = IMPLEMENTED
R1_FUNCTIONAL_REGRESSION = PENDING_ACTUAL_ROUTE_REPLAY
RUNTIME_R3 = BLOCKED
NEXT = R1_EVIDENCE_DEBT_REPAIR_AND_RUNTIME_R2_HUMAN_VISUAL_GATE
GATE = NOT_READY_FOR_RUNTIME_R2_HUMAN_VISUAL_GATE
```
