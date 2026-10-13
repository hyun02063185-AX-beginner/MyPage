export type R5RuntimeAsset = Readonly<{
  id: string;
  textureKey: string;
  file: string;
  kind: "image" | "spritesheet";
  width: number;
  height: number;
  sha256: string;
  purpose: string;
  x?: number;
  y?: number;
  depth?: number;
}>;

const asset = (entry: R5RuntimeAsset): R5RuntimeAsset => entry;

/** Immutable Integration A input manifest. Files stay in public/assets and are not duplicated. */
export const R5_RUNTIME_ASSETS = [
  asset({ id: "candidate-b-plate", textureKey: "r5-plate", file: "candidate-b-scenic-plate.png", kind: "image", width: 1280, height: 720, sha256: "07F5FFF3E9765682A20F106BF58E65E201BCB59C10D1BF065ED45B94B596008B", purpose: "approved Candidate B scenic plate", x: 0, y: 0, depth: 0 }),
  asset({ id: "idle-front-v3", textureKey: "r5-idle-front-v3", file: "pilot-player/idle-front-v3.png", kind: "image", width: 28, height: 56, sha256: "B195EC9395BD69C67C241693FFD1EEC6C8FCF3E9370D803A16BD5787E1D0894C", purpose: "approved front idle" }),
  asset({ id: "idle-back-v3", textureKey: "r5-idle-back-v3", file: "pilot-player/idle-back-v3.png", kind: "image", width: 28, height: 56, sha256: "590089D9E50C2EC6946D17A99A55AEA3205B3DB96A4065B37063898AE02B7DC6", purpose: "approved back idle" }),
  asset({ id: "idle-side-v3", textureKey: "r5-idle-side-v3", file: "pilot-player/idle-side-v3.png", kind: "image", width: 28, height: 56, sha256: "18D2E69C97E0BAFB18CFAD1C27632AA8B890B4D7A9FE1529778BEF0AF00B90C1", purpose: "approved side idle" }),
  asset({ id: "walk-front-v3", textureKey: "r5-walk-front-v3", file: "pilot-player/walk-front-v3.png", kind: "spritesheet", width: 28, height: 56, sha256: "6D39867B3C12E4BBD9EB03AE11616C218E161C1D41AE8FBEC77B1150B4BB8707", purpose: "approved front walk, 8 frames at 16fps" }),
  asset({ id: "walk-back-v3", textureKey: "r5-walk-back-v3", file: "pilot-player/walk-back-v3.png", kind: "spritesheet", width: 28, height: 56, sha256: "3DA794B9E987D519A467F01160B5FB5361704FE88C40E66A5370462DD88357C3", purpose: "approved back walk, 8 frames at 16fps" }),
  asset({ id: "walk-side-v2", textureKey: "r5-walk-side-v2", file: "pilot-player/walk-side-v2.png", kind: "spritesheet", width: 28, height: 56, sha256: "D7CBE73E71060A0E23B528B53207AA4914D478DD2D446A49F3C5EC5312AEACD0", purpose: "approved side walk, 8 frames at 20fps" }),
  asset({ id: "hall-stairs", textureKey: "r5-fore-hall", file: "hall-stairs-retaining.png", kind: "image", width: 293, height: 243, sha256: "D01959B795513F3CF65F92A40504692758FF9D59DEE7F917DDA415CF8F27ABB9", purpose: "foreground occluder", x: 0, y: 155, depth: 30.242 }),
  asset({ id: "workshop-foreground", textureKey: "r5-fore-workshop", file: "workshop-foreground.png", kind: "image", width: 501, height: 163, sha256: "5BB6D1685C30A7D1F5F977FB5418F0CAE0923E80717B6D37C8E653E93F33B162", purpose: "foreground occluder", x: 0, y: 408, depth: 30.43 }),
  asset({ id: "archive-foreground", textureKey: "r5-fore-archive", file: "archive-approach-foreground.png", kind: "image", width: 411, height: 184, sha256: "04316AD998E78B2C8F7B05E484D78CC8EA48C165E9669702DC6E50E1437E17ED", purpose: "foreground occluder", x: 0, y: 536, depth: 30.552 }),
  asset({ id: "dock-piles", textureKey: "r5-fore-dock", file: "dock-piles.png", kind: "image", width: 556, height: 176, sha256: "C72A64BFAF8BDE99F08322B9B6FE60870688A9A79AAEA25852570B5D312BF26A", purpose: "foreground occluder", x: 429, y: 289, depth: 30.382 }),
  asset({ id: "gangway", textureKey: "r5-fore-gangway", file: "gangway.png", kind: "image", width: 150, height: 84, sha256: "16AA2352BE01FA3F951B019CDE06FDD9021EF06E90FA37E8A7F06DC0BBCFB7DE", purpose: "foreground occluder", x: 938, y: 297, depth: 30.368 }),
] as const;

export const R5_WORLD = { width: 1280, height: 720, cameraZoom: 1.25, previewPlayer: { x: 245, y: 440, width: 28, height: 56, bodyWidth: 28, bodyHeight: 16, bodyOffsetY: 40 } } as const;

export const resolveR5RuntimeAssetUrl = (entry: R5RuntimeAsset): string => `${import.meta.env.BASE_URL}assets/r5-hybrid/${entry.file}`;
