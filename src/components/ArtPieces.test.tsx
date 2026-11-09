import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import type { ArtPiece } from "../types";
import ArtPieces from "./ArtPieces";

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
    slug: "the-starry-night",
    artist: "Vincent van Gogh",
    name: "The Starry Night",
    imageSource:
      "https://example-apis.vercel.app/assets/art/the-starry-night.jpg",
    year: "1889",
    genre: "Post-Impressionism",
  },
];

function renderArtPieces() {
  render(
    <MemoryRouter>
      <ArtPieces artPieces={artPieces} />
    </MemoryRouter>
  );
}

describe("ArtPieces", () => {
  it("shows all art pieces in a list", () => {
    renderArtPieces();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Wheat Field with Cypresses")).toBeInTheDocument();
    expect(screen.getByText("The Starry Night")).toBeInTheDocument();
  });

  it("links each art piece to its detail page", () => {
    renderArtPieces();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      "/art-pieces/wheat-field-with-cypresses"
    );
    expect(links[1]).toHaveAttribute("href", "/art-pieces/the-starry-night");
  });
});
