export type Point = readonly [number, number];
export type Polygon = readonly Point[];

export type Zone = Readonly<{ id: string; polygon: Polygon; kind: "ground" | "stair" | "pier" | "dock" | "gangway" }>;

/** C.1 geometry plus the two C.2 pier corrections. Plate pixels are never queried. */
export const WALKABLE_ZONES: readonly Zone[] = [
  { id: "G_HALL_TERRACE", kind: "ground", polygon: [[65,150],[200,140],[385,150],[390,210],[175,225],[70,195]] },
  { id: "S_MAIN_LOWER", kind: "stair", polygon: [[55,245],[125,220],[185,275],[170,370],[85,375],[50,280]] },
  { id: "S_MAIN_UPPER", kind: "stair", polygon: [[95,180],[150,160],[205,215],[185,285],[125,260],[75,210]] },
  { id: "G_WORKSHOP_FORECOURT", kind: "ground", polygon: [[85,365],[170,350],[285,380],[445,395],[475,455],[365,485],[220,470],[100,440]] },
  { id: "G_ARCHIVE_APPROACH", kind: "ground", polygon: [[205,455],[260,465],[235,570],[180,600],[140,575],[150,500]] },
  { id: "G_LOWER_PROMENADE", kind: "ground", polygon: [[210,425],[350,425],[470,430],[560,415],[650,415],[760,385],[850,390],[835,450],[705,470],[600,490],[450,510],[290,500]] },
  { id: "G_PIER_APRON", kind: "pier", polygon: [[445,420],[505,385],[575,380],[605,415],[500,485]] },
  { id: "G_SHORE_PIER", kind: "pier", polygon: [[500,360],[625,370],[760,355],[895,320],[920,385],[770,435],[630,440],[520,425]] },
  { id: "G_SIDE_DOCK", kind: "dock", polygon: [[830,300],[1020,315],[1035,370],[920,400],[860,380]] },
  { id: "G_GANGWAY", kind: "gangway", polygon: [[975,325],[1075,335],[1065,388],[970,375]] },
];

export const COLLISION_FOOTPRINTS: readonly Zone[] = [
  { id: "C_HALL_GROUND", kind: "ground", polygon: [[70,35],[405,35],[425,122],[365,150],[220,140],[90,120]] },
  { id: "C_WORKSHOP_GROUND", kind: "ground", polygon: [[180,285],[500,295],[525,350],[445,385],[310,365],[185,360]] },
  { id: "C_ARCHIVE_GROUND", kind: "ground", polygon: [[60,450],[140,430],[170,480],[150,525],[60,530]] },
  { id: "C_HERO_HULL", kind: "ground", polygon: [[1080,205],[1275,230],[1275,470],[1080,445],[1065,385]] },
  { id: "C_CLIFF", kind: "ground", polygon: [[430,80],[650,120],[600,315],[500,335],[440,235]] },
];

export const insidePolygon = (x: number, y: number, polygon: Polygon): boolean => polygon.reduce((inside, point, index) => {
  const prior = polygon[(index + polygon.length - 1) % polygon.length];
  return ((point[1] > y) !== (prior[1] > y)) && x < ((prior[0] - point[0]) * (y - point[1])) / (prior[1] - point[1]) + point[0] ? !inside : inside;
}, false);

/** Later, narrower bridge zones win where authored surfaces overlap (for example Gangway over Side Dock). */
export const activeZoneAt = (x: number, y: number): Zone | undefined => [...WALKABLE_ZONES].reverse().find((zone) => insidePolygon(x, y, zone.polygon));

/** Tests the whole 28×16 feet body, not just a centre point. Water is blocked by the walkable-union rule. */
export const canOccupyFeet = (x: number, y: number): boolean => {
  const footprint: readonly Point[] = [[-14,-8],[14,-8],[-14,8],[14,8],[0,0]];
  return footprint.every(([dx, dy]) => {
    const px = x + dx; const py = y + dy;
    return Boolean(activeZoneAt(px, py)) && !COLLISION_FOOTPRINTS.some((obstacle) => insidePolygon(px, py, obstacle.polygon));
  });
};
