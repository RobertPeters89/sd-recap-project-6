import type { ArtPieceComment } from "../types";

interface CommentsProps {
  comments: ArtPieceComment[];
}

export default function Comments({ comments }: Readonly<CommentsProps>) {
  return (
    <section aria-labelledby="comments-heading">
      <h3 id="comments-heading">Comments</h3>
      <ul className="comments">
        {comments.map((comment, index) => (
          <li key={`${comment.date}-${index}`}>
            <p>{comment.text}</p>
            <time dateTime={comment.date}>
              {new Date(comment.date).toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
