---
name: plan-feature
description: Plan a feature from a GitHub issue in Plan mode, then create the branch and commit the approved plan. Writes no application code.
argument-hint: <issue number>
disable-model-invocation: true
---

Plan the feature for issue #$ARGUMENTS.

1. Read the issue with `gh issue view $ARGUMENTS`.
2. Explore the code that matters for this issue. Read CLAUDE.md (including its Commands section) and the existing code and tests.
3. Switch to Plan mode and present a plan with:
   - which test covers which acceptance criterion,
   - which files are created or changed,
   - what is out of scope,
   - open questions.
4. Do not write any application code or tests.

After I approved the plan, do exactly these three things and then stop:

1. Create the branch `feature/$ARGUMENTS-<slug>` (the slug is a short kebab-case name taken from the issue title).
2. Save the plan as `docs/plans/$ARGUMENTS-<slug>.md`.
3. Commit the plan file with a clear commit message.

Do nothing else: no implementation, no push, no pull request.
