# Portfolio World — Art Asset Phase 01 Director Gate
## First Asset Slice Authorization

> Canonical repo path:
> `reports/portfolio-world/art-asset-phase-01/03-director-gate.md`

---

## 1. Inputs

Reviewed:

```text
00-director-gate.md
01-asset-strategy.md
02-claude-asset-strategy-pre-review.md
Visual Pass 5 Human Visual Feel result
current Portfolio World runtime / deployment architecture
```

Claude strategy pre-review gate:

```text
READY_WITH_FIXES
```

Director decision:

```text
ART_ASSET_PHASE_01_DIRECTOR_GATE = PASS_WITH_REQUIRED_FIXES
READY_FOR_FIRST_ASSET_SLICE_IMPLEMENTATION
```

The strategy is fundamentally approved.

The required deployment-path rule and minor clarifications are now incorporated into the revised `01-asset-strategy.md`.

---

## 2. Required Fix AAP-01 — Closed at Strategy Level

Canonical runtime asset rule:

```ts
const assetPath =
  `${import.meta.env.BASE_URL}assets/world/harbor/ship/hero-ship-v01.png`;
```

Required:

```text
import.meta.env.BASE_URL
```

Forbidden:

```text
/assets/world/...
```

Reason:

```text
dev base: /
production / GitHub Pages base: /MyPage/world/
```

Implementation must verify production asset resolution.

Gate token:

```text
AAP_01_STRATEGY_FIX_ACCEPTED
IMPLEMENTATION_VERIFICATION_REQUIRED
```

---

## 3. Minor Clarifications — Accepted

### Manifest alignment

The asset manifest must align with:

```text
docs/portfolio-world/07_ASSET_POLICY.md
```

Do not introduce competing status vocabularies.

### Runtime asset root

Canonical:

```text
portfolio-world/public/assets/world/
```

Avoid:

```text
assets/world/world/...
```

### Perspective grammar

Use the existing practical mixed grammar:

```text
environment:
top-down / slight-isometric

buildings:
top-down footprint + visible frontal facade

ships:
profile-biased hull + visible deck + vertical mast / sails
```

The first asset slice must prove visual coherence under this grammar.

### Hero ship scale baseline

Candidate values:

```text
A ~1.15×
B ~1.30×
C ~1.45×
```

refer to the **current perceived visual envelope**, not raw PNG scale.

Candidates should vary actual silhouette proportions where useful.

---

## 4. First Asset Slice — Approved

Implement only:

```text
1. Large hero ship — A/B/C visual candidates
2. Exhibition Hall — one production-style candidate
3. Immediate water / dock context needed for comparison
4. Runtime asset loading foundation
5. Minimal asset manifest
6. In-world comparison evidence
```

Do not expand to the full map asset set yet.

Decision:

```text
FIRST_SLICE_APPROVED
```

---

## 5. Hero Ship — Priority 1

The hero ship is the first design anchor.

Required outcome:

```text
the user can compare multiple plausible ship scales
inside the actual harbor scene
```

The current mockup size is not final.

The production candidate should have greater visual presence than the current placeholder.

Focus on:

- hull mass
- hull length
- bow / stern identity
- mast height
- sail area
- deck / upper structure
- landmark silhouette

Do not create three completely unrelated ship designs.

Use one coherent ship design language with meaningful scale/silhouette variants.

---

## 6. Ship Size / Collision Separation

Locked rule:

```text
VISUAL_BOUNDS_CAN_EXCEED_COLLISION_BOUNDS
```

The asset may extend beyond current collision geometry.

Allowed:

- taller masts
- larger sails
- longer visual bow/stern
- upper silhouette overlapping land-side visual space

Not allowed:

- enlarging collision solely to match PNG bounds
- blocking routes
- hiding Exhibition Hall completely
- breaking vessel containment logic

Collision remains explicit and independent.

---

## 7. Exhibition Hall — Priority 2

Create one production-style Exhibition Hall candidate.

Purpose:

- compare building-to-ship proportion
- validate waterfront art style
- test perspective grammar
- determine whether the ship is too dominant

Do not redesign its world position or IA role.

---

## 8. Water / Dock Context — Priority 3

Provide enough production-quality context to evaluate the ship.

Allowed:

- improved texture/surface treatment
- dock edge assets
- water detail assets
- lightweight programmatic + asset hybrid

Do not replace stable collision/water geometry.

Do not introduce shaders unless separately approved.

---

## 9. Runtime Format

Decision:

```text
PNG_FIRST_APPROVED
```

Use transparent PNG for world-object assets in this slice.

Do not introduce sprite-sheet architecture unless animation becomes an explicit requirement.

---

## 10. Runtime Asset Root

Canonical:

```text
portfolio-world/public/assets/world/
```

Recommended first-slice paths:

```text
portfolio-world/public/assets/world/harbor/ship/
portfolio-world/public/assets/world/harbor/buildings/
portfolio-world/public/assets/world/harbor/water/
portfolio-world/public/assets/world/harbor/dock/
```

---

## 11. Runtime URL Construction

Every Phaser runtime asset URL must use:

```text
import.meta.env.BASE_URL
```

Implementation must not depend on a root-absolute `/assets/...` URL.

This is a release-blocking requirement for GitHub Pages compatibility.

---

## 12. Asset Manifest

Decision:

```text
ADD_MINIMAL_ASSET_MANIFEST
```

Recommended:

```text
portfolio-world/src/world/worldAssetManifest.ts
```

Minimum fields should follow the revised strategy and existing Asset Policy.

Do not build a CMS or generic asset-management framework.

---

## 13. Phaser Loading

Director expectation:

```text
PHASER_NATIVE_LOADING_PREFERRED
```

Use Phaser's native loader unless implementation inspection reveals a concrete blocker.

Do not create a generic AssetManager preemptively.

---

## 14. Programmatic Fallback

Approved during incremental migration:

```text
asset present -> asset render
asset absent -> programmatic fallback
```

Do not render both visual systems on top of each other unintentionally.

Fallback is transitional.

---

## 15. Perspective Gate

The first slice must be reviewed for perspective coherence.

Specifically compare:

```text
hero ship
Exhibition Hall
dock
water
```

The asset phase must not drift into a visually different camera grammar than the existing world.

---

## 16. Scale Candidate Gate

The first implementation must expose enough evidence to compare:

```text
Variant A — conservative
Variant B — target
Variant C — bold
```

These do not need to be raw runtime user-selectable options in the final product.

They may be development comparison variants.

The human user must be able to judge which approximate scale should become canonical.

---

## 17. Provenance / Copyright

All first-slice assets must have known provenance.

Accepted:

```text
generated-original
user-created
project-owned
licensed-third-party
```

Rejected:

```text
unknown
copied-from-web
unverified
```

Existing reference images are proportion / impression references only.

Do not recreate a recognizable copyrighted game asset.

---

## 18. Asset Generation Gate

Production art generation may begin **after this Director Gate**.

Decision:

```text
GENERATE_AFTER_DIRECTOR_GATE
```

Generated results are candidates and require visual review before becoming canonical runtime assets.

---

## 19. Evidence Requirements

The first slice should produce at minimum:

```text
A. current mockup baseline
B. hero ship Variant A in harbor
C. hero ship Variant B in harbor
D. hero ship Variant C in harbor
E. ship + Exhibition Hall wide comparison
F. closer ship / dock / water comparison
```

If browser screenshot automation is unavailable, use the best available deterministic preview evidence and state the limitation honestly.

Human comparison is mandatory.

---

## 20. Deployment Verification

Implementation must verify:

```text
development asset load
production build
production preview
HTTP 200
asset URL under /MyPage/world/
no root /assets/ request
```

This verification is mandatory because AAP-01 originated from a real deployment-path risk.

---

## 21. Performance Guard

Do not import oversized source artwork directly into runtime without review.

Record:

- image dimensions
- runtime file sizes
- total first-slice asset weight
- bundle size
- texture count if meaningful
- preview load behavior

A modest increase is acceptable.

Unbounded art dimensions are not.

---

## 22. Preserve Existing Architecture

Do not change:

- root repo structure
- root package policy
- existing Portfolio HTML pages
- current IA
- collision architecture
- world dimensions
- GitHub Pages deployment model

Keep:

```text
portfolio-world/ = source
world/ = committed build artifact
```

---

## 23. Protected Non-scope

Do not implement:

- complete world asset migration
- all four destination assets
- empty-lot filling
- NPCs
- dialogue
- interiors
- portals
- audio
- multiplayer
- auth/database
- Tiled
- generic theme engine
- generic asset manager
- production animation pipeline
- layout redesign

---

## 24. Implementation Sequence

Recommended:

```text
1. inspect runtime loader / build behavior
2. establish BASE_URL-safe loader rule
3. add minimal manifest
4. add first-slice asset folders
5. create / integrate hero ship candidates
6. integrate Exhibition Hall candidate
7. apply immediate water / dock context
8. verify collision/layout unchanged
9. build and production-preview
10. capture comparison evidence
11. independent review
12. human scale/style decision
```

---

## 25. Required Next Implementation Report

Create after implementation:

```text
reports/portfolio-world/art-asset-phase-01/
04-codex-first-asset-slice.md
```

The report should include:

- work context
- base / commits
- asset files
- provenance
- image dimensions / file sizes
- BASE_URL loading implementation
- manifest
- hero ship variants
- Exhibition Hall
- water / dock context
- collision/layout preservation
- QA
- production asset URL verification
- evidence
- performance
- known issues
- gate

Expected implementation gate:

```text
READY_FOR_ASSET_SLICE_INDEPENDENT_REVIEW
NEEDS_FIX
NEEDS_DIRECTOR_DECISION
```

---

## 26. Director Final Decision

```text
ART_ASSET_PHASE_01_DIRECTOR_GATE = PASS_WITH_REQUIRED_FIXES
AAP_01 = RESOLVED_IN_STRATEGY / MUST_VERIFY_IN_RUNTIME
FIRST_ASSET_SLICE = AUTHORIZED
```

Next:

```text
Codex — Art Asset Phase 01 First Asset Slice
```
