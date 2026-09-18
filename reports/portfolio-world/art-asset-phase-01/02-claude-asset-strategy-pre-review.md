# Portfolio World — Art Asset Phase 01 Asset Strategy Pre-review

## Retro Harbor Campus — Production Visual Asset Foundation

Reviewer: Claude Code — Sonnet 5
Role: Independent architecture + asset-pipeline reviewer (plan review only; no asset generated, no runtime code changed)

---

## A. Gate

```text
READY_WITH_FIXES
```

The overall strategy is sound: hero-ship-first, visual/collision bounds separation, PNG-first, a minimal manifest, and a small first slice are all the right calls for this project's mockup-to-asset transition. One concrete gap needs to be closed in the strategy document itself before Codex writes any asset-loading code: **the strategy is silent on how loader URLs will survive the `/MyPage/world/` GitHub Pages base path**, and this codebase currently has zero precedent for it (Section I). Four additional Minor findings are recommended, non-blocking refinements.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | win32 x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `59a398e` (`docs(portfolio-world): review visual pass 5 style application`) |
| Git status | dirty — `reports/portfolio-world/art-asset-phase-01/` and `reports/portfolio-world/visual-pass-05/05-human-visual-feel-test.md` untracked |
| Node / npm | v24.16.0 / 11.13.0 |

The untracked files are the Director Gate/strategy instruction pair for this phase (execution-only, not required to be committed per their own header) and the Visual Pass 5 human feel test record, which reads the world I served over `npm run preview` in this same session and returned `VISUAL_PASS_5_APPROVED_FOR_ASSET_APPLICATION`. Per this instruction's own scope, I did not commit, delete, or modify any of these — only this pre-review report is in scope to commit (Section 26).

---

## C. Sources Reviewed

Read directly: `visual-pass-05/05-human-visual-feel-test.md`; `art-asset-phase-01/00-director-gate.md`, `01-asset-strategy.md`; `docs/portfolio-world/{04_ARCHITECTURE,06_QA_RELEASE_POLICY,07_ASSET_POLICY,08_ENVIRONMENT_POLICY,90_DECISIONS,91_STATUS,92_HANDOFF}.md`. Inspected runtime: `portfolio-world/vite.config.ts`, `package.json`, `public/` (contents: `GENERATED_DO_NOT_EDIT.txt`, `assets/.gitkeep`, `maps/.gitkeep`), `src/scenes/BootScene.ts`, and the committed `world/` build output structure directly (`world/assets/`, `world/maps/`). Grepped the entire `portfolio-world/src` tree for `BASE_URL`, `load.image`, `load.atlas`, `import.meta.env` — **zero matches**. There is currently no asset-loading code anywhere in this project; `BootScene.create()` only transitions to `WorldScene` and its own comment states asset loading was "intentionally deferred from the runtime foundation sprint." This phase is genuinely first ground, not a refinement of an existing pattern.

---

## D. Hero Ship Strategy

```text
HERO_SHIP_STRATEGY_READY
```

Validating the ship before mass-producing anything else is the correct call, and it matches what the human feel test just asked for directly (`INCREASE_HERO_SHIP_VISUAL_PRESENCE`, `LARGE_SHIP_SCALE_NOT_LOCKED`). The current mockup ship (`harbor-large-ship`, 280×80 data-footprint) is correctly treated as reference geometry, not a final bounding box, and the visual/collision separation is explicit and consistent between the Director Gate and the strategy doc (no contradiction between the two documents on this point).

---

## E. Scale Candidate Strategy

```text
SCALE_CANDIDATE_APPROACH_READY
```

The strategy already answers the right question correctly: it explicitly rejects "just uniform bitmap scaling" and requires the size increase to come from mast height, sail area, hull length, and upper silhouette — i.e., the candidates should differ in proportion, not just zoom level. That's the correct approach for making an A/B/C comparison actually informative. See Finding AAP-05 for one ambiguity in what "current perceived size" means as the 1.15×/1.30×/1.45× baseline.

---

## F. First Slice

```text
FIRST_SLICE_READY
```

Hero ship + immediate water/dock + Exhibition Hall is a good minimal slice: it's the same waterfront scene already established in `worldLayoutData.json` (the large ship and Exhibition Hall's forecourt/waterfront props already share the `gallery` zone), so no new placement logic is needed to test proportion, and it directly answers the human test's stated Priority 1/3 (ship, then water/dock quality) using Priority 2's first representative (one building, not all four). Small enough to implement and judge quickly; large enough to judge scale and style together rather than in isolation.

---

## G. Runtime Format

```text
PNG_FIRST_APPROVED
```

PNG with transparent background is the right default for illustrated/pixel-style harbor assets needing simple Phaser `Image`/`Sprite` integration, and deferring sprite-sheets until animation is actually needed avoids solving a problem this phase doesn't have yet. Nothing in the current runtime (Phaser 4.2.1, no existing texture-atlas tooling) argues for anything else at this stage.

---

## H. Asset Path / Build

```text
ASSET_PATH_READY
```

Confirmed directly: `vite.config.ts` sets `outDir: "../world"` with `emptyOutDir: true`, and Vite's standard behavior (verified empirically — `public/assets/.gitkeep` and `public/maps/.gitkeep` are present in the currently-committed `world/assets/` and `world/maps/`) copies `public/` recursively into the build output root. `public/assets/world/harbor/{ship,buildings,water,dock,props}/` is fully compatible with this — no path collision with Vite's own hashed bundle output (`world/assets/index-<hash>.js/css` lives in the same `assets/` directory but under different, non-colliding names).

One Minor, non-blocking observation: since the build output is already `world/`, nesting a `world/` segment again inside it (`public/assets/world/harbor/...` → `world/assets/world/harbor/...`) is slightly redundant. `public/assets/harbor/...` would read more cleanly without changing anything functional — see Finding AAP-03.

---

## I. GitHub Pages

```text
GITHUB_PAGES_PATH_FIX_REQUIRED
```

This is the review's most important finding (AAP-01, Major). Confirmed directly from `vite.config.ts`: `base` is `/MyPage/world/` for production builds and `/` for `vite dev`, and `package.json`'s `preview` script hardcodes `--base /MyPage/world/` to match. This means:

- A **document-relative** loader path (no leading `/`, e.g. `this.load.image("hero-ship", "assets/world/harbor/ship/hero-ship-v01.png")`) resolves correctly under any base, because the browser resolves it against the serving document's own URL (`/MyPage/world/index.html` in production, `/index.html` in dev) — this works today with zero extra code.
- A **root-absolute** loader path (leading `/`, e.g. `"/assets/world/harbor/ship/hero-ship-v01.png"`) would resolve against the site origin root in **every** environment, silently working in local dev (where `base` happens to be `/`) and silently 404'ing in the GitHub Pages production build and even in `npm run preview` — exactly the deployment this project ships to.

Neither the Director Gate nor the strategy document states which of these two the first asset-loading code must use, and there is no existing code in this repo to copy the correct pattern from (Section C). Given this is the single most common Vite+GitHub-Pages footgun and this project has never exercised it before, the strategy should not leave it to implementation-time judgment call.

---

## J. Manifest

```text
ADD_MINIMAL_ASSET_MANIFEST
```

A flat `worldAssetManifest.ts` in `src/world/` (matching the existing `worldLayout.ts`/`worldTypes.ts`/`visualPalette.ts` convention) with the proposed fields (id, path, role, sourceType, provenance, licenseStatus, version, notes) is proportionate — not a CMS, and it's the only place that will record whether a generated candidate has actually been accepted into runtime. See Finding AAP-02 for one reconciliation note with the project's existing `07_ASSET_POLICY.md`.

---

## K. Provenance

```text
PROVENANCE_POLICY_READY
```

`project-owned / generated-original / user-created / licensed-third-party`, with `unknown` / `copied-from-web` / `unverified` explicitly disallowed from entering runtime, is a clear and enforceable policy and is consistent with `07_ASSET_POLICY.md`'s existing "출처/라이선스를 확인할 수 없는 외부 asset은 공개 build 금지" rule — this phase is a specialization of that existing rule, not a departure from it.

---

## L. Source vs Runtime Assets

```text
RUNTIME_ASSETS_ONLY_FOR_NOW
```

For a first slice of 2–3 ship candidates plus one building, a separate `art-source/` tree would be process overhead this phase doesn't need yet — the manifest's `provenance`/`notes` fields are enough to track how each PNG was produced. Revisit `SEPARATE_SOURCE_AND_RUNTIME_ASSETS` once production expands past validation (e.g. once layered/editable source files, not just exported PNGs, actually need to live somewhere).

---

## M. Fallback

```text
FALLBACK_STRATEGY_READY
```

`asset present → render asset, asset absent → keep current programmatic drawHarborVisual()/drawLargeShip() etc.` is a sound incremental-migration pattern and fits the existing exhaustive-dispatch structure in `harborVisualCatalog.ts` (`drawHarborVisual`'s `switch` already handles every `HarborVisualType` explicitly, so adding an asset-presence check per type is a small, local change, not a rewrite). Agreed this should be removable later rather than a permanent double-render path.

---

## N. Phaser Integration

```text
SMALL_ASSET_HELPER_NEEDED
```

Phaser's native `Scene.preload()` / `this.load.image()` / texture-key lookup is entirely sufficient for a PNG-first, no-atlas, no-animation first slice — no asset-manager abstraction is warranted. The one small helper that **is** warranted is exactly the GitHub Pages URL-construction rule from Section I/Finding AAP-01: a one-function helper (e.g. `resolveAssetPath(path: string): string` returning `` `${import.meta.env.BASE_URL}${path}` `` or simply documenting "always pass a document-relative path, never a leading `/`") used at every `load.image()` call site, so the correct behavior isn't left to be independently re-derived by whoever writes each preload call.

---

## O. Origin / Anchor Policy

Recommend: keep the existing `(x, y)` in `worldLayoutData.json` as the **collision-footprint center**, unchanged — this preserves the "visual asset must not implicitly redefine world geometry" principle both documents already commit to (Director Gate Section 13, Strategy Section 2). For the sprite itself, use a **bottom-center-biased origin** (e.g. `setOrigin(0.5, ~0.8–1.0)` anchored near the hull/waterline) rather than the default geometric center `(0.5, 0.5)`. Reasoning: the mast/sail is the part explicitly allowed to grow beyond the mockup box (Director Gate Section 6), and it only grows *upward*; anchoring at the hull base means a taller mast extends further up the screen without moving the hull away from its water placement or requiring the collision rectangle to shift. A `visualAnchorOffset` (or equivalent per-asset field) in the manifest is worth including so different assets (ship vs. a building with a symmetrical footprint) aren't forced into one hardcoded anchor rule in code.

---

## P. Layering / Depth Policy

```text
CURRENT_DEPTH_MODEL_SUFFICIENT
```

Read `WorldScene.renderWorld()` and `harborVisualCatalog.ts`'s depth constants directly: ground `-4`, edge `-2`, path `1`, plaza `2`, buildings `4`, non-water harbor visuals (including `large-ship`) `6`, water `0`, labels `8`, player `11`/`12`. This is a small number of static depth tiers, drawn once at scene `create()`, not a per-frame sort — sufficient for a single hero-ship sprite that already belongs to the same `large-ship` visual type and will inherit its existing depth `6`, which already draws above water/paths/buildings and below labels/player. A taller sprite increases the *chance* it visually overlaps Exhibition Hall's forecourt props, but that's a placement/scale judgment for the mandated human review (Director Gate Section 22), not a depth-architecture gap — nothing about "art extends further than the mockup box" requires new depth tiers or dynamic sorting at this scale.

---

## Q. Perspective Grammar

```text
PERSPECTIVE_GRAMMAR_MUST_BE_LOCKED_IN_FIRST_SLICE
```

Read `drawHarborBuilding()` and `drawBoat()`/`drawLargeShip()` directly: the current programmatic style is already a **hybrid** grammar, not a single consistent one — ground/plaza/paths are drawn strict top-down (flat rectangles), buildings are drawn with a frontal/elevation-style facade (a rectangular wall plus a triangular roof, read as if viewed from the side), and boats/the ship are drawn as side-profile silhouettes (a hull triangle plus a vertical mast). This mixed convention hasn't caused a visible clash because flat programmatic color shapes are abstract enough to read fine either way — but once real illustrated PNGs are introduced (with actual shading/perspective cues), a true top-down building next to a profile-view ship, or vice versa, would look inconsistent in a way the current mockup can't reveal. Neither the Director Gate's "lock camera/perspective grammar" instruction nor the strategy's Section 19 states this specific existing convention explicitly, so it should be named directly rather than left implicit: **the first asset slice should preserve exactly this hybrid — top-down ground/water plane, frontal-facade building, side-profile ship/boat** — not drift toward a single "true" isometric or top-down grammar, since the remaining programmatic destinations/props (not yet replaced) will still be drawn in the current hybrid style and must not clash with the new PNGs sitting next to them.

---

## R. Scale System

```text
ADD_ASSET_SCALE_SPEC
```

Agree a small explicit spec is needed, not final art dimensions. One concrete ambiguity to resolve in that spec (Finding AAP-05): the current mockup ship's **data footprint** is 280×80 px, but its **actually-rendered silhouette** is smaller than that box in several dimensions today (e.g. the mast top starts at `top + height × 0.1`, well inside the box, not at the box edge) — so "1.15× current perceived size" is ambiguous between "1.15× the 280×80 footprint" and "1.15× the silhouette as currently drawn," which are different baselines. The minimum spec should state, in pixels: player height (32 px), the existing building footprints (256×128), the existing ship data footprint (280×80) **and** its current rendered mast-top/hull-bottom extent, `LOGICAL_UNIT` (32 px), and viewport (1024×576) — enough for scale candidates to be produced against one unambiguous number, not final bounding boxes.

---

## S. Performance

```text
ADD_BASIC_ASSET_SIZE_BUDGET
```

`91_STATUS.md`'s own "Known Technical Follow-ups" already flags the JS bundle (1,409.93 kB) as past Vite's 500 kB advisory threshold — this project has no headroom to be casual about new byte weight. Reasoning from actual render scale (world is 2048×1280 canvas-space; the ship's current data footprint is 280×80; even generous 3–4× oversampling for crisp scaling tops out well under 1200×400 px source) argues against needing large source textures. Recommend simple, generous-but-bounded limits: **≤300 KB per ship candidate PNG, ≤200 KB for the Exhibition Hall candidate, ≤1.5 MB total for the first slice** — enough for a clean illustrated PNG at this render scale without inviting an accidentally huge export.

---

## T. Evidence Workflow

```text
COMPARISON_EVIDENCE_REQUIRED
```

A/B/C ship placement screenshots plus a wide harbor view and a closer ship/building comparison are the right minimum — this mirrors exactly what every prior Visual Pass review in this project has needed to make a scale/style judgment legible to the human reviewer, and a baseline comparison against the current mockup is the only way to verify "larger visual presence than current mockup" was actually achieved, not just asserted.

---

## U. Findings

```text
ID: AAP-01
Severity: Major
Finding: Neither the Director Gate nor the asset strategy specifies whether
  loader paths for public/-based assets must be document-relative (no
  leading "/") or explicitly prefixed with import.meta.env.BASE_URL. This
  project's vite.config.ts sets base to "/MyPage/world/" for production
  builds and preview, but "/" for local dev — a root-absolute loader path
  (e.g. "/assets/world/harbor/ship/hero-ship-v01.png") would silently work
  in local dev and silently 404 under `npm run preview` and on GitHub Pages.
Evidence: portfolio-world/vite.config.ts (base: command === "build" ?
  "/MyPage/world/" : "/"); package.json preview script hardcodes
  `--base /MyPage/world/`; grepped portfolio-world/src for BASE_URL,
  load.image, load.atlas, import.meta.env — zero matches, so there is no
  existing pattern in this codebase to follow.
Impact: If Codex's integration step picks the wrong convention, the hero
  ship (and every subsequent asset) would appear correctly in local dev and
  break invisibly the first time anyone runs `npm run preview` or deploys —
  exactly the deployment target this phase exists to serve.
Recommended action: Add one explicit line to the asset strategy (Section 21
  Runtime Integration) mandating document-relative loader paths, or a small
  resolveAssetPath() helper using import.meta.env.BASE_URL (Section N), and
  use it at every load.image() call site from the first integration commit
  onward.

ID: AAP-02
Severity: Minor
Finding: The proposed worldAssetManifest.ts schema (id, path, role,
  sourceType, provenance, licenseStatus, version, notes) does not reference
  or reconcile with docs/portfolio-world/07_ASSET_POLICY.md's existing
  Status field (CONCEPT / APPROVED / GAME_READY / DEPRECATED) or its
  Metadata list (Asset ID, 출처, 제작 방식, 라이선스, 수정 여부, 원본,
  game-ready 위치).
Evidence: docs/portfolio-world/07_ASSET_POLICY.md Sections "Status" and
  "Metadata"; reports/portfolio-world/art-asset-phase-01/01-asset-strategy.md
  Section 14.
Impact: Low risk now (only one manifest will exist), but the strategy's own
  Section 16 requires distinguishing a "candidate" from an "accepted runtime
  asset" — exactly what 07_ASSET_POLICY.md's Status field already models.
  Two independent, unreconciled status vocabularies would be confusing once
  more assets/phases accumulate.
Recommended action: Add a `status` field to worldAssetManifest.ts reusing
  07_ASSET_POLICY.md's CONCEPT/APPROVED/GAME_READY/DEPRECATED values, or
  explicitly note in the manifest file why a new vocabulary was chosen.

ID: AAP-03
Severity: Minor
Finding: The recommended folder public/assets/world/harbor/... builds to
  world/assets/world/harbor/... (build output is already named world/), a
  redundant repeated "world" segment.
Evidence: portfolio-world/vite.config.ts outDir: "../world"; confirmed via
  the currently-committed world/assets/.gitkeep and world/maps/.gitkeep,
  which are the direct build-copy of public/assets/.gitkeep and
  public/maps/.gitkeep.
Impact: Cosmetic only — fully functional either way.
Recommended action: Optional. public/assets/harbor/... (dropping the inner
  "world" segment) reads more cleanly; not required before proceeding.

ID: AAP-04
Severity: Minor
Finding: The current programmatic rendering style is already a hybrid
  perspective grammar — strict top-down ground/plaza/paths, frontal-facade
  buildings, and side-profile ships/boats — which neither the Director Gate
  nor the strategy document names explicitly when instructing the first
  slice to "lock" perspective grammar.
Evidence: harborVisualCatalog.ts drawHarborGround/drawHarborPlaza (flat
  top-down fills) vs. drawHarborBuilding (rectangular wall + frontal
  triangular roof) vs. drawBoat/drawLargeShip (hull triangle + vertical
  mast, a side-profile silhouette).
Impact: Without naming this explicitly, a produced PNG could adopt a
  different, internally-consistent-but-mismatched grammar (e.g. true
  isometric) that would clash with the remaining programmatic destinations
  and props still visible in the same scene.
Recommended action: State explicitly in the strategy or Director Gate that
  the first slice must preserve this exact hybrid (top-down ground/water,
  frontal building facade, side-profile ship), not introduce a different
  internally-consistent grammar.

ID: AAP-05
Severity: Minor
Finding: "~1.15x / 1.30x / 1.45x of current perceived size" is ambiguous
  between the ship's data footprint (280x80 px) and its actually-rendered
  silhouette, which is smaller than that footprint in several dimensions
  under the current drawLargeShip() implementation.
Evidence: worldLayoutData.json harbor-large-ship width/height = 280/80;
  harborVisualCatalog.ts drawLargeShip() draws the mast top at
  `top + visual.height * 0.1`, inside the box, not at its edge.
Impact: Low — a genuine but easily-resolved ambiguity that could cause the
  three scale candidates to be produced against inconsistent baselines if
  left to individual interpretation.
Recommended action: State the exact reference pixel values (footprint AND
  current rendered silhouette extent) in the asset scale spec from Section
  R, so all three candidates share one unambiguous starting point.
```

---

## V. Exact Recommended Director Gate Changes

1. Add one explicit sentence to `01-asset-strategy.md` Section 21 (Runtime Integration): loader paths must be document-relative (no leading `/`) or built through a small `resolveAssetPath()` helper using `import.meta.env.BASE_URL`; never a root-absolute string. (Closes AAP-01, the only finding blocking a clean gate.)
2. Optional, before or during implementation rather than blocking the gate: add a `status` field to the manifest spec reusing `07_ASSET_POLICY.md`'s existing vocabulary (AAP-02); state the exact reference pixel baseline for scale candidates (AAP-05); name the hybrid perspective grammar explicitly (AAP-04); consider dropping the redundant `world/` path segment (AAP-03).

No other change to the strategy's scope, priorities, or sequencing is needed.

---

## W. Decision Summary

```text
Hero Ship:      HERO_SHIP_STRATEGY_READY
First Slice:    FIRST_SLICE_READY
Format:         PNG_FIRST_APPROVED
Asset Path:     ASSET_PATH_READY
GitHub Pages:   GITHUB_PAGES_PATH_FIX_REQUIRED
Manifest:       ADD_MINIMAL_ASSET_MANIFEST
Source/Runtime: RUNTIME_ASSETS_ONLY_FOR_NOW
Fallback:       FALLBACK_STRATEGY_READY
Phaser:         SMALL_ASSET_HELPER_NEEDED
Depth:          CURRENT_DEPTH_MODEL_SUFFICIENT
Scale:          ADD_ASSET_SCALE_SPEC
Performance:    ADD_BASIC_ASSET_SIZE_BUDGET
```

Asset generation timing: `GENERATE_AFTER_DIRECTOR_GATE` — no strong reason found to generate an experimental sample before the gate; the strategy's own default is correct.

---

## X. Final Recommendation

```text
ASSET_STRATEGY_FIX_REQUIRED
```

One small, specific addition (the GitHub Pages loader-path rule, AAP-01) should be written into the strategy before Codex begins asset integration. Everything else in the strategy — hero-ship-first sequencing, visual/collision separation, PNG-first format, manifest scope, fallback approach, and first-slice scope — is ready as written, with four Minor refinements noted for the Director's discretion.
