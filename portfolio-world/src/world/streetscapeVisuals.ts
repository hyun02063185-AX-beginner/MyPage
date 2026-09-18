import Phaser from "phaser";
import type { HarborVisualPlacement } from "./worldTypes";
import { HARBOR_PALETTE as COLORS } from "./visualPalette";

const leftOf = (visual: HarborVisualPlacement): number => visual.x - visual.width / 2;
const topOf = (visual: HarborVisualPlacement): number => visual.y - visual.height / 2;

/** Focused Pass 2 drawing primitives; vocabulary dispatch remains in harborVisualCatalog. */
export function drawMarketKiosk(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.wood).fillRect(left + 6, top + 18, visual.width - 12, visual.height - 18);
  graphics.fillStyle(COLORS.banner).fillTriangle(left, top + 18, visual.x, top, left + visual.width, top + 18);
  graphics.lineStyle(3, COLORS.woodDark).strokeRect(left + 6, top + 18, visual.width - 12, visual.height - 18);
  graphics.lineStyle(2, COLORS.rope).lineBetween(left + 8, top + 22, left + visual.width - 8, top + 22);
  graphics.fillStyle(COLORS.shipTrim).fillCircle(visual.x, top + 28, 5);
}

export function drawNoticeBoard(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.woodDark).fillRect(left + 5, top + 6, visual.width - 10, visual.height - 14);
  graphics.fillStyle(COLORS.paper).fillRect(left + 10, top + 12, visual.width - 20, visual.height - 26);
  graphics.lineStyle(2, COLORS.banner).lineBetween(left + 14, top + 20, left + visual.width - 14, top + 20);
  graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + 12, top + visual.height - 8, left + 12, top + visual.height);
  graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + visual.width - 12, top + visual.height - 8, left + visual.width - 12, top + visual.height);
}

export function drawRouteMap(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.stoneShade).fillRect(left + 8, top + 5, visual.width - 16, visual.height - 10);
  graphics.fillStyle(COLORS.paper).fillRect(left + 12, top + 10, visual.width - 24, visual.height - 20);
  graphics.lineStyle(2, COLORS.water).lineBetween(left + 15, top + 16, left + visual.width - 15, top + visual.height - 16);
  graphics.fillStyle(COLORS.gold).fillCircle(visual.x, visual.y, 4);
}

export function drawRegistryStand(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.wood).fillRect(left + 8, top + 20, visual.width - 16, visual.height - 20);
  graphics.fillStyle(COLORS.woodDark).fillRect(left + 2, top + 12, visual.width - 4, 10);
  graphics.lineStyle(2, COLORS.gold).strokeRect(left + 17, top + 26, visual.width - 34, 13);
}

export function drawFlag(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.lineStyle(3, COLORS.woodDark).lineBetween(visual.x, top + 2, visual.x, top + visual.height);
  graphics.fillStyle(COLORS.banner).fillTriangle(visual.x + 2, top + 5, left + visual.width, top + 13, visual.x + 2, top + 25);
}

export function drawStudyGarden(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.stone).fillRect(left, top + visual.height - 16, visual.width, 16);
  graphics.fillStyle(COLORS.greenery).fillCircle(left + 18, top + 34, 16);
  graphics.fillStyle(COLORS.greeneryLight).fillCircle(left + 42, top + 28, 18);
  graphics.fillStyle(COLORS.paper).fillCircle(left + 12, top + 53, 3);
  graphics.fillStyle(COLORS.shipTrim).fillCircle(left + 28, top + 57, 3);
}

export function drawAcademicSign(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.lineStyle(4, COLORS.ink).lineBetween(visual.x, top + 12, visual.x, top + visual.height);
  graphics.fillStyle(COLORS.paper).fillRect(left + 4, top + 4, visual.width - 8, 20);
  graphics.lineStyle(2, COLORS.shipTrim).strokeRect(left + 4, top + 4, visual.width - 8, 20);
  graphics.lineStyle(2, COLORS.banner).lineBetween(left + 12, top + 14, left + visual.width - 12, top + 14);
}

export function drawBanner(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.lineStyle(2, COLORS.shipTrim).lineBetween(visual.x, top, visual.x, top + visual.height);
  graphics.fillStyle(COLORS.banner).fillRect(left + 2, top + 3, visual.width - 4, visual.height - 10);
  graphics.fillStyle(COLORS.shipTrim).fillCircle(visual.x, top + 12, 3);
}

export function drawTree(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.woodDark).fillRect(visual.x - 4, top + 30, 8, visual.height - 24);
  graphics.fillStyle(COLORS.greenery).fillCircle(visual.x - 10, top + 22, 16);
  graphics.fillStyle(COLORS.greeneryLight).fillCircle(visual.x + 10, top + 18, 17);
  graphics.fillStyle(COLORS.greenery).fillCircle(visual.x, top + 8, 15);
  graphics.lineStyle(2, COLORS.stoneShade).lineBetween(left, top + visual.height - 4, left + visual.width, top + visual.height - 4);
}

export function drawWorktable(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.woodDark).fillRect(left, top + 12, visual.width, 10);
  graphics.fillStyle(COLORS.wood).fillRect(left + 8, top + 22, visual.width - 16, 10);
  graphics.lineStyle(4, COLORS.woodDark).lineBetween(left + 14, top + 22, left + 14, top + visual.height);
  graphics.lineStyle(4, COLORS.woodDark).lineBetween(left + visual.width - 14, top + 22, left + visual.width - 14, top + visual.height);
  graphics.lineStyle(2, COLORS.shipTrim).lineBetween(left + 34, top + 8, left + 48, top + 2);
}

export function drawToolRack(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.woodDark).fillRect(left + 5, top + 4, visual.width - 10, visual.height - 8);
  graphics.lineStyle(2, COLORS.wood).lineBetween(left + 12, top + 14, left + visual.width - 12, top + 14);
  graphics.lineStyle(2, COLORS.wood).lineBetween(left + 12, top + 30, left + visual.width - 12, top + 30);
  graphics.lineStyle(3, COLORS.shipTrim).lineBetween(left + 18, top + 12, left + 18, top + 28);
  graphics.lineStyle(3, COLORS.shipTrim).lineBetween(left + 38, top + 12, left + 38, top + 30);
}

export function drawCart(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.wood).fillRect(left + 7, top + 8, visual.width - 14, visual.height - 18);
  graphics.lineStyle(3, COLORS.woodDark).strokeRect(left + 7, top + 8, visual.width - 14, visual.height - 18);
  graphics.fillStyle(COLORS.ink).fillCircle(left + 16, top + visual.height - 7, 7);
  graphics.fillStyle(COLORS.ink).fillCircle(left + visual.width - 16, top + visual.height - 7, 7);
}

export function drawTimberStack(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.wood).fillRect(left, top + 7, visual.width, 8);
  graphics.fillStyle(COLORS.woodDark).fillRect(left + 6, top + 17, visual.width - 12, 8);
  graphics.fillStyle(COLORS.wood).fillRect(left + 2, top + 27, visual.width - 4, 8);
  graphics.lineStyle(2, COLORS.rope).lineBetween(left + 12, top + 5, left + 12, top + 36);
  graphics.lineStyle(2, COLORS.rope).lineBetween(left + visual.width - 12, top + 5, left + visual.width - 12, top + 36);
}

export function drawDisplayBoard(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.ink).fillRect(left + 5, top + 5, visual.width - 10, visual.height - 20);
  graphics.fillStyle(COLORS.paper).fillRect(left + 10, top + 10, visual.width - 20, visual.height - 30);
  graphics.fillStyle(COLORS.banner).fillRect(left + 15, top + 16, visual.width - 30, 10);
  graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + 16, top + visual.height - 15, left + 16, top + visual.height);
  graphics.lineStyle(3, COLORS.woodDark).lineBetween(left + visual.width - 16, top + visual.height - 15, left + visual.width - 16, top + visual.height);
}

export function drawViewingTerrace(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.stone).fillRect(left, top, visual.width, visual.height);
  graphics.lineStyle(3, COLORS.stoneShade).strokeRect(left, top, visual.width, visual.height);
  graphics.lineStyle(2, COLORS.stoneShade);
  for (let x = left + 20; x < left + visual.width; x += 20) {
    graphics.lineBetween(x, top, x, top + visual.height);
  }
  graphics.lineStyle(3, COLORS.woodDark).lineBetween(left, top + 8, left + visual.width, top + 8);
}

/** Subordinate, non-functional waterfront support structures for Pass 3 composition. */
export function drawWarehouse(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.stoneShade).fillRect(left + 8, top + 24, visual.width - 16, visual.height - 24);
  graphics.fillStyle(COLORS.woodDark).fillTriangle(left, top + 26, visual.x, top + 2, left + visual.width, top + 26);
  graphics.fillStyle(COLORS.wood).fillRect(left + visual.width * 0.36, top + 48, visual.width * 0.28, visual.height - 48);
  graphics.lineStyle(3, COLORS.ink).strokeRect(left + 8, top + 24, visual.width - 16, visual.height - 24);
  graphics.lineStyle(2, COLORS.rope).lineBetween(left + 24, top + 44, left + 48, top + 44);
  graphics.lineStyle(2, COLORS.rope).lineBetween(left + visual.width - 48, top + 44, left + visual.width - 24, top + 44);
  graphics.lineStyle(2, COLORS.woodDark).lineBetween(left + visual.width * 0.5, top + 50, left + visual.width * 0.5, top + visual.height - 4);
}

export function drawCargoShed(graphics: Phaser.GameObjects.Graphics, visual: HarborVisualPlacement): void {
  const left = leftOf(visual);
  const top = topOf(visual);
  graphics.fillStyle(COLORS.wood).fillRect(left + 5, top + 18, visual.width - 10, visual.height - 18);
  graphics.fillStyle(COLORS.woodDark).fillTriangle(left, top + 20, visual.x, top + 4, left + visual.width, top + 20);
  graphics.lineStyle(2, COLORS.ink).strokeRect(left + 5, top + 18, visual.width - 10, visual.height - 18);
  graphics.lineStyle(2, COLORS.rope).lineBetween(left + 18, top + 29, left + visual.width - 18, top + 29);
}
