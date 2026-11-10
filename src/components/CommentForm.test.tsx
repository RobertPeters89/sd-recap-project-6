import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommentForm from "./CommentForm";

function renderForm(onAddComment: (text: string) => void = () => {}) {
  render(<CommentForm onAddComment={onAddComment} />);
  return {
    input: screen.getByRole("textbox", { name: "Comment" }),
    button: screen.getByRole("button", { name: "Add comment" }),
  };
}

describe("CommentForm", () => {
  it("shows a text field and a submit button", () => {
    const { input, button } = renderForm();

    expect(input).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("calls onAddComment with the text when submitted", async () => {
    const onAddComment = vi.fn();
    const { input, button } = renderForm(onAddComment);

    await userEvent.type(input, "Wonderful colors");
    await userEvent.click(button);

    expect(onAddComment).toHaveBeenCalledTimes(1);
    expect(onAddComment).toHaveBeenCalledWith("Wonderful colors");
  });

  it("clears the text field after submitting", async () => {
    const { input, button } = renderForm();

    await userEvent.type(input, "Wonderful colors");
    await userEvent.click(button);

    expect(input).toHaveValue("");
  });

  it("submits with the Enter key", async () => {
    const onAddComment = vi.fn();
    const { input } = renderForm(onAddComment);

    await userEvent.type(input, "Nice{Enter}");

    expect(onAddComment).toHaveBeenCalledTimes(1);
    expect(onAddComment).toHaveBeenCalledWith("Nice");
  });

  it("does not submit an empty comment", async () => {
    const onAddComment = vi.fn();
    const { button } = renderForm(onAddComment);

    await userEvent.click(button);

    expect(onAddComment).not.toHaveBeenCalled();
  });

  it("does not submit a comment that only contains whitespace", async () => {
    const onAddComment = vi.fn();
    const { input, button } = renderForm(onAddComment);

    await userEvent.type(input, "   ");
    await userEvent.click(button);

    expect(onAddComment).not.toHaveBeenCalled();
  });

  it("submits the trimmed text", async () => {
    const onAddComment = vi.fn();
    const { input, button } = renderForm(onAddComment);

    await userEvent.type(input, "  padded  ");
    await userEvent.click(button);

    expect(onAddComment).toHaveBeenCalledTimes(1);
    expect(onAddComment).toHaveBeenCalledWith("padded");
  });
});
