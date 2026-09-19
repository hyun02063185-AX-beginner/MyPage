# Retro Harbor Campus — Visual Grammar / Art Bible v1.0
## Revised Draft after Claude Pre-review

> Canonical repo path  
> `reports/portfolio-world/art-direction/retro-harbor-campus-visual-grammar-v1.0.md`

---

## 0. Document Status

```text
STATUS = REVISED_AFTER_PRE_REVIEW
LOCK_STATE = NOT_YET_LOCKED
MASS_ASSET_PRODUCTION = HOLD
CALIBRATION_REQUIRED = YES
```

This document defines the shared production grammar for all future Portfolio World environment assets.

The goal is to stop asset-by-asset visual drift and make ships, buildings, docks, props, vegetation, and later environmental variations look as if they were produced for the same world.

This revision incorporates the Visual Grammar pre-review findings, especially:

- the world is **not** true isometric/dimetric projection
- world camera yaw and object heading must be separated
- scale must use the project `32 px LOGICAL_UNIT`, not placeholder player size
- transparent padding must not distort perceived-scale measurements
- current fixed class-depth rendering needs an occlusion/depth follow-up after grammar lock
- mass PNG production must wait until calibration and asset-size rules are locked

---

# 1. Core Principle

Every production asset must look as if it belongs to:

```text
the same world-view grammar
the same scale system
the same lighting setup
the same material family
the same detail budget
the same depth/occlusion rules
the same asset pipeline
```

The goal is not strict real-world realism.

The goal is:

```text
coherent stylized plausibility
```

---

# 2. Canonical Projection Description

Do **not** describe this project as mathematically true isometric or dimetric.

The canonical visual model is:

```text
HYBRID ORTHOGRAPHIC 2.5D WORLD
```

More precisely:

```text
GROUND / WATER / PATHS
= orthographic plan-view geometry

BUILDINGS / SHIPS / PROPS
= camera-facing illustrated elevations
  with controlled top-surface visibility
```

This distinction is important.

The ground is not rendered with the same perspective transform as the illustrated PNG assets.

Therefore future production prompts must not simply say:

```text
"isometric asset"
```

without the project-specific grammar.

---

# 3. Camera Elevation Convention

For illustrated world assets:

```text
CAMERA_ELEVATION
= angle above the horizontal horizon plane
```

Canonical axis definition:

```text
0°  = horizontal eye-level
90° = vertical top-down
```

Calibration candidates remain:

```text
15°
22.5°
30°
```

These are **asset illustration elevation candidates**.

They do not rotate or transform the plan-view ground layer.

Final elevation remains unlocked until human calibration.

---

# 4. Camera Yaw Convention

Canonical world-view yaw:

```text
CAMERA_YAW = 0°
```

Interpretation:

- the plan-view world remains axis-aligned
- primary building elevation faces the screen/camera convention
- there is no requirement that every building expose a side facade

The previous rule:

```text
"one side facade must always be visible"
```

is removed.

That rule conflicts with the current axis-aligned world and frontal Exhibition Hall treatment.

---

# 5. Camera Yaw vs Object Heading

Do not confuse:

```text
CAMERA_YAW
```

with:

```text
OBJECT_HEADING
```

A ship may berth in a different direction without changing the world camera.

For ships:

- camera grammar remains fixed
- hull heading may vary by valid berth pattern
- deck/top visibility must remain consistent with the locked elevation
- arbitrary runtime rotation of a painted PNG should be avoided when it breaks perspective

For future vessel-layout variation, prefer:

```text
predefined heading-compatible asset variants
+
predefined berthing slots
```

over unconstrained random rotation.

---

# 6. Ship Surface Grammar

Canonical ship grammar:

```text
hull side = dominant
deck top = visible as a continuous secondary plane
mast = vertical
sails = clearly readable
bow / stern = distinguishable
```

Required:

- some deck must be visible
- the ship must not become a pure side elevation
- the top surface must not dominate as in a bird's-eye illustration
- mast count and sail arrangement must remain readable at runtime size

Hero Ship D direction remains:

```text
A-like perceived scale
C-like character / multi-mast identity
deck-visible elevated view
```

---

# 7. Building Surface Grammar

Use the term:

```text
PRIMARY FACADE
```

instead of assuming a universal architectural "front".

Canonical building grammar:

```text
primary facade = dominant
roof/top = partially visible according to locked elevation
entrance/functional face = readable
side facade = optional, not mandatory
```

Prohibited:

- asset-specific camera angles
- one building with a strong 3/4 turn while another is frontal without design reason
- roof-dominant bird's-eye rendering
- flat architectural elevation with no useful top visibility

---

# 8. Prop Surface Grammar

Props inherit the same elevation and lighting grammar.

Examples:

```text
crate
= top + main face, optional side depending on shape

barrel
= top ellipse + body

bench
= seat top + supporting body

lamp
= grounded base + vertical body + readable fixture

tree
= grounded trunk/canopy relationship with consistent top exposure
```

Do not create detailed category-specific camera systems unless a prop type proves problematic.

---

# 9. Master Scale System

The placeholder player is **not** the master production scale.

Canonical master unit:

```text
LOGICAL_UNIT = 32 px world units
```

All scale documentation must ultimately be expressed using:

```text
world display width
world display height
logical-unit width
logical-unit height
visible-content bounds
```

Player size remains a useful gameplay reference, but not the canonical art scale.

---

# 10. Visible Content Bounds

Never measure asset scale only from PNG canvas size.

Transparent padding can make two assets appear mathematically similar while their visible masses differ significantly.

For every production asset, track:

```text
SOURCE_CANVAS_SIZE
TRIMMED_CONTENT_BOUNDS
DISPLAY_SIZE
DISPLAY_CONTENT_BOUNDS
```

Scale comparison uses:

```text
visible / trimmed content
```

not raw padded canvas dimensions.

Before production lock, PNG export should remove unnecessary transparent margin whenever it does not break anchor behavior.

---

# 11. Category Scale Record

Do not use the old abstract table such as:

```text
PLAYER = 1.0
Hero Ship = 8–10
```

as the final production contract.

Instead each category must have a runtime-derived record:

```text
category
reference asset
display width
display height
visible-content width
visible-content height
logical-unit width
logical-unit height
anchor
visual hierarchy tier
```

Calibration should establish reference records for:

```text
Hero Ship
Medium Sailing Vessel
Small Working Boat
Destination Building
Warehouse
Tree
Crate
Dock Segment
Player Reference
```

Exact category ranges are locked **after** calibration.

---

# 12. Building-to-Ship Ratio Rule

Current human direction:

```text
Hero Ship D scale = acceptable
destination buildings = may become somewhat larger
```

Production principle:

```text
primary destination buildings must remain
at least comparable in scene importance to the Hero Ship
```

Do not interpret this as literal equal width or equal pixel area.

Judge:

- visible mass
- facade presence
- route importance
- silhouette hierarchy

Exact building dimensions remain a calibration decision.

---

# 13. Visual Bounds vs Collision Bounds

Always separate:

```text
VISUAL_BOUNDS
COLLISION_BOUNDS
```

Rules:

- PNG size does not define collision
- alpha bounds do not define collision
- roof overhang / mast / sail may exceed collision
- collision remains explicit world data
- visual resizing does not automatically resize collision

This is a locked production principle.

---

# 14. Anchor / Ground Contact

Every asset category must have a stable logical anchor.

## Ships

```text
anchor = hull / waterline reference
```

Masts and sails must not move the ship's logical berth position.

## Buildings

```text
anchor = ground footprint / functional base
```

Roof height must not shift the building's world coordinate.

## Props / Trees

```text
anchor = ground contact point
```

The manifest or integration layer should document category anchors where replacement assets need stable positioning.

---

# 15. Silhouette Priority

Production hierarchy:

```text
1. silhouette
2. large material blocks
3. medium structural features
4. micro-detail
```

If detail does not remain useful at actual runtime display size, it must not carry important identity.

Ship identity should come from:

- hull form
- bow/stern relationship
- mast count
- sail arrangement
- deck mass

Building identity should come from:

- facade mass
- roof form
- entrance
- major accent structures

not tiny ornamental texture.

---

# 16. Runtime Readability Test

Every candidate production asset must be reviewed at:

```text
actual intended runtime display size
```

Do not approve an asset only at source-image zoom.

Required check:

```text
Does the silhouette still read?
Do material blocks remain distinct?
Do key functional features remain visible?
Does micro-detail collapse into noise?
```

If detail disappears or muddies the silhouette:

```text
simplify before production lock
```

No fixed minimum pixel-detail number is locked yet.

That value may be added only after calibration evidence supports it.

---

# 17. Visual Hierarchy

Scene hierarchy:

```text
Tier 1
Hero Ship
Harbor Square
Primary destination buildings

Tier 2
Medium sailing vessels
Warehouse / major support structures
Major docks

Tier 3
Small working boats
Cargo structures
Trees
Signs

Tier 4
Crates
Barrels
Benches
Lamps
Minor decorative details
```

Lower-tier assets must not visually compete with higher-tier assets.

---

# 18. Material Language

Core material families:

```text
water
wood
stone
greenery
fabric / sail
metal accent
plaster / painted facade
glass / window accent
```

Each material family should have consistent:

- value range
- saturation range
- highlight behavior
- shadow behavior
- texture density

Exact numeric color constraints remain unlocked until calibration.

---

# 19. Palette Rule

`visualPalette.ts` remains the current project color-language reference.

Generated assets do not need pixel-perfect matching to code constants.

They must harmonize with:

- water blues
- dock woods
- structural dark woods
- stone neutrals
- warm facade colors
- greenery
- hull colors
- sail/canvas
- destination accents

Calibration should determine whether additional:

```text
VALUE HIERARCHY
SATURATION HIERARCHY
```

must be locked for production.

---

# 20. Lighting Schema

All calibration assets must share one lighting setup.

The calibration specification must keep constant:

```text
key-light direction
key-light elevation
key-light warmth
fill level
ambient level
shadow direction
shadow softness
contact-shadow strength
```

Do not change lighting while comparing camera elevation.

Final values remain unlocked until calibration review.

---

# 21. Lighting Implementation Principle

For the current PNG-based world:

```text
asset-level simplified baked shading
+
simple runtime/contact grounding where practical
```

is the preferred low-complexity direction.

Do not introduce a heavyweight dynamic-lighting system before evidence requires it.

---

# 22. Day / Night Future Compatibility

Day/night remains:

```text
DEFERRED
```

However asset production should avoid making it impossible later.

Separate conceptually:

```text
BASE MATERIAL IDENTITY
DAY PRESENTATION
NIGHT PRESENTATION
```

Do not make object recognition depend entirely on strongly baked sunlight color.

A future night mode may use:

- global tint / ambient change
- window-light variants
- lamp emphasis
- water highlight adjustment
- selective overlay assets

without regenerating the entire world.

---

# 23. Depth / Occlusion Grammar

Current runtime uses fixed depth by class and does not yet provide complete y-based ordering.

This can cause cases such as:

- a rear vessel drawing over Hero Ship sails
- the player drawing over a building roof when visually behind it

Therefore:

```text
DEPTH / OCCLUSION FIX = REQUIRED
TIMING = AFTER VISUAL GRAMMAR LOCK,
         BEFORE MASS ASSET ROLLOUT
```

Calibration itself should not be blocked by this runtime fix.

---

# 24. Minimum Future Depth Model

After grammar lock, introduce the smallest rule set necessary to support:

```text
ground/water
low environmental detail
walkable structures
object body
player / moving object relation
upper structure / roof / mast occlusion
foreground detail
labels / UI
```

Prefer:

```text
small explicit depth bands
+
y-aware ordering where spatially necessary
```

Do not build a generic 3D renderer.

---

# 25. Large Object Occlusion Rules

Production must define how tall/large illustrated assets interact.

Rules to lock after calibration:

- mast/sail may visually overlap distant structures only when depth is correct
- a roof may cover the player when the player is geometrically behind it
- a player must not always draw on top of every building
- background vessel sails must not incorrectly cover foreground hero assets
- destination labels must remain legible through a deliberate UI/depth policy

---

# 26. Harbor Composition Rule

Preferred harbor composition:

```text
1 Hero Ship
several Medium Sailing Vessels
Small Working Boats
2+ functional berthing points when justified
Warehouse / Cargo Support
Visible negative water space
```

The goal is:

```text
credible working harbor
```

not:

```text
one giant ship in empty water
```

and not:

```text
overcrowded marina
```

---

# 27. Berthing Slots and Future Variation

Do not implement random vessel placement yet.

Prepare for it by defining:

```text
BERTHING_SLOTS
```

A berthing slot should eventually describe:

```text
id
world position
allowed vessel role/size
allowed heading
clearance
dock/jetty relationship
visual priority
```

Future variety should preferably choose from:

```text
predefined valid harbor compositions
```

rather than unconstrained random positions.

This keeps composition quality and collision safety.

---

# 28. Resolution / Runtime Metrics

Every asset must record:

```text
source canvas dimensions
trimmed content bounds
display dimensions
display content bounds
file size
texture key
provenance
status
```

Optional after production pipeline matures:

```text
export scale
optimization method
```

---

# 29. Asset Weight Rule

Current production PNG evidence shows that source-quality generated PNGs can be much heavier than required at display size.

Therefore:

```text
visual approval first
optimization before broad rollout
```

But mass production cannot begin without a category budget.

During calibration:

- export at actual display size
- optionally compare a controlled 2x export
- remove unnecessary transparent padding
- optimize PNG encoding
- compare visible quality in runtime

After those measurements, lock per-category ceilings for:

```text
Hero asset
Major building
Medium vessel
Small prop
Total initial world texture budget
```

Do not invent arbitrary ceilings before this benchmark.

---

# 30. Alpha Edge Rule

Transparent assets must be checked for:

- matte fringe
- colored halo
- dirty hidden RGB
- inconsistent antialiasing
- excessive transparent padding

Transparent-object corners should be fully transparent.

Before production lock:

```text
trim transparent padding
clean hidden RGB where useful
validate runtime edge quality
```

---

# 31. Provenance

Allowed runtime provenance:

```text
generated-original
project-owned
user-created
licensed-third-party
```

Rejected:

```text
unknown
copied-from-web
unverified
```

Reference images may guide:

```text
proportion
camera feel
composition
visual hierarchy
```

but must not be directly copied.

---

# 32. Naming

Use stable lowercase kebab-case names.

Examples:

```text
hero-ship-d-v01.png
medium-sailing-ship-01-v01.png
exhibition-hall-v02.png
harbor-warehouse-v01.png
```

Do not include provider/model names in runtime filenames.

---

# 33. Calibration Set

Calibration should use the smallest set that exercises every major rule.

Required set:

```text
Hero Ship D
Medium Sailing Vessel
Exhibition Hall
Warehouse
Tree
Crate
Player Reference
Dock Segment
```

This set validates:

- large and medium ship perspective
- building perspective
- large support-building perspective
- organic asset treatment
- prop treatment
- human scale
- dock material/anchor behavior

---

# 34. Calibration Scene Strategy

Use:

```text
BOTH
```

### A. Controlled Calibration Scene

Purpose:

- isolate camera/perspective differences
- compare assets without harbor clutter
- keep lighting, scale and placement constant

### B. Existing Harbor Scene

Purpose:

- verify the chosen grammar survives real composition
- check scale, overlap, route readability and visual hierarchy

A grammar is not locked until it works in both contexts.

---

# 35. Controlled Angle Calibration

For each camera-elevation candidate:

```text
15°
22.5°
30°
```

keep all other variables fixed:

```text
same subject design
same object heading
same camera yaw
same display target
same visible-content scale target
same lighting direction
same light elevation
same shadow behavior
same palette/material family
same transparent padding rule
same anchor
same output quality
```

Change only:

```text
CAMERA_ELEVATION
```

This is required for a valid comparison.

---

# 36. Calibration Objects

At minimum, produce angle variants for:

```text
Hero Ship D
Exhibition Hall
Warehouse
```

The rest of the Calibration Set may initially use the selected provisional angle after these three establish the grammar.

Do not mass-produce three-angle variants for every prop.

---

# 37. Human Calibration Questions

For each angle compare:

```text
1. Is the Hero Ship deck visible enough?
2. Is the ship side still dominant?
3. Does Exhibition Hall still read as a destination?
4. Is roof visibility natural?
5. Does Warehouse share the same camera grammar?
6. Does the trio look like one world?
7. Is route/map readability preserved?
8. Do objects still feel substantial rather than flattened?
```

The human selects the final production elevation.

---

# 38. Production Prompt Contract

Every future generated asset prompt must include:

```text
PROJECT STYLE
PROJECTION GRAMMAR
CAMERA ELEVATION
CAMERA YAW
OBJECT HEADING / VISIBLE FACE
TARGET DISPLAY SIZE
VISIBLE-CONTENT TARGET
ANCHOR
LIGHT DIRECTION
LIGHT ELEVATION
SHADOW RULE
PALETTE / MATERIAL FAMILY
DETAIL BUDGET
TRANSPARENT BACKGROUND
TRANSPARENT PADDING RULE
ORIGINALITY / PROVENANCE REQUIREMENT
```

Template:

```text
Create an original Retro Harbor Campus world asset.

Projection grammar:
Hybrid orthographic 2.5D.
Ground is plan-view; this object is a camera-facing illustrated elevation.

Camera elevation:
[LOCKED_ANGLE] above horizontal.

Camera yaw:
0° canonical world view.

Object heading / primary visible face:
[LOCKED CATEGORY RULE]

Target runtime display:
[WIDTH × HEIGHT] world pixels.

Visible-content target:
[TRIMMED CONTENT TARGET].

Anchor:
[CATEGORY ANCHOR].

Lighting:
[LOCKED KEY LIGHT + SHADOW PROFILE].

Palette / material:
[PROJECT MATERIAL FAMILY].

Detail:
Prioritize silhouette and major material blocks.
Must remain readable at actual runtime display size.
Avoid micro-detail that collapses when reduced.

Background:
Transparent.
Minimize unnecessary transparent padding.
No colored matte fringe.

Perspective:
Must match all other Portfolio World production assets.

Originality:
Original design only.
Do not reproduce a recognizable commercial game asset.
```

---

# 39. Per-Asset QA Contract

Before any asset becomes production-approved, verify:

- canonical camera elevation
- yaw/visible-face rule
- target runtime display size
- visible-content bounds
- anchor
- scale category
- light direction
- shadow behavior
- palette/material consistency
- silhouette at runtime size
- detail density at runtime size
- alpha-edge cleanliness
- transparent padding
- provenance
- file weight
- BASE_URL-safe path
- collision independence
- depth/occlusion classification

---

# 40. Visual Grammar Lock Checklist

Before mass asset production, explicitly lock:

```text
HYBRID PROJECTION DESCRIPTION
CAMERA ELEVATION
CAMERA YAW
OBJECT-HEADING RULE
SHIP SURFACE GRAMMAR
BUILDING SURFACE GRAMMAR
32 PX LOGICAL UNIT SCALE SYSTEM
CATEGORY SCALE RECORDS
VISIBLE-CONTENT MEASUREMENT RULE
ANCHOR RULES
VISUAL/COLLISION SEPARATION
LIGHT DIRECTION / ELEVATION
SHADOW PROFILE
PALETTE / MATERIAL FAMILIES
RUNTIME READABILITY TEST
DEPTH BAND / OCCLUSION RULES
TRANSPARENT-PADDING RULE
ALPHA-EDGE POLICY
CATEGORY ASSET WEIGHT BUDGET
PROVENANCE / NAMING
BERTHING-SLOT PREPARATION
```

---

# 41. Current Open Decisions

Still not locked:

```text
final camera elevation
exact category scale ranges
final building enlargement
exact lighting values
exact shadow values
value/saturation limits
depth-band numeric values
category asset-weight ceilings
final harbor fleet count
final berth count
night palette
```

These are resolved through calibration and subsequent Director lock.

---

# 42. Next Phase

Next:

```text
Visual Grammar Calibration Pass
```

Sequence:

```text
1. Director Calibration Gate
2. Produce controlled 15° / 22.5° / 30° samples
3. Compare Hero Ship D + Exhibition Hall + Warehouse
4. Review in controlled scene
5. Review in actual harbor scene
6. Human selects camera elevation
7. Lock remaining production rules
8. Apply minimal depth/occlusion runtime fix
9. Begin large-scale asset production
```

---

# 43. Revised Gate

```text
VISUAL_GRAMMAR_V1 = REVISED_AFTER_PRE_REVIEW
READY_FOR_CALIBRATION_GATE = YES
MASS_ASSET_PRODUCTION = HOLD
```
