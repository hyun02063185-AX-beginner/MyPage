import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-production-layer-reconstruction-draft.json'), 'utf8'));
const e1 = 'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1';

test('E.1 preserves Candidate B and declares independent non-runtime scope', () => {
  const master = path.join(root, data.referenceMaster.path);
  const actual = createHash('sha256').update(readFileSync(master)).digest('hex');
  assert.equal(actual, data.referenceMaster.sha256);
  assert.equal(data.referenceMaster.preserved, true);
  assert.equal(data.scope.includes('no R4/R5 runtime integration'), true);
  assert.equal(data.verdict.productionArtGate, 'CONDITIONAL_REWORK_REQUIRED');
});

test('both clean plates, required evidence, and actual transparent production-pilot layers exist', () => {
  for (const name of [
    '11-workshop-clean-background.png', '12-hero-water-clean-background.png',
    '13-workshop-reconstructed-composite.png', '14-hero-reconstructed-composite.png',
    '15-player-front-back-occlusion.png', '16-beauty-master-vs-reconstruction.png',
    '17-final-human-review-board.png',
  ]) assert.ok(existsSync(path.join(root, e1, name)), name);
  const files = data.assets.map((asset) => path.join(root, asset.file));
  assert.ok(files.length >= 17);
  for (const [index, asset] of data.assets.entries()) {
    assert.ok(existsSync(files[index]), asset.file);
    assert.equal(asset.alphaChannel, true, `${asset.file} alpha`);
    assert.equal(asset.sha256, createHash('sha256').update(readFileSync(files[index])).digest('hex'), asset.file);
    assert.ok(Array.isArray(asset.placementWorld));
    assert.equal(typeof asset.depthOrder, 'number');
  }
});

test('the layer/depth contract retains the C.2 player, camera, and Hero threshold', () => {
  assert.deepEqual(data.coordinateContract.player, [28, 56]);
  assert.equal(data.coordinateContract.cameraZoom, 1.25);
  assert.equal(data.coordinateContract.groundAnchor, 'bottom-center');
  assert.deepEqual(data.coordinateContract.heroThreshold, [1028, 355]);
  for (const asset of data.assets.filter((item) => item.file.includes('hero_'))) assert.ok(asset.visualValidation.startsWith('CONDITIONAL'));
});
