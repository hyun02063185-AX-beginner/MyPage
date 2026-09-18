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
};
