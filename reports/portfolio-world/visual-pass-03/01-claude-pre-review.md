# Portfolio World — Retro Harbor Campus Visual Pass 3 Pre-review

Reviewer: Claude Code — Sonnet 5
Role: Independent pre-implementation reviewer (no runtime changes made)

---

## A. Gate

```text
READY_WITH_FIXES
```

The Director Plan's harbor-composition goal is achievable without moving world size,
without relayout, and without any architectural rework. One concrete geometry change
(a uniform coordinate shift, worked out precisely below) and a small set of validation
additions should be folded into Codex's scope before implementation.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `CODYSSEY_SHARED_MAC` |
| Machine Context ID | `3c5410ed-2e15-4583-abb7-9de45a28bbe5` |
| OS | darwin x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `8075e29` |
| Git status | dirty — three **untracked** files only, no modified tracked files:
`reports/portfolio-world/visual-pass-02/04-claude-independent-review.md` (my own prior
report), `reports/portfolio-world/visual-pass-02/05-human-visual-feel-test.md`, and
`reports/portfolio-world/visual-pass-03/` (new). No destructive risk. |
| Node / npm | v24.21.0 / 11.19.0 |

---

## C. Source / Repo State

**Documents read:** all documents listed in the assignment were present and read —
art-direction v1.0, Visual Pass 1 implementation/review/feel-test, Visual Pass 2
director plan/pre-review/gate/implementation/review/feel-test, Visual Pass 3 director
plan, and all nine `docs/portfolio-world/*.md` canonical documents. Nothing was missing.

**Current Visual Pass 2 implementation state (re-confirmed directly from code):**
- World remains `2048 × 1280`; camera bounds are derived directly from
  `WORLD_WIDTH`/`WORLD_HEIGHT` constants in `WorldScene.ts:113` — no code change is
  needed for any data-only geometry rebalance.
- `worldLayoutData.json` currently holds: 5 zones (plaza/lecture/career/ai-lab/gallery),
  4 paths, 4 forecourts, 3 `reservedLots`, 50 `harborVisuals` (7 primary/25 secondary/25
  detail — recounted and confirmed against the Pass 2 independent review), 4
  `edgeDecorations`.
- Water is a single `harborVisuals` entry (`waterfront-water`, type `"water"`,
  `x:1024, y:1232, width:2048, height:96`, `collidable:true`) spanning the full world
  width at the very south edge — currently 96 px thick, 7.5% of world height.
- `layoutValidation.mjs` enforces single-water, density caps, reserved-lot
  non-overlap (vs. paths/forecourts/buildings/each other/every harborVisual), and
  permanent-streetscape non-overlap vs. protected navigation. No containment check
  exists for "is this visual actually inside the water rectangle" — new territory for
  Pass 3 (Section J).

**Project-record hygiene note (recurring):** `docs/portfolio-world/91_STATUS.md` and
`92_HANDOFF.md` still read "Visual Pass 2 independent review — PENDING" /
"User Visual Feel Test — PENDING," even though both are now complete and on disk. This
is the exact same staleness pattern the Visual Pass 2 pre-review flagged for Visual
Pass 1 (Finding VP2-04) — it was fixed once, then recurred one phase later. See
Finding VP3-04.

---

## D. Land / Sea Rebalance

```text
KEEP_WORLD_SIZE
MOVE_COASTLINE_NORTH
```

**The actual budget, computed from the live layout data:** the world's vertical extent
splits into a north "arm" (world top to the plaza's top edge, y:0–496, 496 px) and a
south "arm" (plaza's bottom edge to world bottom, y:784–1280, 496 px) — symmetric around
the plaza. The **north arm has 160 px of genuinely unused margin** (y:0–160, above the
Academy building — nothing is placed there at all, not even a reserved lot). The
**south arm has zero slack** — `path-south` (208) + Exhibition Hall (128) + dock (64) +
water (96) = 496 px, exactly filling its budget with no gap.

Because the two arms only share the plaza as a boundary, the only way to convert north
margin into south sea *without changing world size* is to move the plaza's edges — which
means Academy, Harbor Square, Guild Hall, Workshop, and Exhibition Hall all need to
translate together (Guild Hall/Workshop must track the plaza's y-shift or `path-west`/
`path-east` would disconnect from it).

**Recommended geometry: uniform −96 px shift.** Apply `y -= 96` to every `zones`,
`paths`, `forecourts`, `reservedLots`, and `harborVisuals` entry **except** the
`waterfront-water` entry and the four `edgeDecorations` (which mark the world's
absolute border and don't move), then recompute water to fill the reclaimed south
space:

```text
Academy (lecture)   y: 224 → 128   (new top edge = 64, flush with edge-north's own
                                    64 px band — zero wasted margin, zero overlap)
Harbor Square/paths  y: 640 → 544   (Guild Hall / Workshop track this same shift)
Exhibition Hall      y: 1056 → 960
dock                 y: 1152 → 1056  (unchanged size, 448×64)
waterfront-water     y: 1232 → 1184, height: 96 → 192  (south edge stays pinned
                                    at world bottom = 1280; north edge now meets
                                    the shifted dock's new bottom edge, 1056+32=1088)
playerSpawn          y: 848 → 752
```

This **doubles** sea depth (96→192 px) while every other prop/reservedLot shifts by the
same constant, which makes every previously-verified non-overlap relationship hold
automatically (translation is overlap-invariant) — I hand-checked the two closest cases
anyway: `guild-annex-lot` (new y:184–344) and `academy-library-lot` (new y:176–336) both
come within 8–16 px of Academy's new footprint in the y-axis, but neither overlaps in x
(812<896 and 1152<1328 respectively), so no actual intersection results. 96 px was
chosen specifically because it lands Academy's new top edge exactly on edge-north's
existing 64 px band with no gap and no overlap — a clean, deliberate-looking number, not
an arbitrary one. Codex may adjust this by a small amount if composition suggests it,
but should stay in roughly the 64–128 px range to preserve this margin balance.

Should the coastline replace the current single water record with several, or introduce
a new coastline representation? No — see Section J. One enlarged rectangle remains
fully sufficient.

Spawn and camera bounds: spawn moves with the same shift (stays centered on the
relocated `path-south`); camera bounds don't need any code change since they read
`WORLD_WIDTH`/`WORLD_HEIGHT`, which don't change.

---

## E. Destination Stability

```text
MINOR_DESTINATION_ADJUSTMENT
```

Every destination's absolute y-coordinate moves by the same −96 px, but **zero relative
IA relationships change** — same path lengths, same forecourt gaps, same building
sizes, same collision footprints, same east-west spine. This is a rigid-body
translation, not a relayout: it doesn't meet the bar for `RELAYOUT_REQUIRED` (nothing
about the harbor rebalance requires touching relative structure), and it's honest to
call it more than `KEEP_PRIMARY_DESTINATIONS` literally, since coordinates do move.
X-coordinates for every zone/path/forecourt/harborVisual are entirely untouched.

---

## F. Waterfront / Dock

Recommended relationship (post-shift coordinates):

```text
Exhibition Hall   y: 896–1024   (unchanged size, 256×128)
        ↓  (32 px gap, unchanged from today)
promenade/forecourt-gallery  y: 800–864  (unchanged size, 128×64)
        ↓ (feeds into path-south, unchanged size)
dock              y: 1024–1088  (unchanged size, 448×64 — Codex may widen it now
                                  that there's more room, but this isn't required)
        ↓ (touching, 0 px gap, same as today)
harbor basin / sea  y: 1088–1280  (192 px, was 96 px)
```

Exhibition Hall stays exactly where it is relative to everything else — only its
absolute position shifts with the rest of the composition (Section D). The forecourt is
not compressed at all (same 128×64 footprint, just relocated). The large ship (Section G)
will be visible from this route once the player is anywhere near the dock, since it sits
in the now-substantially-larger basin directly south of it. Player traversal is
unaffected: same path/forecourt/dock sizes, same non-collidable dock, same single
collidable water boundary — only its position and thickness change.

---

## G. Vessel Strategy

```text
PROGRAMMATIC_VESSELS
```

**Large ship — location/orientation:** place it offshore in the enlarged basin, roughly
`x: 1300–1500, y: 1150–1220` (comfortably within the new water range 1088–1280, with
margin from both the dock's south edge and the world's south edge) — east of the dock,
echoing where the existing small boat already sits, but further out and larger. No
mooring line to the dock is required for Pass 3 (mockup-level); "moored or partially
offshore" is Codex's call. Recommend roughly 200×90–100×90, clearly larger than the
existing 112×48 small boat, to read unambiguously as "the big one."

**Small boats — count/placement:** 3 is a good mockup target (within the Director's
2–4 range): one near the dock (echoing/replacing the existing `waterfront-boat`
position), one further out in open water (deeper into the new basin, away from the
dock), and one nearer the recommended warehouse/cargo cluster (Section H) — matching the
Director's own suggested distribution. Vary position and size slightly between the
three; **do not** evenly space them along one row (explicit Director instruction) and
do not add an orientation/rotation field just for this — see Section on data model
below, this is a mockup-fidelity call (Section Q), not a data gap.

**Collision:**
```text
NON_COLLIDABLE_IN_WATER
```
The existing `COLLIDABLE_HARBOR_VISUAL_TYPES` set already contains only `"water"`; ships
and boats stay outside it entirely, exactly like the existing small boat today. Nothing
about a non-collidable graphic sitting visually inside the (separately) collidable water
rectangle creates any physics conflict — the water body is what stops the player, not
the boat graphics.

**Vessel data model — smallest maintainable option:** don't invent a new "vessel record"
concept. Add exactly **one** new `HarborVisualType` (`"large-ship"`) for the ship, and
place the 2–3 small boats as **additional instances of the existing `"small-boat"`
type** at new positions with slightly varied width/height — the current
`HarborVisualPlacement` rect fields (position + size) already carry everything a mockup
needs. No new `orientation`/`facing` field is needed; `drawBoat`'s existing silhouette
reads fine at varied positions and modest size variation alone. This directly answers
the Director's own "avoid overengineering" instruction (Section 10).

**Rendering location:** `drawBoat` already lives in `harborVisualCatalog.ts`, and its
offsets are proportioned for a 112×48 boat — reusing it as-is for a much larger ship
would look wrong (its internal offsets, e.g. `+34`, are absolute, not proportional to
`visual.width`/`height`). Add a new `drawLargeShip` function with proportional geometry
**next to `drawBoat`** in `harborVisualCatalog.ts` (same file, same neighborhood as the
other water-related primitives: `drawWater`, `drawDock`, `drawBoat`) rather than in
`streetscapeVisuals.ts` or a new file — see Section K.

---

## H. Supporting Buildings

```text
ADD_SUPPORT_BUILDINGS
```

Recommend exactly **2** types, both modeled the same way `market-kiosk` already is
(a `HarborVisualType`, not a `zones`/`buildings` entry — supporting structures are
explicitly non-functional/non-interactive, so they don't belong in the mechanism
reserved for the 5 IA-meaningful, collision-bearing, exhaustively-dispatched
destinations):

```text
warehouse     — larger footprint (~160×96), placed west of the dock in the open
                shoreline margin (roughly x: 100–300, y: 1000–1088 post-shift —
                clear of every reserved lot, which all live in the NW/NE/SE
                quadrants, nowhere near the waterfront). Optionally collidable
                (see Section N) given its scale.
cargo-shed    — smaller (~80×56), non-collidable, placed near the dock/warehouse
                cluster (roughly x: 350–450, y: 1030–1088) to read as harbor-edge
                activity rather than a second destination.
```

Neither placement touches `guild-annex-lot`, `academy-library-lot`, or
`workshop-studio-lot` — all three sit in the NW/NE/SE quadrants (Section I), and both
proposed structures sit in the open waterfront margin, an area no reserved lot currently
claims. Neither competes with the primary destination buildings in scale (both are
smaller than the smallest destination footprint, 256×128) or in visual weight (drawn
with the same subdued wood/stone palette already established, not the brighter
destination-building fills).

---

## I. Reserved Lots

```text
PRESERVE_ALL_RESERVED_LOTS
```

Current records, re-read directly from `worldLayoutData.json`:

```text
guild-annex-lot       700, 360, 224×160, zone: career
academy-library-lot   1440, 352, 224×160, zone: lecture
workshop-studio-lot   1568, 864, 224×160, zone: ai-lab
```

None of the Section D/H proposals touch any of them: the uniform shift moves every lot
by the same −96 px as everything else (preserving every relationship that was already
validated safe), and both proposed supporting buildings sit in the waterfront margin,
nowhere near the NW/NE/SE quadrants these three lots occupy. No `DIRECTOR_DECISION` is
needed — recommend the Director Gate simply confirm the shift amount from Section D.

---

## J. Water / Layout Validation

- **Water record strategy:** keep exactly one `harborVisuals` entry of type `"water"` —
  the existing single-water rule (`layoutValidation.mjs`, "Layout requires exactly one
  coherent waterfront water visual") needs **zero changes**. A larger rectangle is still
  one rectangle.
- **Single-water rule impact:** none — explicitly confirmed sufficient, as requested.
- **New overlap checks required:** the existing `PERMANENT_STREETSCAPE_TYPES` /
  `protectedNavigation` mechanism should be extended to include the new `"large-ship"`
  type only if it should be prevented from ever overlapping the dock/land (recommended:
  yes, add it, cheap and consistent with the existing pattern) — small boats can stay
  exempt like the existing `"small-boat"` (matching Pass 2's precedent of treating small
  decorative vessels leniently).
- **New containment check (genuinely new territory):** nothing today validates "is this
  visual actually inside the water rectangle" — Pass 1/2 never needed a *containment*
  rule, only *exclusion* rules. Recommend one small addition: any `harborVisual` of type
  `"large-ship"` (and, optionally, `"small-boat"`) must be fully contained within the
  single water rectangle's bounds. This is cheap to implement (the existing `overlaps()`
  helper is one boundary-comparison away from a `contains()` helper) and directly
  prevents the one genuinely new authoring mistake this pass introduces: a ship
  accidentally placed half on land.
- **Dock/ship/building constraints:** no change needed for dock-vs-water (already
  contiguous by construction); ship-vs-dock only matters if the ship is meant to be
  "moored" against it, which is a placement choice, not a rule Codex needs to encode.

---

## K. Visual Architecture

```text
CURRENT_VISUAL_ARCHITECTURE_SUFFICIENT
```

Pass 3 adds at most ~4 new `HarborVisualType` values (`large-ship`, `warehouse`,
`cargo-shed`, plus reuses `small-boat`) — far smaller than Pass 2's 15-type addition,
which itself only justified one new helper file. No new file is needed:
- Add `drawLargeShip` next to the existing `drawBoat`/`drawWater`/`drawDock` in
  `harborVisualCatalog.ts` (same "water-related primitives" neighborhood).
- Add `drawWarehouse`/`drawCargoShed` to the existing `streetscapeVisuals.ts` (same
  category as the existing `market-kiosk`/`notice-board` structure-like helpers).
- The single exhaustive dispatch switch in `harborVisualCatalog.ts` remains the one
  place that guarantees every type is rendered — extend it with 3–4 more cases, exactly
  the pattern Pass 2 already established twice.

`vesselVisuals.ts` or `harborStructures.ts` would be justified only if this pass's scope
were significantly larger; at this size they'd be premature file-splitting for its own
sake, which the Director Plan explicitly warns against (Section 16: "Do not add a
generic theme engine. Do not move layout data into render modules.").

---

## L. Rendering

```text
PROGRAMMATIC_ONLY_STILL_SUFFICIENT
```

A large ship, small boats, a warehouse, and a cargo shed are all expressible with the
same rect/triangle/line primitive vocabulary already used throughout
`harborVisualCatalog.ts`/`streetscapeVisuals.ts` — nothing here requires asset-level
fidelity to validate composition, which is explicitly the point of this pass (harbor
identity through space/proportion, not skin quality). This matches the Director's own
Mockup Visual Standard (Section 18 of the Director Plan) directly.

---

## M. Camera / Framing

Current camera behavior is sufficient — **no change needed**. `WorldScene.ts:113`'s
`cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)` reads directly from the
unchanged `WORLD_WIDTH`/`WORLD_HEIGHT` constants, and follow lerp (0.15/0.15) is
independent of the internal layout. Since the new water (1088–1280) sits well within
the existing bounded world, the player will naturally see more of it simply by walking
toward the (now-relocated) Exhibition Hall/dock, the same way they already discover the
waterfront today — no dead-space risk was found in this geometry, since the basin is
still anchored to the same south edge the player already walks toward.

---

## N. Collision

- Default the large ship and every small boat to non-collidable (Section G) —
  `COLLIDABLE_HARBOR_VISUAL_TYPES` should **not** gain a ship/boat entry.
- The only new collision candidate is the warehouse (Section H), and only if it ends up
  large/central enough that walking through it would look wrong — this is Codex's
  situational call at final placement time, not a mandate. If added, extend
  `COLLIDABLE_HARBOR_VISUAL_TYPES` with `"warehouse"` only, following the exact existing
  one-line pattern used for `"water"`.
- `cargo-shed` should stay non-collidable regardless (smaller, decorative-scale).
- Static collider count would grow from 5 to at most 6 (if the warehouse becomes
  collidable) — trivial for Arcade Physics, no pattern change needed
  (`createEnvironmentalCollision` already builds one static body per collidable
  placement, unchanged since Pass 1).
- No new player traps are introduced: the ship/boats sit inside the collidable water
  rectangle's footprint but are themselves non-collidable, so they cannot create a
  second, competing collider near the water edge.

---

## O. Performance

```text
NO_SPECIAL_PERF_WORK
```

Current build: 1,401.11 kB / gzip 364.17 kB, 0 binary assets. Pass 3 adds roughly 5–7
new static Graphics objects (1 large ship + 2–3 small boats + 1–2 support buildings) —
a small fraction of Pass 2's own ~30-object increase, which itself only cost +10 kB /
+1.85 kB gzip. All existing drawing happens once inside `renderWorld()` during
`create()`; nothing added by this pass needs to run per-frame, and nothing in the
proposal touches `WorldScene.update()`.

---

## P. QA

```text
ADD_NEW_HARBOR_COMPOSITION_TESTS
```

Minimum new/updated tests:
1. **Shifted-geometry regression**: re-assert the existing `"project-owned spatial
   layout validates"` test still passes against the new coordinates (it will, since the
   shift is uniform and overlap-invariant, but this is the cheapest possible regression
   guard for a geometry change touching every record).
2. **Reserved lots still safe after shift**: explicit assertion that all 3 lots remain
   non-overlapping with the new (shifted) buildings/paths/forecourts — even though
   translation invariance guarantees this mathematically, a concrete test catches a
   future accidental non-uniform edit.
3. **Vessel containment**: new test(s) for the containment rule in Section J — a ship
   placed outside the water rectangle should fail; one placed fully inside should pass.
4. **Vessel/dock overlap** (if `large-ship` is added to `PERMANENT_STREETSCAPE_TYPES`):
   a ship overlapping the dock rectangle should fail, mirroring the existing
   permanent-streetscape test pattern from Pass 2.
5. Keep all existing density-cap, duplicate-ID, and single-water tests unchanged — none
   of them need modification.

No Playwright or browser automation is needed — all of the above are pure data-shape
checks via the existing `node --test` runner.

---

## Q. Mockup Fidelity

The proposal remains squarely at mockup level: every new element (ship, boats,
warehouse, cargo shed) is a flat-color Phaser Graphics silhouette using the existing
color palette, with no animation, no lighting, no water shader, and no asset production
of any kind. Nothing in this recommendation adds detail beyond what's needed to test
"does the composition read as a harbor" — which is exactly the question this pass exists
to answer. No walk-back of Visual Pass 2's accepted mockup status is implied or needed.

---

## R. Findings

**VP3-01 — Minor**
Finding: No containment validation exists for "is this visual actually inside the water
rectangle" — a genuinely new category of check this pass needs that Pass 1/2 never
required.
Evidence: `layoutValidation.mjs` — every existing rule is an *exclusion* check
(`assertDoesNotOverlap`); there is no `contains()`-style inclusion check anywhere in the
file.
Impact: Without it, nothing stops a future edit from placing the large ship or a small
boat partially on land, which would look obviously wrong and isn't caught by any
existing test.
Recommended action: Add the containment check and accompanying tests described in
Section J/P before or during Pass 3 implementation.

**VP3-02 — Minor**
Finding: The recommended geometry shift (−96 px) is a full-layout coordinate change
touching every zone, path, forecourt, reserved lot, and harbor visual at once.
Evidence: `worldLayoutData.json` currently has 5 zones + 4 paths + 4 forecourts + 3
reserved lots + 49 non-water harbor visuals = 65 records that would all need the same
`y -= 96` edit.
Impact: Mechanically simple (uniform, overlap-invariant, verified safe by hand for the
tightest cases in Section D) but high-surface-area — a single mis-applied record (e.g.
one entry accidentally left unshifted) would silently reintroduce an overlap that the
existing per-type validators may or may not catch depending on which type it is.
Recommended action: Recommend Codex apply the shift programmatically (a small script or
transform pass over the JSON) rather than by hand-editing 65 records individually, and
rely on Section P's regression test (item 1) to catch any record that was missed.

**VP3-03 — Minor**
Finding: `edge-south`'s decorative strip (already fully hidden behind water since
Visual Pass 1, previously classified `IGNORE`) will be even more deeply submerged after
water grows to 192 px thick.
Evidence: `edge-south` spans y:1216–1280; new water spans y:1088–1280, which contains it
by an even wider margin than today's y:1184–1280 water did.
Impact: None — it was already fully invisible and harmless; this just makes that more
true. Not reopening this per the Director's explicit "do not overcorrect" carry-over
guidance (Visual Pass 2 pre-review Section O, item C).
Recommended action: None required; noted for completeness only.

**VP3-04 — Minor (process/documentation, recurring)**
Finding: `91_STATUS.md`/`92_HANDOFF.md` are stale again — they mark Visual Pass 2's
independent review and human feel test as "PENDING" even though both are complete and
on disk. This is the identical pattern flagged and then fixed one phase ago (Visual
Pass 2 pre-review, Finding VP2-04 → corrected in the Visual Pass 2 implementation
commit → now stale again for Visual Pass 3).
Evidence: `91_STATUS.md` line 6 and the "Visual Pass 2 independent review — PENDING" /
"User Visual Feel Test — PENDING" lines; both
`reports/portfolio-world/visual-pass-02/04-claude-independent-review.md` and
`05-human-visual-feel-test.md` exist and record completed results.
Impact: Same as before — a future agent trusting only the canonical status docs (per
`08_ENVIRONMENT_POLICY.md`'s Environment Gate) would misjudge project state. Since this
recurred immediately after being fixed once, it suggests the status/handoff update isn't
yet a reliably-followed step in the phase-closeout process, not just a one-off miss.
Recommended action: Correct both docs as part of Visual Pass 3's implementation
closeout (same as last time), and consider whether the phase-sequence documentation
itself should make "update 91/92" an explicit, unmissable step rather than an implied
one.

No Blocker or Major finding was identified.

---

## S. Final Visual Pass 3 Scope

Recommend Codex receive the Director Plan's Section 19 "In Scope" list, made concrete by
this review:

```text
Uniform −96 px northward shift of every zone/path/forecourt/reservedLot/
  harborVisual except waterfront-water and the 4 edgeDecorations (Section D)
waterfront-water resized in place: y 1232→1184, height 96→192 (Section D)
playerSpawn shifted with everything else (Section D)
One new HarborVisualType: "large-ship", drawn in harborVisualCatalog.ts next
  to drawBoat, placed offshore east of the dock (Section G)
2-3 new instances of the existing "small-boat" type at varied positions/sizes,
  non-symmetric placement (Section G)
Two new HarborVisualType values: "warehouse" and "cargo-shed", drawn in
  streetscapeVisuals.ts, placed in the waterfront margin west of the dock,
  clear of all 3 reserved lots (Section H)
New containment validation: large-ship (and optionally small-boat) must be
  fully inside the water rectangle (Section J)
large-ship added to PERMANENT_STREETSCAPE_TYPES (must not overlap dock/land)
Optional: warehouse added to COLLIDABLE_HARBOR_VISUAL_TYPES, situationally,
  only if its final placement/size warrants it (Section N)
New/updated tests per Section P
Status/handoff correction for Visual Pass 2 (Finding VP3-04)
Continued performance / accessibility / collision QA
```

---

## T. Explicit Non-Scope

Unchanged from the Director Plan; re-confirmed as absent from both the plan text and the
current codebase — must remain out of scope for Codex's Pass 3 implementation:

```text
new portfolio destination
new functional building interaction
building interiors
NPC
dialogue
AI NPC
quest
combat
audio
day/night
final art skin
final ship asset production
multiplayer
auth
database
generic theme engine
Tiled integration
```

---

## U. Evidence Required After Implementation

- Screenshots: (1) Harbor Square-to-waterfront wide view showing the enlarged basin,
  (2) a dedicated waterfront/dock view showing the large ship clearly, (3) a view
  showing at least 2 small boats simultaneously to judge "does harbor traffic feel
  active," (4) a view including the warehouse/cargo-shed cluster. Given Visual Pass 2's
  independent review flagged a real gap where 3 of 4 routes had zero evidence
  screenshots, Pass 3's evidence should not repeat that pattern for the waterfront work
  specifically, since the waterfront is this pass's entire focus.
- Manual checks: walk from Harbor Square to the dock and confirm the water boundary
  still stops the player cleanly at its new (larger) edge; confirm the dock is still
  fully walkable; confirm no new prop (ship, boat, warehouse) blocks the Exhibition Hall
  entrance or forecourt; confirm all four Harbor Square routes remain reachable and
  undisturbed by the shift.
- Performance evidence: main JS bytes, gzip bytes, binary asset count (expected 0),
  static collider count (expected 5 or 6), confirmation that `npm ci` / `typecheck` /
  `test` / `build` / production preview / `git diff --check` all pass.
- Data evidence: the shifted `worldLayoutData.json` in the commit diff should be
  reviewable as a clean, uniform, mechanical change (ideally confirming a script/
  transform was used per Finding VP3-02, not 65 hand-edits).

---

## V. Director Recommendation

```text
DESIGN_FIX_REQUIRED
```
