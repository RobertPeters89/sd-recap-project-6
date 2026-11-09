# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- Art Gallery app: React 19, TypeScript (strict), React Router, SWR for data fetching, built with Vite.
- Tests: Vitest (jsdom, globals, `src/setupTests.ts`) and React Testing Library. Configuration, including coverage, lives in the `test` block of `vite.config.ts`. Do not create a `vitest.config.ts`.
- Lint and format: ESLint (flat config in `eslint.config.js`: `@eslint/js`, `typescript-eslint`, `eslint-plugin-sonarjs`) and Prettier (`.prettierrc.json`).
- Data: art pieces come from `https://example-apis.vercel.app/api/art`.
- Entry points: `src/index.tsx` (wraps the app in `BrowserRouter`) and `src/App.tsx`.

## Commands

- `npm run dev`: start the dev server
- `npm run build`: build the project
- `npm run check`: type-check with TypeScript
- `npm run test:run`: run all tests once
- `npm run test:run -- <file or pattern>`: run a single test file
- `npm run coverage`: run the tests once and write `coverage/lcov.info`
- `npm run lint`: check the code with ESLint
- `npm run format`: format the code with Prettier
- `npm run format:check`: check the formatting with Prettier

Run `check`, `lint`, `format:check`, `test:run` and `coverage` before every commit.

## Conventions

- Write all code and tests in TypeScript and type props, state and fetched data.
- Tests live next to the code as `*.test.ts` or `*.test.tsx`. In Vitest patterns always cover `.ts` and `.tsx`, e.g. `src/**/*.{ts,tsx}`.
- Work test-first: a failing test, then the minimal code.
- One branch and one pull request per issue; branch name `feature/<issue number>-<slug>`.

## Off limits

- Never use `npm test` (it starts watch mode). Use `npm run test:run`.
- Never change a test to make it pass.
- Never lower a threshold or disable a rule to make a check green.
- Only do what the current issue asks for.
