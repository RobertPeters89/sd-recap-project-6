import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("App navigation", () => {
  it.each(["/", "/art-pieces", "/unknown"])(
    "shows the navigation exactly once on %s",
    (route) => {
      vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

      renderApp(route);

      expect(screen.getAllByRole("navigation")).toHaveLength(1);
    }
  );

  it("shows the Gallery page after clicking Gallery", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
    renderApp("/");
    await screen.findByRole("img");

    await userEvent.click(screen.getByRole("link", { name: "Gallery" }));

    expect(await screen.findByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Wheat Field with Cypresses")).toBeInTheDocument();
    expect(screen.getByText("The Starry Night")).toBeInTheDocument();
  });

  it("shows the Spotlight page after clicking Spotlight", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
    renderApp("/art-pieces");
    await screen.findByRole("list");

    await userEvent.click(screen.getByRole("link", { name: "Spotlight" }));

    await waitFor(() =>
      expect(screen.queryByRole("list")).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("shows Page not found for an unknown URL", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderApp("/unknown");

    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});

describe("App details", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
  });

  it("shows the details of an art piece on /art-pieces/:slug", async () => {
    renderApp("/art-pieces/the-starry-night");

    expect(
      await screen.findByRole("heading", { name: "The Starry Night" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows the details after clicking an art piece in the list", async () => {
    renderApp("/art-pieces");

    await userEvent.click(
      await screen.findByRole("link", { name: /The Starry Night/ })
    );

    expect(
      await screen.findByRole("heading", { name: "The Starry Night" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("shows the list again after clicking the back button", async () => {
    renderApp("/art-pieces/the-starry-night");

    await userEvent.click(await screen.findByRole("button", { name: "Back" }));

    expect(await screen.findByRole("list")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Back" })
    ).not.toBeInTheDocument();
  });

  it("shows Art piece not found for an unknown slug", async () => {
    renderApp("/art-pieces/does-not-exist");

    expect(await screen.findByText("Art piece not found")).toBeInTheDocument();
  });
});

describe("App favorites", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
  });

  it("marks an art piece as favorite after clicking its button in the list", async () => {
    renderApp("/art-pieces");

    const buttons = await screen.findAllByRole("button", { name: "Favorite" });
    await userEvent.click(buttons[1]);

    const updated = screen.getAllByRole("button", { name: "Favorite" });
    expect(updated[0]).toHaveAttribute("aria-pressed", "false");
    expect(updated[1]).toHaveAttribute("aria-pressed", "true");
  });

  it("removes the favorite after clicking the button again", async () => {
    renderApp("/art-pieces");

    const [, button] = await screen.findAllByRole("button", {
      name: "Favorite",
    });
    await userEvent.click(button);
    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the favorite when navigating from the list to the details", async () => {
    renderApp("/art-pieces");
    const buttons = await screen.findAllByRole("button", { name: "Favorite" });
    await userEvent.click(buttons[1]);

    await userEvent.click(
      screen.getByRole("link", { name: /The Starry Night/ })
    );

    expect(
      await screen.findByRole("heading", { name: "The Starry Night" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("toggles the favorite on the details page and shows it in the list", async () => {
    renderApp("/art-pieces/the-starry-night");

    await userEvent.click(
      await screen.findByRole("button", { name: "Favorite" })
    );
    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    const buttons = await screen.findAllByRole("button", { name: "Favorite" });
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
    expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles the favorite on the spotlight page", async () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = 2 ** 32 - 1;
      return array;
    });
    renderApp("/");

    const button = await screen.findByRole("button", { name: "Favorite" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("link", { name: "Gallery" }));
    const buttons = await screen.findAllByRole("button", { name: "Favorite" });
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
    expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
  });
});
