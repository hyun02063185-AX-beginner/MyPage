import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const world = resolve(import.meta.dirname, "..");
const repo = resolve(world, "..");
const r3 = readFileSync(resolve(world, "src/scenes/CanonicalRuntimeR3Scene.ts"), "utf8").replaceAll(/\s+/g, "");
const r4 = readFileSync(resolve(world, "src/scenes/CanonicalRuntimeR4Scene.ts"), "utf8").replaceAll(/\s+/g, "");
const boot = readFileSync(resolve(world, "src/scenes/BootScene.ts"), "utf8");
const main = readFileSync(resolve(world, "src/main.ts"), "utf8");
const manifest = JSON.parse(readFileSync(resolve(repo, "data/portfolio-world/runtime-r4-player-candidates.json"), "utf8"));
const contract = JSON.parse(readFileSync(resolve(repo, "data/portfolio-world/runtime-r4-contract.json"), "utf8"));
const playerDir = resolve(world, "public/assets/canonical-r4/runtime/player");

function geometry(source, name) {
  return source.match(new RegExp("const" + name + ":[\\s\\S]*?\\n];", "m"))?.[0].replaceAll(/\s+/g, "");
}
function pngSize(path) {
  const data = readFileSync(path);
  assert.deepEqual([...data.subarray(1, 4)], [80, 78, 71]);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}
function hash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

test("canonical=4 is a registered R3-derived Sprite runtime", () => {
  assert.match(main, /CanonicalRuntimeR4Scene/);
  assert.match(boot, /canonical === "4"/);
  assert.match(boot, /CanonicalRuntimeR4Scene/);
  assert.match(boot, /load\.spritesheet\(`r4-walk-\$\{direction\}`/);
  assert.doesNotMatch(boot.slice(boot.indexOf('if (canonical === "4")'), boot.indexOf("// Water continuity")), /canonical-r4\/candidates|player-a/);
  assert.match(r4, /physics\.add\.sprite/);
  assert.match(r4, /setOrigin\(\.5,1\)\.setDisplaySize\(28,56\)/);
});

test("R4 preserves the exact R3 environment, geometry, routes and interactions", () => {
  for (const name of ["WORLD", "ANCHORS", "WALKABLE", "WATER", "OBSTACLES", "VISITABLE"]) {
    assert.equal(geometry(r4, name), geometry(r3, name), name + " changed");
  }
  assert.deepEqual(contract.routes, { A: "PASS", B: "PASS", C: "PASS", D: "PASS" });
  assert.deepEqual(contract.interactions, ["exhibition-hall", "workshop", "hero-ship", "harbor-office"]);
  for (const [relative, expected] of Object.entries(manifest.lockedAssetHashes)) {
    assert.equal(hash(resolve(world, relative)), expected, relative);
  }
});

test("selected B ships exact fixed-size idle and 4-frame walk sheets", () => {
  assert.equal(manifest.humanSelection, "B");
  assert.equal(manifest.selectionStatus, "APPROVED");
  assert.equal(manifest.selectedCandidate, "REFINED_PORTFOLIO_GUIDE");
  assert.equal(manifest.runtimeImported, true);
  assert.equal(contract.selectedPlayer, "REFINED_PORTFOLIO_GUIDE");
  assert.deepEqual(contract.display, [28, 56]);
  assert.deepEqual(contract.physicsBody, [28, 16]);
  assert.deepEqual(contract.bodyOffset, [0, 40]);
  for (const direction of ["front", "back", "side"]) {
    assert.ok(existsSync(resolve(playerDir, "idle-" + direction + ".png")));
    assert.deepEqual(pngSize(resolve(playerDir, "idle-" + direction + ".png")), [28, 56]);
    assert.deepEqual(pngSize(resolve(playerDir, "walk-" + direction + ".png")), [112, 56]);
  }
  assert.match(r4, /setSize\(28,16\)\.setOffset\(0,40\)/);
  assert.match(r4, /generateFrameNumbers\(key,\{start:0,end:3\}\)/);
  assert.match(r4, /frameRate:8/);
  assert.match(r4, /setFlipX\(this\.facing==="right"\)/);
  assert.match(r4, /horizontal===vertical&&\(this\.facing==="left"\|\|this\.facing==="right"\)/);
});

test("R3 remains the approved temporary-player baseline", () => {
  assert.match(r3, /"r2-player"/);
  assert.doesNotMatch(r3, /r4-(?:idle|walk)/);
  assert.equal(contract.environmentRevision, "R3_C3_RUNTIME_PARITY_REPAIR");
  assert.equal(contract.geometryRevision, "UNCHANGED");
});

test("R4 player integration evidence includes all native and runtime records", () => {
  const evidence = resolve(repo, "reports/portfolio-world-rebuild/evidence/runtime-r4-player-integration");
  for (const name of [
    "01-final-player-direction-sheet.png", "02-final-player-walk-cycle-review.png", "03-native-28x56-animation-review.png",
    "04-r4-workshop.png", "05-r4-office.png", "06-r4-hall.png", "07-r4-stairs.png", "08-r4-hero.png",
    "09-r4-overview.png", "10-r3-vs-r4-player.png", "11-r4-depth-occlusion-review.png", "12-r4-debug.png",
  ]) assert.ok(existsSync(resolve(evidence, name)), name + " is missing");
});
