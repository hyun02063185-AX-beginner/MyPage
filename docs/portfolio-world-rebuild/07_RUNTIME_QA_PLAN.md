# 07. Portfolio World Rebuild — Runtime QA Plan

Status: **PROPOSED — plan only, harness not implemented (revised in R2A.1)**
Updated: 2026-09-26 (R2A.1 Director Layout Correction)

Two distinct, non-substitutable layers, per `00_VISUAL_BRIEF.md` §13.3 and `03_REBUILD_WORKFLOW.md`: a **functional** harness (this document, §1) that proves the game runs, and a **visual** audit (§2, owned by `tools/agent-skills/profiles/portfolio-world-visual-qa/`) that proves it looks right. **Functional PASS is never Visual PASS.** Neither layer is implemented yet — R2A is a plan, not code, per the brief's Architecture Gate.

## 1. Project-Owned Functional Runtime QA Harness (Plan)

**Project-owned, not a copied third-party script.** The previously-vendored `Yakoub-ai/phaser4-gamedev` playtest harness was removed in R1.1 for lacking a license (`90_DECISIONS.md`); this harness is designed independently, informed by the *shape* of that removed tool's check list (which was sound) but implemented as this project's own code when built.

### Minimum check goals

```text
- dev/build page boots
- Phaser canvas exists
- expected scene is active
- no uncaught JS errors
- no asset load failures
- fixed-viewport capture works
- screenshot output path is stable (predictable, not timestamp-scrambled)
- known world coordinate / camera state can be restored for comparison
```

The last two goals are what make this harness usable *by* `portfolio-world-visual-qa` — a visual audit needs a screenshot it can find at a predictable path and a camera state it can reliably reproduce for before/after comparison (the exact discipline that caught v1's real ART-10 rowboat/dinghy Major: identical-coordinate before/after crops). A harness that cannot reproduce a camera state is not useful evidence, no matter how clean its own checks are.

### Suggested shape (for R2B to implement, not implemented here)

- A small Node script, run via `npm run` from `portfolio-world-v2/` (once that project exists — `04_ARCHITECTURE_V2.md`), driving a headless browser against the dev or built preview server.
- A `--url`/`--mode dev|build` style entry point so the same harness checks both the dev server and the production build (v1's own QA history repeatedly needed both).
- A scripted-camera-state option: given a world coordinate + zoom, move the camera there deterministically before capturing — this is what "known world coordinate / camera state can be restored" means concretely, and it is what makes the two calibration screenshots in `06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2 reproducible on demand rather than lucky one-offs.
- Exit code semantics: 0 = all functional checks pass, non-zero = at least one failed — consumed by whoever runs R2B's implementation loop, not by a human reading prose output.

### What this harness explicitly does NOT decide

Whether the rendered scene *looks* like a harbor, whether the Hero Ship reads as Tier 1, whether the plaza stone is too large, whether the water is too energetic — none of this is a functional check. A harness reporting all-green functional results proves nothing about any of `00_VISUAL_BRIEF.md`'s actual content rules. This is not a gap to be filled later; it is the deliberate boundary between this document and §2.

## 2. Visual QA Contract for the Blockout

Owned by `tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md`, applied here to the specific blockout scope from `05_HARBOR_BLOCKOUT_SPEC.md` §8 (Candidate A+).

### Required screenshots after R2B (minimum four, per the R2A brief §19)

| ID | Screenshot | Captures |
| --- | --- | --- |
| A | Normal entry gameplay view | What a real visitor sees first, at spawn, no dev-only camera override |
| B | Whole blockout overview | The full Candidate A+ crescent-with-quay composition in one frame — the "does the harbor read immediately, and does the square avoid reading as a center" test |
| C | Hero Ship + Hero Quay + waterfront framing | The quay-anchored Hero Ship relationship from `05_HARBOR_BLOCKOUT_SPEC.md` §5 |
| D | Player / pavement / building scale comparison | The primary calibration frame from `06_SCALE_CAMERA_CALIBRATION_PLAN.md` §2 |

Every screenshot: fixed viewport, known/recorded camera state (produced by §1's harness), and **opened and visually inspected** — an unopened or merely-generated screenshot file is not evidence, per `portfolio-world-visual-qa`'s own completion gate.

### Blockout PASS conditions (R2A.1 revision — qualitative judgment against `00_VISUAL_BRIEF.md`, no final-material judgment yet)

```text
1. The first screen reads as a harbor immediately (screenshot B).
2. The Hero Ship reads as a Tier 1 landmark (screenshot C).
3. Harbor Square does not look like the world's geometric center (screenshot B).
4. The four destinations are not organized cardinally/in quadrants around
   the square (screenshot B — see 05_HARBOR_BLOCKOUT_SPEC.md §6's explicit
   check that no two destinations are mirror-image opposites through the
   square).
5. The Hero Quay and its water negative space drive the composition
   (screenshots B, C).
6. Exhibition Hall is easy to locate (screenshot A).
7. Player / building / vessel scale relationships feel natural (screenshot
   D, judged against the four calibration questions in
   06_SCALE_CAMERA_CALIBRATION_PLAN.md §2).
8. Functional PASS and Visual PASS are kept separate — a clean §1 harness
   run never substitutes for any of conditions 1–7, and a §2 visual PASS
   never substitutes for §1's own checks.
```

None of these eight conditions may be granted from a code value, a passing functional harness run (§1), a pixel-diff, or an unopened screenshot — consistent with `00_VISUAL_BRIEF.md` §13.3 and `portfolio-world-visual-qa`'s own rule. **Final-material judgment (palette, texture density, lighting) is explicitly out of scope for this PASS** — the blockout uses flat shapes/placeholder blocks by design (`05_HARBOR_BLOCKOUT_SPEC.md` §8), and judging material quality on placeholder shapes would be a category error, not rigor.

## 3. Status

```text
FUNCTIONAL_HARNESS_STATUS = PLANNED, NOT IMPLEMENTED
VISUAL_QA_CONTRACT_STATUS = DEFINED
BLOCKOUT_PASS_CRITERIA = DEFINED
```
