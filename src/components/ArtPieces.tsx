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
          <ArtPiecePreview artPiece={artPiece} />
        </li>
      ))}
    </ul>
  );
}
