import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-destination-world-architecture-draft.json'), 'utf8'));
const nav = readFileSync(path.join(root, 'portfolio-world/src/world/destinationNavigation.mjs'), 'utf8');
const scene = readFileSync(path.join(root, 'portfolio-world/src/scenes/WorldScene.ts'), 'utf8');
const canonical = readFileSync(path.join(root, 'portfolio-world/src/scenes/CanonicalRuntimeR4Scene.ts'), 'utf8');

test('audits exactly four existing content pages and four active POI', () => {
  assert.equal(data.contentInventory.length, 4); assert.equal(data.currentActivePoi.length, 4);
  for (const page of data.contentInventory) {
    const html = readFileSync(path.join(root, page.path), 'utf8');
    assert.ok(html.includes(`<title>${page.title}</title>`));
    assert.ok(page.coreContent.length > 40 && page.visitorExpectation.length > 15);
  }
  assert.deepEqual(data.currentActivePoi.map((poi) => poi.id), ['hall', 'workshop', 'archive', 'hero_ship']);
});

test('retains two distinct mapping options while recording the later Human approval of Option A', () => {
  assert.equal(data.mappingOptions.length, 2);
  for (const option of data.mappingOptions) {
    assert.equal(option.status, 'OPTION_PENDING_HUMAN');
    assert.deepEqual(Object.keys(option.mapping), ['hall', 'workshop', 'archive', 'hero_ship']);
    for (const page of Object.values(option.mapping)) assert.ok(existsSync(path.join(root, page)));
  }
  assert.equal(data.preferredMapping.status, 'HUMAN_APPROVED');
  assert.equal(data.preferredMapping.implementation, 'NOT_IMPLEMENTED');
});

test('separates implemented World routing from event-only Canonical R4 and unimplemented R5', () => {
  for (const target of ['../career.html', '../teaching.html', '../making.html', '../gallery.html']) assert.ok(nav.includes(`targetPath: "${target}"`));
  assert.match(scene, /getActivatedDestinationUrl\(destination, true, window\.location\.href\)/);
  assert.match(canonical, /canonical-interaction/); assert.doesNotMatch(canonical, /window\.location\.assign/);
  assert.match(data.currentRoutingEvidence.r5, /No R5 interaction/);
});

test('world and camera comparisons use consistent viewport math and retain real constraints', () => {
  const [vw, vh] = data.viewport.logical;
  for (const world of data.worldScaleOptions) assert.deepEqual(world.cameraTravelAtZoom1, [world.world[0] - vw, world.world[1] - vh]);
  for (const camera of data.cameraOptions) {
    assert.equal(camera.visibleWorld[0], vw / camera.zoom);
    assert.equal(camera.visibleWorld[1], vh / camera.zoom);
    assert.equal(camera.screenPlayerHeight, camera.playerVisual[1] * camera.zoom);
  }
  assert.match(data.playerScaleOptions.geometryNote, /48-unit/);
});

test('reserve is not misrepresented as active land and all prohibited scope remains false', () => {
  assert.match(data.worldClassification.VISUAL_RESERVE, /non-walkable/);
  assert.match(data.worldClassification.FUTURE_WORLD_EXTENT, /not authored/);
  assert.equal(data.expansionSeams.length, 3);
  assert.ok(data.expansionSeams.every((seam) => /only|visual-only/.test(seam.current)));
  assert.deepEqual(data.designImpact, { newPoi: false, newBuilding: false, r4RuntimeModified: false, r5RuntimeImplemented: false, candidateBAutoApproved: false, worldScaleLocked: false, cameraLocked: false });
});

test('Candidate B remains untouched and required Phase D evidence is present', () => {
  const master = path.join(root, data.referenceMaster.path);
  assert.equal(createHash('sha256').update(readFileSync(master)).digest('hex'), data.referenceMaster.sha256);
  assert.equal(data.referenceMaster.approval, 'PENDING_HUMAN');
  for (const name of data.evidence.files) assert.ok(existsSync(path.join(root, data.evidence.folder, name)), name);
  assert.equal(data.gate, 'READY_FOR_R5_PHASE_D_CONTENT_AND_WORLD_HUMAN_GATE');
});
