import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Empty } from "antd";
import { FiClock, FiUsers, FiTrendingUp } from "react-icons/fi";
import { BsTrophyFill } from "react-icons/bs";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import GoBack from "../../components/GoBack";
import { useActiveJackpotDraw, usePlaceJackpotBet, useRecentJackpotResults } from "../../hooks/useJackpot";
import { useUpdateBalance } from "../../hooks/usePayment";
import {
  formatDateOnly,
  formatDateTime,
  formatKES,
  formatTimeOnly,
  getJackpotDrawId,
  normalizeDrawPicks,
} from "./jackpotUtils";

const PICK_OPTIONS = [
  { value: "H", label: "Home" },
  { value: "D", label: "Draw" },
  { value: "A", label: "Away" },
];

function Countdown({ target }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!target) return undefined;

    const update = () => {
      const end = new Date(target).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);

      const totalMinutes = Math.floor(diff / 60000);
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      setRemaining(
        diff === 0 ? "Closed" : `${days}d ${hours}h ${minutes}m`,
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{remaining || "—"}</span>;
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-secondary border border-white/5 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#9cae9f]">{label}</p>
        <p className="text-white font-bold text-sm">{value}</p>
      </div>
    </div>
  );
}

function JackpotPage() {
  const navigate = useNavigate();
  const { activeDraw, isLoading: loadingDraw } = useActiveJackpotDraw();
  const { results: recentResults, isLoading: loadingResults } = useRecentJackpotResults(5);
  const { balance } = useUpdateBalance();
  const { placeJackpotBet, isLoading: placingBet } = usePlaceJackpotBet();
  const [picks, setPicks] = useState({});

  const draw = activeDraw;
  const drawMatches = draw?.matches;
  const drawId = getJackpotDrawId(draw);

  useEffect(() => {
    const matches = drawMatches || [];

    if (matches.length) {
      setPicks(
        matches.reduce((acc, match) => {
          acc[match.matchNumber] = acc[match.matchNumber] || "";
          return acc;
        }, {}),
      );
    } else {
      setPicks({});
    }
  }, [drawId, drawMatches]);

  const selectedCount = useMemo(
    () => Object.values(picks).filter(Boolean).length,
    [picks],
  );

  const canSubmit = draw?.status === "open" && selectedCount === 7 && !placingBet;

  const handlePick = (matchNumber, pick) => {
    setPicks((prev) => ({ ...prev, [matchNumber]: pick }));
  };

  const handleSubmit = () => {
    if (!drawId) {
      toast.error("No active draw is available right now");
      return;
    }
    if (draw?.status !== "open") {
      toast.error("This jackpot draw is closed");
      return;
    }

    const matches = drawMatches || [];
    const missing = matches.filter((match) => !picks[match.matchNumber]);
    if (missing.length > 0) {
      toast.error("Please pick all 7 matches before placing your bet");
      return;
    }

    placeJackpotBet(
      {
        drawId,
        picks: normalizeDrawPicks(matches, picks),
      },
      {
        onSuccess: () => {
          setPicks(
            matches.reduce((acc, match) => {
              acc[match.matchNumber] = "";
              return acc;
            }, {}),
          );
          navigate("/jackpot/my-bets");
        },
      },
    );
  };

  const latestResults = recentResults || [];

  return (
    <div className="min-h-screen bg-background pb-10">
      <GoBack />

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#0b1d12] via-[#102518] to-[#08120c] border border-white/5 p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-bold">
                Jackpot
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
                Predict all 7 matches and win the pool.
              </h1>
              <p className="text-sm text-[#9cae9f] mt-2 max-w-2xl">
                Place your ticket on the active draw, track results after settlement, and review your bet history anytime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[520px]">
              <StatCard label="Main balance" value={formatKES(balance?.balance)} icon={<FiTrendingUp />} />
              <StatCard label="Active bet amount" value={formatKES(draw?.betAmount)} icon={<BsTrophyFill />} />
              <StatCard label="Total bets" value={draw?.totalBets ?? 0} icon={<FiUsers />} />
              <StatCard
                label="Closes in"
                value={draw?.closesAt ? <Countdown target={draw.closesAt} /> : "—"}
                icon={<FiClock />}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          <section className="space-y-4">
            {loadingDraw ? (
              <div className="min-h-[320px] flex items-center justify-center bg-secondary rounded-3xl">
                <Loader />
              </div>
            ) : !draw ? (
              <div className="bg-secondary rounded-3xl border border-white/5 p-6 text-center">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <h2 className="text-white font-bold text-lg mt-3">No active jackpot draw right now</h2>
                <p className="text-[#9cae9f] text-sm mt-1">
                  When a new draw opens, it will appear here with the 7 matches and betting window.
                </p>
              </div>
            ) : (
              <div className="bg-secondary rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-5 md:p-6 border-b border-white/5 bg-white/5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#9cae9f] uppercase tracking-widest font-semibold">
                        {draw.drawDay}
                      </p>
                      <h2 className="text-2xl font-black text-white mt-1">
                        {draw.drawNumber}
                      </h2>
                      <p className="text-sm text-[#9cae9f] mt-1">
                        Closes at {formatDateTime(draw.closesAt)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-2xl bg-background/60 p-3">
                        <p className="text-[10px] uppercase text-[#75877a]">Bet</p>
                        <p className="font-bold text-white mt-1">{formatKES(draw.betAmount)}</p>
                      </div>
                      <div className="rounded-2xl bg-background/60 p-3">
                        <p className="text-[10px] uppercase text-[#75877a]">7/7</p>
                        <p className="font-bold text-white mt-1">{formatKES(draw?.prizes?.seven)}</p>
                      </div>
                      <div className="rounded-2xl bg-background/60 p-3">
                        <p className="text-[10px] uppercase text-[#75877a]">6/7</p>
                        <p className="font-bold text-white mt-1">{formatKES(draw?.prizes?.six)}</p>
                      </div>
                      <div className="rounded-2xl bg-background/60 p-3">
                        <p className="text-[10px] uppercase text-[#75877a]">5/7</p>
                        <p className="font-bold text-white mt-1">{formatKES(draw?.prizes?.five)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  {(draw.matches || []).map((match) => (
                    <div key={match._id || match.matchNumber} className="rounded-2xl border border-white/5 bg-background/60 p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-widest text-[#75877a] font-semibold">
                            Match {match.matchNumber}
                          </p>
                          <h3 className="text-white font-bold text-lg">
                            {match.homeTeam} vs {match.awayTeam}
                          </h3>
                          <p className="text-sm text-[#9cae9f]">
                            {match.league} · {formatDateOnly(match.kickOffTime)} · {formatTimeOnly(match.kickOffTime)}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 w-full sm:w-[220px]">
                          {PICK_OPTIONS.map((option) => {
                            const active = picks[match.matchNumber] === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handlePick(match.matchNumber, option.value)}
                                className={`rounded-xl px-3 py-3 text-sm font-bold transition-all border ${
                                  active
                                    ? "bg-primary text-black border-primary"
                                    : "bg-white/5 text-white border-white/10 hover:border-primary/40 hover:bg-primary/10"
                                }`}
                              >
                                {option.value} <span className="block text-[10px] font-medium mt-1 opacity-80">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
                    <p className="text-sm text-[#9cae9f]">
                      Selected {selectedCount}/7 picks
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="w-full md:w-auto rounded-xl px-5 py-3 font-black text-black bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
                    >
                      {placingBet ? "Placing bet..." : "Place Jackpot Bet"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-secondary border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Recent Results</h3>
                <Link to="/jackpot/results" className="text-primary text-sm font-semibold hover:underline">
                  View all
                </Link>
              </div>

              {loadingResults ? (
                <Loader />
              ) : latestResults.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <div className="space-y-3">
                  {latestResults.map((item) => {
                    const resultId = getJackpotDrawId(item);
                    return (
                      <Link
                        key={resultId || item.drawNumber}
                        to={resultId ? `/jackpot/results/${resultId}` : "/jackpot/results"}
                        className="block rounded-2xl bg-background/60 border border-white/5 p-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-white font-bold">{item.drawNumber}</p>
                            <p className="text-xs text-[#9cae9f] mt-1">
                              {item.drawDay} · Settled {formatDateTime(item.settledAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#75877a] uppercase">Top prize</p>
                            <p className="text-primary font-bold">{formatKES(item?.prizes?.seven)}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#9cae9f]">
                          <span className="px-2 py-1 rounded-full bg-white/5">
                            {item.totalBets ?? 0} bets
                          </span>
                          <span className="px-2 py-1 rounded-full bg-white/5">
                            {item.status || "settled"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#12261a] to-[#08120c] border border-white/5 p-5">
              <h3 className="text-white font-bold text-lg">How it works</h3>
              <ul className="mt-3 space-y-2 text-sm text-[#9cae9f]">
                <li>• Pick one outcome per match for all 7 fixtures.</li>
                <li>• The draw closes automatically at the stated time.</li>
                <li>• Only the highest winning tier gets paid in a draw.</li>
                <li>• Check settled draws and your own bet history anytime.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default JackpotPage;
