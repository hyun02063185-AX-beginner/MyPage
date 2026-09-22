# Portfolio World — Sprint 2 Director Gate v1.1
## Spatial IA + Environmental Density + Collision Foundation

Claude Code pre-review result:

```text
READY_WITH_DESIGN_FIXES
DESIGN_FIX_REQUIRED
```

Director decision:

```text
DESIGN FIXES ACCEPTED
SPRINT 2 DESIGN APPROVED FOR IMPLEMENTATION
```

## 1. Deployment

Sprint 1 public deployment is verified:

```text
SPRINT_1_DEPLOYED
/MyPage/world/ = HTTP 200
Sprint 1 bundle active
```

The previous deployment-refresh concern is CLOSED.

## 2. Product Density

The Sprint 1 user feedback remains the core Sprint 2 problem:

> Four primary destinations exist, but the world feels too empty relative to its size.

Director interpretation:

```text
Treat as spatial-density / authored-environment problem first.
Do not shrink the world at Sprint 2 start.
```

Keep:

```text
WORLD_WIDTH  = 2048
WORLD_HEIGHT = 1280
PLAYER_SPEED = 200
CAMERA_LERP  = 0.15
```

Re-run Human Feel Test after density is added.

## 3. Required Zone Repositioning

Claude found a real mismatch between the current geometry and the Sprint 2 travel-time heuristic.

Current approximate center-to-center travel:

```text
Lecture / Gallery = ~2.4 s
Career / AI Lab   = ~4.0 s
```

Director decision:

```text
North/South zone offset:
LOGICAL_UNIT * 5 → LOGICAL_UNIT * 7
```

This is REQUIRED, not optional tuning.

Goal:

```text
North/South and East/West primary destinations should sit in roughly comparable
travel-time bands before further art/layout tuning.
```

## 4. Spatial Data Strategy

Director decision:

```text
PROJECT_LAYOUT_DATA
```

Use the existing TypeScript layout-data pattern.

Do NOT introduce:

```text
Tiled JSON
Tiled desktop app
hybrid Tiled-compatible abstraction
```

in Sprint 2.

Reason:

- `worldLayout.ts` already exists and works.
- Typed TS objects are easy to review and edit across Codex / Claude / Windows / shared Mac.
- Current Sprint uses programmatic geometry, not a real tileset.
- Tiled becomes useful only once an actual tile/art pipeline exists.

Tiled remains a future candidate.

## 5. Collision Strategy

Director decision:

```text
ARCADE_PHYSICS for object collision
MANUAL CLAMP remains for world bounds
```

Important correction:

Do NOT create a second set of static Arcade bodies for the outer world boundary.

Keep the existing manual player/world clamp for:

```text
world-edge containment
```

Use Arcade Physics only for environmental collision:

```text
building footprints
large planters / garden borders
water feature
selected large props
```

Do NOT make these collidable by default:

```text
benches
signs
lamps
small decorative props
edge decoration
```

Reason:

World-edge containment and object collision are separate concerns.
Duplicating the world edge in both manual clamp and Arcade bodies would create two
independent containment systems that could drift.

## 6. Phaser Physics Initialization

Add Arcade Physics as an explicit, reviewed config change.

Requirements:

```text
physics.default = arcade
debug = false in production
```

The player may use a dynamic Arcade body for object collision.

If the player representation must change to support Arcade Physics, preserve:

```text
24 × 32 visual size
200 px/sec perceived speed
current spawn
current input behavior
manual world-bound clamp
```

Do not reintroduce acceleration or inertia.

## 7. Landmark Density

Accepted:

```text
4–6 reusable landmark types
6–10 placed landmark instances
```

Categories may include:

```text
nature
rest
wayfinding
portfolio identity
atmosphere
```

Mandatory density rules:

```text
West path: at least one midpoint landmark
East path: at least one midpoint landmark
North path: at least one landmark
South path: at least one landmark
```

The West/East midpoint requirement is specifically intended to break the current
>2 second empty traversal.

## 8. Building Footprints

Baseline:

```text
8 × 4 logical units
= 256 × 128 px
```

Use a shared baseline for all four destinations.

Optional only if it materially improves readability:

```text
Teaching / AI Lab up to ~1.25–1.5× baseline
```

Do not make all four wildly different sizes.

Entrance / forecourt clearance:

```text
minimum 2 logical units
= 64 px
```

Collision shape for Sprint 2:

```text
full rectangular building footprint
```

Do not implement perspective feet-strip / walk-behind behavior yet.

## 9. Paths

Path width:

```text
2 logical units
= 64 px
```

Keep four-way primary path network.

No maze.
No puzzle navigation.
No branching exploration mechanic.

## 10. Edge Treatment

Use:

```text
decorative visual buffer
+
existing camera bounds
+
existing manual world clamp
```

Examples:

```text
tree line
border planting
green buffer
decorative fence/wall silhouette
```

Edge treatment itself is non-collidable unless a specific interior object independently
needs collision.

Do not add redundant outer static collision walls.

## 11. Visual Convention for Collision

Accepted new requirement:

```text
collidable placeholder geometry must be visually distinguishable
from non-collidable decoration
```

Use one consistent temporary convention, for example:

```text
stronger outline / stroke
solid footprint treatment
```

Do not rely on color alone.

This is a placeholder convention, not final art direction.

## 12. Data Model

Approved minimal concept:

```ts
type LandmarkPlacement = Readonly<{
  id: string;
  type: LandmarkType;
  x: number;
  y: number;
  width: number;
  height: number;
  collidable: boolean;
  zone: WorldZoneId | "path" | "plaza";
}>;
```

Use shared types where useful.

Recommended files:

```text
src/world/worldLayout.ts
src/world/worldTypes.ts
src/world/landmarkCatalog.ts
```

Do NOT create a parallel `collisionData.ts` lookup unless implementation evidence proves it necessary.

Collision stays on the placement record.

## 13. Asset Policy

Director decision:

```text
DOCS_ONLY_FOR_NOW
```

No asset manifest yet.

Sprint 2 should prefer:

```text
programmatic Phaser graphics
```

If the implementation commits the first real binary placeholder asset (SVG/PNG),
then STOP and add the appropriate source/license/status record according to
`07_ASSET_POLICY.md` before commit.

A structured asset manifest can be reconsidered at that point.

## 14. QA

Director decision:

```text
Playwright in Sprint 2: NO
```

Add lightweight automated spatial validation using the existing Node test approach.

Required data checks where applicable:

```text
duplicate placement IDs
out-of-bounds placements
positive width/height
valid collidable entries
valid asset references if any asset references exist
```

No new QA framework.

Manual collision evidence must include:

```text
walk into every building from all four cardinal approaches
no clipping
no trapping
no corner seam wedging
walk around collidable planters/water/large props
walk full world boundary
```

## 15. Accessibility / Wayfinding

Required:

- destination readability must use more than color
- labels / silhouette / path direction must remain readable
- collidable and non-collidable placeholder objects should not look identical
- Sprint 1 keyboard / ARIA / coarse-pointer fallback must not regress

## 16. Performance

No new performance optimization work.

The planned object count is trivial at current scale.

Do not code split because of the existing Phaser/Vite 500 kB warning.

Record built bundle size as trend evidence.

## 17. Explicit Non-Scope

Sprint 2 does NOT implement:

```text
portal navigation
actual Portfolio page routing
career/teaching/project content panels
NPC
dialog
AI NPC
final bespoke pixel art
audio
analytics
multiplayer
accounts
touch movement
```

## 18. Sprint 2 Acceptance Candidate

```text
Sprint 1 deployment verified
N/S offset corrected
project-owned layout data implemented
Central Plaza readable
4 destination silhouettes readable
path network readable
6–10 landmarks placed
W/E empty traversal broken by landmarks
edge treatment intentional
Arcade environmental collision works
manual world clamp preserved
no player trapping / seam wedging
collidable placeholders visually distinguishable
spatial data validation PASS
typecheck PASS
build PASS
tests PASS
existing Portfolio regression NONE
Human Feel Test PASS
```

## 19. Director Gate Result

```text
DESIGN_READY_FOR_IMPLEMENTATION
```
