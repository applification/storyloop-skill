# Managing ADRs in conversation

Use the scoped StoryLoop MCP tools as the primary decision workflow. A decision belongs to a
product and may link to an eligible story. The main Decisions page and that story's related
Decisions section show the same record. Product choices need not be architectural to belong here.

## Inspect before changing direction

Inspect the affected story or product, check capabilities, and use `list_decisions` with the exact
`productId`. Pass `status: accepted` for current guidance; deliberately select another status or
omit the filter for the lifecycle history. `storyId` narrows the scope when appropriate. Follow
`nextCursor` while `completeness` is `partial`, even when a bounded page is empty.

`inspect_story` and new work context supply relevant Accepted decisions. If
`decisionContextComplete` is false, continue with `list_decisions`; do not present the captured
subset as the complete decision set. Existing work snapshots remain immutable when live ADRs change.

Use `inspect_decision` for the full record, current revision, attribution and dated activity.
An explicit `revision` reads retained content. Follow `historyCursor` until `historyComplete`.
Follow the replacement link to newer guidance. Predecessors link back to earlier ADRs; if
`predecessorsComplete` is false, page `list_decisions` with `replacesDecisionId` set to this ADR's ID.

## Draft a proposal

Use `create_decision` to save Proposed content: title, context, proposed decision, rationale and
consequences, with supporting HTTPS links and consulted stakeholders when known. Preserve meaningful
paragraph breaks. Do not invent stakeholders or past approvals. Link a `storyId` only when the
proposal belongs to that story; product-wide proposals need no story or active delivery claim.

Use `change_decision` with `action: revise` and the inspected `expectedRevision` to revise a
Proposed ADR. Supply the complete intended content; omitted optional content fields are removed.
Treat a stale revision as a conflict to inspect and reconcile, never a reason to overwrite blindly.

## Apply the owner's confirmed choice

| Existing status | Confirmed action | Result |
| --- | --- | --- |
| Proposed | accept | Accepted current guidance |
| Proposed | reject | Rejected retained proposal |
| Accepted | deprecate | Deprecated without a replacement |
| Accepted | supersede, with replacementId | Superseded by another Accepted ADR in the same product |

Before a transition, establish explicit owner confirmation of the concrete ADR revision and
choice. Reuse a clear confirmation already given in this conversation for that same action;
do not require a second browser approval or ask the owner to repeat it. If the revision, replacement
or intended action materially changed, resolve that difference first. Approval of a story or an
implementation task does not automatically approve an inferred ADR.

Call `change_decision` with the action, inspected `expectedRevision`, and a concise `confirmation`
that accurately records the owner's choice. The history attributes execution to the connected agent;
do not describe it as a browser review. A plausible inference, agent preference or unresolved
question can remain a Proposed ADR but cannot become accepted direction.

Accepted prose cannot be silently revised. Draft a replacement, obtain confirmation to accept it,
then apply the confirmed supersession naming that record. Confirming a replacement's content does
not by itself authorize superseding another ADR. Self-links, cycles, cross-product replacements and
non-Accepted replacements are refused. Deprecated, Rejected and Superseded history remains readable.

## Recover and surface the result

Create one stable `idempotencyKey` per concrete create or change intent and reuse the exact arguments
on retries. If a response is uncertain, inspect the record and retry that same intent when needed;
do not invent a new key and duplicate the action. A replay can report the original resulting revision
after newer changes, so re-inspect for current state. Follow `recommendedAction` and `allowedActions`.
A denied scope, archived hierarchy or stale revision requires resolving that cause, not a broader
credential or an invented approval.

Report the saved reference, resulting status and relevant replacement. New records, revisions and
lifecycle changes surface as unseen activity in the product Decisions badge; multiple changes to one
ADR count once. Story cards show a quieter related-ADR icon and unseen marker. The unseen view covers
all statuses, separately from Accepted guidance. Members explicitly use **Mark ADR activity as seen**
for the revision presented to them. Opening pages, records or MCP reads never marks human activity
seen, acknowledgment does not approve, and later arrivals or another member's activity remain unseen.
