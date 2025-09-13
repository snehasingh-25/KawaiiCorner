import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchAnime } from "../api/fetchAnime"; // new API
import AnimeCard from "../components/AnimeCard";
import Navbar from "../components/Nav-bar";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchAnime(query, 20).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <main className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <div className="px-10 py-12">
        <h1 className="text-3xl font-bold mb-5 text-white">
          Search Results for "{query}"
        </h1>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : results.length > 0 ? (
          <div className="flex flex-wrap gap-10 justify-evenly">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <p className="text-white">No results found.</p>
        )}
      </div>
    </main>
  );
}
