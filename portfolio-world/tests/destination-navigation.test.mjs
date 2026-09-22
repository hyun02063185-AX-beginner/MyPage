import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import rawWorldLayout from "../src/world/worldLayoutData.json" with { type: "json" };
import {
  DESTINATION_NAVIGATION,
  getActivatedDestinationUrl,
  getDestinationAtPoint,
  getDestinationPrompt,
  resolveDestinationUrl,
} from "../src/world/destinationNavigation.mjs";
import { translateTownLayout } from "../src/world/layoutTransform.mjs";

const layout = translateTownLayout(rawWorldLayout, { worldWidth: 2048, worldHeight: 1280 });
const pagesBase = "https://example.github.io/MyPage/world/";

test("all four destination contracts resolve from the deployed World path", () => {
  const expected = [
    ["career", "Guild Hall", "forecourt-career", "career.html"],
    ["lecture", "Academy", "forecourt-lecture", "teaching.html"],
    ["ai-lab", "Workshop", "forecourt-ai-lab", "making.html"],
    ["gallery", "Exhibition Hall", "forecourt-gallery", "gallery.html"],
  ];
  assert.deepEqual(
    DESTINATION_NAVIGATION.map(({ id, label, forecourtId, targetPath }) => [id, label, forecourtId, targetPath.slice(3)]),
    expected,
  );
  for (const destination of DESTINATION_NAVIGATION) {
    const forecourt = layout.forecourts.find((item) => item.id === destination.forecourtId);
    const active = getDestinationAtPoint(layout, { x: forecourt.x, y: forecourt.y });
    assert.equal(active?.id, destination.id);
    assert.equal(resolveDestinationUrl(destination, pagesBase), `https://example.github.io/MyPage/${destination.targetPath.slice(3)}`);
    assert.equal(getActivatedDestinationUrl(active, false, pagesBase), undefined);
    assert.equal(getActivatedDestinationUrl(active, true, pagesBase), `https://example.github.io/MyPage/${destination.targetPath.slice(3)}`);
    assert.match(getDestinationPrompt(destination), /press E or Enter/);
  }
});

test("destination navigation is unavailable outside a forecourt and never collision-driven", () => {
  assert.equal(getDestinationAtPoint(layout, layout.playerSpawn), undefined);
  const careerBuilding = layout.zones.find((zone) => zone.id === "career");
  assert.equal(getDestinationAtPoint(layout, { x: careerBuilding.x, y: careerBuilding.y }), undefined);
});

test("runtime wires intentional keyboard and pointer activation to the canonical contract", () => {
  const scene = readFileSync(new URL("../src/scenes/WorldScene.ts", import.meta.url), "utf8");
  const shell = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const root = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  assert.match(scene, /getDestinationAtPoint\(WORLD_LAYOUT, this\.player\.gameObject\)/);
  assert.match(scene, /JustDown\(this\.interactionKeys\.enter\).*JustDown\(this\.interactionKeys\.e\)/s);
  assert.match(scene, /POINTER_DOWN/);
  assert.match(scene, /getActivatedDestinationUrl\(destination, true, window\.location\.href\)/);
  assert.match(shell, /id="destination-interaction"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(root, /href="world\/"[^>]*>Portfolio World</);
});
