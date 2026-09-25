# 91. Portfolio World — Project Status

Updated: 2026-09-25

## Phase
PORTFOLIO WORLD V1 — RELEASED BASELINE; POST-V1 ENVIRONMENT SURFACE PASS — TECHNICALLY COMPLETE; CONCEPT QUALITY LOCK — COMPLETE; HARBOR VERTICAL SLICE PRODUCTION — IMPLEMENTED; HARBOR VERTICAL SLICE MAJOR REPAIR — IMPLEMENTED; HARBOR VERTICAL SLICE INDEPENDENT SHORT RE-CHECK — COMPLETE; HUMAN REVIEW #1 — COMPLETED WITH 3 POLISH NOTES; ART-07 HUMAN POLISH — IMPLEMENTED; INDEPENDENT POLISH REVIEW — COMPLETE; HUMAN REVIEW #2 — COMPLETED WITH 2 REFINEMENT NOTES; ART-11 ROWBOAT/DINGHY WATERLINE FOCUSED REPAIR — IMPLEMENTED

```text
HUMAN_REVIEW_1             = COMPLETED_WITH_3_POLISH_NOTES
ART_07_HUMAN_POLISH         = IMPLEMENTED
INDEPENDENT_POLISH_REVIEW   = COMPLETE
HUMAN_REVIEW_2             = COMPLETED_WITH_2_REFINEMENT_NOTES
TYPOGRAPHY                  = HUMAN_ACCEPTED_LOCKED
ART_09_FOCUSED_REFINEMENT   = IMPLEMENTED — PARTIAL (pavement PASS; vessel Hero/Medium/Workboat PASS; Rowboat/Dinghy returned by ART-10)
ROWBOAT_DINGHY_WATERLINE_REPAIR = IMPLEMENTED
HERO_MEDIUM_WORKBOAT        = LOCKED_PASS
PAVEMENT                    = LOCKED_PASS
INDEPENDENT_SHORT_RECHECK   = PENDING
FINAL_HUMAN_REVIEW          = PENDING INDEPENDENT SHORT RECHECK
FINAL_ART_DIRECTION         = ACCEPTED_WITH_POLISH
NEXT                        = INDEPENDENT_SHORT_RECHECK
GATE                        = READY_FOR_HARBOR_ROWBOAT_SHORT_RECHECK
```

## Current Work Unit

ART-11 (Rowboat/Dinghy Waterline Focused Repair) is implemented on `feature/portfolio-world-concept-vertical-slice`, starting from `7064346e3eda566aae91e31a1c6cc658de8493e6`. ART-10's Major root cause was the small Dinghy asset's practical alpha bottom ending above its high origin while the shared occlusion raster's opaque band remained below it. The Rowboat tier alone now lifts that same raster from `occlusionY: -1` to `-11`, placing its opaque middle over real cream/teal lower-hull pixels without increasing the layer, regenerating art, or changing other tiers. Fresh headless Edge close captures confirm actual hull-pixel occlusion on both the service-jetty dinghy and mid-basin rowboat; Hero, Medium, and Workboat remain code- and visually unchanged. 0 console/page errors. Full evidence: `reports/portfolio-world/art-production/harbor-rowboat-dinghy-waterline-focused-repair.md`.

- Post-v1 Environment Surface Pass = **TECHNICALLY COMPLETE** (unchanged historical verdict; not reopened).
- Concept Quality Lock = **COMPLETE**. Production specification: `reports/portfolio-world/art-direction/concept-quality-lock-harbor-vertical-slice.md`.
- Harbor Vertical Slice Production (ART-02) = **IMPLEMENTED**; ART-03's independent findings remain historical evidence.
- Structural lock re-confirmed independently: world dimensions, collision, routes/navigation, berths, depth formula, and every locked building/ship PNG are unchanged through ART-04/ART-05/ART-06/ART-07/ART-08/ART-09/ART-10.
- Independent Visual QA (ART-03) = **COMPLETE**: Blocker 0, Major 3, Minor 2. (Its own Section P table recorded 5 FAIL / 3 PASS; its prose summary line undercounted this as "4 of 8 fail" — corrected in the ART-05 report, table itself was already correct.)
- Harbor Vertical Slice Major Repair (ART-04) = **IMPLEMENTED**: Major 1/2/3 closed in the actual running app; two new generated-original contact layers add 57,031 bytes.
- Independent Short Re-check (ART-05) = **COMPLETE**: Blocker 0, Major 0, all three Majors independently confirmed CLOSED, 8/8 quality gates PASS.
- Human Review #1 (ART-06) = **COMPLETED_WITH_3_POLISH_NOTES**; ART-07 Human Polish = **IMPLEMENTED**; Human Review #2 = **COMPLETED_WITH_2_REFINEMENT_NOTES**; `TYPOGRAPHY = HUMAN_ACCEPTED_LOCKED`.
- Independent Polish Review (ART-08) = **COMPLETE**: Blocker 0, Major 0, Minor 2, all three Polish notes independently confirmed PASS.
- ART-09 Focused Refinement = **IMPLEMENTED, PARTIAL**: pavement fine-grain and Hero/Medium/Workboat vessel occlusion resolved; ART-10 returned only Rowboat/Dinghy for repair.
- ART-11 Rowboat/Dinghy Waterline Focused Repair = **IMPLEMENTED**: existing raster's opaque band is aligned to real lower-hull pixels for both rowboat-tier instances. Hero/Medium/Workboat = LOCKED PASS; pavement = LOCKED PASS; typography remains human-accepted and locked.
- Automated Harness = **PASS 35/35**, independently reproduced (ART-05, ART-08, ART-10); unchanged by ART-06 (docs only).
- Official records: `reports/portfolio-world/art-production/harbor-vertical-slice-final-independent-recheck.md` and `reports/portfolio-world/art-production/harbor-rowboat-dinghy-waterline-focused-repair.md`.
- Gate: `READY_FOR_HARBOR_ROWBOAT_SHORT_RECHECK`.

## Environment Art Major Repair + Short Visual Re-check — 2026-09-24 (historical, superseded above)

Automated Harness = PASS (35/35). Blocker 0, Major 0; the optional compacted-ground Minor is closed, while only the explicitly carried-forward ground flecks and Vite chunk-size Minor remain deferred. This remains a valid, closed technical milestone; it is the pass that the new Concept Quality Lock determines is not yet final-art quality (see Current Work Unit above).

## Environment Art Major Repair + Short Visual Re-check — 2026-09-24

- Replaced the world-edge rectangle's corner-to-corner `lineBetween()` accent with an axis-aligned `strokeRect()` perimeter highlight. The north/south/east/west edge treatment no longer creates an across-world diagonal streak.
- Safely closed the optional Workshop/waterfront compacted-ground Minor in the same visual-only renderer: three low-alpha, large-radius inset layers replace each hard-edged rounded rectangle. No geometry, collision, routes, buildings, fleet, berths, navigation, or world dimensions changed.
- Fresh inspection of the actual running app covered the whole-world overview plus Academy, Guild Hall, Workshop, and waterfront framings. The diagonal artifact was absent in every required view; the compacted-ground transition no longer reads as a large hard-edged block.
- Typecheck, `npm test` **35/35**, production build, and `git diff --check` pass. Production preload is unchanged at **31 assets / 561,180 bytes**; only the generated application bundle hash changed for the visual code update.
- Official re-check: `reports/portfolio-world/environment-art-major-repair-short-visual-recheck.md`.

## Environment Art Completion — Independent Whole-world Visual QA — 2026-09-24

- Independently reviewed the actual running application (Vite dev server, Playwright/Chromium), not source or the production report's own claims: whole-world overview, Harbor Square, Guild Hall, Academy, Workshop, Exhibition promenade, waterfront/fleet, and shoreline/path transitions, using both the project's existing dev-only QA camera framings and real player-driven movement. 15 screenshots captured; 0 console/page errors throughout.
- **1 Major finding**: `drawHarborEdgeTreatment()` in `harborVisualCatalog.ts` draws each world-edge accent as a corner-to-corner `lineBetween`, producing a long diagonal streak across the full length of each edge (2048 px at north/south, 1152 px at west/east) instead of a border highlight. Clearly visible in the whole-world overview and directly behind the Academy (north) and Guild Hall (west) approaches. The function itself predates this batch's diff, but it directly contradicts this pass's own "remove grid/mockup-like ground artifacts" goal and was not caught by the pass's own production visual inspection.
- **2 new Minor findings**: the Workshop/waterfront compacted-ground patches (`drawHarborGround`, two `fillRoundedRect` calls) read as visibly rectangular/hard-cornered rather than organically blended at gameplay zoom; the pre-existing ground-detail flecks first noted in the Batch 04 Whole-world Visual QA remain present and unchanged (no new action, carried forward).
- No layout, collision, route, building, or fleet data was touched or found changed from the accepted V1 baseline; no file was modified by this review.
- **Verdict: not yet ready for Human Review.** A scoped repair of the Major finding (edge-treatment diagonal line), plus optional repair of the ground-patch Minor, followed by a short re-check, is recommended before Human Review.
- Official record: `reports/portfolio-world/environment-art-completion-whole-world-visual-qa.md`.

## Environment Art Completion — Production — 2026-09-24

- Replaced the visible grass grid and flat ground treatment with static macro terrain masses, quiet grass clusters, workshop/waterfront compacted-ground patches, material paths, and worn Harbor Square paving.
- Replaced flat/repeated water treatment with deep/shallow layered water, offset ripples, foam highlights, and explicit shoreline contact. No shader, animation, binary asset, collision, berth, route, camera, building, or fleet change was made.
- Production source and runtime were inspected locally; no Blocker or Major was observed. Automated suite passes **35/35**. Production preload remains **31 assets / 561,180 bytes** (delta 0).
- Official record: `reports/portfolio-world/environment-art-completion-production.md`.

## Production Release Closeout — 2026-09-22

- `main` release merge `eaadc02` is pushed to `origin/main`; the feature tip is `e68b673` and is preserved by the merge.
- Fresh pre-merge and post-merge QA both passed: clean install, typecheck, build, `npm test` **35/35**, and `git diff --check`. Canonical BootScene preload remains **31 assets / 561,180 bytes**.
- GitHub Pages production was verified at `/MyPage/` and `/MyPage/world/`: the root entry opens World, its 1024×576 canvas and deployed hashed assets load with 0 console warnings/errors, the World exit returns to root, and all four portfolio targets load.
- Final evidence: `reports/portfolio-world/portfolio-world-v1-release-closeout.md`.

## Release Blocker Short Recheck — 2026-09-22

- Independently re-verified `74e4353`/`97383e2` in a running production build (headless-browser driver against a GitHub-Pages-shaped local server), not from source or unit tests alone.
- Root "Portfolio World" link clicked live → `/MyPage/world/` loads, 0 console errors. RR-01 = CLOSED.
- All four forecourts (Guild Hall, Academy, Workshop, Exhibition Hall) reached by real held movement keys from spawn; each correct prompt appeared; E, Enter, and click were each exercised and each deliberately activated navigation to the correct `/MyPage/*.html` target; proximity alone did not navigate. RR-02 = CLOSED.
- QA reproduced: typecheck/build/test 35/35, `git diff --check` clean, preload unchanged at 31 assets / 561,180 bytes, worktree clean.
- Blocker = 0, Major = 0; the known Vite >500 kB chunk warning remains Minor/deferred.
- Report: `reports/portfolio-world/release-blocker-short-recheck.md`.

## Release Blocker Repair — 2026-09-22

- RR-01 root World entry and RR-02 World destination navigation are implemented.
- Root portfolio now provides an optional `world/` entry. Guild Hall, Academy, Workshop, and Exhibition Hall use existing forecourts and intentional E/Enter/click activation to resolve their canonical Pages-safe portfolio targets.
- No ship, asset, layout, world dimension, collision, zoning, or Batch 04 visual change was made. Preload remains **31 assets / 561,180 bytes**.
- `npm ci`, typecheck, build, and `git diff --check` pass; tests are **35/35**; production World console errors are 0.
- Repair report: `reports/portfolio-world/release-blocker-navigation-repair.md`.
- Next gate: `READY_FOR_RELEASE_BLOCKER_SHORT_RECHECK`.

## Batch 04 + Fleet Native Resolution Human Acceptance — 2026-09-22

- Batch 04 Whole-world Environment Completion = **COMPLETE / HUMAN ACCEPTED**.
- Fleet Native Resolution = **COMPLETE / HUMAN ACCEPTED**. Hero, Medium, Brig, and Cutter remain v03 native-resolution remasters at 1.0 runtime scale with approved apparent size, mixed facings, furled sails, berth layout, and 15° grammar preserved.
- Whole-world composition, Harbor Square, destination readability, zone transitions, harbor/fleet presence, and density/balance were accepted by Human Review.
- Acceptance record: `reports/portfolio-world/batch-04-human-acceptance.md`.
- The historical release audit found two Blockers: missing root World entry and missing World destination interaction/link handling. Both are now implemented; this does not reopen the accepted visual milestone.
- Historical audit: `reports/portfolio-world/release-readiness-audit.md`. Current repair gate: `READY_FOR_RELEASE_BLOCKER_SHORT_RECHECK`.

## Fleet Native-Resolution Quality Pass — 2026-09-22

- Active Hero Ship D, Medium Vessel, Brig, and Cutter are v03 native-resolution remasters. Their approved visible envelopes, berth positions, roles, mixed facings, furled sail state, and 15° grammar are preserved while their runtime scales are reduced to 1.0.
- Workboat and Dinghy are unchanged. No world geometry, collision, IA, paths, depth, docking, buildings, or waterfront zoning changed.
- Native-resolved active ship preload is 82,276 bytes. Canonical BootScene production preload is now 31 assets / 561,180 bytes (−42,233 bytes).
- Automated Harness = PASS (32/32); material vessel overlap = 0; production preview paths return HTTP 200; Blocker/Major = 0.
- Human Review: **ACCEPTED**; Fleet Native Resolution is **COMPLETE / HUMAN ACCEPTED**.
- Historical implementation report: `reports/portfolio-world/fleet-native-resolution-quality-pass.md`; acceptance record: `reports/portfolio-world/batch-04-human-acceptance.md`.

## Batch 04 Production Closeout — 2026-09-21

- Batch 04 Production = IMPLEMENTED. Automated Harness = PASS (32/32).
- Four visual-only reuse placements complete the Guild Hall edge, Academy approach, Workshop transition, and Exhibition promenade. No destination, vessel, berth, path, world dimension, navigation, collision, or depth policy changed.
- New production assets: 0. Canonical BootScene preload remains 31 assets / 603,413 bytes.
- Whole-world rendered-material overlap sweep: 0 unintended overlaps. Production QA Blocker = 0, Major = 0; no new Minor or Polish finding. Two historical Minor notes remain deferred.
- Batch 04 Whole-world Visual QA and Human Review are complete; Batch 04 is **COMPLETE / HUMAN ACCEPTED**.
- Historical production report: `reports/portfolio-world/batch-04-whole-world-environment-completion.md`; acceptance record: `reports/portfolio-world/batch-04-human-acceptance.md`.

## Canonical Closeout — 2026-09-21

- Batch 02 is COMPLETE / HUMAN ACCEPTED.
- Batch 03 Integration is TECHNICALLY VERIFIED.
- Fleet Authenticity is IMPLEMENTED + INDEPENDENTLY REVIEWED; Fleet Presence Refinement is IMPLEMENTED + CLOSEOUT VERIFIED.
- Current Harbor visual direction is locked enough for continuation. The final refinement has Hero 1.35×, Medium 1.30×, Brig 1.25×, Cutter 1.30×, mixed facings, zero alpha-envelope vessel overlap, waterfront work zoning, and Harbor Square landscape zoning.
- Current validation is 32/32 passing; canonical production preload is 603,413 bytes across 31 BootScene assets.
- Batch 04 Production is IMPLEMENTED: Whole-world Environment Completion + Final Balance is ready for independent Visual QA only.
- Batch 04 workflow: Production → Harness → Visual QA → grouped Major repair → short confirmation → Human Review.
- Blocker and Major findings must close before Human Review; Minor and Polish findings are recorded/deferred unless milestone-harming.

This closeout supersedes older Fleet Authenticity “human review pending” references below, which remain as historical records.

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
- Batch 02 Harbor Support + Streetscape — COMPLETE (human-accepted)
- Batch 03 independent review — RETURN_TO_CODEX; integration hotfix — IMPLEMENTED; short re-check — PENDING
- Fleet Authenticity Pass — NOT STARTED
- Batch 04 — historical pre-production note superseded by the Batch 04 Production Closeout above
- Fleet Authenticity Production Pass — IMPLEMENTED; independent review — COMPLETE (`READY_FOR_FLEET_AUTHENTICITY_HUMAN_REVIEW`); all four regenerated PNGs directly opened and pixel-decoded (not just JSON-trusted), active-asset replacement traced end-to-end to WorldScene rendering, 15°/sail-state/Age-of-Sail/hierarchy/berth/overlap/hygiene/preload independently re-verified, 31/31 tests, preload recomputed at 603,413 bytes; three Minor findings recorded (overlap validator does not extend rendered-alpha checking to the four regenerated sailing vessels; Hero D's hull window row is ambiguously gunport-like; Cutter's very small source canvas lowers visual-confidence slightly); no Blocker/Major. This historical authorization note is superseded by the Batch 04 Production Closeout above.

## Known Technical Follow-ups

- Phaser bundle size exceeds Vite's 500 kB warning threshold; track a performance budget in a later Sprint.
- `skipLibCheck` remains enabled for Phaser 4.2.1 / TypeScript 7 declaration compatibility; `src/**` remains strict.
- Sprint 2: Spatial density / environmental landmark design required. Current world bounds are provisional but retained; current empty-map density is not final design approval.
- Active Academy/Workshop v03 exports retain 1×, 4 px practical-alpha padding, hidden-RGB cleanup, and destination weight ceilings; Exhibition Hall v03 follows the same locked export policy.
- Destination-building art (330–338 px wide) is wider than the shared 256 px collision footprint for all four destinations (Guild Hall, Academy, Workshop, Exhibition Hall); safe under current footprint-blocked collision, but a player standing beside one can be partially hidden by the art's overhang (independent review Finding BR-03).

## Next
1. (Superseded — repair completed, see Environment Art Major Repair section above.)
2. Begin ART-02 — Harbor Concept-quality Vertical Slice Production per `reports/portfolio-world/art-direction/concept-quality-lock-harbor-vertical-slice.md` (Section U). One grouped pass: terrain/water/shoreline illustrated art for the Harbor Square/Exhibition Hall/waterfront slice, ship-water grounding (occlusion mask + contact shadow + contact ripple) for Hero Ship and in-slice secondary vessels, building-foundation grounding, wiring the already-produced but unused prop PNGs (crate/barrel/bench/lamp/rope-coil/safety-rail/mooring-bollard/service-marker/tree/planter) to their existing textures, manifest updates, build, and QA. Do not reopen locked ship/building designs, collision, routes, navigation, or world dimensions. No Human Review until Vertical Slice QA is complete.
