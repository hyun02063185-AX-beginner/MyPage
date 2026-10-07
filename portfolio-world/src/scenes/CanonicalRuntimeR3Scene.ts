import Phaser from "phaser";

type Point = readonly [number, number];
type Polygon = readonly Point[];
type Anchor = Readonly<{ id: string; label: string; x: number; y: number; level: 0 | 1 }>;
type VisualCoverage = Readonly<{
  schema: string;
  purpose: string;
  collision: "none";
  zones: ReadonlyArray<Readonly<{ id: string; material: string; polygons: ReadonlyArray<ReadonlyArray<readonly [number, number]>> }>>;
}>;

// Geometry is deliberately copied verbatim from R1. R2 changes only render layers.
const WORLD = { width: 1920, height: 1080 } as const;
const ANCHORS: readonly Anchor[] = [
  { id: "P1", label: "Workshop", x: 443, y: 785, level: 0 }, { id: "P2", label: "Lower Plaza", x: 710, y: 763, level: 0 },
  { id: "P3", label: "Central Quay", x: 1010, y: 628, level: 0 }, { id: "P4", label: "Main Stairs", x: 905, y: 688, level: 0 },
  { id: "P5", label: "Hall Plaza", x: 670, y: 453, level: 1 }, { id: "P6", label: "Exhibition Hall", x: 505, y: 318, level: 1 },
  { id: "P7", label: "Hero Ship", x: 1405, y: 770, level: 0 }, { id: "P8", label: "Harbor Office", x: 815, y: 735, level: 0 },
];
const WALKABLE: readonly Polygon[] = [
  [[185,705],[425,635],[675,690],[725,875],[545,1015],[250,975],[165,855]], [[505,615],[835,570],[1015,650],[975,880],[755,990],[485,865]],
  [[875,490],[1115,465],[1245,560],[1205,700],[955,705],[850,620]], [[1090,575],[1495,550],[1665,690],[1600,930],[1280,905],[1140,730]],
  [[235,250],[735,235],[860,400],[795,555],[430,565],[235,460]], [[405,115],[600,105],[655,245],[425,285]],
  [[1340,620],[1455,610],[1525,700],[1420,770],[1325,700]], [[850,610],[995,580],[1020,680],[885,720]], [[790,470],[930,455],[980,555],[845,595]], [[750,700],[925,700],[950,775],[770,790]],
];
const WATER: readonly Polygon[] = [
  [[1010,335],[1245,300],[1475,420],[1435,620],[1240,690],[1130,595]], [[1420,430],[1920,350],[1920,1035],[1615,1005],[1530,845],[1460,710]],
  [[1015,220],[1325,235],[1400,440],[1240,520],[1060,445]], [[1130,445],[1395,445],[1430,630],[1210,700],[1100,600]], [[1245,0],[1920,0],[1920,480],[1580,450],[1420,370]],
];
const OBSTACLES: readonly Polygon[] = [
  [[135,0],[720,0],[740,250],[625,320],[225,305],[130,215]], [[85,520],[455,535],[590,720],[405,800],[110,745]], [[1330,495],[1905,475],[1920,785],[1460,820],[1325,690]],
  [[255,780],[440,780],[440,895],[255,895]], [[1080,575],[1225,575],[1225,665],[1080,665]], [[720,600],[950,585],[975,680],[755,705]],
];
// R3 visual dressing is never inferred from raster alpha.  This deliberately
// conservative convex footprint sits inside Fountain B's rendered basin.
const FOUNTAIN_FOOTPRINT: Polygon = [[542,402],[628,402],[650,425],[628,448],[542,448],[520,425]];
const VISITABLE = [
  { id: "exhibition-hall", label: "Exhibition Hall", anchor: "P6" }, { id: "workshop", label: "Workshop", anchor: "P1" }, { id: "hero-ship", label: "Hero Ship", anchor: "P7" }, { id: "harbor-office", label: "Harbor Office", anchor: "P8" },
] as const;
const inside = (x: number, y: number, polygon: Polygon): boolean => polygon.reduce((hit, point, index) => {
  const previous = polygon[(index + polygon.length - 1) % polygon.length];
  return ((point[1] > y) !== (previous[1] > y)) && x < ((previous[0] - point[0]) * (y - point[1])) / (previous[1] - point[1]) + point[0] ? !hit : hit;
}, false);

/** R3 C3 visual layer. R1 geometry, camera, anchors and interaction contract remain locked. */
export class CanonicalRuntimeR3Scene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private body!: Phaser.Physics.Arcade.Body;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private prompt!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private waterLayers: Phaser.GameObjects.Image[] = [];
  private lastSafe = { x: 430, y: 763 };
  private readonly params = new URLSearchParams(window.location.search);
  private readonly debug = this.params.get("debug") === "1";
  private readonly visualRevision = "R3_C3_RUNTIME";

  public constructor() { super("CanonicalRuntimeR3Scene"); }
  public create(): void {
    this.drawScenic(); this.drawFoundation(); this.drawLandmarks(); this.drawProps(); this.createPlayer(); this.configureCamera();
    if (this.debug) this.drawDebug();
  }
  public update(): void {
    const left = this.keys.LEFT.isDown || this.keys.A.isDown; const right = this.keys.RIGHT.isDown || this.keys.D.isDown;
    const up = this.keys.UP.isDown || this.keys.W.isDown; const down = this.keys.DOWN.isDown || this.keys.S.isDown;
    const velocity = new Phaser.Math.Vector2((right ? 1 : 0) - (left ? 1 : 0), (down ? 1 : 0) - (up ? 1 : 0)).normalize().scale(210);
    this.body.setVelocity(velocity.x, velocity.y); this.enforceGeometry(); this.updateInteraction();
    this.waterLayers.forEach((layer, index) => layer.setAlpha(.96 + Math.sin((this.time.now / 2400) + index) * .025));
  }
  private points(polygon: Polygon): Phaser.Math.Vector2[] { return polygon.map(([x, y]) => new Phaser.Math.Vector2(x, y)); }
  private zone(key: string, x: number, y: number, depth: number, alpha = 1): Phaser.GameObjects.Image { return this.add.image(x, y, key).setOrigin(0, 0).setDepth(depth).setAlpha(alpha); }
  /** Coverage assets are a render-only input. They are never supplied to enforceGeometry. */
  private coverage(key: "r22-visual-water-coverage"): VisualCoverage {
    const asset = this.cache.json.get(key) as VisualCoverage | undefined;
    if (!asset || asset.collision !== "none") throw new Error(`Invalid R2.2 visual coverage asset: ${key}`);
    return asset;
  }
  private fillCoverage(graphics: Phaser.GameObjects.Graphics, coverage: VisualCoverage, colors: Readonly<Record<string, number>>): void {
    coverage.zones.forEach((zone) => {
      graphics.fillStyle(colors[zone.material] ?? 0x6b8171, 1);
      zone.polygons.forEach((polygon) => graphics.fillPoints(this.points(polygon), true));
    });
  }
  private drawVisualWaterCoverage(): void {
    const water = this.add.graphics().setDepth(4);
    // Match the R2.1 berth material's middle tone so the underlay cannot read as a dark water gap.
    this.fillCoverage(water, this.coverage("r22-visual-water-coverage"), { "calm-turquoise-water": 0x189ab1 });
    // Large, low-contrast currents keep the basin continuous without becoming a busy pattern.
    water.fillStyle(0x51a9ae, .09).fillPoints(this.points([[1100,480],[1580,435],[1815,560],[1690,690],[1260,675]]), true);
    water.fillStyle(0x51a9ae, .07).fillPoints(this.points([[1340,700],[1790,665],[1900,840],[1680,970],[1450,900]]), true);
    // Master B is intentionally transparent around its lower quay silhouette. This render-only
    // underlay preserves sheltered-water continuity in those negative spaces; collision stays R1.
    water.fillStyle(0x189ab1, 1).fillPoints(this.points([[390,650],[850,545],[1320,560],[1720,650],[1920,600],[1920,1080],[430,1080],[315,875]]), true);
    water.fillStyle(0x8bc5be, .08).fillPoints(this.points([[520,770],[970,675],[1495,720],[1800,870],[1670,1010],[690,995]]), true);
    water.lineStyle(2, 0xd0e5d4, .12);
    for (let y = 355; y < 930; y += 94) water.strokeLineShape(new Phaser.Geom.Line(1080, y, 1870, y - 12));
  }
  private drawFoundation(): void {
    this.add.rectangle(960, 540, WORLD.width, WORLD.height, 0x405852).setDepth(0);
    // Continuity water is render-only and remains under the selected master art.
    this.drawVisualWaterCoverage();
    const water = [["r21-outer-water",1245,0],["r21-secondary-berth",1015,220],["r21-inner-harbor",1010,300],["r21-workboat-water",1100,445],["r21-hero-berth",1420,350]] as const;
    water.forEach(([key, x, y]) => this.waterLayers.push(this.zone(key, x, y, 10)));
    // Human-selected, native-size 1920×1080 RGBA foundation. It is a visual layer, never collision.
    this.zone("r24-foundation-master-b", 0, 0, 20);
    // Prepared vertical slice supplies wall/quay weight without the retired R2.3 procedural overlays.
    this.zone("r24-foundation-master-b-vertical", 0, 0, 25).setAlpha(.32);
  }
  /** R3 Scenic A Final is a scenic-only, collision-free underlay. */
  private drawScenic(): void {
    // These broad bands sit beneath foundation art and keep the approved scenic alpha edge
    // from exposing R2's retired dark-green fallback during camera movement.
    const sea = this.add.graphics().setDepth(1);
    sea.fillStyle(0x9ac3d7, 1).fillRect(0, 0, WORLD.width, 310);
    sea.fillStyle(0x236a93, 1).fillRect(0, 300, WORLD.width, 110);
    sea.fillStyle(0x218ea6, 1).fillRect(0, 390, WORLD.width, 180);
    sea.fillStyle(0x2099ad, 1).fillRect(0, 550, WORLD.width, 530);
    this.zone("r3-scenic-a-final", 0, 0, 2);
  }
  private contactShadow(x: number, y: number, w: number, h: number, alpha: number, depth: number): void { const shadow=this.add.graphics().setDepth(depth); shadow.fillStyle(0x263a35,alpha).fillRoundedRect(x-w/2,y-h/2,w,h,Math.min(5,h/2)); }
  private waterContact(x: number, y: number, w: number, h: number, depth: number): void { const contact=this.add.graphics().setDepth(depth); contact.fillStyle(0x176f7e,.2).fillRoundedRect(x-w/2,y-h/2,w,h,Math.min(5,h/2)); contact.lineStyle(1,0xa8d3cf,.22).strokeLineShape(new Phaser.Geom.Line(x-w*.32,y+h*.15,x+w*.28,y+h*.15)); }
  private drawLandmarks(): void {
    const place = (key: string, x: number, y: number, w: number, h: number, depth: number) => this.add.image(x, y, key).setOrigin(0, 0).setDisplaySize(w, h).setDepth(depth);
    this.contactShadow(442, 315, 290, 18, .16, 29); place("r2-hall", 135, 0, 605, 320, 30);
    this.contactShadow(340, 790, 285, 14, .18, 31); place("r2-workshop", 85, 520, 505, 280, 32);
    this.contactShadow(841, 708, 150, 11, .17, 33); place("r2-office", 700, 505, 280, 205, 34);
    this.waterContact(1186, 535, 175, 20, 35); place("r2-secondary", 1045, 240, 275, 255, 36);
    this.waterContact(1210, 548, 92, 13, 37); place("r2-workboat", 1140, 470, 140, 75, 38);
    this.waterContact(1605, 790, 330, 24, 39); place("r2-hero", 1325, 115, 595, 685, 40);
  }
  private prop(key: string, x: number, y: number, width: number, height: number, foreground = false): Phaser.GameObjects.Image {
    return this.add.image(x, y, key).setOrigin(.5, 1).setDisplaySize(width, height).setDepth((foreground ? 52 : 45) + y / 1000);
  }
  /** Composition C3: sparse, asymmetric and route-first dressing only. */
  private drawProps(): void {
    this.contactShadow(585, 428, 102, 12, .18, 44);
    this.prop("r3-fountain-b", 585, 425, 128, 114);
    // Hall plaza: preserve the entrance axis and the P5/P6 approach.
    this.prop("r3-flower-planter", 360, 421, 86, 60);
    this.prop("r3-cypress-planter", 730, 425, 54, 100, true);
    this.prop("r3-bench", 470, 490, 92, 38);
    this.prop("r3-lamp", 777, 495, 46, 70, true);
    this.prop("r3-banner", 710, 350, 38, 60);
    // Workshop: one compact working vignette, clear of P1 and its entrance.
    this.prop("r3-crate-stack", 300, 865, 76, 58);
    this.prop("r3-barrels", 370, 870, 62, 60);
    // Office stays a quiet functional node; P8 remains visually open.
    this.prop("r3-notice-board", 740, 708, 58, 76);
    this.prop("r3-lamp", 905, 705, 38, 58, true);
    // Quays: limited mooring cues, not cargo dressing.
    this.prop("r3-bollard", 1080, 690, 30, 42, true);
    this.prop("r3-rope-coil", 1135, 680, 46, 22);
    this.prop("r3-bollard", 1575, 875, 32, 44, true);
    this.prop("r3-mooring-rope", 1490, 845, 70, 27);
  }
  private createPlayer(): void {
    const spawn = ANCHORS.find((anchor) => anchor.id === this.params.get("spawn")) ?? ANCHORS[0]; this.lastSafe = { x: spawn.x, y: spawn.y };
    this.player = this.add.image(spawn.x, spawn.y, "r2-player").setOrigin(.5, 1).setDisplaySize(28, 56).setDepth(55);
    this.physics.add.existing(this.player); this.body = this.player.body as Phaser.Physics.Arcade.Body;
    this.body.setAllowGravity(false).setSize(28, 16).setOffset(0, 40);
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E") as Record<string, Phaser.Input.Keyboard.Key>;
    this.prompt = this.add.text(0,0,"",{fontFamily:"monospace",fontSize:"16px",color:"#fff2b8",backgroundColor:"#163846",padding:{x:7,y:4}}).setOrigin(.5).setScrollFactor(0).setDepth(100);
    this.levelText = this.add.text(14,14,"",{fontFamily:"monospace",fontSize:"15px",color:"#ffffff",backgroundColor:"#163846",padding:{x:6,y:4}}).setScrollFactor(0).setDepth(100).setVisible(this.debug);
  }
  private configureCamera(): void { const camera = this.cameras.main.setBounds(0,0,WORLD.width,WORLD.height).setDeadzone(300,180).startFollow(this.player,true,.12,.12).setZoom(1); if(this.params.get("overview")==="1") camera.stopFollow().setZoom(.667).centerOn(960,540); }
  private enforceGeometry(): void {
    const x=this.player.x,y=this.player.y, fountain=inside(x,y,FOUNTAIN_FOOTPRINT);
    const valid=WALKABLE.some(p=>inside(x,y,p))&&!WATER.some(p=>inside(x,y,p))&&!OBSTACLES.some(p=>inside(x,y,p))&&!fountain;
    if(valid)this.lastSafe={x,y};else{this.player.setPosition(this.lastSafe.x,this.lastSafe.y);this.body.updateFromGameObject();}
    this.levelText.setText(`Canonical R3 · Level ${(inside(x,y,WALKABLE[4])||inside(x,y,WALKABLE[5])||inside(x,y,WALKABLE[8]))?1:0} · ${x|0}, ${y|0}`); this.player.setDepth(50+this.player.y/1000);
  }
  private updateInteraction(): void { const target=VISITABLE.map(v=>({v,a:ANCHORS.find(a=>a.id===v.anchor)!})).find(({a})=>Phaser.Math.Distance.Between(this.player.x,this.player.y,a.x,a.y)<86); if(!target){this.prompt.setVisible(false);return;} this.prompt.setText(`[E] ${target.v.label}`).setPosition(640,670).setVisible(true); if(Phaser.Input.Keyboard.JustDown(this.keys.E))this.game.events.emit("canonical-interaction",target.v.id); }
  private drawDebug(): void { const g=this.add.graphics().setDepth(90);g.lineStyle(2,0xffdf62,.9);WALKABLE.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0x38d7e5,.9);WATER.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0xff6d6d,.9);OBSTACLES.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0xff8bd1,.9).strokePoints(this.points(FOUNTAIN_FOOTPRINT),true); ANCHORS.forEach(a=>{g.fillStyle(0xfff1a1,1).fillCircle(a.x,a.y,8);this.add.text(a.x+10,a.y-18,`${a.id} ${a.label}`,{fontFamily:"monospace",fontSize:"13px",color:"#ffffff",backgroundColor:"#102d36"}).setDepth(91);}); }
}
