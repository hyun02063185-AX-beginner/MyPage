/**
 * Deterministic, project-owned PNG generator for the visual-grammar calibration.
 * It intentionally shares subject geometry, palette, lighting, anchor and display
 * envelope across angle variants; `elevation` only controls top-plane depth.
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const out = resolve(root, "portfolio-world/public/assets/world/harbor/calibration");
mkdirSync(out, { recursive: true });

const palette = {
  ink: "#213840", shadow: "#4b3a31", woodDark: "#5b3828", wood: "#8b5637",
  woodLight: "#bf8252", canvas: "#eadab5", canvasShade: "#cfbb90", brass: "#c59b52",
  teal: "#2f7180", tealLight: "#77aeba", plaster: "#d9be91", plasterLight: "#f2dfba",
  roof: "#7b5c58", roofLight: "#a37a6c", stone: "#a69478", wall: "#9da49a",
  wallLight: "#c4c7b8", window: "#2b5d68", accent: "#b65d48", groundShadow: "#40576", // unused sentinel
};
const hex = (value) => {
  const n = Number.parseInt(value.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255, 255];
};

class Canvas {
  constructor(width, height) { this.width = width; this.height = height; this.data = new Uint8Array(width * height * 4); }
  pixel(x, y, color) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.data.set(hex(color), (y * this.width + x) * 4);
  }
  rect(x, y, w, h, color) { for (let yy = Math.round(y); yy < y + h; yy++) for (let xx = Math.round(x); xx < x + w; xx++) this.pixel(xx, yy, color); }
  line(x1, y1, x2, y2, color, width = 1) {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let i = 0; i <= steps; i++) for (let o = -Math.floor(width / 2); o <= Math.floor(width / 2); o++) {
      const x = x1 + (x2 - x1) * i / steps; const y = y1 + (y2 - y1) * i / steps;
      this.pixel(x + o, y, color); this.pixel(x, y + o, color);
    }
  }
  poly(points, color) {
    const ys = points.map(([, y]) => y); const minY = Math.ceil(Math.min(...ys)); const maxY = Math.floor(Math.max(...ys));
    for (let y = minY; y <= maxY; y++) {
      const hits = [];
      for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i]; const [x2, y2] = points[(i + 1) % points.length];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) hits.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1));
      }
      hits.sort((a, b) => a - b);
      for (let i = 0; i < hits.length; i += 2) for (let x = Math.ceil(hits[i]); x <= Math.floor(hits[i + 1]); x++) this.pixel(x, y, color);
    }
  }
  outline(points, color, width = 2) { for (let i = 0; i < points.length; i++) this.line(...points[i], ...points[(i + 1) % points.length], color, width); }
  png() {
    const raw = Buffer.alloc((this.width * 4 + 1) * this.height);
    for (let y = 0; y < this.height; y++) { raw[y * (this.width * 4 + 1)] = 0; Buffer.from(this.data.buffer).copy(raw, y * (this.width * 4 + 1) + 1, y * this.width * 4, (y + 1) * this.width * 4); }
    const chunk = (type, value) => { const body = Buffer.concat([Buffer.from(type), value]); let c = 0xffffffff; for (const byte of body) { c ^= byte; for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } const len = Buffer.alloc(4); len.writeUInt32BE(value.length); const crc = Buffer.alloc(4); crc.writeUInt32BE((c ^ 0xffffffff) >>> 0); return Buffer.concat([len, body, crc]); };
    const header = Buffer.alloc(13); header.writeUInt32BE(this.width, 0); header.writeUInt32BE(this.height, 4); header[8] = 8; header[9] = 6;
    return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", header), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
  }
}

function ship(elevation) {
  const c = new Canvas(512, 320); const deck = { 15: 18, 22.5: 33, 30: 48 }[elevation];
  const hull = [[18,194],[494,194],[456,270],[383,288],[110,288],[50,257]];
  c.poly(hull, palette.woodDark); c.outline(hull, palette.ink, 3);
  c.poly([[26,199],[485,199],[449,251],[385,267],[106,267],[56,243]], palette.wood);
  c.poly([[25,194],[490,194],[451,205],[62,205]], palette.woodLight);
  c.poly([[72,194],[413,194],[377,194 - deck],[119,194 - deck]], palette.woodLight);
  c.outline([[72,194],[413,194],[377,194 - deck],[119,194 - deck]], palette.ink, 2);
  for (let x = 96; x < 400; x += 42) c.line(x, 201, x + 10, 263, palette.woodDark, 2);
  for (const x of [122, 250, 370]) { c.rect(x - 3, 24, 6, 176 - deck / 3, palette.ink); c.rect(x - 1, 25, 2, 174 - deck / 3, palette.brass); }
  const sails = [[122,48,208,178 - deck/2,1],[250,56,345,180 - deck/2,1],[370,75,454,184 - deck/2,-1]];
  for (const [mast, top, end, bottom, direction] of sails) { const p = direction === 1 ? [[mast+5,top],[mast+5,bottom],[end,bottom]] : [[mast-5,top],[mast-5,bottom],[end,bottom]]; c.poly(p, palette.canvas); c.outline(p, palette.ink, 2); c.line(mast, top + 8, end, bottom, palette.canvasShade, 1); }
  c.line(24, 193, 122, 25, palette.ink, 1); c.line(490, 193, 370, 75, palette.ink, 1);
  for (let x = 92; x < 415; x += 38) { c.rect(x, 219, 16, 11, palette.teal); c.rect(x + 3, 221, 10, 7, palette.tealLight); }
  for (let x = 90; x < 395; x += 48) c.rect(x, 188 - deck / 2, 10, 7, palette.brass);
  c.rect(196, 172 - deck, 54, 21, palette.woodDark); c.rect(203, 175 - deck, 40, 15, palette.wood);
  return c;
}

function hall(elevation) {
  const c = new Canvas(512, 320); const roof = { 15: 21, 22.5: 37, 30: 53 }[elevation];
  const facade = [[36,142],[476,142],[476,282],[36,282]];
  c.poly(facade, palette.plaster); c.outline(facade, palette.ink, 3);
  const roofShape = [[36,142],[476,142],[436,142-roof],[76,142-roof]];
  c.poly(roofShape, palette.roof); c.outline(roofShape, palette.ink, 3);
  c.poly([[76,142-roof],[436,142-roof],[407,117],[105,117]], palette.roofLight); c.outline([[76,142-roof],[436,142-roof],[407,117],[105,117]], palette.ink, 2);
  c.rect(222, 207, 68, 75, palette.woodDark); c.rect(231, 214, 50, 68, palette.teal);
  for (const x of [78, 137, 316, 375]) { c.rect(x, 185, 40, 40, palette.window); c.rect(x+5, 190, 30, 30, palette.tealLight); }
  c.rect(65, 246, 382, 8, palette.stone); c.rect(82, 255, 348, 8, palette.plasterLight);
  c.rect(234, 192, 44, 8, palette.brass); c.line(42, 154, 470, 154, palette.plasterLight, 2);
  return c;
}

function warehouse(elevation) {
  const c = new Canvas(512, 320); const roof = { 15: 18, 22.5: 33, 30: 48 }[elevation];
  const facade = [[51,155],[461,155],[461,283],[51,283]];
  c.poly(facade, palette.wall); c.outline(facade, palette.ink, 3);
  const roofShape = [[51,155],[461,155],[415,155-roof],[97,155-roof]];
  c.poly(roofShape, palette.woodDark); c.outline(roofShape, palette.ink, 3);
  c.poly([[97,155-roof],[415,155-roof],[386,121],[126,121]], palette.wood); c.outline([[97,155-roof],[415,155-roof],[386,121],[126,121]], palette.ink, 2);
  for (const x of [86, 165, 347, 426]) { c.rect(x, 166, 10, 111, palette.woodDark); c.line(x+10, 170, x+55, 272, palette.woodDark, 3); }
  c.rect(201, 194, 110, 89, palette.woodDark); c.rect(211, 204, 90, 79, palette.wood); c.line(256, 204, 256, 283, palette.ink, 2);
  c.rect(81, 205, 55, 29, palette.window); c.rect(376, 205, 55, 29, palette.window); c.line(59, 251, 453, 251, palette.wallLight, 2);
  return c;
}

const subjects = [
  ["hero-ship-d", ship], ["exhibition-hall", hall], ["harbor-warehouse", warehouse],
];
for (const [name, draw] of subjects) for (const angle of [15, 22.5, 30]) {
  const suffix = String(angle).replace(".", "-");
  writeFileSync(resolve(out, `${name}-cal-${suffix}.png`), draw(angle).png());
}
