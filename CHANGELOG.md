# Changelog

## 0.3.0

- Manage ADR proposals and the five lifecycle states through scoped conversational MCP tools.
- Reuse explicit owner confirmation for the same concrete change; preserve immutable history and recover uncertain writes with stable keys.
- Explain accepted-only current guidance, paginated history and per-member explicit activity acknowledgment.
- Require MCP contract 1.4.0 and the ADR tools and features.

## 0.2.1

- Correct 0.2.0 guidance to match implemented MCP contract 1.3: bounded private drafts use
  `request_planning_session`, `requestKey`, per-kind limits and technical expiry.
- Require both sides of compatibility, envelope versions, features and essential tools.
- Gate publication on the deployed production server certifying the exact skill contents.
- Keep the 0.2.0 tag for history; its contract-2.0 guidance does not describe the current server.

## 0.2.0

- Require StoryLoop MCP contract versions from 2.0.0 inclusive to 3.0.0 exclusive. Contract 2.0 is a
  clean break; pin 0.1.1 for 1.x servers.
- Replace the preliminary planning-approval flow with immediate private drafting. `begin_planning_session`
  and a stable `beginKey` open or resume a draft with no owner authorization, quota, or expiry.
- Require the `owner_published_map_planning` server feature in place of `owner_gated_map_planning`.
- Describe the reduced planning lifecycle: drafting, submitted, published, abandoned, superseded.
- Replace the expired-authority recovery path with owner change requests, which return a submitted
  session to private drafting, and with immediate permission revocation.

## 0.1.1

- Add an explicit strong/weak story-slicing example and confirmed-decision guidance.
- Treat the server's runtime capability response as the authoritative tool and transition reference
  instead of duplicating its tool lists in public compatibility metadata.

## 0.1.0

- Add StoryLoop-specific routing for review, delivery, recovery, planning, story improvement, and
  compatibility checks.
- Add focused guidance for durable work state, stable-key retries, owner-gated planning, and story
  writing.
- Declare support for StoryLoop MCP contract versions from 1.0.0 inclusive to 2.0.0 exclusive,
  context envelope version 3, and outcome envelope version 2.
