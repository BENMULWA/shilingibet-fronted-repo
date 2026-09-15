import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import JackpotService from "../services/JackpotService";

const jackpotService = new JackpotService();

export function useActiveJackpotDraw() {
  const { data: activeDraw, isLoading, error } = useQuery({
    queryKey: ["jackpot-active-draw"],
    queryFn: jackpotService.getActiveDraw.bind(jackpotService),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { activeDraw, isLoading, error };
}

export function useRecentJackpotResults(limit = 10) {
  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ["jackpot-recent-results", limit],
    queryFn: () => jackpotService.getRecentResults(limit),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { results, isLoading, error };
}

export function useJackpotDrawResults(drawId) {
  const { data: draw, isLoading, error } = useQuery({
    queryKey: ["jackpot-draw-results", drawId],
    queryFn: () => jackpotService.getDrawResults(drawId),
    enabled: !!drawId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { draw, isLoading, error };
}

export function useJackpotWinners(drawId) {
  const { data: winners = [], isLoading, error } = useQuery({
    queryKey: ["jackpot-winners", drawId],
    queryFn: () => jackpotService.getDrawWinners(drawId),
    enabled: !!drawId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { winners, isLoading, error };
}

export function useMyJackpotBets(page = 1, limit = 20) {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ["jackpot-my-bets", page, limit],
    queryFn: () => jackpotService.getMyBets(page, limit),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { history, isLoading, error };
}

export function useMyJackpotBetDetail(betId) {
  const { data: bet, isLoading, error } = useQuery({
    queryKey: ["jackpot-my-bet-detail", betId],
    queryFn: () => jackpotService.getMyBetDetail(betId),
    enabled: !!betId,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { bet, isLoading, error };
}

export function useMyJackpotBetsForDraw(drawId) {
  const { data: bets = [], isLoading, error } = useQuery({
    queryKey: ["jackpot-my-bets-for-draw", drawId],
    queryFn: () => jackpotService.getMyBetsForDraw(drawId),
    enabled: !!drawId,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { bets, isLoading, error };
}

export function usePlaceJackpotBet() {
  const queryClient = useQueryClient();

  const { mutate: placeJackpotBet, isPending: isLoading, error } = useMutation({
    mutationFn: jackpotService.placeBet.bind(jackpotService),
    onSuccess: () => {
      toast.success("Jackpot bet placed successfully");
      queryClient.invalidateQueries({ queryKey: ["jackpot-active-draw"] });
      queryClient.invalidateQueries({ queryKey: ["jackpot-my-bets"] });
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
    },
    onError: (err) => {
      toast.error(err?.message || "Unable to place jackpot bet");
    },
  });

  return { placeJackpotBet, isLoading, error };
}
