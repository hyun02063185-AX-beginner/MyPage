# 02. Portfolio World Rebuild — Skill Stack

Status: **PREPARED — project-local PoC**
Updated: 2026-09-25

Final selection per `reports/portfolio-world-rebuild/skill-qualification-report.md` (R0) and this phase's (R1) brief. Nothing here was installed as a general marketplace package; everything is vendored file-by-file with recorded provenance under `tools/agent-skills/vendor/`, or authored directly as a project profile under `tools/agent-skills/profiles/`.

## ADOPT (vendored)

| Skill | Source repo | License | Source commit | Vendored path |
| --- | --- | --- | --- | --- |
| `environment-art` | `omer-metin/skills-for-antigravity` | Apache-2.0 | `e8dcf4e` | `tools/agent-skills/vendor/omer-metin-skills-for-antigravity/skills/environment-art/` |
| `create-game-assets` | `gamedev-skills/awesome-gamedev-agent-skills` | Apache-2.0 | `b105e1c` | `tools/agent-skills/vendor/gamedev-skills-awesome-gamedev-agent-skills/skills/disciplines/create-game-assets/` |
| `phaser-architect` | `Yakoub-ai/phaser4-gamedev` | **none detected — reference-only, see below** | `1c1bf45` | `tools/agent-skills/vendor/yakoub-ai-phaser4-gamedev/skills/phaser-architect/` |
| `phaser-coder` | `Yakoub-ai/phaser4-gamedev` | **none detected — reference-only** | `1c1bf45` | `.../skills/phaser-coder/` |
| `phaser-playtest` | `Yakoub-ai/phaser4-gamedev` | **none detected — reference-only** | `1c1bf45` | `.../skills/phaser-playtest/` |
| `phaser-asset-advisor` (optional) | `Yakoub-ai/phaser4-gamedev` | **none detected — reference-only** | `1c1bf45` | `.../skills/phaser-asset-advisor/` |

Each vendor source directory has its own `PROVENANCE.md` with the exact file list and any applicability caveats. **`phaser4-gamedev` has no detected open-source license** (GitHub's license API returned none, no `LICENSE` file at the vendored commit) — see `90_DECISIONS.md` for the open decision this creates. Its 4 skills are vendored for internal reference and evaluation only until that is resolved; do not ship any file from that vendor directory (especially `phaser-playtest/scripts/playtest.mjs`) in a released build before the license question is closed.

**Not installed**: the source repos' remaining skills (69 of 73 in gamedev-skills' full pack, 22 of 26 in phaser4-gamedev, all 74 of Claude Code Game Studios' skills). No source repo's own installer was run.

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
- `gamedev-skills`' `phaser-core`/`phaser-arcade-physics` — redundant with the dedicated, deeper Phaser 4 coverage in `Yakoub-ai/phaser4-gamedev`.
- The remaining ~20 skills in `phaser4-gamedev` not selected above.
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
    yakoub-ai-phaser4-gamedev/
      PROVENANCE.md
      skills/{phaser-architect,phaser-coder,phaser-playtest,phaser-asset-advisor}/
      agents/{phaser-architect,phaser-coder,phaser-playtester,phaser-asset-advisor}.md
  profiles/
    portfolio-world-visual-qa/
      SKILL.md
```

Run `node tools/agent-skills/sync-skills.mjs` (dry run) or `--write` (actually copies) to materialize these into `.claude/skills/` and `.codex/skills/`. Not run automatically as part of this phase — activating the skills into a live runtime location is a decision for whoever starts R2 implementation, not this foundation phase (see `90_DECISIONS.md`).

## Runtime dependencies these skills will need later (not installed in R1)

- `phaser-playtest`: Playwright + Chromium (`npm install -D playwright && npx playwright install chromium`) — explicit, approved step only, not silent.
- `create-game-assets`' scripts: Python 3.10+ and Pillow (`pip install -r tools/agent-skills/vendor/gamedev-skills-awesome-gamedev-agent-skills/skills/disciplines/create-game-assets/scripts/requirements.txt`).

Neither was installed in this phase; R1 is skill-foundation-and-visual-contract only, per the brief's own "No Runtime Yet" instruction.
