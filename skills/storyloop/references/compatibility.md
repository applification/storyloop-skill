# StoryLoop compatibility

Use this reference before the first mutation, after an MCP or skill update, or when a documented tool is missing.

## Supported contract

This skill version is `0.2.1`. It supports StoryLoop MCP contract versions from `1.3.0` inclusive to `2.0.0` exclusive, context envelope version `3`, and outcome envelope version `2`.

This corrects the unsupported contract-2.0 guidance published in skill `0.2.0`. Current planning uses `request_planning_session`, bounded limits, and technical expiry. Do not call `begin_planning_session` or assume an unlimited lifetime.

The machine-readable copy lives in `compatibility.json` beside `SKILL.md`.

## Check the server

Call `get_storyloop_capabilities` when the server exposes it. Compare:

- `contractVersion` with the supported range and this skill version with `compatibleSkillVersions`;
- `contextEnvelopeVersion` and `outcomeEnvelopeVersion` with this skill;
- the server's authoritative `preferredTools` and `compatibilityTools` with the tools available in
  the host;
- advertised lifecycle states and features with the requested mode.

Use preferred tools when they exist. `get_story_context` and `claim_story` are compatibility tools for older clients; new delivery work uses `inspect_story` followed by `begin_work`.

Do not keep a second complete tool or transition table in the skill. The server capability response
is authoritative; this skill stores its supported versions, required features, and the small set of tools essential to its workflows. Verify required tools against the host’s actual tool list too.

## Fail safely

If the server contract is newer, older, or missing and compatibility cannot be established:

1. Do not call mutation tools.
2. Use bounded read tools that are present to inspect current state.
3. Explain the skill version, observed server version, and blocked action.
4. Ask the owner to update the skill or pin a compatible release.

Never guess renamed tools or reinterpret a state transition from prose alone.

## Update or roll back

Install or update from the dedicated public StoryLoop skill repository through the skills CLI. Pin a reviewed version for stable environments. If a release fails compatibility or behavioural checks, roll back to the last passing tag and keep the MCP server unchanged until the pair is certified.
