# Plan: Issue #6 App Navigation Design

## Context
The app has two pages (Spotlight on `/`, Gallery on `/art-pieces`) but no way to switch between them and no handling for unknown URLs. `src/App.tsx` renders `<main><h1>Art Gallery</h1><Routes>…</Routes></main>`. `src/styles.css` already contains the navigation styles (fixed bar at the bottom, `nav a`, `nav a.active`) and `main` has bottom padding for it, so no CSS change is needed. React Router's `NavLink` adds the class `active` to the link of the current page; the `end` prop is needed for `/`.

## Acceptance criteria and tests
Tests use `MemoryRouter`; `App` tests mock `fetch` and wrap in `SWRConfig` with a fresh `Map` (like the existing `src/App.test.tsx`). Clicks use `@testing-library/user-event`.

| Criterion / task | Test |
|---|---|
| Link "Spotlight" displayed | `Navigation.test.tsx`: `getByRole("link", { name: "Spotlight" })` with `href="/"` |
| Link "Gallery" displayed | `Navigation.test.tsx`: `getByRole("link", { name: "Gallery" })` with `href="/art-pieces"` |
| Clicking "Spotlight" shows the Spotlight page | `App.test.tsx`: start at `/art-pieces`, click "Spotlight", the spotlight image is shown and the list is gone |
| Clicking "Gallery" shows the Gallery page | `App.test.tsx`: start at `/`, click "Gallery", the list with all titles is shown |
| Link of the current page highlighted | `Navigation.test.tsx`: at `/` "Spotlight" has class `active` and "Gallery" not; at `/art-pieces` the other way round (proves `end` on `/`) |
| Unknown URLs show "Page not found" | `App.test.tsx`: at `/unknown`, "Page not found" is shown, also while `fetch` never resolves |
| Navigation rendered only once, on all pages | `App.test.tsx`: exactly one `navigation` landmark on `/`, `/art-pieces` and `/unknown` |

Order (test-first): `Navigation` (links, then active state), then `App` (navigation once, clicks, not found).

## Files
- Create `src/components/Navigation.tsx` + `Navigation.test.tsx`: `<nav>` with two `NavLink`s, "Spotlight" (`to="/"`, `end`) and "Gallery" (`to="/art-pieces"`).
- Change `src/App.tsx`: render `<Navigation />` once next to `<main>` (outside `<Routes>`), add `<Route path="*" element={<p>Page not found</p>} />`.
- Change `src/App.test.tsx`: add new tests only; existing tests stay unchanged.
- No change to `src/styles.css`, configs, or `.md` files.

## Out of scope
- Restyling the pages, the `h1`, or the list/preview markup (`.art-list`, `.art-piece` classes are not used yet)
- Links to Favorites or Details (later issues), a back link on the not-found page
- Redirects, a separate NotFound component or page layout
- Changes to configs, thresholds, lint rules, `.md` files, skills or permissions

## Assumptions (no open question for you unless you disagree)
- Message text exactly "Page not found", as a `<p>`.
- The not-found message does not depend on the fetch state (it shows even while loading or if the API fails).
- `<nav>` sits outside `<main>`; it is fixed at the bottom by the existing CSS.

## Open questions
None.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`, click both links and open an unknown URL to see the highlight and the message.
