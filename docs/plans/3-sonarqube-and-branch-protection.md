# Plan: Issue #3 Setup - SonarQube Cloud and Branch Protection

## Context
SonarQube Cloud should check every pull request (quality gate as a check, with coverage) and `main` should be protected, so that only tested and clean code is merged. The template already contains `sonar-project.properties` and `.github/workflows/build.yml` (job `SonarQube`). Both are not what the issue asks for yet:
- `build.yml` runs the scan **without** running the coverage first, so no coverage reaches SonarQube Cloud.
- `sonar-project.properties` only knows `*.test.ts` (no `.tsx`), has the test pattern in `sonar.exclusions` and excludes only `src/types.ts` from coverage (not the entry file `src/index.tsx`).
- The PR check list of #17 shows a check "SonarCloud Code Analysis" next to "SonarQube". That suggests the **automatic analysis** in SonarQube Cloud is still on; the issue asks to switch it off.

## Acceptance criteria and how each is covered
No application code changes, so there is no Vitest test. Each criterion is verified like this:

| Acceptance criterion | Verification |
|---|---|
| SonarQube Cloud analyzes every pull request, quality gate shows up as a check | `.github/workflows/sonar.yml` triggers on `pull_request` and `push` to `main`; the check of the PR of this issue shows the quality gate (`gh pr checks`) |
| Coverage shows up in SonarQube Cloud | The workflow runs `npm ci` and `npm run coverage` before the scan; `coverage/lcov.info` is read via `sonar.javascript.lcov.reportPaths`. Checked in the SonarQube Cloud project (coverage measure present). Note: there are no tests yet, so the value will be 0 % or "not computed" until issue 4 |
| Test files are marked as tests, not source code | `sonar.tests=src`, `sonar.test.inclusions=src/**/*.test.ts,src/**/*.test.tsx`, and the same patterns in `sonar.exclusions` for sources. Checked in SonarQube Cloud (test files are not listed as sources) once the first test exists |
| `main` is protected: checks `ci` and quality gate required, approvals not required | Manual setting in GitHub (Settings > Branches or Rulesets). Checked by reading the settings and by `gh api repos/RobertPeters89/sd-recap-project-6/branches/main/protection` (or the rules API) |

Local checks before the PR: `npm run check`, `lint`, `test:run`, `coverage`, `build`.

## Files
- Create: `.github/workflows/sonar.yml` (triggers `pull_request` and `push` to `main`; `fetch-depth: 0`; Node 22 with npm cache; `npm ci`; `npm run coverage`; SonarQube scan action with `SONAR_TOKEN`; actions pinned by SHA like `ci.yml` and `build.yml`; `permissions: contents: read`, plus `pull-requests: read` if the scan needs it)
- Change: `sonar-project.properties`
  - `sonar.exclusions=src/**/*.test.ts,src/**/*.test.tsx`
  - `sonar.test.inclusions=src/**/*.test.ts,src/**/*.test.tsx`
  - `sonar.coverage.exclusions=src/types.ts,src/index.tsx` (entry files without tests)
  - keep `sonar.projectKey`, `sonar.organization`, `sonar.sources`, `sonar.tests`, `sonar.javascript.lcov.reportPaths`
- Remove or replace: `.github/workflows/build.yml` (see open question 1)
- Manual, outside the repository (by you, in the browser):
  - SonarQube Cloud: organization and project, switch **off** the automatic analysis, create the token
  - GitHub: secret `SONAR_TOKEN` (the token is never pasted into a prompt)
  - GitHub: branch protection / ruleset for `main`, after the workflows `ci` and Sonar ran once

## Out of scope
- Writing tests or any application code (first tests come with issue 4)
- Changes to `ci.yml` or to the npm scripts
- Coverage thresholds or custom quality gate conditions
- Requiring approvals, signed commits or other protection options beyond the issue

## Open questions
1. `build.yml` already has a SonarQube job. Should `sonar.yml` **replace** it (git rename/delete `build.yml`, so there is only one scan), or should `build.yml` stay? Two scans per PR would double the analysis and the check names. Recommendation: replace.
2. Name of the required status check: the job in the new workflow, e.g. `sonarqube`. A required check can only be chosen in GitHub after it ran once, so the branch protection has to be set after the first PR run. OK that I only do the file part and you do the protection in the browser?
3. Which check is "the quality gate" for the protection: the Actions job (`SonarQube`) or the "SonarCloud Code Analysis" check from the SonarQube Cloud app? With automatic analysis off, the second one may disappear.
4. Does SonarQube Cloud, SONAR_TOKEN and the project key `RobertPeters89_sd-recap-project-6` / org `robertpeters89` already exist (the scan on PR #17 passed)? Then only "switch off automatic analysis" remains from the first task.
