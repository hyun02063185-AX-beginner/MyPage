# R3E Environment Art Batch C — Hero Ship / Gangway

`ARCHITECTURE_INTEGRATION_HUMAN_GATE = APPROVED` was recorded by Director Review before this batch. The existing sources are `output/codyssey-image-benchmark/r3e-hero-ship/hero-a.gpt-image-2.original.png` (1024×1024, SHA-256 `76570b5d5251cd87e11eecafbd30ad8ff8bc3393569ec734c6242321c82f6b4c`) and `hero-b.gpt-image-2.original.png` (1024×1024, SHA-256 `6864d8f251e4fc3bc2cc876231a864fd5b689577110fa16e706492a120034172`), each with preserved response metadata.

R3E.1 explicitly selects Candidate B (`data/portfolio-world/r3e-hero-selection.json`): its raised-stern merchant silhouette, blue/gold identity, and docked profile clear the Hall/Workshop quality bar more strongly while separating upper mast structure from lower hull cleanly. The builder consumes this selection rather than hardcoding Candidate A. Runtime derivatives are `hero-ship-hull.png` (depth 4), `hero-ship-mast-foreground.png` (depth 22), and `ship-rigging-foreground.png` (depth 23); only upper mast/yard/rigging pixels exist in foreground layers, never a duplicate hull.

Typecheck, production build, and the existing 1280×720 build-browser QA pass. Runtime evidence is committed at `evidence/r3e-hero-ship/`; it verifies asset loads, routes, unchanged collision assertions, water exclusion, movement, stairs, camera behavior, and zero browser errors. This is prepared for human route/occlusion review, not self-approval.

| Check | Result |
| --- | --- |
| Landmark / player scale | CAUTION — human review required |
| Moored silhouette / water contact | CAUTION — human review required |
| Gangway / route / collision | PASS — unchanged gameplay ownership |
| Hull and rigging depth separation | PASS — explicit runtime layers |

```text
R3E_HERO_SHIP_BATCH_C = COMPLETE
NEXT                  = BATCH_C_HUMAN_ROUTE_OCCLUSION_GATE
GATE                  = READY_FOR_ENVIRONMENT_ART_BATCH_C_HUMAN_GATE
```
