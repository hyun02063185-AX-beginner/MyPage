# Mass Asset Production Batch 03 — Independent Review
## Fleet + Dockside Activity Expansion

> Canonical repo path:
> `reports/portfolio-world/art-production/mass-asset-production-batch-03-independent-review.md`

Reviewer: Claude Code (independent; did not implement Batch 03, and authored the Batch 03 pre-review). Scope:
Batch 03 only. No runtime code, asset, or layout file was modified during this review. The only non-document
action taken was stopping one stale repo-owned `vite preview` process (PID 11368, parent `npm run preview`
PID 27936) that was blocking `npm ci` by holding a locked native binding — documented in Part Q. Two throwaway
scratch scripts (never committed, deleted immediately after use) independently decoded PNG alpha data and
reconstructed rendered geometry; nothing else was written to the repository.

---

## A. Gate

```text
RETURN_TO_CODEX
```

Batch 03's asset files themselves are technically clean (1× export, padding, hidden RGB, weight budgets, fleet
hierarchy intact, no new collision, no new depth constants, secondary cap exactly 40/40 as authorized, 27/27
tests). But the batch's own stated core requirement — validate first, do not repeat Batch 02's overlap
regressions — was not met: the overlap validator was not extended at all for any of the 7 new items, and an
independent broad sweep found multiple real, material overlaps it would have caught, including a new prop
overlapping the exact protected waterfront terrace that caused two prior Batch 02 hotfixes. `BERTHING_SLOTS` is
also unreferenced dead code, and the gangplank/buoy placements don't fulfill their own stated compositional
purpose. Five Major findings in total (Part S).

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Branch | `feature/portfolio-world-sprint-02` (expected, confirmed) |
| HEAD at start | `b0c3319 docs(portfolio-world): record fleet and dockside activity batch` |
| Git status at start | clean |
| Node / npm | `v24.16.0` / `11.13.0` (matches expected) |

No unrelated modification was present, so the review proceeded. `npm ci` initially failed with `EPERM`/`EACCES`
unlinking `@rolldown/binding-win32-x64-msvc`; `Get-CimInstance Win32_Process` identified the exact holder as a
stale `vite preview --base /MyPage/world/ --host 127.0.0.1 --port 4173` process (PID 11368) and its `npm run
preview` parent (PID 27936), both launched from this exact repo's `node_modules` — not started by this review
session, left over from an earlier one. Both, and only both, were stopped; no other process on the machine
(several unrelated `codyssey-mission-tech-glossary` vite servers and Codex runtime processes were present and left
untouched). `npm ci` succeeded immediately afterward.

---

## C. Reviewed Range

Base commit is `b0bcee7` (`docs(portfolio-world): pre-review batch 03 fleet + dockside scope`) — the commit
immediately preceding `48d3558`. Reviewed range: `b0bcee7..b0c3319` (commits `48d3558` implementation, `b0c3319`
documentation).

Diffed directly: `portfolio-world/src/scenes/BootScene.ts`, `WorldScene.ts`, the new `berthingSlots.ts`,
`worldAssetManifest.ts`, `worldLayoutData.json`, `tests/spatial-layout.test.mjs`, and the rebuilt `world/` output.
Confirmed **zero diff** on `layoutValidation.mjs`, `worldDepth.mjs`, `harborVisualCatalog.ts`,
`landmarkCatalog.ts`, `waterCollisionGeometry.mjs`, `Player.ts`, `layoutTransform.mjs`, `gameConfig.ts`, and every
primary-building/existing-vessel PNG. `worldLayoutData.json`'s only change is 7 new `harborVisuals` entries
appended after `harbor-service-marker`; `zones`, `paths`, `forecourts`, `reservedLots`, and every pre-existing
`harborVisuals` entry are byte-identical. No accepted Batch 02 composition was touched.

---

## D. Fleet Audit

```text
FLEET_SCALE_PASS_WITH_MINOR
```

| id | runtime path | canvas | measured practical bbox | display | bytes | ceiling | tier | placement | berth ref |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| `small-workboat-v01` | `ship/small-workboat-v01.png` | 110×64 | (15,4) 79×56 | 110×64 | 8,970 | 13,312 | secondary | (700,1116), west basin | `small-work-west` |
| `harbor-dinghy-v01` | `ship/harbor-dinghy-v01.png` | 76×42 | (4,6) 68×29 | 76×42 | 5,113 | 13,312 | secondary | (980,1210), waterfront water | `utility-pocket` |

Both `provenance: generated-original`, `status: GAME_READY`, true 1× (`displayWidth == sourceWidth`), zero hidden
RGB, `maxAlpha == 255` (real re-encode). Both route through the unchanged `getVesselDepth()` call, and both are
independently confirmed **fully contained within a water polygon** (workboat inside `harbor-west-basin`, dinghy
inside `waterfront-water`) by direct rectangle-containment arithmetic — the same check `FLOATING_VESSEL_TYPES`
already enforces for every vessel.

Independently measured practical visible area: Hero D ≈ 88,163 px² > Medium (~18,080 px²) > small-workboat
(79×56 ≈ 4,424 px²) > dinghy (68×29 ≈ 1,972 px²) > small (unchanged programmatic boats, 2,560–5,376 px² nominal).
The four-tier ordinal hierarchy (`Hero D > Medium Sailing Vessel > Small Workboat > Dinghy`) holds and is not
collapsed.

Two Minor scale-band deviations from the locked Scale Bible `SMALL_WORKING_BOAT` band (80–112×32–48 px practical):

- `small-workboat`'s practical height (56 px) exceeds the band's 48 px ceiling by ~17%; its width (79 px) is
  within 1 px of the floor. This is the category's first illustrated PNG (the four existing small boats are flat
  programmatic shapes), so some deviation from a programmatic-shape-derived band is plausible, but the deviation
  is not noted or justified anywhere in the implementation report.
- `harbor-dinghy`'s practical bounds (68×29) fall entirely below the `SMALL_WORKING_BOAT` floor, effectively
  introducing an unlocked "smallest utility craft" sub-tier the pre-review asked for conceptually but the Scale
  Bible has no companion entry for.

Neither deviation threatens the hierarchy or the fleet's readability; both are documentation gaps, not visual
defects.

---

## E. Dockside Asset Audit

```text
DOCKSIDE_ASSET_PASS
```

(Asset-file hygiene only — composition/placement is reviewed separately in Parts F, G, and K.)

| id | canvas | measured practical bbox | display | bytes | ceiling | tier |
| --- | --- | --- | --- | --- | ---: | --- |
| `dock-rope-line-v01` | 64×34 | (4,6) 56×21 | 64×34 | 2,734 | 6,144 | detail |
| `dock-gangplank-v01` | 64×38 | (8,4) 47×30 | 64×38 | 3,237 | 6,144 | detail |
| `dock-buoy-v01` | 32×40 | (4,4) 24×32 | 32×40 | 2,051 | 6,144 | detail |
| `dock-hand-cart-v01` | 56×46 | (4,7) 48×31 | 56×46 | 3,836 | 6,144 | detail |
| `dock-work-net-v01` | 58×48 | (4,4) 50×40 | 58×48 | 5,298 | 6,144 | detail |

Exactly five new dockside detail assets confirmed (matching the pre-review's recommended scope precisely). All
five: `provenance: generated-original`, `status: GAME_READY`, true 1×, zero hidden-RGB pixels, `maxAlpha == 255`,
padding ≥4 px on every side (independently decoded, not trusted from the manifest — no per-asset audit JSON exists
for Batch 03, unlike Batch 01/02's `batchNNAssetAudit.json` pattern; see Finding BT-06). All five sit comfortably
under the 6 KB small-prop ceiling. 15°-compatible silhouettes (rope line, flat plank gangplank, grounded buoy,
wheeled cart, netted mass) are consistent with the world's established prop grammar. BASE_URL loading confirmed
(Part O).

---

## F. Secondary Cap

```text
SECONDARY_CAP_PASS
```

`DENSITY_CAPS.secondary` remains `40` in `layoutValidation.mjs` — byte-unchanged from Batch 02. Independently
recounted every `harborVisuals` entry by tier: `{ primary: 6, secondary: 40, detail: 41 }`. Secondary is at exactly
40/40 — the two new vessels consumed exactly the two previously-reserved slots, as the director decision required.
All five dockside props are `detail` tier (41/45, 4 slots free), correctly avoiding the exhausted secondary
budget. No hidden bypass: grepped for any second `DENSITY_CAPS`-like constant or an alternate cap path — none
exists.

---

## G. BERTHING_SLOTS

```text
BERTHING_METADATA_NEEDS_FIX
```

`portfolio-world/src/world/berthingSlots.ts` is exactly the allowed shape — a static array of
`{ id, x, y, heading, vesselClass, assignedVesselId }`, no occupancy engine, no assignment logic, no runtime
search, no movement. That much is correct.

However: `grep -rn "berthingSlots\|BERTHING_SLOTS" src/ tests/` returns **only the file's own definition line** —
it is imported by nothing. `BootScene.ts` and `WorldScene.ts` never reference it; no test reads it. The four
records' coordinates do currently match their `assignedVesselId`'s actual `worldLayoutData.json` position exactly
(`hero-large` 1420/1236, `medium-west` 500/1116, `small-work-west` 700/1116, `utility-pocket` 980/1210 — all
confirmed identical to the raw layout entries), but this is manual duplication, not a structural reference: if a
future edit moves `harbor-dinghy` in `worldLayoutData.json`, nothing would fail, warn, or even notice that
`berthingSlots.ts` had gone stale. This is precisely the "dead documentation" outcome this review's own
instructions asked to rule out, and it directly undercuts the two reasons the pre-review gave for wanting
`BERTHING_SLOTS` introduced now rather than deferred again: it is not "a natural anchor for the overlap validator"
(nothing reads it) and it is not really "a real foundation for future dynamic berthing" (a future berth-assignment
system would still have to rediscover vessel positions from `worldLayoutData.json`, not from this file, since
nothing keeps them in sync).

---

## H. Berthing Composition

```text
BERTHING_COMPOSITION_PASS_WITH_MINOR
```

Hero/large berth, medium berth, and the small-workboat position all read as attached to a real dock relationship:
the small workboat (700,1116) sits ~44 px from `harbor-pier-west`'s edge, well within a believable "moored near
the pier" reading; the existing hero/medium berths are unchanged. The irregularity the human direction asked for
is preserved — the new vessels are not parallel-parked or evenly spaced relative to the existing fleet.

The dinghy (980,1210) sits ~44 px from `harbor-service-jetty`'s nearest edge — close enough to read as plausibly
"near a dock," matching its own `berthingSlots.ts` label (`utility-pocket`). This is acceptable, though it is the
one placement in this batch closest to reading as "just floating in open water" rather than clearly tied to a
specific structure; a slightly tighter placement against the jetty would remove any ambiguity. Not a defect on its
own — flagged only because the disconnected-gangplank finding (Part I) makes precise berth-to-structure distance
worth double-checking project-wide.

---

## I. Dockside Activity

```text
DOCKSIDE_COMPOSITION_NEEDS_FIX
```

The cart/net/rope cluster near the existing Batch 02 work-yard (west of the harbor, around the warehouse annex and
service hut) does read as functional loading activity in principle — a cart and net near cargo storage is a
sensible pairing. But two of the five props fail the composition requirement this section itself sets:

- **`dock-gangplank` has no discernible relationship to any vessel or dock.** Its position (872,1008) is ~130 px
  from the nearest pier (`harbor-pier-west`/`harbor-service-jetty`) and ~200+ px from the nearest vessel (the new
  small-workboat or any existing secondary vessel) — independently measured by straight-line distance from its
  center to the nearest edge of each candidate structure. A gangplank's entire compositional purpose is "crossing
  from a dock to a ship"; at this distance it reads as an isolated prop sitting in the general work-yard, not a
  ship-to-dock connector. This is exactly the relationship Part F's own composition checklist names
  ("gangplank ↔ vessel/dock relationship") and it is not satisfied.
- **`dock-buoy` is placed on dry land**, independently confirmed: its rendered box (804–836, 892–932) is at least
  28 px from the nearest edge of any of the three declared water polygons (nearest is `harbor-west-basin`, top
  edge at y=960). A buoy is a floating open-water navigation marker; placed inland next to a rope line and a
  gangplank, it reads as a stray prop rather than "this is a working channel" (the pre-review's own stated
  purpose for including it at all).

These two failures are compounded by Part K's finding that neither prop's placement was checked against anything
before being committed.

---

## J. Overlap Validator

```text
OVERLAP_VALIDATION_NEEDS_FIX
```

`layoutValidation.mjs` has a **zero-line diff** in this batch. `WATERFRONT_STATIC_VISUAL_ITEMS` still lists exactly
the nine IDs from the Batch 02 v2 hotfix; none of the 7 new Batch 03 IDs were added to it or to any other explicit
pairwise check. Reviewed against the five relationship classes this section itself requires:

| required relationship | coverage |
| --- | --- |
| ship ↔ ship | **Covered, but not by anything Batch 03 added** — the pre-existing generic `FLOATING_VESSEL_TYPES` pairwise-overlap and water-containment checks apply automatically because both new vessels reuse the `secondary-sailing-ship` type. This is real coverage, inherited "for free." |
| ship ↔ dock/fixed structure | **Not covered** — no check exists anywhere for a vessel's rendered content against a dock/pier's footprint (only a coarse full-containment-in-water check exists, which cannot catch a ship visually overlapping a pier). |
| dock prop ↔ dock prop | **Not covered** — none of the 5 new props are compared against each other by any mechanism. |
| dock prop ↔ protected existing object | **Not covered** — none of the 5 new props were added to `WATERFRONT_STATIC_VISUAL_ITEMS`; only 2 of the 5 (`dock-rope-line` via `rope-coil` type, `dock-buoy`/`dock-gangplank`/`dock-work-net` via `barrel`/`crate` types) incidentally inherit the unrelated `LAND_SIDE_PROP_TYPES` water-overlap check, which checks the wrong thing (water, not neighboring props) for this purpose. |
| gangplank ↔ protected walking/fixed feature | **Not covered** — `dock-gangplank`'s reused `crate` type is not a member of `PERMANENT_STREETSCAPE_TYPES`, so it receives no protected-navigation check at all (it happens to be far from any path/forecourt, so this specific gap caused no incident here, but it is still unchecked). |

Only 1 of 5 required relationship classes has real coverage, and that one was inherited rather than added. This is
the direct cause of Part K's findings: nothing in the automated suite could have caught any of them, and nothing
did.

---

## K. Independent Broad Sweep

```text
OVERLAP_VALIDATION_NEEDS_FIX (see also J)
```

Did not trust the committed validator (which, per Part J, does not check most of this surface area). Independently
reconstructed every new item's real rendered/display rectangle from `WorldScene.ts`'s actual placement formula
(`image(visual.x, visual.y + visual.height/2, ...).setOrigin(0.5, originY).setDisplaySize(...)`) combined with a
from-scratch alpha decode of all 7 new PNGs, then swept pairwise against: each other, the 9 `WATERFRONT_STATIC_
VISUAL_ITEMS` plus their close Batch 02 neighbors, and every other `harborVisuals` entry (nominal box). Results:

| pair | overlap (w×h) | classification |
| --- | --- | --- |
| `dock-rope-line` ↔ `waterfront-viewing-terrace` | 20.0 × 21.0 px | **Material** — new prop overlaps the exact protected object two prior hotfixes fixed and re-fixed |
| `dock-rope-line` ↔ `waterfront-viewing-lamp` | 24.0 × 5.4 px | **Material** — real, independently confirmed |
| `dock-buoy` ↔ `harbor-mooring-bollard` (Batch 02, unmoved) | 18.0 × 22.0 px | **Material** — comparable magnitude to previously Major-classified overlaps |
| `dock-rope-line` ↔ `dock-buoy` (both new) | 12.0 × 17.4 px | **Material** — two new props overlap each other |
| `dock-hand-cart` ↔ `harbor-rope-coil` (Batch 02, unmoved) | 24.0 × 6.9 px | **Material** |
| `dock-work-net` ↔ `harbor-barrel-cluster` (Batch 02, unmoved) | 7.0 × 17.0 px | **Material, smaller** |
| `dock-hand-cart` ↔ `dock-work-net` (both new) | 1.0 × 24.2 px | **Non-material** — 1 px width is a boundary touch (24 px² total area), within alpha-threshold measurement tolerance, not a real visible clash |
| `harbor-small-workboat` / `harbor-dinghy` vs their water polygons | full content depth | **Intentional, correct** — vessels are supposed to sit in water; this is the containment check succeeding, not a defect |
| `harbor-rope-coil` ↔ `harbor-notice-board` (pre-existing, both unrelated to Batch 03) | 18.0 × 3.4 px | **Unrelated pre-existing minor touch**, carried forward from the Batch 02 short re-check, not new |

Six genuinely material, independently-verified new overlaps, none of them intentional (no compositional reason is
stated or apparent for any of them — they are not, for example, a rope deliberately draped across a bollard with a
visible attachment point; they are simply unrelated props whose rendered content happens to intersect). All six
trace back to the same root cause identified in Part J: nothing checked these placements before they were
committed. `validateWorldLayout(...)` on the current committed layout does **not** throw — independently confirmed
— meaning the automated suite is silent about every one of these six.

---

## L. Collision / Navigation

```text
COLLISION_NAVIGATION_PASS
```

All 7 new entries have `collidable: false` (confirmed directly from `worldLayoutData.json`, not the report).
`COLLIDABLE_HARBOR_VISUAL_TYPES` is unchanged (`water`, `warehouse` only). `dock-gangplank` and every dock prop are
visual-only, as required — `createWaterCollisionRects()` and `REQUIRED_WALKABLE_PIER_IDS` are byte-unchanged, so no
new walkable/collidable geometry exists anywhere. `zones`, `paths`, `forecourts`, `reservedLots`, `Player.ts`,
`gameConfig.ts`, and `waterCollisionGeometry.mjs` are all confirmed byte-identical to before this batch. Harbor
Square circulation, destination access, and water carve-outs are untouched.

---

## M. Depth / Occlusion

```text
DEPTH_OCCLUSION_PASS
```

`worldDepth.mjs` has a zero-line diff — no new band, constant, or formula. Both new vessels route through the
unchanged `getVesselDepth()` call, identical to every existing secondary vessel. The five dockside props reuse
existing type strings purely for depth-routing purposes: `rope-coil` (dock-rope-line) and `barrel` (dock-buoy) fall
into the existing `LOW_PROP_TYPES` band; `cart` (dock-hand-cart) falls into `BODY_TYPES`; `crate` (dock-gangplank,
dock-work-net) falls to the existing `GROUND_DETAIL` fallback. Each is a sensible band for a ground-level prop of
that rough scale, and none required a new constant. This reuse strategy is depth-safe — its cost is entirely in
validator coverage (Parts G, I), not in occlusion correctness. No player/prop draw-order issue was found in the
reconstructed geometry.

---

## N. Asset Hygiene

```text
ASSET_HYGIENE_PASS
```

Independently re-ran the same from-scratch, reproducible non-interlaced RGBA PNG decoder used in the Batch 02
reviews against all 7 new files: zero hidden-RGB pixels in any file; every opaque interior reaches true
`alpha == 255`; every file's `displayWidth == sourceWidth` (true 1×, confirmed against the manifest); every file's
tightest padding side is exactly 4 px (the locked minimum), with no low-alpha halo extending the strict bound
beyond the practical one in any of the 7. All provenance is `generated-original`, all status `GAME_READY`.

One process note, not a hygiene failure: unlike Batch 01/02, no `batch03AssetAudit.json` (or equivalent) exists
recording these measurements — the manifest carries only `sourceWidth/Height`/`displayWidth/Height`/`originY`,
without the `visibleBounds`/`fileBytes`/`weightCeilingBytes` record the project's own `07_ASSET_POLICY.md`
requires ("each production-approved visual must have a maintained asset-audit record"). See Finding BT-06.

---

## O. Runtime Preload

```text
RUNTIME_BUDGET_PASS
```

Independently reconstructed the exact production (non-DEV) preload set from `BootScene.preload()` (all pre-Batch-
03 assets plus the 7 new ones) and summed real file bytes from disk:

```text
Before (independently recomputed, matches canonical exactly): 659,767 bytes
Batch 03 addition:                                              31,239 bytes
After:                                                          691,006 bytes
```

The pre-review's ≤~56 KB estimate was not a target, and the actual addition (31,239 bytes) is comfortably under
it. 691,006 bytes remains well inside the locked LOW scenario (~1.01 MB). BASE_URL resolution re-verified: rebuilt
`world/index.html` references the correct rebuilt bundle hash (`index-CU84XluB.js`, matching the commit), and
grepping the built bundle for `batchView`/`assetPreview` returns zero matches (dev-only code remains
dead-code-eliminated in production).

```text
BASE_URL_BUILD_OUTPUT_PASS
```

---

## P. Test Coverage

```text
TEST_COVERAGE_NEEDS_FIX
```

The reported 27/27 is the *same* 27 tests as the Batch 02 v2 hotfix state, not new tests — `tests/spatial-
layout.test.mjs` has a two-line diff: one pre-existing assertion's expected vessel count was bumped from 4 to 6.
That test's own name, `"harbor refinement fits four secondary sailing vessels and keeps the service jetty
walkable"`, is now stale (it asserts six, not four) — a small but real naming/documentation drift (Finding BT-05).

Independently confirmed via code inspection, not assumption:

- **`BERTHING_SLOTS` received zero executable coverage** — no test imports or asserts anything about
  `berthingSlots.ts` (consistent with Part G's finding that nothing references it at all).
- **Batch 03 overlap behavior received zero executable coverage** — no new regression fixture was added for any
  of the 7 new items, unlike both Batch 02 hotfixes, each of which added an explicit `assert.throws(...)`
  regression test alongside its coordinate fix. The one existing overlap-related test that changed only counts
  vessels; it does not exercise the new dockside props at all.
- The two carried-forward Batch 02 overlap regression tests (generation-1 and v1-self-inflicted coordinates)
  still pass and are unaffected by this batch — that part of the suite remains trustworthy for what it already
  covers, just not for anything Batch 03 added.

A larger test count is not required for its own sake, but the specific behaviors this batch was required to prove
safe (berth-metadata correctness, no new overlap) are not exercised by any test, which matches exactly what the
independent broad sweep in Part K then found by hand.

---

## Q. QA

Run from `portfolio-world/` after resolving the stale-preview lock (Part B):

| Step | Result |
| --- | --- |
| `npm ci` | Initially failed (`EPERM` unlinking `@rolldown/binding-win32-x64-msvc`, held by a stale repo-owned `vite preview` process, PID 11368/27936 — stopped, see Part B); PASS on retry — 19 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS (`tsc --noEmit`, exit 0) |
| `npm test` (typecheck + build + tests) | PASS — build `world/assets/index-CU84XluB.js` 1,438.66 kB / gzip 372.31 kB (only the pre-existing >500 kB advisory); **27/27 tests PASS**, 0 fail |
| Build reproducibility | PASS — rebuild produced a byte-identical `world/` output (`git status` empty afterward) |
| `git diff --check` | PASS (exit 0) |

---

## R. Integrated Visual Review

**Evidence source: rendered-geometry reconstruction + code/data inspection.** No live or headless browser was
available in this sandboxed environment for this review (consistent with every prior review in this chain); no
screenshot was captured or is claimed as evidence. Every claim below is backed by the exact placement formula
`WorldScene.ts` uses, real alpha-decoded asset bounds, and direct coordinate arithmetic — not visual impression.

- **Does the harbor feel more operational?** Partially. The west work-yard cart/net addition and the two new
  vessels genuinely add activity. But the buoy-on-land and disconnected-gangplank placements (Part I) read as
  stray props rather than reinforcing "the dock is operating," and the six confirmed overlaps (Part K) mean at
  least two spots in the scene (the rope-line/terrace/lamp cluster, and the buoy/bollard pair) will show visibly
  overlapping sprites.
- **Are the new boats subordinate to Hero/Medium vessels?** Yes — confirmed numerically (Part D); no visual
  competition with the fleet hierarchy.
- **Does the dock feel active without being overfilled?** Density is fine (Part F) — the problem is placement
  precision, not quantity.
- **Does the accepted slightly messy harbor character remain?** The *intent* is preserved (irregular spacing, no
  new grid), but "functional messiness" and "visual collision" are exactly the two things this batch was asked to
  keep distinct (Batch 02 human direction, restated in this batch's own instructions), and several of the new
  placements land on the wrong side of that line.

---

## S. Findings

No Blocker. Five Major, four Minor.

```text
ID: BT-01
Severity: Major
Category: implementation defect (missing validation, explicitly required)
Finding: layoutValidation.mjs was not extended to cover any of the 5 new dockside props or the gangplank-vs-
  navigation relationship this batch's own instructions explicitly required before implementation.
Evidence: git diff b0bcee7..48d3558 -- portfolio-world/src/world/layoutValidation.mjs is empty; Part J's
  relationship-by-relationship coverage table (1 of 5 required classes covered, and only incidentally).
Impact: Directly enabled Findings BT-02/BT-03/BT-04 to ship undetected; the automated suite gives false
  confidence about this entire area of the scene.
Recommended action: Add the 7 new IDs (or at minimum the 5 dockside props) to an extended named-set pairwise
  check, following the exact pattern layoutValidation.mjs already has (WATERFRONT_STATIC_VISUAL_ITEMS /
  renderedVisibleRect / assertDoesNotOverlap), before re-placing any coordinate.

ID: BT-02
Severity: Major
Category: implementation defect (visual-composition regression, verified real overlap)
Finding: Six independently-confirmed material overlaps exist among the new Batch 03 props and between them and
  existing Batch 02 furniture, most notably dock-rope-line visibly overlapping waterfront-viewing-terrace
  (20.0×21.0 px) and waterfront-viewing-lamp (24.0×5.4 px) — the exact protected object two prior hotfixes had to
  fix.
Evidence: Part K's full table; independent rendered-rectangle reconstruction using WorldScene.ts's real placement
  formula and from-scratch alpha decoding of all 7 new PNGs; validateWorldLayout(...) does not throw on the
  current committed layout, confirming none of this is caught today.
Impact: Visible sprite-on-sprite clutter recurs in the waterfront/work-yard area this project has already had to
  fix twice. No functional/collision/navigation impact (all items non-collidable).
Recommended action: Reposition dock-rope-line, dock-buoy, dock-hand-cart, and dock-work-net so their rendered
  content clears the six listed pairs; verify with the extended validator from BT-01 before committing new
  coordinates.

ID: BT-03
Severity: Major
Category: visual-composition concern (semantic/placement mismatch)
Finding: dock-buoy is placed on dry land, at least 28 px from the nearest water polygon edge, contradicting its
  purpose as a floating open-water marker; dock-gangplank sits ~130 px from the nearest pier/jetty and ~200+ px
  from the nearest vessel, with no discernible dock/vessel relationship.
Evidence: Part I; direct coordinate distance checks against all three water polygons and all dock/vessel
  structures.
Impact: Both props fail the compositional purpose the pre-review and this review's own instructions state for
  them; a buoy on land and an unconnected gangplank read as misplaced decoration rather than working-dock detail.
Recommended action: Move dock-buoy into open water near the west or east basin (clear of any vessel, per BT-02's
  fix); move dock-gangplank adjacent to a specific vessel/pier pair (e.g., the small-workboat and harbor-pier-west)
  so it visually reads as a crossing.

ID: BT-04
Severity: Major
Category: architecture gap (dead code, contradicts stated purpose)
Finding: BERTHING_SLOTS (berthingSlots.ts) is defined but imported/referenced nowhere in src/ or tests/; its
  coordinate values currently match worldLayoutData.json only by manual duplication, with no structural link.
Evidence: grep -rn "berthingSlots|BERTHING_SLOTS" src/ tests/ returns only the definition file itself.
Impact: The two reasons the pre-review gave for introducing this structure now (anchor for the overlap validator;
  foundation for future dynamic berthing) are both unmet — a future edit to a vessel's position would desync
  silently, and no current code benefits from the structure existing.
Recommended action: Either wire BERTHING_SLOTS into the overlap validator (e.g., assert each assignedVesselId's
  actual worldLayoutData.json position matches its slot's x/y) so drift is caught automatically, or wire it into
  vessel placement itself (derive vessel x/y from the slot rather than duplicating it) — either closes the gap;
  leaving it unreferenced does not.

ID: BT-05
Severity: Major
Category: test coverage gap
Finding: The reported 27/27 is the same test set as the Batch 02 v2 hotfix, plus one changed assertion count
  (4→6 vessels); zero new tests exercise BERTHING_SLOTS or any Batch 03 overlap/placement behavior.
Evidence: Part P; git diff b0bcee7..48d3558 -- portfolio-world/tests shows a 2-line diff total.
Impact: The test suite cannot detect any future regression in this batch's own new surface area (props,
  berthing) — it only protects what Batch 02 already protected.
Recommended action: Add at minimum one regression test per the extended validator from BT-01 (mirroring the two
  tests the Batch 02 v2 hotfix added), and one test asserting BERTHING_SLOTS/worldLayoutData.json consistency if
  BT-04 is fixed via the "assert consistency" option.

ID: BT-06
Severity: Minor
Category: documentation/process gap
Finding: No batch03AssetAudit.json (or equivalent) exists, unlike Batch 01/02's per-asset audit record required
  by 07_ASSET_POLICY.md ("each production-approved visual must have a maintained asset-audit record" with
  visibleBounds/fileBytes/weightCeilingBytes).
Evidence: No such file in the b0bcee7..48d3558 diff; compare batch01AssetAudit.json / batch02AssetAudit.json.
Impact: None on correctness (independently re-measured and confirmed compliant in Part N), but breaks the
  project's established audit-trail pattern.
Recommended action: Add the audit file the next time this batch's assets are touched.

ID: BT-07
Severity: Minor
Category: scale-band documentation gap
Finding: small-workboat's practical height (56 px) exceeds the locked SMALL_WORKING_BOAT band's 48 px ceiling by
  ~17%; harbor-dinghy's practical bounds (68×29) fall entirely below the band's floor. Neither is noted as a
  reviewed exception anywhere.
Evidence: Part D measurement table vs. Scale Bible §I.
Impact: None on hierarchy or readability (confirmed); a documentation gap only.
Recommended action: Record both as explicit Scale Bible exceptions (or formally open a new "utility craft"
  sub-band) the next time the Scale Bible is touched.

ID: BT-08
Severity: Minor
Category: test naming staleness
Finding: The test "harbor refinement fits four secondary sailing vessels and keeps the service jetty walkable"
  now asserts a count of 6, not 4.
Evidence: tests/spatial-layout.test.mjs diff (Part P).
Impact: None on correctness; purely a stale name.
Recommended action: Rename to reflect the current fleet count when next touched.

ID: BT-09
Severity: Minor
Category: type-system side effect
Finding: Reusing existing type strings (crate, barrel, cart, rope-coil) for the 5 new props' depth routing also
  silently determines their (in)eligibility for unrelated validator checks — e.g. dock-buoy's "barrel" type opts
  it into a water-overlap check that is semantically backwards for a floating marker, while dock-gangplank's
  "crate" type opts it out of the protected-navigation check a gangplank arguably should have.
Evidence: Part J's coverage table; layoutValidation.mjs type-set membership (LAND_SIDE_PROP_TYPES,
  PERMANENT_STREETSCAPE_TYPES) cross-referenced against worldAssetManifest.ts's type reuse.
Impact: Root-cause explanation for part of BT-01's gap, not a separate functional defect.
Recommended action: If BT-01 is fixed with new explicit type strings (rather than reused ones), this resolves
  automatically; otherwise call out each reused type's validator side effects explicitly in code comments.
```

---

## T. Human Review Readiness

Not ready. The batch's asset production (files, hygiene, weight, hierarchy) is solid enough to build on, but the
placement/validation work that was supposed to accompany it — the explicit core requirement of this batch — was
not done. Sending this to human review now would ask a human reviewer to notice, by eye, exactly the class of
defect (overlapping sprites, a stray buoy on land, a disconnected gangplank) that this project has already built
the tooling to catch automatically, and chosen not to apply here.

## U. Final Recommendation

```text
RETURN_TO_CODEX
```

Fix BT-01 through BT-05 (extend the overlap validator to the 7 new items; reposition the 4 props named in BT-02/
BT-03 and re-verify with that validator; wire or remove BERTHING_SLOTS per BT-04; add regression coverage per
BT-05), then resubmit for a short independent recheck before Batch 03 human review — the same pattern the
waterfront overlap hotfix already used successfully twice. The four Minor findings (BT-06–BT-09) do not block that
recheck. Batch 04 remains not authorized.
