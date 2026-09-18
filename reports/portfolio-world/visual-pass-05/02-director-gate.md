# Portfolio World — Visual Pass 5 Director Gate
## Art Style Application

> Recommended repo path:
> `reports/portfolio-world/visual-pass-05/02-director-gate.md`

## 1. Inputs

Reviewed:

```text
Visual Pass 5 Director Plan
Claude Code Visual Pass 5 Pre-review
Current Visual Pass 4 runtime
```

Claude pre-review result:

```text
DESIGN_READY_FOR_DIRECTOR_GATE
```

Director decision:

```text
VISUAL_PASS_5_DIRECTOR_GATE = PASS_WITH_REQUIRED_FIXES
DESIGN_READY_FOR_IMPLEMENTATION
```

No layout redesign is required.

---

## 2. Locked Direction

Visual Pass 5 remains:

```text
KEEP_APPROVED_LAYOUT
KEEP_APPROVED_HARBOR_IDENTITY
APPLY_STYLE_WITH_PROGRAMMATIC_RENDERING
AVOID_FINAL_ASSET_PIPELINE_FOR_NOW
```

The approved Visual Pass 4 harbor composition must remain intact.

Do not reopen:

- Harbor Square location
- Guild / Academy / Workshop / Exhibition IA
- inner harbor
- dock / peninsula geometry
- large ship placement concept
- small-boat fleet concept
- reserved lots

Only style-level refinement and narrowly scoped defect correction are allowed.

---

## 3. Required Fix — VP5R-01
### Dock mooring-post geometry

Claude found a real implementation defect:

```text
drawDock()
```

uses mooring-post offsets hardcoded for the 448px main dock.

When reused for the two 160px piers:

```text
two posts + rope can render floating over open water
```

This defect must be fixed before applying stronger dock styling.

### Director requirement

Refactor `drawDock()` so decorative elements derive from the actual dock rectangle dimensions.

Preferred behavior:

```text
main dock:
full post / rope treatment

short pier:
reduced post count
scaled / width-aware offsets
no decorative geometry outside the pier footprint
```

Do not create separate unrelated dock renderers unless necessary.

Add focused geometry validation or unit coverage if practical.

---

## 4. Required Fix — VP5R-02
### Shared palette

Claude confirmed duplicated harbor color values across:

```text
harborVisualCatalog.ts
streetscapeVisuals.ts
```

with approximately 9 overlapping palette keys.

Before Pass 5 changes more colors, create a minimal shared style module.

Approved direction:

```text
ADD_MINIMAL_STYLE_CONSTANTS
```

Recommended file:

```text
portfolio-world/src/world/visualPalette.ts
```

or an equivalently narrow module name.

This is **not** a theme engine.

It should contain only shared visual constants needed by the current retro harbor style.

Potential groups:

- water
- water highlight / depth cue
- stone
- plaza stone
- dock wood
- dark wood
- wall
- roof
- greenery
- ship hull
- sail
- rope
- Guild accent
- Academy accent
- Workshop accent
- Exhibition accent

Avoid premature token systems, skin switching, or generic theming abstractions.

---

## 5. Required Process Reconciliation — VP5R-03

The canonical project record is inconsistent.

Current issue:

```text
visual-pass-04/07-human-visual-feel-test.md
```

is still an unfilled template, while the user has already provided the actual human verdict:

```text
The result is clearly better.
It feels more like a harbor.
Because it is still a mockup, further judgment should happen after design is applied.
```

Also:

```text
docs/portfolio-world/91_STATUS.md
docs/portfolio-world/92_HANDOFF.md
```

still contain stale `PENDING` state.

### Director requirement

Reconcile the canonical record during Visual Pass 5 implementation closeout.

Update:

```text
reports/portfolio-world/visual-pass-04/07-human-visual-feel-test.md
```

so it records the actual user verdict rather than leaving the template blank.

The result should communicate:

```text
VISUAL_PASS_4_APPROVED_WITH_NOTES

- harbor identity clearly improved
- harbor direction approved
- current stage remains a mockup
- further visual judgment should happen after style/design application
```

Do not invent new user feedback.

Then refresh:

```text
docs/portfolio-world/91_STATUS.md
docs/portfolio-world/92_HANDOFF.md
```

to reflect the true state.

---

## 6. Palette Decision

Director decision:

```text
ADD_MINIMAL_STYLE_CONSTANTS
```

Do not build a theme engine.

The palette should improve consistency while keeping the current code easy to iterate.

---

## 7. Rendering Decision

Director decision:

```text
PROGRAMMATIC_ONLY_FOR_PASS_5
```

No final binary art pack yet.

No PNG / SVG / downloaded sprite pack should be required for this pass.

The goal is to prove the visual language before entering a dedicated asset-quality phase.

---

## 8. Architecture Decision

Director decision:

```text
CURRENT_VISUAL_ARCHITECTURE_SUFFICIENT
+ ADD_MINIMAL_STYLE_CONSTANTS
```

Keep:

```text
worldLayout.ts
harborVisualCatalog.ts
streetscapeVisuals.ts
WorldScene.ts
waterCollisionGeometry.mjs
```

No rendering framework rewrite.

---

## 9. Water Style

Director decision:

```text
PROGRAMMATIC_WATER_STYLE_SUFFICIENT
```

Visual Pass 5 should materially improve water appearance using programmatic rendering.

Target:

- stronger inner-harbor readability
- clearer water/land separation
- subtle depth / surface cues
- controlled wave-line rhythm
- visually richer basin without noise

Do not add shaders.

Do not add expensive animated water.

---

## 10. Dock / Pier Style

After fixing VP5R-01, improve:

- plank segmentation
- edge beams
- mooring posts
- restrained rope cues
- stone-to-wood transition

Walkability must remain visually obvious.

Do not style beyond collision geometry in a way that implies false walkable space.

---

## 11. Large Ship

Director decision:

```text
LARGE_SHIP_HELPER_REFINEMENT_REQUIRED
```

The ship is the primary harbor focal point.

Improve programmatically:

- hull silhouette
- bow/stern distinction
- mast hierarchy
- sail silhouette
- deck layering
- trim
- rope / rigging hints
- outline / shadow cues

The objective is:

```text
designed landmark
```

not:

```text
final production sprite
```

Do not change its role in the composition.

---

## 12. Small Boats

Keep the current fleet.

Improve visual consistency and variation without introducing an unnecessary vessel framework.

Possible refinements:

- hull proportions
- sail/no-sail cues
- trim
- cargo hint
- orientation only if already compatible with current data

Do not add more boats unless a clear visual need appears.

---

## 13. Harbor Square

Improve its visual identity while preserving openness.

Focus on:

- paving language
- compass / armillary clarity
- edge framing
- restrained lamps / planters
- arrival/orientation feeling

Do not fill the square with decorative clutter.

---

## 14. Destination Building Identities

Keep a coherent shared world style, but reinforce each destination.

### Guild Hall

```text
journey / registry / expedition
```

Use:
- darker travel-oriented accent
- map / banner / registry cues
- practical respectable facade

### Academy

```text
learning / calm / refined
```

Use:
- lighter / calmer palette
- restrained academic trim
- garden / greenery support

### Workshop

```text
making / craft / practical
```

Use:
- timber / tool / material cues
- stronger utilitarian visual language
- active but organized composition

### Exhibition Hall

```text
presentation / waterfront / scenic
```

Use:
- cleaner facade
- waterfront-compatible trim
- refined promenade relationship

Do not make them look like four unrelated games.

---

## 15. Support Structures

Warehouse / cargo shed remain secondary.

Refine:

- heavier harbor materials
- cargo-side visual grouping
- restrained prop clustering

They must not compete with the primary destinations.

---

## 16. Greenery / Dressing

Use greenery primarily to:

- distinguish Academy
- soften Harbor Square edges
- support promenade composition

Do not create a generic “fill empty space with plants” pass.

---

## 17. UI / World Boundary

Maintain:

```text
World = retro harbor game-inspired environment
UI = modern clean portfolio interface
```

Do not convert the HTML shell / exit UI into retro pixel-game UI.

---

## 18. Navigation / Accessibility

Styling must preserve:

- path readability
- building silhouette readability
- non-color-only navigation cues
- keyboard movement
- focus behavior
- persistent exit
- coarse-pointer fallback

Do not rely only on accent color to distinguish destinations.

---

## 19. Performance

Director decision:

```text
NO_SPECIAL_PERF_WORK
```

But implementation should avoid:

- per-frame redraw of static graphics
- unnecessary new Graphics object proliferation
- duplicate object creation
- excessive text objects

Style should remain mostly static scene-construction work.

---

## 20. QA

Director decision:

```text
CURRENT_TESTS_PLUS_VISUAL_QA
```

Keep all existing tests:

- world bounds
- reserved lots
- vessel containment
- vessel overlap
- water collision
- pier walkability
- prop-water guard

Add narrow structural tests only where the dock-style refactor warrants them.

Do not add brittle screenshot/pixel tests.

---

## 21. Required Evidence

Codex implementation evidence should include at least:

1. Harbor Square
2. Guild / Academy / Workshop comparison
3. Exhibition → Waterfront
4. wide harbor with large ship
5. closer water / dock / ship view

If screenshot automation is unavailable, record that honestly and provide available manual evidence.

---

## 22. In Scope

- VP5R-01 dock decoration geometry fix
- VP5R-02 minimal shared palette
- VP5R-03 canonical record reconciliation
- Harbor Square styling
- 4 destination building style refinement
- water styling
- dock / pier styling
- large ship styling
- small boat styling
- warehouse / cargo shed styling
- greenery / town dressing refinement
- QA / evidence
- status / handoff refresh

---

## 23. Protected Non-scope

Do not implement:

- layout redesign
- new portfolio destination
- portal functionality
- destination interaction
- NPC / dialogue
- interiors
- audio
- day/night
- particle system requiring new runtime architecture
- final binary art pack
- production sprite pipeline
- Tiled
- multiplayer
- auth / database
- generic theme engine

---

## 24. Director Gate

```text
VISUAL_PASS_5_DIRECTOR_GATE = PASS_WITH_REQUIRED_FIXES
DESIGN_READY_FOR_IMPLEMENTATION
```

Next:

```text
Codex Visual Pass 5 Implementation
```
