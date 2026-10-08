import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const dataPath = path.join(root, 'data', 'portfolio-world', 'r5-spatial-blueprint-draft.json');
const blueprint = JSON.parse(readFileSync(dataPath, 'utf8'));

function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j];
    if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function mapById(items) { return new Map(items.map((item) => [item.id, item])); }
function pathExists(from, to, edges) {
  const seen = new Set([from]); const queue = [from];
  while (queue.length) {
    const current = queue.shift();
    if (current === to) return true;
    for (const edge of edges) {
      const next = edge.from === current ? edge.to : edge.to === current ? edge.from : null;
      if (next && !seen.has(next)) { seen.add(next); queue.push(next); }
    }
  }
  return false;
}

test('R5 spatial blueprint is explicitly a draft feasibility artifact', () => {
  assert.equal(blueprint.status, 'DRAFT_SPATIAL_FEASIBILITY_ONLY');
  assert.equal(blueprint.referenceMaster.candidate, 'B_ORGANIC_COASTAL_HARBOR_PROVISIONAL');
  assert.equal(blueprint.humanGate.humanDesignSelection, 'PENDING');
  assert.equal(blueprint.humanGate.finalSpatialBlueprint, 'NOT_APPROVED');
  assert.equal(blueprint.humanGate.runtimeImplementation, 'BLOCKED');
});

test('reference master checksum protects the Candidate B input', () => {
  const source = path.join(root, blueprint.referenceMaster.path);
  const actual = createHash('sha256').update(readFileSync(source)).digest('hex');
  assert.equal(actual, blueprint.referenceMaster.sha256);
});

test('every navigation node is inside its declared explicit walkable zone', () => {
  const zones = mapById(blueprint.walkableZones);
  for (const node of blueprint.navigationNodes) {
    const zone = zones.get(node.zone);
    assert.ok(zone, `${node.id} zone exists`);
    assert.ok(pointInPolygon(node.point, zone.polygon), `${node.id} is in ${node.zone}`);
  }
});

test('navigation polylines connect their nodes and use declared traversable geometry', () => {
  const nodes = mapById(blueprint.navigationNodes);
  const walkable = blueprint.walkableZones;
  const sea = blueprint.blockedZones.find((zone) => zone.id === 'B_SEA');
  for (const edge of blueprint.navigationEdges) {
    assert.deepEqual(edge.polyline[0], nodes.get(edge.from).point, `${edge.id} starts at from node`);
    assert.deepEqual(edge.polyline.at(-1), nodes.get(edge.to).point, `${edge.id} ends at to node`);
    for (const point of edge.polyline) {
      const inWalkable = walkable.some((zone) => pointInPolygon(point, zone.polygon));
      const bridgeOverSea = ['PIER', 'GANGWAY'].includes(edge.type) && pointInPolygon(point, sea.polygon);
      assert.ok(inWalkable || bridgeOverSea, `${edge.id} point ${point} is on declared traversal`);
    }
  }
});

test('all four visitable anchors reach each other through the declared graph', () => {
  const anchors = Object.values(blueprint.candidateInteractionAnchors).filter((value) => value.startsWith('N_'));
  for (const from of anchors) for (const to of anchors) assert.ok(pathExists(from, to, blueprint.navigationEdges), `${from} reaches ${to}`);
});

test('declared widths pass the proposed 32x64 minimum and bottlenecks remain surfaced', () => {
  const larger = blueprint.playerScaleOptions.find((option) => option.id === 'B_LARGER');
  for (const check of blueprint.widthChecks) assert.ok(check.width >= larger.minimumWidth, `${check.id} >= ${larger.minimumWidth}u`);
  assert.deepEqual(blueprint.widthChecks.filter((check) => check.width < larger.recommendedWidth).map((check) => check.id), ['W_WORKSHOP_HALL', 'W_GANGWAY', 'W_ARCHIVE_SPUR']);
});

test('ground contacts name real draft walk zones and Hero contact is a dock', () => {
  const zones = mapById(blueprint.walkableZones);
  for (const contact of blueprint.groundContactReview) {
    assert.ok(zones.has(contact.zone), `${contact.place} zone exists`);
    assert.ok(pointInPolygon(contact.feetAnchor, zones.get(contact.zone).polygon), `${contact.place} feet touch declared zone`);
  }
  assert.equal(blueprint.groundContactReview.at(-1).zone, 'G_SIDE_DOCK');
});

test('all required R5 Phase C visual evidence is present', () => {
  const folder = path.join(root, blueprint.evidence.folder);
  for (const name of ['02-playable-ground-map.png', '03-elevation-and-stair-map.png', '04-navigation-graph.png', '05-path-width-and-bottlenecks.png', '06-hero-berth-access.png', '07-player-ground-contact-review.png', '08-camera-and-player-scale.png', '09-runtime-layer-feasibility.png', '11-human-gate-board.png']) {
    assert.ok(existsSync(path.join(folder, name)), `${name} exists`);
  }
});
