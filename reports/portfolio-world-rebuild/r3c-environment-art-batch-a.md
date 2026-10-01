# R3C Environment Art Batch A — Foundation / Spatial Art

## Scope and result

Batch A is complete. It adds a deterministic L1 foundation treatment to the
approved R3A/R3A.1 `GrayboxScene`; it does not introduce a scene plate, new
collision source, architecture, Hero Ship art, props, or changed gameplay
geometry. The graybox rectangles remain the source of truth:

| Foundation asset | World rectangle | Treatment |
| --- | --- | --- |
| Upper plaza paving | `(310,155) 780×345` | warm broad limestone slabs, restrained perimeter accent |
| Main stair surface | `(650,480) 260×190` | eight real stair bands only, high-contrast risers |
| Lower quay paving | `(300,650) 890×285` | slightly darker, broad limestone slab family |
| Quay edge face | `(300,935) 890×25` | shallow stone face that makes the existing water limit explicit |

The generated studies were reviewed as material language only. Their raster
pixels are not loaded by Phaser and never participate in collision.

## Study provenance (raw originals intentionally untracked)

| Study | Original local path | Dimensions | File size | SHA-256 | API result |
| --- | --- | ---: | ---: | --- | --- |
| A — Gameplay-first | `output/codyssey-image-benchmark/r3c-foundation-batch-a-rerun-01/A-clean-gameplay-first.gemini-2.5-flash-image.png` | 1024×1024 | 1,318,462 B | `cf0e1688132b2cc06e6c45fc6f38a9bd537f9e52cefc9d02d6170d421bca5826` | HTTP 200, `gemini-2.5-flash-image` |
| B — Premium-richness | `output/codyssey-image-benchmark/r3c-foundation-batch-a-rerun-01/B-richer-premium.gemini-2.5-flash-image.png` | 1024×1024 | 1,415,035 B | `d591233222dce1767f720b6aedfe377c81f859b9cf8b91c4a128a0c1f6a4996e` | HTTP 200, `gemini-2.5-flash-image` |

Original returned PNG bytes and request metadata are retained locally in the
ignored Batch A output directory. The committed
`evidence/r3c-foundation/foundation-study-contact-sheet.png` is the canonical
review reference; it contains both studies plus the deterministic runtime read.

## Evidence and QA

Canonical evidence is `reports/portfolio-world-rebuild/evidence/r3c-foundation/`:

- `A-upper-plaza.png`, `B-stairs-top.png`, `C-stairs-bottom.png`, and
  `D-lower-quay.png` — fixed 1280×720 spatial checks.
- `E-player-plaza.png`, `F-player-stairs.png`, and `G-player-quay.png` —
  active player movement reads on each foundation surface.
- `foundation-study-contact-sheet.png` — Study A, Study B, and runtime read.
- `qa-result.json` and `movement-plaza-stairs-quay-30fps.mp4` — automated
  browser/regression evidence.

`npm run typecheck`, `npm run build`, and `npm run qa:foundation` passed. The
foundation QA confirmed the unchanged route claims, building/ship/water/rail
collision assertions, both stair directions, water exclusion, 300×180 camera
dead-zone, camera follow, matching directional walk animations, return to idle,
and zero browser/console errors at 1280×720. Vite's existing bundle-size warning
was non-fatal.

## Human alignment review

| Check | Result | Note |
| --- | --- | --- |
| Paving clarity | PASS | Large slabs stay legible at player scale. |
| Stair readability | PASS | Only the eight real bands read as steps. |
| Upper/lower level distinction | PASS | Lighter plaza and darker quay separate the two levels. |
| Quay edge readability | PASS | The shallow face and rail clearly terminate ground at water. |
| Player visibility | PASS | The 56×80 player remains high-contrast on every surface. |
| Visual quality | CAUTION | This is controlled foundation art, not final architectural finish. |
| Mediterranean style consistency | PASS | Warm limestone, restrained terracotta accent, and turquoise water align. |
| Clutter / fake collision risk | PASS | No props, ornaments, or non-route step lines were added. |

This report does not self-approve the Human Gate and does not select an
architecture direction. Batch B remains blocked pending human alignment review.

```text
R3C_FOUNDATION_BATCH_A = COMPLETE
NEXT                   = BATCH_A_HUMAN_GATE
GATE                   = READY_FOR_ENVIRONMENT_ART_BATCH_A_HUMAN_GATE
```
