---
name: tdd-feature
description: Implement an approved plan with test-driven development, one acceptance criterion at a time.
argument-hint: <plan file>
disable-model-invocation: true
---

Implement the approved plan in `$ARGUMENTS`. Read the plan first.

Work through the acceptance criteria one at a time. For each criterion:

1. Write a failing test for it.
2. Run the test once and check that it fails for the right reason (the behavior is missing, not a typo or a broken setup).
3. Write the minimal code that makes the test pass.
4. Run the test again until it passes.
5. Clean up the code without changing behavior, and run the test again.

At the end, run all checks from the Commands section of CLAUDE.md and report the results.

Rules:

- Never change an existing test unless the approved plan says so.
- Do nothing that is not in the plan. If something seems missing, stop and ask.
- Do not commit, push or create a pull request.
