import { Link } from "react-router";

import type { ArtPiece } from "../types";
import ArtPiecePreview from "./ArtPiecePreview";

interface ArtPiecesProps {
  artPieces: ArtPiece[];
}

export default function ArtPieces({ artPieces }: ArtPiecesProps) {
  return (
    <ul>
      {artPieces.map((artPiece) => (
        <li key={artPiece.slug}>
          <Link to={`/art-pieces/${artPiece.slug}`}>
            <ArtPiecePreview artPiece={artPiece} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
