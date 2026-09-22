import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = readFileSync(resolve(projectRoot, "src/world/layoutNaturalization.ts"), "utf8");
const layout = JSON.parse(readFileSync(resolve(projectRoot, "src/world/worldLayoutData.json"), "utf8"));

test("major-building visual offsets break the cardinal cross without changing destination footprints", () => {
  for (const [id, x, y] of [
    ["career", -28, -8], ["lecture", 28, -8], ["ai-lab", -32, 8], ["gallery", 24, 8],
  ]) {
    assert.match(source, new RegExp(`${id === "ai-lab" ? '"ai-lab"' : id}: \\{ x: ${x}, y: ${y} \\}`));
  }
  assert.match(source, /return \{\s*\.\.\.building,/);
  assert.equal(layout.zones.filter((zone) => ["career", "lecture", "ai-lab", "gallery"].includes(zone.id)).every((zone) => zone.width === 256 && zone.height === 128), true);
});

test("Harbor Square uses intentionally uneven non-collidable detail placement", () => {
  const squareDetails = layout.harborVisuals.filter((visual) => visual.id.startsWith("square-"));
  assert.equal(squareDetails.every((visual) => visual.collidable === false), true);
  const northwest = squareDetails.find((visual) => visual.id === "square-planter-northwest");
  const northeast = squareDetails.find((visual) => visual.id === "square-planter-northeast");
  assert.notEqual(northwest.x + northeast.x, 2048, "north planters are no longer mirror-symmetric");
});
