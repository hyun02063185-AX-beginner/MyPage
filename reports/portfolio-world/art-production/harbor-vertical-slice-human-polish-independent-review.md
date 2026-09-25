# Harbor Vertical Slice — Human-feedback Polish Independent Review (ART-08)

Date: 2026-09-25
Reviewer: Claude Code (Independent Visual QA)
Role: Review only. No code, asset, layout, or test file was modified to produce this report.

## A. Reviewed Commits

```text
Branch                    = feature/portfolio-world-concept-vertical-slice
Reviewed HEAD             = 1fb70a6759eadca4cc3f9dcbf0952455239d9aba
ART-07 runtime commit     = 5eed0dee763428c630b89c761a718018bdd0e12d
ART-06 pre-review commit  = 2dcb1688749238249a2efa251395ea78401870b2
Starting gate             = READY_FOR_HARBOR_VERTICAL_SLICE_POLISH_REVIEW
```

`git status` was clean before and after this review; HEAD matched the expected commit exactly.

Delta reviewed: `git diff 2dcb168..HEAD --stat/--name-only` — 7 files changed: `portfolio-world/src/scenes/WorldScene.ts`, `portfolio-world/src/world/harborVerticalSliceArt.ts`, `docs/91_STATUS.md`, `docs/92_HANDOFF.md`, the new `harbor-vertical-slice-human-polish-production.md` report, and the regenerated `world/` build output. No prior Batch/Sprint reports were re-read in full.

## B. Runtime Inspection Method

Fresh `npm run dev` (Vite, port 5175) on the reviewed HEAD. Headless Microsoft Edge (`--headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=6000`) captured full-resolution screenshots using the project's dev-only QA framings (`?assetPreview=scaleReview&scaleView=world|exhibition`, `?assetPreview=batch01&batchView=harbor|guild|academy|workshop`) at multiple window sizes. Screenshots were cropped with Pillow (LANCZOS for readability, NEAREST for exact-pixel inspection). Console/exception checking used a direct CDP connection (Node 24 native WebSocket) against the default gameplay URL, the `batch01/harbor` framing, and the `exhibition` framing: **0 exceptions, 0 console errors/warnings** across all three.

Critically, this review did **not** rely on visual impression alone for the vessel-tier claim: the previous ART-05 review's saved screenshots (same camera framings, same world state, vessels stationary) were pixel-diffed (`PIL.ImageChops.difference`) against this review's fresh captures at identical crop coordinates, to confirm the ART-07 code changes actually produce a different rendered pixel, not just a different number in source. `npm test` was independently re-run: **35/35 pass**. A line-ending-only diff in `world/index.html` produced by this session's own local build was reverted via `git checkout --` before finishing. All dev-server and headless-browser processes were stopped after capture; `git status` re-confirmed clean.

## C. Views Checked

Hero Ship, medium sailing vessel (west merchant brig), small workboat, rowboat (mid-basin) and dinghy (service-jetty berth) waterlines; whole-world overview; plaza paving close view (LANCZOS and NEAREST); the exact plaza→`path-south` seam junction; Harbor Square, Guild Hall, Academy, Workshop, and Exhibition Hall labels; full waterfront composite.

## D. Vessel Floating Verdict

Pixel-diffed each tier's waterline crop (identical world coordinates, old vs. new screenshot):

| Vessel | Max pixel diff (0-255) | Visual result |
| --- | ---: | --- |
| Hero | 189 | Taller, softer occlusion band; hull reads as sitting into the water rather than cut off at a hard edge. Not over-submerged — the hull's upper form is untouched. |
| Medium (brig) | 154 | Same improvement; a broader, softer shadow patch under the hull blends into the water instead of a sharp-edged dark shape. |
| Workboat | 98 | Restrained, irregular ripple pixels replace the previous shape; no round/oval blur reappears. |
| Rowboat (mid-basin instance) | 1 (noise floor) | No perceptible on-screen change for this specific instance — the tuning is present in code but the visual delta rounds away at this vessel's rendered scale. |
| Dinghy (service-jetty instance) | 98 | Real, visible change at the waterline band — softer, less abrupt hull-water junction than before. |

All four tiers use the same physical composition rule (background shadow/ripple → hull → foreground occlusion); none show a detached effect-image look, and none show excessive submersion of the upper hull. The one rowboat instance with a negligible diff is not a regression — it was already CLOSED (non-failing) after ART-04/ART-05 — but it means the ART-07 rowboat-tier tuning did not produce a confirmed visible improvement for every rowboat instance, only for the specifically-named dinghy case.

```text
VESSEL_FLOATING_POLISH = PASS
```

Condition check: floating impression clearly improved for Hero/Medium/Workboat/dinghy (pixel-confirmed, not just code values); no overlay reads as a detached effect; all tiers follow one physical rule; no over-submersion observed. Recorded as a Minor, not a blocker to this verdict, that one rowboat instance's improvement is not independently confirmed on screen.

## E. Pavement Scale Verdict

Direct side-by-side crop of the identical plaza region (old `0.9` scale vs. new `0.72` scale, same world coordinates): the new stone joints are visibly smaller and more numerous relative to the fixed-size benches, lamps, and compass-rose prop in the same frame — a materially finer, more naturally-scaled grain, not merely a marginal tweak. The stone material identity (color, joint style, worn texture) is unchanged, and does not read as noise/static at normal gameplay zoom.

The exact plaza→`path-south` junction was re-inspected at extreme (8×, nearest-neighbor) zoom with the new scale: the stone-joint pattern continues smoothly through the transition with no rectangular boundary, no tone break, no stretch artifact — the ART-04 seam fix is intact under the new tile scale.

```text
PAVEMENT_SCALE_POLISH = PASS
```

Condition check: stone pattern scale visibly more natural (confirmed via direct old/new crop comparison); material quality preserved; seam = 0; stretch artifact = 0.

## F. Label Readability Verdict

All five labels (Harbor Square, Guild Hall, Academy, Workshop, Exhibition Hall) were captured in their own dev-QA framing and read instantly at normal gameplay zoom — a marked improvement over the prior monospace treatment, which was visibly blurred/garbled at the same zoom in the ART-05 evidence (`harbor-square` label was barely legible before; now reads cleanly). The shared system-sans stack, bold weight, and thin 1px light stroke produce consistent contrast against varied backgrounds (stone plaza, green grass, cream building facade) without a heavy "subtitle" look — the stroke is subtle, not cartoonish. All five labels visibly share one typography system (same weight, stroke, color, proportional size step between building-level and Harbor-Square-level labels).

```text
LABEL_READABILITY_POLISH = PASS
```

Condition check: all five labels read quickly; visual hierarchy (15px building / 17px Harbor Square) is proportionate, not excessive; the treatment does not compete with the environment art; the declared stack degrades to a reasonable system sans-serif fallback since no custom font file is loaded.

## G. Regression Sanity Check

Terrain, water surface, shoreline corner treatment, Exhibition Hall foundation grounding, vessel placement/berths, paving continuity, and destination placement/navigation were all re-inspected in the whole-world and per-destination framings for gross regression only. No visible regression attributable to ART-07 was found in any of these areas.

## H. Structural Lock

Confirmed via `git diff 2dcb168..HEAD --name-only`: `worldLayoutData.json`, `worldDepth.mjs`, `worldTypes.ts`, `gameConfig.ts`, `Player.ts`, `berthingSlots.ts`, `fleetPresentation.mjs`, `waterCollisionGeometry.mjs`, `destinationNavigation.mjs`, and every locked building/ship PNG appear in **none** of the 7 changed files. No new raster or font asset/dependency was added (`WORLD_LABEL_FONT_FAMILY` declares a system-font stack only). World dimensions, collision, routes/navigation, berths, and the depth formula are unchanged. `npm test` 35/35 independently reproduced.

## I. Findings by Severity

### Blocker
None.

### Major
None.

### Minor
1. The ART-07 rowboat-tier parameter tuning did not produce a pixel-confirmed visible change for the mid-basin rowboat instance checked in this review (diff max = 1/255, noise floor), though it did for the dinghy instance. Not a regression — the tier was already non-failing — but the polish note's improvement is not independently confirmed for every rowboat-tier vessel.
2. Carried forward unchanged: the illustrated plaza paving still meets the old flat-vector road at the plaza's own north edge, outside the locked Harbor Vertical Slice boundary.

### Polish
1. Pre-existing, already-deferred Vite chunk-size build warning — unrelated to this pass.

## J. Final Verdict

All three Human Review #1 Polish notes are independently confirmed addressed against the actual running application, not merely from source or reported values: vessel water contact reads more convincingly as floating for Hero/Medium/Workboat/dinghy tiers; the Harbor Square pavement grain is visibly finer while the ART-04 seam fix holds; and all five world labels are now legible at a glance under one shared typography system. No accepted area shows a visible regression, and the structural lock holds through this pass. Only Blocker 0 / Major 0 findings, with two carried/noted Minors below the Human Review #2 threshold.

```text
Blocker = 0
Major   = 0
Minor   = 2
```

## K. Final Gate

```text
READY_FOR_HARBOR_VERTICAL_SLICE_HUMAN_REVIEW_2
```
