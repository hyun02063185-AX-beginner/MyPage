import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const project = new URL("../", import.meta.url);
const assetRoot = new URL("../public/assets/canonical-r2/", import.meta.url);
const required = [
  "foundation/hall-plaza.png", "foundation/hall-entrance-apron.png", "foundation/workshop-forecourt.png", "foundation/lower-plaza.png", "foundation/central-quay.png", "foundation/hero-quay.png", "foundation/stair-entry.png", "foundation/stair-exit.png", "foundation/harbor-office-apron.png", "foundation/hero-gangway-access.png",
  "water/inner-harbor.png", "water/hero-berth.png", "water/secondary-berth.png", "water/workboat-water.png", "water/outer-scenic-water.png",
  "architecture/retaining-wall.png", "architecture/main-stairs.png", "architecture/quay-edge-central.png", "architecture/quay-edge-hero.png",
];

test("R2.1 uses transparent exact-zone assets instead of bounding-box foundation tiles", () => {
  const source = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /polygonTile|tileSprite|setCrop\(/);
  assert.match(source, /R2\.1 uses only exact, transparent polygon-zone assets/);
  for (const file of required) assert.ok(existsSync(new URL(file, assetRoot)), `${file} is required`);
  const verification = spawnSync("python", ["-c", "from PIL import Image; import sys; [(_ for _ in ()).throw(AssertionError(p)) if Image.open(p).convert('RGBA').getchannel('A').getextrema() != (0,255) else None for p in sys.argv[1:]]", ...required.map((file) => fileURLToPath(new URL(file, assetRoot)))], { encoding: "utf8" });
  assert.equal(verification.status, 0, verification.stderr || verification.stdout);
});

test("Canonical Amendment 02 and both runtime scenes share the safety anchors", () => {
  const amendment = JSON.parse(readFileSync(new URL("../../data/portfolio-world/canonical-target-amendment-02-anchor-safety-repair.json", import.meta.url)));
  const blueprint = JSON.parse(readFileSync(new URL("../../data/portfolio-world/canonical-target-implementation-blueprint.json", import.meta.url)));
  assert.equal(amendment.geometryChange, "NONE");
  assert.ok(blueprint.amendments.some(({ id }) => id === "CANONICAL_AMENDMENT_02"));
  const expected = Object.fromEntries(Object.entries(amendment.anchors).map(([id, anchor]) => [id, anchor.to]));
  for (const sceneName of ["CanonicalRuntimeR1Scene.ts", "CanonicalRuntimeR2Scene.ts"]) {
    const source = readFileSync(new URL(`../src/scenes/${sceneName}`, import.meta.url), "utf8");
    for (const [id, [x, y]] of Object.entries(expected)) assert.match(source, new RegExp(`id: "${id}"[^\\n]+x: ${x}, y: ${y}`));
  }
  for (const anchor of blueprint.anchors) if (expected[anchor.id]) assert.deepEqual([anchor.x, anchor.y], expected[anchor.id]);
});
