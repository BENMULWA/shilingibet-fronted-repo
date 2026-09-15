import { fetchAPI } from "../utils/FetchApi";
import BaseClass from "./BaseClass";

class JackpotService extends BaseClass {
  async getActiveDraw() {
    try {
      const res = await fetchAPI("jackpot/active", "GET", null, this.token);
      return res?.data ?? null;
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch active jackpot draw");
    }
  }

  async placeBet({ drawId, picks }) {
    try {
      return await fetchAPI(
        "jackpot/bet",
        "POST",
        { drawId, picks },
        this.token,
      );
    } catch (error) {
      throw new Error(error?.message || "Unable to place jackpot bet");
    }
  }

  async getRecentResults(limit = 10) {
    try {
      const res = await fetchAPI(
        `jackpot/results?limit=${limit}`,
        "GET",
        null,
        this.token,
      );
      return res?.data ?? [];
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch recent jackpot results");
    }
  }

  async getDrawResults(drawId) {
    try {
      const res = await fetchAPI(
        `jackpot/results/${drawId}`,
        "GET",
        null,
        this.token,
      );
      return res?.data ?? null;
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch jackpot draw results");
    }
  }

  async getDrawWinners(drawId) {
    try {
      const res = await fetchAPI(
        `jackpot/winners/${drawId}`,
        "GET",
        null,
        this.token,
      );
      return res?.data ?? [];
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch jackpot winners");
    }
  }

  async getMyBets(page = 1, limit = 20) {
    try {
      const res = await fetchAPI(
        `jackpot/my-bets?page=${page}&limit=${limit}`,
        "GET",
        null,
        this.token,
      );
      return res?.data ?? { bets: [], total: 0, page, totalPages: 0 };
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch jackpot bet history");
    }
  }

  async getMyBetDetail(betId) {
    try {
      const res = await fetchAPI(
        `jackpot/my-bets/bet/${betId}`,
        "GET",
        null,
        this.token,
      );
      return res?.data ?? null;
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch jackpot bet detail");
    }
  }

  async getMyBetsForDraw(drawId) {
    try {
      const res = await fetchAPI(
        `jackpot/my-bets/${drawId}`,
        "GET",
        null,
        this.token,
      );
      return res?.data ?? [];
    } catch (error) {
      throw new Error(error?.message || "Unable to fetch jackpot bets for draw");
    }
  }
}

export default JackpotService;
