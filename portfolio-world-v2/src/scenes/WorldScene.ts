import Phaser from "phaser";
import { PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "../config";

type Projection = "low" | "mid" | "high";
type QaState = "entry" | "overview" | "hero" | "scale";
type MovementKeys = Record<"up" | "down" | "left" | "right" | "w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>;

const DEPTH = {
  terrain: 0,
  shoreline: 10,
  lowerEnvironment: 20,
  structures: 30,
  player: 40,
  upperStructures: 50,
  labels: 60,
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

/**
 * R2D route geometry. Branch origins are spine vertices, so a branch can only leave where the spine
 * actually is. Sequence along the spine: working dock -> Guild branch (bend) -> Harbor Square
 * (widening) -> Academy branch (far later, before the hall) -> Exhibition Hall -> Hero Quay.
 */
const SPINE: readonly Point[] = [[345, 1080], [560, 835], [695, 640], [1085, 656], [1420, 760], [1600, 890]];
const GUILD_BRANCH: readonly Point[] = [[560, 835], [430, 680], [445, 470]];
const ACADEMY_BRANCH: readonly Point[] = [[1085, 656], [1130, 440], [1465, 245]];
const SQUARE = { x: 580, y: 490, width: 230, height: 190 } as const;
const SPAWN: Point = [SQUARE.x + SQUARE.width / 2, 590];

/** Placeholder door: ~1.26x the 54px player, fixed regardless of projection (a door does not stretch with the facade). */
const PLAYER_HEIGHT = 54;
const DOOR = { width: 38, height: 68 } as const;
const HALL = { x: 1400, baseY: 830 } as const;

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
  entry: { player: new Phaser.Math.Vector2(SPAWN[0], SPAWN[1]), camera: new Phaser.Math.Vector2(SPAWN[0], SPAWN[1]), zoom: 0.78 },
  overview: { player: new Phaser.Math.Vector2(SPAWN[0], SPAWN[1]), camera: new Phaser.Math.Vector2(1300, 830), zoom: 0.46 },
  hero: { player: new Phaser.Math.Vector2(1620, 830), camera: new Phaser.Math.Vector2(1840, 960), zoom: 0.83 },
  // Player stands on the forecourt beside the door (door centre x=1400), same ground line, not overlapping it.
  scale: { player: new Phaser.Math.Vector2(HALL.x + 64, HALL.baseY - 20), camera: new Phaser.Math.Vector2(1450, 770), zoom: 0.92 },
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
  return value === "entry" || value === "overview" || value === "hero" || value === "scale" ? value : undefined;
}

/** Candidate A+ flat-shape blockout. Water is one calm basin; the built settlement stays deliberately asymmetric. */
export class WorldScene extends Phaser.Scene {
  private projection: Projection = "mid";
  private qaState: QaState | "normal" = "normal";
  private player = new Phaser.Math.Vector2(SPAWN[0], SPAWN[1]);
  private playerGraphic?: Phaser.GameObjects.Graphics;
  private movementKeys?: MovementKeys;

  public constructor() {
    super("WorldScene");
  }

  public create(): void {
    const query = new URLSearchParams(window.location.search);
    this.projection = pickProjection(query.get("projection"));
    const requestedQa = pickQaState(query.get("qa"));
    this.qaState = requestedQa ?? "normal";

    this.drawTerrain();
    this.drawSpineAndCrescent();
    this.drawSettlement();
    this.drawFleetAndQuay();
    this.drawLabels();
    this.createPlayer();
    this.configureCamera(requestedQa);
    this.installInput();
    this.publishQaState();
  }

  public update(_time: number, delta: number): void {
    if (this.qaState !== "normal" || !this.movementKeys) return;
    let dx = 0;
    let dy = 0;
    if (this.movementKeys.left.isDown || this.movementKeys.a.isDown) dx -= 1;
    if (this.movementKeys.right.isDown || this.movementKeys.d.isDown) dx += 1;
    if (this.movementKeys.up.isDown || this.movementKeys.w.isDown) dy -= 1;
    if (this.movementKeys.down.isDown || this.movementKeys.s.isDown) dy += 1;
    if (dx === 0 && dy === 0) return;
    const magnitude = Math.hypot(dx, dy);
    const next = new Phaser.Math.Vector2(
      Phaser.Math.Clamp(this.player.x + (dx / magnitude) * PLAYER_SPEED * (delta / 1000), 56, WORLD_WIDTH - 56),
      Phaser.Math.Clamp(this.player.y + (dy / magnitude) * PLAYER_SPEED * (delta / 1000), 56, WORLD_HEIGHT - 56),
    );
    if (this.isWalkable(next.x, next.y)) {
      this.player.copy(next);
      this.redrawPlayer();
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
    for (let index = 0; index < 7; index += 1) {
      water.strokeEllipse(1280 + index * 80, 1110 + index * 34, 310 - index * 12, 56 - index * 4);
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

    this.drawHeroShip(structures, upper, 2010, 1070, profile);
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

  private drawHeroShip(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, profile: ProjectionProfile): void {
    const gunwale = y + 48;
    const deckBase = gunwale - profile.topsides;
    // Hull below the gunwale, then topsides, then the visible deck plane.
    body.fillStyle(COLORS.hull, 1).fillTriangle(x - 210, gunwale, x + 210, gunwale, x + 130, gunwale + profile.hullDepth);
    body.lineStyle(7, COLORS.dark, 0.85).strokeTriangle(x - 210, gunwale, x + 210, gunwale, x + 130, gunwale + profile.hullDepth);
    if (profile.topsides > 0) {
      body.fillStyle(0x8a5740, 1).fillRect(x - 205, deckBase, 410, profile.topsides + 2);
      body.lineStyle(4, COLORS.dark, 0.7).strokeRect(x - 205, deckBase, 410, profile.topsides + 2);
    }
    this.drawDeckPlane(body, x, deckBase, 205, profile.deck, profile.deck > 40);

    const mast = deckBase - profile.deck * 0.45;
    const s = profile.mastScale;
    upper.lineStyle(12, COLORS.dark, 1).strokeLineShape(new Phaser.Geom.Line(x - 20, mast + 6, x - 20, mast - 226 * s));
    upper.lineStyle(9, COLORS.dark, 1).strokeLineShape(new Phaser.Geom.Line(x + 92, mast + 8, x + 92, mast - 172 * s));
    upper.fillStyle(COLORS.sail, 1).fillTriangle(x - 12, mast - 218 * s, x - 12, mast - 18, x - 150, mast - 26);
    upper.fillStyle(0xf7e8be, 0.94).fillTriangle(x + 100, mast - 166 * s, x + 100, mast - 14, x + 210, mast - 8);
    upper.lineStyle(5, COLORS.dark, 0.75).strokeTriangle(x - 12, mast - 218 * s, x - 12, mast - 18, x - 150, mast - 26);
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
    const labels: Array<[string, number, number, number]> = [
      ["HARBOR SQUARE · spine node", SQUARE.x, SQUARE.y - 48, 20],
      ["EXHIBITION HALL · representative mass", 1254, 500, 20],
      ["HERO QUAY", 1685, 785, 20],
      ["HERO SHIP · landmark", 1844, 740, 22],
      ["Guild Hall · secondary marker", 325, 330, 17],
      ["Academy · secondary marker", 1380, 100, 17],
      ["Workshop · secondary marker", 130, 995, 17],
      ["working dock", 250, 1200, 16],
      ["calm crescent basin · open water", 1030, 1430, 20],
    ];
    for (const [label, x, y, size] of labels) this.add.text(x, y, label, { ...labelStyle, fontSize: `${size}px` }).setDepth(DEPTH.labels);
  }

  private createPlayer(): void {
    this.playerGraphic = this.add.graphics().setDepth(DEPTH.player);
    this.redrawPlayer();
  }

  private redrawPlayer(): void {
    if (!this.playerGraphic) return;
    this.playerGraphic.clear();
    this.playerGraphic.fillStyle(0xf8e8bd, 1).fillCircle(this.player.x, this.player.y - 13, 13);
    this.playerGraphic.fillStyle(0x264d5d, 1).fillRoundedRect(this.player.x - 12, this.player.y, 24, 28, 7);
    this.playerGraphic.lineStyle(4, COLORS.dark, 1).strokeCircle(this.player.x, this.player.y - 13, 13).strokeRoundedRect(this.player.x - 12, this.player.y, 24, 28, 7);
  }

  private configureCamera(qa: QaState | undefined): void {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    if (qa === "entry") {
      const view = QA_VIEWS.entry;
      this.player.copy(view.player);
      this.redrawPlayer();
      camera.setZoom(view.zoom);
      // The entry evidence deliberately uses the same follow behavior as normal play.
      camera.centerOn(view.camera.x, view.camera.y);
      camera.startFollow(this.playerGraphic!, true, 0.12, 0.12);
      return;
    }
    if (qa) {
      const view = QA_VIEWS[qa];
      this.player.copy(view.player);
      this.redrawPlayer();
      camera.setZoom(view.zoom);
      camera.centerOn(view.camera.x, view.camera.y);
      return;
    }
    camera.setZoom(0.78);
    camera.centerOn(this.player.x, this.player.y);
    camera.startFollow(this.playerGraphic!, true, 0.12, 0.12);
  }

  private installInput(): void {
    if (!this.input.keyboard) return;
    this.movementKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as MovementKeys;
  }

  private isWalkable(x: number, y: number): boolean {
    const waterX = (x - 1450) / 1190;
    const waterY = (y - 1160) / 540;
    const inBasin = waterX * waterX + waterY * waterY < 1;
    const onHeroQuay = x > 1460 && x < 2070 && y > 775 && y < 1180;
    const onWorkingDock = x > 160 && x < 630 && y > 1040 && y < 1210;
    // The drawn spine/branches/Square are walkable even where they overlap the basin edge.
    const onRoute = nearRoute(x, y, SPINE, 62) || nearRoute(x, y, GUILD_BRANCH, 36) || nearRoute(x, y, ACADEMY_BRANCH, 38);
    const onSquare = x > SQUARE.x && x < SQUARE.x + SQUARE.width && y > SQUARE.y && y < SQUARE.y + SQUARE.height;
    const onForecourt = x > 1285 && x < 1595 && y > HALL.baseY - 26 && y < HALL.baseY + 114;
    return !inBasin || onHeroQuay || onWorkingDock || onRoute || onSquare || onForecourt;
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
    };
  }
}
