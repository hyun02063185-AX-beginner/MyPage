# 92. Portfolio World Rebuild — Handoff

Updated: 2026-09-26 (R2C)

## State

**R0/R1/R1.1 COMPLETE. HUMAN GATE 1 = APPROVED. R2A/R2A.1 COMPLETE. R2B BLOCKOUT IMPLEMENTATION COMPLETE. R2C INDEPENDENT VISUAL QA COMPLETE — BLOCKOUT REPAIR NEEDED.** R2B created only the isolated v2 source/output trees; v1 source, v1 artifact, v1 assets, and root site link are untouched. R2C made no runtime or asset changes — review only. `feature/portfolio-world-concept-vertical-slice` (v1's full history) remains preserved as reference.

```text
R0_SKILL_QUALIFICATION = COMPLETE
HUMAN_GATE_1            = APPROVED
R2A_ARCHITECTURE        = COMPLETE
R2A_1_CORRECTION        = COMPLETE
R2B_BLOCKOUT            = COMPLETE
R2B_FUNCTIONAL_QA       = COMPLETE (dev + build; no visual verdict)
R2C_VISUAL_QA           = COMPLETE — 3/8 conditions carry a Major failure
NEXT                    = R2D_BLOCKOUT_REPAIR
GATE                    = NEEDS_R2B_BLOCKOUT_REPAIR
```

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

## Next Owner: R2D Blockout Repair

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

~~R2B: implement the blockout from `05_HARBOR_BLOCKOUT_SPEC.md` §8...~~ Done in R2B. See "Next Owner: R2D Blockout Repair" above for the current next step.

## Do Not

- Modify `portfolio-world/**`, `world/**`, or any v1 asset/runtime source from this branch.
- Implement R2A's original Candidate A diagram instead of Candidate A+.
- Re-introduce a quadrant/cardinal destination arrangement around Harbor Square while deriving real coordinates. **(R2C found this risk is still present in the current coordinates — see "R2C Independent Visual QA Result" above.)**
- Adopt Candidate B's twin-basin *structure* (only its ship-anchoring idea was imported into A+).
- Call the Low/Mid/High test a "camera elevation" test, or implement it as a Phaser camera rotation.
- Treat a calibration placeholder's appearance as approved production art direction.
- Default to v1's numeric values, create a root `package.json`, or touch root `index.html`'s existing `world/` link.
