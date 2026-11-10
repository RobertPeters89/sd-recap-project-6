import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export default function FavoriteButton({
  isFavorite,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={isFavorite ? "favorite-button favorite" : "favorite-button"}
      aria-label="Favorite"
      aria-pressed={isFavorite}
      onClick={onToggle}
    >
      <Heart fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
