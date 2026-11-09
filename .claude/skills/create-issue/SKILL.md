---
name: create-issue
description: Turn an idea into a GitHub issue in the format of the template issues, after showing a draft for approval.
argument-hint: <your idea>
disable-model-invocation: true
---

Turn this idea into a GitHub issue: $ARGUMENTS

1. Look at the issue templates in `.github/templates/` and at existing issues (`gh issue list`, `gh issue view <n>`) to match their format.
2. Write a draft with:
   - a title,
   - a short description,
   - `## Value Proposition` (As a / I want to / so that),
   - `## Acceptance Criteria` as a checklist,
   - `## Tasks` as a checklist.
3. Show me the draft. Do not create anything yet.
4. Only after I agreed, run `gh issue create` with the draft (apply my changes if I asked for some).
5. Print the URL of the new issue.
