import { type ReactNode, useState } from "react";
import { Route, Routes } from "react-router";
import useSWR from "swr";

import ArtPieceDetails from "./components/ArtPieceDetails";
import ArtPieces from "./components/ArtPieces";
import Navigation from "./components/Navigation";
import Spotlight from "./components/Spotlight";
import { fetcher } from "./fetcher";
import "./styles.css";
import type { ArtPiece, ArtPieceComment, ArtPieceInfo } from "./types";

const ART_PIECES_URL = "https://example-apis.vercel.app/api/art";

export default function App() {
  const { data: artPieces, error } = useSWR<ArtPiece[]>(
    ART_PIECES_URL,
    fetcher
  );

  const [artPiecesInfo, setArtPiecesInfo] = useState<ArtPieceInfo[]>([]);

  function isFavorite(slug: string) {
    return artPiecesInfo.some((info) => info.slug === slug && info.isFavorite);
  }

  function toggleFavorite(slug: string) {
    setArtPiecesInfo((infos) =>
      infos.some((info) => info.slug === slug)
        ? infos.map((info) =>
            info.slug === slug
              ? { ...info, isFavorite: !info.isFavorite }
              : info
          )
        : [...infos, { slug, isFavorite: true, comments: [] }]
    );
  }

  function getComments(slug: string): ArtPieceComment[] {
    return artPiecesInfo.find((info) => info.slug === slug)?.comments ?? [];
  }

  function addComment(slug: string, text: string) {
    const comment = { text, date: new Date().toISOString() };
    setArtPiecesInfo((infos) =>
      infos.some((info) => info.slug === slug)
        ? infos.map((info) =>
            info.slug === slug
              ? { ...info, comments: [comment, ...info.comments] }
              : info
          )
        : [...infos, { slug, isFavorite: false, comments: [comment] }]
    );
  }

  function withArtPieces(render: (artPieces: ArtPiece[]) => ReactNode) {
    if (error) {
      return <p>Failed to load art pieces.</p>;
    }
    if (!artPieces) {
      return <p>Loading...</p>;
    }
    return render(artPieces);
  }

  return (
    <>
      <main>
        <h1>Art Gallery</h1>
        <Routes>
          <Route
            path="/"
            element={withArtPieces((pieces) => (
              <Spotlight
                artPieces={pieces}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          />
          <Route
            path="/art-pieces"
            element={withArtPieces((pieces) => (
              <ArtPieces
                artPieces={pieces}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          />
          <Route
            path="/art-pieces/:slug"
            element={withArtPieces((pieces) => (
              <ArtPieceDetails
                artPieces={pieces}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                getComments={getComments}
                onAddComment={addComment}
              />
            ))}
          />
          <Route
            path="/favorites"
            element={withArtPieces((pieces) => (
              <ArtPieces
                artPieces={pieces.filter((piece) => isFavorite(piece.slug))}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Navigation />
    </>
  );
}
