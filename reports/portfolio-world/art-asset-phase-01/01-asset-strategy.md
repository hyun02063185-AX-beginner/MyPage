# Portfolio World — Art Asset Phase 01 Asset Strategy
## Retro Harbor Campus — Production Visual Asset Foundation

> Canonical repo path:
> `reports/portfolio-world/art-asset-phase-01/01-asset-strategy.md`

---

## 1. Strategy Status

```text
ART_ASSET_PHASE_01_STRATEGY = UPDATED_AFTER_CLAUDE_PRE_REVIEW
READY_FOR_DIRECTOR_GATE
```

This document defines how Portfolio World moves from programmatic mockup rendering into project-owned visual assets without destabilizing the approved harbor composition.

The first asset slice will validate:

```text
large hero ship
+ immediate water / dock context
+ Exhibition Hall
```

before the asset system is expanded to the rest of the world.

This revision incorporates the Art Asset Phase 01 Claude strategy pre-review findings, including required fix `AAP-01` and the associated minor clarifications.

---

## 2. Core Principle

The project will preserve this separation:

```text
layout / IA
collision geometry
visual asset representation
```

A visual asset is not allowed to redefine world geometry implicitly.

The current programmatic layout remains the canonical spatial reference unless a later Director decision explicitly changes it.

---

## 3. Why the Hero Ship Comes First

The large ship is the highest-impact visual object in the harbor.

It determines:

- perceived harbor scale
- building-to-vessel proportion
- mast / sail verticality
- detail level
- asset fidelity
- water / dock contrast
- overall Retro Harbor Campus visual quality

Therefore the large ship must be validated before mass-producing building or prop assets.

Decision:

```text
HERO_SHIP_FIRST
```

---

## 4. Hero Ship Scale Policy

The current programmatic ship is a mockup reference, not a final visual bounding box.

The production visual ship should be larger than the current mockup in perceived scale.

Reference images may guide:

- ship-to-building proportion
- mast height
- sail area
- hull presence
- harbor-scene balance

But they are used only for proportion and impression.

Decision:

```text
REFERENCE_FOR_PROPORTION_ONLY
NO_LITERAL_COPY
```

---

## 5. Visual Bounds vs Collision Bounds

The ship asset may visually extend beyond the collision footprint.

Separate:

```text
visualBounds
collisionBounds
```

Allowed:

- mast extending higher than current placeholder
- sails extending beyond the hull footprint
- bow / stern artwork extending farther than collision
- upper structure visually overlapping land-side screen space

Not allowed:

- collision automatically matching full transparent image bounds
- blocking walkable paths for visual-only reasons
- hiding Exhibition Hall or major route anchors
- breaking water containment

Decision:

```text
VISUAL_BOUNDS_CAN_EXCEED_COLLISION_BOUNDS
```

---

## 6. Runtime Asset URL Rule — AAP-01

All runtime asset URLs must be resolved from Vite's current base URL.

Canonical rule:

```ts
const assetPath =
  `${import.meta.env.BASE_URL}assets/world/harbor/ship/hero-ship-v01.png`;
```

Approved:

```text
import.meta.env.BASE_URL + relative asset path
```

Forbidden:

```text
/assets/world/...
```

Reason:

```text
development base: /
production / GitHub Pages base: /MyPage/world/
```

A root-absolute asset path can work in local development and silently fail after GitHub Pages deployment.

This project currently has no established runtime asset-loading precedent, so the first asset integration must establish this rule explicitly.

Decision:

```text
RUNTIME_ASSET_URLS_MUST_USE_BASE_URL
```

---

## 7. Asset Format Strategy

Preferred initial runtime format:

```text
PNG with transparent background
```

Reason:

- simple Phaser integration
- predictable rendering
- easy replacement
- suitable for pixel / illustrated retro assets
- supports transparency and layered silhouettes

SVG is not the default runtime art format for the first slice.

Use SVG only if a specific UI-independent world element materially benefits from it and review approves it.

Do not introduce a sprite-sheet requirement before animation is needed.

Decision:

```text
PNG_FIRST
```

---

## 8. Asset Style Strategy

Target:

```text
16-bit-inspired retro illustration
```

This is an art direction, not a hardware restriction.

Desired characteristics:

- strong silhouette
- readable shapes at gameplay zoom
- limited but expressive palette
- controlled texture
- handcrafted harbor detail
- warm / inviting atmosphere
- professional enough for portfolio presentation

Avoid:

- photorealism
- high-frequency painting detail that disappears at runtime scale
- generic fantasy-RPG sprite style
- strong anime-character language
- direct imitation of a recognizable commercial game

---

## 9. Perspective Grammar — AAP Minor Clarification

The current mockup does not use a mathematically strict single projection.

It already combines:

```text
environment:
top-down / slight-isometric reading

buildings:
top-down footprint
+ visible frontal facade

ships:
profile-biased hull
+ visible deck
+ strong vertical mast / sail silhouette
```

New production assets must preserve this practical visual grammar.

Do not introduce:

- pure side-view buildings
- very high isometric objects
- flat top-down ships
- perspective rules that conflict with the existing world

The first asset slice must validate that the hero ship, Exhibition Hall, dock, and water can coexist under this grammar.

Decision:

```text
PERSPECTIVE_GRAMMAR_LOCK_IN_FIRST_SLICE
```

---

## 10. Resolution Strategy

Do not create arbitrary oversized source art.

For each asset, define:

```text
target display size
source pixel dimensions
expected runtime scale
```

The first hero ship should be produced in 2–3 controlled scale candidates rather than one final guess.

Recommended concept:

```text
Variant A — conservative
Variant B — target
Variant C — bold
```

All variants should use the same art direction.

This allows human comparison in the actual harbor scene.

---

## 11. Initial Hero Ship Scale Candidates — Clarified Baseline

Candidate labels:

```text
A: ~1.15× current perceived visual envelope
B: ~1.30× current perceived visual envelope
C: ~1.45× current perceived visual envelope
```

These values are **not raw PNG scale multipliers**.

Baseline means:

```text
the perceived visual envelope of the current approved Visual Pass 5 large ship
as seen in the actual harbor scene
```

Candidate differences should deliberately consider:

- hull length
- hull mass
- mast height
- sail area
- upper structure
- silhouette balance

The largest change should not be achieved by uniform bitmap scaling alone.

These are comparison targets, not final production dimensions.

Final approximate scale is selected only after in-world human review.

Decision:

```text
SHIP_SCALE_CANDIDATES_ARE_VISUAL_COMPARISONS
NOT_RAW_BITMAP_MULTIPLIERS
```

---

## 12. First Destination Asset

Use:

```text
Exhibition Hall
```

as the first destination-building production asset.

Reason:

- it shares the waterfront scene with the large ship
- it provides immediate building-to-ship scale comparison
- it tests scenic harbor composition
- it helps validate whether the ship dominates too much

---

## 13. Water / Dock Context

The first slice should also include enough visual treatment for:

```text
water
dock
pier edges
waterfront transition
```

to evaluate the ship correctly.

This does not require replacing the entire current programmatic water system immediately.

Preferred approach:

```text
keep geometry programmatic
apply asset-quality surface / edge treatment where useful
```

---

## 14. Asset Folder Strategy — Clarified

Canonical runtime asset root:

```text
portfolio-world/public/assets/world/
```

Recommended structure:

```text
portfolio-world/
  public/
    assets/
      world/
        harbor/
          ship/
          buildings/
          water/
          dock/
          props/
```

Avoid redundant path structures such as:

```text
assets/world/world/...
```

The runtime URL is built from `import.meta.env.BASE_URL` plus the public-relative path:

```text
assets/world/...
```

Do not create a parallel runtime asset root without need.

Decision:

```text
RUNTIME_ASSET_ROOT = portfolio-world/public/assets/world/
```

---

## 15. Naming Convention

Use stable lowercase kebab-case names.

Examples:

```text
hero-ship-v01.png
hero-ship-v02.png
exhibition-hall-v01.png
dock-edge-v01.png
```

Do not include temporary tool/provider names in runtime filenames.

---

## 16. Asset Manifest — Aligned with Existing Asset Policy

Create a lightweight project-owned manifest.

Recommended:

```text
portfolio-world/src/world/worldAssetManifest.ts
```

or a data file if that better matches the current architecture.

The manifest must align with:

```text
docs/portfolio-world/07_ASSET_POLICY.md
```

Do not introduce a second competing status vocabulary.

Minimum useful fields:

```text
id
path
role
sourceType
provenance
status
version
notes
```

Where `status` follows the canonical semantics already defined by `07_ASSET_POLICY.md`.

If the asset policy already has equivalent fields, reuse them instead of duplicating concepts.

Do not build a CMS.

Decision:

```text
ADD_MINIMAL_ASSET_MANIFEST
ALIGN_WITH_EXISTING_ASSET_POLICY
```

---

## 17. Provenance Record

Every runtime visual asset must have known provenance.

Allowed provenance categories:

```text
project-owned
generated-original
user-created
licensed-third-party
```

Disallow:

```text
unknown
copied-from-web
unverified
```

If an asset source is unclear, it must not enter runtime.

---

## 18. Asset Generation / Creation Policy

If AI generation is used:

- prompts should describe original visual requirements
- reference images may guide composition / proportion only
- do not request direct replication of identifiable copyrighted game art
- generated outputs become candidates, not automatically accepted runtime assets
- visual consistency must be reviewed before integration

The art pipeline remains human-directed.

---

## 19. Background Transparency

World object assets should normally use:

```text
transparent background
```

No baked world background behind:

- ship
- building
- prop

unless the asset is explicitly designed as a large environmental plate.

This preserves placement flexibility.

---

## 20. Shadow Policy

Do not bake complex scene-specific shadows into every asset.

Preferred:

```text
simple local shadow
or
runtime shadow treatment
```

Keep direction and softness consistent.

Avoid mismatched lighting across independently produced assets.

---

## 21. Palette Relationship

The existing shared:

```text
visualPalette.ts
```

remains the color-language reference.

New art does not need to use only exact palette constants pixel-for-pixel, but should harmonize with:

- water blues
- dock woods
- stone
- greenery
- destination accents
- ship hull / sail tones

Do not let imported/generated art introduce a completely separate palette.

---

## 22. Runtime Integration

Preferred integration:

- use Phaser native loading unless implementation evidence requires otherwise
- preload explicit asset files
- map asset ids through the minimal manifest
- construct asset URLs with `import.meta.env.BASE_URL`
- render via Phaser Image/Sprite objects
- keep layout coordinates in existing world data
- keep collision geometry explicit and independent

Do not move layout coordinates into asset code.

Do not derive collision geometry from PNG transparent bounds.

---

## 23. Fallback Strategy

During transition:

```text
asset present -> render asset
asset absent -> retain current programmatic fallback
```

This makes partial migration safe.

Avoid permanent double-rendering.

The fallback is transitional and can be removed after an asset category is fully approved.

Decision:

```text
INCREMENTAL_PROGRAMMATIC_FALLBACK
```

---

## 24. Anchor / Origin Principle

The first slice must choose a stable anchor policy for large assets.

Preferred principle for the hero ship:

```text
logical hull anchor
```

The asset origin should keep the hull aligned to the existing water/world placement while allowing:

- mast
- sail
- upper structure

to extend beyond the logical gameplay footprint.

Do not anchor the ship using the full transparent image bounding box if that makes scale candidate swapping unstable.

The exact Phaser origin values should be chosen during implementation after inspecting the produced asset dimensions.

---

## 25. Depth / Layering Principle

The first slice should preserve a predictable rendering order:

```text
water
water detail
dock / pier
ship hull / body
ship upper silhouette
foreground harbor details
HTML/UI separate
```

Use current Phaser depth features where sufficient.

Do not introduce a large new layering framework before evidence requires it.

---

## 26. First Slice Deliverables

Required:

### Hero Ship
- 2–3 scale/style candidates
- transparent background
- consistent perspective grammar
- same core design language

### Exhibition Hall
- one production-style candidate
- transparent background
- scale compatible with current destination role

### Harbor Context
- sufficient dock / water treatment for comparison

### Integration
- actual in-world placement
- `BASE_URL`-safe runtime loading
- explicit manifest entry
- no collision changes unless separately approved

---

## 27. Human Review Questions

After the first slice:

```text
1. Is the hero ship large enough?
2. Is it too dominant?
3. Does ship-to-building proportion match the intended reference mood?
4. Does the ship feel like the harbor landmark?
5. Does Exhibition Hall remain legible?
6. Does the new asset style fit Retro Harbor Campus?
7. Does the style feel professional enough for the portfolio?
8. Is the perspective grammar coherent?
```

---

## 28. Protected Non-scope

Do not yet:

- produce every world asset
- fill empty lots
- redesign layout
- add NPCs
- build interiors
- implement portals
- add audio
- introduce animation-heavy sprite systems
- migrate to Tiled
- change world navigation
- rewrite rendering architecture

---

## 29. Build / Deployment Rule

Production target:

```text
/MyPage/world/
```

All asset integration must be verified in both:

```text
development
production build / preview
```

At minimum verify:

- asset URL resolves under production base
- Vite copies public assets into `world/`
- preview returns HTTP 200
- no asset request resolves to incorrect root `/assets/...`
- existing GitHub Pages deployment structure remains intact

---

## 30. Strategy Gate

Updated Director status:

```text
ASSET_STRATEGY_REVISED_AFTER_PRE_REVIEW
READY_FOR_ASSET_DIRECTOR_GATE
```
