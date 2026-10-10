import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repo = resolve(root, "..");
const source = readFileSync(resolve(root, "src/prototypes/r5-hybrid/hybridPilot.ts"), "utf8");
const report = resolve(repo, "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4");

test("E2.4 ships frame-accurate Pilot-only gait art with real contacts and no duplicate adjacent poses", () => {
  const result = JSON.parse(execFileSync("python", ["tools/validate_r5_e2_4_walk_assets.py"], { cwd: root, encoding: "utf8" }));
  assert.equal(result.allPass, true);
  assert.equal(result.assets["walk-side-v2.png"].frames, 8);
  assert.ok(result.assets["walk-side-v2.png"].contacts.every(Boolean));
  assert.ok(result.assets["walk-side-v2.png"].adjacentPosesDiffer.every(Boolean));
  assert.equal(result.frontBackPreserved, true);
});

test("E2.4 binds the new sheets, synchronizes cadence, preserves the body contract, and keeps a QA-only before route", () => {
  for (const asset of ["walk-front-v2.png", "walk-back-v2.png", "walk-side-v2.png"]) assert.equal(existsSync(resolve(root, "public/assets/r5-hybrid/pilot-player", asset)), true, asset);
  assert.match(source, /pilot-walk-front-v2/);
  assert.match(source, /pilot-walk-back-v2/);
  assert.match(source, /pilot-walk-side-v2/);
  // E2.4.2 keeps the rapid baseline as QA-only and promotes the denser
  // eight-pose Front/Back cadence through the live Phaser presets.
  assert.match(source, /fast: \{ label: "E2\.4 fast · side 48 \/ vertical 24", side: 48, vertical: 24 \}/);
  assert.match(source, /b: \{ label: "B · side 20 \/ vertical 16 \(recommended\)", side: 20, vertical: 16 \}/);
  assert.match(source, /Math\.abs\(vx\) > Math\.abs\(vy\) \* 1\.2/);
  assert.match(source, /walkVersion/);
  assert.match(source, /setSize\(28, 16\)\.setOffset\(0, 40\)/);
  assert.match(source, /setDisplaySize\(PLAYER\.width, PLAYER\.height\)\.setOrigin\(\.5, 1\)/);
});

test("E2.4 review boards and human gate materials are present", () => {
  for (const file of ["00-task-instruction.md", "01-original-animation-audit.md", "02-gait-cycle-design.md", "03-updated-sprite-asset-review.md", "04-animation-speed-synchronization.md", "05-browser-motion-qa.md", "06-independent-visual-qa.md", "07-regression-test-report.md", "08-human-playtest-guide.md", "09-final-human-gate.md", "10-original-walk-sprite-comparison.png", "11-improved-walk-sprite-comparison.png", "12-front-back-side-turnaround.png", "13-ground-contact-analysis.png", "14-character-gameplay-comparison.png", "15-final-human-review-board.png"]) assert.equal(existsSync(resolve(report, file)), true, file);
  for (const file of ["side-before.gif", "side-after.gif", "front-before.gif", "front-after.gif", "back-before.gif", "back-after.gif", "direction-transition.gif", "auto-navigation-walk.gif"]) assert.equal(existsSync(resolve(report, "motion-evidence", file)), true, file);
});
