export type R5Poi = Readonly<{ id: "hall" | "workshop" | "archive" | "hero"; label: string; koreanName: string; description: string; content: string; visualAnchor: { x: number; y: number }; navigationTarget: { x: number; y: number }; interactionRange: number; thresholdOnly?: boolean }>;

/** Approved Pilot destination data, carried unchanged into the Runtime. */
export const R5_POIS: readonly R5Poi[] = [
  { id: "hall", label: "Exhibition Hall", koreanName: "전시관", description: "AX 강의와 교육 프로그램", content: "teaching.html", visualAnchor: { x: 233, y: 175 }, navigationTarget: { x: 175, y: 190 }, interactionRange: 58 },
  { id: "workshop", label: "Workshop", koreanName: "작업실", description: "AI 활용 및 제작 결과물", content: "making.html", visualAnchor: { x: 310, y: 405 }, navigationTarget: { x: 245, y: 440 }, interactionRange: 58 },
  { id: "archive", label: "Harbor Archive", koreanName: "아카이브", description: "AI·AX 개념과 교육 콘텐츠", content: "gallery.html", visualAnchor: { x: 250, y: 528 }, navigationTarget: { x: 180, y: 560 }, interactionRange: 58 },
  { id: "hero", label: "Hero Ship", koreanName: "히어로십", description: "경력과 전문성의 여정", content: "career.html", visualAnchor: { x: 958, y: 303 }, navigationTarget: { x: 1020, y: 364 }, interactionRange: 58, thresholdOnly: true },
];
