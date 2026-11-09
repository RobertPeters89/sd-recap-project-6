import { useState } from "react";

import { getRandomArtPiece } from "../getRandomArtPiece";
import type { ArtPiece } from "../types";

interface SpotlightProps {
  artPieces: ArtPiece[];
}

export default function Spotlight({ artPieces }: SpotlightProps) {
  const [artPiece] = useState(() => getRandomArtPiece(artPieces));

  if (!artPiece) {
    return null;
  }

  return (
    <figure>
      <img src={artPiece.imageSource} alt={artPiece.name} />
      <figcaption>{artPiece.artist}</figcaption>
    </figure>
  );
}
