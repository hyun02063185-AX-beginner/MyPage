# R3A — Hero Ship Representative Visual Target Implementation

Date: 2026-09-26
Branch: `feature/portfolio-world-rebuild-v2`
Starting HEAD: `2975255`

## Scope and skill record

Candidate A+ layout, basin geometry, route structure, destination placeholders, and v1 source/output remain unchanged. This pass replaces **only** the Hero Ship blockout and makes the minimum water-contact and entry-framing changes needed to judge it.

- Discovered: project-local `create-game-assets`, `environment-art`, `portfolio-world-visual-qa`, and Phaser `sprites-and-images`, `loading-assets`, `cameras`; built-in `imagegen` was also available.
- Natively invoked: built-in image generation for the source raster.
- Direct-read fallback: the six project-local skill files (plus `create-game-assets` art-direction, raster-pipeline, and provenance references) were read directly because this session exposes them as workspace files rather than a native Skill invocation API.
- Governing workflow: `create-game-assets`; it set the technical frame, manifest/provenance record, raster QA, and native-scale in-context validation discipline.

## Production method and technical frame

One transparent source image was generated with the built-in image-generation capability using a constrained prompt for a refined retro-harbor flagship: side-dominant hybrid-orthographic hull, distinct bow and stern cabin, unequal mast hierarchy, grouped cream sails, bowsprit, warm wood, restrained deep-blue/muted-gold accents, and explicit no-pirate/no-warship exclusions. No third-party reference image or source asset was used.

| Property | Value |
| --- | --- |
| Runtime asset | `portfolio-world-v2/public/assets/world/ships/hero/hero-ship-r3a.png` |
| Source companion | `portfolio-world-v2/art-source/world/ships/hero/hero-ship-r3a-source.png` |
| Source/runtime canvas | 1254 × 1254 RGBA / normalized 1024 × 1024 RGBA |
| Gameplay display target | 460 × 460 world px |
| Projection | Hybrid Orthographic 2.5D; MID working baseline, not permanently locked |
| Pivot | Phaser Image bottom-center `(0.5, 1.0)` at waterline |
| Filtering | Browser-native image sampling with Phaser `roundPixels`; retro-inspired raster, not strict grid pixel art |

The minimal manifest is `portfolio-world-v2/public/assets/world/asset-manifest.r3a.json`. The asset's generation note, normalization, prompt intent, pivot, filtering, and pending-review status are recorded beside it in `hero-ship-r3a-provenance.md`.

## Integration

`BootScene` loads the one PNG under the unique `hero-ship-r3a` texture key. `WorldScene` now renders it as a Phaser Image at Hero Quay and deletes the Hero Ship Graphics placeholder path; Medium Vessel and Small Boat remain their existing Graphics placeholders. A three-part, low-alpha, rounded teal contact treatment sits only at the Hero Ship waterline. It is deliberately broad and calm, with no foam tips, crest shapes, swell, or system-wide water rewrite.

The player spawn remains Harbor Square. The initial camera is instead centered at `(1350, 950)` with zoom `0.62`, giving the first real frame basin water, waterfront, Hero Quay, and the Hero Ship; navigation transitions to a smooth normal follow when the player begins moving. This is an entry framing change, not a world-layout change.

## Raster QA

`asset_report.py` passed the runtime PNG with expected `1024x1024` dimensions and an alpha requirement:

- RGBA, alpha min/max `0/255`; 583,595 fully transparent pixels.
- Content bounds: `[0, 32, 1013, 1024]`; no clipping of the intended asset was found.
- Checkerboard contact sheet: `reports/portfolio-world-rebuild/evidence/r3a/hero-target-contact-sheet.png`.

The source is high-detail retro-inspired raster rather than a true constrained-palette pixel sprite; nearest-neighbor normalization was therefore not applied. The contact sheet and `D-hero-native-scale.png` were opened at this pass for factual in-context inspection.

## Runtime QA and evidence

Build-mode harness passed with canvas/scene/deterministic-state/console/exception/network checks clean. The captures are fixed 1280 × 720 and were opened:

- `evidence/r3a/A-entry-target.png` — harbor-first entry framing.
- `evidence/r3a/B-overview-target.png` — preserved Candidate A+ overview.
- `evidence/r3a/C-hero-target.png` — contextual Hero Quay framing.
- `evidence/r3a/D-hero-native-scale.png` — native gameplay-scale readability.

Commands passed from `portfolio-world-v2/`:

```text
npm run typecheck
npm run build
npm run qa:runtime -- --mode build --set r3a
```

## Known limitations and review boundary

- The Exhibition Hall, quay, water system, Medium Vessel, Small Boat, terrain, paving, and destination markers remain placeholders by scope.
- The entry camera uses a fixed harbor-first opening before movement begins; a future interaction pass may tune the transition without changing the R3A framing target.
- `MID` remains a working baseline. High versus MID must be reconsidered after more final world art exists.
- This implementation verifies asset load, alpha, dimensions, pivot usage, camera framing, screenshots, and functional runtime behavior only.

**NO VISUAL PASS, PRODUCTION APPROVED, or HUMAN_GATE_2 is claimed.** Tier-1 aesthetic strength, silhouette approval, and water-contact approval belong to the independent R3A visual QA.

## Final gate

```text
READY_FOR_R3A_INDEPENDENT_VISUAL_QA
```
