import { useParams } from "react-router-dom";
import { Empty } from "antd";
import GoBack from "../../components/GoBack";
import Loader from "../../components/Loader";
import { useJackpotDrawResults, useJackpotWinners } from "../../hooks/useJackpot";
import {
  formatDateOnly,
  formatDateTime,
  formatKES,
  formatTimeOnly,
} from "./jackpotUtils";

function JackpotDrawDetailPage() {
  const { drawId } = useParams();
  const { draw, isLoading: loadingDraw } = useJackpotDrawResults(drawId);
  const { winners, isLoading: loadingWinners } = useJackpotWinners(drawId);

  if (loadingDraw) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!draw) {
    return (
      <div className="min-h-screen bg-background">
        <GoBack />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Draw not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <GoBack />

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
        <div className="rounded-3xl bg-secondary border border-white/5 p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80 font-bold">
            Jackpot draw
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
            {draw.drawNumber}
          </h1>
          <p className="text-sm text-[#9cae9f] mt-2">
            {draw.drawDay} · {draw.status} · Settled {formatDateTime(draw.settledAt)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <DetailStat label="Bets" value={draw.totalBets ?? 0} />
            <DetailStat label="7/7" value={formatKES(draw?.prizes?.seven)} />
            <DetailStat label="6/7" value={formatKES(draw?.prizes?.six)} />
            <DetailStat label="5/7" value={formatKES(draw?.prizes?.five)} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6">
          <section className="rounded-3xl bg-secondary border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Match Results</h2>
              <p className="text-xs text-[#75877a]">
                Closed {formatDateOnly(draw.closesAt)} · {formatTimeOnly(draw.closesAt)}
              </p>
            </div>

            <div className="space-y-3">
              {(draw.matches || []).map((match) => (
                <div key={match._id || match.matchNumber} className="rounded-2xl bg-background/60 border border-white/5 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#75877a] font-semibold">
                        Match {match.matchNumber}
                      </p>
                      <h3 className="text-white font-bold text-lg mt-1">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>
                      <p className="text-sm text-[#9cae9f] mt-1">
                        {match.league} · {formatDateOnly(match.kickOffTime)} · {formatTimeOnly(match.kickOffTime)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-white/5 text-white font-bold">
                        Result: {match.result || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-secondary border border-white/5 p-5">
              <h2 className="text-white font-bold text-lg mb-4">Winners</h2>
              {loadingWinners ? (
                <Loader />
              ) : winners.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <div className="space-y-3">
                  {winners.map((winner) => (
                    <div key={`${winner.phone}-${winner.username}`} className="rounded-2xl bg-background/60 border border-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white font-bold">{winner.username || "Anonymous"}</p>
                          <p className="text-sm text-[#9cae9f] mt-1">
                            {winner.phone || "Hidden"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase text-[#75877a]">Score</p>
                          <p className="text-white font-bold">{winner.score}/7</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-[#9cae9f]">Prize</span>
                        <span className="text-primary font-bold">{formatKES(winner.prize)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-background/60 p-3">
      <p className="text-[10px] uppercase text-[#75877a]">{label}</p>
      <p className="text-white font-bold mt-1">{value}</p>
    </div>
  );
}

export default JackpotDrawDetailPage;
