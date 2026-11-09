import type { ReactNode } from "react";
import { Route, Routes } from "react-router";
import useSWR from "swr";

import ArtPieces from "./components/ArtPieces";
import Spotlight from "./components/Spotlight";
import { fetcher } from "./fetcher";
import "./styles.css";
import type { ArtPiece } from "./types";

const ART_PIECES_URL = "https://example-apis.vercel.app/api/art";

export default function App() {
  const { data: artPieces, error } = useSWR<ArtPiece[]>(
    ART_PIECES_URL,
    fetcher
  );

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
    <main>
      <h1>Art Gallery</h1>
      <Routes>
        <Route
          path="/"
          element={withArtPieces((pieces) => (
            <Spotlight artPieces={pieces} />
          ))}
        />
        <Route
          path="/art-pieces"
          element={withArtPieces((pieces) => (
            <ArtPieces artPieces={pieces} />
          ))}
        />
      </Routes>
    </main>
  );
}
