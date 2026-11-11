import type { ArtPiece } from "../types";

interface ArtPiecePreviewProps {
  artPiece: ArtPiece;
}

export default function ArtPiecePreview({
  artPiece,
}: Readonly<ArtPiecePreviewProps>) {
  return (
    <figure>
      <img src={artPiece.imageSource} alt={artPiece.name} />
      <figcaption>
        <h2>{artPiece.name}</h2>
        <p>{artPiece.artist}</p>
      </figcaption>
    </figure>
  );
}
