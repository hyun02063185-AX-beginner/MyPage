import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const audit = JSON.parse(readFileSync(resolve(projectRoot, "src/world/fleetAuthenticityAssetAudit.json"), "utf8"));
const manifest = readFileSync(resolve(projectRoot, "src/world/worldAssetManifest.ts"), "utf8");

test("fleet authenticity exports are furled, padded, clean, and below their locked weights", () => {
  assert.equal(audit.assets.length, 4);
  for (const asset of audit.assets) {
    assert.equal(asset.newSailState, "furled-stowed", asset.id);
    assert.equal(asset.provenance, "generated-original", asset.id);
    assert.equal(asset.status, "GAME_READY", asset.id);
    assert.equal(asset.visibleBounds.x, 4, asset.id);
    assert.equal(asset.visibleBounds.y, 4, asset.id);
    assert.equal(asset.visibleBounds.x + asset.visibleBounds.width + 4, asset.sourceWidth, asset.id);
    assert.equal(asset.visibleBounds.y + asset.visibleBounds.height + 4, asset.sourceHeight, asset.id);
    assert.ok(asset.fileBytes <= asset.weightCeilingBytes, asset.id);
    assert.equal(statSync(resolve(projectRoot, "public", asset.runtimePath)).size, asset.fileBytes, asset.id);
    assert.match(manifest, new RegExp(`textureKey: "${asset.textureKey}"[\\s\\S]{0,300}path: "${asset.runtimePath}"`), asset.id);
  }
  assert.equal(manifest.includes('path: "assets/world/harbor/optimized/hero-ship-d-v01.png"'), false);
  assert.equal(manifest.includes('path: "assets/world/harbor/optimized/secondary-brig-v01.png"'), false);
  assert.equal(manifest.includes('path: "assets/world/harbor/ship/medium-sailing-vessel-01-v01.png"'), false);
  assert.equal(manifest.includes('path: "assets/world/harbor/optimized/secondary-cutter-v01.png"'), false);
});
