# Portfolio World — Canonical Target Implementation Blueprint

Status: **BLUEPRINT ONLY — no runtime changes**  
Canonical source: `evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png`

## Scope

This converts the approved Projection A visual/spatial contract into explicit
design-space geometry and an asset plan. It does not change `GrayboxScene`,
collision, assets, Phaser scenes, or gameplay. The Canonical Target is not a
scene plate, pixel collision source, or runtime background.

## Inputs and method

- Master: Projection A, measured in its 1920 × 1080 design coordinate space.
- Movement reference: the approved P1–P7 fixed-scale validation.
- Runtime comparison: opened 1280 × 720 R3G actual-camera capture
  `evidence/r3g-final-look-convergence-pass-1/01-overall-final-look-pass1.png`
  and its recorded QA payload.
- Skills: `environment-art`, `portfolio-world-visual-qa`, and
  `create-game-assets`. The latter is used only to create an asset manifest and
  handoff plan—not to generate assets.

All coordinates in this document are measured design pixels and are reproduced
verbatim in [the machine blueprint](../../data/portfolio-world/canonical-target-implementation-blueprint.json).

## Design world and player

| Contract | Value |
| --- | --- |
| Design world | 1920 × 1080 |
| Initial proposed world bounds | 0,0–1920,1080; no expansion currently justified |
| Viewport | 1280 × 720 |
| Canonical player visual height | 56 px (5.19% of frame height) |
| Player collision footprint | 28 × 16 px, bottom-centre anchored |
| Scale policy | Fixed; optional local correction only ±5%; no perspective scaling |
| Hall door / player | 106 / 56 = 1.89× door height |
| Hero visual height / player | 592 / 56 = 10.57× |
| Hero hull / player width | 565 / 28 = 20.18× |

The proposed bounds intentionally preserve the approved image ratio. A later
prototype may add a camera-safe apron only if it documents the changed bounds,
preserved anchors, and new viewport relationship.

## P1–P7 measured anchors

| Point | Design x,y | Zone | Level | Clear width | Connected to |
| --- | ---: | --- | ---: | ---: | --- |
| P1 Workshop foreground | 430,763 | Workshop Forecourt | 0 | 300 | P2 |
| P2 Lower Plaza | 710,763 | Lower Plaza | 0 | 360 | P1, P3, P4 |
| P3 Central Quay | 1010,628 | Central Quay | 1 | 260 | P2, P4, P7 |
| P4 Main Stairs lower landing | 905,663 | Main Stair Connector | 1 | 150 | P2, P3, P5 |
| P5 Hall Plaza | 640,453 | Hall Plaza | 2 | 350 | P4, P6 |
| P6 Hall Entrance | 505,213 | Hall Entrance Apron | 2 | 120 | P5 |
| P7 Hero Ship gangway | 1435,718 | Gangway Access | 1 | 110 | P3 |

Every required connection is wider than the 28 px collision footprint. Main
stairs are a two-dimensional level connector (entry/exit regions are in JSON),
not a 3D perspective-scaling system.

## Explicit geometry

The machine blueprint defines eight walkable polygons/connectors:

1. Workshop Forecourt
2. Lower Plaza
3. Central Quay
4. Hero Quay
5. Main Stair Connector
6. Hall Plaza
7. Hall Entrance Apron
8. Hero Ship Gangway Access

It separately defines Inner Harbor, Hero Ship Berth, Secondary Vessel Berth,
Small Boat Water, and Outer Scenic Water as water-exclusion polygons. Hall,
Workshop, Hero hull, fountain, cargo, and work-prop clusters are explicit
obstacle shapes. This prevents any use of image-derived collision.

## Landmark and fleet contract

| Element | Measured visual bounds | Blueprint action |
| --- | --- | --- |
| Exhibition Hall | x135 y0 w605 h320; door 75 × 106 | GENERATE_NEW |
| Workshop | x85 y520 w505 h280; awning 245 × 110 | GENERATE_NEW |
| Hero Ship | x1325 y115 w595 h685; hull 565 × 285 | GENERATE_NEW |
| Secondary Ship | x1045 y240 w275 h255 | GENERATE_NEW |
| Small Workboat A | x1140 y470 w140 h75 | GENERATE_NEW |

Fleet contract is exactly one Tier-1 Hero Ship, one Tier-2 secondary vessel,
and one Tier-3 small boat. Only the Hero Ship is an interactive landmark;
support ships are decorative and require water-contact presentation but no
player collision.

## Depth and occlusion

Depth uses L0 scenic background, L1 water, L2 walkable foundation, L3 rear
architecture, L4 supporting vessels/rear props, L5 player, L6 front props,
L7 Hero foreground rigging, and L8 UI. L6 uses bottom/ground-anchor depth;
L7 requires transparent occlusion slices for rigging, rails, and selected
ropes rather than placing the player permanently behind the full ship.

Town, cliffs, mountains, lighthouse, outer sea, and distant ships sit beyond
the scenic-background boundary. They may use stronger perspective because they
are non-playable and must be delivered as separate assets—not a copied target
plate.

## Asset decomposition

- **GENERATE_NEW:** plaza/lower-quay foundations, main stairs, Hall Plaza,
  scenic background family, Exhibition Hall, Workshop, Hero Ship, secondary
  ship, small workboat, banners/gangway/railings/workshop tools, foreground
  vegetation/rigging/rope family.
- **REPAIR_EXISTING:** bench/lamp/planter family; crates/barrels/bollards/ropes.
- **PROCEDURAL_RUNTIME:** calm water treatment only.

This is a production plan. It does not authorize any asset generation or
replacement before the Blueprint Human Gate.

## R3G gap analysis

| Category | R3G current state | Canonical requirement | Action after gate |
| --- | --- | --- | --- |
| Composition | 2600×1600 top-down rectangular quay slice | 1920×1080 oblique left-to-right harbor hierarchy | Rebuild |
| Player | Scale coupled to R3G geometry | Fixed 56 px visual / 28×16 footprint | Resize and recalibrate |
| Water | Deep-teal runtime bands | Explicit turquoise harbor/berth exclusions | Rebuild geometry and art |
| Hall / Workshop | R3G-specific assets; Workshop has known repair gap | New landmark-scale Hall and active Workshop | Generate new |
| Hero / fleet | Route-valid ship; no canonical vessel hierarchy | One Hero, one secondary, one small boat | Generate and recompose |
| Plaza / stairs | Planar paving and bridge-like stairs | Fine surface and 2D level connector | Rebuild |
| Camera | 1280×720 at 1.05 zoom | Overview .667; P1 gameplay start at 1.0 | Reframe |

The R3G gap comparison records the difference; it does not weaken or alter the
approved Target.

## Camera contract

`OVERVIEW_CAMERA`: centre (960,540), zoom 0.667, comparison framing only.  
`GAMEPLAY_CAMERA`: begins at P1, centre (640,720), zoom 1.0, follows player
within 0,0–1920,1080 using a 300×180 deadzone and 0.12 x/y lerp. The elevated
look is the environment/asset projection; Phaser remains a 2D orthographic
camera.

## Validation and QA note

Logical routes P1→P2→P3→P4→P5→P6 and P2/P3→P7 pass against the planned
polygons: no mandatory water crossing, no route narrower than the player, no
stair break, and clear Hall/gangway approaches.

The five overlay images make all planned geometry reviewable against the opened
Canonical Target. This is a Blueprint visual inspection, not
`portfolio-world-visual-qa`'s formal runtime Visual Pass: that requires a new
actual Phaser capture and console evidence after implementation, which this
stage expressly forbids.

## Gate

```text
CANONICAL_FINAL_VISUAL_TARGET = APPROVED
IMPLEMENTATION_BLUEPRINT = COMPLETE
RUNTIME_IMPLEMENTATION = NOT_STARTED
NEXT = IMPLEMENTATION_BLUEPRINT_HUMAN_GATE
GATE = READY_FOR_IMPLEMENTATION_BLUEPRINT_HUMAN_GATE
```
