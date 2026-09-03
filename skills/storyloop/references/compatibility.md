# StoryLoop compatibility

Use this reference before the first mutation, after an MCP or skill update, or when a documented tool is missing.

## Supported contract

This skill version is `0.2.0`. It supports StoryLoop MCP contract versions from `2.0.0` inclusive to `3.0.0` exclusive, context envelope version `3`, and outcome envelope version `2`.

Contract 2.0 is a clean break. A 1.x server exposes the retired preliminary planning-approval flow and is not supported by this skill; pin skill `0.1.1` for those servers.

The machine-readable copy lives in `compatibility.json` beside `SKILL.md`.

## Check the server

Call `get_storyloop_capabilities` when the server exposes it. Compare:

- `contractVersion` with the supported range;
- `contextEnvelopeVersion` and `outcomeEnvelopeVersion` with this skill;
- the server's authoritative `preferredTools` and `compatibilityTools` with the tools available in
  the host;
- advertised lifecycle states and features with the requested mode.

Use preferred tools when they exist. `get_story_context` and `claim_story` are compatibility tools for older clients; new delivery work uses `inspect_story` followed by `begin_work`.

Do not keep a second complete tool or transition table in the skill. The server capability response
is authoritative; this skill stores only its supported versions and required features.

## Fail safely

If the server contract is newer, older, or missing and compatibility cannot be established:

1. Do not call mutation tools.
2. Use bounded read tools that are present to inspect current state.
3. Explain the skill version, observed server version, and blocked action.
4. Ask the owner to update the skill or pin a compatible release.

Never guess renamed tools or reinterpret a state transition from prose alone.

## Update or roll back

Install or update from the dedicated public StoryLoop skill repository through the skills CLI. Pin a reviewed version for stable environments. If a release fails compatibility or behavioural checks, roll back to the last passing tag and keep the MCP server unchanged until the pair is certified.
