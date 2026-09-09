# Contributing

Keep the skill specific to StoryLoop. Generic agile advice, repository automation, and rules that
do not change a StoryLoop decision belong elsewhere.

Before opening a change:

1. State the observed agent failure or missing StoryLoop behaviour.
2. Prefer a focused correction over a universal rule based on one example.
3. Keep shared routing and invariants in `SKILL.md`. Put mode-specific detail in the relevant
   reference.
4. Preserve the server's authorization boundary and the user's harness approvals.
5. Update compatibility metadata and the changelog when behaviour or supported contracts change.
6. Run `npm test` and the skill-creator validator.

## Releases

Set the release version consistently in `package.json`, `skills/storyloop/SKILL.md`,
`skills/storyloop/compatibility.json`, the README pin example, and `CHANGELOG.md`.
Require the `skill` and `compatibility` checks in main branch protection. Configure the non-secret
repository variable `STORYLOOP_MCP_RESOURCE` with the production HTTPS MCP resource. Missing
configuration or an unreachable server fails certification.

Before merging a skill change, deploy the server that has verified the exact candidate skill
contents. The server release advertises a SHA-256 digest covering every distributed skill file.
Version ranges, envelope versions, required features and tools must also match in both directions.
The immutable candidate source commit lets the server certify a skill before the public merge;
keep that commit available. Any subsequent skill edit requires renewed server certification.
Do not merge an uncertified candidate: default-branch installs are distribution too.

After a pull request merges, the validation workflow publishes that version as a GitHub
release if it does not already exist. A merge that keeps the current version does not publish
another release.

Do not copy files, issue text, URLs, logs, or Git history from the private StoryLoop product
repository.
