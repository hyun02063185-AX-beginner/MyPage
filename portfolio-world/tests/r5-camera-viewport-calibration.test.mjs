import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-camera-viewport-calibration-draft.json'), 'utf8'));
const c1 = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-c1-draft.json'), 'utf8'));
const c2 = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-c2-draft.json'), 'utf8'));
const tool = readFileSync(path.join(root, 'tools/build_r5_phase_d_architecture_evidence.py'), 'utf8');
const pointInPolygon = (p, polygon) => polygon.reduce((inside, a, i) => { const b = polygon[(i + polygon.length - 1) % polygon.length]; return ((a[1] > p[1]) !== (b[1] > p[1])) && p[0] < ((b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) ? !inside : inside; }, false);

test('records the Human-approved A storytelling mapping but not its implementation', () => {
  assert.deepEqual(data.approvedContentMapping.mapping, { hall: 'teaching.html', workshop: 'making.html', archive: 'gallery.html', hero_ship: 'career.html' });
  assert.equal(data.approvedContentMapping.status, 'HUMAN_APPROVED'); assert.equal(data.approvedContentMapping.implementation, 'NOT_IMPLEMENTED');
  for (const target of Object.values(data.approvedContentMapping.mapping)) assert.ok(existsSync(path.join(root, target)));
});

test('camera transform has exactly one zoom and one preview scale application', () => {
  assert.match(data.coordinateContract.formula, /× zoom; previewScreen = logicalScreen × previewScale/);
  assert.match(data.coordinateContract.playerAnchor, /playerWidth×zoom×previewScale/);
  assert.match(data.coordinateContract.bugFix, /exactly once/);
  assert.doesNotMatch(tool, /playerVisual\[0\]\*cam\['zoom'\]\*sx/);
  assert.doesNotMatch(tool, /playerVisual\[1\]\*cam\['zoom'\]\*sy/);
});

test('native player screen sizes and every viewport travel value are mathematically consistent', () => {
  assert.deepEqual(data.playerScaleOptions.map((o) => o.logicalScreenSize), [[28,56], [35,70], [32,64]]);
  for (const cfg of data.viewportConfigurations) {
    assert.equal(cfg.visibleWorld[0], cfg.viewport[0] / cfg.zoom); assert.equal(cfg.visibleWorld[1], cfg.viewport[1] / cfg.zoom);
    const expectedTravel = [Math.max(1280 - cfg.visibleWorld[0], 0), Math.max(720 - cfg.visibleWorld[1], 0)];
    assert.ok(cfg.cameraTravel.every((value, i) => Math.abs(value - expectedTravel[i]) < 1e-9));
  }
});

test('all required anchors are the merged C.2 coordinates, on walkable ground, and outside collision', () => {
  const nodes = new Map(c1.navigationNodes.map((n) => [n.id, n])); for (const n of c2.geometryOverrides.navigationNodes) nodes.set(n.id, n);
  const zones = new Map(c1.walkableZones.map((z) => [z.id, z])); for (const z of c2.geometryOverrides.walkableZones) zones.set(z.id, z);
  const required = ['N_HALL','N_WORKSHOP','N_ARCHIVE','N_PROMENADE','N_HALL_STAIR_BASE','N_HALL_MID','N_PIER_ENTRY','N_SIDE_DOCK','N_HERO'];
  assert.deepEqual(data.groundAnchors.map((a) => a.id), required);
  for (const anchor of data.groundAnchors) {
    const actual = nodes.get(anchor.id); assert.deepEqual(anchor.point, actual.point, `${anchor.id} C.2 merged point`); assert.equal(anchor.surface, actual.zone);
    assert.ok(pointInPolygon(anchor.point, zones.get(anchor.surface).polygon), `${anchor.id} on named walk surface`);
    const solidCollision = c1.collisionFootprints.filter((f) => f.id !== 'C_SEA');
    assert.ok(!solidCollision.some((f) => pointInPolygon(anchor.point, f.polygon)), `${anchor.id} outside building, cliff, and hull collision`);
    const inSea = pointInPolygon(anchor.point, c1.collisionFootprints.find((f) => f.id === 'C_SEA').polygon);
    if (inSea) assert.ok(['G_PIER_APRON', 'G_SHORE_PIER', 'G_SIDE_DOCK', 'G_GANGWAY'].includes(anchor.surface), `${anchor.id} crosses water only on named bridge surface`);
  }
});

test('C.2, reserve, and Canonical R4 inputs remain hash-preserved and scope stays blocked', () => {
  for (const input of data.preservedInputs) assert.equal(createHash('sha256').update(readFileSync(path.join(root, input.path))).digest('hex'), input.sha256);
  assert.equal(data.rightExpansionReserve.current.includes('non-walkable'), true);
  assert.equal(data.humanGate.R5_RUNTIME, 'BLOCKED'); assert.equal(data.humanGate.FINAL_SPATIAL_BLUEPRINT, 'NOT_APPROVED');
});

test('all D.1 evidence exists and no pending decision is reported as locked', () => {
  for (const file of data.evidence.files) assert.ok(existsSync(path.join(root, data.evidence.folder, file)), file);
  for (const key of ['CONTENT_ENTRY_UX','CAMERA_VIEWPORT','WORLD_BOUNDS','CANDIDATE_B_FINAL_DESIGN']) assert.equal(data.humanGate[key], 'PENDING_HUMAN');
  assert.equal(data.humanGate.gate, 'READY_FOR_R5_D1_CAMERA_WORLD_HUMAN_REVIEW');
});
