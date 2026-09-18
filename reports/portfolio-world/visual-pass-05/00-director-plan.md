# Retro Harbor Campus — Visual Pass 5 Director Plan
## Art Style Application

> Recommended repo path:
> `reports/portfolio-world/visual-pass-05/00-director-plan.md`

---

## 0. Plan Status

- Project: `Portfolio World`
- Branch target: `feature/portfolio-world-sprint-02`
- Phase: `Visual Pass 5`
- Working title: `Art Style Application`
- Prior result: **Visual Pass 4 composition approved by user**
- Current decision: **Keep the approved harbor-city composition and begin visual/style application**

---

## 1. Why this pass exists

Visual Pass 1–4 established the spatial foundation:

- Harbor Square as the town center
- Clear north / west / east / south destination structure
- Inner-harbor geometry
- Large ship focal point
- Small-boat activity
- Warehouse / cargo-side support structures
- Walkable dock / pier composition

The user’s current direction is:

```text
The composition now feels much more like a harbor.
Because this is still a mockup, it is better to judge further changes
after design / style is applied.
```

Therefore Visual Pass 5 is **not** another layout redesign pass.

It is the first pass that asks:

```text
What does the approved harbor composition look like
when a real visual language is applied?
```

---

## 2. Core Objective

Apply a coherent **retro harbor campus** visual style to the already-approved layout so the world feels:

```text
warmer
more intentional
more atmospheric
more memorable
```

while preserving:

```text
navigation clarity
portfolio-readability
approved harbor-city composition
mockup-stage practicality
```

---

## 3. One-line Direction

```text
Take the approved harbor-city mockup and turn it into
a clearly styled retro harbor campus without changing
the core IA or overcommitting to final production art.
```

---

## 4. Artistic direction

### 4.1 Primary theme

**Retro Harbor Campus**

This means a hybrid of:

- retro game readability
- harbor-city atmosphere
- academic / guild / workshop town identity
- portfolio-world clarity

The world should feel like:

```text
a small, charming harbor city with an educational / craft district,
not a generic fantasy town and not a pure maritime simulator.
```

### 4.2 Visual mood

Target mood:

- warm
- friendly
- handcrafted
- slightly adventurous
- quietly prestigious
- suitable for a professional portfolio world

Avoid mood that is:

- grim / dirty / overly realistic
- militaristic
- hyper-busy
- overly toy-like
- too luxurious / aristocratic
- too modern / sterile

### 4.3 Visual reference interpretation

Previously approved reference direction suggests:

- harbor water that visually enters the town edge
- large ship as a focal landmark
- dock / waterfront silhouette that reads clearly from afar
- town blocks arranged around the harbor
- stylized environment rather than realistic simulation

We should **interpret** these qualities.

Do **not** copy any single reference image literally.

---

## 5. Scope of this pass

This pass should style:

### 5.1 Ground and terrain
- Harbor Square ground treatment
- road / path treatment
- promenade / forecourt treatment
- dock surface treatment
- water edge treatment
- water surface treatment

### 5.2 Buildings
- Guild Hall
- Academy
- Workshop
- Exhibition Hall
- Warehouse
- Cargo shed

### 5.3 Harbor elements
- large ship
- small boats
- dock and pier arms
- ropes / moorings
- cargo-side props
- harbor-side visual cues

### 5.4 Town dressing
- lamps
- benches
- planters
- banners / signs
- greenery / trees / shrubs
- detail-tier environmental dressing

### 5.5 Identity cues
- each destination should become more visually distinct
- Harbor Square should feel like the orientation anchor
- Exhibition / waterfront should feel like the scenic south route

---

## 6. Out of scope

This pass should **not** introduce:

- new destinations
- portal functionality
- destination click / interaction features
- NPCs / dialogue
- interiors
- audio
- day/night cycle
- particle systems requiring major runtime changes
- Tiled migration
- multiplayer / auth / backend
- full production sprite pipeline
- binary art asset pack import as a requirement

Also avoid reopening layout-level composition unless a tiny visual adjustment is strictly necessary.

---

## 7. Asset-policy direction for this pass

### 7.1 Default policy

Stay within the current project spirit:

```text
programmatic-first
mockup-safe
low-risk
easy to iterate
```

That means Pass 5 should **primarily** use the existing programmatic rendering architecture and improve:

- shapes
- color palette
- layering
- trim details
- silhouette language
- decorative motifs

### 7.2 Optional allowance

Small supporting non-binary design helpers are acceptable if needed in development workflow, but the runtime result should remain aligned with:

```text
programmatic / lightweight / revision-friendly
```

### 7.3 Explicit no for now

Do not jump straight to a “final pixel-art asset production” phase yet.

We want to first confirm the style direction on the approved composition.

---

## 8. Design language goals

### 8.1 Harbor Square

Should feel like:

```text
the civic heart of the harbor city
```

Design cues:

- cleaner paving language
- compass / armillary / central motif reads clearly
- stronger visual framing
- slightly more “arrival” feeling
- elegant, not crowded

### 8.2 Guild Hall

Should feel like:

```text
the expedition / registry / journey side of town
```

Design cues:

- map / banner / registry identity
- practical but respectable
- traveler-facing

### 8.3 Academy

Should feel like:

```text
the learning / study district
```

Design cues:

- calmer tone
- garden / tree / sign balance
- more refined silhouette than workshop

### 8.4 Workshop

Should feel like:

```text
the making / craft / build zone
```

Design cues:

- timber / tool / practical material vibe
- modest industrial energy
- active but not messy

### 8.5 Exhibition Hall / Waterfront

Should feel like:

```text
the scenic presentation edge of the harbor
```

Design cues:

- terrace / display / scenic edge
- elegant waterfront transition
- strong visual route into the harbor view

### 8.6 Harbor / Basin

Should feel like:

```text
the identity-defining southern scene
```

Design cues:

- water must read attractively
- dock / pier edges need visual appeal
- large ship should anchor attention
- smaller boats should support activity
- warehouse / cargo area should hint at function without taking over

---

## 9. Primary style tasks

### 9.1 Color palette refinement
Create a palette system for:

- water
- dock wood
- stone / plaza
- grass / greenery
- academic / civic / workshop accents
- ship hull / sail / rope tones

Target effect:

```text
readable retro stylization with warmer harbor character
```

### 9.2 Silhouette refinement
Improve building and vessel silhouettes so they read more clearly at a glance.

Particular attention:
- large ship mast / sail hierarchy
- dock / pier shape readability
- destination roofline distinction

### 9.3 Surface detailing
Introduce visual variation through:

- border lines
- trim bands
- segmented planks / masonry hints
- subtle decorative motifs
- repeated but controlled environmental details

### 9.4 Water styling
Water is especially important in this pass.

Water should better communicate:
- inner basin shape
- harbor depth
- shoreline structure
- contrast against dock and land

Without making it overly noisy.

### 9.5 Hierarchy and emphasis
The screen should clearly communicate:

```text
1. Harbor identity
2. Large ship anchor
3. Town structure and routes
4. Destination readability
5. Supporting harbor activity
```

---

## 10. Success criteria

Visual Pass 5 succeeds if the user can honestly say:

```text
Now the approved harbor composition has a real design identity.
```

And specifically if:

1. the harbor feels more attractive than in Pass 4
2. the large ship feels like a designed landmark, not just a placeholder
3. the water looks intentionally styled
4. the dock / pier / waterfront feel more convincing
5. the destination buildings feel more distinct
6. the world still remains easy to navigate
7. it still reads as a portfolio world, not a confusing game map
8. users can judge the visual direction without requiring final assets

---

## 11. Risks to avoid

### 11.1 Over-detailing
If too many decorative marks are added, the world may become noisy.

### 11.2 Style drift
If one area becomes much more detailed than others, the world loses coherence.

### 11.3 Final-art illusion
We do **not** need to fake a production-complete asset pipeline yet.

### 11.4 Navigation regression
Decoration must not obscure route readability.

### 11.5 Overuse of harbor clutter
Crates / barrels / ropes / sheds should support the scene, not dominate it.

---

## 12. Required outputs

This pass should ultimately produce at least:

### 12.1 Runtime result
Styled world in the existing `portfolio-world/` runtime and generated `world/` build.

### 12.2 Project records
Under:

```text
reports/portfolio-world/visual-pass-05/
```

Recommended file flow:

```text
00-director-plan.md
01-claude-pre-review.md
02-director-gate.md
03-codex-implementation.md
04-claude-independent-review.md
05-human-visual-feel-test.md
06-director-closeout.md
```

---

## 13. Roles

### 13.1 Director (Sol / planning)
Responsibilities:

- preserve approved harbor composition
- define visual priorities
- prevent scope drift
- make pass/fix/next-step decisions

### 13.2 Codex (implementation)
Responsibilities:

- implement style application
- preserve layout and navigation
- avoid asset-policy violations
- record evidence and QA

### 13.3 Claude Code (review)
Responsibilities:

- pre-review the plan
- independently review visual/style result
- identify design drift, readability issues, or validation gaps

### 13.4 Human user
Responsibilities:

- judge whether the world now feels attractive as a harbor campus
- decide whether another composition tweak is needed
- determine whether to proceed to interaction or asset-quality stages

---

## 14. Recommended execution order

### Step 1
Claude pre-review of this director plan

### Step 2
Director gate / implementation instruction

### Step 3
Codex implementation of Visual Pass 5

### Step 4
Claude independent review

### Step 5
Human visual feel test

### Step 6
Director decides one of:

- close visual foundation and move to interaction / portals
- do one last style-tuning pass
- begin dedicated asset-quality phase

---

## 15. Director initial decision

At the start of Visual Pass 5, the default decision is:

```text
KEEP_APPROVED_LAYOUT
KEEP_APPROVED_HARBOR_IDENTITY
APPLY_STYLE_WITH_PROGRAMMATIC_RENDERING
AVOID_FINAL_ASSET_PIPELINE_FOR_NOW
```

---

## 16. Final director note

Visual Pass 4 answered:

```text
Can this world feel like a harbor city?
```

Visual Pass 5 should answer:

```text
What does that harbor city feel like when it gains a real visual language?
```

That is the point of this pass.
