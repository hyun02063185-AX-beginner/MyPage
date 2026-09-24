# 92. Portfolio World — Handoff

Updated: 2026-09-24

## State
**PORTFOLIO WORLD V1.0.0 = RELEASED BASELINE.** The Post-v1 Environment Surface Pass remains a valid, closed technical milestone and is not reopened. `main` and the v1.0.0 tag remain untouched.

**Concept Quality Lock (ART-01) is COMPLETE; Harbor Vertical Slice Production (ART-02) is IMPLEMENTED** on `feature/portfolio-world-concept-vertical-slice`. ART-02 implements only the locked south Harbor scope: new illustrated terrain, water, promenade, shoreline, vessel-contact, Exhibition foundation, and terrace raster assets; existing `GAME_READY` props are wired into applicable slice fallbacks. The released world geometry, destination/route/forecourt contracts, collision, camera/movement, depth formula, berths, locked building art, and locked vessel designs were not changed.

```text
POST_V1_ENVIRONMENT_SURFACE_PASS = TECHNICALLY_COMPLETE
CONCEPT_QUALITY_LOCK             = COMPLETE
HARBOR_VERTICAL_SLICE            = IMPLEMENTED (ART-02)
AUTOMATED_HARNESS                = PASS (35/35)
INDEPENDENT_VISUAL_QA            = PENDING
HUMAN_REVIEW                     = DEFERRED
GATE                             = READY_FOR_HARBOR_VERTICAL_SLICE_VISUAL_QA
```

ART-02 measurement: preload changed from 31 assets / 561,180 bytes to 38 assets / 1,235,511 bytes (+7 / +674,331). Final production QA is Blocker 0, Major 0, new ART-02 Minor 0; typecheck, test, production build, manifest-path validation, alpha hidden-RGB audit, and `git diff --check` pass. The only deferred non-art note is the existing Vite chunk-size warning. The official handoff evidence is `reports/portfolio-world/art-production/harbor-concept-vertical-slice-production.md`; it records seven actual-running-app frames and all eight production quality gates as PASS.

Active core sailing textures remain v03 native-resolution furled-sail Age-of-Sail merchant/exploration art. The accepted presence contract retains the Hero / Medium / Brig / Cutter visible hierarchy, mixed facings, zero vessel material overlap, waterfront work zoning, and Harbor Square landscape zoning; core ship runtime multipliers are 1.0. None of this design is reopened by the Concept Quality Lock — only how these locked assets meet the ground and water is in scope for ART-02.

## Concept Quality Lock (ART-01) — 2026-09-24

Pre-review/specification only; no `portfolio-world/src/**`, `public/assets/**`, `world/**`, or test file changed. Read the canonical material, re-ran the actual current build live (Vite dev server, the project's existing dev-only QA camera framings, headless-Chromium screenshots — dev server stopped and tree confirmed clean afterward), and searched exhaustively for an original concept-image reference (not found anywhere in the repo, any branch, any history). Confirmed every item of the new Human feedback against source (`harborVisualCatalog.ts`, `WorldScene.ts`, `worldDepth.mjs`) and live screenshots: `drawHarborGround()`/`drawWater()` are pure procedural Phaser fills with no illustrated material; the only "waterline" concept in code is a z-order offset, not a visual effect, so ships show a hard sprite-edge cutoff at the water's flat top edge with no submersion, contact shadow, or ripple; and — a finding beyond the literal feedback — many illustrated, `GAME_READY`, manifest-registered prop PNGs (crate, barrel, bench, lamp, notice board, rope coil, safety rail, mooring bollard, service marker, tree/planter variants) already exist on disk but are wired to only a handful of named instances, with most same-type instances still falling through to the flat-vector fallback.

Locked for ART-02: Harbor Vertical Slice boundary (Harbor Square south edge, Exhibition Hall, promenade, dock/shoreline, water, Hero Ship, secondary vessel(s), nearby props), a Hybrid production model (large terrain/water zone plates + reusable shoreline modules + small per-vessel/building contact overlays — chosen over one full-world plate or a modular tile grid, which risks reproducing the exact "mockup grid" artifact already flagged twice in this project), the full required asset-family table, and a mechanically specific ship-water grounding standard (waterline anchor, hull submersion band, occlusion method, contact shadow, contact ripple, explicit no-wake/no-reflection restraint) so Codex is not left inventing the visual bar. Runtime layering reuses the existing locked `worldDepth.mjs` bands additively; no depth-formula change. Full detail: `reports/portfolio-world/art-direction/concept-quality-lock-harbor-vertical-slice.md`. Next gate: `READY_FOR_CONCEPT_VERTICAL_SLICE_PRODUCTION`.

## Environment Art Major Repair + Short Visual Re-check — 2026-09-24

`drawHarborEdgeTreatment()` now draws each world-edge rectangle with an axis-aligned perimeter `strokeRect()` instead of a top-left-to-bottom-right `lineBetween()`, eliminating the 2048 px north/south and 1152 px east/west diagonal streaks. The optional Workshop/waterfront compacted-ground Minor was safely improved in the same visual-only renderer using three low-alpha, large-radius inset layers per patch.

Fresh actual-running-app inspection covered the whole-world overview and Academy, Guild Hall, Workshop, and waterfront. The Major artifact was absent in all required views; the compacted-ground transition no longer reads as a large hard-edged rounded rectangle. Typecheck, `npm test` **35/35**, production build, and `git diff --check` pass. No asset, layout, collision, route, building, fleet, berth, navigation, or world-dimension data changed. The V1 tag and `main` remain untouched. Gate: `READY_FOR_ENVIRONMENT_ART_HUMAN_REVIEW`.

Full evidence: `reports/portfolio-world/environment-art-major-repair-short-visual-recheck.md`.

## Environment Art Completion — Independent Whole-world Visual QA — 2026-09-24

Independent review of the actual running application (Vite dev server + Playwright/Chromium; both the project's existing dev-only QA camera framings and real player-driven movement were used — no new query params or debug code were added). Covered whole-world composition, Harbor Square, all four destinations, the exhibition promenade, waterfront/fleet, and shoreline/path transitions. 15 screenshots captured; 0 console/page errors throughout; no source, layout, collision, route, building, or fleet data was modified by this review.

Result: **Blocker 0, Major 1, Minor 2 new** (plus 1 pre-existing Minor carried forward unchanged, and the long-standing Vite chunk-size Minor). The whole-world composition, all four destinations, and the improved layered water/shoreline are cohesive and read well.

The Major finding: `drawHarborEdgeTreatment()` in `portfolio-world/src/world/harborVisualCatalog.ts` draws each world-edge accent line corner-to-corner (`lineBetween(topLeft, bottomRight)` of a very wide/tall thin rect) instead of as a border/highlight, producing a long diagonal streak the full length of each world edge (2048 px north/south, 1152 px west/east). This is clearly visible in the whole-world overview and directly behind the Academy (north) and Guild Hall (west) approaches, and it reproduces exactly the "grid/mockup-like ground artifact" impression this pass was chartered to remove. The function predates this batch's diff (not introduced by commit `3e31b27`) but was not caught by this pass's own production visual inspection.

Two new Minor findings: the Workshop/waterfront compacted-ground patches (`drawHarborGround`, two `fillRoundedRect` calls at 0.22 alpha with a 20–22 px corner radius) read as visibly rectangular/hard-edged rather than organically blended at gameplay zoom; and the pre-existing ground-detail flecks first noted in the Batch 04 Whole-world Visual QA (`batch-04-whole-world-visual-qa.md`) remain present and visually unchanged — carried forward, no new action needed.

**Verdict: not yet ready for Human Review.** Recommended next step: a scoped repair of the Major finding (edge-treatment diagonal line; the ground-patch Minor is optional/at implementer's discretion), then a short independent re-check, before Human Review. Full detail: `reports/portfolio-world/environment-art-completion-whole-world-visual-qa.md`. Next gate: `READY_FOR_ENVIRONMENT_ART_MAJOR_REPAIR`.

## Production Release Closeout — 2026-09-22

Release merge `eaadc02` is on and pushed to `main`; the preserved feature head is `e68b673`. Fresh pre-merge and post-merge checks passed (clean install, typecheck, build, `npm test` 35/35, and `git diff --check`). GitHub Pages production was rendered and verified at `/MyPage/` and `/MyPage/world/`: root entry, 1024×576 World canvas, hashed production assets, 0 World console warnings/errors, World exit, and all four target endpoints pass. See `reports/portfolio-world/portfolio-world-v1-release-closeout.md`. Do not reopen visual polish solely for the known release-safe Vite chunk-size warning.

## Release Blocker Short Recheck — 2026-09-22

Current phase: **RELEASE READINESS — BLOCKER SHORT RECHECK COMPLETE / READY FOR RELEASE CLOSEOUT**.

Both `release-readiness-audit.md` Blockers were independently re-verified in a live production build via a headless-browser driver against a GitHub-Pages-shaped local server (not from source or unit tests alone): the root "Portfolio World" link was clicked and loaded `/MyPage/world/`; all four forecourts (Guild Hall, Academy, Workshop, Exhibition Hall) were reached with real held movement keys from spawn and each correctly prompted; E, Enter, and click were each exercised and deliberately activated navigation to the correct `/MyPage/*.html` target (proximity alone did not navigate); the World exit returned to `/MyPage/`; 0 console errors throughout. QA reproduced 35/35, preload unchanged at 561,180 bytes / 31 assets, worktree clean. RR-01 = CLOSED, RR-02 = CLOSED, Blocker = 0, Major = 0. See `reports/portfolio-world/release-blocker-short-recheck.md`. Do not reopen Batch 04 visual work or start a polish pass.

## Release Readiness Handoff — 2026-09-22

Prior phase: **RELEASE READINESS — BLOCKER REPAIR IMPLEMENTED**. Superseded by the short recheck above.

The visual milestone remains closed. The two functional omissions from `reports/portfolio-world/release-readiness-audit.md` are repaired:

1. Root portfolio now exposes the optional `world/` entry.
2. WorldScene now resolves Guild Hall → `career.html`, Academy → `teaching.html`, Workshop → `making.html`, and Exhibition Hall → `gallery.html` from canonical forecourt metadata with intentional E/Enter/click activation.

All audited production paths, active v03 fleet assets, build/typecheck/tests, World exit, shell accessibility, small-screen fallback, and World console checks pass. The repair suite is 35/35 and preload remains 31 assets / 561,180 bytes. Release Blocker Verification is **PENDING INDEPENDENT SHORT CHECK**: manually activate all four forecourt interactions in a production build. Gate: `READY_FOR_RELEASE_BLOCKER_SHORT_RECHECK`. See `reports/portfolio-world/release-blocker-navigation-repair.md`; do not reopen Batch 04 visual work or start a polish pass.

## Fleet Native-Resolution Human Review Record

Human Review accepted the Hero, Medium, Brig, and Cutter native-resolution result: the same approved ship designs and presence, but sharper native-resolution detail without runtime enlargement. The pass changes only active ship PNGs, manifest dimensions/paths, and fleet presentation bounds; berth placement, roles, facings, depth, collision, IA, paths, buildings, world layout, and workboat/dinghy remain unchanged. Production checks: 32/32 tests pass, material vessel overlap = 0, all four v03 production asset URLs return HTTP 200, and preload is 561,180 bytes (−42,233). Result: `FLEET_NATIVE_RESOLUTION = ACCEPTED`. See `reports/portfolio-world/batch-04-human-acceptance.md`.

## Batch 04 Closeout

Workflow complete: **Production → Harness → Visual QA → Human Review**. Batch 04 is **COMPLETE / HUMAN ACCEPTED**.

Batch 04 milestone: **Whole-world Environment Completion + Final Balance**. Production added four visual-only existing-asset reuses: Guild Hall outer-edge tree, Academy west approach tree, Workshop transition planter, and Exhibition Hall promenade planter. It preserves all accepted buildings, fleet, berths, paths, world dimensions, collision and depth architecture. It excludes dynamic ship movement, day/night, NPC systems, realtime LLM, multiplayer, and major redesign.

Historical Production QA result: Blocker 0, Major 0, new Minor 0, Polish 0. The automated harness passed 32/32; whole-world material overlap sweep returned 0 unintended overlaps; canonical preload at that point was 603,413 bytes across 31 assets; new asset count was 0. The later v03 native-resolution pass reduced the canonical preload to 561,180 bytes. Historical fleet Minor review is closed in the release audit.

Human Review accepted the whole-world overview, Harbor Square, all four destination approaches, waterfront/fleet, major transitions, destination readability, and density/balance. The acceptance record is `reports/portfolio-world/batch-04-human-acceptance.md`. Do not reopen this visual work while correcting release navigation.

This section supersedes older Fleet Authenticity “Human Review next” and “Batch 04 not authorized” passages below, retained as historical records.

The independent review (`reports/portfolio-world/art-production/harbor-fleet-authenticity-independent-review.md`)
directly opened and pixel-decoded all four regenerated PNGs rather than trusting `fleetAuthenticityAssetAudit.json`,
traced active-asset replacement end-to-end into `WorldScene.ts` rendering, and independently re-verified the 15°
grammar, furled sail state, Age-of-Sail character, scale hierarchy, berth/overlap/dock relationships, asset
hygiene (hidden-RGB and padding via a from-scratch PNG decoder), and preload. 31/31 tests pass. Three Minor,
non-blocking findings were recorded: the harbor overlap validator's rendered-alpha checking does not extend to
the four regenerated sailing-vessel placements (pre-existing scope gap, not a regression); Hero D's hull carries
a row of small dark squares that read ambiguously as windows or gunports; and the Cutter's very small source
canvas (101×86) gives its furled-sail/15° reading somewhat lower visual confidence than the other three vessels.
No Blocker or Major finding.

Visual Grammar v1.0 is locked at `15°` elevation / `0°` yaw. Depth / Occlusion Runtime Fix v1
(semantic depth bands, logical contact-Y ordering) was independently reviewed and returned for two
Major regressions; the v1.1 patch fixed them and was independently re-checked
(`READY_FOR_SCALE_BIBLE_ASSET_WEIGHT_LOCK`, 20/20 tests). Scale Bible v1 and Asset Weight
Budget v1 are now locked (`READY_WITH_MINOR_NOTES`): visible-content scale bands, 1× export,
category ceilings, practical-alpha trimming, hidden-RGB cleanup, and the hybrid runtime/audit
metadata contract are recorded in `retro-harbor-campus-scale-bible-asset-weight-lock-v1.md`.
Mass Asset Production Director Gate has passed for Batch 01 only. The focused human correction is
implemented: Guild Hall v01 remains the canonical `42×52 px` usable entrance; Academy, Workshop, and
Exhibition Hall are targeted v03 door regenerations rather than whole-building scale changes. Visual-only
offsets, asymmetric Harbor Square detail, and path shoulders soften the cardinal layout while collision,
routes, IA, water, player behavior, and ships remain unchanged. The legacy 15° audit remains valid and no
ship correction batch is required. Door/layout human review is next; full-world rollout remains on hold
and is not authorized.

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

Repair the Environment Art Completion Major finding (world-edge diagonal-line defect; see the Independent Whole-world Visual QA section above and `reports/portfolio-world/environment-art-completion-whole-world-visual-qa.md`), then run a short independent re-check before Human Review. Stop any local `vite preview`/`vite` dev server before running `npm ci` on Windows.

## Next Recommended Agent
Environment Art Major Repair
Task: Fix `drawHarborEdgeTreatment()` in `portfolio-world/src/world/harborVisualCatalog.ts` so the world-edge accent renders as a border/highlight instead of a corner-to-corner diagonal line, per Finding 1 of `reports/portfolio-world/environment-art-completion-whole-world-visual-qa.md`. Visual-only change; do not touch collision, routes, buildings, fleet, or any other accepted V1 geometry. Then request a short independent re-check before Human Review.

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
