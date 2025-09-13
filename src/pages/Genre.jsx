import React, { useEffect, useState } from "react";

import AnimeCard from "../components/AnimeCard";
import { fetchTopAnime, fetchAnimeByGenre } from "../api/fetchAnime";
import Navbar from "../components/Nav-bar";

const Genre = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [actionAnime, setActionAnime] = useState([]);
  const [romanceAnime, setRomanceAnime] = useState([]);
  const [fantasyAnime, setFantasyAnime] = useState([]);

  useEffect(() => {
    async function loadData() {
      setTopAnime(await fetchTopAnime());
      setActionAnime(await fetchAnimeByGenre("action"));
      setRomanceAnime(await fetchAnimeByGenre("romance"));
      setFantasyAnime(await fetchAnimeByGenre("fantasy"));
    }
    loadData();
  }, []);

  return (
    <main className="bg-cover bg-no-repeat text-text-primary min-h-screen w-screen overflow-hidden">
     <Navbar/>
      <div className="px-10 py-12 space-y-20 pt-[100px]">
        {/* TOP ANIME */}
        <section>
          <h1 className="text-3xl font-bold mb-5 text-white">Top Anime</h1>
          <div className="flex flex-wrap gap-20 justify-evenly">
            {topAnime.map((anime, i) => <AnimeCard key={i} anime={anime} />)}
          </div>
        </section>

        {/* GENRE SECTIONS */}
        <section>
          <h1 className="text-3xl font-bold mb-5 text-white">Action</h1>
          <div className="flex flex-wrap gap-20 justify-evenly">
            {actionAnime.map((anime, i) => <AnimeCard key={i} anime={anime} />)}
          </div>
        </section>

        <section>
          <h1 className="text-3xl font-bold mb-5 text-white">Romance</h1>
          <div className="flex flex-wrap gap-20 justify-evenly">
            {romanceAnime.map((anime, i) => <AnimeCard key={i} anime={anime} />)}
          </div>
        </section>

        <section>
          <h1 className="text-3xl font-bold mb-5 text-white">Fantasy</h1>
          <div className="flex flex-wrap gap-20 justify-evenly">
            {fantasyAnime.map((anime, i) => <AnimeCard key={i} anime={anime} />)}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Genre;
