import Phaser from "phaser";
import { LOGICAL_UNIT, WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";
import {
  drawAcademicSign,
  drawBanner,
  drawCart,
  drawDisplayBoard,
  drawFlag,
  drawMarketKiosk,
  drawNoticeBoard,
  drawRegistryStand,
  drawRouteMap,
  drawStudyGarden,
  drawTimberStack,
  drawToolRack,
  drawTree,
  drawViewingTerrace,
  drawWorktable,
} from "./streetscapeVisuals";
import type {
  BuildingFootprint,
  HarborVisualPlacement,
  HarborVisualType,
  WorldPath,
  WorldRect,
  WorldZone,
} from "./worldTypes";

const COLORS = {
  ground: 0x7ea47a,
  groundGrid: 0x668765,
  stone: 0xd2c3a4,
  stoneShade: 0xa79578,
  path: 0xb8ab91,
  pathEdge: 0x7d725f,
  water: 0x287f9f,
  waterLight: 0x73c8cf,
  wood: 0x9a663d,
  woodDark: 0x593b2b,
  roof: 0x9e5145,
  academy: 0xe3d5b8,
  guild: 0x726252,
  workshop: 0x7c6045,
  exhibition: 0xd9d7c6,
  greenery: 0x3d7657,
  greeneryLight: 0x70a856,
  gold: 0xe4b45f,
  ink: 0x263d45,
  lamp: 0xffdb7b,
  label: "#213840",
} as const;

const exhaustiveVisual = (value: never): never => {
  throw new Error(`Unrendered Retro Harbor visual type: ${String(value)}`);
};

/**
 * Retro Harbor Campus visual semantics. This is intentionally a focused Phaser
 * graphics catalog, not a reusable renderer or asset/theme system.
 */
export const HARBOR_VISUAL_CATALOG: Readonly<Record<HarborVisualType, string>> = {
  "navigation-monument": "central navigation landmark",
  planter: "stone planter and greenery",
  bench: "harbor rest bench",
  lamp: "warm harbor lamp",
  "harbor-sign": "directional harbor sign",
  crate: "wooden cargo crate",
  barrel: "wooden barrel",
  dock: "walkable wooden dock with moorings",
  water: "collidable waterfront water boundary",
  "small-boat": "small harbor boat silhouette",
  "market-kiosk": "small civic market kiosk",
  "notice-board": "guild notice board",
  "route-map": "journey route map",
  "registry-stand": "guild registry stand",
  flag: "route identity flag",
  "study-garden": "academy study garden",
  "academic-sign": "academic wayfinding sign",
  banner: "academic banner",
  tree: "learning walk tree",
  worktable: "maker-yard worktable",
  "tool-rack": "maker-yard tool rack",
  cart: "maker-yard cart",
  "timber-stack": "maker-yard timber stack",
  "display-board": "exhibition display board",
  "viewing-terrace": "waterfront viewing terrace",
};

export function drawHarborGround(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics().setDepth(-4);
  graphics.fillStyle(COLORS.ground).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  graphics.lineStyle(1, COLORS.groundGrid, 0.32);
  for (let x = 0; x <= WORLD_WIDTH; x += LOGICAL_UNIT) {
    graphics.lineBetween(x, 0, x, WORLD_HEIGHT);
  }
  for (let y = 0; y <= WORLD_HEIGHT; y += LOGICAL_UNIT) {
    graphics.lineBetween(0, y, WORLD_WIDTH, y);
  }
}

export function drawHarborEdgeTreatment(scene: Phaser.Scene, edges: readonly WorldRect[]): void {
  const graphics = scene.add.graphics().setDepth(-2);
  for (const edge of edges) {
    graphics.fillStyle(COLORS.greenery, 0.85).fillRect(
      edge.x - edge.width / 2,
      edge.y - edge.height / 2,
      edge.width,
      edge.height,
    );
    graphics.lineStyle(3, COLORS.greeneryLight, 0.72).lineBetween(
      edge.x - edge.width / 2,
      edge.y - edge.height / 2,
      edge.x + edge.width / 2,
      edge.y + edge.height / 2,
    );
  }
}

export function drawHarborPath(scene: Phaser.Scene, path: WorldPath, isForecourt = false): void {
  scene.add
    .rectangle(path.x, path.y, path.width, path.height, isForecourt ? COLORS.stone : COLORS.path)
    .setStrokeStyle(2, COLORS.pathEdge)
    .setDepth(1);
}

export function drawHarborPlaza(scene: Phaser.Scene, plaza: WorldZone): void {
  const left = plaza.x - plaza.width / 2;
  const top = plaza.y - plaza.height / 2;
  const graphics = scene.add.graphics().setDepth(2);
  graphics.fillStyle(COLORS.stone).fillRect(left, top, plaza.width, plaza.height);
  graphics.lineStyle(3, COLORS.stoneShade).strokeRect(left, top, plaza.width, plaza.height);
  graphics.lineStyle(1, COLORS.stoneShade, 0.55);
  for (let x = left + LOGICAL_UNIT; x < left + plaza.width; x += LOGICAL_UNIT) {
    graphics.lineBetween(x, top, x, top + plaza.height);
  }
  for (let y = top + LOGICAL_UNIT; y < top + plaza.height; y += LOGICAL_UNIT) {
    graphics.lineBetween(left, y, left + plaza.width, y);
  }
  scene.add
    .text(plaza.x, top + 18, plaza.label, {
      color: COLORS.label,
      fontFamily: "monospace",
      fontSize: "16px",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(8);
}

/** Four role-specific silhouettes preserve the existing building collision footprints. */
export function drawHarborBuilding(scene: Phaser.Scene, building: BuildingFootprint): void {
  const graphics = scene.add.graphics().setDepth(4);
  const left = building.x - building.width / 2;
  const top = building.y - building.height / 2;
  const bottom = top + building.height;
  let fill: number = COLORS.guild;

  switch (building.id) {
    case "career":
      fill = COLORS.guild;
      graphics.fillStyle(fill).fillRect(left, top + 24, building.width, building.height - 24);
      graphics.fillStyle(COLORS.woodDark).fillTriangle(left + 12, top + 24, building.x, top, left + building.width - 12, top + 24);
      graphics.fillStyle(COLORS.gold).fillCircle(building.x, top + 44, 12);
      graphics.lineStyle(3, COLORS.woodDark).strokeRect(left + 26, top + 58, 44, 34);
      break;
    case "lecture":
      fill = COLORS.academy;
      graphics.fillStyle(fill).fillRect(left + 20, top + 24, building.width - 40, building.height - 24);
      graphics.fillStyle(COLORS.roof).fillTriangle(left + 28, top + 26, building.x, top - 12, left + building.width - 28, top + 26);
      graphics.fillStyle(COLORS.roof).fillRect(building.x - 10, top - 26, 20, 38);
      graphics.fillStyle(COLORS.gold).fillRect(left + 38, top + 48, 14, 40);
      graphics.fillStyle(COLORS.gold).fillRect(left + building.width - 52, top + 48, 14, 40);
      break;
    case "ai-lab":
      fill = COLORS.workshop;
      graphics.fillStyle(fill).fillRect(left, top + 24, building.width, building.height - 24);
      graphics.fillStyle(COLORS.woodDark).fillTriangle(left + 12, top + 24, building.x, top - 4, left + building.width - 12, top + 24);
      graphics.lineStyle(5, COLORS.woodDark).lineBetween(left + 36, top + 28, left + 36, bottom - 14);
      graphics.lineStyle(5, COLORS.woodDark).lineBetween(left + building.width - 36, top + 28, left + building.width - 36, bottom - 14);
      graphics.lineStyle(4, COLORS.gold).lineBetween(left + 66, top + 38, left + 66, bottom - 18);
      graphics.lineStyle(4, COLORS.gold).lineBetween(left + 66, top + 38, left + 112, top + 38);
      graphics.fillStyle(COLORS.gold).fillCircle(left + 112, top + 46, 7);
      break;
    case "gallery":
      fill = COLORS.exhibition;
      graphics.fillStyle(fill).fillRect(left, top + 20, building.width, building.height - 20);
      graphics.fillStyle(COLORS.roof).fillRect(left + 16, top + 8, building.width - 32, 16);
      graphics.lineStyle(3, COLORS.stoneShade).strokeRect(left + 28, top + 42, 48, 42);
      graphics.lineStyle(3, COLORS.stoneShade).strokeRect(left + building.width - 76, top + 42, 48, 42);
      graphics.fillStyle(COLORS.ink).fillRect(building.x - 20, top + 52, 40, 56);
      break;
    case "plaza":
      return;
    default:
      return exhaustiveBuilding(building.id);
  }

  graphics.lineStyle(4, COLORS.ink).strokeRect(left, top, building.width, building.height);
  scene.add
    .text(building.x, bottom - 16, building.label, {
      align: "center",
      color: COLORS.label,
      fontFamily: "monospace",
      fontSize: "14px",
      fontStyle: "bold",
      wordWrap: { width: building.width - LOGICAL_UNIT },
    })
    .setOrigin(0.5)
    .setDepth(8);
}

const exhaustiveBuilding = (value: never): never => {
  throw new Error(`Unrendered destination silhouette: ${String(value)}`);
};

/** Exhaustive visual dispatch makes new layout types fail loudly until rendered. */
export function drawHarborVisual(scene: Phaser.Scene, visual: HarborVisualPlacement): void {
  const graphics = scene.add.graphics().setDepth(visual.type === "water" ? 0 : 6);
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;

  switch (visual.type) {
    case "navigation-monument":
      drawNavigationMonument(graphics, visual.x, visual.y);
      return;
    case "planter":
      graphics.fillStyle(COLORS.stoneShade).fillRect(left, top + 18, visual.width, visual.height - 18);
      graphics.fillStyle(COLORS.greenery).fillCircle(visual.x - 12, visual.y + 2, 14);
      graphics.fillStyle(COLORS.greeneryLight).fillCircle(visual.x + 12, visual.y - 2, 15);
      return;
    case "bench":
      graphics.fillStyle(COLORS.wood).fillRect(left, visual.y - 6, visual.width, 12);
      graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + 10, visual.y + 6, left + 10, top + visual.height);
      graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + visual.width - 10, visual.y + 6, left + visual.width - 10, top + visual.height);
      return;
    case "lamp":
      graphics.lineStyle(4, COLORS.ink).lineBetween(visual.x, top + 10, visual.x, top + visual.height);
      graphics.fillStyle(COLORS.lamp).fillCircle(visual.x, top + 9, 8);
      return;
    case "harbor-sign":
      graphics.lineStyle(4, COLORS.woodDark).lineBetween(visual.x, top + 8, visual.x, top + visual.height);
      graphics.fillStyle(COLORS.wood).fillTriangle(visual.x, top + 8, left, top + 20, visual.x, top + 32);
      graphics.fillStyle(COLORS.wood).fillTriangle(visual.x, top + 28, left + visual.width, top + 40, visual.x, top + 52);
      return;
    case "crate":
      graphics.fillStyle(COLORS.wood).fillRect(left, top, visual.width, visual.height);
      graphics.lineStyle(3, COLORS.woodDark).strokeRect(left, top, visual.width, visual.height);
      graphics.lineStyle(2, COLORS.woodDark).lineBetween(left, top, left + visual.width, top + visual.height);
      graphics.lineStyle(2, COLORS.woodDark).lineBetween(left + visual.width, top, left, top + visual.height);
      return;
    case "barrel":
      graphics.fillStyle(COLORS.wood).fillEllipse(visual.x, visual.y, visual.width, visual.height);
      graphics.lineStyle(3, COLORS.woodDark).strokeEllipse(visual.x, visual.y, visual.width, visual.height);
      graphics.lineStyle(2, COLORS.woodDark).lineBetween(left + 6, top + 4, left + 6, top + visual.height - 4);
      graphics.lineStyle(2, COLORS.woodDark).lineBetween(left + visual.width - 6, top + 4, left + visual.width - 6, top + visual.height - 4);
      return;
    case "dock":
      drawDock(graphics, visual);
      return;
    case "water":
      drawWater(graphics, visual);
      return;
    case "small-boat":
      drawBoat(graphics, visual);
      return;
    case "market-kiosk":
      drawMarketKiosk(graphics, visual);
      return;
    case "notice-board":
      drawNoticeBoard(graphics, visual);
      return;
    case "route-map":
      drawRouteMap(graphics, visual);
      return;
    case "registry-stand":
      drawRegistryStand(graphics, visual);
      return;
    case "flag":
      drawFlag(graphics, visual);
      return;
    case "study-garden":
      drawStudyGarden(graphics, visual);
      return;
    case "academic-sign":
      drawAcademicSign(graphics, visual);
      return;
    case "banner":
      drawBanner(graphics, visual);
      return;
    case "tree":
      drawTree(graphics, visual);
      return;
    case "worktable":
      drawWorktable(graphics, visual);
      return;
    case "tool-rack":
      drawToolRack(graphics, visual);
      return;
    case "cart":
      drawCart(graphics, visual);
      return;
    case "timber-stack":
      drawTimberStack(graphics, visual);
      return;
    case "display-board":
      drawDisplayBoard(graphics, visual);
      return;
    case "viewing-terrace":
      drawViewingTerrace(graphics, visual);
      return;
    default:
      return exhaustiveVisual(visual.type);
  }
}

function drawNavigationMonument(graphics: Phaser.GameObjects.Graphics, x: number, y: number): void {
  graphics.fillStyle(COLORS.stoneShade).fillRect(x - 18, y + 16, 36, 20);
  graphics.lineStyle(5, COLORS.gold).strokeCircle(x, y, 28);
  graphics.lineStyle(3, COLORS.ink).strokeCircle(x, y, 17);
  graphics.lineStyle(3, COLORS.gold).lineBetween(x - 34, y, x + 34, y);
  graphics.lineStyle(3, COLORS.gold).lineBetween(x, y - 34, x, y + 34);
  graphics.fillStyle(COLORS.gold).fillTriangle(x, y - 22, x - 6, y - 4, x + 6, y - 4);
}

function drawWater(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  graphics.fillStyle(COLORS.water).fillRect(left, top, visual.width, visual.height);
  graphics.lineStyle(3, COLORS.waterLight, 0.8);
  for (let x = left + 24; x < left + visual.width; x += 72) {
    graphics.lineBetween(x, top + 22, x + 28, top + 22);
    graphics.lineBetween(x + 20, top + 58, x + 52, top + 58);
  }
}

function drawDock(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  graphics.fillStyle(COLORS.wood).fillRect(left, top, visual.width, visual.height);
  graphics.lineStyle(3, COLORS.woodDark).strokeRect(left, top, visual.width, visual.height);
  graphics.lineStyle(2, COLORS.woodDark);
  for (let x = left + 32; x < left + visual.width; x += 32) {
    graphics.lineBetween(x, top, x, top + visual.height);
  }
  for (const x of [left + 16, left + 112, left + 224, left + 336, left + visual.width - 16]) {
    graphics.fillStyle(COLORS.woodDark).fillRect(x - 4, top - 14, 8, 28);
    graphics.lineStyle(2, COLORS.gold, 0.85).strokeCircle(x, top - 4, 6);
  }
  graphics.lineStyle(2, COLORS.woodDark, 0.9).lineBetween(left + 16, top - 5, left + 112, top - 5);
  graphics.lineStyle(2, COLORS.woodDark, 0.9).lineBetween(left + 224, top - 5, left + 336, top - 5);
}

function drawBoat(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  graphics.fillStyle(COLORS.woodDark).fillTriangle(left, top + 28, left + visual.width, top + 28, visual.x + 34, top + visual.height);
  graphics.lineStyle(3, COLORS.ink).lineBetween(visual.x, top + 2, visual.x, top + 30);
  graphics.fillStyle(0xf1ead9).fillTriangle(visual.x + 3, top + 5, visual.x + 3, top + 28, left + visual.width - 10, top + 28);
}
