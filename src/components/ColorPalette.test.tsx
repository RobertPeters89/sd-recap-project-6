import { render, screen, within } from "@testing-library/react";

import ColorPalette from "./ColorPalette";

const colors = ["#37412E", "#8D7332", "#718F98"];

describe("ColorPalette", () => {
  it("shows a list named Color palette with one item per color", () => {
    render(<ColorPalette colors={colors} />);

    const list = screen.getByRole("list", { name: "Color palette" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows the colors in the given order", () => {
    render(<ColorPalette colors={colors} />);

    const items = screen.getAllByRole("listitem");
    colors.forEach((color, index) => {
      expect(items[index]).toHaveAccessibleName(color);
    });
  });

  it("shows each color as the background of its item", () => {
    render(<ColorPalette colors={colors} />);

    const items = screen.getAllByRole("listitem");
    colors.forEach((color, index) => {
      expect(items[index]).toHaveStyle({ backgroundColor: color });
    });
  });

  it("shows a color that appears twice twice", () => {
    render(<ColorPalette colors={["#37412E", "#37412E"]} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("shows an empty list for no colors", () => {
    render(<ColorPalette colors={[]} />);

    expect(
      screen.getByRole("list", { name: "Color palette" })
    ).toBeEmptyDOMElement();
  });
});
