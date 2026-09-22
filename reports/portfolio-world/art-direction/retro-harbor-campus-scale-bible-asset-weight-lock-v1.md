# Retro Harbor Campus — Scale Bible + Asset Weight Lock v1

## A. Gate

```text
SCALE_BIBLE = LOCKED
ASSET_WEIGHT_BUDGET = LOCKED
MASS_ASSET_PRODUCTION = NOT_STARTED
FINAL_GATE = READY_WITH_MINOR_NOTES
```

This lock measures current runtime content, not raw PNG canvases. It authorizes the next Mass Asset Production Director Gate; it does not authorize production by itself.

## B. Work Context

2026-09-19, `feature/portfolio-world-sprint-02`; `work-context.mjs` reported `HOME_WINDOWS`, the expected machine context, Node `v24.16.0`, npm `11.13.0`, and a clean tree. `git pull --ff-only` was already up to date. No stale preview blocked installation; the task's own evidence preview was stopped before `npm ci`.

Visual Grammar v1.0 is locked at Hybrid Orthographic 2.5D / 15° above horizontal / yaw 0°. Depth/Occlusion v1.1 remains independently verified; its documented non-blocking minors are carried forward.

## C. Source Records

`strict` is alpha > 0; `practical` is alpha > 16. Coordinates are source-canvas pixels. Display-visible dimensions are practical bounds scaled by the runtime display canvas. `LU` is 32 px.

| Asset | canvas | strict bounds | practical bounds | display canvas | display-visible / LU | bytes |
| --- | --- | --- | --- | --- | --- | ---: |
| Hero Ship D | 1536×1024 | 0,16 1522×1008 | 73,18 1389×961 | 395×263 | 357.2×246.8 / 11.16×7.71 | 2,159,287 |
| Brig | 1536×1024 | 65,31 1425×993 | 290,33 1049×927 | 188×125 | 128.4×113.2 / 4.01×3.54 | 1,378,040 |
| Schooner | 1536×1024 | 65,13 1459×1011 | 128,15 1329×964 | 205×137 | 177.4×129.0 / 5.54×4.03 | 1,731,285 |
| Cutter | 1536×1024 | 157,24 1365×1000 | 297,27 984×967 | 145×97 | 92.9×91.6 / 2.90×2.86 | 1,223,185 |
| Exhibition Hall | 1536×1024 | 0,31 1505×967 | 35,34 1466×886 | 340×227 | 324.5×196.4 / 10.14×6.14 | 2,065,219 |

The five normal runtime textures total 8,557,016 bytes before this export policy. A/B/C and calibration variants are repository evidence, not normal runtime transfer.

## D. Measurement Method

`LOGICAL_UNIT = 32 px`. For PNGs, scale is calculated from practical visible bounds: `source practical bound / source canvas × display canvas`. For programmatic visuals, the renderer's actual draw envelope is the reference. Collision rectangles, image canvases, and visible bounds are independent.

## E. Alpha-bound Method

The reproducible decoder reads non-interlaced RGBA PNG pixels and uses one threshold globally. `alpha > 0` is retained as the strict integrity bound; `alpha > 16` is the production scale bound because the strict bound includes sparse, nearly invisible fringe that reaches a canvas edge. Both were recorded above. The threshold is not changed per asset.

## F. Logical Unit

```text
LOGICAL_UNIT = 32 px
PLAYER = REFERENCE_ONLY
```

## G. Reference Asset Inventory

| Category | reference | type | status |
| --- | --- | --- | --- |
| Hero ship | Hero Ship D | PNG | locked scale reference |
| Medium sailing vessel | Brig, Schooner | PNG | current runtime references |
| Light-medium sailing vessel | Cutter | PNG | distinct one-mast reference |
| Small working boat | waterfront / basin / cargo / offshore boats | PROGRAMMATIC | current runtime reference |
| Destination building | Exhibition Hall | PNG | current runtime reference |
| Support building | harbor warehouse | PROGRAMMATIC | current runtime reference |
| Greenery | academy tree | PROGRAMMATIC | current runtime reference |
| Props | crate, lamp, bench | PROGRAMMATIC | current runtime references |
| Dock / jetty | waterfront dock / service jetty | PROGRAMMATIC GEOMETRY | current runtime reference |
| Player | `Player.ts` rectangle | PROGRAMMATIC | reference only |

## H. Hero Ship Scale

Hero Ship D is canonical: `HERO_SHIP_REFERENCE_SCALE = LOCKED_FROM_D`. Its visible target is **357×247 px (11.16×7.71 LU)**, within the existing 395×263 display envelope. Hero D itself must not be resized. A successor begins in the evidence-derived 350–365×240–255 practical-visible band and requires an actual-scene readability review; this narrow band preserves D's current content envelope rather than applying a generic percentage.

Anchor: hull/waterline; depth class: vessel body plus upper mast policy; tier: 1.

## I. Medium Vessel Scale

Brig and schooner belong to `MEDIUM_SAILING_VESSEL`: practical visible width 128–177 px (4.01–5.54 LU), height 113–129 px (3.54–4.03 LU). This range is the measured current pair, rounded only to whole pixels. Cutter is materially smaller in width and one-mast silhouette, so it is the justified `LIGHT_MEDIUM_SAILING_VESSEL`: 90–100×90–98 px (2.81–3.13×2.81–3.06 LU). Anchors are hull/waterline; tier 2.

## J. Small Boat Scale

The four programmatic boats draw within their declared 80–112×32–48 px envelopes (2.50–3.50×1.00–1.50 LU). Future working boats must stay in that band, be below the cutter in visible mass, and use a hull/waterline anchor and tier 3. A sail added at this scale must not make it read as a light-medium vessel.

## K. Destination Building Scale

Exhibition Hall is the destination reference: **324.5×196.4 px (10.14×6.14 LU)** practical visible content; display canvas 340×227 px. Destination buildings begin in the 320–340×190–205 px visible band, a direct whole-pixel envelope around the existing Hall, unless a formally reviewed functional landmark requires a new subcategory. Guild Hall, Academy, Workshop therefore share this one category now. Anchor: functional ground base; depth: building body/upper occluder policy; tier 1.

## L. Warehouse Scale

The current programmatic harbor warehouse draws approximately 160×94 px (5.00×2.94 LU), using its 160×96 layout envelope. Support buildings use 152–160×90–96 px practical visible content, ground-footprint anchor, building-body depth, and tier 2. Cargo sheds remain subordinate support, not destination buildings.

## M. Tree / Greenery Scale

The academy tree's draw envelope is approximately 53×71 px (1.66×2.22 LU), including its crown and ground line. Single large tree/shrub production begins at 50–56×64–72 px; edge greenery may repeat but must not exceed a Tier-2 support building's silhouette. Anchor: ground contact; depth: low greenery/body policy; tier 3.

## N. Prop Scale

Current programmatic records: crate 40–48×32–40 px, lamp about 16×47 px, bench 56–64×24 px. `SMALL_PROP` therefore uses 16–48×24–48 px (Tier 4); `MEDIUM_PROP` uses 56–96×24–80 px (Tier 3). These are role bands, not a demand that lamps, crates, and benches share a shape. Anchor: ground contact; depth: low prop policy.

## O. Dock / Jetty Scale

These are geometry records, not sprite-scale records. Main waterfront dock: 448×64 px / 14.00×2.00 LU; its full 448 px width is passable because it has no collider, but it has no explicit `walkable` tag. Piers: 160×32 px / 5.00×1.00 LU. Service jetty: 144×32 px / 4.50×1.00 LU and explicitly `walkable: true`; declared walkable width is 144 px. Anchor is geometry center/base, role is Tier-2/primary harbor route, and collision remains independently derived from water carve-outs.

## P. Player Reference

`PLAYER_WIDTH = 24 px`, `PLAYER_HEIGHT = 32 px` (0.75×1.00 LU). Foot anchor is horizontal centre at `player.y + 16`. Player remains reference-only. There is no separately identifiable runtime PNG door/entrance, so Player:Door is intentionally not fabricated; a future door asset audit must record its visible entrance before that relationship is locked.

## Q. Relative Scale Relationships

| relationship | width | height | visible-area |
| --- | ---: | ---: | ---: |
| Hero D : Brig | 2.78 | 2.18 | 6.07 |
| Hero D : Schooner | 2.01 | 1.91 | 3.85 |
| Hero D : Cutter | 3.84 | 2.69 | 10.36 |
| Hero D : Exhibition Hall | 1.10 | 1.26 | 1.38 |
| Hero D : Warehouse | 2.23 | 2.63 | 5.86 |
| Exhibition Hall : Warehouse | 2.03 | 2.09 | 4.32 |
| Player : 48×40 crate | 0.50 | 0.80 | 0.40 |

## R. Visible Mass Analysis

Practical visible areas are Hero D 88,163 px², Brig 14,529, Schooner 22,876, Cutter 8,509, Hall 63,735, and warehouse about 15,040. Width, height, and area are all retained because mast/roof height otherwise misleads hierarchy. The Hall is deliberately comparable to the hero in visible mass; warehouse and secondary vessels remain Tier 2.

## S. Export Resolution Study

Study exports used practical-alpha crop + a 4 px runtime safety margin, Lanczos resize, RGBA preservation, PNG compression level 9, and zeroed RGB only where alpha is exactly zero. Output is scratch evidence, not production art.

| asset | current bytes | 1× canvas / bytes | 2× canvas / bytes |
| --- | ---: | ---: | ---: |
| Hero D | 2,159,287 | 365×255 / 143,037 | 730×510 / 490,945 |
| Brig | 1,378,040 | 136×121 / 25,422 | 272×242 / 78,231 |
| Schooner | 1,731,285 | 185×137 / 33,854 | 370×274 / 107,831 |
| Cutter | 1,223,185 | 101×100 / 15,047 | 202×200 / 46,372 |
| Exhibition Hall | 2,065,219 | 332×204 / 120,586 | 664×408 / 405,448 |

The required representative set is Hero D, Brig, Exhibition Hall, and no prop study because all current props are programmatic.

## T. 1× vs 2× Decision

```text
STANDARD_EXPORT = 1X
```

At actual 395 px Hero / 340 px Hall display, the 1× candidates retain readable silhouettes, windows/door grouping, sail separation, alpha edges, and vessel identity. 2× preserves additional zoom-only micro-detail but costs 3.15–3.45× more bytes; it does not improve the required runtime reading. 1× is therefore the standard. A 2× exception requires a side-by-side actual-display record proving a lost functional detail.

## U. Transparent Padding Rule

Trim to `alpha > 16` practical content plus **4 runtime pixels** on each side (converted proportionally at export scale). Four pixels comes from the 16 source-pixel safety expansion used for these approximately 4× source exports; it retains antialiasing and anchor safety without preserving the large current empty margins. Recalculate origin/anchor from the retained hull waterline, functional base, or ground contact—never preserve an old normalized origin blindly.

## V. Hidden RGB Rule

```text
HIDDEN_RGB_CLEANUP = REQUIRED
```

Current source files contain nonzero RGB in 503,599–782,292 fully transparent pixels each. The study zeroed only `alpha = 0`; semitransparent edge RGB was retained. Black-background visual inspection showed no colored fringe or silhouette loss. This is required for every optimized production export.

## W. Category Asset Weight Budgets

Measured 1× candidates average 1.59 bytes per padded runtime canvas pixel. Current-PNG ceilings are the measured optimized file plus 12–16% headroom. Programmatic categories use the same measured density × 1.20, rounded up to the next KB, against their locked padded canvas; these are first-PNG ceilings, not arbitrary global limits.

| category | current / 1× / 2× bytes | selected | ceiling |
| --- | --- | --- | ---: |
| Hero asset | 2,159,287 / 143,037 / 490,945 | 1× | 160 KB |
| Major destination | 2,065,219 / 120,586 / 405,448 | 1× | 135 KB |
| Medium vessel | 1,223,185–1,731,285 / 15,047–33,854 / 46,372–107,831 | 1× | 38 KB |
| Small boat | programmatic / n.a. / n.a. | 1× when PNG exists | 13 KB |
| Small prop | programmatic / n.a. / n.a. | 1× when PNG exists | 6 KB |
| Support building | programmatic / n.a. / n.a. | 1× when PNG exists | 35 KB |
| Tree / greenery | programmatic / n.a. / n.a. | 1× when PNG exists | 12 KB |

Every first PNG in a currently programmatic category must record actual current/1×/2× bytes before `GAME_READY`; it may not exceed this evidence-derived ceiling without a reviewed exception.

## X. Initial World Texture Budget

This is normal initial transfer for unique textures, not repository size. All scenarios assume 1 hero, 4 destination buildings, medium vessels, small boats, 2 support structures, trees, and props; repeated placements share a loaded texture.

| scenario | assumptions | estimated transfer |
| --- | --- | ---: |
| LOW | 3 unique medium, 4 boats, 8 trees, 16 props | ~1.01 MB |
| EXPECTED | 4 unique medium, 6 boats, 12 trees, 24 props | ~1.29 MB |
| HIGH | 6 unique medium, 8 boats, 16 trees, 32 props, 3 support | ~1.52 MB |

These estimates use the locked category ceilings, so actual optimized transfer should normally be lower.

## Y. Repository vs Runtime Transfer

Repository bytes include source-quality A/B/C and development calibration variants. They are not normal production-loaded textures. Current normal transfer is 8,557,016 bytes before optimization; the same five unique textures at the measured 1× size total **337,946 bytes**. Future estimates above are separate from repository retention.

## Z. Manifest / Metadata Decision

```text
MANIFEST / METADATA = HYBRID
```

Keep `worldAssetManifest.ts` runtime-light (`id`, base-prefixed runtime path, texture key, role, provenance, status, source/display dimensions, anchor). Maintain a production asset-audit record alongside each approval with: `id`, `runtimePath`, `textureKey`, category/role, provenance, status, source width/height, strict and practical `visibleBounds`, display width/height, logical width/height, anchor, depth class, file bytes, export scale, optimization status, alpha threshold, and audit date. `BASE_URL` resolution is mandatory. This avoids making dev calibration records runtime dependencies while keeping every production decision maintainable.

## AA. Final Production Contract

```text
PROJECTION = HYBRID_ORTHOGRAPHIC_2_5D
CAMERA_ELEVATION = 15°
CAMERA_YAW = 0°
LOGICAL_UNIT = 32 px
SCALE_MEASUREMENT = visible / trimmed practical content (alpha > 16)
ANCHOR = category-defined retained contact point
DEPTH = semantic depth class + v1.1 policy
COLLISION = independent from visual bounds
RUNTIME_READABILITY = mandatory at actual display size
ASSET_WEIGHT = category budget above
TRANSPARENT_PADDING = practical trim + 4 runtime px
HIDDEN_RGB_CLEANUP = required where alpha = 0
PROVENANCE = mandatory
BASE_URL = mandatory
```

## AB. Deferred Items

No new buildings, ships, vegetation, props, day/night, random vessels, berth system, camera/layout/depth/collision changes, or mass art were implemented. A Player:Door ratio waits for a measurable door asset. Existing depth minors remain deferred under their prior reports.

## AC. QA

The export study completed; build/runtime visual check found Hero D and Hall readable at normal scene size, with no application-originated diagnostics. `npm ci` passed (20 packages audited, 0 vulnerabilities); `npm run typecheck` passed; `npm test` passed **20/20**; and a final `npm run build` passed (existing Vite chunk-size warning only). `git diff --check` passed.

## AD. Mass Production Readiness

Scale categories, export choice, padding, hidden-RGB rule, metadata contract, and evidence-derived ceilings are locked. Minor note: the first PNG in a programmatic-only category must populate its asset-audit row and pass the stated ceiling before being `GAME_READY`; this is normal per-asset acceptance, not a mass-production blocker.

## AE. Final Gate

```text
READY_WITH_MINOR_NOTES
```
