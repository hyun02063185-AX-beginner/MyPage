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

const PROJECTION_HEIGHT: Record<Projection, number> = { low: 18, mid: 36, high: 58 };

const QA_VIEWS: Record<QaState, { player: Phaser.Math.Vector2; camera: Phaser.Math.Vector2; zoom: number }> = {
  entry: { player: new Phaser.Math.Vector2(960, 605), camera: new Phaser.Math.Vector2(960, 605), zoom: 0.78 },
  overview: { player: new Phaser.Math.Vector2(960, 605), camera: new Phaser.Math.Vector2(1300, 830), zoom: 0.46 },
  hero: { player: new Phaser.Math.Vector2(1620, 830), camera: new Phaser.Math.Vector2(1840, 960), zoom: 0.83 },
  scale: { player: new Phaser.Math.Vector2(1420, 705), camera: new Phaser.Math.Vector2(1480, 760), zoom: 0.92 },
};

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
  private player = new Phaser.Math.Vector2(960, 605);
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
    // A single, bent shoreline spine: Workshop -> Square -> Exhibition -> Hero Quay.
    lower.lineStyle(138, COLORS.path, 1);
    lower.beginPath();
    lower.moveTo(345, 1080);
    lower.lineTo(610, 850);
    lower.lineTo(960, 605);
    lower.lineTo(1215, 690);
    lower.lineTo(1420, 760);
    lower.lineTo(1600, 890);
    lower.strokePath();
    lower.lineStyle(112, COLORS.paving, 1);
    lower.beginPath();
    lower.moveTo(345, 1080);
    lower.lineTo(610, 850);
    lower.lineTo(960, 605);
    lower.lineTo(1215, 690);
    lower.lineTo(1420, 760);
    lower.lineTo(1600, 890);
    lower.strokePath();

    // Deliberately unequal inland branches: Guild is short; Academy continues farther into its own forecourt.
    lower.lineStyle(82, COLORS.path, 1).beginPath().moveTo(720, 770).lineTo(590, 545).lineTo(475, 470).strokePath();
    lower.lineStyle(62, COLORS.paving, 1).beginPath().moveTo(720, 770).lineTo(590, 545).lineTo(475, 470).strokePath();
    lower.lineStyle(86, COLORS.path, 1).beginPath().moveTo(1080, 630).lineTo(1180, 395).lineTo(1465, 245).strokePath();
    lower.lineStyle(65, COLORS.paving, 1).beginPath().moveTo(1080, 630).lineTo(1180, 395).lineTo(1465, 245).strokePath();

    // Square is an offset widening along the spine, intentionally not a radial hub.
    lower.fillStyle(COLORS.paving, 1).fillRoundedRect(825, 490, 270, 190, 34);
    lower.lineStyle(5, COLORS.path, 1).strokeRoundedRect(825, 490, 270, 190, 34);
    lower.lineStyle(2, 0x9a805b, 0.48);
    for (let x = 850; x < 1070; x += 44) lower.strokeLineShape(new Phaser.Geom.Line(x, 514, x, 656));
  }

  private drawSettlement(): void {
    const height = PROJECTION_HEIGHT[this.projection];
    const structures = this.add.graphics().setDepth(DEPTH.structures);
    const upper = this.add.graphics().setDepth(DEPTH.upperStructures);

    this.drawExhibitionHall(structures, upper, 1400, 680, height);
    this.drawSecondaryMarker(structures, upper, 445, 420, "Guild Hall", 84, 44);
    this.drawSecondaryMarker(structures, upper, 1500, 195, "Academy", 106, 50);
    this.drawSecondaryMarker(structures, upper, 285, 1050, "Workshop", 96, 44);

    // Calibration-only paving, bench, lamp, and door near the Exhibition Hall.
    structures.fillStyle(0xc7aa74, 1).fillRoundedRect(1285, 755, 310, 118, 16);
    structures.lineStyle(3, 0x9f835a, 0.75).strokeRoundedRect(1285, 755, 310, 118, 16);
    structures.fillStyle(COLORS.dark, 1).fillRect(1416, 750 - height, 42, 58 + height);
    structures.fillStyle(0x805f43, 1).fillRect(1320, 808, 62, 13).fillRect(1328, 793, 11, 18).fillRect(1363, 793, 11, 18);
    structures.fillStyle(0x31444a, 1).fillRect(1518, 776, 9, 56);
    upper.fillStyle(COLORS.accent, 1).fillCircle(1522, 770, 15).lineStyle(4, 0xf3dfaf, 0.7).strokeCircle(1522, 770, 15);
  }

  private drawExhibitionHall(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, height: number): void {
    body.fillStyle(COLORS.facade, 1).fillRoundedRect(x - 135, y - height, 270, 150 + height, 10);
    body.fillStyle(0xa65d47, 1).fillRect(x - 135, y + 102, 270, 48);
    body.lineStyle(5, COLORS.dark, 0.72).strokeRoundedRect(x - 135, y - height, 270, 150 + height, 10);
    upper.fillStyle(COLORS.roof, 1).fillTriangle(x - 162, y - height, x + 162, y - height, x, y - height - 84);
    upper.fillStyle(0xe29a65, 1).fillTriangle(x - 122, y - height - 11, x + 122, y - height - 11, x, y - height - 68);
    upper.lineStyle(5, COLORS.dark, 0.7).strokeTriangle(x - 162, y - height, x + 162, y - height, x, y - height - 84);
    upper.fillStyle(0x35505a, 1).fillRect(x - 88, y - height + 30, 52, 40).fillRect(x + 35, y - height + 30, 52, 40);
  }

  private drawSecondaryMarker(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, _name: string, width: number, height: number): void {
    body.fillStyle(COLORS.stone, 0.92).fillRoundedRect(x - width, y - height, width * 2, height * 2, 9);
    body.lineStyle(4, COLORS.dark, 0.7).strokeRoundedRect(x - width, y - height, width * 2, height * 2, 9);
    upper.fillStyle(0x809680, 0.9).fillTriangle(x - width - 18, y - height, x + width + 18, y - height, x, y - height - 44);
  }

  private drawFleetAndQuay(): void {
    const lower = this.add.graphics().setDepth(DEPTH.lowerEnvironment + 1);
    const structures = this.add.graphics().setDepth(DEPTH.structures + 1);
    const upper = this.add.graphics().setDepth(DEPTH.upperStructures + 1);
    // Asymmetric Hero Quay tongue, connected to the waterfront end of the spine.
    lower.fillStyle(COLORS.dock, 1).fillTriangle(1510, 818, 1790, 928, 2050, 1140);
    lower.fillStyle(COLORS.dock, 1).fillTriangle(1510, 818, 2050, 1140, 1780, 1122);
    lower.lineStyle(8, COLORS.dockEdge, 1).strokeTriangle(1510, 818, 1790, 928, 2050, 1140).strokeTriangle(1510, 818, 2050, 1140, 1780, 1122);
    for (let step = 0; step < 5; step += 1) {
      lower.lineStyle(4, 0xc79b62, 0.7).strokeLineShape(new Phaser.Geom.Line(1660 + step * 66, 925 + step * 43, 1608 + step * 66, 1010 + step * 43));
    }
    // Working dock is a separate, smaller harbor edge at the other end of the basin.
    lower.fillStyle(COLORS.dock, 1).fillRoundedRect(190, 1080, 410, 100, 12);
    lower.lineStyle(7, COLORS.dockEdge, 1).strokeRoundedRect(190, 1080, 410, 100, 12);

    const h = PROJECTION_HEIGHT[this.projection];
    this.drawHeroShip(structures, upper, 2010, 1070, h);
    this.drawMediumVessel(structures, upper, 1110, 1115, h);
    this.drawSmallBoat(structures, 860, 1230);
  }

  private drawHeroShip(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, height: number): void {
    body.fillStyle(COLORS.hull, 1).fillTriangle(x - 210, y + 48, x + 210, y + 48, x + 130, y + 116);
    body.fillStyle(0x8a5740, 1).fillRect(x - 155, y - 6, 300, 58);
    body.lineStyle(7, COLORS.dark, 0.85).strokeTriangle(x - 210, y + 48, x + 210, y + 48, x + 130, y + 116);
    upper.lineStyle(12, COLORS.dark, 1).strokeLineShape(new Phaser.Geom.Line(x - 20, y + 42, x - 20, y - 170 - height));
    upper.lineStyle(9, COLORS.dark, 1).strokeLineShape(new Phaser.Geom.Line(x + 92, y + 44, x + 92, y - 115 - height));
    upper.fillStyle(COLORS.sail, 1).fillTriangle(x - 12, y - 162 - height, x - 12, y + 18, x - 150, y + 10);
    upper.fillStyle(0xf7e8be, 0.94).fillTriangle(x + 100, y - 110 - height, x + 100, y + 22, x + 210, y + 28);
    upper.lineStyle(5, COLORS.dark, 0.75).strokeTriangle(x - 12, y - 162 - height, x - 12, y + 18, x - 150, y + 10);
  }

  private drawMediumVessel(body: Phaser.GameObjects.Graphics, upper: Phaser.GameObjects.Graphics, x: number, y: number, height: number): void {
    body.fillStyle(0x6b4a3b, 1).fillTriangle(x - 92, y + 18, x + 92, y + 18, x + 58, y + 54);
    upper.lineStyle(6, COLORS.dark, 1).strokeLineShape(new Phaser.Geom.Line(x, y + 18, x, y - 75 - height / 2));
    upper.fillStyle(0xe8d49d, 0.9).fillTriangle(x + 5, y - 68 - height / 2, x + 5, y + 12, x + 68, y + 10);
  }

  private drawSmallBoat(body: Phaser.GameObjects.Graphics, x: number, y: number): void {
    body.fillStyle(0x765344, 1).fillTriangle(x - 44, y, x + 44, y, x + 28, y + 24);
    body.lineStyle(4, COLORS.dark, 0.65).strokeTriangle(x - 44, y, x + 44, y, x + 28, y + 24);
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
      ["HARBOR SQUARE · spine node", 836, 442, 20],
      ["EXHIBITION HALL · representative mass", 1254, 540, 20],
      ["HERO QUAY", 1685, 785, 20],
      ["HERO SHIP · landmark", 1844, 790, 22],
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
    return !inBasin || onHeroQuay || onWorkingDock;
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
