import { readFile } from "node:fs/promises";
import { assertCertification, skillDigest } from "./compatibility.mjs";

const resource = new URL(process.env.STORYLOOP_MCP_RESOURCE ?? "");
if (
  resource.protocol !== "https:" ||
  resource.pathname !== "/mcp" ||
  resource.username ||
  resource.password ||
  resource.search ||
  resource.hash
) {
  throw new Error("Configure STORYLOOP_MCP_RESOURCE as the production HTTPS MCP resource");
}
const response = await fetch(new URL("/.well-known/storyloop-release", resource), {
  redirect: "error",
  signal: AbortSignal.timeout(15_000),
  headers: { "cache-control": "no-cache" },
});
if (!response.ok) throw new Error(`Production compatibility check failed (${response.status})`);
const skillRoot = new URL("../skills/storyloop/", import.meta.url);
const skill = JSON.parse(await readFile(new URL("compatibility.json", skillRoot), "utf8"));
const { fileURLToPath } = await import("node:url");
assertCertification(
  skill,
  await response.json(),
  await skillDigest(fileURLToPath(skillRoot)),
  resource.href,
);
console.log(`Production certifies StoryLoop skill ${skill.skillVersion}.`);
