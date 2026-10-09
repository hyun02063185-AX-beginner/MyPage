import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const c1 = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-c1-draft.json'), 'utf8'));
const c2 = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-spatial-blueprint-c2-draft.json'), 'utf8'));
function byId(items) { return new Map(items.map((item) => [item.id, item])); }
function overlay(base, replacements) { const copy = [...base]; const index = new Map(copy.map((item, i) => [item.id, i])); for (const item of replacements) index.has(item.id) ? copy[index.get(item.id)] = item : copy.push(item); return copy; }
const bp = { ...c1, walkableZones: overlay(c1.walkableZones, c2.geometryOverrides.walkableZones), navigationNodes: overlay(c1.navigationNodes, c2.geometryOverrides.navigationNodes), navigationEdges: overlay(c1.navigationEdges, c2.geometryOverrides.navigationEdges) };
function inside([x, y], polygon) { let hit = false; for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j]; if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit; } return hit; }
function samples(a, b, spacing = 2) { const length = Math.hypot(b[0] - a[0], b[1] - a[1]); const n = Math.max(1, Math.ceil(length / spacing)); return Array.from({ length: n + 1 }, (_, i) => [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); }
function orient(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
function segmentHits(a,b,poly) { if (inside(a,poly) || inside(b,poly)) return true; return poly.some((p,i) => { const q=poly[(i+1)%poly.length]; const ac=orient(a,b,p), ad=orient(a,b,q), ca=orient(p,q,a), cb=orient(p,q,b); return ((ac>0&&ad<0)||(ac<0&&ad>0))&&((ca>0&&cb<0)||(ca<0&&cb>0)); }); }
function clearanceFailures(edge, halfWidth) {
  const zones = byId(bp.walkableZones); const allowed = edge.surfaceIds.map((id) => zones.get(id)); const failures = [];
  for (let i = 0; i < edge.polyline.length - 1; i++) {
    const a = edge.polyline[i], b = edge.polyline[i + 1], length = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / length, ny = (b[0] - a[0]) / length;
    for (const point of samples(a, b)) for (const side of [-halfWidth, 0, halfWidth]) { const q = [point[0] + nx * side, point[1] + ny * side]; if (!allowed.some((zone) => inside(q, zone.polygon))) failures.push({ point: q, side }); }
  }
  return failures;
}
function cornerFailures(edge, radius) {
  const zones = byId(bp.walkableZones); const allowed = edge.surfaceIds.map((id) => zones.get(id)); const failures=[];
  for (const point of edge.polyline.slice(1, -1)) for (let i=0;i<8;i++) { const q=[point[0]+Math.cos(i*Math.PI/4)*radius,point[1]+Math.sin(i*Math.PI/4)*radius]; if (!allowed.some((zone)=>inside(q,zone.polygon))) failures.push({point,q}); }
  return failures;
}
function routeExists(from, to) { const seen=new Set([from]), queue=[from]; while(queue.length) { const current=queue.shift(); if(current===to)return true; for(const edge of bp.navigationEdges) { const next=edge.from===current?edge.to:edge.to===current?edge.from:null; if(next&&!seen.has(next)){seen.add(next);queue.push(next);} } } return false; }

test('reproduces the reported C.1 ±24 minimum-clearance failures before repair', () => {
  const oldZones = byId(c1.walkableZones);
  for (const id of ['E_PROMENADE_PIER', 'E_GANGWAY_HERO']) {
    const edge = byId(c1.navigationEdges).get(id); let fails = 0;
    for (let i=0;i<edge.polyline.length-1;i++) { const a=edge.polyline[i],b=edge.polyline[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/len,ny=(b[0]-a[0])/len;
      for(const point of samples(a,b)) for(const side of [-24,24]) { const q=[point[0]+nx*side,point[1]+ny*side]; if(!edge.surfaceIds.map((surface)=>oldZones.get(surface)).some((zone)=>inside(q,zone.polygon))) fails++; }
    }
    assert.ok(fails > 0, `${id} has reproducible ±24u C.1 failures`);
  }
});

test('C.2 retains Candidate B, C.1 collision data, and no runtime implementation', () => {
  const source=path.join(root,c2.referenceMaster.path); assert.equal(createHash('sha256').update(readFileSync(source)).digest('hex'),c2.referenceMaster.sha256);
  assert.equal(c2.baseBlueprint.status,'PRESERVED_UNCHANGED'); assert.equal(c2.invariants.collisionFootprints,'UNCHANGED_FROM_C1'); assert.equal(c2.invariants.r4Runtime,'UNCHANGED');
});

test('all C.2 routes pass actual ±16 and ±24 clearance sampling at 2u maximum spacing', () => {
  for(const edge of bp.navigationEdges) { assert.deepEqual(clearanceFailures(edge,16),[],`${edge.id} physics width`); assert.deepEqual(clearanceFailures(edge,24),[],`${edge.id} 48-unit minimum`); }
});

test('C.2 route corners retain the 48-unit clearance envelope', () => {
  for(const edge of bp.navigationEdges) assert.deepEqual(cornerFailures(edge,24),[],`${edge.id} joins`);
});

test('all centerline segments avoid collision, with water permitted only on named bridge surfaces', () => {
  const blocks=bp.collisionFootprints; for(const edge of bp.navigationEdges) for(let i=0;i<edge.polyline.length-1;i++) for(const block of blocks) {
    if(block.id==='C_SEA') { if(segmentHits(edge.polyline[i],edge.polyline[i+1],block.polygon)) assert.ok(['PIER','GANGWAY'].includes(edge.type),`${edge.id} is a named water bridge`); }
    else assert.ok(!segmentHits(edge.polyline[i],edge.polyline[i+1],block.polygon),`${edge.id} avoids ${block.id}`);
  }
});

test('C.2 retains the full shore-to-Hero chain and all required main routes', () => {
  assert.deepEqual(c2.requiredHeroChain,['N_PROMENADE','N_PIER_ENTRY','N_SIDE_DOCK','N_GANGWAY','N_HERO']);
  for(const [from,to] of [['N_WORKSHOP','N_HALL'],['N_WORKSHOP','N_ARCHIVE'],['N_WORKSHOP','N_HERO'],['N_HALL','N_HERO']]) assert.ok(routeExists(from,to),`${from} reaches ${to}`);
});

test('64-unit review is derived as a warning, while the 48-unit requirement is a pass', () => {
  const recommendedFailures=bp.navigationEdges.filter((edge)=>clearanceFailures(edge,32).length>0).map((edge)=>edge.id);
  assert.ok(recommendedFailures.length>0,'some real geometry remains below recommended 64u');
  assert.equal(c2.humanGate.minimumCorridor48,'PASS'); assert.equal(c2.humanGate.recommendedCorridor64,'PASS_OR_WARN'); assert.equal(c2.humanGate.gate,'READY_FOR_R5_C2_FINAL_SPATIAL_HUMAN_REVIEW');
});

test('all C.2 review evidence exists', () => {
  for(const file of ['01-clearance-failure-reproduction.md','02-minimum-width-failure-map.png','03-corrected-pier-and-gangway.png','04-full-route-clearance-report.md','05-final-human-gate-board.png']) assert.ok(existsSync(path.join(root,c2.evidence.folder,file)),file);
});
