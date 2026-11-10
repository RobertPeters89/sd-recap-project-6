import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

function spotlight(
  isFavorite: (slug: string) => boolean = () => false,
  onToggleFavorite: (slug: string) => void = () => {}
) {
  return (
    <Spotlight
      artPieces={artPieces}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  );
}

function renderSpotlight(
  isFavorite?: (slug: string) => boolean,
  onToggleFavorite?: (slug: string) => void
) {
  return render(spotlight(isFavorite, onToggleFavorite));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Spotlight", () => {
  it("shows the image of the selected art piece", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    renderSpotlight();

    const image = screen.getByRole("img", { name: "Mona Lisa" });
    expect(image).toHaveAttribute("src", artPieces[1].imageSource);
  });

  it("shows the artist's name of the selected art piece only", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    renderSpotlight();

    expect(screen.getByText("Leonardo da Vinci")).toBeInTheDocument();
    expect(screen.queryByText("Vincent van Gogh")).not.toBeInTheDocument();
  });

  it("selects the art piece only once when it re-renders", () => {
    const randomSpy = mockRandomValue(0);

    const { rerender } = render(spotlight());
    mockRandomValue(MAX_RANDOM_VALUE);
    rerender(spotlight());

    expect(
      screen.getByRole("img", { name: "Wheat Field with Cypresses" })
    ).toBeInTheDocument();
    expect(randomSpy).toHaveBeenCalledTimes(1);
  });

  it("shows a favorite button that is not pressed for a non-favorite", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    renderSpotlight();

    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("shows the favorite button as pressed for a favorite", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    renderSpotlight((slug) => slug === "mona-lisa");

    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("places the favorite button in the positioned figure", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    renderSpotlight();

    expect(screen.getByRole("figure")).toHaveClass("art-piece");
    expect(screen.getByRole("figure")).toContainElement(
      screen.getByRole("button", { name: "Favorite" })
    );
  });

  it("toggles the favorite of the selected art piece", async () => {
    mockRandomValue(MAX_RANDOM_VALUE);
    const onToggleFavorite = vi.fn();
    renderSpotlight(() => false, onToggleFavorite);

    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));

    expect(onToggleFavorite).toHaveBeenCalledWith("mona-lisa");
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(
      <Spotlight
        artPieces={[]}
        isFavorite={() => false}
        onToggleFavorite={() => {}}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
