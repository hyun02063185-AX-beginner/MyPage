import type { HarborVisualType } from "./worldTypes";

export type LandmarkDefinition = Readonly<{
  label: string;
  category: "nature" | "rest" | "wayfinding" | "portfolio-identity" | "atmosphere";
}>;

/** Reusable placeholder semantics only; no external or binary art assets. */
export const LANDMARK_CATALOG: Readonly<Record<HarborVisualType, LandmarkDefinition>> = {
  "navigation-monument": { label: "Navigation monument", category: "portfolio-identity" },
  planter: { label: "Harbor planter", category: "nature" },
  bench: { label: "Bench", category: "rest" },
  lamp: { label: "Harbor lamp", category: "atmosphere" },
  "harbor-sign": { label: "Harbor sign", category: "wayfinding" },
  crate: { label: "Crate", category: "atmosphere" },
  barrel: { label: "Barrel", category: "atmosphere" },
  dock: { label: "Dock", category: "atmosphere" },
  water: { label: "Harbor water", category: "atmosphere" },
  "small-boat": { label: "Small boat", category: "atmosphere" },
  "secondary-sailing-ship": { label: "Secondary sailing vessel", category: "atmosphere" },
  "market-kiosk": { label: "Market kiosk", category: "portfolio-identity" },
  "notice-board": { label: "Notice board", category: "wayfinding" },
  "route-map": { label: "Route map", category: "wayfinding" },
  "registry-stand": { label: "Registry stand", category: "portfolio-identity" },
  flag: { label: "Route flag", category: "wayfinding" },
  "study-garden": { label: "Study garden", category: "nature" },
  "academic-sign": { label: "Academic sign", category: "wayfinding" },
  banner: { label: "Academic banner", category: "wayfinding" },
  tree: { label: "Learning walk tree", category: "nature" },
  worktable: { label: "Worktable", category: "atmosphere" },
  "tool-rack": { label: "Tool rack", category: "atmosphere" },
  cart: { label: "Maker cart", category: "atmosphere" },
  "timber-stack": { label: "Timber stack", category: "atmosphere" },
  "display-board": { label: "Display board", category: "portfolio-identity" },
  "viewing-terrace": { label: "Viewing terrace", category: "rest" },
  "large-ship": { label: "Large harbor ship", category: "atmosphere" },
  warehouse: { label: "Harbor warehouse", category: "atmosphere" },
  "cargo-shed": { label: "Cargo shed", category: "atmosphere" },
  "warehouse-annex": { label: "Warehouse annex", category: "atmosphere" },
  "service-hut": { label: "Service hut", category: "atmosphere" },
  "rope-coil": { label: "Rope coil", category: "atmosphere" },
  "safety-rail": { label: "Safety rail", category: "atmosphere" },
  "mooring-bollard": { label: "Mooring bollard", category: "atmosphere" },
  "service-marker": { label: "Service marker", category: "wayfinding" },
  buoy: { label: "Buoy", category: "atmosphere" },
  gangplank: { label: "Gangplank", category: "atmosphere" },
};
