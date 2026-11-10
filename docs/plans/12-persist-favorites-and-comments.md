# Plan: Issue #12 Persist Favorites and Comments in the Browser

## Context
Favorites and comments live in `useState<ArtPieceInfo[]>([])` in `App` and are lost on reload. They are saved in `localStorage` instead; the art pieces themselves stay fetched from the API (hint of the issue). The state shape (`ArtPieceInfo[]` with `slug`, `isFavorite`, `comments`) does not change, so no component changes.

Current state: `App.tsx` calls `useState<ArtPieceInfo[]>([])`; all changes go through `toggleFavorite` and `addComment`, which call `setArtPiecesInfo`. `src/setupTests.ts` only imports `@testing-library/jest-dom/vitest`. No existing code uses `localStorage`. Tests run in jsdom, which provides `localStorage`.

## Design
- New `src/artPiecesInfoStorage.ts`:
  - `STORAGE_KEY = "art-pieces-info"`.
  - `loadArtPiecesInfo(): ArtPieceInfo[]`: `getItem`; `null` gives `[]`; `JSON.parse` inside `try/catch`; a type guard checks that the value is an array of `{ slug: string; isFavorite: boolean; comments: { text: string; date: string }[] }`; anything else (invalid JSON, wrong shape, `localStorage` throwing) gives `[]`.
  - `saveArtPiecesInfo(infos: ArtPieceInfo[]): void`: `setItem(STORAGE_KEY, JSON.stringify(infos))` inside `try/catch` (quota or blocked storage must not crash the app).
- `App.tsx`: `useState<ArtPieceInfo[]>(loadArtPiecesInfo)` (read once) and `useEffect(() => saveArtPiecesInfo(artPiecesInfo), [artPiecesInfo])`.
- `setupTests.ts`: `afterEach(() => localStorage.clear())`, because persisted state would otherwise leak between tests (e.g. a favorite set in one `App` test would show up in the next).

## Acceptance criteria and tests
Test-first order: `artPiecesInfoStorage`, then `App`. "Reload" in `App` tests means: unmount, then render `App` again with the same `localStorage`.

| Criterion | Test |
|---|---|
| Favorite flags are persisted across reloads | `artPiecesInfoStorage.test.ts`: `saveArtPiecesInfo` writes the JSON under the key and `loadArtPiecesInfo` returns the same data; `App.test.tsx`: mark a piece as favorite, reload, the button is pressed and the piece is on `/favorites`; un-favorite, reload, it is gone |
| Comments are persisted across reloads | `App.test.tsx`: add a comment on a details page, reload, the comment with its date is shown, newest first, and comments of other pieces are unchanged |
| Without any data in the local storage the app still works | `artPiecesInfoStorage.test.ts`: `loadArtPiecesInfo` returns `[]` for no entry; `App.test.tsx`: with empty storage the gallery, details and favorites pages render and can be used (existing tests already run with empty storage) |
| (Robustness) Broken data does not crash the app | `artPiecesInfoStorage.test.ts`: invalid JSON, a non-array and an array with wrong shapes give `[]`; `localStorage.getItem` throwing gives `[]`; `setItem` throwing does not throw; `App.test.tsx`: with corrupt data in storage the gallery renders with no favorites |
| Stored state is written on every change | `App.test.tsx`: after toggling a favorite and adding a comment, `localStorage` holds the new `ArtPieceInfo[]` |

## Files
- Create `src/artPiecesInfoStorage.ts` + `src/artPiecesInfoStorage.test.ts`.
- Change `src/App.tsx` (state initializer + effect), `src/App.test.tsx` (new tests), `src/setupTests.ts` (clear `localStorage` after each test).

## Styling
This issue adds no markup and no UI: only state loading and saving change. So the existing styling in `src/styles.css` (theme variables, `.art-list`, `.art-piece`, `.empty-state`, `.details`, `.comments`, `.comment-form`, ...) is used as it is and nothing has to be styled afterwards. No CSS change is planned. If a UI element turns up during the work, it gets the existing classes and CSS variables (no new color values) in the same change.

## Changes to existing tests
None. The only shared change is the `afterEach` in `src/setupTests.ts`, which keeps the existing tests isolated; no assertion is touched. To be approved with this plan.

## Out of scope
- Syncing between tabs (`storage` event), versioning or migrating the stored data
- Removing data for art pieces that no longer exist in the API
- Persisting anything else (the fetched art pieces, the Spotlight pick)
- Configs, thresholds, lint rules, skills, `.md` files other than the plan

## Open questions
1. Storage key `art-pieces-info` and a separate module with a type guard for the loaded data (instead of an unchecked `JSON.parse` cast). Recommendation: yes, it keeps the app working with broken data.
2. Clearing `localStorage` after each test in the shared `src/setupTests.ts` (instead of per test file). Recommendation: yes, one place.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`: mark favorites and add comments, reload, check they are still there; clear the site data (or set the key to broken JSON in the dev tools) and check the app still loads.
