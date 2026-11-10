import { useState } from "react";

import { getRandomArtPiece } from "../getRandomArtPiece";
import type { ArtPiece } from "../types";
import FavoriteButton from "./FavoriteButton";

interface SpotlightProps {
  artPieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
}

export default function Spotlight({
  artPieces,
  isFavorite,
  onToggleFavorite,
}: SpotlightProps) {
  const [artPiece] = useState(() => getRandomArtPiece(artPieces));

  if (!artPiece) {
    return null;
  }

  return (
    <figure className="art-piece spotlight">
      <img src={artPiece.imageSource} alt={artPiece.name} />
      <FavoriteButton
        isFavorite={isFavorite(artPiece.slug)}
        onToggle={() => onToggleFavorite(artPiece.slug)}
      />
      <figcaption>{artPiece.artist}</figcaption>
    </figure>
  );
}
