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
const VISITABLE = [
  { id: "exhibition-hall", label: "Exhibition Hall", anchor: "P6" }, { id: "workshop", label: "Workshop", anchor: "P1" }, { id: "hero-ship", label: "Hero Ship", anchor: "P7" }, { id: "harbor-office", label: "Harbor Office", anchor: "P8" },
] as const;
const inside = (x: number, y: number, polygon: Polygon): boolean => polygon.reduce((hit, point, index) => {
  const previous = polygon[(index + polygon.length - 1) % polygon.length];
  return ((point[1] > y) !== (previous[1] > y)) && x < ((previous[0] - point[0]) * (y - point[1])) / (previous[1] - point[1]) + point[0] ? !hit : hit;
}, false);

/** R2 visual layer. Spatial contract, collision, anchors and camera contract remain the R1 values. */
export class CanonicalRuntimeR2Scene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private body!: Phaser.Physics.Arcade.Body;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private prompt!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private waterLayers: Phaser.GameObjects.Image[] = [];
  private lastSafe = { x: 430, y: 763 };
  private readonly params = new URLSearchParams(window.location.search);
  private readonly debug = this.params.get("debug") === "1";
  // QA-only baseline switch for the required R2.1/R2.2 comparison capture; it never reaches collision.
  private readonly r22Coverage = this.params.get("r22") !== "0";
  private readonly visualRevision = "R2_3_FOUNDATION_CLEANUP";

  public constructor() { super("CanonicalRuntimeR2Scene"); }
  public create(): void {
    this.drawFoundation(); this.drawLandmarks(); this.createPlayer(); this.configureCamera();
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
  private coverage(key: "r22-visual-land-coverage" | "r22-visual-water-coverage"): VisualCoverage {
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
    water.lineStyle(2, 0xd0e5d4, .12);
    for (let y = 355; y < 930; y += 94) water.strokeLineShape(new Phaser.Geom.Line(1080, y, 1870, y - 12));
  }
  private drawVisualLandCoverage(): void {
    // This low substrate is intentionally beneath visual water; it is a continuous harbor landmass, not a mask.
    const land = this.add.graphics().setDepth(3);
    this.fillCoverage(land, this.coverage("r22-visual-land-coverage"), {
      "quiet-harbor-substrate": 0xcbbd9d,
      "refined-limestone": 0xd9c9a7,
      "retaining-stone": 0xb8a27f,
      "practical-limestone": 0xc6b38d,
      "heavy-quay-stone": 0xac9674,
      "transition-stone": 0xbfac8a,
    });
    // Low-opacity, irregular tonal drift replaces the former circular placeholder-like patches.
    land.fillStyle(0xf1e6ca, .055).fillPoints(this.points([[285,330],[640,290],[760,380],[670,450],[360,435]]), true);
    land.fillStyle(0xf1e6ca, .045).fillPoints(this.points([[245,735],[565,670],[790,750],[650,850],[315,835]]), true);
    land.fillStyle(0x745f46, .035).fillPoints(this.points([[875,565],[1160,535],[1260,620],[1050,690],[900,655]]), true);
    land.fillStyle(0x745f46, .03).fillPoints(this.points([[1190,710],[1510,650],[1605,760],[1440,845],[1260,810]]), true);
  }
  /** R2.3's structural reading pass; all coordinates are visual-only overlays on the locked R2.2 coverage. */
  private drawR23StructuralDepth(): void {
    const structure = this.add.graphics().setDepth(28);
    // Retaining wall: cap, shaded face, and an intentional stair aperture make the terrace height legible.
    structure.fillStyle(0x9b8464, .9).fillPoints(this.points([[235,510],[790,510],[790,568],[235,568]]), true);
    structure.fillStyle(0xd0bc95, .72).fillPoints(this.points([[235,503],[790,503],[790,514],[235,514]]), true);
    structure.fillStyle(0x5f4e3d, .16).fillPoints(this.points([[235,557],[790,557],[790,568],[235,568]]), true);
    structure.fillStyle(0x9b8464, .9).fillPoints(this.points([[975,510],[1085,510],[1085,568],[975,568]]), true);
    structure.fillStyle(0xd0bc95, .72).fillPoints(this.points([[975,503],[1085,503],[1085,514],[975,514]]), true);
    structure.fillStyle(0x5f4e3d, .16).fillPoints(this.points([[975,557],[1085,557],[1085,568],[975,568]]), true);
    // Main stair: restrained risers and two side reveals, terminating in the lower landing rather than floating.
    structure.lineStyle(2, 0x725e47, .3);
    for (let step = 0; step < 6; step += 1) structure.strokeLineShape(new Phaser.Geom.Line(806 + step * 14, 484 + step * 30, 952 - step * 8, 475 + step * 29));
    structure.lineStyle(4, 0x755f47, .35).strokeLineShape(new Phaser.Geom.Line(793,472,850,620)).strokeLineShape(new Phaser.Geom.Line(930,459,1007,678));
    structure.fillStyle(0x42362c, .12).fillPoints(this.points([[845,676],[1020,676],[1004,695],[862,705]]), true);
    // Central Quay: cap lip → vertical face → soft water-side underside shadow.
    structure.lineStyle(3, 0xc1aa80, .28).strokeLineShape(new Phaser.Geom.Line(1010,342,1243,309)).strokeLineShape(new Phaser.Geom.Line(1243,309,1468,428));
    structure.fillStyle(0x796249, .34).fillPoints(this.points([[1013,349],[1242,316],[1467,435],[1467,446],[1240,327],[1020,360]]), true);
    structure.fillStyle(0x244f5d, .1).fillPoints(this.points([[1020,360],[1240,327],[1467,446],[1457,454],[1238,338],[1028,369]]), true);
    // Hero Quay carries the same construction family, strengthened just enough to anchor Hero-B.
    structure.lineStyle(3, 0xc1aa80, .25).strokeLineShape(new Phaser.Geom.Line(1420,438,1918,358));
    structure.fillStyle(0x756049, .34).fillPoints(this.points([[1425,465],[1920,385],[1920,398],[1432,478]]), true);
    structure.fillStyle(0x244f5d, .1).fillPoints(this.points([[1432,478],[1920,398],[1920,407],[1440,487]]), true);
  }
  private drawFoundation(): void {
    // R2.1 uses only exact, transparent polygon-zone assets.  No TileSprite bounding boxes or runtime masks.
    this.add.rectangle(960, 540, WORLD.width, WORLD.height, 0x405852).setDepth(0);
    // R2.2 sits beneath the exact R2.1 zone assets, filling visual seams only. It has no gameplay role.
    if (this.r22Coverage) { this.drawVisualLandCoverage(); this.drawVisualWaterCoverage(); }
    const water = [["r21-outer-water",1245,0],["r21-secondary-berth",1015,220],["r21-inner-harbor",1010,300],["r21-workboat-water",1100,445],["r21-hero-berth",1420,350]] as const;
    water.forEach(([key, x, y]) => this.waterLayers.push(this.zone(key, x, y, 10)));
    const foundation = [["r21-hall-plaza",235,235],["r21-hall-entrance",405,105],["r21-workshop-forecourt",165,635],["r21-lower-plaza",485,570],["r21-central-quay",850,465],["r21-hero-quay",1090,550],["r21-stair-entry",850,580],["r21-stair-exit",790,455],["r21-office-apron",750,700],["r21-hero-gangway",1325,610]] as const;
    foundation.forEach(([key, x, y]) => this.zone(key, x, y, 20));
    this.zone("r21-retaining-wall",235,505,24); this.zone("r21-main-stairs",790,455,26);
    // Exact R2.1 silhouette assets remain; their face treatment is softened so R2.3's depth pass, not a hard strip, carries the reading.
    this.zone("r21-central-edge",1005,300,27).setAlpha(.56); this.zone("r21-hero-edge",1415,349,27).setAlpha(.56);
    this.zone("r2-gangway",1335,607,28).setDisplaySize(190,112);
    this.drawR23StructuralDepth();
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
    const x=this.player.x,y=this.player.y, fountain=Phaser.Math.Distance.Between(x,y,585,425)<88;
    const valid=WALKABLE.some(p=>inside(x,y,p))&&!WATER.some(p=>inside(x,y,p))&&!OBSTACLES.some(p=>inside(x,y,p))&&!fountain;
    if(valid)this.lastSafe={x,y};else{this.player.setPosition(this.lastSafe.x,this.lastSafe.y);this.body.updateFromGameObject();}
    this.levelText.setText(`Canonical R2 · Level ${(inside(x,y,WALKABLE[4])||inside(x,y,WALKABLE[5])||inside(x,y,WALKABLE[8]))?1:0} · ${x|0}, ${y|0}`); this.player.setDepth(50+this.player.y/1000);
  }
  private updateInteraction(): void { const target=VISITABLE.map(v=>({v,a:ANCHORS.find(a=>a.id===v.anchor)!})).find(({a})=>Phaser.Math.Distance.Between(this.player.x,this.player.y,a.x,a.y)<86); if(!target){this.prompt.setVisible(false);return;} this.prompt.setText(`[E] ${target.v.label}`).setPosition(640,670).setVisible(true); if(Phaser.Input.Keyboard.JustDown(this.keys.E))this.game.events.emit("canonical-interaction",target.v.id); }
  private drawDebug(): void { const g=this.add.graphics().setDepth(90);g.lineStyle(2,0xffdf62,.9);WALKABLE.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0x38d7e5,.9);WATER.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0xff6d6d,.9);OBSTACLES.forEach(p=>g.strokePoints(this.points(p),true));g.strokeCircle(585,425,88); ANCHORS.forEach(a=>{g.fillStyle(0xfff1a1,1).fillCircle(a.x,a.y,8);this.add.text(a.x+10,a.y-18,`${a.id} ${a.label}`,{fontFamily:"monospace",fontSize:"13px",color:"#ffffff",backgroundColor:"#102d36"}).setDepth(91);}); }
}
