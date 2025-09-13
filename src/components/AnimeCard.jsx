import React from "react";

const AnimeCard = ({ anime }) => {
  return (
    <div
      className="w-90 rounded-xl overflow-hidden border border-[color:var(--color-surface)]/30
                 backdrop-blur-md bg-[color:var(--color-surface)]/10 shadow-lg
                 transform transition-transform duration-300
                 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    >
      {/* Anime Poster */}
      <div className="relative">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-70 object-cover rounded-t-xl"
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
          {anime.year}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h2
          className="text-lg font-bold text-[color:var(--color-accent)]
                     drop-shadow-sm font-[var(--font-pixel)]"
        >
          {anime.title}
        </h2>

        <p className="text-xs mt-1 text-[color:var(--color-text-secondary)] uppercase">
          Genre: {anime.genres.join(", ")}
        </p>

        <p className="text-sm mt-2 text-white line-clamp-3">
          {anime.synopsis}
        </p>
      </div>
    </div>
  );
};

export default AnimeCard;
