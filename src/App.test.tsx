import { render, screen, waitFor, within } from "@testing-library/react";
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
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Comments" })).toContainElement(
      lists[0]
    );
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
  const starryNightButton = { name: "Favorite The Starry Night" };
  const wheatFieldButton = { name: "Favorite Wheat Field with Cypresses" };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
  });

  it("marks an art piece as favorite after clicking its button in the list", async () => {
    renderApp("/art-pieces");

    await userEvent.click(await screen.findByRole("button", starryNightButton));

    expect(screen.getByRole("button", starryNightButton)).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", wheatFieldButton)).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("removes the favorite after clicking the button again", async () => {
    renderApp("/art-pieces");

    await userEvent.click(await screen.findByRole("button", starryNightButton));
    await userEvent.click(screen.getByRole("button", starryNightButton));

    expect(screen.getByRole("button", starryNightButton)).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("keeps the favorite when navigating from the list to the details", async () => {
    renderApp("/art-pieces");
    await userEvent.click(await screen.findByRole("button", starryNightButton));

    await userEvent.click(
      screen.getByRole("link", { name: /The Starry Night/ })
    );

    expect(
      await screen.findByRole("heading", { name: "The Starry Night" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", starryNightButton)).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("toggles the favorite on the details page and shows it in the list", async () => {
    renderApp("/art-pieces/the-starry-night");

    await userEvent.click(await screen.findByRole("button", starryNightButton));
    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(
      await screen.findByRole("button", starryNightButton)
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", wheatFieldButton)).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("toggles the favorite on the spotlight page and shows it in the list", async () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = 2 ** 32 - 1;
      return array;
    });
    renderApp("/");

    const button = await screen.findByRole("button", starryNightButton);
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("link", { name: "Gallery" }));
    expect(
      await screen.findByRole("button", starryNightButton)
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", wheatFieldButton)).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});

describe("App favorites page", () => {
  const starryNightButton = { name: "Favorite The Starry Night" };
  const wheatFieldButton = { name: "Favorite Wheat Field with Cypresses" };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
  });

  async function favoriteInGallery(...buttons: { name: string }[]) {
    renderApp("/art-pieces");
    for (const button of buttons) {
      await userEvent.click(await screen.findByRole("button", button));
    }
    await userEvent.click(screen.getByRole("link", { name: "Favorites" }));
  }

  it("shows the favorites page after clicking Favorites", async () => {
    renderApp("/");
    await screen.findByRole("img");

    await userEvent.click(screen.getByRole("link", { name: "Favorites" }));

    expect(await screen.findByRole("list")).toBeInTheDocument();
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
  });

  it("shows a loading message on /favorites while loading", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderApp("/favorites");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an error message on /favorites when loading fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    renderApp("/favorites");

    expect(
      await screen.findByText("Failed to load art pieces.")
    ).toBeInTheDocument();
  });

  it("shows all favorite art pieces in a list in the order of the data", async () => {
    await favoriteInGallery(starryNightButton, wheatFieldButton);

    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Wheat Field with Cypresses");
    expect(items[1]).toHaveTextContent("The Starry Night");
  });

  it("shows only the favorite art pieces", async () => {
    await favoriteInGallery(starryNightButton);

    expect(await screen.findAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("The Starry Night")).toBeInTheDocument();
    expect(
      screen.queryByText("Wheat Field with Cypresses")
    ).not.toBeInTheDocument();
  });

  it("shows an empty list when there are no favorites", async () => {
    renderApp("/favorites");

    expect(await screen.findByRole("list")).toBeEmptyDOMElement();
  });

  it("shows image, title and artist of a favorite art piece", async () => {
    await favoriteInGallery(starryNightButton);

    const image = await screen.findByRole("img", { name: "The Starry Night" });
    expect(image).toHaveAttribute("src", artPieces[1].imageSource);
    expect(
      screen.getByRole("heading", { name: "The Starry Night" })
    ).toBeInTheDocument();
    expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
  });

  it("shows an active favorite button on each favorite art piece", async () => {
    await favoriteInGallery(starryNightButton, wheatFieldButton);

    expect(
      await screen.findByRole("button", starryNightButton)
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", wheatFieldButton)).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("removes an art piece from the page when its favorite button is clicked", async () => {
    await favoriteInGallery(starryNightButton, wheatFieldButton);

    await userEvent.click(await screen.findByRole("button", starryNightButton));

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.queryByText("The Starry Night")).not.toBeInTheDocument();
    expect(screen.getByText("Wheat Field with Cypresses")).toBeInTheDocument();
  });
});

describe("App comments", () => {
  const FIRST_DATE = new Date("2025-03-01T09:15:00.000Z");
  const SECOND_DATE = new Date("2025-03-02T14:30:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(FIRST_DATE);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => artPieces })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function addComment(text: string) {
    await userEvent.type(
      await screen.findByRole("textbox", { name: "Comment" }),
      text
    );
    await userEvent.click(screen.getByRole("button", { name: "Add comment" }));
  }

  function commentItems() {
    return within(
      screen.getByRole("region", { name: "Comments" })
    ).queryAllByRole("listitem");
  }

  it("shows a submitted comment with its date in the comments section", async () => {
    renderApp("/art-pieces/the-starry-night");

    await addComment("Swirling sky");

    const items = commentItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Swirling sky");
    expect(items[0]).toHaveTextContent(FIRST_DATE.toLocaleString());
  });

  it("shows the newest comment first", async () => {
    renderApp("/art-pieces/the-starry-night");

    await addComment("First impression");
    vi.setSystemTime(SECOND_DATE);
    await addComment("Second thought");

    const items = commentItems();
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Second thought");
    expect(items[1]).toHaveTextContent("First impression");
  });

  it("does not add an empty comment", async () => {
    renderApp("/art-pieces/the-starry-night");

    await userEvent.click(
      await screen.findByRole("button", { name: "Add comment" })
    );

    expect(commentItems()).toHaveLength(0);
  });

  it("adds a comment only to its own art piece", async () => {
    renderApp("/art-pieces/the-starry-night");
    await addComment("Swirling sky");

    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    await userEvent.click(
      await screen.findByRole("link", { name: /Wheat Field with Cypresses/ })
    );

    expect(
      await screen.findByRole("heading", { name: "Wheat Field with Cypresses" })
    ).toBeInTheDocument();
    expect(commentItems()).toHaveLength(0);
    expect(screen.queryByText("Swirling sky")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    await userEvent.click(
      await screen.findByRole("link", { name: /The Starry Night/ })
    );

    expect(await screen.findByText("Swirling sky")).toBeInTheDocument();
  });

  it("keeps the comments when the favorite is toggled", async () => {
    renderApp("/art-pieces/the-starry-night");
    await addComment("Swirling sky");

    await userEvent.click(
      screen.getByRole("button", { name: "Favorite The Starry Night" })
    );

    expect(commentItems()).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Favorite The Starry Night" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps the favorite when a comment is added", async () => {
    renderApp("/art-pieces/the-starry-night");
    await userEvent.click(
      await screen.findByRole("button", { name: "Favorite The Starry Night" })
    );

    await addComment("Swirling sky");

    expect(
      screen.getByRole("button", { name: "Favorite The Starry Night" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(commentItems()).toHaveLength(1);
  });
});
