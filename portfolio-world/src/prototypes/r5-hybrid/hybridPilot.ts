import Phaser from "phaser";
import "../../world.css";
import { activeZoneAt, canOccupyFeet, COLLISION_FOOTPRINTS, isMovementSegmentSafe, type Point, type Polygon, WALKABLE_ZONES } from "./hybridCollision";
import { findPilotPath } from "./hybridNavigation";

const WORLD = { width: 1280, height: 720 } as const;
const PLAYER = { width: 28, height: 56, speed: 170 } as const;
const scenicPlateUrl = "/assets/r5-hybrid/candidate-b-scenic-plate.png";
const foreground = {
  hall: "/assets/r5-hybrid/hall-stairs-retaining.png",
  workshop: "/assets/r5-hybrid/workshop-foreground.png",
  archive: "/assets/r5-hybrid/archive-approach-foreground.png",
  dock: "/assets/r5-hybrid/dock-piles.png",
  gangway: "/assets/r5-hybrid/gangway.png",
} as const;

type Facing = "front" | "back" | "left" | "right";
type Poi = Readonly<{ id: string; label: string; content: string; x: number; y: number; thresholdOnly?: boolean }>;
const POIS: readonly Poi[] = [
  { id: "hall", label: "Exhibition Hall", content: "teaching.html", x: 175, y: 190 },
  { id: "workshop", label: "Workshop", content: "making.html", x: 245, y: 440 },
  { id: "archive", label: "Harbor Archive", content: "gallery.html", x: 180, y: 560 },
  // Pilot-only correction: C.2's [1028,355] centre put a 28×16 body on the
  // painted rail edge. This point is the last full-body-safe gangway cell.
  { id: "hero", label: "Hero Ship threshold", content: "career.html", x: 1020, y: 364, thresholdOnly: true },
];
const SPAWN_BY_QUERY = new Map(POIS.map((poi) => [poi.id, { x: poi.x, y: poi.y }]));
const hud = {
  status: document.querySelector<HTMLParagraphElement>("#r5-hybrid-status")!,
  prompt: document.querySelector<HTMLParagraphElement>("#r5-hybrid-prompt")!,
  notice: document.querySelector<HTMLParagraphElement>("#r5-hybrid-notice")!,
};

class HybridPilotScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private facing: Facing = "front";
  private lastSafe = SPAWN_BY_QUERY.get(new URLSearchParams(window.location.search).get("spawn") ?? "") ?? { x: 245, y: 440 };
  private debugGraphics?: Phaser.GameObjects.Graphics;
  private routeGraphics!: Phaser.GameObjects.Graphics;
  private autoPath: Point[] = [];
  private waypointIndex = 0;
  private selectedPoi?: Poi;
  private routeGuideEnabled = true;
  private debug = new URLSearchParams(window.location.search).get("debug") === "1";

  public constructor() { super("R5HybridPilotScene"); }

  public preload(): void {
    this.load.image("hybrid-plate", scenicPlateUrl);
    this.load.image("hybrid-fore-hall", foreground.hall); this.load.image("hybrid-fore-workshop", foreground.workshop);
    this.load.image("hybrid-fore-archive", foreground.archive); this.load.image("hybrid-fore-dock", foreground.dock); this.load.image("hybrid-fore-gangway", foreground.gangway);
    this.load.image("r4-idle-front", "/assets/canonical-r4/runtime/player/idle-front.png"); this.load.image("r4-idle-back", "/assets/canonical-r4/runtime/player/idle-back.png"); this.load.image("r4-idle-side", "/assets/canonical-r4/runtime/player/idle-side.png");
    for (const direction of ["front", "back", "side"]) this.load.spritesheet(`r4-walk-${direction}`, `/assets/canonical-r4/runtime/player/walk-${direction}.png`, { frameWidth: 28, frameHeight: 56 });
  }

  public create(): void {
    this.add.image(0, 0, "hybrid-plate").setOrigin(0).setDepth(0);
    // Only the foreground occluders are independent assets; the ship remains part of the scenic plate.
    this.add.image(0, 155, "hybrid-fore-hall").setOrigin(0).setDepth(20);
    this.add.image(0, 408, "hybrid-fore-workshop").setOrigin(0).setDepth(22);
    this.add.image(0, 536, "hybrid-fore-archive").setOrigin(0).setDepth(24);
    this.add.image(429, 289, "hybrid-fore-dock").setOrigin(0).setDepth(26);
    this.add.image(938, 297, "hybrid-fore-gangway").setOrigin(0).setDepth(28);
    this.createAnimations(); this.createPlayer(); this.configureCamera(); this.routeGraphics = this.add.graphics().setDepth(29);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => this.requestAutoMove(pointer.worldX, pointer.worldY));
    this.game.events.on("hybrid:poi", (id: string) => { const poi = POIS.find((entry) => entry.id === id); if (poi) this.requestAutoMove(poi.x, poi.y, poi); });
    this.game.events.on("hybrid:guide", () => { this.routeGuideEnabled = !this.routeGuideEnabled; this.drawRouteGuide(); });
    this.setDebug(this.debug);
    const routeId = new URLSearchParams(window.location.search).get("route");
    const routePoi = POIS.find((poi) => poi.id === routeId);
    if (routePoi) this.requestAutoMove(routePoi.x, routePoi.y, routePoi);
  }

  public update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.F2)) this.setDebug(!this.debug);
    const horizontal = (this.keys.RIGHT.isDown || this.keys.D.isDown ? 1 : 0) - (this.keys.LEFT.isDown || this.keys.A.isDown ? 1 : 0);
    const vertical = (this.keys.DOWN.isDown || this.keys.S.isDown ? 1 : 0) - (this.keys.UP.isDown || this.keys.W.isDown ? 1 : 0);
    if (horizontal || vertical) this.cancelAutoMove("Manual control");
    const vector = horizontal || vertical ? new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(PLAYER.speed) : this.autoMoveVector();
    this.updateAnimation(vector.x, vector.y);
    const seconds = this.game.loop.delta / 1000;
    const next = { x: this.player.x + vector.x * seconds, y: this.player.y + vector.y * seconds };
    if (vector.length() && canOccupyFeet(next.x, next.y) && isMovementSegmentSafe([this.player.x, this.player.y], [next.x, next.y])) { this.player.setPosition(next.x, next.y); (this.player.body as Phaser.Physics.Arcade.Body).updateFromGameObject(); this.lastSafe = next; }
    else if (vector.length() && this.autoPath.length) this.cancelAutoMove("Route blocked — no unsafe shortcut used");
    this.player.setDepth(30 + this.player.y / 1000);
    this.updatePoi(); this.drawRouteGuide(); this.updateDebug();
  }

  private createAnimations(): void {
    const idle = (key: string) => !this.anims.exists(key) && this.anims.create({ key, frames: [{ key }], frameRate: 1, repeat: -1 });
    const walk = (direction: "front" | "back" | "side") => { const key = `r4-walk-${direction}`; if (!this.anims.exists(key)) this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }), frameRate: 8, repeat: -1 }); };
    idle("r4-idle-front"); idle("r4-idle-back"); idle("r4-idle-side"); walk("front"); walk("back"); walk("side");
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(this.lastSafe.x, this.lastSafe.y, "r4-idle-front").setOrigin(.5, 1).setDisplaySize(PLAYER.width, PLAYER.height).setDepth(31);
    const body = this.player.body as Phaser.Physics.Arcade.Body; body.setAllowGravity(false).setSize(28, 16).setOffset(0, 40);
    this.player.play("r4-idle-front");
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,F2") as Record<string, Phaser.Input.Keyboard.Key>;
  }

  private configureCamera(): void { this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height).setDeadzone(180, 110).startFollow(this.player, true, .12, .12).setZoom(1.25); }

  private updateAnimation(vx: number, vy: number): void {
    const moving = vx !== 0 || vy !== 0;
    if (moving) { if (Math.abs(vx) > Math.abs(vy)) this.facing = vx < 0 ? "left" : "right"; else this.facing = vy < 0 ? "back" : "front"; }
    const direction = this.facing === "left" || this.facing === "right" ? "side" : this.facing;
    const key = `r4-${moving ? "walk" : "idle"}-${direction}`; this.player.setFlipX(this.facing === "right"); if (this.player.anims.currentAnim?.key !== key) this.player.play(key, true);
    // Texture changes do not own scale/origin/body: the logical player contract does.
    this.player.setDisplaySize(PLAYER.width, PLAYER.height).setOrigin(.5, 1);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(28, 16).setOffset(0, 40);
  }

  private autoMoveVector(): Phaser.Math.Vector2 {
    if (!this.autoPath.length || this.waypointIndex >= this.autoPath.length) return new Phaser.Math.Vector2();
    const target = this.autoPath[this.waypointIndex]; const vector = new Phaser.Math.Vector2(target[0] - this.player.x, target[1] - this.player.y);
    if (vector.length() < 4) { this.waypointIndex += 1; if (this.waypointIndex >= this.autoPath.length) { this.autoPath = []; hud.notice.textContent = this.selectedPoi ? `Arrived: ${this.selectedPoi.label} · press E for preview` : "Arrived"; this.selectedPoi = undefined; } return this.autoMoveVector(); }
    return vector.normalize().scale(PLAYER.speed);
  }

  private requestAutoMove(x: number, y: number, poi?: Poi): void {
    const result = findPilotPath([this.player.x, this.player.y], [x, y]);
    if (!result.path.length) { this.autoPath = []; this.selectedPoi = undefined; hud.notice.textContent = result.reason === "invalid-target" ? "That point is not a visible walkable surface." : "No safe route exists to that point."; return; }
    this.autoPath = result.path.slice(1); this.waypointIndex = 0; this.selectedPoi = poi; hud.notice.textContent = poi ? `Route: ${poi.label}` : "Route set — use any movement key to take over.";
  }

  private cancelAutoMove(message?: string): void { if (!this.autoPath.length) return; this.autoPath = []; this.selectedPoi = undefined; if (message) hud.notice.textContent = message; }

  private drawRouteGuide(): void {
    this.routeGraphics.clear(); if (!this.routeGuideEnabled || !this.autoPath.length) return;
    const points: Point[] = [[this.player.x, this.player.y], ...this.autoPath.slice(this.waypointIndex)]; this.routeGraphics.lineStyle(3, 0xf7d77c, .72);
    for (let index = 0; index < points.length - 1; index += 1) { const [from, to] = [points[index], points[index + 1]]; const length = Phaser.Math.Distance.Between(from[0], from[1], to[0], to[1]); for (let offset = 0; offset < length; offset += 16) { const start = offset / length; const end = Math.min(offset + 8, length) / length; this.routeGraphics.lineBetween(Phaser.Math.Linear(from[0], to[0], start), Phaser.Math.Linear(from[1], to[1], start), Phaser.Math.Linear(from[0], to[0], end), Phaser.Math.Linear(from[1], to[1], end)); } }
  }

  private updatePoi(): void {
    const poi = POIS.find((entry) => Phaser.Math.Distance.Between(this.player.x, this.player.y, entry.x, entry.y) < 58);
    hud.prompt.textContent = poi ? `[E] ${poi.label} · ${poi.content}` : "";
    if (poi && Phaser.Input.Keyboard.JustDown(this.keys.E)) { hud.notice.textContent = `${poi.label}: test-only content mapping → ${poi.content}${poi.thresholdOnly ? " · threshold only, deck blocked" : ""}`; this.time.delayedCall(2400, () => { hud.notice.textContent = ""; }); }
  }

  private setDebug(value: boolean): void { this.debug = value; if (value && !this.debugGraphics) this.debugGraphics = this.add.graphics().setDepth(90); if (!value) this.debugGraphics?.clear(); }
  private polygon(graphics: Phaser.GameObjects.Graphics, polygon: Polygon): void { graphics.strokePoints(polygon.map(([x, y]) => new Phaser.Math.Vector2(x, y)), true); }
  private updateDebug(): void {
    const active = activeZoneAt(this.player.x, this.player.y);
    const activePoi = POIS.find((entry) => Phaser.Math.Distance.Between(this.player.x, this.player.y, entry.x, entry.y) < 58);
    hud.status.textContent = `R5 E2 Hybrid Pilot · ${this.debug ? "DEBUG" : "NORMAL"} · ${active?.id ?? "blocked"} · POI ${activePoi?.label ?? "none"} · ${this.player.x | 0}, ${this.player.y | 0}`;
    if (!this.debug || !this.debugGraphics) return;
    const graphics = this.debugGraphics; graphics.clear(); graphics.lineStyle(2, 0x5df5b8, .9); WALKABLE_ZONES.forEach((zone) => this.polygon(graphics, zone.polygon)); graphics.lineStyle(2, 0xff6d6d, .9); COLLISION_FOOTPRINTS.forEach((zone) => this.polygon(graphics, zone.polygon));
    graphics.lineStyle(2, 0x76d6ff, .8).strokeRect(0, 0, WORLD.width, WORLD.height); graphics.lineStyle(2, 0xffe281, 1).strokeRect(this.player.x - 14, this.player.y - 8, 28, 16); graphics.fillStyle(0xffe281, 1).fillCircle(this.player.x, this.player.y, 3);
    if (active) { graphics.lineStyle(4, 0xffee7d, 1); this.polygon(graphics, active.polygon); }
    POIS.forEach((poi) => { graphics.lineStyle(2, poi === activePoi || poi === this.selectedPoi ? 0xffee7d : 0xffffff, .9); graphics.strokeCircle(poi.x, poi.y, 20); });
    if (this.autoPath.length) { graphics.lineStyle(2, 0xb78cff, 1); this.autoPath.forEach(([x, y], index) => { graphics.strokeCircle(x, y, index === this.waypointIndex ? 7 : 3); }); }
  }
}

const game = new Phaser.Game({ type: Phaser.AUTO, parent: "r5-hybrid-root", width: 1024, height: 576, backgroundColor: "#0d2630", pixelArt: true, roundPixels: true, physics: { default: "arcade", arcade: { debug: false } }, input: { keyboard: { capture: [Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.E, Phaser.Input.Keyboard.KeyCodes.F2] } }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1024, height: 576 }, scene: [HybridPilotScene] });
document.querySelectorAll<HTMLButtonElement>("[data-poi]").forEach((button) => button.addEventListener("click", () => game.events.emit("hybrid:poi", button.dataset.poi)));
document.querySelector<HTMLButtonElement>("[data-guide]")?.addEventListener("click", () => game.events.emit("hybrid:guide"));
