import Phaser from "phaser";
import { canOccupyFeet, isMovementSegmentSafe, type Point } from "../prototypes/r5-hybrid/hybridCollision";
import { findPilotPath } from "../prototypes/r5-hybrid/hybridNavigation";
import { R5_POIS, type R5Poi } from "../world/r5/r5PoiContract";
import { R5_RUNTIME_ASSETS, R5_WORLD } from "../world/r5RuntimeAssets";

type Facing = "front" | "back" | "left" | "right";
type ArrivalState = "IDLE" | "MOVING" | "ARRIVED" | "BLOCKED" | "CANCELLED";

/** Formal R5 navigation. Content opening remains explicitly deferred to Integration C. */
export class R5WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite; private keys!: Record<string, Phaser.Input.Keyboard.Key>; private facing: Facing = "front";
  private route: Point[] = []; private waypointIndex = 0; private selectedPoi?: R5Poi; private state: ArrivalState = "IDLE"; private routeGraphics!: Phaser.GameObjects.Graphics; private routeGuideEnabled = true;
  private status?: HTMLElement; private arrival?: HTMLElement; private markerButtons = new Map<string, HTMLButtonElement>();
  public constructor() { super("R5WorldScene"); }

  public create(): void {
    this.mountRuntimeUi(); const plate = R5_RUNTIME_ASSETS.find((asset) => asset.textureKey === "r5-plate")!;
    this.add.image(plate.x!, plate.y!, plate.textureKey).setOrigin(0).setDepth(plate.depth!);
    for (const layer of R5_RUNTIME_ASSETS.filter((asset) => asset.purpose === "foreground occluder")) this.add.image(layer.x!, layer.y!, layer.textureKey).setOrigin(0).setDepth(layer.depth!);
    this.createApprovedAnimations(); this.createPlayer(); this.routeGraphics = this.add.graphics().setDepth(29);
    this.cameras.main.setBounds(0, 0, R5_WORLD.width, R5_WORLD.height).setDeadzone(180, 110).startFollow(this.player, true, .12, .12).setZoom(R5_WORLD.cameraZoom);
    this.input.on("pointerdown", this.handleGroundPointer, this); this.scale.on(Phaser.Scale.Events.RESIZE, this.updateDestinationMarkers, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroyRuntimeUi, this); this.events.once(Phaser.Scenes.Events.DESTROY, this.destroyRuntimeUi, this);
  }
  public update(_: number, delta: number): void {
    const h = (this.keys.RIGHT.isDown || this.keys.D.isDown ? 1 : 0) - (this.keys.LEFT.isDown || this.keys.A.isDown ? 1 : 0);
    const v = (this.keys.DOWN.isDown || this.keys.S.isDown ? 1 : 0) - (this.keys.UP.isDown || this.keys.W.isDown ? 1 : 0);
    const vector = h || v ? (this.route.length && this.cancelRoute("CANCELLED"), new Phaser.Math.Vector2(h, v).normalize().scale(170)) : this.advanceAutoRoute(delta);
    this.movePlayer(vector, delta); this.player.setDepth(30 + this.player.y / 1000); this.drawRouteGuide(); this.updateArrival(); this.updateDestinationMarkers(); this.updateHud();
  }
  private createPlayer(): void {
    const p = R5_WORLD.previewPlayer; this.player = this.physics.add.sprite(p.x, p.y, "r5-idle-front-v3").setOrigin(.5, 1).setDisplaySize(p.width, p.height).setDepth(30 + p.y / 1000);
    const body = this.player.body as Phaser.Physics.Arcade.Body; body.setAllowGravity(false).setSize(p.bodyWidth, p.bodyHeight).setOffset(0, p.bodyOffsetY); this.player.play("r5-idle-front-v3");
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<string, Phaser.Input.Keyboard.Key>;
  }
  private createApprovedAnimations(): void {
    const idle = (key: string) => !this.anims.exists(key) && this.anims.create({ key, frames: [{ key }], frameRate: 1, repeat: -1 }); const walk = (key: string, rate: number) => !this.anims.exists(key) && this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 7 }), frameRate: rate, repeat: -1 });
    idle("r5-idle-front-v3"); idle("r5-idle-back-v3"); idle("r5-idle-side-v3"); walk("r5-walk-front-v3", 16); walk("r5-walk-back-v3", 16); walk("r5-walk-side-v2", 20);
  }
  private handleGroundPointer(pointer: Phaser.Input.Pointer): void { this.requestRoute(pointer.worldX, pointer.worldY); }
  private requestRoute(x: number, y: number, poi?: R5Poi): void { const result = findPilotPath([this.player.x, this.player.y], [x, y]); this.route = []; this.waypointIndex = 0; this.selectedPoi = poi; if (!result.path.length) { this.state = "BLOCKED"; return; } this.route = result.path.slice(1); this.state = this.route.length ? "MOVING" : "ARRIVED"; }
  /** The old Pilot could overstep a valid waypoint. Cap every step to remaining distance. */
  private advanceAutoRoute(delta: number): Phaser.Math.Vector2 {
    if (!this.route.length || this.waypointIndex >= this.route.length) return new Phaser.Math.Vector2(); const target = this.route[this.waypointIndex]; const vector = new Phaser.Math.Vector2(target[0] - this.player.x, target[1] - this.player.y); const distance = vector.length();
    if (distance < .01) { this.waypointIndex += 1; return this.advanceAutoRoute(delta); } const step = Math.min(170 * delta / 1000, distance); const next = new Phaser.Math.Vector2(this.player.x, this.player.y).add(vector.normalize().scale(step));
    if (!canOccupyFeet(next.x, next.y) || !isMovementSegmentSafe([this.player.x, this.player.y], [next.x, next.y])) { this.cancelRoute("BLOCKED"); return new Phaser.Math.Vector2(); }
    if (step === distance) { this.player.setPosition(target[0], target[1]); (this.player.body as Phaser.Physics.Arcade.Body).updateFromGameObject(); this.waypointIndex += 1; if (this.waypointIndex >= this.route.length) { this.route = []; this.state = "ARRIVED"; } return new Phaser.Math.Vector2(); }
    return vector.normalize().scale(170);
  }
  private movePlayer(vector: Phaser.Math.Vector2, delta: number): void {
    const moving = vector.length() > 0; if (moving) { if (Math.abs(vector.x) > Math.abs(vector.y) * 1.2) this.facing = vector.x < 0 ? "left" : "right"; else if (Math.abs(vector.y) > Math.abs(vector.x) * 1.2) this.facing = vector.y < 0 ? "back" : "front"; const next = { x: this.player.x + vector.x * delta / 1000, y: this.player.y + vector.y * delta / 1000 }; if (canOccupyFeet(next.x, next.y) && isMovementSegmentSafe([this.player.x, this.player.y], [next.x, next.y])) this.player.setPosition(next.x, next.y); else this.cancelRoute("BLOCKED"); }
    const d = this.facing === "left" || this.facing === "right" ? "side" : this.facing; const key = moving ? `r5-walk-${d === "side" ? "side-v2" : `${d}-v3`}` : `r5-idle-${d}-v3`; this.player.setFlipX(this.facing === "right"); if (this.player.anims.currentAnim?.key !== key) this.player.play(key, true);
  }
  private cancelRoute(state: Extract<ArrivalState, "BLOCKED" | "CANCELLED">): void { this.route = []; this.waypointIndex = 0; this.selectedPoi = undefined; this.state = state; }
  private updateArrival(): void { if (this.selectedPoi && this.state === "ARRIVED" && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.selectedPoi.navigationTarget.x, this.selectedPoi.navigationTarget.y) > this.selectedPoi.interactionRange) this.state = "IDLE"; }
  private drawRouteGuide(): void { this.routeGraphics.clear(); if (!this.routeGuideEnabled || !this.route.length) return; const points: Point[] = [[this.player.x, this.player.y], ...this.route.slice(this.waypointIndex)]; this.routeGraphics.lineStyle(3, 0xf7d77c, .72); for (let i = 0; i < points.length - 1; i += 1) { const [a, b] = [points[i], points[i + 1]]; const length = Phaser.Math.Distance.Between(a[0], a[1], b[0], b[1]); for (let offset = 0; offset < length; offset += 16) { const s = offset / length, e = Math.min(offset + 8, length) / length; this.routeGraphics.lineBetween(Phaser.Math.Linear(a[0], b[0], s), Phaser.Math.Linear(a[1], b[1], s), Phaser.Math.Linear(a[0], b[0], e), Phaser.Math.Linear(a[1], b[1], e)); } } }
  private updateHud(): void { if (this.status) this.status.textContent = `R5 Runtime · ${this.state} · ${this.player.x | 0}, ${this.player.y | 0}`; const poi = this.selectedPoi && this.state === "ARRIVED" ? this.selectedPoi : undefined; if (this.arrival) { this.arrival.hidden = !poi; if (poi) this.arrival.textContent = `${poi.label} · ${poi.description} · 콘텐츠 연결은 Integration C에서 예정`; } }
  private mountRuntimeUi(): void {
    const root = document.querySelector<HTMLElement>("#portfolio-world-root"); if (!root) return; this.destroyRuntimeUi(); const notice = document.createElement("p"); notice.id = "r5-integration-a-notice"; notice.textContent = "R5 Integration B Preview · 콘텐츠 연결은 Integration C에서 예정"; const status = document.createElement("p"); status.id = "r5-runtime-status"; const arrival = document.createElement("p"); arrival.id = "r5-runtime-arrival"; arrival.hidden = true; const guideToggle = document.createElement("button"); guideToggle.id = "r5-runtime-route-toggle"; guideToggle.type = "button"; guideToggle.textContent = "Route guide: ON"; guideToggle.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); this.routeGuideEnabled = !this.routeGuideEnabled; guideToggle.textContent = `Route guide: ${this.routeGuideEnabled ? "ON" : "OFF"}`; }); const layer = document.createElement("div"); layer.id = "r5-runtime-marker-layer";
    for (const poi of R5_POIS) { const button = document.createElement("button"); button.type = "button"; button.className = "r5-runtime-marker"; button.dataset.poi = poi.id; const marker = poi.id === "archive" ? "A" : poi.label[0]; button.innerHTML = `<b>${marker}</b><span>${poi.label}<small>${poi.koreanName} · ${poi.description}</small></span>`; button.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); this.requestRoute(poi.navigationTarget.x, poi.navigationTarget.y, poi); }); layer.append(button); this.markerButtons.set(poi.id, button); }
    root.append(notice, status, arrival, guideToggle, layer); this.status = status; this.arrival = arrival;
  }
  private updateDestinationMarkers = (): void => { const root = document.querySelector<HTMLElement>("#portfolio-world-root"), canvas = this.game.canvas; if (!root || !canvas) return; const rootBox = root.getBoundingClientRect(), box = canvas.getBoundingClientRect(), camera = this.cameras.main; for (const poi of R5_POIS) { const b = this.markerButtons.get(poi.id); if (!b) continue; const x = (poi.visualAnchor.x - camera.worldView.x) * camera.zoom, y = (poi.visualAnchor.y - camera.worldView.y) * camera.zoom; b.hidden = x < -150 || x > 1174 || y < -100 || y > 676; b.style.left = `${box.left - rootBox.left + x / 1024 * box.width}px`; b.style.top = `${box.top - rootBox.top + y / 576 * box.height}px`; const selected = this.selectedPoi?.id === poi.id; b.classList.toggle("is-selected", selected); b.classList.toggle("is-moving", selected && this.state === "MOVING"); b.classList.toggle("is-arrived", selected && this.state === "ARRIVED"); } };
  private destroyRuntimeUi(): void { document.querySelectorAll("#r5-integration-a-notice,#r5-runtime-status,#r5-runtime-arrival,#r5-runtime-route-toggle,#r5-runtime-marker-layer").forEach((node) => node.remove()); this.markerButtons.clear(); this.status = undefined; this.arrival = undefined; }
}
