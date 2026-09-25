# Provenance — Yakoub-ai/phaser4-gamedev

- **Source repository**: https://github.com/Yakoub-ai/phaser4-gamedev
- **Source commit (HEAD at vendor time)**: `1c1bf45dec3f0acbe8b2a963cc6dab93be31253a` (2026-08-27)
- **License**: **none detected**. GitHub's repository-license API returned no SPDX-identified license, and no `LICENSE` file was found at the repository root as of the commit above. **Treat this vendor copy as reference-only until the repository owner confirms terms.** Do not redistribute beyond this internal reference; do not ship the vendored `playtest.mjs` script or any other file as part of a released Portfolio World build without resolving this first. This is recorded as an open decision in `docs/portfolio-world-rebuild/90_DECISIONS.md`.
- **Vendored on**: 2026-09-25
- **Vendored skills** (4 of 26 in the source repo; the README's "4 agents + 6 skills" undercounts the actual repo — verified via the GitHub contents API in the R0 qualification pass):
  - `skills/phaser-architect/` (`SKILL.md` + `references/agent-guidance.md`)
  - `skills/phaser-coder/` (`SKILL.md` + `references/agent-guidance.md`)
  - `skills/phaser-playtest/` (`SKILL.md` + `examples/scenario.example.mjs` + `references/instrumenting-games.md` + `references/playtest-harness.md` + `scripts/playtest.mjs`)
  - `skills/phaser-asset-advisor/` (`SKILL.md` + `references/agent-guidance.md`)
- **Vendored agent definitions** (matching the 4 skills above): `agents/phaser-architect.md`, `agents/phaser-coder.md`, `agents/phaser-playtester.md`, `agents/phaser-asset-advisor.md`.
- **Modifications from source**: none. Files are byte-identical to the fetched source at the commit above.
- **Not vendored**: the remaining 22 skills (`phaser-matter`, `phaser-particles`, `phaser-mobile`, `phaser-saveload`, `phaser-release`, `phaser-migrate`, `phaser-fx`, `phaser-audio`, `phaser-animation`, `phaser-gameobj`, `phaser-input`, `phaser-physics`, `phaser-scene`, `phaser-tilemap`, `phaser-ui`, `phaser-brainstorm`, `phaser-gdd`, `phaser-init`, `phaser-build`, `phaser-analyze`, `phaser-feedback`, `phaser-debugger`) and the 5th agent (`phaser-debugger`). Do not install the full `.claude-plugin`/`.codex-plugin` package.
- **Runtime dependency**: `phaser-playtest`'s harness (`scripts/playtest.mjs`) requires Playwright (`npm install -D playwright && npx playwright install chromium`) — a genuine, sizeable one-time Chromium download. This must be an explicit, approved step before first use, not run silently.

## Applicability note

Matches this project's actual engine version (Phaser 4.2.1 per `portfolio-world/package.json`) exactly. `phaser-playtest` is purely functional/runtime verification (page load, canvas, FPS, exceptions, asset 404s) — it has no visual/artistic judgment capability and does not replace the Portfolio World Visual QA Profile (`tools/agent-skills/profiles/portfolio-world-visual-qa/`).
