import { type FormEvent, useState } from "react";

interface CommentFormProps {
  onAddComment: (text: string) => void;
}

export default function CommentForm({
  onAddComment,
}: Readonly<CommentFormProps>) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onAddComment(trimmed);
    setText("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label htmlFor="comment-text">Comment</label>
      <input
        id="comment-text"
        type="text"
        value={text}
        required
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">Add comment</button>
    </form>
  );
}
