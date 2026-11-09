# Plan: Issue #7 Art Piece Details Page

## Context
A click on an art piece in the Gallery should open its details on `/art-pieces/:slug` (image, title, artist, year, genre) with a back button to the list; an unknown slug shows "Art piece not found". Current state: `App.tsx` fetches once with `useSWR` and renders routes `/`, `/art-pieces` and `*` via `withArtPieces` (loading/error handling); `ArtPieces` renders `<ul><li><ArtPiecePreview/></li></ul>`; `ArtPiece` in `src/types.ts` only has `slug`, `artist`, `name`, `imageSource`. The API also returns `year` and `genre` (README). `styles.css` already has `.details img`.

## Acceptance criteria and tests
Router tests use `MemoryRouter`; routes with `:slug` are rendered inside `<Routes>` so `useParams` works. `App` tests mock `fetch` and use `SWRConfig` with a fresh `Map` (as in `src/App.test.tsx`); clicks use `user-event`.

| Criterion | Test |
|---|---|
| Clicking an art piece in the list navigates to the detail page | `ArtPieces.test.tsx`: each item has a link with `href="/art-pieces/<slug>"`; `App.test.tsx`: at `/art-pieces` click an art piece, its details are shown |
| Details on route `/art-pieces/:slug` | `App.test.tsx`: at `/art-pieces/the-starry-night` the details of that piece are shown |
| Image displayed | `ArtPieceDetails.test.tsx`: `img` with `src = imageSource`, `alt = name` |
| Title displayed | `ArtPieceDetails.test.tsx`: heading with the name |
| Artist displayed | `ArtPieceDetails.test.tsx`: artist text |
| Year displayed | `ArtPieceDetails.test.tsx`: year text |
| Genre displayed | `ArtPieceDetails.test.tsx`: genre text |
| Back button displayed | `ArtPieceDetails.test.tsx`: `getByRole("button", { name: "Back" })` |
| Back button navigates to the list | `App.test.tsx`: at a detail URL click "Back", the list is shown; the URL is `/art-pieces` |
| Unknown slug shows "Art piece not found" | `ArtPieceDetails.test.tsx` and `App.test.tsx`: at `/art-pieces/does-not-exist` the message is shown and nothing crashes |

Order (test-first): `ArtPieceDetails` (content, back button, not found), `ArtPieces` (links), then `App` (route, click-through, back, unknown slug).

## Files
- Change `src/types.ts`: add `year: string` and `genre: string` to `ArtPiece` (required, as in the API).
- Create `src/components/ArtPieceDetails.tsx` + `ArtPieceDetails.test.tsx`: props `{ artPieces: ArtPiece[] }`; reads `slug` with `useParams`, finds the piece, renders image, title, artist, year, genre, and a `<button type="button">Back</button>` that calls `useNavigate()` with `/art-pieces` (not `-1`, so it also works after a direct visit); renders `<p>Art piece not found</p>` if the slug is unknown.
- Change `src/components/ArtPieces.tsx`: wrap each `ArtPiecePreview` in `<Link to={`/art-pieces/${slug}`}>`.
- Change `src/App.tsx`: add `<Route path="/art-pieces/:slug" element={withArtPieces(…ArtPieceDetails…)} />` (loading/error as for the other routes).
- Change `src/App.test.tsx`: add new tests.

## Changes to existing tests (approved with this plan)
Only these, no assertion is changed or removed:
1. Fixtures get `year` and `genre` so that `npm run check` stays green after the type change: `src/App.test.tsx`, `src/fetcher.test.ts`, `src/getRandomArtPiece.test.ts`, `src/components/ArtPiecePreview.test.tsx`, `src/components/ArtPieces.test.tsx`, `src/components/Spotlight.test.tsx`.
2. `src/components/ArtPieces.test.tsx`: the render is wrapped in `MemoryRouter`, because `Link` needs a router. The assertions stay the same.

## Out of scope
- Showing `colors` or `dimensions` (color palette is issue 11), favorites and comments on the page
- Previous/next navigation, copy link (idea issues)
- Changes to `ArtPiecePreview`, `Spotlight` (no links there), `Navigation`
- Styling beyond the existing CSS, redirects, a separate not-found page
- Changes to configs, thresholds, lint rules, `.md` files, skills or permissions

## Decisions (answered)
- `year` and `genre` are required fields; fixtures in existing tests are extended.
- Back control is a `<button>` using `useNavigate` to `/art-pieces`.

## Assumptions
- "Art piece not found" as a `<p>`; shown only after the data has loaded (before that "Loading...").
- Whole preview (image and text) is the clickable link; the link's accessible name is the combined text of the preview.

## Open questions
None.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`, click an art piece, check the details, the back button and `/art-pieces/unknown`.
