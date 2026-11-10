# Plan: Issue #10 Comments for Art Pieces

## Context
The details page gets a "Comments" section: a list of the comments of the shown art piece (text, date and time) and a form (text field + submit button) that adds a comment to this art piece only. Empty comments cannot be submitted. Comments are stored in the existing info state in `App` (`ArtPieceInfo[]` from #8), as the issue's hint suggests, so favorites and comments live in one state per `slug`.

Current state: `App.tsx` keeps `artPiecesInfo: ArtPieceInfo[]` (`slug`, `isFavorite`) with `isFavorite(slug)` / `toggleFavorite(slug)` and passes them to the routes. `ArtPieceDetails` renders image + `FavoriteButton`, name, artist, year, genre, Back, and gets `artPieces`, `isFavorite`, `onToggleFavorite`. `styles.css` already has `.comments`, `.comments li`, `.comments time` and `.comment-form`, which the new components will use (no CSS change planned).

## Design
- `types.ts`: `ArtPieceComment { text: string; date: string }` (`date` = ISO string); `ArtPieceInfo` gets `comments: ArtPieceComment[]`.
- `App.tsx`: `getComments(slug)` (empty array if no entry) and `addComment(slug, text)` (creates the entry if missing, puts `{ text, date: new Date().toISOString() }` at the start of the list, so the newest comment is first). `toggleFavorite` creates new entries with `comments: []`; `addComment` creates new entries with `isFavorite: false`. Both are passed to `ArtPieceDetails` only.
- `Comments.tsx`: props `{ comments: ArtPieceComment[] }`; `<section className="comments" aria-labelledby=…>` with a heading "Comments" and a `<ul>`; renders the comments in the stored order (newest first); each `<li>` shows the text and `<time dateTime={date}>{new Date(date).toLocaleString()}</time>`.
- `CommentForm.tsx`: props `{ onAddComment: (text: string) => void }`; `<form className="comment-form">` with a labeled text field ("Comment", `required`) and a submit button ("Add comment"). On submit: `preventDefault`, trim, ignore if empty, otherwise call `onAddComment(trimmed)` and clear the field.
- `ArtPieceDetails.tsx`: new props `getComments` and `onAddComment(slug, text)`; renders `Comments` and `CommentForm` below the details.

## Acceptance criteria and tests
Test-first order: `Comments`, `CommentForm`, `ArtPieceDetails`, `App`. Fake only `Date` in tests that check dates (`vi.useFakeTimers({ toFake: ["Date"] })`) so `user-event` keeps working.

| Criterion | Test |
|---|---|
| Section labeled "Comments" with a list | `Comments.test.tsx`: `getByRole("region", { name: "Comments" })` containing a list with one item per comment; `ArtPieceDetails.test.tsx`: the section is on the details page |
| Each comment's text is displayed | `Comments.test.tsx`: text of each comment |
| Newest comment is shown first (decision) | `Comments.test.tsx`: items appear in the given order; `App.test.tsx`: after adding two comments the second is the first list item |
| Each comment's date and time are displayed | `Comments.test.tsx`: `<time>` with `dateTime` = stored ISO date and text = `new Date(date).toLocaleString()` |
| Form with text field and submit button | `CommentForm.test.tsx`: labeled textbox and submit button; `ArtPieceDetails.test.tsx`: form is on the details page |
| Submitting adds the comment to this art piece only | `CommentForm.test.tsx`: submit calls `onAddComment` with the text and clears the field; `App.test.tsx`: add a comment on piece A, it is listed with date; piece B shows none; back on A it is still there |
| Empty comments cannot be submitted | `CommentForm.test.tsx`: empty and whitespace-only input do not call `onAddComment`; `App.test.tsx`: submitting empty adds no list item |

Also `App.test.tsx`: a comment keeps the favorite state and vice versa (toggling a favorite does not delete comments), because both live in one entry.

## Files
- Change `src/types.ts`, `src/App.tsx`, `src/components/ArtPieceDetails.tsx`.
- Create `src/components/Comments.tsx` + `Comments.test.tsx`, `src/components/CommentForm.tsx` + `CommentForm.test.tsx`.
- Change `src/components/ArtPieceDetails.test.tsx`, `src/App.test.tsx`: new tests; in `ArtPieceDetails.test.tsx` the render helper passes the new required props (assertions unchanged, as in #8).

## Out of scope
- Persistence in the browser (issue #12), deleting or editing comments, author names
- Comments on Gallery, Spotlight or Favorites views
- Color palette (issue #11)
- Configs, thresholds, lint rules, skills, `.md` files other than the plan

## Decisions (answered)
- An empty comment cannot be submitted; whitespace-only input counts as empty and the stored text is trimmed.
- New comments are shown at the top (newest first).

## Open questions
- Comments are lost on reload (state only); persistence is issue #12. Assumed OK.

## Verification
`npm run check`, `lint`, `format:check`, `test:run`, `coverage`, `build`; then `npm run dev`: open a details page, add comments, check text and date, try an empty comment, open another art piece (no comments), come back, toggle the favorite and check the comments stay.
