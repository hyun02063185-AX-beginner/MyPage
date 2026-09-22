export type FleetFacing = "left" | "right";
export type FleetVesselClass = "hero" | "medium" | "brig" | "cutter" | "small-workboat" | "dinghy";
export type FleetPresentation = Readonly<{ vesselClass: FleetVesselClass; scale: number; facing: FleetFacing; visibleBounds: Readonly<{ x: number; y: number; width: number; height: number; displayWidth: number; displayHeight: number; originY: number }> }>;
export const FLEET_PRESENTATION: Readonly<Record<string, FleetPresentation>>;
export function getFleetPresentation(id: string): FleetPresentation | undefined;
export function getFleetVisibleRect(vessel: Readonly<{ id: string; x: number; y: number; width: number; height: number }>): Readonly<{ id: string; x: number; y: number; width: number; height: number }> | undefined;
