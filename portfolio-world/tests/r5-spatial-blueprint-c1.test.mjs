import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const legacy = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-draft.json'), 'utf8'));
const bp = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-c1-draft.json'), 'utf8'));

function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j];
    if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function orient(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
function onSegment(a, b, p) { return Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]); }
function segmentsIntersect(a, b, c, d) {
  const abC = orient(a, b, c); const abD = orient(a, b, d); const cdA = orient(c, d, a); const cdB = orient(c, d, b);
  if (((abC > 0 && abD < 0) || (abC < 0 && abD > 0)) && ((cdA > 0 && cdB < 0) || (cdA < 0 && cdB > 0))) return true;
  return (abC === 0 && onSegment(a,b,c)) || (abD === 0 && onSegment(a,b,d)) || (cdA === 0 && onSegment(c,d,a)) || (cdB === 0 && onSegment(c,d,b));
}
function segmentIntersectsPolygon(a, b, polygon) {
  if (pointInPolygon(a, polygon) || pointInPolygon(b, polygon)) return true;
  return polygon.some((p, i) => segmentsIntersect(a, b, p, polygon[(i + 1) % polygon.length]));
}
function sampleSegment(a, b, spacing = 2) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]); const count = Math.max(1, Math.ceil(length / spacing));
  return Array.from({ length: count + 1 }, (_, i) => [a[0] + (b[0] - a[0]) * i / count, a[1] + (b[1] - a[1]) * i / count]);
}
function mapById(items) { return new Map(items.map((item) => [item.id, item])); }
function pathExists(from, to) {
  const seen = new Set([from]); const queue = [from];
  while (queue.length) {
    const current = queue.shift(); if (current === to) return true;
    for (const edge of bp.navigationEdges) {
      const next = edge.from === current ? edge.to : edge.to === current ? edge.from : null;
      if (next && !seen.has(next)) { seen.add(next); queue.push(next); }
    }
  }
  return false;
}

test('reproduces the C conflicts that vertex-only tests missed', () => {
  const legacyNodes = mapById(legacy.navigationNodes); const legacyBlocked = mapById(legacy.blockedZones);
  assert.ok(pointInPolygon(legacyNodes.get('N_HALL_STAIR_BASE').point, legacyBlocked.get('B_WORKSHOP_BUILDING').polygon));
  assert.ok(pointInPolygon(legacyNodes.get('N_ARCHIVE').point, legacyBlocked.get('B_ARCHIVE_INTERIOR').polygon));
  const oldEdges = mapById(legacy.navigationEdges);
  assert.ok(oldEdges.get('E_WORKSHOP_HALL_BASE').polyline.some((p) => pointInPolygon(p, legacyBlocked.get('B_WORKSHOP_BUILDING').polygon)));
  assert.ok(oldEdges.get('E_HALL_STAIRS').polyline.some((p) => pointInPolygon(p, legacyBlocked.get('B_WORKSHOP_BUILDING').polygon)));
  assert.equal(oldEdges.get('E_WORKSHOP_PROMENADE').type, 'GROUND');
  assert.equal(legacy.stairConnectors.some((connector) => connector.id === 'S_WORKSHOP_LOWER' && !legacy.navigationEdges.some((edge) => edge.connector === connector.id)), true);
});

test('C.1 preserves Candidate B source and differentiates visual art from collision intent', () => {
  const source = path.join(root, bp.referenceMaster.path);
  assert.equal(createHash('sha256').update(readFileSync(source)).digest('hex'), bp.referenceMaster.sha256);
  assert.ok(bp.visualSilhouettes.every((item) => item.status.includes('NOT_COLLISION')));
  assert.ok(bp.foregroundOcclusion.every((item) => item.status.includes('NOT_COLLISION')));
  assert.ok(bp.collisionFootprints.every((item) => item.basis));
  assert.equal(bp.supersedes.status, 'PRESERVED_UNCHANGED');
});

test('every C.1 navigation node is on its named walkable surface and outside every collision footprint', () => {
  const zones = mapById(bp.walkableZones);
  for (const node of bp.navigationNodes) {
    assert.ok(pointInPolygon(node.point, zones.get(node.zone).polygon), `${node.id} is on ${node.zone}`);
    for (const block of bp.collisionFootprints.filter((item) => item.id !== 'C_SEA')) assert.ok(!pointInPolygon(node.point, block.polygon), `${node.id} outside ${block.id}`);
  }
});

test('every C.1 route segment is fully on named walkable surfaces with player-width clearance', () => {
  const zones = mapById(bp.walkableZones); const blocks = bp.collisionFootprints.filter((block) => block.id !== 'C_SEA');
  for (const edge of bp.navigationEdges) {
    const allowed = edge.surfaceIds.map((id) => zones.get(id));
    for (let i = 0; i < edge.polyline.length - 1; i++) {
      const a = edge.polyline[i]; const b = edge.polyline[i + 1]; const dx = b[0] - a[0]; const dy = b[1] - a[1]; const length = Math.hypot(dx, dy); const nx = -dy / length; const ny = dx / length;
      for (const point of sampleSegment(a, b)) {
        for (const offset of [-edge.clearanceHalfWidth, 0, edge.clearanceHalfWidth]) {
          const lanePoint = [point[0] + nx * offset, point[1] + ny * offset];
          assert.ok(allowed.some((zone) => pointInPolygon(lanePoint, zone.polygon)), `${edge.id} full segment clearance at ${lanePoint.map(Math.round)}`);
          for (const block of blocks) assert.ok(!pointInPolygon(lanePoint, block.polygon), `${edge.id} clearance outside ${block.id}`);
        }
      }
      for (const block of blocks) assert.ok(!segmentIntersectsPolygon(a, b, block.polygon), `${edge.id} centerline avoids ${block.id}`);
    }
  }
});

test('level changes have declared stairs or gangway connectors; L0 Workshop to Promenade has no invented stair', () => {
  const nodes = mapById(bp.navigationNodes); const connectors = mapById(bp.stairConnectors);
  for (const edge of bp.navigationEdges) {
    const from = nodes.get(edge.from); const to = nodes.get(edge.to);
    if (from.elevation === to.elevation) { assert.ok(['GROUND', 'PIER', 'DOCK'].includes(edge.type), `${edge.id} same-level movement uses a surface type`); continue; }
    if (edge.type === 'STAIR') {
      const connector = connectors.get(edge.connector);
      assert.ok(connector, `${edge.id} has stair connector`);
      assert.equal(connector.from, edge.from); assert.equal(connector.to, edge.to);
    } else assert.equal(edge.type, 'GANGWAY', `${edge.id} non-stair elevation change is gangway`);
  }
  const workshopProm = mapById(bp.navigationEdges).get('E_WORKSHOP_PROMENADE');
  assert.equal(nodes.get(workshopProm.from).elevation, 'L0'); assert.equal(nodes.get(workshopProm.to).elevation, 'L0');
  assert.ok(!bp.stairConnectors.some((connector) => connector.id.includes('WORKSHOP')));
});

test('major routes and Hero shore-to-berth chain are connected', () => {
  for (const [from, to] of [['N_WORKSHOP','N_HALL'], ['N_WORKSHOP','N_ARCHIVE'], ['N_WORKSHOP','N_PROMENADE'], ['N_PROMENADE','N_HERO'], ['N_HALL','N_HERO']]) assert.ok(pathExists(from, to), `${from} reaches ${to}`);
  assert.deepEqual(bp.navigationEdges.filter((edge) => ['E_PROMENADE_PIER','E_PIER_DOCK','E_DOCK_GANGWAY','E_GANGWAY_HERO'].includes(edge.id)).map((edge) => edge.type), ['PIER','PIER','GANGWAY','GANGWAY']);
});

test('C.1 clearance, camera, and evidence states remain candid', () => {
  for (const edge of bp.navigationEdges) assert.ok(edge.minimumCorridorWidth >= bp.playerClearance.minimumCorridorWidth, `${edge.id} clears minimum width`);
  assert.deepEqual(bp.cameraAssessment.currentZoom.availableCameraTravel, [0, 0]);
  assert.deepEqual(bp.cameraAssessment.closerZoom.availableCameraTravel, [256, 144]);
  assert.equal(bp.humanGate.humanDesignSelection, 'PENDING'); assert.equal(bp.humanGate.runtimeImplementation, 'BLOCKED');
  for (const name of ['01-geometry-conflict-audit.md','02-corrected-walkable-map.png','03-corrected-navigation-graph.png','04-elevation-connector-review.png','05-footprint-vs-visual-bounds.png','06-player-clearance-validation.png','07-final-spatial-integrity-report.md']) assert.ok(existsSync(path.join(root, bp.evidence.folder, name)), `${name} exists`);
});
