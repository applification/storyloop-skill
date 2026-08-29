# Contributing

Keep the skill specific to StoryLoop. Generic agile advice, repository automation, and rules that
do not change a StoryLoop decision belong elsewhere.

Before opening a change:

1. State the observed agent failure or missing StoryLoop behaviour.
2. Prefer a focused correction over a universal rule based on one example.
3. Keep shared routing and invariants in `SKILL.md`. Put mode-specific detail in the relevant
   reference.
4. Preserve the server's authorization boundary and the user's harness approvals.
5. Update compatibility metadata and the changelog when behaviour or supported contracts change.
6. Run `npm test` and the skill-creator validator.

Do not copy files, issue text, URLs, logs, or Git history from the private StoryLoop product
repository.
