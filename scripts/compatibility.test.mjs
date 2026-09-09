import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  assertCertification,
  assertCompatibility,
  inRange,
  skillDigest,
} from "./compatibility.mjs";

const skill = {
  skillVersion: "0.2.1",
  storyloopMcpContract: { minimum: "1.3.0", maximumExclusive: "2.0.0" },
  contextEnvelopeVersions: ["3"],
  outcomeEnvelopeVersions: ["2"],
  requiredFeatures: ["agent_drafted_owner_published_planning"],
  requiredTools: ["request_planning_session"],
};
const server = {
  contractVersion: "1.3.0",
  compatibleSkillVersions: { minimum: "0.2.1", maximumExclusive: "0.2.2" },
  contextEnvelopeVersion: "3",
  outcomeEnvelopeVersion: "2",
  features: skill.requiredFeatures,
  preferredTools: skill.requiredTools,
};
test("both sides must accept the pair and all required interfaces must exist", () => {
  assert.doesNotThrow(() => assertCompatibility(skill, server));
  for (const change of [
    { contractVersion: "2.0.0" },
    { contractVersion: "1.2.0" },
    { compatibleSkillVersions: { minimum: "0.1.0", maximumExclusive: "0.2.0" } },
    { features: [] },
    { preferredTools: [] },
    { contextEnvelopeVersion: "4" },
    { outcomeEnvelopeVersion: "3" },
  ]) {
    assert.throws(() => assertCompatibility(skill, { ...server, ...change }));
  }
  assert.throws(() =>
    assertCompatibility(
      {
        ...skill,
        skillVersion: "0.2.0",
        storyloopMcpContract: { minimum: "2.0.0", maximumExclusive: "3.0.0" },
      },
      server,
    ),
  );
  for (const value of ["future", "1.3.0-beta", "01.3.0", "9007199254740992.0.0"])
    assert.equal(inRange(value, skill.storyloopMcpContract), false);
});
test("publication requires the exact production contents and identity", () => {
  const resource = "https://example.com/mcp";
  const release = {
    ...server,
    schemaVersion: 1,
    environment: "production",
    publicMcpUrl: resource,
    revision: "a".repeat(40),
    skill: { version: skill.skillVersion, digest: "b".repeat(64) },
  };
  assert.doesNotThrow(() => assertCertification(skill, release, "b".repeat(64), resource));
  for (const change of [
    { environment: "preview" },
    { revision: "development" },
    { publicMcpUrl: "https://other.example/mcp" },
    { skill: { version: skill.skillVersion, digest: "c".repeat(64) } },
  ])
    assert.throws(() =>
      assertCertification(skill, { ...release, ...change }, "b".repeat(64), resource),
    );
});
test("prose edits change the content certification", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skill-digest-"));
  try {
    await writeFile(path.join(root, "SKILL.md"), "Before");
    const before = await skillDigest(root);
    await writeFile(path.join(root, "SKILL.md"), "After");
    assert.notEqual(await skillDigest(root), before);
    assert.equal(await skillDigest(root), await skillDigest(root));
  } finally {
    await rm(root, { recursive: true });
  }
});
