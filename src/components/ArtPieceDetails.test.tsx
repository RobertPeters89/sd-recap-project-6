import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";

import type { ArtPiece, ArtPieceComment } from "../types";
import ArtPieceDetails from "./ArtPieceDetails";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource:
      "https://example-apis.vercel.app/assets/art/wheat-field-with-cypresses.jpg",
    year: "1889",
    genre: "Landscape Painting",
    colors: ["#37412E", "#8D7332", "#838665"],
  },
  {
    slug: "mona-lisa",
    artist: "Leonardo da Vinci",
    name: "Mona Lisa",
    imageSource: "https://example-apis.vercel.app/assets/art/mona-lisa.jpg",
    year: "1503",
    genre: "Portrait",
    colors: ["#2B2118", "#8C6D4A"],
  },
];

function CurrentPath() {
  return <p data-testid="path">{useLocation().pathname}</p>;
}

function renderDetails(
  route: string,
  isFavorite: (slug: string) => boolean = () => false,
  onToggleFavorite: (slug: string) => void = () => {},
  getComments: (slug: string) => ArtPieceComment[] = () => [],
  onAddComment: (slug: string, text: string) => void = () => {}
) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/art-pieces/:slug"
          element={
            <ArtPieceDetails
              artPieces={artPieces}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              getComments={getComments}
              onAddComment={onAddComment}
            />
          }
        />
        <Route path="/art-pieces" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ArtPieceDetails", () => {
  it("shows the image of the art piece", () => {
    renderDetails("/art-pieces/mona-lisa");

    const image = screen.getByRole("img", { name: "Mona Lisa" });
    expect(image).toHaveAttribute("src", artPieces[1].imageSource);
  });

  it("shows the title of the art piece", () => {
    renderDetails("/art-pieces/mona-lisa");

    expect(
      screen.getByRole("heading", { name: "Mona Lisa" })
    ).toBeInTheDocument();
  });

  it.each([
    ["artist", "Leonardo da Vinci"],
    ["year", "1503"],
    ["genre", "Portrait"],
  ])("shows the %s of the art piece", (_field, value) => {
    renderDetails("/art-pieces/mona-lisa");

    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it("shows a back button", () => {
    renderDetails("/art-pieces/mona-lisa");

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("navigates to /art-pieces when the back button is clicked", async () => {
    renderDetails("/art-pieces/mona-lisa");

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("path")).toHaveTextContent("/art-pieces");
  });

  it("shows a favorite button that is not pressed for a non-favorite", () => {
    renderDetails("/art-pieces/mona-lisa");

    expect(
      screen.getByRole("button", { name: "Favorite Mona Lisa" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the favorite button as pressed for a favorite", () => {
    renderDetails("/art-pieces/mona-lisa", (slug) => slug === "mona-lisa");

    expect(
      screen.getByRole("button", { name: "Favorite Mona Lisa" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("places the favorite button next to the image in a positioned container", () => {
    renderDetails("/art-pieces/mona-lisa");

    const container = screen.getByRole("button", {
      name: "Favorite Mona Lisa",
    }).parentElement;
    expect(container).toHaveClass("details-image");
    expect(container).toContainElement(
      screen.getByRole("img", { name: "Mona Lisa" })
    );
  });

  it("toggles the favorite of the shown art piece", async () => {
    const onToggleFavorite = vi.fn();
    renderDetails("/art-pieces/mona-lisa", () => false, onToggleFavorite);

    await userEvent.click(
      screen.getByRole("button", { name: "Favorite Mona Lisa" })
    );

    expect(onToggleFavorite).toHaveBeenCalledWith("mona-lisa");
  });

  it("shows the comments section with the comments of the art piece", () => {
    renderDetails("/art-pieces/mona-lisa", undefined, undefined, (slug) =>
      slug === "mona-lisa"
        ? [{ text: "Mysterious smile", date: "2025-03-01T09:15:00.000Z" }]
        : []
    );

    const section = screen.getByRole("region", { name: "Comments" });
    expect(section).toHaveTextContent("Mysterious smile");
  });

  it("shows the comment form", () => {
    renderDetails("/art-pieces/mona-lisa");

    expect(
      screen.getByRole("textbox", { name: "Comment" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add comment" })
    ).toBeInTheDocument();
  });

  it("adds a comment for the shown art piece", async () => {
    const onAddComment = vi.fn();
    renderDetails(
      "/art-pieces/mona-lisa",
      undefined,
      undefined,
      undefined,
      onAddComment
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Comment" }),
      "Mysterious smile"
    );
    await userEvent.click(screen.getByRole("button", { name: "Add comment" }));

    expect(onAddComment).toHaveBeenCalledWith("mona-lisa", "Mysterious smile");
  });

  it("shows the color palette of the art piece", () => {
    renderDetails("/art-pieces/mona-lisa");

    const list = screen.getByRole("list", { name: "Color palette" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(artPieces[1].colors.length);
    artPieces[1].colors.forEach((color, index) => {
      expect(items[index]).toHaveAccessibleName(color);
      expect(items[index]).toHaveStyle({ backgroundColor: color });
    });
  });

  it("does not show the colors of another art piece", () => {
    renderDetails("/art-pieces/mona-lisa");

    expect(
      screen.queryByRole("listitem", { name: artPieces[0].colors[0] })
    ).not.toBeInTheDocument();
  });

  it("shows Art piece not found for an unknown slug", () => {
    renderDetails("/art-pieces/does-not-exist");

    expect(screen.getByText("Art piece not found")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
