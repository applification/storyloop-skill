# StoryLoop agent skill

This repository is the public source for the `storyloop` agent skill. The skill teaches supported
agents how to use StoryLoop MCP for read-only review, durable delivery, recovery, owner-gated map
planning, and clear story writing.

StoryLoop remains safe without the skill. The MCP server enforces authorization, lifecycle rules,
bounded inputs, and idempotency. The skill supplies decision guidance that would be too detailed for
server instructions.

## Install

Review the repository and the skill before installing it.

```sh
npx skills add applification/storyloop-skill --skill storyloop
```

Install for Codex only:

```sh
npx skills add applification/storyloop-skill --skill storyloop --agent codex
```

Pin version `0.1.0` by installing the tagged skill directory:

```sh
npx skills add https://github.com/applification/storyloop-skill/tree/v0.1.0/skills/storyloop --agent codex
```

Check installed skills with `npx skills list`. Update the current installation with
`npx skills update storyloop`. To roll back, remove `storyloop` and install the required tagged
directory again.

skills.sh provides discovery. Installation and use depend only on the reviewed Git source and the
configured StoryLoop MCP server.

## Repository boundary

This repository is the canonical source for distributable skill content. It does not mirror the
private StoryLoop product repository and needs no private code, Git history, issue data, service
hostname, credential, package, or build artifact.

The skill lives at [`skills/storyloop`](skills/storyloop/SKILL.md). Its
[`compatibility.json`](skills/storyloop/compatibility.json) declares the supported MCP contract and
envelope versions.

## Validate

```sh
npm test
```

The validator checks package structure, references, version alignment, compatibility bounds,
private-source isolation, and the absence of executable scripts inside the skill.

## Releases

Each release uses a semantic version tag. Update `SKILL.md`, `compatibility.json`, and
`CHANGELOG.md` together. Publish only after the package validator, a clean skills CLI install, and
the private StoryLoop server compatibility suite pass.
