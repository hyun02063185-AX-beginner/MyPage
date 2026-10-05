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

The R2 point-in-polygon regression was repaired to use the R1 denominator exactly: `(previous[1] - point[1])`. `canonical-r1-r2-geometry-parity.test.mjs` now prevents R1/R2 divergence in `WALKABLE`, `WATER`, `OBSTACLES`, `inside()`, player footprint, and movement vector validation.

Runtime inspection then found a real collision defect: P1, P4, P5, P6, and P7 had been positioned inside their explicit obstacle polygons. The geometry itself was not redesigned. In both R1 and R2, only those anchors moved to the nearest existing valid walkable point, preserving the interaction radius and all collision vectors. The route test validates that every resulting leg remains collision-valid.

The black WebGL `canvas.toDataURL()` path was not used for evidence. Each final capture below is a direct Chrome viewport screenshot of the live `127.0.0.1` Phaser runtime and was opened for visual inspection after writing. The two comparison files use those browser screenshots on the required right/left side; they do not reconstruct the Phaser scene.

| File | Live URL / composition |
| --- | --- |
| `01-workshop-runtime.png` | `?canonical=2&spawn=P1` |
| `02-harbor-office-runtime.png` | `?canonical=2&spawn=P8` |
| `03-hall-runtime.png` | `?canonical=2&spawn=P5` |
| `04-hero-ship-runtime.png` | `?canonical=2&spawn=P7` |
| `05-r2-overview.png` | `?canonical=2&overview=1` |
| `06-r2-debug.png` | `?canonical=2&debug=1` |
| `07-canonical-vs-runtime-r2.png` | Left: approved Canonical Projection A; right: actual R2 overview browser capture |
| `08-r1-vs-r2.png` | Left: actual R1 overview browser capture; right: actual R2 overview browser capture |

## R1 evidence debt and regression record

| Item | Result |
| --- | --- |
| Route A: P1 → P2 → P8 → P4 → P5 → P6 | PASS — collision-valid traversal replay |
| Route B: P1 → P2 → P8 → P3 → P7 | PASS — collision-valid traversal replay |
| Route C: P6 → P5 → P4 → P8 → P1 | PASS — collision-valid traversal replay |
| Route D: P7 → P3 → P8 → P2 | PASS — collision-valid traversal replay |
| Collision | VERIFIED — corrected `inside()` plus valid anchor placement; R1/R2 parity test passes |
| Interactions | PASS — all four visitable interaction anchors remain present; Workshop prompt visible in live captures |
| Camera | PASS — R1 follow, bounds, zoom, deadzone, and overview contract preserved |

The supplied human playtest remains: player movement **PASS**; camera feel **PASS**; fixed-scale movement **PASS**; general traversal **PASS**. This report does not grant human visual-gate approval.

## Skills used

- `environment-art`: hierarchy, modular-family treatment, retaining wall and harbor-composition review.
- `create-game-assets`: selected-source provenance, normalization, and the temporary player baseline (built-in generation, one candidate).
- `portfolio-world-visual-qa`: real canvas inspection, Visual Brief comparison, and rejection of black exports as non-evidence.
- Phaser scenes, sprites/images, and cameras guidance: separate lifecycle, explicit loading, depth, fixed player display size, and R1 camera preservation.

## Gate

All required evidence exists as tracked runtime browser captures. R2 is complete pending the human visual gate only; R3 remains blocked.

```text
R2_GEOMETRY_REGRESSION = FIXED
R1_GEOMETRY_PARITY = VERIFIED
ROUTE_A = PASS
ROUTE_B = PASS
ROUTE_C = PASS
ROUTE_D = PASS
R2_RUNTIME_SCREENSHOTS = COMPLETE
CANONICAL_COMPARISON = COMPLETE
R1_R2_COMPARISON = COMPLETE
RUNTIME_R2 = COMPLETE_PENDING_HUMAN_VISUAL_GATE
FOUNDATION_RUNTIME = IMPLEMENTED
WATER_RUNTIME = IMPLEMENTED
LANDMARK_RUNTIME = IMPLEMENTED
FLEET_RUNTIME = IMPLEMENTED
HERO_DEPTH_BASELINE = IMPLEMENTED
PLAYER_RECTANGLE_PLACEHOLDER = REMOVED
PLAYER_R2_BASELINE = IMPLEMENTED
RUNTIME_R3 = BLOCKED
NEXT = RUNTIME_R2_HUMAN_VISUAL_GATE
GATE = READY_FOR_RUNTIME_R2_HUMAN_VISUAL_GATE
```
