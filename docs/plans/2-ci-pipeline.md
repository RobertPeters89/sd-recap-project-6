# Plan: Issue #2 Setup - CI Pipeline

## Context
Every pull request should be checked automatically on GitHub, so that broken code does not reach `main`. The workflow runs the same scripts as the local checks (Commands section of CLAUDE.md, set up in issue #1). Existing workflows: `build.yml` (SonarQube, not touched) and `create-issues.yml`.

## Acceptance criteria and how each is covered
This issue adds a workflow file, no application code, so there is no Vitest test. Each criterion is verified like this:

| Acceptance criterion | Verification |
|---|---|
| `.github/workflows/ci.yml` runs on every pull request and every push to `main` | Read the `on:` block (`pull_request` without filters, `push` on `main`); the workflow run appears in the Actions tab of the PR |
| Job `ci` runs `npm ci`, `npm run check`, `npm run lint`, `npm run test:run`, `npm run build` | Read the steps; the job log of the PR run shows all five steps |
| Check `ci` is green in the PR of this issue | Look at the checks of the PR (`gh pr checks`) |

Before pushing, all four npm scripts run locally (`check`, `lint`, `test:run`, `build`), and `npm ci` is verified to work with the committed `package-lock.json`.

## Files
- Create: `.github/workflows/ci.yml`
  - name `CI`, triggers `pull_request` and `push` to `main`
  - one job with the id `ci` on `ubuntu-latest`
  - steps: `actions/checkout`, `actions/setup-node` (Node 22, npm cache), then `npm ci`, `npm run check`, `npm run lint`, `npm run test:run`, `npm run build`
  - `permissions: contents: read`
  - action versions pinned the way `build.yml` does it (commit SHA with version comment)
- Created by the workflow (planning phase): `docs/plans/2-ci-pipeline.md`

## Out of scope
- `npm run coverage` and `format:check` in CI (not listed in the issue)
- SonarQube and branch protection (issue #3), changes to `build.yml`
- Any application code, tests or changes to scripts

## Open questions
1. Node version: README requires Node 22.22 or newer. Use `node-version: 22` (latest 22.x), unless you want a fixed version?
2. Action pinning: pin by SHA like `build.yml`, or by tag like `create-issues.yml` (`@v6`)? Default: SHA with version comment.
