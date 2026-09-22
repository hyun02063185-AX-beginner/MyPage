# Retro Harbor Campus — Visual Grammar Calibration Implementation

## A. Work Context

| Item | Value |
| --- | --- |
| Profile | `HOME_WINDOWS` |
| Machine Context ID | `06cd98a5-32c4-40db-a628-5416e4795ed6` |
| OS | `win32 x64` |
| Node / npm | `v24.16.0` / `11.13.0` |
| `LOGICAL_UNIT` | `32 px` |

## B. Git Base / Branch

- Branch: `feature/portfolio-world-sprint-02` (expected branch).
- Start HEAD: `ae9ba39`.
- Reconciliation commit: `842cd5b`.
- No merge to `main` was performed.
- Start status was dirty with untracked records only; no pre-existing tracked work was overwritten.

## C. Canonical Record Reconciliation

The only old untracked Art Bible and Calibration Director Gate copies were inspected under
`reports/art-direction/`. Their own declared canonical paths were the corresponding
`reports/portfolio-world/art-direction/` paths, which did not yet exist. They were moved
there without content changes. The following valid official, previously untracked records
were also staged explicitly and committed in `842cd5b`: Art Asset Phase 01 `00`, `01`, `03`,
and `06`, plus Visual Pass 5's human-feel-test record. No filename-only staging, `git add .`,
clean, or reset was used. The external pasted execution instruction is not a repository file
and was not committed.

## D. Calibration Architecture

Nine deterministic, project-owned transparent PNG candidates live in
`portfolio-world/public/assets/world/harbor/calibration/`. The reproducible generator is
`tools/portfolio-world/generate-calibration-assets.mjs`. It derives each candidate from one
subject geometry specification; `CAMERA_ELEVATION` alone adjusts the deck/roof plane.

`CALIBRATION_ASSETS` is loaded only when `import.meta.env.DEV` permits
`?assetCalibration=15|22.5|30`. The selected set replaces only Hero Ship D, Exhibition Hall,
and the existing warehouse visual; it never changes layout data or collision. The small
controlled surface is available only with `&assetPreview=calibration`; the existing harbor
preview uses `&assetPreview=harbor`.

## E. Controlled Variables

| Variable | Fixed contract |
| --- | --- |
| Camera yaw | `0°` |
| Object identity / heading | one deterministic design per subject; no runtime rotation |
| Target display size | Hero D `395 × 263`; Hall `340 × 227`; Warehouse `240 × 150` |
| Anchor | Hero hull/waterline; buildings' functional ground base |
| Palette | shared warm wood, cream canvas, brass, teal, plaster/stone, muted wall palette |
| Key light | implied warm upper-left key; neutral ambient fill; no dynamic runtime lighting |
| Shadow | fixed lower-right dark outline; hard pixel edge; local contact shadow strength `0` |
| Alpha / padding | RGBA PNG, transparent RGB initialized to `0,0,0`; source canvas and padding rule identical within a subject |
| Export | deterministic PNG/zlib level 9; provenance `generated-original` |

The only per-candidate visual parameter is elevation above horizontal: `15°`, `22.5°`, or
`30°`. The higher candidates expose more of the same deck/roof plane; neither subject
proportions, heading, palette, lighting, anchor, nor display target changes.

## F. 15° Assets

- `hero-ship-d-cal-15.png`
- `exhibition-hall-cal-15.png`
- `harbor-warehouse-cal-15.png`

## G. 22.5° Assets

- `hero-ship-d-cal-22-5.png`
- `exhibition-hall-cal-22-5.png`
- `harbor-warehouse-cal-22-5.png`

## H. 30° Assets

- `hero-ship-d-cal-30.png`
- `exhibition-hall-cal-30.png`
- `harbor-warehouse-cal-30.png`

## I. Hero Ship D Comparison

All three retain the same three-mast, profile-dominant hull, bow/stern, sail arrangement,
hull anchor, visible-width target, and mast silhouette. `15°` gives the least deck exposure;
`22.5°` gives a continuous clearly readable secondary deck plane; `30°` gives the greatest
deck exposure without reaching a bird's-eye view. At target size, the hull, sails, and teal
window band remain distinct; no critical micro-detail is used.

## J. Exhibition Hall Comparison

All candidates retain the same primary facade, entrance, windows, material blocks, base, and
width target. The roof plane increases from a shallow visible strip at `15°`, through a
balanced partial roof at `22.5°`, to the most visible roof at `30°`. The functional facade
remains dominant at each angle.

## K. Warehouse Comparison

The Warehouse repeats the Hall's camera grammar with a lower hierarchy: structural dark wood,
muted wall panels, cargo doors, and the same ground-base anchor. Its roof visibility tracks the
candidate elevation while its smaller `240 × 150` runtime envelope remains secondary.

## L. Visible-content Measurements

Source canvases are all `512 × 320`. Bounds below are measured alpha bounds, not canvas size.
Displayed bounds apply the actual independent Phaser width/height display scale.

| Asset | Trimmed source bounds (`x,y w×h`) | Display alpha bounds | Logical units | File |
| --- | --- | --- | --- | --- |
| Hero 15 | `17,24 479×266` | `369.5×218.6` | `11.55×6.83` | 4,112 B |
| Hero 22.5 | `17,24 479×266` | `369.5×218.6` | `11.55×6.83` | 4,119 B |
| Hero 30 | `17,24 479×266` | `369.5×218.6` | `11.55×6.83` | 4,162 B |
| Hall 15 | `35,116 443×168` | `294.3×119.2` | `9.20×3.72` | 1,952 B |
| Hall 22.5 | `35,104 443×180` | `294.3×127.7` | `9.20×3.99` | 2,095 B |
| Hall 30 | `35,88 443×196` | `294.3×139.0` | `9.20×4.34` | 2,196 B |
| Warehouse 15 | `50,120 433×165` | `203.0×77.3` | `6.34×2.42` | 2,505 B |
| Warehouse 22.5 | `50,120 433×165` | `203.0×77.3` | `6.34×2.42` | 2,499 B |
| Warehouse 30 | `50,106 433×179` | `203.0×83.9` | `6.34×2.62` | 2,610 B |

The Hall/Warehouse height changes are the measured result of the sole permitted variable:
increased top-plane exposure. Width (the primary visual-mass target) stays fixed.

## M. Anchors

- Hero Ship D: `setOrigin(0.5, 0.9)` against its fixed hull/waterline berth; mast and sail
  height never changes world placement.
- Exhibition Hall and Warehouse: `setOrigin(0.5, 0.9)` against their functional ground base;
  roof height never changes their layout coordinate.

## N. Lighting / Palette Constants

The exact shared palette is emitted by the generator: dark ink `#213840`, warm wood `#8b5637`,
wood light `#bf8252`, canvas `#eadab5`, brass `#c59b52`, teal `#2f7180`, plaster `#d9be91`,
muted wall `#9da49a`, and roof `#7b5c58`. It harmonizes with `visualPalette.ts` without
attempting a new palette experiment. All raster transparent pixels are zeroed; the alpha QA
found no colored matte field behind visible edges.

## O. Controlled Scene

The dev-only controlled surface shows all three subjects side by side over identical warm
ground, water, dock edge, labels, scale reference, and lighting. It is intentionally a fixed
comparison surface, not an editor or an end-user selector.

## P. Actual Harbor Scene

The same selected three textures replace the matching harbor visuals at their existing world
coordinates. Harbor preview centers and zooms only in development so Warehouse, Exhibition
Hall, and Hero Ship D are visible together; no world dimensions, positions, fleet data, routes,
or collision rectangles changed. Visual inspection covered all angles: the 30° roof/deck
increase remains legible and the three subject scales remain differentiated.

## Q. Dev-only Comparison Mechanism

Use either controlled URL, then replace the value with `15`, `22.5`, or `30`:

```text
http://127.0.0.1:5173/?assetCalibration=22.5&assetPreview=calibration
http://127.0.0.1:5173/?assetCalibration=22.5&assetPreview=harbor
```

Browser inspection was available and completed. Its screenshot API can render evidence to the
verification session but has no supported project-file export, so persistent files named
`calibration-controlled-*.png` / `calibration-harbor-*.png` are deliberately not claimed.
The deterministic URLs above are the retained comparison method.

## R. Production Safeguard

`getCalibrationAngle()` immediately returns `undefined` outside `import.meta.env.DEV`.
The production bundle was searched after build and contains no `assetCalibration` string or
query handling. Calibration textures remain published static files, but production cannot
select or render them through a URL.

## S. Asset Metrics / Weight Experiment

The 512×320 source-quality PNGs total `26,250 B` for all nine candidates. A temporary nearest-
neighbor display-size PNG experiment measured: Hero `4,419–4,442 B`, Hall `1,405–1,557 B`, and
Warehouse `1,863–1,990 B`. Source-quality is retained: it is already tiny, preserves clean
edges, and is no heavier for Hero. The later production budget should be chosen after a
human-approved style is locked, but this calibration supports keeping simple 512px master
exports where they remain below a practical 5 KB class benchmark.

## T. Alpha / Padding QA

Each output is true RGBA PNG with a transparent background. Alpha bounds were measured directly,
not inferred from canvas dimensions. The generator starts transparent pixels at zero RGB and
draws crisp opaque edges, avoiding hidden-RGB halos and matte fringe. The shared 512×320 canvas
is deliberate anchor normalization; visible-content measurements above are the scale source.

## U. BASE_URL / Production Preview

The manifest uses `${import.meta.env.BASE_URL}${asset.path}`. Production preview verified:

- `200` — `/MyPage/world/`
- `200` — `/MyPage/world/assets/world/harbor/calibration/hero-ship-d-cal-15.png`
- `404` — root-absolute `/assets/world/harbor/calibration/hero-ship-d-cal-15.png`

## V. Automated QA

- `npm ci` — PASS (20 packages audited; 0 vulnerabilities).
- `npm run typecheck` — PASS.
- `npm test` — PASS, 12/12 tests.
- `npm run build` — PASS (`1,418.03 kB`, gzip `368.38 kB`; pre-existing chunk-size warning remains).
- `git diff --check` — PASS.
- `node tools/portfolio-world/work-context.mjs` — branch/profile/machine context match.

## W. Regression Protection

No layout JSON, world dimensions, IA, collision geometry, destination positions, reserved lots,
player controls, service-jetty collision, root portfolio pages, or GitHub Pages deployment model
was changed. Existing non-calibration play continues to use Hero D and the prior Exhibition Hall
asset. Calibration is visual and development-only.

## X. Known Limitations

- This controlled pass intentionally uses a compact 16-bit-inspired calibration treatment, not
  final mass-production artwork.
- Existing general depth/y-sort follow-up remains deferred as instructed. The dev calibration
  gives Hero D a fractional foreground depth only to prevent the pre-existing secondary fleet
  from visually crossing its hull during the comparison; it is not a depth-system rewrite.
- Persistent screenshot files could not be written through the available browser evidence API.

## Y. Human Decisions Required

```text
FINAL CAMERA ELEVATION = NOT SELECTED
```

Please select one common elevation after comparing the controlled and harbor URLs. Mass asset
production remains on hold, as do the final visual grammar lock and later depth/occlusion work.

## Z. Gate

```text
READY_FOR_VISUAL_GRAMMAR_HUMAN_CALIBRATION
```
