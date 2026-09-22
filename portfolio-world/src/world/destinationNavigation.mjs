/**
 * Canonical World-to-portfolio contract. Forecourts are the intentional, walkable
 * interaction regions; building collision is never used to force navigation.
 */
export const DESTINATION_NAVIGATION = Object.freeze([
  { id: "career", buildingId: "career", forecourtId: "forecourt-career", label: "Guild Hall", targetPath: "../career.html" },
  { id: "lecture", buildingId: "lecture", forecourtId: "forecourt-lecture", label: "Academy", targetPath: "../teaching.html" },
  { id: "ai-lab", buildingId: "ai-lab", forecourtId: "forecourt-ai-lab", label: "Workshop", targetPath: "../making.html" },
  { id: "gallery", buildingId: "gallery", forecourtId: "forecourt-gallery", label: "Exhibition Hall", targetPath: "../gallery.html" },
]);

const containsPoint = (rect, point) => (
  point.x >= rect.x - rect.width / 2
  && point.x <= rect.x + rect.width / 2
  && point.y >= rect.y - rect.height / 2
  && point.y <= rect.y + rect.height / 2
);

/** Return the one available interaction only while the player is in its forecourt. */
export function getDestinationAtPoint(layout, point) {
  for (const destination of DESTINATION_NAVIGATION) {
    const forecourt = layout.forecourts.find((item) => item.id === destination.forecourtId);
    if (!forecourt) {
      throw new Error(`Destination forecourt is missing: ${destination.forecourtId}`);
    }
    if (containsPoint(forecourt, point)) {
      return { ...destination, interactionRect: forecourt };
    }
  }
  return undefined;
}

/** Resolve relative to the deployed World URL, preserving the GitHub Pages project base. */
export function resolveDestinationUrl(destination, currentUrl) {
  return new URL(destination.targetPath, currentUrl).href;
}

/** Activation is deliberately separate from proximity so a forecourt never auto-navigates. */
export function getActivatedDestinationUrl(destination, activated, currentUrl) {
  return destination && activated ? resolveDestinationUrl(destination, currentUrl) : undefined;
}

export function getDestinationPrompt(destination) {
  return `${destination.label}: press E or Enter to open`;
}
