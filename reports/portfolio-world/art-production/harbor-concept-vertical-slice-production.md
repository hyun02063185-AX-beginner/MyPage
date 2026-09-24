# Harbor Concept-quality Vertical Slice Production (ART-02)

Date: 2026-09-24
Branch: `feature/portfolio-world-concept-vertical-slice`
Starting commit: `b4da36cd05db7fa2345fb5df3cd337211ad5bf65`

## Capability gate

**PASS.** Production-quality, project-owned raster environment art and alpha overlays were generated in the available environment, exported at their actual runtime sizes, audited, and integrated. The fallback art-generation packet was therefore not created.

## Delivered slice

The bounded ART-02 treatment covers Harbor Square's south transition, Exhibition Hall and its promenade, dock/waterfront, open shore, Hero Ship, visible secondary vessels, and nearby props. It adds rendering only: world dimensions, destinations, routes/forecourts, collision, camera/movement, `worldDepth.mjs` formulas, berths, fleet presentation, and the locked ship/building PNGs are unchanged.

### New generated-original runtime assets (7; 674,331 bytes)

| Asset | Runtime export | Purpose |
| --- | --- | --- |
| `harbor-vertical-slice-terrain-v01.webp` | 2048 x 560 | authored grass, soil, worn-ground terrain zone plate |
| `harbor-vertical-slice-promenade-v01.webp` | 512 x 320 | Harbor Square / south path / Exhibition forecourt paving |
| `harbor-vertical-slice-water-v01.webp` | 2048 x 256 | calm harbor water material, cropped only into existing water rectangles |
| `harbor-open-shoreline-v01.png` | 2048 x 96 RGBA | wet-edge, shallow-water, irregular rock/foam shoreline module |
| `harbor-ship-water-contact-v01.png` | 512 x 72 RGBA | reusable contact shadow, hull occlusion, and ripple band |
| `harbor-exhibition-foundation-contact-v01.png` | 400 x 96 RGBA | Exhibition foundation shadow and promenade blend |
| `harbor-viewing-terrace-v01.png` | 160 x 80 RGBA | illustrated waterfront terrace replacing the flat fallback |

Generation prompts constrained the output to a top-down / 15-degree-compatible retro illustrated harbor palette: muted sea-teal water with authored calm ripples, weathered warm stone, varied grass/soil, irregular wet rocks and restrained foam, no text, no grid, and transparency wherever an overlay had to compose with runtime art. Large opaque plates use WebP; compositing assets use PNG. Transparent pixels in all four PNG overlays were postprocessed to RGB `0,0,0` and re-audited: hidden non-zero RGB count is `0` for every transparent pixel.

### Existing asset reuse and wiring

Thirteen existing `GAME_READY` prop texture families are now reused in the slice: crate, barrel, bench, lamp, notice board, rope coil, safety rail, mooring bollard, service marker, tree, planter, warehouse annex, and service hut. This closes 16 slice fallback mappings (including display board, cargo shed, and market kiosk); the viewing-terrace mapping uses the new raster asset. Existing named building and vessel PNGs are reused unchanged.

## Runtime implementation

- `harborVerticalSliceArt.ts` adds the bounded terrain/water/shoreline/paving/foundation render helpers. Terrain stays below the existing world structures; water is rendered only at the pre-existing water placements; the shoreline module is placed along each of those existing water tops, avoiding a new water shape or collision surface.
- The Exhibition Hall retains its locked PNG and placement. A separate foundation-contact raster sits directly below it and beneath its existing building depth.
- Hero, medium, and small visible vessels now render as a visual container: low contact shadow, locked hull sprite, then a foreground water occlusion/ripple band. Their established waterline anchor and vessel depth calculation remain the sole placement/depth authority.
- The relevant south Harbor Square and Exhibition path materials now use raster paving, and local generic visual fallback types route to the existing illustrated assets without changing gameplay bounds.
- All seven records are manifest-registered as `generated-original`, `GAME_READY`, and are explicitly preloaded in `BootScene`.

Preload changes from **31 assets / 561,180 bytes** to **38 assets / 1,235,511 bytes** (delta: 7 assets / 674,331 bytes).

## Production visual inspection

Actual running-app checks used the existing development framings and reloaded the final code before judgment:

1. Harbor Vertical Slice overall — authored ground, paving, dock, and water read together.
2. Exhibition Hall + promenade — foundation contact and terrace are raster-integrated.
3. Hero Ship + waterline — contact/occlusion composite is present under the locked hull.
4. Secondary vessels + water — medium, workboat, and dinghy use the same water-contact treatment.
5. Open shoreline — each existing water edge receives irregular wet-edge/foam treatment.
6. Dock-water contact — docks remain at their existing structure depth above the treated water.
7. Harbor Square-to-waterfront transition and whole-world overview — the south-slice boundary remains visual-only and no route/collision expansion was introduced.

The first in-app close inspection found the terrace's flat fallback conspicuous; it was replaced with the final `harbor-viewing-terrace-v01.png` and the Exhibition and waterfront frames were rechecked. No in-scene missing texture or runtime console error was observed in the final app.

## Regression and quality gates

- `npm run typecheck` — PASS
- `npm test` — PASS, 35/35
- `npm run build` — PASS
- `git diff --check` — PASS
- New manifest paths — PASS, 7/7 present
- Locked layout/collision/navigation/depth/player files — no diff
- Production output — PASS; the only build notice is the pre-existing Vite over-500 kB chunk warning.

| Gate | Result |
| --- | --- |
| ENVIRONMENT_COHESION | PASS |
| TERRAIN_MATERIALITY | PASS |
| WATER_BELIEVABILITY | PASS |
| SHIP_WATER_GROUNDING | PASS |
| BUILDING_GROUNDING | PASS |
| SHORELINE_INTEGRATION | PASS |
| PLACEHOLDER_VISIBILITY | PASS |
| CONCEPT_LEVEL_READ | PASS |

Blocker: 0. Major: 0. New ART-02 Minor: 0. Deferred non-art Minor: the existing Vite chunk-size notice. Whole-world material rollout and other polish remain deliberately out of scope.

## Files changed

- `portfolio-world/public/assets/world/harbor/environment/*`
- `portfolio-world/src/world/harborVerticalSliceArt.ts`
- `portfolio-world/src/world/worldAssetManifest.ts`
- `portfolio-world/src/scenes/BootScene.ts`
- `portfolio-world/src/scenes/WorldScene.ts`
- generated `world/` production output

## Next gate

`READY_FOR_HARBOR_VERTICAL_SLICE_VISUAL_QA`
