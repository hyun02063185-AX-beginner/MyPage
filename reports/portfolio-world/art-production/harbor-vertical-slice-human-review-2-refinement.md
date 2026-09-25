# Harbor Vertical Slice — Human Review #2 Focused Refinement (ART-09)

Date: 2026-09-25
Branch: `feature/portfolio-world-concept-vertical-slice`
Starting commit: `770d1b439a932768f04cf13ac18d86f2f1b305b2`

## Human Review #2 scope

Implemented only the two remaining feedback items: actual lower-hull submersion and finer Harbor Square stone pattern scale. Typography was accepted by the review and remains locked.

## Vessel diagnosis and method

ART-07's foreground-water raster was only 16 px tall on the Hero tier and consequently reached the hull foot rather than its submerged lower portion. The existing `harbor-vessel-water-occlusion-v02.png` is retained, but its display height now covers each tier's real lower-hull span. Because the raster's opaque water band occupies the middle/lower part of its source, this produces a waterline that crosses the hull and removes the lower contour without an underwater clone or ship-art change. The supporting shadow/ripple is smaller and less opaque.

| Tier | ART-07 shadow / occlusion | ART-09 final shadow / occlusion |
| --- | --- | --- |
| Hero | width 1.14, h 18, alpha .14 / width 1.07, h 16, y 5, alpha .86 | width 1.12, h 16, alpha .10 / width 1.08, h 128, y -2, alpha .95 |
| Medium | width 1.11, h 14, alpha .15 / width 1.06, h 12, y 3, alpha .84 | width 1.09, h 12, alpha .11 / width 1.07, h 84, y -1, alpha .93 |
| Workboat | width 1.07, h 9, alpha .15 / width 1.04, h 7, y 3, alpha .82 | width 1.05, h 8, alpha .12 / width 1.05, h 38, y -1, alpha .91 |
| Rowboat | width 1.04, h 7, alpha .15 / width 1.02, h 6, y 2, alpha .80 | width 1.03, h 6, alpha .12 / width 1.03, h 28, y -1, alpha .88 |

The composition order remains shadow/ripple → locked hull → foreground water occlusion. Ship PNGs, scale, facing, berths, fleet hierarchy, and depth formula are unchanged.

## Pavement scale

The existing promenade texture, palette, and aligned coordinates are retained. The shared tile scale is `0.42 × 0.42`, down from ART-07/ART-08's `0.72 × 0.72`. Plaza, `path-south`, and `forecourt-gallery` use the same scale and unchanged world-aligned tile positions, preserving the ART-04 seam rule.

## Before / after live verification

Local Vite runtime captures used the same `?assetPreview=batch01&batchView=harbor` framing cited by ART-08. Compared with the ART-08 baseline, the Hero's lower hull now disappears behind the foreground water band; the Medium, Workboat, and Rowboat/Dinghy tiers retain readable upper forms while their lower contours do not continue cleanly under water. The reduced shadow/ripple stays subordinate to the waterline. In the same frame, the Harbor Square stone joints are visibly more numerous and substantially smaller relative to fixed benches, lamps, and the compass monument. The plaza → south-path → Exhibition-forecourt material remains continuous with no seam or stretch.

Normal gameplay and close-frame inspection covered the full waterfront, Hero, Medium, Workboat, Rowboat/Dinghy, Harbor Square, compass, benches, plaza → south path, and Exhibition forecourt. Local browser console/page errors: 0.

## Typography lock and protected scope

`WORLD_LABEL_FONT_FAMILY`, building and Harbor Square sizes, stroke, label placement, label depth, and hierarchy have no ART-09 diff. Terrain, grass, water plate, shoreline, buildings, props, vegetation, navigation, gameplay, camera, player, collision, layout, ship art, asset manifest, and depth policy are also unchanged.

## Verification

- `npm run typecheck` — PASS
- `npm test` — PASS (35/35; includes typecheck and production build)
- `npm run build` — PASS
- `git diff --check` — PASS
- New assets: 0
- New font dependencies/assets: 0

## Remaining Minor

The pre-existing Vite chunk-size warning and the previously recorded plaza north-edge transition remain deferred. This focused pass adds no new Minor.

## Final Gate

`READY_FOR_HARBOR_VERTICAL_SLICE_FINAL_RECHECK`
