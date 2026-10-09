import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-e1r2-hero-asset-reconstruction-draft.json'), 'utf8'));
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const phase = 'reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e1-r2';

test('R2 uses committed inputs and declares a non-approved source-led reconstruction', () => {
  assert.equal(sha(path.join(root, data.sourceMaster.path)), data.sourceMaster.sha256);
  for (const input of data.inputs) assert.equal(sha(path.join(root, input.path)), input.sha256, input.path);
  assert.equal(data.segmentation.method.includes('not ownership-order subtraction'), true);
  assert.equal(data.segmentation.optionBGeneratedReference.usedInFinal, false);
  assert.equal(data.humanGate, 'CONDITIONAL_REWORK_REQUIRED');
});

test('R2 bounds each semantic toggle and retains Group/Gangway independence', () => {
  assert.deepEqual(data.toggleIntegrity, { shipGroupOffOutsideGroupPixels: 0, gangwayOffOutsideGangwayAndContactPixels: 0, dockOffOutsideDockPixels: 0, result: 'PASS' });
  const roles = data.assets.map((asset) => asset.role);
  for (const role of ['hero_ship_group','group-internal continuity patch','gangway','dock','contact']) assert.ok(roles.includes(role), role);
  for (const asset of data.assets) assert.equal(sha(path.join(root, asset.path)), asset.sha256, asset.path);
  assert.equal(data.visualQa.groupOff.startsWith('PASS'), true);
  assert.equal(data.visualQa.gangwayOff.startsWith('CONDITIONAL'), true);
});

test('R2 emits full-size, detailed, and motion evidence without changing camera or Runtime scope', () => {
  assert.deepEqual(data.camera, { logicalViewport:[1024,576], zoom:1.25, visibleWorld:[819.2,460.8], player:[28,56], anchor:'bottom-center' });
  assert.equal(data.motion.frames.length, 16); assert.equal(data.motion.environmentStable, true); assert.ok(existsSync(path.join(root, data.motion.gif)));
  for (const name of ['07-hero-ship-alpha-mask.png','08-gangway-alpha-mask.png','09-ship-group-off.png','10-gangway-off.png','11-all-on-full-world.png','12-ship-gangway-contact-detail.png','13-beauty-master-comparison.png','14-final-human-review-board.png']) assert.ok(existsSync(path.join(root, phase, name)), name);
  assert.equal(data.visualQa.r4RuntimeModified, false); assert.equal(data.visualQa.r5RuntimeImplemented, false);
});
