# Portfolio World — Asset & Runtime Implementation Plan

Status: **PLAN ONLY — production and runtime work have not started**

## Design contract and operating rule

The approved Canonical Target and Blueprint are the controlling contracts. R3G
is technical reference only; it may not constrain composition, geometry, player
scale, asset hierarchy, or camera design.

```text
DESIGN → ASSET → CALIBRATION → HUMAN GATE → RUNTIME → VISUAL QA
```

The forbidden alternative is incremental polish of the existing runtime. No
asset is generated, replaced, or integrated in this planning pass.

| Contract | Approved value |
| --- | --- |
| Design world | 1920 × 1080 |
| Gameplay viewport | 1280 × 720 |
| Levels | 2 — one continuous lower plane and Hall level, joined only by Main Stairs |
| Player visual | 28 × 56, fixed scale |
| Player body | 28 × 16 at visual-local `(0,40)` |
| Hero envelope | 595 × 685 |
| Hero visible mast → waterline | 592 px = 10.57× player visual height |

## Skills applied

- **environment-art:** requires the Hall and Hero Ship to remain the two
  primary reads, with Workshop secondary; protects silhouette readability,
  Mediterranean material cohesion, and calm protected-harbor water language.
- **create-game-assets:** provides staged candidates, a provenance-aware asset
  manifest, alpha/pivot normalization, and native-scale calibration before any
  engine integration.
- **portfolio-world-visual-qa:** defines the eventual actual-runtime evidence:
  opened captures, fixed crops, Visual Brief comparison, and clean console
  evidence. This plan grants no runtime Visual Pass.

## Production order

### Phase A — Canonical landmarks, then calibration

Produce Hall (2–3 candidates), Workshop (2–3), and Hero Ship (3 recommended)
as transparent source candidates. Each requires native-scale player comparison
and Target comparison. Hero Ship candidates additionally prove readable
waterline, gangway fit, and a separable transparent rigging foreground.

Do not begin runtime reconstruction after individual approvals alone. First
make one calibration sheet containing the selected Hall, Workshop, Hero Ship,
56 px player, Secondary Ship placeholder, and Small Boat placeholder. Human
review tests relative scale, light direction, palette, projection, detail
density, and landmark hierarchy.

### Phases B–E — support asset families

After landmark calibration, produce the Tier-2 Secondary Ship (275 × 255) and
Tier-3 Small Workboat (140 × 75); then the independent foundation families,
scenic layers, props, and foreground slices. Floor assets are surface families
and modular/quay pieces—not a single canvas-sized floor image. Scenic town,
cliffs, mountains, lighthouse, outer sea, and distant ships remain independent
non-playable layers, never a scene plate.

## Production board

| Asset | Target Size | Action | Generation | Human Gate | Runtime Phase |
| --- | --- | --- | --- | --- | --- |
| Exhibition Hall | 605×320; door 75×106 | GENERATE_NEW | 2–3 transparent candidates + normalize | A, B | R2 |
| Workshop | 505×280; awning 245×110 | GENERATE_NEW | 2–3 transparent candidates + normalize | A, B | R2 |
| Hero Ship | 595×685 envelope; 592 visible; hull 565×285 | GENERATE_NEW | 3 candidates; waterline/rigging slices | A, B | R2 |
| Secondary Ship | 275×255 | GENERATE_NEW | Tier-2 after scale lock | C | R2 |
| Small Workboat | 140×75 | GENERATE_NEW | Tier-3 after fleet lock | C | R2 |
| Hall Plaza | 625×330 bbox polygon | GENERATE_NEW | fine-paving family | C | R3 |
| Lower Plaza | 530×420 bbox polygon | GENERATE_NEW | fine-paving family | C | R3 |
| Central Quay | 395×240 bbox polygon | GENERATE_NEW | stone/wood quay modules | C | R3 |
| Hero Quay | 575×380 bbox polygon | GENERATE_NEW | berth/quay modules | C | R3 |
| Main Stairs | 230×265 bbox connector | GENERATE_NEW | shallow riser/landing family | C | R3 |
| Water | explicit exclusion zones | PROCEDURAL_RUNTIME | calm contact/material layers | C | R3 |
| Scenic Background | independent scenic boundary layers | GENERATE_NEW | town/cliff/mountain/lighthouse/sea | C | R5 |
| Props | native-scale family | REPAIR or REGENERATE | repair existing small props; new banners/rails/tools | C | R4 |
| Foreground | transparent pivoted slices | GENERATE_NEW | vegetation/ropes/rigging slices | C | R4 |

## Image/API strategy

No model is locked before a recorded capability probe and candidate comparison.
Use built-in image generation with transparency as the preferred route for
transparent landmark/ship candidates; normalize edges, alpha, bounds, and
pivots deterministically afterwards. Where available and appropriate,
gpt-image-2, Gemini 2.5 Flash Image, or Codyssey Public API may provide
alternative source candidates—but only if their availability and provenance can
be recorded. Select on native-scale Target parity, never model reputation.

Use small coherent batches for props. Simple gangway, rail, rope, and water
components may be hand-authored/procedural if that produces a cleaner
implementation asset. Scenic work is large-format but split by depth family;
the full Canonical Target cannot be used as a plate.

## Acceptance, retry, and rollback

Every source asset must match the Target's projection, scale, light direction,
material read, and hierarchy; have adequate resolution, clean alpha, required
visual bounds, documented ground/waterline pivot, and no text/background/UI
artifacts. Foreground-capable assets must prove their slice feasibility.

An existing asset is **KEEP** only if it passes every criterion at target scale.
Use **REPAIR** only for one localized defect that leaves silhouette, projection,
and source quality intact. Use **REGENERATE** for a family-level failure or
after two failed repairs. Repeating a failure switches model, prompt, reference
treatment, or method—never endless patching.

Version every candidate. Never overwrite a Human-approved source. A failed
runtime phase reverts to the last approved phase checkpoint and requires a
Drift Report that shows the Canonical/runtime comparison, violated metric,
cause, rejected workaround, and proposed correction.

## Human gates and runtime start condition

| Gate | Human decision |
| --- | --- |
| A | Select Hall, Workshop, and Hero Ship candidates |
| B | Approve combined landmark calibration sheet |
| C | Approve foundation, fleet, scenic, props, and foreground direction |
| D | Approve new Blueprint-derived runtime geometry |
| E | Approve Canonical Target versus runtime comparison per phase |

`RUNTIME_REBUILD = BLOCKED` until Hall, Workshop, Hero Ship, landmark
calibration, fleet direction, and foundation plan all have Human approval.

After that condition, Runtime 1 creates a new Blueprint-derived 1920 × 1080
geometry skeleton (two levels, P1–P7, polygons, one explicit stair connector,
water exclusions). Runtime 2 adds fleet/landmarks, Runtime 3 foundation and
water, Runtime 4 props/depth/occlusion, and Runtime 5 scenic background. The
existing R3G geometry is not reused.

## Canonical comparison and drift stop

At every runtime phase, capture actual 1280 × 720 evidence at the approved
overview (960,540 @ .667) and gameplay P1/P5/P7 framings (1.0 zoom). Open the
Canonical and capture, create fixed-coordinate crops/contact sheets, and judge
Hall, Workshop, Hero Ship, player, water/plaza ratio, fleet density, positions,
lighting, and environmental density. Console/exception evidence is required.

Stop rather than polish if Hall becomes smaller, the Hero ratio changes, water
shrinks, camera returns to top-down, the player leaves 28×56 fixed scale,
supporting fleet disappears, existing geometry changes the Target, or a scene
plate/pixel collision returns. Write a Drift Report and wait for direction.

## Gate

```text
CANONICAL_FINAL_VISUAL_TARGET = APPROVED
IMPLEMENTATION_BLUEPRINT = APPROVED
ASSET_RUNTIME_IMPLEMENTATION_PLAN = COMPLETE

ASSET_PRODUCTION = NOT_STARTED
RUNTIME_REBUILD = NOT_STARTED

NEXT = CANONICAL_LANDMARK_ASSET_PRODUCTION
GATE = READY_FOR_LANDMARK_ASSET_PRODUCTION
```
