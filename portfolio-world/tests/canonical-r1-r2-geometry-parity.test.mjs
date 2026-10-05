import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (name) => readFileSync(new URL(`../src/scenes/${name}`, import.meta.url), "utf8").replaceAll("\r\n", "\n");
const r1 = read("CanonicalRuntimeR1Scene.ts");
const r2 = read("CanonicalRuntimeR2Scene.ts");
const declaration = (source, name) => source.match(new RegExp(`const ${name}:[\\s\\S]*?\\n};`, "m"))?.[0].replaceAll(/\s+/g, "");
const inside = (source) => source.match(/const inside[\s\S]*?\n}, false\);/)?.[0].replaceAll(/\s+/g, "");
const validation = (source) => source.match(/const valid=[^\n]+/)?.[0].replaceAll(/\s+/g, "");

test("Canonical R1 and R2 retain identical gameplay geometry and point-in-polygon behavior", () => {
  for (const name of ["WALKABLE", "WATER", "OBSTACLES"]) assert.equal(declaration(r2, name), declaration(r1, name), `${name} diverged`);
  assert.equal(inside(r2), inside(r1), "inside() diverged");
  assert.equal(validation(r2), validation(r1), "movement validation diverged");
  for (const source of [r1, r2]) {
    assert.match(source, /\(y - point\[1\]\)\) \/ \(previous\[1\] - point\[1\]\)/);
    assert.match(source, /setSize\(28,\s*16\)\.setOffset\(0,\s*40\)/);
    assert.match(source, /normalize\(\)\.scale\(210\)/);
  }
});
