import type { BuildingFootprint, HarborVisualPlacement } from "./worldTypes";

export const WORLD_DEPTH: Readonly<{
  GROUND_WATER: number;
  GROUND_DETAIL: number;
  WALKABLE_STRUCTURE: number;
  LOW_PROP: number;
  WORLD_OBJECT_BODY: number;
  ACTOR_PLAYER: number;
  UPPER_OCCLUDER: number;
  LABEL_WORLD_ANNOTATION: number;
  HTML_UI: number;
}>;

export function stableDepthTie(id: string): number;
export function depthAtContact(baseBand: number, contactY: number, id: string): number;
export function buildingContactY(building: BuildingFootprint): number;
export function visualGroundContactY(visual: HarborVisualPlacement): number;
export function getBuildingDepth(building: BuildingFootprint): number;
export function getVesselDepth(waterlineY: number, id: string): number;
export function getPlayerDepth(footY: number): number;
export function getWorldLabelDepth(id: string): number;
export function getHarborVisualDepth(visual: HarborVisualPlacement): number;
