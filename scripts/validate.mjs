import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "storyloop");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function read(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

async function exists(relativePath) {
  try {
    await stat(path.join(repositoryRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value);
  return match ? match.slice(1).map(Number) : undefined;
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function inRange(value, minimum, maximumExclusive) {
  const parsed = parseVersion(value);
  const min = parseVersion(minimum);
  const max = parseVersion(maximumExclusive);
  return Boolean(
    parsed && min && max && compareVersions(parsed, min) >= 0 && compareVersions(parsed, max) < 0,
  );
}

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  ".github/workflows/validate.yml",
  ".github/pull_request_template.md",
  "skills/storyloop/SKILL.md",
  "skills/storyloop/agents/openai.yaml",
  "skills/storyloop/compatibility.json",
  "skills/storyloop/references/story-writing.md",
  "skills/storyloop/references/delivery.md",
  "skills/storyloop/references/recovery.md",
  "skills/storyloop/references/planning.md",
  "skills/storyloop/references/compatibility.md"
];

for (const file of requiredFiles) check(await exists(file), `Missing required file: ${file}`);

const skill = await read("skills/storyloop/SKILL.md");
const frontmatter = /^---\n([\s\S]*?)\n---/.exec(skill)?.[1] ?? "";
const skillName = /^name:\s*([^\n]+)$/m.exec(frontmatter)?.[1]?.trim();
const description = /^description:\s*([^\n]+)$/m.exec(frontmatter)?.[1]?.trim() ?? "";
const skillVersion = /^\s*version:\s*"([^"]+)"$/m.exec(frontmatter)?.[1];

check(skillName === "storyloop", "SKILL.md name must be storyloop");
check(description.length >= 80 && description.length <= 1024, "Skill description is not useful");
check(description.includes("Do not activate"), "Skill description must protect adjacent tasks");
check(skillVersion === "0.1.1", "SKILL.md version must match this release");
check(!skill.includes("TODO"), "SKILL.md contains a TODO placeholder");
check(!skill.includes("[TODO:"), "SKILL.md contains scaffold text");

for (const match of skill.matchAll(/\]\(([^)]+)\)/g)) {
  const target = match[1];
  if (/^(https?:|#)/.test(target)) continue;
  const absolute = path.resolve(skillRoot, target);
  check(await exists(path.relative(repositoryRoot, absolute)), `Broken SKILL.md reference: ${target}`);
}

const compatibility = JSON.parse(await read("skills/storyloop/compatibility.json"));
const packageManifest = JSON.parse(await read("package.json"));
const changelog = await read("CHANGELOG.md");
const readme = await read("README.md");
check(compatibility.skillVersion === skillVersion, "Compatibility skill version is out of sync");
check(packageManifest.version === skillVersion, "Package version is out of sync");
check(changelog.includes(`## ${skillVersion}`), "Changelog is missing the current skill version");
check(
  readme.includes(`/tree/v${skillVersion}/skills/storyloop`),
  "README pin example is out of sync with the current skill version",
);
check(
  inRange(
    "1.1.0",
    compatibility.storyloopMcpContract.minimum,
    compatibility.storyloopMcpContract.maximumExclusive,
  ),
  "Current MCP contract is outside the declared range",
);
check(
  inRange(
    "1.0.0",
    compatibility.storyloopMcpContract.minimum,
    compatibility.storyloopMcpContract.maximumExclusive,
  ),
  "Older supported MCP contract is outside the declared range",
);
check(
  !inRange(
    "0.9.9",
    compatibility.storyloopMcpContract.minimum,
    compatibility.storyloopMcpContract.maximumExclusive,
  ),
  "Older incompatible MCP contract was accepted",
);
check(
  !inRange(
    "2.0.0",
    compatibility.storyloopMcpContract.minimum,
    compatibility.storyloopMcpContract.maximumExclusive,
  ),
  "Future incompatible MCP contract was accepted",
);
check(
  new Set(compatibility.requiredFeatures).size === compatibility.requiredFeatures.length,
  "Required features contain duplicates",
);
check(
  compatibility.requiredFeatures.includes("structured_next_actions"),
  "Structured next actions must remain a required server feature",
);
check(
  !("preferredTools" in compatibility) && !("compatibilityTools" in compatibility),
  "Tool lists belong to the authoritative runtime capability response",
);

const openai = await read("skills/storyloop/agents/openai.yaml");
const shortDescription = /short_description:\s*"([^"]+)"/.exec(openai)?.[1] ?? "";
check(shortDescription.length >= 25 && shortDescription.length <= 64, "UI description is out of bounds");
check(openai.includes("$storyloop"), "Default prompt must name $storyloop");

check(!(await exists("skills/storyloop/scripts")), "The distributable skill must not contain scripts");

const allowedExtensions = new Set(["", ".md", ".json", ".yaml", ".yml", ".mjs"]);
const privatePatterns = [
  /\/Users\//,
  /rufus\.tail/i,
  /github\.com\/applification\/storyloop(?:[./?#]|$)/i,
  /tmp\/pdfs/i,
  /\bgh[opsu]_[A-Za-z0-9_]+/,
  /WORKOS_[A-Z_]+\s*=/
];

for (const absolute of await walk(repositoryRoot)) {
  const relative = path.relative(repositoryRoot, absolute);
  check(allowedExtensions.has(path.extname(relative)), `Unexpected file type: ${relative}`);
  const content = await readFile(absolute, "utf8");
  for (const pattern of privatePatterns) {
    check(!pattern.test(content), `Private-source pattern ${pattern} found in ${relative}`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("StoryLoop skill package is valid.");
