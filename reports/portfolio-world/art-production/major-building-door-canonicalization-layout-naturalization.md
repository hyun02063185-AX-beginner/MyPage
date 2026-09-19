# Major Building Door Canonicalization + Harbor Layout Naturalization

## A. Gate

```text
FULL_ASSET_ROLLOUT = HOLD
FINAL_GATE = READY_FOR_DOOR_LAYOUT_HUMAN_REVIEW
```

## B. Work Context

2026-09-20; `feature/portfolio-world-sprint-02`; HOME_WINDOWS; Node `v24.16.0`; npm `11.13.0`.

## C. Starting Commit

`73be1d7 docs(portfolio-world): record scale recalibration and 15deg audit`.

## D. Human Review Source

The authoritative focused review accepts the 15° direction, names Guild Hall's visible entrance as the canonical human-scale cue, rejects prior nominal-ratio equivalence, and asks for a less cardinal, more settlement-like harbor campus without compromising navigation.

## E. Canonical Guild Hall Door Measurement

Runtime Guild Hall is `338×204`; its visible mass is `330×196`. The usable dark double-door opening is `42×52 px`; the outer frame is `56×64 px`. The player canvas is `24×32 px`, with a visible body of `20×28 px`. Canonical comparison uses the `42 px` opening: `1.75×` canvas width or approximately `2.10×` visible-body width. The frame and decorative surround are not interchangeable with the opening.

## F. Prior Ratio Mismatch Diagnosis

The former records mixed outer frames, arches, split shutters, and decorative surrounds with the actual usable opening. Academy's tall arch was counted as a broad entrance, Workshop's open work bay was treated as one door, and Exhibition's decorative frame was wider than its door leaves. They also used the player canvas rather than its `20 px` visible body. Thus Guild and Academy could both be labelled `2.08×` while their actual openings visibly differed. This pass remeasures at runtime 1× and excludes frames, steps, glazing, and surround.

## G. Guild Hall

Guild Hall v01 is retained unchanged as the reference. Its `42×52 px` opening, `56×64 px` frame, and moderate civic mass define the visual comparison.

## H. Academy

Academy is regenerated as v03, retaining its observatory dome, lantern tower, broad institutional silhouette, and 15° frontal grammar. Its opening changed from an approximately `34×50 px` internally undersized door to `42×52 px`; the frame is now `58×64 px`. Building display remains `370×216`.

## I. Workshop

Workshop v03 preserves the compact practical footprint and maker identity. The oversized approximately `64×49 px` work bay is replaced by a `42×50 px` framed double-leaf entrance with a `52×58 px` frame. Display remains `291×170`.

## J. Exhibition Hall

Exhibition Hall v03 preserves its broad waterfront gallery mass and side display windows. The thin approximately `28×56 px` entrance becomes a `42×52 px` broad double-leaf entrance with a `52×62 px` frame. Display remains `356×218`.

## K. Door Canonicalization Results

The three corrected usable openings are `42 px` wide, matching Guild Hall's visible opening at runtime. Academy remains larger, Workshop smaller, and Exhibition wider; only their internal human cue has been canonicalized.

## L. Building Internal Proportion Changes

Targeted original-art regeneration was used because whole-image scaling could not correct door-to-window/floor relationships. Final exports use uniform scaling after small transparent-edge crops; no PNG is non-uniformly stretched. They retain the locked 1× canvas sizes, alpha cleanup, and asset ceiling.

## M. Same-class Scale Consistency

`SAME_CLASS_SCALE_CONSISTENCY = REQUIRED`. Major buildings use the Guild visible opening and player body as the common cue. Ships, trees, and props retain their prior approved relative scale; no random layout-driven scaling was applied.

## N. Layout Naturalization Principles

Underlying walkable rectangles remain deliberately clean. Naturalization is visual-first: varied frontage setbacks, unequal offsets, asymmetric square furnishing, and fixed paving shoulders soften the grid while retaining obvious approaches.

## O. Building Placement Changes

Render-only offsets after the existing town translation are: Guild `224,544 → 196,536`; Academy `1024,128 → 1052,120`; Workshop `1824,544 → 1792,552`; Exhibition `1024,960 → 1048,968`. Guild is comparatively formal but left-shifted; Academy is slightly calmer/set back; Workshop sits closer to its service edge; Exhibition reinforces the waterfront relationship. Semantic footprints remain at their original positions.

## P. Path / Forecourt Changes

All corridor and forecourt rectangles remain unchanged. Low-depth fixed paving triangles, shoulder strips, and short edge marks at the north, south, west, and east approach transitions break perfectly ruler-straight visual edges without affecting collision or route geometry.

## Q. Harbor Square Changes

The central landmark remains. Planters, benches, lamps, sign, and kiosk were shifted to intentionally unequal positions; two small paving wedges and edge strips reduce mirror symmetry without cluttering the orientation space.

## R. Support-zone Changes

Existing crates, benches, lamps, trees, and maker-yard elements remain the support vocabulary. No mass prop generation occurred. Workshop's closer visual frontage and asymmetric square detail reduce empty-grid reading while preserving the existing support layout and assets.

## S. Collision / IA Protection

No collision, destination ID, route, interaction semantic, water carve-out, player movement, or world boundary changed. Rendering derives an offset copy of a building; environmental colliders continue to use the unmodified `WORLD_LAYOUT.buildings` footprints.

## T. Ship Preservation

Hero D, Brig, Cutter, Medium Vessel, and programmatic working boats are unchanged. The previous 15° and hierarchy acceptance remains applicable; no naturalization conflict required vessel work.

## U. Before / After Measurements

| Building | Door opening before | Door opening after | Guild-relative opening | Display before/after | Position before/after | Collision changed? |
| --- | --- | --- | --- | --- | --- | --- |
| Guild Hall | 42×52 | 42×52 | 1.00× | 338×204 / 338×204 | 224,544 / 196,536 visual | No |
| Academy | 34×50 | 42×52 | 1.00× | 370×216 / 370×216 | 1024,128 / 1052,120 visual | No |
| Workshop | 64×49 | 42×50 | 1.00× width | 291×170 / 291×170 | 1824,544 / 1792,552 visual | No |
| Exhibition Hall | 28×56 | 42×52 | 1.00× | 356×218 / 356×218 | 1024,960 / 1048,968 visual | No |

All post-change doorway measurements have medium confidence (`±2 px`) from antialiasing and door-leaf shading. First-floor visual height remains coherent: Guild ~68 px, Academy ~70 px, Workshop ~68 px, Exhibition ~68 px.

## V. Runtime Visual Review

DEV-only `assetPreview=scaleReview` uses consistent `1.1` zoom views for Guild, Academy, Workshop, and Exhibition with the player at the visible façade center. A `world` view confirms four approaches, an asymmetric Harbor Square, north/east/west relationships, and Exhibition's south waterfront/dock connection. Built production code still removes this query handling.

## W. QA

`npm ci` reports 0 vulnerabilities; `npm test` passes `24/24` after typecheck and production build; `npm run build` passes; and `git diff --check` passes. The production build emits `index-D1DqT7ZX.js` at `1,425.60 kB` (gzip `370.18 kB`); the existing Vite >500 kB advisory remains non-blocking. Academy v03 is `79,265` bytes, Workshop v03 `56,423`, Exhibition v03 `70,064`; each is within the locked destination `138,240`-byte ceiling and has zero hidden RGB in fully transparent pixels.

## X. Remaining Findings

Destination art still intentionally overhangs the fixed `256×128` collision footprints in places; this existing collision-independent limitation is unchanged. The exact aesthetics of the new entrance treatments require human acceptance.

## Y. Human Review Required

Compare A-D door views first, then whole world and waterfront views. Confirm the visible openings, step/floor relationships, and varied setbacks feel like one harbor campus without homogenizing building mass. Do not use this review to authorize full rollout.

## Z. Final Gate

```text
READY_FOR_DOOR_LAYOUT_HUMAN_REVIEW
```
