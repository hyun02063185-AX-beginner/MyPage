import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const read = (file) => readFileSync(resolve(root, file), "utf8");
const scene = read("src/scenes/R5WorldScene.ts");
const pois = read("src/world/r5/r5PoiContract.ts");

test("Integration B preserves the approved player, collision, and pathfinding contract", () => {
  assert.match(scene, /findPilotPath/);
  assert.match(scene, /canOccupyFeet/);
  assert.match(scene, /isMovementSegmentSafe/);
  assert.match(scene, /scale\(170\)/);
  assert.match(scene, /Math\.min\(170 \* delta \/ 1000, distance\)/);
  assert.match(scene, /setSize\(p\.bodyWidth, p\.bodyHeight\).*setOffset\(0, p\.bodyOffsetY\)/);
  assert.match(scene, /setZoom\(R5_WORLD\.cameraZoom\)/);
  assert.match(scene, /r5-walk-side-v2/);
  assert.match(scene, /r5-idle-side-v3/);
});

test("Integration B supplies exactly the four approved POIs and navigation targets", () => {
  assert.equal((pois.match(/visualAnchor:/g) ?? []).length, 5);
  for (const expected of ["id: \"hall\"", "id: \"workshop\"", "id: \"archive\"", "id: \"hero\"", "x: 175, y: 190", "x: 245, y: 440", "x: 180, y: 560", "x: 1020, y: 364"]) assert.match(pois, new RegExp(expected));
  assert.match(pois, /thresholdOnly: true/);
});

test("Integration B owns R5-only DOM lifecycle, marker propagation, and route-guide toggle", () => {
  assert.match(scene, /Phaser\.Scenes\.Events\.SHUTDOWN/);
  assert.match(scene, /Phaser\.Scenes\.Events\.DESTROY/);
  assert.match(scene, /e\.stopPropagation\(\)/);
  assert.match(scene, /routeGuideEnabled/);
  assert.match(scene, /Route guide: ON/);
  assert.match(scene, /Integration C에서 예정/);
  assert.doesNotMatch(scene, /window\.open|location\.href|new Phaser\.Game/);
});
