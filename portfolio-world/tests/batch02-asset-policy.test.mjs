import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const audit = JSON.parse(readFileSync(resolve(projectRoot, "src/world/batch02AssetAudit.json"), "utf8"));

test("Batch 02 assets are 1×, padded, transparent-safe, and within their role budgets", () => {
  assert.equal(audit.assets.length, 12);
  for (const asset of audit.assets) {
    const bounds = asset.visibleBounds;
    assert.ok(bounds.x >= 4 && bounds.y >= 4, `${asset.id} minimum padding`);
    assert.ok(bounds.x + bounds.width <= asset.sourceWidth - 4, `${asset.id} right padding`);
    assert.ok(bounds.y + bounds.height <= asset.sourceHeight - 4, `${asset.id} bottom padding`);
    assert.equal(asset.provenance, "generated-original");
    assert.equal(asset.status, "GAME_READY");
    assert.equal(asset.exportScale, "1x");
    assert.match(asset.optimizationStatus, /hidden-rgb-zeroed/);
    assert.ok(asset.fileBytes <= asset.weightCeilingBytes, `${asset.id} budget`);
    const runtimeFile = resolve(projectRoot, "public", asset.runtimePath);
    assert.equal(existsSync(runtimeFile), true, `${asset.id} exists`);
    assert.equal(statSync(runtimeFile).size, asset.fileBytes, `${asset.id} byte audit`);
  }
});
