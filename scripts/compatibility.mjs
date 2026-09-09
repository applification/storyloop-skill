import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export function inRange(version, range) {
  const parse = (value) =>
    typeof value === "string" && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)
      ? value.split(".").map(Number)
      : null;
  const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  const v = parse(version),
    min = parse(range?.minimum),
    max = parse(range?.maximumExclusive);
  return Boolean(
    v &&
      min &&
      max &&
      [...v, ...min, ...max].every(Number.isSafeInteger) &&
      compare(min, max) < 0 &&
      compare(v, min) >= 0 &&
      compare(v, max) < 0,
  );
}

export function assertCompatibility(skill, server) {
  if (!inRange(server?.contractVersion, skill?.storyloopMcpContract))
    throw new Error("Unsupported MCP contract");
  if (!inRange(skill?.skillVersion, server?.compatibleSkillVersions))
    throw new Error("Server does not certify this skill version");
  for (const [key, version] of [
    ["contextEnvelopeVersions", "contextEnvelopeVersion"],
    ["outcomeEnvelopeVersions", "outcomeEnvelopeVersion"],
  ]) {
    if (!Array.isArray(skill[key]) || !skill[key].includes(server[version]))
      throw new Error(`Unsupported ${version}`);
  }
  for (const [required, available] of [
    ["requiredFeatures", server.features],
    ["requiredTools", [...(server.preferredTools ?? []), ...(server.compatibilityTools ?? [])]],
  ]) {
    if (
      !Array.isArray(skill[required]) ||
      skill[required].length === 0 ||
      !Array.isArray(available) ||
      !skill[required].every((name) => typeof name === "string" && available.includes(name))
    ) {
      throw new Error(`Missing ${required}`);
    }
  }
}

// Hash every distributed file, including prose. JSON tuples avoid ambiguous boundaries.
export async function skillDigest(root) {
  const files = [];
  async function walk(relative) {
    for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) throw new Error("Skill snapshots must not contain symlinks");
      if (entry.isDirectory()) await walk(name);
      else if (entry.isFile()) files.push(name);
      else throw new Error("Unsupported skill file");
    }
  }
  await walk("");
  const hash = createHash("sha256");
  for (const name of files.sort())
    hash.update(JSON.stringify([name, (await readFile(path.join(root, name))).toString("base64")]));
  return hash.digest("hex");
}

export function assertCertification(skill, release, digest, resource) {
  assertCompatibility(skill, release);
  if (
    release.schemaVersion !== 1 ||
    release.environment !== "production" ||
    release.publicMcpUrl !== resource ||
    !/^[a-f0-9]{40}$/.test(release.revision ?? "")
  )
    throw new Error(
      "Expected a production release with a commit revision and matching MCP resource",
    );
  if (release.skill?.version !== skill.skillVersion || release.skill?.digest !== digest)
    throw new Error("Production has not certified these exact skill contents");
}
