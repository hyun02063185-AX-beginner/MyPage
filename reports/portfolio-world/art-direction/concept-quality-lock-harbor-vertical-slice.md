# Concept Quality Lock — Harbor Vertical Slice
## Portfolio World — Retro Harbor Campus

Date: 2026-09-24 (Asia/Seoul)
Author: Claude Code (Architecture/UX Reviewer)
Branch: `feature/portfolio-world-concept-vertical-slice` (from `feature/portfolio-world-environment-art-completion` @ `8fb9bf2`)

This is a review/specification work unit. No `portfolio-world/src/**`, `portfolio-world/public/assets/**`, `world/**`, or test file was modified to produce it.

---

## A. Canonical Baseline

```text
main / origin/main             = 20dca843c36980405c8c2cb80164fdb9c9d6eb73  (Portfolio World v1.0.0, RELEASED)
feature/...-environment-art-completion HEAD = 8fb9bf2fb94a477deb17f746c7b217e7dc9e9b55
new branch                     = feature/portfolio-world-concept-vertical-slice (from 8fb9bf2)
```

Portfolio World v1.0.0 remains the released baseline; its tag and `main` are untouched by this work unit. All structural, functional, and Human-Accepted milestones (Batch 04 whole-world acceptance, Fleet Native Resolution acceptance, release navigation, collision/routes/depth architecture) are preserved and are **not** reopened by this document.

Before starting, the working tree carried one uncommitted diff in `world/index.html` — a pure CRLF/LF line-ending rewrite of the already-committed production bundle, with no content change. This was build/tooling drift, not in-progress work, and was restored (`git checkout -- world/index.html`) before any review began. `git diff --check` is clean and the tree matches `8fb9bf2` exactly.

## B. Human Quality Reset

The prior Post-v1 Environment Surface Pass (production → whole-world visual QA → Major repair → short re-check) is **TECHNICALLY COMPLETE**: Blocker 0, Major 0, automated harness 35/35, gate `READY_FOR_ENVIRONMENT_ART_HUMAN_REVIEW`. That work is real and is not being invalidated.

New authoritative Human feedback raises the bar past "technically clean" to **concept-image-level finished world**:

1. Mockup-like assets are still visibly present.
2. Terrain still reads as flat color + pattern.
3. Water still reads as a colored surface rather than convincing water.
4. Vessels do not appear physically embedded in water.
5. Visible hull submersion / waterline is missing.
6. Ship-water contact ripples / grounding are weak or absent.
7. Buildings and props read as separate PNGs placed on a map.
8. The scene does not yet feel like one continuous world.
9. Target quality is the level of the original concept-image direction.

Every one of these is independently confirmed against the actual running application in Section D below — this is not a subjective restatement of the feedback, it is verified against source and live screenshots.

## C. Original Concept Reference Search

A dedicated search (filesystem, `git ls-files` on all image extensions, and `git log --all --diff-filter=A/D` across every branch) found **no concept image, mockup, comparison render, or "시안" file anywhere in the repository, working tree or history.**

The only images ever committed are: 3 unrelated website screenshots (`docs/screenshots/`), ~20 unrelated portfolio-project thumbnails (`images/*.webp`), and the Portfolio World production art itself (buildings/ships/props/greenery/calibration renders under `portfolio-world/public/assets/world/harbor/**`).

The phrases "비교 시안 중 1번 시안을 기본 Visual Direction으로 채택" and "Concept Image #1/#2/#3" in `retro-harbor-campus-art-direction-v1.0.md` (lines 51–83, 899–924) are plain-text references to a comparison that evidently happened outside version control (e.g. in an external design/chat session) and were never saved as files here.

```text
ORIGINAL_CONCEPT_REFERENCE = NOT FOUND IN REPOSITORY
```

Per the task's own fallback rule, this does not block the work: the locked Visual Grammar v1.0 (Hybrid Orthographic 2.5D, 15° elevation, 0° yaw), the Scale Bible, the Art Direction v1.0 mood/material language, and the fresh Human feedback in Section B are specific and load-bearing enough to construct a robust provisional quality target without inventing what the missing image looked like. That target is Sections H–M below.

## D. Current Runtime Gap

Verified by reading `portfolio-world/src/world/harborVisualCatalog.ts`, `WorldScene.ts`, `worldAssetManifest.ts`, `worldDepth.mjs`, and by running the actual current build (Vite dev server on the reviewed commit, headless-Chromium screenshots of the project's existing dev-only QA camera framings — the same mechanism prior QA reports used: `?assetPreview=scaleReview&scaleView=world|guild|academy|workshop|exhibition` and `?assetPreview=batch01&batchView=harbor`). No source file was modified to produce this evidence; `npm run dev` and the temporary preview server used to reach it have been stopped and the tree is confirmed clean afterward.

**What is already good, and must not be reopened as art:** Hero Ship D, Brig, Cutter, Schooner, medium sailing vessel, Guild Hall, Academy, Workshop, Exhibition Hall, and the harbor warehouse are genuine painted illustrations (native-res PNGs, locked scale references) and read as a coherent, attractive, "concept-image-like" harbor at a glance. The whole-world composition (four destinations around Harbor Square, waterfront along the south edge) is legible and well-balanced. This is the part of the Human feedback that is **not** being reopened.

**What is confirmed broken, matching every numbered Human finding:**

| Human finding | Root cause found in source | Confirmed live |
| --- | --- | --- |
| 2. Terrain flat color + pattern | `drawHarborGround()` is 100% `fillRect`/`fillEllipse`/`fillRoundedRect` calls: one solid ground fill, ~9 soft-alpha ellipses as "macro material," 9 grass-cluster ellipses, and layered rounded-rects for the two "compacted ground" patches. No illustrated ground texture exists anywhere. | Yes — every captured frame shows a flat green plane with only soft color-blob shading; zero grass/soil/stone surface detail at any zoom. |
| 3. Water = colored surface | `drawWater()` is `fillRect` bands (deep/mid/shallow) plus procedural offset-dash "ripple" strokes and a foam `lineBetween`. No illustrated water art exists. | Yes — water reads as a flat blue rectangle with a thin repeating dash pattern; no depth, caustic, or organic wave quality. |
| 4/5/6. No hull submersion / waterline / contact ripple | The only "waterline" concept in code is `HERO_SHIP_WATERLINE_OFFSET_Y = 18` in `worldDepth.mjs` — a **z-order anchor offset**, not a visual effect. There is no alpha mask, no hull-fade, no contact shadow, no contact-ripple sprite anywhere in the codebase. | Yes — in the harbor waterfront screenshot, every vessel's painted hull ends in a hard sprite edge sitting **on top of** the flat water rectangle; there is no blend, shadow, or ripple at any hull. |
| 7. Buildings/props read as separate PNGs | Confirmed architecturally: `WorldScene.ts` composites illustrated building/ship PNGs via `.image()` directly over the vector-drawn ground/water graphics layer, with no shared grounding treatment. | Yes — buildings sit on the flat green plane with a clean rectangular footprint and no foundation shadow blending them into the terrain. |
| 1/8. Mockup character / not one continuous world | Confirmed as a **material-quality mismatch**, not merely "unfinished": painterly buildings/ships sit directly beside flat-vector props (see below) and a flat-vector plaza grid. | Yes — see prop finding below; this is visually jarring in every capture. |

**Additional finding not explicitly named in the Human feedback but directly relevant to it (and to ART-02 cost):** `portfolio-world/public/assets/world/harbor/props/` and `.../greenery/` already contain a substantial set of *illustrated, `GAME_READY`, manifest-registered* prop PNGs — `cargo-crate-01`, `harbor-barrel-cluster`, `harbor-bench`, `harbor-lamp-01`, `harbor-notice-board`, `harbor-rope-coil`, `harbor-safety-rail`, `harbor-mooring-bollard`, `harbor-service-marker`, `harbor-tree-01`/`harbor-tree-02`, `harbor-shrub-planter`, plus dock details (`dock-rope-line`, `dock-gangplank`, `dock-buoy`, `dock-hand-cart`, `dock-work-net`). Reading `WorldScene.ts`, only a **small, explicitly-named subset of instances** (`guild-edge-tree`, `academy-garden-tree-west`, `workshop-transition-planter`, `exhibition-promenade-planter-east`, plus the dock-detail set) are wired to consume these PNGs via an id-keyed lookup. Every other same-type instance placed through the generic `type`-based dispatch in `drawHarborVisual()` (the large majority of crates, barrels, benches, lamps, notice boards, rope coils, safety rails, mooring bollards, service markers scattered through the world) still falls through to the flat-vector draw case for that type, regardless of the PNG's existence. This is exactly what the live screenshots show: an illustrated crate PNG exists on disk, but most on-screen "crates" are flat brown squares with an X. **This is a wiring gap, not (for these specific families) an art-generation gap**, and it is a low-cost win that should be folded into ART-02 rather than treated as new production.

The Harbor Square plaza (`drawHarborPlaza()`) and the paths/forecourts (`drawHarborPath()`) are also 100% vector fill + stroked grid lines — the visible tile-grid seen in every screenshot of the plaza is this function, not an illustrated stone texture.

## E. Vertical Slice Boundary

**HARBOR VERTICAL SLICE**, unchanged from the brief: Harbor Square south edge, Exhibition Hall, promenade, dock/shoreline, water, Hero Ship, at least one secondary vessel, nearby environmental props. World layout, IA, destinations, and routing are not altered to make this slice easier or smaller than the brief specifies.

This area was chosen (independently re-confirmed, not merely accepted) because it is the one place in the world where terrain, plaza, building grounding, shoreline, water, dock, ship-water contact, scale hierarchy, and prop cohesion are all simultaneously exercised — visually confirmed in the `harbor_waterfront` capture, which shows the Exhibition Hall, its dock plinth, the Hero Ship, four secondary/small vessels, the plaza edge, and open shoreline all in one frame.

## F. Protected Accepted Elements

**Do not redesign or regenerate the underlying design of:**

```text
Hero Ship D silhouette / mast count / sail arrangement       — LOCKED
Brig / Cutter / Schooner / medium-vessel silhouettes         — LOCKED
Fleet hierarchy, mixed facings, furled-sail state             — LOCKED (batch-04-human-acceptance.md)
Guild Hall / Academy / Workshop / Exhibition Hall architecture — LOCKED (native v01/v03 art)
Door scale / entrance geometry                                 — LOCKED
World dimensions (2048×1280), destination locations, forecourts — LOCKED
Collision, routes, navigation, camera, movement                — LOCKED
Depth architecture (worldDepth.mjs band values and formula)     — LOCKED, extend only additively
```

An asset may be simultaneously `LOCKED` (design) and `GROUNDING_REQUIRED` (integration) — e.g. **Hero Ship D design = LOCKED; Hero Ship D water integration = NOT LOCKED.** ART-02 changes how these locked assets *meet the ground and water*, never what they *are*.

## G. Asset Classification

| Component | Classification | Note |
| --- | --- | --- |
| Hero Ship D (art) | FINAL_QUALITY | Design locked; do not touch the PNG itself. |
| Hero Ship D (water integration) | GROUNDING_REQUIRED | No waterline mask, contact shadow, or ripple exists (Section D). |
| Secondary vessels (Brig/Cutter/Schooner/medium, art) | FINAL_QUALITY | Design locked. |
| Secondary vessels (water integration) | GROUNDING_REQUIRED | Same gap as Hero Ship, per-category mask/ripple needed. |
| Small boats / dinghy (currently vector `drawBoat`/`drawLargeShip` fallback in-slice) | REPLACE (wiring) | PNGs exist (`small-workboat-v01`, `harbor-dinghy-v01`); confirm every in-slice small-vessel instance is id/type-wired to its PNG, then apply the same water-integration treatment as above. |
| Exhibition Hall (art) | FINAL_QUALITY | Design locked; dock/plinth base already gives it the best grounding in the world today. |
| Exhibition Hall (grounding) | RETOUCH | Extend the same foundation-contact treatment (Section L) for consistency with the other three destinations once that treatment exists. |
| Dock (main waterfront dock, walkable, currently `drawDock()` vector) | INTEGRATE | Reads acceptably as generic wood decking; needs its water-edge seam replaced by the new shoreline standard, not a full re-art. |
| Promenade / Harbor Square plaza (`drawHarborPlaza`, `drawHarborPath`) | REPLACE | Flat fill + visible grid lines is a P0 "mockup" artifact by the new bar. |
| Terrain (`drawHarborGround`) | REPLACE | No illustrated ground material exists at all. |
| Water (`drawWater`) | REPLACE | No illustrated water material exists at all. |
| Shoreline (implicit — currently just water's own top edge) | REPLACE | There is no distinct shoreline asset family today. |
| Vegetation — the four named tree/planter instances | INTEGRATE | Already PNG-wired; verify palette/scale cohesion against new terrain. |
| Vegetation — all other `tree`/`planter` type instances in-slice | REPLACE (wiring) | Still flat-vector fallback; wire to existing PNGs. |
| Waterfront props (crate/barrel/bench/lamp/notice-board/rope-coil/safety-rail/mooring-bollard/service-marker) in-slice | REPLACE (wiring, not new art) | Illustrated, `GAME_READY` PNGs already exist on disk and are unused for most instances (Section D). |
| Navigation monument, harbor-sign, gangplank, buoy (small accent vector shapes) | KEEP AS PHASER PRIMITIVE | Small, low-visual-weight accents; acceptable under the "debug/collision/subtle effects/small accents" carve-out in the brief. |

## H. Terrain Art Target

Replace `drawHarborGround()`'s procedural fills with authored ground-plate art (illustrated, plan-view, matching the locked "orthographic plan-view geometry" rule for ground/water/paths). Required qualities: a visible grass/soil/stone material read at gameplay zoom (not a single flat hue), soft authored variation between zones (civic stone-adjacent turf vs. workshop/waterfront compacted ground vs. open grass), and worn edge transitions at path/plaza/building boundaries. No visible repeating unit, no visible procedural grid. Existing zone boundaries (civic core vs. workshop/waterfront compacted ground) are already correctly identified in the current code's macro-mass layout and should carry over as the zoning brief for the new art, not be redesigned.

## I. Water Art Target

Replace `drawWater()` with illustrated water art carrying real depth: a deep-water base tone, a shallow nearshore band, soft directional highlight variation, and a harbor-appropriate (calm, not stormy) ripple language — as illustrated texture, not procedural dashes. Must read as a material with visual depth, not a flat rectangle. Must support the shoreline and ship-contact treatments below sitting logically "in" it rather than "on" it.

## J. Shoreline Art Target

A shoreline is not currently a distinct asset family — it must become one. Required: an irregular (non-single-straight-line) land-to-water rhythm, a visible wet-sand/wet-stone transition band, foam/ripple concentrated at the actual edge, and distinct dock-contact vs. open-shoreline treatment (the dock already interrupts most of the current boundary — both cases must be specified, since the slice's south edge contains both).

## K. Ship-water Grounding Standard

This is the most mechanically specific requirement, because "waterline" already means something narrow and wrong in this codebase (a z-order offset only). Required, per vessel category (Hero Ship tier and Medium/Light-medium tier get distinct records, per the existing Scale Bible categories):

```text
waterline position       = the existing hull anchor Y (HERO_SHIP_WATERLINE_OFFSET_Y and its
                            category equivalents) becomes BOTH the depth anchor (unchanged)
                            AND the visual reference row for the layers below.
hull submersion amount    = a fixed per-category px band (derived from the vessel's painted
                            hull curvature at its anchor, not invented) below which the hull
                            is visually treated as underwater.
water occlusion method    = a static, per-vessel-width alpha mask/gradient overlay that fades
                            the lower hull band toward the local water tone — OR the water
                            plate/shoreline overlay drawn in a layer that sits fractionally
                            above the hull's lowest painted pixels at the vessel's placement
                            depth, so real pixels are covered rather than merely tinted.
                            Either is acceptable; a visible hard sprite-edge cutoff (current
                            state) is not.
contact shadow            = a soft, static ellipse/gradient under the hull at the anchor,
                            distinct from and in addition to the occlusion treatment.
contact ripple            = a small, static (non-animated) overlay at the hull's water
                            entry line — restrained, harbor-calm, not a wake.
wake/ripple restraint     = explicitly no animated wake, no dynamic physics-driven ripple;
                            static/authored only, consistent with "no shader/animation" scope
                            already honored by the whole environment-art line of work.
reflection policy         = none required for this slice; do not add a reflection system.
```

Implementation should bundle {hull image, occlusion mask, contact shadow, contact ripple} as a single Phaser Container per vessel instance sharing one depth value from the existing `getVesselDepth()`/`getHeroShipWaterlineY()` formula — this is additive compositing, not a change to the locked depth contract.

## L. Building-grounding Standard

Every destination building needs, at its footprint anchor (`originY`-defined base, already recorded per building in the manifest): a soft contact shadow/darkening at the base, and where applicable (Exhibition Hall today) a visible material transition from building base to plaza/promenade material rather than a flat green-to-white edge. Roof/entrance/vegetation integration should follow the same material language as the new terrain art so buildings stop reading as a cutout PNG on a flat plane. This does not change any building's footprint, collision, or door geometry — it is a grounding overlay only, matching the "additional render layer" carve-out in the brief.

## M. Scene Cohesion Standard

The single biggest, cheapest cohesion win identified in this review is closing the prop-wiring gap in Section D/G: routing the already-produced, already-`GAME_READY` illustrated props (crate, barrel, bench, lamp, notice board, rope coil, safety rail, mooring bollard, service marker, tree/planter variants) to their existing PNGs for every in-slice instance, not just the four hand-picked ones. Beyond that, terrain/water/shoreline/grounding art must share one palette and lighting logic with the existing building/ship art (the existing `visualPalette.ts` families remain the reference) so that the slice reads as one lit scene rather than a PNG collage over a flat-shaded backdrop.

## N. Recommended Environment Production Model

```text
RECOMMENDED = C. HYBRID — large zone plates + shoreline modules + contact overlays
```

**Why not A (one large illustrated environment plate):** the world is a fixed 2048×1280 canvas, so a single full-world plate is technically possible, but it would (a) be heavy against the existing, evidence-based Asset Weight Budget discipline (`retro-harbor-campus-scale-bible-asset-weight-lock-v1.md`) that this project has consistently followed, (b) require full regeneration for any future zone-local edit (violates "maintainable runtime architecture"), and (c) fight the locked plan-view/camera-facing split (ground is plan-view; buildings/ships are camera-facing elevations placed on top of it) by baking building shadows/positions into a single flat image that can't independently move with layout data.

**Why not B (modular tile grid):** this project has already tried a grid-based ground treatment twice (the original visible grass grid, and `drawHarborPlaza()`'s current LOGICAL_UNIT line grid) and both are explicitly named as "mockup-like" by Human feedback. A tiling system risks reproducing exactly the artifact being removed unless tile variety is very high, which raises cost back toward hand-painted plates anyway.

**Why C:** it reuses the production pattern that already works in this project — buildings and ships are large, unique, hand-illustrated PNGs anchored at fixed world positions, and Human Review has already accepted that this reads well. Applying the same idea to a handful of large terrain/water zone plates (Harbor Square core, Academy/Guild/Workshop yards, Exhibition/waterfront zone, one or two generic buffer plates) keeps quality high and asset count low (in the same 6–10 "Primary" tier the Art Direction document already budgets for). Shoreline is treated as a small set of reusable modules (straight / dock-adjacent / corner-foam variants) rather than one giant hand-painted coastline, because the boundary is long and needs irregular rhythm — modules deliver that rhythm at sane production cost via variation and offset, not repetition. Contact overlays (ship occlusion/shadow/ripple, building foundation shadow) are small, per-category, reusable assets composited above the plates — cheap, and they are exactly what Sections K/L specify.

## O. Required Asset Families

| Family | Purpose | Approx. canvas | Alpha | Tiling | Placement | AI-gen appropriate | Post-processing | Format |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `terrain-zone-plate` | Illustrated ground per major zone (civic core, Academy yard, Guild yard, Workshop yard, Exhibition/waterfront yard, 1–2 generic buffer plates) | 400–900 px per side (zone-sized, not full-world) | Soft edge alpha for plate-to-plate blending | Non-tiling, fixed world placement | `BACKGROUND_GROUND` layer, replacing `drawHarborGround()`'s fills | Yes | Palette-match, seam-feather adjoining plates | WebP (large, opaque-heavy) |
| `plaza-path-material-tile` | Small seamless stone/dirt/gravel tile applied along variable-length path/plaza rects | 64–128 px square | No | Yes (seamless) | `GROUND_DETAIL` layer as a `TileSprite`, replacing `drawHarborPath()`/parts of `drawHarborPlaza()` | Yes | Seamless-tile verification | PNG or WebP |
| `water-plate` | Illustrated deep/shallow water for the south waterfront band | One plate spanning the slice's water band (~2000×260 px) | Soft top-edge alpha into shoreline | Non-tiling | `GROUND_WATER` layer, replacing `drawWater()` | Yes | Palette-match | WebP |
| `shoreline-module` (straight / dock-adjacent / corner-foam variants) | Land-to-water wet edge, foam, irregular rhythm | ~256×96 px per variant | Yes (transparent above wet-line) | Repeatable/rotatable along boundary | New layer between `GROUND_WATER` and `GROUND_DETAIL` | Yes | Alpha-edge cleanliness | PNG |
| `ground-contact-shadow` | Building foundation grounding | Width-banded to existing building footprint widths (3–4 size variants) | Yes | No | Under building, above terrain (`GROUND_DETAIL`/`WORLD_OBJECT_BODY` boundary) | Yes (simple gradient) | Alpha-edge cleanliness | PNG |
| `ship-water-occlusion-mask` | Hull submersion illusion per vessel scale tier (Hero, Medium, Light-medium) | Matches each tier's existing display width × ~20–30 px band | Yes (gradient) | No | Composited with hull at `WORLD_OBJECT_BODY`, same depth as vessel | Yes | Color-match to water plate | PNG |
| `ship-contact-shadow` | Soft shadow under hull | Same tiering as above | Yes | No | Same container as occlusion mask | Yes | — | PNG |
| `ship-contact-ripple` | Static entry-line ripple/foam | Small, per tier | Yes | No | Same container, above occlusion mask | Yes | — | PNG |
| `environment-detail-patch` | Small authored ground details (worn stone, grass tuft, puddle) replacing the current flat vector triangles | 24–64 px | Yes | No, fixed authored positions | `GROUND_DETAIL` | Yes | Alpha-edge cleanliness | PNG |

No new binary asset is produced by this document; Section 12/§16 of the brief is honored ("Do not generate them in this task").

## P. Runtime Layer Architecture

No change to `worldDepth.mjs`'s band values or its `depthAtContact` formula (locked; extend only additively per Section F). Mapping of new art onto the existing bands:

```text
BACKGROUND_GROUND (-40000)  -> terrain-zone-plate (replaces macro fillEllipse/fillRoundedRect calls)
BACKGROUND_EDGE   (-20000)  -> unchanged (world-edge boundary highlight; not in scope)
GROUND_WATER      (0)       -> water-plate (replaces drawWater fills)
  + shoreline-module placed at GROUND_WATER with a small stable-tie offset so it draws
    above the water plate and below GROUND_DETAIL
GROUND_DETAIL     (20000)   -> plaza-path-material-tile (TileSprite), ground-contact-shadow,
                                environment-detail-patch (replacing drawHarborPlaza/Path fills
                                and drawHarborNaturalizedGroundDetails triangles)
WALKABLE_STRUCTURE(40000)   -> dock (unchanged geometry; only its water-edge seam changes,
                                consuming the new shoreline-module at its boundary)
LOW_PROP          (60000)   -> crate/barrel/bench/lamp/rope-coil/safety-rail/mooring-bollard/
                                service-marker — wire existing PNGs broadly here, replacing
                                the vector fallback in drawHarborVisual() for these types
WORLD_OBJECT_BODY (80000)   -> buildings, vessels (unchanged depth formula); each vessel
                                becomes a Container of {hull image, ship-water-occlusion-mask,
                                ship-contact-shadow, ship-contact-ripple} sharing one depth value
UPPER_OCCLUDER   (120000)   -> unchanged
LABEL/HTML       (160000+)  -> unchanged
```

This is additive compositing on the existing pipeline: BootScene preloads the new textures the same way it preloads current ones; `worldAssetManifest.ts` gains new entries following its existing hybrid metadata contract (Section Z of the Scale Bible lock); layout/collision/route data is untouched.

## Q. Performance Considerations

The project has an evidence-based Asset Weight Budget (`retro-harbor-campus-scale-bible-asset-weight-lock-v1.md`, Sections W–X) and a current normal production preload of 31 assets / 561,180 bytes. New zone plates and the water plate are the heaviest additions; because they are large but few (6–10 total, matching the "Primary" tier budget the Art Direction document already anticipates), and because the project's own export study shows 1× export at actual display size with WebP/optimized PNG keeps per-asset weight in the tens-to-low-hundreds of KB, a reasonable initial target is **an additional ~400–700 KB of normal transfer for the full terrain/water/shoreline/contact family**, following the same "visual approval first, optimize before broad rollout" principle already locked for this project. This must be measured against real exports during ART-02, not invented here; it is provided as a planning ceiling, not a hard budget lock.

## R. Art Generation Requirements

Every future generation prompt for these families must follow the already-locked Production Prompt Contract (`retro-harbor-campus-visual-grammar-v1.0-lock.md` §31): ground/water/paths generated as **orthographic plan-view** material (not the 15°-elevation camera-facing grammar used for buildings/ships/props), matching `visualPalette.ts`'s established water/wood/stone/greenery families, provenance `generated-original`, transparent-padding and hidden-RGB cleanup rules applied to every alpha asset, and per-asset QA against the locked checklist before anything is marked `GAME_READY`. No asset is generated by this document.

## S. Final Art Quality Gate

```text
ENVIRONMENT_COHESION   = must reach PASS in ART-02
TERRAIN_MATERIALITY    = must reach PASS in ART-02  (currently FAIL: flat fill + ellipse blobs)
WATER_BELIEVABILITY    = must reach PASS in ART-02  (currently FAIL: flat fill + dash pattern)
SHIP_WATER_GROUNDING   = must reach PASS in ART-02  (currently FAIL: no occlusion/shadow/ripple exists)
BUILDING_GROUNDING     = must reach PASS in ART-02  (currently PARTIAL: Exhibition Hall best-in-class, others flat-footed)
SHORELINE_INTEGRATION  = must reach PASS in ART-02  (currently FAIL: no distinct shoreline asset exists)
PLACEHOLDER_VISIBILITY = must reach PASS in ART-02  (currently FAIL: plaza/path grid, flat vector props still dominant)
CONCEPT_LEVEL_READ     = must reach PASS in ART-02  (buildings/ships already close; terrain/water/grounding are not)
```

The slice must not pass if, after ART-02: terrain still looks like flat fill + pattern; water still looks like blue fill + repeated marks; ships still visually float on the water; buildings still look pasted on; shoreline is still a single straight seam; mockup primitives remain in the primary view; assets look visually unrelated; the scene feels scattered rather than composed; or a viewer needs explanation to tell materials apart.

## T. Human Review Policy

No Human Review occurs after this pre-review, during ART-02 asset generation, or after individual assets. The next Human Review happens only after: Vertical Slice assets are produced → runtime-integrated → automated regression (`npm test`, typecheck, build, `git diff --check`) passes → an independent whole-slice visual QA passes → every Blocker/Major visual finding from that QA is closed.

```text
HUMAN REVIEW #1 = DEFERRED UNTIL VERTICAL SLICE QA COMPLETE
```

## U. ART-02 Production Specification

```text
ART-02 — Harbor Concept-quality Vertical Slice Production
```

One grouped production pass covering, together, not fragmented into micro-sprints:

- Environment raster art: terrain zone plates for the slice's zones, plaza/path material tile, water plate, shoreline modules.
- Ship-water integration: occlusion mask + contact shadow + contact ripple for Hero Ship D and every secondary/small vessel visible in the slice; Container-based compositing at existing depth.
- Building-ground integration: foundation-contact treatment for Exhibition Hall (retrofit) and any other in-slice building base.
- Prop wiring: route every in-slice `crate`/`barrel`/`bench`/`lamp`/`rope-coil`/`safety-rail`/`mooring-bollard`/`service-marker`/`tree`/`planter` instance to its existing `GAME_READY` PNG instead of the vector fallback, generating only the categories that turn out to have no existing PNG once the slice's actual instance list is enumerated.
- Runtime layering per Section P; `worldAssetManifest.ts` additions following the existing hybrid metadata contract.
- Asset manifest, production build, and the full existing automated harness (typecheck, `npm test`, build, `git diff --check`).
- A production visual QA pass against Section S's gate before declaring the slice ready for independent QA.

## V. Risks

- **Scope creep into full-world rollout.** ART-02 must stay bounded to the Harbor Vertical Slice; extending zone-plate art to the rest of the 2048×1280 world is explicitly a later phase, not this one.
- **Regenerating locked ship/building designs "for consistency."** The grounding/occlusion work must composite around the existing locked PNGs, not replace them.
- **Falling back to more Phaser primitives under time pressure.** Per the brief's §12/§16, if production-quality image assets cannot be produced, the correct outcome is `NEEDS_ART_ASSET_GENERATION`, not another layer of vector rectangles/ellipses.
- **Asset weight creep.** Large zone/water plates are the single biggest risk to the existing, carefully-measured preload budget; each must be measured (current/1×/2×) the same way prior batches were before being marked `GAME_READY`.
- **Prop-wiring regressions.** Switching many in-slice prop instances from vector fallback to PNG image placement changes their effective visual footprint/anchor; each swap must be checked against the existing overlap/collision-independence invariants the automated harness already tests for.

## W. Final Gate

```text
READY_FOR_CONCEPT_VERTICAL_SLICE_PRODUCTION
```

Codex can begin ART-02 without inventing the final visual-quality standard: the target is fully specified in Sections H–M and K in particular gives exact mechanical requirements (waterline, submersion, occlusion, shadow, ripple) rather than a vague "make it look better" direction.
