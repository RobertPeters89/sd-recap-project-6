import { useNavigate, useParams } from "react-router";

import type { ArtPiece, ArtPieceComment } from "../types";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";

interface ArtPieceDetailsProps {
  artPieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
  getComments: (slug: string) => ArtPieceComment[];
  onAddComment: (slug: string, text: string) => void;
}

export default function ArtPieceDetails({
  artPieces,
  isFavorite,
  onToggleFavorite,
  getComments,
  onAddComment,
}: ArtPieceDetailsProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const artPiece = artPieces.find((piece) => piece.slug === slug);

  if (!artPiece) {
    return <p>Art piece not found</p>;
  }

  return (
    <article className="details">
      <button type="button" onClick={() => navigate("/art-pieces")}>
        Back
      </button>
      <div className="details-image">
        <img src={artPiece.imageSource} alt={artPiece.name} />
        <FavoriteButton
          artPieceName={artPiece.name}
          isFavorite={isFavorite(artPiece.slug)}
          onToggle={() => onToggleFavorite(artPiece.slug)}
        />
      </div>
      <h2>{artPiece.name}</h2>
      <p>{artPiece.artist}</p>
      <p>{artPiece.year}</p>
      <p>{artPiece.genre}</p>
      <Comments comments={getComments(artPiece.slug)} />
      <CommentForm onAddComment={(text) => onAddComment(artPiece.slug, text)} />
    </article>
  );
}
