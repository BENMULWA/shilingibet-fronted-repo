import { useMemo } from "react";
import { useParams } from "react-router-dom";

import GameLauncher from "./GameLauncher";
import { gameTitleFromSlug } from "./virtualGameCatalog";
import { useGames } from "../../hooks/useGames";

export default function VirtualGamePage() {
  const { gameUuid, gameName } = useParams();
  const { games = [] } = useGames();

  const title = useMemo(() => {
    const providerGame = games.find((game) => game.game_uuid === gameUuid);
    if (providerGame?.game_name) return providerGame.game_name;
    return gameName ? gameTitleFromSlug(gameName) : "Virtual Game";
  }, [gameName, gameUuid, games]);

  return (
    <GameLauncher
      game={gameName ? title : undefined}
      gameUuid={gameUuid}
      title={title}
    />
  );
}
