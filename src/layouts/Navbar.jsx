import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import BaseClass from "../services/BaseClass";
import { useUpdateBalance } from "../hooks/usePayment";
import { useLogOut } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { RiMenuUnfold3Line, RiMenuFold3Line } from "react-icons/ri";
import {
  FiSearch, FiChevronDown,
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
  const dropdownRef = useRef(null);

  // Fetch live balance only when logged in
  const { balance } = useUpdateBalance();
  const { logOutFn } = useLogOut();

  const mainBalance = isAuth
    ? Number(balance?.balance ?? base.user?.balance ?? 0).toFixed(2)
    : null;
  const airtimeBalance = isAuth
    ? Number(balance?.airtimeBalance ?? base.user?.airtimeBalance ?? 0).toFixed(2)
    : null;
  const activeWallet = balance?.activeWallet ?? base.activeWallet ?? "balance";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
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
            className="p-1 rounded hover:bg-white/5 transition-colors"
          >
            {collapsed ? <RiMenuUnfold3Line size={20} /> : <RiMenuFold3Line size={20} />}
          </button>
        )}

        {/* Mobile: open sidebar drawer */}
        {isMobile && (
          <button
            onClick={() => onMenuClick?.()}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
            aria-label="Open menu"
          >
            <RiMenuUnfold3Line size={22} />
          </button>
        )}

        <Link to="/" className="flex items-center">
          <div className={`flex items-center gap-2 ${isMobile ? "mx-1" : ""}`}>
            {isMobile ? (
              <img src="/favicons.svg" alt="Logo" className="h-11 w-11 object-contain" />
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
            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/yourphonenumber"
              target="_blank"
              className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#25D366] transition-all hover:brightness-110 active:scale-95 md:flex"
            >
              <FaWhatsapp size={18} className="text-white" />
            </a>

            {/* Search Icon */}
            <button
              onClick={() => navigate('/search')}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"
            >
              <FiSearch size={20} className="text-gray-300" />
            </button>

            {/* Balance Capsule */}
            <div className="flex items-stretch gap-1 rounded-2xl border border-white/5 bg-[#07110b] p-1">
              <div
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-1 transition-colors md:px-3.5 md:py-1.5 ${
                  activeWallet === "balance" ? "bg-primary/15 ring-1 ring-primary/50" : ""
                }`}
                title="Main wallet"
              >
                <span
                  className={`flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide md:text-[10px] ${
                    activeWallet === "balance" ? "text-primary" : "text-[#75877a]"
                  }`}
                >
                  <FiCreditCard size={10} />
                  Main
                </span>
                <span className="text-[11px] font-bold leading-tight text-white md:text-sm">
                  KES {mainBalance}
                </span>
              </div>

              <div className="w-px self-stretch bg-white/5" />

              <div
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-1 transition-colors md:px-3.5 md:py-1.5 ${
                  activeWallet === "airtime" ? "bg-primary/15 ring-1 ring-primary/50" : ""
                }`}
                title="Airtime wallet"
              >
                <span
                  className={`flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide md:text-[10px] ${
                    activeWallet === "airtime" ? "text-primary" : "text-[#75877a]"
                  }`}
                >
                  <FiSmartphone size={10} />
                  Airtime
                </span>
                <span className="text-[11px] font-bold leading-tight text-white md:text-sm">
                  KES {airtimeBalance}
                </span>
              </div>
            </div>

            {/* Deposit Button */}
            <Link
              to="/deposit"
              className="bg-primary hover:bg-yellow-400 text-black font-black text-xs px-4 py-2 rounded-lg uppercase transition-all shadow-[0_0_15px_rgba(245,197,24,0.2)]"
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
              className="hidden lg:flex w-9 h-9 items-center justify-center bg-primary rounded-lg hover:brightness-110 transition-colors"
            >
              <BsChatRightText className="text-black" size={18} />
            </button>

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
