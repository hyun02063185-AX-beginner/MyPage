# 05. Portfolio World Rebuild — Harbor Blockout Spec

Status: **PROPOSED — macro layout selected, no pixel coordinates locked**
Updated: 2026-09-26

Diagrams below are coordinate-free schematics (`~`=water, `.`=land/ground, `[X]`=zone, `=`/`*`=pier/Hero Ship, `\|/`=primary walking route). They exist to compare composition ideas, not to specify pixel placement — R2B derives real coordinates from whichever candidate is selected, validated against `06_SCALE_CAMERA_CALIBRATION_PLAN.md` before anything is final.

## 1. Three Macro-Layout Candidates

### Candidate A — "Crescent Harbor"

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

## 2. Evaluation

| Criterion | A — Crescent Harbor | B — Twin Basin Peninsula | C — Single Sweep |
| --- | --- | --- | --- |
| Harbor first-read | Strong — enclosed bay reads immediately | Strong, but split into two bodies can read as two smaller harbors rather than one | Weaker — a long edge reads more as "a road beside water" |
| Hero Ship prominence | Strong — diagonal sightline from the square | Strongest — ship anchors a point, unmistakable landmark | Strong — grand-quay placement, but less enclosed drama |
| Asymmetry | Inherent (a crescent has no center to be symmetric around) | Inherent (offset peninsula, unequal basins) | Present but weakest of the three — a sweep can accidentally read as "evenly spaced along a line" if not deliberately varied |
| Wayfinding | Simple — one continuous arc, "walk the harbor edge" | Harder — the peninsula can visually separate Workshop from the rest, risking an implied detour | Simplest — everything strings along one spine |
| Portfolio navigation | Good | Good, but the split sightline is a real risk to double-check in blockout | Best (simplest mental model) |
| Visual balance | Good — one dominant water shape balanced by settlement arc | Good but riskier — two basins must each stay generously sized or repeat v1's "thin strip" mistake | Good, but water occupying only one edge risks feeling thinner than the brief wants |
| Negative space | Good — open water beyond the pier | Good — the quiet cove | Present, but at one end only |
| Future asset scalability | Good — more piers/boats add along the arc without breaking composition | Good, but the peninsula's fixed geometry constrains where new water-facing assets can go | Good — simplest to extend along the spine |
| First-blockout complexity | Moderate (one basin, one arc) | **Highest** (peninsula geometry, two water bodies, more collision/route surface) | Lowest, but at the cost of harbor identity |

## 3. Decision

**Selected: Candidate A — "Crescent Harbor."**

Rationale: it is the only candidate that scores well on every criterion simultaneously without a serious offsetting risk. Candidate B has the single best Hero Ship moment but introduces the highest first-blockout complexity and a real wayfinding/negative-space risk (a peninsula splitting sightlines, two basins that must each independently avoid the "thin strip" mistake `00_VISUAL_BRIEF.md` §9/§13 exists to prevent) — too much risk for a *first* blockout meant to prove composition, not stress-test it. Candidate C is the simplest and safest for wayfinding, but its water reads as an edge rather than a surrounding harbor, which under-delivers on `00_VISUAL_BRIEF.md` §9's explicit demand that water be a *major, enclosing* composition element, not a boundary.

**Candidate B is not discarded** — its peninsula/twin-basin idea is recorded as a strong candidate for a *later* expansion (e.g. a second phase adding a working-harbor annex) once Candidate A's simpler composition is proven. **Candidate C is not discarded either** — its "one continuous spine" wayfinding model remains the fallback if Candidate A's crescent turns out, in an actual blockout render, to feel less enclosed than this schematic suggests.

## 4. Hero Ship Placement Concept

Within Candidate A: the Hero Ship berths at a pier extending from the crescent's inner curve toward open water, positioned along the primary diagonal sightline from Harbor Square — not centered in any frame, roughly a rule-of-thirds placement. Its masts/rigging may overlap the skyline/background band for a layered depth read (permitted by the depth model in `04_ARCHITECTURE_V2.md` §4, band 6). This placement was chosen over the alternatives evaluated:

- *Foreground-side basin* (ship placed near-camera, large in frame from the square) — rejected: makes the ship read as "parked next to the map" rather than integrated into the harbor's own geometry.
- *Off-center main berth with no diagonal relationship* — rejected: loses the "leading line to the ship" composition value a diagonal sightline provides for free.
- **Diagonal-to-pier-tip** (selected) — the ship reads immediately on entering Harbor Square (satisfies the harbor/Hero-Ship first-read requirement) while still leaving open negative water space visible beyond it.

## 5. Destination Zones (Semantic Placement, Not Coordinates)

| Destination | Semantic placement in Candidate A | Why |
| --- | --- | ---|
| Exhibition Hall | Along the arc, nearest the Hero Ship's pier | Elegant waterfront relationship (`01_ART_BIBLE.md` §7); tests the Square→destination→dock→water chain in one view — see §6 below |
| Workshop | Along the arc, nearest the working cargo dock | Craft/working identity pairs naturally with the working-harbor end of the crescent |
| Guild Hall | Set back slightly inland, opposite end of the arc from the working dock | "Established stone district / older harbor edge" reads better set back from the bustle |
| Academy | Elevated/set back furthest from the water, on the settlement's inland side | "Brighter/open garden forecourt" identity benefits from distance from working-harbor noise |

Every destination keeps at least two independent wayfinding cues (silhouette, sign, path direction, emblem, forecourt, landmark — `01_ART_BIBLE.md` §12) regardless of exact position; this table names semantic relationships, not locked coordinates, and R2B must re-validate the two-cue rule against whatever exact placement it derives.

## 6. First Representative Destination

**Selected: Exhibition Hall** — evaluated, not defaulted to. Compared against the alternatives:

- *Guild Hall* — tests a heavier stone material language, but has the weakest water relationship of the four; a blockout built around it would not validate the Square→waterfront chain this phase most needs proven.
- *Workshop* — tests the working-dock relationship, but is a secondary-tier facility semantically; less useful as the single representative test.
- *Academy* — tests an elevated/garden approach, but is deliberately the *furthest* destination from the water in Candidate A — the opposite of what this blockout needs to validate first.
- **Exhibition Hall (selected)** — in Candidate A it sits nearest the Hero Ship's pier, so one blockout view validates Harbor Square, the waterfront, the Hero Ship, *and* a destination-building relationship simultaneously. Its "clean/elegant" identity is also the least texturally demanding of the four for a flat-shape blockout stage.

## 7. Blockout Scope (implements `00_VISUAL_BRIEF.md`/`01_ART_BIBLE.md`, not final art)

Per the R2A brief §13, the first R2B implementation includes only:

```text
Harbor Square
+ substantial harbor basin (Candidate A's crescent)
+ waterfront
+ Hero Ship blockout (simple flat shape/placeholder block, correctly scaled and placed)
+ Exhibition Hall mass only (§6 above)
+ player reference
+ one basic walking route (Square <-> Exhibition Hall <-> pier)
```

No polished art, no other destination, no full-world recreation. Flat shapes/placeholder blocks are explicitly acceptable and expected — the purpose is composition and scale validation per `06_SCALE_CAMERA_CALIBRATION_PLAN.md` and `07_RUNTIME_QA_PLAN.md`, not an art pass.

## 8. Status

```text
BLOCKOUT_SPEC_STATUS = PROPOSED
SELECTED_CANDIDATE = A_CRESCENT_HARBOR
LOCKED_COORDINATES = NONE
```
