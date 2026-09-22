/** Reviewed render-only fleet scale and facing contract. */
export const FLEET_PRESENTATION = Object.freeze({
  "harbor-large-ship": { vesselClass: "hero", scale: 1, facing: "left", visibleBounds: { x: 4, y: 4, width: 482, height: 333, displayWidth: 490, displayHeight: 341, originY: 0.864 } },
  "harbor-west-cargo-schooner": { vesselClass: "medium", scale: 1, facing: "right", visibleBounds: { x: 4, y: 4, width: 208, height: 147, displayWidth: 216, displayHeight: 155, originY: 0.84 } },
  "harbor-west-merchant-brig": { vesselClass: "brig", scale: 1, facing: "right", visibleBounds: { x: 4, y: 4, width: 160, height: 110, displayWidth: 168, displayHeight: 118, originY: 0.833 } },
  "harbor-east-merchant-brig": { vesselClass: "brig", scale: 1, facing: "left", visibleBounds: { x: 4, y: 4, width: 160, height: 110, displayWidth: 168, displayHeight: 118, originY: 0.833 } },
  "harbor-east-harbor-cutter": { vesselClass: "cutter", scale: 1, facing: "left", visibleBounds: { x: 4, y: 4, width: 121, height: 101, displayWidth: 129, displayHeight: 109, originY: 0.802 } },
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
