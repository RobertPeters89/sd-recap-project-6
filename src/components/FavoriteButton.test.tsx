import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoriteButton from "./FavoriteButton";

function renderButton(isFavorite: boolean, onToggle: () => void = () => {}) {
  render(
    <FavoriteButton
      artPieceName="Mona Lisa"
      isFavorite={isFavorite}
      onToggle={onToggle}
    />
  );
  return screen.getByRole("button", { name: "Favorite Mona Lisa" });
}

describe("FavoriteButton", () => {
  it("names the button after the art piece", () => {
    expect(renderButton(false)).toBeInTheDocument();
  });

  it("shows an unpressed button with an outlined heart for a non-favorite", () => {
    const button = renderButton(false);

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.querySelector("svg")).toHaveAttribute("fill", "none");
  });

  it("shows a pressed button with a filled heart for a favorite", () => {
    const button = renderButton(true);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.querySelector("svg")).toHaveAttribute("fill", "currentColor");
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();

    await userEvent.click(renderButton(false, onToggle));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
