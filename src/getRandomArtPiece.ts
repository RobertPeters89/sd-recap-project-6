import type { ArtPiece } from "./types";

const RANDOM_VALUE_RANGE = 2 ** 32;

export function getRandomArtPiece(artPieces: ArtPiece[]): ArtPiece | undefined {
  const [randomValue] = crypto.getRandomValues(new Uint32Array(1));
  return artPieces[
    Math.floor((randomValue / RANDOM_VALUE_RANGE) * artPieces.length)
  ];
}
