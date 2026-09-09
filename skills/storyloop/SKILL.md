---
name: storyloop
description: Use StoryLoop MCP to inspect story maps, select or resume work, keep durable lifecycle state current, and draft owner-reviewed map improvements. Apply when a request names StoryLoop, supplies a StoryLoop story or session ID, or uses StoryLoop MCP tools. Do not activate for generic backlog writing, agile coaching, ticket systems, or repository work without StoryLoop.
metadata:
  version: "0.2.1"
  storyloop-mcp-contract: ">=1.3.0 <2.0.0"
---

# StoryLoop

StoryLoop is the product control plane. The current agent harness remains the execution plane.

## Start from durable state

1. Inspect StoryLoop before acting. Use `list_story_maps` and `inspect_story_map` for map context, or resolve an exact story with `search_story_map` and `inspect_story`.
2. Follow every `nextCursor` until the response says `completeness: complete` when the task needs the whole section.
3. Call `get_storyloop_capabilities` before the first write when it is available. Follow [compatibility](references/compatibility.md) if the contract is missing or incompatible.
4. Choose one mode below. Do not claim work merely to review it.

## Choose the mode

- **Review or select work.** Stay read-only. Inspect the map, story, and relevant history. Use [delivery](references/delivery.md) when the user asks what to work on or requests a story review.
- **Deliver a Ready story.** Inspect the exact story, choose an eligible `repositoryKey`, and call `begin_work` before changing implementation. Read [delivery](references/delivery.md).
- **Resume or recover.** Reinspect the story and active session before continuing. Read [recovery](references/recovery.md) whenever a prior response, task, authorization, or owner action may have changed.
- **Improve stories or plan a map.** Read [story writing](references/story-writing.md) and [planning](references/planning.md). Drafting is private and needs no owner approval; only submission and publication involve the owner. Keep questions and assumptions visible instead of turning them into requirements.
- **Record a confirmed decision.** Reinspect the affected product or story, then use the decision guidance in [story writing](references/story-writing.md). Never promote an inferred preference or unresolved question into a durable decision.
- **Check versions or install/update the skill.** Read [compatibility](references/compatibility.md).

## Invariants

- Treat StoryLoop state as authoritative. A chat transcript, local plan, or remembered tool result may be stale.
- Create one stable client key for each mutation intent and reuse that exact key on retries.
- After a mutation, follow its structured `recommendedAction` and `allowedActions`. Reinspect if the returned state conflicts with the task.
- Keep StoryLoop current before the task ends. Report a meaningful milestone, a resumable blocker, a completed outcome, or release unfinished work.
- A completed work session is immutable. Owner-requested follow-up starts with fresh inspection and a new work key on the Ready story.
- Only the owner publishes planning proposals or changes workflow state outside the work lifecycle.
- StoryLoop never receives shell commands, filesystem paths, sandbox settings, secrets, deployment credentials, merge instructions, or arbitrary executable input.
- Use the harness and GitHub for implementation, checks, review state, and merge state. Store only bounded summaries and safe evidence in StoryLoop.
- Stop and ask for owner action when your principal lost planning permission, another principal owns active work, a material product decision is missing, or the safe next action is not allowed.
