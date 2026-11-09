import { render, screen } from "@testing-library/react";

import type { ArtPiece } from "../types";
import Spotlight from "./Spotlight";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource:
      "https://example-apis.vercel.app/assets/art/wheat-field-with-cypresses.jpg",
    year: "1889",
    genre: "Painting",
  },
  {
    slug: "mona-lisa",
    artist: "Leonardo da Vinci",
    name: "Mona Lisa",
    imageSource: "https://example-apis.vercel.app/assets/art/mona-lisa.jpg",
    year: "1889",
    genre: "Painting",
  },
];

const MAX_RANDOM_VALUE = 2 ** 32 - 1;

function mockRandomValue(value: number) {
  return vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    (array as Uint32Array)[0] = value;
    return array;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Spotlight", () => {
  it("shows the image of the selected art piece", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    render(<Spotlight artPieces={artPieces} />);

    const image = screen.getByRole("img", { name: "Mona Lisa" });
    expect(image).toHaveAttribute("src", artPieces[1].imageSource);
  });

  it("shows the artist's name of the selected art piece only", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    render(<Spotlight artPieces={artPieces} />);

    expect(screen.getByText("Leonardo da Vinci")).toBeInTheDocument();
    expect(screen.queryByText("Vincent van Gogh")).not.toBeInTheDocument();
  });

  it("selects the art piece only once when it re-renders", () => {
    const randomSpy = mockRandomValue(0);

    const { rerender } = render(<Spotlight artPieces={artPieces} />);
    mockRandomValue(MAX_RANDOM_VALUE);
    rerender(<Spotlight artPieces={artPieces} />);

    expect(
      screen.getByRole("img", { name: "Wheat Field with Cypresses" })
    ).toBeInTheDocument();
    expect(randomSpy).toHaveBeenCalledTimes(1);
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<Spotlight artPieces={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
