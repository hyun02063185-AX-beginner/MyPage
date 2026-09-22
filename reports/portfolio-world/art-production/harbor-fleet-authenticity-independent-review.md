# Harbor Fleet Authenticity — Independent Review
## Portfolio World — Retro Harbor Campus

> Canonical repo path:
> `reports/portfolio-world/art-production/harbor-fleet-authenticity-independent-review.md`

This is an independent review, not an implementation. No runtime code, layout coordinate, `BERTHING_SLOTS`
entry, test, or PNG asset was modified while producing it. All four regenerated PNGs were opened and viewed
directly (not inferred from `fleetAuthenticityAssetAudit.json`, the production report, or generation prompts),
and hidden-RGB / alpha-bounds claims were independently re-derived by decoding the raw PNG pixel data rather
than trusting the audit JSON's claimed values.

---

## A. Gate

```text
READY_FOR_FLEET_AUTHENTICITY_HUMAN_REVIEW
```

---

## B. Work Context

| Item | Value |
| --- | --- |
| Branch | `feature/portfolio-world-sprint-02` (confirmed) |
| Worktree | clean, before and after this review's QA run |
| `node -v` | `v24.16.0` |
| `npm -v` | `11.13.0` |

No unrelated changes were present.

---

## C. Reviewed Commits

| Commit | Role |
| --- | --- |
| `2884406` | Fleet Authenticity pre-review record (starting point named by the production report) |
| `275097a` | **Fleet Authenticity runtime/assets commit** — `feat(portfolio-world): regenerate moored age-of-sail fleet` |
| `1c17b40` | **Fleet Authenticity docs commit** — `docs(portfolio-world): record fleet authenticity production` |
| `1c17b40` | Current `HEAD` |

`git show --stat 275097a` confirms an isolated diff: four new PNGs (`hero-ship-d-v02.png`,
`secondary-brig-v02.png`, `secondary-cutter-v02.png`, `medium-sailing-vessel-01-v02.png`), the new
`fleetAuthenticityAssetAudit.json`, a `worldAssetManifest.ts` update limited to the four affected entries
(`heroShipD`, `secondaryBrig`, `secondaryCutter`, `mediumSailingVessel`), the new `fleet-authenticity.test.mjs`,
a small `batch01-asset-policy.test.mjs` adjustment, and rebuilt `world/` build output. `worldLayoutData.json`,
`berthingSlots.ts`, `berthingPlacement.mjs`, and `layoutValidation.mjs` are **not** touched by this commit —
independently confirmed, not assumed.

---

## D. Active Asset Resolution

Traced end-to-end: `worldAssetManifest.ts` → `BootScene.preload()` → `WorldScene.ts` rendering — not from any
report's claimed inventory.

| Role | Active texture key | Active path | Status/version |
| --- | --- | --- | --- |
| Hero Ship | `harbor-hero-ship-d-v02` | `assets/world/harbor/optimized/hero-ship-d-v02.png` | GAME_READY v02 |
| Secondary Brig (×2, one mirrored) | `harbor-secondary-brig-v02` | `assets/world/harbor/optimized/secondary-brig-v02.png` | GAME_READY v02 |
| Medium Sailing Vessel | `harbor-medium-sailing-vessel-01-v02` | `assets/world/harbor/ship/medium-sailing-vessel-01-v02.png` | GAME_READY v02 |
| Harbor Cutter | `harbor-secondary-cutter-v02` | `assets/world/harbor/optimized/secondary-cutter-v02.png` | GAME_READY v02 |
| Small Workboat (unchanged) | `harbor-small-workboat-v01` | `assets/world/harbor/ship/small-workboat-v01.png` | GAME_READY v01 |
| Dinghy (unchanged) | `harbor-dinghy-v01` | `assets/world/harbor/ship/harbor-dinghy-v01.png` | GAME_READY v01 |

`BootScene.ts` preloads `getHeroShipAsset(window.location.search)` (production/non-DEV path always resolves to
`heroShipD`) plus `WORLD_ASSETS.secondaryBrig`, `.secondaryCutter`, `.mediumSailingVessel` directly.
`WorldScene.ts` renders these same `textureKey`s (`getHeroShipAsset(...).textureKey` at the hero placement, and
a `getSecondarySailingAsset`-style resolver returning `secondaryBrig` / `mediumSailingVessel` / `secondaryCutter`
at the corresponding placements) — the replacement reaches actual rendering, not just manifest metadata.

`grep` across `src/` for the four old `v01` paths (`hero-ship-d-v01.png`, `secondary-brig-v01.png`,
`secondary-cutter-v01.png`, `medium-sailing-vessel-01-v01.png`) finds no remaining reference outside
`fleet-authenticity.test.mjs`'s own negative assertions. Old `v01` files remain on disk (`optimized/` and
`ship/`) but are not referenced by any manifest entry, preload call, or render path — non-active archive only,
consistent with project policy.

```text
ACTIVE_ASSET_REPLACEMENT_PASS
```

---

## E. Direct PNG Inspection Method

All four regenerated PNGs, plus the unchanged workboat/dinghy and one accepted building (`guild-hall-v01.png`,
for Part G), were opened and viewed directly as rendered images — not judged from filenames, prompts, JSON, or
this pass's own report text. Additionally, all six ship PNGs' raw pixel data were independently decoded (a
from-scratch PNG/zlib/pixel decoder, not the project's own audit tooling) to re-derive alpha-bounds and
hidden-RGB findings pixel-by-pixel rather than trusting `fleetAuthenticityAssetAudit.json`'s claimed numbers.

---

## F. 15° Visual Audit

| Vessel | Hull | Deck | Mast/Rigging | Furled canvas | Verdict |
| --- | --- | --- | --- | --- | --- |
| Hero Ship D | Long side-on hull dominates the silhouette; bow curls up at left, stern rises with a stepped, gilded gallery at right | A narrow deck strip with deck fixtures is visible along the hull top — clearly secondary to the hull | Three masts, each with horizontal yards and diagonal standing/running rigging, read as belonging to the same camera as the hull | Cream/tan bundles sit along the yards on all three masts, consistent with the hull's angle | **15_DEG_PASS** |
| Secondary Brig | Hull side dominant, compact two-mast silhouette | Thin deck line visible, subordinate | Both masts and their rigging read consistently with the hull | Bundled canvas on both masts' yards | **15_DEG_PASS** |
| Medium Sailing Vessel | Hull side dominant, slightly taller two-mast rig than the brig | Deck strip visible, subordinate | Masts/yards consistent with hull angle | Bundled canvas visible on both masts | **15_DEG_PASS** |
| Harbor Cutter | Hull side dominant even at this small canvas | Deck sliver visible | Single mast and its rigging (including a bowsprit-like forward line) agree with the hull angle | A single tan bundle sits at the boom/mast junction | **15_DEG_PASS_WITH_MINOR** — smallest canvas (101×86 source) leaves the least pixel budget to confirm fine rigging/perspective detail with full confidence; nothing visually contradicts the grammar, but certainty is lower than the other three |

None of the four reads as bird's-eye or as a pure side elevation; none shows a mismatched-perspective mast/yard
system.

---

## G. World Perspective Coherence

`guild-hall-v01.png` (an accepted 15° building) was opened directly for comparison: steep gabled roof visible
but the facade (windows, double-leaf door, trim) dominates the read, with the roof pitch as a secondary top
surface. The four regenerated vessels follow the same "one dominant surface, one narrower secondary top surface"
logic — hull dominant, deck secondary — rather than a flat side elevation or a bird's-eye deck-dominant read.
Ship (lateral hull) and building (frontal facade) subjects have different geometry, so this is a qualitative
"belongs to the same camera" judgment, not a literal angle match, and this review compared against only one
building directly (not the full building set).

```text
WORLD_PERSPECTIVE_COHERENCE_PASS_WITH_MINOR — comparison basis limited to one directly-viewed building;
no contradiction found.
```

---

## H. Sail-state Audit

| Vessel | Observed | Verdict |
| --- | --- | --- |
| Hero Ship D | All three masts carry tied, rolled canvas bundles along their yards; no broad deployed sail surface, no billowing curve, no full sail silhouette | **FURLED_SAIL_PASS** |
| Secondary Brig | Both masts show bundled canvas on the yards, not open sail area | **FURLED_SAIL_PASS** |
| Medium Sailing Vessel | Both masts show bundled canvas, deck and rigging otherwise clear | **FURLED_SAIL_PASS** |
| Harbor Cutter | Single tan bundle at the boom/mast, not an open hoisted sail shape | **FURLED_SAIL_PASS** (lower resolution than the other three; see Part F note — visually consistent with furled, not with certainty as high as the larger vessels) |

No vessel shows a broad deployed sail surface, a billowing main sail, or a sailing-posture silhouette while
docked. This directly contradicts the pre-review's own baseline classification for the *previous* v01 assets
(`FULL_SAIL_INCORRECT_FOR_BERTH` for all four) — the regeneration visibly changed sail state, not just metadata.

---

## I. Hero Age-of-Sail Audit

Hero Ship D reads immediately as a large wooden three-mast Age-of-Sail vessel: three masts with yards and
rigging, a substantial wooden hull, a raised and ornamented stern (gilded trim, gallery windows), and a visible
deck with fixtures. It reads as merchant/exploration rather than modern-yacht or modern-naval.

One ambiguity: a row of evenly spaced small dark squares along a blue hull band could read either as cabin/
gallery windows (the pre-review's own reading of the same design lineage) or, less charitably, as stylized
gunports. At this resolution the squares do not dominate the hull, are not paired with any national ensign or
overt weapon silhouette, and the ship does not read as a warship overall — but the ambiguity itself is worth a
human look rather than asserting one reading with full confidence.

```text
HERO_AGE_OF_SAIL_PASS_WITH_MINOR — hull-side window/square row is ambiguously window-like or gunport-like;
does not dominate or read as an over-armed/national-warship silhouette.
```

---

## J. Brig Audit

Two-mast character is clearly present and readable (an improvement over the pre-review's note that the old
asset under-represented its second mast — the v02 brig's two masts read as comparably weighted). Sails are
furled on both masts. No visible text, emblem, or strongly asymmetric light source that would break believably
under the existing `setFlipX` mirrored reuse for the east placement. Character reads commercial/practical, not
ceremonial.

```text
BRIG_AUTHENTICITY_PASS
```

---

## K. Medium Vessel Audit

Clearly smaller than Hero (independently re-measured practical area ≈18,080 px² vs. Hero's ≈88,179 px², Part N)
while visibly larger than the brig/cutter tier. Reads as an Age-of-Sail two-mast merchant vessel with furled
sails, readable deck line, and rigging consistent with the world grammar. Not mistakable for a second Hero-scale
vessel.

```text
MEDIUM_AUTHENTICITY_PASS
```

---

## L. Cutter Audit

Compact single-hull silhouette, one primary mast, furled/brailed sail treatment, lighter rigging than the other
three vessels, and visibly the smallest sailing vessel in the fleet (Part N). Reads as a harbor/coastal trading
craft rather than a warship or a scaled-down copy of a larger vessel.

```text
CUTTER_AUTHENTICITY_PASS
```

---

## M. Small Craft Protection

Both `small-workboat-v01.png` and `harbor-dinghy-v01.png` were re-opened directly and independently
pixel-decoded: file bytes (8,970 / 5,113), practical alpha bounds (79×56 at offset 15,4 / 68×29 at offset 4,6),
and hidden-RGB status (zero non-black RGB under alpha 0 for both) exactly match the pre-Fleet-Authenticity
baseline and the runtime overlap validator's own `BATCH03_VISIBLE_BOUNDS` entries for these two IDs. Neither
file appears in the `275097a` diff.

```text
SMALL_CRAFT_PROTECTION_PASS
```

---

## N. Fleet Scale Hierarchy

Independently recomputed from raw pixel data (not PNG canvas dimensions, not the production report's numbers):

| Vessel | Practical W×H (pixel-decoded) | Practical area |
| --- | --- | --- |
| Hero Ship D | 357×247 | 88,179 px² |
| Medium Sailing Vessel | 160×113 | 18,080 px² |
| Secondary Brig | 128×88 | 11,264 px² |
| Harbor Cutter | 93×78 | 7,254 px² |
| Small Workboat | 79×56 | 4,424 px² |
| Dinghy | 68×29 | 1,972 px² |

`Hero > Medium > Brig > Cutter > Workboat > Dinghy` holds cleanly with no tier inversion. Hero remains by far
the dominant vessel; Medium/Brig form the subordinate sailing-vessel class; Cutter is clearly smaller again;
Workboat/Dinghy remain the utility-craft tier. The brig's furled canvas reduced its footprint (113→88 px
height) more than the medium vessel's, narrowing but not closing the medium/brig gap — hierarchy is intact.

```text
FLEET_SCALE_HIERARCHY_PASS
```

---

## O. Berthing Preservation

`git show --stat 275097a` confirms `berthingSlots.ts`, `berthingPlacement.mjs`, and `worldLayoutData.json` are
absent from the Fleet Authenticity runtime/assets commit. The test suite's "Batch 03 vessel berth references
resolve runtime x/y/heading without using raw vessel coordinates" case passes (31/31 overall, Part V). No
`berthSlotId`, coordinate, or heading change was made by this pass.

```text
BERTHING_PRESERVATION_PASS
```

---

## P. Alpha Bounds / Overlap

Independently pixel-decoded practical alpha bounds for all four regenerated PNGs match
`fleetAuthenticityAssetAudit.json`'s claimed `visibleBounds` exactly (x=4, y=4 padding on all four; widths/
heights match to the pixel), and all four show zero non-black RGB under alpha 0 (see Part R for the full table).

For the harbor-sweep half of this part: `layoutValidation.mjs`'s rendered-alpha overlap check
(`findBatch03HarborSceneOverlaps`, driven by `BATCH03_VISIBLE_BOUNDS`) only covers the small workboat, dinghy,
and Batch 02/03 dockside props — it does **not** include the four regenerated sailing vessels
(`harbor-large-ship`, `harbor-west-merchant-brig`, `harbor-east-merchant-brig`, `harbor-west-cargo-schooner`,
`harbor-east-harbor-cutter`). Those five placements are checked only by the coarser `assertDoesNotOverlap`
"Floating vessels overlap" pass, which uses `worldLayoutData.json`'s declared `width`/`height` per vessel (e.g.
Hero declared 280×80, brig 188×56, schooner 205×58, cutter 145×58) — placeholder footprints, unrelated to and
already narrower than either the old or new alpha-trimmed art, and **unchanged** by this commit (confirmed by
the same `git show --stat` above).

This is a pre-existing scope limitation of the validator (it predates Fleet Authenticity and applies equally to
the workboat/dinghy tier's neighbors), not something this pass introduced or regressed. Because the new art
shrank or stayed the same size rather than growing (Part R), and the coarse placeholder footprints did not
change, there is no plausible new overlap this pass could have introduced that the existing checks would miss.
Independent broad visual/coordinate reasoning across the harbor (vessel↔vessel, vessel↔pier, vessel↔dock prop,
vessel↔Batch 02/03 prop, vessel↔protected waterfront object) finds no unintended material overlap.

```text
FLEET_OVERLAP_PASS_WITH_MINOR — validator does not extend rendered-alpha checking to the four regenerated
sailing vessels (pre-existing gap, not a regression); zero unintended material overlap found by independent
reasoning over unchanged, already-conservative placeholder footprints.
```

---

## Q. Gangplank / Rope Compatibility

`dock-gangplank` and `dock-rope-line` placements are unchanged (confirmed via the commit diff) and their only
documented vessel relationship is with `harbor-small-workboat` (unaffected — Part M), not with any of the four
regenerated vessels. The pre-review's own finding — no dockside prop is placed against Hero/Brig/Medium/Cutter's
hull today — still holds since none of those coordinates changed.

```text
DOCK_RELATIONSHIP_PASS
```

---

## R. Asset Hygiene

Independently pixel-decoded (from-scratch PNG/zlib decoder, not the project's own audit script) rather than
trusting `fleetAuthenticityAssetAudit.json`'s claims:

| Asset | Format | Practical bounds (decoded) | Claimed bounds (audit JSON) | Hidden non-black RGB pixels | 
| --- | --- | --- | --- | --- |
| `hero-ship-d-v02.png` | 8-bit RGBA | x4,y4,357×247 | x4,y4,357×247 | 0 |
| `secondary-brig-v02.png` | 8-bit RGBA | x4,y4,128×88 | x4,y4,128×88 | 0 |
| `medium-sailing-vessel-01-v02.png` | 8-bit RGBA | x4,y4,160×113 | x4,y4,160×113 | 0 |
| `secondary-cutter-v02.png` | 8-bit RGBA | x4,y4,93×78 | x4,y4,93×78 | 0 |

All four are true 8-bit RGBA (colorType 6), all four have exact 4-runtime-pixel padding on every side, all four
have zero non-black RGB under fully-transparent pixels, and the decoded practical bounds match the audit JSON's
claims exactly (not merely close). `fleet-authenticity.test.mjs` additionally asserts these same JSON fields
plus disk byte-size equality and manifest cross-references (31/31 suite, Part V). The Medium vessel is
16,202 bytes against the locked 38,912-byte (38 KB) ceiling — well under, and the director's ceiling was not
raised (confirmed: no ceiling value in `worldAssetManifest.ts`/audit JSON exceeds the locked figures).

```text
ASSET_HYGIENE_PASS
```

---

## S. Asset Weight Results

| Vessel | Old bytes | New bytes | Δ | Ceiling | Under ceiling by |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hero Ship D | 142,840 | 91,556 | −51,284 | 163,840 | 72,284 |
| Secondary Brig | 23,837 | 10,310 | −13,527 | 38,912 | 28,602 |
| Medium Sailing Vessel | 31,654 | 16,202 | −15,452 | 38,912 | 22,710 |
| Harbor Cutter | 13,771 | 6,441 | −7,330 | 38,912 | 32,471 |
| **Total (4 assets)** | **212,102** | **124,509** | **−87,593** | — | — |

All figures independently re-measured via `ls -la` / `statSync` against the actual files on disk, not copied
from the production report.

---

## T. Runtime Preload

Independently reconstructed the full `BootScene.preload()` non-DEV asset list from `BootScene.ts` (31 entries,
excluding the DEV-only calibration branch) and summed each file's actual byte size on disk:

```text
Independently recomputed total production preload: 603,413 bytes
Previous canonical baseline:                        691,006 bytes
Net delta:                                            −87,593 bytes
```

This matches the production report's claimed figures exactly, but was derived from a fresh sum of the 31
preloaded files' real disk sizes, not copied from the report. `git status --short` remained clean before and
after this computation (no local `world/` rebuild artifacts were part of the check).

```text
PRELOAD_BUDGET_PASS
```

---

## U. Legacy Full-sail Runtime Check

`grep` for the four old `v01` filenames across `src/` finds no reference outside the negative assertions in
`fleet-authenticity.test.mjs` itself (lines 25–28, which explicitly assert the manifest text does **not**
contain any of the four old paths). `worldAssetManifest.ts`'s `heroShipD`, `secondaryBrig`, `secondaryCutter`,
and `mediumSailingVessel` entries all point to their respective `v02` files (Part D). The old `v01` PNGs remain
on disk under `optimized/` and `ship/` as non-preloaded, non-referenced archive files.

```text
LEGACY_FULL_SAIL_RUNTIME_PASS
```

---

## V. Test Coverage

`fleet-authenticity.test.mjs` covers: exactly 4 audited assets; `newSailState === "furled-stowed"` for all four;
`provenance`/`status` correctness; exact 4px padding on all sides; `fileBytes <= weightCeilingBytes`; disk byte
size matching the audit JSON; manifest `textureKey`/`path` cross-reference; and explicit non-presence of all
four old `v01` paths in the manifest text. This matches the review brief's required contract list (active asset
mappings, production status, current alpha-bounds inputs, weight ceilings, legacy-mapping absence). Berth
resolution and local overlap validation remain covered by pre-existing `spatial-layout.test.mjs` cases, unchanged
by this pass. No test attempts to automatically judge "15°" or "Age of Sail" — correctly left to this human/
visual review, per the brief.

```text
npm ci / npm run typecheck / npm test / npm run build — all executed fresh in this review (Part W)
Test count: 31/31 pass
```

---

## W. QA

```text
npm ci           → clean install, 0 vulnerabilities
npm run typecheck → clean (tsc --noEmit, no errors)
npm test          → runs typecheck + build + node --test tests/*.test.mjs → 31/31 pass
npm run build      → vite build succeeds (1,442.20 kB / 373.34 kB gzip; >500kB chunk warning is
                      the pre-existing, already-tracked bundle-size follow-up, not new)
git diff --check  → clean, no whitespace errors
git status --short → clean before and after this review's commands
```

Additional independent checks performed in this review (not just re-running the project's own scripts):
hidden-RGB pixel audit (from-scratch PNG decoder, Part R), padding audit (same decoder, Part R), asset weight
audit (`stat`, Part S), BootScene preload reconstruction (fresh 31-file sum, Part T), harbor overlap sweep
(validator code read + coordinate reasoning, Part P), berth resolution check (test suite + commit-diff absence
of layout/berth file changes, Part O).

---

## X. Integrated Visual Review

A live browser could not be run in this environment; this section relies on direct PNG inspection (Part E–L),
actual runtime world coordinates (`worldLayoutData.json`, unchanged — Part O/P), and rendered-geometry
reconstruction (independently recomputed alpha bounds and preload — Part N/R/T) rather than a live in-game
screenshot. This limitation is stated explicitly, not glossed over.

1. **Do they look moored?** Yes — no vessel shows a deployed-sail, actively-sailing posture; all four show
   tied/bundled canvas on visible yards/booms.
2. **Do all four sails look naturally furled?** Yes for Hero/Brig/Medium with high confidence; yes for Cutter
   with somewhat lower confidence due to its very small source canvas (Part F/H).
3. **Does Hero immediately read as Age-of-Sail tall ship?** Yes — three masts, large wooden hull, ornamented
   stern, full rigging; one minor ambiguity in hull-window/gunport reading (Part I).
4. **Does the fleet still have clear scale hierarchy?** Yes, independently re-measured and confirmed with no
   tier inversion (Part N).
5. **Is the visual angle coherent with the 15° world?** Yes for all four vessels against the locked grammar;
   qualitatively coherent against one directly-viewed building (Part F/G).
6. **Do furled sails leave enough mast/yard/rigging interest?** Yes — masts, yards, and rigging lines remain
   the dominant secondary visual element on all four vessels; none reads as visually "empty" (the FR-01 risk
   named in the pre-review does not appear to have materialized).
7. **Do the ships fit the existing harbor rather than forcing the harbor to fit them?** Yes — no layout,
   berth, or dockside-prop coordinate changed (Part O/Q), and the new art occupies equal-or-smaller footprint
   than before (Part N/R), so no harbor-side adjustment was required or made.

---

## Y. Findings

```text
ID: FA-IR-01
Severity: Minor
Category: test-coverage / overlap-validation-scope
Evidence: layoutValidation.mjs's BATCH03_VISIBLE_BOUNDS / findBatch03HarborSceneOverlaps only covers the small
  workboat, dinghy, and Batch 02/03 dockside props; the four regenerated sailing vessel placements
  (harbor-large-ship, harbor-west-merchant-brig, harbor-east-merchant-brig, harbor-west-cargo-schooner,
  harbor-east-harbor-cutter) fall back to the coarser assertDoesNotOverlap "Floating vessels overlap" check
  using unchanged, already-conservative worldLayoutData.json placeholder width/height values.
Impact: No overlap regression is plausible from this pass (new art shrank or stayed the same size, and the
  placeholder footprints didn't change), but a future pass that changes ship footprint size or position would
  not get rendered-alpha-precision overlap checking for these five placements the way workboat/dinghy/dockside
  props already do.
Recommended action: Optional follow-up — extend rendered-alpha overlap bounds to the sailing-vessel tier if a
  future pass moves or resizes these placements. Not blocking for this pass.

ID: FA-IR-02
Severity: Minor
Category: visual-authenticity / ambiguity
Evidence: Hero Ship D's hull carries a row of evenly-spaced small dark squares along a blue band, directly
  visible in hero-ship-d-v02.png.
Impact: Could be read by some viewers as stylized gunports rather than cabin/gallery windows; does not dominate
  the hull or pair with any national ensign/over-armed detail, and the ship does not read as a warship overall.
Recommended action: Human judgment call during the upcoming Human Review; no code/asset change proposed by
  this review.

ID: FA-IR-03
Severity: Minor
Category: visual-confidence
Evidence: secondary-cutter-v02.png's source canvas is only 101×86 px (93×78 practical), the smallest of the
  four regenerated assets.
Impact: Furled-sail and 15°-grammar readings for the cutter are visually consistent with a PASS but carry
  somewhat lower confidence than the other three vessels purely due to available pixel detail.
Recommended action: No action required; flagged for awareness during Human Review.
```

No Blocker or Major finding was identified.

---

## Z. Human Review Readiness

All four regenerated PNGs were directly, visually inspected. All four visually fit the 15° hybrid-orthographic
grammar (one with a minor confidence caveat). All four sailing vessels show convincingly furled/stowed sails —
no billowing canvas, no deployed-sail silhouette. Hero Ship D clearly reads as a large Age-of-Sail sailing
vessel. Brig/Medium/Cutter retain their proper hierarchy under Hero, independently re-measured. Small Workboat
and Dinghy are confirmed byte-identical and unchanged. Berth coordinates and `BERTHING_SLOTS` are confirmed
unmodified. No unintended material overlap was found (with one Minor validator-coverage note). Dock
relationships remain credible and unaffected. Asset hygiene and weight ceilings pass on independently
pixel-decoded evidence, with the Medium vessel well under its locked 38 KB ceiling. No old full-sail asset
remains active for these four roles. Preload is independently recomputed at 603,413 bytes, a net decrease of
87,593 bytes from baseline. QA passes at 31/31 tests, clean typecheck, clean build, clean `git diff --check`.
No Blocker or Major finding remains — three Minor findings are recorded for human awareness.

## Vessel Matrix

| Vessel | 15° Visual | Sail State | Age-of-Sail | Scale | Weight | Berth | Overlap | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero Ship D | PASS | PASS | PASS_WITH_MINOR | PASS (largest) | PASS (91,556 / 163,840) | unchanged | PASS_WITH_MINOR | PASS_WITH_MINOR |
| Secondary Brig | PASS | PASS | PASS | PASS (subordinate tier) | PASS (10,310 / 38,912) | unchanged | PASS_WITH_MINOR | PASS_WITH_MINOR |
| Medium Sailing Vessel | PASS | PASS | PASS | PASS (subordinate tier) | PASS (16,202 / 38,912) | unchanged | PASS_WITH_MINOR | PASS_WITH_MINOR |
| Harbor Cutter | PASS_WITH_MINOR | PASS | PASS | PASS (smallest sailing tier) | PASS (6,441 / 38,912) | unchanged | PASS_WITH_MINOR | PASS_WITH_MINOR |
| Small Workboat | n/a (unchanged) | n/a | n/a | PASS (utility tier) | unchanged (8,970) | unchanged | PASS | PASS |
| Dinghy | n/a (unchanged) | n/a | n/a | PASS (utility tier) | unchanged (5,113) | unchanged | PASS | PASS |

---

## Final Gate

```text
READY_FOR_FLEET_AUTHENTICITY_HUMAN_REVIEW
```
