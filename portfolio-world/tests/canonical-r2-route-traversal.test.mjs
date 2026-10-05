import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/scenes/CanonicalRuntimeR2Scene.ts", import.meta.url), "utf8");

const polygonLiteral = (name) => {
  const declaration = source.slice(source.indexOf(`const ${name}`));
  const start = declaration.indexOf("[", declaration.indexOf("="));
  const end = declaration.indexOf("\n];") + 2;
  return JSON.parse(declaration.slice(start, end).replace(/,\s*]$/, "]"));
};
const anchors = Object.fromEntries([...source.matchAll(/\{ id: "(P\d)", label: "[^"]+", x: (\d+), y: (\d+), level: [01] \}/g)]
  .map(([, id, x, y]) => [id, [Number(x), Number(y)]]));
const walkable = polygonLiteral("WALKABLE");
const water = polygonLiteral("WATER");
const obstacles = polygonLiteral("OBSTACLES");

// This is intentionally the same ray-casting expression used by the R2 scene.
const inside = (x, y, polygon) => polygon.reduce((hit, point, index) => {
  const previous = polygon[(index + polygon.length - 1) % polygon.length];
  return ((point[1] > y) !== (previous[1] > y))
    && x < ((previous[0] - point[0]) * (y - point[1])) / (previous[1] - point[1]) + point[0] ? !hit : hit;
}, false);
const valid = (x, y) => walkable.some((polygon) => inside(x, y, polygon))
  && !water.some((polygon) => inside(x, y, polygon))
  && !obstacles.some((polygon) => inside(x, y, polygon))
  && Math.hypot(x - 585, y - 425) >= 88;

const key = (x, y) => `${x},${y}`;
const connects = (from, to) => {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  for (let fraction = 0; fraction <= 1; fraction += 0.2) {
    if (!valid(from[0] + dx * fraction, from[1] + dy * fraction)) return false;
  }
  return true;
};
const canTraverse = (from, to) => {
  const nearestValid = (point) => {
    for (let radius = 0; radius <= 220; radius += 5) for (let angle = 0; angle < 360; angle += 15) {
      const candidate = [point[0] + Math.round(Math.cos(angle * Math.PI / 180) * radius), point[1] + Math.round(Math.sin(angle * Math.PI / 180) * radius)];
      if (valid(...candidate)) return candidate;
    }
    return null;
  };
  assert.ok(valid(...from), `anchor ${from} must be walkable; nearest=${nearestValid(from)}`);
  assert.ok(valid(...to), `anchor ${to} must be walkable; nearest=${nearestValid(to)}`);
  const queue = [from], seen = new Set([key(...from)]);
  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (Math.hypot(current[0] - to[0], current[1] - to[1]) <= 12 && connects(current, to)) return true;
    for (const [dx, dy] of [[-10,-10],[0,-10],[10,-10],[-10,0],[10,0],[-10,10],[0,10],[10,10]]) {
      const next = [current[0] + dx, current[1] + dy];
      if (next[0] < 0 || next[0] > 1920 || next[1] < 0 || next[1] > 1080 || !valid(...next) || !connects(current, next)) continue;
      const nextKey = key(...next);
      if (!seen.has(nextKey)) { seen.add(nextKey); queue.push(next); }
    }
  }
  return false;
};

for (const [route, ids] of Object.entries({
  A: ["P1", "P2", "P8", "P4", "P5", "P6"],
  B: ["P1", "P2", "P8", "P3", "P7"],
  C: ["P6", "P5", "P4", "P8", "P1"],
  D: ["P7", "P3", "P8", "P2"],
})) {
  test(`R2 collision rules admit every leg of Route ${route}`, () => {
    for (let index = 1; index < ids.length; index += 1) {
      assert.ok(canTraverse(anchors[ids[index - 1]], anchors[ids[index]]), `${ids[index - 1]} -> ${ids[index]} must remain traversable`);
    }
  });
}
