import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
    "assets/world/harbor/ship/hero-ship-d-v01.png",
    "assets/world/harbor/ship/secondary-brig-v01.png",
    "assets/world/harbor/ship/secondary-schooner-v01.png",
    "assets/world/harbor/ship/secondary-cutter-v01.png",
    "assets/world/harbor/buildings/exhibition-hall-v01.png",
    "assets/world/harbor/buildings/exhibition-hall-v03.png",
    "assets/world/harbor/buildings/academy-v03.png",
    "assets/world/harbor/buildings/workshop-v03.png",
    "assets/world/harbor/optimized/hero-ship-d-v01.png",
    "assets/world/harbor/optimized/exhibition-hall-v01.png",
    "assets/world/harbor/optimized/secondary-brig-v01.png",
    "assets/world/harbor/optimized/secondary-cutter-v01.png",
  ]) {
    assert.equal(existsSync(resolve(projectRoot, "public", path)), true, `${path} must be present`);
  }
});

test("harbor refinement keeps D as the temporary production default and comparison dev-only", () => {
  assert.match(manifestSource, /:\s*"heroShipD";\s*\n\s*return WORLD_ASSETS\[key\];/);
  assert.match(manifestSource, /import\.meta\.env\.DEV/);
  assert.match(manifestSource, /id: "hero-ship-d-v03"[\s\S]{0,800}displayWidth:\s*490/);
  assert.match(manifestSource, /displayWidth:\s*356/);
});

test("visual grammar calibration ships every candidate and has no production query path", () => {
  for (const subject of ["hero-ship-d", "exhibition-hall", "harbor-warehouse"]) {
    for (const angle of ["15", "22-5", "30"]) {
      const path = `assets/world/harbor/calibration/${subject}-cal-${angle}.png`;
      assert.equal(existsSync(resolve(projectRoot, "public", path)), true, `${path} must be present`);
    }
  }
  assert.match(manifestSource, /export function getCalibrationAngle/);
  assert.match(manifestSource, /if \(!import\.meta\.env\.DEV\)/);

  const buildAssets = resolve(projectRoot, "../world/assets");
  const productionScript = readdirSync(buildAssets).find((file) => file.endsWith(".js"));
  assert.ok(productionScript, "production bundle must exist after vite build");
  assert.equal(
    readFileSync(resolve(buildAssets, productionScript), "utf8").includes("assetCalibration"),
    false,
    "production bundle must not expose calibration query handling",
  );
  assert.equal(
    readFileSync(resolve(buildAssets, productionScript), "utf8").includes("batchView"),
    false,
    "production bundle must not expose Batch 01 review framing",
  );
  assert.equal(
    readFileSync(resolve(buildAssets, productionScript), "utf8").includes("scaleReview"),
    false,
    "production bundle must not expose player-door review framing",
  );
});
