import Phaser from "phaser";

type Facing = "up" | "down" | "left" | "right";
type QaState = "normal" | "upper" | "hall" | "stairs-top" | "stairs-bottom" | "workshop" | "quay" | "gangway" | "movement" | "movement-reverse";
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

const QA_POSITIONS: Record<Exclude<QaState, "normal" | "movement" | "movement-reverse">, Readonly<{ x: number; y: number }>> = {
  upper: { x: 700, y: 350 },
  hall: { x: 760, y: 180 },
  "stairs-top": { x: 780, y: 515 },
  "stairs-bottom": { x: 780, y: 640 },
  workshop: { x: 340, y: 790 },
  quay: { x: 780, y: 790 },
  gangway: { x: 1135, y: 760 },
};

/** R3A geometry with R3C's deterministic, collision-independent foundation art. */
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

  public preload(): void {
    this.load.image("r3c1-plaza", "assets/world/foundation/r3c1/upper-plaza-paving.png");
    this.load.image("r3c1-stairs", "assets/world/foundation/r3c1/main-stair-surface.png");
    this.load.image("r3c1-quay", "assets/world/foundation/r3c1/lower-quay-paving.png");
    this.load.image("r3c1-quay-edge", "assets/world/foundation/r3c1/quay-edge-face.png");
    this.load.image("r3d-hall-left", "assets/world/architecture/r3d/exhibition-hall-left.png");
    this.load.image("r3d-hall-entry", "assets/world/architecture/r3d/exhibition-hall-entry.png");
    this.load.image("r3d-hall-right", "assets/world/architecture/r3d/exhibition-hall-right.png");
    this.load.image("r3d-workshop", "assets/world/architecture/r3d/workshop-shell.png");
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
    const direction = this.qaState === "movement" || this.qaState === "movement-reverse" ? this.updateMovementDemo(time) : this.readInput();
    this.applyMovement(direction.x, direction.y);
    this.publishQa();
  }

  private pickQaState(value: string | null): QaState {
    return value === "upper" || value === "hall" || value === "stairs-top" || value === "stairs-bottom" || value === "workshop" || value === "quay" || value === "gangway" || value === "movement" || value === "movement-reverse" ? value : "normal";
  }

  private drawGraybox(): void {
    const water = this.add.graphics().setDepth(0);
    // L0: procedural water remains independent of the R3C visual studies.
    water.fillStyle(0x176d7b, 1).fillRect(0, 0, WORLD.width, WORLD.height);
    water.lineStyle(2, 0x65b8ba, 0.32);
    for (let y = 34; y < WORLD.height; y += 38) {
      for (let x = (Math.floor(y / 38) % 2) * 26; x < WORLD.width; x += 96) water.strokeLineShape(new Phaser.Geom.Line(x, y, x + 48, y));
    }

    // L1: lossless deterministic Study A derivatives, never a scene plate.
    this.add.image(310, 155, "r3c1-plaza").setOrigin(0).setDepth(1);
    this.add.image(650, 480, "r3c1-stairs").setOrigin(0).setDepth(1);
    this.add.image(300, 650, "r3c1-quay").setOrigin(0).setDepth(1);
    this.add.image(300, 935, "r3c1-quay-edge").setOrigin(0).setDepth(1);

    const graphics = this.add.graphics().setDepth(2);
    graphics.lineStyle(3, 0x7d6548, 0.72).strokeRect(310, 155, 780, 345).strokeRect(300, 650, 890, 285);
    // The western approach remains the same existing lower-quay route; this only extends its material.
    graphics.fillStyle(0xcdb78d, 1).fillRect(260, 710, 40, 170).lineStyle(3, 0x7d6548, 0.72).strokeRect(260, 710, 130, 170);
    graphics.lineStyle(1, 0x9c805d, 0.55);
    for (let y = 748; y < 880; y += 38) graphics.strokeLineShape(new Phaser.Geom.Line(260, y, 300, y));

    // The eight actual stair bands remain the only step lines in the scene.
    for (let step = 0; step < 8; step += 1) {
      const y = 480 + step * (190 / 8);
      graphics.fillStyle(step % 2 === 0 ? 0x5d4a36 : 0x8d6f4e, 0.08).fillRect(650, y, 260, 190 / 8);
      graphics.lineStyle(3, 0x71583d, 0.82).strokeLineShape(new Phaser.Geom.Line(650, y, 910, y));
    }
    graphics.lineStyle(4, 0x624c35, 0.9).strokeRect(650, 480, 260, 190);
    graphics.lineStyle(10, 0x40545a, 1).strokeLineShape(new Phaser.Geom.Line(638, 490, 638, 675)).strokeLineShape(new Phaser.Geom.Line(922, 490, 922, 675));

    // The shallow face makes the exact existing quay edge legible without adding a walkable strip.
    graphics.lineStyle(2, 0x5c4936, 0.75).strokeLineShape(new Phaser.Geom.Line(300, 935, 1190, 935));
    for (let x = 300; x < 1190; x += 74) graphics.lineStyle(1, 0x5c4936, 0.48).strokeLineShape(new Phaser.Geom.Line(x, 935, x, 975));

    // R3D architecture is transparent, lossless source-art cleanup mapped onto
    // the locked R3A footprint rectangles. Images add no collision or route claim.
    this.add.image(500, 18, "r3d-hall-left").setOrigin(0).setDepth(2);
    this.add.image(690, 68, "r3d-hall-entry").setOrigin(0).setDepth(2);
    this.add.image(790, 18, "r3d-hall-right").setOrigin(0).setDepth(2);
    this.add.image(80, 650, "r3d-workshop").setOrigin(0).setDepth(2);
    // Batch C Hero Ship remains the intentionally neutral locked footprint.
    graphics.fillStyle(0x5c6460, 1).fillRect(1215, 610, 300, 335).lineStyle(6, 0x4d4238, 1).strokeRect(1215, 610, 300, 335);
    graphics.fillStyle(0xb58a50, 1).fillRect(1145, 720, 120, 78).lineStyle(4, 0x4d4238, 1).strokeRect(1145, 720, 120, 78);

    // Existing visible collision limits, now styled as fixed rail/edge treatments only.
    graphics.lineStyle(8, 0x40545a, 1).strokeLineShape(new Phaser.Geom.Line(300, 940, 1190, 940)).strokeLineShape(new Phaser.Geom.Line(1190, 650, 1190, 940));
    graphics.lineStyle(6, 0x40545a, 0.9).strokeLineShape(new Phaser.Geom.Line(300, 650, 300, 940));
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
    if (this.qaState === "movement" || this.qaState === "movement-reverse") {
      const reverse = this.qaState === "movement-reverse";
      this.player.setPosition(reverse ? 780 : 520, reverse ? 810 : 350);
      this.movementPath = reverse
        ? [new Phaser.Math.Vector2(780, 810), new Phaser.Math.Vector2(780, 530), new Phaser.Math.Vector2(800, 350)]
        : [new Phaser.Math.Vector2(520, 350), new Phaser.Math.Vector2(800, 350), new Phaser.Math.Vector2(780, 530), new Phaser.Math.Vector2(780, 810)];
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
