import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-common-world-production-draft.json'), 'utf8'));
const out = 'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r';
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

test('E.1-R common base preserves immutable inputs and has zero outside-mask drift', () => {
  assert.equal(sha(path.join(root, data.sourceMaster.path)), data.sourceMaster.sha256);
  assert.equal(data.pixelIntegrity.changedPixelsOutsideEditMask, 0);
  assert.equal(data.pixelIntegrity.status, 'PASS');
  assert.equal(data.humanGate, 'CONDITIONAL_REWORK_REQUIRED');
  assert.equal(data.visualQa.fullCompositeUsesBundles, false);
  for (const input of data.reproducibility.inputs) assert.equal(sha(path.join(root, input.path)), input.sha256, input.path);
});

test('each active E.1-R semantic layer is independently owned, alpha-bearing, and recorded', () => {
  assert.equal(data.individualLayers.length, 11);
  assert.equal(data.visualQa.duplicateSemanticPixels, 0);
  const ids = data.individualLayers.map((layer) => layer.assetId);
  for (const required of ['hall_facade', 'workshop_structure', 'dock_surface', 'dock_piles', 'gangway', 'hero_ship_hull', 'hero_ship_foreground', 'water_contact_foreground']) assert.ok(ids.includes(required), required);
  for (const layer of data.individualLayers) {
    assert.ok(existsSync(path.join(root, layer.file)), layer.file);
    assert.equal(layer.validationStatus, 'VALID_INDEPENDENT');
    assert.equal(sha(path.join(root, layer.file)), layer.sha256);
    assert.equal(layer.alphaBoundsWorld.length, 4);
  }
  assert.equal(data.layerToggleTests.length, 7);
  assert.ok(data.layerToggleTests.every((entry) => entry.result.startsWith('PASS')));
});

test('camera, native player, motion evidence, and human-review artifacts use E.1-R contracts', () => {
  assert.deepEqual(data.cameraContract.logicalViewport, [1024, 576]);
  assert.equal(data.cameraContract.zoom, 1.25);
  assert.deepEqual(data.cameraContract.visibleWorld, [819.2, 460.8]);
  assert.deepEqual(data.playerContract.worldSize, [28, 56]);
  assert.deepEqual(data.playerContract.groundAnchor, 'bottom-center');
  assert.equal(data.motionValidation.length, 2);
  for (const route of data.motionValidation) {
    assert.equal(route.frames.length, 12);
    assert.ok(route.frames.every((frame) => frame.walkable && !frame.waterWalk));
    assert.ok(existsSync(path.join(root, route.gif)), route.gif);
  }
  for (const name of ['11-common-clean-base.png','12-local-edit-mask-map.png','13-common-world-full-composite.png','14-independent-layer-toggle-board.png','15-workshop-motion-sequence.png','16-hero-motion-sequence.png','17-beauty-master-vs-common-world.png','18-camera-five-location-board.png','19-final-human-review-board.png']) assert.ok(existsSync(path.join(root, out, name)), name);
});
