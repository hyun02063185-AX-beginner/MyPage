# Portfolio World Rebuild — Agent Skill Stack

Project-local skill foundation for the Portfolio World v2 rebuild (`docs/portfolio-world-rebuild/`). This is a PoC-scale, project-local setup — not a general-purpose skill marketplace install.

## Structure

```text
tools/agent-skills/
  vendor/      Pristine, unmodified copies of externally-sourced skills, one
               subdirectory per source repo, each with its own PROVENANCE.md
               recording source URL, commit SHA, license, and exactly which
               files were copied. Never hand-edit a file inside vendor/ — if
               a vendored skill needs a Portfolio-World-specific change, that
               change belongs in profiles/, not here.
  profiles/    Project-authored skills/profiles that are NOT copied from an
               external source. These may reference or extend a vendor/
               skill, and are where Portfolio-World-specific rules live
               (per the R0 report's §12 constraint: generic skill content
               and project-specific rules are not mixed into the same file).
  sync-skills.mjs
               Cross-platform (Windows/macOS/Linux) Node script that copies
               (never symlinks) selected vendor/ and profiles/ skills into
               the actual runtime skill locations the local Claude Code
               and/or Codex CLI expect. Re-run after any vendor/ or
               profiles/ change; it is idempotent.
```

## Vendored sources

| Source | License | Commit | What was taken |
| --- | --- | --- | --- |
| `omer-metin/skills-for-antigravity` | Apache-2.0 | `e8dcf4e` | `skills/environment-art/` (skill + all 3 references) |
| `gamedev-skills/awesome-gamedev-agent-skills` | Apache-2.0 | `b105e1c` | `skills/disciplines/create-game-assets/` only |
| `phaserjs/phaser` (official) | MIT | `02d8931` | `skills/game-setup-and-config/`, `skills/scenes/`, `skills/cameras/`, `skills/loading-assets/`, `skills/sprites-and-images/`, `skills/input-keyboard-mouse-touch/` only |

`frontend-visual-qa` (`daymade/claude-code-skills`, MIT) is **not vendored**. Its discipline is written directly into `profiles/portfolio-world-visual-qa/SKILL.md` as project-authored content, per the R1 brief's ADAPT instruction — its DOM-sweep script does not apply to Phaser canvas content.

**Removed in R1.1**: `Yakoub-ai/phaser4-gamedev` (`phaser-architect`, `phaser-coder`, `phaser-playtest`, `phaser-asset-advisor`) was vendored in R1 and removed once its repository was confirmed to have no detected open-source license — a public repository should not hold a copy of unlicensed third-party source, "reference-only" framing notwithstanding. Replaced by the official `phaserjs/phaser` skills above; its `PROVENANCE.md` under `vendor/yakoub-ai-phaser4-gamedev/` records the source, the evaluation, and why it was not adopted, with no copied file remaining. The "architect"/"coder" agent roles are not replaced 1:1 — see `docs/portfolio-world-rebuild/03_REBUILD_WORKFLOW.md` for the official-Phaser-skills-plus-architecture-contract approach used instead.

## Running the sync script

```bash
node tools/agent-skills/sync-skills.mjs
```

See the script's own header comment for what it copies and where.
