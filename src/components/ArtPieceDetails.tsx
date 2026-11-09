import { useNavigate, useParams } from "react-router";

import type { ArtPiece } from "../types";

interface ArtPieceDetailsProps {
  artPieces: ArtPiece[];
}

export default function ArtPieceDetails({ artPieces }: ArtPieceDetailsProps) {
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
      <h2>{artPiece.name}</h2>
      <p>{artPiece.artist}</p>
      <p>{artPiece.year}</p>
      <p>{artPiece.genre}</p>
    </article>
  );
}
