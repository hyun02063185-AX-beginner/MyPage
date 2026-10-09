import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const data = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-world-content-camera-draft.json'), 'utf8'));
const nav = readFileSync(path.join(root, 'portfolio-world/src/world/destinationNavigation.mjs'), 'utf8');
const worldScene = readFileSync(path.join(root, 'portfolio-world/src/scenes/WorldScene.ts'), 'utf8');
const canonical = readFileSync(path.join(root, 'portfolio-world/src/scenes/CanonicalRuntimeR4Scene.ts'), 'utf8');

test('the current content inventory names four existing, substantive pages', () => {
  const expected = new Map([
    ['career.html', '커리어 | 김현래'], ['teaching.html', 'AX 강의 | 김현래'],
    ['making.html', '팀을 운영하듯 AI를 운영합니다 | 김현래'], ['gallery.html', 'AI·AX 개념 갤러리 | 김현래'],
  ]);
  assert.equal(data.contentInventory.length, 4);
  for (const item of data.contentInventory) {
    const html = readFileSync(path.join(root, item.path), 'utf8');
    assert.ok(existsSync(path.join(root, item.path)), `${item.path} exists`);
    assert.ok(html.includes(`<title>${expected.get(item.path)}</title>`), `${item.path} title is actual`);
    assert.ok(item.scope.length > 35, `${item.path} scope is audited`);
  }
});

test('current World routing and Canonical R4 event-only behavior are recorded separately', () => {
  for (const target of ['../career.html', '../teaching.html', '../making.html', '../gallery.html']) assert.ok(nav.includes(`targetPath: "${target}"`));
  assert.match(worldScene, /getActivatedDestinationUrl\(destination, true, window\.location\.href\)/);
  assert.match(canonical, /canonical-interaction/);
  assert.doesNotMatch(canonical, /window\.location\.assign/);
  assert.equal(data.destinationRoutingContract.currentWorldScene.status, 'IMPLEMENTED_OUTSIDE_R5');
  assert.equal(data.destinationRoutingContract.canonicalR4.status, 'EVENT_ONLY');
  assert.equal(data.destinationRoutingContract.status, 'DRAFT_NOT_IMPLEMENTED_IN_R5');
});

test('recommended mapping keeps exactly four POIs and maps only existing pages', () => {
  const mapping = data.poiContentMappingOptions.recommended.mapping;
  assert.equal(data.poiContentMappingOptions.recommended.status, 'RECOMMENDED_PENDING_HUMAN');
  assert.deepEqual(mapping.map((item) => item.poiId), ['hall', 'workshop', 'archive', 'hero_ship']);
  for (const item of mapping) assert.ok(existsSync(path.join(root, item.targetPath.slice(3))), `${item.poiId} mapped page exists`);
  assert.equal(data.designImpact.newPoi, false); assert.equal(data.designImpact.newBuilding, false);
});

test('local and GitHub Pages relative routing resolve to the intended site files', () => {
  for (const target of ['career.html', 'teaching.html', 'making.html', 'gallery.html']) {
    assert.equal(new URL(`../${target}`, 'http://localhost:5173/').pathname, `/${target}`);
    assert.equal(new URL(`../${target}`, 'https://hyun02063185-ax-beginner.github.io/MyPage/world/').href, `https://hyun02063185-ax-beginner.github.io/MyPage/${target}`);
  }
  for (const page of data.contentInventory) assert.doesNotMatch(readFileSync(path.join(root, page.path), 'utf8'), /href="world\//);
});

test('world and camera options have internally consistent measured values', () => {
  const [viewportWidth, viewportHeight] = data.viewportContract.logicalViewport;
  assert.deepEqual([viewportWidth, viewportHeight], [1024, 576]);
  for (const option of data.worldExtentOptions) assert.deepEqual(option.cameraTravelAtZoom1, [option.world[0] - viewportWidth, option.world[1] - viewportHeight]);
  for (const camera of data.cameraOptions) {
    assert.equal(camera.visibleWorld[0], viewportWidth / camera.zoom);
    assert.equal(camera.visibleWorld[1], viewportHeight / camera.zoom);
    assert.equal(camera.screenHeight, camera.playerVisual[1] * camera.zoom);
  }
});

test('reserve and seams stay inactive, C.2 is preserved, and no R5 runtime scope is claimed', () => {
  const reserve = JSON.parse(readFileSync(path.join(root, 'data/portfolio-world/r5-future-expansion-reserve-draft.json'), 'utf8'));
  assert.equal(data.inherits[0].path, 'data/portfolio-world/r5-spatial-blueprint-c2-draft.json');
  assert.equal(data.inherits[1].path, 'data/portfolio-world/r5-future-expansion-reserve-draft.json');
  assert.equal(reserve.acceptance.newWalkableAdded, false);
  assert.equal(data.expansionReserve.current.includes('no POI'), true);
  assert.ok(data.futureConnectionSeams.every((seam) => seam.current.includes('only') || seam.current.includes('visual-only')));
  assert.deepEqual(data.designImpact, { newPoi: false, newBuilding: false, newPhaserScene: false, r4RuntimeModified: false, r5RuntimeImplemented: false, beautyMasterChanged: false });
});

test('Candidate B reference is unchanged and all Phase D evidence exists', () => {
  const actual = createHash('sha256').update(readFileSync(path.join(root, data.referenceMaster.path))).digest('hex');
  assert.equal(actual, data.referenceMaster.sha256);
  for (const file of ['01-current-content-inventory.md','02-four-poi-content-mapping.md','03-world-camera-option-review.md','04-expansion-capacity-review.md','05-human-decision-review.md','06-content-destination-map.png','07-world-boundary-comparison.png','08-camera-scale-comparison.png','09-future-expansion-seams.png','10-final-design-decision-board.png']) assert.ok(existsSync(path.join(root, data.evidence.folder, file)), file);
});
