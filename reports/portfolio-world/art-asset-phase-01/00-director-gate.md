# Portfolio World — Art Asset Phase Director Gate
## Production Visual Asset Foundation

> Recommended repo path:
> `reports/portfolio-world/art-asset-phase-01/00-director-gate.md`

## 1. Phase Status

```text
ART_ASSET_PHASE_01 = READY_TO_START
```

Visual Pass 5 Human Visual Feel 결과:

```text
current layout accepted
current density accepted
empty-lot filling deferred
style direction approved
real design asset application approved
large hero ship should gain more visual presence
```

This phase begins the transition from programmatic mockup graphics to project-owned visual assets.

---

## 2. Core Objective

Apply real visual assets to the approved Retro Harbor Campus composition while preserving:

- current IA
- approved harbor layout
- navigation readability
- current collision logic
- world / UI boundary
- lightweight iteration capability

The objective is not to fill every empty area.

The objective is:

```text
turn the approved visual direction into a credible designed world
```

---

## 3. Locked Composition

Do not redesign:

- Harbor Square
- Guild Hall
- Academy
- Workshop
- Exhibition Hall
- inner harbor
- central dock / piers
- current small-boat fleet structure
- warehouse / cargo support area
- reserved lots

Do not reopen city layout merely because assets become more detailed.

Decision:

```text
KEEP_APPROVED_COMPOSITION
```

---

## 4. Empty Space Policy

Current open areas are acceptable.

Do not treat them as defects.

Additional:

- buildings
- props
- greenery
- signs
- decorative structures

may be added later after the main asset language is established.

Decision:

```text
EMPTY_LOT_FILLING_DEFERRED
```

---

## 5. Asset Priority

### Priority 1 — Large Hero Ship

The large ship is the first major asset.

It should establish:

- scale
- harbor identity
- silhouette language
- material style
- level of detail
- retro-art fidelity

The current mockup size is not final.

Target direction:

```text
larger visual presence than current mockup
```

Use prior reference images only for:

- ship-to-building proportion
- mast/sail dominance
- harbor-scene balance
- landmark presence

Do not copy any reference literally.

---

## 6. Hero Ship Scale Policy

Separate:

```text
visual scale
collision scale
```

The ship asset may extend visually beyond its gameplay footprint.

Allowed:

- taller mast
- larger sail
- longer bow / stern silhouette
- upper structure overlapping land-side visual space

Not allowed:

- blocking critical routes
- expanding collision solely to match artwork
- hiding primary destination buildings
- breaking water containment logic

Decision:

```text
HERO_SHIP_VISUAL_SCALE_CAN_EXCEED_COLLISION_SCALE
```

---

## 7. Priority 2 — Destination Buildings

Create coherent production-style assets for:

### Guild Hall
Theme:

```text
journey / registry / expedition
```

### Academy
Theme:

```text
learning / calm / refined
```

### Workshop
Theme:

```text
making / craft / practical
```

### Exhibition Hall
Theme:

```text
presentation / waterfront / scenic
```

They must share one world language while remaining distinguishable.

---

## 8. Priority 3 — Water / Dock

Improve the production feel of:

- inner harbor water
- shoreline
- dock
- piers
- waterfront promenade

The water should support the ship as a hero object.

Do not introduce heavy rendering architecture unless necessary.

---

## 9. Priority 4 — Secondary Assets

After primary assets are validated:

- small boats
- warehouse
- cargo shed
- crates / barrels / moorings
- lamps
- benches
- planters
- greenery
- signs

These remain supporting assets.

They should not dominate the world.

---

## 10. Asset Strategy Requirement

Before implementation, define the asset strategy.

The strategy must answer:

- raster vs vector vs generated pixel-style assets
- sprite dimensions / scale rules
- transparent background policy
- naming convention
- source folder
- runtime folder
- build-copy behavior
- asset manifest
- licensing / provenance record
- replacement / iteration process

Do not add assets ad hoc.

---

## 11. Recommended Asset Ownership Policy

Prefer:

```text
project-owned assets
```

Possible sources:

- newly generated original assets
- user-created assets
- internally produced pixel-art assets
- properly licensed third-party assets if explicitly approved

Avoid:

- copied game sprites
- unclear-license assets
- random web image downloads
- direct recreation of identifiable copyrighted game art

---

## 12. Asset Manifest

Introduce a simple manifest or equivalent record for production assets.

At minimum record:

- asset id
- filename
- role
- source / provenance
- license / usage status
- intended world location
- version / replacement note if needed

Do not overengineer this into a CMS.

---

## 13. Rendering Integration Principle

Asset integration should preserve current separation:

```text
world data
visual representation
collision geometry
```

Do not make collision depend on transparent sprite bounds.

Do not bake IA coordinates into image dimensions.

Prefer explicit placement data.

---

## 14. Scale System

Define a consistent visual scale system before many assets are produced.

Need to establish:

- building visual scale
- large ship scale
- small boat scale
- prop scale
- character scale
- tile / detail density

The current programmatic mockup is reference geometry, not mandatory art bounding boxes.

---

## 15. Large Ship Validation Gate

Before producing the entire world asset set, validate the hero ship first.

Recommended sequence:

```text
hero ship concept
→ one or more size variants
→ place in current harbor
→ compare against Exhibition Hall / waterfront
→ human visual review
→ lock approximate ship scale
```

Do not generate all assets before ship scale is validated.

---

## 16. First Asset Slice

Recommended first implementation slice:

```text
large ship
+ immediate water/dock context
+ one destination building
```

This is enough to determine:

- style fidelity
- scale
- sprite integration
- detail level
- contrast
- asset pipeline viability

Suggested destination:

```text
Exhibition Hall
```

because it shares the waterfront scene with the hero ship.

---

## 17. World / UI Boundary

Maintain:

```text
World = retro harbor visual environment
UI = modern portfolio interface
```

Asset work applies to the world.

Do not convert HTML UI into game-art UI.

---

## 18. Navigation / Accessibility Guard

New assets must not obscure:

- paths
- destination entrances
- labels / orientation cues
- exit route
- keyboard navigation
- coarse-pointer fallback

Important silhouettes should not depend on color alone.

---

## 19. Performance Guard

Before large-scale asset rollout, measure:

- image dimensions
- total asset weight
- texture count
- browser memory implications
- load time
- GitHub Pages behavior

Prefer modest asset dimensions appropriate to the actual render scale.

Avoid oversized source textures simply for visual sharpness.

---

## 20. Build / Git Policy

Keep:

```text
portfolio-world/ = source
world/ = committed build output
```

Do not convert root into a Node/Vite project.

No root `package.json`.

Continue feature-branch workflow.

No merge to `main` until Director release gate.

---

## 21. QA Requirements

Asset phase QA must preserve:

- all current structural tests
- collision tests
- pier walkability
- water collision
- vessel containment
- reserved lots
- route readability

Add asset-specific checks only where stable and useful.

Avoid brittle pixel-perfect tests.

---

## 22. Required Human Review

Human visual review is mandatory after the first asset slice.

Questions:

```text
1. Does the hero ship have enough presence?
2. Is the ship too large or still too small?
3. Does the ship-to-building proportion feel like the reference mood?
4. Does the real asset style match Retro Harbor Campus?
5. Does Exhibition Hall still read as a destination?
6. Does the scene still feel like a portfolio world rather than only game art?
```

---

## 23. Out of Scope

This phase does not automatically include:

- NPCs
- dialogue
- interiors
- portal functionality
- destination click flows
- audio
- day/night
- multiplayer
- auth/database
- Tiled migration
- final empty-lot filling
- full map asset completion in one pass

---

## 24. Recommended Workflow

```text
Director asset strategy
→ Claude asset/pipeline pre-review
→ Director gate
→ asset concept / generation
→ Codex integration
→ Claude independent review
→ human visual scale/style review
→ expand asset set
```

---

## 25. Director Gate

```text
ART_ASSET_PHASE_01_DIRECTOR_GATE = PASS
```

Next required task:

```text
define asset production/integration strategy
and validate the large hero ship first
```
