import { BounceLoading } from "respinner";
import { useNavigate } from "react-router-dom";

export default function WalletCard({
  icon: Icon,
  label,
  type,
  value,
  amount,
  loading,
  iconColor = "text-yellow-400",
}) {
  const navigate = useNavigate();
  const isDisabled = type && (amount ?? 0) < 10;

  const handleRedeem = () => {
    if (isDisabled) return;
    if (type) {
      navigate(`/redeem?type=${type}`);
    } else {
      navigate("/redeem");
    }
  };

  return (
    <div
      className="
        relative rounded-2xl border border-gray-700/60 p-5 shadow-md
        bg-secondary/80 backdrop-blur-lg transition-transform duration-200
        hover:scale-[1.02]
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Icon className={`text-xl ${iconColor}`} />
        <span className="text-sm font-semibold tracking-wide text-[#b7c4ba]">
          {label}
        </span>
      </div>

      {/* Value + Redeem Button */}
      <div className="mt-4 flex items-center justify-between">
        <div className="font-extrabold text-lg tracking-wide text-[#d7e1d9]">
          {loading ? <BounceLoading fill="#f9ce36" barHeight={12} /> : value}
        </div>

        {type && (
          <button
            onClick={handleRedeem}
            disabled={isDisabled}
            className={`
              ml-3 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide
              transition-colors
              ${
                isDisabled
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-green-500 text-white cursor-pointer hover:bg-green-600"
              }
            `}
          >
            Redeem
          </button>
        )}
      </div>
    </div>
  );
}
