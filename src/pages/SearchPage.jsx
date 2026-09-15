import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import SpribeBetsCard from "../components/SpribeBetsCard";
import { buildEuroVirtualGames } from "../features/games/virtualGameCatalog";
import { useGames } from "../hooks/useGames";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { games = [] } = useGames();

  const visibleGames = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return buildEuroVirtualGames(games).filter((game) =>
      (game.game_name || game.title || "").toLowerCase().includes(searchTerm)
    );
  }, [games, query]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex flex-col gap-4 bg-background py-4">
        <h1 className="px-2 text-2xl font-black text-white">Search Games</h1>
        <div className="relative w-full max-w-4xl px-2">
          <MagnifyingGlassIcon className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          <input
            type="search"
            className="w-full rounded-2xl border-2 border-white/5 bg-surface py-4 pl-12 pr-4 text-white outline-none placeholder:text-gray-500 focus:border-primary"
            placeholder="Search EuroVirtuals games"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2 py-4 sm:grid-cols-3 md:grid-cols-6">
        {visibleGames.map((game) => (
          <SpribeBetsCard
            key={game.game_uuid || game._id}
            title={game.game_name || game.title}
            src={game.thumbnail || game.image || "/virtuals.png"}
            gameID={game.game_uuid || game._id}
            linkToPath={game.linkPath}
          />
        ))}
      </div>
    </div>
  );
}
