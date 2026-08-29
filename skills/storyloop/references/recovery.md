# Recovering StoryLoop work

Use this reference after an interruption, an uncertain tool response, owner activity, a stale draft, lost authorization, or a handoff between agents.

## Resume from StoryLoop, not memory

1. Reinspect the exact story.
2. Read the relevant story history and active session.
3. Compare the durable state with the last confirmed action.
4. Continue only through an action allowed by the current state.

If another principal owns active work, stop. Do not claim, release, or overwrite their session unless the product supplies an explicit owner-mediated path.

## Recover an uncertain mutation

If a timeout or dropped connection leaves the result unknown:

1. Do not invent a new key.
2. Read the affected story, session, or planning session.
3. If durable state confirms the intended change, continue from that state.
4. If it does not confirm the change and the transition is still valid, retry with the original key and identical intent.
5. If state changed in another way, stop and reconcile.

This applies to work keys, progress keys, completion keys, release keys, decision keys, planning request keys, draft item keys, and owner action keys.

## Common stop conditions

- **Completed or released session:** never reopen it. Reinspect the story and start a new eligible round if needed.
- **Owner changed the story or release:** use the fresh live state. Do not restore the older version from chat or a local plan.
- **Planning authority expired or was revoked:** retain the owner-reviewable submitted proposal, but do not revise an editable draft until authority is renewed.
- **Proposal changed or was superseded:** fetch it again before writing or rendering owner review.
- **Missing capability or incompatible contract:** stay read-only and follow [compatibility](compatibility.md).
- **Authentication or permission loss:** report the exact blocked action without asking for secrets or attempting another identity.

## End a recovered task cleanly

After recovery, leave one durable record that matches reality: progress, blocker, outcome, or release. A local implementation state without a matching StoryLoop update is unfinished work.
