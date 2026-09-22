import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import BaseClass from "../services/BaseClass";
import { useUpdateBalance, useSwitchActiveWallet } from "../hooks/usePayment";
import { useLogOut } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { RiMenuUnfold3Line, RiMenuFold3Line } from "react-icons/ri";
import {
  FiSearch, FiChevronDown, FiPlus,
  FiUser, FiClock, FiLogOut,
  FiCreditCard, FiSmartphone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";

export default function Navbar({
  collapsed,
  setCollapsed,
  isMobile,
  onMenuClick,
}) {
  const base = new BaseClass();
  const isAuth = base.isAuthenticated();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const walletDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  // Fetch live balance only when logged in
  const { balance } = useUpdateBalance();
  const { logOutFn } = useLogOut();
  const { switchActiveWallet, isLoading: isSwitchingWallet } = useSwitchActiveWallet();

  const mainBalance = isAuth
    ? Number(balance?.balance ?? base.user?.balance ?? 0).toFixed(2)
    : null;
  const airtimeBalance = isAuth
    ? Number(balance?.airtimeBalance ?? base.user?.airtimeBalance ?? 0).toFixed(2)
    : null;
  const activeWallet = balance?.activeWallet ?? base.activeWallet ?? "balance";
  const activeWalletBalance = activeWallet === "airtime" ? airtimeBalance : mainBalance;

  const handleWalletPick = (wallet) => {
    setWalletDropdownOpen(false);
    if (!wallet || wallet === activeWallet || isSwitchingWallet) return;
    switchActiveWallet(wallet);
  };

  // Close dropdowns when clicking outside either of them
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(e.target)) {
        setWalletDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logOutFn(null, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/");
      },
      onError: () => {
        base.clearUser();
        navigate("/");
      },
    });
    setDropdownOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className="w-full h-16 bg-accent text-white px-2 md:px-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/10 shadow-[0_8px_28px_rgba(0,200,83,0.22)]"
    >
      {/* ── Left Section ── */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop: collapse sidebar toggle */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed?.((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/35 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          >
            {collapsed ? <RiMenuUnfold3Line size={20} /> : <RiMenuFold3Line size={20} />}
          </button>
        )}

        {/* Mobile: open sidebar drawer — bigger, branded tap target */}
        {isMobile && (
          <button
            onClick={() => onMenuClick?.()}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/35 bg-primary/10 text-primary transition-colors hover:bg-primary/20 active:scale-95"
            aria-label="Open menu"
          >
            <RiMenuUnfold3Line size={26} />
          </button>
        )}

        <Link to="/" className="flex items-center">
          <div className={`flex items-center gap-2 ${isMobile ? "mx-1" : ""}`}>
            {isMobile ? (
              <img src="/favicons.svg" alt="Logo" className="h-14 w-14 object-contain" />
            ) : (
              <img src="/shilingibet.png" alt="shilingibet" className="h-10" />
            )}
          </div>
        </Link>

        {/* Promotions — icon-only on mobile, full pill on desktop */}
        {/* <Link
          to="/promotions"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-2.5 md:px-3 py-1.5 rounded-full transition-colors border border-white/5"
          aria-label="Promotions"
        >
          <span className="animate-promo-dance">
            <HiGift className="text-[#ff4d4f]" size={20} />
          </span>
          <span className="hidden md:inline text-sm font-medium text-gray-200">Promotions</span>
        </Link> */}
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-2 md:gap-3">
        {isAuth ? (
          <>
            {/* Search — always visible on desktop; folded into the "More" menu on phones */}
            <button
              onClick={() => navigate('/search')}
              className="hidden w-8 h-8 items-center justify-center hover:bg-white/5 rounded-full transition-colors sm:flex"
            >
              <FiSearch size={20} className="text-gray-300" />
            </button>

            {/* WhatsApp — its own visible icon from sm: up */}
            <a
              href="https://wa.me/yourphonenumber"
              target="_blank"
              className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#25D366] transition-all hover:brightness-110 active:scale-95 sm:flex"
            >
              <FaWhatsapp size={18} className="text-white" />
            </a>

            {/* Active-wallet pill — tap to open the wallet switcher */}
            <div className="relative" ref={walletDropdownRef}>
              <button
                type="button"
                onClick={() => setWalletDropdownOpen((prev) => !prev)}
                className="flex h-[34px] items-center gap-1.5 rounded-xl border border-primary/40 bg-[#07110b] px-2.5 shadow-inner transition-colors hover:border-primary/60 md:h-9 md:px-3"
              >
                {activeWallet === "airtime" ? (
                  <FiSmartphone size={13} className="text-primary" />
                ) : (
                  <FiCreditCard size={13} className="text-primary" />
                )}
                <span className="whitespace-nowrap text-xs font-extrabold text-white drop-shadow-sm md:text-sm">
                  KES {activeWalletBalance}
                </span>
                <FiChevronDown
                  size={12}
                  className={`text-primary transition-transform ${walletDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {walletDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-primary/25 bg-surface shadow-2xl">
                  <div className="px-3.5 pb-1.5 pt-2.5 text-[10px] font-bold uppercase tracking-wide text-[#75877a]">
                    Switch wallet
                  </div>

                  <button
                    type="button"
                    onClick={() => handleWalletPick("balance")}
                    disabled={isSwitchingWallet}
                    className={`flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left transition-colors hover:bg-white/5 disabled:opacity-60 ${
                      activeWallet === "balance" ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
                      <FiCreditCard size={14} className="text-primary" />
                    </span>
                    <span className="flex-grow">
                      <span className="block text-xs font-bold text-white">Main Wallet</span>
                      <span className="block text-[11px] text-[#9cae9f]">KES {mainBalance}</span>
                    </span>
                    {activeWallet === "balance" && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWalletPick("airtime")}
                    disabled={isSwitchingWallet}
                    className={`flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left transition-colors hover:bg-white/5 disabled:opacity-60 ${
                      activeWallet === "airtime" ? "bg-green-500/10" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/15">
                      <FiSmartphone size={14} className="text-green-400" />
                    </span>
                    <span className="flex-grow">
                      <span className="block text-xs font-bold text-white">Airtime Wallet</span>
                      <span className="block text-[11px] text-[#9cae9f]">KES {airtimeBalance}</span>
                    </span>
                    {activeWallet === "airtime" && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Deposit Button — always shows its label, same as on large devices */}
            <Link
              to="/deposit"
              className="flex h-[34px] items-center rounded-xl bg-primary px-3 text-[11px] font-black uppercase text-black shadow-[0_0_15px_rgba(245,197,24,0.2)] transition-all hover:bg-yellow-400 sm:px-4 sm:py-2 sm:text-xs md:h-9"
            >
              Deposit
            </Link>

            {/* Profile Dropdown */}
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <img src="/prof-1.png" className="h-8 w-8 rounded-full object-cover" alt="Profile" />
                <FiChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu (Simplified for brevity) */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5" onClick={() => setDropdownOpen(false)}>
                    <FiUser size={16} /> Profile
                  </Link>
                  <Link to="/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5" onClick={() => setDropdownOpen(false)}>
                    <FiClock size={16} /> History
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>


            <button
              onClick={() => navigate('/support')}
              aria-label="Support"
              className="hidden h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-xl bg-primary transition-colors hover:brightness-110 sm:flex md:h-9 md:w-9"
            >
              <BsChatRightText className="text-black" size={16} />
            </button>

            {/* More — the account + secondary-features menu, kept at the far
                right where an overflow menu is expected. Groups Profile/
                History/Logout (also reachable via the avatar above) plus
                Search/WhatsApp/Support on phones so nothing gets clipped at
                narrow widths; on sm: and up those already have their own
                visible buttons and this menu isn't needed. */}
            <div className="relative sm:hidden" ref={moreDropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                aria-label="More"
                className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <FiPlus size={16} className={`transition-transform ${moreDropdownOpen ? "rotate-45" : ""}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl">
                  <Link
                    to="/profile"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-200 hover:bg-white/5"
                  >
                    <FiUser size={15} /> Profile
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-200 hover:bg-white/5"
                  >
                    <FiClock size={15} /> History
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMoreDropdownOpen(false); navigate('/search'); }}
                    className="flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-200 hover:bg-white/5"
                  >
                    <FiSearch size={15} /> Search
                  </button>
                  <a
                    href="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-200 hover:bg-white/5"
                  >
                    <FaWhatsapp size={15} className="text-[#25D366]" /> WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => { setMoreDropdownOpen(false); navigate('/support'); }}
                    className="flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-200 hover:bg-white/5"
                  >
                    <BsChatRightText size={14} /> Support
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMoreDropdownOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-2.5 text-left text-xs font-semibold text-red-400 hover:bg-white/5"
                  >
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>

          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-1.5 text-sm font-bold text-white hover:text-primary">Login</Link>
            <Link to="/register" className="px-5 py-2 bg-primary hover:bg-yellow-400 text-black font-black text-xs rounded-lg uppercase">Join</Link>
          </div>
        )}
      </div>
    </header>
  );
}
