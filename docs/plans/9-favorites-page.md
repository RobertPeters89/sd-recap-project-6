# Plan: Issue #9 Favorites Page

## Context
The Favorites page lists all favorite art pieces (image, title, artist, active favorite button) on `/favorites`, reachable by a "Favorites" navigation link. Issue #8 (merged) put the favorite state in `App` (`ArtPieceInfo[]`, `isFavorite(slug)`, `toggleFavorite(slug)`), so no new state is needed. The task says to reuse an existing component: `ArtPieces` already renders a list with `ArtPiecePreview` (image, title, artist) and a `FavoriteButton` per piece, so the new route renders `ArtPieces` with only the favorite pieces, filtered with the existing `isFavorite`.

Current state: `Navigation.tsx` has `NavLink`s "Spotlight" (`/`, `end`) and "Gallery" (`/art-pieces`). `App.tsx` has routes `/`, `/art-pieces`, `/art-pieces/:slug`, `*`, all wrapped in `withArtPieces` (loading/error).

## Acceptance criteria and tests
Test-first order: `Navigation`, then `App`.

| Criterion | Test |
|---|---|
| Link labeled "Favorites" is displayed | `Navigation.test.tsx`: link "Favorites" with `href="/favorites"`; it has class `active` on `/favorites` and not on `/` |
| Clicking "Favorites" shows the page on `/favorites` | `App.test.tsx`: at `/` click "Favorites", the favorites list is shown; at `/favorites` directly the page is shown (loading and error messages like the other routes) |
| All favorite art pieces are displayed in a list | `App.test.tsx`: mark two pieces as favorite in the Gallery, click "Favorites": a list with exactly those two items, in the order of the fetched data |
| Only favorites are displayed | `App.test.tsx`: mark one piece, the other piece is not on the Favorites page; with no favorite the list is empty |
| Image, title and artist are displayed | `App.test.tsx`: on the Favorites page the favorite piece has an `img` (`src`, `alt`), its title and its artist |
| Each piece has an active favorite button | `App.test.tsx`: each shown piece has "Favorite <title>" with `aria-pressed="true"`; clicking it removes the piece from the page |

The `ArtPieces` component itself is unchanged and already covered by `ArtPieces.test.tsx`.

## Files
- Change `src/components/Navigation.tsx`: add `<NavLink to="/favorites">Favorites</NavLink>` after Gallery.
- Change `src/components/Navigation.test.tsx`: add the tests above (new tests only, no existing assertion changes).
- Change `src/App.tsx`: add `<Route path="/favorites" element={withArtPieces(pieces => <ArtPieces artPieces={pieces.filter(p => isFavorite(p.slug))} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />)} />`.
- Change `src/App.test.tsx`: add a `describe("App favorites page")` block (new tests only). The existing "navigation exactly once" test already covers the new link indirectly.
- No new component, no CSS change (the existing `nav` flex layout takes a third link).

## Out of scope
- Empty-state message, favorites count, sorting, favorites in the Details/Spotlight views
- Persistence in the browser (issue #12), comments (issue #10)
- Configs, thresholds, lint rules, skills, `.md` files other than the plan

## Open questions
1. Empty state: with no favorites the page shows an empty list (the issue says nothing). Keep it that way, or add a short message such as "No favorites yet"? Recommendation: keep it empty, only what the issue asks.
2. Clicking the active favorite button on the Favorites page removes the piece from the list immediately (follows from "only favorites are shown"). Is that fine?

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`: mark pieces on Gallery and Spotlight, open Favorites, check the list, un-favorite a piece there, reload (favorites are lost, as before).
