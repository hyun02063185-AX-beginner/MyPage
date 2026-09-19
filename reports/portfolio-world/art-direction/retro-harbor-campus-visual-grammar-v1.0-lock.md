# Retro Harbor Campus — Visual Grammar / Art Bible v1.0 Lock
## Portfolio World

> Canonical repo path  
> `reports/portfolio-world/art-direction/retro-harbor-campus-visual-grammar-v1.0-lock.md`

---

## 0. Lock Status

```text
VISUAL_GRAMMAR_VERSION = 1.0
LOCK_STATUS = LOCKED_WITH_FOLLOW_UP_PRODUCTION_RULES
HUMAN_CAMERA_CALIBRATION = COMPLETE
CAMERA_ELEVATION = 15°
MASS_ASSET_PRODUCTION = HOLD
```

This document locks the core visual grammar for Portfolio World — Retro Harbor Campus.

It is based on:

```text
Visual Grammar / Art Bible v1.0
Claude Visual Grammar pre-review
Calibration Director Gate
Calibration implementation
Human calibration
```

The purpose of this lock is to prevent future asset-by-asset perspective drift.

---

# 1. Canonical World Projection

Locked:

```text
PROJECTION = HYBRID ORTHOGRAPHIC 2.5D WORLD
```

Canonical interpretation:

```text
GROUND / WATER / PATHS
= orthographic plan-view geometry

BUILDINGS / SHIPS / PROPS
= camera-facing illustrated elevations
  with controlled top-surface visibility
```

The project must not describe future production assets only as generic:

```text
"isometric"
```

because that description is too ambiguous for this world.

---

# 2. Camera Elevation

Locked by human calibration:

```text
CAMERA_ELEVATION = 15° ABOVE HORIZONTAL
```

Angle convention:

```text
0°  = horizontal eye-level
90° = vertical top-down
```

All future production assets should use the same 15° visual elevation unless a future formally approved Visual Grammar version supersedes this rule.

---

# 3. Camera Yaw

Locked:

```text
CAMERA_YAW = 0°
```

The world remains axis-aligned.

Do not require a side facade for every building.

---

# 4. Camera Yaw vs Object Heading

Locked distinction:

```text
CAMERA_YAW != OBJECT_HEADING
```

Ships may occupy different berth headings.

However:

- camera grammar must remain the same
- deck visibility must remain compatible with 15°
- arbitrary rotation of a pre-rendered PNG is prohibited when it breaks perspective
- future variation should prefer approved heading-compatible assets and valid berthing slots

---

# 5. Ship Surface Grammar

Locked:

```text
hull side = dominant
deck = clearly visible but secondary
mast = vertical
sails = readable
bow / stern = distinguishable
```

Prohibited:

```text
pure side profile
bird's-eye ship rendering
asset-specific camera elevation
```

Hero Ship D remains the current hero-vessel visual reference.

---

# 6. Building Surface Grammar

Locked:

```text
primary facade = dominant
roof = partially visible
side facade = optional
entrance / functional face = readable
```

Apply consistently to:

- Exhibition Hall
- Guild Hall
- Academy
- Workshop
- warehouse/support buildings

Do not independently invent a new camera angle for each building.

---

# 7. Prop Surface Grammar

Locked principle:

```text
props inherit the same 15° camera and lighting grammar
```

Examples:

```text
crate
= top + primary face

barrel
= top ellipse + body

bench
= seat top + support body

lamp
= grounded base + vertical body

tree
= grounded trunk/canopy with compatible top exposure
```

Detailed category rules may be added only when needed.

---

# 8. Master Scale System

Locked:

```text
LOGICAL_UNIT = 32 px
```

The placeholder player is not the canonical master scale.

All future scale records should use:

```text
world display size
logical-unit size
visible-content bounds
```

---

# 9. Visible Content Measurement

Locked:

```text
SCALE_MEASUREMENT = VISIBLE / TRIMMED CONTENT BOUNDS
```

Do not compare object scale solely from raw PNG canvas dimensions.

Required asset measurements:

```text
source canvas width / height
trimmed content bounds
display width / height
display content bounds
logical-unit width / height
```

Transparent padding must not distort perceived scale decisions.

---

# 10. Scale Category Lock State

The scale system is locked.

Exact category ranges are **not yet locked**.

Still pending:

```text
Hero Ship range
Medium Vessel range
Small Boat range
Destination Building range
Warehouse range
Tree range
Prop range
Dock Segment range
```

These must be derived from runtime-approved reference assets rather than invented abstract ratios.

---

# 11. Building-to-Ship Rule

Locked principle:

```text
primary destination buildings must remain
at least comparable in scene importance
to the Hero Ship
```

This refers to visual hierarchy, not equal pixel dimensions.

Evaluate using:

- visible mass
- silhouette
- facade presence
- route importance
- scene hierarchy

Exact building enlargement remains a follow-up scale decision.

---

# 12. Visual / Collision Separation

Locked:

```text
VISUAL_BOUNDS != COLLISION_BOUNDS
```

Rules:

- PNG dimensions do not define collision
- alpha bounds do not define collision
- mast / sail / roof may extend beyond collision
- visual scale changes do not automatically change collision
- collision remains explicit world data

---

# 13. Anchor Rules

Locked category principles:

```text
Ships
= hull / waterline anchor

Buildings
= ground footprint / functional base

Props / Trees
= ground contact point
```

Upper structures must not shift logical world placement.

---

# 14. Silhouette Priority

Locked:

```text
1. silhouette
2. large material blocks
3. medium structural details
4. micro-detail
```

A production asset must remain recognizable at actual runtime size.

Identity must not depend on details that disappear after downscaling.

---

# 15. Runtime Readability Test

Locked:

Every production candidate must be reviewed at:

```text
actual intended runtime display size
```

Required questions:

```text
Does the silhouette read?
Are major materials distinct?
Are important functional features visible?
Does micro-detail collapse into noise?
```

An asset is not approved only because it looks good at source-image zoom.

---

# 16. Visual Hierarchy

Locked hierarchy:

```text
Tier 1
Hero Ship
Harbor Square
Primary destination buildings

Tier 2
Medium sailing vessels
Warehouse / major support buildings
Major docks

Tier 3
Small working boats
Cargo support
Trees
Signs

Tier 4
Crates
Barrels
Benches
Lamps
Minor decorative details
```

Lower tiers must not compete with higher tiers.

---

# 17. Material Language

Locked material families:

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

Each family must maintain coherent:

- value
- saturation
- highlight behavior
- shadow behavior
- texture density

Exact numeric material values remain open.

---

# 18. Palette

Locked principle:

```text
visualPalette.ts
= project color-language reference
```

Generated assets do not need pixel-identical colors, but they must harmonize with the established families.

Still pending:

```text
exact value hierarchy
exact saturation hierarchy
```

if later calibration/production QA shows they are necessary.

---

# 19. Lighting Schema

Locked requirement:

All production assets use one shared lighting grammar.

The following fields must be defined before broad asset rollout:

```text
key-light direction
key-light elevation
light warmth
fill level
ambient level
shadow direction
shadow softness
contact-shadow strength
```

The schema is locked.

The exact numeric/qualitative values are not yet locked.

---

# 20. Lighting Implementation Direction

Locked direction:

```text
simplified asset-level baked shading
+
simple runtime/contact grounding where practical
```

Do not introduce heavyweight dynamic lighting without a separate approved requirement.

---

# 21. Day / Night

Status:

```text
DAY_NIGHT = DEFERRED
```

Future-safe rule is locked:

```text
BASE MATERIAL IDENTITY
must remain separable from
DAY / NIGHT PRESENTATION
```

A future night mode may use:

- global tint
- ambient change
- windows/lamp variants
- water-highlight adjustment
- selective overlays

Do not build the night system during current art rollout.

---

# 22. Depth / Occlusion

Current runtime limitation is acknowledged:

```text
fixed class-depth ordering
without complete spatial/y-aware ordering
```

Known risks include:

- rear vessel drawing over foreground sails
- player drawing over roofs incorrectly

Required next runtime task:

```text
MINIMAL DEPTH / OCCLUSION FIX
```

Timing:

```text
AFTER VISUAL GRAMMAR LOCK
BEFORE MASS ASSET PRODUCTION
```

Do not turn this into a generic 3D renderer rewrite.

---

# 23. Future Depth Model

Required direction:

```text
small explicit depth bands
+
y-aware ordering where spatially necessary
```

Must support at least:

```text
ground / water
low environment
walkable structures
object body
player relation
upper roof / mast / sail
foreground
labels / UI
```

Exact numeric depth values remain open.

---

# 24. Harbor Composition

Locked principle:

```text
credible working harbor
```

Preferred composition:

```text
1 Hero Ship
several Medium Sailing Vessels
Small Working Boats
2+ functional berthing points when justified
Warehouse / Cargo Support
Visible negative water space
```

Do not interpret this as a permanently fixed vessel count.

---

# 25. Berthing Slots / Future Variation

Locked future-preparation rule:

```text
random free placement = not preferred
```

Future scene variation should use:

```text
predefined valid berthing slots
+
approved vessel role/heading combinations
```

A future berth record may include:

```text
id
world position
allowed vessel role
allowed heading
clearance
dock relationship
visual priority
```

Randomization itself remains deferred.

---

# 26. Asset Metrics

Locked required metadata:

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

This must become part of normal asset QA.

---

# 27. Asset Weight

Current evidence shows source-quality PNGs may be far heavier than needed at runtime.

Locked principle:

```text
visual approval first
optimization before broad rollout
```

Still pending:

```text
Hero asset ceiling
Major building ceiling
Medium vessel ceiling
Prop ceiling
Initial-world texture budget
```

These budgets must be based on calibrated display-size/2x tests.

---

# 28. Alpha / Transparent Padding

Locked:

Production PNGs must be checked for:

- matte fringe
- colored halo
- dirty hidden RGB
- excessive transparent padding
- inconsistent antialiasing

Required:

```text
trim unnecessary transparent padding
preserve anchor behavior
validate runtime edge quality
```

---

# 29. Provenance

Locked allowed provenance:

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

References may guide visual principles but must not be copied literally.

---

# 30. Naming

Locked naming direction:

```text
lowercase kebab-case
stable semantic filenames
```

Examples:

```text
hero-ship-d-v01.png
medium-sailing-ship-01-v01.png
exhibition-hall-v02.png
harbor-warehouse-v01.png
```

Do not encode provider/model names in runtime filenames.

---

# 31. Production Prompt Contract

Future asset-generation prompts must specify:

```text
PROJECT STYLE
PROJECTION GRAMMAR
CAMERA ELEVATION = 15°
CAMERA YAW = 0°
OBJECT HEADING / VISIBLE FACE
TARGET DISPLAY SIZE
VISIBLE-CONTENT TARGET
ANCHOR
LIGHTING
SHADOW
PALETTE / MATERIAL
DETAIL BUDGET
TRANSPARENT BACKGROUND
TRANSPARENT PADDING RULE
ORIGINALITY / PROVENANCE
```

This is now a locked production requirement.

---

# 32. Per-Asset QA

Every production asset must verify:

- 15° camera elevation
- yaw/heading rule
- runtime display size
- visible-content bounds
- scale category
- anchor
- lighting consistency
- shadow consistency
- palette/material consistency
- silhouette
- runtime detail readability
- alpha-edge quality
- transparent padding
- provenance
- file weight
- BASE_URL-safe path
- collision independence
- depth/occlusion classification

---

# 33. Locked vs Pending Summary

## Locked in v1.0

```text
Hybrid Orthographic 2.5D projection
15° camera elevation
0° camera yaw
camera-yaw vs object-heading distinction
ship surface grammar
building surface grammar
prop inheritance rule
32 px logical unit
visible-content measurement rule
visual/collision separation
anchor categories
silhouette priority
runtime readability test
visual hierarchy
material families
palette reference
lighting schema requirement
lighting implementation direction
day/night future-safe principle
depth/occlusion follow-up requirement
harbor composition principle
berthing-slot future strategy
asset metadata requirement
alpha/padding rule
provenance rule
naming rule
production prompt contract
per-asset QA contract
```

## Still Pending

```text
exact category scale ranges
exact destination-building enlargement
exact lighting values
exact shadow values
value/saturation limits if needed
numeric depth bands
category asset-weight ceilings
total texture budget
final fleet count
final berth count
night palette
```

---

# 34. Mass Asset Production Gate

Mass production remains:

```text
HOLD
```

Required before release:

```text
1. minimal depth / occlusion fix
2. category Scale Bible finalization
3. category asset-weight budget finalization
4. final production rule update if those introduce new constraints
```

After that:

```text
MASS_ASSET_PRODUCTION = AUTHORIZED
```

may be issued.

---

# 35. Next Work Sequence

```text
1. commit Human Calibration record
2. commit Visual Grammar v1.0 Lock record
3. implement minimal depth / occlusion fix
4. finalize category Scale Bible
5. finalize asset-weight budgets
6. authorize mass asset production
7. produce destination buildings / ships / warehouses / props consistently at 15°
```

---

# 36. Final Lock Gate

```text
VISUAL_GRAMMAR_V1 = LOCKED
CAMERA_ELEVATION = 15°
CAMERA_YAW = 0°
PROJECTION = HYBRID_ORTHOGRAPHIC_2_5D
MASS_ASSET_PRODUCTION = HOLD_PENDING_DEPTH_SCALE_WEIGHT
```
