# Writing StoryLoop stories

Use this reference when drafting or reviewing activities, steps, releases, stories, narratives, or acceptance criteria.

## Write for conversation

A story card is a durable prompt for shared understanding, not a complete specification. Keep it small enough to scan on the map. Put stable intent and observable confirmation on the card. Leave implementation detail in the repository unless it is a product constraint.

## Shape the hierarchy

- An activity names a broad user activity or outcome.
- A step names part of the user's flow through that activity.
- A release states the outcome of one coherent slice.
- A story names a short task or result that belongs under one step and, when scheduled, one release.

Prefer short verb phrases for story titles. Include the product or component name only when the title would otherwise be ambiguous.

| Weak title | Stronger title |
| --- | --- |
| User story for authentication | Recover access after a lost passkey |
| Implement API changes | Return the next allowed StoryLoop action |
| StoryLoop MCP skill improvements | Resume interrupted StoryLoop work safely |

## Add intent only when it helps

Use the narrative to clarify who needs the outcome, what changes for them, and why it matters. Do not repeat the title in a longer sentence. "As a, I want, so that" is optional.

Weak:

> As a user, I want to recover access so that I can recover access.

Stronger:

> As an account owner who has lost every registered passkey, I need a verified recovery route so that I am not permanently locked out.

## Separate kinds of information

- **Business rule:** a policy the product must enforce.
- **Example:** a concrete case used to discuss or test the rule.
- **Acceptance criterion:** an observable confirmation that the story works.
- **Question:** a material decision the owner has not made.
- **Assumption:** a temporary belief that must be confirmed or made explicit.
- **Deferred idea:** useful work outside this story.

Never turn a question or assumption into acceptance criteria just to make the story look complete.

## Explore before marking Ready

Consider only the dimensions that can change the outcome:

- variations in the normal flow;
- exceptions and failure recovery;
- other affected users or principals;
- business rules and permissions;
- important data and retention rules;
- interface details that affect the product behaviour.

If the missing answer changes scope, safety, ownership, or the observable outcome, ask the owner or keep the story in Discovery.

## Write acceptance criteria as confirmations

Criteria describe observable behaviour or evidence. They do not prescribe hidden reasoning, exact prose, or an implementation unless the implementation is itself a constraint.

Weak:

> Use a robust implementation and handle edge cases.

Stronger:

> Retrying the same work key returns the original session and does not create another active claim.

Given/When/Then is useful when it makes state transitions clearer. It is not mandatory.

## Slice when the conversation is too large

Split a story when its parts can deliver or fail independently, require different owner decisions, or need separate verification. Keep one story when splitting would hide an end-to-end outcome behind technical layers.

Reuse context the user already supplied. Ask only for missing decisions that would materially change the proposal.

## Record confirmed decisions deliberately

Use `record_decision` only after the owner has explicitly settled a durable product or architectural
choice. Reinspect the affected product or story first so the new record does not contradict or
duplicate current context. Link the exact story and active session only when the decision belongs to
them.

- Reuse one stable `idempotencyKey` on retries.
- Name the choice in the title, summarize why it arose in `context`, and put the settled choice in
  `decision`.
- Use `consequences` for important follow-on constraints or accepted tradeoffs.
- Do not record an agent implementation preference, an assumption, an unresolved question, or a
  plausible interpretation as though the owner decided it.
