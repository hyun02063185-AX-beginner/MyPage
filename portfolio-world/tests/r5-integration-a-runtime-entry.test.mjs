import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repo = resolve(root, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const manifest = read("src/world/r5RuntimeAssets.ts");
const boot = read("src/scenes/BootScene.ts");
const main = read("src/main.ts");
const scene = read("src/scenes/R5WorldScene.ts");

test("Integration A registers exactly one R5 Scene without changing the canonical contract", () => {
  assert.match(main, /R5WorldScene/); assert.match(main, /new Phaser\.Game/);
  assert.match(boot, /canonical === null.*get\("r5"\) === "1"/);
  assert.match(boot, /"R5WorldScene"/);
  assert.match(boot, /canonical === "4" \? "CanonicalRuntimeR4Scene"/);
  assert.equal((main.match(/new Phaser\.Game/g) ?? []).length, 1);
});

test("Integration A reuses approved R5 assets through BASE_URL and preserves their hashes", () => {
  assert.match(manifest, /import\.meta\.env\.BASE_URL/);
  const expected = new Map([
    ["candidate-b-scenic-plate.png", "07F5FFF3E9765682A20F106BF58E65E201BCB59C10D1BF065ED45B94B596008B"],
    ["pilot-player/idle-front-v3.png", "B195EC9395BD69C67C241693FFD1EEC6C8FCF3E9370D803A16BD5787E1D0894C"],
    ["pilot-player/idle-back-v3.png", "590089D9E50C2EC6946D17A99A55AEA3205B3DB96A4065B37063898AE02B7DC6"],
    ["pilot-player/idle-side-v3.png", "18D2E69C97E0BAFB18CFAD1C27632AA8B890B4D7A9FE1529778BEF0AF00B90C1"],
    ["pilot-player/walk-front-v3.png", "6D39867B3C12E4BBD9EB03AE11616C218E161C1D41AE8FBEC77B1150B4BB8707"],
    ["pilot-player/walk-back-v3.png", "3DA794B9E987D519A467F01160B5FB5361704FE88C40E66A5370462DD88357C3"],
    ["pilot-player/walk-side-v2.png", "D7CBE73E71060A0E23B528B53207AA4914D478DD2D446A49F3C5EC5312AEACD0"],
  ]);
  for (const [file, hash] of expected) {
    const path = resolve(root, "public/assets/r5-hybrid", file);
    assert.equal(existsSync(path), true, file);
    assert.equal(createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase(), hash, file);
  }
});

test("R5 preview retains the approved world, camera, foreground and static-player contract", () => {
  assert.match(manifest, /width: 1280, height: 720, cameraZoom: 1\.25/);
  assert.match(scene, /setBounds\(0, 0, R5_WORLD\.width, R5_WORLD\.height\)\.setZoom\(R5_WORLD\.cameraZoom\)/);
  assert.match(scene, /setSize\(previewPlayer\.bodyWidth, previewPlayer\.bodyHeight\)\.setOffset\(0, previewPlayer\.bodyOffsetY\)/);
  assert.match(scene, /Integration B\/C에서 연결 예정/);
  assert.match(scene, /Phaser\.Scenes\.Events\.SHUTDOWN/);
  assert.doesNotMatch(scene, /pointerdown|findPilotPath|contentPanel|data-world-marker/);
  assert.equal(existsSync(resolve(repo, "portfolio-world/r5-hybrid-pilot.html")), true);
});
