import { useState } from "react";
import {
  FaCrown,
  FaComments,
  FaTrash,
  FaSignOutAlt,
  FaWallet,
  FaHistory,
  FaCoins,
} from "react-icons/fa";
import { TfiGift } from "react-icons/tfi";
import { IoWalletOutline, IoCopyOutline, IoCheckmark } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BsBoxes } from "react-icons/bs";
import { HiChevronRight } from "react-icons/hi";
import { useSwitchActiveWallet, useUpdateBalance } from "../../hooks/usePayment";
import BaseClass from "../../services/BaseClass";
import Footer from "../../components/Footer";
import LogoutModal from "../../components/LogoutModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { useGame } from "../../context/GameContext";
import { BounceLoading } from "respinner";

export default function Profile() {
  const { balance, isLoading: gettingBalance } = useUpdateBalance();
  const { switchActiveWallet, isLoading: isSwitchingWallet } = useSwitchActiveWallet();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const base = new BaseClass();
  const referralCode = base?.referralCode;
  const referralLink = `https://www.shilingibet.com/register?ref=${referralCode}`;
  const activeWallet = balance?.activeWallet ?? base.activeWallet ?? "balance";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const { resetGame } = useGame();

  const handleWalletSwitch = (wallet) => {
    if (!wallet || wallet === activeWallet || isSwitchingWallet) {
      return;
    }

    switchActiveWallet(wallet);
  };

  const menuItems = [
    { icon: <BsBoxes />, label: "Refer & Earn", route: "refer" },
    { icon: <FaHistory />, label: "Transaction Records", route: "history" },
    { icon: <FaCrown />, label: "Redeem Bonus", route: "redeem" },
    { icon: <FaComments />, label: "Chat with Support", onClick: () => navigate('/support') },
    { icon: <FaTrash />, label: "Delete Account", onClick: () => setShowDeleteModal(true) },
    { icon: <FaSignOutAlt />, label: isLoggingOut ? "Logging Out..." : "Log Out", onClick: () => setShowLogoutModal(true), isLogout: true },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* User Header */}
        <div className="mb-6 rounded-2xl bg-secondary p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/prof-1.png"
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {base?.username || "User"}
              </h1>
              <p className="text-[#9cae9f] text-sm">{base?.phone}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-secondary p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Active wallet</h2>
              <p className="text-sm text-[#9cae9f]">
                Choose the wallet used by default for bets and deposits.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleWalletSwitch("balance")}
                disabled={isSwitchingWallet}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  activeWallet === "balance"
                    ? "border-primary bg-primary text-black"
                    : "border-white/10 bg-background/40 text-white hover:border-primary/40"
                }`}
              >
                Main Wallet
              </button>
              <button
                type="button"
                onClick={() => handleWalletSwitch("airtime")}
                disabled={isSwitchingWallet}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  activeWallet === "airtime"
                    ? "border-primary bg-primary text-black"
                    : "border-white/10 bg-background/40 text-white hover:border-primary/40"
                }`}
              >
                Airtime Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Main Wallet */}
          <div className="rounded-2xl bg-secondary p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/icons/add-payment.png" alt="Wallet" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm text-[#9cae9f]">Main Wallet</span>
                {activeWallet === "balance" && (
                  <p className="text-xs font-semibold text-primary">Active wallet</p>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {gettingBalance ? (
                <BounceLoading fill="#f9ce36" barHeight={12} />
              ) : (
                `KES ${balance?.balance?.toLocaleString() ?? 0}`
              )}
            </div>
          </div>

          {/* Airtime Wallet */}
          <div className="rounded-2xl bg-secondary p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/icons/mpesa.png" alt="Airtime Wallet" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm text-[#9cae9f]">Airtime Wallet</span>
                {activeWallet === "airtime" && (
                  <p className="text-xs font-semibold text-primary">Active wallet</p>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {gettingBalance ? (
                <BounceLoading fill="#f9ce36" barHeight={12} />
              ) : (
                `KES ${balance?.airtimeBalance?.toLocaleString() ?? 0}`
              )}
            </div>
          </div>

          {/* Referral Bonus */}
          <div className="rounded-2xl bg-secondary p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/icons/refer.png" alt="Referral" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm text-[#9cae9f]">Referral</span>
              </div>
              <Link
                to="/redeem?type=referral"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  (balance?.referralBonus ?? 0) >= 10
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                }`}
              >
                Redeem
              </Link>
            </div>
            <div className="text-2xl font-bold text-white">
              {gettingBalance ? (
                <BounceLoading fill="#f9ce36" barHeight={12} />
              ) : (
                `KES ${balance?.referralBonus?.toLocaleString() ?? 0}`
              )}
            </div>
          </div>

          {/* Cashback */}
          <div className="rounded-2xl bg-secondary p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/icons/cashback.png" alt="Cashback" className="w-full h-full object-contain filter drop-shadow-lg" />
                </div>
                <span className="text-sm text-[#9cae9f]">Cashback</span>
              </div>
              <Link
                to="/redeem?type=cashback"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  (balance?.cashback ?? 0) >= 10
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                }`}
              >
                Redeem
              </Link>
            </div>
            <div className="text-2xl font-bold text-white">
              {gettingBalance ? (
                <BounceLoading fill="#f9ce36" barHeight={12} />
              ) : (
                `KES ${balance?.cashback?.toLocaleString() ?? 0}`
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Link
            to="/deposit"
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-black font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <MdOutlineAdd className="text-xl" />
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <IoWalletOutline className="text-xl" />
            Withdraw
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl bg-secondary">
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="p-3">
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    route={item.route}
                    onClick={item.onClick}
                    isLogout={item.isLogout}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Referral Section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="rounded-2xl bg-secondary p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-primary/20 rounded-xl flex items-center justify-center">
                  <BsBoxes className="text-primary text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Refer & Earn</h2>
                  <p className="text-sm text-[#9cae9f]">
                    Win up to <span className="text-primary font-semibold">KES 350,000</span> weekly
                  </p>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-5 rounded-xl bg-background/50 p-4">
                <p className="text-xs text-[#75877a] mb-2">Your referral link</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-lg px-4 py-3 text-sm text-[#d7e1d9] truncate">
                    {referralLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                      copied
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {copied ? (
                      <>
                        <IoCheckmark /> Copied
                      </>
                    ) : (
                      <>
                        <IoCopyOutline /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* How it works */}
              <div>
                <p className="text-sm font-medium text-[#aab8ad] mb-3">How it works</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-background/30 rounded-xl p-4">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-primary text-sm font-bold">1</span>
                    </div>
                    <p className="text-sm text-[#9cae9f]">Share your referral link</p>
                  </div>
                  <div className="bg-background/30 rounded-xl p-4">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-primary text-sm font-bold">2</span>
                    </div>
                    <p className="text-sm text-[#9cae9f]">Friend registers & deposits</p>
                  </div>
                  <div className="bg-background/30 rounded-xl p-4">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-primary text-sm font-bold">3</span>
                    </div>
                    <p className="text-sm text-[#9cae9f]">Earn KES 10 + 5% bonus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Networks */}
            <div className="mt-4 rounded-2xl bg-secondary p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Supported Networks</p>
                  <p className="text-xs text-[#75877a]">Fast & secure payments</p>
                </div>
                <img src="/mpesa.png" alt="M-Pesa" className="h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LogoutModal
        open={showLogoutModal}
        onConfirm={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("launchURL");
          localStorage.removeItem("downloadBannerDismissed");
          resetGame();
          window.location.href = "/";
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
        }}
      />
      <Footer />
    </div>
  );
}

function MenuItem({ icon, label, route, onClick, isLogout }) {
  const content = (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between p-3 rounded-xl cursor-pointer
        transition-colors hover:bg-white/5
        ${isLogout ? "hover:bg-red-500/10" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center
          ${isLogout ? "bg-red-500/20" : "bg-primary/10"}
        `}>
          <span className={isLogout ? "text-red-400" : "text-[#d7e1d9]"}>{icon}</span>
        </div>
        <span className={`text-sm ${isLogout ? "text-red-400" : "text-[#d7e1d9]"}`}>
          {label}
        </span>
      </div>
      <HiChevronRight className={`text-lg ${isLogout ? "text-red-400/50" : "text-[#5f6f64]"}`} />
    </div>
  );

  return route ? (
    <Link to={`/${route}`} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
