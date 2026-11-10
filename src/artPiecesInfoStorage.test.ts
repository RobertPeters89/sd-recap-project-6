import {
  loadArtPiecesInfo,
  saveArtPiecesInfo,
  STORAGE_KEY,
} from "./artPiecesInfoStorage";
import type { ArtPieceInfo } from "./types";

const infos: ArtPieceInfo[] = [
  {
    slug: "the-starry-night",
    isFavorite: true,
    comments: [{ text: "Swirling sky", date: "2025-03-01T09:15:00.000Z" }],
  },
  { slug: "mona-lisa", isFavorite: false, comments: [] },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("saveArtPiecesInfo", () => {
  it("writes the info as JSON under the storage key", () => {
    saveArtPiecesInfo(infos);

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual(
      infos
    );
  });

  it("does not throw when the storage cannot be written", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() => saveArtPiecesInfo(infos)).not.toThrow();
  });
});

describe("loadArtPiecesInfo", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(loadArtPiecesInfo()).toEqual([]);
  });

  it("returns the saved info", () => {
    saveArtPiecesInfo(infos);

    expect(loadArtPiecesInfo()).toEqual(infos);
  });

  it("returns an empty list for invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");

    expect(loadArtPiecesInfo()).toEqual([]);
  });

  it.each([
    ["an object", { slug: "mona-lisa" }],
    ["a string", "text"],
    ["null", null],
    ["a list with a wrong item", [{ slug: 1, isFavorite: true, comments: [] }]],
    ["a list with a missing field", [{ slug: "mona-lisa", isFavorite: true }]],
    [
      "a list with a wrong comment",
      [{ slug: "mona-lisa", isFavorite: false, comments: [{ text: 1 }] }],
    ],
  ])("returns an empty list for %s", (_name, value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));

    expect(loadArtPiecesInfo()).toEqual([]);
  });

  it("returns an empty list when the storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("access denied");
    });

    expect(loadArtPiecesInfo()).toEqual([]);
  });
});
