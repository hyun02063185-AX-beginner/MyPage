# Approved Pilot Baseline

Baseline commit: `b4e67948d1c12b46784441cc752d1fad3c2bdb04` (branch `design/world-layout-recovery-r5`). Scope is the independently runnable E.2.4.2 R5 Hybrid Pilot, not a formal R5 Runtime release.

## Human-accepted experience contract

Candidate B — Organic Coastal Harbor; four-direction walking; click A* plus WASD/arrow override; route guidance; exactly four POIs; arrival panel; Hero only to the boarding threshold; 1024×576 viewport at zoom 1.25; and the right-side Future Expansion Reserve remain fixed. The recent Human play feedback is recorded as acceptance of the V3 character expression (Front/Back V3; improved Side) in Pilot play. It is **not** technical production-runtime approval.

| POI | navigation target | content | constraint |
|---|---:|---|---|
| Exhibition Hall | 175,190 | `teaching.html` | range 58 |
| Workshop | 245,440 | `making.html` | range 58 |
| Harbor Archive | 180,560 | `gallery.html` | range 58 |
| Hero Ship threshold | 1020,364 | `career.html` | threshold only; hull remains blocked |

## Normal-play assets and hashes

Normal E.2.4.2 selects `idle-{front,back,side}-v3`, `walk-front-v3`, `walk-back-v3`, and `walk-side-v2`; legacy R4 and `*-v2` Front/Back remain QA/before comparisons.

| asset | SHA-256 |
|---|---|
| `candidate-b-scenic-plate.png` | `07F5FFF3E9765682A20F106BF58E65E201BCB59C10D1BF065ED45B94B596008B` |
| `pilot-player/idle-front-v3.png` | `B195EC9395BD69C67C241693FFD1EEC6C8FCF3E9370D803A16BD5787E1D0894C` |
| `pilot-player/idle-back-v3.png` | `590089D9E50C2EC6946D17A99A55AEA3205B3DB96A4065B37063898AE02B7DC6` |
| `pilot-player/idle-side-v3.png` | `18D2E69C97E0BAFB18CFAD1C27632AA8B890B4D7A9FE1529778BEF0AF00B90C1` |
| `pilot-player/walk-front-v3.png` | `6D39867B3C12E4BBD9EB03AE11616C218E161C1D41AE8FBEC77B1150B4BB8707` |
| `pilot-player/walk-back-v3.png` | `3DA794B9E987D519A467F01160B5FB5361704FE88C40E66A5370462DD88357C3` |
| `pilot-player/walk-side-v2.png` | `D7CBE73E71060A0E23B528B53207AA4914D478DD2D446A49F3C5EC5312AEACD0` |
| `hall-stairs-retaining.png` | `D01959B795513F3CF65F92A40504692758FF9D59DEE7F917DDA415CF8F27ABB9` |
| `workshop-foreground.png` | `5BB6D1685C30A7D1F5F977FB5418F0CAE0923E80717B6D37C8E653E93F33B162` |
| `archive-approach-foreground.png` | `04316AD998E78B2C8F7B05E484D78CC8EA48C165E9669702DC6E50E1437E17ED` |
| `dock-piles.png` | `C72A64BFAF8BDE99F08322B9B6FE60870688A9A79AAEA25852570B5D312BF26A` |
| `gangway.png` | `16AA2352BE01FA3F951B019CDE06FDD9021EF06E90FA37E8A7F06DC0BBCFB7DE` |

The normal preset is B: Side 20 fps, Front/Back 16 fps, speed 170 px/s. `animationQa=1`, `walkVersion=before`, `rawSideQa=1`, `qaFreeze=1`, `debug=1`, and non-B cadence/speed controls are QA-only and must not be promoted.

Collision/version baseline: `hybridCollision.ts` exports nine named walkable polygons, five collision footprints, a 28×16 feet body, and 2px swept segment checks. `hybridNavigation.ts` is an 8px-grid A* with smoothing. Normal command: `cd portfolio-world; npm run dev`, then `/r5-hybrid-pilot.html`.

