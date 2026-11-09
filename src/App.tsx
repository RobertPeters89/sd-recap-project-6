import { Route, Routes } from "react-router";
import useSWR from "swr";

import ArtPieces from "./components/ArtPieces";
import { fetcher } from "./fetcher";
import "./styles.css";
import type { ArtPiece } from "./types";

const ART_PIECES_URL = "https://example-apis.vercel.app/api/art";

export default function App() {
  const { data: artPieces, error } = useSWR<ArtPiece[]>(
    ART_PIECES_URL,
    fetcher
  );

  let gallery = <p>Loading...</p>;
  if (error) {
    gallery = <p>Failed to load art pieces.</p>;
  } else if (artPieces) {
    gallery = <ArtPieces artPieces={artPieces} />;
  }

  return (
    <main>
      <h1>Art Gallery</h1>
      <Routes>
        <Route path="/art-pieces" element={gallery} />
      </Routes>
    </main>
  );
}
