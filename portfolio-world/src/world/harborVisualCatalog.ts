import Phaser from "phaser";
import { LOGICAL_UNIT, WORLD_HEIGHT, WORLD_WIDTH } from "../config/gameConfig";
import {
  drawAcademicSign,
  drawBanner,
  drawCart,
  drawCargoShed,
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
  drawWarehouse,
  drawWorktable,
} from "./streetscapeVisuals";
import { getDockPostOffsets } from "./dockDecorationGeometry.mjs";
import { HARBOR_PALETTE as COLORS } from "./visualPalette";
import {
  getBuildingDepth,
  getBackgroundEdgeDepth,
  getHarborVisualDepth,
  getWorldLabelDepth,
  WORLD_DEPTH,
} from "./worldDepth.mjs";
import type {
  BuildingFootprint,
  HarborVisualPlacement,
  HarborVisualType,
  WorldPath,
  WorldRect,
  WorldZone,
} from "./worldTypes";

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
  "secondary-sailing-ship": "secondary sailing vessel asset anchor",
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
  "large-ship": "large harbor ship silhouette",
  warehouse: "harbor warehouse",
  "cargo-shed": "harbor cargo shed",
  "warehouse-annex": "harbor warehouse annex",
  "service-hut": "harbor service hut",
  "rope-coil": "dockside rope coil",
  "safety-rail": "harbor safety rail",
  "mooring-bollard": "mooring bollard",
  "service-marker": "dock service marker",
  buoy: "floating harbor buoy",
  gangplank: "visual-only vessel gangplank",
};

export function drawHarborGround(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics().setDepth(WORLD_DEPTH.BACKGROUND_GROUND);
  graphics.fillStyle(COLORS.ground).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // Macro material masses replace the prototype grid. Their deliberately fixed
  // placement keeps the world legible and avoids procedural/noisy decoration.
  graphics.fillStyle(COLORS.groundLight, 0.34);
  graphics.fillEllipse(990, 228, 690, 300);
  graphics.fillEllipse(480, 620, 650, 390);
  graphics.fillEllipse(1570, 610, 730, 410);
  graphics.fillStyle(COLORS.groundDark, 0.18);
  graphics.fillEllipse(224, 230, 410, 220);
  graphics.fillEllipse(1750, 300, 500, 280);
  graphics.fillEllipse(1660, 860, 690, 230);

  // Calm, plan-view grass clusters: large enough to read as a material, sparse
  // enough that buildings and routes retain hierarchy.
  graphics.fillStyle(COLORS.greenery, 0.17);
  const grassClusters = [
    [112, 152, 124, 26], [342, 314, 168, 22], [600, 188, 130, 24],
    [720, 830, 170, 30], [1228, 190, 154, 24], [1384, 466, 190, 26],
    [1760, 854, 196, 28], [1900, 318, 112, 22], [1870, 760, 144, 26],
  ] as const;
  for (const [x, y, width, height] of grassClusters) {
    graphics.fillEllipse(x, y, width, height);
  }

  // Workshop and waterfront receive softly layered compacted-ground patches
  // rather than a new palette or a high-frequency texture map. The staggered
  // insets keep the material transition from reading as a hard-edged block.
  graphics.fillStyle(COLORS.groundDry, 0.06);
  graphics.fillRoundedRect(1424, 694, 440, 204, 88);
  graphics.fillRoundedRect(88, 814, 596, 190, 84);
  graphics.fillStyle(COLORS.groundDry, 0.10);
  graphics.fillRoundedRect(1432, 700, 424, 192, 76);
  graphics.fillRoundedRect(100, 820, 572, 178, 72);
  graphics.fillStyle(COLORS.groundDry, 0.12);
  graphics.fillRoundedRect(1448, 710, 392, 172, 62);
  graphics.fillRoundedRect(124, 832, 524, 154, 60);
  graphics.fillStyle(COLORS.groundGravel, 0.28);
  for (const [x, y, width] of [[1392, 734, 70], [1508, 808, 96], [1668, 756, 82], [212, 924, 76], [408, 866, 92]] as const) {
    graphics.fillRoundedRect(x, y, width, 7, 3);
  }
}

export function drawHarborEdgeTreatment(scene: Phaser.Scene, edges: readonly WorldRect[]): void {
  const graphics = scene.add.graphics().setDepth(getBackgroundEdgeDepth("harbor-edge-treatment"));
  for (const edge of edges) {
    const left = edge.x - edge.width / 2;
    const top = edge.y - edge.height / 2;
    graphics.fillStyle(COLORS.greenery, 0.85).fillRect(
      left,
      top,
      edge.width,
      edge.height,
    );
    // A perimeter stroke makes this read as a world boundary highlight. Do not
    // connect opposing corners: wide/tall edge rectangles turn that into a
    // map-spanning diagonal streak.
    graphics.lineStyle(3, COLORS.greeneryLight, 0.72).strokeRect(
      left,
      top,
      edge.width,
      edge.height,
    );
  }
}

export function drawHarborPath(scene: Phaser.Scene, path: WorldPath, isForecourt = false): void {
  const left = path.x - path.width / 2;
  const top = path.y - path.height / 2;
  const graphics = scene.add.graphics().setDepth(WORLD_DEPTH.GROUND_DETAIL + 1);
  const fill = isForecourt ? COLORS.plazaStone : COLORS.path;
  graphics.fillStyle(fill).fillRect(left, top, path.width, path.height);
  graphics.lineStyle(3, COLORS.pathEdge, 0.82).strokeRect(left, top, path.width, path.height);
  graphics.fillStyle(COLORS.stone, isForecourt ? 0.22 : 0.14).fillRect(left + 5, top + 5, path.width - 10, path.height - 10);
  graphics.lineStyle(1, COLORS.stoneShade, 0.38);
  const stride = 32;
  if (path.width > path.height) {
    for (let x = left + stride; x < left + path.width - 10; x += stride) {
      const inset = ((x - left) / stride) % 2 === 0 ? 8 : 16;
      graphics.lineBetween(x, top + 6 + inset, x, top + path.height - 6);
    }
    graphics.lineStyle(1, COLORS.pathEdge, 0.38).lineBetween(left + 6, path.y, left + path.width - 6, path.y);
  } else {
    for (let y = top + stride; y < top + path.height - 10; y += stride) {
      const inset = ((y - top) / stride) % 2 === 0 ? 8 : 16;
      graphics.lineBetween(left + 6, y, left + path.width - 6 - inset, y);
    }
    graphics.lineStyle(1, COLORS.pathEdge, 0.38).lineBetween(path.x, top + 6, path.x, top + path.height - 6);
  }
}

export function drawHarborPlaza(scene: Phaser.Scene, plaza: WorldZone): void {
  const left = plaza.x - plaza.width / 2;
  const top = plaza.y - plaza.height / 2;
  const graphics = scene.add.graphics().setDepth(WORLD_DEPTH.GROUND_DETAIL + 2);
  graphics.fillStyle(COLORS.stone).fillRect(left, top, plaza.width, plaza.height);
  graphics.fillStyle(COLORS.plazaStone, 0.46).fillRect(left + 12, top + 12, plaza.width - 24, plaza.height - 24);
  graphics.lineStyle(4, COLORS.stoneShade).strokeRect(left, top, plaza.width, plaza.height);
  graphics.lineStyle(2, COLORS.rope, 0.7).strokeRect(left + 10, top + 10, plaza.width - 20, plaza.height - 20);
  graphics.lineStyle(1, COLORS.stoneShade, 0.56);
  for (let x = left + LOGICAL_UNIT; x < left + plaza.width; x += LOGICAL_UNIT) {
    const offset = Math.floor((x - left) / LOGICAL_UNIT) % 2 === 0 ? 0 : LOGICAL_UNIT / 2;
    graphics.lineBetween(x, top, x, top + plaza.height);
    graphics.lineBetween(x - LOGICAL_UNIT / 2, top + LOGICAL_UNIT, x + LOGICAL_UNIT / 2, top + LOGICAL_UNIT);
    graphics.lineBetween(x - LOGICAL_UNIT / 2 + offset, top + plaza.height - LOGICAL_UNIT, x + LOGICAL_UNIT / 2 + offset, top + plaza.height - LOGICAL_UNIT);
  }
  for (let y = top + LOGICAL_UNIT; y < top + plaza.height; y += LOGICAL_UNIT) {
    graphics.lineBetween(left, y, left + plaza.width, y);
  }
  graphics.fillStyle(COLORS.stoneShade, 0.18);
  for (const [x, y, width] of [[left + 38, top + 92, 18], [left + 268, top + 56, 26], [left + 330, top + 214, 20], [left + 72, top + 232, 30]] as const) {
    graphics.fillRoundedRect(x, y, width, 4, 2);
  }
  graphics.lineStyle(2, COLORS.shipTrim, 0.75).strokeCircle(plaza.x, plaza.y, 54);
  graphics.lineStyle(1, COLORS.ink, 0.55).strokeCircle(plaza.x, plaza.y, 42);
  scene.add
    .text(plaza.x, top + 18, plaza.label, {
      color: COLORS.label,
      fontFamily: "monospace",
      fontSize: "16px",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(getWorldLabelDepth(plaza.id));
}

/** Four role-specific silhouettes preserve the existing building collision footprints. */
export function drawHarborBuilding(scene: Phaser.Scene, building: BuildingFootprint): void {
  const graphics = scene.add.graphics().setDepth(getBuildingDepth(building));
  const left = building.x - building.width / 2;
  const top = building.y - building.height / 2;
  const bottom = top + building.height;
  let fill: number = COLORS.guild;

  switch (building.id) {
    case "career":
      fill = COLORS.guild;
      graphics.fillStyle(fill).fillRect(left, top + 24, building.width, building.height - 24);
      graphics.fillStyle(COLORS.woodDark).fillTriangle(left + 12, top + 24, building.x, top, left + building.width - 12, top + 24);
      graphics.fillStyle(COLORS.shipTrim).fillCircle(building.x, top + 44, 12);
      graphics.lineStyle(2, COLORS.rope).lineBetween(left + 20, top + 34, left + building.width - 20, top + 34);
      graphics.lineStyle(3, COLORS.woodDark).strokeRect(left + 26, top + 58, 44, 34);
      graphics.lineStyle(2, COLORS.paper).lineBetween(left + 34, top + 68, left + 62, top + 68);
      break;
    case "lecture":
      fill = COLORS.wall;
      graphics.fillStyle(fill).fillRect(left + 20, top + 24, building.width - 40, building.height - 24);
      graphics.fillStyle(COLORS.roof).fillTriangle(left + 28, top + 26, building.x, top - 12, left + building.width - 28, top + 26);
      graphics.fillStyle(COLORS.roof).fillRect(building.x - 10, top - 26, 20, 38);
      graphics.fillStyle(COLORS.academyAccent).fillRect(left + 38, top + 48, 14, 40);
      graphics.fillStyle(COLORS.academyAccent).fillRect(left + building.width - 52, top + 48, 14, 40);
      graphics.lineStyle(2, COLORS.shipTrim).lineBetween(left + 28, top + 38, left + building.width - 28, top + 38);
      break;
    case "ai-lab":
      fill = COLORS.workshop;
      graphics.fillStyle(fill).fillRect(left, top + 24, building.width, building.height - 24);
      graphics.fillStyle(COLORS.woodDark).fillTriangle(left + 12, top + 24, building.x, top - 4, left + building.width - 12, top + 24);
      graphics.lineStyle(5, COLORS.woodDark).lineBetween(left + 36, top + 28, left + 36, bottom - 14);
      graphics.lineStyle(5, COLORS.woodDark).lineBetween(left + building.width - 36, top + 28, left + building.width - 36, bottom - 14);
      graphics.lineStyle(4, COLORS.shipTrim).lineBetween(left + 66, top + 38, left + 66, bottom - 18);
      graphics.lineStyle(4, COLORS.shipTrim).lineBetween(left + 66, top + 38, left + 112, top + 38);
      graphics.fillStyle(COLORS.shipTrim).fillCircle(left + 112, top + 46, 7);
      graphics.lineStyle(2, COLORS.rope).lineBetween(left + 16, bottom - 26, left + building.width - 16, bottom - 26);
      break;
    case "gallery":
      fill = COLORS.exhibition;
      graphics.fillStyle(fill).fillRect(left, top + 20, building.width, building.height - 20);
      graphics.fillStyle(COLORS.roof).fillRect(left + 16, top + 8, building.width - 32, 16);
      graphics.lineStyle(3, COLORS.stoneShade).strokeRect(left + 28, top + 42, 48, 42);
      graphics.lineStyle(3, COLORS.stoneShade).strokeRect(left + building.width - 76, top + 42, 48, 42);
      graphics.fillStyle(COLORS.ink).fillRect(building.x - 20, top + 52, 40, 56);
      graphics.lineStyle(2, COLORS.shipTrim).lineBetween(left + 24, top + 32, left + building.width - 24, top + 32);
      graphics.lineStyle(2, COLORS.waterHighlight).lineBetween(left + 34, top + 92, left + building.width - 34, top + 92);
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
    .setDepth(getWorldLabelDepth(building.id));
}

const exhaustiveBuilding = (value: never): never => {
  throw new Error(`Unrendered destination silhouette: ${String(value)}`);
};

/** Exhaustive visual dispatch makes new layout types fail loudly until rendered. */
export function drawHarborVisual(scene: Phaser.Scene, visual: HarborVisualPlacement): void {
  const graphics = scene.add.graphics().setDepth(getHarborVisualDepth(visual));
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;

  switch (visual.type) {
    case "navigation-monument":
      drawNavigationMonument(graphics, visual.x, visual.y);
      return;
    case "planter":
      graphics.fillStyle(COLORS.stoneShade).fillRect(left, top + 18, visual.width, visual.height - 18);
      graphics.lineStyle(2, COLORS.rope).lineBetween(left + 3, top + 20, left + visual.width - 3, top + 20);
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
      graphics.lineStyle(2, COLORS.shipTrim, 0.75).lineBetween(visual.x - 6, top + 18, visual.x + 6, top + 18);
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
    case "secondary-sailing-ship":
      // Rendered by the explicit asset layer after all geometry; keep the programmatic
      // boat as a fallback only when its texture is unavailable.
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
    case "large-ship":
      drawLargeShip(graphics, visual);
      return;
    case "warehouse":
      drawWarehouse(graphics, visual);
      return;
    case "cargo-shed":
      drawCargoShed(graphics, visual);
      return;
    case "warehouse-annex":
    case "service-hut":
      drawCargoShed(graphics, visual);
      return;
    case "rope-coil":
      graphics.lineStyle(3, COLORS.rope).strokeEllipse(visual.x, visual.y, visual.width, visual.height * 0.7);
      graphics.lineStyle(2, COLORS.rope).strokeEllipse(visual.x, visual.y, visual.width * 0.62, visual.height * 0.42);
      return;
    case "safety-rail":
      graphics.lineStyle(4, COLORS.woodDark).lineBetween(left, visual.y, left + visual.width, visual.y);
      graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + 6, visual.y, left + 6, top + visual.height);
      graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + visual.width - 6, visual.y, left + visual.width - 6, top + visual.height);
      return;
    case "mooring-bollard":
      graphics.fillStyle(COLORS.shipTrim).fillEllipse(visual.x, visual.y, visual.width, visual.height);
      return;
    case "service-marker":
      graphics.lineStyle(4, COLORS.woodDark).lineBetween(visual.x, top, visual.x, top + visual.height);
      graphics.fillStyle(COLORS.lamp).fillCircle(visual.x, top + 7, 7);
      return;
    case "buoy":
      graphics.fillStyle(COLORS.lamp).fillCircle(visual.x, visual.y, Math.min(visual.width, visual.height) / 3);
      return;
    case "gangplank":
      graphics.fillStyle(COLORS.dockWood).fillRect(left, visual.y - 4, visual.width, 8);
      return;
    default:
      return exhaustiveVisual(visual.type);
  }
}

function drawNavigationMonument(graphics: Phaser.GameObjects.Graphics, x: number, y: number): void {
  graphics.fillStyle(COLORS.stoneShade).fillRect(x - 18, y + 16, 36, 20);
  graphics.lineStyle(5, COLORS.shipTrim).strokeCircle(x, y, 28);
  graphics.lineStyle(3, COLORS.ink).strokeCircle(x, y, 17);
  graphics.lineStyle(3, COLORS.shipTrim).lineBetween(x - 34, y, x + 34, y);
  graphics.lineStyle(3, COLORS.shipTrim).lineBetween(x, y - 34, x, y + 34);
  graphics.lineStyle(2, COLORS.rope).strokeEllipse(x, y, 50, 20);
  graphics.fillStyle(COLORS.shipTrim).fillTriangle(x, y - 22, x - 6, y - 4, x + 6, y - 4);
}

/**
 * Fixed, visual-only paving wear and shoulder details soften the original
 * cross-axis composition. They never participate in collision or routing.
 */
export function drawHarborNaturalizedGroundDetails(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics().setDepth(WORLD_DEPTH.GROUND_DETAIL + 3);

  graphics.fillStyle(COLORS.plazaStone, 0.58);
  graphics.fillTriangle(800, 522, 840, 522, 816, 548);
  graphics.fillTriangle(1204, 748, 1248, 748, 1230, 722);
  graphics.fillTriangle(984, 424, 1008, 400, 1016, 432);
  graphics.fillTriangle(1056, 688, 1080, 712, 1052, 720);

  graphics.fillStyle(COLORS.stoneShade, 0.3);
  graphics.fillRect(760, 530, 72, 8);
  graphics.fillRect(1216, 742, 64, 8);
  graphics.fillRect(986, 304, 10, 76);
  graphics.fillRect(1052, 758, 10, 78);

  graphics.lineStyle(2, COLORS.pathEdge, 0.7);
  graphics.lineBetween(816, 522, 856, 546);
  graphics.lineBetween(1192, 746, 1230, 722);
  graphics.lineBetween(998, 316, 1018, 342);
  graphics.lineBetween(1050, 814, 1074, 840);
}

function drawWater(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  graphics.fillStyle(COLORS.waterDeep).fillRect(left, top, visual.width, visual.height);
  graphics.fillStyle(COLORS.water).fillRect(left + 3, top + 10, visual.width - 6, visual.height - 13);
  graphics.fillStyle(COLORS.waterShallow, 0.64).fillRect(left + 2, top + 3, visual.width - 4, 16);
  graphics.fillStyle(COLORS.waterHighlight, 0.14).fillRect(left + 5, top + 22, visual.width - 10, Math.max(12, visual.height * 0.22));
  graphics.lineStyle(2, COLORS.waterFoam, 0.86).lineBetween(left + 4, top + 8, left + visual.width - 4, top + 8);
  graphics.lineStyle(2, COLORS.waterDeep, 0.7).strokeRect(left + 2, top + 2, visual.width - 4, visual.height - 4);

  // Offset curves and broken highlights avoid a visibly tiled wave stamp.
  const rows = Math.max(1, Math.floor((visual.height - 20) / 30));
  for (let row = 0; row < rows; row += 1) {
    const y = top + 28 + row * 30;
    const offset = ((row * 37) + Math.round(left / 7)) % 94;
    graphics.lineStyle(2, row % 2 === 0 ? COLORS.waterHighlight : COLORS.waterShallow, row % 2 === 0 ? 0.58 : 0.48);
    for (let x = left + 14 + offset; x < left + visual.width - 18; x += 118) {
      const end = Math.min(x + 34 + ((row + Math.floor(x / 118)) % 3) * 8, left + visual.width - 9);
      graphics.beginPath();
      graphics.moveTo(x, y);
      graphics.lineTo(x + 8, y - 2);
      graphics.lineTo(end - 7, y - 1);
      graphics.lineTo(end, y - 3);
      graphics.strokePath();
    }
  }
  graphics.fillStyle(COLORS.waterFoam, 0.52);
  for (let x = left + 22 + (Math.round(left) % 29); x < left + visual.width - 12; x += 96) {
    graphics.fillRect(x, top + 15, 12, 2);
  }
}

function drawDock(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  graphics.fillStyle(COLORS.dockWoodDark).fillRect(left, top, visual.width, visual.height);
  graphics.fillStyle(COLORS.dockWood).fillRect(left + 5, top + 5, visual.width - 10, visual.height - 10);
  graphics.lineStyle(3, COLORS.dockWoodDark).strokeRect(left, top, visual.width, visual.height);
  graphics.lineStyle(2, COLORS.rope, 0.6).lineBetween(left + 5, top + 6, left + visual.width - 5, top + 6);
  graphics.lineStyle(2, COLORS.dockWoodDark);
  const plankWidth = visual.width < 224 ? 24 : 32;
  for (let x = left + plankWidth; x < left + visual.width - 4; x += plankWidth) {
    graphics.lineBetween(x, top + 5, x, top + visual.height - 5);
  }
  const postY = top + Math.min(12, Math.max(8, visual.height / 2));
  const posts = getDockPostOffsets(visual.width).map((offset) => left + visual.width * offset);
  for (const x of posts) {
    graphics.fillStyle(COLORS.dockWoodDark).fillRect(x - 4, postY - 7, 8, 14);
    graphics.lineStyle(2, COLORS.shipTrim, 0.85).strokeCircle(x, postY, 5);
  }
  graphics.lineStyle(2, COLORS.rope, 0.9);
  for (let index = 0; index < posts.length - 1; index += 1) {
    graphics.lineBetween(posts[index], postY, posts[index + 1], postY);
  }
}

function drawBoat(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  const hullY = top + visual.height * 0.58;
  const mastX = left + visual.width * 0.44;
  graphics.fillStyle(COLORS.shipHull).fillTriangle(left, hullY, left + visual.width, hullY, left + visual.width * 0.72, top + visual.height - 3);
  graphics.lineStyle(2, COLORS.shipTrim).lineBetween(left + visual.width * 0.18, hullY + 3, left + visual.width * 0.76, hullY + 3);
  graphics.lineStyle(3, COLORS.ink).lineBetween(mastX, top + 4, mastX, hullY + 4);
  if (visual.width >= 88) {
    graphics.fillStyle(COLORS.sail).fillTriangle(mastX + 3, top + 7, mastX + 3, hullY - 2, left + visual.width * 0.8, hullY - 2);
  } else {
    graphics.fillStyle(COLORS.rope).fillRect(left + visual.width * 0.2, hullY - 7, visual.width * 0.32, 5);
  }
}

function drawLargeShip(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = visual.x - visual.width / 2;
  const top = visual.y - visual.height / 2;
  const hullTop = top + visual.height * 0.48;
  const hullBottom = top + visual.height * 0.82;
  const mastX = left + visual.width * 0.42;
  const rearMastX = left + visual.width * 0.62;
  graphics.fillStyle(COLORS.shipHull).fillTriangle(
    left,
    hullTop,
    left + visual.width,
    hullTop,
    left + visual.width * 0.78,
    hullBottom,
  );
  graphics.fillStyle(COLORS.dockWood).fillRect(left + visual.width * 0.16, hullTop - 12, visual.width * 0.56, 14);
  graphics.lineStyle(3, COLORS.shipTrim).lineBetween(left + visual.width * 0.18, hullTop + 8, left + visual.width * 0.75, hullTop + 8);
  graphics.fillStyle(COLORS.dockWoodDark).fillRect(left + visual.width * 0.12, hullTop - 20, visual.width * 0.12, 10);
  graphics.lineStyle(4, COLORS.ink).lineBetween(mastX, top + visual.height * 0.1, mastX, hullTop + 4);
  graphics.lineStyle(3, COLORS.ink).lineBetween(rearMastX, top + visual.height * 0.24, rearMastX, hullTop + 4);
  graphics.lineStyle(2, COLORS.rope, 0.85).lineBetween(left + visual.width * 0.08, hullTop - 2, mastX, top + visual.height * 0.1);
  graphics.lineStyle(2, COLORS.rope, 0.85).lineBetween(mastX, top + visual.height * 0.1, left + visual.width * 0.88, hullTop - 2);
  graphics.fillStyle(COLORS.sail).fillTriangle(
    mastX + 4,
    top + visual.height * 0.14,
    mastX + 4,
    hullTop - 2,
    left + visual.width * 0.78,
    hullTop - 2,
  );
  graphics.fillStyle(COLORS.sail).fillTriangle(rearMastX + 3, top + visual.height * 0.28, rearMastX + 3, hullTop - 2, left + visual.width * 0.83, hullTop - 2);
  graphics.fillStyle(COLORS.shipTrim).fillCircle(left + visual.width * 0.3, hullTop + 5, 4);
  graphics.fillStyle(COLORS.shipTrim).fillCircle(left + visual.width * 0.48, hullTop + 5, 4);
  graphics.fillStyle(COLORS.shipTrim).fillCircle(left + visual.width * 0.64, hullTop + 5, 4);
  graphics.lineStyle(3, COLORS.ink, 0.65).lineBetween(left + visual.width * 0.06, hullTop, left + visual.width * 0.78, hullBottom);
}
