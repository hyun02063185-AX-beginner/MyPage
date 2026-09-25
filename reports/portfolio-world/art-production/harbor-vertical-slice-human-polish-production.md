# Harbor Vertical Slice — Human-feedback Polish Production

Date: 2026-09-25
Branch: `feature/portfolio-world-concept-vertical-slice`
Starting commit: `2dcb1688749238249a2efa251395ea78401870b2`

## Scope

Implemented exactly the three Human Review #1 Polish notes. Accepted terrain, water surface art, shoreline, buildings, ships, props, layout, collision, routes/navigation, camera/movement, fleet/berths, and depth formula remain untouched.

## A. Vessel water contact

The existing `harbor-vessel-shadow-ripple-v02.png` and `harbor-vessel-water-occlusion-v02.png` are reused; no replacement asset was generated. The foreground occlusion is raised over a slightly taller lower-hull band, while the shadow/ripple is a little broader, shorter, and less opaque so it does not read as a detached dark oval.

| Tier | Before — shadow / occlusion | Final — shadow / occlusion |
| --- | --- | --- |
| Hero | width 1.10, h 20, alpha .18 / width 1.05, h 12, y 9, alpha .88 | width 1.14, h 18, alpha .14 / width 1.07, h 16, y 5, alpha .86 |
| Medium | width 1.08, h 16, alpha .20 / width 1.04, h 9, y 6, alpha .88 | width 1.11, h 14, alpha .15 / width 1.06, h 12, y 3, alpha .84 |
| Workboat | width 1.05, h 10, alpha .20 / width 1.02, h 6, y 4, alpha .88 | width 1.07, h 9, alpha .15 / width 1.04, h 7, y 3, alpha .82 |
| Rowboat | width 1.03, h 8, alpha .20 / width 1.00, h 5, y 3, alpha .88 | width 1.04, h 7, alpha .15 / width 1.02, h 6, y 2, alpha .80 |

## B. Harbor Square pavement pattern scale

`drawHarborVerticalSlicePaving()` applies one `0.72 × 0.72` tile scale (previously `0.9 × 0.9`) to the plaza, `path-south`, and `forecourt-gallery`. It retains the existing shared world-coordinate tile positions, so the ART-04 plaza → path → forecourt continuity rule remains intact.

## C. World label readability

Harbor Square and Guild Hall, Academy, Workshop, and Exhibition Hall now share:

- Stack: `"Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif`
- Weight: bold; color `#213840`; subtle `#f3ead8` 1 px stroke
- Building labels: 15 px (from 14 px)
- Harbor Square: 17 px (from 16 px)

No CDN, Google Font, font binary, or external dependency was added.

## Runtime visual check

The local Vite application was opened and inspected in normal gameplay framing. Harbor Square's smaller stone joints remain material-readable without becoming noise; the plaza and south approach share their continuous raster alignment. The system-sans label treatment is immediately more legible at gameplay size, including the Exhibition Hall label against its façade. The live Harbor composition confirms the tuned vessel contact treatment remains restrained: lower hulls sit into the water band rather than on a hard edge, and the softened shadow/ripple does not read as a separate effect. The Hero, Medium, Workboat, and Rowboat tier inputs are all present in the live scene's shared composite path. Browser console/page errors: 0.

## Verification

- `npm run typecheck` — PASS
- `npm test` — PASS (35/35; includes typecheck and production build)
- `npm run build` — PASS
- `git diff --check` — PASS
- New raster assets: 0
- New font dependencies/assets: 0

## Protected scope verification

Only `portfolio-world/src/scenes/WorldScene.ts`, `portfolio-world/src/world/harborVerticalSliceArt.ts`, this report, canonical status/handoff docs, and the production build output are changed. Ship/building PNGs, asset manifest/preload list, layout/collision/navigation/berths, and depth formula are unchanged.

## Remaining Minor

Pre-existing deferred ground-detail flecks and the Vite chunk-size warning remain recorded; this scoped pass adds no Minor.

## Final Gate

`READY_FOR_HARBOR_VERTICAL_SLICE_POLISH_REVIEW`
