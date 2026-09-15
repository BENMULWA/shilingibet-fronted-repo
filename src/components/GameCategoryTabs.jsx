import { Link } from "react-router-dom";
import { FaBolt, FaFutbol, FaGamepad, FaPlane, FaTrophy } from "react-icons/fa6";

import BaseClass from "../services/BaseClass";

function GameIcon({ title = "" }) {
  const name = title.toLowerCase();

  if (name.includes("aviator")) return <FaPlane />;
  if (name.includes("jackpot")) return <FaTrophy />;
  if (name.includes("instant")) return <FaBolt />;
  if (name.includes("league") || name.includes("football")) return <FaFutbol />;
  return <FaGamepad />;
}

export default function GameCategoryTabs({ games = [] }) {
  const base = new BaseClass();

  return (
    <nav
      className="no-scrollbar mt-4 flex overflow-x-auto border border-yellow-500/50 bg-primary md:mx-4"
      aria-label="Quick game navigation"
    >
      {games.map((game) => {
        const title = game.game_name || game.title;
        const destination = base.userId ? game.linkPath : "/login";

        return (
          <Link
            key={game.game_uuid || game._id}
            to={destination}
            className="flex min-w-[112px] flex-1 flex-col items-center justify-center gap-1 border-r border-black/10 px-2 py-2 text-black transition-colors last:border-r-0 hover:bg-yellow-300 md:min-w-[130px]"
          >
            <span className="flex h-7 items-center justify-center text-xl text-black md:text-2xl">
              <GameIcon title={title} />
            </span>
            <span className="max-w-[105px] truncate text-[9px] font-black uppercase tracking-wide md:text-[10px]">
              {title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
