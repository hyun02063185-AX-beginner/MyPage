# 92. Portfolio World Rebuild — Handoff

Updated: 2026-09-26 (R3A)

## State

**R0/R1/R1.1 COMPLETE. HUMAN GATE 1 = APPROVED. R2A/R2A.1 COMPLETE. R2B BLOCKOUT IMPLEMENTATION COMPLETE. R2C INDEPENDENT VISUAL QA COMPLETE. R2D BLOCKOUT REPAIR COMPLETE. R2E INDEPENDENT RECHECK COMPLETE. R3A HERO SHIP TARGET IMPLEMENTED — READY FOR R3A INDEPENDENT VISUAL QA.** R3A changes only the isolated v2 source/output trees; v1 source, v1 artifact, v1 assets, and root site link remain untouched. `feature/portfolio-world-concept-vertical-slice` (v1's full history) remains preserved as reference.

```text
R0_SKILL_QUALIFICATION = COMPLETE
HUMAN_GATE_1            = APPROVED
R2A_ARCHITECTURE        = COMPLETE
R2A_1_CORRECTION        = COMPLETE
R2B_BLOCKOUT            = COMPLETE
R2B_FUNCTIONAL_QA       = COMPLETE (dev + build; no visual verdict)
R2C_VISUAL_QA           = COMPLETE — 3/8 conditions carry a Major failure
R2D_BLOCKOUT_REPAIR     = COMPLETE (dev + build functional QA clean)
R2E_VISUAL_RECHECK      = COMPLETE — all three R2C Majors closed; 0 Blocker / 0 Major / 4 Minor / 2 Polish
R3A_HERO_SHIP_TARGET    = IMPLEMENTED — functional QA complete; visual approval pending
PROJECTION              = MID working baseline (not locked)
NEXT                    = R3A_INDEPENDENT_VISUAL_QA
GATE                    = READY_FOR_R3A_INDEPENDENT_VISUAL_QA
```

## R3A delivery (implementation only — no visual verdict)

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
