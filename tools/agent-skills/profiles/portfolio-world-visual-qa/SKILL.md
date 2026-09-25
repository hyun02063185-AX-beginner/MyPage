---
name: portfolio-world-visual-qa
description: Post-render visual QA for Portfolio World v2. Use after any change to the Phaser canvas render (world art, layout, vessel/water treatment, labels) to judge whether the actual rendered scene matches docs/portfolio-world-rebuild/00_VISUAL_BRIEF.md — not whether the code compiles, the build passes, or a screenshot file merely exists.
---

# Portfolio World Visual QA Profile

Project-authored. Not a copy of any vendored skill. It adapts the evidence
discipline of `frontend-visual-qa` (daymade/claude-code-skills, MIT —
https://github.com/daymade/claude-code-skills, referenced for its method,
not vendored: its bundled sweep script targets DOM elements, and a Phaser
canvas is one opaque bitmap to the DOM) to a canvas-rendered game world, and
binds every verdict to `docs/portfolio-world-rebuild/00_VISUAL_BRIEF.md` as
the one required reference document.

## The rule this project keeps re-learning

`VISUAL_PASS` cannot be granted from any of the following alone, even in
combination:

- a changed code value
- a passing test suite
- a passing build
- a non-zero pixel diff between before/after screenshots
- a generated or existing screenshot file that nobody opened
- an asset file existing on disk

Portfolio World v1's own history has a confirmed case of every one of these
being true at once while the actual on-screen result was still wrong (a
vessel water-occlusion layer that changed code value, produced a real
non-zero pixel diff, and still covered zero hull pixels — see
`reports/portfolio-world/art-production/harbor-vertical-slice-final-independent-recheck.md`
on `feature/portfolio-world-concept-vertical-slice`, kept as history). This
profile exists so that recurs as a caught Major, not a shipped defect.

## Evidence levels (adapted from `frontend-visual-qa`)

| Level | Evidence | What it can support for a Phaser canvas |
| --- | --- | --- |
| A | A real headless-or-visible browser rendering the actual dev/build server, screenshot captured and **opened and looked at** | Composition, mood, material read, scale-relative-to-props, seam/tiling, everything the Visual Brief describes |
| B | Console/exception capture via CDP (`Runtime`/`Log`/`Page` domains) or the vendored `phaser-playtest` harness | Confirms the scene actually booted and rendered without error — necessary, never sufficient, for a visual verdict |
| C | Pixel-diff between an old and new screenshot at identical world/camera coordinates | Proves *something* changed and *where* — never proves the change looks right; a diff can be real and still not touch the pixels that matter (the exact v1 failure above) |
| D | Source reading, code-value comparison, test/build output | Hypothesis and regression support only. Never a visual verdict on its own. |

Never promote a lower level into a stronger claim. A Level D observation
("the tile scale value changed from 0.72 to 0.42") is not a Level A finding
("the stone now reads as surface texture").

## Workflow

1. **Read the Visual Brief section relevant to what changed** (`00_VISUAL_BRIEF.md`
   §8–14 for composition/harbor/fleet/water/plaza; `01_ART_BIBLE.md` for the
   specific visual pillar). Do this before looking at any screenshot — judging
   pixels against a brief you haven't reread is how "looks fine to me" replaces
   the actual contract.
2. **Capture the whole visible composition first** (Level A), at the normal
   gameplay camera, not only a dev-only debug framing. Open the file. Record
   what you actually see in plain language before reasoning about whether it
   passes.
3. **Zoom into the specific claim** — the defect, the tuned effect, the new
   asset — with a local crop. Keep the crop window identical between
   before/after comparisons (same coordinates, same zoom) so a real change
   doesn't hide inside a rescaled comparison.
4. **Reference-parity check**: compare the capture against the Visual Brief's
   explicit rules (§11 water energy, §12 plaza stone scale, §8 asymmetry), not
   against "does it look nice to me." A finding that the brief doesn't name is
   a taste note, not a Blocker/Major.
5. **Console/exception check** (Level B) — required, not sufficient.
6. **Report** with the same discipline `frontend-visual-qa` requires: every
   appearance claim ships with the crop that shows it; before/after crops use
   the same window; a finding resting on a code diff or a pixel-diff count
   rather than an opened screenshot is labeled as such.

## Severity

Use this project's existing convention (see `reports/portfolio-world/`
history): Blocker (broken render), Major (visibly contradicts an explicit
Visual Brief rule), Minor (does not block Human Gate 2), Polish (deferred).

## Completion gate

Call a visual pass **verified** only when:

- the actual rendered canvas was captured at Level A and the screenshot was
  opened;
- the relevant Visual Brief section was reread in this pass, not recalled
  from memory;
- no unresolved Major contradicts an explicit brief rule;
- console/exceptions are clean (Level B);
- if a before/after claim is made, both crops exist at identical
  coordinates and both were opened.

Otherwise report **partial** or **blocked**, naming exactly what evidence is
missing. Never call something PASS because "the implementation exists."
