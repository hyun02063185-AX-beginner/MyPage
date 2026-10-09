import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-e1r1-visual-defect-repair-draft.json'), 'utf8'));
const phase = 'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r1';
const digest = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

test('R1 preserves Candidate B inputs and repairs only inside declared masks', () => {
  assert.equal(digest(path.join(root, data.sourceMaster.path)), data.sourceMaster.sha256);
  for (const input of data.inputs) assert.equal(digest(path.join(root, input.path)), input.sha256, input.path);
  assert.equal(data.maskIntegrity.outsideMaskChangedPixels, 0);
  assert.equal(data.maskIntegrity.semanticOverlapPixels, 0);
  assert.equal(data.visualQa.baseResidual, 'ABSENT by repaired broad mask visual review');
});

test('Hero semantic toggles are independent and player movement cannot switch environment art', () => {
  assert.equal(data.toggleValidation.hullOff.startsWith('PASS'), true);
  assert.equal(data.toggleValidation.dockOff.startsWith('PASS'), true);
  assert.equal(data.toggleValidation.gangwayOff.startsWith('PASS'), true);
  assert.equal(data.toggleValidation.waterContactOff.startsWith('PASS'), true);
  assert.equal(data.environmentHashStable, true);
  assert.equal(data.visualQa.bluePolygon.startsWith('ABSENT'), true);
  const hull = data.layers.find((layer) => layer.assetId === 'hero_ship_hull');
  const foreground = data.layers.find((layer) => layer.assetId === 'hero_ship_foreground');
  assert.equal(hull.semantic, 'ship only');
  assert.equal(foreground.semantic.includes('dock'), true);
});

test('R1 emits all review artifacts with the unchanged camera and three C.2 routes', () => {
  assert.deepEqual(data.camera, { logicalViewport: [1024,576], zoom: 1.25, visibleWorld: [819.2,460.8], player: [28,56], anchor: 'bottom-center' });
  assert.deepEqual(data.motion.map((route) => route.route), ['workshop-hall','workshop-archive','workshop-hero']);
  for (const route of data.motion) {
    assert.ok(route.frames.length >= 12); assert.equal(route.environmentStable, true); assert.ok(existsSync(path.join(root, route.gif)));
  }
  for (const name of ['07-clean-base-before-after.png','08-hero-ship-off-validation.png','09-dock-gangway-toggle-validation.png','10-hero-motion-before-after.png','11-workshop-motion-review.png','12-common-world-final-composite.png','13-final-human-review-board.png']) assert.ok(existsSync(path.join(root, phase, name)), name);
  assert.equal(data.visualQa.r4RuntimeModified, false); assert.equal(data.visualQa.r5RuntimeImplemented, false);
});
