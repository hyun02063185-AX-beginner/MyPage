export type Point = readonly [number, number];
export type Polygon = readonly Point[];

export type Zone = Readonly<{ id: string; polygon: Polygon; kind: "ground" | "stair" | "pier" | "dock" | "gangway" }>;

/**
 * Pilot-only visual-alignment overlay. C.1/C.2 stay untouched: the pier and
 * gangway strips below deliberately contract their broad draft envelopes to
 * timber/stone that is visibly present in Candidate B.
 */
export const WALKABLE_ZONES: readonly Zone[] = [
  { id: "G_HALL_TERRACE", kind: "ground", polygon: [[65,150],[200,140],[385,150],[390,210],[175,225],[70,195]] },
  { id: "S_MAIN_LOWER", kind: "stair", polygon: [[55,245],[125,220],[185,275],[170,370],[85,375],[50,280]] },
  { id: "S_MAIN_UPPER", kind: "stair", polygon: [[95,180],[150,160],[205,215],[185,285],[125,260],[75,210]] },
  { id: "G_WORKSHOP_FORECOURT", kind: "ground", polygon: [[85,365],[170,350],[285,380],[445,395],[475,455],[365,485],[220,470],[100,440]] },
  { id: "G_ARCHIVE_APPROACH", kind: "ground", polygon: [[205,455],[260,465],[235,570],[180,600],[140,575],[150,500]] },
  // C.1's broad lower-promenade envelope reached into visible water in this plate.
  // This is only the photographed stone forecourt joining Workshop to the pier apron.
  { id: "G_LOWER_PROMENADE", kind: "ground", polygon: [[292,416],[420,410],[468,420],[505,435],[486,465],[430,480],[350,468],[292,450]] },
  { id: "G_PIER_APRON", kind: "pier", polygon: [[452,426],[500,399],[542,392],[563,410],[503,457]] },
  { id: "G_SHORE_PIER", kind: "pier", polygon: [[518,392],[625,379],[748,364],[874,334],[895,370],[760,414],[628,426],[531,416]] },
  // Shared overlap is visible dock timber, sized for the full 28×16 body—not a water bridge.
  { id: "G_SIDE_DOCK", kind: "dock", polygon: [[848,360],[978,362],[991,416],[902,438],[840,405]] },
  { id: "G_GANGWAY", kind: "gangway", polygon: [[952,378],[982,421],[1052,366],[1028,335]] },
];

export const PILOT_ALIGNMENT_NOTES = [
  "G_SHORE_PIER contracted away from lower-water envelope to visible timber band",
  "G_SIDE_DOCK moved down to visible dock width",
  "G_GANGWAY rotated to the painted boarding plank; threshold ends before hull",
] as const;

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

/** Sweep every two world pixels so a fast frame cannot tunnel through water. */
export const isMovementSegmentSafe = (from: Point, to: Point): boolean => {
  const distance = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const steps = Math.max(1, Math.ceil(distance / 2));
  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps;
    if (!canOccupyFeet(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t)) return false;
  }
  return true;
};
