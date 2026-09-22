import assert from "node:assert/strict";
import test from "node:test";
import { getDockPostOffsets } from "../src/world/dockDecorationGeometry.mjs";

test("dock decoration offsets remain inset and simplify for short piers", () => {
  const mainDock = getDockPostOffsets(448);
  const pier = getDockPostOffsets(160);

  assert.equal(mainDock.length, 5);
  assert.equal(pier.length, 3);
  for (const offset of [...mainDock, ...pier]) {
    assert.ok(offset > 0 && offset < 1, `offset ${offset} must stay within the dock silhouette`);
  }
});
