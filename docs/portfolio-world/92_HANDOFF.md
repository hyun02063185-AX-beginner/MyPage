# 92. Portfolio World — Handoff

Updated: 2026-09-19

## State
Visual Grammar v1.0 is locked at `15°` elevation / `0°` yaw. Depth / Occlusion Runtime Fix v1
(semantic depth bands, logical contact-Y ordering) was independently reviewed and returned for two
Major regressions; the v1.1 patch fixed them and was independently re-checked
(`READY_FOR_SCALE_BIBLE_ASSET_WEIGHT_LOCK`, 20/20 tests). Scale Bible v1 and Asset Weight
Budget v1 are now locked (`READY_WITH_MINOR_NOTES`): visible-content scale bands, 1× export,
category ceilings, practical-alpha trimming, hidden-RGB cleanup, and the hybrid runtime/audit
metadata contract are recorded in `retro-harbor-campus-scale-bible-asset-weight-lock-v1.md`.
Mass Asset Production Director Gate has passed for Batch 01 only. Batch 01 is implemented and
awaits independent review; full-world rollout remains on hold.

Hero Ship D, modest Exhibition Hall visual-scale refinement, a four-vessel secondary fleet,
and a walkable service jetty are implemented and have passed independent review
(`READY_FOR_HARBOR_REFINEMENT_HUMAN_REVIEW`). D remains the temporary production review default.
Hero D's overall scale is now `LOCKED_FROM_D`; Exhibition Hall is the locked destination reference.
Fleet-density and berthing-layout design decisions remain pending and are not authorized by this lock.

## Work Context Metadata

This is the canonical machine-readable metadata section parsed by `work-context.mjs`.

Environment: HOME_WINDOWS
MachineContextId: 06cd98a5-32c4-40db-a628-5416e4795ed6
Agent: Codex
Model: GPT-5

## Environment
HOME_WINDOWS

## Current Agent
Codex

## Model
GPT-5

## Sprint 1 Status
COMPLETE
ACCEPTED
HUMAN FEEL TEST PASS

## Runtime code
FIRST PLAYABLE WORLD SKELETON IMPLEMENTED

## Implementation

- Commit: `fea4828`
- Fixed logical game: 1024 × 576; World: 2048 × 1280
- Player: 24 × 32 px programmatic placeholder; W/A/S/D + Arrow movement, delta-time, normalized diagonal, opposing-key cancellation, manual bounds clamp
- Movement baseline: 200 px/sec, accepted by Human Feel Test
- Camera: bounded follow, 0.15 / 0.15 lerp, rounded pixels
- Accessibility: `../` Portfolio return link, game ARIA region, visible focus state, coarse-pointer fallback
- Validation: `npm ci`, typecheck, build, test, preview, Work Context, and diff check PASS

## Sprint 2 Status

IMPLEMENTATION COMPLETE
INDEPENDENT REVIEW PENDING
HUMAN FEEL TEST PENDING

## Implementation

- Project-owned layout data provides 64 px primary paths, 256 × 128 px destination footprints, 64 px forecourts, eight reusable-placeholder landmark placements, and non-collidable edge treatment.
- North/South destinations now use the required `LOGICAL_UNIT * 7` offset. West/East coordinates were retained.
- Arcade Physics has dynamic Player / static environmental collision only. The manual world-edge clamp remains authoritative.
- No binary art assets, Tiled data, routing, or content payloads were added.

## Next

Independent review of Mass Asset Production Batch 01. Read
`reports/portfolio-world/art-production/mass-asset-production-batch-01.md`, verify the eight
integrated references, and do not authorize full-world rollout. Stop any local `vite preview`
server before running `npm ci` on Windows.

## Next Recommended Agent
User
Task: Mass Asset Production Batch 01 independent review. Verify the locked content-bounds and
weight rules, collision/IA protection, texture transfer, and the carried depth minors.

## Visual Pass 1 Status

IMPLEMENTATION COMPLETE
INDEPENDENT REVIEW COMPLETE (`READY_WITH_MINOR_NOTES`)
USER VISUAL FEEL TEST COMPLETE (`VISUAL_PASS_1_FOUNDATION_APPROVED`)

## Visual Pass 1 Implementation

- Commit: `b3b2968`
- Programmatic `harborVisualCatalog.ts` owns Retro Harbor visual semantics; `WorldScene.ts` remains the composition layer.
- Harbor Square now includes a stone plaza, navigation monument, greenery, benches, lamps, sign, and four-way readability.
- The orphaned Sprint 2 path water feature was removed. One southern waterfront now provides water, walkable dock, integrated moorings/rope, cargo props, and a small boat; only the water edge is collidable.
- Presentation labels now read Harbor Square, Guild Hall, Academy, Workshop, and Exhibition Hall while internal IDs remain stable.
- Programmatic-only rendering; new binary assets/bytes: 0.

## Visual Pass 2 Status

IMPLEMENTATION COMPLETE
INDEPENDENT REVIEW COMPLETE (`READY_WITH_MINOR_NOTES`)
USER VISUAL FEEL TEST COMPLETE (`VISUAL_PASS_2_APPROVED_WITH_NOTES`)

## Visual Pass 2 Implementation

- Commit: `86b4614`
- Three internal, low-collision reserved lots protect Guild Annex, Academy Library, and Workshop Studio expansion capacity.
- Data-level validation rejects invalid lot geometry and permanent streetscape overlap with protected navigation, building footprints, or reserved lots.
- Programmatic zone streetscapes establish Journey Street, Learning Walk, Maker Yard, and Waterfront Promenade while preserving the approved world structure.
- Programmatic-only rendering; new binary assets/bytes: 0.

## Visual Pass 3 Status

IMPLEMENTATION COMPLETE
INDEPENDENT REVIEW COMPLETE (`READY_WITH_MINOR_NOTES`; vessel note absorbed in Pass 4)
USER VISUAL FEEL TEST NOT SEPARATELY RECORDED

## Visual Pass 3 Implementation

- Commit: `be9b621`
- A deterministic `-96 px` town translation preserves all relative layout while deriving a 192 px south-anchored harbor basin.
- One large ship, four small boats, a warehouse, and a cargo shed strengthen harbor composition with programmatic rendering only.
- Vessel containment, south-edge water anchoring, translation integrity, and support-structure placement are validation requirements.
- Status/handoff refresh is a mandatory phase-closeout step from this phase onward.

## Visual Pass 4 Status

IMPLEMENTATION COMPLETE
INDEPENDENT REVIEW COMPLETE (`READY_WITH_MINOR_NOTES`)
FOCUSED FIX COMPLETE (`READY_FOR_FOCUSED_VERIFICATION`)
FOCUSED VERIFICATION COMPLETE (`READY_FOR_USER_VISUAL_FEEL_TEST`)
USER VISUAL FEEL TEST COMPLETE (`VISUAL_PASS_4_APPROVED_WITH_NOTES`)

## Visual Pass 4 Implementation

- Commit: `6f8892c`
- Two inner harbor basins and a central dock peninsula turn the waterfront into a harbor-organized composition.
- The large ship is widened and separated from four small boats; validator coverage now prevents vessel overlap.
- Warehouse/cargo shed moved to the dry harbor edge; reserved lots and core paths remain protected.
- Focused fix relocates the west-basin land props to dry waterfront/cargo edges and derives water-only collision carve-outs for the two widened, walkable pier arms.
- Focused verification confirmed both fixes directly against the production
  `createWaterCollisionRects()` geometry (no collision overlap on either pier, all six
  relocated props clear of water) with no regression in composition, vessels, or
  reserved lots; interactive/browser walk-testing remains unavailable in this
  environment and was reported as such rather than claimed.

## Visual Pass 5 Status

PLAN COMPLETE
PRE-REVIEW COMPLETE
IMPLEMENTATION COMPLETE
INDEPENDENT REVIEW COMPLETE (`READY_FOR_USER_VISUAL_FEEL_TEST`)
HUMAN VISUAL FEEL TEST COMPLETE (`VISUAL_PASS_5_APPROVED_FOR_ASSET_APPLICATION`)

## Visual Pass 5 Implementation

- Programmatic Retro Harbor styling now uses a focused shared palette, layered water,
  width-aware dock decorations, refined destination silhouettes, and a more detailed
  ship/boat/material language.
- Dock post offsets are tested directly: the 448 px main dock keeps five inset posts;
  160 px piers use three inset posts with all rope spans inside the visible footprint.
- No layout, IA, collision geometry, UI shell, or binary runtime assets changed.

## Visual Pass 5 Independent Review

- Confirmed the dock geometry fix is general (fractional post offsets, not special-cased
  widths), the shared palette removed the cross-file color duplication, and the Pass 4
  human-feel-test record now reflects the real verdict without inventing feedback.
- Water and the large ship — the two areas the pre-review flagged as furthest from the
  bar — are both materially improved; layout, collision, and the World/UI boundary are
  byte-identical to Pass 4.
- Two Minor, non-blocking findings recorded: the implementation report's static-collider
  count undercounts the actual pier-subtracted total (8 reported vs. 13 actual; no
  runtime effect), and `visualPalette.ts` keeps legacy-named aliases alongside its new
  keys (optional future cleanup).
- QA reproduced independently: 8/8 tests, clean build (`1,409.93 kB` / `366.49 kB` gzip),
  HTTP 200 preview.

## Art Asset Phase 01 Status

FIRST ASSET SLICE IMPLEMENTED
INDEPENDENT REVIEW COMPLETE (`READY_FOR_HUMAN_ASSET_SLICE_REVIEW`)
HARBOR SCALE / FLEET REFINEMENT IMPLEMENTED
HARBOR REFINEMENT INDEPENDENT REVIEW COMPLETE (`READY_FOR_HARBOR_REFINEMENT_HUMAN_REVIEW`)
HUMAN FINAL D SCALE / BUILDING SCALE / FLEET DENSITY / BERTHING DECISION PENDING

## Harbor Refinement Implementation

- Hero Ship D is a new generated-original, C-like three-mast vessel rendered at an A-like `395 × 263`
  review footprint. It is the temporary production default; A/B/C remain retained comparison evidence.
- Exhibition Hall's visual display increased modestly from `310 × 207` to `340 × 227`; its IA, location,
  entrance/forecourt, and collision remain unchanged.
- Four secondary sailing vessels (three unique generated-original PNGs with one mirrored brig reuse) and the
  existing four working boats create a three-tier fleet under D.
- `harbor-service-jetty` is an explicit `144 × 32` walkable berth. Water collision is carved from its
  declared geometry; no visual art bounds influence collision.
- New refinement asset bytes: `6,491,797`; normal production image transfer is `8,557,016` bytes. Asset
  weight optimization remains pending human direction.

## Harbor Refinement Independent Review

- All display/byte figures in the implementation report were independently recomputed against the
  actual manifest, layout data, and files on disk and matched exactly (D/secondary vessel byte sizes,
  the 16px dock/jetty overlap, the 6,491,797 / 8,557,016 / 14,040,843 byte totals).
- D's design was directly compared against C's source PNG: distinct art (mirrored bow/stern, different
  window lighting/wheel/lantern layout), not a resize or reuse, while retaining C's three-mast landmark
  character. D's elevated-deck perspective clearly resolves the human's pure-side-profile rejection of C.
- Vessel containment, no vessel-to-vessel overlap, and the service jetty's water-collision carve-out were
  independently recomputed from the raw rectangle coordinates (not just re-run tests) and confirmed
  correct; `waterCollisionGeometry.mjs`, `Player.ts`, `gameConfig.ts`, and `worldLayout.ts` are all
  byte-unchanged from before this refinement.
- BASE_URL/GitHub Pages handling re-verified via both built-bundle inspection (dead-code elimination of
  the dev-only comparison path still holds for the D default) and live production-preview HTTP checks;
  11/11 tests pass; build output is byte-identical to the committed `world/` output.
- Four Minor, non-blocking findings recorded: D's camera elevation reads more steeply "downward" than the
  human's A/B reference framing (not a pure-side-profile violation); D's aspect ratio differs from A's
  even though overall footprint area is close; the enlarged Exhibition Hall facade's computed bounding
  box has slightly more geometric overlap potential with a nearby display-board prop (unconfirmed by a
  live screenshot, which remains unavailable in this environment); and normal production PNG transfer has
  grown to ~8.56 MB with the previously-flagged optimization pass still not started.

## Art Asset Phase 01 Independent Review

- BASE_URL/GitHub Pages asset loading independently verified two ways: live HTTP checks
  against a locally built production preview (base-prefixed URLs 200, root-absolute 404),
  and direct inspection of the built JS bundle, where the dev-only ship-selector function
  is dead-code-eliminated to a hardcoded return of the default candidate — production
  cannot be influenced by the comparison query parameters at all.
- Layout, collision, water/dock rendering, and the existing root portfolio are confirmed
  byte-unchanged from before this slice; 9/9 tests pass; build output matches the
  implementation report's reported bytes exactly.
- Opened all four PNGs directly and verified true per-pixel alpha transparency (not just
  visual impression) by sampling raw pixel data; hero ship A/B/C are confirmed to differ
  meaningfully in mast count, sail count, and hull mass, not just uniform scaling.
- Three Minor, non-blocking findings recorded: the produced art style is a detailed
  painterly illustration rather than the strategy's targeted "16-bit-inspired retro"
  direction (a note for the human style judgment, not a defect); normal production page
  load transfers ~4.15 MB of PNG (Hero B + Exhibition) — a concrete number for the
  already-planned pre-rollout optimization pass; and minor alpha-edge color fringing on
  Hero A.

## Art Asset Phase 01 Implementation

- Added generated-original transparent PNG candidates for hero ship A/B/C and one
  Exhibition Hall candidate under `portfolio-world/public/assets/world/harbor/`.
- `BootScene` now preloads explicit Phaser textures through `import.meta.env.BASE_URL`;
  `worldAssetManifest.ts` records policy-aligned provenance/status and runtime metadata.
- Production defaults to target ship B. Development-only `?heroShip=a|b|c` compares a
  single candidate at a time; `&assetPreview=harbor` provides fixed-camera QA framing only.
- Ship/exhibition PNG visual bounds are independent of existing collision geometry; water,
  dock, and piers retain their Pass 5 programmatic rendering and collision behavior.
