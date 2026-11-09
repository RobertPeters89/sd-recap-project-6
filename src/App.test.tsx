import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";

import App from "./App";
import type { ArtPiece } from "./types";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource:
      "https://example-apis.vercel.app/assets/art/wheat-field-with-cypresses.jpg",
  },
  {
    slug: "the-starry-night",
    artist: "Vincent van Gogh",
    name: "The Starry Night",
    imageSource:
      "https://example-apis.vercel.app/assets/art/the-starry-night.jpg",
  },
];

function renderApp(route: string) {
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("shows all art pieces on /art-pieces", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );

    renderApp("/art-pieces");

    expect(
      await screen.findByText("Wheat Field with Cypresses")
    ).toBeInTheDocument();
    expect(screen.getByText("The Starry Night")).toBeInTheDocument();
  });

  it("does not show the list on another route", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );

    renderApp("/other");

    await screen.findByRole("heading", { name: "Art Gallery" });
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows the heading on another route while loading", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderApp("/other");

    expect(
      screen.getByRole("heading", { name: "Art Gallery" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows the heading on another route when loading fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);

    renderApp("/other");

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(
      screen.getByRole("heading", { name: "Art Gallery" })
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Failed to load art pieces.")
    ).not.toBeInTheDocument();
  });

  it("shows a loading message while the art pieces are loading", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderApp("/art-pieces");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the spotlight on /", async () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = 2 ** 32 - 1;
      return array;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );

    renderApp("/");

    const image = await screen.findByRole("img", { name: "The Starry Night" });
    expect(image).toHaveAttribute("src", artPieces[1].imageSource);
    expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("does not show the spotlight on /art-pieces", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );

    renderApp("/art-pieces");

    await screen.findByRole("list");
    expect(screen.queryAllByRole("img")).toHaveLength(artPieces.length);
    expect(screen.queryAllByRole("figure")).toHaveLength(artPieces.length);
  });

  it("shows a loading message on /", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderApp("/");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an error message on / when loading fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    renderApp("/");

    expect(
      await screen.findByText("Failed to load art pieces.")
    ).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    renderApp("/art-pieces");

    expect(
      await screen.findByText("Failed to load art pieces.")
    ).toBeInTheDocument();
  });
});
