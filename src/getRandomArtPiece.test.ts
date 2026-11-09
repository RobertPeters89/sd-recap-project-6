import { getRandomArtPiece } from "./getRandomArtPiece";
import type { ArtPiece } from "./types";

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
    slug: "the-starry-night",
    artist: "Vincent van Gogh",
    name: "The Starry Night",
    imageSource:
      "https://example-apis.vercel.app/assets/art/the-starry-night.jpg",
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

describe("getRandomArtPiece", () => {
  it("returns the first art piece when the random value is the smallest", () => {
    mockRandomValue(0);

    expect(getRandomArtPiece(artPieces)).toBe(artPieces[0]);
  });

  it("returns the last art piece when the random value is the largest", () => {
    mockRandomValue(MAX_RANDOM_VALUE);

    expect(getRandomArtPiece(artPieces)).toBe(artPieces[2]);
  });

  it("returns undefined for an empty list", () => {
    expect(getRandomArtPiece([])).toBeUndefined();
  });
});
