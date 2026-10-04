# Canonical Landmark Asset Production — Gate A

## Status

`CANONICAL_LANDMARK_ASSET_PRODUCTION = COMPLETE`

This is a candidate-production and visual-review artifact. It neither selects a production asset nor approves Landmark Calibration. Phaser runtime, `GrayboxScene`, collision, world geometry, the Canonical Target, secondary ship, and small boat were not changed.

## Source of truth

1. [Canonical Projection A](evidence/gameplay-projection-refinement/projection-a-elevated-gameplay.png)
2. [Fixed-scale player validation](evidence/gameplay-projection-refinement/projection-a-player-fixed-scale-validation.png)
3. [Approved implementation blueprint](canonical-target-implementation-blueprint.md) and its machine form
4. [Asset and runtime implementation plan](asset-runtime-implementation-plan.md)

## Skills applied

- `environment-art`: kept every candidate as an elevated-oblique, warm-daylight, Mediterranean harbor object rather than a scenic plate; evaluated the roof/facade/ground relationship and tier hierarchy.
- `create-game-assets`: generated isolated transparent candidates, retained source and deterministic normalized PNGs, and recorded anchors, hashes, dimensions, and runtime-decomposition risk.
- `portfolio-world-visual-qa`: compared projection, fixed-player scale, material/light language, silhouette, and landmark hierarchy against Projection A. Native-scale sheets make the 56 px player explicit.

## Image/API capability result

The verified and used path was the built-in OpenAI image-generation capability through `Codex image_gen.imagegen`. The capability does not expose a stable model identifier, so the manifest records it as opaque rather than guessing. Codyssey Public API, a direct `gpt-image-2` API, and a direct Gemini Flash Image API were not called and remain unverified. No API key or token is in this repository.

All candidates used Projection A as a visual/projection reference. Each source image is retained under `source/`; the delivery PNG is a transparent, uniformly scaled canonical canvas. Deterministic normalization cropped pixels with alpha greater than 6, then fit them with no aspect-ratio distortion, center-aligned horizontally and bottom-aligned vertically.

## Native-scale evidence

- [Hall candidate sheet](evidence/canonical-landmark-assets/hall/hall-candidate-sheet.png) — 605 × 320 canvas, target 75 × 106 door guide, 56 px player.
- [Workshop candidate sheet](evidence/canonical-landmark-assets/workshop/workshop-candidate-sheet.png) — 505 × 280 canvas, 245 × 110 awning and approximately 95 × 105 entrance guides, 56 px player.
- [Hero Ship candidate sheet](evidence/canonical-landmark-assets/hero-ship/hero-candidate-sheet.png) — 595 × 685 envelope, a 592 px local mast-to-waterline line, 565 × 285 hull guide, and 56 px player.

For the ship, `595 × 685` is the asset envelope. The canonical visible mast-top-to-waterline metric is `592 px` at normalized local `y = 592`; `93 px` of envelope remains below that line. This is a recorded compositing/anchor convention, not a claim that the generated source contains a final water treatment.

## Candidate scoring

Scores are 1–5; totals use eight common criteria (maximum 40). Hero totals add rigging validity, waterline readability, landmark presence, and gangway compatibility (maximum 60). `runtime decomposability` is deliberately conservative: all generated assets still need a human-selected runtime slicing/cleanup pass.

| Family | Candidate | Canonical / Projection / Scale | Material / Light / Silhouette | Decompose / Player | Hero extra | Total | Recommendation |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| Hall | A | 4 / 4 / 4 | 5 / 5 / 4 | 3 / 4 | — | 33 | Alternate |
| Hall | B | 5 / 4 / 4 | 5 / 5 / 5 | 3 / 4 | — | 35 | Recommended for human review |
| Hall | C | 4 / 4 / 4 | 4 / 5 / 4 | 3 / 4 | — | 32 | Alternate |
| Workshop | A | 4 / 4 / 4 | 5 / 5 / 4 | 3 / 4 | — | 33 | Alternate |
| Workshop | B | 3 / 4 / 4 | 4 / 5 / 4 | 3 / 4 | — | 31 | Alternate |
| Workshop | C | 4 / 5 / 4 | 5 / 5 / 5 | 3 / 4 | — | 35 | Recommended for human review |
| Hero Ship | A | 4 / 4 / 4 | 5 / 5 / 4 | 2 / 4 | 3 / 3 / 5 / 2 | 45 | Alternate |
| Hero Ship | B | 5 / 5 / 4 | 5 / 5 / 5 | 2 / 4 | 4 / 4 / 5 / 5 | 53 | Recommended for human review |
| Hero Ship | C | 4 / 4 / 4 | 5 / 5 / 5 | 2 / 4 | 4 / 3 / 5 / 3 | 48 | Alternate |

## Candidate recommendation (not selection)

| Family | Recommendation order | Rationale |
| --- | --- | --- |
| Hall | Hall-B → Hall-A → Hall-C | B most clearly carries the canonical blue-and-muted-gold civic identity, readable front entrance, and broad plaza-facing silhouette. |
| Workshop | Workshop-C → Workshop-A → Workshop-B | C has the strongest harbor-workshop identity while retaining the required banner, awning, timber, crates, and oblique read without rivaling the Hall. |
| Hero Ship | Hero-B → Hero-C → Hero-A | B most closely matches the moored merchant/exploration read and visibly provides an attached gangway-compatible approach. |

The lower-ranked candidates are **not rejected from Gate A**; they are not the current recommendation because Hall-A reads slightly more palatial, Hall-C is less assertive as a plaza facade, Workshop-B is more cottage-like, and Hero-A/C provide weaker gangway/waterline evidence. Human selection may choose any candidate.

## Recommended combination and canonical comparison

- [Recommended landmark combination](evidence/canonical-landmark-assets/calibration/recommended-landmark-combination.png) uses Hall-B, Workshop-C, Hero-B, a fixed 56 px player, and deliberately neutral secondary-ship/small-boat placeholders.
- [Canonical versus candidate combination](evidence/canonical-landmark-assets/calibration/canonical-vs-landmark-combination.png) compares Hall size, Workshop size, Hero scale, player ratio, landmark hierarchy, daylight, palette, projection, and detail density. The right side is a calibration board, not a reconstructed scene or a runtime scene plate.

## Remaining risks

- Generated candidate detail is still dense. The selected source needs a production cleanup/slicing decision before runtime use; none is silently treated as a final runtime atlas.
- The Hero Ship needs a post-selection waterline/hull split and foreground-rigging treatment so that its canonical `y=592` waterline is respected in the actual harbor.
- Door, awning, and entrance guides are target metrics for human review, not proof of per-pixel interaction geometry. Runtime implementation remains blocked until the human candidate gate and a formal Gate B calibration approval.

## Human gate

`HALL_CANDIDATE_SELECTION = PENDING_HUMAN`
`WORKSHOP_CANDIDATE_SELECTION = PENDING_HUMAN`
`HERO_SHIP_CANDIDATE_SELECTION = PENDING_HUMAN`
`LANDMARK_CALIBRATION = NOT_APPROVED`
`RUNTIME_REBUILD = BLOCKED`
`NEXT = LANDMARK_CANDIDATE_HUMAN_GATE`
`GATE = READY_FOR_LANDMARK_CANDIDATE_HUMAN_GATE`

The complete machine-readable provenance, normalization data, hashes, anchors, scores, and status are in [canonical-landmark-assets.json](../../data/portfolio-world/canonical-landmark-assets.json).
