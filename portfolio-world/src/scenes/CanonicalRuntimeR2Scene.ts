import Phaser from "phaser";

type Point = readonly [number, number];
type Polygon = readonly Point[];
type Anchor = Readonly<{ id: string; label: string; x: number; y: number; level: 0 | 1 }>;

// Geometry is deliberately copied verbatim from R1. R2 changes only render layers.
const WORLD = { width: 1920, height: 1080 } as const;
const ANCHORS: readonly Anchor[] = [
  { id: "P1", label: "Workshop", x: 430, y: 763, level: 0 }, { id: "P2", label: "Lower Plaza", x: 710, y: 763, level: 0 },
  { id: "P3", label: "Central Quay", x: 1010, y: 628, level: 0 }, { id: "P4", label: "Main Stairs", x: 905, y: 663, level: 0 },
  { id: "P5", label: "Hall Plaza", x: 640, y: 453, level: 1 }, { id: "P6", label: "Exhibition Hall", x: 505, y: 213, level: 1 },
  { id: "P7", label: "Hero Ship", x: 1435, y: 718, level: 0 }, { id: "P8", label: "Harbor Office", x: 815, y: 735, level: 0 },
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
  return ((point[1] > y) !== (previous[1] > y)) && x < ((previous[0] - point[0]) * (y - point[1])) / (previous[0] - point[0]) + point[0] ? !hit : hit;
}, false);

/** R2 visual layer. Spatial contract, collision, anchors and camera contract remain the R1 values. */
export class CanonicalRuntimeR2Scene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private body!: Phaser.Physics.Arcade.Body;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private prompt!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private waterLayers: Phaser.GameObjects.TileSprite[] = [];
  private lastSafe = { x: 430, y: 763 };
  private readonly params = new URLSearchParams(window.location.search);
  private readonly debug = this.params.get("debug") === "1";

  public constructor() { super("CanonicalRuntimeR2Scene"); }
  public create(): void {
    this.drawFoundation(); this.drawLandmarks(); this.createPlayer(); this.configureCamera();
    if (this.debug) this.drawDebug();
    const capture = this.params.get("capture");
    if (capture) this.time.delayedCall(900, () => this.captureCanvas(capture));
  }
  public update(): void {
    const left = this.keys.LEFT.isDown || this.keys.A.isDown; const right = this.keys.RIGHT.isDown || this.keys.D.isDown;
    const up = this.keys.UP.isDown || this.keys.W.isDown; const down = this.keys.DOWN.isDown || this.keys.S.isDown;
    const velocity = new Phaser.Math.Vector2((right ? 1 : 0) - (left ? 1 : 0), (down ? 1 : 0) - (up ? 1 : 0)).normalize().scale(210);
    this.body.setVelocity(velocity.x, velocity.y); this.enforceGeometry(); this.updateInteraction();
    this.waterLayers.forEach((layer, index) => { layer.tilePositionX += index ? 0.012 : 0.024; layer.tilePositionY += index ? 0.006 : 0.002; });
  }
  private points(polygon: Polygon): Phaser.Math.Vector2[] { return polygon.map(([x, y]) => new Phaser.Math.Vector2(x, y)); }
  private polygonTile(key: string, polygon: Polygon, depth: number, alpha = 1, offsetX = 0, offsetY = 0): Phaser.GameObjects.TileSprite {
    // Phaser 4 WebGL does not support the legacy GameObject geometry mask API.  Keep
    // modules in bounded polygon envelopes instead of falling back to a scene plate.
    const xs = polygon.map(([x]) => x), ys = polygon.map(([, y]) => y);
    const x = Math.min(...xs), y = Math.min(...ys), width = Math.max(...xs) - x, height = Math.max(...ys) - y;
    return this.add.tileSprite(x + width / 2 + offsetX, y + height / 2 + offsetY, width, height, key).setDepth(depth).setAlpha(alpha);
  }
  private drawFoundation(): void {
    this.add.rectangle(960, 540, WORLD.width, WORLD.height, 0xc5b98f).setDepth(0);
    const waterBase = this.add.graphics().setDepth(9); waterBase.fillStyle(0x257f8c, .88); WATER.forEach((polygon) => waterBase.fillPoints(this.points(polygon), true));
    WATER.forEach((polygon) => this.waterLayers.push(this.polygonTile("r2-water", polygon, 10, 0.72)));
    WATER.forEach((polygon) => this.waterLayers.push(this.polygonTile("r2-water", polygon, 11, 0.11, 38, 14)));
    WALKABLE.forEach((polygon, index) => this.polygonTile(index < 4 ? "r2-quay" : "r2-paving", polygon, 20, .91, index * 9, index * 5));
    // Retaining wall is a three-part construction: dark vertical face, modular wall, pale top cap.
    this.add.rectangle(557, 544, 600, 34, 0x6b533e, 0.48).setDepth(22);
    this.add.tileSprite(560, 532, 630, 88, "r2-wall").setDepth(23);
    this.add.rectangle(560, 499, 630, 12, 0xe8d5a9, 0.78).setDepth(24);
    this.add.image(838, 516, "r2-stairs").setOrigin(0, 0).setDisplaySize(300, 180).setDepth(26);
    this.add.image(1230, 600, "r2-gangway").setOrigin(0, 0).setDisplaySize(220, 120).setDepth(27);
    const edges = this.add.graphics().setDepth(28); edges.lineStyle(3, 0x5d7b7c, 0.58);
    WATER.forEach((polygon) => edges.strokePoints(this.points(polygon), true));
  }
  private shadow(x: number, y: number, w: number, h: number, alpha: number, depth: number): void { this.add.ellipse(x, y, w, h, 0x122c38, alpha).setDepth(depth); }
  private drawLandmarks(): void {
    const place = (key: string, x: number, y: number, w: number, h: number, depth: number) => this.add.image(x, y, key).setOrigin(0, 0).setDisplaySize(w, h).setDepth(depth);
    this.shadow(442, 315, 500, 42, .20, 29); place("r2-hall", 135, 0, 605, 320, 30);
    this.shadow(340, 790, 410, 35, .22, 31); place("r2-workshop", 85, 520, 505, 280, 32);
    this.shadow(841, 708, 230, 28, .22, 33); place("r2-office", 700, 505, 280, 205, 34);
    this.shadow(1186, 535, 210, 30, .18, 35); place("r2-secondary", 1045, 240, 275, 255, 36);
    this.shadow(1210, 548, 115, 18, .24, 37); place("r2-workboat", 1140, 470, 140, 75, 38);
    this.shadow(1605, 790, 440, 78, .28, 39); place("r2-hero", 1325, 115, 595, 685, 40);
    // R2 baseline semantic decomposition: source-preserving foreground crop, gangway, and separate water contact.
    this.add.ellipse(1615, 786, 410, 34, 0x356b76, .34).setDepth(41);
    this.add.image(1685, 430, "r2-hero").setOrigin(0, 0).setCrop(360, 250, 235, 435).setDisplaySize(235, 435).setDepth(70).setAlpha(.94);
    this.add.rectangle(1270, 642, 175, 9, 0x5f4531, .72).setAngle(-12).setDepth(71);
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
  private captureCanvas(name: string): void { const link=document.createElement("a"); link.href=this.game.canvas.toDataURL("image/png"); link.download=`runtime-r2-${name}.png`; link.click(); }
  private enforceGeometry(): void {
    const x=this.player.x,y=this.player.y, fountain=Phaser.Math.Distance.Between(x,y,585,425)<88;
    const valid=WALKABLE.some(p=>inside(x,y,p))&&!WATER.some(p=>inside(x,y,p))&&!OBSTACLES.some(p=>inside(x,y,p))&&!fountain;
    if(valid)this.lastSafe={x,y};else{this.player.setPosition(this.lastSafe.x,this.lastSafe.y);this.body.updateFromGameObject();}
    this.levelText.setText(`Canonical R2 · Level ${(inside(x,y,WALKABLE[4])||inside(x,y,WALKABLE[5])||inside(x,y,WALKABLE[8]))?1:0} · ${x|0}, ${y|0}`); this.player.setDepth(50+this.player.y/1000);
  }
  private updateInteraction(): void { const target=VISITABLE.map(v=>({v,a:ANCHORS.find(a=>a.id===v.anchor)!})).find(({a})=>Phaser.Math.Distance.Between(this.player.x,this.player.y,a.x,a.y)<86); if(!target){this.prompt.setVisible(false);return;} this.prompt.setText(`[E] ${target.v.label}`).setPosition(640,670).setVisible(true); if(Phaser.Input.Keyboard.JustDown(this.keys.E))this.game.events.emit("canonical-interaction",target.v.id); }
  private drawDebug(): void { const g=this.add.graphics().setDepth(90);g.lineStyle(2,0xffdf62,.9);WALKABLE.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0x38d7e5,.9);WATER.forEach(p=>g.strokePoints(this.points(p),true));g.lineStyle(2,0xff6d6d,.9);OBSTACLES.forEach(p=>g.strokePoints(this.points(p),true));g.strokeCircle(585,425,88); ANCHORS.forEach(a=>{g.fillStyle(0xfff1a1,1).fillCircle(a.x,a.y,8);this.add.text(a.x+10,a.y-18,`${a.id} ${a.label}`,{fontFamily:"monospace",fontSize:"13px",color:"#ffffff",backgroundColor:"#102d36"}).setDepth(91);}); }
}
