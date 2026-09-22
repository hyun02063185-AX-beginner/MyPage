# Portfolio World — Art Asset Phase 01 Harbor Scale & Fleet Refinement

## A. Work Context

- Profile / machine context: `HOME_WINDOWS` / `06cd98a5-32c4-40db-a628-5416e4795ed6`
- OS / Node / npm: `win32 x64` / `v24.16.0` / `11.13.0`
- Branch: `feature/portfolio-world-sprint-02`
- Scope: Hero Ship D, modest Exhibition Hall visual scale increase, a bounded secondary fleet,
  and one explicit walkable service jetty. The approved town/world layout, IA, reserved lots,
  and all non-harbor portfolio work remain out of scope.

## B. Git

- Base at start: `774c6f2` on the required feature branch; `git pull --ff-only` reported already up to date.
- Supplied execution-only records were present untracked at start and were read, but will remain unstaged.
- Intentional runtime and documentation changes are staged/committed separately at closeout.

## C. Hero Ship D

`hero-ship-d-v01.png` is a new `generated-original` transparent PNG. It is the temporary production
review default; A/B/C remain intact as comparison evidence. D has a three-mast, major-vessel silhouette,
warm wood hull, dark-teal trim, ivory sails, readable bow/stern, and a visibly elevated deck.

| Asset | Source | Display | Runtime scale / anchor | Bytes |
| --- | --- | --- | --- | ---: |
| Hero D | 1536 × 1024 | 395 × 263 | 0.257 × source; `originY 0.84` | 2,159,287 |

## D. D Scale vs A

- A display envelope: `360 × 270`; D: `395 × 263`.
- D stays close to A in perceived hull footprint while retaining a richer three-mast identity; it is far
  below C's `510 × 340` display envelope.
- D's visual art remains independent of the unchanged `280 × 80` logical vessel/collision footprint.

## E. D Design vs C

D deliberately takes C's strongest qualities—three-mast hierarchy, fuller hull character, and a landmark
silhouette—without reusing or merely resizing C. Its generated-original art is a new vessel design with
different deck, stern, bow, sail, and hull treatment.

## F. D Perspective / Deck Visibility

D is profile-biased but viewed from above rather than in pure side profile. Its deck rails, hatch/cargo
area, stern deck, and upper structures are readable at source and remain discernible at the 395 px display
width. The transparent canvas has zero-alpha corners; no root-background pixels were introduced.

## G. Building Visual Scale

| Destination | Old visual display | New visual display | Reason |
| --- | --- | --- | --- |
| Exhibition Hall | 310 × 207 | 340 × 227 | A modest 9.7% increase makes the waterfront destination read larger against vessels without moving its IA coordinate, entrance, forecourt, or collision footprint. |

The other destinations retain their approved programmatic visual scales; a shared adjustment would be
premature before their production-asset pass.

## H. Secondary Fleet

Three new generated-original transparent PNGs provide four placements:

| Asset | Role | Source | Display | Bytes |
| --- | --- | --- | --- | ---: |
| `secondary-brig-v01.png` | two-mast merchant brig | 1536 × 1024 | 188 × 125 | 1,378,040 |
| `secondary-schooner-v01.png` | long two-mast cargo schooner | 1536 × 1024 | 205 × 137 | 1,731,285 |
| `secondary-cutter-v01.png` | compact one-mast cutter | 1536 × 1024 | 145 × 97 | 1,223,185 |

The brig is used twice, once mirrored, as controlled reuse. Existing smaller programmatic working boats
remain in place as activity/support craft.

## I. Fleet Count / Hierarchy

- 1 Hero Ship D — primary landmark.
- 4 added secondary sailing-vessel placements — two brigs, one schooner, one cutter.
- 4 retained small working boats — scale/activity support.

Every secondary display size is below D, while the logical vessel rectangles are separately validated for
water containment and no vessel-to-vessel overlap.

## J. Dock / Berthing Expansion

The harbor retains its waterfront dock and two existing walkable pier arms, and adds the `144 × 32`
`harbor-service-jetty`. It overlaps the primary dock by 16 logical pixels to form a physically connected,
purposeful cargo/service berth rather than a decorative maze. This provides a fourth explicit berthing
structure while preserving open water around the fleet.

## K. Collision / Walkability

- New vessel art has no physics bodies and never derives collision from PNG bounds.
- The service jetty is declared `dock`, `walkable: true`, and is added to required walkable-pier validation.
- Existing explicit water-collision subtraction receives all walkable docks, including the service jetty.
- A narrow test confirms the jetty has no overlap with resulting water collision and confirms all four new
  sailing vessels fit entirely within declared water geometry.

## L. Asset Manifest / Provenance

`src/world/worldAssetManifest.ts` contains D and all secondary asset metadata: stable path/key, role,
`generated-original` source/provenance, `CONCEPT` policy status, version, source/display dimensions,
origin, and notes. `07_ASSET_POLICY.md` status semantics are reused. A/B/C are retained unchanged.

## M. Asset Metrics / Compression

- New asset bytes: **6,491,797**.
- All harbor asset bytes including retained first-slice evidence and Exhibition: **14,040,843**.
- Normal production image transfer (D + Exhibition + three unique secondary textures): **8,557,016 bytes**.
- PNG remains the project-standard transparent runtime format. The fleet uses three source files for four
  ships through one mirrored reuse; this avoids a fourth near-duplicate source texture.
- This is not yet an improvement over the first-slice two-texture production transfer (~4.15 MB); further
  PNG palette/alpha optimization is a known, required follow-up before broad asset rollout. No arbitrary
  lossy conversion was imposed on this human-review candidate set.

## N. BASE_URL / Production Preview

- All new paths are public-relative manifest paths resolved as
  ```${import.meta.env.BASE_URL}${asset.path}```.
- Built preview HTTP checks returned `200` for `/MyPage/world/` and D, all three secondary vessel PNGs,
  and Exhibition Hall under `/MyPage/world/assets/...`.
- Deliberately incorrect root-absolute `/assets/world/harbor/ship/hero-ship-d-v01.png` did not resolve.

## O. QA

- `npm ci`: PASS after stopping only the exact preview processes from this task that were locking Vite's
  Windows native binding. An initial lock failure was observed and resolved; no unrelated process was touched.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 11/11.
- `npm run build`: PASS; JS `1,416.20 kB`, gzip `368.01 kB` (existing advisory chunk-size warning remains).
- `git diff --check`: PASS.
- Work context: PASS on the required branch/profile.
- Dev-server screenshot framing could not be started in this environment because Vite's dev listener returned
  `EACCES` on both `::1:4323` and `127.0.0.1:4323`. Production preview and direct asset HTTP QA remained available.

## P. Existing Portfolio Protection

World dimensions, destination IA/coordinates, paths, forecourts, reserved lots, player controls, root
portfolio pages, GitHub Pages base structure, and existing water/pier behavior remain intact. No map-wide
asset conversion, empty-lot work, NPCs, audio, portals, generic asset system, or unrelated root change was made.

## Q. Visual Evidence

- Direct generated-output inspection was completed for D, brig, schooner, and cutter.
- A live built-production browser inspection confirmed the Exhibition Hall remains fully legible and the fleet
  assets load on the real canvas; visual images are session-only and no durable screenshot-export facility was
  available, so no screenshot binary was added to the repository.
- The dev-only `?assetPreview=harbor` framing remains available in a normal dev environment for D + Exhibition
  + fleet + dock comparison. A/B/C can still be viewed with `?heroShip=a|b|c`; D is the default.

## R. Known Issues

- The generated PNGs are still more detailed/painterly than the ideal 16-bit-inspired target, though their
  silhouette and palette were constrained for runtime readability.
- Normal production image transfer has increased to ~8.56 MB; optimize alpha/palette/export after the human
  scale/fleet decision.
- Phaser's existing JavaScript chunk warning remains.

## S. Human Decisions Still Pending

1. Approve D's A-like footprint with C-like design and elevated deck, or request a D follow-up.
2. Approve the 9.7% Exhibition Hall visual-scale adjustment.
3. Approve the four-secondary-vessel composition and the service-jetty berth count, or tune density.
4. Approve the broader generated-art style and a subsequent asset-weight optimization pass.

## T. Gate

```text
READY_FOR_HARBOR_REFINEMENT_INDEPENDENT_REVIEW
```
