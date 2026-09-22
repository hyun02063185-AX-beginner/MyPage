# Mass Asset Production Batch 01 — Independent Review

> Canonical repo path:
> `reports/portfolio-world/art-production/mass-asset-production-batch-01-independent-review.md`

Reviewer: Claude Code (independent; did not implement Batch 01). Scope: Batch 01 only. No runtime code, asset, layout, or
collision file was modified during this review. All measurement scripts, servers, and screenshots lived in the session
scratchpad, outside the repository.

---

## A. Gate

```text
READY_FOR_BATCH_01_HUMAN_REVIEW
```

All eight required assets are present, correctly integrated, and comply with the locked visual grammar, scale bands, export
standard, and depth policy. Cross-asset coherence is strong. QA is 21/21, BASE_URL loading is safe, and collision/IA/layout are
byte-identical to the pre-batch commit. No Blocker or Major finding. Five Minor findings are recorded (documentation staleness,
manifest hygiene, and test-coverage gaps) — none touch visual, functional, or budget correctness.

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Branch | `feature/portfolio-world-sprint-02` (expected) |
| HEAD at start | `b89e168 docs(portfolio-world): record mass asset production batch 01` |
| Git status at start | dirty — one expected untracked file only |
| Node / npm | `v24.16.0` / `11.13.0` |

The only untracked item was `reports/portfolio-world/art-direction/retro-harbor-campus-mass-asset-production-director-gate.md`,
matching the instruction's expectation. No unexpected runtime modification was present, so the review proceeded without
stopping. No stale `vite preview` process blocked `npm ci` this time.

---

## C. Reviewed Range

`<batch01-base>` is `fdebe39` (`docs(portfolio-world): lock scale bible and asset budgets`) — the commit immediately preceding
`871f033`, and the exact commit the implementation report cites in its own Section C ("Starting Commit"). Reviewed range:
`fdebe39..HEAD` (commits `871f033`, `b89e168`).

Diffed directly: `portfolio-world/src` (BootScene, WorldScene, worldAssetManifest, new `batch01AssetAudit.json`),
`portfolio-world/public/assets` (12 new/replaced PNGs), `portfolio-world/tests` (asset-loading update, new
`batch01-asset-policy.test.mjs`). Confirmed **zero diff** in `worldDepth.mjs`, `worldDepth.mjs.d.ts`, `harborVisualCatalog.ts`
(depth wiring only — no new draw functions), `worldLayoutData.json`, `layoutTransform.mjs`, `layoutValidation.mjs`,
`waterCollisionGeometry.mjs`, `visualPalette.ts`, `config/gameConfig.ts`, and `player/Player.ts`.

Records read in full: Director Gate, Visual Grammar v1.0 and lock, Scale Bible + Asset Weight Lock v1, Depth/Occlusion v1.1
short recheck, the Batch 01 implementation report, `07_ASSET_POLICY.md`, `91_STATUS.md`, `92_HANDOFF.md`.

---

## D. Director Gate Reconciliation

The file exists at `reports/portfolio-world/art-direction/retro-harbor-campus-mass-asset-production-director-gate.md`,
untracked. It is an authentic Director Gate, not an execution-only instruction: it sets
`MASS_ASSET_PRODUCTION_GATE = OPEN`, `BATCH_01 = AUTHORIZED`, `FULL_WORLD_ROLLOUT = NOT_YET_AUTHORIZED`, names the exact eight
categories Batch 01 implements, and states the harbor-composition constraints Batch 01 respected (no dock/basin/fleet-count/
route/collision redesign — confirmed true in section X). Its content matches what was actually built: eight categories, no
Hero D regeneration, Exhibition Hall untouched except the export-normalization step the Scale Bible explicitly allows. One
cosmetic note: the file's own header says its "Recommended repo path" is
`...mass-asset-production-gate.md` (without `-director-`), which does not match its actual filename; this is the file to keep,
not a duplicate, and it is staged under its actual filename in this review's commit (section AC/Git Policy).

---

## E. Batch Scope

```text
BATCH_SCOPE_PASS
```

All eight assets are present, wired into the actual runtime (not just the manifest), and independently measured (see R for the
full byte/dimension table):

| # | Category | Runtime path | Provenance | Status | Depth class (actual code) |
| - | --- | --- | --- | --- | --- |
| 1 | Guild Hall | `buildings/guild-hall-v01.png` | generated-original | GAME_READY | `getBuildingDepth` (WORLD_OBJECT_BODY) |
| 2 | Academy | `buildings/academy-v01.png` | generated-original | GAME_READY | `getBuildingDepth` |
| 3 | Workshop | `buildings/workshop-v01.png` | generated-original | GAME_READY | `getBuildingDepth` |
| 4 | Harbor Warehouse | `buildings/harbor-warehouse-v01.png` | generated-original | GAME_READY | `getHarborVisualDepth` → WORLD_OBJECT_BODY |
| 5 | Medium Sailing Vessel | `ship/medium-sailing-vessel-01-v01.png` | generated-original | GAME_READY | `getVesselDepth` (waterline contact) |
| 6 | Tree / Greenery | `greenery/harbor-tree-01-v01.png` | generated-original | GAME_READY | `getHarborVisualDepth` → WORLD_OBJECT_BODY |
| 7 | Crate | `props/cargo-crate-01-v01.png` | generated-original | GAME_READY | `getHarborVisualDepth` → LOW_PROP |
| 8 | Harbor Lamp | `props/harbor-lamp-01-v01.png` | generated-original | GAME_READY | `getHarborVisualDepth` → LOW_PROP |

Each replaces exactly the one designated placement the report claims (`career`/`lecture`/`ai-lab` zones, `harbor-warehouse`,
`harbor-west-cargo-schooner`, `academy-tree`, `dock-crates-west`, `waterfront-viewing-lamp`); confirmed both from the
`WorldScene.ts` switch statements and by live headless-browser inspection at each exact location (section Z). Every other
existing placement of the same category (other crates, other lamps, brig, cutter's role, other small boats) remains
programmatic or its prior asset, exactly as scoped.

---

## F. 15° Grammar Review

```text
CAMERA_GRAMMAR_PASS
```

Direct visual inspection (not metadata) of all eight assets, live in the running scene:

- **Guild Hall, Academy, Workshop:** each shows a dominant camera-facing facade with a pitched roof visible above at a
  consistent, moderate tilt — the same apparent elevation as the existing Exhibition Hall when framed side by side (section K).
  No building reads as a flat elevation or a top-down plan.
- **Medium Sailing Vessel:** hull side dominant, ~35–40% of the image as a foreshortened deck band (wheel, hatch, rail
  visible), two masts vertical, sails flat and readable, bow/stern distinguishable by silhouette — the same grammar as Hero D
  and the existing brig/cutter, at a comparable degree of "looking down."
- **Warehouse, Tree, Crate, Lamp:** all read at the same elevation family — top-partially-visible for the warehouse roof,
  rounded canopy-with-visible-top for the tree, top+front for the crate, vertical body with a visible fixture for the lamp.

No asset breaks the horizon-free, plan-ground / elevated-object hybrid the lock established.

---

## G. Cross-asset Coherence

```text
CROSS_ASSET_COHERENCE_PASS
```

Viewed together (harbor-wide and all-four-destinations frames, section Z), the eight assets read as one world:

- **Material/palette family:** every building shares the same cream/ivory wall stone, gold trim, and a roof drawn from one of
  two families (teal-slate on Guild Hall and Academy, terracotta-orange on Workshop, matching the existing Exhibition Hall).
  The medium vessel shares Hero D's dark-wood hull, teal trim, and ivory-sail language.
- **Identity by silhouette/iconography, not color alone:** Guild Hall (anchor emblems, banners), Academy (observatory dome,
  armillary sphere finials), and Workshop (open doorway showing a workbench and gear signage) are each distinguishable by
  massing and iconography even though two share a roof-color family with another destination. This matches the project's own
  wayfinding rule (`08_ENVIRONMENT_POLICY`-adjacent Art Direction §18: destinations must carry at least two visual cues and
  must not be distinguished by color alone) — the shared palette is the intended outcome of that rule, not a coherence defect.
- **Lighting/shadow/detail density:** all eight assets use the same soft, warm-daylight shading with no directional shadow
  cast on the ground plane (consistent with the locked "baked shading, no baked cast shadow" rule) and a comparable, moderate
  level of painterly detail — none of the eight is noticeably flatter or busier than its neighbors at runtime display size.

---

## H. Guild Hall

```text
GUILD_HALL_PASS
```

Tier 1 (drawn through `getBuildingDepth`, same as the other three destinations). Primary facade dominant with a large central
double door and rose window; roof partially visible at a consistent 15°-family tilt; nautical guild identity (anchor emblems on
banners, warm wood trim) without reading as a fantasy castle (no towers, crenellation, or oversized ornament). Practical
content 330×196 px / 10.31×6.13 LU — inside the locked 320–340×190–205 destination-building band (independently confirmed,
section R).

## I. Academy

```text
ACADEMY_PASS
```

Tier 1. Distinct scholarly identity from an observatory dome and twin armillary-sphere finials — a specific "study of the sky
and navigation" identity, not generic stock schoolhouse art. Camera grammar matches its siblings. Practical content
330×190 px / 10.31×5.94 LU — inside the locked band.

## J. Workshop

```text
WORKSHOP_PASS
```

Tier 1. The open double doors reveal an interior workbench, tools, and lamps — a genuine "making" cue — with a visible gear
emblem and hanging tools reinforcing the AI Lab/Making identity without breaking the world's material language (same wood,
stone, and warm-metal accents as every other building). Camera grammar matches its siblings. Practical content
330×190 px / 10.31×5.94 LU — inside the locked band.

---

## K. Destination-building Balance

```text
DESTINATION_BUILDING_BALANCE_READY_FOR_HUMAN
```

Measured practical content for all four destinations lands within 6 px of each other in both axes (Guild 330×196, Academy
330×190, Workshop 330×190, Exhibition Hall 324×196 — recomputed independently, section R), so the four are technically
balanced: none is scaled up or down relative to the locked band, and roof-to-facade proportions are consistent across all
four (each shows a similar fraction of roof versus wall). Against Hero Ship D, the destination buildings remain visibly
smaller than the hero's overall sail silhouette while the Exhibition Hall stays the deliberately hero-comparable "visible mass"
reference the Scale Bible locked (Hero D : Hall visible-area ratio 1.38, unchanged by this batch).

One observation for the human aesthetic decision, not a technical defect: Academy's dome and twin finials give it a slightly
busier, more vertically ornamented silhouette than the other three at a glance, even though its measured footprint is the
smallest of the four. Whether that reads as "Academy dominates" is exactly the kind of call this review does not make.

---

## L. Warehouse

```text
WAREHOUSE_PASS
```

Tier 2, drawn through `getHarborVisualDepth` (WORLD_OBJECT_BODY band, same as before — no depth policy change). Visibly
subordinate to all four destination buildings in the harbor-wide and warehouse/dock frames (section Z): simple stone-and-wood
mass, a single roll-up door, no ornament competing with Tier 1 architecture. Practical content 160×92 px / 5.00×2.88 LU — inside
the locked 152–160×90–96 support-building band, at the upper end of the width range. Anchor and depth classification are
unchanged from the pre-batch programmatic warehouse's contract.

---

## M. Medium Sailing Vessel

```text
MEDIUM_VESSEL_PASS
```

Scale: practical content 160×113 px / 5.00×3.53 LU versus Hero D's 357×247 px / 11.16×7.71 LU — clearly, visibly subordinate
(width ratio ≈ 2.2, visible-area ratio ≈ 6.2). Grammar matches Hero D: hull side dominant, deck visible but secondary, two masts
readable, sails flat and legible, bow/stern distinguishable. It replaces only the `harbor-west-cargo-schooner` placement and is
not flipped (`setFlipX` is applied only to the east brig, unchanged), so its heading is the asset's native orientation — no
new rotation was introduced. Anchor and depth use the same `getVesselDepth(vessel.y + vessel.height / 2, vessel.id)` call as
every other secondary vessel; no bespoke code path was added for it.

## N. Fleet Hierarchy

```text
FLEET_HIERARCHY_PASS
```

Independently recomputed practical visible areas: Hero D ≈ 88,163 px² > medium vessel ≈ 18,080 px² > brig (re-optimized)
≈ 14,464 px² ≈ cutter ≈ 8,556 px² > programmatic small boats (2.5–3.5 LU footprints, materially smaller). The hierarchy
Hero D > Medium Vessel > Small Working Boats holds numerically and visually (harbor-wide and Hero-D-with-fleet frames,
section Z).

---

## O. Tree / Greenery

```text
TREE_GREENERY_PASS
```

15°-compatible rounded canopy with a visible top and a ground-contact trunk; the silhouette reads clearly as a tree at its
54×66 px / 1.69×2.06 LU practical size (well inside the locked 50–56×64–72 band) and does not compete with any building — it
is roughly a sixth the width of the smallest destination building. Ground-contact anchor confirmed both from the manifest
(`ground-contact`) and from the live render, which places it correctly on the plaza-approach path where the old programmatic
`academy-tree` stood.

## P. Crate

```text
CRATE_PASS
```

Readable top-plus-front exposure with visible plank seams and cross-bracing, clearly identifiable at its 46×38 px / 1.44×1.19
LU display size in the live dock frame next to the Exhibition Hall. Padding is the standard 4 runtime px on all sides
(independently measured, section T) with zero hidden-RGB pixels and a clean alpha edge (no fringe visible against the wood
dock or water backgrounds in the live render).

## Q. Harbor Lamp

```text
HARBOR_LAMP_PASS
```

Vertical silhouette with a grounded base and a readable fixture at its 16×47 px / 0.50×1.47 LU size, correctly placed at the
`waterfront-viewing-lamp` location in the live render. Depth class is unchanged (`LOW_PROP`, same as every other lamp).
Visually the bulb reads as a warm daytime fixture, not an emissive glow — no bloom, halo, or added light-source rendering was
introduced (confirmed both from the PNG's own pixel data, which contains no near-white blown-out glow region beyond the
fixture's own paint, and from the live scene, which has no lighting system for a prop to hook into).

---

## R. Scale Bible Compliance

```text
SCALE_BIBLE_COMPLIANCE_PASS
```

Independently measured every Batch 01 PNG (and, for context, the four re-optimized legacy assets) directly from the files on
disk with a reproducible alpha-threshold decoder (`alpha > 0` strict, `alpha > 16` practical, matching the locked method) —
not trusted from the report:

| Asset | canvas | bbox(a>0) | bbox(a>16) | hidden-RGB (a=0) | locked range | in range |
| --- | --- | --- | --- | ---: | --- | --- |
| Guild Hall | 338×204 | (4,4)–(333,199) | (4,4) 330×196 | 0 | 320–340×190–205 | yes |
| Academy | 338×198 | (4,4)–(333,193) | (4,4) 330×190 | 0 | 320–340×190–205 | yes (height at lower bound) |
| Workshop | 338×198 | (4,4)–(333,193) | (4,4) 330×190 | 0 | 320–340×190–205 | yes (height at lower bound) |
| Warehouse | 168×100 | (4,4)–(163,95) | (4,4) 160×92 | 0 | 152–160×90–96 | yes (width at upper bound) |
| Medium Vessel | 168×121 | (4,4)–(163,116) | (4,4) 160×113 | 0 | 128–177×113–129 | yes (height at lower bound) |
| Tree | 62×74 | (4,4)–(57,69) | (4,4) 54×66 | 0 | 50–56×64–72 | yes |
| Crate | 54×46 | (4,4)–(49,41) | (4,4) 46×38 | 0 | small-prop 16–48×24–48 | yes |
| Lamp | 24×55 | (4,4)–(19,50) | (4,4) 16×47 | 0 | small-prop 16–48×24–48 | yes (width at lower bound) |

Every number the report gives (canvas, practical bounds, logical units) matches this independent measurement exactly. Canvas
padding does **not** distort any of these: the `alpha > 0` (strict) and `alpha > 16` (practical) bounding boxes coincide for
every asset (no low-alpha halo extends the strict box beyond the practical one), and every content box begins at exactly
`(4, 4)` — the locked padding, not an inflated or misleading margin. Several assets sit exactly at a band edge (Academy/Workshop
height at 190, Warehouse width at 160, Vessel height at 113, Lamp width at 16); each is still inside the closed range the
Scale Bible states, not outside it.

For the four re-optimized legacy assets (Hero D, Exhibition Hall, Brig, Cutter — not new categories, but re-exported this
batch), independent measurement also confirms `alpha > 16` content starts at `(4,4)` with zero hidden RGB and `displayWidth ==
sourceWidth` (true 1× — no runtime scaling), and that the visible ship/hall content is pixel-equivalent to before the
re-export (see U and Z) — this was an export-normalization step, not a redesign, exactly as the Director Gate allows.

---

## S. Scene-level Scale

```text
SCENE_SCALE_READY_FOR_HUMAN
```

Judged in the integrated scene (section Z), not spreadsheet values alone: the three new destination buildings sit comfortably
believable against the player-scale world (256×128 LU footprints they occupy, same as before); the warehouse reads clearly
subordinate next to any destination building or Hero D; the medium vessel reads clearly subordinate to Hero D while still
looking substantial next to the small programmatic boats; the crate and lamp are readable without looking oversized against
the dock and Exhibition Hall; the tree visually supports the Academy approach without competing with the architecture. This
is exactly the "human decisions required" territory the implementation report names (does the whole harbor now feel like one
coherent, correctly scaled world) — the technical scale evidence supports a meaningful human review, and I am not making that
final call here.

---

## T. Export / Hidden RGB / Padding

```text
EXPORT_STANDARD_PASS
HIDDEN_RGB_PASS
PADDING_RULE_PASS
```

**Export:** every Batch 01 file has `displayWidth == sourceWidth` and `displayHeight == sourceHeight` in the manifest
(confirmed directly in `worldAssetManifest.ts`), i.e., true 1× — Phaser applies no additional runtime scale. No category
exception was invoked or needed.

**Hidden RGB:** independently scanned all twelve relevant PNGs (8 new + 4 re-optimized) for `alpha == 0` pixels with nonzero
RGB. **Zero** such pixels in every file — the cleanup was actually applied, not merely claimed. Alpha itself reaches a true
255 in every asset's opaque interior (unlike the pre-lock source masters, whose max alpha was 254), consistent with a real
re-encode rather than a copy with metadata edited.

**Padding:** measured the exact ring outside each asset's `alpha > 16` bounding box; it is alpha-0 in every case (no
low-alpha halo escapes the padding ring), and the padding is exactly 4 px on **all four sides** for every one of the twelve
files — matching the locked "practical trim + 4 runtime px" rule precisely, not merely on the sides the new automated test
happens to check (see W). No asset carries excessive empty canvas: content occupies the large majority of every canvas (e.g.,
Guild Hall content is 330×196 of a 338×204 canvas — 96% of the linear extent). Anchors were recomputed from the retained
functional base / hull-waterline / ground-contact point in every case, not preserved from an old normalized origin (confirmed
by the changed `originY` values and by the anchor-position math in section M/O of the depth reviews still holding here).

---

## U. Asset Weight Budgets

```text
ASSET_WEIGHT_BUDGET_PASS
```

Recomputed every file's byte size directly from disk (`stat`), independent of the report:

| Asset | measured bytes | ceiling | headroom |
| --- | ---: | ---: | ---: |
| Guild Hall | 114,758 | 138,240 | 17% |
| Academy | 116,979 | 138,240 | 15% |
| Workshop | 133,080 | 138,240 | 4% |
| Warehouse | 33,118 | 35,840 | 8% |
| Medium Vessel | 31,654 | 38,912 | 19% |
| Tree | 8,086 | 12,288 | 34% |
| Crate | 4,280 | 6,144 | 30% |
| Lamp | 1,845 | 6,144 | 70% |

All eight measured byte counts match the report exactly. Batch total: **443,800 bytes**, also exact. Every asset is at or
under its locked category ceiling; Workshop is the tightest at 4% headroom but still compliant. No budget was raised or
reinterpreted during this review.

The four re-optimized legacy files are also within their (pre-existing) ceilings: Hero D 142,840 / 160,000 (Hero-asset
ceiling), Exhibition Hall 118,896 / 138,240 (Major-destination ceiling), Brig 23,837 and Cutter 13,771 / 38,912
(Medium-vessel ceiling) — independently confirmed, though (see W) no automated test currently enforces this for these four
files.

---

## V. Runtime Texture Transfer

```text
RUNTIME_TEXTURE_BUDGET_PASS
```

Independently recomputed the exact set of textures `BootScene.preload()` requests in a normal (non-DEV, non-calibration)
production load: the default Hero D (via `getHeroShipAsset`, which resolves to `heroShipD` when `import.meta.env.DEV` is
false), the re-optimized Exhibition Hall, the re-optimized Brig and Cutter, and all eight new Batch 01 references. Summed
directly from the files on disk:

```text
142,840 (Hero D, re-optimized) + 118,896 (Hall, re-optimized) + 23,837 (Brig, re-optimized) + 13,771 (Cutter, re-optimized)
+ 114,758 (Guild) + 116,979 (Academy) + 133,080 (Workshop) + 33,118 (Warehouse) + 31,654 (Vessel) + 8,086 (Tree)
+ 4,280 (Crate) + 1,845 (Lamp) = 743,144 bytes
```

This matches the reported **743,144 bytes** exactly, confirmed at the file level rather than trusted from the report's
arithmetic. The secondary schooner (old, unoptimized) is correctly excluded — it is no longer preloaded by `BootScene` and no
runtime code path places it (see W). Calibration-only PNGs (`calibration/*.png`) and the retained pre-lock source masters
(`ship/hero-ship-a-v01.png`, etc.) are correctly excluded as dev-only / repository-only evidence.

This is below the locked 1.01–1.52 MB projected-complete-world range for two distinct reasons, both legitimate:

1. **Genuine optimization**, not a trick: the four re-optimized legacy textures alone dropped from 8,557,016 bytes (their
   pre-lock repository size) to 299,344 bytes for the same visible content, independently confirmed pixel-equivalent in
   section Z.
2. **Genuine partial rollout**, exactly as the implementation report states: the locked range's LOW scenario assumes 3 unique
   medium vessels (Batch 01 has exactly 3: brig, cutter, new medium vessel — this part is complete), but also 4 unique boat
   textures (Batch 01 has 0 — all small boats remain programmatic), 8 unique trees (Batch 01 has 1), and 16 unique props
   (Batch 01 has 2: crate and lamp). The shortfall against the projected range is concentrated almost entirely in categories
   Batch 01 was never scoped to fill (boats, additional trees, additional props), not in a category that was scoped and
   under-delivered.

One documentation nit, not a budget problem: the report's "≈ 0.71 MB" appears to use a 1024-based (MiB) rounding
(743,144 / 1,048,576 ≈ 0.709), while earlier project reports (e.g., "8,557,016 bytes (~8.56 MB)") used decimal (1,000,000-based)
rounding, under which 743,144 bytes rounds to ≈ 0.74 MB. Either way the number is comfortably below the 1.01 MB floor, so the
conclusion is unaffected (see Finding BR-01).

---

## W. Manifest / Provenance

```text
MANIFEST_METADATA_PASS_WITH_MINOR
PROVENANCE_PASS
```

Every new asset has a complete `WORLD_ASSETS` entry (`id`, base-prefixed `path`, `textureKey`, `role`, `sourceType`,
`provenance`, `status`, `version`, `notes`, `sourceWidth/Height`, `displayWidth/Height`, `originY`) and a matching row in the
new `batch01AssetAudit.json`, which additionally records `visibleBounds`, `logicalWidth/Height`, `anchor`, `depthClass`,
`fileBytes`, `weightCeilingBytes`, `exportScale`, and `optimizationStatus` — matching the "hybrid" manifest/audit contract the
Scale Bible locked (Section Z of that report). All eight `provenance` values are `generated-original`, an allowed category,
and all eight `status` values are `GAME_READY`.

Two Minor gaps, neither a live defect (see Findings BR-02, BR-04):

- The pre-existing `secondarySchooner` manifest entry is now fully unreferenced by any runtime code path (not preloaded, not
  placed, not used by any fallback or calibration lookup), yet its `status` remains `"CONCEPT"` rather than being marked
  `DEPRECATED` per `07_ASSET_POLICY.md`'s status vocabulary.
- The new `batch01-asset-policy.test.mjs` audit test checks only `visibleBounds.x === 4` and `.y === 4` (left/top padding),
  not right/bottom, and it covers only the 8 new Batch 01 rows — the four re-optimized legacy assets have no automated
  contract test, even though I independently confirmed they meet the same rules by direct measurement.

---

## X. Depth / Collision / IA

```text
DEPTH_INTEGRATION_PASS
COLLISION_IA_PROTECTION_PASS
```

**Depth:** grepped every new `setDepth(...)` call site; every one routes through the existing semantic helpers
(`getBuildingDepth`, `getVesselDepth`, `getHarborVisualDepth`) or the existing `WORLD_DEPTH`/`getWorldLabelDepth` policy — zero
new numeric depth literals or bands were added, confirmed by an empty diff on `worldDepth.mjs` itself. Destination buildings,
warehouse, vessel, tree, crate, and lamp each classify into the same band their category used before this batch (building body,
vessel waterline contact, body, low prop, low prop respectively).

**Collision / IA:** `worldLayoutData.json`, `layoutTransform.mjs`, `layoutValidation.mjs`, and `waterCollisionGeometry.mjs`
have a byte-identical diff (confirmed with `git diff fdebe39..HEAD`, zero output) — no destination position, route, reserved
lot, collision rectangle, water carve-out, or player-control value changed. The existing spatial/water/collision tests
(unchanged) still pass at 21/21.

One expanded, not new, limitation: the destination-building art (330–338 px wide) is wider than the shared 256 px collision
footprint for all three new buildings, the same pattern previously documented only for the Exhibition Hall (a player standing
beside, not behind, the building can be partially hidden by the art's overhang). This is the same already-accepted,
footprint-blocked-so-safe conclusion the Depth/Occlusion v1.1 review reached for the Hall — it now simply applies to three
more buildings (Finding BR-03).

---

## Y. BASE_URL / Production

```text
BASE_URL_PASS
```

Every new manifest `path` is base-relative (no leading `/`), resolved through the existing `resolveWorldAssetUrl()` /
`import.meta.env.BASE_URL` helper — unchanged code. Verified live against the built production preview (base
`/MyPage/world/`): all eight new asset URLs and the four re-optimized URLs return `200`; a deliberately root-absolute request
(`/assets/world/harbor/buildings/guild-hall-v01.png`, no `/MyPage/world` prefix) returns `404`. The production JS bundle
contains zero occurrences of `batchView` or `assetPreview` (grepped directly), and the existing test asserting this now also
covers the Batch 01 dev-only framing string.

---

## Z. Runtime Visual Review

**Evidence source: headless browser inspection combined with direct code/data reconstruction.** I served the rebuilt
production build (`vite preview`, base `/MyPage/world/`), drove headless Chrome over the DevTools protocol, captured the live
Phaser scene (an observation-only prototype hook injected before load), positioned the camera at each required framing, and
captured frames. No keyboard-driven play was exercised; camera positions were set directly. Screenshots were **not** saved to
the repository and none is claimed as project evidence.

| Case | Result |
| --- | --- |
| A. Harbor wide view | PASS — all eight replacements visible in place, Hero D and fleet at expected hierarchy |
| B. Harbor Square → Exhibition Hall | PASS — Hall unchanged in appearance, tree visible near the plaza approach |
| C. Guild Hall approach | PASS — label readable, no overlap with existing Guild props (confirmed both visually and by coordinate math) |
| D. Academy approach | PASS — label readable, tree correctly placed, no overlap with the study-garden prop |
| E. Workshop approach | PASS — label readable, interior visible through open doors, no overlap with existing Workshop props |
| F. Warehouse / dock area | PASS — warehouse clearly subordinate to Exhibition Hall and to the fleet |
| G. Hero Ship D + new Medium Vessel | PASS — medium vessel visibly smaller, correct hull/deck/mast grammar, no flip/rotation artifact |
| H. Player beside Tree / Crate / Lamp | PASS (code/data reconstruction for exact player-adjacency, since keyboard play was not driven) — each of the three swapped instances renders at its intended location; no other tree/crate/lamp instance was affected |

Additionally captured and reviewed: all four destination buildings framed together (for section K), and the four buildings'
material/palette coherence (section G).

---

## AA. QA

Run from `portfolio-world/` after confirming no stale preview process was present:

| Step | Result |
| --- | --- |
| `npm ci` | PASS — 19 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS (`tsc --noEmit`, exit 0) |
| `npm run build` (inside `npm test`) | PASS — `world/assets/index-M4yPX8u8.js` 1,424.37 kB / gzip 369.65 kB; only the pre-existing chunk-size advisory |
| `npm test` | **21/21 PASS**, 0 fail, including the new `Batch 01 production assets retain the locked audit contract` test |
| Build reproducibility | rebuilt output matches the committed `world/` build (same bundle hash `index-M4yPX8u8.js`) |
| `git diff --check` | PASS (exit 0) |

No stale repo-owned Vite preview process was found blocking `npm ci` this time, so none was stopped.

---

## AB. Findings

No Blocker, no Major. Five Minor findings, all documentation/hygiene/test-coverage — none affect visual, functional, scale,
weight, or safety correctness.

```text
ID: BR-01
Severity: Minor
Category: documentation mismatch
Finding: The reported "≈ 0.71 MB" for 743,144 bytes uses 1024-based (MiB) rounding, while earlier project reports used
  1,000,000-based (decimal MB) rounding for the same kind of figure.
Evidence: 743,144 / 1,048,576 ≈ 0.709 ("0.71 MB"); 743,144 / 1,000,000 ≈ 0.743 ("0.74 MB" under the earlier convention);
  compare "8,557,016 bytes (~8.56 MB)" in prior reports, which is decimal.
Impact: None on the pass/fail conclusion — the figure is well below the 1.01 MB floor under either convention.
Recommended action: Optional — state the unit convention once, or use decimal MB consistently in future reports.

ID: BR-02
Severity: Minor
Category: manifest/provenance issue
Finding: The `secondarySchooner` manifest entry is now fully unreferenced by any runtime code path but its `status` remains
  `"CONCEPT"` rather than `DEPRECATED`.
Evidence: `worldAssetManifest.ts` (`secondarySchooner` entry, old path/dimensions); `BootScene.ts` no longer preloads it;
  `getSecondarySailingAsset` no longer maps any placement to it; not used by `CALIBRATION_ASSETS`.
Impact: Dead manifest entry with a misleading lifecycle status; no runtime effect since it is never loaded or placed.
Recommended action: Mark it `DEPRECATED` (or remove it) the next time the manifest is touched.

ID: BR-03
Severity: Minor
Category: visual grammar mismatch (documented limitation, expanded scope)
Finding: Guild Hall, Academy, and Workshop art (330–338 px wide) is wider than the shared 256 px collision footprint, the
  same pattern previously documented only for the Exhibition Hall (DP-04 in the Depth/Occlusion v1.1 review); it now applies
  to three more buildings.
Evidence: `worldLayoutData.json` zone widths (256 px for all four destinations) vs. measured practical content widths in
  section R.
Impact: A player standing beside (not behind) any of the four destination buildings can be partially hidden by the art's
  overhang — a footprint-blocked-so-safe limitation, not a functional defect, per the existing Depth/Occlusion v1.1
  conclusion.
Recommended action: Broaden the existing Known Limitation note from "Exhibition Hall" to "all four destination buildings";
  no code change required now.

ID: BR-04
Severity: Minor
Category: test coverage
Finding: `batch01-asset-policy.test.mjs` checks only left/top padding (`visibleBounds.x/y === 4`) and covers only the 8 new
  Batch 01 rows, not the four re-optimized legacy assets (Hero D, Exhibition Hall, Brig, Cutter), which are bound by the same
  1×/padding/hidden-RGB/weight-ceiling contract.
Evidence: `tests/batch01-asset-policy.test.mjs`; independent measurement in sections R, T, U confirming all twelve files
  comply in practice.
Impact: A future edit could silently break right/bottom padding or the legacy assets' budget without failing a test.
Recommended action: Extend the audit (or a follow-up test) to check all four padding sides and to include the four
  re-optimized legacy assets' bytes/padding/hidden-RGB in the same automated contract.

ID: BR-05
Severity: Minor
Category: documentation mismatch
Finding: `91_STATUS.md`'s "Known Technical Follow-ups" section still states normal production PNG transfer "has grown to
  ~8.56 MB" and that the optimization pass "has not yet started," though this batch's own optimization pass succeeded and
  normal transfer is now 743,144 bytes.
Evidence: `docs/portfolio-world/91_STATUS.md` Known Technical Follow-ups section (pre-existing text, not touched by
  `b89e168`).
Impact: Stale note could mislead a future reader about the current transfer size.
Recommended action: Refresh the note in this review's status update (see Part R of the instruction; done in this pass).
```

---

## AC. Human Review Readiness

The technical evidence supports a meaningful human visual review of Batch 01 now: scope, grammar, coherence, hierarchy, scale,
weight, manifest, depth, collision, and BASE_URL loading are all independently confirmed sound. The three questions the
implementation report poses for the human (do the eight references read as one coherent 15° world; are the destination
buildings visually balanced against Hero Ship D; is the harbor ready for broader rollout after this review) are exactly the
right questions and are not pre-answered by this review — they are aesthetic/whole-world judgments, not technical
correctness questions. Full asset rollout remains on hold pending that human review.

## AD. Final Recommendation

```text
PROCEED_TO_BATCH_01_HUMAN_REVIEW
```
