# Mass Asset Production Batch 03 — Fleet + Dockside Activity Pre-review
## Portfolio World — Retro Harbor Campus

> Canonical repo path:
> `reports/portfolio-world/art-production/mass-asset-production-batch-03-fleet-dockside-pre-review.md`

This is a pre-review, not an implementation. No runtime code, layout data, or asset file was modified while
producing it. All figures below (tier counts, byte budgets, code paths) are read directly from the current
`feature/portfolio-world-sprint-02` worktree, not assumed from prior reports.

---

## A. Current State

Batch 02 (Harbor Support Architecture + Streetscape) is officially complete: implementation, independent review,
two overlap hotfixes, a Final Short Re-check, and Human Review all passed. Canonical production preload is
`659,767` bytes. Locked foundations remain in force: 15° hybrid-orthographic grammar, 32 px logical unit,
same-class scale consistency, the Guild Hall `42×52` canonical door reference, the naturalized (non-cardinal)
layout, Depth/Occlusion v1.1, the Scale Bible category bands, category weight ceilings, 1× export, hidden-RGB
cleanup, and BASE_URL-safe loading. Human direction for Batch 03 explicitly asks for a *functionally* messy, not
*visually broken*, dockside, and explicitly forbids re-touching any Batch 02 placement.

---

## B. Batch 03 Goal

Fleet + Dockside Activity Expansion. The objective is not vessel count — it is making the harbor read as an
*operating* dock: berthed ships, active loading/unloading, working boats moving between the fleet and shore, and
credible mooring/service detail at the water's edge. This is a composition goal, not a numbers goal, and the scope
below is sized accordingly.

---

## C. Existing Fleet Audit

Read directly from `worldLayoutData.json` (`harborVisuals`) and `worldAssetManifest.ts`:

| id | type | tier | size (declared) | asset | scale category |
| --- | --- | --- | --- | --- | --- |
| `harbor-large-ship` | `large-ship` | primary | 280×80 | Hero Ship D PNG (395×263 display / 357×247 practical) | Hero |
| `harbor-west-merchant-brig` | `secondary-sailing-ship` | secondary | 188×56 | Brig PNG (136×121) | Medium |
| `harbor-west-cargo-schooner` | `secondary-sailing-ship` | secondary | 205×58 | Medium Sailing Vessel PNG (168×121) | Medium |
| `harbor-east-merchant-brig` | `secondary-sailing-ship` | secondary | 188×56 | Brig PNG, mirrored (`setFlipX`) | Medium |
| `harbor-east-harbor-cutter` | `secondary-sailing-ship` | secondary | 145×58 | Cutter PNG (101×100) | Light-medium |
| `waterfront-boat` | `small-boat` | secondary | 112×48 | programmatic | Small working boat |
| `harbor-basin-boat` | `small-boat` | detail | 96×40 | programmatic | Small working boat |
| `harbor-cargo-boat` | `small-boat` | detail | 88×36 | programmatic | Small working boat |
| `harbor-offshore-boat` | `small-boat` | detail | 80×32 | programmatic | Small working boat |

Fleet hierarchy is confirmed intact by measured practical visible area (from the Batch 01 independent review, still
valid — no ship art has changed since): Hero D ≈ 88,163 px² > medium vessel ≈ 18,080 px² > brig ≈ 14,464 px² ≈
cutter ≈ 8,556 px² > small boats (2.50–3.50 LU footprints). Nine vessels total, one Hero, four medium/light-medium,
four small. No vessel currently has collision (ships are visual-only everywhere in this codebase — see Part L).

---

## D. Existing Dock Audit

| id | type | size | walkable | collidable |
| --- | --- | --- | --- | --- |
| `waterfront-dock` | `dock` | 448×64 | not tagged (open, no collider) | false |
| `harbor-pier-west` | `dock` | 160×32 | true | false |
| `harbor-pier-east` | `dock` | 160×32 | true | false |
| `harbor-service-jetty` | `dock` | 144×32 | true | false |

Water bodies: `waterfront-water` (2048×96, south edge, collidable), `harbor-west-basin` (800×128, collidable),
`harbor-east-basin` (800×128, collidable). Water collision is derived automatically
(`createWaterCollisionRects()` in `waterCollisionGeometry.mjs`): every declared water rectangle has each
`walkable: true` dock's footprint subtracted from it, producing the swimmable-water collision set. No vessel,
mooring detail, or cargo prop participates in this subtraction today — collision is entirely a water/walkable-dock
relationship, nothing else.

Existing near-water support/detail already placed (Batch 01/02, not to be moved): `harbor-warehouse` (collidable),
`harbor-cargo-shed`, `harbor-warehouse-annex`, `harbor-service-hut`, cargo/barrel/rope props, `harbor-notice-board`,
`harbor-safety-rail`, `harbor-mooring-bollard`, `harbor-service-marker`, `exhibition-display-board`,
`waterfront-viewing-terrace`/bench, dock-side crates/barrels at both piers.

---

## E. Proposed Vessel Additions

Reviewed against the goal ("operating dock," not "more ships") and the fleet hierarchy constraint:

| Candidate | Recommendation | Reason |
| --- | --- | --- |
| 1 additional medium vessel variant | **Defer** | Secondary tier is at 38/40 of `DENSITY_CAPS` (Part O) — a new medium vessel PNG competes directly with dockside-activity secondary-tier budget for a smaller composition payoff than working-boat/mooring detail. Four medium/light-medium vessels already established a full three-tier fleet under Hero D; a fifth adds count without adding *activity*. |
| 1–2 small harbor workboats | **Include (1, PNG)** | Converting one small boat from programmatic to a PNG in active motion-adjacent posture (e.g., mid-transit toward a pier, not just moored) is the single highest-leverage fleet addition for "boats drawing in and out" — directly serves the stated goal. A second is optional filler, not core. |
| Dinghy / tender | **Include (1)** | A dinghy tied near the large ship or a pier reads as active crew/passenger transfer — cheap (fits `SMALL_PROP`-to-`SMALL_BOAT` band overlap, likely the smallest end of the small-boat band) and directly supports "dockside activity" without adding fleet-hierarchy risk. |
| Moored utility boat | **Fold into the workboat above** | A separately-named "utility boat" and a "workboat" are the same functional idea; keep one small-boat addition, not two near-duplicates. |

Net recommendation: **one** new small-boat PNG (workboat) and **one** dinghy/tender, both within the existing
locked `SMALL_WORKING_BOAT` band (80–112×32–48 px / 2.50–3.50×1.00–1.50 LU practical visible content) — no new
medium vessel, no new scale category. This keeps the hierarchy (Hero D > Medium > Small) untouched and mechanically
impossible to violate, since both additions are bound by an existing, already-subordinate band.

---

## F. Proposed Dockside Assets

Evaluated for "materially improves readability" vs. "decorative duplication":

| Candidate | Recommendation | Reason |
| --- | --- | --- |
| Mooring bollards | **Skip — already exists** | `harbor-mooring-bollard` shipped in Batch 02. Reuse/replicate placements near new berths instead of a new asset. |
| Rope lines / cleats | **Include (1 asset: rope line)** | A taut line from a hull to an existing bollard is the single clearest "this ship is actually tied up" cue and is cheap (thin, low-detail). Cleats are too small to read at runtime scale (Batch 02's `harbor-rope-coil` already covers the coiled-rope silhouette need) — skip as a separate asset. |
| Gangplank | **Include (1 asset, visual-only)** | Directly reads as "cargo/crew crossing," high composition value. Keep strictly non-walkable/non-collidable (Part L) to avoid new collision-carving work this batch does not need. |
| Fenders | **Skip** | Small hull-side detail, low visibility at runtime display scale (ships are already ≤205 px wide); poor readability-per-byte return. |
| Small buoy | **Include (1 asset)** | Cheap, reads as "this is a working channel," good for open-water breathing space without adding fleet count. |
| Hand cart / cargo trolley | **Include (1 asset)** | Directly signals "goods in motion," distinct from Batch 02's static crate/barrel stacks. |
| Stacked barrels/crates | **Skip — already exists** | Batch 02 shipped `harbor-cargo-stack` and `harbor-barrel-cluster`; reuse placements, don't duplicate the asset. |
| Fishing/work nets | **Include (1 asset)** | Distinct silhouette from anything in Batch 02, reinforces working-harbor character near the small-boat area specifically. |
| Coiled rope | **Skip — already exists** | `harbor-rope-coil` shipped in Batch 02. |
| Loading ramp | **Fold into gangplank** | Functionally the same idea as the ship-to-dock gangplank; a second ramp asset (e.g., dock-to-warehouse) is only worth adding if the loading-zone composition (Part I) needs it after placement is drafted — treat as an optional second use of the same asset, not a new one. |
| Repair tools | **Skip** | Overlaps conceptually with Batch 02's `harbor-notice-board`/service-hut framing ("maintenance" is already implied by the service hut); low marginal readability gain. |
| Supply bundles | **Skip — already exists** | Same role as barrel/crate stacks; reuse. |

Net recommendation: **five** new dockside props (rope line, gangplank, buoy, hand cart, work net) plus reuse of
existing Batch 02 mooring/cargo props at new locations. This is deliberately smaller than the candidate list —
Part D's own instruction ("do not duplicate Batch 02 cargo without purpose") rules out roughly half the list
outright.

---

## G. Berthing Model Recommendation

**Berth data does not exist today.** Vessels are declared as ordinary `harborVisuals` entries; the only
constraints enforced are (1) full containment inside a water polygon (`contains(water, visual)`) and (2) pairwise
non-overlap among `FLOATING_VESSEL_TYPES`. There is no ID linking a vessel to a specific dock/pier, no
vessel-role-to-berth-type compatibility, and no notion of "this berth is occupied." This matches the Visual
Grammar v1.0 lock (§25), which named a future `BERTHING_SLOTS` shape but explicitly deferred building it.

**Recommendation: introduce a minimal, static `BERTHING_SLOTS` data structure now, but only as authored metadata
— not a placement engine.** Concretely: a small array in `worldLayoutData.json` (or a sibling file) of
`{ id, x, y, allowedRole: "hero"|"medium"|"light-medium"|"small", heading, clearance }` records, one per
currently-occupied or currently-planned vessel position, with the *existing* vessel entries updated to carry a
`berthId` reference. This costs almost nothing (it documents what already exists) and buys two things Batch 03
specifically needs: (a) a natural anchor for the new overlap validator (Part M) to check "does this vessel sit in
its declared berth, and does its declared berth conflict with any other declared berth" as an explicit, static
check; and (b) a real foundation for the *future* dynamic/random berthing the project has already named as
deferred, without building any of that logic now. Do **not** build slot-selection logic, occupancy state, or
runtime assignment — the structure is authored once, by hand, the same way `worldLayoutData.json` itself is
authored today.

If this is judged too much for a "static composition" batch, the fallback is to keep vessels as plain
`harborVisuals` entries (as today) and rely entirely on the pairwise overlap validator (Part M) for correctness.
This is cheaper to build but leaves no structured record of "why is this ship here" for Batch 04 to build on. This
choice — introduce `BERTHING_SLOTS` now vs. defer again — is flagged as a director decision in Part R.

---

## H. Scale Hierarchy

No proposed addition changes the hierarchy: the recommended small-boat/dinghy additions are bound to the existing,
already-subordinate `SMALL_WORKING_BOAT` band (Part E); no new medium vessel is recommended, so the medium tier is
untouched; Hero D is not proposed for any change (and is locked against resizing regardless). Dockside props
(gangplank, rope line, buoy, cart, net) are all Tier 3/4 scale by nature (comparable to or smaller than Batch 02's
props) and cannot mechanically compete with any vessel or building tier. `Hero Ship D > Medium Sailing Vessel >
Small Working Boats` is preserved by construction, not by discipline alone.

---

## I. Placement Strategy

Following the human direction (functional clutter, not visual collision) and the requested composition patterns:

- **Loading zone beside the medium vessel:** place the hand cart and one reused crate/barrel cluster near
  `harbor-west-cargo-schooner` (the medium vessel), between it and `harbor-pier-west` — this is currently open
  water-adjacent land, not occupied by any Batch 02 placement.
- **Supply cluster near the warehouse:** the gangplank and rope line belong near `harbor-warehouse`/
  `harbor-warehouse-annex`'s water frontage, reusing the existing bollard rather than placing a new one.
  `harbor-warehouse-annex`'s addition already sits at raw (280, 836) — new dockside props should stay dockside
  (near y ≈ 1100–1240, the water/pier band), not repeat Batch 02's inland work-yard cluster.
- **Small-boat service corner:** the new workboat, dinghy, buoy, and net cluster near `harbor-pier-east`/
  `harbor-basin-boat`, away from the large ship and away from Batch 02's viewing terrace/promenade (the exact area
  the two overlap hotfixes had to fix — see Part J).
- **Maintenance area:** already implied by the existing `harbor-service-hut` (Batch 02); no new maintenance-specific
  asset is recommended (Part F).
- **Open walking strip along the dock:** `waterfront-dock`'s 448 px span and both piers must stay clear — every
  proposed placement above sits off the dock/pier rectangles themselves, on the water side (vessels, buoy) or the
  land side (cart, gangplank foot, net), never on the walkable strip.

---

## J. Natural-working-clutter Principle

The distinction the instruction draws — natural working clutter vs. visual collision — is exactly the lesson from
Batch 02's two overlap hotfixes: the first hotfix moved three props to fix the original terrace/bench/flag
overlap, but moved two of them close enough to *each other* and into a previously-unrelated prop
(`exhibition-display-board`) to create a new, equally real overlap; the second hotfix fixed that by widening the
overlap check from "4 props vs. 3 named objects" to "9 named objects vs. each other," and only then actually
closed the class of problem for good. The lesson generalizes directly: **irregular spacing and functional grouping
are the goal; overlapping alpha content is never acceptable, no matter how "naturally cluttered" it is meant to
look.** Batch 03's placement drafts must be checked against *every* nearby object's real rendered bounds — not
just the objects the placer happens to remember — before being called done. Part M turns this into a concrete
mechanism rather than a principle to remember by hand.

---

## K. Depth / Occlusion

No new depth band or constant is needed. Existing routing already covers every candidate type:

- **Vessels:** `getVesselDepth(contactY, id)` → `WORLD_OBJECT_BODY`, contact Y = `visual.y + visual.height/2` for
  ordinary vessels (Hero D alone uses the bespoke `HERO_SHIP_WATERLINE_OFFSET_Y = 18` via
  `getHeroShipWaterlineY()`, unchanged and not needed for a workboat/dinghy). A new small-boat/dinghy PNG should
  reuse this exact call, exactly as the Batch 01 medium vessel and Batch 02 support buildings did — no bespoke
  offset unless the art's own waterline sits unusually within its canvas (measure first, only add an offset if
  the generic ground-contact anchor visibly misplaces the hull).
- **Ground-contact props (gangplank foot, hand cart, work net, rope line, buoy if drawn resting on water surface
  rather than floating with its own contact rule):** fall to `LOW_PROP` via `LOW_PROP_TYPES` membership, the same
  band Batch 02 used for `rope-coil`/`safety-rail`/`mooring-bollard`. Add the new type strings to that set; no new
  band.
- **A small buoy floating on open water** is a genuine edge case: it has no ground contact and isn't a vessel.
  Recommend treating it like `water`-adjacent detail at `GROUND_DETAIL` (the same fallback band `crate`/`bench`
  already use) rather than inventing a "floating detail" band — its exact draw order relative to water is a minor
  visual call, not a policy question.

No depth/occlusion work is required before Batch 03 art exists; this is a routing decision (which existing set a
new type string joins), identical in kind to every prior batch's depth integration.

---

## L. Collision Policy

No proposed Batch 03 asset needs collision. Precedent is unanimous: across Batch 01 and Batch 02, the only
collidable harbor visuals are `water` and the single `warehouse` entry (`COLLIDABLE_HARBOR_VISUAL_TYPES`); every
ship, prop, and support structure since is `collidable: false`, including support buildings as large as the
warehouse annex. Recommend the same for every Batch 03 addition:

- **Vessels:** visual-only, as today — a player can already "walk through" a ship's visual footprint on land-side
  approaches exactly as with every existing vessel; this is an accepted, unchanged limitation, not a new one.
- **Gangplank:** explicitly **not** walkable/collidable. Making it a functional bridge would require extending
  `createWaterCollisionRects()`'s walkable-dock mechanism to a new prop type, which is exactly the kind of "major
  collision architecture" the scope discipline rules out. A gangplank that looks connective but carries no
  special walk logic is visually sufficient for a static-composition batch.
- **Small buoy / rope line / hand cart / work net:** visual-only, non-collidable, same as every Batch 02 prop.

If a future batch wants an actually-walkable gangplank, that is a deliberate `walkable: true` dock-type addition
(reusing the existing mechanism, not a new one) and should be proposed explicitly then, not implied here.

---

## M. Overlap Validation Strategy

The v2 waterfront hotfix already built the right primitive: `renderedVisibleRect()` (reconstructs a PNG's true
alpha-trimmed, post-`setOrigin`/`setDisplaySize` world rectangle from `worldLayoutData.json` + a small
per-asset bounds table) plus a pairwise `assertDoesNotOverlap` sweep over an explicit, named `Set` of scene-item
IDs (`WATERFRONT_STATIC_VISUAL_ITEMS` today). This is exactly the "small explicit scene validation set" the
instruction asks for — it should be **extended**, not replaced or generalized into a full engine:

1. **Rename/generalize the existing set** (e.g., `DOCKSIDE_STATIC_SCENE_ITEMS`) to include every Batch 03 vessel
   and prop ID alongside the current nine waterfront items, so the same pairwise sweep automatically covers
   ship↔ship, ship↔dock-structure-adjacent-prop, and dock-prop↔dock-prop in one pass — this satisfies four of the
   five required pairings (ship↔ship, ship↔dock structure, dock prop↔dock prop, dock prop↔protected composition)
   with zero new mechanism.
2. **`gangplank ↔ walkable route` is a different kind of check** (a *non-walkable, non-collidable* visual asset
   must still not visually cover a route a player is meant to read as walkable — e.g., the existing pier strip or
   `waterfront-dock`'s open span). Recommend reusing the existing `assertDoesNotOverlap(visual, protectedRect,
   reason)` helper directly against `protectedNavigation` (already computed in `validateWorldLayout` from `paths`,
   `forecourts`, and `zones`) plus the specific pier/dock rectangles the gangplank sits near — the same pattern
   `PERMANENT_STREETSCAPE_TYPES` already uses for Batch 02 street furniture, just applied to the gangplank's type.
3. Add each new prop's real alpha-trimmed bounds to `BATCH02_VISIBLE_BOUNDS`-equivalent table (rename appropriately)
   **before** authoring its coordinates, not after — the root cause of both Batch 02 hotfixes was placing first and
   discovering overlap later. A pre-placement bounds table, checked against neighbors before the coordinate is
   committed, is cheap and would have prevented both incidents.
4. Explicitly do **not** build a general AABB engine, spatial index, or automatic-collision-avoidance placement
   tool — the existing named-set pairwise sweep is O(n²) over roughly a dozen items, which is trivially fast and
   exactly matches the instruction's "prefer small explicit scene validation sets" guidance.

---

## N. Asset Budget Estimate

Locked category ceilings (Scale Bible §W) bound every candidate:

| Category | ceiling | recommended count | est. total |
| --- | --- | --- | ---: |
| Small boat (1× PNG) | 13 KB | 2 (workboat, dinghy) | ≤ 26 KB |
| Small prop (rope line, buoy, hand cart, work net) | 6 KB | 4 | ≤ 24 KB |
| Small prop (gangplank — likely small/medium prop scale, use 6 KB ceiling conservatively) | 6 KB | 1 | ≤ 6 KB |
| **Batch 03 addition (upper bound)** | | | **≤ 56 KB** |

Canonical current preload is `659,767` bytes. Even at the full upper-bound estimate, Batch 03 lands at
≤ 716,000 bytes — comfortably inside the locked LOW scenario (~1.01 MB) and far under EXPECTED (~1.29 MB) or HIGH
(~1.52 MB). Weight budget is not a constraint on this batch's recommended scope; **tier density is** (Part O).

---

## O. Risks

```text
R1 — Secondary density cap nearly exhausted (concrete, verified)
DENSITY_CAPS.secondary = 40; current harborVisuals secondary-tier count = 38 (independently counted from
worldLayoutData.json). Only 2 secondary-tier slots remain. Vessels and notable dockside items (a new small-boat
PNG replacing a programmatic entry, a gangplank at a prominent berth) are natural "secondary" tier candidates.
Recommended scope (2 vessels + 5 props = 7 new entries) will not fit as secondary-tier without either (a) tiering
most new items "detail" (36/45 used, 9 free — comfortable headroom) or (b) raising DENSITY_CAPS.secondary again,
as Batch 02 already did once (36→40). This is a real, quantified constraint, not a hypothetical one.

R2 — Repeating the Batch 02 overlap-hotfix pattern
Both Batch 02 hotfixes existed because placement was authored before checking real alpha-trimmed bounds against
neighbors. Part M's recommendation (extend the existing named-set validator before authoring coordinates, not
after) directly targets this; the risk is real only if that ordering is skipped again.

R3 — BERTHING_SLOTS scope creep
A "minimal metadata" BERTHING_SLOTS structure (Part G) is cheap; a tempting next step (slot occupancy state, role
validation logic, auto-placement) is explicitly out of scope per the instruction's own "no dynamic/random
placement" rule. The structure must ship as static authored data only.

R4 — Gangplank ambiguity
"Gangplank" reads to a player as walkable. If left purely decorative, a curious player standing on/near it and
finding no special interaction is a minor, acceptable limitation (identical in kind to every other non-collidable
visual prop in this world) — but it should be placed so it does not visually invite the player onto open water
(e.g., angled toward the existing walkable pier/dock strip, not toward open unwalkable water), or it will read as
a visual bug rather than atmosphere.

R5 — Small-boat "in transit" posture is a new art direction, not a new mechanic
A workboat drawn mid-transit (Part E) is a *static* illustration implying motion, not an animation or moving
sprite — this must be explicit in the production prompt contract for that asset so the generation doesn't drift
toward an actual-motion mechanic, which is out of scope.
```

---

## P. Recommended Batch 03 Scope

```text
FLEET (2 new PNGs, small-boat band only):
  1 small workboat (mid-transit posture, near harbor-pier-east)
  1 dinghy/tender (moored near harbor-large-ship or a pier)

DOCKSIDE PROPS (5 new PNGs):
  1 rope line (ship-to-existing-bollard)
  1 gangplank (visual-only, non-walkable)
  1 small buoy (open-water detail)
  1 hand cart / cargo trolley
  1 work/fishing net

DATA:
  Minimal static BERTHING_SLOTS metadata (director decision, Part G/R)
  Extend the named-set overlap validator to cover all new IDs + their nearest existing neighbors,
    authored BEFORE final coordinates are committed

NOT IN THIS BATCH:
  No new medium vessel
  No new mooring bollard / crate / barrel / coiled-rope asset (reuse Batch 02's)
  No fenders, cleats, repair tools, or supply-bundle assets
  No loading-ramp asset separate from the gangplank
  No collision/walkable geometry beyond what already exists
```

---

## Q. Items Explicitly Deferred

```text
day/night
random vessel spawning
dynamic berth assignment / occupancy state
moving ships, wake, or any animation
animated NPC crews
multiplayer, chat, realtime LLM NPC
harbor basin redesign or world-size expansion
major collision architecture rewrite
functional (walkable) gangplank
a second medium vessel
a general-purpose overlap/physics engine
```

---

## R. Final Gate

```text
NEEDS_DIRECTOR_DECISION
```

The technical groundwork is sound and the recommended scope (Part P) is deliberately small, budget-safe, and
grammar/hierarchy-safe — but two questions in this pre-review are genuine scope decisions, not implementation
details, and this review's own recommendations should not be read as pre-authorizing them:

1. **Secondary density cap (R1):** raise `DENSITY_CAPS.secondary` again, or constrain new secondary-tier
   placements to the 2 remaining slots and push everything else to `detail` tier. Either is workable; the choice
   affects how the fleet/dockside items read in the layout-validation contract.
2. **`BERTHING_SLOTS` timing (Part G):** introduce the minimal static metadata structure in Batch 03, or defer it
   again to a later batch and rely solely on the pairwise overlap validator. Both are legitimate; this is exactly
   the kind of forward-structure decision a director gate exists to make.

Once those two are decided, this pre-review's scope (Part P) and validation strategy (Part M) are ready to hand
directly to an implementation pass — no further research is expected to be needed first.
