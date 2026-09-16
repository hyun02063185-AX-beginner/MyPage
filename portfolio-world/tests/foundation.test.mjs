import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(testDirectory, "..");
const repositoryDirectory = path.resolve(projectDirectory, "..");
const worldDirectory = path.join(repositoryDirectory, "world");

test("runtime foundation build contracts are present", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(projectDirectory, "package.json"), "utf8"),
  );
  const builtHtml = readFileSync(path.join(worldDirectory, "index.html"), "utf8");

  assert.equal(existsSync(path.join(worldDirectory, "index.html")), true);
  assert.equal(
    existsSync(path.join(worldDirectory, "GENERATED_DO_NOT_EDIT.txt")),
    true,
  );
  assert.match(builtHtml, /\/MyPage\/world\/assets\//);

  assert.equal(packageJson.dependencies.phaser, "4.2.1");
  assert.equal(packageJson.devDependencies.vite, "8.3.0");
  assert.equal(packageJson.devDependencies.typescript, "7.0.2");
  for (const version of [
    packageJson.dependencies.phaser,
    packageJson.devDependencies.vite,
    packageJson.devDependencies.typescript,
  ]) {
    assert.doesNotMatch(version, /^[~^]/);
  }

  for (const sourceFile of [
    "src/main.ts",
    "src/scenes/BootScene.ts",
    "src/scenes/WorldScene.ts",
  ]) {
    assert.equal(existsSync(path.join(projectDirectory, sourceFile)), true);
  }

  assert.equal(existsSync(path.join(repositoryDirectory, "package.json")), false);
});
