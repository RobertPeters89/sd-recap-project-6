---
name: open-pr
description: Run all checks, commit in small steps, push the branch and open a pull request for an issue.
argument-hint: <issue number>
disable-model-invocation: true
---

Open the pull request for issue #$ARGUMENTS.

1. Check that the current branch is not `main`. If it is, stop.
2. Run all checks from the Commands section of CLAUDE.md. If a check fails, stop and report it.
3. Commit the open changes in small steps with clear messages, then push the branch.
4. Create the pull request with `gh pr create`. The body contains:
   - `Closes #$ARGUMENTS`
   - a summary of the change,
   - a section "How I tested" with the checks that were really run and their results,
   - the acceptance criteria of the issue as a checklist (`gh issue view $ARGUMENTS`); tick only the criteria that are covered by a passing test or that you verified.
5. Print the URL of the pull request.

Claim nothing you did not check.
