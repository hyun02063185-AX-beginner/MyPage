# 05. Portfolio World Rebuild — Harbor Blockout Spec

Status: **PROPOSED — Candidate A+ selected (R2A.1 correction), no pixel coordinates locked**
Updated: 2026-09-26 (R2A.1 Director Layout Correction)

Diagrams below are coordinate-free schematics (`~`=water, `.`=land/ground, `[X]`=zone, `=`/`*`=pier/Hero Ship, `\|/`=primary walking route). They exist to compare composition ideas, not to specify pixel placement — R2B derives real coordinates from the selected candidate, validated against `06_SCALE_CAMERA_CALIBRATION_PLAN.md` before anything is final.

**R2A.1 correction notice**: R2A's original Candidate A diagram, while a crescent in shape, still placed the four destinations at roughly Academy=north/Guild Hall=west/Exhibition=south-east/Workshop=south-west of Harbor Square — a hidden quadrant/radial structure around the square as an implicit geometric center. This is corrected below as **Candidate A+**. Candidate A is not discarded; §1–3 keep the original three-way comparison as the historical record that led to A+, and §4 is the corrected, superseding design. R2B builds from §4, not from §1's original Candidate A diagram.

## 1. Three Macro-Layout Candidates (original R2A comparison, kept as record)

### Candidate A — "Crescent Harbor" (superseded by Candidate A+, §4)

```text
.................[Academy]........
........................|.........
.[Guild Hall]......[Harbor Square]
.........\...............|........
..........\..........[Exhibition]
...........\..............|.......
~~~~~~~~~~~~\============+==*~~~~~~   (pier + Hero Ship at the crescent's inner curve)
~~~[Workshop / cargo dock]~~~~~~~~~
~~~~~~~~~~~~~~open water beyond~~~~~
```

One continuous crescent-shaped basin occupies the lower ~half of the world. The settlement wraps the inner arc of the crescent; Harbor Square sits one block back from the water at roughly the arc's midpoint. Hero Ship berths at a pier at the arc's inner curve, on the diagonal sightline from the square, with open water visible beyond it. Destinations string along the arc at *uneven* spacing and setback, not a ring.

- Water/land ratio: ~50/50, water reads as one large enclosed bay.
- Primary visual axis: the diagonal from Harbor Square down to the Hero Ship's pier.
- Negative space: open water beyond the pier, visible but not fully traversable.

**Hidden risk found in R2A.1**: despite the crescent shape, this diagram still reads as Academy=north / Guild Hall=west / Exhibition=south-east / Workshop=south-west *of Harbor Square* — a quadrant structure with the square as an implicit center, exactly the cardinal-cross risk the brief exists to prevent, just bent into a curve instead of a cross. See §4 for the correction.

### Candidate B — "Twin Basin Peninsula"

```text
..[Guild Hall]...........[Academy]..
...........\.............../........
............[Harbor Square]..........
..................|..................
...........[peninsula base]..........
~~~~~~~~~~/‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\~~~~~~~~~
~working~[peninsula: Exhibition Hall]~quiet~
~basin~~~[Hero Ship berthed at tip]*~~cove~~
~~[Workshop / cargo]~~~~~~~~~~~~~~~~~~~~~~~~
```

An off-center land peninsula splits the water into two unequal basins (a larger working basin, a smaller quiet cove). Harbor Square sits at the peninsula's base; Exhibition Hall occupies the peninsula itself; Hero Ship berths at the peninsula's tip, giving the strongest single "ship as landmark at the end of a point" composition of the three. Guild Hall and Academy sit inland at different distances from the water.

- Water/land ratio: ~50/50, but split into two visually separate bodies.
- Primary visual axis: the peninsula's spine, square-to-ship.
- Negative space: the quiet cove, largely unplayable but visible.

### Candidate C — "Single Sweep Waterfront"

```text
.[Academy]...........[Guild Hall]........
........\......................../.......
.........[Harbor Square spine walkway]...
......../..........................\.....
.[Workshop]..................[Exhibition]
......|................................|..
~~[cove]~~~~~~~~~~*[Hero Ship, grand quay]~~~~~~~
~~~~~~~~~~~~~~~~~~~open water sweep~~~~~~~~~~~~~~
```

One long, gently curving waterfront runs across the lower portion of the world; the settlement's spine runs parallel to it, one block inland. A small working cove interrupts the sweep at one point. Hero Ship berths at the widest point of the waterfront (a "grand quay"), positioned at roughly one-third along the sweep, not centered. Destinations line the spine at varying setback.

- Water/land ratio: ~40/60, water reads as one long edge rather than a surrounding basin.
- Primary visual axis: the horizontal-diagonal sweep itself.
- Negative space: open water past the grand quay, along the sweep's far end.

## 2. Evaluation (original R2A comparison, kept as record)

| Criterion | A — Crescent Harbor | B — Twin Basin Peninsula | C — Single Sweep |
| --- | --- | --- | --- |
| Harbor first-read | Strong — enclosed bay reads immediately | Strong, but split into two bodies can read as two smaller harbors rather than one | Weaker — a long edge reads more as "a road beside water" |
| Hero Ship prominence | Strong — diagonal sightline from the square | Strongest — ship anchors a point, unmistakable landmark | Strong — grand-quay placement, but less enclosed drama |
| Asymmetry | Inherent in basin shape, but see the hidden quadrant risk noted in §1 | Inherent (offset peninsula, unequal basins) | Present but weakest of the three — a sweep can accidentally read as "evenly spaced along a line" if not deliberately varied |
| Wayfinding | Simple — one continuous arc, "walk the harbor edge" | Harder — the peninsula can visually separate Workshop from the rest, risking an implied detour | Simplest — everything strings along one spine |
| Portfolio navigation | Good | Good, but the split sightline is a real risk to double-check in blockout | Best (simplest mental model) |
| Visual balance | Good — one dominant water shape balanced by settlement arc | Good but riskier — two basins must each stay generously sized or repeat v1's "thin strip" mistake | Good, but water occupying only one edge risks feeling thinner than the brief wants |
| Negative space | Good — open water beyond the pier | Good — the quiet cove | Present, but at one end only |
| Future asset scalability | Good — more piers/boats add along the arc without breaking composition | Good, but the peninsula's fixed geometry constrains where new water-facing assets can go | Good — simplest to extend along the spine |
| First-blockout complexity | Moderate (one basin, one arc) | **Highest** (peninsula geometry, two water bodies, more collision/route surface) | Lowest, but at the cost of harbor identity |

## 3. Decision History

**Originally selected in R2A: Candidate A — "Crescent Harbor,"** for scoring well on every criterion above without Candidate B's complexity/wayfinding risk or Candidate C's weaker enclosed-harbor read. **Corrected in R2A.1**: Candidate A's own diagram still carried a hidden quadrant-around-the-square structure (§1). The fix keeps everything that made A win the comparison (one continuous crescent basin, strong negative space, simple wayfinding, easy future extension) and imports Candidate B's single best property (Hero Ship anchored to unmistakable land/water geometry, not just a diagonal sightline) — this is **Candidate A+**, §4. This is not a switch to Candidate B's twin-basin structure (explicitly rejected — see `90_DECISIONS.md`), and it is not a re-opening of the A-vs-B-vs-C comparison; it is a correction of A's own execution.

## 4. Candidate A+ — "Crescent Harbor with Hero Quay" (selected, supersedes Candidate A)

```text
                              [Academy]
                                 |
                          (longer inland branch)
                                 |
      [Guild Hall]        (older inland edge)
            \                   |
             \        . . . . . . . . . . .
              \      .                     .
               ......[Harbor Square]........      <- off-center: NOT the middle of the frame,
                       \                            one node along the spine, not a hub
                        \
                         \___[Exhibition Hall]
                                    \
                                     \___________
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[Hero Quay]===*HERO SHIP
~~~~[working dock: Workshop]~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~crescent basin~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~open water beyond the ship~~~~~~~~~~
```

**Structural principles** (per the R2A.1 brief §3):

- One crescent basin, kept from Candidate A — the shape that gave the strongest harbor first-read of the three original candidates.
- **Harbor Square is off-center and sits *on* the walking spine, not in the middle of the world and not as a hub four destinations radiate from.** It is one node in a settlement that grew along the shoreline/working-dock/quay/spine, exactly the framing the R2A.1 brief requires (`HARBOR SQUARE != GEOMETRIC CENTER`).
- A short, asymmetrical **quay/pier tongue** juts from the shoreline near the spine's waterfront end — not a plain diagonal sightline with nothing to anchor it, but actual land/water geometry the Hero Ship is physically attached to (Candidate B's imported strength).
- Hero Ship berths at or beside the quay's end, with open water visible behind it — enough that the ship reads as sitting *in* the harbor's geometry, not "a boat glued beside the map."
- Hero Ship's masts/sails may overlap land/background visual space where it helps the composition (explicitly permitted, not a defect).
- Exhibition Hall sits near the quay, on the waterfront side of the spine — the destination physically closest to the Hero Ship.
- Workshop sits at the working-dock end of the basin, away from the quay — paired with the working, not the ceremonial, harbor edge.
- Guild Hall and Academy branch inland from the spine at **different points and different distances** — not two mirrored arms of a cross, not both "north of the square." Guild Hall sits closer, at the older inland edge nearer Harbor Square; Academy sits further along a longer inland branch, in its own separate forecourt.
- No destination is placed as "the one to the north/south/east/west of Harbor Square." Every destination's placement is described relative to the *spine, basin, or quay* — never relative to the square as a center point.

This diagram is still coordinate-free and still describes relationships, not pixel positions — R2B derives real coordinates from these relationships, re-checking at each step that no two destinations end up looking like mirrored compass points around the square.

## 5. Hero Ship / Hero Quay Placement Concept

The Hero Ship berths at or beside an asymmetrical quay/pier tongue that juts from the crescent's shoreline near the spine's waterfront end — not merely "on a diagonal sightline from the square" (R2A's original framing), but physically attached to a piece of land/water geometry built for it. Open water is visible behind the ship. Its masts/sails are permitted to overlap land/background visual space where beneficial (explicitly not a defect — the R2A.1 brief names this directly).

This was corrected from R2A's original placement concept, which was directionally right (diagonal, not centered, negative space beyond) but insufficiently anchored — a sightline alone does not stop a ship from reading as "placed beside the map" if nothing in the land geometry reaches toward it. Alternatives re-considered and still rejected: a foreground-side basin placement (ship too large/near-camera, reads as pasted on) and a bare diagonal with no quay (the original R2A concept — insufficient on its own, now folded into the quay-anchored version above).

## 6. Destination Zones (Semantic Placement, Not Coordinates)

| Destination | Semantic placement in Candidate A+ | Why |
| --- | --- | ---|
| Exhibition Hall | On the waterfront side of the spine, near the Hero Quay | Elegant waterfront relationship (`01_ART_BIBLE.md` §7); nearest the ship, not "east of the square" |
| Workshop | At the working-dock end of the basin, away from the quay | Craft/working identity pairs with the working harbor edge, not with any compass direction from the square |
| Guild Hall | A short inland branch off the spine, near Harbor Square's inland side | "Established stone district / older harbor edge" — closer to the square than Academy, but not its mirror opposite |
| Academy | A longer, separate inland branch, its own forecourt | "Brighter/open garden forecourt" — further inland, on a different branch than Guild Hall, not the "other side" of a Guild-Hall/Academy axis through the square |

**Explicit check**: no two destinations in this table are placed as mirror-image opposites through Harbor Square, and no destination's description references a compass direction from the square. Every entry is described relative to the spine, the basin, or another destination's branch. R2B must preserve this property when deriving real coordinates — if a coordinate pass ever produces "Guild Hall is directly opposite Academy across the square," that is a regression to the corrected risk, not a neutral implementation detail.

Every destination still keeps at least two independent wayfinding cues (silhouette, sign, path direction, emblem, forecourt, landmark — `01_ART_BIBLE.md` §12) regardless of exact position.

## 7. First Representative Destination

**Selected: Exhibition Hall** — unchanged from R2A, re-confirmed under Candidate A+ (it sits nearest the Hero Quay in both versions of the layout, so the reasoning still holds). Evaluated against the alternatives:

- *Guild Hall* — heaviest stone material language, but weakest water relationship of the four; would not validate the Square→waterfront chain.
- *Workshop* — tests the working-dock relationship, but is a secondary-tier facility semantically.
- *Academy* — furthest from the water on its own inland branch; the opposite of what this blockout needs to validate first.
- **Exhibition Hall (selected)** — nearest the Hero Quay, so one blockout view validates Harbor Square, the waterfront, the Hero Ship, and a destination-building relationship simultaneously. Least texturally demanding of the four for a flat-shape blockout stage.

## 8. Blockout Scope (implements `00_VISUAL_BRIEF.md`/`01_ART_BIBLE.md`, not final art)

### Production-intent blockout elements

```text
Candidate A+ crescent harbor basin
+ off-center Harbor Square (on the spine, not centered, not a hub)
+ waterfront / Hero Quay
+ Hero Ship placeholder (simple flat shape/silhouette, correctly scaled and placed
  at/beside the quay)
+ Exhibition Hall mass only (§7 above)
+ player reference
+ one basic walking route (Harbor Square -> Exhibition Hall -> Hero Quay)
```

No other destination building is implemented. A location marker or a labeled flat mass may be used for Guild Hall/Academy/Workshop **only** for whole-layout understanding (so the spine/branch relationships in §6 are legible in a wide screenshot) — this is not an implementation of those destinations and must not be mistaken for one.

### Calibration-only placeholders (R2A.1 addition — not production assets)

Added to resolve the scope mismatch between the original blockout scope (Hero Ship only) and the Scale Calibration Plan's actual requirements (`06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2, which needs Player, Bench, Door, Lamp, Hero Ship, Medium Vessel, Small Boat, a destination building, and dock width all in frame). These are explicitly **calibration placeholders, not production assets**:

```text
Medium Vessel   -> simple flat shape/silhouette, correctly scaled, near the basin
Small Boat      -> simple flat shape/silhouette, correctly scaled, near the basin
Bench           -> simple rectangle, correctly scaled, near Exhibition Hall
Lamp            -> simple rectangle/silhouette, correctly scaled, near Exhibition Hall
Door            -> simple rectangle marking Exhibition Hall's entrance, correctly scaled
Paving reference -> a flat reference patch, not a finished pavement material
```

Their only purpose is relative scale calibration per `06_SCALE_CAMERA_CALIBRATION_PLAN.md` — they are not a design pass on benches, lamps, doors, or boats, and none of them should be treated as approved production direction for those categories. No polished art anywhere in this scope; flat shapes/placeholder blocks are correct and expected.

## 9. Status

```text
BLOCKOUT_SPEC_STATUS = PROPOSED
SELECTED_CANDIDATE = A_PLUS_CRESCENT_HARBOR_WITH_HERO_QUAY
CANDIDATE_A_ORIGINAL = SUPERSEDED_BY_A_PLUS (not discarded as a comparison record)
LOCKED_COORDINATES = NONE
```
