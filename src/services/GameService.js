import { fetchAPI } from "../utils/FetchApi";
import BaseClass from "./BaseClass";
import { normalizeGameName } from "../features/games/virtualGameCatalog";

class GameService extends BaseClass {
  async getAllGames() {
    try {
      const res = await fetchAPI("virtuals/games", "GET", null, this.token);
      const games = res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(games?.data) ? games.data : games;

      return (Array.isArray(list) ? list : [])
        .filter((game) => Number(game?.status) === 1)
        .map((game) => ({
          ...game,
          _id: game.game_uuid,
          title: game.game_name,
          image: game.thumbnail,
          linkPath: `/virtual/${game.game_uuid}`,
        }));
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch all games");
    }
  }

  async generateGameSession({ game_uuid: gameUuid, game }) {
    try {
      let resolvedUuid = gameUuid;

      // Keep the existing /aviator entry working while using the new catalog.
      if (!resolvedUuid && game) {
        const requestedGame = normalizeGameName(game);
        const games = await this.getAllGames();
        resolvedUuid = games.find(
          (item) =>
            normalizeGameName(item.game_name) === requestedGame
        )?.game_uuid;
      }

      if (!resolvedUuid) throw new Error("Game is unavailable");

      const res = await fetchAPI(
        "virtuals/launch",
        "POST",
        { game_uuid: resolvedUuid },
        this.token
      );

      const url = res?.data?.url ?? res?.url;
      if (!url) throw new Error(res?.status_description || "Launch URL missing");

      return { ...res, launchUrl: url };
    } catch (error) {
      throw new Error(error?.message || "Unable to launch game session");
    }
  }
}

export default GameService;
