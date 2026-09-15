import { useParams } from "react-router-dom";
import { Empty } from "antd";
import GoBack from "../../components/GoBack";
import Loader from "../../components/Loader";
import { useMyJackpotBetDetail } from "../../hooks/useJackpot";
import {
  formatDateTime,
  formatKES,
  getPickLabel,
} from "./jackpotUtils";

function JackpotBetDetailPage() {
  const { betId } = useParams();
  const { bet, isLoading } = useMyJackpotBetDetail(betId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="min-h-screen bg-background">
        <GoBack />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bet not found" />
        </div>
      </div>
    );
  }

  const games = bet.games || [];

  return (
    <div className="min-h-screen bg-background pb-10">
      <GoBack />

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
        <div className="rounded-3xl bg-secondary border border-white/5 p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80 font-bold">
            My jackpot bet
          </p>
          <h1 className="text-2xl font-black text-white mt-2">
            {bet.draw?.drawNumber || "Ticket Detail"}
          </h1>
          <p className="text-sm text-[#9cae9f] mt-2">
            Placed {formatDateTime(bet.createdAt)} · {bet.settled ? "Settled" : "Pending"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <DetailStat label="Stake" value={formatKES(bet.amount)} />
            <DetailStat label="Score" value={`${bet.score ?? 0}/7`} />
            <DetailStat label="Prize" value={formatKES(bet.prize)} />
            <DetailStat label="Payout" value={bet.payoutStatus || "none"} />
          </div>
        </div>

        <div className="rounded-3xl bg-secondary border border-white/5 p-5">
          <h2 className="text-white font-bold text-lg mb-4">Match Breakdown</h2>

          {games.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <div key={game.matchNumber} className="rounded-2xl bg-background/60 border border-white/5 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#75877a] font-semibold">
                        Match {game.matchNumber}
                      </p>
                      <h3 className="text-white font-bold text-lg mt-1">
                        {game.homeTeam} vs {game.awayTeam}
                      </h3>
                      <p className="text-sm text-[#9cae9f] mt-1">
                        {game.league} · Kick-off {formatDateTime(game.kickOffTime)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-[320px]">
                      <MiniStat label="Pick" value={getPickLabel(game.pick)} />
                      <MiniStat label="Result" value={getPickLabel(game.result)} />
                      <MiniStat label="Correct" value={game.isCorrect ? "Yes" : "No"} />
                      <MiniStat label="Score" value={game.isCorrect ? "1" : "0"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-[10px] uppercase text-[#75877a]">{label}</p>
      <p className="text-white font-bold mt-1">{value}</p>
    </div>
  );
}

export default JackpotBetDetailPage;
