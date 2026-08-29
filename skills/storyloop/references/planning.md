# Planning with StoryLoop

Use this reference to add map content or propose content-only updates to existing activities, steps, releases, and stories.

Read [story writing](story-writing.md) before drafting story content.

## Request bounded authority

1. Discover the map through `list_story_maps` or `list_planning_targets`.
2. Inspect the map sections needed to understand the goal, backbone, releases, and current stories.
3. Call `request_planning_session` with one clear objective, rationale, and limits that fit the intended proposal.
4. Call `render_planning_owner_review` so the owner can authorize or deny the request.
5. Wait for durable authorization. A request is not write authority.

Zero limits are valid. If the owner authorizes no draft work, verify the decision and stop.

## Build the draft

- Call `get_planning_session` before drafting or resuming.
- Prefer one coherent `propose_map_changes` call for bounded additions and content updates.
- Use stable `itemKey` values and reuse them for retries or revisions.
- Use `put_planning_item` only when an incremental compatibility path is genuinely needed.
- Keep unanswered questions, assumptions, and deferred ideas distinct from acceptance criteria.
- Existing-record updates replace the complete allowed content for that target. Include every criterion that should remain.

Planning may add content or update allowed fields. It cannot move, reparent, reorder, archive, restore, delete, change workflow status, change repository settings, merge, or deploy.

## Submit for the second owner decision

1. Re-read the planning session and make sure the draft is non-empty and coherent.
2. Call `submit_planning_session` once the draft is ready for review.
3. Call `render_planning_owner_review` so the owner can inspect, exclude, request changes, reject, or publish.
4. Treat publication and optional Ready promotion as owner decisions. Never describe a submitted proposal as live work.

If the owner requests changes, fetch the session again before revising. If the live target changed, preserve the conflict and let the owner decide rather than overwriting it.
