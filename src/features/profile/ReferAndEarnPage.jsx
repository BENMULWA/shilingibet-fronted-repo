import { useState } from "react";
import { CopyOutlined, WhatsAppOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import BaseClass from "../../services/BaseClass";
import { useUpdateBalance } from "../../hooks/usePayment";
import { FiUsers } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import Footer from "../../components/Footer";
import GoBack from "../../components/GoBack";

export default function ReferAndEarn() {
  const [accepted, setAccepted] = useState(true);
  const base = new BaseClass();
  const referralCode = base?.referralCode;
  const referralLink = `https://www.shilingibet.com/register?ref=${referralCode}`;
  const { balance } = useUpdateBalance();
  // calculate total bonus
  const bonusTotal = (balance?.referralBonus ?? 0) + (balance?.cashback ?? 0);
  const referralStats = balance?.referralsCount ?? 0;

  const copyToClipboard = () => {
    if (!accepted) {
      toast.error("You must accept the Terms & Conditions first");
      return;
    }
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const shareOnWhatsApp = () => {
    if (!accepted) {
      toast.error("You must accept the Terms & Conditions first");
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  return (
    <>
      <GoBack />
      <div className="bg-background px-4 py-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Header */}
          <h4 className="text-xl font-semibold text-[#b7c4ba] mb-2">
            Refer Friends, Earn Rewards!
          </h4>
          <p className="text-[#9cae9f] text-sm mb-6">
            Invite friends and earn rewards on every deposit they make.
          </p>

          {/* Referral Stats */}
          <div className="bg-secondary/50 border border-white/10 rounded-md p-5 mb-6">
            <h2 className="text-sm font-semibold text-[#b7c4ba] mb-4">
              Your Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-background/50 rounded-md p-3 border border-white/5">
                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/20 text-primary">
                  <FiUsers size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#9cae9f]">Referrals</p>
                  <p className="text-base font-semibold text-primary">
                    {referralStats}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-background/50 rounded-md p-3 border border-white/5">
                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-green-500/20 text-green-400">
                  <FaMoneyBillWave size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#9cae9f]">Earned</p>
                  <p className="text-base font-semibold text-primary">
                    KES {bonusTotal}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            <label className="text-sm text-[#9cae9f]">
              I accept the{" "}
              <span className="text-primary cursor-pointer">
                Terms and Conditions
              </span>
            </label>
          </div>

          {/* Referral Link Section */}
          <div className="bg-secondary/50 border border-white/10 rounded-md p-4 mb-6">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full bg-transparent text-primary font-mono text-sm mb-3 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                disabled={!accepted}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition cursor-pointer ${
                  accepted
                    ? "bg-background text-[#b7c4ba] hover:bg-primary hover:text-black"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CopyOutlined /> Copy
              </button>
              <button
                onClick={shareOnWhatsApp}
                disabled={!accepted}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition cursor-pointer ${
                  accepted
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <WhatsAppOutlined /> Share
              </button>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-secondary/30 border border-white/5 rounded-md p-4">
            <h2 className="text-sm font-semibold text-[#b7c4ba] mb-3">
              How it works
            </h2>
            <ul className="text-[#9cae9f] space-y-2 text-sm">
              <li>• Invite your friends using your referral link</li>
              <li>• They register, deposit, and place bets</li>
              <li>• You earn 5% bonus on every deposit they make</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
