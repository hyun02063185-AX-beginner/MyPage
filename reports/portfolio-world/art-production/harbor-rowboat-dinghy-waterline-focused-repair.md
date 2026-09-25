# Harbor Rowboat / Dinghy Waterline Focused Repair (ART-11)

Date: 2026-09-25
Branch: `feature/portfolio-world-concept-vertical-slice`
Starting commit: `7064346e3eda566aae91e31a1c6cc658de8493e6`

## ART-10 Major summary

ART-10 confirmed that the shared Rowboat/Dinghy water-occlusion raster rendered below both checked hulls. The effect existed, but neither the service-jetty dinghy nor the mid-basin rowboat lost a visible hull pixel, so the Major remained open.

## Root cause and repair

The Dinghy texture has a practical alpha bottom at source y=34 of 42, while its `originY` is 0.85. Its visible lower hull therefore ends above the container origin. At the ART-09 rowboat treatment (`height: 28`, `y: -1`), the shared occlusion texture's opaque middle landed below this practical hull bound.

No asset was changed. The Rowboat tier alone now uses the same `height: 28`, `width: 1.03`, and alpha `.88`, but places the foreground water raster at `occlusionY: -11`. This moves the raster's irregular opaque crest across the lower cream/teal hull pixels. Shadow/ripple, composition order, and every non-rowboat tier remain unchanged.

## Actual running-app result

Headless Edge captured `?assetPreview=batch01&batchView=harbor` at 2048 × 1152 and close nearest-neighbor crops.

- Service-jetty dinghy: PASS — the foreground water crest crosses and obscures the cream lower stripe; its upper form remains visible and no rectangular overlay or detached shadow appears.
- Mid-basin rowboat: PASS — the same rowboat-tier crest interrupts the lower hull contour rather than rendering solely beneath it; the boat remains clearly readable above the waterline.
- Hero: unchanged PASS — no ART-11 code/value change.
- Medium: unchanged PASS — no ART-11 code/value change.
- Workboat: unchanged PASS — no ART-11 code/value change.

## Protected scope

Only `VESSEL_WATER_TREATMENT.rowboat.occlusionY` changes in runtime code. Pavement scale, typography, all ship/building PNGs, ship scale, berth, facing, fleet hierarchy, world layout, collision, navigation, camera, terrain, water plate, shoreline, props, and depth formula are unchanged.

## Verification

- `npm run typecheck` — PASS
- `npm test` — PASS (35/35; includes typecheck and production build)
- `npm run build` — PASS
- `git diff --check` — PASS
- Browser console/page errors: 0
- New assets: 0

## Final Gate

`READY_FOR_HARBOR_ROWBOAT_SHORT_RECHECK`
