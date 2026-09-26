# R2C — Independent Blockout Visual QA

Date: 2026-09-26
Branch: `feature/portfolio-world-rebuild-v2`
HEAD verified before review: `337545a`
Reviewer role: Independent Environment Art / Visual QA Reviewer (review only — no runtime, asset, or doc-contract edits made)

## 0. Scope Discipline

This pass did not modify `portfolio-world-v2/`, `world-v2/`, `portfolio-world/**`, `world/**`, `00_VISUAL_BRIEF.md`, or `01_ART_BIBLE.md`. It judges the R2B blockout evidence against the existing contract; it does not repair runtime code or redesign the layout.

## 1. Canonical Contract Read

Read in full before opening any screenshot: `00_VISUAL_BRIEF.md`, `01_ART_BIBLE.md`, `05_HARBOR_BLOCKOUT_SPEC.md`, `06_SCALE_CAMERA_CALIBRATION_PLAN.md`, `07_RUNTIME_QA_PLAN.md`, `90_DECISIONS.md`, `92_HANDOFF.md`, then `reports/portfolio-world-rebuild/r2b-blockout-implementation.md`. The governing layout is Candidate A+ ("Crescent Harbor with Hero Quay," `05_HARBOR_BLOCKOUT_SPEC.md` §4), which explicitly supersedes R2A's original Candidate A specifically because that original diagram still read as a hidden quadrant/hub structure around Harbor Square.

## 2. Skill Discovery Result

This session's working directory was `C:\Users\hyun0` at session start (outside the repository), so its Skill-tool listing was fixed before the repo's materialized skills could be discovered — the same live-discovery limitation `90_DECISIONS.md` open item 7 already records.

- Invoked via the Skill tool: **none of `environment-art`, `portfolio-world-visual-qa`, `create-game-assets` were in the discoverable skill list** — not claimed as invoked.
- Verified on disk: all nine materialized skills, including these three, are present under both `.claude/skills/` and `.codex/skills/` (confirmed via directory listing).
- Applied by **direct file read** of the canonical vendored/profile sources instead:
  - `tools/agent-skills/vendor/omer-metin-skills-for-antigravity/skills/environment-art/references/patterns.md` (squint test, Hero/Unique/Modular/Dressing tiering, composition/anti-pattern list).
  - `tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md` (evidence-level discipline, completion gate).
  - `create-game-assets` was not read in this pass — it is secondary per the brief and R2B's own record already applies it; not re-derived here.

## 3. Images Actually Opened

All seven PNGs under `reports/portfolio-world-rebuild/evidence/r2b/` were opened and visually inspected (not merely confirmed present):

- `A-entry.png`, `B-overview.png`, `C-hero-quay.png`, `D-scale-calibration.png`
- `projection-low.png`, `projection-mid.png`, `projection-high.png`

`D-scale-calibration.png` was additionally cropped and pixel-inspected (player/door/bench/lamp region) to resolve a scale question that was not resolvable at full-frame zoom. The three projection variants were also diffed pixel-by-pixel (Python/Pillow) after visual inspection could not confirm a difference, to check whether the eye was missing something real — see §10.

Gate check: all evidence was viewable. **Not** `BLOCKED_VISUAL_EVIDENCE_NOT_VIEWED`.

## 4. Macro Composition Observations (from `B-overview.png`, squint-test first)

- The harbor reads immediately: a large teal/blue ellipse occupies roughly the lower two-thirds and center-right of the frame. **Harbor identity on first read: confirmed.**
- The basin feels substantial, not a thin ribbon — good enclosed-bay presence, open water continues past the Hero Ship toward the bottom of the frame ("open water beyond" reads as intentional negative space).
- The settlement does **not** feel shaped by the harbor so much as it feels like a schematic road-diagram laid over the water: uniform-width tan paths with sharp angular bends, connecting flat gray rectangle markers. This is expected and permitted for a blockout (`05_HARBOR_BLOCKOUT_SPEC.md` §8 explicitly allows "a labeled flat mass" for unbuilt destinations) — noted as a Minor/Polish observation, not scored against the composition tests below.
- **Harbor Square and the destination branches are the central problem of this review.** See §6.
- The Hero Quay reads as physically attached to the shoreline (a triangular pier tongue reaching from land to the ship) rather than a sightline with nothing anchoring it — this is the one property Candidate A+ was specifically designed to add over the original Candidate A, and it is visibly present.

## 5. Hero Ship Review (`C-hero-quay.png`)

- The Hero Ship is a two-mast sailboat, clearly larger than the single-mast small boat visible in the same frame (hull length roughly 4x the small boat's hull in this capture) — it reads as the largest vessel present.
- It does **not** strongly read as a unique landmark beyond scale: it uses the same generic hull/sail silhouette as the smaller boats, just scaled up plus one extra mast. There is no distinguishing shape, color, or ornament separating "hero" from "bigger boat." For a flat-shape blockout this is acceptable — silhouette/shape complexity is explicitly not expected yet (`01_ART_BIBLE.md` §2, "Props" note) — but it means the Tier-1 read is carried almost entirely by size, with a thin margin over the Medium Vessel (see §8).
- Open water is clearly visible behind and beside the ship. Exhibition Hall remains visible and comparable in screen mass to the ship — neither erases the other.
- No mast/sail overlap with background elements occurs in this frame (nothing sits behind the ship to overlap) — spec permits but does not require this, so it is neutral, not a defect.
- **Verdict: PARTIAL.** Tier-1 status is legible by scale alone but is not reinforced by silhouette distinction; acceptable at blockout stage, worth flagging for the first real visual target.

## 6. Entry / Navigation Review (`A-entry.png`)

- First impression at spawn (Harbor Square) is unambiguously "harbor" — water fills roughly the bottom-left/bottom-center of the frame immediately.
- Exhibition Hall is the easiest destination to find: it is the only marker with an actual building silhouette (roof + walls + windows) rather than a flat gray rectangle, and it sits close to spawn on the right side of frame.
- **The Square → Exhibition → Hero Quay flow reads correctly** — that specific chain is clear and short.
- **Problem**: from spawn, Guild Hall (upper-left), Academy (upper-right), and Exhibition Hall (right) are simultaneously visible, radiating from the Harbor Square area in three different directions in one glance, with Workshop (visible in the wider `B-overview.png`, off-frame here to the lower-left) completing a fourth. This is exactly the "center of four equal choices" read the review brief warns against in §7. See §7 for the full assessment — this is not a Workshop/Guild/Academy content judgment (they are correctly unimplemented per spec), it is a judgment of the path geometry converging on the Square.
- Player remains readable (clear circular head + body silhouette, high contrast against the paving).

## 7. Harbor Square / Destination Layout — the Central Finding

This is judged against `05_HARBOR_BLOCKOUT_SPEC.md` §6's own explicit check ("no coordinate pass ever produces 'Guild Hall is directly opposite Academy across the square'... every entry is described relative to the spine, the basin, or another destination's branch, never a compass direction from the square") and `07_RUNTIME_QA_PLAN.md` conditions 3–4.

Reading the branch geometry directly off `B-overview.png` (approximate on-screen positions):

- Harbor Square sits at roughly (440, 250).
- A second fork sits close by, at roughly (330, 330), ~150px from the Square.
- From this two-fork cluster, branches lead to: **Academy** (up-right, ~690, 75 — roughly north/northeast of the cluster), **Guild Hall** (up-left, ~205, 177 — roughly northwest), **Workshop** (down-left, ~130, 470 — roughly southwest), **Exhibition Hall** (right/down-right, ~660, 280 — roughly east).

Structurally, this is not one single 4-way hub — it is two adjacent Y-junctions ~150px apart, which is a real, deliberate difference from a literal radial hub. But at the squint-test distance the brief itself prescribes for this exact check (`01_ART_BIBLE.md` §3, `patterns.md`'s "Squint Test for Value Hierarchy"), the two junctions read as one cluster, and the four destinations still land in four distinct compass-like directions around that cluster (N/NE, NW, SW, E) — the same perceptual signature the R2A.1 correction (`90_DECISIONS.md`) was written specifically to eliminate from the original Candidate A. Guild Hall and Academy in particular both branch from the "upper" side of the cluster, flanking it — not a literal 180° mirror pair, but close enough to the pattern the spec calls out by name that it does not read as "grown along a spine," it reads as "a junction with four roads out of it."

This is a squint-test/gestalt finding, not a pixel-coordinate technicality — the two-junction implementation detail that makes it *technically* not a single hub is not visible to a player looking at `A-entry.png` or `B-overview.png`; what is visible is four destinations fanning out from one small area in four different directions.

**Verdict:**
- Condition 3 (Harbor Square does not look like the world's geometric center): **FAIL.** It is not literally centered in the frame, but it functions as the visual convergence point every route reads from.
- Condition 4 (destinations not organized cardinally/in quadrants around the square): **FAIL.** Four destinations, four distinct compass-like directions from one small junction cluster.

Severity: **Major** — this directly contradicts an explicit, previously-corrected blockout contract requirement (`05_HARBOR_BLOCKOUT_SPEC.md` §6, `90_DECISIONS.md`'s R2A.1 entry), not a placeholder-ugliness or taste note.

## 8. Scale Review (`D-scale-calibration.png`)

Calibration questions from `06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2, judged directly against the opened, cropped screenshot:

1. **Does the Hero Ship feel major without making buildings irrelevant?** — Roughly, yes. In `B-overview.png`/`C-hero-quay.png` the Hero Ship and Exhibition Hall read as comparable screen mass; neither erases the other. **PASS** (weak — see §5's silhouette caveat).
2. **Does the door make human scale obvious?** — **FAIL.** A close crop of the Exhibition Hall entrance shows the player sprite standing directly on top of / overlapping the door shape (the dark rectangle), so the two cannot be visually compared side by side as the calibration frame requires. What is visible of the door extends from roughly window-bottom down past the player's feet to the building's base — at least ~2–3x the player's own height. A door that reads as two to three times taller than the player does not read as "a human door," it reads as an oversized slab/gate. `06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2 states explicitly: "A 'no' on any question means the relative scale is wrong regardless of whether the composition otherwise looks fine — do not treat 3-of-4 as a pass."
3. **Does pavement read as texture rather than blocks?** — Not fully judgeable: the only visible paving reference is the vertical-stripe pattern inside the Harbor Square rectangle in `B-overview.png`/`A-entry.png`; at the render scale captured it reads as a small number of large stripes rather than a fine texture, but this is explicitly a calibration placeholder, not a production surface, so I record it as **PARTIAL / not final-judgeable** rather than fail it outright — consistent with the brief's instruction not to critique placeholder art style.
4. **Do Medium Vessel and Small Boat clearly read as lower tiers than Hero Ship?** — Yes in `B-overview.png`: the medium vessel (single mast, mid-size hull) and small boat (small triangular hull) are both visibly smaller than the Hero Ship. **PASS.**

Severity for finding 2 (door/player scale): **Major** — it directly fails one of the four calibration questions the plan names as individually load-bearing, not averageable.

## 9. Eight Blockout PASS Conditions

| # | Condition | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | First screen reads as a harbor immediately | **PASS** | `B-overview.png`: water ellipse dominates lower/center frame on first look. |
| 2 | Hero Ship reads as a Tier 1 landmark | **PARTIAL** | `C-hero-quay.png`: largest vessel present, but Tier-1 read carried by scale alone, not silhouette distinction (§5). |
| 3 | Harbor Square does not look like the world's geometric center | **FAIL** | `B-overview.png`/`A-entry.png`: functions as the visual convergence point of all four destination branches (§7). |
| 4 | Destinations are not organized cardinally/in quadrants around the square | **FAIL** | `B-overview.png`: Academy (N/NE), Guild Hall (NW), Workshop (SW), Exhibition (E) all radiate from one small junction cluster (§7). |
| 5 | Hero Quay + water negative space drive the composition | **PASS** | `B-overview.png`/`C-hero-quay.png`: quay physically reaches the ship, open water clearly visible beyond it. |
| 6 | Exhibition Hall is easy to locate | **PASS** | `A-entry.png`: only marker with an actual building silhouette, close to spawn. |
| 7 | Player/building/vessel scale relationships feel natural | **FAIL** | `D-scale-calibration.png` cropped: door/player overlap and disproportionate door height (§8, calibration question 2). |
| 8 | Functional PASS kept separate from Visual PASS | **PASS** | `r2b-blockout-implementation.md` explicitly withholds `VISUAL_PASS`; this report keeps its own verdict independent of the harness result. |

No averaging applied, per instruction. Three of eight conditions carry a documented Major failure (3, 4, 7); one is Partial (2).

## 10. Projection Comparison (Low / Mid / High)

All three PNGs were opened at full frame; by eye they appeared close to identical. Because a "no visible difference" read is itself a claim that needs verification (not an assumption), the three files were diffed pixel-by-pixel and the differing region was cropped and re-inspected at 2x zoom:

- Pixel diff (`Pillow ImageChops.difference`, threshold >10 summed RGB delta): low↔mid changed **5,901 px**, mid↔high changed **6,489 px**, low↔high changed **9,071 px** — each out of **921,600** total pixels (**<1%** in every comparison), and every changed region is confined to one bounding box around the Exhibition Hall roof / Hero Ship sails (`x≈509–1021, y≈230–502`).
- At 2x zoom on that exact region (`projection-low-crop.png` vs `projection-high-crop.png`), the only perceptible difference is a marginal roof-ridge height and sail-tip height change — a few pixels. Building facade exposure, ship hull-side readability, deck readability, and harbor water presence are **visually unchanged** across all three candidates in these renders.

This means the acceptance questions in `06_SCALE_CAMERA_CALIBRATION_PLAN.md` §1 ("do buildings show a readable facade," "do ships show hull side plus some deck," "does water occupy meaningful space," "is the destination approach visually clear") **cannot actually be differentiated** between Low, Mid, and High from this evidence — the drawn-elevation delta implemented is too small to produce a judgeable difference at normal viewing scale, defeating the purpose of the three-way comparison.

**Selected: `NO_VARIANT_READY`.** Not because MID is being defaulted to, but because none of the three renders currently produces a visible difference large enough to answer the test's own acceptance questions. Recommend R2B increase the illustrated-elevation delta between candidates enough to be visually distinguishable before this comparison is re-run.

## 11. Severity Summary

- **Blocker: 0**
- **Major: 3** — (a) Harbor Square/destination layout reads as a compass-radiating hub (conditions 3 & 4, §7); (b) door/player scale-calibration failure (condition 7 calibration question 2, §8); (c) projection Low/Mid/High test produces no visually differentiable evidence, defeating its own acceptance-question purpose (§10 — separate from the 8 blockout conditions, but blocks a confident projection selection).
- **Minor: 2** — settlement/path network reads as a schematic road-diagram rather than a grown town (§4, expected at blockout stage, watch at the next visual target); Hero Ship silhouette does not reinforce its Tier-1 scale advantage (§5, §9 condition 2 partial).
- **Polish: 0** — no placeholder-art-style findings were raised as Polish; per instruction, placeholder ugliness itself is out of scope.

## 12. Decision Logic Applied

Per the review brief §13: conditions 3, 4, and 7 (Player/building/vessel scale) each carry a documented Major failure against an explicit Visual Brief / blockout contract rule. Per instruction, runtime was **not** modified to fix this.

**Smallest grouped repair scope recommended for R2B repair:**

1. **Layout — decouple the destination branches from one shared junction cluster.** Re-derive Harbor Square/fork coordinates so the four destination paths do not converge on one small area in four compass-like directions; increase separation between the two existing Y-junctions and/or route at least one destination (most likely Academy or Workshop) off a point further along the spine rather than near the Square, consistent with `05_HARBOR_BLOCKOUT_SPEC.md` §4's own description ("Academy sits further along a longer inland branch, in its own separate forecourt") — the current coordinates do not yet deliver the separation the spec text already calls for.
2. **Scale calibration frame — fix the door/player overlap and door proportion.** Reposition the player marker in the `D` calibration capture so it stands beside, not on top of, the Exhibition Hall door placeholder, and reduce the door placeholder's height so it reads within a normal human-door ratio (roughly 1.2–1.5x player height, not 2–3x).
3. **(Process, not blockout geometry) Widen the Low/Mid/High illustrated-elevation delta** enough to be visually distinguishable, so the projection comparison can be re-run and actually judged next pass.

These are targeted coordinate/placement fixes, not a new candidate layout and not a re-open of the Candidate A vs A+ decision — Candidate A+'s underlying relational rules (§6 of the spec) are sound; the current numeric implementation of them has not yet delivered the separation the spec text describes.

## 13. Final Gate

```text
NEEDS_R2B_BLOCKOUT_REPAIR
```
