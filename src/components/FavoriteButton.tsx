import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  artPieceName: string;
  isFavorite: boolean;
  onToggle: () => void;
}

export default function FavoriteButton({
  artPieceName,
  isFavorite,
  onToggle,
}: Readonly<FavoriteButtonProps>) {
  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={`Favorite ${artPieceName}`}
      aria-pressed={isFavorite}
      onClick={onToggle}
    >
      <Heart fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
