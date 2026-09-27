import Phaser from "phaser";
import { PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "../config";

type Projection = "low" | "mid" | "high";
type QaState = "entry" | "overview" | "hero" | "native" | "scale" | "route" | "occlusion" | "hotspot" | "square" | "gallery" | "career";
type MovementKeys = Record<"up" | "down" | "left" | "right" | "w" | "a" | "s" | "d" | "interact", Phaser.Input.Keyboard.Key>;

const DEPTH = {
  terrain: 0,
  shoreline: 10,
  lowerEnvironment: 20,
  structures: 30,
  player: 40,
  upperStructures: 50,
  playerShadowBehindForeground: 55,
  playerBehindForeground: 60,
  foreground: 70,
  playerShadowInForeground: 75,
  playerInForeground: 80,
  labels: 90,
  interface: 100,
} as const;

const COLORS = {
  land: 0x526c58,
  landLight: 0x6f8768,
  path: 0xb59a6b,
  paving: 0xd4bf8c,
  water: 0x2c7180,
  waterDeep: 0x1d5668,
  shoreline: 0x92b9a8,
  dock: 0x805f43,
  dockEdge: 0xc7955e,
  stone: 0x6d7071,
  roof: 0xbc684b,
  facade: 0xe0b879,
  dark: 0x25333b,
  sail: 0xf3dfaf,
  hull: 0x563b32,
  accent: 0xe8ca78,
  ink: 0x18303a,
} as const;

type Point = readonly [number, number];

type HotspotId = "square" | "gallery" | "career";

interface PortfolioHotspot {
  id: HotspotId;
  position: Point;
  radius: number;
  title: string;
  description: string;
  actionLabel: string;
  destination: string;
}

/**
 * R2D route geometry. Branch origins are spine vertices, so a branch can only leave where the spine
 * actually is. Sequence along the spine: working dock -> Guild branch (bend) -> Harbor Square
 * (widening) -> Academy branch (far later, before the hall) -> Exhibition Hall -> Hero Quay.
 */
const SPINE: readonly Point[] = [[345, 1080], [560, 835], [695, 640], [1085, 656], [1420, 760], [1600, 890]];
const GUILD_BRANCH: readonly Point[] = [[560, 835], [430, 680], [445, 470]];
const ACADEMY_BRANCH: readonly Point[] = [[1085, 656], [1130, 440], [1465, 245]];
const SQUARE = { x: 580, y: 490, width: 230, height: 190 } as const;
const SPAWN: Point = [755, 520];

/** Placeholder door: ~1.26x the 54px player, fixed regardless of projection (a door does not stretch with the facade). */
const PLAYER_HEIGHT = 54;
const DOOR = { width: 38, height: 68 } as const;
const HALL = { x: 1400, baseY: 830 } as const;
// R4.2 coordinates are measured from visible ground in the locked 1024² plate, then mapped through
// the plate's 1.5625x scale and x=500 offset: plaza (163,333), Hall stair landing (131,262), quay (570,470).
const EXHIBITION_HOTSPOT = { x: 705, y: 410, radius: 62 } as const;
const HERO_QUAY_GROUND: Point = [1390, 735];
const PORTFOLIO_HOTSPOTS: readonly PortfolioHotspot[] = [
  {
    id: "square",
    position: [755, 520],
    radius: 66,
    title: "포트폴리오 안내",
    description: "AX 전문강사 김현래의 소개와 프로젝트를 둘러볼 수 있습니다.",
    actionLabel: "소개 보기",
    destination: "../#about",
  },
  {
    id: "gallery",
    position: [EXHIBITION_HOTSPOT.x, EXHIBITION_HOTSPOT.y],
    radius: EXHIBITION_HOTSPOT.radius,
    title: "AI·AX 개념 갤러리",
    description: "AI, AX, IT의 어려운 개념을 그림과 쉬운 설명으로 정리한 교육 콘텐츠입니다.",
    actionLabel: "갤러리 열어보기",
    destination: "../gallery.html",
  },
  {
    id: "career",
    position: HERO_QUAY_GROUND,
    radius: 72,
    title: "커리어",
    description: "만드는 사람에서 지키고, 운영하고, 가르치는 사람으로 이어진 커리어를 소개합니다.",
    actionLabel: "커리어 열어보기",
    destination: "../career.html",
  },
];
const GOLDEN_SPINE: readonly Point[] = [[755, 520], [810, 525], [825, 540], HERO_QUAY_GROUND];
const GOLDEN_HALL_BRANCH: readonly Point[] = [[755, 520], [720, 455], [EXHIBITION_HOTSPOT.x, EXHIBITION_HOTSPOT.y]];
const GOLDEN_PLATE_BOUNDS = { x: 500, y: 0, width: 1600, height: 1600 } as const;
const GOLDEN_FOREGROUND_Y = 590;
const SOLID_FOOTPRINTS = [
  { x: 1262, y: 548, width: 278, height: 280 },
  { x: 880, y: 840, width: 250, height: 148 },
  { x: 1115, y: 912, width: 250, height: 132 },
  { x: 1840, y: 900, width: 350, height: 280 },
] as const;

interface ProjectionProfile {
  /** Exhibition Hall front-wall height; LOW favours the facade. */
  facade: number;
  /** Roof height above the eave; a taller roof is a larger visible top plane. */
  roofRise: number;
  /** 0 = front gable triangle; >0 = flat-topped hip roof (top plane read). */
  roofFlatten: number;
  /** Hero Ship: hull below the gunwale, topsides above it, and visible deck plane. */
  hullDepth: number;
  topsides: number;
  deck: number;
  mastScale: number;
  /** Medium Vessel / Small Boat use the same grammar at lower amplitude. */
  mediumHull: number;
  mediumDeck: number;
  smallHull: number;
  smallDeck: number;
  /** Hero Quay front-face thickness; 0 means only the top plane shows. */
  quaySide: number;
}

const PROJECTION_PROFILE: Record<Projection, ProjectionProfile> = {
  low: { facade: 252, roofRise: 28, roofFlatten: 0, hullDepth: 114, topsides: 76, deck: 4, mastScale: 1.1, mediumHull: 60, mediumDeck: 2, smallHull: 36, smallDeck: 0, quaySide: 46 },
  mid: { facade: 186, roofRise: 84, roofFlatten: 0, hullDepth: 64, topsides: 50, deck: 28, mastScale: 1, mediumHull: 36, mediumDeck: 12, smallHull: 24, smallDeck: 8, quaySide: 14 },
  high: { facade: 130, roofRise: 140, roofFlatten: 0.62, hullDepth: 34, topsides: 16, deck: 82, mastScale: 0.8, mediumHull: 20, mediumDeck: 34, smallHull: 12, smallDeck: 20, quaySide: 0 },
};

const QA_VIEWS: Record<QaState, { player: Phaser.Math.Vector2; camera: Phaser.Math.Vector2; zoom: number }> = {
  // Entry framing preserves the Square spawn but offsets the visitor view toward the waterfront/Quay.
  entry: { player: new Phaser.Math.Vector2(755, 520), camera: new Phaser.Math.Vector2(1200, 700), zoom: 0.84 },
  overview: { player: new Phaser.Math.Vector2(755, 520), camera: new Phaser.Math.Vector2(1300, 800), zoom: 0.8 },
  hero: { player: new Phaser.Math.Vector2(...HERO_QUAY_GROUND), camera: new Phaser.Math.Vector2(1380, 760), zoom: 0.9 },
  native: { player: new Phaser.Math.Vector2(...HERO_QUAY_GROUND), camera: new Phaser.Math.Vector2(1380, 760), zoom: 1.2 },
  // Hall entry is the lower stair landing, not the facade/wall pixels above it.
  scale: { player: new Phaser.Math.Vector2(EXHIBITION_HOTSPOT.x, EXHIBITION_HOTSPOT.y), camera: new Phaser.Math.Vector2(760, 400), zoom: 0.98 },
  route: { player: new Phaser.Math.Vector2(825, 540), camera: new Phaser.Math.Vector2(970, 580), zoom: 0.88 },
  occlusion: { player: new Phaser.Math.Vector2(835, 570), camera: new Phaser.Math.Vector2(855, 570), zoom: 1.02 },
  hotspot: { player: new Phaser.Math.Vector2(EXHIBITION_HOTSPOT.x, EXHIBITION_HOTSPOT.y), camera: new Phaser.Math.Vector2(760, 400), zoom: 0.9 },
  square: { player: new Phaser.Math.Vector2(755, 520), camera: new Phaser.Math.Vector2(970, 580), zoom: 0.88 },
  gallery: { player: new Phaser.Math.Vector2(EXHIBITION_HOTSPOT.x, EXHIBITION_HOTSPOT.y), camera: new Phaser.Math.Vector2(760, 400), zoom: 0.9 },
  career: { player: new Phaser.Math.Vector2(...HERO_QUAY_GROUND), camera: new Phaser.Math.Vector2(1380, 760), zoom: 0.9 },
};

function distanceToSegment(px: number, py: number, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Phaser.Math.Clamp(((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
}

function nearRoute(x: number, y: number, route: readonly Point[], halfWidth: number): boolean {
  for (let index = 0; index < route.length - 1; index += 1) {
    if (distanceToSegment(x, y, route[index], route[index + 1]) <= halfWidth) return true;
  }
  return false;
}

function pickProjection(value: string | null): Projection {
  return value === "low" || value === "high" ? value : "mid";
}

function pickQaState(value: string | null): QaState | undefined {
  return value === "entry" || value === "overview" || value === "hero" || value === "native" || value === "scale" || value === "route" || value === "occlusion" || value === "hotspot" || value === "square" || value === "gallery" || value === "career" ? value : undefined;
}

/** Candidate A+ flat-shape blockout. Water is one calm basin; the built settlement stays deliberately asymmetric. */
export class WorldScene extends Phaser.Scene {
  private readonly usesGoldenMasterPlate = true;
  private debugMode = false;
  private projection: Projection = "mid";
  private qaState: QaState | "normal" = "normal";
  private player = new Phaser.Math.Vector2(SPAWN[0], SPAWN[1]);
  private playerShadow?: Phaser.GameObjects.Graphics;
  private playerVisual?: Phaser.GameObjects.Image;
  private movementKeys?: MovementKeys;
  private entryFraming = false;
  private touchIntent = new Phaser.Math.Vector2();
  private interactionPrompt?: Phaser.GameObjects.Container;
  private interactionPanel?: Phaser.GameObjects.Container;
  private interactionPromptText?: Phaser.GameObjects.Text;
  private panelTitle?: Phaser.GameObjects.Text;
  private panelCopy?: Phaser.GameObjects.Text;
  private panelAction?: Phaser.GameObjects.Text;
  private activeHotspot?: PortfolioHotspot;
  private nearbyHotspot?: PortfolioHotspot;

  public constructor() {
    super("WorldScene");
  }

  public create(): void {
    const query = new URLSearchParams(window.location.search);
    this.projection = pickProjection(query.get("projection"));
    const requestedQa = pickQaState(query.get("qa"));
    this.qaState = requestedQa ?? "normal";
    this.debugMode = query.get("pwDebug") === "1";

    if (this.usesGoldenMasterPlate) {
      this.drawGoldenMasterPlate();
    } else {
      this.drawTerrain();
      this.drawSpineAndCrescent();
      this.drawSettlement();
      this.drawWaterfrontBuildings();
      this.drawFleetAndQuay();
      this.drawHarborDressing();
    }
    this.drawForegroundOccluders();
    if (this.debugMode) {
      this.drawDebugGuides();
      this.drawLabels();
    }
    this.createPlayer();
    this.configureCamera(requestedQa);
    this.installInput();
    this.createInteractionUi();
    const qaHotspot = requestedQa ? this.qaHotspotId(requestedQa) : undefined;
    if (qaHotspot) this.activateHotspot(this.getHotspot(qaHotspot));
    this.updateInteractionPrompt();
    this.publishQaState();
  }

  public update(_time: number, delta: number): void {
    if (this.qaState !== "normal") return;
    this.updateInteractionPrompt();
    if (this.activeHotspot) return;
    let dx = 0;
    let dy = 0;
    if (this.movementKeys) {
      if (this.movementKeys.left.isDown || this.movementKeys.a.isDown) dx -= 1;
      if (this.movementKeys.right.isDown || this.movementKeys.d.isDown) dx += 1;
      if (this.movementKeys.up.isDown || this.movementKeys.w.isDown) dy -= 1;
      if (this.movementKeys.down.isDown || this.movementKeys.s.isDown) dy += 1;
    }
    if (dx === 0 && dy === 0 && this.touchIntent.lengthSq() > 0) {
      dx = this.touchIntent.x;
      dy = this.touchIntent.y;
    }
    if (dx === 0 && dy === 0) return;
    if (this.entryFraming) {
      // Start navigation from the harbor-first vista without stranding the camera when movement begins.
      this.cameras.main.startFollow(this.playerVisual!, true, 0.06, 0.06);
      this.entryFraming = false;
    }
    const magnitude = Math.hypot(dx, dy);
    const next = new Phaser.Math.Vector2(
      Phaser.Math.Clamp(this.player.x + (dx / magnitude) * PLAYER_SPEED * (delta / 1000), 56, WORLD_WIDTH - 56),
      Phaser.Math.Clamp(this.player.y + (dy / magnitude) * PLAYER_SPEED * (delta / 1000), 56, WORLD_HEIGHT - 56),
    );
    if (this.isWalkable(next.x, next.y)) {
      this.player.copy(next);
      this.updatePlayerVisual();
      this.publishQaState();
    }
  }

  private drawTerrain(): void {
    const ground = this.add.graphics().setDepth(DEPTH.terrain);
    ground.fillStyle(COLORS.land, 1).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    ground.fillStyle(COLORS.landLight, 0.8).fillEllipse(950, 355, 1640, 620);
    ground.fillStyle(0x415b4c, 0.55).fillEllipse(2270, 420, 480, 730);

    const water = this.add.graphics().setDepth(DEPTH.terrain + 1);
    // One broad, sheltered crescent basin: calm fill first, not a thin waterfront strip.
    water.fillStyle(COLORS.water, 1).fillEllipse(1450, 1160, 2380, 1080);
    water.fillStyle(COLORS.waterDeep, 0.62).fillEllipse(1500, 1250, 2020, 790);
    water.lineStyle(18, COLORS.shoreline, 0.8).strokeEllipse(1450, 1160, 2380, 1080);
    water.lineStyle(5, 0x7eb1b0, 0.24);
    for (let index = 0; index < 9; index += 1) {
      water.strokeEllipse(1060 + index * 120, 1070 + index * 46, 340 - index * 14, 58 - index * 4);
    }
  }

  private drawSpineAndCrescent(): void {
    const lower = this.add.graphics().setDepth(DEPTH.lowerEnvironment);
    const stroke = (route: readonly Point[], width: number, color: number): void => {
      lower.lineStyle(width, color, 1).beginPath().moveTo(route[0][0], route[0][1]);
      for (const [x, y] of route.slice(1)) lower.lineTo(x, y);
      lower.strokePath();
    };
    // One bent shoreline spine: working dock -> Square -> Exhibition -> Hero Quay.
    // Two inland branches that leave the spine at separate, widely spaced vertices: Guild is a short stub at the
    // first bend, Academy leaves only after the Square and runs a long way to its own forecourt.
    // All edges are drawn before any paving so a branch merges into the spine without an edge line across it.
    const routes: Array<[readonly Point[], number, number]> = [[SPINE, 138, 112], [GUILD_BRANCH, 82, 62], [ACADEMY_BRANCH, 86, 65]];
    for (const [route, edge] of routes) stroke(route, edge, COLORS.path);
    for (const [route, , paving] of routes) stroke(route, paving, COLORS.paving);

    // Square is a widening the spine passes through, not a point roads converge on.
    lower.fillStyle(COLORS.paving, 1).fillRoundedRect(SQUARE.x, SQUARE.y, SQUARE.width, SQUARE.height, 34);
    lower.lineStyle(5, COLORS.path, 1).strokeRoundedRect(SQUARE.x, SQUARE.y, SQUARE.width, SQUARE.height, 34);
    lower.lineStyle(2, 0x9a805b, 0.48);
    for (let x = SQUARE.x + 25; x < SQUARE.x + SQUARE.width - 20; x += 44) lower.strokeLineShape(new Phaser.Geom.Line(x, SQUARE.y + 24, x, SQUARE.y + SQUARE.height - 34));
  }

  private drawSettlement(): void {
    const structures = this.add.graphics().setDepth(DEPTH.structures);
    const upper = this.add.graphics().setDepth(DEPTH.upperStructures);

    // Calibration-only forecourt paving, drawn first so the hall stands on it: the door, bench and lamp share one ground line.
    structures.fillStyle(0xc7aa74, 1).fillRoundedRect(1285, HALL.baseY - 26, 310, 140, 16);
    structures.lineStyle(3, 0x9f835a, 0.75).strokeRoundedRect(1285, HALL.baseY - 26, 310, 140, 16);

    this.drawExhibitionHall(structures, upper, HALL.x, HALL.baseY);
    this.drawSecondaryMarker(structures, upper, 445, 420, "Guild Hall", 84, 44);
    this.drawSecondaryMarker(structures, upper, 1500, 195, "Academy", 106, 50);
    this.drawSecondaryMarker(structures, upper, 285, 1050, "Workshop", 96, 44);

    // Bench and lamp placeholders on the forecourt, beside the door and the player reference.
    structures.fillStyle(0x805f43, 1).fillRect(1310, 868, 62, 13).fillRect(1318, 853, 11, 18).fillRect(1353, 853, 11, 18);
    structures.fillStyle(0x31444a, 1).fillRect(1556, 796, 9, 92);
    upper.fillStyle(COLORS.accent, 1).fillCircle(1560, 790, 15).lineStyle(4, 0xf3dfaf, 0.7).strokeCircle(1560, 790, 15);
  }

  /**
   * The approved Golden Master is a scene plate, not a collision or gameplay layer.
   * Navigation, player depth, occlusion, input and hotspot state remain authored by this scene.
   */
  private drawGoldenMasterPlate(): void {
    this.add.image(1300, 800, "golden-master-r4")
      .setDisplaySize(1600, 1600)
      .setDepth(DEPTH.terrain);
  }

  /** Calibration geometry is intentionally opt-in via `?pwDebug=1`, never visitor-facing. */
  private drawDebugGuides(): void {
    const route = this.add.graphics().setDepth(DEPTH.shoreline);
    route.lineStyle(5, 0xf4e5bf, 0.34).beginPath().moveTo(GOLDEN_SPINE[0][0], GOLDEN_SPINE[0][1]);
    for (const [x, y] of GOLDEN_SPINE.slice(1)) route.lineTo(x, y);
    route.strokePath();
    route.lineStyle(4, 0xf4e5bf, 0.3).beginPath().moveTo(GOLDEN_HALL_BRANCH[0][0], GOLDEN_HALL_BRANCH[0][1]);
    for (const [x, y] of GOLDEN_HALL_BRANCH.slice(1)) route.lineTo(x, y);
    route.strokePath();
  }

  /** Authored Graphics layers: warm-stone waterfront buildings and cargo structures, not a scene-image backdrop. */
  private drawWaterfrontBuildings(): void {
    const body = this.add.graphics().setDepth(DEPTH.structures + 1);
    const roof = this.add.graphics().setDepth(DEPTH.upperStructures + 1);
    const drawWarehouse = (x: number, y: number, width: number, height: number): void => {
      body.fillStyle(0xd9c39a, 1).fillRoundedRect(x, y, width, height, 8);
      body.fillStyle(0xb98f62, 1).fillRect(x, y + height - 32, width, 32);
      body.lineStyle(4, COLORS.dark, 0.55).strokeRoundedRect(x, y, width, height, 8);
      roof.fillStyle(COLORS.roof, 1).fillTriangle(x - 20, y + 2, x + width + 20, y + 2, x + width * 0.52, y - 62);
      roof.lineStyle(4, COLORS.dark, 0.55).strokeTriangle(x - 20, y + 2, x + width + 20, y + 2, x + width * 0.52, y - 62);
      for (let door = x + 28; door < x + width - 18; door += 54) {
        body.fillStyle(0x34515a, 1).fillRoundedRect(door, y + height - 66, 28, 42, 4);
      }
    };
    drawWarehouse(880, 840, 250, 148);
    drawWarehouse(1115, 912, 250, 132);

    // A compact crane and stacked cargo create a working-waterfront reading without becoming collision clutter.
    roof.lineStyle(9, 0x694d37, 1).strokeLineShape(new Phaser.Geom.Line(1165, 870, 1165, 760));
    roof.lineStyle(7, 0x694d37, 1).strokeLineShape(new Phaser.Geom.Line(1160, 775, 1270, 805));
    roof.lineStyle(3, 0x27353b, 0.8).strokeLineShape(new Phaser.Geom.Line(1265, 805, 1265, 878));
    roof.fillStyle(0xb78952, 1).fillRect(1248, 873, 34, 25).lineStyle(3, 0x684630, 0.9).strokeRect(1248, 873, 34, 25);
  }

  private drawHarborDressing(): void {
    const dressing = this.add.graphics().setDepth(DEPTH.upperStructures + 2);
    // Bollards/rope make the quay readable as berth space, while restrained cargo grounds its working use.
    for (let index = 0; index < 7; index += 1) {
      const x = 1535 + index * 67;
      const y = 858 + index * 41;
      dressing.fillStyle(0x263840, 1).fillCircle(x, y, 11).fillRect(x - 7, y, 14, 28);
      if (index < 6) dressing.lineStyle(3, 0xceb17e, 0.75).strokeLineShape(new Phaser.Geom.Line(x + 6, y + 10, x + 70, y + 48));
    }
    for (const [x, y] of [[1010, 1005], [1052, 1005], [1088, 1024], [1335, 1050]] as const) {
      dressing.fillStyle(0xa87545, 1).fillRect(x, y, 28, 25).lineStyle(3, 0x694530, 0.9).strokeRect(x, y, 28, 25);
      dressing.lineStyle(2, 0xe0bd7d, 0.8).strokeLineShape(new Phaser.Geom.Line(x, y, x + 28, y + 25));
    }
    // Lamps, low planters, and modest route signs establish player scale and wayfinding without UI labels.
    for (const [x, y] of [[742, 520], [1180, 650], [1508, 790], [1685, 975]] as const) {
      dressing.lineStyle(6, 0x27353b, 1).strokeLineShape(new Phaser.Geom.Line(x, y, x, y - 54));
      dressing.fillStyle(0xf0d792, 0.95).fillCircle(x, y - 60, 11).lineStyle(3, 0x27353b, 0.8).strokeCircle(x, y - 60, 11);
    }
    dressing.fillStyle(0x294b57, 1).fillRoundedRect(820, 610, 52, 82, 5);
    dressing.fillStyle(COLORS.accent, 1).fillCircle(846, 644, 17).lineStyle(3, 0xf4e5bf, 0.8).strokeCircle(846, 644, 17);
  }

  private drawForegroundOccluders(): void {
    if (this.usesGoldenMasterPlate) {
      // One transparent, painterly cargo cluster supplies a real foreground silhouette; its irregular
      // alpha edge and integrated contact shadow avoid the rectangular Graphics-mask artefact from R4.
      this.add.image(850, GOLDEN_FOREGROUND_Y, "harbor-cargo-occluder-r4-1")
        .setDisplaySize(92, 61)
        .setOrigin(0.5, 1)
        .setDepth(DEPTH.foreground);
      return;
    }
    const foreground = this.add.graphics().setDepth(DEPTH.foreground);
    // This planter/quay edge is a real depth test: a player north of it is covered, south of it draws in front.
    foreground.fillStyle(0x75634b, 1).fillRoundedRect(1475, 1050, 450, 64, 16);
    foreground.lineStyle(5, 0x3b4e45, 0.9).strokeRoundedRect(1475, 1050, 450, 64, 16);
    for (let x = 1510; x < 1900; x += 58) {
      foreground.fillStyle(0x315d4f, 1).fillCircle(x, 1045, 31).fillCircle(x + 18, 1030, 25);
      foreground.fillStyle(0x5e8d58, 0.9).fillCircle(x - 12, 1029, 19);
    }
  }

  private drawExhibitionHall(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, baseY: number): void {
    const profile = PROJECTION_PROFILE[this.projection];
    const top = baseY - profile.facade;
    body.fillStyle(COLORS.facade, 1).fillRoundedRect(x - 135, top, 270, profile.facade, 10);
    body.fillStyle(0xa65d47, 1).fillRect(x - 135, baseY - 48, 270, 48);
    body.lineStyle(5, COLORS.dark, 0.72).strokeRoundedRect(x - 135, top, 270, profile.facade, 10);
    body.fillStyle(0x35505a, 1).fillRect(x - 88, top + 24, 52, 34).fillRect(x + 35, top + 24, 52, 34);
    // Human-scale door on the ground line. Fixed size: only the facade/roof exchange changes between projections.
    body.fillStyle(COLORS.dark, 1).fillRect(x - DOOR.width / 2, baseY - DOOR.height, DOOR.width, DOOR.height);

    const rise = profile.roofRise;
    const inset = 162 * profile.roofFlatten;
    if (profile.roofFlatten === 0) {
      upper.fillStyle(COLORS.roof, 1).fillTriangle(x - 162, top, x + 162, top, x, top - rise);
      upper.fillStyle(0xe29a65, 1).fillTriangle(x - 122, top - 8, x + 122, top - 8, x, top - rise + 16);
      upper.lineStyle(5, COLORS.dark, 0.7).strokeTriangle(x - 162, top, x + 162, top, x, top - rise);
    } else {
      // Hip roof seen from higher up: a broad, light top plane with shingle courses.
      const plane = [
        new Phaser.Math.Vector2(x - 168, top),
        new Phaser.Math.Vector2(x + 168, top),
        new Phaser.Math.Vector2(x + 168 - inset, top - rise),
        new Phaser.Math.Vector2(x - 168 + inset, top - rise),
      ];
      upper.fillStyle(0xe29a65, 1).fillTriangle(plane[0].x, plane[0].y, plane[1].x, plane[1].y, plane[2].x, plane[2].y);
      upper.fillTriangle(plane[0].x, plane[0].y, plane[2].x, plane[2].y, plane[3].x, plane[3].y);
      upper.lineStyle(4, COLORS.roof, 0.85);
      for (let course = 1; course < 5; course += 1) {
        const t = course / 5;
        upper.strokeLineShape(new Phaser.Geom.Line(plane[0].x + (plane[3].x - plane[0].x) * t, top - rise * t, plane[1].x + (plane[2].x - plane[1].x) * t, top - rise * t));
      }
      upper.lineStyle(5, COLORS.dark, 0.7).strokePoints(plane, true);
      // Eave strip keeps the facade edge legible under the larger top plane.
      upper.fillStyle(COLORS.roof, 1).fillRect(x - 168, top - 6, 336, 12);
    }
  }

  private drawSecondaryMarker(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, _name: string, width: number, height: number): void {
    body.fillStyle(COLORS.stone, 0.92).fillRoundedRect(x - width, y - height, width * 2, height * 2, 9);
    body.lineStyle(4, COLORS.dark, 0.7).strokeRoundedRect(x - width, y - height, width * 2, height * 2, 9);
    upper.fillStyle(0x809680, 0.9).fillTriangle(x - width - 18, y - height, x + width + 18, y - height, x, y - height - 44);
  }

  private drawFleetAndQuay(): void {
    const profile = PROJECTION_PROFILE[this.projection];
    const lower = this.add.graphics().setDepth(DEPTH.lowerEnvironment + 1);
    const structures = this.add.graphics().setDepth(DEPTH.structures + 1);
    const upper = this.add.graphics().setDepth(DEPTH.upperStructures + 1);
    // Asymmetric Hero Quay tongue, connected to the waterfront end of the spine.
    const A = { x: 1510, y: 818 };
    const B = { x: 1790, y: 928 };
    const C = { x: 2050, y: 1140 };
    const D = { x: 1780, y: 1122 };
    if (profile.quaySide > 0) {
      // Visible front face along the basin-facing edge: the quay reads as a raised structure, not a flat decal.
      const s = profile.quaySide;
      lower.fillStyle(0x5c4331, 1);
      lower.fillTriangle(A.x, A.y, D.x, D.y, D.x, D.y + s).fillTriangle(A.x, A.y, D.x, D.y + s, A.x, A.y + s);
      lower.fillTriangle(D.x, D.y, C.x, C.y, C.x, C.y + s).fillTriangle(D.x, D.y, C.x, C.y + s, D.x, D.y + s);
      lower.lineStyle(3, 0x3b2a20, 0.9);
      for (let step = 0; step <= 6; step += 1) {
        const t = step / 6;
        lower.strokeLineShape(new Phaser.Geom.Line(A.x + (D.x - A.x) * t, A.y + (D.y - A.y) * t, A.x + (D.x - A.x) * t, A.y + (D.y - A.y) * t + s));
      }
    }
    lower.fillStyle(profile.quaySide === 0 ? 0x94704c : COLORS.dock, 1);
    lower.fillTriangle(A.x, A.y, B.x, B.y, C.x, C.y).fillTriangle(A.x, A.y, C.x, C.y, D.x, D.y);
    lower.lineStyle(8, COLORS.dockEdge, 1).strokeTriangle(A.x, A.y, B.x, B.y, C.x, C.y).strokeTriangle(A.x, A.y, C.x, C.y, D.x, D.y);
    const plankAlpha = profile.quaySide === 0 ? 1 : 0.7;
    for (let step = 0; step < 5; step += 1) {
      lower.lineStyle(profile.quaySide === 0 ? 6 : 4, 0xc79b62, plankAlpha).strokeLineShape(new Phaser.Geom.Line(1660 + step * 66, 925 + step * 43, 1608 + step * 66, 1010 + step * 43));
    }
    // Working dock is a separate, smaller harbor edge at the other end of the basin.
    lower.fillStyle(COLORS.dock, 1).fillRoundedRect(190, 1080, 410, 100, 12);
    lower.lineStyle(7, COLORS.dockEdge, 1).strokeRoundedRect(190, 1080, 410, 100, 12);
    if (profile.quaySide > 0) lower.fillStyle(0x5c4331, 1).fillRect(202, 1180, 386, Math.round(profile.quaySide * 0.6));

    this.drawHeroShipTarget(2010, 1180);
    this.drawHeroShipWaterlineContact(2010, 1180);
    this.drawMediumVessel(structures, upper, 1110, 1115, profile);
    this.drawSmallBoat(structures, 860, 1230, profile);
  }

  /** Deck plane: a light-wood quad above a gunwale line, `depth` px deep. */
  private drawDeckPlane(body: Phaser.GameObjects.Graphics, x: number, gunwaleY: number, halfWidth: number, depth: number, planks: boolean): void {
    if (depth <= 0) return;
    const back = halfWidth * 0.78;
    body.fillStyle(0xb98a58, 1);
    body.fillTriangle(x - halfWidth, gunwaleY, x + halfWidth, gunwaleY, x + back, gunwaleY - depth);
    body.fillTriangle(x - halfWidth, gunwaleY, x + back, gunwaleY - depth, x - back, gunwaleY - depth);
    body.lineStyle(4, COLORS.dark, 0.7).strokePoints([new Phaser.Math.Vector2(x - halfWidth, gunwaleY), new Phaser.Math.Vector2(x + halfWidth, gunwaleY), new Phaser.Math.Vector2(x + back, gunwaleY - depth), new Phaser.Math.Vector2(x - back, gunwaleY - depth)], true);
    if (planks) {
      body.lineStyle(3, 0x8d6540, 0.75);
      for (let plank = 1; plank < 4; plank += 1) {
        const t = plank / 4;
        body.strokeLineShape(new Phaser.Geom.Line(x - halfWidth + (halfWidth - back) * t, gunwaleY - depth * t, x + halfWidth - (halfWidth - back) * t, gunwaleY - depth * t));
      }
    }
  }

  private drawHeroShipTarget(x: number, waterlineY: number): void {
    // Source 1024², rendered 460² world px. Bottom-centre origin is the documented waterline pivot.
    this.add.image(x, waterlineY, "hero-ship-r3a1")
      .setDisplaySize(460, 460)
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.structures + 2);
  }

  private drawHeroShipWaterlineContact(x: number, waterlineY: number): void {
    // R3A-only contact: broad, rounded, low-energy sheltered-water disturbance; no crest geometry.
    const contact = this.add.graphics().setDepth(DEPTH.structures + 3);
    contact.fillStyle(0xa9d0c3, 0.34).fillEllipse(x, waterlineY - 2, 474, 34);
    contact.fillStyle(0x74ada9, 0.38).fillEllipse(x + 8, waterlineY + 3, 390, 18);
    contact.lineStyle(3, 0xc7dfd2, 0.38).strokeEllipse(x - 22, waterlineY + 2, 314, 13);
  }

  private drawMediumVessel(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, profile: ProjectionProfile): void {
    const gunwale = y + 18;
    body.fillStyle(0x6b4a3b, 1).fillTriangle(x - 92, gunwale, x + 92, gunwale, x + 58, gunwale + profile.mediumHull);
    this.drawDeckPlane(body, x, gunwale, 90, profile.mediumDeck, false);
    const mast = gunwale - profile.mediumDeck * 0.45;
    upper.lineStyle(6, COLORS.dark, 1).strokeLineShape(new Phaser.Geom.Line(x, mast, x, mast - 96 * profile.mastScale));
    upper.fillStyle(0xe8d49d, 0.9).fillTriangle(x + 5, mast - 90 * profile.mastScale, x + 5, mast - 6, x + 68, mast - 8);
  }

  private drawSmallBoat(body: Phaser.GameObjects.Graphics, x: number, y: number, profile: ProjectionProfile): void {
    body.fillStyle(0x765344, 1).fillTriangle(x - 44, y, x + 44, y, x + 28, y + profile.smallHull);
    body.lineStyle(4, COLORS.dark, 0.65).strokeTriangle(x - 44, y, x + 44, y, x + 28, y + profile.smallHull);
    this.drawDeckPlane(body, x, y, 42, profile.smallDeck, false);
  }

  private drawLabels(): void {
    const labelStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
      fontSize: "20px",
      color: "#f8e8bd",
      stroke: "#18303a",
      strokeThickness: 5,
    };
    const labels: Array<[string, number, number, number]> = this.usesGoldenMasterPlate ? [
      ["HARBOR SQUARE", 650, 452, 17],
      ["EXHIBITION HALL", 650, 248, 17],
      ["HERO QUAY", 915, 645, 17],
      ["HERO SHIP", 1045, 805, 18],
    ] : [
      ["HARBOR SQUARE", SQUARE.x + 8, SQUARE.y - 48, 20],
      ["EXHIBITION HALL", 1254, 500, 20],
      ["HERO QUAY", 1685, 785, 20],
      ["HERO SHIP", 1844, 740, 22],
      ["Guild Hall", 325, 330, 17],
      ["Academy", 1380, 100, 17],
      ["Workshop", 130, 995, 17],
      ["working dock", 250, 1200, 16],
    ];
    for (const [label, x, y, size] of labels) this.add.text(x, y, label, { ...labelStyle, fontSize: `${size}px` }).setDepth(DEPTH.labels);
  }

  private createPlayer(): void {
    this.playerShadow = this.add.graphics().setDepth(DEPTH.playerShadowBehindForeground);
    // R4.2 is a deterministic, non-destructive muted derivative of the approved R4.1 target.
    this.playerVisual = this.add.image(this.player.x, this.player.y, "harbor-player-r4-2-muted")
      .setDisplaySize(48, 72)
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.player);
    this.updatePlayerVisual();
  }

  private updatePlayerVisual(): void {
    if (!this.playerVisual || !this.playerShadow) return;
    const foregroundLine = this.usesGoldenMasterPlate ? GOLDEN_FOREGROUND_Y : 1140;
    const inForeground = this.player.y >= foregroundLine;
    this.playerShadow.clear();
    this.playerShadow.setDepth(inForeground ? DEPTH.playerShadowInForeground : DEPTH.playerShadowBehindForeground);
    // Two low-opacity warm-brown ellipses create a soft painted contact, never a hard UI oval.
    this.playerShadow.fillStyle(0x65503d, 0.09).fillEllipse(this.player.x, this.player.y - 2, 30, 8);
    this.playerShadow.fillStyle(0x4d3b2d, 0.12).fillEllipse(this.player.x, this.player.y - 2, 20, 5);
    this.playerVisual
      .setPosition(this.player.x, this.player.y)
      .setDepth(inForeground ? DEPTH.playerInForeground : DEPTH.playerBehindForeground);
  }

  private configureCamera(qa: QaState | undefined): void {
    const camera = this.cameras.main;
    if (this.usesGoldenMasterPlate) {
      // At zoom >= 0.8 the 1280px viewport fits inside the 1600px plate width. Bounds also clamp
      // follow motion, preventing any raw Phaser canvas from appearing at the plate's edges.
      camera.setBounds(GOLDEN_PLATE_BOUNDS.x, GOLDEN_PLATE_BOUNDS.y, GOLDEN_PLATE_BOUNDS.width, GOLDEN_PLATE_BOUNDS.height);
    } else {
      camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }
    if (qa === "entry") {
      const view = QA_VIEWS.entry;
      this.player.copy(view.player);
      this.updatePlayerVisual();
      camera.setZoom(view.zoom);
      camera.centerOn(view.camera.x, view.camera.y);
      // This is the real entry framing: the Square remains the spawn, while water, quay and ship enter the first view.
      return;
    }
    if (qa) {
      const view = QA_VIEWS[qa];
      this.player.copy(view.player);
      this.updatePlayerVisual();
      camera.setZoom(view.zoom);
      camera.centerOn(view.camera.x, view.camera.y);
      return;
    }
    const entry = QA_VIEWS.entry;
    camera.setZoom(entry.zoom);
    camera.centerOn(entry.camera.x, entry.camera.y);
    this.entryFraming = true;
  }

  private installInput(): void {
    if (this.input.keyboard) {
      this.movementKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        interact: Phaser.Input.Keyboard.KeyCodes.E,
      }) as MovementKeys;
      this.movementKeys.interact.on("down", () => {
        if (this.activeHotspot) this.openActiveDestination();
        else this.activateNearbyHotspot();
      });
      this.input.keyboard.on("keydown-ESC", () => this.closeInteractionPanel());
      this.input.keyboard.on("keydown-ENTER", () => {
        if (this.activeHotspot) this.openActiveDestination();
        else this.activateNearbyHotspot();
      });
    }
    // Pointer input is intentionally expressed as world-space movement intent: touch controls can replace
    // this producer without changing movement, collision, or interaction rules.
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => this.setTouchIntent(pointer));
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) this.setTouchIntent(pointer);
    });
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      // A short tap while standing at a landmark is the touch equivalent of the E prompt.
      if (pointer.getDistance() < 12) this.activateNearbyHotspot();
      this.touchIntent.set(0, 0);
    });
  }

  private setTouchIntent(pointer: Phaser.Input.Pointer): void {
    const target = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    this.touchIntent.set(target.x - this.player.x, target.y - this.player.y);
    if (this.touchIntent.lengthSq() < 20 * 20) this.touchIntent.set(0, 0);
  }

  private createInteractionUi(): void {
    const promptBackground = this.add.rectangle(0, 0, 270, 42, 0x18303a, 0.86)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    this.interactionPromptText = this.add.text(11, 10, "", {
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "16px",
      color: "#f8e8bd",
    }).setScrollFactor(0);
    this.interactionPrompt = this.add.container(18, 18, [promptBackground, this.interactionPromptText])
      .setDepth(DEPTH.interface)
      .setScrollFactor(0)
      .setSize(270, 42)
      .setVisible(false);
    promptBackground.on("pointerup", () => this.activateNearbyHotspot());

    const panel = this.add.rectangle(640, 360, 480, 194, 0x173440, 0.95)
      .setStrokeStyle(3, 0xe8ca78, 0.9)
      .setScrollFactor(0);
    this.panelTitle = this.add.text(420, 278, "", {
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "23px",
      color: "#f4e5bf",
      fontStyle: "bold",
    }).setScrollFactor(0).setWordWrapWidth(350);
    this.panelCopy = this.add.text(420, 318, "", {
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "16px",
      color: "#d9ebe2",
      lineSpacing: 6,
    }).setScrollFactor(0).setWordWrapWidth(408);
    const close = this.add.text(803, 279, "닫기 ×", {
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "14px",
      color: "#d9ebe2",
    }).setScrollFactor(0).setInteractive({ useHandCursor: true });
    close.on("pointerup", () => this.closeInteractionPanel());
    const actionBackground = this.add.rectangle(778, 435, 150, 34, 0xe8ca78, 1)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    this.panelAction = this.add.text(0, 0, "", {
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "14px",
      color: "#18303a",
      fontStyle: "bold",
    }).setOrigin(0.5).setPosition(778, 435).setScrollFactor(0);
    actionBackground.on("pointerup", () => this.openActiveDestination());
    this.interactionPanel = this.add.container(0, 0, [panel, this.panelTitle, this.panelCopy, close, actionBackground, this.panelAction])
      .setDepth(DEPTH.interface)
      .setVisible(false);
  }

  private updateInteractionPrompt(): void {
    if (!this.interactionPrompt || !this.interactionPromptText) return;
    if (this.activeHotspot) {
      this.interactionPrompt.setVisible(false);
      return;
    }
    this.nearbyHotspot = this.getNearbyHotspot();
    this.interactionPrompt.setVisible(Boolean(this.nearbyHotspot));
    if (this.nearbyHotspot) this.interactionPromptText.setText(`E · ${this.nearbyHotspot.title}`);
  }

  private getHotspot(id: HotspotId): PortfolioHotspot {
    const hotspot = PORTFOLIO_HOTSPOTS.find((candidate) => candidate.id === id);
    if (!hotspot) throw new Error(`Unknown portfolio hotspot: ${id}`);
    return hotspot;
  }

  private qaHotspotId(qa: QaState): HotspotId | undefined {
    if (qa === "square") return "square";
    if (qa === "hotspot" || qa === "gallery") return "gallery";
    if (qa === "career") return "career";
    return undefined;
  }

  private getNearbyHotspot(): PortfolioHotspot | undefined {
    return PORTFOLIO_HOTSPOTS.find((hotspot) =>
      Phaser.Math.Distance.Between(this.player.x, this.player.y, hotspot.position[0], hotspot.position[1]) <= hotspot.radius,
    );
  }

  private activateNearbyHotspot(): void {
    const hotspot = this.getNearbyHotspot();
    if (hotspot) this.activateHotspot(hotspot);
  }

  private activateHotspot(hotspot: PortfolioHotspot): void {
    if (this.activeHotspot) return;
    this.activeHotspot = hotspot;
    this.interactionPrompt?.setVisible(false);
    this.panelTitle?.setText(hotspot.title);
    this.panelCopy?.setText(hotspot.description);
    this.panelAction?.setText(hotspot.actionLabel);
    this.interactionPanel?.setVisible(true);
    this.publishQaState();
  }

  private closeInteractionPanel(): void {
    if (!this.activeHotspot) return;
    this.activeHotspot = undefined;
    this.interactionPanel?.setVisible(false);
    this.updateInteractionPrompt();
    this.publishQaState();
  }

  private openActiveDestination(): void {
    if (this.activeHotspot) window.location.assign(this.activeHotspot.destination);
  }

  private isWalkable(x: number, y: number): boolean {
    if (this.usesGoldenMasterPlate) {
      const onSpine = nearRoute(x, y, GOLDEN_SPINE, 68);
      const onHallBranch = nearRoute(x, y, GOLDEN_HALL_BRANCH, 58);
      const onSquare = x > 630 && x < 865 && y > 430 && y < 590;
      const onHallForecourt = x > 690 && x < 900 && y > 260 && y < 420;
      const onHeroQuay = x > 1300 && x < 1500 && y > 670 && y < 800;
      const onDockApron = x > 1320 && x < 1480 && y > 700 && y < 815;
      return onSpine || onHallBranch || onSquare || onHallForecourt || onHeroQuay || onDockApron;
    }
    const waterX = (x - 1450) / 1190;
    const waterY = (y - 1160) / 540;
    const inBasin = waterX * waterX + waterY * waterY < 1;
    const onHeroQuay = x > 1460 && x < 2070 && y > 775 && y < 1180;
    const onWorkingDock = x > 160 && x < 630 && y > 1040 && y < 1210;
    // The drawn spine/branches/Square are walkable even where they overlap the basin edge.
    const onRoute = nearRoute(x, y, SPINE, 62) || nearRoute(x, y, GUILD_BRANCH, 36) || nearRoute(x, y, ACADEMY_BRANCH, 38);
    const onSquare = x > SQUARE.x && x < SQUARE.x + SQUARE.width && y > SQUARE.y && y < SQUARE.y + SQUARE.height;
    const onForecourt = x > 1285 && x < 1595 && y > HALL.baseY - 26 && y < HALL.baseY + 114;
    const insideSolid = SOLID_FOOTPRINTS.some((footprint) => x > footprint.x && x < footprint.x + footprint.width && y > footprint.y && y < footprint.y + footprint.height);
    return (!inBasin || onHeroQuay || onWorkingDock || onRoute || onSquare || onForecourt) && !insideSolid;
  }

  private publishQaState(): void {
    const camera = this.cameras.main;
    const restoredView = this.qaState === "normal" ? undefined : QA_VIEWS[this.qaState];
    window.__PORTFOLIO_WORLD_V2_QA__ = {
      activeScene: "WorldScene",
      projection: this.projection,
      qaState: this.qaState,
      camera: restoredView
        ? { x: restoredView.camera.x, y: restoredView.camera.y, zoom: restoredView.zoom }
        : { x: Math.round(camera.midPoint.x), y: Math.round(camera.midPoint.y), zoom: camera.zoom },
      player: { x: Math.round(this.player.x), y: Math.round(this.player.y) },
      hotspotActive: Boolean(this.activeHotspot),
      activeHotspotId: this.activeHotspot?.id ?? null,
      debug: this.debugMode,
      hotspots: PORTFOLIO_HOTSPOTS.map((hotspot) => ({
        id: hotspot.id,
        destination: hotspot.destination,
        reachable: this.isWalkable(hotspot.position[0], hotspot.position[1]),
      })),
      walkability: {
        harborSquareToHall: this.isWalkable(720, 455) && this.isWalkable(EXHIBITION_HOTSPOT.x, EXHIBITION_HOTSPOT.y),
        hallToHeroQuay: this.isWalkable(825, 540) && this.isWalkable(...HERO_QUAY_GROUND),
        heroShipApproach: this.isWalkable(...HERO_QUAY_GROUND),
      },
    };
  }
}
