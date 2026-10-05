# Runtime R2.1 — Foundation Render Architecture Repair

## Outcome

R2.1 replaces R2's visible `TileSprite` foundation and water envelopes with deterministic, cropped RGBA polygon-zone assets. The renderer places transparent images only; it does not use runtime geometry masking, a raster scene plate, bounding-box tile rendering, or raster collision. The approved R1 vector geometry, all P1–P8 interaction points, player footprint, movement validation, camera values, and landmark placements are preserved.

The asset generator is `scripts/portfolio-world/build-r21-foundation-zone-assets.py`. It creates 19 checked-in assets beneath `portfolio-world/public/assets/canonical-r2/`: ten foundation zones, five water zones, and four architectural overlays. Every output is cropped to its polygon, has transparent exterior pixels, and is verified by `canonical-r21-foundation-zones.test.mjs`.

## Render repair

| Concern | R2.1 result |
| --- | --- |
| Hall plaza, lower plaza, central quay, hero quay | Exact transparent polygon assets; no rectangular paving patches |
| Water | Five exact transparent water zones; collision continues to use the unchanged R1 `WATER` polygons |
| Retaining wall, stairs, and quay edges | Separate rendered overlays with locked source geometry; no scene plate |
| Hero | One approved Hero-B image, water contact, and gangway; duplicate foreground crop removed |
| Grounding | Local contact shadows / water contacts only; no oversized oval shadow layer |
| Canonical Amendment 02 | Integrated only for safe anchors: P1 `(443,785)`, P4 `(905,688)`, P5 `(670,453)`, P6 `(505,318)`, P7 `(1405,770)` |

## Runtime verification

The live Phaser scene was captured through Chrome DevTools `Page.captureScreenshot` at `http://127.0.0.1:5173/?canonical=2`; no canvas `toDataURL()` export was used. The debug capture used `?canonical=2&debug=1`. The Chrome console was clean after reload.

| Check | Result |
| --- | --- |
| R1/R2 `WALKABLE`, `WATER`, `OBSTACLES`, `inside()`, player footprint, movement validation | VERIFIED by parity regression test |
| Route A: P1 → P2 → P8 → P4 → P5 → P6 | PASS |
| Route B: P1 → P2 → P8 → P3 → P7 | PASS |
| Route C: P6 → P5 → P4 → P8 → P1 | PASS |
| Route D: P7 → P3 → P8 → P2 | PASS |
| Collision / interactions / camera | VERIFIED / PASS / PASS (R1 behavior preserved) |
| Supplied human traversal playtest | Player movement PASS; camera feel PASS; fixed-scale movement PASS; general traversal PASS |

## Evidence

| File | Live capture / composition |
| --- | --- |
| `01-r21-overview.png` | Actual R2.1 overview browser viewport |
| `02-r21-workshop-office.png` | Actual R2.1 `spawn=P8` viewport |
| `03-r21-hall-plaza.png` | Actual R2.1 `spawn=P5` viewport |
| `04-r21-central-quay.png` | Actual R2.1 `spawn=P3` viewport |
| `05-r21-hero-quay.png` | Actual R2.1 `spawn=P7` viewport |
| `06-r21-debug.png` | Actual R2.1 debug browser viewport |
| `07-canonical-vs-r21.png` | Left: approved Canonical Projection A; right: actual R2.1 overview viewport |
| `08-r2-vs-r21.png` | Left: actual prior R2 overview viewport; right: actual R2.1 overview viewport |

## Gate

R2.1 is ready for visual review, not approved by that review. R3 remains blocked.

```text
R2_1_FOUNDATION_RENDER_ARCHITECTURE = COMPLETE
POLYGON_ZONE_ASSETS = IMPLEMENTED
RECTANGULAR_TILE_ARTIFACTS = REMOVED
WATER_ZONE_RENDERING = IMPLEMENTED
HERO_DUPLICATE_ARTIFACT = REMOVED
ANCHOR_SAFETY_AMENDMENT = INTEGRATED
RUNTIME_R3 = BLOCKED
NEXT = RUNTIME_R2_1_HUMAN_VISUAL_GATE
GATE = READY_FOR_RUNTIME_R2_1_HUMAN_VISUAL_GATE
```
