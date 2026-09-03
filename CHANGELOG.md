# Changelog

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
