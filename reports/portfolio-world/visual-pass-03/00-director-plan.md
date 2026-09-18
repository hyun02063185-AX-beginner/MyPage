# Portfolio World — Retro Harbor Campus Visual Pass 3 Director Plan

> Recommended repo path:
> `reports/portfolio-world/visual-pass-03/00-director-plan.md`

## 1. Phase Name

```text
Retro Harbor Campus — Visual Pass 3
Harbor Composition Rebalance
```

---

## 2. Purpose

Visual Pass 3 is **not** a final art pass.

It is a composition pass that strengthens the world’s harbor identity through:

```text
sea-area proportion
boat visibility
dock composition
supporting harbor structures
```

The user currently evaluates the world as a mockup.

Therefore the goal is **not** to disguise the mockup as a finished production service.

The goal is to validate whether the spatial composition itself feels convincingly like a harbor.

---

## 3. Inputs

Visual Pass 1 established:

```text
basic navigation
Harbor Square
waterfront foundation
destination readability
```

Visual Pass 2 established:

```text
route identities
streetscape density
reserved expansion lots
layout constraints
supporting environmental composition
```

Human feedback after Visual Pass 2:

```text
overall structure is acceptable
empty feeling is reduced
current world is still regarded as a mockup
the sea feels too small for a harbor
boats are not visually prominent enough
unused upper-land margin could be reduced
more lower-screen area should be given to the sea
one large ship + several small boats would strengthen harbor identity
supporting harbor buildings such as warehouses can fill selected empty space
```

---

## 4. Locked Decisions

Preserve:

```text
Harbor Square as central anchor
North = Academy
West = Guild Hall
East = Workshop
South = Exhibition Hall / Waterfront
player movement model
current wayfinding logic
reserved expansion concept
mockup-level rendering
programmatic-first implementation
```

Do not redesign the four-destination IA.

---

## 5. Core Design Problem

Current issue:

```text
The world reads as a town with some water.
```

Desired result:

```text
The world should read as a harbor town.
```

The difference should come from:

```text
more visible sea
stronger vessel presence
clear harbor basin composition
supporting dock-side structures
```

—not merely more decorative props.

---

## 6. Land / Sea Rebalance

The map should allocate more visible area to the sea.

Direction:

```text
reduce unused upper-land margin
shift overall composition downward toward a larger harbor basin
increase visible lower-screen sea territory
```

This does **not** mean moving every major building.

Preferred order of operations:

```text
1. inspect current unused upper margin
2. determine how much land can be compressed safely
3. expand south water area
4. adjust coastline / dock line
5. preserve primary routes and destination access
```

Avoid changing major destination positions unless necessary.

---

## 7. Sea-area Target

Do not hard-code a percentage before inspecting the actual layout.

The implementation should instead aim for:

```text
sea is visually substantial in the lower composition
water is visible before the player reaches the extreme south edge
harbor basin feels spatially important
```

The sea should no longer feel like a thin boundary strip.

---

## 8. Harbor Vessel Composition

Required mockup composition:

```text
1 large ship
2–4 small boats
```

### Large Ship

Purpose:

```text
primary harbor visual anchor
scale reference
strong harbor identity
```

The large ship may be:

```text
moored
partially offshore
aligned with a major dock
```

It should not block primary player movement.

It does not need gameplay interaction.

### Small Boats

Purpose:

```text
activity
scale
depth
harbor life
```

Possible distribution:

```text
one near dock
one farther in water
one near warehouse / cargo area
optional one at edge of basin
```

Avoid symmetrical or evenly spaced placement.

---

## 9. Vessel Rendering Policy

Visual Pass 3 remains a mockup.

Prefer:

```text
programmatic ship silhouettes
simple project-owned generated shapes if absolutely needed
```

Do not start final pixel-asset production solely for ships.

The ships must be recognizable enough to test harbor composition.

---

## 10. Dock / Harbor Basin Composition

Strengthen:

```text
dock
pier
mooring area
water edge
cargo zone
```

Possible structure:

```text
Exhibition Hall
↓
promenade
↓
dock / pier
↓
large ship / small boats
↓
open sea
```

The waterfront should feel like a real transition from town to harbor.

---

## 11. Supporting Harbor Buildings

Selected non-functional background structures may be introduced.

Candidate types:

```text
warehouse
cargo shed
storage building
dock office
harbor service hut
small maintenance structure
```

Purpose:

```text
reduce visual emptiness
support environmental storytelling
define harbor edge
strengthen scale
```

These are not primary portfolio destinations.

They do not require interaction.

---

## 12. Functional Hierarchy

Visual hierarchy:

```text
1. Primary portfolio destination buildings
2. Harbor Square landmark
3. Large ship
4. Waterfront / dock
5. Supporting harbor buildings
6. Small boats
7. Streetscape props
```

Supporting structures must not compete with primary destination buildings.

---

## 13. Reserved Expansion Protection

Visual Pass 2 introduced reserved future-use parcels.

Visual Pass 3 must preserve them unless the Director explicitly approves a change.

Rules:

```text
Do not consume all reserved lots.
Do not place permanent harbor-support buildings inside reserved lots without review.
Do not fill future-use parcels with collision-heavy scenery.
```

If one reserved lot is clearly better used for harbor composition, stop and report:

```text
NEEDS_DIRECTOR_DECISION
```

rather than silently repurposing it.

---

## 14. Upper-space Compression

The user specifically wants to consider trading unused upper-space for more sea.

Claude should pre-review:

```text
which upper-world area is genuinely unused
whether world bounds can be rebalanced without moving the core IA
whether camera and spawn behavior remain safe
whether world height should remain 1280 or be repartitioned internally
```

Preferred:

```text
keep overall world size stable if possible
reallocate internal land / sea proportions first
```

Avoid a world-size change unless clearly justified.

---

## 15. Navigation Protection

Do not let the larger sea area harm navigation.

Preserve:

```text
Harbor Square four-way readability
Academy access
Guild access
Workshop access
Exhibition access
dock walkability
```

The harbor basin can be visually larger without becoming a player-navigation obstacle.

---

## 16. Collision Policy

Likely collidable:

```text
water boundary
primary buildings
large dock barriers if needed
selected large harbor support structures
```

Usually decorative / non-collidable:

```text
boats in non-walkable water
small boats
cargo details
ropes
flags
small harbor props
```

Do not add unnecessary collider density.

---

## 17. Camera / Framing

The larger sea area should be visually useful.

Review whether:

```text
camera framing shows enough sea
large ship can be seen at meaningful moments
water does not become an empty blue field
```

The sea should add identity, not dead space.

Use boats / dock / shoreline / supporting structures to create visual rhythm.

---

## 18. Mockup Visual Standard

The user explicitly does not require final service-level skin.

Target:

```text
clear
readable
atmospheric
compositionally convincing
```

Not required:

```text
production-final art
high-detail pixel assets
final animation
advanced lighting
final water shaders
```

---

## 19. Visual Pass 3 In Scope

```text
land/sea proportion adjustment
larger visible sea area
coastline / dock rebalance
one large ship
2–4 small boats
supporting harbor buildings
cargo / mooring composition
camera readability
layout metadata updates if needed
collision / bounds validation
performance / accessibility regression checks
```

---

## 20. Out of Scope

```text
new portfolio destination
new functional building interaction
interiors
NPC
dialogue
quest
combat
audio
day/night
final art skin
final ship assets
multiplayer
auth
database
generic theme engine
```

---

## 21. Pre-review Questions for Claude

Claude Sonnet 5 should inspect the current implementation and answer:

1. How much current upper-world land is genuinely underused?
2. Can the sea area be expanded without changing the 2048×1280 world size?
3. Should coastline / waterfront move northward?
4. Can Exhibition Hall remain in its current position?
5. Would any primary destination need relocation?
6. What is the safest new water rectangle / coastline geometry?
7. How should dock geometry change?
8. Where should the large ship be placed for maximum visibility?
9. How many small boats are appropriate at mockup density?
10. Should boats be layout records or harbor-visual records?
11. Should the large ship have collision, or remain inside non-walkable water only?
12. Which supporting harbor buildings are most valuable?
13. Can supporting buildings be added without consuming reserved lots?
14. Does any reserved lot conflict with the new harbor composition?
15. Does the current single-water validation need to change?
16. Do overlap constraints need updates for vessels / supporting structures?
17. Will more visible sea create camera dead-space issues?
18. Are programmatic graphics still sufficient for this pass?
19. Does `streetscapeVisuals.ts` remain the right place for support-building/boat helpers?
20. Is any additional architecture split justified?
21. What tests are needed for the new coastline / vessels?
22. Should overall world size remain unchanged?

---

## 22. Pre-review Required Decisions

### World bounds

```text
KEEP_WORLD_SIZE
CHANGE_WORLD_SIZE
```

### Sea expansion

```text
MOVE_COASTLINE_NORTH
EXPAND_WITHIN_EXISTING_WATER_ZONE
OTHER
```

### Destination positions

```text
KEEP_PRIMARY_DESTINATIONS
MINOR_DESTINATION_ADJUSTMENT
RELAYOUT_REQUIRED
```

### Vessel strategy

```text
PROGRAMMATIC_VESSELS
PROJECT_ASSET_VESSELS
```

### Large ship collision

```text
NON_COLLIDABLE_IN_WATER
COLLIDABLE_STATIC
OTHER
```

### Supporting buildings

```text
ADD_SUPPORT_BUILDINGS
NO_SUPPORT_BUILDINGS_YET
```

### Reserved lots

```text
PRESERVE_ALL_RESERVED_LOTS
ADJUST_RESERVED_LOT_METADATA
DIRECTOR_DECISION_REQUIRED
```

### Architecture

```text
CURRENT_VISUAL_ARCHITECTURE_SUFFICIENT
SPLIT_HARBOR_STRUCTURE_HELPERS
OTHER
```

### QA

```text
CURRENT_TESTS_PLUS_GEOMETRY_UPDATES
ADD_NEW_HARBOR_COMPOSITION_TESTS
OTHER
```

---

## 23. Human Test Goal After Implementation

The user should be able to answer:

```text
1. Does it immediately feel more like a harbor?
2. Is the sea now large enough?
3. Is the large ship visible and convincing?
4. Do multiple small boats make the harbor feel active?
5. Does the extra sea improve the composition rather than create emptiness?
6. Do supporting warehouses/buildings help?
7. Is the town still easy to navigate?
8. Does the mockup remain readable and useful?
9. Is this harbor proportion worth carrying into future passes?
```

---

## 24. Phase Sequence

```text
Visual Pass 3 Director Plan
        ↓
Claude Pre-review
        ↓
Director Gate
        ↓
Codex Implementation
        ↓
Claude Independent Review
        ↓
User Visual Feel Test
        ↓
Director Final Gate
```

---

## 25. Director Status

```text
VISUAL_PASS_3_PLAN_READY
```

Next:

```text
Claude Sonnet 5 Pre-review
```
