import Phaser from "phaser";
import {
  CAMERA_LERP_X,
  CAMERA_LERP_Y,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/gameConfig";
import { Player } from "../player/Player";
import {
  drawHarborBuilding,
  drawHarborEdgeTreatment,
  drawHarborGround,
  drawHarborNaturalizedGroundDetails,
  drawHarborPath,
  drawHarborPlaza,
  drawHarborVisual,
} from "../world/harborVisualCatalog";
import {
  getCalibrationAssets,
  getHeroShipAsset,
  WORLD_ASSETS,
} from "../world/worldAssetManifest";
import type { WorldAssetEntry } from "../world/worldAssetManifest";
import {
  getBuildingDepth,
  getHeroShipWaterlineY,
  getHarborVisualDepth,
  getVesselDepth,
  getWorldLabelDepth,
  WORLD_DEPTH,
} from "../world/worldDepth.mjs";
import { WORLD_LAYOUT } from "../world/worldLayout";
import { getFleetPresentation } from "../world/fleetPresentation.mjs";
import {
  getNaturalizedBuilding,
  NATURALIZED_SCALE_REVIEW_SPAWNS,
} from "../world/layoutNaturalization";
import {
  getDestinationAtPoint,
  getActivatedDestinationUrl,
  getDestinationPrompt,
} from "../world/destinationNavigation.mjs";

type MovementKeys = Record<
  "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d",
  Phaser.Input.Keyboard.Key
>;

type InteractionKeys = Record<"enter" | "e", Phaser.Input.Keyboard.Key>;

type ScaleReviewView = "guild" | "academy" | "workshop" | "exhibition" | "tree" | "props" | "world";

/** Dev-only player/door evidence positions; runtime layout and collision stay untouched. */
const SCALE_REVIEW_SPAWNS: Readonly<Record<Exclude<ScaleReviewView, "world">, Readonly<{ x: number; y: number }>>> = {
  ...NATURALIZED_SCALE_REVIEW_SPAWNS,
  tree: { x: 968, y: 344 },
  props: { x: 816, y: 1000 },
};

const getScaleReviewView = (): ScaleReviewView | undefined => {
  if (!import.meta.env.DEV || new URLSearchParams(window.location.search).get("assetPreview") !== "scaleReview") {
    return undefined;
  }
  const view = new URLSearchParams(window.location.search).get("scaleView");
  return view === "guild" || view === "academy" || view === "workshop" || view === "exhibition" || view === "tree" || view === "props" || view === "world"
    ? view
    : undefined;
};

const getSecondarySailingAsset = (id: string) => {
  switch (id) {
    case "harbor-west-merchant-brig":
    case "harbor-east-merchant-brig":
      return WORLD_ASSETS.secondaryBrig;
    case "harbor-west-cargo-schooner":
      return WORLD_ASSETS.mediumSailingVessel;
    case "harbor-east-harbor-cutter":
      return WORLD_ASSETS.secondaryCutter;
    case "harbor-small-workboat": return WORLD_ASSETS.smallWorkboat;
    case "harbor-dinghy": return WORLD_ASSETS.harborDinghy;
    default:
      return undefined;
  }
};

const getBatch01BuildingAsset = (id: string): WorldAssetEntry | undefined => {
  switch (id) {
    case "career": return WORLD_ASSETS.guildHall;
    case "lecture": return WORLD_ASSETS.academy;
    case "ai-lab": return WORLD_ASSETS.workshop;
    default: return undefined;
  }
};

/** One deliberately chosen runtime reference per non-building Batch 01 category. */
const getBatch01VisualAsset = (id: string): WorldAssetEntry | undefined => {
  switch (id) {
    case "harbor-warehouse": return WORLD_ASSETS.harborWarehouse;
    case "academy-tree": return WORLD_ASSETS.harborTree;
    case "dock-crates-west": return WORLD_ASSETS.cargoCrate;
    case "waterfront-viewing-lamp": return WORLD_ASSETS.harborLamp;
    default: return undefined;
  }
};

/** Batch 02 replaces only its new support/street placements, keeping accepted art intact. */
const getBatch02VisualAsset = (id: string): WorldAssetEntry | undefined => {
  switch (id) {
    case "harbor-warehouse-annex": return WORLD_ASSETS.harborWarehouseAnnex;
    case "harbor-service-hut": return WORLD_ASSETS.harborServiceHut;
    case "harbor-cargo-stack": return WORLD_ASSETS.harborCargoStack;
    case "harbor-barrel-cluster": return WORLD_ASSETS.harborBarrelCluster;
    case "harbor-rope-coil": return WORLD_ASSETS.harborRopeCoil;
    case "harbor-bench": return WORLD_ASSETS.harborBench;
    case "harbor-notice-board": return WORLD_ASSETS.harborNoticeBoard;
    case "harbor-safety-rail": return WORLD_ASSETS.harborSafetyRail;
    case "harbor-tree-02": return WORLD_ASSETS.harborTree02;
    case "harbor-shrub-planter": return WORLD_ASSETS.harborShrubPlanter;
    case "harbor-mooring-bollard": return WORLD_ASSETS.harborMooringBollard;
    case "harbor-service-marker": return WORLD_ASSETS.harborServiceMarker;
    default: return undefined;
  }
};

const getBatch03VisualAsset = (id: string): WorldAssetEntry | undefined => ({
  "dock-rope-line": WORLD_ASSETS.dockRopeLine, "dock-gangplank": WORLD_ASSETS.dockGangplank,
  "dock-buoy": WORLD_ASSETS.dockBuoy, "dock-hand-cart": WORLD_ASSETS.dockHandCart,
  "dock-work-net": WORLD_ASSETS.dockWorkNet,
}[id]);

/** Batch 04 deliberately reuses existing civic/greenery art; no new runtime asset is needed. */
const getBatch04VisualAsset = (id: string): WorldAssetEntry | undefined => ({
  "guild-edge-tree": WORLD_ASSETS.harborTree02,
  "academy-garden-tree-west": WORLD_ASSETS.harborTree02,
  "workshop-transition-planter": WORLD_ASSETS.harborShrubPlanter,
  "exhibition-promenade-planter-east": WORLD_ASSETS.harborShrubPlanter,
}[id]);

const getProductionVisualAsset = (id: string): WorldAssetEntry | undefined =>
  getBatch04VisualAsset(id) ?? getBatch03VisualAsset(id) ?? getBatch02VisualAsset(id) ?? getBatch01VisualAsset(id);

/** Orchestrates layout, focused harbor visuals, collision, input, and camera. */
export class WorldScene extends Phaser.Scene {
  private player?: Player;
  private movementKeys?: MovementKeys;
  private interactionKeys?: InteractionKeys;
  private activeDestination?: ReturnType<typeof getDestinationAtPoint>;
  private interactionPrompt?: Phaser.GameObjects.Text;

  public constructor() {
    super("WorldScene");
  }

  public create(): void {
    this.renderWorld();
    this.createPlayer();
    this.createEnvironmentalCollision();
    this.configureCamera();
    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.activatePointerDestination, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.resetMovementKeys, this);
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.constrainPlayer, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.disposeInput, this);
  }

  public update(): void {
    if (!this.player || !this.movementKeys) {
      return;
    }

    this.player.update({
      left: this.movementKeys.left.isDown || this.movementKeys.a.isDown,
      right: this.movementKeys.right.isDown || this.movementKeys.d.isDown,
      up: this.movementKeys.up.isDown || this.movementKeys.w.isDown,
      down: this.movementKeys.down.isDown || this.movementKeys.s.isDown,
    });
    this.updateDestinationInteraction();
  }

  private createPlayer(): void {
    const reviewSpawn = getScaleReviewView();
    const spawn = reviewSpawn && reviewSpawn !== "world"
      ? SCALE_REVIEW_SPAWNS[reviewSpawn]
      : WORLD_LAYOUT.playerSpawn;
    this.player = new Player(
      this,
      spawn.x,
      spawn.y,
    );
    this.movementKeys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as MovementKeys | undefined;
    this.interactionKeys = this.input.keyboard?.addKeys({
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      e: Phaser.Input.Keyboard.KeyCodes.E,
    }) as InteractionKeys | undefined;
    this.interactionPrompt = this.add
      .text(0, 0, "", {
        align: "center",
        backgroundColor: "#122033",
        color: "#f5c96a",
        fontFamily: "monospace",
        fontSize: "14px",
        padding: { x: 6, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(WORLD_DEPTH.HTML_UI)
      .setVisible(false);
  }

  /** Forecourts make a destination available; only an explicit key or click navigates. */
  private updateDestinationInteraction(): void {
    if (!this.player) {
      return;
    }
    const nextDestination = getDestinationAtPoint(WORLD_LAYOUT, this.player.gameObject);
    this.activeDestination = nextDestination;
    const status = document.getElementById("destination-interaction");
    if (!nextDestination) {
      this.interactionPrompt?.setVisible(false);
      if (status) status.textContent = "";
      return;
    }

    const prompt = getDestinationPrompt(nextDestination);
    this.interactionPrompt
      ?.setText(prompt)
      .setPosition(this.player.gameObject.x, this.player.gameObject.y - 36)
      .setVisible(true);
    if (status) status.textContent = prompt;
    if (
      this.interactionKeys
      && (Phaser.Input.Keyboard.JustDown(this.interactionKeys.enter) || Phaser.Input.Keyboard.JustDown(this.interactionKeys.e))
    ) {
      this.navigateToDestination(nextDestination);
    }
  }

  private activatePointerDestination(pointer: Phaser.Input.Pointer): void {
    const destination = this.activeDestination;
    if (destination && pointer && pointer.worldX >= destination.interactionRect.x - destination.interactionRect.width / 2
      && pointer.worldX <= destination.interactionRect.x + destination.interactionRect.width / 2
      && pointer.worldY >= destination.interactionRect.y - destination.interactionRect.height / 2
      && pointer.worldY <= destination.interactionRect.y + destination.interactionRect.height / 2) {
      this.navigateToDestination(destination);
    }
  }

  private navigateToDestination(destination: NonNullable<ReturnType<typeof getDestinationAtPoint>>): void {
    const target = getActivatedDestinationUrl(destination, true, window.location.href);
    if (target) {
      window.location.assign(target);
    }
  }

  private createEnvironmentalCollision(): void {
    if (!this.player) {
      return;
    }

    const collidablePlacements = [
      ...WORLD_LAYOUT.buildings,
      ...WORLD_LAYOUT.harborVisuals.filter(
        (visual) => visual.collidable && visual.type !== "water",
      ),
      ...WORLD_LAYOUT.waterCollisionRects,
    ];
    const colliderObjects = collidablePlacements.map((placement) =>
      this.add
        .rectangle(placement.x, placement.y, placement.width, placement.height, 0x000000, 0)
        .setVisible(false),
    );
    const staticEnvironment = this.physics.add.staticGroup(colliderObjects);
    this.physics.add.collider(this.player.gameObject, staticEnvironment);
  }

  /** Phaser emits this on browser/game blur; reset prevents a held key sticking. */
  private resetMovementKeys(): void {
    this.input.keyboard?.resetKeys();
    this.player?.stop();
  }

  private constrainPlayer(): void {
    this.player?.constrainToWorldBounds();
  }

  private disposeInput(): void {
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.activatePointerDestination, this);
    this.game.events.off(Phaser.Core.Events.BLUR, this.resetMovementKeys, this);
    this.events.off(Phaser.Scenes.Events.POST_UPDATE, this.constrainPlayer, this);
  }

  private configureCamera(): void {
    if (!this.player) {
      return;
    }

    this.cameras.main
      .setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
      .startFollow(this.player.gameObject, true, CAMERA_LERP_X, CAMERA_LERP_Y);
    this.cameras.main.roundPixels = true;

    // Dev-only controlled calibration surface. It is removed from production along with
    // getCalibrationAssets' DEV branch and never changes world layout/collision data.
    if (
      import.meta.env.DEV &&
      getCalibrationAssets(window.location.search) &&
      new URLSearchParams(window.location.search).get("assetPreview") === "calibration"
    ) {
      this.cameras.main.stopFollow().setZoom(0.7).centerOn(1050, 576);
      return;
    }

    // Undocumented QA framing for ship A/B/C comparison; normal play keeps camera follow.
    if (
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).get("assetPreview") === "harbor"
    ) {
      // Frame all three calibration subjects in their real harbor placement.
      this.cameras.main.stopFollow().setZoom(0.6).centerOn(1024, 1050);
    }

    if (
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).get("assetPreview") === "batch01"
    ) {
      const view = new URLSearchParams(window.location.search).get("batchView") ?? "harbor";
      const framing = {
        harbor: [1024, 1050, 0.6],
        guild: [224, 640, 1],
        academy: [1024, 224, 1],
        workshop: [1824, 640, 1],
        warehouse: [224, 976, 1],
        props: [816, 1080, 1],
      } as const;
      const [x, y, zoom] = framing[view as keyof typeof framing] ?? framing.harbor;
      this.cameras.main.stopFollow().setZoom(zoom).centerOn(x, y);
    }

    const scaleReview = getScaleReviewView();
    if (scaleReview) {
      if (scaleReview === "world") {
        this.cameras.main.stopFollow().setZoom(0.4).centerOn(1024, 640);
        return;
      }
      const { x, y } = SCALE_REVIEW_SPAWNS[scaleReview];
      this.cameras.main.stopFollow().setZoom(1.1).centerOn(x, y - 36);
    }
  }

  private renderWorld(): void {
    const calibration = getCalibrationAssets(window.location.search);
    drawHarborGround(this);
    for (const visual of WORLD_LAYOUT.harborVisuals.filter((item) => item.type === "water")) {
      drawHarborVisual(this, visual);
    }
    drawHarborEdgeTreatment(this, WORLD_LAYOUT.edgeDecorations);
    for (const path of WORLD_LAYOUT.paths) {
      drawHarborPath(this, path);
    }
    for (const forecourt of WORLD_LAYOUT.forecourts) {
      drawHarborPath(this, forecourt, true);
    }
    drawHarborPlaza(this, WORLD_LAYOUT.centralPlaza);
    drawHarborNaturalizedGroundDetails(this);
    for (const building of WORLD_LAYOUT.buildings) {
      const visualBuilding = getNaturalizedBuilding(building);
      const batchBuildingAsset = getBatch01BuildingAsset(building.id);
      if (batchBuildingAsset && this.textures.exists(batchBuildingAsset.textureKey)) {
        continue;
      }
      if (building.id === "gallery" && this.textures.exists(
        calibration?.exhibitionHall.textureKey ?? WORLD_ASSETS.exhibitionHall.textureKey,
      )) {
        continue;
      }
      drawHarborBuilding(this, visualBuilding);
    }
    for (const visual of WORLD_LAYOUT.harborVisuals.filter((item) => item.type !== "water")) {
      const batchVisualAsset = getProductionVisualAsset(visual.id);
      if (batchVisualAsset && this.textures.exists(batchVisualAsset.textureKey)) {
        continue;
      }
      if (visual.type === "large-ship" && this.textures.exists(
        calibration?.heroShipD.textureKey ?? getHeroShipAsset(window.location.search).textureKey,
      )) {
        continue;
      }
      if (visual.type === "warehouse" && calibration && this.textures.exists(calibration.warehouse.textureKey)) {
        continue;
      }
      const secondaryAsset = visual.type === "secondary-sailing-ship"
        ? getSecondarySailingAsset(visual.id)
        : undefined;
      if (secondaryAsset && this.textures.exists(secondaryAsset.textureKey)) {
        continue;
      }
      drawHarborVisual(this, visual);
    }
    this.drawAssetSlice();
    this.drawControlledCalibrationSurface();
  }

  /** Asset graphics intentionally replace only their matching programmatic fallbacks. */
  private drawAssetSlice(): void {
    const ship = WORLD_LAYOUT.harborVisuals.find((visual) => visual.type === "large-ship");
    const calibration = getCalibrationAssets(window.location.search);
    const heroShipAsset = calibration?.heroShipD ?? getHeroShipAsset(window.location.search);

    for (const building of WORLD_LAYOUT.buildings) {
      const visualBuilding = getNaturalizedBuilding(building);
      const asset = building.id === "gallery"
        ? calibration?.exhibitionHall ?? WORLD_ASSETS.exhibitionHall
        : getBatch01BuildingAsset(building.id);
      if (!asset || !this.textures.exists(asset.textureKey)) {
        continue;
      }
      this.add
        .image(visualBuilding.x, visualBuilding.y + visualBuilding.height / 2, asset.textureKey)
        .setOrigin(0.5, asset.originY)
        .setDisplaySize(asset.displayWidth, asset.displayHeight)
        .setDepth(getBuildingDepth(visualBuilding));
      this.add
        .text(visualBuilding.x, visualBuilding.y + visualBuilding.height / 2 - 16, building.label, {
          align: "center",
          color: "#213840",
          fontFamily: "monospace",
          fontSize: "14px",
          fontStyle: "bold",
          wordWrap: { width: building.width - 32 },
        })
        .setOrigin(0.5)
        .setDepth(getWorldLabelDepth(building.id));
    }

    if (ship && this.textures.exists(heroShipAsset.textureKey)) {
      const presentation = getFleetPresentation(ship.id);
      this.add
        .image(ship.x, getHeroShipWaterlineY(ship), heroShipAsset.textureKey)
        .setOrigin(0.5, heroShipAsset.originY)
        .setDisplaySize(
          heroShipAsset.displayWidth * (presentation?.scale ?? 1),
          heroShipAsset.displayHeight * (presentation?.scale ?? 1),
        )
        .setFlipX(presentation?.facing === "left")
        .setDepth(getVesselDepth(getHeroShipWaterlineY(ship), ship.id));
    }

    const warehouse = WORLD_LAYOUT.harborVisuals.find((visual) => visual.type === "warehouse");
    const warehouseAsset = calibration?.warehouse ?? WORLD_ASSETS.harborWarehouse;
    if (warehouse && this.textures.exists(warehouseAsset.textureKey)) {
      this.add
        .image(warehouse.x, warehouse.y + warehouse.height / 2, warehouseAsset.textureKey)
        .setOrigin(0.5, warehouseAsset.originY)
        .setDisplaySize(warehouseAsset.displayWidth, warehouseAsset.displayHeight)
        .setDepth(getHarborVisualDepth(warehouse));
    }

    for (const vessel of WORLD_LAYOUT.harborVisuals.filter(
      (visual) => visual.type === "secondary-sailing-ship",
    )) {
      const asset = getSecondarySailingAsset(vessel.id);
      if (!asset || !this.textures.exists(asset.textureKey)) {
        continue;
      }
      const presentation = getFleetPresentation(vessel.id);
      this.add
        .image(vessel.x, vessel.y + vessel.height / 2, asset.textureKey)
        .setOrigin(0.5, asset.originY)
        .setDisplaySize(
          asset.displayWidth * (presentation?.scale ?? 1),
          asset.displayHeight * (presentation?.scale ?? 1),
        )
        .setFlipX(presentation?.facing === "left")
        .setDepth(getVesselDepth(vessel.y + vessel.height / 2, vessel.id));
    }

    for (const visual of WORLD_LAYOUT.harborVisuals) {
      const asset = getProductionVisualAsset(visual.id);
      if (!asset || !this.textures.exists(asset.textureKey)) {
        continue;
      }
      this.add
        .image(visual.x, visual.y + visual.height / 2, asset.textureKey)
        .setOrigin(0.5, asset.originY)
        .setDisplaySize(asset.displayWidth, asset.displayHeight)
        .setDepth(getHarborVisualDepth(visual));
    }
  }

  /** Minimal dev-only side-by-side evidence surface; no editor or persistent UI. */
  private drawControlledCalibrationSurface(): void {
    const calibration = getCalibrationAssets(window.location.search);
    if (
      !import.meta.env.DEV ||
      !calibration ||
      new URLSearchParams(window.location.search).get("assetPreview") !== "calibration"
    ) {
      return;
    }

    this.add.rectangle(1050, 576, 1440, 650, 0xd9c7a5).setDepth(WORLD_DEPTH.HTML_UI);
    this.add.rectangle(1050, 750, 1440, 300, 0x4d9baa).setDepth(WORLD_DEPTH.HTML_UI + 1);
    this.add.rectangle(1050, 742, 1440, 16, 0x8d5637).setDepth(WORLD_DEPTH.HTML_UI + 2);
    const subjects = [
      [650, 650, calibration.heroShipD, "Hero Ship D"],
      [1090, 620, calibration.exhibitionHall, "Exhibition Hall"],
      [1450, 650, calibration.warehouse, "Warehouse"],
    ] as const;
    for (const [x, y, asset, label] of subjects) {
      this.add.image(x, y, asset.textureKey)
        .setOrigin(0.5, asset.originY)
        .setDisplaySize(asset.displayWidth, asset.displayHeight)
        .setDepth(WORLD_DEPTH.HTML_UI + 4);
      this.add.text(x, 290, label, {
        color: "#213840", fontFamily: "monospace", fontSize: "20px", fontStyle: "bold",
      }).setOrigin(0.5).setDepth(WORLD_DEPTH.HTML_UI + 5);
    }
    this.add.text(1050, 205, `Visual grammar calibration — ${calibration.angle}° above horizontal`, {
      color: "#213840", fontFamily: "monospace", fontSize: "24px", fontStyle: "bold",
    }).setOrigin(0.5).setDepth(WORLD_DEPTH.HTML_UI + 5);
  }
}
