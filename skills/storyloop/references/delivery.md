# Delivering StoryLoop work

Use this reference for work selection, read-only review, implementation, progress, outcomes, and owner-requested follow-up.

## Select or review without claiming

1. Use `list_story_maps` and page `inspect_story_map` when product or release context matters.
2. Resolve a reference or title with `search_story_map`.
3. Call `inspect_story` for complete story context and eligible repositories.
4. Page `inspect_story_history` when prior work, evidence, or reviews affect the answer.
5. Report findings or use the owner-gated planning flow for proposed map changes. Do not call `begin_work` for a review.

`list_work` is useful for a bounded Ready queue. It is not a substitute for map context. Use
`render_work_picker` only when the host can display MCP Apps and the user benefits from choosing in
the interface; rendering the picker does not claim work.

## Start implementation

1. Confirm the story is Ready and has no incompatible active session.
2. Select the exact `repositoryKey` returned by `inspect_story`. Omit it only when exactly one repository is eligible.
3. Create one stable `workKey` for this work round.
4. Call `begin_work` before editing implementation.
5. Treat the returned immutable context as the work contract. Reinspect rather than guessing when live state matters.

Map repository keys to checkouts inside the harness. Never send a local path to StoryLoop.

## Keep state current

- Call `report_progress` for a product milestone worth preserving.
- Use `kind: blocked` when work can resume after a named impediment. Do not submit a failed outcome for a resumable blocker.
- Reuse the same `updateKey` if the response is lost or retried.
- If delivery uses GitHub, call `attach_pull_request` with the canonical PR URL before the outcome. Inspect checks and merge state outside StoryLoop.

## Finish the work round

Call `submit_outcome` with:

- a concise product-level summary;
- repository-relative changed files;
- named verification results, including failed or skipped checks;
- bounded, safe evidence references.

Do not include secrets, raw command logs, local file URIs, or unrestricted output. A successful outcome completes the session and places the story in Review.

Use `release_claim` when stopping unfinished work that another session may continue. Explain what remains. Do not abandon an active session silently.

## Handle owner review

An approved story is Done. A change request makes the story Ready and records feedback for the next round. Reinspect, create a new work key, and call `begin_work` again. Never append follow-up work to a completed session.

Before ending the task, confirm StoryLoop has the matching durable state: active with a current progress or blocker update, completed with an outcome, or released for someone else.
