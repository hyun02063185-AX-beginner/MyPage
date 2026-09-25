# Harbor Vertical Slice — Final Independent Re-check (ART-10)

Date: 2026-09-25
Reviewer: Claude Code (Independent Visual QA)
Role: Review only. No code, asset, layout, or test file was modified to produce this report.

## A. Reviewed Commits

```text
Branch                    = feature/portfolio-world-concept-vertical-slice
Reviewed HEAD             = 72a5e2fed15f1870b2e2b11a6b0eaddee2c3789e
ART-09 runtime commit     = 3f70eb94370ac0563d9f5b037439acddf10c6127
Previous review commit    = 770d1b439a932768f04cf13ac18d86f2f1b305b2
Starting gate             = READY_FOR_HARBOR_VERTICAL_SLICE_FINAL_RECHECK
```

`git status` was clean before and after this review; HEAD matched the expected commit exactly.

Delta reviewed: `git diff 770d1b4..HEAD --stat/--name-only` — 7 files: `portfolio-world/src/scenes/WorldScene.ts` (vessel tier occlusion/shadow values only), `portfolio-world/src/world/harborVerticalSliceArt.ts` (paving tile scale only), `docs/91_STATUS.md`, `docs/92_HANDOFF.md`, the new `harbor-vertical-slice-human-review-2-refinement.md` report, and the regenerated `world/` build output. No prior Batch/Sprint reports were re-read in full.

## B. Runtime Inspection Method

Fresh `npm run dev` (Vite, port 5175) on the reviewed HEAD. Headless Microsoft Edge captured full-resolution screenshots using the project's dev-only QA framings (`?assetPreview=scaleReview&scaleView=world|exhibition`, `?assetPreview=batch01&batchView=harbor`). Console/exception checking used a direct CDP connection (Node 24 native WebSocket) against the default gameplay URL, the `batch01/harbor` framing, and the `exhibition` framing: **0 exceptions, 0 console errors/warnings** across all three.

This review did not judge the vessel change from code values or the implementation report's prose alone. Every vessel-tier claim was checked by pixel-diffing (`PIL.ImageChops.difference`) this session's fresh captures against the ART-08 baseline screenshots at identical world-coordinate crops, and by direct nearest-neighbor pixel inspection of the hull/water junction for each tier. `npm test` was independently re-run: **35/35 pass**. A line-ending-only diff in `world/index.html` produced by this session's own local build was reverted via `git checkout --` before finishing. All dev-server and headless-browser processes were stopped after capture; `git status` re-confirmed clean.

## C. Vessel Final Verdict (Overall)

**MIXED — not a uniform PASS.** Hero, Medium, and Workboat tiers show a real, pixel-confirmed, and visually convincing improvement: the lower hull now visibly disappears behind an irregular wave/foam raster rather than sitting on a hard cutoff line, while the upper hull, masts, and rigging remain fully intact and unmolested. The Rowboat/Dinghy tier, however, does **not** show this same effect on screen despite its occlusion height increasing 4.7× in code (6px → 28px): two independent rowboat-tier instances (the service-jetty dinghy specifically named in the review brief, and a second mid-basin small boat) both render the enlarged occlusion/ripple band entirely **below** the hull's visible bottom edge, with zero hull pixels covered. The hull (including its cream-white bottom stripe) remains exactly as fully exposed as before ART-09.

```text
VESSEL_WATERLINE_FINAL = FAIL (Hero/Medium/Workboat PASS; Rowboat/Dinghy FAIL — see Section G)
```

This is reported as a screen-verified, reproducible defect, not a code-value assumption. It fails two of the brief's own explicit PASS conditions for the Rowboat/Dinghy tier specifically: "실제 hull pixel 일부가 가려짐" (no hull pixel is covered) and "모든 tier가 같은 물리 규칙으로 보임" (Rowboat/Dinghy visibly does not follow the same physical rule as the other three tiers — it looks unchanged from ART-08, while the others look markedly different).

## D. Hero Verdict — PASS

Direct old/new crop comparison at identical world coordinates (`?assetPreview=batch01&batchView=harbor`): pixel diff max = 189/255, concentrated at the hull-water junction. The foreground raster now shows an irregular, jagged wave-crest pattern (not a flat rectangular band) covering roughly the lowest gunport row and the keel curve — real hull pixels (the blue gunwale stripe, the dark keel) are hidden. The upper two-thirds of the hull, all masts, rigging, and sails are completely unaffected. The wave-crest boundary is irregular, not a straight line, so it does not trip the "water overlay 상단 경계가 직선/띠" anti-pass condition. Hero does not read as half-sunk; the change reads as the ship riding through choppy harbor water rather than a big translucent card placed in front of it.

## E. Medium Verdict — PASS

Same direct comparison method: pixel diff max = 154/255. The merchant brig's lower gunport row and hull-bottom curve are now hidden behind the same irregular wave pattern, at a proportionally smaller size than Hero. Hull proportions remain readable; no oval/detached-effect shape reappears.

## F. Workboat Verdict — PASS

Pixel diff max = 98/255 for the primary instance checked, and max = 182/255 for a second workboat-tier instance (a `small-boat`-type placement routed to the same workboat asset/tier). Both show the reddish hull-bottom stripe now partly obscured by a restrained, irregular ripple texture. No round/oval blur reappears.

## G. Rowboat/Dinghy Verdict — FAIL

Two independent instances were checked at extreme (8×, nearest-neighbor) zoom, directly against their ART-08 baseline at identical coordinates:

1. **`harbor-dinghy`** (the service-jetty tender, the specific vessel named "rowboat/dinghy" in the review brief and the original Major 3 finding's "previously untreated" case).
2. A second small rowboat-tier boat elsewhere in the basin (routed through the `small-boat` → `harborDinghy` asset fallback, same `VESSEL_WATER_TREATMENT.rowboat` config).

In both cases, the pixel diff against ART-08 is real (max 98–155/255) but the changed pixels are located entirely in the water **below** the hull's rendered bottom edge — a slightly larger/darker ripple pattern next to the boat, not an occlusion over it. The hull's cream-white bottom and teal trim stripe are exactly as fully visible as they were in ART-08; no hull pixel is hidden, and the "lower hull partially obscured → submerged contour disappears" visual read required by the brief does not occur for this tier. The code change (occlusionHeight 6→28, occlusionY 2→-1) was real, but its on-screen effect for these small, short sprites (dinghy `displayHeight` 42px, `originY` 0.85) evidently lands in the water area adjacent to the hull rather than over it — plausibly because the shared occlusion texture's own opaque-water region does not fall where the fixed pixel offset places it at this tier's small scale. Root cause is not fully diagnosed here (out of scope for a review-only pass); the finding is the reproducible on-screen symptom.

```text
Rowboat/Dinghy hull pixels occluded = NO (both instances checked)
```

## H. Pavement Final Verdict — PASS

Direct old/new crop comparison of the identical plaza region (ART-08's `0.42`... wait, ART-08 was `0.72`, ART-09 is `0.42`): the new stone joints are clearly, materially smaller and more numerous relative to the fixed-size bench, lamp, and compass monument in the same frame — a decisive, human-intent-matching reduction, not a marginal tweak. The material identity (color, joint style, worn texture) is preserved, and the result does not read as fine noise/static at normal gameplay zoom; individual stone units remain clearly discernible.

### Continuity re-check
The exact plaza→`path-south` junction was re-inspected at extreme (8×, nearest-neighbor) zoom at the new `0.42` scale: the stone-joint pattern continues smoothly through the transition with no rectangular boundary, no tone break, and no stretch artifact. The ART-04 seam fix and the shared world-coordinate tile-position rule both hold.

```text
PAVEMENT_FINE_GRAIN_FINAL = PASS
```

## I. Typography Lock Verification

`git diff 770d1b4..HEAD -- portfolio-world/src/scenes/WorldScene.ts` contains zero matches for `font`, `stroke`, `label`, or `fontSize` — confirmed by direct grep, not inference. Harbor Square, Guild Hall, Academy, Workshop, and Exhibition Hall labels were re-inspected in the whole-world capture and remain immediately legible, unchanged from ART-08.

```text
TYPOGRAPHY_DIFF = 0
```

## J. Regression Sanity Check

Terrain, water surface, shoreline corner treatment, building grounding (Exhibition Hall foundation), fleet placement, destination placement/navigation, and paving continuity were re-inspected in the whole-world and harbor framings for gross regression only. No regression attributable to ART-09 was found in any of these areas.

## K. Structural Lock

Confirmed via `git diff 770d1b4..HEAD --name-only`: `worldLayoutData.json`, `worldDepth.mjs`, `worldTypes.ts`, `gameConfig.ts`, `Player.ts`, `berthingSlots.ts`, `fleetPresentation.mjs`, `waterCollisionGeometry.mjs`, `destinationNavigation.mjs`, and every locked building/ship PNG appear in **none** of the 7 changed files, and no `.png` file appears in the diff at all (new asset count = 0). World dimensions, collision, routes/navigation, berths, fleet hierarchy, and the depth formula are unchanged. `npm test` 35/35 independently reproduced; `npm run typecheck`, `npm run build`, and `git diff --check` all pass as part of that run.

## L. Findings by Severity

### Blocker
None. The app runs, loads, and renders with 0 console/page errors across every captured view.

### Major
1. **Rowboat/Dinghy tier occlusion does not occlude the hull.** Both checked instances (including the service-jetty dinghy specifically named in the Human Review #2 feedback) show the enlarged foreground water band rendering entirely below the hull's visible bottom edge. The hull remains exactly as fully exposed as before ART-09, unlike the other three tiers. This is the exact vessel class the human feedback and this review's brief called out by name, and it is not resolved. Must be fixed before Final Human Review.

### Minor
1. Carried forward unchanged: the illustrated plaza paving still meets the old flat-vector road at the plaza's own north edge, outside the locked Harbor Vertical Slice boundary.

### Polish
1. Pre-existing, already-deferred Vite chunk-size build warning — unrelated to this pass.

## M. Final Gate

Human Review #2's two feedback items are only partially resolved: pavement scale is fully addressed (PASS), and vessel floating is convincingly resolved for Hero/Medium/Workboat, but the Rowboat/Dinghy tier — the smallest vessels, and the ones most directly named in the original "rowboat untreated" history — still shows the hull sitting fully exposed above the water with no visible submersion. Blocker 0, but Major = 1.

```text
RETURN_FOR_HARBOR_VERTICAL_SLICE_FOCUSED_REPAIR
```

Scope for the next pass, per this review's own findings: fix only the Rowboat/Dinghy tier's occlusion positioning/height so the enlarged band actually crosses hull pixels (matching the visible result already achieved for Hero/Medium/Workboat), without touching the three tiers that already pass, the pavement scale, or typography.
