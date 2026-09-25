# 06. Portfolio World Rebuild — Scale & Camera Calibration Plan

Status: **PROPOSED — test plan only, no numeric value locked**
Updated: 2026-09-26

No value in this document is a default. v1's 15° elevation, 0° yaw, 32px logical unit, and every prior scale/tile number are historical evidence only (`90_DECISIONS.md`) — v2 independently derives and validates its own numbers against the render this plan produces, not against v1's.

## 1. Camera / Projection Test Plan

The visual concept stays **Hybrid Orthographic 2.5D** (ground/water/paths as plan-view geometry; buildings/ships/props as camera-facing illustrated elevations) — this is a *projection concept*, not a locked number, and it is kept because it is the correct answer for a 2D-illustrated-but-legible world, independent of what elevation angle is chosen within it. Yaw stays at 0° (axis-aligned world) as a production convenience — this is not being tested as a variable, only elevation is.

### Test matrix

| Candidate elevation | Hypothesis | What to check in the blockout render |
| --- | --- | --- |
| Low (~10°) | Closer to side-on; may read ships/buildings very clearly but risks the ground/water plane feeling too flat/thin | Does the crescent basin still read as a basin, or does it collapse into a thin band? |
| Mid (~15°) | v1's historical value — tested here as a comparison baseline only, not adopted by default | Does it suit Candidate A's crescent composition specifically, independent of it having been v1's choice? |
| High (~22–25°) | More top-down-leaning; may give the water/ground plane more presence at the cost of building-facade readability | Do building facades and ship hulls still read clearly, or does the world start feeling flat/map-like? |

Do not chase true 3D perspective — this remains a 2D illustrated world; the goal is the best-reading angle for *this specific composition* (Candidate A), not a physically "correct" camera.

### Acceptance questions (apply to every candidate elevation, using the actual blockout render — not judged in the abstract)

- Do buildings show a readable facade?
- Do ships show hull side plus some deck?
- Does harbor water occupy meaningful visual space (not collapse into a thin strip at this angle)?
- Does the player remain readable?
- Does the destination approach (Exhibition Hall, in the first blockout) remain visually clear?

The elevation that answers all five acceptance questions best for Candidate A's crescent composition is the one carried into R2B's actual implementation — decided from the render, recorded as a new decision in `90_DECISIONS.md` when chosen, not decided here.

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
Dock width
```

No final numeric size is chosen here. This section defines **how** they will be judged relative to each other, per `01_ART_BIBLE.md` §11's rule: qualitative validation at actual render scale first, a number only after that validation, never the reverse — the exact ordering mistake that cost v1 three iterative tile-scale rounds.

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

**One primary frame**: player standing at or near Exhibition Hall's door, with a bench and lamp in the same frame, at the normal gameplay camera — this alone must make human scale obvious per the questions above.

**One harbor-scale frame**: a wider capture from Harbor Square toward the Hero Ship's pier, with at least one Medium Vessel and one Small Boat visible in the same frame as the Hero Ship — this is what judges the fleet-hierarchy question and the dock-width relationship.

Both frames must be captured at a **fixed, recorded viewport and camera state** (per `07_RUNTIME_QA_PLAN.md`) so they can be re-captured identically if a scale value changes and needs re-judging — this is the same before/after-at-identical-coordinates discipline `portfolio-world-visual-qa` already requires.

## 3. Status

```text
CALIBRATION_PLAN_STATUS = PROPOSED
NUMERIC_VALUES_LOCKED = NONE
```
