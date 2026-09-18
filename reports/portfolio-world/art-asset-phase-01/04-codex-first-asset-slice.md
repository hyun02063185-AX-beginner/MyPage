# Portfolio World — Art Asset Phase 01 First Asset Slice
## Retro Harbor Campus

## A. Work Context

- Profile / machine context: `HOME_WINDOWS` / `06cd98a5-32c4-40db-a628-5416e4795ed6`
- OS: `win32 x64`; Node / npm: `v24.16.0` / `11.13.0`
- Base: `325ffc7`; branch: `feature/portfolio-world-sprint-02`
- Start worktree: dirty only from supplied, untracked phase records (`00-director-gate.md`,
  `01-asset-strategy.md`, `03-director-gate.md`, and Visual Pass 5 human record). They
  were read but not modified or staged by this implementation.

## B. Git

- Runtime implementation commit: `8c17eda` — `feat(portfolio-world): add first harbor art asset slice`.
- Runtime follow-up: `2a5d923` — `fix(portfolio-world): keep ship comparison dev-only`.
- Documentation commit: `b23fedd` — `docs(portfolio-world): record first art asset slice`.
- `git push origin feature/portfolio-world-sprint-02`: successful (`325ffc7..8c17eda`).
- Only intentional runtime assets, source, test, committed build output, and canonical
  records were staged. Supplied execution-only records remain excluded.
- Final worktree: only the four supplied, untracked execution records remain.

## C. BASE_URL Asset Loading

- `worldAssetManifest.ts` resolves every public asset as
  ```${import.meta.env.BASE_URL}${asset.path}```. No runtime path begins with `/assets`.
- `BootScene` uses Phaser's native `load.image()` for the selected hero candidate and
  Exhibition Hall; no generic asset manager was introduced.
- Development resolves to `/assets/world/...`; production resolves to
  `/MyPage/world/assets/world/...`.
- Production-preview verification returned HTTP 200 for each base-prefixed asset and 404
  for the deliberately incorrect root-absolute `/assets/...` request.

## D. Asset Manifest

`portfolio-world/src/world/worldAssetManifest.ts` is the first minimal asset manifest.
It records id, stable texture key/path, role, source type/provenance, policy-aligned
status, version, notes, source size, display size, and origin. All assets are
`generated-original` and `CONCEPT`, matching `07_ASSET_POLICY.md` rather than inventing
a parallel lifecycle.

## E. Asset Inventory

| ID | Runtime filename | Source dimensions | Bytes | Runtime display | Key | Provenance / status |
| --- | --- | ---: | ---: | --- | --- | --- |
| Hero A | `hero-ship-a-v01.png` | 1448 × 1086 | 1,200,698 | 360 × 270 | `harbor-hero-ship-a-v01` | generated-original / CONCEPT |
| Hero B | `hero-ship-b-v01.png` | 1536 × 1024 | 2,085,794 | 440 × 293 | `harbor-hero-ship-b-v01` | generated-original / CONCEPT |
| Hero C | `hero-ship-c-v01.png` | 1536 × 1024 | 2,197,335 | 510 × 340 | `harbor-hero-ship-c-v01` | generated-original / CONCEPT |
| Exhibition | `exhibition-hall-v01.png` | 1536 × 1024 | 2,065,219 | 310 × 207 | `harbor-exhibition-hall-v01` | generated-original / CONCEPT |

All are transparent PNGs under `portfolio-world/public/assets/world/harbor/`.

## F. Hero Ship A/B/C

- Candidate A is conservative: compact hull mass and two-sail visual envelope, targeted
  near 1.15× the mockup's perceived presence.
- Candidate B is the default target comparison: longer, fuller two-mast hull/sail mass,
  targeted near 1.30×.
- Candidate C is deliberately bold: longest hull, three masts, and largest sail area,
  targeted near 1.45×. It demonstrates the point at which the landmark begins to compete
  strongly with the waterfront.
- This is one coherent warm wood / ivory sail / teal trim design language, with meaningful
  silhouette changes rather than uniform PNG scaling.
- The logical hull anchor is the existing `harbor-large-ship` placement `(1420, 1236)`;
  assets render at `(1420, 1254)` with `originX = 0.5`, `originY = 0.84`. This holds hull
  alignment stable while sails/masts extend upward. Collision and vessel containment data
  are not derived from PNG bounds and remain unchanged.
- Development comparison URLs: `?heroShip=a`, `?heroShip=b`, and `?heroShip=c`; append
  `&assetPreview=harbor` for the fixed-camera QA frame. These parameters are explicitly
  dev-only; production always selects B and ships no selector UI.

## G. Exhibition Hall

`exhibition-hall-v01.png` replaces only the Gallery programmatic building silhouette when
loaded. It keeps the same IA coordinate and its destination label at depth 8. The asset
uses the locked mixed grammar: visible facade plus slight roof/footprint, with ivory stone,
terracotta roof, dark teal entry, and waterfront presentation cues.

## H. Water / Dock Context

Water, dock, pier, mooring, and collision geometry deliberately retain the Pass 5 static
programmatic treatment. The immediate context already provides the required teal water,
edge/wave rhythm, plank/rope language, and width-aware pier decoration; this is the
approved lightweight asset/programmatic hybrid, not a water-system rebuild.

## I. Programmatic Fallback

When the selected ship or Exhibition texture exists, `WorldScene` skips only that matching
programmatic renderer. If loading fails or an asset is absent, the existing renderer remains.
No object is intentionally double-rendered.

## J. Layout / Collision Preservation

World dimensions, destination coordinates, harbor visual data, water collisions, vessel
containment, overlap protections, reserved lots, dock walkability, player movement, and
HTML UI are unchanged. Visual bounds are intentionally independent of collision bounds.

## K. Perspective Grammar

The slice preserves the locked practical grammar: top-down/slight-isometric environment,
top-down footprint plus facade Exhibition Hall, and profile-biased hero ship with visible
deck and vertical mast/sail silhouette.

## L. QA

- `npm ci`: PASS after diagnosing and stopping exact stale preview processes for this same
  project that had locked Vite's Windows native binding. The initial `EPERM` was not hidden.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 9/9 tests, including BASE_URL/public-asset contract coverage.
- `npm run build`: PASS.
- `git diff --check`: PASS.
- Development asset loading: PASS at `http://127.0.0.1:4323/` (port 5173 was unavailable
  with an environment `EACCES`; port 4323 was used after that diagnosis).
- Existing spatial, bounds, lots, vessel, water collision, pier, and dock regression tests
  remain in the suite and pass.

## M. Production Preview / GitHub Pages Path Verification

- Production preview: HTTP 200.
- The `/MyPage/world/` scene plus all four public image URLs returned HTTP 200.
- A root-absolute `/assets/world/harbor/ship/hero-ship-b-v01.png` request returned 404,
  confirming the test was actually exercising the GitHub Pages base-path difference.

## N. Performance

- First-slice repository asset weight: 7,549,046 bytes.
- Normal runtime texture count: 2 (default B and Exhibition). A/C are loaded only when their
  comparison query is requested; comparison routes still use two textures each.
- Main JS: 1,412.84 kB; gzip: 367.32 kB.
- The PNG candidates are deliberately retained at source fidelity for this review slice;
  their total 7.55 MB footprint should be reassessed when the human selects a canonical
  scale before broad asset rollout.

## O. Evidence

Live production-preview inspection covered the A/B/C harbor frame and Exhibition Hall:
A is balanced, B is a strong target landmark, and C is intentionally near/over the
dominance boundary. The available browser QA surface displayed the actual runtime canvas
but cannot persist screenshots as requested temporary files, so no evidence images were
added to the repository or runtime assets.

## P. Existing Portfolio Protection

No root portfolio page, root package policy, IA, world dimensions, collision architecture,
or GitHub Pages deployment model changed. `portfolio-world/` remains source and `world/`
remains committed build output.

## Q. Known Issues

- The first-slice PNG set is 7.55 MB total. It is appropriate for a focused visual review
  but must be optimized/reduced after asset selection before a broad rollout.
- The existing Phaser JavaScript chunk remains over Vite's advisory threshold.

## R. Human Decision Required

Final hero-ship scale is deliberately **not selected**. Human review must choose A, B, C,
or request a tuned follow-up based on ship presence, Exhibition Hall legibility, harbor
balance, and overall portfolio-world feel.

## S. Gate

```text
READY_FOR_ASSET_SLICE_INDEPENDENT_REVIEW
```
