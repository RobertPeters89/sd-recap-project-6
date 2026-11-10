# Plan: Issue #13 Bonus - Testing Components

## Context
The issue asks for automated component tests for the core components (Spotlight, art piece preview, list of art pieces, navigation, art piece details). While building issues #8 to #12 test-first, all of these tests were written already. Checked on `main` with `npm run coverage`: 13 test files, 132 tests pass, `src/components` has 100 % statements, branches, functions and lines.

So the open question for this issue is not "write the tests" but "is anything still missing". Findings below.

## Acceptance criterion and tasks vs. existing tests

| Task / criterion | Existing tests |
|---|---|
| Spotlight | `Spotlight.test.tsx` (8): image, artist only of the selected piece, selected once on re-render, favorite button not pressed / pressed / in the figure / toggles, empty list renders nothing |
| Art piece preview | `ArtPiecePreview.test.tsx` (3): image with `src`, title, artist |
| List of art pieces | `ArtPieces.test.tsx` (7): list with all pieces, links to `/art-pieces/<slug>`, favorite button per piece (pressed state, toggle, placement, not inside the link) |
| Navigation links | `Navigation.test.tsx` (6): links Spotlight `/`, Gallery `/art-pieces`, Favorites `/favorites`, active class on the current route only |
| Art piece details | `ArtPieceDetails.test.tsx` (17): image, title, artist, year, genre, back button and navigation, favorite button (state, placement, toggle), comments, comment form and adding, color palette, unknown slug |
| "Core components render and function as expected" | all of the above; also `ColorPalette`, `Comments`, `CommentForm`, `FavoriteButton` tests |

Small gaps (found by reading the tests, not by coverage):
1. `Navigation.test.tsx` never asserts that the links sit in a `nav` landmark (`getByRole("navigation")`).
2. `ArtPiecePreview.test.tsx` has no test for the exact content structure (image plus caption in one `figure`); it only checks single texts.

Neither gap is a bug; both are optional.

## Recommendation
Do not rewrite or duplicate existing tests. Implementation phase (`/tdd-feature 13`) is verification-only plus, if approved below, the two small gap tests (each written first and checked to pass for the right reason, since the code already behaves this way).

## Files
- Create: `docs/plans/13-bonus-testing-components.md` (this plan).
- Only if open question 1 is answered "yes": add one test each to `src/components/Navigation.test.tsx` and `src/components/ArtPiecePreview.test.tsx`. No application code changes, no existing test changed.

## Styling
No markup and no UI change, so nothing is styled; the existing `src/styles.css` stays as it is.

## Changes to existing tests
None. Only additions, and only if approved.

## Out of scope
- The uncovered branch in `App.tsx` line 56 (`addComment`): `App` is not one of the components of this issue; it was reported before and not requested.
- `src/index.tsx` coverage, coverage thresholds, configs, lint rules, CSS, other `.md` files.

## Open questions
1. Add the two small gap tests (navigation landmark, preview structure)? Recommendation: yes, they are cheap and match the tasks "navigation links are rendered correctly" and the preview task. If "no", `/tdd-feature 13` only verifies and reports, and the PR says that no new tests were needed.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`. Expected: all green, components stay at 100 %.
