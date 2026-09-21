/** Reviewed render-only fleet scale and facing contract. */
export const FLEET_PRESENTATION = Object.freeze({
  "harbor-large-ship": { vesselClass: "hero", scale: 1.35, facing: "left", visibleBounds: { x: 4, y: 4, width: 357, height: 247, displayWidth: 365, displayHeight: 255, originY: 0.864 } },
  "harbor-west-cargo-schooner": { vesselClass: "medium", scale: 1.3, facing: "right", visibleBounds: { x: 4, y: 4, width: 160, height: 113, displayWidth: 168, displayHeight: 121, originY: 0.84 } },
  "harbor-west-merchant-brig": { vesselClass: "brig", scale: 1.25, facing: "right", visibleBounds: { x: 4, y: 4, width: 128, height: 88, displayWidth: 136, displayHeight: 96, originY: 0.833 } },
  "harbor-east-merchant-brig": { vesselClass: "brig", scale: 1.25, facing: "left", visibleBounds: { x: 4, y: 4, width: 128, height: 88, displayWidth: 136, displayHeight: 96, originY: 0.833 } },
  "harbor-east-harbor-cutter": { vesselClass: "cutter", scale: 1.3, facing: "left", visibleBounds: { x: 4, y: 4, width: 93, height: 78, displayWidth: 101, displayHeight: 86, originY: 0.802 } },
  "harbor-small-workboat": { vesselClass: "small-workboat", scale: 1.1, facing: "right", visibleBounds: { x: 15, y: 4, width: 79, height: 56, displayWidth: 110, displayHeight: 64, originY: 0.86 } },
  "harbor-dinghy": { vesselClass: "dinghy", scale: 1, facing: "left", visibleBounds: { x: 4, y: 6, width: 68, height: 29, displayWidth: 76, displayHeight: 42, originY: 0.85 } },
});

export function getFleetPresentation(id) {
  return FLEET_PRESENTATION[id];
}

/** Actual alpha envelope at the same hull/waterline anchor used by WorldScene. */
export function getFleetVisibleRect(vessel) {
  const presentation = getFleetPresentation(vessel.id);
  if (!presentation) return undefined;
  const { visibleBounds, scale } = presentation;
  const displayWidth = visibleBounds.displayWidth * scale;
  const displayHeight = visibleBounds.displayHeight * scale;
  const width = visibleBounds.width * scale;
  const height = visibleBounds.height * scale;
  return {
    id: vessel.id,
    x: vessel.x + (visibleBounds.x + visibleBounds.width / 2) * scale - displayWidth / 2,
    y: vessel.y + vessel.height / 2 + (visibleBounds.y + visibleBounds.height / 2) * scale - visibleBounds.originY * displayHeight,
    width,
    height,
  };
}
