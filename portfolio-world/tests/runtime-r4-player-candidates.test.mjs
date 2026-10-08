import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const world = resolve(import.meta.dirname, "..");
const repo = resolve(world, "..");
const baseline = "ea42911a3ee828fb2deb72e92ad36424e144165f";
const manifestPath = resolve(repo, "data/portfolio-world/runtime-r4-player-candidates.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const candidateDir = resolve(world, "public/assets/canonical-r4/candidates/player");

function pngSize(path) {
  const data = readFileSync(path);
  assert.deepEqual([...data.subarray(1, 4)], [80, 78, 71], `${path} is a PNG`);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

test("R4 candidates are 28×56 PNGs and stay outside runtime imports", () => {
  assert.equal(manifest.runtimeImported, false);
  assert.equal(manifest.humanSelection, "PENDING");
  for (const candidate of ["a", "b"]) {
    for (const direction of ["front", "back", "side", "right-mirror"]) {
      const path = resolve(candidateDir, `player-${candidate}-${direction}.png`);
      assert.ok(existsSync(path), path);
      assert.deepEqual(pngSize(path), [28, 56]);
    }
  }
  const boot = readFileSync(resolve(world, "src/scenes/BootScene.ts"), "utf8");
  assert.match(boot, /r2-player.*player\/player-a\.png/);
  assert.doesNotMatch(boot, /canonical-r4/);
});

test("R3 locked runtime art and player baseline remain unmodified", () => {
  const protectedPaths = [
    "portfolio-world/public/assets/canonical-r2/candidates/runtime-r24-foundation-master/foundation-master-b.png",
    "portfolio-world/public/assets/canonical-r3/runtime/scenic/scenic-a-final-composite.png",
    "portfolio-world/public/assets/canonical-r2/player/player-a.png",
    "portfolio-world/src/scenes/BootScene.ts",
  ];
  const diff = execFileSync("git", ["diff", "--quiet", baseline, "--", ...protectedPaths], { cwd: repo, encoding: "utf8" });
  assert.equal(diff, "");
  for (const [relative, expected] of Object.entries(manifest.lockedAssetHashes)) {
    assert.equal(sha256(resolve(world, relative)), expected, relative);
  }
});

test("R4 evidence board set is complete", () => {
  assert.equal(manifest.evidence.length, 8);
  for (const relative of manifest.evidence) {
    assert.ok(existsSync(resolve(repo, relative)), relative);
  }
});
