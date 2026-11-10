# Plan: Issue #11 Show Color Palette

## Context
The details page shows the colors of the art piece as a list of colored circles. The API already returns `colors: string[]` (hex values, see README), but `ArtPiece` in `src/types.ts` does not have the field yet. A new `ColorPalette` component renders the list; `styles.css` already has `.palette` (flex row, no bullets) and `.palette li` (round 2.5rem swatch with border), so no CSS change is needed.

Current state: `ArtPieceDetails` renders back button, image + favorite button, name, artist, year, genre, `Comments`, `CommentForm`. The details page now has one list (the comments).

## Design
- `types.ts`: add `colors: string[]` to `ArtPiece` (required, as in the API; same decision as for `year`/`genre` in #7).
- `ColorPalette.tsx`: props `{ colors: string[] }`; `<ul className="palette" aria-label="Color palette">`, one `<li>` per color with `style={{ backgroundColor: color }}`, `title={color}` and `aria-label={color}` (the hex value is the accessible name; no visible text). Keys `${color}-${index}` because a palette may contain a color twice.
- `ArtPieceDetails.tsx`: render `<ColorPalette colors={artPiece.colors} />` after the genre and before the comments.

## Acceptance criteria and tests
Test-first order: `ColorPalette`, `ArtPieceDetails`, `App`.

| Criterion | Test |
|---|---|
| Details page displays a list of all colors used in the image | `ColorPalette.test.tsx`: list named "Color palette" with exactly one item per color, in the given order, and an empty list for `[]`; `ArtPieceDetails.test.tsx`: the palette of the shown piece is displayed (and not the colors of the other piece); `App.test.tsx`: at `/art-pieces/the-starry-night` the fetched colors are shown |
| Colors are displayed visually (circles or squares) | `ColorPalette.test.tsx`: each item has `backgroundColor` equal to its color (`toHaveStyle`); shape and size come from the existing `.palette li` CSS, checked in the browser |

## Files
- Change `src/types.ts`, `src/components/ArtPieceDetails.tsx`.
- Create `src/components/ColorPalette.tsx` + `ColorPalette.test.tsx`.
- Change `src/components/ArtPieceDetails.test.tsx`, `src/App.test.tsx`: new tests.

## Changes to existing tests (approved with this plan)
Only these, no assertion is weakened:
1. Fixtures get a `colors` array so that `npm run check` stays green after the type change: `src/App.test.tsx`, `src/fetcher.test.ts`, `src/getRandomArtPiece.test.ts`, `src/components/ArtPiecePreview.test.tsx`, `src/components/ArtPieces.test.tsx`, `src/components/Spotlight.test.tsx`, `src/components/ArtPieceDetails.test.tsx`.
2. `src/App.test.tsx` → "App details" → "shows the details of an art piece on /art-pieces/:slug": the assertion "exactly one list, inside the Comments region" no longer holds because the palette is a list too. It becomes: exactly two lists, one inside the "Comments" region and one named "Color palette" (so the gallery list is still excluded).

## Out of scope
- `dimensions`, copying a color, showing hex text, color names
- Palette on Gallery, Spotlight or Favorites views
- Persistence (issue #12), configs, thresholds, lint rules, skills, `.md` files other than the plan

## Open questions
1. `colors` is required on `ArtPiece` and the existing fixtures are extended (as in #7). Or make it optional (`colors?: string[]`) to leave fixtures alone? Recommendation: required.
2. An art piece without colors (`[]`) shows an empty palette list. Fine, or hide the palette then? Recommendation: keep it simple, show the empty list (the API always returns colors).

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`: open a details page, check that the circles match the API colors, and that the layout with image, texts, palette and comments looks right.
