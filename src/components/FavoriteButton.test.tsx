import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoriteButton from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("shows a button that is not pressed for a non-favorite", () => {
    render(<FavoriteButton isFavorite={false} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("shows a pressed and highlighted button for a favorite", () => {
    render(<FavoriteButton isFavorite onToggle={() => {}} />);

    const button = screen.getByRole("button", { name: "Favorite" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("favorite");
  });

  it("does not highlight a non-favorite", () => {
    render(<FavoriteButton isFavorite={false} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: "Favorite" })).not.toHaveClass(
      "favorite"
    );
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
