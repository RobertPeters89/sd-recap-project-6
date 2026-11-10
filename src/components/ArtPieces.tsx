import type { CSSProperties } from "react";
import { Link } from "react-router";

import type { ArtPiece } from "../types";
import ArtPiecePreview from "./ArtPiecePreview";
import FavoriteButton from "./FavoriteButton";

interface ArtPiecesProps {
  artPieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
}

export default function ArtPieces({
  artPieces,
  isFavorite,
  onToggleFavorite,
}: ArtPiecesProps) {
  return (
    <ul className="art-list">
      {artPieces.map((artPiece, index) => (
        <li
          key={artPiece.slug}
          className="art-piece"
          style={{ "--i": index } as CSSProperties}
        >
          <Link to={`/art-pieces/${artPiece.slug}`}>
            <ArtPiecePreview artPiece={artPiece} />
          </Link>
          <FavoriteButton
            artPieceName={artPiece.name}
            isFavorite={isFavorite(artPiece.slug)}
            onToggle={() => onToggleFavorite(artPiece.slug)}
          />
        </li>
      ))}
    </ul>
  );
}
