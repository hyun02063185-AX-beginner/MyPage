# 90. Portfolio World Rebuild — Decisions

Updated: 2026-09-25

Chronological decision log. Once a decision is recorded here, later documents reference it rather than re-litigating it. Open items are not deferred silently — they are named below so the next phase inherits them explicitly.

## Confirmed

- Rebuild starts fresh on `feature/portfolio-world-rebuild-v2`, branched from `feature/portfolio-world-concept-vertical-slice` @ `92085e2` (after the skill-qualification commit). v1 history is preserved as-is, treated as reference/lessons-learned, not as a base to modify.
- `portfolio-world/**`, `world/**`, and all v1 assets/runtime source are out of scope for this rebuild's changes.
- IA mapping (Harbor Square/Guild Hall/Academy/Workshop/Exhibition Hall → index/career/teaching/making/gallery) is kept from v1. Physical layout is not.
- v1's perfect cardinal cross is explicitly rejected as a v2 layout baseline (`00_VISUAL_BRIEF.md` §8), kept only as a documented anti-reference.
- Final skill stack: `environment-art`, `create-game-assets`, `phaser-architect`, `phaser-coder`, `phaser-playtest` (+ optional `phaser-asset-advisor`) vendored; `portfolio-world-visual-qa` authored as a project profile adapting `frontend-visual-qa`'s discipline. See `02_SKILL_STACK.md`.
- No skill source's own installer was run; only the specifically-named skill folders were vendored, each with a `PROVENANCE.md`.
- Human review is reduced to exactly two gates (Visual Brief + Art Bible; final vertical slice) — not per-asset review — per the R1 brief's explicit instruction.

## Open — carried forward, not resolved in R1

1. **`Yakoub-ai/phaser4-gamedev` has no detected license.** GitHub's license API returned none and no `LICENSE` file exists at the vendored commit (`1c1bf45`). Its 4 skills are vendored for internal reference/evaluation only. **Before any file from that vendor directory ships in a released build** (most concretely, `phaser-playtest/scripts/playtest.mjs`), someone must either confirm terms with the repository owner or reimplement the harness independently. This blocks step 5 of `03_REBUILD_WORKFLOW.md` in a shipping sense, not a development-reference sense.
2. **The original "Concept Image #1" binary was not found.** A full search of the current working tree and `git log --all --diff-filter=A --name-only` across this repository found no concept-art image file. `00_VISUAL_BRIEF.md` §2 records the v1 art-direction document's written description as the canonical fallback. If the original image surfaces later (design tool export, external asset store, a contributor's local copy), attach it to `00_VISUAL_BRIEF.md` as a supplement — it does not retroactively invalidate decisions made from the written fallback.
3. **Exact numeric values are deliberately not locked in this phase**: camera elevation/projection angle, tile/logical-unit size, plaza stone-tile scale factor, water-ripple parameters, vessel water-contact geometry. `00_VISUAL_BRIEF.md` and `01_ART_BIBLE.md` state qualitative rules only; every number above must be validated at actual gameplay render scale (per `01_ART_BIBLE.md` §9) before being treated as final. This is a deliberate process change from v1, not an oversight — see `03_REBUILD_WORKFLOW.md`.
4. **Whether to activate vendored skills into `.claude/skills/` / `.codex/skills/` now.** `tools/agent-skills/sync-skills.mjs` exists and is dry-run-safe by default; it was not run with `--write` in this phase. Whoever starts R2 implementation decides when to actually materialize the skills into a live runtime location.
5. **`level-design` (`gamedev-skills/awesome-gamedev-agent-skills`) remains unadopted.** Its combat/pacing/gating vocabulary needs a stripped-down profile before it's useful for a no-combat walkable world. Revisit only if a future pass needs formal reachability-graph validation across more than four destinations (`02_SKILL_STACK.md`).
6. **No license audit was performed beyond the top-level repository license field** for any vendored source. Before reusing more than the currently-vendored file lists from any of the three sources, re-check licensing for the additional files.

## Superseded / Not Reopened

- v1's Visual Grammar v1.0 lock (`retro-harbor-campus-visual-grammar-v1.0-lock.md`) is read as historical *reference* for its projection concept (Hybrid Orthographic 2.5D) — its exact locked numbers (15° elevation, 0° yaw, 32px logical unit) are not re-locked for v2 without a fresh prototype validating them against this rebuild's own asymmetric-composition and calm-water goals, which may change the camera/scale answer.
