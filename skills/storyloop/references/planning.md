# Planning with StoryLoop

Use this reference to add map content or propose content-only updates to existing activities, steps, releases, and stories.

Read [story writing](story-writing.md) before drafting story content.

## Begin a private draft

1. Discover the map through `list_story_maps` or `list_planning_targets`.
2. Inspect the map sections needed to understand the goal, backbone, releases, and current stories.
3. Call `request_planning_session` with one clear objective, rationale, per-kind `requestedLimits`, and a stable `requestKey`.
4. Reuse the same `requestKey` to resume that draft. A different objective or map under a used key is an error, not a new session.

Drafting needs no owner approval. A `planning:request` principal can start a bounded draft directly in the editable `authorized` state. That name does not mean an owner approved the draft. The requested limits apply immediately, and the draft has a technical expiry of at most seven days. The draft stays private until you submit it. Do not ask the owner to authorize drafting.

## Build the draft

- Call `get_planning_session` before drafting or resuming.
- Prefer one coherent `propose_map_changes` call for bounded additions and content updates.
- Use stable `itemKey` values and reuse them for retries or revisions.
- Use `put_planning_item` only when an incremental compatibility path is genuinely needed.
- Keep unanswered questions, assumptions, and deferred ideas distinct from acceptance criteria.
- Existing-record updates replace the complete allowed content for that target. Include every criterion that should remain.

Planning may add content or update allowed fields. It cannot move, reparent, reorder, archive, restore, delete, change workflow status, change repository settings, merge, or deploy.

## Submit for the owner decision

1. Re-read the planning session and make sure the draft is non-empty and coherent.
2. Call `submit_planning_session` once the draft is ready for review.
3. Call `render_planning_owner_review` so the owner can inspect, exclude, request changes, reject, or publish. Owner review is available only after submission.
4. Treat publication and optional Ready promotion as owner decisions. Never describe a submitted proposal as live work.

Submission is the only owner-visible event, and publication is the only live-map write. If the owner requests changes, fetch the session and follow its returned state and allowed actions with their feedback; fetch it again before revising, then resubmit it. If the live target changed, preserve the conflict and let the owner decide rather than overwriting it.
