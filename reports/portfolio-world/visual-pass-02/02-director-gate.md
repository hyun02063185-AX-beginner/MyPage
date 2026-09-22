# Portfolio World — Visual Pass 2 Director Gate

> Recommended repo path:
> `reports/portfolio-world/visual-pass-02/02-director-gate.md`

## 1. Inputs

Reviewed:

```text
Visual Pass 2 Director Plan
Claude Sonnet 5 Pre-review
Current Visual Pass 1 implementation
```

Claude pre-review result:

```text
READY_WITH_FIXES
DESIGN_FIX_REQUIRED
```

Director decision:

```text
PASS_WITH_REQUIRED_FIXES
DESIGN_READY_FOR_IMPLEMENTATION
```

No redesign is required.

---

## 2. Accepted Decisions

### Expansion

```text
ADD_RESERVED_LOT_METADATA
```

Add explicit reserved-lot metadata so future functional buildings can be added without decorative dressing consuming the space.

Recommended candidate quadrants:

```text
NW
NE
SW
SE
```

Use the actual current layout to select at least 3 practical parcels.

Reserved lots are internal layout metadata, not end-user labels.

---

### Streetscape Data

```text
CURRENT_LAYOUT_MODEL_SUFFICIENT
```

Do not create a new streetscape data layer.

Use the existing layout model with the smallest additional metadata needed for:

```text
reserved lots
route identity
streetscape placement
```

---

### Visual Architecture

```text
SPLIT_STREETSCAPE_HELPERS
```

Keep:

```text
harborVisualCatalog.ts
```

but prevent it from becoming an oversized monolith.

Introduce focused streetscape helpers only where current module growth justifies it.

Do not introduce:

```text
generic theme engine
route framework
Tiled
```

---

### Rendering

```text
PROGRAMMATIC_ONLY_STILL_SUFFICIENT
```

Continue with Phaser programmatic graphics for Visual Pass 2.

Do not add binary art assets yet.

---

### Asset Manifest

```text
MANIFEST_NOT_YET
```

No manifest is needed unless the first binary asset is actually introduced later.

---

### Quality Bar

```text
KEEP_WATERFRONT_QUALITY_BAR
```

Primary quality benchmark:

```text
Harbor Square
→ Exhibition Hall
→ Waterfront
```

This route should receive the strongest Pass 2 composition work first.

---

### Performance

```text
NO_SPECIAL_PERF_WORK
```

Measure after implementation; do not optimize prematurely.

---

### QA

```text
ADD_LAYOUT_CONSTRAINT_TESTS
```

This is a required implementation change.

---

## 3. Required Fix A — Reserved Lot Metadata

Add explicit layout metadata for future-use parcels.

Requirements:

- minimum 3 reserved lots
- preferably selected from NW / NE / SW / SE open quadrants
- must not block primary paths
- must not overlap primary buildings
- must remain compatible with current camera / collision flow
- should visually appear as natural open town space
- must remain low-collision
- must not be filled with permanent dense decoration

The implementation should use the smallest safe representation.

Example shape only:

```ts
type ReservedLot = {
  id: string
  x: number
  y: number
  width: number
  height: number
  zone: ...
}
```

Do not treat this example as a mandatory schema if the current types suggest a cleaner minimal representation.

---

## 4. Required Fix B — Spatial Overlap Constraints

Pass 2 increases scene density significantly.

Add layout constraint validation for at least:

```text
harbor visual vs primary path
harbor visual vs forecourt
harbor visual vs building footprint
reserved lot vs building
reserved lot vs primary path
reserved lot vs other reserved lots
world bounds
duplicate IDs
```

Not every decorative overlap is invalid.

The validator should distinguish intentional composition from blocked navigation.

At minimum, prevent permanent/structural objects from occupying protected navigation or expansion space.

---

## 5. Route Rhythm Adjustment

Claude noted:

```text
North/South routes are roughly half the length of West/East routes.
```

Do not re-space destinations.

Instead compress visual rhythm on North/South routes.

Use fewer clusters and shorter transitions.

Do not force equal prop counts per route.

Visual pacing should follow route length.

---

## 6. Status / Handoff Correction

Claude found stale project state:

```text
91_STATUS.md
92_HANDOFF.md
```

still describe already-completed independent review / human feel test as pending.

Correct those records during the implementation/documentation closeout.

Do not rewrite unrelated project history.

---

## 7. Visual Pass 1 Carry-over

### Detail density

```text
NATURALLY_RESOLVED_BY_PASS_2
```

Increase density intentionally through streetscape composition.

### Screenshot evidence gap

```text
FIX_IN_PASS_2
```

Pass 2 implementation evidence must include the quality-bar route and multi-destination comparison views.

### edge-south hidden decoration

```text
IGNORE
```

No dedicated fix required unless it interferes with Pass 2 composition.

---

## 8. Implementation Scope

Codex may implement:

```text
reserved lot metadata
layout constraint validation
route-specific streetscape composition
Harbor Square density refinement
Guild Journey Street
Academy Learning Walk
Workshop Maker Yard
Exhibition Waterfront Promenade
quality-bar route refinement
route-length-aware density rhythm
focused streetscape helper split
status / handoff correction
tests and evidence
```

---

## 9. Protected Non-Scope

Do not implement:

```text
new functional buildings
portal navigation
portfolio routing
interiors
NPCs
dialogue
quests
combat
audio
day/night
final player sprite
binary art asset production
generic theme engine
Tiled
multiplayer
auth
database
```

---

## 10. Director Gate

```text
VISUAL_PASS_2_DIRECTOR_GATE = PASS_WITH_REQUIRED_FIXES
```

Next:

```text
Codex Visual Pass 2 Implementation
```
