# 03. Portfolio World Rebuild — Workflow

Status: **PROPOSED — takes effect after Human Gate 1 (revised in R1.1)**
Updated: 2026-09-26

## Human Review Policy

This rebuild does **not** review every asset individually. Two gates only:

- **Human Gate 1**: `00_VISUAL_BRIEF.md` + `01_ART_BIBLE.md`. Nothing past pre-production planning proceeds without this.
- **Human Gate 2**: a final-quality vertical slice (the harbor hub, at minimum).

Between the two gates, agents judge against the *approved* brief and bible directly. This is a deliberate scope reduction from v1's actual history, which needed a Human Review round after nearly every implementation pass (ART-06 → ART-07 → ART-08 → ART-09 → ART-10 → ART-11 → ART-12 was six review/repair cycles for two polish notes). The `portfolio-world-visual-qa` profile exists specifically so that agent-level checks between the gates carry real weight instead of every disagreement escalating to another human round.

## Proposed Sequence

```text
1. Human Gate 1
   Approve 00_VISUAL_BRIEF.md + 01_ART_BIBLE.md as written, or send back
   with named revisions. Nothing below starts before this gate passes.

2. Architecture planning — official Phaser skills + project architecture contract
   Scene/state/asset-loading plan for Phaser 4, written against the
   approved brief/bible — not ahead of them, and not shaped by engine
   convenience over art direction. This is Codex/Claude working directly
   from this project's own architecture-contract docs plus the vendored
   official `game-setup-and-config`, `scenes`, and `cameras` skills
   (`tools/agent-skills/vendor/phaserjs-phaser/`) and the project's
   installed Phaser TypeScript type definitions — not a specialized
   external "architect agent." (R1.1: the previously-planned third-party
   `phaser-architect`/`phaser-coder` agents were removed for lacking a
   license; see `02_SKILL_STACK.md`.)

3. create-game-assets (vendored), driven by the Art Bible
   Approve ONE representative visual target — a single harbor composition
   frame covering Harbor Square + waterfront + Hero Ship — at actual game
   scale, BEFORE producing the full asset family. This is the step v1's
   history skipped in Visual Pass 1 and paid for across three later
   polish rounds (00_VISUAL_BRIEF.md §12–13).

4. Implementation — official Phaser skills + project architecture contract
   Implement against step 2's plan and the one approved visual target from
   step 3, using the vendored `loading-assets`, `sprites-and-images`, and
   `input-keyboard-mouse-touch` skills as the API reference. Same
   preference as step 2: official API skill + architecture contract, not a
   specialized external coder agent.

5. Project-owned runtime QA harness (not yet implemented)
   Automated functional runtime verification after every implementation
   change, using a project-owned Playwright/browser harness (not a vendored
   third-party script — see `02_SKILL_STACK.md`'s "REMOVED in R1.1").
   Minimum check goals:
   - page boot
   - Phaser canvas existence
   - active scene
   - console error (0 required)
   - asset load failure (0 required)
   - screenshot capture
   - fixed viewport (deterministic, reproducible captures)
   This is necessary and never sufficient — it proves the game runs, not
   that it looks right. Requires an explicitly approved one-time
   Playwright/browser-binary install when it is built.

6. portfolio-world-visual-qa (project profile)
   Post-render **visual PASS** audit against 00_VISUAL_BRIEF.md, using step
   5's own screenshot output (or an equivalent capture) as Level A/C
   evidence. This is the only step that grants a visual PASS — step 5
   never does, no matter how clean its checks are. Run BEFORE calling any
   pass "PASS" — this is where the anti-pass rule (00_VISUAL_BRIEF.md
   §13.3) is actually enforced, not left to whoever happens to remember it
   that day.

7. Repeat 3–6 for the harbor hub until it independently passes step 6,
   THEN repeat 3–6 per destination zone.

8. Human Gate 2
   Final-quality vertical slice review. If PROCEED: continue full-world
   rollout under the same 3–6 loop. If PIVOT: revise the Art Bible section
   that failed and re-enter at step 3 for the affected scope only. If KILL:
   stop and escalate — do not silently keep iterating past a KILL verdict.
```

## What Changes From v1's Actual Process

v1's real history (preserved as `feature/portfolio-world-concept-vertical-slice`, not modified by this rebuild) ran: Production → independent QA → Major repair → independent re-check → Human Review → polish → independent polish review → Human Review #2 → focused repair → independent re-check, repeated across ART-01 through ART-12. That process caught real defects (a promenade seam, a shoreline gap, three vessel-tier grounding issues, a plaza scale problem across two more rounds) — it was not a failure of rigor. It was, however, expensive: nearly every fix required its own human-facing review round because no step *before* implementation forced an agent to validate against an explicit, written rule at actual render scale, and no step *after* implementation had a standing discipline against calling a real-but-insufficient change "done."

v2's workflow moves that validation earlier (step 3, before family production) and gives the post-render check a name, an evidence ladder, and a completion gate (step 6) instead of reinventing the same anti-pass reasoning by hand each time. The two human gates are fewer, not because human judgment matters less, but because more of the work that used to require a human round is now checkable against a document a human already approved.

## Status

```text
WORKFLOW_STATUS = PROPOSED
TAKES_EFFECT = AFTER_HUMAN_GATE_1
```
