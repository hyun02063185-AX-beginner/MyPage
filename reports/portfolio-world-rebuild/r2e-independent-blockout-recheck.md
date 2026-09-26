# R2E — Independent R2D Visual Recheck

Date: 2026-09-26
Branch: `feature/portfolio-world-rebuild-v2`
HEAD verified before review: `174c609`
Reviewer role: Independent Environment Art Reviewer / Visual QA Reviewer (review only — no runtime, asset, layout, or contract-doc edits)

## 0. Scope Discipline

Not modified: `portfolio-world-v2/**`, `world-v2/**`, `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, `evidence/r2b/`, `evidence/r2d/`. No assets created, no layout repaired.

One non-modifying action worth stating: to close the Level B gate I ran the existing harness once in build mode into a **scratch** evidence set (`--set r2e`), compared its output to the committed R2D captures, and deleted the scratch directory. The working tree was clean afterwards (see §9).

## 1. Working Directory / Skill Discovery

- Working directory: `C:\Users\hyun0\MyPage` (repository root). Branch `feature/portfolio-world-rebuild-v2`, HEAD `174c609`, tree clean at start.
- Fresh session started from the repository root.

| Skill | Role | Discoverable in Skill-tool list | Natively invoked |
| --- | --- | --- | --- |
| `environment-art` | Primary | Yes | Yes |
| `portfolio-world-visual-qa` | Primary | Yes | Yes |
| `create-game-assets` | Secondary | Yes | Yes |

No direct-read fallback was needed. This confirms the R2C failure to discover these skills was the working-directory limitation recorded in `90_DECISIONS.md` open item 7, not a materialization defect.

## 2. Inputs Read

Read before opening any image: `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, `05_HARBOR_BLOCKOUT_SPEC.md`, `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, `07_RUNTIME_QA_PLAN.md`, then `r2c-independent-blockout-visual-qa.md` and `r2d-blockout-repair.md`. The R2C report was treated as the defect list; the R2D report as the implementer's claims, not visual proof.

## 3. Images Actually Opened

All seven of `reports/portfolio-world-rebuild/evidence/r2d/` were opened and viewed at full frame:

`A-entry.png`, `B-overview.png`, `C-hero-quay.png`, `D-scale-calibration.png`, `projection-low.png`, `projection-mid.png`, `projection-high.png`.

Two derived crops were also opened (scratchpad, not committed): a 3× crop of the door/player/bench/lamp region from `D`, and a side-by-side crop of the Exhibition Hall + Hero Ship + quay region from LOW | MID | HIGH. Both were taken to check the eye's reading of the full frames, not to replace it. No pixel diff was used for any verdict.

Gate check: all evidence viewable. **Not** `BLOCKED_VISUAL_EVIDENCE_NOT_VIEWED`.

## 4. R2C Major #1 — Harbor Square / Junction Structure (`B-overview.png`)

**What I see (squint test).** A single long route enters at the working dock in the lower-left (Workshop, at the end of the line), runs up and to the right, widens into the Harbor Square rectangle in the upper-left third, continues east as one road, and bends down to the Exhibition Hall and the diagonal Hero Quay. Two side roads leave that route: a short one going up-left to Guild Hall early on, and a long one going up-right to Academy late. Reading it cold, the description is *a spine from the working dock to the quay with two side branches*. It is no longer *four roads out of one area*.

Specific checks:

| Check | Finding |
| --- | --- |
| Square is one widening on a route | Yes. The route enters the Square's lower-left corner and leaves from its right side; it is a wide spot on the road, not a destination all roads converge on. |
| Guild branch earlier / nearer | Yes. It leaves on the first bend of the western leg, before the Square, and is a short stub. |
| Academy branch meaningfully later | Yes. It leaves after a long stretch of open spine east of the Square, roughly halfway to the hall, and runs a long way inland. The R2B failure (Academy leaving from the Square's edge) is gone. |
| Workshop reads as endpoint / working-dock side | Yes. It is the terminus of the line, sitting on the timber working dock at the water. |
| Exhibition reads as continuation toward waterfront / Hero Quay | Yes. The spine runs straight into the hall and on into the quay; the hall's forecourt sits at the water. |
| Two junctions no longer collapse into one cluster | Yes. The Guild fork and the Academy fork are on opposite sides of the Square, ~280 px apart at overview zoom, with the Square and a long road between them. |
| Destinations no longer fan out NW/NE/SW/E around the Square | Yes in the overview. Route topology, not marker position, now tells the story: the roads do not meet at the Square. |

**Condition 3 — Harbor Square does not read as geometric/navigation center: PASS.** It sits in the upper-left third and is passed *through*, not radiated *from*.

**Condition 4 — Destinations not cardinal/quadrant around the Square: PASS**, with a residual noted as Minor 3 below. Guild and Academy are not mirror-image (very different distance, very different fork positions), which is the exact pattern `05_HARBOR_BLOCKOUT_SPEC.md` §6 warns about.

R2C Major #1: **CLOSED.**

## 5. R2C Major #2 — Door / Player Scale (`D-scale-calibration.png`)

Judged from the screenshot, and confirmed on the 3× crop:

- The player stands **beside** the door, to its right, with a clear gap (about a body-width) and no overlap. The R2B defect (player on top of door) is gone.
- The door now reads as an ordinary human doorway: about 1.2× the player's height and roughly one and a half player-widths wide. It no longer looks like a gate or slab.
- The relationship is understood at a glance: person, door, building, in that order of size.
- Bench: about knee height against the player, plausible. Lamp: about twice player height, plausible. Both sit on the same ground line as the player and door. Forecourt paving sits under the hall rather than beside it.
- Building mass: the facade is a few door-heights tall, reading as a two- or three-storey hall; the roof and windows are in proportion to the door.
- Fleet hierarchy where visible: the Hero Ship (lower right, cropped) and the Medium Vessel (lower left, cropped) are clearly different sizes. Small Boat is out of this frame; hierarchy for it is judged in `B`/`C`.

The paving is still a flat placeholder patch and is not judged as a finished surface (per plan, §2).

**Condition 7 — Player/building/vessel scale: PASS.**

R2C Major #2: **CLOSED.** The implementation numbers (`38x68`, `1.26x`) were not used as evidence.

## 6. Projection Variants (LOW / MID / HIGH)

Opened side by side, by eye first.

**Can a reviewer describe the difference without tools? Yes.** The three are distinguishable at overview scale, not only in a crop.

| | LOW | MID | HIGH |
| --- | --- | --- | --- |
| Hall | Tall flat facade, roof reduced to a thin cap | Facade plus a clear gable roof | Short facade under a large hip-roof top plane with shingle courses |
| Hero Ship | Thick slab hull, dark underside, essentially no deck | Hull side plus a visible strip of deck | Wide plank-lined deck, thin hull, shorter masts |
| Quay | Dark front face reads like a wall | Thin front edge | Top plane only, lighter |

LOW is more facade and hull side and less roof/deck; HIGH is more roof/top plane and deck and shallower hull side; MID sits between them. This matches the intent.

**Selected: `MID`.** Visual reasons, from the frames:

- **LOW is too side-on.** The plan-view ground (the Square rectangle with paving lines, the top-down water ellipse) does not match a flat front elevation; the hall becomes a box with a lid, the quay reads as a wall, and the Hero Ship has no deck at all. That fails the plan's acceptance question "do ships show hull side plus some deck". The 2.5D consistency is the worst of the three.
- **HIGH is drifting map-like.** The hall's facade collapses to little more than the door and a window row under the roof, and the Hero Ship's hull side is a sliver with masts about a fifth shorter. The Hero Ship loses vertical silhouette and stops clearly out-ranking the hall; the terracotta roof plane becomes the single loudest shape near the ship, which competes for the squint-test focal point.
- **MID answers all five acceptance questions.** Facade readable with a roof; ship shows hull side plus some deck; the basin keeps its presence; the player remains readable; the destination approach stays clear. Its Hero Ship keeps the tallest silhouette/mass advantage over the hall that still leaves the hall relevant.

This is a chosen variant, not a default: it was picked on the acceptance questions above, and LOW and HIGH were each rejected for a stated visual reason. HIGH is a credible runner-up and fits the plan-view ground better than MID does; that trade should be revisited when a real Hero Ship silhouette exists (see next scope).

Projection calibration Major (R2C #3): **CLOSED.**

## 7. Hero Ship Hierarchy (`C-hero-quay.png`)

- Hero Ship clearly outranks Medium/Small craft: the hull is roughly four times the length of the small sailboat in the same frame, with two masts against one.
- Quay placement reinforces it: the timber quay runs diagonally from the hall's forecourt straight to the ship's berth, so the ship is attached to land geometry rather than beside the map.
- Open water: generous on the right and below; the ship is not crowded, and the low-energy concentric ripples read as sheltered water, consistent with brief §11.
- Exhibition Hall remains relevant: it sits top-left, comparable in mass to the ship, with the quay linking them.
- As a landmark with placeholder geometry: it works. The hull is the same generic shape as the boats, scaled up.

**Condition 2 — PARTIAL**, unchanged from R2C. The Tier-1 read still rests on scale. Silhouette distinction is a production-art issue and is not promoted to a Major.

## 8. Eight-Condition Recheck

| # | Condition | R2C | R2E | Basis |
| --- | --- | --- | --- | --- |
| 1 | First screen reads as harbor immediately | PASS | **PARTIAL** | `B` reads as a harbor at once (large basin, quay, ship, open water). `A-entry` (the actual spawn frame) is land-dominant: water is only the lower-right ~quarter of the frame, and no ship is visible. Regression from R2B caused by moving the Square west. Water, hall and quay fragment still signal a waterfront, so Minor, not Major (Minor 2). |
| 2 | Hero Ship reads as Tier 1 landmark | PARTIAL | **PARTIAL** | §7. Scale-led; silhouette generic. |
| 3 | Harbor Square not the geometric center | FAIL | **PASS** | §4. |
| 4 | Destinations not cardinal/quadrant around Square | FAIL | **PASS** | §4; residual clustering is Minor 3. |
| 5 | Hero Quay + water negative space drive composition | PASS | **PASS** | `B`, `C`: quay reaches the ship, open water beyond. |
| 6 | Exhibition Hall easy to locate | PASS | **PASS** | `A`: only real building silhouette, lower right, with a label (its label is clipped by the frame edge — Polish). |
| 7 | Player/building/vessel scale natural | FAIL | **PASS** | §5. |
| 8 | Functional PASS separate from Visual PASS | PASS | **PASS** | R2D withheld `VISUAL_PASS`; this report grades from opened images only. |

## 9. Level B (console/exception) Check

Independently re-run: `npm run qa:runtime -- --mode build --set r2e` from `portfolio-world-v2/` exited 0 (all functional checks pass per `07_RUNTIME_QA_PLAN.md` §1 exit semantics). All seven regenerated PNGs were **byte-identical** to the committed R2D set, so the evidence I opened corresponds to the current built artifact at HEAD. The scratch output was deleted. Level B is necessary, not sufficient; it is recorded here only to satisfy the completion gate, and grants no visual credit.

## 10. Severity and Findings

Counts: **Blocker 0 · Major 0 · Minor 4 · Polish 2.**

**Major: none.** All three R2C Majors are closed: junction structure (§4), door/player scale (§5), projection judgeability (§6).

**Minor**
1. **Hero Ship Tier-1 read is scale-led** (condition 2, carried from R2C). Same hull grammar as the boats; no bow/stern distinction. Production-art issue for the representative visual target.
2. **Spawn frame is land-dominant** (condition 1). `A-entry` shows mostly hillside; water is the lower-right quarter and the Hero Ship is not visible. The brief (§9) wants harbor identity on the first screen. Fix is spawn/entry camera framing, not layout.
3. **West-side density.** The Workshop leg, the Guild fork and the Square sit close together (Guild fork ~140 px from the Square at overview zoom); Academy's fork is also fairly near the hall roof edge (R2D reported 153 px). The read is still a spine, but the west third is busier than the east.
4. **Blockout schematic feel and boundary artifacts** (carried from R2C). Uniform-width tan roads and flat labelled markers still read as a diagram; the forecourt paving and Square overlap the basin edge; `B` shows a dark navy void along the right edge where the world ends.

**Polish**
1. Hull waterline contact is not treated (the dark keel triangle is a hard-edged cutout over the water); calm rounded contact per brief §11 is a visual-target task.
2. Label collisions/clipping: the Workshop label overlaps its marker, "HERO QUAY" floats away from the quay, and the hall label is cut off at the right edge of `A`.

## 11. Unresolved Visual Issues (summary)

Hero Ship silhouette distinction; spawn-frame water share; west-side clustering; schematic road look and the visible world edge; waterline contact. None contradicts an explicit brief rule strongly enough to be a Major at blockout stage, and none is a placeholder-style complaint promoted to a Major.

## 12. Next Recommended Scope

`READY_FOR_REPRESENTATIVE_VISUAL_TARGET`, in the following order:

1. Take Minor 2 (spawn framing) first, as it is cheap and touches only the entry camera/spawn placement.
2. Proceed to the representative visual target per `create-game-assets` (approve one hero asset at gameplay scale before a family), with the Hero Ship as the subject — this resolves Minor 1 and Polish 1 together.
3. Re-test HIGH against MID when the real Hero Ship silhouette and Exhibition Hall facade exist.
4. Keep Minors 3–4 on the watch list for the settlement pass; they are not blockers for the target.

## 13. Final Gate

```text
READY_FOR_REPRESENTATIVE_VISUAL_TARGET
```

Not granted: `HUMAN_GATE_2`. This is not a Human Gate 2 decision.
