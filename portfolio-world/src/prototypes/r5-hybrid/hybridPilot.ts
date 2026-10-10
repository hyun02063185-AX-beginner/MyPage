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
type WorldPoint = Readonly<{ x: number; y: number }>;
type ForegroundLayer = Readonly<{ id: string; key: string; x: number; y: number; occlusionFootY: number }>;
type Poi = Readonly<{
  id: string;
  label: string;
  koreanName: string;
  description: string;
  content: string;
  visualAnchor: WorldPoint;
  navigationTarget: WorldPoint;
  interactionRange: number;
  thresholdOnly?: boolean;
}>;
const POIS: readonly Poi[] = [
  { id: "hall", label: "Exhibition Hall", koreanName: "전시관", description: "AX 강의와 교육 프로그램", content: "teaching.html", visualAnchor: { x: 233, y: 175 }, navigationTarget: { x: 175, y: 190 }, interactionRange: 58 },
  { id: "workshop", label: "Workshop", koreanName: "작업실", description: "AI 활용 및 제작 결과물", content: "making.html", visualAnchor: { x: 310, y: 405 }, navigationTarget: { x: 245, y: 440 }, interactionRange: 58 },
  { id: "archive", label: "Harbor Archive", koreanName: "아카이브", description: "AI·AX 개념과 교육 콘텐츠", content: "gallery.html", visualAnchor: { x: 250, y: 528 }, navigationTarget: { x: 180, y: 560 }, interactionRange: 58 },
  // Pilot-only correction: C.2's [1028,355] centre put a 28×16 body on the
  // painted rail edge. This point is the last full-body-safe gangway cell.
  { id: "hero", label: "Hero Ship threshold", koreanName: "히어로십", description: "경력과 전문성의 여정", content: "career.html", visualAnchor: { x: 958, y: 303 }, navigationTarget: { x: 1020, y: 364 }, interactionRange: 58, thresholdOnly: true },
];
const SPAWN_BY_QUERY = new Map(POIS.map((poi) => [poi.id, poi.navigationTarget]));
const hud = {
  status: document.querySelector<HTMLParagraphElement>("#r5-hybrid-status")!,
  prompt: document.querySelector<HTMLParagraphElement>("#r5-hybrid-prompt")!,
  notice: document.querySelector<HTMLParagraphElement>("#r5-hybrid-notice")!,
  visit: document.querySelector<HTMLButtonElement>("#r5-visit-button")!,
};
const markerButtons = new Map(Array.from(document.querySelectorAll<HTMLButtonElement>("[data-world-marker]")).map((button) => [button.dataset.worldMarker!, button]));
const contentPanel = {
  root: document.querySelector<HTMLElement>("#r5-content-panel")!,
  title: document.querySelector<HTMLHeadingElement>("#r5-content-title")!,
  description: document.querySelector<HTMLParagraphElement>("#r5-content-description")!,
  open: document.querySelector<HTMLAnchorElement>("#r5-content-open")!,
};
const FOREGROUND_LAYERS: readonly ForegroundLayer[] = [
  { id: "hall-stairs", key: "hybrid-fore-hall", x: 0, y: 155, occlusionFootY: 242 },
  { id: "workshop-front", key: "hybrid-fore-workshop", x: 0, y: 408, occlusionFootY: 430 },
  { id: "archive-approach", key: "hybrid-fore-archive", x: 0, y: 536, occlusionFootY: 552 },
  { id: "dock-rail", key: "hybrid-fore-dock", x: 429, y: 289, occlusionFootY: 382 },
  { id: "hero-gangway", key: "hybrid-fore-gangway", x: 938, y: 297, occlusionFootY: 368 },
];

class HybridPilotScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private facing: Facing = "front";
  private lastSafe = SPAWN_BY_QUERY.get(new URLSearchParams(window.location.search).get("spawn") ?? "") ?? { x: 245, y: 440 };
  private debugGraphics?: Phaser.GameObjects.Graphics;
  private routeGraphics!: Phaser.GameObjects.Graphics;
  private foregroundLayers: Array<ForegroundLayer & { sprite: Phaser.GameObjects.Image }> = [];
  private autoPath: Point[] = [];
  private waypointIndex = 0;
  private selectedPoi?: Poi;
  private routeGuideEnabled = true;
  private debug = new URLSearchParams(window.location.search).get("debug") === "1";
  private qaFreeze = new URLSearchParams(window.location.search).get("qaFreeze") === "1";
  private overview = new URLSearchParams(window.location.search).get("overview") === "1";
  private rawSideQa = new URLSearchParams(window.location.search).get("rawSideQa") === "1";
  // QA-only baseline; ordinary Pilot play always uses the E2.4 gait sheets.
  private beforeWalkQa = new URLSearchParams(window.location.search).get("walkVersion") === "before";
  private contentPoi?: Poi;

  public constructor() { super("R5HybridPilotScene"); }

  public preload(): void {
    this.load.image("hybrid-plate", scenicPlateUrl);
    this.load.image("hybrid-fore-hall", foreground.hall); this.load.image("hybrid-fore-workshop", foreground.workshop);
    this.load.image("hybrid-fore-archive", foreground.archive); this.load.image("hybrid-fore-dock", foreground.dock); this.load.image("hybrid-fore-gangway", foreground.gangway);
    this.load.image("r4-idle-front", "/assets/canonical-r4/runtime/player/idle-front.png"); this.load.image("r4-idle-back", "/assets/canonical-r4/runtime/player/idle-back.png"); this.load.image("r4-idle-side", "/assets/canonical-r4/runtime/player/idle-side.png");
    // Raw R4 side sprites remain untouched. Pilot-only normalized copies retain pixel aspect ratio,
    // normalize the opaque silhouette, and remove the 12px / 24px walk-frame collapse.
    this.load.image("pilot-idle-side", "/assets/r5-hybrid/pilot-player/side-idle-normalized.png");
    for (const direction of ["front", "back", "side"]) this.load.spritesheet(`r4-walk-${direction}`, `/assets/canonical-r4/runtime/player/walk-${direction}.png`, { frameWidth: 28, frameHeight: 56 });
    this.load.spritesheet("pilot-walk-side", "/assets/r5-hybrid/pilot-player/side-walk-normalized.png", { frameWidth: 28, frameHeight: 56 });
    this.load.spritesheet("pilot-walk-front-v2", "/assets/r5-hybrid/pilot-player/walk-front-v2.png", { frameWidth: 28, frameHeight: 56 });
    this.load.spritesheet("pilot-walk-back-v2", "/assets/r5-hybrid/pilot-player/walk-back-v2.png", { frameWidth: 28, frameHeight: 56 });
    this.load.spritesheet("pilot-walk-side-v2", "/assets/r5-hybrid/pilot-player/walk-side-v2.png", { frameWidth: 28, frameHeight: 56 });
  }

  public create(): void {
    this.add.image(0, 0, "hybrid-plate").setOrigin(0).setDepth(0);
    // Only the foreground occluders are independent assets; the ship remains part of the scenic plate.
    // These are already extracted foreground alpha assets. They are never hidden: their depth is
    // compared to the player's feet so only their real opaque pixels occlude the player.
    this.foregroundLayers = FOREGROUND_LAYERS.map((layer) => ({ ...layer, sprite: this.add.image(layer.x, layer.y, layer.key).setOrigin(0) }));
    this.createAnimations(); this.createPlayer(); this.configureCamera(); this.routeGraphics = this.add.graphics().setDepth(29);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => { if (!this.contentPoi) this.requestAutoMove(pointer.worldX, pointer.worldY); });
    this.game.events.on("hybrid:poi", (id: string) => { const poi = POIS.find((entry) => entry.id === id); if (poi) this.requestAutoMove(poi.navigationTarget.x, poi.navigationTarget.y, poi); });
    this.game.events.on("hybrid:guide", () => { this.routeGuideEnabled = !this.routeGuideEnabled; this.drawRouteGuide(); });
    this.game.events.on("hybrid:visit", () => this.openContentPanel());
    this.game.events.on("hybrid:content-close", () => this.closeContentPanel());
    this.setDebug(this.debug);
    const pose = new URLSearchParams(window.location.search).get("pose") as Facing | null;
    if (pose === "front" || pose === "back" || pose === "left" || pose === "right") { this.facing = pose; this.updateAnimation(0, 0); }
    const routeId = new URLSearchParams(window.location.search).get("route");
    const routePoi = POIS.find((poi) => poi.id === routeId);
    if (routePoi) this.requestAutoMove(routePoi.navigationTarget.x, routePoi.navigationTarget.y, routePoi);
    const qaPanelPoi = POIS.find((poi) => poi.id === new URLSearchParams(window.location.search).get("qaPanel"));
    if (qaPanelPoi) this.openContentPanel(qaPanelPoi);
  }

  public update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.F2)) this.setDebug(!this.debug);
    if (this.contentPoi) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) this.closeContentPanel();
      this.updateAnimation(0, 0); this.player.setDepth(30 + this.player.y / 1000); this.updateForegroundOcclusion(); this.updatePoi(); this.updateDestinationMarkers(); this.updateDebug();
      return;
    }
    const horizontal = (this.keys.RIGHT.isDown || this.keys.D.isDown ? 1 : 0) - (this.keys.LEFT.isDown || this.keys.A.isDown ? 1 : 0);
    const vertical = (this.keys.DOWN.isDown || this.keys.S.isDown ? 1 : 0) - (this.keys.UP.isDown || this.keys.W.isDown ? 1 : 0);
    if (horizontal || vertical) this.cancelAutoMove("Manual control");
    const vector = this.qaFreeze ? new Phaser.Math.Vector2() : horizontal || vertical ? new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(PLAYER.speed) : this.autoMoveVector();
    this.updateAnimation(vector.x, vector.y);
    const seconds = this.game.loop.delta / 1000;
    const next = { x: this.player.x + vector.x * seconds, y: this.player.y + vector.y * seconds };
    if (vector.length() && canOccupyFeet(next.x, next.y) && isMovementSegmentSafe([this.player.x, this.player.y], [next.x, next.y])) { this.player.setPosition(next.x, next.y); (this.player.body as Phaser.Physics.Arcade.Body).updateFromGameObject(); this.lastSafe = next; }
    else if (vector.length() && this.autoPath.length) this.cancelAutoMove("Route blocked — no unsafe shortcut used");
    this.player.setDepth(30 + this.player.y / 1000);
    this.updateForegroundOcclusion(); this.updatePoi(); this.drawRouteGuide(); this.updateDestinationMarkers(); this.updateDebug();
  }

  private createAnimations(): void {
    const idle = (key: string) => !this.anims.exists(key) && this.anims.create({ key, frames: [{ key }], frameRate: 1, repeat: -1 });
    const walk = (key: string, frameCount: number, frameRate: number) => {
      if (!this.anims.exists(key)) this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: frameCount - 1 }), frameRate, repeat: -1 });
    };
    idle("r4-idle-front"); idle("r4-idle-back"); idle("r4-idle-side"); idle("pilot-idle-side");
    walk("r4-walk-front", 4, 8); walk("r4-walk-back", 4, 8); walk("r4-walk-side", 4, 8); walk("pilot-walk-side", 4, 8);
    // 170 world px/s previously advanced 85px in one 0.5s cycle. These rates
    // place a visibly alternating step roughly every 7px of world travel.
    walk("pilot-walk-front-v2", 4, 24); walk("pilot-walk-back-v2", 4, 24); walk("pilot-walk-side-v2", 8, 48);
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(this.lastSafe.x, this.lastSafe.y, "r4-idle-front").setOrigin(.5, 1).setDisplaySize(PLAYER.width, PLAYER.height).setDepth(31);
    const body = this.player.body as Phaser.Physics.Arcade.Body; body.setAllowGravity(false).setSize(28, 16).setOffset(0, 40);
    this.player.play("r4-idle-front");
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,ESC,F2") as Record<string, Phaser.Input.Keyboard.Key>;
  }

  private configureCamera(): void {
    const camera = this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    if (this.overview) { camera.setZoom(.78).centerOn(WORLD.width / 2, WORLD.height / 2); return; }
    camera.setDeadzone(180, 110).startFollow(this.player, true, .12, .12).setZoom(1.25);
  }

  private updateAnimation(vx: number, vy: number): void {
    const moving = vx !== 0 || vy !== 0;
    // A 20% dominance threshold keeps diagonal/corner paths from flickering
    // between FRONT and SIDE on adjacent simulation frames.
    if (moving) {
      if (Math.abs(vx) > Math.abs(vy) * 1.2) this.facing = vx < 0 ? "left" : "right";
      else if (Math.abs(vy) > Math.abs(vx) * 1.2) this.facing = vy < 0 ? "back" : "front";
    }
    const direction = this.facing === "left" || this.facing === "right" ? "side" : this.facing;
    const key = moving
      ? this.beforeWalkQa || (direction === "side" && this.rawSideQa) ? `r4-walk-${direction}` : `pilot-walk-${direction}-v2`
      : `r4-idle-${direction}`;
    this.player.setFlipX(this.facing === "right"); if (this.player.anims.currentAnim?.key !== key) this.player.play(key, true);
    // Texture changes do not own scale/origin/body: the logical player contract does.
    this.player.setDisplaySize(PLAYER.width, PLAYER.height).setOrigin(.5, 1);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(28, 16).setOffset(0, 40);
  }

  private autoMoveVector(): Phaser.Math.Vector2 {
    if (!this.autoPath.length || this.waypointIndex >= this.autoPath.length) return new Phaser.Math.Vector2();
    const target = this.autoPath[this.waypointIndex]; const vector = new Phaser.Math.Vector2(target[0] - this.player.x, target[1] - this.player.y);
    if (vector.length() < 4) { this.waypointIndex += 1; if (this.waypointIndex >= this.autoPath.length) { this.autoPath = []; hud.notice.textContent = this.selectedPoi ? `Arrived: ${this.selectedPoi.label} · press E for preview` : "Arrived"; } return this.autoMoveVector(); }
    return vector.normalize().scale(PLAYER.speed);
  }

  private requestAutoMove(x: number, y: number, poi?: Poi): void {
    if (this.contentPoi) return;
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

  private activePoi(): Poi | undefined { return POIS.find((entry) => Phaser.Math.Distance.Between(this.player.x, this.player.y, entry.navigationTarget.x, entry.navigationTarget.y) < entry.interactionRange); }

  private updatePoi(): void {
    const poi = this.activePoi(); const canVisit = !!poi && !this.autoPath.length && !this.contentPoi;
    hud.prompt.textContent = poi ? `E — ${poi.label.replace(" threshold", "")} 콘텐츠 미리보기` : "";
    hud.visit.hidden = !canVisit; hud.visit.textContent = poi ? `${poi.label.replace(" threshold", "")} 방문` : "방문 콘텐츠 미리보기";
    if (canVisit && Phaser.Input.Keyboard.JustDown(this.keys.E)) this.openContentPanel(poi);
  }

  private openContentPanel(candidate = this.activePoi()): void {
    if (!candidate || this.autoPath.length || this.contentPoi) return;
    this.contentPoi = candidate; contentPanel.title.textContent = `${candidate.label.replace(" threshold", "")} · ${candidate.koreanName}`;
    contentPanel.description.textContent = `${candidate.description}. 새 탭에서 기존 포트폴리오 페이지를 열고, 이 월드 탭에서 같은 위치로 탐색을 계속할 수 있습니다.`;
    contentPanel.open.href = new URL(candidate.content, window.location.href).href;
    contentPanel.root.removeAttribute("hidden"); hud.visit.hidden = true; hud.notice.textContent = `${candidate.label.replace(" threshold", "")} 콘텐츠 안내 열림`;
    contentPanel.open.focus();
  }

  private closeContentPanel(): void {
    if (!this.contentPoi) return;
    const poi = this.contentPoi; this.contentPoi = undefined; contentPanel.root.setAttribute("hidden", ""); hud.notice.textContent = `${poi.label.replace(" threshold", "")}에서 탐색 계속`;
    markerButtons.get(poi.id)?.focus();
  }

  private updateForegroundOcclusion(): void {
    this.foregroundLayers.forEach((layer) => layer.sprite.setDepth(30 + layer.occlusionFootY / 1000));
  }

  private updateDestinationMarkers(): void {
    const camera = this.cameras.main;
    POIS.forEach((poi) => {
      const button = markerButtons.get(poi.id); if (!button) return;
      // DOM buttons are placed in the game root from world coordinates: they follow camera pan and zoom,
      // but remain keyboard focusable and don't become collision or navigation geometry.
      const screenX = (poi.visualAnchor.x - camera.worldView.x) * camera.zoom;
      const screenY = (poi.visualAnchor.y - camera.worldView.y) * camera.zoom;
      const visible = screenX > -150 && screenX < WORLD.width + 150 && screenY > -100 && screenY < WORLD.height + 100;
      button.hidden = !visible; button.style.left = `${(screenX / 1024) * 100}%`; button.style.top = `${(screenY / 576) * 100}%`;
      const selected = this.selectedPoi?.id === poi.id;
      const arrived = selected && !this.autoPath.length && Phaser.Math.Distance.Between(this.player.x, this.player.y, poi.navigationTarget.x, poi.navigationTarget.y) < poi.interactionRange;
      button.classList.toggle("is-selected", selected); button.classList.toggle("is-moving", selected && !!this.autoPath.length); button.classList.toggle("is-arrived", arrived);
      button.classList.toggle("is-right-edge", screenX > 920);
      button.setAttribute("aria-current", selected ? "true" : "false");
      button.dataset.state = arrived ? "arrival" : selected && this.autoPath.length ? "moving" : selected ? "selected" : "default";
    });
  }

  private setDebug(value: boolean): void { this.debug = value; if (value && !this.debugGraphics) this.debugGraphics = this.add.graphics().setDepth(90); if (!value) this.debugGraphics?.clear(); }
  private polygon(graphics: Phaser.GameObjects.Graphics, polygon: Polygon): void { graphics.strokePoints(polygon.map(([x, y]) => new Phaser.Math.Vector2(x, y)), true); }
  private updateDebug(): void {
    const active = activeZoneAt(this.player.x, this.player.y);
    const activePoi = this.activePoi();
    hud.status.textContent = `R5 E2 Hybrid Pilot · ${this.debug ? "DEBUG" : "NORMAL"} · ${active?.id ?? "blocked"} · POI ${activePoi?.label ?? "none"} · ${this.player.x | 0}, ${this.player.y | 0}`;
    if (!this.debug || !this.debugGraphics) return;
    const graphics = this.debugGraphics; graphics.clear(); graphics.lineStyle(2, 0x5df5b8, .9); WALKABLE_ZONES.forEach((zone) => this.polygon(graphics, zone.polygon)); graphics.lineStyle(2, 0xff6d6d, .9); COLLISION_FOOTPRINTS.forEach((zone) => this.polygon(graphics, zone.polygon));
    graphics.lineStyle(2, 0x76d6ff, .8).strokeRect(0, 0, WORLD.width, WORLD.height); graphics.lineStyle(2, 0xffe281, 1).strokeRect(this.player.x - 14, this.player.y - 8, 28, 16); graphics.fillStyle(0xffe281, 1).fillCircle(this.player.x, this.player.y, 3);
    if (active) { graphics.lineStyle(4, 0xffee7d, 1); this.polygon(graphics, active.polygon); }
    POIS.forEach((poi) => { graphics.lineStyle(2, poi === activePoi || poi === this.selectedPoi ? 0xffee7d : 0xffffff, .9); graphics.strokeCircle(poi.navigationTarget.x, poi.navigationTarget.y, 20); });
    this.foregroundLayers.forEach((layer) => { graphics.lineStyle(1, 0xffaa5d, .75); graphics.lineBetween(layer.x, layer.occlusionFootY, layer.x + layer.sprite.width, layer.occlusionFootY); });
    if (this.autoPath.length) { graphics.lineStyle(2, 0xb78cff, 1); this.autoPath.forEach(([x, y], index) => { graphics.strokeCircle(x, y, index === this.waypointIndex ? 7 : 3); }); }
  }
}

const game = new Phaser.Game({ type: Phaser.AUTO, parent: "r5-hybrid-root", width: 1024, height: 576, backgroundColor: "#0d2630", pixelArt: true, roundPixels: true, physics: { default: "arcade", arcade: { debug: false } }, input: { keyboard: { capture: [Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.E, Phaser.Input.Keyboard.KeyCodes.ESC, Phaser.Input.Keyboard.KeyCodes.F2] } }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1024, height: 576 }, scene: [HybridPilotScene] });
document.querySelectorAll<HTMLButtonElement>("[data-poi]").forEach((button) => button.addEventListener("click", () => game.events.emit("hybrid:poi", button.dataset.poi)));
document.querySelector<HTMLButtonElement>("[data-guide]")?.addEventListener("click", () => game.events.emit("hybrid:guide"));
document.querySelectorAll<HTMLButtonElement>("[data-world-marker]").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); game.events.emit("hybrid:poi", button.dataset.worldMarker); }));
document.querySelector<HTMLButtonElement>("[data-guide-close]")?.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); document.querySelector<HTMLElement>("#r5-first-visit-guide")?.setAttribute("hidden", ""); sessionStorage.setItem("r5-hybrid-guide-dismissed", "1"); });
document.querySelector<HTMLButtonElement>("#r5-visit-button")?.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); game.events.emit("hybrid:visit"); });
document.querySelectorAll<HTMLElement>("[data-content-close]").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); game.events.emit("hybrid:content-close"); }));
contentPanel.root.addEventListener("pointerdown", (event) => event.stopPropagation());
contentPanel.open.addEventListener("click", (event) => { event.stopPropagation(); game.events.emit("hybrid:content-close"); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !contentPanel.root.hidden) { event.preventDefault(); event.stopPropagation(); game.events.emit("hybrid:content-close"); } });
if (sessionStorage.getItem("r5-hybrid-guide-dismissed") === "1") document.querySelector<HTMLElement>("#r5-first-visit-guide")?.setAttribute("hidden", "");
