export interface ArtPiece {
  slug: string;
  artist: string;
  name: string;
  imageSource: string;
  year: string;
  genre: string;
}

export interface ArtPieceComment {
  text: string;
  date: string;
}

export interface ArtPieceInfo {
  slug: string;
  isFavorite: boolean;
  comments: ArtPieceComment[];
}
