import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repo = resolve(root, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const c1 = JSON.parse(readFileSync(resolve(repo, "data/portfolio-world/r5-spatial-blueprint-c1-draft.json"), "utf8"));
const c2 = JSON.parse(readFileSync(resolve(repo, "data/portfolio-world/r5-spatial-blueprint-c2-draft.json"), "utf8"));
const source = read("src/prototypes/r5-hybrid/hybridPilot.ts");
const html = read("r5-hybrid-pilot.html");

const overrides = new Map(c2.geometryOverrides.walkableZones.map((zone) => [zone.id, zone]));
const zones = c1.walkableZones.map((zone) => overrides.get(zone.id) ?? zone);
const inside = (x, y, polygon) => polygon.reduce((hit, point, index) => {
  const previous = polygon[(index + polygon.length - 1) % polygon.length];
  return ((point[1] > y) !== (previous[1] > y)) && x < ((previous[0] - point[0]) * (y - point[1])) / (previous[1] - point[1]) + point[0] ? !hit : hit;
}, false);
const canOccupy = (x, y) => [[-14,-8],[14,-8],[-14,8],[14,8],[0,0]].every(([dx, dy]) =>
  zones.some((zone) => inside(x + dx, y + dy, zone.polygon)) && !c1.collisionFootprints.filter((footprint) => footprint.id !== "C_SEA").some((footprint) => inside(x + dx, y + dy, footprint.polygon)),
);
const routeEdges = [
  ...c1.navigationEdges.filter((edge) => ["E_WORKSHOP_HALL_BASE", "E_HALL_LOWER_STAIRS", "E_HALL_UPPER_STAIRS", "E_WORKSHOP_ARCHIVE", "E_WORKSHOP_PROMENADE", "E_PROMENADE_PIER", "E_PIER_DOCK", "E_DOCK_GANGWAY"].includes(edge.id)),
  ...c2.geometryOverrides.navigationEdges.filter((edge) => edge.id === "E_GANGWAY_HERO"),
];

test("E2 pilot is an independent HTML entrypoint and leaves R4 scene outside its source graph", () => {
  assert.match(html, /src="\/src\/prototypes\/r5-hybrid\/hybridPilot\.ts"/);
  assert.equal(source.includes("CanonicalRuntimeR4Scene"), false);
  assert.match(source, /width: 1024, height: 576/);
  assert.match(source, /width: 1280, height: 720/);
  assert.match(source, /setZoom\(1\.25\)/);
});

test("E2 uses Candidate B as a scenic plate and only declared minimal foreground occluders", () => {
  for (const file of ["candidate-b-scenic-plate.png", "hall-stairs-retaining.png", "workshop-foreground.png", "archive-approach-foreground.png", "dock-piles.png", "gangway.png"]) assert.equal(existsSync(resolve(root, "public/assets/r5-hybrid", file)), true, `${file} must ship`);
  assert.match(source, /Only the foreground occluders are independent assets; the ship remains part of the scenic plate/);
  assert.equal(source.includes("hero_ship_hull"), false);
});

test("C2 routes pass a 28×16 whole-body walkability sample without entering buildings, cliff, hull, or water", () => {
  for (const edge of routeEdges) {
    for (let index = 0; index < edge.polyline.length - 1; index += 1) {
      const [ax, ay] = edge.polyline[index]; const [bx, by] = edge.polyline[index + 1]; const distance = Math.hypot(bx - ax, by - ay);
      for (let travelled = 0; travelled <= distance; travelled += 2) {
        const t = travelled / distance;
        assert.equal(canOccupy(ax + (bx - ax) * t, ay + (by - ay) * t), true, `${edge.id} must remain traversable at ${travelled}px`);
      }
    }
  }
  assert.equal(canOccupy(1100, 355), false, "Hero deck/hull beyond N_HERO remains blocked");
});

test("the four approved content mappings remain preview-only and debug exposes the requested diagnostics", () => {
  for (const mapping of ["Exhibition Hall", "teaching.html", "Workshop", "making.html", "Harbor Archive", "gallery.html", "Hero Ship threshold", "career.html"]) assert.match(source, new RegExp(mapping.replace(".", "\\.")));
  assert.match(source, /threshold only, deck blocked/);
  assert.match(source, /F2/);
  assert.match(source, /COLLISION_FOOTPRINTS/);
  assert.match(source, /POI \$\{activePoi/);
});
