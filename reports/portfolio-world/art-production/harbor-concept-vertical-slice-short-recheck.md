# Harbor Vertical Slice — Independent Short Re-check (ART-05)

Date: 2026-09-25
Reviewer: Claude Code (Independent Visual QA)
Role: Review only. No code, asset, layout, or runtime file was modified to produce this report.

## A. Reviewed Commits

```text
Branch                         = feature/portfolio-world-concept-vertical-slice
Reviewed HEAD                  = ed1db9fe0a60d84f3a3ac0a98a6216502a8b644a
Repair runtime commit           = 34355c839a77f9b6ca20b990451e0558c1f94b8c
Previous independent QA (ART-03) = 74af66ac183de756091b29a5475c605f35fa5c62
Starting gate                  = READY_FOR_HARBOR_VERTICAL_SLICE_SHORT_RECHECK
```

`git status` was clean before and after this review. HEAD matched the expected commit exactly.

Delta reviewed: `git diff 74af66a..HEAD --stat/--name-only` — 13 files changed. Runtime: `BootScene.ts`, `WorldScene.ts`, `harborVerticalSliceArt.ts`, `worldAssetManifest.ts`. Assets: 2 new PNGs (`harbor-vessel-shadow-ripple-v02.png`, `harbor-vessel-water-occlusion-v02.png`), mirrored into `world/assets/`. Docs: `91_STATUS.md`, `92_HANDOFF.md`. New report: `harbor-concept-vertical-slice-major-repair.md`. No prior Batch/Sprint reports were re-read in full, per the brief's scope limit.

## B. Runtime Inspection Method

Fresh `npm run dev` (Vite, port 5175) on the reviewed HEAD. Headless Microsoft Edge (`--headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=6000`) captured full-resolution screenshots of the actual rendered canvas at multiple window sizes, using both the project's existing dev-only QA camera framings (`?assetPreview=scaleReview&scaleView=world|exhibition`, `?assetPreview=batch01&batchView=harbor`) and the real default gameplay camera (no query params). Screenshots were cropped and upscaled locally (Pillow, both LANCZOS for readability and NEAREST for exact-pixel inspection) — optical zoom on the same captured pixels, not a different render.

Console/exception checking used a direct Chrome DevTools Protocol connection (Node 24 native WebSocket, `Runtime.enable`/`Log.enable`/`Page.enable`) against a separate headless Edge instance with `--remote-debugging-port`, run against the default gameplay URL, the `batch01/harbor` framing, and the `exhibition` framing. Result: **0 exceptions, 0 console errors, 0 console warnings** across all three.

`npm test` was independently re-run: **35/35 pass**, reproduced fresh. One line-ending-only diff in `world/index.html` produced by this session's own local `npm run build` (part of `npm test`) was reverted via `git checkout --` before finishing; it was not part of the reviewed commit and is not part of this report's changes. All dev-server and headless-browser processes were stopped after capture; `git status` was re-confirmed clean.

## C. Major 1 — Promenade Seam: CLOSED

`drawHarborVerticalSlicePaving` now uses a `Phaser.TileSprite` per region (plaza, `path-south`, `forecourt-gallery`) with a shared 0.9× tile-coordinate offset (`tilePositionX/Y` derived from each region's world-aligned top-left corner) instead of independently calling `setDisplaySize()` per region on the same non-tiling texture.

Direct visual confirmation: an extreme close-up crop (8×, nearest-neighbor, at the exact plaza→`path-south` junction north of the Exhibition Hall roofline) shows the stone-joint pattern running continuously through the transition — no rectangular tone/pattern break, no stretched-card look, no visible boundary line. The whole-world overview and the `exhibition` QA framing both show the same continuous paving under normal gameplay zoom; the seam does not read as a defect at a glance.

```text
PROMENADE_SEAM = CLOSED
```

## D. Major 2 — Shoreline Corner: CLOSED

`drawHarborVerticalSliceShoreline` now adds a second `harborOpenShoreline` placement specifically for `harbor-east-basin`, rotated -90° and positioned to continue down the basin's exposed land-facing vertical edge next to Exhibition Hall, overlapping the existing top-edge shoreline strip at the corner.

Direct visual confirmation: a tight zoom on the exact corner (world ≈ 1248, 1056) shows continuous irregular rock/foam texture wrapping both the horizontal (top) and vertical (west-facing) edges of the basin at the corner — no bare 90° cut, no hard rectangular line against the grass. Sanity-checked the rest of the visible shoreline in the same frame (west basin top edge, east basin top edge further from the corner): both use the same subtle straight-edge wet-line treatment as before, unchanged and consistent with each other — no new coverage gap was introduced by this fix.

```text
SHORELINE_CORNER = CLOSED
```

## E. Major 3 — Vessel Grounding: CLOSED

`WorldScene.drawVesselWaterComposite` now buckets each vessel into one of four tiers by display width (hero ≥300, medium ≥160, workboat ≥100, rowboat <100) and draws two separate, tier-scaled raster layers — a background shadow/ripple (`harbor-vessel-shadow-ripple-v02.png`) and a foreground lower-hull water-occlusion band (`harbor-vessel-water-occlusion-v02.png`) — replacing the single reused contact-oval texture.

Direct visual confirmation, all four tiers inspected via nearest-neighbor close crops of the actual rendered canvas:
- **Hero** — thin, restrained occlusion band across the lower hull at the waterline; no round blur, no oval slab.
- **Medium (merchant brig)** — same restrained band, plus a subtle, hull-shaped (not circular) darker patch immediately below the hull.
- **Small workboat** — restrained, irregular ripple/splash pixels at the hull-water junction; specifically confirmed **no distinct round/oval blur** (the prior named failure).
- **Rowboat / dinghy** — a visible, if subtle, contact band and hull-water texture break is now present at both a mid-basin rowboat and the dedicated dinghy near the service jetty; previously these showed zero treatment (hull flush on flat water). The treatment is intentionally the most restrained of the four tiers but is not absent.

No untreated vessel and no visible effect-oval was found in any of the four tiers.

```text
SECONDARY_VESSEL_GROUNDING = CLOSED
```

## F. Hero Regression Check

Hero no longer uses the ART-03-flagged "one texture drawn twice" mechanism; it now uses the same separated shadow/occlusion architecture as every other tier, sized for its own scale (`hero` entry in `VESSEL_WATER_TREATMENT`). Visually the waterline reads at least as convincing as before — a clean, thin occlusion line at the hull-water junction — and is architecturally more sound, not more artificial. This closes the ART-03 Minor note about Hero's fragile shared-texture mechanism as a side effect of the Major 3 repair.

## G. Previous PASS Sanity Check

Whole-world overview and the `exhibition`/`batch01-harbor` framings were re-inspected for gross regression only (not re-analyzed in full):
- **Terrain materiality** — grass/soil variation unchanged, no repeat-tile tell. Holds.
- **Water believability** — depth gradient, highlight streaks, submerged-rock patch unchanged. Holds.
- **Building grounding** — Exhibition Hall's foundation/base transition unchanged and still convincing. Holds.
- **Prop / vegetation cohesion** — crates, bollards, lamps, rope, benches all render as before; no new flat-vector fallback observed. Holds.

No visible regression attributable to ART-04 was found in any of these four areas.

## H. Structural Lock

Confirmed via `git diff 74af66a..HEAD --name-only`: `worldLayoutData.json`, `worldDepth.mjs`, `worldTypes.ts`, `gameConfig.ts`, `Player.ts`, `berthingSlots.ts`, `fleetPresentation.mjs`, `waterCollisionGeometry.mjs`, `destinationNavigation.mjs`, and every locked building/ship PNG appear in **none** of the 13 changed files (2 are new environment PNGs, not locked assets). World dimensions, collision, routes/navigation, berths, and the depth formula are unchanged. `npm test` 35/35 was independently reproduced (Section B), not merely taken on report.

## I. Findings by Severity

### Blocker
None. The app runs, loads, and renders with 0 console/page errors across every captured view.

### Major
None. All three ART-03 Majors are confirmed CLOSED against the actual running application (Sections C–E).

### Minor
1. Rowboat/dinghy-tier contact treatment (`rowboat` entry in `VESSEL_WATER_TREATMENT`: 5–8 px bands) is the most subtle of the four tiers — visibly present under close inspection but understated at normal gameplay zoom. Not a defect (it is deliberately restrained and does close the "untreated" failure), but a candidate for a slightly stronger pass if this tier gets more screen time in a future slice.
2. Carried forward unchanged from ART-03: the illustrated plaza paving still butts directly against the old flat-vector road at the plaza's own north edge, one step outside the locked Harbor Vertical Slice boundary. Out of scope for both ART-04 and this re-check.

### Polish
1. Pre-existing, already-deferred Vite chunk-size build warning — unrelated to this pass.

## J. Corrected 8-Gate Table

`harbor-concept-vertical-slice-independent-visual-qa.md` (ART-03) Section P recorded, per-gate:

```text
ENVIRONMENT_COHESION   = FAIL
TERRAIN_MATERIALITY    = PASS
WATER_BELIEVABILITY    = PASS
SHIP_WATER_GROUNDING   = FAIL
BUILDING_GROUNDING     = PASS
SHORELINE_INTEGRATION  = FAIL
PLACEHOLDER_VISIBILITY = FAIL
CONCEPT_LEVEL_READ     = FAIL
```

That is **5 FAIL / 3 PASS**, not the "4 of 8 fail" stated in that report's own Section P closing line (`Major = 3, and 4 of 8 gates fail`). The original report's per-gate table itself is correct; only its own prose summary undercounted the FAILs by one. This is a documentation correction only — `harbor-concept-vertical-slice-independent-visual-qa.md` is not edited.

Re-evaluated fresh against the current running app (this re-check):

```text
ENVIRONMENT_COHESION   = PASS  (seam and hard water corner both closed; scene reads as one place)
TERRAIN_MATERIALITY    = PASS  (unchanged, sanity-checked)
WATER_BELIEVABILITY    = PASS  (unchanged, sanity-checked)
SHIP_WATER_GROUNDING   = PASS  (all four vessel tiers show restrained, non-oval, tier-appropriate grounding)
BUILDING_GROUNDING     = PASS  (unchanged, sanity-checked)
SHORELINE_INTEGRATION  = PASS  (exposed corner now continuously treated; no new gap elsewhere)
PLACEHOLDER_VISIBILITY = PASS  (the two former asset-boundary seams are no longer visible mockup-like artifacts)
CONCEPT_LEVEL_READ     = PASS  (whole-world and close framings read as one continuous, finished scene)
```

## K. Exact PASS / FAIL Count

```text
PASS = 8
FAIL = 0
```

## L. Final Gate

```text
READY_FOR_HARBOR_VERTICAL_SLICE_HUMAN_REVIEW
```

Conditions met: Blocker 0, Major 0, Major 1/2/3 all CLOSED, 8/8 quality gates PASS, and the actual running application reads as a concept-level continuous scene in the whole-world overview and both close-range QA framings.
