# R3A.1 — Hero Ship Moored-State Correction

Date: 2026-09-26  
Branch: `feature/portfolio-world-rebuild-v2`  
Starting HEAD: `faa1d00`

## Scope

This is a targeted correction to R3A's Hero Ship sail state. Candidate A+ layout, Hero Quay and berth coordinates, 460 × 460 gameplay display target, bottom-center waterline pivot, entry camera, MID working baseline, palette roles, calm water contact, Exhibition Hall placeholder, Medium Vessel placeholder, and Small Boat placeholder are unchanged. R3A evidence is preserved.

## Production method

The project-local `create-game-assets` workflow governed this pass: the prior source was inspected, the runtime technical frame and pivot were retained, generated raster output was normalized deterministically, alpha/dimensions were checked, and the result was tested at native scale and in the Phaser runtime.

OpenAI built-in image editing used the R3A Hero Ship as its edit target. The first pass changed broad deployed cream sails into tied/rolled bundles. A constrained follow-up added a real deck-mounted foremast so the selected result reads as foremast, mainmast, and mizzenmast at gameplay scale. The generated source was retained at 1254 × 1254 RGBA; the new runtime PNG is 1024 × 1024 RGBA with content bottom-aligned for the existing waterline pivot.

| Property | R3A (historical) | R3A.1 (active runtime target) |
| --- | --- | --- |
| Sail state | Broad deployed cream sails | Furled/stowed cream bundles tied along yards and bowsprit |
| Identity read | Merchant/exploration hull, but active-sailing posture | Three-mast merchant/exploration tall ship, stationary berth posture |
| Mast read | Not sufficient for the corrected brief | Distinct foremast, mainmast, and mizzenmast with yards/rigging |
| Runtime asset | `hero-ship-r3a.png` | `hero-ship-r3a1.png` |
| Source/runtime dimensions | 1254 × 1254 / 1024 × 1024 | 1254 × 1254 / 1024 × 1024 |
| Provenance | R3A generated-media record | R3A.1 generated-media edit record |

## Integration and provenance

`BootScene` now loads `hero-ship-r3a1.png` as `hero-ship-r3a1`; `WorldScene` uses that unique texture key at the existing Hero Quay waterline. `asset-manifest.r3a1.json` and `hero-ship-r3a1-provenance.md` record the corrected sail state, three-mast read, source/runtime dimensions, edit method, generated-media provenance, and pending review. R3A's asset, source, manifest, provenance, and evidence were not overwritten.

## Technical checks and evidence

- Runtime raster check: 1024 × 1024 RGBA; alpha range `0–255`; `641,197` fully transparent pixels; content bounds `[11, 36, 1015, 1023]`; no clipping at the waterline pivot.
- Contact sheet: `reports/portfolio-world-rebuild/evidence/r3a1/hero-target-contact-sheet.png`.
- Runtime evidence: `A-entry-target.png`, `B-overview-target.png`, `C-hero-target.png`, and `D-hero-native-scale.png` under `reports/portfolio-world-rebuild/evidence/r3a1/`.
- `C-hero-target.png` and `D-hero-native-scale.png` are the review frames for furled bundles, absence of broad deployed canvas, three mast groups, Tier-1 hierarchy, natural berth relationship, and calm water contact.

## Functional QA

Commands run from `portfolio-world-v2/`:

```text
npm run typecheck
npm run build
npm run qa:runtime -- --mode build --set r3a1
```

The build-mode runtime harness reported no asset-load failures, console errors, exceptions, or failed-network errors.

## Review boundary

This pass records a corrected generated asset, source/runtime normalization, integration, functional checks, and factual evidence only. It does not grant a visual verdict. Independent R3A.1 visual QA must judge the actual runtime captures.

## Final gate

```text
READY_FOR_R3A1_INDEPENDENT_VISUAL_QA
```
