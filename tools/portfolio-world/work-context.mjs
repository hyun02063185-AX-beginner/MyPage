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

function isMachineContextId(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function validateConfig(value) {
  if (
    value?.version !== 1 ||
    !allowedProfiles.has(value.profile) ||
    !isMachineContextId(value.machineContextId)
  ) {
    throw new Error("invalid schema");
  }
  return value;
}

function readConfig() {
  if (!existsSync(configPath)) {
    return null;
  }

  try {
    return validateConfig(JSON.parse(readFileSync(configPath, "utf8")));
  } catch (error) {
    console.error(`Invalid work-context config: ${error.message}`);
    process.exit(1);
  }
}

function readConfigForRepair() {
  if (!existsSync(configPath)) {
    return { machineContextId: null, replacedInvalidConfig: false };
  }

  try {
    const value = JSON.parse(readFileSync(configPath, "utf8"));
    validateConfig(value);
    return { machineContextId: value.machineContextId, replacedInvalidConfig: false };
  } catch {
    try {
      const value = JSON.parse(readFileSync(configPath, "utf8"));
      return {
        machineContextId: isMachineContextId(value?.machineContextId)
          ? value.machineContextId
          : null,
        replacedInvalidConfig: true,
      };
    } catch {
      return { machineContextId: null, replacedInvalidConfig: true };
    }
  }
}

function readHandoffMetadata() {
  if (!existsSync(handoffPath)) {
    return { environment: "UNKNOWN", machineContextId: "UNKNOWN" };
  }

  const handoff = readFileSync(handoffPath, "utf8");
  const sectionHeading = /^## Work Context Metadata\s*$/m.exec(handoff);
  if (sectionHeading === null) {
    return { environment: "UNKNOWN", machineContextId: "UNKNOWN" };
  }

  const sectionStart = sectionHeading.index + sectionHeading[0].length;
  const followingHandoff = handoff.slice(sectionStart);
  const nextHeading = followingHandoff.search(/^##\s/m);
  const metadata = nextHeading === -1 ? followingHandoff : followingHandoff.slice(0, nextHeading);
  const environment = metadata.match(/^Environment:\s*(\S+)\s*$/m)?.[1] ?? "UNKNOWN";
  const machineContextId =
    metadata.match(/^MachineContextId:\s*(\S+)\s*$/m)?.[1] ?? "UNKNOWN";
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

const requestedProfile = args[1];
if (requestedProfile !== undefined && !allowedProfiles.has(requestedProfile)) {
  console.error(`Invalid profile: ${requestedProfile}`);
  process.exit(1);
}

let config;
if (requestedProfile !== undefined) {
  const recovery = readConfigForRepair();
  config = {
    version: 1,
    profile: requestedProfile,
    machineContextId: recovery.machineContextId ?? randomUUID(),
  };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  if (recovery.replacedInvalidConfig) {
    console.warn("Warning: prior work-context config was invalid and was replaced.");
  }
  console.log(`Profile saved: ${requestedProfile}`);
} else {
  config = readConfig();
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
