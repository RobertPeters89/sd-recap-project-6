# Plan: Issue #4 Gallery Page

## Context
The Gallery page lists all art pieces (image, title, artist) on `/art-pieces`. Today `src/App.tsx` is a placeholder and `src/index.tsx` already wraps the app in `BrowserRouter`. There are no tests yet. The API (`https://example-apis.vercel.app/api/art`) returns objects with `slug`, `artist`, `name`, `imageSource` (plus `year`, `genre`, `colors`, `dimensions`, unused here). Per the issue, `App.tsx` fetches once with `useSWR` and passes the data down as props, so later pages (Spotlight, Favorites, Details) can reuse it.

## Acceptance criteria and tests
Tests mock `fetch` (`vi.stubGlobal`) and wrap in `SWRConfig` with `provider: () => new Map()` so the SWR cache does not leak between tests. Routing tests use `MemoryRouter`.

| Criterion / task | Test |
|---|---|
| All art pieces displayed in a list | `ArtPieces.test.tsx`: given 2 pieces, renders a list with 2 list items |
| Image displayed | `ArtPiecePreview.test.tsx`: `img` with `src = imageSource` and `alt = name` |
| Title displayed | `ArtPiecePreview.test.tsx`: title text is shown |
| Artist's name displayed | `ArtPiecePreview.test.tsx`: artist text is shown |
| List available on `/art-pieces` | `App.test.tsx`: `MemoryRouter` at `/art-pieces` with mocked fetch shows all titles; at another route (e.g. `/other`) the list is not shown |
| Fetch with `useSWR` and typed `fetcher` | `fetcher.test.ts`: returns parsed `ArtPiece[]` on ok response; throws `Error` on non-ok response |
| Loading state | `App.test.tsx`: before fetch resolves, loading message is shown |
| Error state | `App.test.tsx`: fetch with non-ok response shows error message |

Order (test-first, one failing test then minimal code): fetcher, preview, list, App (route, loading, error).

## Files
- Create `src/types.ts`: `ArtPiece` with only used properties (`slug`, `artist`, `name`, `imageSource`). Already excluded from coverage in `sonar-project.properties`.
- Create `src/fetcher.ts` + `src/fetcher.test.ts`: `fetcher(url): Promise<ArtPiece[]>`, throws `Error` if `!response.ok`.
- Create `src/components/ArtPiecePreview.tsx` + test: props `{ artPiece: ArtPiece }`; image, title, artist.
- Create `src/components/ArtPieces.tsx` + test: props `{ artPieces: ArtPiece[] }`; `<ul>` with `<li key={slug}>` per piece.
- Change `src/App.tsx`: `useSWR<ArtPiece[]>(url, fetcher)`, loading and error states, `<Routes>` with `<Route path="/art-pieces" element={<ArtPieces artPieces={data} />} />`. Add `src/App.test.tsx`.
- Change `src/styles.css` only minimally if needed for list layout.

## Out of scope
- Spotlight, Favorites, Details pages, navigation, favorites, comments, color palette
- Links from a preview to the details page (issue 7)
- Redirect or content for `/`
- Retry button, image space reservation, sorting/filtering (idea issues)
- Changing configs, thresholds or lint rules

## Decisions (answered)
- `/` stays unchanged (existing heading only, no redirect).
- Texts: "Loading..." and "Failed to load art pieces."
- Components live in `src/components/`.

## Open questions
None.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev` and open `/art-pieces` to see the list.
