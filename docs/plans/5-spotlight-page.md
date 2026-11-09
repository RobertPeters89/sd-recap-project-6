# Plan: Issue #5 Spotlight Page

## Context
The Spotlight page is the homepage (`/`). It shows one randomly selected art piece: its image and the artist's name. Issue #4 is merged: `src/App.tsx` fetches the art pieces once with `useSWR`, renders `<main><h1>Art Gallery</h1><Routes>…`, and only has the route `/art-pieces` (loading/error/list share one `gallery` element). Existing pieces to reuse: `ArtPiece` in `src/types.ts`, `fetcher`, `src/components/ArtPieces.tsx`. Hint of the issue: the random pick must not change on re-render.

## Acceptance criteria and tests
Tests mock `fetch` and wrap in `SWRConfig` with a fresh `Map` (as in `src/App.test.tsx`); `Math.random` is mocked with `vi.spyOn`.

| Criterion / task | Test |
|---|---|
| One art piece is randomly selected (function) | `src/getRandomArtPiece.test.ts`: `Math.random` = 0 returns the first, 0.999 the last piece; empty array returns `undefined` |
| Selected once, stable across re-renders (hint) | `Spotlight.test.tsx`: `rerender` with the same props keeps the same piece and `Math.random` was called once |
| Image of the selected piece displayed | `Spotlight.test.tsx`: `img` with `src = imageSource`, `alt = name` for the piece chosen by the mocked `Math.random` |
| Artist's name displayed | `Spotlight.test.tsx`: artist text of the selected piece is shown, the other piece's artist is not |
| Spotlight available on `/` | `App.test.tsx` (new tests only): `MemoryRouter` at `/` with mocked fetch shows the spotlight image and artist; at `/art-pieces` the spotlight is not shown |
| Loading/error on `/` (consistency with #4) | `App.test.tsx`: at `/` "Loading..." while loading and "Failed to load art pieces." on a non-ok response |

Order (test-first): `getRandomArtPiece`, `Spotlight`, then `App` (route, loading, error).

## Files
- Create `src/getRandomArtPiece.ts` + `src/getRandomArtPiece.test.ts`: `getRandomArtPiece(artPieces: ArtPiece[]): ArtPiece | undefined` using `Math.floor(Math.random() * length)`.
- Create `src/components/Spotlight.tsx` + `Spotlight.test.tsx`: props `{ artPieces: ArtPiece[] }`; `useState(() => getRandomArtPiece(artPieces))` picks once on mount; renders image (`alt = name`) and artist; renders nothing for an empty list.
- Change `src/App.tsx`: add route `/` with `<Spotlight />`; reuse the loading/error handling for both routes (small helper instead of the single `gallery` variable).
- Change `src/App.test.tsx`: add new tests only; existing tests stay unchanged.

## Out of scope
- Showing the title as visible text (only in `alt`)
- Keeping the same spotlight across navigation (new pick on every mount)
- Navigation, links, favorites, details page, design (issue 6 onward)
- "Show another spotlight" button (idea issue)
- Changes to configs, thresholds, lint rules, `.md` files, skills or permissions

## Decisions (answered)
- Title is not visible, only in `alt`.
- Navigating away and back picks a new random art piece.

## Open questions
None.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`, open `/` and reload a few times to see different spotlights.
