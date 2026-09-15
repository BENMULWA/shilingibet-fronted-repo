import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTransactionsHistory } from "../../hooks/usePayment";
import {
  DatePicker,
  Segmented,
  Select,
  Tag,
  Empty,
  Badge,
  Pagination,
} from "antd";
import toast from "react-hot-toast";
import { FiArrowDownRight, FiArrowUpRight, FiCalendar } from "react-icons/fi";
import moment from "moment";
import Loader from "../../components/Loader";
import GoBack from "../../components/GoBack";

const { RangePicker } = DatePicker;
const ITEMS_PER_PAGE = 20;

/* ---------------------- Helpers ---------------------- */
const toMoment = (raw) => {
  if (raw == null) return null;
  if (moment.isMoment(raw)) return raw;
  if (typeof raw?.toDate === "function") return moment(raw.toDate());
  if (typeof raw === "number" || /^\s*\d+\s*$/.test(String(raw))) {
    const n = Number(raw);
    return moment(n < 1e12 ? n * 1000 : n);
  }
  return moment(raw);
};

const formatTimeOnly = (raw) => {
  const m = toMoment(raw);
  return m && m.isValid() ? m.format("h:mm A") : "—";
};

const txMoment = (t) =>
  toMoment(t.createdAt ?? t.date ?? t.time ?? t.timestamp);

/* ---------------------- Main Page ---------------------- */
function HistoryPage() {
  const [page, setPage] = useState(1);
  const { transactions, isLoading, isFetching } = useTransactionsHistory(
    page,
    ITEMS_PER_PAGE
  );

  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [customRange, setCustomRange] = useState([null, null]);

  // Handle both direct response and axios wrapped response
  const data =
    transactions?.data?.data ??
    transactions?.data?.transactions ??
    transactions?.data ??
    transactions?.transactions ??
    [];
  const totalItems =
    transactions?.data?.totalItems ?? transactions?.totalItems ?? 0;

  // Filtering
  const filterByDate = (t) => {
    const m = txMoment(t);
    if (!m?.isValid()) return false;
    switch (dateFilter) {
      case "today":
        return m.isSame(moment(), "day");
      case "week":
        return m.isSame(moment(), "isoWeek");
      case "month":
        return m.isSame(moment(), "month");
      case "custom": {
        const [s, e] = customRange || [];
        if (!s || !e) return false;
        return m.isBetween(
          toMoment(s)?.startOf("day"),
          toMoment(e)?.endOf("day"),
          null,
          "[]"
        );
      }
      default:
        return true;
    }
  };
  const filterByType = (t) =>
    typeFilter === "all" ? true : (t?.type || "").toLowerCase() === typeFilter;

  const filteredTransactions = useMemo(() => {
    return data
      .filter(
        (t) =>
          (t?.status || "").toLowerCase() !== "pending" &&
          Boolean(t?.uniqueID || t?.transactionCode || t?._id)
      )
      .filter(filterByDate)
      .filter(filterByType)
      .sort(
        (a, b) => (txMoment(b)?.valueOf() || 0) - (txMoment(a)?.valueOf() || 0)
      );
  }, [data, filterByDate, filterByType]);

  // Quick stats - only count successful transactions
  const { totalCount, depositsSum, withdrawalsSum, taxSum } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const isSuccess = ["success", "complete", "completed"].includes(
          (t?.status || "").toLowerCase()
        );
        if (!isSuccess) return acc;

        acc.totalCount += 1;
        const amt = Number(t.amount || 0);
        const tax = Number(t.tax || 0);
        const kind = (t?.type || "").toLowerCase();
        if (kind === "deposit") acc.depositsSum += amt;
        if (kind === "withdraw") acc.withdrawalsSum += amt;
        acc.taxSum += tax;
        return acc;
      },
      { totalCount: 0, depositsSum: 0, withdrawalsSum: 0, taxSum: 0 }
    );
  }, [filteredTransactions]);

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(Number(n || 0));

  const handleRangeChange = (vals) => {
    const v = vals || [null, null];
    setCustomRange(v);
    if (v?.[0] && v?.[1]) setDateFilter("custom");
  };

  return (
    <div className="bg-background min-h-screen w-full flex flex-col">
      <GoBack />
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-secondary/95 border-b border-white/10">
        <div className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 ">
            <h3 className="font-semibold text-lg text-[#9789CD]/90">
              Transactions
            </h3>
            <Badge
              count={filteredTransactions.length}
              style={{ backgroundColor: "#6b7280" }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 max-w-7xl mx-auto">
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              {/* Date filter */}
              <div className="flex-1">
                <p className="text-xs text-[#9789CD]/90 mb-1">Date</p>
                <Segmented
                  block
                  value={dateFilter}
                  onChange={(val) => {
                    setDateFilter(val);
                    if (val !== "custom") setCustomRange([null, null]);
                  }}
                  options={[
                    { label: "Today", value: "today" },
                    { label: "Week", value: "week" },
                    { label: "Month", value: "month" },
                    { label: "All", value: "all" },
                    { label: "Custom", value: "custom" },
                  ]}
                />
              </div>

              {dateFilter === "custom" && (
                <div className="flex-1">
                  <p className="text-xs text-[#9789CD]/90 mb-1">Range</p>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-[#9789CD]/90" />
                    <RangePicker
                      value={customRange}
                      onChange={handleRangeChange}
                      className="w-full"
                      inputReadOnly
                    />
                  </div>
                </div>
              )}

              {/* Type filter */}
              <div className="w-full md:w-56">
                <p className="text-xs text-[#9789CD]/90 mb-1">Type</p>
                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  className="w-full"
                  options={[
                    { label: "All", value: "all" },
                    { label: "Deposits", value: "deposit" },
                    { label: "Withdrawals", value: "withdrawal" },
                  ]}
                />
              </div>
            </div>

            {/* Active filter tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {/* <Tag color="geekblue">Date: {dateFilter}</Tag>
              <Tag color="purple">Type: {typeFilter}</Tag> */}
              {dateFilter === "custom" &&
                customRange?.[0] &&
                customRange?.[1] && (
                  <Tag>
                    {toMoment(customRange[0])?.format("MMM D, YYYY")} –{" "}
                    {toMoment(customRange[1])?.format("MMM D, YYYY")}
                  </Tag>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary tiles */}
      <section className="px-4 pt-3 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryTile label="Total" value={totalCount} />
          <SummaryTile label="Deposits" value={formatCurrency(depositsSum)} />
          <SummaryTile
            label="Withdrawals"
            value={formatCurrency(withdrawalsSum)}
          />
          <SummaryTile label="Total Tax" value={formatCurrency(taxSum)} />
        </div>
      </section>

      {/* Transactions list */}
      <main className="flex-1 px-4 pb-24 pt-3 max-w-6xl mx-auto w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="mt-10 flex items-center justify-center flex-col text-center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            <p className="text-[#9789CD]/90 mt-2">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((t) => (
              <TransactionCard
                key={t.uniqueID || t.transactionCode || t._id}
                reference={t.transactionCode}
                time={t.createdAt ?? t.date}
                amount={t.amount}
                status={t.status}
                type={t.type}
                tax={t.tax}
                description={t.transactionDescription}
                formatCurrency={formatCurrency}
              />
            ))}

            {/* Pagination */}
            {totalItems > ITEMS_PER_PAGE && (
              <div className="flex justify-center pt-6 pb-4">
                <Pagination
                  current={page}
                  total={totalItems}
                  pageSize={ITEMS_PER_PAGE}
                  onChange={(newPage) => setPage(newPage)}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  disabled={isFetching}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------------- Components ---------------------- */
function SummaryTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-secondary/70 border border-white/10 p-4 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-[#9789CD]/90">{label}</p>
      <p className="text-lg md:text-xl font-semibold text-[#9789CD]/90 mt-1">
        {value}
      </p>
    </div>
  );
}

function TransactionCard({
  amount,
  time,
  reference,
  status,
  type,
  tax,
  description,
  formatCurrency,
}) {
  const isSuccess = (status || "").toLowerCase() === "success";
  const isDeposit = (type || "").toLowerCase() === "deposit";

  const ringClass = isSuccess
    ? "ring-1 ring-green-500/20 hover:ring-green-500/40"
    : "ring-1 ring-red-500/20 hover:ring-red-500/40";

  const icon = isDeposit ? (
    <FiArrowDownRight className="text-emerald-400" size={18} />
  ) : (
    <FiArrowUpRight className="text-rose-400" size={18} />
  );

  return (
    <div
      className={`bg-secondary/70 border border-white/10 ${ringClass} rounded-2xl p-4 shadow-sm transition`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#9789CD]/90 capitalize">
              {type || "—"}
            </p>
            <p className="text-xs text-[#9789CD]/90">{formatTimeOnly(time)}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-base md:text-lg font-semibold text-[#9789CD]/90">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-[#9789CD]/90">
            Tax: {formatCurrency(tax ?? 0)}
          </p>
        </div>
      </div>

      {description && (
        <p className="mt-2 text-xs text-[#9789CD]/60 truncate">{description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        {isSuccess ? (
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(reference).then(() => {
                  toast.success("Copied!");
                });
              } else {
                const textArea = document.createElement("textarea");
                textArea.value = reference;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                toast.success("Copied!");
              }
            }}
            className="flex items-center gap-1.5 group cursor-pointer"
          >
            <code className="text-[11px] md:text-xs text-[#9789CD]/90 bg-white/5 border border-white/10 rounded px-2 py-0.5 group-hover:bg-white/10 transition-colors">
              {reference}
            </code>
            <svg
              className="w-3.5 h-3.5 text-[#9789CD]/50 group-hover:text-[#9789CD] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        ) : (
          <code className="text-[11px] md:text-xs text-[#9789CD]/90 bg-white/5 border border-white/10 rounded px-2 py-0.5">
            — — —
          </code>
        )}
        <Tag color={isSuccess ? "green" : "red"} className="capitalize">
          {status}
        </Tag>
      </div>
    </div>
  );
}

SummaryTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
TransactionCard.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  time: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  reference: PropTypes.string.isRequired,
  status: PropTypes.string,
  type: PropTypes.string,
  tax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  formatCurrency: PropTypes.func.isRequired,
};

export default HistoryPage;
