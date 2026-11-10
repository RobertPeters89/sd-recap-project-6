# Plan: Diagonal flow-in animation (no issue, styling request)

## Context
The background fades from black (top left) to red (bottom right) at `135deg`. The user wants the page content to flow in from the same direction when changing pages, e.g. Spotlight to Gallery: the pieces appear one after the other, from top left to bottom right. Simple stage first; an exact diagonal wave (row + column) only if the result lacks it.

Current state (read): `src/styles.css` section 4 has, inside `@media (prefers-reduced-motion: no-preference)`, `.art-piece { animation: fade-up 0.5s ease both; }` with keyframes `fade-up` (from `opacity: 0; translateY(12px)`). All cards run it at the same time. `ArtPieces` renders `<li className="art-piece">` per piece; `Spotlight` renders `figure.art-piece.spotlight`. `h1` and `nav` sit outside `<Routes>` in `App`, so they do not re-mount on a route change and do not replay. Section 10 already shortens animations for reduced motion.

## Design
- Direction: change `fade-up` to start from the top left: `opacity: 0; transform: translate(-1rem, -1rem)` and end at `none`.
- Stagger: each list item gets a delay from its position. `ArtPieces.tsx`: `<li style={{ "--i": index }}>` (typed, via `CSSProperties` with the custom property). CSS: `animation-delay: min(calc(var(--i, 0) * 80ms), 800ms)` on `.art-list .art-piece`; the cap keeps the whole wave under about one second for any number of pieces. The spotlight has no `--i` (falls back to 0) and flows in without delay.
- Everything stays inside the existing `prefers-reduced-motion: no-preference` block, so reduced motion shows no animation, as now.
- Only existing variables and keyframes are reused; no new color values; no new dependency.

## Styling
Existing classes and variables of `src/styles.css` are used (`.art-list`, `.art-piece`, `fade-up`); no new classes. Changes: keyframes `fade-up` and one rule for the delay in the same media block. No new color values.

## Tests (test-first)
- `ArtPieces.test.tsx` (new test): each list item carries its position as `--i` (`0`, `1`, ...) so the stagger follows the list order.
- CSS itself is not unit-tested (jsdom does not run animations); it is checked in the browser.
- No existing test changes.

## Files
- Change: `src/components/ArtPieces.tsx` (one `style` prop with `--i`), `src/components/ArtPieces.test.tsx` (one new test), `src/styles.css` (keyframes, delay rule).
- Create: `docs/plans/diagonal-flow-in-animation.md` (this plan).
- Branch: `feature/diagonal-flow-in-animation`.

## Out of scope
- Exact diagonal wave (row + column) and page cross-fades (View Transitions API); revisited only if the simple stage looks wrong.
- Details page animation, nav or heading animation, other effects (zoom, alternating directions).
- Layout changes (the circle, frame and edge layouts were dropped), other `.md` files, configs, thresholds.

## Open questions
1. Delay 80 ms per piece, capped at 800 ms, offset 1 rem. Recommendation: yes, adjust after seeing it in the browser.
2. The animation also plays on Favorites (same list) and on the Spotlight image, not on the details page. Recommendation: yes.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`. Then `npm run dev` in headless Chrome: record frames shortly after switching from Spotlight to Gallery and check that cards appear one by one from top left and that the end state is unchanged. Not verifiable here: other browsers, reduced-motion setting on a real system (it can be emulated in headless Chrome and will be, if possible), feel of the timing. Screenshots and scripts go to the scratchpad and are reported.

## Update after review (user feedback)
- The flow-in is 1.5 seconds slower: one shared variable `--flow-duration: 2s` (was 0.5s) in the variables section of `src/styles.css`.
- It also applies to the details page (`.details`, with image, texts, palette and comments), with the same `fade-up` from the top left and no stagger. This replaces the "Details page animation" item under "Out of scope".
