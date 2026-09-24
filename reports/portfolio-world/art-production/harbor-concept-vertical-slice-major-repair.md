# Harbor Vertical Slice Major Repair (ART-04)

Date: 2026-09-25
Branch: `feature/portfolio-world-concept-vertical-slice`
Starting commit: `74af66ac183de756091b29a5475c605f35fa5c62`
Direct source of truth: `harbor-concept-vertical-slice-independent-visual-qa.md` (ART-03)

## Scope and lock

This repair closes only ART-03's three visual Majors: promenade material seam/aspect distortion, Exhibition east shoreline coverage, and secondary/small vessel water grounding. Terrain materiality, water surface material, Exhibition foundation grounding, and prop/vegetation cohesion were preserved. No world dimensions, routes, destinations, navigation, collision, camera/movement, berth, fleet, facing, locked building/ship PNG, or depth-formula file changed.

## Major 1 — Promenade seam: CLOSED

`drawHarborVerticalSlicePaving` now samples the existing approved promenade raster through a shared 0.9x tile coordinate system rather than calling `setDisplaySize()` independently on the plaza, narrow `path-south`, and overlapping Exhibition forecourt. Each region keeps its native stone-joint scale and shares world-aligned texture coordinates, so the plaza-to-south-path-to-forecourt surface no longer has the stretched narrow-card treatment or a rectangular tone/pattern break.

## Major 2 — Exhibition east shoreline corner: CLOSED

The existing approved open-shoreline raster continues down the land-facing vertical edge of `harbor-east-basin`, overlapping its top shoreline at the exposed Exhibition-side corner. This supplies wet edge, shallow-water/foam, and irregular rock rhythm through the corner without changing water geometry. The earlier generated corner-module exploration was rejected after live inspection because it introduced a material mismatch; it is not in the project or manifest.

## Major 3 — secondary/small vessel grounding: CLOSED

The former single oval contact image is no longer used by vessel composition. ART-04 separates the layers:

- `harbor-vessel-shadow-ripple-v02.png`: asymmetric, open raster contact-shadow/ripple field below the hull.
- `harbor-vessel-water-occlusion-v02.png`: narrow irregular foreground water band painted over the actual lower hull.

`WorldScene.drawVesselWaterComposite` selects a restrained size/opacity profile for Hero, medium sailing vessels, small workboats, and rowboat/dinghy tier. Every visible vessel category now receives the same ordered physical rule: background shadow/ripple, locked hull, foreground lower-hull water occlusion. This includes the previously untreated rowboat/dinghy cases and removes the distinct small-vessel effect oval. Hero preserves its locked PNG, berth, scale, waterline anchor, and depth calculation; its profile was reduced rather than expanded, so it does not become a separate polish pass.

## Assets and preload

Final runtime adds 2 generated-original RGBA assets:

| Asset | Size | Bytes | Use |
| --- | ---: | ---: | --- |
| `harbor-vessel-shadow-ripple-v02.png` | 512 x 64 | 34,015 | background vessel contact shadow/ripple |
| `harbor-vessel-water-occlusion-v02.png` | 512 x 44 | 23,016 | foreground lower-hull occlusion |

Both alpha assets have hidden-RGB cleanup; transparent-pixel audit result is `hiddenRgbNonzero=0`. The manifest and BootScene preload both register the two files. Preload changes from **38 assets / 1,235,511 bytes** to **40 assets / 1,292,542 bytes** (+2 / +57,031).

## Runtime files changed

- `portfolio-world/src/world/harborVerticalSliceArt.ts`
- `portfolio-world/src/scenes/WorldScene.ts`
- `portfolio-world/src/scenes/BootScene.ts`
- `portfolio-world/src/world/worldAssetManifest.ts`
- two environment PNGs above, mirrored in generated `world/` output

## Regression

- `npm run typecheck` — PASS
- `npm test` — PASS, 35/35
- `npm run build` — PASS
- `git diff --check` — PASS
- Manifest environment paths — PASS, 9/9 present
- Protected structural files — no diff
- Final live app — no missing texture observed; final loaded frames rendered successfully; console errors 0

The existing Vite chunk-size notice remains an unrelated deferred polish item.

## Actual-running-app visual evidence

Final Vite runtime checks covered all required ART-04 views:

1. Exhibition Hall approach — foundation remains intact; east corner coverage visible.
2. Harbor Square to south path — paving keeps a continuous stone scale into the Exhibition approach.
3. Exhibition east shoreline — wet, irregular top-to-vertical shoreline connection; no uncovered 90-degree land/water cut.
4. Hero waterline — reduced, non-oval tier profile preserves hull grounding.
5. Medium vessel — foreground occlusion and restrained broken contact ripple present.
6. Small motor/workboat — no separate light-oval effect; lower hull meets waterline.
7. Rowboat/dinghy — now receives the same contact/occlusion sequence.
8. Full waterfront slice — all vessel categories, docks, and shoreline render together without missing textures.

## Result

```text
PROMENADE_SEAM                 = CLOSED
SHORELINE_CORNER               = CLOSED
SECONDARY_VESSEL_GROUNDING     = CLOSED
BLOCKER                        = 0
REMAINING_MAJOR                = 0
REMAINING_MINOR                = 1 out-of-scope plaza-to-north-road material adjacency
INDEPENDENT_SHORT_RECHECK      = PENDING
HUMAN_REVIEW                   = DEFERRED
GATE                           = READY_FOR_HARBOR_VERTICAL_SLICE_SHORT_RECHECK
```
