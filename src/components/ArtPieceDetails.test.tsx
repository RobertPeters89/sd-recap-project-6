import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";

import type { ArtPiece } from "../types";
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
  },
  {
    slug: "mona-lisa",
    artist: "Leonardo da Vinci",
    name: "Mona Lisa",
    imageSource: "https://example-apis.vercel.app/assets/art/mona-lisa.jpg",
    year: "1503",
    genre: "Portrait",
  },
];

function CurrentPath() {
  return <p data-testid="path">{useLocation().pathname}</p>;
}

function renderDetails(
  route: string,
  isFavorite: (slug: string) => boolean = () => false,
  onToggleFavorite: (slug: string) => void = () => {}
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

    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("shows the favorite button as pressed for a favorite", () => {
    renderDetails("/art-pieces/mona-lisa", (slug) => slug === "mona-lisa");

    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("toggles the favorite of the shown art piece", async () => {
    const onToggleFavorite = vi.fn();
    renderDetails("/art-pieces/mona-lisa", () => false, onToggleFavorite);

    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));

    expect(onToggleFavorite).toHaveBeenCalledWith("mona-lisa");
  });

  it("shows Art piece not found for an unknown slug", () => {
    renderDetails("/art-pieces/does-not-exist");

    expect(screen.getByText("Art piece not found")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
