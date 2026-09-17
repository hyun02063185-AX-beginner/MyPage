Portfolio World — Sprint 2 Director Design

Spatial IA + Environmental Density + Collision Foundation

Status:

DIRECTOR DRAFT FOR PRE-REVIEW

Prerequisite:

Sprint 0A COMPLETE
Sprint 0B COMPLETE
Sprint 1 COMPLETE
main merge b431071
PLAYER_SPEED 200 px/sec accepted
PLAYER SIZE accepted
CAMERA 0.15 accepted for current stage

Current deployment status at closeout:

/MyPage/world/ = HTTP 200
GitHub Pages refresh to Sprint 1 bundle = pending at the time of closeout

Sprint 2 implementation must not begin until the public deployment is rechecked once.

1. Sprint Goal

Sprint 2 addresses the main Human Feel Test follow-up from Sprint 1:

Four primary destinations exist, but the current world feels too empty relative to its size.

The goal is not to solve this by immediately shrinking the world.

The goal is to turn the empty prototype into a readable, denser AI portfolio campus where:

Central Plaza
→ clear paths
→ environmental landmarks
→ destination forecourts
→ four primary portfolio zones

can be understood before portal/content behavior is implemented.

One-sentence goal:

Keep the accepted movement scale, but make the same world feel intentionally designed rather than empty.

2. Product Principle

Primary portfolio IA remains simple:

Career
Lecture / Teaching
AI Lab / Making
Gallery

Environmental assets are not new primary destinations.

They exist to:

reduce empty traversal
improve orientation
support visual storytelling
make the portfolio world feel authored

Do not create fake Portfolio sections merely to fill space.

3. Spatial Density Rule

Use the Sprint 1 accepted movement baseline:

PLAYER_SPEED = 200 px/sec

Target experience:

Central Plaza → primary destination:
approximately 4–7 seconds

Completely empty straight traversal:
avoid > ~2 seconds

Between Plaza and a primary destination:
at least 1 visually distinct landmark

Every primary destination:
has a readable approach / forecourt

These are design heuristics, not hard physics gates.

4. World Bounds

Keep for Sprint 2:

2048 × 1280 px
64 × 40 logical units

Do not shrink the world at the beginning of Sprint 2.

First test whether density/layout solves the perceived emptiness.

World-size reduction remains an available later tuning option if the denser layout still feels too sparse.

5. Central Plaza Role

Central Plaza becomes the navigation anchor.

Required visual roles:

central landmark
four directional path cues
clear open center
small gathering/rest area
signage or wayfinding

Do not overload Plaza with too many props.

The player should be able to understand the four major directions within a few seconds.

6. Primary Zone Placement

Keep directional prototype:

North → Lecture / Teaching
West  → Career
East  → AI Lab / Making
South → Gallery

But Sprint 2 may adjust exact distance/offset of each zone.

Each primary zone should have:

approach path
small forecourt / threshold area
visual identity marker
placeholder building footprint

No content navigation yet.
No actual portal behavior.

7. Environmental Landmark Categories

Use a small reusable vocabulary.

Recommended categories:

Nature
- tree clusters
- shrubs / planters
- small garden
- optional small water feature

Rest / human-scale
- benches
- small table / rest corner
- cafe-like seating placeholder

Wayfinding
- directional signs
- notice board
- zone markers
- path patterns

Portfolio identity
- AI sculpture / abstract installation
- outdoor lecture board
- project showcase plinth placeholder
- technology / workstation prop silhouette

Atmosphere
- lamps
- paving changes
- border planting
- small decorative kiosk

Sprint 2 does not need all of these.

Target:

6–10 landmark instances
using 4–6 reusable landmark types

Avoid visual clutter.

8. Meaningful Micro-Content

Optional in Sprint 2:

short labels only

Examples:

AI Lecture
Career Archive
AI Lab
Gallery

Do NOT add long text, actual career cards, lecture content, project details, or links.

9. Asset Strategy

Sprint 2 should validate layout and density before final art production.

Preferred asset hierarchy:

Stage A — geometry/placeholders
Stage B — cohesive temporary game-ready asset set
Stage C — final Portfolio World art direction

Sprint 2 minimum:

cohesive placeholder assets

no random mixed-style web images

no copyrighted game rips

no final bespoke art requirement

Allowed approaches:

programmatic Phaser graphics
simple locally generated placeholder SVG/PNG created specifically for the project
small internally consistent temporary asset kit

Any binary asset added must record:

source
license / generation origin
status = PLACEHOLDER

under the project asset policy.

10. Tiled Decision — Proposed

Director proposal:

Introduce Tiled-compatible map data in Sprint 2
but do NOT make the Tiled desktop app a hard dependency.

The Sprint 2 problem is spatial placement, so a map/data layer becomes useful now.

However the shared iMac environment must remain operable without system-level installation.

Preferred rule:

runtime can load map/layout data from repository files
the game must build and run without opening Tiled

Claude pre-review must choose among:

A. Tiled JSON now
B. project-owned JSON/TS layout now, Tiled later
C. hybrid Tiled-compatible schema

Do not install Tiled during pre-review.

11. Collision Decision — Proposed

Sprint 2 introduces environment collision only if the chosen spatial data model supports it cleanly.

Collision scope:

building footprints
large planters / garden borders
water feature
selected large props
world boundary

Do NOT make every decorative prop collidable.

Benches/signs/lamps may remain non-collidable if collision hurts navigation.

Physics decision:

Reconsider Phaser Arcade Physics in Sprint 2.

Claude must compare:

manual rectangle collision
vs
Arcade Physics static bodies

Criteria:

simplicity

maintainability

future Tiled object-layer compatibility

collision response quality

Phaser 4 compatibility

12. Path Network

Sprint 2 should establish a visible path network.

Target:

Central Plaza
├─ north path
├─ west path
├─ east path
└─ south path

Paths should not be perfectly long empty corridors.

Use:

slight widening
small resting nodes
landmarks
paving variation

Avoid maze-like complexity.

This is a portfolio, not an exploration puzzle.

13. Destination Readability

Before reaching a destination, the player should understand where they are heading.

Use at least two of:

path direction
signage
building silhouette
zone color/value difference
forecourt landmark

Do not depend on text labels alone.

14. Visual Density Zones

Use three density levels:

High
Central Plaza / destination forecourts

Medium
main paths / landmark nodes

Low
peripheral scenery / buffer edges

This lets the world retain breathing room without feeling empty.

Peripheral space does not need to become traversable content.

15. Edge Treatment

Outer world edges should feel intentional.

Possible treatment:

tree line
garden boundary
wall/fence-like decorative edge
water/green buffer
non-interactive background band

Do not leave a visible empty rectangle boundary.
No invisible-labyrinth walls.

16. Camera / Movement

Keep Sprint 1 baselines initially:

PLAYER_SPEED = 200
CAMERA_LERP = 0.15
PLAYER SIZE = current

Do not retune before the denser map exists.

After asset/layout placement, perform another short Human Feel Test.

Possible later tuning:

speed
camera lerp
world bounds
destination spacing

No value is permanently locked.

17. Architecture Direction

Preferred conceptual split:

src/
├─ scenes/
│  └─ WorldScene.ts
├─ world/
│  ├─ worldLayout.*
│  ├─ worldTypes.ts
│  ├─ landmarkCatalog.ts
│  └─ collisionData.*     # if needed
├─ player/
└─ config/

If Tiled JSON is chosen:

public/
└─ maps/
   └─ portfolio-world-v1.json

Keep rendering/data separation.

Do not hard-code dozens of landmark coordinates directly in WorldScene.ts.

18. Data Model Requirement

Environmental placement should be data-driven.

Each item should support a minimal concept such as:

id
type
x
y
width/height or scale
collision yes/no
zone

Do not overbuild a generic editor/runtime system.

Sprint 2 only needs enough structure so layout can be adjusted without rewriting scene logic.

19. Placeholder Building Footprints

Sprint 2 may add building footprints / silhouettes for the four primary zones.

These are not final building assets.

They exist to validate:

scale
spacing
approach
collision
readability

Each building should be recognizably different in shape/marker, but final art direction is deferred.

20. UX / Accessibility

Keep:

Portfolio exit
keyboard controls
ARIA game region
coarse-pointer fallback

Additional Sprint 2 requirement:

Environmental decoration must not make movement paths ambiguous.

Color alone must not be the only way to distinguish the four zones.

21. QA Strategy

Playwright remains optional.

Claude pre-review must answer:

Add Playwright in Sprint 2?
YES / NO

Reasons to reconsider now:

more spatial state

collision

map/assets

asset-path regression

route still absent

If NO, define a stronger manual collision/map QA checklist.

Minimum automated checks should include where practical:

map/layout data parse
duplicate IDs
out-of-bounds placed objects
missing asset references
invalid collision entries

22. Human Feel Test — Sprint 2

After implementation, user judges:

Does the world still feel too large?
Do paths make destinations obvious?
Are there enough things to see while walking?
Does it feel cluttered?
Do environmental assets support a portfolio mood?
Does 200 px/sec still feel right?

Possible verdicts:

ACCEPT_DENSITY_AND_LAYOUT
TOO_EMPTY
TOO_CLUTTERED
DESTINATIONS_TOO_FAR
DESTINATIONS_TOO_CLOSE
REWORK_VISUAL_HIERARCHY

23. Explicit Non-Scope

Sprint 2 does NOT implement:

actual portfolio navigation portals
career/teaching/project content panels
NPC
dialog
AI NPC
final bespoke pixel art
audio
analytics
multiplayer
user accounts
mobile touch movement

Portal/navigation behavior remains Sprint 3 candidate.

24. Sprint 2 Acceptance Candidate

public Sprint 1 deployment verified
spatial data model stable
Central Plaza readable
4 destination footprints readable
path network readable
6–10 landmark instances
empty traversal reduced
edge treatment intentional
collision approach validated
no player trapping
no major navigation ambiguity
asset references valid
typecheck PASS
build PASS
tests PASS
existing Portfolio regression NONE
Human Feel Test PASS

25. Director Questions for Claude Pre-Review

Claude must make concrete recommendations on:

Tiled JSON now vs TS/JSON layout vs hybrid

Arcade Physics vs manual collision

Whether 6–10 landmark instances is enough

Whether 2048×1280 should remain during Sprint 2

Placeholder building scale strategy

Whether Playwright should start now

What automated spatial-data validation is worthwhile

Whether asset source/license metadata needs a concrete file format now

Any Phaser 4-specific implementation risk

Any missing accessibility/navigation requirement

26. Director Gate Status

DRAFT_READY_FOR_CLAUDE_PRE_REVIEW