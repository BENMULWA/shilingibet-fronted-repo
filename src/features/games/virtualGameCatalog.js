export const EUROVIRTUALS_PROVIDER_NAME = "EuroVirtuals";

export const KNOWN_EUROVIRTUAL_GAMES = [
  {
    game_uuid: "gfhjdghvfdvsaddd",
    game_name: "Euro League",
    title: "Euro League",
    thumbnail:
      "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_vl_legacy_ui.png",
  },
  {
    game_uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    game_name: "Instant Football (EPL)",
    title: "Instant Football (EPL)",
    thumbnail:
      "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_instant_league.jpg",
  },
  {
    game_uuid: "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    game_name: "Swift League",
    title: "Swift League",
    thumbnail:
      "https://storage.googleapis.com/eurovirtuals/assets/ev_thumnail_swift_league.png",
  },
  {
    game_uuid: "ea8dfcc7-2f3d-4a0c-929c-37f90cb75d41",
    game_name: "Virtual Jackpot",
    title: "Virtual Jackpot",
    thumbnail:
      "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_virtual_jackpot.png",
  },
  {
    game_uuid: "6a1f06c2-91a2-41cb-bb39-0c9673c1e7e2",
    game_name: "Virtual League - Next Gen UI",
    title: "Virtual League - Next Gen UI",
    thumbnail:
      "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_vl_next_gen_ui.png",
  },
  {
    game_uuid: "2d15e5a3-c9ee-4b83-91c2-bfaed9f4f17f",
    game_name: "Aviator",
    title: "Aviator",
    thumbnail:
      "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_aviator.png",
  },
];

export function normalizeGameName(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function gameSlug(name = "") {
  return normalizeGameName(name).replace(/\s+/g, "-");
}

export function gameTitleFromSlug(slug = "") {
  const normalizedSlug = gameSlug(slug);
  return (
    KNOWN_EUROVIRTUAL_GAMES.find(
      (game) => gameSlug(game.game_name) === normalizedSlug
    )?.game_name ||
    String(slug)
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function buildEuroVirtualGames(providerGames = []) {
  const gamesByName = new Map(
    providerGames.map((game) => [normalizeGameName(game.game_name || game.title), game])
  );

  const knownGames = KNOWN_EUROVIRTUAL_GAMES.map((fallback) => {
    const providerGame = gamesByName.get(normalizeGameName(fallback.game_name));
    const mergedGame = {
      ...fallback,
      ...providerGame,
      provider: EUROVIRTUALS_PROVIDER_NAME,
    };

    return {
      ...mergedGame,
      _id: mergedGame.game_uuid || gameSlug(mergedGame.game_name),
      title: mergedGame.title || mergedGame.game_name,
      image: mergedGame.image || mergedGame.thumbnail,
      linkPath: mergedGame.game_uuid
        ? `/virtual/${mergedGame.game_uuid}`
        : `/virtual/name/${gameSlug(mergedGame.game_name)}`,
    };
  });

  const knownNames = new Set(
    knownGames.map((game) => normalizeGameName(game.game_name || game.title))
  );
  const extraProviderGames = providerGames
    .filter((game) => !knownNames.has(normalizeGameName(game.game_name || game.title)))
    .map((game) => ({
      ...game,
      provider: game.provider || EUROVIRTUALS_PROVIDER_NAME,
      linkPath: game.game_uuid
        ? `/virtual/${game.game_uuid}`
        : `/virtual/name/${gameSlug(game.game_name || game.title)}`,
    }));

  return [...knownGames, ...extraProviderGames];
}
