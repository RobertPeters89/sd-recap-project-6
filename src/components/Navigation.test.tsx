import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Navigation from "./Navigation";

function renderNavigation(route: string) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Navigation />
    </MemoryRouter>
  );
}

describe("Navigation", () => {
  it("shows a link labeled Spotlight to /", () => {
    renderNavigation("/");

    expect(screen.getByRole("link", { name: "Spotlight" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("shows a link labeled Gallery to /art-pieces", () => {
    renderNavigation("/");

    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute(
      "href",
      "/art-pieces"
    );
  });

  it("highlights the Spotlight link on /", () => {
    renderNavigation("/");

    expect(screen.getByRole("link", { name: "Spotlight" })).toHaveClass(
      "active"
    );
    expect(screen.getByRole("link", { name: "Gallery" })).not.toHaveClass(
      "active"
    );
  });

  it("highlights the Gallery link on /art-pieces", () => {
    renderNavigation("/art-pieces");

    expect(screen.getByRole("link", { name: "Gallery" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Spotlight" })).not.toHaveClass(
      "active"
    );
  });
});
