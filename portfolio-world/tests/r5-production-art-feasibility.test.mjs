import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-production-art-feasibility-draft.json'), 'utf8'));
const hash = (file) => createHash('sha256').update(readFileSync(path.join(root, file))).digest('hex');

test('preserves Candidate B, C.2, reserve, and Canonical R4 input hashes', () => {
  assert.equal(hash(data.sourceMaster.path), data.sourceMaster.sha256);
  for (const input of data.preservedInputs) assert.equal(hash(input.path), input.sha256, input.path);
  assert.equal(data.sourceMaster.preserved, true);
});

test('retains approved mapping, approved visual-only reserve, and exactly four POI', () => {
  assert.equal(data.approvedContext.contentMapping, 'HUMAN_APPROVED_A_STORYTELLING_NOT_IMPLEMENTED');
  assert.equal(data.approvedContext.rightReserve, 'APPROVED_VISUAL_ONLY');
  assert.equal(data.approvedContext.activePoi.length, 4); assert.equal(data.approvedContext.newPoi, false);
});

test('creates two genuine RGBA pilot assets with documented placement and depth order', () => {
  assert.equal(data.actualPilotAssets.length, 2);
  for (const asset of data.actualPilotAssets) {
    const file = path.join(root, asset.path); const png = readFileSync(file);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${asset.id} PNG`);
    assert.equal(png[25], 6, `${asset.id} PNG color type RGBA`);
    assert.equal(createHash('sha256').update(png).digest('hex'), asset.sha256);
    assert.ok(asset.placementWorld.width > 0 && asset.placementWorld.height > 0 && asset.order >= 70);
    assert.match(asset.origin, /not cropped/);
  }
  assert.deepEqual(data.pilotLayerOrder.slice(3), ['player at bottom-center ground anchor', 'foreground occlusion pilot', 'interaction prompt (future UI)']);
});

test('keeps real C.2 ground anchors and one-zoom player scale contract', () => {
  assert.deepEqual(data.groundAnchors, { workshop:[245,440], hallStairBase:[120,315], archive:[180,560], promenade:[455,470], heroThreshold:[1028,355] });
  assert.equal(data.approvedContext.firstPlayCandidate.zoom, 1.25);
  assert.match(data.playerOcclusionReview.anchorRule, /bottom-center/);
  assert.deepEqual(data.cameraReview.visibleWorld, [819.2,460.8]);
});

test('documents full production gaps rather than claiming pilots as a runtime pass', () => {
  assert.equal(data.productionReadiness, 'CONDITIONAL_REWORK_REQUIRED');
  assert.equal(data.humanGate.R5_RUNTIME, 'BLOCKED'); assert.equal(data.humanGate.CANDIDATE_B_FINAL_DESIGN, 'PENDING_HUMAN');
  assert.ok(data.visualQaFindings.some((finding) => finding.severity === 'BLOCKER'));
  assert.ok(data.reauthorRequiredAssets.includes('walkable terrain/base plate'));
  for (const file of data.evidence.files) assert.ok(existsSync(path.join(root, data.evidence.folder, file)), file);
});
