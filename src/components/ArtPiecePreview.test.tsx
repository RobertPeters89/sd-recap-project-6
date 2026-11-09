import { render, screen } from "@testing-library/react";

import type { ArtPiece } from "../types";
import ArtPiecePreview from "./ArtPiecePreview";

const artPiece: ArtPiece = {
  slug: "wheat-field-with-cypresses",
  artist: "Vincent van Gogh",
  name: "Wheat Field with Cypresses",
  imageSource:
    "https://example-apis.vercel.app/assets/art/wheat-field-with-cypresses.jpg",
};

describe("ArtPiecePreview", () => {
  it("shows the image of the art piece", () => {
    render(<ArtPiecePreview artPiece={artPiece} />);

    const image = screen.getByRole("img", { name: artPiece.name });
    expect(image).toHaveAttribute("src", artPiece.imageSource);
  });

  it("shows the title of the art piece", () => {
    render(<ArtPiecePreview artPiece={artPiece} />);

    expect(screen.getByText(artPiece.name)).toBeInTheDocument();
  });

  it("shows the artist's name of the art piece", () => {
    render(<ArtPiecePreview artPiece={artPiece} />);

    expect(screen.getByText(artPiece.artist)).toBeInTheDocument();
  });
});
