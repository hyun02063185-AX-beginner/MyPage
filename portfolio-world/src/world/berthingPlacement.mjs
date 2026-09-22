/**
 * Resolves only explicitly assigned static berths. This is placement metadata,
 * not an occupancy, routing, or vessel-motion system.
 */
export function resolveStaticBerthPlacements(visuals, berthingSlots, townTranslationY) {
  const berthById = new Map(berthingSlots.map((slot) => [slot.id, slot]));
  return visuals.map((visual) => {
    const berth = visual.berthSlotId ? berthById.get(visual.berthSlotId) : undefined;
    if (visual.berthSlotId && (!berth || berth.assignedVesselId !== visual.id)) {
      throw new Error(`Invalid berth assignment: ${visual.id}`);
    }
    return berth
      ? { ...visual, x: berth.x, y: berth.y + townTranslationY, heading: berth.heading }
      : visual;
  });
}
