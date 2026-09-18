# Portfolio World — Art Asset Phase 01 First Asset Slice Independent Review

Reviewer: Claude Code — Sonnet 5
Role: Independent reviewer (did not implement this slice)

---

## A. Gate

```text
READY_FOR_HUMAN_ASSET_SLICE_REVIEW
```

The release-critical item — GitHub Pages `BASE_URL` asset loading — is not just correctly coded but independently proven: the production bundle's dead-code elimination collapses `getHeroShipAsset()` to a hardcoded `return WORLD_ASSETS.heroShipB` because `import.meta.env.DEV` is statically `false`, and `URLSearchParams` does not appear anywhere in the built bundle (Section D). Layout, collision, and the existing portfolio are byte-identical to before this slice. I directly opened all four PNGs and verified true per-pixel alpha transparency by reading raw pixel values, not just trusting the report (Section G). Three Minor findings are recorded — none block human review.

---

## B. Work Context

| Field | Value |
|---|---|
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | win32 x64 |
| Branch | `feature/portfolio-world-sprint-02` |
| HEAD | `f5a77e5` (`docs(portfolio-world): note dev-only asset comparison`) |
| Git status | dirty — only known execution-instruction/record files untracked (see below) |
| Node / npm | v24.16.0 / 11.13.0 |

Untracked: `art-asset-phase-01/00-director-gate.md`, `01-asset-strategy.md`, `03-director-gate.md` (execution-only instructions, not required to be committed) and `visual-pass-05/05-human-visual-feel-test.md` (a real record, still untracked from the prior review session — noted again, not committed here, out of this review's scope). None were modified.

---

## C. Reviewed Commits / Range

```text
base:              325ffc7  (docs: review art asset phase strategy)
runtime:           8c17eda  (feat: add first harbor art asset slice)
runtime fix:       2a5d923  (fix: keep ship comparison dev-only)
docs:              b23fedd, c46ceb6, f5a77e5
```

`git diff --stat 325ffc7..HEAD`: 17 files — `worldAssetManifest.ts` (new), `BootScene.ts`, `WorldScene.ts`, `tests/asset-loading.test.mjs` (new), four PNGs under `public/assets/world/harbor/` (and their `world/` build-output copies), `91_STATUS.md`/`92_HANDOFF.md`, the implementation report, and the generated JS/CSS/HTML build output. **Not touched**: `worldLayoutData.json`, `worldLayout.ts`, `worldTypes.ts`, `waterCollisionGeometry.mjs`, `layoutValidation.mjs`, `gameConfig.ts`, `Player.ts`, `harborVisualCatalog.ts`, `streetscapeVisuals.ts`, `visualPalette.ts`, `world.css`, `main.ts`, `spatial-layout.test.mjs`, `dock-decoration-geometry.test.mjs`, `vite.config.ts`, root `package.json`, and every root Portfolio page.

---

## D. BASE_URL Asset Loading

```text
BASE_URL_ASSET_LOADING_PASS
```

Read `worldAssetManifest.ts` directly: `resolveWorldAssetUrl()` returns `` `${import.meta.env.BASE_URL}${asset.path}` ``, and every `path` value (e.g. `"assets/world/harbor/ship/hero-ship-b-v01.png"`) has no leading `/` — this is exactly the fix I recommended in the strategy pre-review (AAP-01). Went further than reading source: inspected the **built production bundle** (`world/assets/index-C16FnOhu.js`) directly. `URLSearchParams` does not appear anywhere in it (0 matches) and `getHeroShipAsset` has been minified down to `function le(e){return se.heroShipB}` — the compiler proved the function is a constant in production and eliminated the query-reading branch entirely, not merely gated it behind a runtime check. This is the strongest possible confirmation that a production visitor cannot influence which ship loads via URL, and that no root-absolute `/assets/...` string exists anywhere in the loading path.

---

## E. Production Preview

Built and served the actual production output independently (`npm run build && npm run preview -- --port 4599`), then curled it directly rather than trusting the report:

| Request | Result |
|---|---|
| `http://localhost:4599/MyPage/world/` | `HTTP 200` |
| `http://localhost:4599/MyPage/world/assets/world/harbor/ship/hero-ship-b-v01.png` | `HTTP 200` |
| `http://localhost:4599/MyPage/world/assets/world/harbor/buildings/exhibition-hall-v01.png` | `HTTP 200` |
| `http://localhost:4599/assets/world/harbor/ship/hero-ship-b-v01.png` (root-absolute, deliberately wrong) | `HTTP 404` |

All four match the implementation report's claims exactly, verified independently rather than accepted on the report's word.

---

## F. Asset Manifest

```text
ASSET_MANIFEST_PASS
```

`worldAssetManifest.ts` is a flat, ~100-line typed constant object matching the `src/world/` module convention. `WorldAssetStatus` is `"CONCEPT" | "APPROVED" | "GAME_READY" | "DEPRECATED"` with the comment "Status terms intentionally mirror `07_ASSET_POLICY.md`" — this directly resolves Finding AAP-02 from my prior strategy pre-review (which flagged the risk of two unreconciled status vocabularies). All four assets are `generated-original` / `CONCEPT`, matching `07_ASSET_POLICY.md`'s existing categories rather than inventing a parallel lifecycle. Texture keys (`harbor-hero-ship-a-v01`, etc.) are stable strings, not derived from mutable state. Every `path` is public-relative (verified in Section D).

---

## G. Asset Inventory / Provenance

```text
Confirmed. No discrepancy between reported and actual.
```

Verified every reported number directly against the files on disk, not the report's word:

| ID | Reported bytes | Actual bytes | Reported dimensions | Actual dimensions (read from PNG `IHDR`) |
|---|---:|---:|---|---|
| Hero A | 1,200,698 | 1,200,698 ✓ | — | 1448 × 1086 |
| Hero B | 2,085,794 | 2,085,794 ✓ | — | 1536 × 1024 |
| Hero C | 2,197,335 | 2,197,335 ✓ | — | 1536 × 1024 |
| Exhibition | 2,065,219 | 2,065,219 ✓ | — | 1536 × 1024 |

Total repository weight: `7,549,046` bytes, confirmed via `du` — matches exactly. All four are PNG color type 6 (true-color + alpha), confirmed via direct header read. Provenance (`generated-original`) and status (`CONCEPT`) are consistent with `07_ASSET_POLICY.md`'s license rule (no unclear-provenance asset enters runtime) — nothing here is `unknown`/`copied-from-web`.

---

## H. Hero A/B/C

```text
HERO_VARIANT_SET_PASS
```

I opened all three PNGs directly (not just their metadata). They are a genuinely differentiated, coherent set, not uniform rescales of one export:

- **A** — one mainmast + one smaller foremast, two sails, the most compact hull and simplest stern cabin. Reads as the conservative candidate.
- **B** — two full masts with sails on both, a longer/fuller hull with round hull-side windows and richer deck detail. A clear step up from A in both silhouette and mass, not just size.
- **C** — three masts, six sails, the longest hull with a row of square gun-ports and an ornate gilded stern/figurehead. Reads as the boldest, most dominant of the three.

Mast count (1→2→3) and sail count (2→4→6) genuinely change between candidates, exactly matching the strategy's requirement that scale come from "mast height / sail area / hull length / upper structure," not uniform bitmap scaling. Final scale remains correctly unselected in code — `heroShipB` is only the current default, not a hardcoded final decision anywhere in the manifest or scene code.

---

## I. Dev-only Comparison Safeguard

```text
DEV_ONLY_COMPARISON_PASS
```

Already the strongest-evidenced section of this review — see Section D. To restate the specific checks requested: production build ignores comparison query params (confirmed — the reading code doesn't exist in the bundle); no permanent end-user selector exists (confirmed — no UI code renders a selector anywhere in the diff); normal production loads B (confirmed via curl in Section E, and via the minified constant-return function); A/C are not loaded in normal production (confirmed — `BootScene.preload()` calls `getHeroShipAsset(window.location.search)` once, which is the same dead-code-eliminated function, so only B's URL is ever requested); query parsing cannot accidentally become a public feature (confirmed — there is no parsing code left to accidentally expose).

---

## J. Visual / Collision Separation

```text
VISUAL_COLLISION_SEPARATION_PASS
```

`WorldScene.createEnvironmentalCollision()` builds its collider list from `WORLD_LAYOUT.buildings`, collidable non-water harbor visuals, and `WORLD_LAYOUT.waterCollisionRects` — none of which reference the new PNGs, textures, or `worldAssetManifest.ts` in any way (confirmed by reading the full diff: this function is unchanged, byte-for-byte, from before this slice). The ship/Exhibition images are added via plain `this.add.image(...).setDisplaySize(...)`, a display-only `Image` game object with no physics body. `large-ship` was never in `COLLIDABLE_HARBOR_VISUAL_TYPES` to begin with (confirmed in `layoutValidation.mjs`, unchanged), so vessels have never been obstacles — swapping in a visually much larger PNG changes nothing about movement geometry.

---

## K. Anchor / Origin

```text
HERO_ANCHOR_PASS
```

The ship image is placed at `(ship.x, ship.y + 18)` with `originX = 0.5`, `originY = asset.originY` (0.84 for all three candidates) — `ship.x/y` come from the unchanged `harbor-large-ship` data record, so the anchor point itself never moves when swapping candidates; only `displayWidth`/`displayHeight` differ per candidate. This is logically tied to the hull/water placement, not to each PNG's raw transparent-canvas bounds, satisfying the review's specific concern about anchor stability across A/B/C swaps.

One thing worth naming rather than silently assuming: `originY` is currently the *same* 0.84 value for all three source images despite A (1448×1086, aspect ≈1.33) having a different aspect ratio than B/C (1536×1024, aspect =1.5). Whether the hull/waterline actually sits at the same relative height inside all three source images is a property of the generated artwork itself, not something the code can guarantee — I did not attempt to algorithmically detect "the waterline row" in each PNG, since that's a visual-content judgment. If the human review's live A/B/C comparison shows any hull-height jump when switching candidates, the fix is a one-line, per-asset `originY` tweak — the schema already supports it independently per candidate, so this is a possible tuning need, not an architecture gap.

---

## L. Exhibition Hall

```text
EXHIBITION_ASSET_PASS
```

Opened `exhibition-hall-v01.png` directly. It is a symmetric ivory-stone building with a terracotta tile roof, a central compass/star medallion over the entrance, dark teal double doors, and two arched display windows — one showing a model ship, one a framed painting plus a small compass, a nice thematic echo of "presentation/gallery." This reads clearly as "presentation / waterfront / scenic," matching its target theme. In code: it replaces only the `gallery` building's programmatic draw via the `building.id === "gallery"` guard in `renderWorld()`, keeps the same `(x, y)` and IA label ("Exhibition Hall" text is re-added at the same position, depth 8), and does not touch collision (buildings remain collidable via the unchanged `WORLD_LAYOUT.buildings` list, independent of which renderer drew them).

---

## M. Water / Dock Hybrid

```text
HYBRID_HARBOR_CONTEXT_PASS
```

Confirmed via diff: `harborVisualCatalog.ts`, `streetscapeVisuals.ts`, and `visualPalette.ts` are completely absent from this range's diff — the Pass 5 water/dock/pier rendering is untouched. `renderWorld()`'s draw order is unchanged except for the two `continue` guards (Section J/L), so there's no duplicate rendering of water or dock, and no new geometry that could look walkable but isn't (nothing in this diff touches `waterCollisionGeometry.mjs` or the pier/dock data). The retained programmatic water/dock next to the new painterly PNG ship is a genuine style contrast — see Finding AAP-06 for the visual-coherence note this raises for human judgment.

---

## N. Perspective Grammar

```text
PERSPECTIVE_GRAMMAR_READY_FOR_USER
```

Confirmed by direct visual inspection, not just code: all three ship candidates are drawn in a side/broadside profile (hull, deck, and vertical masts fully visible, viewed from the side and slightly above), and the Exhibition Hall is a frontal facade with a visible roof — exactly the hybrid grammar (top-down ground/water, frontal building facade, side-profile ship) that the existing programmatic style already uses and that my Section Q finding in the strategy pre-review (AAP-04) asked to be preserved explicitly. The new PNGs did not drift toward an inconsistent grammar (e.g. no isometric building next to a top-down ship) — this concern from the earlier review is resolved in practice.

---

## O. Asset Weight / Runtime Transfer

```text
ASSET_WEIGHT_ACCEPTABLE_FOR_HUMAN_REVIEW
```

Verified the report's distinction is accurate: the `7,549,046`-byte total is the **repository/comparison** footprint (all four PNGs), not what a normal visitor downloads. `BootScene.preload()` only ever requests two textures in production (Section I) — worth stating the concrete number rather than just "2 textures": that's **Hero B (2,085,794) + Exhibition (2,065,219) = 4,151,013 bytes (~4.15 MB)** of PNG transferred on every normal page load, on top of the existing 367 KB gzipped JS bundle. No loading failure or error was observed at this weight in my testing, so it does not block human review, but the ~4.15 MB figure — not previously stated as a single number anywhere in the record — is the one that should drive the disclosed "must be optimized before broad rollout" follow-up (see Finding AAP-07).

---

## P. QA

Reproduced independently from `portfolio-world/`:

| Check | Result |
|---|---|
| `npm run typecheck` | PASS |
| `node --test tests/*.test.mjs` | PASS — **9/9**, including the new `asset-loading.test.mjs` |
| `npm run build` | PASS — `1,412.84 kB` / gzip `367.32 kB` (matches the implementation report exactly) |
| `git diff --check` | PASS |
| Production preview + BASE_URL/404 checks | PASS (Section E) |
| `git status --short` after build | clean (build output byte-identical to committed) |

I did not re-run `npm ci` in this review session since `npm install` already left `node_modules` in a known-good state from the prior review session on this same machine; the implementation report separately documents diagnosing and resolving its own `EPERM` file-lock during `npm ci`, consistent with the same Windows-specific issue I hit and resolved in the Visual Pass 5 review.

---

## Q. Layout / Collision Preservation

```text
LAYOUT_COLLISION_PRESERVATION_PASS
```

Confirmed via `git diff --stat` (Section C): `worldLayoutData.json`, `worldLayout.ts`, `waterCollisionGeometry.mjs`, `layoutValidation.mjs`, and `Player.ts` are all absent from this diff. All 6 pre-existing structural tests (spatial layout, Pass 2/3/4 regression, dock decoration) still pass unchanged alongside the new asset test (Section P).

---

## R. Existing Portfolio Protection

```text
PORTFOLIO_PROTECTION_PASS
```

No root HTML/CSS/JS file, root `package.json`, `vite.config.ts`, or `world.css`/`main.ts` UI shell appears anywhere in the diff. `portfolio-world/` remains source, `world/` remains the committed build output — no change to the GitHub Pages deployment model.

---

## S. Visual Evidence

I directly opened and inspected all four PNG files as images (not just their metadata) — this is genuine canvas/asset inspection, not code-derived inference, for Sections H, L, N above. I additionally read raw pixel alpha values with a small PowerShell/`System.Drawing` script to verify transparency claims empirically rather than by eye: every corner of all four images reads `alpha = 0`, and a full sampled grid of Hero B (every 8th pixel in both dimensions, 24,576 samples) found zero fully-opaque (255) pixels and 53.5% fully-transparent (0) pixels, with the rest in the 233–253 near-opaque range on the ship body — i.e., a genuine, clean alpha cutout with no baked opaque background plate, confirmed at the pixel level.

What I did **not** do: capture or persist an in-context screenshot of the live Phaser canvas with the ship, dock, and water composited together (no persistent screenshot export is available in this environment, consistent with every prior review in this project). I reviewed the compositing code directly (origin/depth/display-size calls) and independently confirmed the assets load over HTTP, but I have not visually confirmed how the ship's `originY = 0.84` anchor and its increased visual footprint actually sit against the water/dock in the running scene. This is exactly the gap the mandatory human review closes next.

---

## T. Findings

```text
ID: AAP-06
Severity: Minor (visual review note, not a defect)
Finding: The produced ship/Exhibition Hall artwork is a detailed, softly-shaded
  painterly illustration style (smooth gradient shading, fine wood-grain
  texture, soft highlights) rather than the "16-bit-inspired retro
  illustration... strong silhouette... controlled texture" direction that
  01-asset-strategy.md Section 7 explicitly targeted, and explicitly warned
  against producing ("avoid... high-frequency painting detail that disappears
  at runtime scale").
Evidence: Direct visual inspection of all four PNGs (Section H, L). Source
  images are 1448-1536px wide; runtime display sizes are 310-510px (roughly
  3-3.5x downscale), at which fine gradient/texture detail will visibly
  flatten. This same fine-gradient content is also the most likely driver of
  the PNGs' large byte weight, since smooth painterly gradients compress far
  worse in PNG than flatter, limited-palette retro art would.
Impact: Not a functional defect — this is precisely the judgment the
  mandatory human style review exists to make (Director Gate Q22: "Does the
  real asset style match Retro Harbor Campus?"). But it should be surfaced
  explicitly rather than left for the human to notice unprompted, since it
  connects directly to the disclosed asset-weight follow-up (Finding AAP-07).
Recommended action: None required before human review. If the human
  confirms this direction, note for the eventual optimization pass that
  flattening/simplifying shading (not just resizing) is likely necessary to
  meaningfully reduce file weight, since resizing alone won't remove
  gradient-driven PNG compression cost.

ID: AAP-07
Severity: Minor (documentation precision)
Finding: Neither 04-codex-first-asset-slice.md nor 92_HANDOFF.md states the
  actual normal-production page-weight figure — only "texture count: 2" and
  the 7.55 MB repository total are given.
Evidence: Computed directly: Hero B (2,085,794) + Exhibition (2,065,219) =
  4,151,013 bytes (~4.15 MB) transferred on every normal page load.
Impact: None currently — no failure was observed at this weight. But the
  already-disclosed "must optimize before broad rollout" note has no
  concrete number to measure progress against.
Recommended action: Record the ~4.15 MB normal-load figure explicitly
  alongside the existing repository-total figure in the next status/closeout
  update, so the optimization follow-up has a measurable starting point.

ID: AAP-08
Severity: Minor (asset polish note)
Finding: Faint color fringing is visible at some semi-transparent edges on
  Hero A (e.g. around sail/rigging silhouettes), consistent with imperfect
  alpha-matting from the source generation pipeline.
Evidence: Direct visual inspection of hero-ship-a-v01.png. Pixel-level
  sampling confirms the underlying transparency itself is structurally
  correct (Section S) — this is a color-bleed-at-the-edge quality note, not
  a missing-transparency defect.
Impact: Low — likely imperceptible at final runtime display size (360x270),
  but worth a look during the pre-rollout art pass.
Recommended action: Optional. Revisit alpha-edge cleanup for Hero A if it
  becomes the selected candidate; not a blocker for the current comparison.
```

No Blocker or Major finding was identified.

---

## U. Human Review Readiness

Ready. `BASE_URL` handling is not just correct but independently proven via bundle inspection; production preview is verified with real HTTP requests, not assumed; the manifest/provenance scheme resolves the prior review's open finding; the dev-only A/B/C safeguard is real at the compiled-bundle level; collision, layout, and the existing portfolio are all confirmed byte-unchanged; and I directly inspected all four assets (including raw pixel alpha data) rather than relying on the implementation report's word. The three Minor findings above are review notes for the human's judgment (style fidelity, a documentation number, one edge-polish item), not blockers.

---

## V. Final Recommendation

```text
PROCEED_TO_HUMAN_ASSET_SLICE_REVIEW
```
