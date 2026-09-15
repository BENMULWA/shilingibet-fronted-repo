export const formatKES = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export const formatDateOnly = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-KE", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const formatTimeOnly = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-KE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const getJackpotDrawId = (draw) =>
  draw?._id || draw?.drawId || draw?.id || draw?.drawNumber || null;

export const getJackpotBetId = (bet) =>
  bet?._id || bet?.betId || bet?.id || null;

export const normalizeDrawPicks = (matches, picks) =>
  (matches || []).map((match) => ({
    matchNumber: match.matchNumber,
    pick: picks?.[match.matchNumber] || "",
  }));

export const getPickLabel = (pick) => {
  if (pick === "H") return "Home";
  if (pick === "D") return "Draw";
  if (pick === "A") return "Away";
  return "—";
};
