# R5 Phase D.1 — Viewport and Coordinate Contract

| Concept | Contract |
|---|---|
| `SOURCE_IMAGE_SIZE` | Candidate B visual source: 1280×720. It is not an approved world extent. |
| `WORLD_BOUNDS` | Review bound: 1280×720; larger world alternatives require authored art and geometry. |
| `LOGICAL_VIEWPORT` | Under review: 1024×576 and 1280×720. |
| `CSS_DISPLAY_SIZE` | Presentation resolution only; it does not change logical world coordinates. |
| `CAMERA_ZOOM` | Multiplier from world to logical screen. |
| `VISIBLE_WORLD_AREA` | `logicalViewport / zoom`. |

`cameraPosition = clamp(target - visibleWorldArea/2, 0, worldBounds - visibleWorldArea)`.

For each object—including scenery, building, vessel, ground anchor, interaction anchor, and player—`screen = (world - camera) × zoom`. Preview output adds a final thumbnail scale only. The player feet, not its image center, remain at its ground anchor. Water overlap is allowed only where C.2 explicitly names a Pier/Dock/Gangway bridge surface; building, cliff, and hull collision is never allowed.

The basic WorldScene 1024×576, Canonical R4’s independent 1920×1080 world declaration, and the 1280×720 Candidate B source are therefore documented as distinct concepts.
