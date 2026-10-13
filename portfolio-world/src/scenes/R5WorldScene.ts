import Phaser from "phaser";
import { R5_RUNTIME_ASSETS, R5_WORLD } from "../world/r5RuntimeAssets";

/** Integration A preview only: no navigation, POIs, content links, or Pilot DOM UI. */
export class R5WorldScene extends Phaser.Scene {
  public constructor() { super("R5WorldScene"); }

  public create(): void {
    this.mountPreviewNotice();
    const plate = R5_RUNTIME_ASSETS.find((asset) => asset.textureKey === "r5-plate")!;
    this.add.image(plate.x!, plate.y!, plate.textureKey).setOrigin(0).setDepth(plate.depth!);
    for (const layer of R5_RUNTIME_ASSETS.filter((asset) => asset.purpose === "foreground occluder")) {
      this.add.image(layer.x!, layer.y!, layer.textureKey).setOrigin(0).setDepth(layer.depth!);
    }
    this.createApprovedAnimations();
    const { previewPlayer } = R5_WORLD;
    const player = this.physics.add.sprite(previewPlayer.x, previewPlayer.y, "r5-idle-front-v3").setOrigin(.5, 1).setDisplaySize(previewPlayer.width, previewPlayer.height).setDepth(30 + previewPlayer.y / 1000);
    const body = player.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false).setSize(previewPlayer.bodyWidth, previewPlayer.bodyHeight).setOffset(0, previewPlayer.bodyOffsetY);
    player.play("r5-idle-front-v3");

    this.cameras.main.setBounds(0, 0, R5_WORLD.width, R5_WORLD.height).setZoom(R5_WORLD.cameraZoom).centerOn(512, 360);
    this.add.text(14, 14, "R5 Integration A Preview", { fontFamily: "monospace", fontSize: "14px", color: "#fff8d2", backgroundColor: "#102d36dd", padding: { x: 7, y: 5 } }).setScrollFactor(0).setDepth(100);
  }

  private createApprovedAnimations(): void {
    const idle = (key: string) => !this.anims.exists(key) && this.anims.create({ key, frames: [{ key }], frameRate: 1, repeat: -1 });
    const walk = (key: string, frameRate: number) => !this.anims.exists(key) && this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 7 }), frameRate, repeat: -1 });
    idle("r5-idle-front-v3"); idle("r5-idle-back-v3"); idle("r5-idle-side-v3");
    walk("r5-walk-front-v3", 16); walk("r5-walk-back-v3", 16); walk("r5-walk-side-v2", 20);
  }

  /** QA-only DOM notice is mounted only while this temporary static scene is alive. */
  private mountPreviewNotice(): void {
    const root = document.querySelector<HTMLElement>("#portfolio-world-root");
    if (!root) return;
    const notice = document.createElement("p");
    notice.id = "r5-integration-a-notice";
    notice.textContent = "R5 Integration A Preview · 탐색 및 콘텐츠 기능은 Integration B/C에서 연결 예정";
    root.append(notice);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => notice.remove());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => notice.remove());
  }
}
