# Portfolio World — Human Review PASS + Full Mass Asset Rollout Director Gate
## Retro Harbor Campus

> Official project record
>
> Recommended repo path:
>
> `reports/portfolio-world/art-direction/retro-harbor-campus-full-mass-asset-rollout-gate.md`

---

# 0. Director Decision

Human review result:

```text
MAJOR_BUILDING_DOOR_CANONICALIZATION = PASS
HARBOR_LAYOUT_NATURALIZATION = PASS
ADDITIONAL_CORRECTION_REQUIRED = NO
```

The human reviewer explicitly confirmed:

```text
전반적으로 다 좋아졌어. 보정할 거 없어.
```

Therefore the correction loop is closed.

---

# 1. Locked Foundation

The following are now accepted production foundations:

```text
VISUAL_GRAMMAR_V1 = LOCKED
CAMERA_ELEVATION = 15°
CAMERA_YAW = 0°

DEPTH_OCCLUSION_V1_1 = VERIFIED

SCALE_BIBLE = LOCKED
ASSET_WEIGHT_BUDGET = LOCKED

STANDARD_EXPORT = 1×
HIDDEN_RGB_CLEANUP = REQUIRED

SAME_CLASS_SCALE_CONSISTENCY = REQUIRED

CANONICAL_MAJOR_BUILDING_DOOR
= Guild Hall visible entrance

LAYOUT_DIRECTION
= natural harbor-campus settlement
```

---

# 2. Human-scale Building Rule

Primary buildings may differ substantially in absolute size.

```text
BUILDING_EQUAL_SIZE = NOT REQUIRED
```

Required:

```text
same-world human scale
```

The major-building reference chain remains:

```text
PLAYER
→ GUILD HALL DOOR
→ FLOOR / FACADE / BUILDING MASS
```

Current accepted major-building door openings:

```text
Guild Hall      42×52 px
Academy         42×52 px
Workshop        42×50 px
Exhibition Hall 42×52 px
```

Future destination buildings must inherit this human-scale family.

---

# 3. Layout Rule

The world must not regress to:

```text
perfect cardinal symmetry
equal setbacks
equal lot sizes
equal building sizes
rigid road-side alignment
```

Preserve:

```text
clear wayfinding
Harbor Square orientation role
destination readability
walkable corridors
```

Prefer:

```text
role-based building setbacks
small lateral offsets
asymmetric forecourts
zone-specific prop density
natural visual edges
harbor work-yard character
```

Naturalization is purposeful, not random.

---

# 4. Ship Rule

The accepted current hierarchy remains:

```text
Hero Ship D
>
Medium Sailing Vessel
>
Small Working Boats
```

Current 15° audit:

```text
Hero D  = PASS_WITH_MINOR
Brig    = PASS_WITH_MINOR
Cutter  = PASS_WITH_MINOR
Medium  = PASS_15_DEG
```

No broad fleet correction is required before rollout.

Do not arbitrarily resize or rotate ships.

---

# 5. Full Rollout Authorization

Director decision:

```text
FULL_MASS_ASSET_ROLLOUT = AUTHORIZED
```

However, execution remains controlled by production batches.

Authorization means:

- the visual rules no longer need to be re-researched for every asset
- new production assets may now be created from the locked contract
- production should proceed category-by-category
- each batch still receives QA and integrated world review

It does **not** mean:

```text
generate everything in one uncontrolled pass
```

---

# 6. Rollout Sequence

Recommended rollout sequence:

```text
Batch 02
= Harbor Support Architecture + Streetscape

Batch 03
= Fleet + Dockside Activity Expansion

Batch 04
= Whole-world Environment Completion + Final Balance
```

---

# 7. Batch 02 Authorization

Batch 02 is authorized immediately.

Primary objective:

```text
make the harbor campus feel inhabited and functionally credible
without losing visual hierarchy or navigation clarity
```

Focus:

```text
support buildings
work yards
cargo / storage
street furniture
greenery variants
harbor edge details
wayfinding/support signage
paving / forecourt micro-variation
```

Do not redesign the four accepted primary destination buildings.

---

# 8. Still Deferred

The following remain deferred unless separately authorized:

```text
day/night runtime system
random vessel placement
dynamic berth assignment
multiplayer
chat/voice
auth
database
realtime LLM NPC
major collision architecture rewrite
major world-size change
```

---

# 9. Production Gate

```text
HUMAN_CORRECTION_LOOP = CLOSED
FULL_MASS_ASSET_ROLLOUT = OPEN
NEXT_BATCH = BATCH_02_HARBOR_SUPPORT_STREETSCAPE
```
