#!/usr/bin/env node
/**
 * Portfolio World Rebuild — agent skill sync
 *
 * Copies (never symlinks) the selected vendor/ and profiles/ skill folders
 * into the runtime skill locations that a local Claude Code and/or Codex CLI
 * read skills from. Cross-platform (Windows/macOS/Linux) via Node's fs.cpSync;
 * no shell-specific commands, no symlinks (Windows symlink creation requires
 * elevated/dev-mode permissions this script must not assume).
 *
 * Source of truth is always tools/agent-skills/{vendor,profiles}/**. Never
 * hand-edit a copy under a target root below — edit the source and re-run.
 *
 * Usage:
 *   node tools/agent-skills/sync-skills.mjs           # dry run, prints the plan
 *   node tools/agent-skills/sync-skills.mjs --write   # actually copies
 */

import { existsSync, cpSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..", "..");

// Each entry: { name, src (relative to tools/agent-skills/), kind }
// kind is informational only (vendor vs project-authored profile).
const SKILLS = [
  {
    name: "environment-art",
    src: "vendor/omer-metin-skills-for-antigravity/skills/environment-art",
    kind: "vendor",
  },
  {
    name: "create-game-assets",
    src: "vendor/gamedev-skills-awesome-gamedev-agent-skills/skills/disciplines/create-game-assets",
    kind: "vendor",
  },
  {
    name: "phaser-game-setup-and-config",
    src: "vendor/phaserjs-phaser/skills/game-setup-and-config",
    kind: "vendor",
  },
  {
    name: "phaser-scenes",
    src: "vendor/phaserjs-phaser/skills/scenes",
    kind: "vendor",
  },
  {
    name: "phaser-cameras",
    src: "vendor/phaserjs-phaser/skills/cameras",
    kind: "vendor",
  },
  {
    name: "phaser-loading-assets",
    src: "vendor/phaserjs-phaser/skills/loading-assets",
    kind: "vendor",
  },
  {
    name: "phaser-sprites-and-images",
    src: "vendor/phaserjs-phaser/skills/sprites-and-images",
    kind: "vendor",
  },
  {
    name: "phaser-input-keyboard-mouse-touch",
    src: "vendor/phaserjs-phaser/skills/input-keyboard-mouse-touch",
    kind: "vendor",
  },
  {
    name: "portfolio-world-visual-qa",
    src: "profiles/portfolio-world-visual-qa",
    kind: "project-authored",
  },
];

// NOTE: the yakoub-ai/phaser4-gamedev vendor (phaser-architect/phaser-coder/
// phaser-playtest/phaser-asset-advisor) was removed in R1.1 — that source had
// no detected license. It is replaced above by the official phaserjs/phaser
// repository's own (MIT) skills. See
// tools/agent-skills/vendor/yakoub-ai-phaser4-gamedev/PROVENANCE.md and
// tools/agent-skills/vendor/phaserjs-phaser/PROVENANCE.md.

// Target roots a local agent CLI reads project skills from. Both are written
// when present-or-creatable; adjust here if your local Codex CLI uses a
// different convention.
const TARGET_ROOTS = [".claude/skills", ".codex/skills"];

const write = process.argv.includes("--write");

console.log(`Portfolio World skill sync — ${write ? "WRITE" : "DRY RUN"}`);
console.log(`Repo root: ${REPO_ROOT}\n`);

for (const root of TARGET_ROOTS) {
  const targetRoot = join(REPO_ROOT, root);
  console.log(`Target root: ${root}`);
  for (const skill of SKILLS) {
    const src = join(SCRIPT_DIR, skill.src);
    const dest = join(targetRoot, skill.name);
    if (!existsSync(src)) {
      console.log(`  SKIP  ${skill.name} — source missing: ${skill.src}`);
      continue;
    }
    console.log(`  ${write ? "COPY" : "PLAN"}  ${skill.src} -> ${root}/${skill.name} (${skill.kind})`);
    if (write) {
      mkdirSync(targetRoot, { recursive: true });
      if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
      cpSync(src, dest, { recursive: true });
    }
  }
  console.log("");
}

if (!write) {
  console.log("Dry run only — no files were copied. Re-run with --write to apply.");
}
