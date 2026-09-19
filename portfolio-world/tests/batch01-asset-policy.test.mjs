import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const audit = JSON.parse(readFileSync(resolve(projectRoot, "src/world/batch01AssetAudit.json"), "utf8"));
const manifestSource = readFileSync(resolve(projectRoot, "src/world/worldAssetManifest.ts"), "utf8");

test("Batch 01 production assets retain the locked audit contract", () => {
  assert.equal(audit.alphaThreshold, "alpha > 16");
  assert.equal(audit.exportStandard, "1x");
  assert.equal(audit.assets.length, 8);

  for (const asset of audit.assets) {
    assert.equal(asset.provenance, "generated-original", `${asset.id} provenance`);
    assert.equal(asset.status, "GAME_READY", `${asset.id} status`);
    assert.equal(asset.exportScale, "1x", `${asset.id} export scale`);
    assert.equal(asset.visibleBounds.x, 4, `${asset.id} left padding`);
    assert.equal(asset.visibleBounds.y, 4, `${asset.id} top padding`);
    assert.equal(asset.visibleBounds.x + asset.visibleBounds.width + 4, asset.sourceWidth, `${asset.id} right padding`);
    assert.equal(asset.visibleBounds.y + asset.visibleBounds.height + 4, asset.sourceHeight, `${asset.id} bottom padding`);
    assert.match(asset.optimizationStatus, /hidden-rgb-zeroed/);
    assert.ok(asset.fileBytes <= asset.weightCeilingBytes, `${asset.id} weight ceiling`);
    assert.equal(existsSync(resolve(projectRoot, "public", asset.runtimePath)), true, `${asset.id} file`);
    assert.equal(statSync(resolve(projectRoot, "public", asset.runtimePath)).size, asset.fileBytes, `${asset.id} bytes`);
    assert.match(manifestSource, new RegExp(`id: "${asset.id}"`), `${asset.id} manifest entry`);
  }
});
