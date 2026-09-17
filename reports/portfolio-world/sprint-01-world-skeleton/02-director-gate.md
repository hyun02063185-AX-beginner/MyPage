# Portfolio World — Sprint 1 Director Gate v1.1
## World Skeleton & First Playable Space

Claude Code pre-review result:

```text
READY_WITH_DESIGN_FIXES
DESIGN_FIX_REQUIRED
```

Director decision:

```text
DESIGN FIXES ACCEPTED
SPRINT 1 DESIGN APPROVED FOR IMPLEMENTATION
```

## 1. Deployment

Sprint 0B public deployment was independently verified:

```text
/MyPage/world/                200
/MyPage/world/assets/...      200
```

The earlier pending deployment issue is CLOSED.

## 2. Accepted Director Decisions

### S1-D01 Perspective
```text
Top-down orthographic
```
ACCEPTED.

### S1-D02 Logical Resolution
```text
1024 × 576
```
ACCEPTED.

### S1-D03 Scale Manager
```text
Phaser.Scale.FIT
Phaser.Scale.CENTER_BOTH
```
ADDED AND ACCEPTED.

### S1-D04 Spatial Unit
```text
32 × 32 logical px
```
ACCEPTED as a design unit. No Tilemap yet.

### S1-D05 World Skeleton
```text
64 × 40 units
2048 × 1280 px
```
ACCEPTED.

### S1-D06 Player Placeholder
```text
visual ≈ 24 × 32 px
```
ACCEPTED as placeholder only.

Collision/body footprint is NOT locked in Sprint 1.

### S1-D07 Movement
```text
8-direction
initial speed 160 px/sec
diagonal normalized
instant start / instant stop
frame-rate independent
```
ACCEPTED.

Implementation must use:

```text
distance = speed × deltaMs / 1000
```

or an equivalent frame-rate-independent calculation.

### S1-D08 Physics
Original proposal: Arcade Physics.

Director revision:

```text
NO Arcade Physics in Sprint 1
```

Use manual position updates and clamp the player's full visual bounds to World bounds.

Reason:
Sprint 1 has no collision objects. Physics bodies would be infrastructure ahead of current need.

Physics is reconsidered in Sprint 2 when real collision geometry exists.

### S1-D09 Camera
```text
follow player
roundPixels = true
lerpX = 0.15
lerpY = 0.15
world bounds
no dead zone
```
ACCEPTED.

Lerp must be a named tuning constant.

### S1-D10 Pixel Rendering
```text
pixelArt = true
fixed logical resolution
CSS/FIT scaling
roundPixels = true
```
ACCEPTED.

Sprint 1 will NOT multiply the game resolution by `devicePixelRatio`.
Retina/high-DPI quality is verified visually on the target iMac.

### S1-D11 Tiled
```text
Deferred to Sprint 2
```
ACCEPTED.

### S1-D12 Homepage CTA
```text
Do not add in Sprint 1
```
ACCEPTED.

Prototype remains reachable by direct `/MyPage/world/` URL.

## 3. Missing Requirements Accepted into Sprint 1

### MR-01 — Keyboard capture
ACCEPTED / REQUIRED.

Arrow keys and WASD used for movement must not scroll the browser page.

Use Phaser-supported keyboard capture/prevent-default behavior.

### MR-02 — Focus-loss reset
ACCEPTED / REQUIRED.

When browser/window/game focus is lost while movement keys are held, held movement state must be cleared so the player does not continue moving after return.

Use Phaser-supported reset/blur APIs and avoid duplicate listeners.

### MR-03 — Scale Manager
ACCEPTED / REQUIRED.

Use:

```text
FIT
CENTER_BOTH
1024 × 576 logical resolution
```

### MR-04 — High-DPI strategy
ACCEPTED / REQUIRED.

Sprint 1 strategy:

```text
fixed logical resolution
FIT/CSS scaling
pixelArt = true
roundPixels = true
no devicePixelRatio-based internal resolution multiplier yet
```

Human visual verification on the actual iMac is required.

### MR-05 — Canvas accessibility
ACCEPTED / REQUIRED.

The HTML game container must expose a concise descriptive ARIA label/region.

The Portfolio exit link remains normal HTML.

### MR-06 — Touch/mobile message
ACCEPTED / REQUIRED AS FALLBACK ONLY.

No touch movement.

For coarse-pointer/small-screen users, show a short message explaining that the current World prototype is keyboard-controlled and keep the Portfolio exit path visible.

Prefer CSS capability/media-query behavior over user-agent sniffing.

## 4. Architecture

Approved baseline:

```text
portfolio-world/src/
├─ main.ts
├─ config/
│  └─ gameConfig.ts
├─ scenes/
│  ├─ BootScene.ts
│  └─ WorldScene.ts
├─ player/
│  ├─ Player.ts
│  └─ movement.ts
└─ world/
   └─ worldLayout.ts
```

A small dedicated stylesheet may be added for the World page shell.

Rules:

- `WorldScene` composes; it does not own all logic.
- `movement.ts` should be as pure/testable as practical.
- No ECS.
- No state-machine framework.
- No Portal/interaction framework yet.
- Tuning values should be named and easy to find.

## 5. Central Plaza

Directional placeholders:

```text
NORTH  → future Lecture
WEST   → future Career
EAST   → future AI Lab
SOUTH  → future Gallery
```

These are prototype labels, not final IA locks.

No portal behavior.

## 6. Persistent HTML Layer

Minimum:

```text
Portfolio World
[포트폴리오로 돌아가기]
WASD / 방향키로 이동
```

The return control must be a real HTML anchor.

Recommended relative target:

```text
../
```

so production `/MyPage/world/` returns to `/MyPage/` without JavaScript.

## 7. QA Decision

```text
Playwright in Sprint 1: NO
```

Minimum evidence:

1. `npm ci`
2. typecheck
3. build
4. tests
5. all 8 movement directions
6. opposite-key cancel
7. normalized diagonal magnitude
8. frame-rate-independent movement
9. camera reaches all World edges with no void
10. focus-loss / alt-tab does not leave movement stuck
11. Portfolio return link works by mouse and keyboard
12. no console errors
13. high-DPI visual check
14. resize/FIT check

The subjective Human Feel Test remains a separate user gate.

## 8. Performance

No new runtime dependency.

Record:

```text
built JS bytes
gzip bytes if practical
new asset bytes
```

The existing Phaser bundle warning remains a follow-up, not a Sprint 1 blocker.

## 9. Explicit Non-Scope

```text
final pixel art
real buildings
Tiled
building/object collision
portal routing
NPC
dialog
content cards
touch movement
audio
analytics
AI NPC
multiplayer
```

## 10. Gate Result

```text
DESIGN_READY_FOR_IMPLEMENTATION
```
