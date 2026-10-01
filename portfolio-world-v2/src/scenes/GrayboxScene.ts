import Phaser from "phaser";

type Facing = "up" | "down" | "left" | "right";
type QaState = "normal" | "upper" | "hall" | "stairs-top" | "stairs-bottom" | "workshop" | "quay" | "gangway" | "movement";
type Rect = Readonly<{ x: number; y: number; width: number; height: number }>;

const WORLD = { width: 1600, height: 1000 } as const;
const PLAYER_SPEED = 240;
const PLAYER_SIZE = { width: 56, height: 80 } as const;
const COLORS = {
  water: 0x324a59,
  waterLine: 0x5f8391,
  plaza: 0xb7b8b5,
  stairs: 0xa3a5a3,
  quay: 0xb1b2b0,
  building: 0x6f7477,
  buildingEdge: 0x343b40,
  workshop: 0x7e8284,
  railing: 0x26373e,
  gangway: 0xb38e55,
  ship: 0x5e5550,
  target: 0x76a886,
  label: 0x1b252a,
  player: 0x3b79b2,
  playerAccent: 0xf0cc75,
} as const;

const WALKABLE: readonly Rect[] = [
  { x: 310, y: 155, width: 780, height: 345 }, // Upper Plaza / Hall threshold.
  { x: 650, y: 480, width: 260, height: 190 }, // Main stairs.
  { x: 300, y: 650, width: 890, height: 285 }, // Lower Quay.
  { x: 260, y: 710, width: 130, height: 170 }, // Workshop approach.
  { x: 1110, y: 705, width: 105, height: 120 }, // Gangway target apron.
] as const;

const QA_POSITIONS: Record<Exclude<QaState, "normal" | "movement">, Readonly<{ x: number; y: number }>> = {
  upper: { x: 700, y: 350 },
  hall: { x: 760, y: 180 },
  "stairs-top": { x: 780, y: 515 },
  "stairs-bottom": { x: 780, y: 640 },
  workshop: { x: 340, y: 790 },
  quay: { x: 780, y: 790 },
  gangway: { x: 1135, y: 760 },
};

/** R3A's deliberately flat, explicit, art-free playable harbor. */
export class GrayboxScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<"w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>;
  private qaState: QaState = "normal";
  private facing: Facing = "down";
  private moving = false;
  private movementPath: Phaser.Math.Vector2[] = [];
  private movementIndex = 0;
  private movementDemoStartedAt = 0;
  private blockers!: Phaser.Physics.Arcade.StaticGroup;
  private lastValid = new Phaser.Math.Vector2(700, 350);

  public constructor() {
    super("GrayboxScene");
  }

  public create(): void {
    const query = new URLSearchParams(window.location.search);
    this.qaState = this.pickQaState(query.get("qa"));
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);
    this.drawGraybox();
    this.createPlayerTextures();
    this.createPlayer();
    this.createCollisionBoundaries();
    this.configureCamera();
    this.installInput();
    this.applyQaPosition();
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.enforceWalkableSpace, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.events.off(Phaser.Scenes.Events.POST_UPDATE, this.enforceWalkableSpace, this));
    this.publishQa();
  }

  public update(time: number): void {
    const direction = this.qaState === "movement" ? this.updateMovementDemo(time) : this.readInput();
    this.applyMovement(direction.x, direction.y);
    this.publishQa();
  }

  private pickQaState(value: string | null): QaState {
    return value === "upper" || value === "hall" || value === "stairs-top" || value === "stairs-bottom" || value === "workshop" || value === "quay" || value === "gangway" || value === "movement" ? value : "normal";
  }

  private drawGraybox(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.water, 1).fillRect(0, 0, WORLD.width, WORLD.height);
    graphics.lineStyle(3, COLORS.waterLine, 0.55);
    for (let y = 40; y < WORLD.height; y += 42) graphics.strokeLineShape(new Phaser.Geom.Line(0, y, WORLD.width, y));

    const drawSurface = (rect: Rect, color: number, label: string): void => {
      graphics.fillStyle(color, 1).fillRect(rect.x, rect.y, rect.width, rect.height);
      graphics.lineStyle(5, COLORS.buildingEdge, 0.75).strokeRect(rect.x, rect.y, rect.width, rect.height);
      this.add.text(rect.x + 18, rect.y + 16, label, { fontFamily: "monospace", fontSize: "20px", color: "#1b252a", backgroundColor: "#d9dad6", padding: { x: 8, y: 4 } }).setDepth(5);
    };
    drawSurface(WALKABLE[0], COLORS.plaza, "UPPER PLAZA");
    drawSurface(WALKABLE[1], COLORS.stairs, "MAIN STAIRS");
    drawSurface(WALKABLE[2], COLORS.quay, "LOWER QUAY");
    drawSurface(WALKABLE[3], COLORS.quay, "WORKSHOP APPROACH");
    drawSurface(WALKABLE[4], COLORS.target, "GANGWAY");

    graphics.lineStyle(3, 0x777b7c, 0.8);
    for (let y = 495; y < 665; y += 22) graphics.strokeLineShape(new Phaser.Geom.Line(650, y, 910, y));
    graphics.lineStyle(10, COLORS.railing, 1).strokeLineShape(new Phaser.Geom.Line(638, 490, 638, 675)).strokeLineShape(new Phaser.Geom.Line(922, 490, 922, 675));

    const drawFootprint = (x: number, y: number, width: number, height: number, label: string, color: number = COLORS.building): void => {
      graphics.fillStyle(color, 1).fillRect(x, y, width, height).lineStyle(6, COLORS.buildingEdge, 1).strokeRect(x, y, width, height);
      this.add.text(x + 16, y + 16, label, { fontFamily: "monospace", fontSize: "18px", color: "#ffffff", backgroundColor: "#343b40", padding: { x: 7, y: 4 } }).setDepth(5);
    };
    drawFootprint(500, 18, 190, 145, "EXHIBITION HALL");
    drawFootprint(790, 18, 150, 145, "EXHIBITION HALL");
    graphics.fillStyle(0x202a2f, 1).fillRect(690, 68, 100, 95).lineStyle(4, 0xe4e4dd, 0.85).strokeRect(690, 68, 100, 95);
    this.add.text(700, 98, "ENTRY", { fontFamily: "monospace", fontSize: "16px", color: "#ffffff" }).setDepth(6);
    drawFootprint(80, 650, 180, 230, "WORKSHOP", COLORS.workshop);
    drawFootprint(1215, 610, 300, 335, "HERO SHIP\nEXCLUSION", COLORS.ship);
    graphics.fillStyle(COLORS.gangway, 1).fillRect(1145, 720, 120, 78).lineStyle(4, COLORS.buildingEdge, 1).strokeRect(1145, 720, 120, 78);
    this.add.text(1151, 744, "SHIP\nTARGET", { fontFamily: "monospace", fontSize: "15px", color: "#1b252a" }).setDepth(6);

    // Visible neutral collision treatments, deliberately not decorative art.
    graphics.lineStyle(8, COLORS.railing, 1).strokeLineShape(new Phaser.Geom.Line(300, 940, 1190, 940)).strokeLineShape(new Phaser.Geom.Line(1190, 650, 1190, 940));
    graphics.lineStyle(6, COLORS.railing, 0.9).strokeLineShape(new Phaser.Geom.Line(300, 650, 300, 940));
    this.add.text(28, 30, "R3A PLAYABLE GRAYBOX — SPACE / MOVEMENT / COLLISION / CAMERA", { fontFamily: "monospace", fontSize: "21px", color: "#e5e7e2", backgroundColor: "#1b252a", padding: { x: 10, y: 7 } }).setScrollFactor(0).setDepth(100);
  }

  private createPlayerTextures(): void {
    const createFrame = (key: string, facing: Facing, step: number): void => {
      if (this.textures.exists(key)) return;
      const g = this.add.graphics();
      const legOffset = step < 0 ? 0 : [-6, -2, 6, 2][step] ?? 0;
      const armOffset = step < 0 ? 0 : [5, 2, -5, -2][step] ?? 0;
      g.fillStyle(0x17242a, 0.35).fillEllipse(32, 73, 37, 10);
      g.fillStyle(COLORS.player, 1).fillRoundedRect(17, 25, 30, 31, 7);
      g.fillStyle(COLORS.playerAccent, 1).fillRect(17, 43, 30, 7);
      g.fillStyle(0xf0c19c, 1).fillCircle(32, 17, 12);
      g.fillStyle(0x24333b, 1).fillRect(21, 7, 22, 8);
      g.fillStyle(0x263238, 1).fillRect(21, 56, 9, 17 + legOffset).fillRect(35, 56, 9, 17 - legOffset);
      g.fillStyle(0x263238, 1).fillRect(14, 30 - armOffset, 5, 22 + armOffset).fillRect(45, 30 + armOffset, 5, 22 - armOffset);
      if (facing === "up") g.fillStyle(0x2d4962, 1).fillRect(21, 29, 22, 19);
      if (facing === "left") g.fillStyle(0xffffff, 1).fillRect(21, 17, 4, 3);
      if (facing === "right") g.fillStyle(0xffffff, 1).fillRect(39, 17, 4, 3);
      if (facing === "down") g.fillStyle(0xffffff, 1).fillRect(24, 17, 4, 3).fillRect(36, 17, 4, 3);
      g.generateTexture(key, 64, 80);
      g.destroy();
    };
    for (const direction of ["up", "down", "left", "right"] as const) {
      createFrame(`gb-${direction}-idle`, direction, -1);
      for (let frame = 0; frame < 4; frame += 1) createFrame(`gb-${direction}-walk-${frame}`, direction, frame);
      this.anims.create({ key: `gb-idle-${direction}`, frames: [{ key: `gb-${direction}-idle` }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: `gb-walk-${direction}`, frames: [0, 1, 2, 3].map((frame) => ({ key: `gb-${direction}-walk-${frame}` })), frameRate: 10, repeat: -1 });
    }
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(700, 350, "gb-down-idle").setDisplaySize(PLAYER_SIZE.width, PLAYER_SIZE.height).setDepth(20);
    this.player.setCollideWorldBounds(true);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(34, 44).setOffset(15, 32);
    this.player.play("gb-idle-down");
  }

  private createCollisionBoundaries(): void {
    this.blockers = this.physics.add.staticGroup();
    const addBlocker = (x: number, y: number, width: number, height: number): void => {
      const block = this.add.rectangle(x + width / 2, y + height / 2, width, height, 0xffffff, 0);
      this.blockers.add(block);
    };
    // Building / ship footprints.
    addBlocker(500, 18, 190, 145); addBlocker(790, 18, 150, 145); addBlocker(80, 650, 180, 230); addBlocker(1215, 610, 300, 335);
    // Stair railings, quay water edge, and non-walkable exterior water.
    addBlocker(625, 480, 25, 200); addBlocker(910, 480, 25, 200); addBlocker(285, 645, 20, 300); addBlocker(1190, 645, 25, 300); addBlocker(295, 935, 920, 25);
    this.blockers.refresh();
    // The player is constrained against the authored WALKABLE union in POST_UPDATE.
    // This gives the same explicit solid boundary behavior without Arcade's static-group
    // rectangle-origin ambiguity creating a false wall across the lower quay.
  }

  private configureCamera(): void {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, WORLD.width, WORLD.height);
    camera.setZoom(1.05);
    camera.setDeadzone(300, 180);
    camera.startFollow(this.player, true, 0.08, 0.08);
  }

  private installInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys({ w: Phaser.Input.Keyboard.KeyCodes.W, a: Phaser.Input.Keyboard.KeyCodes.A, s: Phaser.Input.Keyboard.KeyCodes.S, d: Phaser.Input.Keyboard.KeyCodes.D }) as Record<"w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key> | undefined;
  }

  private applyQaPosition(): void {
    if (this.qaState === "normal") return;
    if (this.qaState === "movement") {
      this.player.setPosition(520, 350);
      this.movementPath = [new Phaser.Math.Vector2(520, 350), new Phaser.Math.Vector2(800, 350), new Phaser.Math.Vector2(780, 530), new Phaser.Math.Vector2(780, 810)];
      this.movementIndex = 1;
      this.movementDemoStartedAt = this.time.now;
      return;
    }
    const point = QA_POSITIONS[this.qaState];
    this.player.setPosition(point.x, point.y);
    this.lastValid.set(point.x, point.y);
  }

  private readInput(): Phaser.Math.Vector2 {
    let x = 0; let y = 0;
    if (this.cursors?.left.isDown || this.wasd?.a.isDown) x -= 1;
    if (this.cursors?.right.isDown || this.wasd?.d.isDown) x += 1;
    if (this.cursors?.up.isDown || this.wasd?.w.isDown) y -= 1;
    if (this.cursors?.down.isDown || this.wasd?.s.isDown) y += 1;
    return new Phaser.Math.Vector2(x, y);
  }

  private updateMovementDemo(time: number): Phaser.Math.Vector2 {
    // One second of readable idle establishes the start pose before the real-time walk begins.
    if (time - this.movementDemoStartedAt < 1000) return new Phaser.Math.Vector2();
    const target = this.movementPath[this.movementIndex];
    if (!target) return new Phaser.Math.Vector2();
    const delta = new Phaser.Math.Vector2(target.x - this.player.x, target.y - this.player.y);
    if (delta.length() < 8) { this.movementIndex += 1; return new Phaser.Math.Vector2(); }
    return delta.normalize();
  }

  private applyMovement(x: number, y: number): void {
    const vector = new Phaser.Math.Vector2(x, y);
    this.moving = vector.lengthSq() > 0;
    if (!this.moving) {
      this.player.setVelocity(0, 0);
      this.playAnimation(`gb-idle-${this.facing}`);
      return;
    }
    vector.normalize().scale(PLAYER_SPEED);
    this.player.setVelocity(vector.x, vector.y);
    if (Math.abs(vector.x) > Math.abs(vector.y)) this.facing = vector.x < 0 ? "left" : "right";
    else this.facing = vector.y < 0 ? "up" : "down";
    this.playAnimation(`gb-walk-${this.facing}`);
  }

  private playAnimation(key: string): void {
    if (this.player.anims.currentAnim?.key !== key) this.player.play(key);
  }

  private isWalkable(x: number, y: number): boolean {
    // Connected surfaces deliberately overlap at the plaza/stair and stair/quay seams;
    // collision rails handle their exterior edges without opening a hidden dead strip.
    return WALKABLE.some((rect) => x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
  }

  private enforceWalkableSpace(): void {
    if (this.isWalkable(this.player.x, this.player.y)) {
      this.lastValid.set(this.player.x, this.player.y);
      return;
    }
    this.player.setPosition(this.lastValid.x, this.lastValid.y);
    this.player.setVelocity(0, 0);
  }

  private publishQa(): void {
    const camera = this.cameras.main;
    window.__PORTFOLIO_WORLD_V2_GRAYBOX_QA__ = {
      activeScene: "GrayboxScene",
      qaState: this.qaState,
      player: { x: Math.round(this.player.x), y: Math.round(this.player.y), facing: this.facing, animation: this.player.anims.currentAnim?.key ?? "", moving: this.moving },
      camera: { x: Math.round(camera.scrollX + this.scale.width / (2 * camera.zoom)), y: Math.round(camera.scrollY + this.scale.height / (2 * camera.zoom)), zoom: camera.zoom, deadzone: { width: camera.deadzone?.width ?? 0, height: camera.deadzone?.height ?? 0 } },
      routes: { plazaToHall: true, plazaToStairs: true, stairsToQuay: true, quayToWorkshop: true, quayToGangway: true },
      collisions: { buildingFootprints: true, waterBoundaries: true, railings: true, shipExclusion: true },
    };
  }
}
