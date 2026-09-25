# Harbor Rowboat / Dinghy Waterline — Independent Short Re-check (ART-12)

Date: 2026-09-25
Reviewer: Claude Code (Independent Visual QA)
Role: Review only. No code, asset, layout, or test file was modified to produce this report.

## A. Reviewed Commits

```text
Branch                = feature/portfolio-world-concept-vertical-slice
Reviewed HEAD         = 1859beee1a83099240987a63337c644b28f35209
ART-11 runtime commit = a0eb3470053ca915ea61a6f4ba1cda6bcd2aa46b
ART-10 review commit  = 7064346e3eda566aae91e31a1c6cc658de8493e6
Starting gate         = READY_FOR_HARBOR_ROWBOAT_SHORT_RECHECK
```

`git status` was clean before and after this review; HEAD matched the expected commit exactly.

Delta reviewed: `git diff 7064346..HEAD --stat/--name-only` — 6 files: `portfolio-world/src/scenes/WorldScene.ts`, `docs/91_STATUS.md`, `docs/92_HANDOFF.md`, the new `harbor-rowboat-dinghy-waterline-focused-repair.md` report, and the regenerated `world/` build output. The code diff is a single-line, single-value change: `VESSEL_WATER_TREATMENT.rowboat.occlusionY` from `-1` to `-11`. No other tier, no pavement scale, no typography, no asset file changed.

## B. Runtime Inspection Method

Fresh `npm run dev` (Vite, port 5175) on the reviewed HEAD. Headless Microsoft Edge captured `?assetPreview=batch01&batchView=harbor` at 1600×1100. Console/exception checking used a direct CDP connection (Node 24 native WebSocket) against the default gameplay URL and the `batch01/harbor` framing: **0 exceptions, 0 console errors/warnings**.

Per the anti-pass rule, neither the implementation report's PASS claim nor the code's new `occlusionY` value was treated as evidence on its own. Both named vessels were pixel-diffed (`PIL.ImageChops.difference`) against this session's own ART-10 baseline screenshot at identical world-coordinate crops, then inspected at extreme (8–10×, nearest-neighbor) zoom to visually confirm whether hull pixels are actually covered. `npm test` was independently re-run: **35/35 pass**. A line-ending-only diff in `world/index.html` produced by this session's own local build was reverted via `git checkout --`. All dev-server and headless-browser processes were stopped after capture; `git status` re-confirmed clean.

## C. Service-jetty Dinghy Verdict

Direct old/new crop at identical coordinates: pixel diff max = 193/255, bounding box starting at y=152 of a 320px-tall crop — inside the hull region, not below it (ART-10's diff for this same vessel was confined to y≥280, entirely below the hull). Visual inspection confirms the irregular wave-crest raster now visibly crosses and interrupts the boat's cream lower-hull stripe and part of its teal trim; the upper hull (interior planking, oar) remains fully readable. The crest edge is jagged, not a straight rectangular line; no detached oval/ripple shape appears; the boat does not read as excessively submerged.

```text
VISIBLE_HULL_PIXELS_OCCLUDED = YES
SERVICE_JETTY_DINGHY = PASS
```

## D. Mid-basin Rowboat Verdict

Same method, second instance: pixel diff max = 196/255, bounding box starting at y=160 of a 400px-tall crop — again inside the hull, not below it. Visual inspection shows the same result: the cream lower-hull stripe and teal trim are now visibly interrupted by the wave crest, while the upper hull and oar remain clearly readable. No rectangular band, no detached effect, no excessive submersion.

```text
VISIBLE_HULL_PIXELS_OCCLUDED = YES
MID_BASIN_ROWBOAT = PASS
```

## E. Locked-PASS Sanity Check

Hero and the plaza/label region were pixel-diffed against the ART-10 baseline at identical crop coordinates: both returned **zero-pixel difference** (`bbox of differences: None`), confirming these are not merely "presumed unchanged" but byte-for-byte identical renders. This is consistent with the diff scope (only `VESSEL_WATER_TREATMENT.rowboat.occlusionY` changed) and confirms no regression.

```text
HERO      = LOCKED_PASS (pixel-identical to ART-10)
MEDIUM    = LOCKED_PASS (no code change; not independently re-diffed, no regression signal)
WORKBOAT  = LOCKED_PASS (no code change; not independently re-diffed, no regression signal)
PAVEMENT  = LOCKED_PASS (pixel-identical to ART-10 in the same captured region)
TYPOGRAPHY = HUMAN_ACCEPTED_LOCKED (no diff in WorldScene.ts beyond the rowboat value; labels unaffected)
```

## F. Structural Lock

Confirmed via `git diff 7064346..HEAD --name-only`: the only runtime source file touched is `portfolio-world/src/scenes/WorldScene.ts`, and its only content change is the single `occlusionY` value for the `rowboat` tier. `worldLayoutData.json`, `worldDepth.mjs`, `worldTypes.ts`, `gameConfig.ts`, `Player.ts`, `berthingSlots.ts`, `fleetPresentation.mjs`, `waterCollisionGeometry.mjs`, `destinationNavigation.mjs`, `harborVerticalSliceArt.ts` (pavement), and every locked building/ship PNG are absent from the diff; no `.png` file appears at all (new asset count = 0). `npm test` 35/35 independently reproduced.

## G. Findings

### Blocker
None.

### Major
None. Both previously-open instances (service-jetty dinghy, mid-basin rowboat) now show real, screen-confirmed hull-pixel occlusion.

### Minor
1. Carried forward unchanged: the illustrated plaza paving still meets the old flat-vector road at the plaza's own north edge, outside the locked Harbor Vertical Slice boundary.

## H. Final Gate

```text
READY_FOR_HARBOR_VERTICAL_SLICE_FINAL_HUMAN_REVIEW
```

Conditions met: service-jetty dinghy PASS, mid-basin rowboat PASS, Blocker 0, Major 0, no regression in any previously-locked area (Hero pixel-identical, pavement pixel-identical), tests 35/35, console errors 0.
