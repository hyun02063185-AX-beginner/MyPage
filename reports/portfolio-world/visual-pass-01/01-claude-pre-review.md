# Portfolio World — Retro Harbor Campus Visual Pass 1 — Claude Sonnet 5 Pre-Review

Model: Claude Code — Sonnet 5

## A. Gate

```text
READY_WITH_FIXES
```

The Director Plan is implementable with the smallest safe change set described below. Nothing requires a redesign of Sprint 2's spatial structure. Five concrete, non-blocking findings (all Minor) should be folded into Codex's task brief before implementation starts so they aren't discovered mid-build.

## B. Work Context

- Profile: `HOME_WINDOWS`
- Machine Context ID: `06cd98a5-32c4-40db-a628-5416e4795ed6`
- Branch: `feature/portfolio-world-sprint-02`
- Commit: `7ec9d42` (`docs(portfolio-world): define retro harbor art direction`)
- Git status: dirty — only `reports/portfolio-world/visual-pass-01/` is untracked (this review's own directory, created by the Director Plan commit workflow). No other working-tree changes. This is expected, not a blocker.
- Node: v24.16.0 · npm: 11.13.0

## C. Architecture

```text
HARBOR_VISUAL_CATALOG
```

**Current state.** `WorldScene.ts` (286 lines) already composes rendering, player/input wiring, collision, and camera. Its `drawBuilding` and `drawLandmark` methods contain inline `switch` statements with hand-placed pixel offsets (e.g. `left + 24, top + 28`) per building id / landmark type. For Sprint 2's 4 building silhouettes + 6 landmark types this is still manageable. Visual Pass 1 asks for stone plaza texture, water, dock planks, a boat, and 6–10 new prop types on top of that — continuing to inline this into `WorldScene` would make the switch statements the de facto theme engine, which is worse than naming the seam explicitly.

**Recommendation.** Do not extend the existing catalog files as-is (A), and do not build a general theme interface/registry (C) — there is only one theme in the roadmap and the Director Plan explicitly warns against a "theme engine rewrite." Instead:

- Keep `worldLayout.ts`, `worldTypes.ts`, and `worldLayoutData.json` as the generic placement/data layer — they should stay theme-agnostic (id, x, y, width, height, type, collidable, zone). This is IA-stable data, not visual data, and should remain so.
- Add a new `src/world/harborVisualCatalog.ts` (or `src/world/rendering/harborProps.ts`) that owns the *visual* semantics for harbor-specific `LandmarkType` values: draw functions, labels, and any harbor-only color tokens. `WorldScene` should call into this module through a single lookup rather than growing its own switch statement.
- Extend `LandmarkType` (worldTypes.ts:3–9) with the new harbor prop types, and change `WorldScene.drawLandmark`'s `switch` into a `Record<LandmarkType, (g: Graphics, placement: LandmarkPlacement) => void>` lookup sourced from the new module. A `Record` is checked for completeness by TypeScript; the current `switch` is not (see Finding F-003).
- `landmarkCatalog.ts` keeps its current job (label + category metadata) and simply grows its `Record` with the new types — no restructuring needed there.

This is the smallest change that keeps `WorldScene.ts` a composition root rather than a content author, and it leaves the right seam for a future theme swap: a future theme would ship its own `*VisualCatalog.ts` module and `WorldScene` would import a different one, without touching layout data or scene wiring. That seam costs nothing extra today — it falls out of doing (B) correctly — so there is no need to build an actual theme interface now.

## D. Rendering Strategy

```text
PROGRAMMATIC_ONLY
```

Sprint 2 already proved this pattern end-to-end: 0 binary asset bytes, 5 zones / 4 paths / 4 forecourts / 8 landmarks / 4 edge treatments, all drawn with `Phaser.GameObjects.Graphics` primitives (`fillRect`, `fillCircle`, `strokeTriangle`, `lineBetween`, etc.), including a `water-feature` type that already renders a flat-color rect with two horizontal wave lines. Every Visual Pass 1 requirement maps onto primitives already in use or trivially adjacent to them:

- Stone plaza pattern → alternating-shade `fillRect` tiling over the existing plaza rectangle (same technique as the background grid already drawn in `renderWorld`).
- Water → existing `water-feature` treatment scaled up to a band, same fill + wave-line convention.
- Dock planks → parallel `lineBetween` strokes over a wood-colored rect.
- Boat silhouette → `fillTriangle`/`fillPoints` polygon, same tool already used for the Academy roof.
- Crates/barrels → rect/circle + cross-hatch lines, same convention as the existing bench/planter shapes.
- Lamps, signs, banners → line + circle / line + triangle, direct extensions of `wayfinding-sign`.
- Building differentiation → the per-id switch already exists (triangle roof, columns, circle+dot, framed squares); Pass 1 only needs to add props around them, not replace the technique.
- Central landmark (compass/armillary sphere) → circles + radial lines, well within Graphics' capability and more legible at this scale than a bitmap would be.

Nothing in the Pass 1 list requires texture-mapped sprites, tiling images, or antialiased curves. Recommend Codex stay fully programmatic for this pass.

## E. Asset Policy

```text
MANIFEST_NOT_YET
```

No binary asset is required to satisfy Visual Pass 1 (see D). `07_ASSET_POLICY.md`'s metadata format (Asset ID, source, method, license, status, path) only needs to exist once a first binary lands — building it now would be speculative structure for a need that hasn't materialized, which both the Director Plan and this review's own instructions caution against.

## F. Pixel Scale

```text
KEEP_PIXEL_SCALE_OPEN
```

The runtime has no tile grid or texture atlas today — the player is a 24×32 programmatic rectangle, and `LOGICAL_UNIT = 32` (gameConfig.ts:5) is used purely as a *layout spacing unit* (grid lines, path widths, footprint multiples), not a sprite pixel resolution. Locking a literal `16×16` or `32×32` tile scale now would force adopting tile-based rendering (texture atlas, tilemap) to have any meaning — exactly the "theme engine rewrite" Visual Pass 1 is supposed to avoid, and the Art Direction doc itself lists "exact pixel scale" and "final tile size" as explicitly Still Open (section 28).

Constraints to keep Codex consistent without locking a number:
- Keep `LOGICAL_UNIT = 32` as the spatial/layout grid (unchanged).
- Treat "16-bit inspired" as a *stroke-and-fill language*, not a pixel count: flat fills, no gradients, no anti-aliased freeform curves, chunky outlines in the 2–4px range (matching the existing `buildingStroke`/`collisionStroke` width of 4px and `path` stroke of 2px).
- New harbor props should reuse the existing outline/fill convention (solid fill + stroke, collidable objects get the white diagonal + 4px outline already established) rather than introducing a new visual grammar per prop type.
- Defer an actual literal tile-pixel decision to a Visual Prototype review, as the Art Direction document already states.

## G. Waterfront

**Geometry.** The Exhibition Hall (Gallery) footprint is unchanged at center (1024, 1056), spanning y=992–1120. World height is 1280, and the existing `edge-south` decoration band occupies y=1216–1280 (64px). That leaves a 160px vertical corridor (y=1120–1280) between the building's south face and the world edge — currently just generic tree-line edge decoration. This is enough for a "waterfront hint," not an open sea, which matches the Director Plan's own framing ("완전한 최종 구현이 아니라 '항구라는 인식이 즉시 생기는 정도'"). **No Gallery coordinate change is needed.**

Recommended split of that 160px: ~48–64px dock strip immediately south of the building (extending the existing `forecourt-gallery` node), then a ~96–112px water band replacing the current south-only edge decoration (keep north/east/west edges as their existing tree-line treatment — don't re-theme edges that aren't part of the harbor story). Water band width can run the full 2048px world width for visual continuity, but only needs functional presence near the dock corridor.

- **Water behavior:** `MIXED`. Mostly visual per the Director Plan's "Visual Density != Collision Density" principle, but the dock's outer (south) edge should carry a thin collidable boundary so the player can't visually "walk into the sea." This is the same pattern already used for the Sprint 2 `water-feature` landmark (`COLLIDABLE_LANDMARK_TYPES` already includes it).
- **Dock behavior:** the dock deck itself is a walkable, non-collidable surface (the point is to let the player reach it); only the water-facing boundary is collidable, not the whole dock footprint.
- **Collision treatment:** keep the water collider narrow (a strip, not a filled zone) and set back far enough from the building that a comfortable walkable buffer remains between the Gallery's south wall and the water edge — don't let it wrap laterally and seal the path corridor. The existing manual world-edge clamp (`Player.constrainToWorldBounds`) remains the outermost safety net unchanged.
- **Trapping avoidance:** the south path is only 64px wide and the forecourt 128px; make sure the new water collider's width is at least as generous as the dock strip so the player always has room to turn around, and never place collidable props (mooring posts, crates) directly in the single-file path/forecourt corridor.
- **Camera legibility:** at 1024×576 logical resolution against a 2048×1280 world with `setBounds`, the camera will show world rows 704–1280 once the player is near the south edge — which comfortably contains the Exhibition Hall (992–1120), dock, and water band in one frame. The "Harbor Square → Exhibition Hall → Dock → Sea" reveal is legible as the player walks south; no camera change is needed.

One existing-data note: `worldLayoutData.json:29` already has a `south-water-feature` landmark at (1088, 888) — a small generic accent near the path midpoint, well north of the new water band. Clarify with Codex whether to keep it as a minor unrelated accent or fold it into the new waterfront so there isn't a confusing second "water" object (see Finding F-004).

## H. Destination Silhouettes

All four buildings already have a distinct silhouette technique in `WorldScene.drawBuilding` (WorldScene.ts:209–226); Pass 1 should extend each, not replace the mechanism.

| Destination | Silhouette cue (existing, extend) | Entrance cue | Emblem/sign cue | Props |
|---|---|---|---|---|
| Guild Hall (career) | Column trio (existing) → heavier/grounded base, thicker outline | Wide, short doorway gap in outline | Small crest/shield shape above entrance | Notice board + 1 crate |
| Academy (lecture) | Triangle/gable roof (existing) → slight vertical accent line | Clean, centered entrance gap | Book-like symbol or vertical banner pair | Small planter/garden at forecourt |
| Workshop (ai-lab) | Circle + dot (existing) → change outer roofline to a sawtooth/shed profile to read as "open bay" | Gap on one side of the outline (open work bay) | Small crane silhouette (post + diagonal boom line) | Crate + barrel cluster |
| Exhibition Hall (gallery) | Framed squares (existing) → widen forecourt, keep symmetric frame motif | Broad, centered entrance | Display-board rectangle | Waterfront-facing banner |

Each destination gets ≥2 non-color cues (silhouette shape + one prop/emblem), satisfying the wayfinding requirement without new building art.

## I. Harbor Asset Set

**Recommended types (8, not 10):** crate, barrel, mooring-post/rope, harbor sign, lamp, dock segment (walkable, drawn not collidable), plus reuse of the existing `bench-cluster` and `planter` types. Small boat is required separately by the waterfront section (not a generic "prop," it's the single waterfront-defining silhouette). Small market stall is optional — see Finding F-001; if included, compose it from the same crate+sign primitives rather than authoring a new draw routine.

**Collidable vs. decorative**, consistent with Sprint 2's existing pattern (only 2 of 6 landmark types are collidable today):
- Collidable: buildings (unchanged), `planter` (existing precedent), the new water boundary strip.
- Non-collidable by default: crate, barrel, mooring-post/rope, harbor sign, lamp, bench, dock segment, boat, market stall.

**Shared primitives:** implement a small set of generic draw helpers (box, cylinder/barrel, post, banner, roofline) in the new `harborVisualCatalog.ts` and compose the 8 types from them — mirrors how Sprint 2 already reuses `fillCircle`/`fillRect` across landmark types, and avoids one bespoke draw routine per prop.

## J. Density

The Art Direction's 6–10 / 15–25 / 30–50 targets (section 15) are explicitly for the **final** world across all five zones — applying them to a Pass 1 that only touches Harbor Square + waterfront would silently absorb Pass 2/3 scope. Recommended Pass-1-scoped target:

```text
Primary visual structures:  6–8   (4 buildings + central landmark + dock + water band)
Secondary props:           12–18  (benches, planters, lamps, signs, mooring posts, boat, crate/barrel clusters — Harbor Square + waterfront only)
Detail props:               15–25 (small crates, ropes, small signs, flowers — sparing, "representative" not exhaustive)
```

This is roughly the Secondary/Detail budget for 2 of 5 zones, which is proportionate.

## K. Performance

```text
MINOR_RENDER_BATCHING
```

Production main JS is already 1,385.82 kB / 361.15 kB gzip (91_STATUS.md), almost entirely Phaser's own runtime, not scene content — this is a pre-existing, already-tracked follow-up, not something Pass 1 should try to fix. Scene object count would grow from ~26 placements today to roughly 60–90 with the Pass 1 prop budget above, which is still trivial for Arcade Physics/Graphics at this scale — no architecture change is warranted.

The one guardrail worth stating: `WorldScene` currently allocates a fresh `this.add.graphics()` per building and per landmark (WorldScene.ts:205, 239). At ~90 objects this is still fine, but Codex should avoid multiplying that 1:1 further — group static, non-interactive decorative shapes that share a depth layer (e.g. all Harbor Square ground detail) into fewer shared `Graphics` instances where convenient, rather than one `Graphics` object per individual prop instance. This is advisory, not a blocking requirement for Pass 1.

## L. QA

```text
ADD_SMALL_DATA_TESTS
```

Current automated coverage (`spatial-layout.test.mjs`, `foundation.test.mjs`) is data/build-contract validation only — no Playwright, and none is needed here since Pass 1 changes visuals and adds data, not interaction logic. Minimum additions:

- Extend `layoutValidation.mjs`'s `COLLIDABLE_LANDMARK_TYPES` whitelist to include any new collidable harbor type (e.g. a water-boundary/dock-edge type), and add a test case asserting an unlisted new type is still rejected (mirrors the existing "Unexpected collidable landmark" test).
- Add bounds/duplicate-ID coverage for the new landmark instances the same way existing ones are covered — this falls out of the existing generic validator automatically once new entries are added to `worldLayoutData.json`, so it mainly needs a assertion that the new types round-trip.
- No Playwright: nothing in Pass 1 introduces new interactive/state logic that unit + manual QA can't cover.

Manual evidence remains the primary judgment tool per the Director Plan's own Human Feel Test (section 18) — that is correctly scoped and doesn't need automation.

## M. Accessibility / Wayfinding

No regression risk identified: the ARIA region, exit link, and coarse-pointer fallback live in `index.html`/`world.css` outside the Phaser canvas and are untouched by adding Graphics-drawn props inside it. In-canvas `Text` objects (building/plaza/landmark labels) are already used today and aren't newly exposed to assistive tech beyond the existing canvas ARIA region — no additional accessibility consideration needed for more of the same pattern. Required non-color cues per destination are listed in section H above (silhouette + prop/emblem, 2 each minimum).

## N. Findings

```text
ID: F-001
Severity: Minor
Finding: The Director Plan's Visual Pass 1 "Representative Asset Set" (crate, barrel, rope, harbor sign, lamp, market stall) overlaps almost entirely with the Art Direction document's own Visual Pass 3 "Environmental Storytelling" list (market, crates, barrels, ropes, plants, lamps, small cargo).
Evidence: retro-harbor-campus-art-direction-v1.0.md section 26 (Visual Pass 3 scope) vs. 00-director-plan.md section 10 (Visual Pass 1 asset set).
Recommended action: Keep the item *types* in Pass 1 (they're needed to sell "harbor"), but cap instance counts to the representative range in section J above, and have Codex's evidence report explicitly state that full market/cargo density is deferred to Pass 3 — otherwise Pass 1 risks quietly delivering Pass 3's scope.

ID: F-002
Severity: Minor
Finding: The collidable-landmark whitelist and the landmark type union must be updated together, or new harbor prop types will either fail runtime validation or silently be treated as non-collidable.
Evidence: layoutValidation.mjs:1 hardcodes `COLLIDABLE_LANDMARK_TYPES = new Set(["water-feature", "planter"])`; worldTypes.ts:3-9 `LandmarkType` is a closed union with no default/never-check anywhere it's consumed.
Recommended action: any new collidable harbor prop type must be added to both the `LandmarkType` union and `COLLIDABLE_LANDMARK_TYPES` in the same change, or `validateWorldLayout` will throw "Unexpected collidable landmark" at runtime/build.

ID: F-003
Severity: Minor
Finding: `WorldScene.drawLandmark`'s `switch (landmark.type)` has no `default`/exhaustiveness check, so a forgotten case for a new harbor type renders nothing instead of failing loudly.
Evidence: WorldScene.ts:243-270.
Recommended action: when extracting to `harborVisualCatalog.ts` (see section C), use a `Record<LandmarkType, DrawFn>` lookup instead of continuing the switch — TypeScript enforces completeness on a `Record` keyed by a closed union, catching a missing case at compile time.

ID: F-004
Severity: Minor
Finding: The Sprint 2 `south-water-feature` landmark is a small generic accent near the path midpoint (y=888), not the new Harbor waterfront/sea (y≈1120-1280) — risk of confusing overlap or an orphaned duplicate "water" object once the real waterfront ships.
Evidence: worldLayoutData.json:29 (`south-water-feature`, x=1088 y=888).
Recommended action: Codex's task brief should explicitly state whether this placeholder is kept as an unrelated minor accent, repurposed, or removed.

ID: F-005
Severity: Minor
Finding: Zone labels in the layout data still use Sprint 1/2 naming ("North · Lecture Studio" etc.), not the Harbor Campus names the Director Plan's own silhouette section (9) already uses (Guild Hall / Academy / Workshop / Exhibition Hall).
Evidence: worldLayoutData.json:4-8 vs. 00-director-plan.md section 9.
Recommended action: update only the `label` strings to the Harbor Campus names; keep `id` values (`plaza`/`lecture`/`career`/`ai-lab`/`gallery`) unchanged since tests, collision code, and the IA mapping key off `id`, not `label` — this is a pure display-string change with zero structural risk.
```

## O. Final Visual Pass 1 Scope

- Extend `worldLayoutData.json` with new harbor landmark instances (dock, water band boundary, crates/barrels/lamps/mooring posts/boat/market accents) per the density budget in section J, and update the four destination zone `label` strings to the Harbor Campus names (F-005).
- Add `src/world/harborVisualCatalog.ts` (or equivalent) holding a `Record<LandmarkType, DrawFn>` for all harbor prop types, replacing `WorldScene.drawLandmark`'s switch with a lookup into it (section C, F-003).
- Extend `LandmarkType` (worldTypes.ts) and `LANDMARK_CATALOG` with the new types; extend `COLLIDABLE_LANDMARK_TYPES` in `layoutValidation.mjs` for any newly-collidable type (F-002).
- Extend `WorldScene.drawBuilding`'s per-id cases with the additional silhouette/entrance/emblem cues in section H — same technique, more detail, no new mechanism.
- Add a stone-plaza fill pattern to `drawPlaza` and a water/dock rendering pair for the new south waterfront band, all via `Graphics` primitives (section D, G).
- All new props non-collidable by default except the water boundary strip and any new large planter, per section I.
- Extend `spatial-layout.test.mjs` coverage for the new collidable type whitelist (section L).
- No Tiled, no binary assets, no manifest, no pixel-scale lock, no theme interface.

## P. Explicit Non-Scope

```text
Portal navigation
Portfolio page routing
Building interiors
NPC
Dialogue
AI NPC
Quest
Combat
Audio
Final player sprite
Final pixel asset pack
Night mode
Full-world decoration
```

Confirmed: nothing in the Director Plan's In Scope (section 5) or the asset/rendering recommendations above touches any of these. The one item worth a second look is density creep toward "environmental storytelling" (F-001) — capped, not blocked.

## Q. Evidence Required After Implementation

- Typecheck / build / test pipeline PASS (unchanged commands).
- Preview screenshots: (1) Harbor Square wide view, (2) waterfront/dock view from the south path, (3) a single frame showing all four destination silhouettes for comparison.
- Manual movement/collision confirmation: player can approach all four buildings, the dock, and the water boundary without trapping; non-collidable props (crates, benches, signs, lamps) don't block movement; existing Sprint 2 collision behavior (building faces) is unchanged.
- Performance numbers: main JS bytes, gzip bytes, new binary asset bytes (should remain 0), approximate scene object count before/after.
- Updated `worldLayoutData.json` diff and the new landmark type list, so the Director/user can see exactly what was added against the section J budget.
- Confirmation that `south-water-feature` (F-004) was explicitly kept/repurposed/removed, not left ambiguous.

## R. Director Recommendation

```text
DESIGN_FIX_REQUIRED
```

The plan is sound and the architecture is ready for it with the smallest safe change set described above. "Fix required" here means: fold findings F-001 through F-005 into Codex's task brief (all are small, concrete, and already have recommended actions in section N) — none require redesigning the Director Plan itself or reworking Sprint 2's spatial structure.
