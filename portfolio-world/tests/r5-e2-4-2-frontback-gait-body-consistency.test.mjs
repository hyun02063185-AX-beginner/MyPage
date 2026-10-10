import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repo = resolve(root, "..");
const source = readFileSync(resolve(root, "src/prototypes/r5-hybrid/hybridPilot.ts"), "utf8");
const report = resolve(repo, "reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-2");

test("E2.4.2 makes Front/Back eight-pose same-master gait sheets with consistent contacts", () => {
  const result = JSON.parse(execFileSync("python", ["tools/validate_r5_e2_4_2_frontback_assets.py"], { cwd: root, encoding: "utf8" }));
  assert.equal(result.allPass, true);
  assert.equal(result.front.frames.length, 8);
  assert.equal(result.back.frames.length, 8);
  assert.ok(result.bodyWidths.front.every((width) => width >= 22));
  assert.ok(result.bodyWidths.back.every((width) => width >= 22));
});

test("E2.4.2 chooses V3 idle/walk only in normal Pilot play and retains live QA cadence", () => {
  for (const asset of ["walk-front-v3.png", "walk-back-v3.png", "idle-front-v3.png", "idle-back-v3.png"]) assert.equal(existsSync(resolve(root, "public/assets/r5-hybrid/pilot-player", asset)), true, asset);
  assert.match(source, /pilot-walk-front-v3/, "Front V3 loaded");
  assert.match(source, /pilot-walk-back-v3/, "Back V3 loaded");
  assert.match(source, /walk\("pilot-walk-front-v3", 8, cadence\.vertical\)/);
  assert.match(source, /walk\("pilot-walk-back-v3", 8, cadence\.vertical\)/);
  assert.match(source, /b: \{ label: "B · side 20 \/ vertical 16 \(recommended\)", side: 20, vertical: 16 \}/);
  assert.match(source, /pilot-idle-\$\{direction\}-v3/);
  assert.match(source, /Math\.abs\(vx\) > Math\.abs\(vy\) \* 1\.2/);
  assert.match(source, /setSize\(28, 16\)\.setOffset\(0, 40\)/);
});

test("E2.4.2 provides the required reports, boards, and real multi-frame MP4 evidence", () => {
  for (const file of ["00-task-instruction.md", "01-front-back-body-consistency-audit.md", "02-front-back-walk-improvement.md", "03-directional-silhouette-review.md", "04-browser-playtest.md", "05-regression-test-report.md", "06-final-human-gate.md", "11-direction-body-comparison.png", "12-front-back-walk-board.png", "13-idle-walk-transition-board.png", "14-final-human-review-board.png"]) assert.equal(existsSync(resolve(report, file)), true, file);
  for (const file of ["front-walk.mp4", "back-walk.mp4", "side-walk.mp4", "direction-transition.mp4"]) {
    const path = resolve(report, file); assert.equal(existsSync(path), true, file);
    const data = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames,duration", "-of", "json", path], { encoding: "utf8" }));
    assert.ok(Number(data.streams[0].nb_read_frames) >= 8, `${file} frames`); assert.ok(Number(data.streams[0].duration) > 0, `${file} duration`);
  }
});
