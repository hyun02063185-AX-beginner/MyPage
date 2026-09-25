# 90. Portfolio World Rebuild — Decisions

Updated: 2026-09-26

Chronological decision log. Once a decision is recorded here, later documents reference it rather than re-litigating it. Open items are not deferred silently — they are named below so the next phase inherits them explicitly.

## Confirmed

- Rebuild starts fresh on `feature/portfolio-world-rebuild-v2`, branched from `feature/portfolio-world-concept-vertical-slice` @ `92085e2` (after the skill-qualification commit). v1 history is preserved as-is, treated as reference/lessons-learned, not as a base to modify.
- `portfolio-world/**`, `world/**`, and all v1 assets/runtime source are out of scope for this rebuild's changes.
- IA mapping (Harbor Square/Guild Hall/Academy/Workshop/Exhibition Hall → index/career/teaching/making/gallery) is kept from v1. Physical layout is not.
- v1's perfect cardinal cross is explicitly rejected as a v2 layout baseline (`00_VISUAL_BRIEF.md` §8), kept only as a documented anti-reference.
- Final skill stack (revised in R1.1): `environment-art`, `create-game-assets` (both Apache-2.0), plus 6 official `phaserjs/phaser` skills (`game-setup-and-config`, `scenes`, `cameras`, `loading-assets`, `sprites-and-images`, `input-keyboard-mouse-touch`, all MIT) vendored; `portfolio-world-visual-qa` authored as a project profile adapting `frontend-visual-qa`'s discipline. See `02_SKILL_STACK.md`.
- No skill source's own installer was run; only the specifically-named skill folders were vendored, each with a `PROVENANCE.md`.
- Human review is reduced to exactly two gates (Visual Brief + Art Bible; final vertical slice) — not per-asset review — per the R1 brief's explicit instruction.
- **R1.1 correction (2026-09-26)**: `Yakoub-ai/phaser4-gamedev` was removed from `tools/agent-skills/vendor/` after confirming it has no detected open-source license — no copy of its files remains in this public repository. Replaced by the official `phaserjs/phaser` project's own MIT-licensed skills. The "architect"/"coder" roles it was meant to fill are now: official Phaser API skills + this project's own architecture-contract docs, not a specialized external coder agent. The "playtest" role is now: a project-owned Playwright/browser harness (not yet implemented). See `02_SKILL_STACK.md` and `03_REBUILD_WORKFLOW.md`.
- **R1.1 correction**: the Art Bible's first visual pillar was rephrased. "Harbor first, portfolio second, game third" read as a strict priority ranking where the harbor could outrank the portfolio; it was meant to describe layers with different jobs (visual first read = Harbor; product priority = Portfolio; game = the interaction layer), with portfolio delivery winning any genuine conflict. See `01_ART_BIBLE.md` §1.
- **R1.1 addition**: `01_ART_BIBLE.md` now includes a Color System (§9) and Lighting System (§10) section, both carried forward from the v1-approved direction as qualitative families/rules, no HEX or light-angle values locked. `01_ART_BIBLE.md` §15 (Good References) is now populated with the two available canonical references (Concept Image #1's written fallback; the v1 art-direction document) instead of being left empty.

## Open — carried forward, not resolved in R1/R1.1

1. **The original "Concept Image #1" binary was not found.** A full search of the current working tree and `git log --all --diff-filter=A --name-only` across this repository found no concept-art image file. `00_VISUAL_BRIEF.md` §2 records the v1 art-direction document's written description as the canonical fallback. If the original image surfaces later (design tool export, external asset store, a contributor's local copy), attach it to `00_VISUAL_BRIEF.md` as a supplement — it does not retroactively invalidate decisions made from the written fallback.
2. **Exact numeric values are deliberately not locked in this phase**: camera elevation/projection angle, tile/logical-unit size, plaza stone-tile scale factor, water-ripple parameters, vessel water-contact geometry, exact color HEX values, exact light angle/value. `00_VISUAL_BRIEF.md` and `01_ART_BIBLE.md` state qualitative rules only; every number above must be validated at actual gameplay render scale (per `01_ART_BIBLE.md` §11) before being treated as final. This is a deliberate process change from v1, not an oversight — see `03_REBUILD_WORKFLOW.md`.
3. **Whether to activate vendored skills into `.claude/skills/` / `.codex/skills/` now.** `tools/agent-skills/sync-skills.mjs` exists and is dry-run-safe by default; it was not run with `--write` in this phase. Whoever starts R2 implementation decides when to actually materialize the skills into a live runtime location.
4. **`level-design` (`gamedev-skills/awesome-gamedev-agent-skills`) remains unadopted.** Its combat/pacing/gating vocabulary needs a stripped-down profile before it's useful for a no-combat walkable world. Revisit only if a future pass needs formal reachability-graph validation across more than four destinations (`02_SKILL_STACK.md`).
5. **No license audit was performed beyond the top-level repository license field** for any vendored source. Before reusing more than the currently-vendored file lists from any of the three sources, re-check licensing for the additional files.
6. **The project-owned runtime QA harness is not yet implemented.** `03_REBUILD_WORKFLOW.md` step 5 names its check goals (page boot, canvas existence, active scene, console error, asset load failure, screenshot capture, fixed viewport) but no code exists yet — this is deliberately deferred past R1.1, which remains foundation-and-contract only.

## Superseded / Not Reopened

- v1's Visual Grammar v1.0 lock (`retro-harbor-campus-visual-grammar-v1.0-lock.md`) is read as historical *reference* for its projection concept (Hybrid Orthographic 2.5D) — its exact locked numbers (15° elevation, 0° yaw, 32px logical unit) are not re-locked for v2 without a fresh prototype validating them against this rebuild's own asymmetric-composition and calm-water goals, which may change the camera/scale answer.
