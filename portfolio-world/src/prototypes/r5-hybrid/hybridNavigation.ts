import { canOccupyFeet, isMovementSegmentSafe, type Point } from "./hybridCollision";

export type NavigationResult = Readonly<{ path: Point[]; reason?: "invalid-target" | "unreachable" }>;
export const PATH_GRID = 8;

const keyFor = (x: number, y: number): string => `${x}:${y}`;
const gridPoint = (point: Point): Point => [Math.round(point[0] / PATH_GRID) * PATH_GRID, Math.round(point[1] / PATH_GRID) * PATH_GRID];
const distance = (a: Point, b: Point): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** A* uses only corrected walkable geometry; direct clicks never draw an unsafe straight line. */
export const findPilotPath = (start: Point, target: Point): NavigationResult => {
  if (!canOccupyFeet(target[0], target[1])) return { path: [], reason: "invalid-target" };
  const origin = gridPoint(start); const destination = gridPoint(target);
  const open: Point[] = [origin]; const cameFrom = new Map<string, Point>(); const gScore = new Map([[keyFor(...origin), 0]]);
  const directions: readonly Point[] = [[PATH_GRID,0],[-PATH_GRID,0],[0,PATH_GRID],[0,-PATH_GRID],[PATH_GRID,PATH_GRID],[PATH_GRID,-PATH_GRID],[-PATH_GRID,PATH_GRID],[-PATH_GRID,-PATH_GRID]];
  for (let iterations = 0; open.length && iterations < 20000; iterations += 1) {
    open.sort((a, b) => (gScore.get(keyFor(...a))! + distance(a, destination)) - (gScore.get(keyFor(...b))! + distance(b, destination)));
    const current = open.shift()!;
    if (distance(current, destination) <= PATH_GRID && isMovementSegmentSafe(current, target)) {
      const path: Point[] = [target]; let cursor = current;
      while (keyFor(...cursor) !== keyFor(...origin)) { path.unshift(cursor); cursor = cameFrom.get(keyFor(...cursor))!; }
      path.unshift(start); return { path: smoothPath(path) };
    }
    for (const [dx, dy] of directions) {
      const next: Point = [current[0] + dx, current[1] + dy];
      if (!canOccupyFeet(next[0], next[1]) || !isMovementSegmentSafe(current, next)) continue;
      const nextKey = keyFor(...next); const score = gScore.get(keyFor(...current))! + distance(current, next);
      if (score >= (gScore.get(nextKey) ?? Infinity)) continue;
      cameFrom.set(nextKey, current); gScore.set(nextKey, score); if (!open.some((point) => keyFor(...point) === nextKey)) open.push(next);
    }
  }
  return { path: [], reason: "unreachable" };
};

const smoothPath = (path: Point[]): Point[] => {
  const result: Point[] = [path[0]]; let anchor = 0;
  while (anchor < path.length - 1) { let farthest = anchor + 1; for (let index = anchor + 2; index < path.length; index += 1) { if (!isMovementSegmentSafe(path[anchor], path[index])) break; farthest = index; } result.push(path[farthest]); anchor = farthest; }
  return result;
};
