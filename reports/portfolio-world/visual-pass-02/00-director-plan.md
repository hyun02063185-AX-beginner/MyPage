# Portfolio World — Retro Harbor Campus Visual Pass 2 Director Plan

> Recommended repo path:
> `reports/portfolio-world/visual-pass-02/00-director-plan.md`

## 1. Phase Name

```text
Retro Harbor Campus — Visual Pass 2
Streetscape & Zone Identity
```

---

## 2. Director Decision

Visual Pass 1 established that:

```text
navigation structure = acceptable
four-direction wayfinding = readable
Harbor Square = functional central anchor
basic harbor identity = established
final visual richness = not yet proven
```

Therefore Visual Pass 2 will **not redesign the validated navigation structure**.

The goal is to turn the readable layout into a place that feels intentional, attractive, and extensible.

---

## 3. Future Building Expansion Policy

The current world must remain capable of accepting additional buildings or functional places later.

This is a deliberate product requirement.

Future additions may include, for example:

```text
small service buildings
portfolio content buildings
event / workshop spaces
archive / library spaces
studio / lab spaces
temporary exhibition buildings
NPC / information facilities
future interactive features
```

These are **not committed features** yet.

The important requirement is:

```text
DO NOT consume every empty space with decoration.
```

Visual Pass 2 must preserve selected open parcels as:

```text
RESERVED EXPANSION LOTS
```

They may visually appear as:

- small gardens
- quiet plazas
- cargo yards
- grass lots
- fenced work areas
- waterfront terraces
- simple paved courts

but their geometry should remain reusable for a future building or functional POI.

---

## 4. Product Goal

The player should feel:

```text
“This is a readable harbor town”
```

and then increasingly:

```text
“This is a real place with different neighborhoods and reasons to explore.”
```

Visual Pass 2 is successful when the space between major destinations becomes meaningful without becoming cluttered.

---

## 5. Locked Structure

Preserve:

```text
WORLD
2048 × 1280

PLAYER SPEED
200 px/sec

Harbor Square
= central navigation anchor

North
= Academy

West
= Guild Hall

East
= Workshop

South
= Exhibition Hall + Waterfront
```

Do not materially move the four primary destinations unless a concrete blocking issue is found.

---

## 6. Core Design Principle

Do not solve empty space by randomly scattering props.

Use:

```text
ZONE IDENTITY
→ STREETSCAPE COMPOSITION
→ ENVIRONMENTAL STORY
→ DENSITY RHYTHM
```

Each route should feel like it belongs to a different part of the harbor campus.

---

## 7. Zone Identity

### 7.1 Harbor Square

Role:

```text
Arrival
Orientation
Crossroads
Civic center
```

Character:

```text
open
recognizable
balanced
welcoming
```

Possible elements:

- central navigation landmark
- benches
- lamps
- planters
- direction signs
- notice board
- small decorative market / kiosk
- paving variation
- banners

Keep enough openness for orientation.

Do not overfill the center.

---

### 7.2 Guild Hall Route — Journey Street

Role:

```text
Career / experience / journey
```

Atmosphere:

```text
traveler
guild
archive
harbor administration
```

Possible streetscape:

- notice board
- route map
- travel crates
- flags
- benches
- registry desk/kiosk silhouette
- map stand
- small greenery
- stone/wood street furniture

Potential future functional building slots:

```text
Archive
Career Timeline Annex
Guild Registry
Journey Map Room
```

Do not implement these buildings now.

Preserve at least one practical expansion parcel near this route.

---

### 7.3 Academy Route — Learning Walk

Role:

```text
Teaching / learning
```

Atmosphere:

```text
ordered
calm
bright
academic
```

Possible streetscape:

- small garden
- benches
- book/sign motifs
- banners
- trees/planters
- study court
- clean lamps
- stepping / paving rhythm

Potential future functional building slots:

```text
Library
Mini Lecture Hall
Learning Archive
Resource Center
```

These remain future options only.

Preserve a buildable/open parcel.

---

### 7.4 Workshop Route — Maker Yard

Role:

```text
Making / AI Lab / experiments
```

Atmosphere:

```text
working harbor
shipyard
maker
inventive
```

Possible streetscape:

- timber
- cargo
- tool racks
- crane silhouette
- worktables
- carts
- barrels
- rope
- material stacks
- open yard

Potential future functional building slots:

```text
Prototype Lab
Tool Shed
AI Studio
Experimental Workshop
```

Do not implement these yet.

The route should feel active but remain easy to walk.

---

### 7.5 Exhibition Route — Waterfront Promenade

Role:

```text
Gallery / results / showcase
```

Atmosphere:

```text
polished
open
coastal
exhibition-oriented
```

Possible streetscape:

- waterfront lamps
- benches
- display boards
- flags
- flower planters
- dock details
- moorings
- small viewing terrace
- boat / harbor silhouettes

Potential future functional building slots:

```text
Temporary Exhibition Pavilion
Media Gallery
Event Deck
Showcase Hall Annex
```

Preserve open waterfront capacity.

---

## 8. Reserved Expansion Lots

Visual Pass 2 must explicitly identify **at least 3 future-use parcels**.

Recommended categories:

```text
North / Academy side
West or Northwest / Guild side
East / Workshop side
```

Optional fourth:

```text
South waterfront / Exhibition side
```

Each reserved parcel should:

- remain large enough for a small future building
- not block primary paths
- not be filled with permanent collision-heavy scenery
- be visually acceptable while empty
- be documented in layout data or design evidence

Do not label them to end users as “future lot.”

They should simply look like natural town spaces until used.

---

## 9. Density Strategy

Visual density should vary.

Target:

```text
Harbor Square
= medium-high but open

Primary routes
= medium

Destination forecourts
= medium-high

Workshop yard
= medium-high

Waterfront
= medium-high

Reserved expansion lots
= low to medium

Outer edges
= low
```

The world should not have uniform density.

Uniform density makes the map feel artificial.

---

## 10. Streetscape Rhythm

Avoid continuous decoration.

Use a rhythm like:

```text
landmark
→ breathing space
→ prop cluster
→ path
→ small focal point
→ destination
```

Recommended cluster size:

```text
2–5 related props per micro-scene
```

Examples:

```text
bench + lamp + planter

crates + barrel + rope

notice board + sign + small tree

worktable + timber + cart
```

Prefer composed groups over isolated random props.

---

## 11. Visual Hierarchy

Order of importance:

```text
1. Primary destination buildings
2. Harbor Square landmark
3. Waterfront / dock
4. Secondary streetscape anchors
5. Prop clusters
6. Detail decoration
```

Small decorative props must not visually compete with destination buildings.

---

## 12. Programmatic Graphics vs Project Assets

Visual Pass 1 proved programmatic rendering is sufficient for structural validation.

Visual Pass 2 must decide whether visual quality can continue with programmatic graphics alone.

The expected decision process is:

### Continue Programmatic Graphics if:

- route identity becomes clearly readable
- prop clusters look coherent
- silhouette quality is sufficient
- concept direction becomes more convincing

### Introduce Project-owned Visual Assets if:

- programmatic objects remain too abstract
- streets look technically correct but visually flat
- concept-image quality gap cannot be reduced by composition alone
- recognizable harbor props need richer silhouettes

Do not introduce an external asset pack casually.

Any new binary asset must follow `07_ASSET_POLICY.md`.

---

## 13. Asset Quality Gate

Before adding final-style pixel assets, distinguish:

```text
STRUCTURAL BEAUTY
vs
ASSET BEAUTY
```

Visual Pass 2 should first answer:

```text
Does the composition itself look good?
```

If composition is weak, prettier assets will not fix the world.

If composition is strong but the world still looks too primitive, then asset production becomes justified.

---

## 14. Environmental Storytelling

Each route should tell a simple story without requiring text.

Examples:

### Guild

```text
People depart, record journeys, and return.
```

### Academy

```text
People learn, teach, read, and gather.
```

### Workshop

```text
Things are built, tested, moved, and repaired.
```

### Exhibition

```text
Finished work is displayed and viewed.
```

Do not add NPCs yet.

Use objects, spaces, and layout to imply activity.

---

## 15. Collision Policy

Continue:

```text
Visual Density != Collision Density
```

Default new streetscape props to non-collidable.

Use collision only for:

- buildings
- major structures
- water
- large barriers
- select large props where walking through them would look obviously wrong

Reserved expansion lots should avoid collision-heavy clutter.

---

## 16. Wayfinding Protection

Visual richness must not reduce navigation clarity.

Preserve:

```text
Harbor Square → four routes
```

Required:

- paths remain visually readable
- major building silhouettes remain visible
- prop clusters do not cover destination entrances
- no maze effect
- no narrow decorative corridors
- signage remains secondary to spatial readability

---

## 17. Color / Material Rhythm

Canonical materials:

```text
Water
Wood
Stone
Greenery
```

Suggested distribution:

### Harbor Square

```text
Stone dominant
Greenery secondary
Wood accents
```

### Guild

```text
Stone + dark wood
```

### Academy

```text
Light stone + greenery
```

### Workshop

```text
Wood + cargo / industrial accents
```

### Exhibition / Waterfront

```text
Stone + water + clean wood
```

Use the same world palette while varying material emphasis.

---

## 18. Visual Pass 2 Scope

### In Scope

- zone identity refinement
- route-specific streetscape
- prop clusters
- environmental density increase
- expansion-lot preservation
- layout metadata needed for future expansion
- waterfront polish
- stronger destination forecourts
- optional project-owned asset feasibility assessment
- continued performance / accessibility / collision QA

### Out of Scope

```text
new functional building implementation
portal navigation
building interiors
NPC
dialogue
quests
combat
audio
day/night
final player sprite
full production asset replacement
multiplayer
auth
database
```

---

## 19. Proposed Object Density

Visual Pass 2 may exceed Pass 1 density intentionally.

Target guidance:

```text
Primary structures
6–10

Secondary streetscape anchors
15–25

Detail props
25–45
```

This is not a hard cap.

Composition quality matters more than raw count.

Avoid placing props solely to hit numbers.

---

## 20. Performance Guard

Track:

- main JS bytes
- gzip bytes
- approximate static scene object count
- Graphics object count
- binary asset count
- binary asset bytes
- static collider count

No large optimization project unless measurable regression appears.

---

## 21. Accessibility

Preserve:

- keyboard navigation
- focus behavior
- persistent exit
- ARIA
- coarse-pointer fallback
- non-color-only destination cues

Decorative Phaser text must not become the sole carrier of critical navigation meaning.

---

## 22. Pre-review Questions for Claude

Before implementation, Claude Sonnet 5 should inspect the current code and answer:

1. Can future small buildings be added without restructuring `worldLayout.ts`?
2. Should reserved expansion lots become explicit layout records?
3. What is the safest representation for future-use parcels?
4. Which current empty spaces are best preserved for future buildings?
5. How many streetscape objects can be added before `WorldScene` / `harborVisualCatalog` needs another structural split?
6. Should route-specific visual catalogs be introduced now?
7. Is `harborVisualCatalog.ts` still sufficient for Pass 2?
8. Which props can remain programmatic and which are likely to need project-owned assets?
9. Is this the right phase to introduce an asset manifest?
10. Can the current programmatic style plausibly approach the selected concept direction through composition alone?
11. Which route should be used as the first high-detail “quality bar” prototype?
12. What test additions are needed for reserved expansion lots and higher prop counts?
13. Are there collision/performance risks from the proposed density increase?
14. Should any stale Sprint 1/2 layout concepts be cleaned before Pass 2?

---

## 23. Recommended Quality-Bar Route

Before dressing the whole world equally, choose **one route** as a quality benchmark.

Director recommendation:

```text
Harbor Square → Exhibition Hall → Waterfront
```

Reason:

```text
This route contains:
central plaza
destination building
street transition
dock
water
harbor props
```

It is the best place to test whether the world can become as visually attractive as the concept direction.

If this route reaches an acceptable quality level, the same composition principles can expand to the other three routes.

---

## 24. Human Test for Visual Pass 2

The user should later judge:

```text
1. Does the world feel less empty?
2. Does each route feel different?
3. Does the world still remain easy to navigate?
4. Do the prop clusters look intentional rather than random?
5. Do the empty reserved lots feel natural rather than unfinished?
6. Does the waterfront route begin to approach the concept-image atmosphere?
7. Is the world becoming visually memorable?
8. Are programmatic graphics still sufficient?
9. Would richer project-owned assets now materially improve the experience?
10. Does the world still feel like a professional portfolio, not only a game map?
```

---

## 25. Acceptance Candidate

Visual Pass 2 becomes implementation-complete candidate when:

```text
Four route identities are distinguishable
Harbor Square remains readable
Streetscape density is visibly improved
At least 3 expansion lots are preserved
Prop placement feels composed rather than random
Waterfront route reaches the selected quality-bar target
Navigation remains easy
Collision regression none
Accessibility regression none
Performance remains acceptable
Existing portfolio remains protected
User visual review is ready
```

---

## 26. Phase Sequence

```text
Visual Pass 2 Director Plan
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

## 27. Director Status

```text
VISUAL_PASS_2_PLAN_READY
```

Next:

```text
Claude Sonnet 5 Pre-review
```
