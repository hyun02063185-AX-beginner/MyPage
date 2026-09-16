#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const allowedProfiles = new Set([
  "CODYSSEY_SHARED_MAC",
  "HOME_WINDOWS",
  "WINDOWS_NOTEBOOK",
  "UNKNOWN",
]);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const configPath = path.join(repositoryRoot, ".portfolio-work-context.local.json");
const handoffPath = path.join(repositoryRoot, "docs/portfolio-world/92_HANDOFF.md");

function readConfig() {
  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const value = JSON.parse(readFileSync(configPath, "utf8"));
    if (
      value.version !== 1 ||
      !allowedProfiles.has(value.profile) ||
      typeof value.machineContextId !== "string" ||
      value.machineContextId.length === 0
    ) {
      throw new Error("invalid schema");
    }
    return value;
  } catch (error) {
    console.error(`Invalid work-context config: ${error.message}`);
    process.exit(1);
  }
}

function readHandoffMetadata() {
  if (!existsSync(handoffPath)) {
    return { environment: "UNKNOWN", machineContextId: "UNKNOWN" };
  }

  const handoff = readFileSync(handoffPath, "utf8");
  const environment = handoff.match(/^Environment:\s*(\S+)\s*$/m)?.[1] ?? "UNKNOWN";
  const machineContextId =
    handoff.match(/^MachineContextId:\s*(\S+)\s*$/m)?.[1] ?? "UNKNOWN";
  return { environment, machineContextId };
}

function fixedCommandVersion(command) {
  try {
    return execFileSync(command, ["--version"], {
      cwd: repositoryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

function gitValue(args) {
  try {
    return execFileSync("git", args, {
      cwd: repositoryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "UNKNOWN";
  }
}

function profileHints(profile) {
  const hints = {
    CODYSSEY_SHARED_MAC: ["Codex: supported", "Claude Code: supported", "DeepSeek: unavailable by project policy"],
    HOME_WINDOWS: ["Codex: supported", "Claude Code: supported", "DeepSeek: supported"],
    WINDOWS_NOTEBOOK: ["Codex: supported", "Claude Code: supported", "DeepSeek: UNKNOWN / not assumed"],
    UNKNOWN: ["All availability: UNKNOWN"],
  };
  return hints[profile] ?? hints.UNKNOWN;
}

const args = process.argv.slice(2);
if (args.length > 0 && (args.length !== 2 || args[0] !== "--set-profile")) {
  console.error("Usage: node tools/portfolio-world/work-context.mjs [--set-profile PROFILE]");
  process.exit(1);
}

let config = readConfig();
if (args.length === 2) {
  const profile = args[1];
  if (!allowedProfiles.has(profile)) {
    console.error(`Invalid profile: ${profile}`);
    process.exit(1);
  }
  config = {
    version: 1,
    profile,
    machineContextId: config?.machineContextId ?? randomUUID(),
  };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`Profile saved: ${profile}`);
}

const profile = config?.profile ?? "UNKNOWN";
const machineContextId = config?.machineContextId ?? "UNKNOWN";
const handoff = readHandoffMetadata();
const gitStatus = gitValue(["status", "--short"]);
const environmentSwitch =
  handoff.environment === "UNKNOWN"
    ? "UNKNOWN (handoff metadata absent)"
    : handoff.environment === profile
      ? "No environment profile switch detected"
      : "ENVIRONMENT PROFILE SWITCH DETECTED";
const machineSwitch =
  handoff.machineContextId === "UNKNOWN" || machineContextId === "UNKNOWN"
    ? "UNKNOWN (handoff metadata absent)"
    : handoff.machineContextId === machineContextId
      ? "No machine-context switch detected"
      : "MACHINE CONTEXT SWITCH DETECTED";

console.log(`\nProfile: ${profile}`);
console.log(`Machine Context ID: ${machineContextId}`);
console.log(`OS: ${process.platform} ${process.arch}`);
console.log(`Repository root: ${repositoryRoot}`);
console.log(`Branch: ${gitValue(["branch", "--show-current"])}`);
console.log(`Git: ${gitStatus === "" ? "clean" : gitStatus === "UNKNOWN" ? "UNKNOWN" : "dirty"}`);
console.log(`Node version: ${process.version}`);
// npm.cmd is a fixed Windows shim; no shell command or user input is invoked.
console.log(`npm version: ${fixedCommandVersion(process.platform === "win32" ? "npm.cmd" : "npm")}`);
console.log(`Handoff environment: ${handoff.environment}`);
console.log(`Handoff machine context ID: ${handoff.machineContextId}`);
console.log(`Environment/profile switch status: ${environmentSwitch}`);
console.log(`Machine-context switch status: ${machineSwitch}`);
console.log("Agent routing hints: static project policy only; not live quota or authentication detection.");
for (const hint of profileHints(profile)) {
  console.log(`  ${hint}`);
}
