import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repo = resolve(root, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const source = read("src/prototypes/r5-hybrid/hybridPilot.ts");
const report = resolve(repo, "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-1");

test("E2.4.1 makes the Pilot side idle a same-master v2 support pose without per-frame scaling", () => {
  execFileSync("python", ["tools/build_r5_e2_4_1_character_assets.py"], { cwd: root, encoding: "utf8" });
  const data = JSON.parse(readFileSync(resolve(report, "asset-proportion-manifest.json"), "utf8"));
  assert.equal(data.idleSideV3.source, "walk-side-v2.png frame 7");
  assert.deepEqual(data.idleSideV3.size, [28, 56]);
  assert.equal(data.idleSideV3.bounds.height, 52);
  assert.equal(data.measurements.frontIdle.height, 52);
  assert.equal(data.measurements.frontWalk.height, 52);
  assert.equal(data.measurements.sideIdleAfter.height, data.measurements.sideWalk.height + 0);
  assert.equal(existsSync(resolve(root, "public/assets/r5-hybrid/pilot-player/idle-side-v3.png")), true);
});

test("E2.4.1 defaults to natural candidate B and exposes a QA-only live cadence/speed comparator", () => {
  assert.match(source, /animationPreset: AnimationPreset = "b"/);
  // E2.4.2 retains this live comparator while giving its 8-pose vertical
  // sheets a matching cadence.
  assert.match(source, /side: 20, vertical: 16/);
  assert.match(source, /side: 24, vertical: 18/);
  assert.match(source, /side: 16, vertical: 12/);
  assert.match(source, /animationQa/);
  assert.match(source, /applyAnimationPreset/);
  assert.match(source, /this\.anims\.remove\(key\)/);
  assert.match(source, /moveSpeed: number/);
  assert.match(source, /pilot-idle-side-v3/);
  assert.match(source, /!this\.beforeWalkQa && direction === "side" \? "pilot-idle-side-v3"/);
});

test("E2.4.1 ships all required review material and real multi-frame motion evidence", () => {
  for (const file of ["00-task-instruction.md", "01-idle-walk-proportion-audit.md", "02-character-proportion-standard.md", "03-animation-cadence-comparison.md", "04-direction-transition-review.md", "05-updated-asset-review.md", "06-browser-ab-playtest.md", "07-independent-visual-qa.md", "08-regression-test-report.md", "09-human-playtest-guide.md", "10-final-human-gate.md", "11-idle-walk-before-after.png", "12-front-back-side-proportion-board.png", "13-side-idle-walk-transition.png", "14-gait-cadence-comparison.png", "15-final-human-review-board.png"]) assert.equal(existsSync(resolve(report, file)), true, file);
  for (const file of ["side-idle-to-walk.mp4", "side-walk-to-idle.mp4", "front-walk.mp4", "back-walk.mp4", "side-walk.mp4", "directional-transition.mp4", "auto-navigation.mp4"]) {
    const path = resolve(report, "motion-evidence", file);
    assert.equal(existsSync(path), true, file);
    const inspection = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames,duration", "-of", "json", path], { encoding: "utf8" }));
    assert.ok(Number(inspection.streams[0].nb_read_frames) >= 2, `${file} must contain multiple actual frames`);
    assert.ok(Number(inspection.streams[0].duration) > 0, `${file} duration`);
  }
});
