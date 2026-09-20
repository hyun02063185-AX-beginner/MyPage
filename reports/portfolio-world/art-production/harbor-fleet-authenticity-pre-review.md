# Harbor Fleet Authenticity Pass — Pre-review
## Portfolio World — Retro Harbor Campus

> Canonical repo path:
> `reports/portfolio-world/art-production/harbor-fleet-authenticity-pre-review.md`

This is a pre-review, not an implementation. No runtime code, layout coordinate, `BERTHING_SLOTS` entry, test, or
PNG asset was modified while producing it. Every ship image referenced below was viewed directly (not inferred
from metadata) to assess sail state, hull character, and Age-of-Sail readability.

---

## A. Gate

```text
READY_FOR_FLEET_AUTHENTICITY_DIRECTOR_GATE
```

The active fleet is fully audited against actual runtime code (not report claims). All four active sailing
vessels — Hero Ship D, the merchant brig (used twice), the medium sailing vessel, and the harbor cutter — are
confirmed `FULL_SAIL_INCORRECT_FOR_BERTH`. Both small craft (workboat, dinghy) are already sail-free and need no
change. The required production scope is clear, implementable within the locked 15° grammar, and requires no
harbor-layout change, no vessel-count change, and no Hero-scale change.

---

## B. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| Branch | `feature/portfolio-world-sprint-02` (confirmed) |
| HEAD | `f1f68b0` (confirmed) |
| Git status | clean |

---

## C. Current Batch 03 State

Batch 03 Integration Hotfix (`36e8cb1`/`b62c54b`) is implemented and its Short Re-check independently returned
`PASS` (this session, immediately prior to this pre-review): all six previously-reported material overlaps closed,
zero new material overlap in an independent broad sweep, the overlap validator genuinely extended to the Batch 03
scene, `dock-buoy` semantically typed `buoy` and water-contained, `dock-gangplank` genuinely contacts the small
workboat and terminates at the west pier, `BERTHING_SLOTS` confirmed to be the real runtime source of truth for
the workboat and dinghy (by direct code read of `berthingPlacement.mjs`, which unconditionally overwrites
`x`/`y`/`heading` when a berth matches), 30/30 tests, and canonical preload unchanged at `691,006` bytes. This
satisfies the execution gate for this pre-review.

---

## D. Human Art Direction

Authoritative, user-confirmed requirement, restated for the production record: **moored ships must have furled/
stowed sails** — the current fully-deployed-sail look is unnatural for a berthed fleet. The harbor's representative
vessel must read as an **Age-of-Sail** wooden sailing ship (exploration/merchant/expedition character, not a
specific nation's warship). This is the top-level criterion for every classification below. Full sails remain
permitted only for a future, separately-implemented actively-sailing vessel — out of scope here.

---

## E. Active Fleet Inventory

Determined from `worldAssetManifest.ts`, `BootScene.ts`'s non-DEV preload branch, `worldLayoutData.json`,
`WorldScene.ts`'s `getSecondarySailingAsset()`/hero-ship rendering, and `berthingSlots.ts` — not from any report's
claimed inventory.

| Placement ID | Role | Asset (`textureKey`) | Status | Berth slot | Display W×H | Practical alpha bounds | Bytes | Tier |
| --- | --- | --- | --- | --- | ---: | --- | ---: | --- |
| `harbor-large-ship` | Hero Ship | `heroShipD` (`hero-ship-d-v01.png`) | GAME_READY | *unwired* `hero-large` (coincidental coordinate match only) | 365×255 | 357×247 | 142,840 | primary |
| `harbor-west-merchant-brig` | Secondary vessel | `secondaryBrig` (`secondary-brig-v01.png`) | GAME_READY | none | 136×121 | 128×113 | 23,837 | secondary |
| `harbor-east-merchant-brig` | Secondary vessel (mirrored, `setFlipX`) | `secondaryBrig` (same file, reused) | GAME_READY | none | 136×121 | 128×113 | 23,837 (shared) | secondary |
| `harbor-west-cargo-schooner` | Medium vessel | `mediumSailingVessel` (`medium-sailing-vessel-01-v01.png`) | GAME_READY | *unwired* `medium-west` (coincidental match only) | 168×121 | 160×113 | 31,654 | secondary |
| `harbor-east-harbor-cutter` | Light-medium vessel | `secondaryCutter` (`secondary-cutter-v01.png`) | GAME_READY | none | 101×100 | 93×92 | 13,771 | secondary |
| `harbor-small-workboat` | Small workboat | `smallWorkboat` (`small-workboat-v01.png`) | GAME_READY | `small-work-west` (wired, resolver-driven) | 110×64 | 79×56 | 8,970 | secondary |
| `harbor-dinghy` | Dinghy/tender | `harborDinghy` (`harbor-dinghy-v01.png`) | GAME_READY | `utility-pocket` (wired, resolver-driven) | 76×42 | 68×29 | 5,113 | secondary |
| `waterfront-boat` | Small boat | programmatic (no PNG) | n/a | none | 112×48 declared | n/a | 0 | secondary |
| `harbor-basin-boat` / `harbor-cargo-boat` / `harbor-offshore-boat` | Small boats | programmatic (no PNG) | n/a | none | 96×40 / 88×36 / 80×32 declared | n/a | 0 | detail |

Only `harbor-small-workboat` and `harbor-dinghy` carry an actual `berthSlotId`. `BERTHING_SLOTS` also declares
`hero-large` and `medium-west` entries whose `x`/`y` happen to numerically equal `harbor-large-ship`'s and
`harbor-west-cargo-schooner`'s own `worldLayoutData.json` coordinates, but neither vessel has a `berthSlotId`
field — those two slots are documentation only and do not drive runtime placement (see Part N).

**Non-active, excluded from this audit's production scope:**

| Asset | Status | Note |
| --- | --- | --- |
| `heroShipA` / `heroShipB` / `heroShipC` | CONCEPT | DEV-only `?heroShip=a\|b\|c` comparison candidates; dead-code-eliminated from production, never in the non-DEV `BootScene` list. |
| `secondarySchooner` | DEPRECATED | Explicitly superseded by the Batch 01 medium vessel; non-loaded source evidence only. |
| Calibration-angle variants (`calibration/*.png`) | n/a | DEV-only `?assetPreview=calibration` comparison surface; never in production preload. |

---

## F. Sail-state Audit

Classified by direct visual inspection of each PNG, not inference from metadata.

| Vessel | Sail state | Classification |
| --- | --- | --- |
| Hero Ship D | All three masts carry large, billowing, fully deployed sails; pennants flying | **C. FULL_SAIL_INCORRECT_FOR_BERTH** |
| Secondary Brig | Main mast carries a large fully deployed sail; a smaller foresail/jib is also deployed at the bow | **C. FULL_SAIL_INCORRECT_FOR_BERTH** |
| Medium Sailing Vessel | Both masts carry fully deployed sails | **C. FULL_SAIL_INCORRECT_FOR_BERTH** |
| Harbor Cutter | Single mast, single gaff-style sail, fully deployed | **C. FULL_SAIL_INCORRECT_FOR_BERTH** |
| Small Workboat | No mast/sail — a small cabin/wheelhouse utility craft | **D. NO_SAIL_NOT_APPLICABLE** |
| Dinghy | No mast/sail — open oared rowboat, oars visible | **D. NO_SAIL_NOT_APPLICABLE** |
| Programmatic small boats (×4) | Vector-drawn simple hull shapes, no sail geometry at all | **D. NO_SAIL_NOT_APPLICABLE** |

Every currently-rigged sailing vessel in the active fleet is incorrect for a moored berth. This is not a partial
problem — it is the entire active sailing fleet.

---

## G. Age-of-Sail Audit

| Vessel | Classification | Notes |
| --- | --- | --- |
| Hero Ship D | **PASS_AGE_OF_SAIL** (sail-state aside) | Wooden hull, 3 masts, richly detailed stern with carved gold trim, anchor, multiple window/gallery rows along the hull read as ornamental cabin glazing (not gunports) — already reads as exploration/merchant tall ship, not a specific national warship. No over-armed or nationally-specific detail found. |
| Secondary Brig | **PASS_WITH_MINOR** | Wooden hull and rigging language are consistent with the world; the second mast/foresail is visually subordinate to the main mast, so "two-mast brig" reads more like a single-mast-dominant craft at a glance. Not a defect for this pass, but worth keeping in mind if regenerated. |
| Medium Sailing Vessel | **PASS_AGE_OF_SAIL** | Two clearly readable masts, teal/gold trim matching Hero D's palette family, deck levels visible — coherent brigantine-merchant character. |
| Harbor Cutter | **PASS_AGE_OF_SAIL** | Compact single-mast, gaff-rigged silhouette, simple wood hull — reads correctly as a small working sailing craft. |
| Small Workboat | **NOT_APPLICABLE** | Not a sailing vessel by design; evaluated for general period-fit instead (Part I). |
| Dinghy | **NOT_APPLICABLE** | Not a sailing vessel by design. |

No vessel needs a `NEEDS_REDESIGN` or `REPLACE`-level Age-of-Sail correction — the hull/rigging language is already
right across the board. The only correction this pass requires is sail state.

---

## H. Hero Ship Audit

Hero Ship D already delivers the "big Age-of-Sail vessel" read the human direction asks for: three masts, a
deep, richly detailed hull with a raised, ornamented stern, and full rigging. Its current scale
(`LOCKED_FROM_D`, human-approved, 357×247 px practical / 365×255 canvas) is preserved by default per this pass's
own instruction and is not revisited here.

- **Can current Hero D be retained structurally?** Yes — hull, stern mass, and mast placement are all sound; only
  the sail state needs to change.
- **Is a new Hero vessel required?** No. This is a targeted regeneration of the existing design, not a redesign.
- **Is 3-mast appropriate?** Yes, and already present — preserve it.
- **Is stern/cabin mass sufficient?** Yes — the current stern gallery and gold trim already read as a proper
  Age-of-Sail flagship stern.
- **Can the ship read as "the representative vessel" with sails furled?** Only if the regeneration deliberately
  compensates for lost sail silhouette with mast/yard/rigging/furled-canvas-bundle detail (Part K/R) — this is
  the central risk to manage, not a reason to avoid the change.
- **Can accepted scale be retained?** Yes — no scale-class change is proposed or required.

**Practical bounds risk:** Hero D's practical-visible content (357×247) occupies nearly the full 365×255 canvas —
the deployed sails are a major contributor to that vertical extent. Furling will very likely *reduce* the
practical height (the sail canvas currently reaches near the canvas top); this is expected and acceptable, and
should not be treated as a scale regression as long as the hull/deck footprint (the locked reference) stays the
same. The generation brief should explicitly state the hull must not shrink or move even if overall canvas
practical bounds decrease.

---

## I. Medium Vessel Audit

The medium sailing vessel and the two secondary vessels (brig ×2, cutter) form the functional "medium" tier under
Hero D. All three currently carry fully deployed sails and need the same correction. Visual character (wooden
hull, teal/gold trim family, coherent rigging) is already appropriate — no redesign of hull identity is implied,
only sail state. The east-side merchant brig placement (`setFlipX`) will automatically inherit whatever furled
design the base brig asset receives — no separate asset or extra byte cost for the mirrored instance.

---

## J. Small Vessel Audit

Small Workboat and Dinghy require no sail-state correction (Part F: `NOT_APPLICABLE`) and are recommended `KEEP`
outright. Design review against the human direction's own allowances ("oared tender," "utility boat," "small
harbor sailboat," "single-mast small craft"):

- **Small Workboat** presents as a small wooden-hulled cabin/pilot-house utility craft. It carries no visible
  engine, exhaust, or explicitly modern hardware, so it does not read as an anachronistic motorboat even though
  it is not a sailing vessel — the human direction's "no modern motorboat language" restriction is scoped to
  *main sailing vessels* and does not apply here regardless.
- **Dinghy** is a simple open rowboat with two oars, unambiguously period-appropriate and already exactly the
  "oared tender" the direction explicitly allows.

Neither competes with the Hero/Medium tier in scale or visual weight (Part L).

---

## K. KEEP / RETOUCH / REGENERATE / REPLACE Matrix

| Vessel | Action | Reason |
| --- | --- | --- |
| Hero Ship D | **REGENERATE** | Full sails occupy the dominant share of the vertical silhouette (practical bounds reach 247 of 255 canvas px); furling changes yard visibility, rigging routing, mast silhouette, tied-canvas bundles, and upper-deck exposure together — exactly the set of changes this pass's own "do not fake it" rule (targeted regeneration, not sail-erasure) requires. Hull/stern/scale are preserved as generation constraints, not redesigned. |
| Secondary Brig | **REGENERATE** | Same reasoning at a smaller scale: practical bounds are 128×113 of a 136×121 canvas (94%/93% fill) — the sail dominates the silhouette here too. Regeneration is smaller/cheaper than Hero D's but is still a true regeneration, not a retouch, by the same rule. Reused for both brig placements (one mirrored), so this is one asset, not two. |
| Medium Sailing Vessel | **REGENERATE** | Practical bounds 160×113 of 168×121 (95%/93% fill); two full sails dominate. Same reasoning. |
| Harbor Cutter | **REGENERATE** | Practical bounds 93×92 of 101×100 (92%/92% fill); the single sail defines most of the vessel's height. Smallest and cheapest of the four regenerations. |
| Small Workboat | **KEEP** | No sail; already correct. |
| Dinghy | **KEEP** | No sail; already correct. |
| Programmatic small boats (×4) | **KEEP** | No sail geometry exists to correct; out of scope for an art pass. |

No vessel in the active fleet qualifies for `RETOUCH` — in every sailing-vessel case, the sail is too large a
share of the current silhouette for a local edit to look natural, and none qualifies for `REPLACE` — hull design,
material language, and Age-of-Sail character are already correct across the board (Part G); only sail state is
wrong.

---

## L. 15° Visual Grammar Compliance

All six active ship images were viewed directly. Every one shows a camera-facing hull with the hull side
dominant, deck detail visible as a secondary read, and mast/rigging readable against the sky — consistent with
`HYBRID_ORTHOGRAPHIC_2_5D` / `15°` / `yaw 0°`. None reads as a bird's-eye plan or a pure side elevation. Furling
sails does not, by itself, threaten this: yards, rigging, and hull remain camera-facing regardless of canvas
state, and the production brief (Part R) explicitly restates the grammar as a hard constraint for the
regeneration.

```text
GRAMMAR_COMPLIANCE = PASS (current); GRAMMAR_RISK_FOR_REGENERATION = LOW, provided the brief restates the locked
elevation/yaw explicitly per vessel (already the project's standard production-prompt practice).
```

---

## M. Fleet Scale Hierarchy

Independently measured practical visible area confirms the hierarchy holds today and is unaffected by this pass's
scope: Hero D ≈ 357×247 (88,163 px²) > Medium ≈ 160×113 (18,080 px²) > Brig ≈ 128×113 (14,464 px²) ≈ Cutter ≈
93×92 (8,556 px²) > Small Workboat ≈ 79×56 (4,424 px²) > Dinghy ≈ 68×29 (1,972 px²) > programmatic small boats.
`Hero Ship > Medium Sailing Vessel > Small Workboat > Dinghy` reads correctly today. Furling sails is expected to
*reduce* each sailing vessel's vertical practical extent somewhat (Part H), which — if anything — very slightly
widens the existing margin between tiers rather than threatening it. The regeneration brief should still name the
current hull/deck footprint as a hard floor so no vessel is inadvertently redrawn smaller than its accepted class.

```text
HIERARCHY_PRESERVATION_RISK = LOW
```

---

## N. Berthing Compatibility

Coordinates are not changed in this pass; this section only asks whether each berth can plausibly accommodate a
furled-sail replacement.

- **Hero Ship D** (`harbor-large-ship`, 1420/1236) sits in open water near `harbor-east-basin`, away from any
  dockside prop; a furled regeneration — likely narrower in vertical extent, same or similar hull width — has no
  foreseeable footprint conflict.
- **Medium vessel / both brigs / cutter** sit along the open west/east basin rows (160/1116, 500/1116, 1430/1116,
  1810/1116), spaced well apart from each other and from any dockside prop; the same "furled likely shrinks
  vertical extent" expectation applies with no foreseeable conflict.
- **Small Workboat** (`harbor-small-workboat`, resolved runtime 700/1020, berth `small-work-west`) sits closest to
  dockside detail of any vessel — `dock-gangplank` (726/1140) deliberately contacts it (Part O) and
  `harbor-mooring-bollard` (816/1020) and `dock-rope-line` (920/1000) are nearby but confirmed clear (Batch 03
  short re-check). Since the workboat itself is `KEEP` (no art change), this relationship is unaffected by this
  pass.
- **Dinghy** (`harbor-dinghy`, resolved runtime 980/1114, berth `utility-pocket`) is likewise `KEEP` — unaffected.
- The two `BERTHING_SLOTS` entries that are not actually wired to a vessel (`hero-large`, `medium-west`, Part E)
  do not block this pass — Hero D and the medium vessel are still governed by their own `worldLayoutData.json`
  coordinates, which are not being changed here.

```text
BERTHING_FOOTPRINT_COMPATIBILITY = PASS for all vessels in scope; no coordinate change is required or proposed.
```

---

## O. Gangplank / Rope Compatibility

`dock-gangplank` is deliberately positioned to contact `harbor-small-workboat` and terminate at `harbor-pier-
west`'s edge (independently re-confirmed in this session's Batch 03 short re-check: contact confirmed, edge gap
1.2 px). Since the small workboat is `KEEP` and undergoes no art change, this relationship is entirely unaffected
by this pass. `dock-rope-line` sits near the west work-yard cluster, not adjacent to any vessel scheduled for
regeneration (it is closest to the workboat/dinghy area, both `KEEP`). No vessel scheduled for `REGENERATE` (Hero
D, brig, medium vessel, cutter) currently has a gangplank, rope line, or other Batch 03 dockside prop placed
against its hull — all four sit in open water rows well clear of the dockside prop cluster. No adjustment is
required for this pass; if a future pass wants a gangplank/mooring line specifically for a regenerated hero or
medium vessel, that is new scope, not a compatibility fix.

```text
GANGPLANK_ROPE_COMPATIBILITY = PASS; no adjustment needed for the vessels in this pass's scope.
```

---

## P. Harbor Protection

Nothing in the recommended scope (Part K) touches: harbor basin shape, Harbor Square, Batch 02 support
composition, Batch 03 integrated dockside composition, primary buildings, roads, collision, IA, or world
dimensions. Every recommended action is a PNG regeneration or a "keep as-is" — no coordinate, layout data, or
runtime code change is proposed. The principle this pass follows is explicit and satisfied: new ship art fits the
existing world; the world is not redesigned around new ship art.

---

## Q. Asset Budget Estimate

Locked category ceilings (Scale Bible §W): Hero asset 160 KB; Medium vessel (covers brig/medium/cutter) 38 KB.
Replacement, not addition — old bytes leave the preload, new bytes enter it.

| Asset | Old bytes | Ceiling | Estimated new bytes | Estimated net delta | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| Hero Ship D | 142,840 | 163,840 (160 KB) | ~120,000–150,000 | roughly −23,000 to +7,000 | Furled sails shrink canvas area but add rigging/mast/bundle line detail; net could go either way. Ceiling is the hard constraint, not this estimate. |
| Secondary Brig (shared by 2 placements) | 23,837 | 39,833 (38.9 KB) | ~20,000–30,000 | roughly −4,000 to +6,000 | Reused unmodified for the mirrored east placement — no second byte cost. |
| Medium Sailing Vessel | 31,654 | 39,833 (38.9 KB) | ~28,000–36,000 | roughly −4,000 to +4,000 | Already at 81% of ceiling today; least headroom of the four — flagged in Part R. |
| Harbor Cutter | 13,771 | 39,833 (38.9 KB) | ~12,000–18,000 | roughly −2,000 to +4,000 | Smallest, cheapest regeneration; most ceiling headroom. |
| Small Workboat | 8,970 | — | 8,970 (unchanged) | 0 | KEEP |
| Dinghy | 5,113 | — | 5,113 (unchanged) | 0 | KEEP |

**Estimated net preload delta: roughly −33,000 to +21,000 bytes** against the current canonical 691,006-byte
preload — i.e., the Fleet Authenticity Pass is very unlikely to meaningfully increase, and may well decrease,
total production preload, since furled sails generally reduce total transparent canvas area even where line
detail increases. No category ceiling is proposed to be raised.

---

## R. Production Risks

```text
FR-01 — Silhouette impoverishment (the core named risk of this whole pass)
Furling sails removes the single largest visual-interest contributor from every sailing vessel's current
silhouette. If the regeneration brief does not explicitly compensate with mast/yard/rigging detail, tied-canvas
bundles, and stern/bow character, furled vessels will look visually "empty" compared to today, directly
contradicting this pass's own §11 principle ("sails furled ≠ visual interest removed").
Mitigation: state explicitly in each generation prompt that furled canvas bundles, full rigging, and yard
silhouettes must remain a primary visual element, not an afterthought.

FR-02 — Hero Ship regeneration is the highest-value, highest-risk item
It is the most visually important asset in the harbor and the one the human review will scrutinize hardest
("Hero Ship이 대항해시대의 큰 돛단배로 명확하게 읽히는가?"). A weak regeneration here undermines the entire pass
even if the other three vessels succeed.
Mitigation: treat Hero D as its own single-asset review checkpoint before batch-committing the other three.

FR-03 — Medium vessel has the least weight-budget headroom
At 81% of its 38 KB ceiling today, added rigging/mast detail on furling has the least room to grow before
breaching the locked ceiling of the four regeneration candidates.
Mitigation: budget-check this asset first among the three secondary-tier vessels, or accept a slightly leaner
furled-detail treatment if needed to stay under ceiling.

FR-04 — Shared-asset mirroring
The brig asset is reused for both merchant-brig placements via `setFlipX`; a regeneration must remain visually
coherent when horizontally mirrored (no asymmetric detail, such as one-sided rigging or an off-center flag, that
would look wrong when flipped). This is an existing constraint, not a new one, but worth restating for whoever
authors the brief.

FR-05 — "Two-mast brig" visual proportion (Part G)
The current brig already under-represents its second mast relative to the main one; if the regeneration is a
close derivative of the current design, this proportion issue could persist into the furled version. Not a
blocker, but worth a deliberate look during regeneration rather than an automatic carry-forward.
```

No risk in this list requires a director decision by itself — all are production-craft considerations to hand to
whoever authors the actual generation prompts.

---

## S. Recommended Production Scope

```text
Hero Ship D
Classification: FULL_SAIL_INCORRECT_FOR_BERTH / PASS_AGE_OF_SAIL (sail-state aside)
Action: REGENERATE
Target: 3-mast Age-of-Sail merchant/exploration tall ship, sails fully furled/stowed on visible yards,
  full rigging retained, richly detailed stern/hull preserved, accepted 357x247 practical / 365x255 canvas
  scale class retained as a floor (furled canvas may reduce practical height; hull/deck footprint must not
  shrink), 15 degree elevation / 0 degree yaw, no gunports/national ensign/over-armed detail introduced.

Secondary Brig (shared, mirrored placement)
Classification: FULL_SAIL_INCORRECT_FOR_BERTH / PASS_WITH_MINOR
Action: REGENERATE
Target: two-mast merchant brig, both sails furled, rigging and both masts clearly readable (correcting the
  current under-represented second mast), symmetric enough to mirror cleanly, hull/palette family retained.

Medium Sailing Vessel
Classification: FULL_SAIL_INCORRECT_FOR_BERTH / PASS_AGE_OF_SAIL
Action: REGENERATE
Target: two-mast brigantine-inspired merchant vessel, both sails furled, deck levels retained, teal/gold
  palette family retained, tight weight-budget awareness (least ceiling headroom of the four).

Harbor Cutter
Classification: FULL_SAIL_INCORRECT_FOR_BERTH / PASS_AGE_OF_SAIL
Action: REGENERATE
Target: single-mast gaff-rigged harbor cutter, sail furled/brailed to the boom, compact working-craft
  character retained; smallest and cheapest of the four regenerations.

Small Workboat
Classification: NO_SAIL_NOT_APPLICABLE
Action: KEEP

Dinghy
Classification: NO_SAIL_NOT_APPLICABLE
Action: KEEP

Programmatic small boats (x4)
Classification: NO_SAIL_NOT_APPLICABLE
Action: KEEP (out of art-pass scope; no sail geometry exists)

NEW EXTRA VESSEL COUNT = 0
```

---

## T. Explicit Deferrals

```text
ship movement
arrival / departure
sail animation
rope / rigging animation
water bobbing system
random berth placement
dynamic berth occupancy
animated crew
a functional (walkable) gangplank
any change to BERTHING_SLOTS, vessel coordinates, or dockside prop placement
Batch 04
```

---

## U. Human Review Targets

Carried forward unchanged from this pass's own instructions, restated as the acceptance criteria the eventual
implementation should be measured against: does the fleet read as moored; are the furled sails natural rather than
simply missing; does Hero Ship read unmistakably as a large Age-of-Sail vessel; does the Hero/Medium/Small/Dinghy
scale progression still feel natural; do the furled vessels avoid looking visually impoverished (Part R, FR-01);
is mast/yard/rigging detail sufficiently readable; does the fleet still belong to the existing harbor; and does the
gangplank/berth relationship (unaffected by this pass) still read correctly.

---

## V. Final Gate

```text
READY_FOR_FLEET_AUTHENTICITY_DIRECTOR_GATE
```

The active fleet is fully and independently audited against real runtime code. All incorrect full-sail moored
vessels are identified (all four active sailing vessels, unanimously). Hero Ship treatment is clear (regenerate,
scale preserved). Medium-tier vessel treatment is clear (regenerate all three, same rule, same reasoning). Small
craft are correctly classified as needing no change. The Age-of-Sail direction is implementable entirely within
the locked 15°/yaw-0°/hybrid-orthographic grammar with no conflict found. The accepted scale hierarchy is
preserved by construction. No harbor-layout, berth-coordinate, or `BERTHING_SLOTS` change is required. Vessel
count remains zero net new.
