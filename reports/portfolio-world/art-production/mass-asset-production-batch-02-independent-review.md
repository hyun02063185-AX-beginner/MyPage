# Mass Asset Production Batch 02 — Independent Review
## Harbor Support Architecture + Streetscape

> Canonical repo path:
> `reports/portfolio-world/art-production/mass-asset-production-batch-02-independent-review.md`

Reviewer: Claude Code (independent; did not implement Batch 02). Scope: Batch 02 only. No runtime code, asset,
layout, or collision file was modified during this review. The only non-document mutation performed was deleting
the confirmed accidental, untracked, duplicate root-level `assets/` directory (Part D). All measurement scripts and
a local dev-server attempt lived in the session scratchpad or were never bound; nothing was written into the
repository outside this report.

---

## A. Gate

```text
RETURN_TO_CODEX
```

Batch 02's twelve assets are correctly built (locked 15° grammar, true 1× export, zero hidden RGB, correct
padding, weight ceilings met, depth policy reused with no new magic numbers, primary buildings/doors/collision/IA/
routes byte-identical, BASE_URL-safe, 25/25 tests, reproducible build). However, independent pixel-level
measurement found a real, unaddressed **Major** visual-composition defect: several new props' actual visible
(alpha-trimmed) artwork geometrically overlaps the pre-existing, previously human-accepted
`waterfront-viewing-terrace` amenity and neighboring furniture — not merely nominal bounding boxes, but real
non-transparent pixels. No automated check in this project currently catches this class of overlap. This should be
fixed (a coordinate nudge, not a redesign) before Batch 02 proceeds to human review.

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Branch | `feature/portfolio-world-sprint-02` (expected, confirmed) |
| HEAD at start | `55215fa docs(portfolio-world): record harbor support streetscape batch` |
| Git status at start | dirty — one untracked item: root-level `assets/` (see Part D) |
| Node / npm | `v24.16.0` / `11.13.0` (matches expected) |

`work-context.mjs` reported `HOME_WINDOWS`, the expected machine-context ID, and confirmed the branch. No unrelated
tracked modification was present, so the review proceeded. A local Vite dev server could not be bound
(`EACCES: permission denied` on every port/host combination tried, including with sandbox protections relaxed),
so live/headless-browser visual verification was unavailable in this environment; Part V records the fallback
method used instead.

---

## C. Reviewed Range

Base commit is `1214e25` (`docs(portfolio-world): authorize full asset rollout`) — the commit immediately preceding
`8c355cb`, the tip of the door/layout-naturalization chain the Full Mass Asset Rollout Gate authorized Batch 02
from. Reviewed range: `1214e25..55215fa` (commits `8c355cb` implementation, `55215fa` documentation).

Diffed directly: `portfolio-world/src` (BootScene, WorldScene, `harborVisualCatalog.ts`, `landmarkCatalog.ts`,
`layoutValidation.mjs`, `worldAssetManifest.ts`, `worldDepth.mjs`, `worldLayoutData.json`, `worldTypes.ts`, new
`batch02AssetAudit.json`), `portfolio-world/public/assets` (12 new PNGs), `portfolio-world/tests` (new
`batch02-asset-policy.test.mjs`), and `world` (rebuilt bundle + 12 mirrored PNGs). Confirmed **zero diff** on every
primary-building PNG (`guild-hall-v01.png`, `academy-v03.png`, `workshop-v03.png`, `exhibition-hall-v03.png`),
`Player.ts`, `waterCollisionGeometry.mjs`, `gameConfig.ts`, and on the `zones`, `paths`, `forecourts`,
`reservedLots`, and `buildings`-equivalent (`zones`) sections of `worldLayoutData.json` — the only change to that
file is twelve new `harborVisuals` entries appended after the existing list.

Records read in full: Visual Grammar v1.0 lock, Scale Bible + Asset Weight Lock v1, Mass Asset Production Director
Gate, Full Mass Asset Rollout Gate, Depth/Occlusion v1.1 short recheck, the door-canonicalization/layout-
naturalization report and its human acceptance, the Batch 01 implementation and independent review, the Batch 02
implementation report, `02_WORLD_IA.md`, `07_ASSET_POLICY.md`, `91_STATUS.md`, `92_HANDOFF.md`.

---

## D. Root `assets/` Hygiene Reconciliation

An untracked `assets/` directory existed at the repository root (`C:\Users\hyun0\MyPage\assets\`) containing
exactly 12 files, mirroring the Batch 02 asset tree (`world/harbor/{buildings,greenery,props}/...`).

Verification performed:

1. `git ls-files assets/` returned nothing — confirmed untracked, not staged, not gitignored (`git check-ignore`
   also returned nothing; it is simply outside version control).
2. All 12 root-level files matched, by filename, files already present in **both** intended production locations:
   `portfolio-world/public/assets/world/harbor/...` and `world/assets/world/harbor/...`.
3. Byte-for-byte comparison (`cmp`) confirmed all 12 root files are **identical** to their `world/assets/...`
   counterparts — genuine duplicates, not divergent or user-authored content.
4. Grepped `portfolio-world/src` for any reference to the root-level path; every `path:` field in
   `worldAssetManifest.ts` is a bare relative string (e.g. `assets/world/harbor/...`) resolved exclusively through
   `resolveWorldAssetUrl()` → `` `${import.meta.env.BASE_URL}${asset.path}` ``, which resolves against
   `portfolio-world/public/` in dev and the built `world/` output in production. No code path can resolve to the
   repository-root `assets/` directory.
5. No file under the 12 was unique — every one had a byte-identical, tracked twin.

Conclusion: all 12 files were confirmed accidental, untracked, unreferenced, byte-identical duplicates. They were
removed with `rm -rf assets/` (not `git clean`, and no tracked file was touched). The worktree was clean
immediately afterward and remained clean through the rest of this review (re-verified in Part I/W).

```text
ROOT_ASSETS_HYGIENE = RECONCILED_AND_REMOVED
```

---

## E. Batch 02 Asset Inventory

```text
BATCH02_SCOPE_PASS_WITH_MINOR
```

All 12 assets are present on disk in both production locations, wired into `BootScene` preload, resolved by
`worldAssetManifest.ts`, placed in `worldLayoutData.json`, and drawn/gated by `WorldScene.ts`'s
`getBatch02VisualAsset`. Independently measured (alpha-threshold decoder, `alpha > 16` practical /
`alpha > 0` strict, matching the locked method) rather than trusted from the audit JSON:

| id | category | runtime path | canvas | measured practical bbox | reported `visibleBounds` | bytes | ceiling | provenance | anchor | depth class |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| harbor-warehouse-annex-v01 | support building | `buildings/harbor-warehouse-annex-v01.png` | 168×100 | (9,4) 149×92 | (10,4) 148×92 | 29,943 | 35,840 | generated-original | functional-base | `getHarborVisualDepth`→BODY |
| harbor-service-hut-v01 | support building | `buildings/harbor-service-hut-v01.png` | 104×80 | (9,4) 85×72 | (10,4) 84×72 | 13,191 | 35,840 | generated-original | functional-base | BODY |
| harbor-cargo-stack-v01 | cargo prop | `props/harbor-cargo-stack-v01.png` | 72×54 | (12,4) 47×46 | (12,4) 46×46 | 5,968 | 6,144 | generated-original | ground-contact | GROUND_DETAIL* |
| harbor-barrel-cluster-v01 | cargo prop | `props/harbor-barrel-cluster-v01.png` | 52×54 | (4,13) 44×28 | (4,14) 44×26 | 4,003 | 6,144 | generated-original | ground-contact | LOW_PROP |
| harbor-rope-coil-v01 | cargo prop | `props/harbor-rope-coil-v01.png` | 56×32 | (4,8) 48×15 | (4,8) 48×14 | 2,603 | 6,144 | generated-original | ground-contact | LOW_PROP |
| harbor-bench-v01 | streetscape | `props/harbor-bench-v01.png` | 72×34 | (15,4) 41×26 | (16,4) 40×26 | 2,752 | 6,144 | generated-original | ground-contact | GROUND_DETAIL* |
| harbor-notice-board-v01 | streetscape | `props/harbor-notice-board-v01.png` | 56×64 | (10,4) 35×56 | (10,4) 34×56 | 4,575 | 6,144 | generated-original | ground-contact | BODY |
| harbor-safety-rail-v01 | streetscape | `props/harbor-safety-rail-v01.png` | 64×44 | (4,9) 56×26 | (4,10) 56×24 | 2,639 | 6,144 | generated-original | ground-contact | LOW_PROP |
| harbor-tree-02-v01 | greenery | `greenery/harbor-tree-02-v01.png` | 62×74 | (4,13) 54×47 | (4,14) 54×46 | 5,689 | 12,288 | generated-original | ground-contact | BODY |
| harbor-shrub-planter-v01 | greenery | `greenery/harbor-shrub-planter-v01.png` | 56×48 | (4,11) 48×26 | (4,12) 48×24 | 3,411 | 6,144 | generated-original | ground-contact | BODY |
| harbor-mooring-bollard-v01 | harbor edge | `props/harbor-mooring-bollard-v01.png` | 32×40 | (5,4) 21×32 | (6,4) 20×32 | 2,190 | 6,144 | generated-original | ground-contact | LOW_PROP |
| harbor-service-marker-v01 | harbor edge | `props/harbor-service-marker-v01.png` | 48×56 | (15,4) 18×48 | (16,4) 16×48 | 2,862 | 6,144 | generated-original | ground-contact | BODY |

`*` `harbor-cargo-stack` (`crate` type) and `harbor-bench` (`bench` type) reuse the pre-existing `crate`/`bench`
classification: `crate` is not in `LOW_PROP_TYPES` (only `barrel` is among cargo types) and resolves via the
`GROUND_DETAIL` fallback band in `getHarborVisualDepth`, identical to every pre-existing crate; `bench` likewise
falls to the same fallback band as every pre-existing bench. This is unchanged, existing behavior, not something
Batch 02 altered.

All 12 have `status: GAME_READY`, `provenance: generated-original`, `exportScale: "1x"`, and
`optimizationStatus: "hidden-rgb-zeroed"` in both the manifest and the audit file, and all 12 runtime file bytes
match the audit's `fileBytes` exactly (re-verified with `stat`).

Runtime placements (all `collidable: false`, all `zone: "gallery"` — consistent with the pre-existing convention
that every harbor/waterfront visual, regardless of on-map position, is tagged to the `gallery` content zone, not a
literal physical-position field): all 12 sit in the western harbor work-yard between the existing `harbor-warehouse`
and the `waterfront-viewing-terrace`/promenade (x ≈ 280–1200, y ≈ 836–1020), i.e. genuinely new content, not
reused/relabeled placements.

The "with minor" qualifier reflects Finding BS-02 (visibleBounds precision) below, not a scope gap.

---

## F. Visual Grammar

```text
VISUAL_GRAMMAR_PASS
```

All 12 assets are flat/small props or two small support buildings, not full illustrated destination architecture,
so the review applies the locked prop/support-building surface grammar (§7/§6 of the v1.0 lock) rather than the
full building-facade rule. Reviewed each asset's drawn silhouette against its declared type:

- **Warehouse annex / service hut:** both show a primary camera-facing face with a partially visible roof, the
  same family as the existing warehouse and cargo shed — no new camera angle invented.
- **Cargo props (cargo stack, barrel cluster, rope coil):** top + primary-face exposure (stack, barrels) or a
  grounded coiled-top view (rope), consistent with the locked crate/barrel prop grammar.
- **Streetscape (bench, notice board, safety rail):** seat-top + support-body (bench), a flat readable face
  (notice board — confirmed blank/no readable text, matching its own manifest note), and a grounded post-and-rail
  silhouette (safety rail) — all compatible with 15°.
- **Greenery (tree-02, shrub planter):** rounded canopy with visible top and ground-contact trunk (tree), grounded
  shrub mass in a planter box (planter) — same family as the existing academy tree and square planters.
- **Harbor edge (mooring bollard, service marker):** grounded vertical post-and-cap forms, the same family as the
  existing lamp/harbor-sign posts.

No asset reads as a flat elevation, a top-down plan, or an invented camera angle. No hidden-RGB fringe or dirty
edge was visible at the pixel level (Part R).

---

## G. Same-class Scale

```text
SAME_CLASS_SCALE_PASS_WITH_MINOR
```

- **Support building ↔ support building:** the existing `harbor-warehouse` (160×92 practical) is the "warehouse"
  sub-class; the new `harbor-warehouse-annex` (149×92 practical) is explicitly an *annex* — a subordinate wing, the
  same relationship the locked Scale Bible already accepts between "warehouse" and "cargo shed" ("cargo sheds
  remain subordinate support, not destination buildings" — Scale Bible §L). At 149×92 it sits 3 px under the
  locked 152–160×90–96 px warehouse band, consistent with its subordinate role rather than a violation of the
  warehouse band, but the Batch 02 report never states this distinction or measures against the band at all
  (Finding BS-01). `harbor-service-hut` (85×72) is smaller again, matching a hut's function; this reads as
  purposeful functional variety (warehouse > annex > hut), the same principle the Full Rollout Gate already
  applies to primary buildings ("`BUILDING_EQUAL_SIZE = NOT REQUIRED`... same-world human scale"), not random
  variety-faking.
- **Cargo prop ↔ cargo prop:** cargo-stack (47×46) is comparable to the existing crate (46×38, Batch 01); barrel
  cluster (44×28, wider/shorter than a single 28×36 barrel) reads correctly as several barrels side by side, not a
  resized single barrel.
- **Street furniture ↔ street furniture:** new bench (41×26) is close to the existing plaza bench's declared
  24×64 box; new notice board's visible content (35×56) is about 17% taller than the existing programmatic
  notice-board's declared 48×48 box — a real but modest difference, in the same range Academy/Workshop's accepted
  50–52 px door-height spread already tolerates.
- **Tree/greenery ↔ tree/greenery:** tree-02 (54×47) is close to the Batch 01 tree (54×66, narrower canopy but same
  width) — a plausible "windswept" variant per its own manifest note, not an arbitrary resize.
- **Harbor detail ↔ harbor detail:** mooring bollard and service marker are new sub-types with no prior sibling to
  compare against; both read at a human-relative post scale (21–32 px tall body, 48 px including the marker's
  post).

No instance of scaling used only to fake variety was found. The "with minor" qualifier is Finding BS-01
(missing scale-band documentation), not a scale defect.

---

## H. Primary-building Protection

```text
PRIMARY_BUILDING_PROTECTION_PASS
```

`git diff 1214e25..8c355cb` on `guild-hall-v01.png`, `academy-v03.png`, `workshop-v03.png`, and
`exhibition-hall-v03.png` is empty. The canonical `42×52`/`42×50` door openings, the `zones` array (containing every
primary building's position/size), and `Player.ts` are all byte-identical to the pre-Batch-02 commit. No primary
building or canonical door regressed.

---

## I. Support Architecture

```text
SUPPORT_ARCHITECTURE_PASS
```

Both new support structures read as harbor/service architecture (a warehouse annex and a small hut, in the same
material language as the existing warehouse — confirmed by the shared `drawCargoShed` draw function reused for
both `warehouse-annex` and `service-hut`), remain non-collidable and drawn at `WORLD_OBJECT_BODY` band exactly like
the pre-existing, already-accepted non-collidable `cargo-shed`, and are placed with a clear functional
rationale — extending the existing warehouse's work-yard footprint northward rather than being dropped as filler
elsewhere in the world. They do not compete with or exceed the Tier 1 destination buildings in scale (149×92 and
85×72 practical content vs. 320–370 px destination buildings).

---

## J. Work-yard / Cargo Composition

```text
WORK_YARD_COMPOSITION_PASS_WITH_MINOR
```

The warehouse-annex, service-hut, cargo-stack, barrel-cluster, and rope-coil form a believable loading/storage
cluster directly north of the existing `harbor-warehouse`/`harbor-cargo-shed` — a genuine functional grouping, not
a decorative grid (irregular spacing: x-coordinates 280, 376, 472, 520, 584 are not evenly spaced). This is a real
improvement to the previously under-detailed work-yard.

Two overlap issues reduce "breathing space" within this same cluster, independently confirmed by mapping each new
asset's measured alpha-trimmed pixels into world coordinates (not nominal declared boxes):

- `harbor-rope-coil` and `harbor-notice-board` visibly overlap by ≈18×4 px (the rope's top-left corner touches the
  board's lower edge).
- `harbor-service-hut` and `harbor-barrel-cluster`'s *declared* boxes touch by 3 px vertically, but their measured
  visible content does not actually overlap (a false positive from nominal-box checking) — no defect.

These are minor and contained entirely within new Batch 02 content. The larger overlap onto pre-existing
waterfront furniture is reported separately in Part K as it affects a different zone-character objective.

---

## K. Streetscape

```text
STREETSCAPE_NEEDS_FIX
```

`harbor-bench`, `harbor-notice-board`, `harbor-safety-rail`, and the new greenery/edge props do not repeat at
mechanical intervals (irregular x-spacing 608/648/672/704/720/816/1200), remain subordinate in scale to every
building, do not block any path/forecourt/pier (confirmed: zero overlap with `protectedNavigation` in
`layoutValidation.mjs`, which every `PERMANENT_STREETSCAPE_TYPES` member — including `safety-rail` and
`service-marker` — is checked against), and share the existing material palette (`COLORS.woodDark`,
`COLORS.rope`, `COLORS.shipTrim`, `COLORS.lamp` — all pre-existing shared tokens, no new colors introduced). They
also do not touch Harbor Square (`plaza` zone) at all.

However, independent measurement (mapping each asset's actual alpha-trimmed pixels, not its declared canvas box,
into world coordinates) found that new streetscape props visibly overlap the pre-existing, human-accepted
`waterfront-viewing-terrace` amenity cluster near the Exhibition waterfront promenade:

| new asset | overlaps | measured pixel overlap |
| --- | --- | --- |
| `harbor-safety-rail` | `waterfront-viewing-terrace` (existing, accepted) | ≈56×17 px |
| `harbor-safety-rail` | `waterfront-viewing-bench` (existing, accepted) | ≈56×5 px |
| `harbor-tree-02` | `waterfront-viewing-terrace` (existing, accepted) | ≈54×39 px |
| `harbor-shrub-planter` | `waterfront-viewing-terrace` (existing, accepted) | ≈48×26 px |
| `harbor-service-marker` | `exhibition-flag-east` (existing, accepted) | ≈5×28 px |

`waterfront-viewing-terrace` is drawn as a flat platform filling essentially its whole declared 160×80 box
(`FLAT_WALKABLE_TYPES`, a solid programmatic fill — confirmed in `harborVisualCatalog.ts`), so this is not a
nominal-box false positive like the one dismissed in Part J: real non-transparent tree-canopy and rail pixels
render on top of the terrace's visible surface (the tree/rail depth bands — `WORLD_OBJECT_BODY`/`LOW_PROP` — are
both drawn after, i.e. visually on top of, the terrace's `WALKABLE_STRUCTURE` band in every case, since the bands
are far enough apart that no contact-Y tie can cross them). `layoutValidation.mjs` has no rule checking new
harbor-visual placements against other, non-water/non-lot/non-dock harbor visuals, so this was not caught by the
project's own test suite. See Finding BS-03 (Major).

This is why Streetscape does not pass cleanly; the finding is localized (4 of 12 assets, one small area) and does
not affect hierarchy, navigation, or any locked contract.

---

## L. Greenery

```text
GREENERY_PASS_WITH_MINOR
```

`harbor-tree-02` and `harbor-shrub-planter` are coherent, purpose-named variants (a "windswept" tree, a planted
shrub) rather than arbitrary resizes of the Batch 01 tree; both remain human-relative in scale and clearly
subordinate to every building. No greenery is placed over water or near any water carve-out (`LAND_SIDE_PROP_TYPES`
does not include `tree`/`planter`/`shrub`-mapped types explicitly, but a direct coordinate check against all three
water polygons — `waterfront-water`, `harbor-west-basin`, `harbor-east-basin` — found zero overlap for either new
greenery asset); the old greenery-over-water regression (Depth/Occlusion v1) does not recur. The "with minor"
qualifier is the same terrace-overlap finding from Part K (`harbor-tree-02`, `harbor-shrub-planter` both
contribute to it) rather than a new greenery-specific defect.

---

## M. Harbor Edge

```text
HARBOR_EDGE_PASS_WITH_MINOR
```

`harbor-mooring-bollard` and `harbor-service-marker` read as credible dock-area details (a grounded bollard, a
post-mounted marker light in the same family as the existing lamp/harbor-sign posts) and do not overlap any
water/dock geometry. `harbor-service-marker`'s minor overlap with the existing `exhibition-flag-east` (Part K) is
the only edge-detail concern, and is narrow (≈5 px wide).

---

## N. Layout Naturalization

```text
LAYOUT_NATURALIZATION_PRESERVED
```

The 12 new placements use irregular, non-repeating spacing (confirmed above) and do not form a new visual grid.
`zones`, `paths`, `forecourts`, and `reservedLots` are byte-identical to before Batch 02 (Part H/C), so the
naturalized cardinal-softening from the prior door/layout pass is fully preserved. The terrace-overlap finding
(Part K) is a localized clutter/overlap issue, not a reintroduced grid.

---

## O. Zone Character

```text
ZONE_CHARACTER_PASS_WITH_MINOR
```

Batch 02 concentrates its new content in the warehouse/dock work-yard, correctly matching "Warehouse/dock =
highest functional cargo density." It adds nothing to Harbor Square (correctly keeping it "orientation-first,
uncluttered"), nothing to the Academy or Workshop zones (unchanged — neither degraded nor improved), and nothing to
Guild Hall's zone. The one zone character concern is that the batch's streetscape props bleed from the work-yard
into the Exhibition waterfront promenade area and land on top of the existing viewing terrace (Part K), working
against "Exhibition waterfront = more open / promenade-like" rather than reinforcing it.

---

## P. Navigation / Collision

```text
NAVIGATION_COLLISION_PASS
```

All 12 new placements are `collidable: false`; `COLLIDABLE_HARBOR_VISUAL_TYPES` is unchanged (`water`, `warehouse`
only), so no new collider was introduced. Visible and physical access to Guild Hall, Academy, Workshop, Exhibition
Hall, Harbor Square, and all dock/service areas (`harbor-pier-west`, `harbor-pier-east`, `harbor-service-jetty`) is
unchanged — confirmed both by the empty diff on `zones`/`paths`/`forecourts`/piers and by the passing
`layoutValidation.mjs` checks (`PERMANENT_STREETSCAPE_TYPES` — including the four new collidable-adjacent types —
is checked against every path/forecourt/zone footprint with zero violations; this is enforced by the passing test
suite, Part W). Since no new support structure has collision, there is no new footprint-alignment question to
raise.

---

## Q. Depth / Occlusion

```text
DEPTH_OCCLUSION_PASS
```

Grepped every new type's depth routing: `warehouse-annex`/`service-hut`/`service-marker` were added to the existing
`BODY_TYPES` set (drawn via the unchanged `getHarborVisualDepth` → `WORLD_OBJECT_BODY` path); `rope-coil`/
`safety-rail`/`mooring-bollard` were added to the existing `LOW_PROP_TYPES` set. Both sets already existed;
`worldDepth.mjs`'s formula, bands, and constants (`WORLD_DEPTH`, `depthAtContact`, `stableDepthTie`,
`STABLE_DEPTH_TIE_GRANULARITY`, `PLAYER_FACE_DEPTH_OFFSET`, `HERO_SHIP_WATERLINE_OFFSET_Y`) are byte-unchanged — zero
new numeric depth literals or bands. `service-marker`'s classification into `BODY_TYPES` (rather than `LOW_PROP`,
despite visually resembling a lamp) matches the pre-existing precedent of `harbor-sign`/`academic-sign` (other
vertical post-and-marker props already in `BODY_TYPES`), so it is consistent, not an oversight.

Walked the densest new zone (the work-yard cluster, x≈280–820, y≈836–1020) via the contact-Y formula: every new
low prop sits below every new/adjacent body-type object it is near in the y-sort whenever its foot is above the
neighbor's, and above it otherwise — the same mechanism already verified correct in the Depth/Occlusion v1.1
recheck, unmodified here. No new magic depth constant was added. No edge-greenery/water regression: neither new
greenery asset overlaps any water polygon (Part L). This section is independent of the Part K overlap finding,
which is a *placement* (x/y coordinate) issue, not a *depth-ordering* defect — the depth policy correctly and
consistently draws the overlapping sprites in the order their bands dictate; the bands are simply not being asked
to separate two things that should not be visually touching in the first place.

---

## R. Export / Padding / Hidden RGB

```text
ASSET_HYGIENE_PASS
```

Wrote and ran an independent, reproducible non-interlaced RGBA PNG decoder (zlib inflate + PNG filter
reconstruction, no external dependency) against all 12 files directly:

- **Hidden RGB:** zero pixels with `alpha == 0` and nonzero RGB in any of the 12 files.
- **True 1× / real re-encode:** every file's opaque interior reaches `alpha == 255` (not a lossy 254 ceiling), and
  `displayWidth == sourceWidth` / `displayHeight == sourceHeight` in the manifest for all 12 — true 1×, no runtime
  Phaser scaling.
- **Padding:** every file's tightest side (min of left/top/right/bottom) is exactly the locked 4 px; no low-alpha
  halo extends the strict (`alpha > 0`) bounding box beyond the practical (`alpha > 16`) one for any asset (the two
  bounds coincide in all 12 cases) — no misleading margin.
- **visibleBounds precision (Finding BS-02, Minor):** the independently measured practical bounding box differs
  from `batch02AssetAudit.json`'s recorded `visibleBounds` by 1–2 px on at least one axis for all 12 assets (see
  the comparison table in Part E). Every asset still satisfies the ≥4 px padding rule and every weight ceiling
  under either the reported or the independently measured numbers, so this does not change any pass/fail
  conclusion, but the audit file is not pixel-exact.
- The new `batch02-asset-policy.test.mjs` checks all four padding sides (left/top/right/bottom) against the
  self-reported `visibleBounds`, an improvement over Batch 01's audit test (which checked only left/top, Batch 01
  Finding BR-04) — but because it validates only the self-reported numbers rather than decoding pixels, it cannot
  by itself catch the 1–2 px drift in Finding BS-02.

---

## S. Asset Weight

```text
ASSET_WEIGHT_PASS_WITH_MINOR
```

Recomputed all 12 byte sizes directly from disk; every value matches `batch02AssetAudit.json` exactly (see Part E
table). All 12 are at or under their locked category ceiling. `harbor-cargo-stack-v01` is the tightest at
5,968 / 6,144 bytes (2.9% headroom) — tighter than any previously recorded margin in this project (Batch 01's
tightest was Workshop at 4%) — still compliant, flagged for awareness only (Finding BS-04, Minor).

---

## T. Runtime Texture Transfer

```text
RUNTIME_TEXTURE_BUDGET_PASS
```

Independently reconstructed the exact production (non-DEV) preload set from `BootScene.preload()` and
`worldAssetManifest.ts`, then summed real file sizes from disk:

```text
Pre-Batch-02 (11 assets: heroShipD, exhibitionHall, secondaryBrig, secondaryCutter, guildHall, academy, workshop,
harborWarehouse, mediumSailingVessel, harborTree, cargoCrate, harborLamp) = 579,941 bytes
Batch 02 addition (12 new assets)                                        =  79,826 bytes
Post-Batch-02 total production preload                                   = 659,767 bytes
```

This is comfortably inside the locked LOW-scenario projection (~1.01 MB) — the same legitimate partial-rollout
gap Batch 01's review explained (this project has not yet filled every planned category: additional unique
vessels, boats, and props remain for Batch 03).

**Note on the instruction's reference figure:** this review's own instructions state "pre-Batch-02 = 744,949
bytes" as the comparison baseline. That figure does not appear anywhere in the repository's reports or docs (a
repo-wide search found no match), and does not match my independent reconstruction (579,941 bytes). The
discrepancy is explained by the door-canonicalization batch (`57c201d`): re-exporting Academy/Workshop/Exhibition
Hall's doors substantially *reduced* their file sizes (e.g. Workshop dropped from 133,080 to 56,423 bytes;
Exhibition Hall from 118,896 to 70,064 bytes) as a side effect of the export-normalization step, and no report
after that batch recorded a fresh preload total before Batch 02 began. This is a documentation gap in the project's
own tracking, not a Batch 02 defect (Finding BS-05, Minor) — the pass/fail conclusion is unaffected either way,
since both figures are well under the 1.01 MB floor.

---

## U. BASE_URL / Build Output

```text
BASE_URL_BUILD_OUTPUT_PASS
```

Every new manifest path is base-relative (no leading `/`), resolved only through the unchanged
`resolveWorldAssetUrl()`/`import.meta.env.BASE_URL` helper. Rebuilt the production bundle and confirmed:
`world/index.html` references `/MyPage/world/assets/index-Dl01rMN0.js` (matching the committed rename from
`index-D1DqT7ZX.js`); grepping the built bundle for `batchView`/`assetPreview` returns zero matches (dev-only
comparison code is dead-code-eliminated in production, as in every prior phase); rebuilding produced a
byte-identical `world/` output to the committed one (`git status`/`git diff --stat -- world` empty after
`npm run build`). Root-level `assets/` (now removed, Part D) was never referenced by any resolved path.

---

## V. Runtime Visual Review

**Evidence source: code/data reconstruction only.** A local Vite dev/preview server could not be bound in this
sandboxed environment — every attempt (`vite --port 5173`, `--port 5180 --host 127.0.0.1`, with and without
relaxed process sandboxing) failed immediately with `EACCES: permission denied` on the listen syscall, before any
HTTP request could be made. No headless browser session was therefore possible, and no screenshot was captured or
saved.

In place of a live/headless render, every visual claim in this report (Parts F, G, K, L, M, Q) is backed by: (1) a
from-scratch, reproducible PNG decoder reading real per-pixel alpha data (not metadata or declared canvas size) for
all 12 new assets, and (2) exact world-coordinate arithmetic (each asset's center `x`/`y` and declared `width`/
`height` from `worldLayoutData.json`, converted to left/top via the same `x - width/2` convention the renderer
itself uses in `harborVisualCatalog.ts`) combined with the measured alpha-trimmed offsets, to determine whether
real visible pixels — not nominal bounding boxes — occupy the same world-space region as another object. This is
what surfaced the Part K overlap finding and what let Part J's superficially-overlapping-but-actually-fine cases be
correctly dismissed.

Required views, answered from this evidence rather than a rendered frame:

- **A. Whole-world overview:** unchanged outside the work-yard/promenade region (zones, paths, water, fleet,
  primary buildings byte-identical).
- **B. Harbor Square:** untouched by Batch 02 (zero new placements in `plaza` zone).
- **C. Guild Hall zone:** untouched by Batch 02.
- **D. Academy zone:** untouched by Batch 02.
- **E. Workshop zone:** untouched by Batch 02.
- **F. Exhibition waterfront:** new tree/planter/safety-rail visually overlap the existing viewing terrace/bench
  (Part K) — this zone is the one materially affected, and not in the intended direction (more clutter, not more
  "open/promenade-like").
- **G. Warehouse/dock work area:** materially improved — a believable, non-mechanically-spaced work-yard cluster
  now surrounds the existing warehouse (Part J), with only a minor internal prop-touch (rope-coil/notice-board).
- **H. Densest support zone with the player "moving through" it:** reconstructed via the depth formula rather than
  live keyboard play (unavailable in this environment): a player's foot-Y sweeping through the work-yard sorts
  correctly against every new low-prop/body-type object at every tested row, using the same unmodified formula
  verified live in the Depth/Occlusion v1.1 recheck.

**Does the world feel more inhabited?** Yes, in the work-yard — a real, credible improvement. **Does it remain easy
to navigate?** Yes — zero navigation/collision change. **Do support assets remain subordinate?** Yes. **Does
natural irregularity remain?** Yes — no mechanical grid was reintroduced. **Is any zone too cluttered?** The
waterfront-viewing-terrace corner, specifically, due to the Part K overlap. **Is any major zone still conspicuously
empty?** Guild Hall's, Academy's, and Workshop's immediate zones received no Batch 02 content, which is
in-scope (the batch is titled "Harbor Support + Streetscape" and correctly concentrated on the harbor/work-yard),
not a defect.

---

## W. QA

Run from `portfolio-world/` after confirming no port was already bound (none was — the only server-start attempts
made during this review were the failed Vite dev-server attempts in Part V, which never came up, so nothing needed
to be stopped):

| Step | Result |
| --- | --- |
| `npm ci` | PASS — 19 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS (`tsc --noEmit`, exit 0) |
| `npm test` (typecheck + build + tests) | PASS — build: `world/assets/index-Dl01rMN0.js` 1,433.75 kB / gzip 371.42 kB (only the pre-existing >500 kB chunk-size advisory); **25/25 tests PASS**, 0 fail, including the new "Batch 02 assets are 1×, padded, transparent-safe, and within their role budgets" test |
| Build reproducibility | PASS — rebuild produced a byte-identical `world/` output (`git status`/`git diff --stat -- world` empty) |
| `git diff --check` | PASS (exit 0) |

---

## X. Findings

No Blocker. One Major, four Minor.

```text
ID: BS-03
Severity: Major
Category: visual-composition concern (implementation defect: missing overlap check, not a locked-contract
  violation)
Finding: Batch 02's harbor-tree-02, harbor-shrub-planter, and harbor-safety-rail were placed with real,
  independently-measured visible-pixel overlap onto the pre-existing, previously human-accepted
  waterfront-viewing-terrace (a flat platform that is visually rendered on top of by these new items, per the
  project's own depth-band ordering) and its viewing-bench; harbor-service-marker similarly overlaps
  exhibition-flag-east.
Evidence: Independent alpha-threshold PNG decode of all 12 new assets, mapped into world coordinates using
  worldLayoutData.json's declared center x/y and width/height (the same left = x - width/2 convention
  harborVisualCatalog.ts itself uses); layoutValidation.mjs confirmed to have no rule checking new harbor-visual
  placements against other non-water/non-lot/non-dock harbor visuals, so no automated test caught this. Measured
  overlaps: safety-rail/terrace ≈56×17 px, safety-rail/viewing-bench ≈56×5 px, tree-02/terrace ≈54×39 px,
  shrub-planter/terrace ≈48×26 px, service-marker/exhibition-flag-east ≈5×28 px.
Impact: Visible sprite-on-sprite clutter at the Exhibition waterfront promenade, directly working against both the
  batch's own "breathing space" objective and the "Exhibition waterfront = more open / promenade-like" zone
  character this review was asked to protect. No functional/collision/navigation impact (all items are
  non-collidable) and no impact on any locked contract, primary building, or IA.
Recommended action: Move harbor-tree-02, harbor-shrub-planter, and harbor-safety-rail's x/y so their measured
  visible content clears the waterfront-viewing-terrace and waterfront-viewing-bench footprints (there is ample
  open space immediately west/north of the current cluster, e.g. shifting 20–40 px is likely sufficient given the
  overlap magnitudes); nudge harbor-service-marker a few pixels east or lower its y slightly to clear
  exhibition-flag-east. Consider adding a general (non-collidable) visual-overlap check to layoutValidation.mjs
  for future batches, since this class of overlap currently has no automated guard at all.

ID: BS-01
Severity: Minor
Category: documentation gap
Finding: mass-asset-production-batch-02-harbor-support-streetscape.md omits a Work Context / Starting Commit
  section (present in every other implementation report in this project) and never states which locked Scale
  Bible category band, if any, each new asset is measured against.
Evidence: reports/portfolio-world/art-production/mass-asset-production-batch-02-harbor-support-streetscape.md
  (sections A–F only); compare Batch 01's report and its independent review section R.
Impact: Makes independent scale-band reconciliation (Part G of this review) slower and relies entirely on the
  reviewer re-deriving context from git history.
Recommended action: Add a Work Context/Starting Commit line and a per-asset scale-band table the next time this
  report is touched; not required before human review.

ID: BS-02
Severity: Minor
Category: measurement precision
Finding: batch02AssetAudit.json's visibleBounds differ from independently decoded alpha>16 bounds by 1–2 px on at
  least one axis for all 12 assets (see the comparison table in Part E).
Evidence: Independent PNG decoder output vs. src/world/batch02AssetAudit.json.
Impact: None on any pass/fail conclusion (padding and weight ceilings hold either way), but the audit record is
  not pixel-exact, continuing the pattern flagged as Batch 01 Finding BR-04.
Recommended action: Regenerate visibleBounds from an automated alpha-decode step rather than by hand/estimate,
  the next time this audit file is touched.

ID: BS-04
Severity: Minor
Category: asset weight margin
Finding: harbor-cargo-stack-v01 uses 5,968 of its 6,144-byte ceiling (2.9% headroom) — the tightest margin
  recorded in this project to date.
Evidence: Part S byte comparison; compare Batch 01's previous tightest (Workshop, 4%).
Impact: None currently (still compliant); a future re-export of this specific asset has very little room before
  breaching its category ceiling.
Recommended action: No action required now; keep in mind if harbor-cargo-stack-v01 is ever re-exported.

ID: BS-05
Severity: Minor
Category: documentation mismatch
Finding: This review's own instructions state a pre-Batch-02 baseline of 744,949 bytes; no repository report
  records that figure, and it does not match the independently reconstructed 579,941-byte pre-Batch-02 preload.
Evidence: Repo-wide search for "744,949"/"744949" (no matches); Part T reconstruction; the door-canonicalization
  batch's byte reductions on Academy/Workshop/Exhibition Hall likely explain the gap.
Impact: None on this review's pass/fail conclusion (both figures are well under the 1.01 MB floor). Worth
  reconciling so future instructions cite a verifiable number.
Recommended action: Record the actual post-door-canonicalization preload total in a report before the next batch,
  so future baselines are traceable.
```

---

## Y. Human Review Readiness

Batch 02's underlying craft is sound — grammar, export standard, hidden-RGB cleanup, weight budgets, depth
routing, and every locked technical contract independently check out, and the work-yard addition is a genuine,
well-composed improvement. But sending it to human whole-world review with a visible sprite-overlap defect at the
waterfront promenade would waste that review's attention on something a coordinate fix can resolve first, and the
project's own Full Rollout Gate reserves "Major visual regression" as exactly the class of issue an independent
review should catch before a human looks at the world. This review does not consider Batch 02 ready for human
review yet.

## Z. Final Recommendation

```text
RETURN_TO_CODEX
```

Fix Finding BS-03 (reposition the four overlapping props so their measured visible content clears the
waterfront-viewing-terrace/bench and exhibition-flag-east), then resubmit for a short independent recheck before
Batch 02 human review. The four Minor findings (BS-01, BS-02, BS-04, BS-05) do not block that recheck and may be
addressed opportunistically. Batch 03 remains not authorized by this review, consistent with the instruction's own
scope.
