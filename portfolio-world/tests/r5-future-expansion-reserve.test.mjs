import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const c1 = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-c1-draft.json'), 'utf8'));
const reserve = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-future-expansion-reserve-draft.json'), 'utf8'));
function byId(items) { return new Map(items.map((item) => [item.id, item])); }
function inside([x, y], polygon) { let hit=false; for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) { const [xi,yi]=polygon[i], [xj,yj]=polygon[j]; if(((yi>y)!==(yj>y))&&x<((xj-xi)*(y-yi))/(yj-yi)+xi) hit=!hit; } return hit; }
function centroid(polygon) { return polygon.reduce((sum, point) => [sum[0] + point[0] / polygon.length, sum[1] + point[1] / polygon.length], [0, 0]); }

test('reserve keeps exactly the four current active points of interest', () => {
  assert.deepEqual(reserve.currentCore.active_poi.map((poi) => poi.id), ['hall', 'workshop', 'archive', 'hero_ship']);
  assert.equal(reserve.acceptance.activePoiCount, 4);
  assert.equal(reserve.acceptance.newPoiAdded, false);
  assert.ok(reserve.currentCore.active_poi.every((poi) => poi.node.startsWith('N_')));
});

test('reserve is visual-only, non-walkable water context rather than a hidden fifth destination', () => {
  const collisions = byId(c1.collisionFootprints); const sea=collisions.get('C_SEA');
  assert.equal(reserve.futureExpansionReserve.status, 'VISUAL_ONLY_NOW_NON_WALKABLE');
  assert.deepEqual(reserve.futureExpansionReserve.labels, ['FUTURE_EXPANSION_RESERVE','NO_CURRENT_POI','KEEP_OPEN_WATER_VIEW']);
  for (const zone of reserve.futureExpansionReserve.zones) {
    for (const point of [...zone.polygon, centroid(zone.polygon)]) assert.ok(inside(point, sea.polygon), `${zone.id} remains in blocked-water context`);
    for (const blocker of c1.collisionFootprints.filter((item) => item.id !== 'C_SEA')) assert.ok(!inside(centroid(zone.polygon), blocker.polygon), `${zone.id} centroid avoids ${blocker.id}`);
  }
  assert.equal(reserve.acceptance.newWalkableAdded, false);
  assert.equal(reserve.acceptance.collisionChanged, false);
});

test('future seams are named but have no current navigation or water-walkability exception', () => {
  const seamIds = new Set(reserve.futureConnectionSeams.map((seam) => seam.id));
  assert.deepEqual([...seamIds], ['SEAM_HERO_INTERIOR_HOOK','SEAM_EAST_AUXILIARY_BERTH','SEAM_OFFSHORE_ROUTE']);
  assert.ok(reserve.futureConnectionSeams.every((seam) => seam.kind === 'FUTURE_CONNECTION_SEAM' && seam.state.endsWith('_NOW')));
  assert.ok(reserve.futureExpansionReserve.prohibitions.includes('No water walkability'));
  assert.equal(reserve.acceptance.heroDeckDeclared, false);
});

test('reserve preserves the Candidate B source and C.2 boundary', () => {
  const source = path.join(root, reserve.referenceMaster.path);
  assert.equal(createHash('sha256').update(readFileSync(source)).digest('hex'), reserve.referenceMaster.sha256);
  assert.equal(reserve.baseBlueprint.path, 'data/portfolio-world/r5-spatial-blueprint-c2-draft.json');
  assert.equal(reserve.baseBlueprint.status, 'PRESERVED_UNCHANGED');
});

test('Human gate remains a reserve strategy, not design or runtime approval', () => {
  assert.equal(reserve.acceptance.humanDesignSelection, 'PENDING');
  assert.equal(reserve.acceptance.finalBlueprint, 'NOT_APPROVED');
  assert.equal(reserve.acceptance.runtime, 'BLOCKED');
  assert.equal(reserve.humanGate.gate, 'READY_FOR_R5_FUTURE_EXPANSION_RESERVE_HUMAN_REVIEW');
});

test('reserve review evidence is complete', () => {
  for (const name of ['01-design-intent.md','02-layout-review.md','03-reserve-emphasis.png','04-reserve-soft-composition.png','05-active-core-reserve-seams.png','06-camera-reserve-board.png','07-human-gate-summary.md','08-human-gate-board.png']) assert.ok(existsSync(path.join(root,reserve.evidence.folder,name)), name);
});
