import { fetcher } from "./fetcher";
import type { ArtPiece } from "./types";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource:
      "https://example-apis.vercel.app/assets/art/wheat-field-with-cypresses.jpg",
  },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetcher", () => {
  it("returns the parsed art pieces when the response is ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );

    await expect(fetcher("https://example.com/art")).resolves.toEqual(
      artPieces
    );
  });

  it("throws an Error when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(fetcher("https://example.com/art")).rejects.toThrow(Error);
  });
});
