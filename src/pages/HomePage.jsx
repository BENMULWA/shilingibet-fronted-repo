import { FaFire } from "react-icons/fa6";

import Banner from "../components/Banner";
import CategoryHeader from "../components/CategoryHeader";
import Footer from "../components/Footer";
import GameCategoryTabs from "../components/GameCategoryTabs";
import SpribeBetsCard from "../components/SpribeBetsCard";
import { buildEuroVirtualGames } from "../features/games/virtualGameCatalog";
import { useGames } from "../hooks/useGames";

export default function HomePage() {
  const { games = [] } = useGames();
  const euroVirtualGames = buildEuroVirtualGames(games);

  return (
    <div>
      <div className="pt-2 md:px-4">
        <Banner />
      </div>

      <GameCategoryTabs games={euroVirtualGames} />

      <section className="pt-4 md:px-2">
        <CategoryHeader title="EuroVirtuals" icon={FaFire} showNav={false} />

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-3">
          {euroVirtualGames.map((game) => (
            <SpribeBetsCard
              key={game.game_uuid || game._id}
              title={game.game_name || game.title}
              src={game.thumbnail || game.image || "/virtuals.png"}
              gameID={game.game_uuid || game._id}
              linkToPath={game.linkPath}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
