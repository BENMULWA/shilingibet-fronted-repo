import { useState } from "react";
import { Link } from "react-router-dom";
import { Empty, Pagination } from "antd";
import GoBack from "../../components/GoBack";
import Loader from "../../components/Loader";
import { useMyJackpotBets } from "../../hooks/useJackpot";
import {
  formatDateTime,
  formatKES,
  getJackpotBetId,
} from "./jackpotUtils";

const PAGE_SIZE = 20;

function JackpotHistoryPage() {
  const [page, setPage] = useState(1);
  const { history, isLoading } = useMyJackpotBets(page, PAGE_SIZE);

  const bets = history?.bets || [];
  const total = history?.total || 0;

  return (
    <div className="min-h-screen bg-background pb-10">
      <GoBack />

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-5">
        <div className="rounded-3xl bg-secondary border border-white/5 p-5 md:p-6">
          <h1 className="text-2xl font-black text-white">My Jackpot Bets</h1>
          <p className="text-sm text-[#9cae9f] mt-2">
            Review all your tickets, scores, prizes, and payout status.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : bets.length === 0 ? (
          <div className="bg-secondary border border-white/5 rounded-3xl p-6">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => {
              const betId = getJackpotBetId(bet);
              return (
                <Link
                  key={betId || `${bet.draw?.drawNumber}-${bet.createdAt}`}
                  to={betId ? `/jackpot/my-bets/${betId}` : "/jackpot/my-bets"}
                  className="block rounded-3xl bg-secondary border border-white/5 p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-white font-bold text-lg">
                        {bet.draw?.drawNumber || "Jackpot Bet"}
                      </p>
                      <p className="text-sm text-[#9cae9f] mt-1">
                        Placed {formatDateTime(bet.createdAt)}
                      </p>
                      <p className="text-xs text-[#75877a] mt-2">
                        {bet.draw?.drawDay || "Draw"} · {bet.settled ? "Settled" : "Pending"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Stat label="Stake" value={formatKES(bet.amount)} />
                      <Stat label="Score" value={`${bet.score ?? 0}/7`} />
                      <Stat label="Prize" value={formatKES(bet.prize)} />
                      <Stat label="Status" value={bet.payoutStatus || "none"} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="flex justify-center pt-2">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-background/60 p-3 min-w-[92px]">
      <p className="text-[10px] uppercase text-[#75877a]">{label}</p>
      <p className="text-white font-bold mt-1">{value}</p>
    </div>
  );
}

export default JackpotHistoryPage;
