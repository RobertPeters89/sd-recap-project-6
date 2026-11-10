import type { ArtPieceComment, ArtPieceInfo } from "./types";

export const STORAGE_KEY = "art-pieces-info";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isComment(value: unknown): value is ArtPieceComment {
  return (
    isRecord(value) &&
    typeof value.text === "string" &&
    typeof value.date === "string"
  );
}

function isArtPieceInfo(value: unknown): value is ArtPieceInfo {
  return (
    isRecord(value) &&
    typeof value.slug === "string" &&
    typeof value.isFavorite === "boolean" &&
    Array.isArray(value.comments) &&
    value.comments.every(isComment)
  );
}

export function loadArtPiecesInfo(): ArtPieceInfo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isArtPieceInfo) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveArtPiecesInfo(infos: ArtPieceInfo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(infos));
  } catch {
    // Storage is full or blocked: the app keeps working without saving.
  }
}
