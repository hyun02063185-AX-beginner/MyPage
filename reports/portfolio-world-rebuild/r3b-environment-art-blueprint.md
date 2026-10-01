# R3B Environment Art Production Blueprint

## Scope and invariant

This blueprint maps art onto `portfolio-world-v2/src/scenes/GrayboxScene.ts`.
The R3A graybox is the gameplay source of truth. Art must not change its walkable
rectangles, collision topology, destinations, player scale, or camera rules.
Round 2C is style direction only; it is never a scene-background plate or a
pixel-derived collision source.

## Geometry source of truth

| Element | World geometry |
| --- | --- |
| World | `1600 × 1000` |
| Upper plaza / Hall threshold | `(310,155) 780 × 345` |
| Exhibition Hall left / entrance / right | `(500,18) 190 × 145`; `(690,68) 100 × 95`; `(790,18) 150 × 145` |
| Main stairs | `(650,480) 260 × 190`; visual rail edges at `x=638` and `x=922`, `y=490…675` |
| Lower quay | `(300,650) 890 × 285` |
| Workshop / approach | footprint `(80,650) 180 × 230`; approach `(260,710) 130 × 170` |
| Hero Ship / gangway | exclusion `(1215,610) 300 × 335`; gangway `(1145,720) 120 × 78`; target apron `(1110,705) 105 × 120` |
| Water | full world base, with only the explicit walkable rectangles rendered as traversable ground |
| Quay rails / water limits | west `x=300`, east `x=1190`, bottom `y=940` |

Movement is constrained by the union of the five explicit walkable rectangles,
with the last valid position restored after attempted exit. Existing static
blocker definitions mirror Hall, Workshop, ship, stair rail, and quay-edge
boundaries. Art must be aligned to these values and cannot add a collision
claim until a later gameplay review approves it.

The temporary player displays at `56 × 80` px—about 11% of the 720 px viewport
height. Camera bounds are the world bounds, at `1.05` zoom, with a `300 × 180`
dead-zone and `0.08` follow lerp.

## Rendering architecture

| Layer | Role | Collision ownership |
| --- | --- | --- |
| L0 Water and distant base | Procedural turquoise water, shoreline movement, distant non-playable tone | Graybox geometry only |
| L1 Traversable foundation | Upper-plaza and quay paving, stairs, quay face | Graybox geometry only |
| L2 Fixed architecture behind player | Hall facades, Workshop shell, rear wall/arches | Existing footprints only |
| L3 Gameplay actors | Player, future NPCs, their shadows | Existing actor logic |
| L4 Small props | Benches, lamps, planters, crates, bollards, banners | Cosmetic until explicitly approved |
| L5 Foreground occlusion | Rails, low walls, vegetation | Existing rail/wall boundaries only |
| L6 Hero Ship occlusion | Hull base behind routes; mast/rigging foreground pieces when appropriate | Existing ship exclusion only |
| L7 UI | Interaction prompts and debug affordances | No world collision |

Depth, not image pixels, decides whether a player passes in front of or behind
art. Transparent foreground slices are required where an item needs occlusion.

## Production style lock

**Reusable prompt core:** refined Mediterranean fantasy harbor for a premium
2D exploration game; warm sunlit limestone, terracotta roofs, deep blue and
muted gold maritime accents, clear turquoise sheltered water, crisp architectural
geometry, readable paving/stairs/doorways at gameplay scale, controlled detail,
strong local clarity, and transparent isolated asset background where requested.
Avoid haze, painterly smearing, soft focus, noisy micro-detail, malformed
railings, labels, UI, maps, full-scene backgrounds, and postcard framing.
Clarity over micro-detail.

## Generation policy and batches

| Batch | Contents | Recommendation | Candidate count and gate |
| --- | --- | --- | --- |
| A — Foundation / spatial art | Paving language, stair dressing, quay edge; water stays procedural | `gemini-2.5-flash-image` for two isolated visual studies only | 2 studies; human alignment gate before B |
| B — Hall + Workshop | Hall left/right/entry slices and Workshop shell | `gpt-image-2` for quality-critical alpha-ready source art | 2 candidates per building family (4 total); human placement/scale gate before C |
| C — Hero Ship / gangway | Ship hull and separate mast/rigging occluder; gangway detail | `gpt-image-2` for the ship; procedural gangway base | 2 ship candidates; human route/occlusion gate before D |
| D — Props / foreground | Only manifest props with a current semantic role | `gemini-2.5-flash-image` exploratory clusters, then hand/procedural cleanup | 2 prop studies; human clutter/occlusion gate |

No blind batch proceeds past its named human gate. All generated requests must
use the DPAPI Codyssey wrapper and preserve the original returned PNG bytes.

## Resolution policy

- Request or preserve a source whose visible art is **1×–2×** its runtime
  display dimensions; do not downscale more than 2:1 and do not upscale a
  finished raster.
- Prefer isolated transparent PNG source assets. Keep original returned PNG
  bytes unchanged; make at most one lossless PNG derivative for a runtime crop
  or atlas placement.
- Never use JPEG conversion, repeated recompression, or a scene plate.
- Verify every asset in the actual `1280 × 720`, `1.05`-zoom gameplay camera,
  including player occlusion and local clarity at the intended depth.

The concrete coordinate, size, depth, collision, transparency, production, and
priority record is [r3b-art-manifest.json](../../data/portfolio-world/r3b-art-manifest.json).
Each manifest asset carries an ID, semantic purpose, target world rectangle,
runtime pixel size, layer, in-front/behind rule, collision relationship,
transparency requirement, production recommendation, Codyssey suitability, and
priority.
