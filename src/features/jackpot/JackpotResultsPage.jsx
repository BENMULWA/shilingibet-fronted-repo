import { Link } from "react-router-dom";
import { Empty } from "antd";
import GoBack from "../../components/GoBack";
import Loader from "../../components/Loader";
import { useRecentJackpotResults } from "../../hooks/useJackpot";
import {
  formatDateTime,
  formatKES,
  getJackpotDrawId,
} from "./jackpotUtils";

function JackpotResultsPage() {
  const { results, isLoading } = useRecentJackpotResults(20);

  return (
    <div className="min-h-screen bg-background pb-10">
      <GoBack />

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-5">
        <div className="rounded-3xl bg-secondary border border-white/5 p-5 md:p-6">
          <h1 className="text-2xl font-black text-white">Recent Jackpot Results</h1>
          <p className="text-sm text-[#9cae9f] mt-2">
            Review settled draws, winning tiers, and prize pools.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : results.length === 0 ? (
          <div className="bg-secondary border border-white/5 rounded-3xl p-6">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((item) => {
              const drawId = getJackpotDrawId(item);
              return (
                <Link
                  key={drawId || item.drawNumber}
                  to={drawId ? `/jackpot/results/${drawId}` : "/jackpot/results"}
                  className="rounded-3xl bg-secondary border border-white/5 p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-white font-bold text-lg">{item.drawNumber}</p>
                      <p className="text-sm text-[#9cae9f] mt-1">
                        {item.drawDay} · Settled {formatDateTime(item.settledAt)}
                      </p>
                      <p className="text-xs text-[#75877a] mt-2">
                        Closed at {formatDateTime(item.closesAt)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Info label="Bets" value={item.totalBets ?? 0} />
                      <Info label="Paid out" value={formatKES(item.totalPaidOut)} />
                      <Info label="7/7" value={formatKES(item?.prizes?.seven)} />
                      <Info label="6/7" value={formatKES(item?.prizes?.six)} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-background/60 p-3 min-w-[92px]">
      <p className="text-[10px] uppercase text-[#75877a]">{label}</p>
      <p className="text-white font-bold mt-1">{value}</p>
    </div>
  );
}

export default JackpotResultsPage;
