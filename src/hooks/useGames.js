import { useMutation, useQuery } from "@tanstack/react-query";
import GameService from "../services/GameService";

const gameService = new GameService();

// Game lists rarely change — cache aggressively
const GAME_LIST_CACHE_CONFIG = {
  staleTime: 10 * 60 * 1000, // 10 minutes fresh
  gcTime: 60 * 60 * 1000,    // 1 hour in cache
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

export function useGames() {
  const { data: games, isLoading, error } = useQuery({
    queryKey: ["games"],
    queryFn: gameService.getAllGames.bind(gameService),
    ...GAME_LIST_CACHE_CONFIG,
  });
  return { games, isLoading, error };
}

export function useGameSession() {
  const {
    mutate: launchGame,
    mutateAsync: launchGameAsync,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: gameService.generateGameSession.bind(gameService),
  });
  return { launchGame, launchGameAsync, isLoading, error };
}
