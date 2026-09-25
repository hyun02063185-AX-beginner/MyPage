# 06. Portfolio World Rebuild — Scale & Camera Calibration Plan

Status: **PROPOSED — test plan only, no numeric value locked (R2A.1 terminology correction)**
Updated: 2026-09-26 (R2A.1 Director Layout Correction)

No value in this document is a default. v1's 15° elevation, 0° yaw, 32px logical unit, and every prior scale/tile number are historical evidence only (`90_DECISIONS.md`) — v2 independently derives and validates its own numbers against the render this plan produces, not against v1's.

**R2A.1 terminology correction**: R2A's original §1 called the Low/Mid/High test values "camera elevation," implying a Phaser runtime camera property. That was imprecise and is corrected below. The Phaser runtime camera for this project is, and remains, a **2D orthographic canvas camera** — it does not rotate, tilt, or simulate perspective. What Low/Mid/High actually vary is the **illustrated projection / asset view elevation** — the angle *baked into how a building or ship is drawn* (an illustration-grammar choice, the same kind of choice `01_ART_BIBLE.md` §2's Hybrid Orthographic 2.5D concept already describes), not a camera transform applied at runtime. No 3D camera rotation or perspective simulation is implemented or planned.

## 1. Illustrated Projection / Asset View Elevation Test Plan

The visual concept stays **Hybrid Orthographic 2.5D**: ground/water/paths are plan-view geometry (drawn as if seen from directly above, unaffected by this test); buildings/ships/props are camera-facing illustrated elevations whose *drawn* angle is what varies below. This is an illustration grammar, not a 3D camera system — the Phaser scene camera itself stays a plain 2D orthographic canvas camera throughout every candidate in the matrix. Yaw stays conceptually at 0° (axis-aligned illustration, no rotated facades) as a production convenience — not tested as a variable, only the illustrated elevation is.

### Test matrix

| Candidate illustrated elevation | Hypothesis | What to check in the blockout render |
| --- | --- | --- |
| Low (~10°) | Closer to side-on; may draw ships/buildings very clearly but risks the ground/water plan-view plane feeling too flat/thin next to a low-angle building elevation | Does the crescent basin still read as a basin, or does it collapse into a thin band? |
| Mid (~15°) | v1's historical value — tested here as a comparison baseline only, not adopted by default | Does it suit Candidate A+'s crescent-with-quay composition specifically, independent of it having been v1's choice? |
| High (~22–25°) | More top-down-leaning; may give the water/ground plan-view plane more visual presence at the cost of building-facade readability | Do building facades and ship hulls still read clearly, or does the world start feeling flat/map-like? |

**How the test is actually run**: this is a comparison of *drawn asset silhouettes/representative planes*, not a runtime camera rotation. Concretely: render Candidate A+'s composition (`05_HARBOR_BLOCKOUT_SPEC.md` §4) with the same flat-shape blockout placeholders, substituting a temporary silhouette or representative plane for the Hero Ship and the Exhibition Hall mass drawn at each candidate's illustration angle, keeping the plan-view ground/water identical across all three. Compare the three renders against the acceptance questions below. Do not chase true 3D perspective or implement camera-side rotation/tilt to produce these — this remains a 2D illustrated world; the goal is the best-reading *drawn* angle for Candidate A+'s specific composition, not a physically "correct" camera.

### Acceptance questions (apply to every candidate, using the actual blockout render — not judged in the abstract)

- Do buildings show a readable facade?
- Do ships show hull side plus some deck?
- Does harbor water occupy meaningful visual space (not collapse into a thin strip at this angle)?
- Does the player remain readable?
- Does the destination approach (Exhibition Hall, in the first blockout) remain visually clear?

The illustrated elevation that answers all five acceptance questions best for Candidate A+'s composition is the one carried into R2B's actual implementation — decided from the render, recorded as a new decision in `90_DECISIONS.md` when chosen, not decided here.

## 2. Scale Calibration Plan

### Required reference elements (all must appear together in the calibration frame)

```text
Player
Bench
Door (of the representative destination — Exhibition Hall)
Lamp
Hero Ship
Medium Vessel
Small Boat
Destination Building (Exhibition Hall mass)
Dock width (at the Hero Quay)
```

No final numeric size is chosen here. This section defines **how** they will be judged relative to each other, per `01_ART_BIBLE.md` §11's rule: qualitative validation at actual render scale first, a number only after that validation, never the reverse — the exact ordering mistake that cost v1 three iterative tile-scale rounds. Per `05_HARBOR_BLOCKOUT_SPEC.md` §8, every element above except Player/Hero Ship/Exhibition Hall is a **calibration placeholder**, not a production asset — a simple flat shape or silhouette is correct and expected for Bench/Door/Lamp/Medium Vessel/Small Boat/paving reference at this stage.

### Judging method

1. Render the calibration frame at the **normal gameplay camera** (not a synthetic side-by-side chart, not source-image zoom) — the frame should be a real moment in the blockout, not staged.
2. Open and visually inspect the actual screenshot (per `tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md` — an unopened screenshot is not evidence).
3. Apply the squint test (`01_ART_BIBLE.md` §3): does the intended focal point (Hero Ship, or Exhibition Hall depending on framing) still read first at this scale?
4. Answer the calibration questions below directly against what is seen, not against the numbers used to produce it.

### Calibration questions (from the R2A brief §12, used verbatim as the acceptance bar)

- Does the Hero Ship feel major without making buildings irrelevant?
- Does a door make human scale obvious?
- Does pavement read as texture rather than blocks?
- Do small boats actually read as small working craft?

A "no" on any question means the relative scale is wrong regardless of whether the composition otherwise looks fine — do not treat 3-of-4 as a pass.

### Required calibration screenshot(s)

**One primary frame**: player standing at or near Exhibition Hall's door, with a bench and lamp placeholder in the same frame, at the normal gameplay camera — this alone must make human scale obvious per the questions above.

**One harbor-scale frame**: a wider capture from Harbor Square toward the Hero Quay, with at least one Medium Vessel placeholder and one Small Boat placeholder visible in the same frame as the Hero Ship — this is what judges the fleet-hierarchy question and the dock-width relationship.

Both frames must be captured at a **fixed, recorded viewport and camera state** (per `07_RUNTIME_QA_PLAN.md`) so they can be re-captured identically if a scale value changes and needs re-judging — this is the same before/after-at-identical-coordinates discipline `portfolio-world-visual-qa` already requires.

## 3. Status

```text
CALIBRATION_PLAN_STATUS = PROPOSED
NUMERIC_VALUES_LOCKED = NONE
TERMINOLOGY = ILLUSTRATED_PROJECTION_ELEVATION (not a Phaser camera property)
RUNTIME_CAMERA = 2D_ORTHOGRAPHIC_CANVAS_CAMERA
```
