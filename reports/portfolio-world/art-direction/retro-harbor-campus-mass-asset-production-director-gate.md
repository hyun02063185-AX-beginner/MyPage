# Portfolio World — Mass Asset Production Director Gate
## Retro Harbor Campus

> Canonical repo path  
> `reports/portfolio-world/art-direction/retro-harbor-campus-mass-asset-production-gate.md`

---

## 0. Gate Status

```text
VISUAL_GRAMMAR_V1 = LOCKED
CAMERA_ELEVATION = 15°
CAMERA_YAW = 0°
DEPTH_OCCLUSION_V1_1 = VERIFIED
SCALE_BIBLE = LOCKED
ASSET_WEIGHT_BUDGET = LOCKED

MASS_ASSET_PRODUCTION_GATE = OPEN
BATCH_01 = AUTHORIZED
FULL_WORLD_ROLLOUT = NOT_YET_AUTHORIZED
```

This gate authorizes the **first controlled production batch** under the locked Retro Harbor Campus standards.

The purpose is to verify that the locked rules remain coherent when several new production assets are created together.

---

# 1. Canonical Production Sources

The implementation agent must treat these as canonical:

```text
reports/portfolio-world/art-direction/
retro-harbor-campus-visual-grammar-v1.0.md
retro-harbor-campus-visual-grammar-v1.0-lock.md
retro-harbor-campus-scale-bible-asset-weight-lock-v1.md
```

Also respect:

```text
reports/portfolio-world/depth-occlusion/
depth-occlusion-runtime-fix-v1-1-short-recheck.md
```

and:

```text
docs/portfolio-world/07_ASSET_POLICY.md
docs/portfolio-world/91_STATUS.md
docs/portfolio-world/92_HANDOFF.md
```

Do not restate or invent scale/weight values. Read them from the lock report.

---

# 2. Locked Visual Contract

Every Batch 01 asset must obey:

```text
PROJECTION = HYBRID_ORTHOGRAPHIC_2_5D
CAMERA_ELEVATION = 15° ABOVE HORIZONTAL
CAMERA_YAW = 0°
LOGICAL_UNIT = 32 px
SCALE_MEASUREMENT = VISIBLE / TRIMMED CONTENT BOUNDS
STANDARD_EXPORT = 1×
HIDDEN_RGB_CLEANUP = REQUIRED
```

Also preserve:

```text
visual bounds != collision bounds
category anchor rules
runtime readability at actual display size
semantic depth classification
BASE_URL-safe loading
known provenance
```

---

# 3. Batch 01 Scope

Create the first representative production batch:

```text
1. Guild Hall
2. Academy
3. Workshop
4. Harbor Warehouse
5. Medium Sailing Vessel
6. Tree / Greenery reference
7. Crate
8. Harbor Lamp
```

Use Exhibition Hall and Hero Ship D as existing visual references.

Do not regenerate Hero Ship D.

Do not redesign Exhibition Hall unless the locked Scale Bible explicitly requires a production normalization step.

---

# 4. Why These Eight

This batch intentionally covers:

```text
primary destination architecture
support architecture
medium vessel
organic environment
small prop
vertical prop
```

If these eight assets look coherent together, the project has enough evidence to authorize broader rollout.

---

# 5. Batch 01 Success Criteria

Batch 01 passes only if:

- all assets look like the same world
- all assets visibly follow the 15° grammar
- building facades and roof visibility are consistent
- the medium vessel uses the same deck/hull grammar as Hero Ship D
- category scale matches the locked Scale Bible
- 1× exports remain visually acceptable
- file sizes stay within locked category budgets
- hidden RGB is cleaned
- padding is controlled
- depth classification is correct
- collision/layout/IA remain unchanged
- no asset visually overpowers its hierarchy tier

---

# 6. Harbor Composition Constraint

Do not use Batch 01 to redesign the entire harbor.

Allowed:

- replace placeholder/programmatic visuals with production assets
- minor visual placement adjustment needed for anchor correctness
- existing support-building visual normalization

Not allowed without separate decision:

- major dock expansion
- harbor basin redesign
- final fleet count decision
- vessel randomization
- day/night
- route changes
- collision redesign

---

# 7. Full Rollout Hold

Even though Mass Asset Production Gate is open, only Batch 01 is authorized now.

After Batch 01:

```text
Independent Review
+
Human Whole-world Balance Review
```

must happen before authorizing the remaining asset batches.

---

# 8. Director Gate

```text
MASS_ASSET_PRODUCTION_GATE = PASS
AUTHORIZED_SCOPE = BATCH_01_ONLY
FULL_WORLD_ROLLOUT = HOLD
```
