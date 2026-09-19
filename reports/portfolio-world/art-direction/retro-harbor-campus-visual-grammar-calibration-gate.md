# Portfolio World — Visual Grammar Calibration Director Gate
## Retro Harbor Campus Art Bible v1.0

> Recommended repo path  
> `reports/portfolio-world/art-direction/retro-harbor-campus-visual-grammar-calibration-gate.md`

---

## 1. Inputs

Reviewed:

```text
Retro Harbor Campus Visual Grammar / Art Bible v1.0 draft
Claude Visual Grammar pre-review
current Portfolio World runtime
current Art Asset Phase 01 records
```

Claude gate:

```text
READY_WITH_FIXES
```

Claude final recommendation:

```text
ART_BIBLE_FIX_REQUIRED
```

Director decision:

```text
VISUAL_GRAMMAR_CALIBRATION_GATE = PASS_WITH_REQUIRED_FIXES
CALIBRATION_AUTHORIZED_AFTER_RECORD_RECONCILIATION
```

There is no fundamental conflict requiring Art Bible redesign.

---

## 2. Canonical Projection Correction

The old description:

```text
orthographic / dimetric-style
```

is replaced by:

```text
HYBRID ORTHOGRAPHIC 2.5D WORLD
```

Canonical meaning:

```text
ground / water / paths
= plan-view geometry

buildings / ships / props
= camera-facing illustrated elevations
  with controlled top-surface visibility
```

Do not treat future assets as generic isometric sprites.

---

## 3. Camera / Yaw Decision

Use:

```text
CAMERA_YAW = 0°
```

for the canonical world view.

Remove the old requirement:

```text
one side facade must always be visible
```

Buildings may be frontal/camera-facing.

Important:

```text
CAMERA_YAW != OBJECT_HEADING
```

Ships may have valid berth headings, but asset perspective must remain consistent.

---

## 4. Camera Elevation Calibration

Retain the current three candidates:

```text
15°
22.5°
30°
```

for the next controlled comparison.

Angle definition:

```text
degrees above the horizontal horizon
```

Do not change yaw, lighting, scale target, object heading, palette, or design while comparing elevation.

---

## 5. Scale System Decision

Replace:

```text
PLAYER = 1.0
```

as the master scale.

Canonical master:

```text
LOGICAL_UNIT = 32 px
```

Scale comparison must use:

```text
visible / trimmed content bounds
```

rather than padded PNG canvas size.

Exact per-category ranges remain a calibration output.

---

## 6. Depth / Occlusion Finding

Claude identified a real runtime limitation:

```text
fixed class-depth ordering
no complete y-sort
```

Observed risks include:

- rear vessels drawing over Hero Ship sails
- player drawing over Exhibition Hall roof

Director decision:

```text
DO NOT BLOCK CAMERA CALIBRATION
```

but:

```text
DEPTH/OCCLUSION FIX REQUIRED
AFTER GRAMMAR LOCK
BEFORE MASS ASSET ROLLOUT
```

Do not expand calibration scope into a renderer rewrite.

---

## 7. Asset Weight Finding

Current production PNG evidence shows large savings are possible by:

- cleaning hidden RGB
- trimming padding
- exporting closer to runtime display size

Director decision:

```text
CATEGORY WEIGHT BUDGET = NOT YET LOCKED
```

During calibration:

- benchmark display-size exports
- optionally benchmark controlled 2x exports
- compare quality in runtime
- record bytes
- lock per-category ceilings afterward

Do not invent arbitrary budgets.

---

## 8. Required Calibration Objects

Controlled angle variants are required only for:

```text
Hero Ship D
Exhibition Hall
Warehouse
```

These three cover:

- ship grammar
- destination-building grammar
- support-building grammar

Do not create three-angle versions of all props.

---

## 9. Calibration Set after Angle Selection

After a provisional camera elevation is chosen, validate the broader set:

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

This is the production-grammar calibration set.

---

## 10. Calibration Scene Strategy

Use:

```text
CONTROLLED TEST SCENE
+
ACTUAL HARBOR SCENE
```

### Controlled scene

Used to compare camera grammar without composition noise.

### Actual harbor

Used to verify:

- building/ship ratio
- scene hierarchy
- route readability
- harbor composition
- overlap behavior

The grammar is not locked until both contexts are acceptable.

---

## 11. Controlled Generation Contract

For 15° / 22.5° / 30° samples, keep fixed:

```text
subject design
object heading
camera yaw
visible-content scale target
display target
lighting direction
lighting elevation
shadow behavior
palette
material
anchor
transparent-padding rule
export quality
```

Change only:

```text
CAMERA_ELEVATION
```

If the generation tool cannot reliably hold the other variables constant, record the limitation before treating the comparison as valid.

---

## 12. Hero Ship Calibration Requirement

Hero Ship D currently has acceptable overall scale.

The calibration task is **not** to redesign its size again.

Evaluate:

- deck visibility
- hull dominance
- mast/sail readability
- compatibility with building view

Do not substantially change hero scale during angle comparison.

---

## 13. Building Calibration Requirement

For Exhibition Hall and Warehouse evaluate:

- primary facade dominance
- roof visibility
- grounding
- consistency with ship camera grammar

Do not require a side facade.

Building enlargement remains a separate scale decision after camera lock.

---

## 14. Future Random Vessel Placement

Do not implement randomization now.

Prepare the data model concept:

```text
BERTHING_SLOTS
```

Later, vessel variation may select among valid predefined slot/heading combinations.

This preserves composition and collision quality.

---

## 15. Production Art Hold

Until human calibration completes:

```text
MASS ASSET PRODUCTION = HOLD
```

Allowed:

- calibration assets
- temporary comparison integration
- calibration documentation
- asset optimization experiments

Not allowed:

- remaining destination-building production
- large prop batch
- full harbor warehouse district
- day/night implementation
- random vessel runtime system

---

## 16. Human Calibration Gate

The user must compare:

```text
15°
22.5°
30°
```

and decide which produces the most coherent relationship between:

```text
Hero Ship D
Exhibition Hall
Warehouse
world/map view
```

The user may also choose an intermediate angle if the three samples reveal that need.

Do not select the final angle automatically.

---

## 17. Canonical Record Reconciliation — Required Before Calibration Commit

Current working tree reportedly contains official project records that remain untracked.

These are **not execution-only artifacts** and must be reconciled.

Reported untracked official records include:

```text
Visual Pass 5 human-feel-test record
Art Asset Phase records 00
Art Asset Phase record 01
Art Asset Phase record 03
Art Asset Phase record 06
current Visual Grammar / Art Bible draft
```

The exact filenames must be verified with:

```bash
git status --short
```

Rules:

- inspect each file before staging
- stage official project records explicitly
- do not stage execution-only instruction files
- do not use `git add .`
- do not delete an official record simply because it was previously missed

---

## 18. Art Bible Canonical Path Reconciliation

The draft was reportedly created under:

```text
reports/art-direction/
```

while the Portfolio World documentation convention is:

```text
reports/portfolio-world/art-direction/
```

Director decision:

```text
CANONICAL_PATH =
reports/portfolio-world/art-direction/
```

Before committing the revised Bible:

1. inspect the existing untracked draft
2. preserve its content/history
3. place the revised canonical file at:

```text
reports/portfolio-world/art-direction/
retro-harbor-campus-visual-grammar-v1.0.md
```

4. remove the old untracked duplicate only after verifying the canonical copy
5. never overwrite an unrelated tracked file

---

## 19. Required Calibration Report Sequence

Recommended records:

```text
retro-harbor-campus-visual-grammar-v1.0.md
retro-harbor-campus-visual-grammar-v1.0-pre-review.md
retro-harbor-campus-visual-grammar-calibration-gate.md
retro-harbor-campus-visual-grammar-calibration-implementation.md
retro-harbor-campus-visual-grammar-human-calibration.md
retro-harbor-campus-visual-grammar-v1.0-lock.md
```

Do not rewrite historical pre-review after calibration.

---

## 20. Required QA during Calibration

Verify:

- BASE_URL-safe asset loading
- no root-absolute `/assets/...`
- current layout/collision unchanged
- current destination IA unchanged
- current world dimensions unchanged
- calibration-only code does not leak as permanent production UI
- asset provenance known
- alpha edges clean enough for comparison
- actual runtime display-size comparison performed

---

## 21. Calibration Success Criteria

Calibration succeeds when:

```text
one camera elevation is human-approved
ship/building grammar feels coherent
scale measurement uses visible content
yaw/heading distinction is understood
lighting can be held constant
runtime readability is acceptable
calibration set appears to belong to one world
```

Then:

```text
VISUAL_GRAMMAR_V1_LOCK
```

may be created.

---

## 22. Post-lock Required Work

Before mass rollout:

```text
1. minimal depth/occlusion runtime fix
2. category asset-weight budget lock
3. category scale record lock
4. production prompt contract lock
5. final per-asset QA checklist lock
```

Then large-scale asset production may begin.

---

## 23. Director Gate

```text
VISUAL_GRAMMAR_CALIBRATION_GATE = PASS_WITH_REQUIRED_FIXES
ART_BIBLE_REVISION = REQUIRED
CANONICAL_RECORD_RECONCILIATION = REQUIRED
CALIBRATION = AUTHORIZED_AFTER_RECONCILIATION
MASS_ASSET_PRODUCTION = HOLD
```

Next implementation step:

```text
Codex / asset-generation calibration pass
for Hero Ship D + Exhibition Hall + Warehouse
at 15° / 22.5° / 30°
```
