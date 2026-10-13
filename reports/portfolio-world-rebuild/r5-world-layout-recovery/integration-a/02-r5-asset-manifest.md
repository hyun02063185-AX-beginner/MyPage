# R5 Asset Manifest

`src/world/r5RuntimeAssets.ts` is the single Integration A asset contract. It reuses existing `public/assets/r5-hybrid` files, gives each R5-only texture key, records dimensions/hashes/purpose, and derives URLs from `import.meta.env.BASE_URL`.

| set | source | approved contract |
|---|---|---|
| Candidate B | `candidate-b-scenic-plate.png` | 1280×720, SHA `07F5FFF3…596008B` |
| idle | `idle-{front,back,side}-v3.png` | 28×56; exact hashes in manifest |
| walk | Front/Back V3 + Side V2 | 8 frames; 16/16/20 fps; exact hashes in manifest |
| foreground | hall, workshop, archive, dock, gangway | five existing RGBA assets, Pilot placements/depths retained |

All seven character/source hashes are verified by `r5-integration-a-runtime-entry.test.mjs`; the same manifest also holds foreground SHA-256 values. The baseline inventory is in the prior [approved baseline](../integration-human-gate/01-approved-pilot-baseline.md).

