# Retro Harbor Campus — Visual Grammar Human Calibration
## Portfolio World

> Canonical repo path  
> `reports/portfolio-world/art-direction/retro-harbor-campus-visual-grammar-human-calibration.md`

---

## 0. Record Status

```text
RECORD_TYPE = HUMAN_CALIBRATION
CALIBRATION_STATUS = APPROVED
FINAL_CAMERA_ELEVATION = 15°
```

This document records the human visual decision made after the controlled Visual Grammar calibration pass.

The calibration compared:

```text
15°
22.5°
30°
```

using the shared Retro Harbor Campus visual grammar.

---

## 1. Calibration Context

The purpose of the calibration was not to choose the most dramatic individual asset.

The purpose was to identify the single camera elevation that makes the following feel as if they belong to the same visual world:

```text
Hero Ship D
Exhibition Hall
Warehouse
world/map composition
```

The comparison was performed after:

- Visual Grammar / Art Bible draft
- Claude pre-review
- revised Visual Grammar rules
- Calibration Director Gate
- Codex calibration implementation
- technical QA and production-safety validation

---

## 2. Human Decision

Human review result:

```text
15° is the most natural.
```

Compared with 22.5° and 30°, the 15° version gives the most coherent relationship between:

- ships
- buildings
- the plan-view world
- the overall harbor composition

The 15° elevation reduces the visual mismatch that had previously been felt between the ship assets and the building/world presentation.

---

## 3. Locked Camera Elevation

The following value is now human-approved:

```text
CAMERA_ELEVATION = 15° ABOVE HORIZONTAL
```

Project angle convention remains:

```text
0°  = horizontal eye-level
90° = vertical top-down
```

Therefore 15° means a relatively low elevated view.

This rule applies to future illustrated world assets unless a later formal Art Bible revision explicitly changes it.

---

## 4. Related Camera Rule

The existing calibration rule remains:

```text
CAMERA_YAW = 0°
```

Important distinction:

```text
CAMERA_YAW != OBJECT_HEADING
```

A ship may use an approved berth heading, but the asset itself must still obey the common camera grammar.

---

## 5. Ship Interpretation at 15°

For ships, the locked visual direction is:

```text
hull side = dominant
deck = visible but secondary
mast / sails = readable
bow / stern = distinguishable
```

Rejected:

```text
pure side profile
bird's-eye view
```

Hero Ship D remains the scale/design reference for the hero-vessel category.

---

## 6. Building Interpretation at 15°

For buildings:

```text
primary facade = dominant
roof = partially visible
side facade = optional
entrance / functional face = readable
```

The camera grammar must remain consistent across:

- Exhibition Hall
- Guild Hall
- Academy
- Workshop
- warehouses
- future support buildings

---

## 7. Human Approval Scope

This approval locks:

```text
camera elevation = 15°
```

It does **not** yet lock:

```text
final per-category scale ranges
exact building enlargement ratios
exact lighting numeric values
exact shadow numeric values
asset-weight ceilings
depth-band numeric levels
final harbor fleet count
final berth count
night palette
```

Those remain follow-up production decisions.

---

## 8. Production Consequence

From this point forward:

```text
future production assets
must use the 15° visual grammar
```

The project should no longer create unrelated per-asset camera angles.

The purpose is to reduce repeated visual rework and make ships, buildings, props, docks, vegetation, and support structures feel like one coherent world.

---

## 9. Mass Production Gate

Human camera calibration is complete, but mass production is not yet fully authorized.

Before broad asset rollout, the project must still complete:

```text
1. Visual Grammar v1.0 Lock record
2. minimal depth / occlusion runtime fix
3. category Scale Bible finalization
4. category asset-weight budget finalization
```

After these, the project may proceed to large-scale asset production.

---

## 10. Human Calibration Gate

```text
HUMAN_CALIBRATION = APPROVED
CAMERA_ELEVATION = 15°
CAMERA_YAW = 0°
VISUAL_GRAMMAR_LOCK = AUTHORIZED
MASS_ASSET_PRODUCTION = HOLD_PENDING_FINAL_PRODUCTION_RULES
```
