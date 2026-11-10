import { useNavigate, useParams } from "react-router";

import type { ArtPiece } from "../types";
import FavoriteButton from "./FavoriteButton";

interface ArtPieceDetailsProps {
  artPieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
}

export default function ArtPieceDetails({
  artPieces,
  isFavorite,
  onToggleFavorite,
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
      <img src={artPiece.imageSource} alt={artPiece.name} />
      <FavoriteButton
        isFavorite={isFavorite(artPiece.slug)}
        onToggle={() => onToggleFavorite(artPiece.slug)}
      />
      <h2>{artPiece.name}</h2>
      <p>{artPiece.artist}</p>
      <p>{artPiece.year}</p>
      <p>{artPiece.genre}</p>
    </article>
  );
}
