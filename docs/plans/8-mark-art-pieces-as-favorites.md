# Plan: Issue #8 Mark Art Pieces as Favorites

## Context
Users can mark art pieces as favorites on Gallery, Spotlight and Details via one reusable button. Favorite state is shared by several routes, so it lives in `App` (the component rendering `Routes`), separate from the fetched pieces and keyed by `slug`:

```ts
type ArtPieceInfo = { slug: string; isFavorite: boolean };
```

Current state: `App.tsx` fetches with `useSWR` and renders `/`, `/art-pieces`, `/art-pieces/:slug` through `withArtPieces`. `ArtPieces` wraps `ArtPiecePreview` in a `Link` per `li`. `Spotlight` renders image + artist. `ArtPieceDetails` renders image, name, artist, year, genre, Back. `lucide-react` is not installed.

## Acceptance criteria and tests
Component tests use RTL + `user-event`; `App` tests mock `fetch` with `SWRConfig` and a fresh `Map` (as in `src/App.test.tsx`).

| Criterion | Test |
|---|---|
| Button on each list entry | `ArtPieces.test.tsx`: one favorite button per piece |
| Button on details view | `ArtPieceDetails.test.tsx`: button present |
| Button on spotlight view | `Spotlight.test.tsx`: button present |
| Click on non-favorite saves it + visual indication | `FavoriteButton.test.tsx`: click calls `onToggle`; non-favorite state has `aria-pressed="false"`, label "Add to favorites" / unfilled icon. `App.test.tsx`: click in list, button becomes pressed |
| Click on favorite removes it + visual indication | `FavoriteButton.test.tsx` + `App.test.tsx`: second click returns to unpressed |
| Favorites visually highlighted | `FavoriteButton.test.tsx`: favorite state has distinct class/filled icon; `ArtPieces`/`Details`/`Spotlight` tests: favorite piece shows pressed button |
| State shared across routes | `App.test.tsx`: favorite in the list, navigate to details, still favorite |

Order (test-first): `FavoriteButton`, then `ArtPieces`, `ArtPieceDetails`, `Spotlight` (new props), then `App` (state + wiring).

## Files
- Create `src/components/FavoriteButton.tsx` + test: props `{ isFavorite: boolean; onToggle: () => void }`; `<button type="button" aria-pressed>` with heart icon, class toggled for highlight.
- Change `src/types.ts`: add `ArtPieceInfo`.
- Change `src/App.tsx`: `useState<ArtPieceInfo[]>`, `toggleFavorite(slug)`, `isFavorite(slug)` helper; pass `isFavorite`/`onToggleFavorite` props to the three routes.
- Change `ArtPieces.tsx` (+ `ArtPiecePreview` usage), `ArtPieceDetails.tsx`, `Spotlight.tsx`: render `FavoriteButton`. In the list the button must be a sibling of the `Link`, not inside it (no nested interactive elements).
- Change `src/styles.css`: minimal favorite/highlight styles.
- Change existing tests only to pass the new props (assertions unchanged).

## Out of scope
- Favorites page/filter, persistence (localStorage), backend
- Changing fetched art pieces or `ArtPiecePreview` content
- Configs, thresholds, lint rules, skills, `.md` files other than the plan

## Open questions
1. Heart icon: add the `lucide-react` dependency (hint suggests Lucide) or use an inline SVG without a new dependency? Recommendation: `lucide-react`.
2. `src/components/Spotlight.test.tsx` (uncommitted change) has a syntax error on line 14 (`genre: "Painting` is unterminated), so the test file fails to parse. Fix it as part of this issue, or leave it as is?
3. Favorites are lost on reload (state only, as the issue says). Confirm that is acceptable.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`: toggle on all three pages, check highlight and that state persists when navigating between routes.
