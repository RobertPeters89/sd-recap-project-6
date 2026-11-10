import { render, screen, within } from "@testing-library/react";

import type { ArtPieceComment } from "../types";
import Comments from "./Comments";

const comments: ArtPieceComment[] = [
  { text: "Second thought", date: "2025-03-02T14:30:00.000Z" },
  { text: "First impression", date: "2025-03-01T09:15:00.000Z" },
];

describe("Comments", () => {
  it("shows a section labeled Comments with a list", () => {
    render(<Comments comments={comments} />);

    const section = screen.getByRole("region", { name: "Comments" });
    expect(within(section).getByRole("list")).toBeInTheDocument();
    expect(within(section).getAllByRole("listitem")).toHaveLength(2);
  });

  it("shows the text of each comment", () => {
    render(<Comments comments={comments} />);

    expect(screen.getByText("Second thought")).toBeInTheDocument();
    expect(screen.getByText("First impression")).toBeInTheDocument();
  });

  it("shows the comments in the given order", () => {
    render(<Comments comments={comments} />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Second thought");
    expect(items[1]).toHaveTextContent("First impression");
  });

  it("shows the date and time of each comment", () => {
    render(<Comments comments={comments} />);

    const items = screen.getAllByRole("listitem");
    comments.forEach((comment, index) => {
      const time = within(items[index]).getByText(
        new Date(comment.date).toLocaleString()
      );
      expect(time.tagName).toBe("TIME");
      expect(time).toHaveAttribute("datetime", comment.date);
    });
  });

  it("shows the section with an empty list when there are no comments", () => {
    render(<Comments comments={[]} />);

    expect(
      screen.getByRole("region", { name: "Comments" })
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
