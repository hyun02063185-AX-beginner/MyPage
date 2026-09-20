# 91. Portfolio World — Project Status

Updated: 2026-09-20

## Phase
FULL WORLD ROLLOUT AUTHORIZED / BATCH 02 HARBOR SUPPORT + STREETSCAPE IMPLEMENTED / INDEPENDENT REVIEW PENDING

## Current Work Unit
Guild Hall-door canonicalization and visual-only harbor-layout naturalization review; full rollout remains on hold

## Confirmed
- MyPage repo 유지
- optional World
- GitHub Pages main/root 유지
- `/MyPage/world/` 후보
- M01 제약 비적용
- Library v1 Deferred
- role = Director
- v1 scope canonical = `03_REQUIREMENTS.md`
- Phaser 4.2.1 + Vite 8.3.0 + TypeScript 7.0.2 runtime foundation implemented
- `world/` production build path configured for `/MyPage/world/`
- Work Context v0 implemented with distinct profile and machine-context detection
- Sprint 0B F1/F2/F3 remediation implemented and validated
- Sprint 0B — ACCEPTED
- Runtime Foundation — COMPLETE
- Work Context v0 — COMPLETE
- Sprint 0B main merge — COMPLETE
- Sprint 1 first playable world skeleton implemented on `feature/portfolio-world-sprint-01` at `fea4828`
- Fixed 1024 × 576 logical game surface, 2048 × 1280 World, data-oriented future-zone markers, and placeholder player movement implemented
- Phaser keyboard capture, blur reset, bounded follow camera, HTML exit/accessibility shell, and coarse-pointer fallback implemented
- Sprint 1 automated validation PASS: `npm ci`, typecheck, production build, test, preview, Work Context, and diff check
- Sprint 1 — COMPLETE
- First Playable World Skeleton — COMPLETE
- Movement baseline — 200 px/sec; Player size — ACCEPTED
- Camera baseline — 0.15 ACCEPTED FOR CURRENT STAGE
- Human Feel Test — PASS
- Sprint 2 implementation complete: project-owned layout data, placeholder environmental density, and Arcade environmental collision foundation added
- North/South destination offset updated to `LOGICAL_UNIT * 7`; West/East coordinates retained
- Sprint 2 automated validation PASS: duplicate IDs, geometry bounds, positive dimensions, and collision configuration
- Sprint 2 independent review — PENDING
- Sprint 2 Human Feel Test — PENDING
- Retro Harbor Campus Visual Pass 1 implementation complete at `b3b2968`
- Harbor Square, south waterfront hint, destination silhouette refinement, and programmatic harbor visual catalog implemented
- Visual Pass 1 independent review — COMPLETE (`READY_WITH_MINOR_NOTES`)
- Visual Pass 1 User Visual Feel Test — COMPLETE (`VISUAL_PASS_1_FOUNDATION_APPROVED`)
- Retro Harbor Campus Visual Pass 2 implementation complete at `86b4614`
- Reserved expansion lots, protected-layout constraints, and route-specific programmatic streetscapes implemented
- Visual Pass 2 independent review — COMPLETE (`READY_WITH_MINOR_NOTES`)
- Visual Pass 2 User Visual Feel Test — COMPLETE (`VISUAL_PASS_2_APPROVED_WITH_NOTES`)
- Retro Harbor Campus Visual Pass 3 implementation complete at `be9b621`
- Uniform town translation, enlarged harbor basin, vessels, and waterfront support structures implemented
- Visual Pass 3 independent review — COMPLETE (`READY_WITH_MINOR_NOTES`; vessel note absorbed in Pass 4)
- Visual Pass 3 implementation — COMPLETE
- Visual Pass 4 implementation complete at `6f8892c`
- Inner harbor basins, dock peninsula, vessel recomposition, and support-structure repositioning implemented
- Visual Pass 4 independent review — COMPLETE (`READY_WITH_MINOR_NOTES`)
- Visual Pass 4 focused fix complete — basin land props relocated and pier collision carve implemented
- Visual Pass 4 focused verification — COMPLETE (`READY_FOR_USER_VISUAL_FEEL_TEST`); submerged props and pier walkability confirmed fixed with no regression
- Visual Pass 4 User Visual Feel Test — COMPLETE (`VISUAL_PASS_4_APPROVED_WITH_NOTES`)
- Visual Pass 5 plan — COMPLETE
- Visual Pass 5 pre-review — COMPLETE
- Visual Pass 5 implementation — COMPLETE
- Visual Pass 5 independent review — COMPLETE (`READY_FOR_USER_VISUAL_FEEL_TEST`); dock geometry fix, shared palette, and canonical-record reconciliation all confirmed, no regression in layout, collision, or accessibility
- Visual Pass 5 human visual feel test — COMPLETE (`VISUAL_PASS_5_APPROVED_FOR_ASSET_APPLICATION`)
- Art Asset Phase 01 first slice — IMPLEMENTED
- Art Asset Phase 01 independent review — COMPLETE (`READY_FOR_HUMAN_ASSET_SLICE_REVIEW`); BASE_URL/GitHub Pages asset loading independently verified via built-bundle inspection (dev-only comparison code is dead-code-eliminated in production) and live HTTP checks; layout, collision, and existing portfolio confirmed unchanged; asset transparency verified via direct pixel alpha sampling; no Blocker/Major finding
- Hero Ship D overall scale reference — LOCKED_FROM_D (Hero D itself must not be resized)
- Hero Ship D harbor-scale refinement — IMPLEMENTED; D is the temporary review default, not human-approved
- Harbor fleet / service-jetty refinement — IMPLEMENTED
- Harbor refinement independent review — COMPLETE (`READY_FOR_HARBOR_REFINEMENT_HUMAN_REVIEW`); D scale/design/perspective, Exhibition Hall enlargement, secondary-fleet integration, fleet hierarchy/density, service-jetty geometry and water-collision carve-out, manifest/provenance, BASE_URL/production preview, and QA (11/11) all independently re-verified against the actual code, layout data, and asset files; no Blocker/Major finding; four Minor findings recorded for human awareness (perspective-angle degree vs. A/B, D's aspect ratio vs. A, one geometric Exhibition Hall/prop overlap possibility, and a compounding asset-weight follow-up)
- Hero Ship D final scale — LOCKED_FROM_D
- Exhibition Hall visual scale — LOCKED as destination-building reference band
- Harbor fleet density — NOT YET APPROVED
- Berthing / jetty layout — NOT YET APPROVED
- Visual Grammar v1.0 — LOCKED: Hybrid Orthographic 2.5D, `15°` elevation, `0°` yaw, `32 px` logical unit
- Depth / Occlusion Runtime Fix v1 — independently reviewed (`RETURN_TO_CODEX`): two Major regressions found (world-edge greenery drawn over water; viewing terrace hiding the player)
- Depth / Occlusion v1.1 regression patch — independently re-checked (`READY_FOR_SCALE_BIBLE_ASSET_WEIGHT_LOCK`); both regressions closed, Hero D / east-brig and Exhibition Hall occlusion preserved, 20/20 tests; two Minor notes and earlier deferred minors (Hall art wider than footprint, per-frame Phaser depth-sort queue) carried forward, none blocking
- Scale Bible v1 — LOCKED: visible-content measurements, category bands, and Hero D / Exhibition Hall references recorded
- Asset Weight Budget v1 — LOCKED: 1× standard export, category ceilings, practical-alpha trim, and hidden-RGB cleanup recorded
- Mass Asset Production Director Gate — PASS: Batch 01 only
- Mass Asset Production Batch 01 — IMPLEMENTED: three destination buildings, warehouse, one medium vessel, one tree, crate, and lamp integrated
- Mass Asset Production Batch 01 independent review — COMPLETE (`READY_FOR_BATCH_01_HUMAN_REVIEW`); all eight assets independently re-measured against the locked Scale Bible bands (zero hidden RGB, 4 px padding on all sides, true 1× export, all within category weight ceilings), depth/collision/IA confirmed byte-unchanged, BASE_URL loading verified live, normal production preload transfer recomputed at exactly 743,144 bytes; no Blocker/Major finding; five Minor findings recorded (a unit-rounding note, an orphaned manifest entry, the Hall's known footprint/art-width limitation now expanded to all four destination buildings, an audit-test coverage gap, and this status document's now-stale asset-weight note)
- Batch 01 human scale review — COMPLETE: `SAME_CLASS_SCALE_CONSISTENCY = REQUIRED`; Player → Door → Building Mass is now the primary-destination calibration rule; Workshop reduced, Academy increased, Guild retained, and Exhibition uniformly increased without collision/layout changes
- Legacy 15° compliance audit — COMPLETE: active Hero D, Brig, Cutter, and Medium Vessel are all compliant or compliant-with-minor; no targeted ship correction is required; retired Schooner is explicitly `DEPRECATED`
- Major Building Door Canonicalization + Harbor Layout Naturalization — IMPLEMENTED: Guild Hall v01 retained as the usable `42×52 px` door-opening reference; Academy, Workshop, and Exhibition Hall v03 regenerate internally mismatched door geometry at the same visible human scale
- Harbor layout naturalization — IMPLEMENTED: render-only destination offsets, asymmetric Harbor Square furniture, and visual path shoulders reduce cardinal rigidity; destination footprints, collision, routes, IA, water, and ship state are unchanged
- Full world asset rollout — HOLD pending door/layout human review

## Known Technical Follow-ups

- Phaser bundle size exceeds Vite's 500 kB warning threshold; track a performance budget in a later Sprint.
- `skipLibCheck` remains enabled for Phaser 4.2.1 / TypeScript 7 declaration compatibility; `src/**` remains strict.
- Sprint 2: Spatial density / environmental landmark design required. Current world bounds are provisional but retained; current empty-map density is not final design approval.
- Active Academy/Workshop v03 exports retain 1×, 4 px practical-alpha padding, hidden-RGB cleanup, and destination weight ceilings; Exhibition Hall v03 follows the same locked export policy.
- Destination-building art (330–338 px wide) is wider than the shared 256 px collision footprint for all four destinations (Guild Hall, Academy, Workshop, Exhibition Hall); safe under current footprint-blocked collision, but a player standing beside one can be partially hidden by the art's overhang (independent review Finding BR-03).

## Next
1. Independent review of Batch 02 Harbor Support + Streetscape; then proceed to Batch 03 Fleet + Dockside Activity.
