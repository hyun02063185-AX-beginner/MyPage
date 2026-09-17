import type { LandmarkType } from "./worldTypes";

export type LandmarkDefinition = Readonly<{
  label: string;
  category: "nature" | "rest" | "wayfinding" | "portfolio-identity" | "atmosphere";
}>;

/** Reusable placeholder semantics only; no external or binary art assets. */
export const LANDMARK_CATALOG: Readonly<Record<LandmarkType, LandmarkDefinition>> = {
  "tree-grove": { label: "Tree grove", category: "nature" },
  "bench-cluster": { label: "Bench cluster", category: "rest" },
  "wayfinding-sign": { label: "Wayfinding", category: "wayfinding" },
  "plaza-marker": { label: "Portfolio marker", category: "portfolio-identity" },
  "water-feature": { label: "Water feature", category: "atmosphere" },
  planter: { label: "Garden planter", category: "nature" },
};
