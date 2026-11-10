# Plan: Flowing background and centered text on the details page (no issue, styling request)

## Context
Two wishes from the user:
1. The background (black into red) should keep moving like a flow with the current colors; "variant 1" of the discussion: soft red areas that drift and merge on the black background, a bit faster so that the movement is visible.
2. The text on the art piece details page (`ArtPieceDetails`) should be centered.

Current state (read): `src/styles.css` sets `body { background-color: var(--color-bg); background-image: var(--bg-gradient); background-attachment: fixed; }`, variables `--color-bg`, `--color-bg-start` (#050404), `--color-bg-end` (#8a0f1b). Section 10 sets `animation-duration: 0.01ms !important` for all elements and pseudo-elements under reduced motion. `ArtPieceDetails` renders `article.details`: back button, `.details-image`, `h2`, three `p`, `ColorPalette` (`ul.palette`, flex), `Comments` (`h3`, `ul.comments`), `CommentForm` (`form.comment-form`, grid, `max-width: 28rem`). `.details > h2` and `.details > p` set margins and color only; no `text-align`.

## Design: moving background (CSS only, `src/styles.css`)
- The existing gradient stays as the base (same colors, same look when still).
- `body::before` and `body::after`: `position: fixed`, larger than the viewport (about 150 % of its size, offset so the edges never show), `z-index: -1`, `pointer-events: none`. Each layer holds two soft `radial-gradient(...)` areas from `var(--color-bg-end)` to `transparent`. No new color values.
- Both layers move with `transform` (translate and a slow rotate) on `@keyframes`, different paths and durations, `ease-in-out`, `infinite`, `alternate`: they overlap and merge differently over time, so it flows without a visible loop.
- Speed: two variables in the variables section: `--bg-flow-duration-a: 16s`, `--bg-flow-duration-b: 22s` (visibly faster than the 25 to 30 s first proposed). Adjusted after seeing it in the browser.
- Everything lives inside `@media (prefers-reduced-motion: no-preference)`, so with reduced motion the background stands still (the base gradient only). This also avoids the `0.01ms` rule of section 10 turning an infinite animation into flicker.
- Only `transform` is animated (cheap, no repaint of the page content).

## Design: centered text on the details page (`src/styles.css`)
- `.details { text-align: center; }`: centers title, artist, year, genre, the "Comments" heading, comments with their date and the form label.
- `.palette { justify-content: center; }` (flex, so `text-align` does not move it).
- `.comment-form { margin-inline: auto; }` so the form sits in the middle; the input text stays left aligned, as users expect when typing.
- `.details > button { display: block; }` so the Back button stays on the left and is not pulled to the middle.
- The details image stays as it is.

## Styling
Only existing variables are used (`--color-bg-end`, `--color-bg-start`, `--space-*`); the two new variables are durations, not colors. No markup change, no new class. No component change.

## Tests
No component or markup changes, and jsdom runs neither animations nor layout, so there is nothing new to unit-test; the existing 135 tests must stay green. The look is checked in the browser instead (below). This is stated in the PR.

## Files
- Change: `src/styles.css` (variables, background layers and keyframes, details alignment).
- Create: `docs/plans/flowing-background-and-centered-details.md` (this plan).
- Branch: `feature/flowing-background-and-centered-details`.

## Out of scope
- Other background variants (rotating, pulsing, endless band), other pages' alignment, the Back button position, markup or component changes, thresholds, configs, other `.md` files.

## Open questions
1. Durations 16 s and 22 s per layer (visible but calm). Recommendation: yes, adjust after seeing it.
2. Text centered on the details page including comments and the form label; Back button stays left; the input text stays left aligned. Recommendation: yes.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`. Then in headless Chrome on a dev server of my own (scripts and screenshots in the scratchpad, own process stopped afterwards):
- screenshots of the Gallery at several times (for example 0 s, 6 s, 12 s) to confirm that the red areas move and that the text stays readable;
- computed `transform` of both layers changes over time;
- with emulated reduced motion the layers do not animate;
- details page: computed `text-align` is `center` for title and paragraphs, the palette is centered, the Back button is on the left.
Not verifiable here: other browsers, performance on weak devices, how the speed feels.
