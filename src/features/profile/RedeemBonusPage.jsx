import { FaGift, FaInfoCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import { BounceLoading } from "respinner";
import useRedeemBonus from "../../hooks/usePayment";
import toast from "react-hot-toast";
import { useState } from "react";
import GoBack from "../../components/GoBack";

function RedeemBonus() {
  const { register, handleSubmit, reset } = useForm();
  const { redeemingBonus, isLoading } = useRedeemBonus();
  const [searchParams] = useSearchParams();

  // Get type from URL (?type=cashback/referral)
  const urlType = searchParams.get("type");
  const [bonusType, setBonusType] = useState(urlType || "");

  const onSubmit = (data) => {
    const amount = Number(data.amount);
    if (!amount || amount <= 0) {
      return toast.error("Please enter a valid redeem amount");
    }

    if (!bonusType) {
      return toast.error("Please select a bonus type to redeem");
    }

    redeemingBonus(
      { type: bonusType, amount },
      {
        onSuccess: (res) => {
          if (res?.status) {
            reset();
            // toast.success("Bonus redeemed successfully!");
          }
        },
      }
    );
  };

  return (
    <>
      <GoBack />
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/15 border border-primary/20 p-2.5 rounded-md">
              <FaGift className="text-primary text-xl" />
            </div>
            <h1 className="text-xl font-semibold text-white">
              Redeem Bonus
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-surface/80 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Bonus Type Dropdown */}
              {!urlType && (
                <div>
                  <label className="block text-sm font-medium text-[#b7c4ba] mb-2">
                    Bonus Type
                  </label>
                  <select
                    value={bonusType || undefined}
                    onChange={(event) => setBonusType(event.target.value)}
                    className="w-full rounded-lg border border-primary/30 bg-[#07110b] px-4 py-3 text-white outline-none transition focus:border-primary"
                  >
                    <option value="">Select bonus type</option>
                    <option value="referral">Referral Bonus</option>
                    <option value="cashback">Cashback Bonus</option>
                  </select>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-[#b7c4ba] mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  {...register("amount", { required: true, min: 1 })}
                  className="w-full rounded-lg border border-primary/30 bg-[#07110b] px-4 py-3 text-white placeholder:text-[#6f7f73] outline-none transition focus:border-primary"
                />
              </div>

              {/* Redeem Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 rounded-md transition cursor-pointer flex justify-center items-center ${
                  isLoading
                    ? "bg-primary/50 text-black cursor-not-allowed"
                    : "bg-primary text-black hover:bg-primary/90"
                }`}
              >
                {isLoading ? (
                  <BounceLoading fill="#000" barHeight={12} />
                ) : (
                  "Redeem"
                )}
              </button>
            </form>
          </div>

          {/* Rules Section */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-[#b7c4ba] flex items-center gap-2 mb-3">
              <FaInfoCircle className="text-[#9cae9f]" /> Important
            </h2>
            <div className="bg-[#07110b]/85 border border-white/5 rounded-xl p-4">
              <ul className="text-[#9cae9f] space-y-2 text-sm">
                <li>• Account must be active within the last 30 days</li>
                <li>• Minimum bonus wallet balance: KES 10</li>
                <li>
                  • Bonus can only be used on{" "}
                  <span className="text-primary">Aviator</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RedeemBonus;
