# 02. Portfolio World Rebuild — Skill Stack

Status: **PREPARED — project-local PoC (revised in R1.1)**
Updated: 2026-09-26

Final selection per `reports/portfolio-world-rebuild/skill-qualification-report.md` (R0), the R1 brief, and the R1.1 Director Correction Pass (which removed an unlicensed vendor source and replaced it with the official Phaser project's own MIT-licensed skills). Nothing here was installed as a general marketplace package; everything is vendored file-by-file with recorded provenance under `tools/agent-skills/vendor/`, or authored directly as a project profile under `tools/agent-skills/profiles/`.

## ADOPT (vendored)

| Skill | Source repo | License | Source commit | Vendored path |
| --- | --- | --- | --- | --- |
| `environment-art` | `omer-metin/skills-for-antigravity` | Apache-2.0 | `e8dcf4e` | `tools/agent-skills/vendor/omer-metin-skills-for-antigravity/skills/environment-art/` |
| `create-game-assets` | `gamedev-skills/awesome-gamedev-agent-skills` | Apache-2.0 | `b105e1c` | `tools/agent-skills/vendor/gamedev-skills-awesome-gamedev-agent-skills/skills/disciplines/create-game-assets/` |
| `game-setup-and-config` | `phaserjs/phaser` (official) | MIT | `02d8931` | `tools/agent-skills/vendor/phaserjs-phaser/skills/game-setup-and-config/` |
| `scenes` | `phaserjs/phaser` (official) | MIT | `02d8931` | `.../skills/scenes/` |
| `cameras` | `phaserjs/phaser` (official) | MIT | `02d8931` | `.../skills/cameras/` |
| `loading-assets` | `phaserjs/phaser` (official) | MIT | `02d8931` | `.../skills/loading-assets/` |
| `sprites-and-images` | `phaserjs/phaser` (official) | MIT | `02d8931` | `.../skills/sprites-and-images/` |
| `input-keyboard-mouse-touch` | `phaserjs/phaser` (official) | MIT | `02d8931` | `.../skills/input-keyboard-mouse-touch/` |

Each vendor source directory has its own `PROVENANCE.md` with the exact file list, license, and — for the Phaser skills — the reason each one was selected. **All 8 skills above are under a confirmed open-source license (Apache-2.0 or MIT).**

**Not installed**: the source repos' remaining skills (69 of 73 in gamedev-skills' full pack, 21 of 27 in `phaserjs/phaser`'s `skills/`, all 74 of Claude Code Game Studios' skills). No source repo's own installer was run.

## REMOVED in R1.1 — `Yakoub-ai/phaser4-gamedev` (not adopted)

`phaser-architect`, `phaser-coder`, `phaser-playtest`, and `phaser-asset-advisor` were vendored from this source in R1 and **removed** once confirmed to have no detected open-source license (GitHub's license API returned none; no `LICENSE` file at the vendored commit). A public repository does not hold a copy of unlicensed third-party source regardless of "reference-only, internal use" framing. No file from this source remains in this repository; `tools/agent-skills/vendor/yakoub-ai-phaser4-gamedev/PROVENANCE.md` keeps only the source URL, inspected commit, and evaluation result, per the correction brief.

**Replacement strategy** (not a 1:1 role substitution):

- The **architect/coder** roles are not replaced by another specialized external coder agent. Instead: Codex/Claude implement directly from `docs/portfolio-world-rebuild/03_REBUILD_WORKFLOW.md`'s architecture-contract docs, the official Phaser skills above, and the project's installed Phaser TypeScript type definitions. Official API skill + project architecture contract is preferred over a third-party "coder agent" persona.
- The **playtest** role is replaced by a **project-owned** Playwright/browser runtime harness (not yet implemented — see `03_REBUILD_WORKFLOW.md`), not by the removed source's script.
- The **asset-advisor** role (loading/atlas/budget guidance) is covered well enough by the official `loading-assets` skill for this project's current scope; no replacement beyond that was needed.

## ADAPT (project-authored, not vendored)

| Profile | Adapts | Path |
| --- | --- | --- |
| `portfolio-world-visual-qa` | `frontend-visual-qa`'s evidence discipline (`daymade/claude-code-skills`, MIT — referenced, not copied; its DOM-sweep script does not apply to canvas content) + `00_VISUAL_BRIEF.md` as the required reference | `tools/agent-skills/profiles/portfolio-world-visual-qa/SKILL.md` |

`level-design` (`gamedev-skills/awesome-gamedev-agent-skills`) remains the optional 7th item from the R0 report — **not prepared in this phase**. Its combat/pacing/gating vocabulary needs stripping before it would be useful for a no-combat walkable world; revisit only if a future pass needs a formal reachability-graph check across more than the current four destinations.

## REFERENCE_ONLY

- Claude Code Game Studios' `art-bible`/`asset-spec`/`vertical-slice` *process shapes* (locked visual-identity doc before production; PROCEED/PIVOT/KILL feasibility gate) — already independently satisfied by this project's own `00_VISUAL_BRIEF.md`/`01_ART_BIBLE.md` and the `03_REBUILD_WORKFLOW.md` gate structure. Not installed.

## REJECT

- Claude Code Game Studios / Codex Game Studios, wholesale (no step ever inspects a rendered screenshot; requires a foreign directory/config convention; largest agent-spawn permission surface of any candidate reviewed).
- All non-Phaser engine skills in `gamedev-skills` (Godot/Unity/Unreal/Bevy/pygame/LÖVE/Roblox) — wrong engine.
- `gamedev-skills`' `phaser-core`/`phaser-arcade-physics` — redundant with the official `phaserjs/phaser` skills adopted above.
- `Yakoub-ai/phaser4-gamedev`, wholesale — see "REMOVED in R1.1" above.
- The remaining 21 skills in `phaserjs/phaser`'s `skills/` not selected above (`tilemaps`, `scale-and-responsive`, `v4-new-features`, `game-object-components`, and 17 others — see `tools/agent-skills/vendor/phaserjs-phaser/PROVENANCE.md` for the per-skill rationale on the four named ones).
- `frontend-visual-qa`'s literal bundled DOM-sweep script against canvas content (its discipline is adapted; its script is not vendored).

## Project-local setup

```text
tools/agent-skills/
  README.md              structure + vendor table (this file's short form)
  sync-skills.mjs         Node, cross-platform, no symlinks; copies
                          vendor/+profiles/ into .claude/skills/ and
                          .codex/skills/ on demand
  vendor/
    omer-metin-skills-for-antigravity/
      PROVENANCE.md
      skills/environment-art/...
    gamedev-skills-awesome-gamedev-agent-skills/
      PROVENANCE.md
      skills/disciplines/create-game-assets/...
    phaserjs-phaser/
      PROVENANCE.md
      LICENSE.md
      skills/{game-setup-and-config,scenes,cameras,loading-assets,
              sprites-and-images,input-keyboard-mouse-touch}/...
    yakoub-ai-phaser4-gamedev/
      PROVENANCE.md        (record only — no copied skill/agent files; see above)
  profiles/
    portfolio-world-visual-qa/
      SKILL.md
```

Run `node tools/agent-skills/sync-skills.mjs` (dry run) or `--write` (actually copies) to materialize these into `.claude/skills/` and `.codex/skills/`. Not run automatically as part of this phase — activating the skills into a live runtime location is a decision for whoever starts R2 implementation, not this foundation phase (see `90_DECISIONS.md`).

## Runtime dependencies these skills will need later (not installed in R1/R1.1)

- The project-owned Playwright/browser runtime harness (`03_REBUILD_WORKFLOW.md`, not yet implemented): Playwright + a browser binary — explicit, approved step only, not silent.
- `create-game-assets`' scripts: Python 3.10+ and Pillow (`pip install -r tools/agent-skills/vendor/gamedev-skills-awesome-gamedev-agent-skills/skills/disciplines/create-game-assets/scripts/requirements.txt`).

Neither was installed in this phase; R1/R1.1 remain skill-foundation-and-visual-contract only, per the brief's "No Runtime Yet" instruction.
