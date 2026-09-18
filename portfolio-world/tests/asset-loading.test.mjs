import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = resolve(projectRoot, "src/world/worldAssetManifest.ts");
const manifestSource = readFileSync(manifestPath, "utf8");

test("first asset slice uses BASE_URL paths and ships every manifest PNG", () => {
  assert.match(
    manifestSource,
    /return `\$\{import\.meta\.env\.BASE_URL\}\$\{asset\.path\}`;/,
  );
  assert.equal(/path:\s*"\/assets\//.test(manifestSource), false);

  for (const path of [
    "assets/world/harbor/ship/hero-ship-a-v01.png",
    "assets/world/harbor/ship/hero-ship-b-v01.png",
    "assets/world/harbor/ship/hero-ship-c-v01.png",
    "assets/world/harbor/buildings/exhibition-hall-v01.png",
  ]) {
    assert.equal(existsSync(resolve(projectRoot, "public", path)), true, `${path} must be present`);
  }
});
