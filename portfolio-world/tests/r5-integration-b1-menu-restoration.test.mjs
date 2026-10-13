import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const scene = readFileSync(resolve(root, "src/scenes/R5WorldScene.ts"), "utf8");
const pois = readFileSync(resolve(root, "src/world/r5/r5PoiContract.ts"), "utf8");
const css = readFileSync(resolve(root, "src/world.css"), "utf8");

test("B.1 creates a single R5-only bottom navigation with four POIs and one guide control", () => {
  assert.match(scene, /id = "r5-runtime-bottom-nav"/);
  assert.match(scene, /root\.insertAdjacentElement\("afterend", bottomNav\)/);
  assert.match(scene, /for \(const poi of R5_POIS\)/);
  assert.match(scene, /this\.menuButtons\.set\(poi\.id, menuButton\)/);
  assert.match(scene, /Route guide: ON/);
  assert.match(css, /#r5-runtime-bottom-nav/);
  assert.match(css, /\.r5-runtime-bottom-nav__controls/);
});

test("B.1 keeps one POI contract and one shared route request for markers and menu", () => {
  assert.match(pois, /navigationTarget/);
  assert.match(scene, /private requestPoi\(poi: R5Poi\)/);
  assert.equal((scene.match(/this\.requestPoi\(poi\)/g) ?? []).length, 2);
  assert.doesNotMatch(scene, /const R5_MENU_POIS|const MENU_POIS/);
});

test("B.1 synchronizes state, ARIA, route-guide state, and lifecycle cleanup", () => {
  assert.match(scene, /aria-pressed/);
  assert.match(scene, /updateNavigationButtons/);
  assert.match(scene, /routeGuideEnabled = !this\.routeGuideEnabled/);
  assert.match(scene, /this\.input\.off\("pointerdown"/);
  assert.match(scene, /this\.scale\.off\(Phaser\.Scale\.Events\.RESIZE/);
  assert.match(scene, /#r5-runtime-bottom-nav/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
});
