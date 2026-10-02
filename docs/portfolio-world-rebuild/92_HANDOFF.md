# 92. Portfolio World Rebuild — Handoff

Updated: 2026-10-02 (R3F Environment Art Batch D)

## Current State

**R5A HUMAN GATE = REJECTED.** The prior scene-plate gameplay direction is
retired. Keep the old v2 material only as history; do not use its Golden Master
plate as a playable background or derive collision from art pixels.

The current continuation point is the explicit `GrayboxScene` in
`portfolio-world-v2/src/scenes/GrayboxScene.ts`. Its geometry, collision
topology, player scale, and dead-zone camera/motion behavior are locked by the
approved R3A/R3A.1 Human Gate.

The selected Round 2C art-direction reference is intentionally untracked:
`output/codyssey-image-benchmark/harbor-playable-round-02c/2C-gameplay-framing.gpt-image-2.png`
with SHA-256 `7A724D1232317F2C36421C127B0C6868500272964E801757682A532E34B84271`.
It is provenance only, not a runtime asset.

R3D Batch B is now ready for its Human Gate. `GrayboxScene.ts` loads the
committed, transparent Hall B-derived facade slices and Workshop B-derived
shell at the existing four manifest rectangles only; collision, walkability,
camera, player, and foundation code remain unchanged. Review the seven 1280×720
captures, contact sheet, and PASS/CAUTION matrix in
`reports/portfolio-world-rebuild/evidence/r3d-architecture/` and
`reports/portfolio-world-rebuild/r3d-environment-art-batch-b.md`. Do not
begin Hero Ship Batch C until the human gate is recorded.

R3D.1 supersedes the failed compressed sprite integration: it uses a coherent,
grounded Hall visual envelope and a plinthed Workshop visual envelope, with no
change to collision or route code. Review `evidence/r3d1-architecture-integration/`
and `r3d1-architecture-integration-repair.md`; do not start Batch C.

`ARCHITECTURE_INTEGRATION_HUMAN_GATE = APPROVED` and
`BATCH_C_HUMAN_ROUTE_OCCLUSION_GATE = APPROVED`. The latter approves only the
Hero Ship route/depth/occlusion structure, not the overall final visual design.
R3F has now added all nine Batch D manifest assets as transparent, individual
runtime art at their existing visual rectangles: bollards, bench, lamp,
planters, crate/barrel set, Hall banners, stair/quay rails, and low-wall
vegetation. `GrayboxScene.ts` splits lamp/vegetation base versus foreground
components through depth only; collision remains entirely authoritative in the
unchanged Graybox source. The selected runtime direction is Study B, the
controlled lived-in working harbor. Evidence and the before/after sheet are in
`reports/portfolio-world-rebuild/evidence/r3f-environment-art-batch-d/`; the
implementation and Final-Look backlog are in
`reports/portfolio-world-rebuild/r3f-environment-art-batch-d.md`.

R3C Foundation Batch A has applied an aligned deterministic L1 paving/stair/
quay-edge treatment without changing the R3A geometry or collision ownership.
The two raw original Gemini PNGs remain intentionally untracked at
`output/codyssey-image-benchmark/r3c-foundation-batch-a-rerun-01/`; their
paths, hashes, dimensions, and API status are recorded in
`reports/portfolio-world-rebuild/r3c-environment-art-batch-a.md`. Review the
canonical contact sheet and seven 1280×720 runtime captures in
`reports/portfolio-world-rebuild/evidence/r3c-foundation/` before authorizing
any architecture work.

R3C.1 repairs the foundation's material fidelity only. It loads four committed
lossless Study-A-derived surface PNGs at the existing L1 rectangles, while all
movement and collision remain authoritative in `GrayboxScene.ts`. Review
`reports/portfolio-world-rebuild/r3c1-foundation-visual-fidelity-repair.md`
and its before/after contact sheet before approving any Batch B architecture.

```text
R5A_HUMAN_GATE        = REJECTED
SCENE_PLATE_DIRECTION = RETIRED
PLAYABLE_HARBOR_2A–2C = COMPLETE — selected 2C is style-only reference
R3A_GRAYBOX           = COMPLETE — geometry source of truth
R3A.1_MOTION_REPAIR   = COMPLETE — 30 fps movement evidence accepted
R3B_ART_BLUEPRINT     = COMPLETE
R3C_FOUNDATION_BATCH_A = COMPLETE — human alignment review pending
R3C.1_FIDELITY_REPAIR = COMPLETE — approved baseline
R3D_ARCHITECTURE      = COMPLETE — human review pending
ARCHITECTURE_INTEGRATION_HUMAN_GATE = APPROVED
R3E_HERO_SHIP_BATCH_C               = COMPLETE
R3E.1_OCCLUSION_EVIDENCE_REPAIR     = COMPLETE
BATCH_C_HUMAN_ROUTE_OCCLUSION_GATE  = APPROVED
R3F_ENVIRONMENT_ART_BATCH_D         = COMPLETE
NEXT                                = BATCH_D_HUMAN_CLUTTER_OCCLUSION_GATE
GATE                                = READY_FOR_ENVIRONMENT_ART_BATCH_D_HUMAN_GATE
```

## Immediate continuation

- Read `reports/portfolio-world-rebuild/r3b-environment-art-blueprint.md` and
  `data/portfolio-world/r3b-art-manifest.json` before authoring art.
- Preserve R3A graybox coordinates and collision ownership. Art belongs on the
  documented depth layers; it may not alter walkability.
- R3C.1 is complete and awaits the Human Visual Fidelity Gate. Do not start
  Batch B architecture or Batch C Hero Ship work until that gate is approved.

## Historical R5A delivery (superseded)

- Production mapping: Harbor Square → `../#about` (portfolio introduction), Exhibition Hall → `../gallery.html` (AI·AX concept gallery), Hero Quay → `../career.html` (career). No physical landmark was invented for teaching or making content in this v1 layer.
- Visitor interaction: approach the valid ground hotspot, then press **E** or short-tap/click; the compact panel has an actual-destination action, pointer close, Escape close, and Enter/E can follow the active action.
- QA/debug: normal visitor mode contains no persistent labels or route guides. `?pwDebug=1` enables the calibration-only route and location labels.
- Evidence: normal build `reports/portfolio-world-rebuild/evidence/r5a/` (9 1280 × 720 frames); dev verification `evidence/r5a1/`. The build/dev harness verifies normal mode has debug disabled, production destinations/reachability, keyboard and pointer activation, collision/walkability, and browser errors.
- Historical gate: independent R5A product visual review; it is overridden by
  the rejected R5A Human Gate above.

## Historical R4.2 scene-plate closeout (retired direction)

- Canonical input: `world.reference.golden-master.r4`, with SHA-256 and reference boundary at `portfolio-world-v2/public/assets/world/reference/golden-master-r4-provenance.md`.
- Runtime approach: scene plate plus independently authored player, constrained routes, water/structure exclusion, cargo occlusion, keyboard/pointer movement, and Exhibition Hall hotspot. The image is not treated as a completed map or a free-walk background.
- R4.2: player anchors were re-derived from the plate's visible plaza, quay, and Hall stair landing; its source asset is preserved while a muted local derivative and depth-aware contact shadow are used at runtime.
- Evidence: `reports/portfolio-world-rebuild/evidence/r4-2/` includes normal entry, overview, Hero Quay/Ship, native player scale, Square-to-Hall route, foreground occlusion, and active hotspot states.
- Validation: typecheck, build, dev/build harness, route/walkability/collision mapping, hotspot, and browser/console checks passed.
- **Functional PASS, Visual PASS, and Human Gate 2 are approved.** Next: R5A portfolio interaction layer v1.

## R3A.1 delivery (implementation only — no visual verdict)

- Active production target: `portfolio-world-v2/public/assets/world/ships/hero/hero-ship-r3a1.png` (1024 × 1024 RGBA), rendered at the preserved 460 × 460 world-px target with the preserved bottom-center waterline pivot. It is a three-mast Age-of-Sail merchant/exploration ship: foremast, mainmast, and mizzenmast are readable with yards, rigging, and tied/rolled furled cream canvas bundles; raised stern cabin and bowsprit remain visible. Manifest: `portfolio-world-v2/public/assets/world/asset-manifest.r3a1.json`; provenance: beside the asset.
- R3A.1 replaces only R3A's runtime texture mapping. The previous R3A deployed-sail target, source, manifest, provenance, and `evidence/r3a/` are retained as historical evidence. Hero Quay position, Candidate A+ layout, entry camera, MID working baseline, calm water-contact treatment, Exhibition Hall placeholder, Medium Vessel, and Small Boat are unchanged.
- Evidence: `reports/portfolio-world-rebuild/evidence/r3a1/` (`A-entry-target.png`, `B-overview-target.png`, `C-hero-target.png`, `D-hero-native-scale.png`, `hero-target-contact-sheet.png`). The runtime frames are fixed 1280 × 720 captures; C/D are the review frames for furled canvas, no broad deployed sail surface, three-mast legibility, Tier-1 scale, berth relationship, and calm water contact.
- Functional QA passed: `npm run typecheck`, `npm run build`, `npm run qa:runtime -- --mode build --set r3a1`; no asset-load, console, exception, or failed-network errors. Raster QA confirmed 1024 × 1024 RGBA, alpha, and bottom-aligned content bounds.
- Report: `reports/portfolio-world-rebuild/r3a1-hero-ship-moored-state-correction.md`. **No `VISUAL_PASS`, `PRODUCTION_APPROVED`, or `HUMAN_GATE_2` is claimed.**

## R3A delivery (historical implementation record — no visual verdict)

- Production target: `portfolio-world-v2/public/assets/world/ships/hero/hero-ship-r3a.png` (1024 × 1024 RGBA), rendered at 460 × 460 world px with bottom-center waterline pivot. Manifest: `portfolio-world-v2/public/assets/world/asset-manifest.r3a.json`; provenance: beside the asset.
- Only the Hero Ship Graphics placeholder was replaced. Medium Vessel, Small Boat, quay, Exhibition Hall and all other world art remain intentionally unfinished placeholders.
- Entry framing preserves the Harbor Square spawn but opens at camera `(1350,950)`, zoom `0.62`; `A-entry-target.png` now includes basin water, waterfront, Hero Quay and the Hero Ship.
- The Hero Ship alone has a minimal broad/rounded calm-water contact treatment. No harbor-water rewrite or sharp foam was added.
- Evidence: `reports/portfolio-world-rebuild/evidence/r3a/` (`A-entry-target.png`, `B-overview-target.png`, `C-hero-target.png`, `D-hero-native-scale.png`, `hero-target-contact-sheet.png`), all 1280 × 720 runtime captures except the asset sheet. All opened during implementation.
- Functional QA passed: `npm run typecheck`, `npm run build`, `npm run qa:runtime -- --mode build --set r3a`; no asset load, console, exception, or failed-network errors.
- Report: `reports/portfolio-world-rebuild/r3a-hero-ship-visual-target-implementation.md`. **No `VISUAL_PASS`, `PRODUCTION_APPROVED`, or `HUMAN_GATE_2` is claimed.**

## R2E Independent Recheck Result

Full report: `reports/portfolio-world-rebuild/r2e-independent-blockout-recheck.md`. Fresh session from the repo root; the three needed skills were discoverable and natively invoked. All seven `evidence/r2d/` PNGs opened.

- **Closed:** junction structure (reads as spine + separated branches), door/player scale (player beside a human-plausible door), projection judgeability (**MID selected**; LOW too side-on, HIGH drifts map-like and weakens the Hero Ship).
- **Conditions:** 1 PARTIAL, 2 PARTIAL, 3–8 PASS.
- **Open Minors to carry into the visual target:** (1) Hero Ship Tier-1 read is scale-led, generic hull; (2) `A-entry` spawn frame is land-dominant, water only ~lower-right quarter, no ship visible — fix entry camera/spawn framing first; (3) west-side clustering (Workshop leg + Guild fork + Square); (4) schematic road look, forecourt over basin edge, dark void at the overview's right edge. Polish: hull waterline contact; label collisions/clipping.
- **Do not** lock MID or any blockout number as production values; re-test HIGH vs MID once a real Hero Ship silhouette and hall facade exist.
- Level B was re-run independently into a scratch set (exit 0, byte-identical to R2D captures) and the scratch set was deleted; `evidence/r2b/` and `evidence/r2d/` are untouched.

**Next scope:** entry-camera framing fix, then one approved Hero Ship visual target at gameplay scale (`create-game-assets`), before any asset family.

## R2D Delivery (implementer — not a visual verdict)

Report: `reports/portfolio-world-rebuild/r2d-blockout-repair.md`. Evidence: `reports/portfolio-world-rebuild/evidence/r2d/` (7 PNGs; `evidence/r2b/` preserved untouched).

- **Junctions:** `SPINE`/`GUILD_BRANCH`/`ACADEMY_BRANCH`/`SQUARE` are shared constants in `portfolio-world-v2/src/scenes/WorldScene.ts`; branch origins are spine vertices. Order: working dock -> Guild stub (560,835) -> Harbor Square (centre 695,585) -> Academy branch (1085,656) -> Exhibition Hall -> Hero Quay. Guild/Academy are 284/396 px from the Square centre (deliberately not equidistant) and 555 px apart.
- **Scale:** door 38 x 68 px (~1.26x the 54 px player), fixed; `scale` QA state puts the player beside it. Forecourt paving now sits under the hall; bench/lamp share the ground line.
- **Projection:** LOW/MID/HIGH exchange facade/hull side for roof/deck top plane on hall, Hero Ship and quay. Camera identical. Nothing selected.
- **Also:** route corridors are now walkable through the basin edge; harness takes `--set <phase>` (default `r2d`; `r2b` needs `--allow-overwrite-historical`).

**For the independent recheck:** judge screenshot B at squint distance (spine with branches, or four roads from one area?), screenshot D directly (door as a human doorway, player beside it), and the three projection frames by eye. Things to look at critically: the Guild road still runs near the Square's west side; Academy's origin is 153 px from the hall roof edge (hall was fixed by the preserve list); forecourt/Square still overlap the basin edge. Do not accept the pixel-diff percentage as evidence.

Run: from `portfolio-world-v2/`, `npm run typecheck`, `npm run build`, `npm run qa:runtime` and `npm run qa:runtime -- --mode build` (both write `evidence/r2d/`).

## R2B Delivery

- Source: `portfolio-world-v2/` (Phaser 4.2.1, `BootScene` → `WorldScene`, Graphics/text only).
- Committed artifact: `world-v2/` with `/MyPage/world-v2/` production base.
- Candidate A+ blockout: one crescent basin, bent walking spine, offset Square, Exhibition Hall mass, asymmetric Hero Quay and berthing Hero Ship; Guild/Academy/Workshop remain secondary flat markers.
- Runtime: WASD/arrow movement, main-basin exclusion, deterministic `?qa=entry|overview|hero|scale`, deterministic `?projection=low|mid|high`, stable orthographic camera states.
- QA harness: `portfolio-world-v2/qa/r2b-runtime-qa.mjs`; dev and built preview passed at 1280 × 720 with canvas/WorldScene/error/network checks clean.
- Evidence: `reports/portfolio-world-rebuild/evidence/r2b/`; implementation record: `reports/portfolio-world-rebuild/r2b-blockout-implementation.md`.

## R2C Independent Visual QA Result

Full report: `reports/portfolio-world-rebuild/r2c-independent-blockout-visual-qa.md`. All seven evidence PNGs opened and inspected; skills applied by direct file read (not discoverable via the Skill tool this session — see report §2).

**3 of 8 Blockout PASS conditions carry a documented Major failure:**

- **Condition 3 & 4** (Harbor Square not the geometric center; destinations not cardinal/quadrant around it): the four destination branches converge on one small junction cluster ~150px across and fan out in four compass-like directions (Academy N/NE, Guild Hall NW, Workshop SW, Exhibition E). This is the same perceptual pattern R2A.1 corrected the original Candidate A for — the coordinates R2B derived have not yet delivered the separation `05_HARBOR_BLOCKOUT_SPEC.md` §4's own text describes (e.g. "Academy sits further along a longer inland branch").
- **Condition 7** (scale relationships): the `D-scale-calibration.png` capture shows the player sprite standing directly on/overlapping the Exhibition Hall door placeholder, and the visible door height reads as ~2–3x the player's height — fails calibration question 2 ("does the door make human scale obvious") outright, per that plan's own "a 'no' on any question means the relative scale is wrong" rule.

The Low/Mid/High illustrated-projection comparison also produced no visually differentiable evidence between candidates (pixel diff <1% in every pairwise comparison, confined to a small roof/sail region) — recorded as `NO_VARIANT_READY`, not defaulted to MID.

**Final Gate: `NEEDS_R2B_BLOCKOUT_REPAIR`.**

## R2D Scope (completed — kept as the brief R2D worked from)

Do not redesign Candidate A+ — its relational rules (`05_HARBOR_BLOCKOUT_SPEC.md` §6) are sound and not in question. Fix only:

1. Increase separation between the two destination-branch junctions so the four destinations no longer read as radiating from one cluster in four compass-like directions.
2. Fix the `D` scale-calibration capture: move the player marker beside (not on top of) the Exhibition Hall door placeholder, and reduce the door placeholder's height toward a normal human-door ratio (~1.2–1.5x player height).
3. Widen the Low/Mid/High illustrated-elevation delta enough to be visually distinguishable, then re-run the projection comparison.

Re-capture evidence with `npm run qa:runtime -- --mode build` from `portfolio-world-v2/` after each fix. A fresh independent visual QA pass (not self-graded) is required before returning to `READY_FOR_REPRESENTATIVE_VISUAL_TARGET`.

## What R2A.1 Actually Changed (on top of R2A)

No new top-level tree. Edits only:

- `05_HARBOR_BLOCKOUT_SPEC.md` — Candidate A+ added (§4), superseding Candidate A as the selected layout; Hero Ship placement, destination-zone table, and blockout scope all rewritten to match; calibration placeholders added to scope (§8).
- `06_SCALE_CAMERA_CALIBRATION_PLAN.md` — "camera elevation" renamed to "illustrated projection / asset view elevation" throughout §1; explicit statement that the Phaser runtime camera is a 2D orthographic canvas camera with no rotation/perspective simulation.
- `07_RUNTIME_QA_PLAN.md` — required screenshot C's description updated to the quay-anchored relationship; Blockout PASS conditions expanded 6→8.
- `90_DECISIONS.md`, `91_STATUS.md`, `92_HANDOFF.md` (this file) — updated.
- New: `reports/portfolio-world-rebuild/r2a1-director-layout-correction.md`.
- `04_ARCHITECTURE_V2.md` — checked, no change needed (no camera-terminology or layout-center claim in it required correction).

## Key Corrections R2B Needs Before Writing Code

1. **Build from Candidate A+, not R2A's original Candidate A diagram.** `05_HARBOR_BLOCKOUT_SPEC.md` §4 is the current, superseding design. §1–3 are kept only as the historical record of how A+ was reached — do not implement §1's original diagram.
2. **Harbor Square is off-center, on the walking spine, never a hub.** No destination may be described or placed as "north/south/east/west of the square," and no two destinations may end up as mirror-image opposites through it (`05_HARBOR_BLOCKOUT_SPEC.md` §6's explicit check). Re-verify this property whenever real coordinates are derived — it is easy to accidentally reintroduce while translating a schematic into numbers.
3. **The Hero Ship is anchored to an asymmetrical quay/pier tongue**, not a bare diagonal sightline. Its masts/sails overlapping land/background visual space is explicitly permitted, not a defect.
4. **"Camera elevation" is the wrong term — say "illustrated projection / asset view elevation."** The Phaser scene camera itself never rotates or simulates perspective; only how buildings/ships are *drawn* varies across the Low/Mid/High test candidates. Do not implement camera-side rotation/tilt to produce this test.
5. **Calibration placeholders (Medium Vessel, Small Boat, Bench, Lamp, Door, paving reference) are in scope for R2B, but are not production assets.** Simple flat shapes only. Do not treat their appearance as an approved design direction for those categories.
6. **Blockout PASS is now 8 conditions**, including two made explicit by this correction: Harbor Square must not look like the geometric center, and the four destinations must not read as organized cardinally/in quadrants around it. Both are judged from the actual screenshot B, not inferred from having used a crescent shape.
7. Everything else from R2A's handoff still applies unchanged: `portfolio-world-v2/`/`world-v2/` paths, the 2-scene model, functional-PASS-≠-visual-PASS, the skill-discovery caveat, and the "do not default to v1 numeric values" rule.

## Next Recommended Step (superseded by R2C above — kept as historical record of the R2A.1→R2B handoff)

~~R2B: implement the blockout from `05_HARBOR_BLOCKOUT_SPEC.md` §8...~~ Done in R2B. See "R2D Delivery" above for the current state.

## Do Not

- Modify `portfolio-world/**`, `world/**`, or any v1 asset/runtime source from this branch.
- Implement R2A's original Candidate A diagram instead of Candidate A+.
- Re-introduce a quadrant/cardinal destination arrangement around Harbor Square while deriving real coordinates. **(R2C found this risk is still present in the current coordinates — see "R2C Independent Visual QA Result" above.)**
- Adopt Candidate B's twin-basin *structure* (only its ship-anchoring idea was imported into A+).
- Call the Low/Mid/High test a "camera elevation" test, or implement it as a Phaser camera rotation.
- Treat a calibration placeholder's appearance as approved production art direction.
- Default to v1's numeric values, create a root `package.json`, or touch root `index.html`'s existing `world/` link.
