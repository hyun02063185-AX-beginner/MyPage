# Harbor Concept Vertical Slice — Independent Visual QA (ART-03)

Date: 2026-09-24 (Asia/Seoul)
Reviewer: Claude Code (Independent Visual QA)
Role: Review only. No code, asset, or layout file was modified to produce this report.

## A. Reviewed State

```text
Branch                      = feature/portfolio-world-concept-vertical-slice
Reviewed HEAD                = db7d24b099799143bb8410726f18eeedd703be37
Runtime implementation commit = bf0a67042eba58444351584a3ee8a54e6641c5a1
Starting gate                = READY_FOR_HARBOR_VERTICAL_SLICE_VISUAL_QA
```

`git status` was clean before and after this review; nothing was modified.

## B. Delta Reviewed

```text
git diff b4da36c..HEAD --stat / --name-only
```

23 files changed. Runtime: `portfolio-world/src/scenes/BootScene.ts`, `portfolio-world/src/scenes/WorldScene.ts`, `portfolio-world/src/world/harborVerticalSliceArt.ts` (new), `portfolio-world/src/world/worldAssetManifest.ts`. Assets: 7 new raster files under `portfolio-world/public/assets/world/harbor/environment/` (mirrored into `world/assets/...`), plus `world/index.html` and the regenerated bundle hash. Docs: `91_STATUS.md`, `92_HANDOFF.md`. New report: `harbor-concept-vertical-slice-production.md`.

Confirmed **not** in the diff (structural lock intact — see Section N): `worldLayoutData.json`, `worldDepth.mjs`, `worldTypes.ts`, `gameConfig.ts`, `Player.ts`, `berthingSlots.ts`, `fleetPresentation.mjs`, `waterCollisionGeometry.mjs`, `destinationNavigation.mjs`, and every locked building/ship PNG (`guild-hall-v01`, `hero-ship-d-*`, `exhibition-hall-v0*`, etc.).

The production report's PASS claims (all 8 gates, Blocker 0/Major 0) were **not** taken at face value; every gate was independently re-judged from the running application in Sections E–P below.

## C. Runtime Inspection Method

`npm ci` (fresh — `node_modules` was not left installed from a prior session) then `npm run dev` (Vite, port 5174) on the reviewed commit. Headless Microsoft Edge (`--headless --run-all-compositor-stages-before-draw --virtual-time-budget=6000`) captured full-resolution screenshots of the actual rendered canvas — not source, not asset files in isolation. A Chrome DevTools Protocol console/exception listener was attached directly to the running page for the full waterfront view; it reported **0 console messages of type error/warning and 0 exceptions** (only the Vite HMR connect log and the standard Phaser banner). The dev server and all headless browser processes were stopped after capture; `git status` was re-confirmed clean.

Both the project's existing dev-only QA camera framings (`?assetPreview=scaleReview&scaleView=world|exhibition`, `?assetPreview=batch01&batchView=harbor`) and the real default gameplay camera (no query params, default zoom/spawn) were used. Several screenshots were then cropped and upscaled locally (Pillow) for close-range inspection of hull waterlines and material seams — this is optical zoom on the same captured pixels, not a different render.

## D. Screens / Framings Reviewed

1. Whole-slice / whole-world overview (`scaleView=world`)
2. Exhibition Hall + promenade close framing (`scaleView=exhibition`, zoom 1.1)
3. Wide harbor composite: Harbor Square south edge → waterfront → Hero Ship → secondary vessels → dock (`batch01/harbor`)
4. Default gameplay camera at spawn (no dev params) — Harbor Square south, promenade, Exhibition Hall, both basins
5. Cropped/zoomed: Hero Ship hull + waterline
6. Cropped/zoomed: secondary/small vessel hulls + waterline (west basin)
7. Cropped/zoomed: Harbor Square plaza paving detail
8. Cropped/zoomed: promenade strip (plaza → Exhibition forecourt) including the plaza/path seam
9. Cropped/zoomed: Exhibition Hall east water edge / shoreline corner
10. Cropped/zoomed: terrain-plate-to-existing-ground transition (north of the slice)

10 distinct evidence frames total (4 full captures + 6 derived crops), console-checked, 0 errors.

## E. Environment Cohesion

**FAIL.** The water, terrain, and stone-paving materials are individually a large step up from the pre-ART-02 flat fills (Section F–G), and in isolated framings (the west basin, the plaza) the scene does read as one authored place. But two concrete composited-layers artifacts break the "designed as one scene" impression in the slice's own primary view (Sections M):

- A visible rectangular seam where the promenade plate (applied to the plaza) meets the same promenade texture stretched onto the narrow `path-south` strip, directly north of the Exhibition Hall roofline — one of the most-viewed spots in the whole slice.
- A hard, completely untreated rectangular water/land corner immediately east of the Exhibition Hall, with no shoreline blend at all.

Both are described precisely (not "it could be smoother") in Section M with pixel-level crops. Additionally, at the exact north edge of the plaza — still inside the frame a player sees when looking at the slice — the new illustrated stone paving butts directly against the old flat-gray vector road with no transition; this is technically outside the locked slice boundary (Guild/Academy/Workshop roads were never in scope), but it sits inside the same continuous view and reads as a visible quality cliff, not a deliberate zone change. Recorded as a boundary-adjacency note, not scored against the slice's own PLACEHOLDER_VISIBILITY gate, since fixing it would mean touching out-of-scope roads.

## F. Terrain Materiality

**PASS.** This is a genuine, well-executed improvement. The grass in the slice (visible in every capture) shows real blade/soil variation, tonal patches, and worn-edge character — it reads as an illustrated ground material at normal gameplay zoom, not a flat fill with decorative marks. No repeating tile unit is visible. This clears the bar the ART-01 lock set.

## G. Water Believability

**PASS.** Also a genuine improvement and the strongest result of this pass. The water shows real depth variation (deep-to-shallow gradient), non-repetitive directional highlight streaks, and even a visible submerged-rock/reef patch in the west basin capture — it reads as an authored material with depth, not a flat blue rectangle with dashes. This is judged purely on the water surface material itself; the land/water edge is scored separately in Section J, where it fails.

## H. Hero Ship Water Grounding

**BORDERLINE PASS, with a real architectural weakness worth recording.** Close-range inspection of the Hero Ship hull (cropped/upscaled from the exhibition-view capture) shows a soft, fairly well color-matched blur/glow around the lower hull rather than a hard sprite-edge cutoff — at this vessel's scale, it is not glaringly a "pasted effect." However, reading the actual composite code (`WorldScene.drawVesselWaterComposite`) confirms this is architecturally exactly the pattern the QA brief warns against: the same single 512×72 texture (`harbor-ship-water-contact-v01.png`) is drawn twice — once below the hull at 0.38 alpha, once above it at 0.9 alpha, both at nearly the same offset — functioning as a "contact effect slab" rather than three distinct, purpose-built layers (occlusion mask, contact shadow, contact ripple) as the ART-01 lock's Section K specified. There is no darkening/desaturation of the hull's own lower planks and no y-order painting-over of hull pixels — the illusion is closer to "a soft glow was placed near the waterline" than "the hull is optically inside the water." At Hero Ship's scale this reads acceptably; it does not clear the bar with confidence, but it is not a standalone Major on its own. See Section I for where the same mechanism visibly fails.

## I. Secondary Vessel Grounding

**FAIL.** The same `drawVesselWaterComposite` mechanism produces a clearly visible, distinctly-shaped light oval/round blur directly under each of the small motorboat-type vessels (confirmed in the west-basin close crop and the default-gameplay-camera capture) — at this smaller scale the effect does not blend into the water texture and reads exactly as the brief's named failure condition: "an effect image was laid under the boat," visible as a structure rather than an illusion. Worse, the plain wooden rowboat instances in the same frame show **no** contact treatment at all (no shadow, no blur, hull sits flush on the flat water), while the motorboat-type instances all show the round blur — this is not a graceful "intensity difference by size" (which the brief explicitly allows), it is an inconsistent, visibly patchy application across same-tier vessels in the same water body. Fails both the grounding-quality bar and the cross-vessel-consistency requirement.

## J. Shoreline Integration

**FAIL.** The open-shoreline module and its blending work well in most captured frames (west basin, whole-world overview) — the land/water edge there shows a plausible irregular wet-edge/foam transition. But the close crop of the Exhibition Hall's east water edge shows one water rectangle with a **completely hard, untreated rectangular corner** directly against the grass — no wet-edge, no foam, no irregular rhythm, a bare 90° cut. This sits immediately beside the Exhibition Hall, one of the most prominent points in the slice, and is a direct, visually-confirmed instance of the brief's named FAIL condition ("육지와 물 사이에 overlay를 얹은 느낌" / a hard boundary with no overlay at all — here even more literally, no overlay). This is very likely a coverage/geometry gap in the shoreline loop (`drawHarborVerticalSliceShoreline` iterates `waterVisuals`, but the offset/size formula appears not to reach this particular water rectangle's exposed corner correctly) rather than a mismatch of overall shoreline quality — but it is what the running app actually shows.

## K. Exhibition Hall Grounding

**PASS.** This is a clear, well-executed win. The building's base now shows a convincing worn stone/rubble foundation transition blending the white building base into the dock/promenade material — confirmed in both the `exhibition` dev-camera capture and the default-gameplay-camera capture. It reads as grounded, not as a cutout PNG on a flat plane. (The building's own design was not evaluated, per the brief.)

## L. Prop / Vegetation Cohesion

**PASS, with one adjacent caveat.** The prop-wiring expansion is a real, visible improvement: crates, notice boards, safety rails, mooring bollards, lamps, and rope/mooring details in the slice now render as illustrated PNGs sharing a coherent warm-wood/weathered-metal palette with the buildings and ships — the flat vector "X-pattern crate" and plain circle-tree look from the pre-ART-02 baseline is gone from the reviewed frames. The new `harbor-viewing-terrace-v01.png` and foundation-contact art also sit comfortably in the same material language. The only caveat is the boundary-adjacency note from Section E (out-of-slice vector props/signs one step outside the boundary still look flat by comparison) — not scored against this pass.

## M. Asset Boundary / Seam Review

Two concrete, independently reproduced findings, both visible in a normal gameplay-camera frame (not only in a dev debug view):

1. **Promenade plate seam.** `drawHarborVerticalSlicePaving` calls `setDisplaySize()` with the *same* `harbor-vertical-slice-promenade-v01.webp` texture independently for the plaza (448×288, close to the texture's native 512×320 aspect) and for `path-south` (64×208 — a completely different, narrow-portrait aspect) and `forecourt-gallery` (128×64). Because each placement is an independent, unblended image instance, the point where the plaza rectangle and the path-south rectangle meet (directly north of the Exhibition Hall roof ridge, screenshotted in both the `exhibition` dev-camera view and the default gameplay camera) shows a visible hard rectangular tone/pattern break — confirmed at pixel level via the `exhibition_pillar_zoom` crop. The extreme aspect mismatch on `path-south` also visibly stretches the stone-joint pattern compared to the plaza above it.
2. **Water plate hard corner.** At least one water rectangle near the Exhibition Hall's east side shows a bare, untreated 90° corner against the grass with no shoreline module coverage at all (Section J), confirmed via the `shoreline_open_zoom` crop.

Both meet the brief's own bar for this section: "정상 gameplay 화면에서 사각형 asset 경계가 보이면 최소 Major."

## N. Structural Lock Check

Confirmed via `git diff b4da36c..HEAD --name-only` plus a targeted grep for every protected file: `worldLayoutData.json`, `worldDepth.mjs`, `worldTypes.ts`, `gameConfig.ts`, `Player.ts`, `berthingSlots.ts`, `fleetPresentation.mjs`, `waterCollisionGeometry.mjs`, `destinationNavigation.mjs`, and every locked building/ship PNG appear in **none** of the 23 changed files. World dimensions, collision, destination/navigation, berth positions, locked ship/building art, and the depth formula are unchanged. The production report's reference to `npm test` 35/35 is accepted on this basis and was not independently re-run, per the brief's own guidance (§14).

## O. Findings by Severity

### Blocker
None. The app runs, loads, and renders with 0 console/page errors across every captured view.

### Major
1. **Promenade asset-plate seam** north of the Exhibition Hall roofline, caused by stretching one non-tiling plaza/paving texture across wildly different aspect ratios (plaza vs. the narrow `path-south` strip) with no blending between adjacent placements. Location: `harborVerticalSliceArt.ts` → `drawHarborVerticalSlicePaving`. Visible in the slice's own primary approach view.
2. **Untreated hard water/land corner** beside the Exhibition Hall's east edge — the shoreline module does not reach or cover this specific water rectangle's exposed corner. Location: `harborVerticalSliceArt.ts` → `drawHarborVerticalSliceShoreline`. Visible directly beside the most important building in the slice.
3. **Secondary/small-vessel water grounding reads as an applied effect, inconsistently.** The single reused contact texture produces a distinct, non-blended round blur under motorboat-type small vessels, while rowboat-type instances in the same water get no treatment at all. Location: `WorldScene.drawVesselWaterComposite` / the single `harborShipWaterContact` asset being reused generically across very different hull scales without a differentiated small-vessel treatment.

### Minor
1. Hero Ship's water-contact treatment is architecturally the same "one texture reused twice" mechanism as the failing secondary-vessel case (Section H) — it happens to read acceptably at Hero Ship's scale, but it is not a robust, purpose-built occlusion/shadow/ripple set as specified, and is one scale tweak away from the same failure.
2. Visible material-quality cliff where the new illustrated plaza paving meets the old flat-vector road immediately north of the plaza — inside the same continuous view a player sees, though outside the locked slice boundary itself.

### Polish
1. None recorded beyond the pre-existing, already-deferred Vite chunk-size build warning (unrelated to this pass).

## P. Eight Quality Gate Verdicts

```text
ENVIRONMENT_COHESION   = FAIL  (seam + hard water corner break the single-scene impression)
TERRAIN_MATERIALITY    = PASS  (genuine illustrated ground material, no repeat/flat-fill tell)
WATER_BELIEVABILITY    = PASS  (real depth/highlight/ripple on the water surface itself)
SHIP_WATER_GROUNDING   = FAIL  (secondary/small vessels read as an applied effect; inconsistent)
BUILDING_GROUNDING     = PASS  (Exhibition Hall foundation contact is convincing)
SHORELINE_INTEGRATION  = FAIL  (untreated hard rectangular corner confirmed beside Exhibition Hall)
PLACEHOLDER_VISIBILITY = FAIL  (the two asset-boundary seams are themselves mockup-like artifacts)
CONCEPT_LEVEL_READ     = FAIL  (multiple visible seams in the primary view undercut the "one
                                 continuous, finished world" read the brief requires)
```

Per the brief's Human Review gate condition (Blocker 0, Major 0, all 8 gates PASS), this slice does not qualify: Major = 3, and 4 of 8 gates fail.

## Q. Final Verdict

The production pass made real, substantial, independently-confirmed progress on terrain materiality, water believability, and building grounding — these are not "technically implemented but ugly," they are genuinely closer to the concept-image bar than the pre-ART-02 baseline. This is not a rejection of the whole approach. But the pass is not yet at concept-level finish: two concrete asset-compositing seams and an inconsistent, effect-like ship-water treatment are visible in the slice's own primary view, and the brief's anti-pass rule is explicit that "individually good pieces" and "clearly improved from before" do not substitute for a scene that reads as fully composed. This is a scoped repair, not a re-scope: the terrain/water/paving/foundation art itself does not need to be regenerated, and the fixes are bounded to (a) how the promenade texture is placed on non-matching-aspect rectangles, (b) shoreline coverage completeness, and (c) a scale-aware, more differentiated per-vessel water-contact treatment.

## R. Next Gate

```text
READY_FOR_HARBOR_VERTICAL_SLICE_MAJOR_REPAIR
```
