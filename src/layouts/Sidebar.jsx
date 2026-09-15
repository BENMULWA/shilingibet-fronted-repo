import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoClose, IoAirplane, IoRocket } from "react-icons/io5";
import {
  FiPhone, FiMessageSquare, FiMail, FiChevronDown,
  FiLogOut, FiSearch, FiGlobe, FiHome
} from "react-icons/fi";
import { BsStarFill, BsTrophyFill, BsTicketFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import SidebarItem from "./SidebarItem";
import BaseClass from "../services/BaseClass";
import { useLogOut } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { gameSlug } from "../features/games/virtualGameCatalog";

/* ─── Promotion action button ────────────────────────────── */
function PromoAction({ label, icon, to, badge, requiresAuth = false }) {
  const base = new BaseClass();
  const navigate = useNavigate();
  const dest = requiresAuth && !base.isAuthenticated() ? "/login" : to;

  return (
    <button
      onClick={() => navigate(dest)}
      className="mb-1.5 flex w-full cursor-pointer items-center justify-between rounded-lg border border-green-300/15 bg-white/[0.04] px-3 py-2.5 transition-colors hover:bg-white/[0.075]"
    >
      <span className="text-sm font-bold text-white/95">{label}</span>
      {badge === "star" ? (
        <div className="relative">
          <BsStarFill className="text-yellow-400 text-2xl" />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-black">New</span>
        </div>
      ) : icon ? (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-yellow-200/55 bg-primary text-base text-black shadow-[0_0_14px_rgba(250,204,21,0.18)]">
          {icon}
        </div>
      ) : null}
    </button>
  );
}

/* ─── Help item ──────────────────────────────────────────── */
function HelpItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:border-green-300/20 hover:bg-white/[0.065]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-black/20 text-lg text-primary">
        {icon}
      </span>
      {label}
    </button>
  );
}

/* ─── Main Sidebar ───────────────────────────────────────── */
export default function Sidebar({ isMobile, showSidebar, setShowSidebar, collapsed }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileDrawerTop, setMobileDrawerTop] = useState(0);
  const sidebarScrollRef = useRef(null);
  const navigate = useNavigate();
  const base = new BaseClass();
  const isAuth = base.isAuthenticated();
  const { logOutFn } = useLogOut();

  const effectiveCollapsed = isMobile ? false : collapsed;

  useEffect(() => {
    if (!isMobile || !showSidebar) return;

    const positionBelowHeader = () => {
      const navbar = document.getElementById("main-navbar");
      setMobileDrawerTop(Math.max(0, navbar?.getBoundingClientRect().bottom ?? 0));
    };

    positionBelowHeader();
    // The drawer remains mounted between openings, so browsers retain its
    // previous scroll offset. Always reveal Home when the menu opens.
    sidebarScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    window.addEventListener("resize", positionBelowHeader);
    return () => window.removeEventListener("resize", positionBelowHeader);
  }, [isMobile, showSidebar]);

  /* Auth-aware route */
  const p = (path) => (isAuth ? path : "/login");

  const closeMobile = () => {
    if (isMobile) setShowSidebar(false);
  };

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
    closeMobile();
  };

  /* ── Game navigation items ── */
  const navItems = [
    { label: "Home", icon: "/icons/house.png", to: "/", requiresAuth: false },
    // { label: "Jackpot", icon: "/icons/badge.png", to: p("/jackpot"), requiresAuth: true, badge: "New" },
    { label: "Aviator", icon: "/aviator.svg", to: p("/aviator"), requiresAuth: true },
    {
      label: "Euro League",
      icon: "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_vl_legacy_ui.png",
      to: p("/virtual/gfhjdghvfdvsaddd"),
      requiresAuth: true,
    },
    {
      label: "Virtual Jackpot",
      icon: "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_virtual_jackpot.png",
      to: p("/virtual/ea8dfcc7-2f3d-4a0c-929c-37f90cb75d41"),
      requiresAuth: true,
    },
    {
      label: "Betting League",
      icon: "https://storage.googleapis.com/eurovirtuals/assets/ev_thumbnail_vl_next_gen_ui.png",
      to: p("/virtual/6a1f06c2-91a2-41cb-bb39-0c9673c1e7e2"),
      requiresAuth: true,
    },
    {
      label: "World Cup",
      icon: "/virtuals.png",
      to: p(`/virtual/name/${gameSlug("Euro World Cup")}`),
      requiresAuth: true,
    },
    { label: "Refer a friend", icon: "/refer.png", to: p("/refer"), requiresAuth: true, badge: "Hot" },
    { label: "Promotions", icon: "/promo.svg", to: "/promotions", requiresAuth: false, badge: "New", animate: true },
    { label: "Download app", icon: "/deposit.svg", to: "/download", requiresAuth: false },
  ];

  /* Filter by search */
  const filtered = searchQuery.trim()
    ? navItems.filter((i) =>
      i.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : navItems;

  const sidebarInner = (
    <div
      ref={sidebarScrollRef}
      className="flex h-full flex-col overflow-y-auto bg-[linear-gradient(180deg,rgba(5,14,9,0.98),rgba(8,18,12,0.98))] pb-[calc(70px+env(safe-area-inset-bottom))] no-scrollbar md:pb-0"
    >
      {/* Mobile close spacer */}
      {isMobile && <div className="h-14" />}

      {/* Search bar */}
      {!effectiveCollapsed && (
        <div className="px-2 pt-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-within:border-green-300/35">
            <FiSearch className="flex-shrink-0 text-primary/80" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-[#8fa195]"
            />
          </div>
        </div>
      )}

      {/* ── Game Navigation ── */}
      <nav className="px-2 pt-1 flex-shrink-0">
        {filtered.map((item) => (
          <SidebarItem
            key={item.label}
            to={item.to}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            animate={item.animate}
            collapsed={effectiveCollapsed}
            onClick={closeMobile}
          />
        ))}
      </nav>

      {/* ── Download App CTA Button ── */}
      {!effectiveCollapsed && (
        <div className="px-3 py-3">
          <button
            onClick={() => { navigate("/download"); closeMobile(); }}
            className="w-full rounded-xl border border-yellow-200/60 bg-primary py-3 text-base font-black text-black shadow-[0_10px_24px_rgba(250,204,21,0.2)] transition-colors hover:brightness-105"
          >
            Download App
          </button>
        </div>
      )}

      {/* ── Wallet Section ── */}
      {isAuth && !effectiveCollapsed && (
        <div className="px-3 pb-3 flex flex-col pt-1">
          <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fa195]">
            Wallet
          </p>
          <SidebarItem
            label="Deposit"
            icon="/icons/add-payment.png"
            to="/deposit"
            onClick={closeMobile}
          />
          <SidebarItem
            label="Withdraw"
            icon="/icons/money-withdrawal.png"
            to="/withdraw"
            onClick={closeMobile}
          />
          <SidebarItem
            label="Redeem Bonus"
            icon="/icons/cashback.png"
            to="/redeem"
            onClick={closeMobile}
          />
        </div>
      )}

      {/* ── Promotions Section ── */}
      {!effectiveCollapsed && (
        <div className="px-3 pb-3">
          <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fa195]">
            Promotions
          </p>
          <PromoAction
            label="Promotions"
            badge="star"
            to="/promotions"
            requiresAuth={false}
          />
          <PromoAction
            label="Refer a friend"
            icon={<HiUserGroup />}
            to="/refer"
            requiresAuth={true}
          />
          {/* <PromoAction
            label="Promotion Rank"
            icon={<BsTrophyFill />}
            to="/refer"
            requiresAuth={true}
          />
          <PromoAction
            label="Redemption Code"
            icon={<BsTicketFill />}
            to="/redeem"
            requiresAuth={true}
          /> */}
        </div>
      )}

      {/* ── Get Help Section ── */}
      {!effectiveCollapsed && (
        <div className="px-3 pb-3">
          <p className="mb-0.5 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fa195]">
            Get Help
          </p>
          <p className="mb-2 px-1 text-[11px] text-[#728278]">
            Get quick help via calling or visiting our help center
          </p>

          <HelpItem
            icon={<FiMail />}
            label="Contact Support"
            onClick={() => { navigate("/support"); closeMobile(); }}
          />
        </div>
      )}


      {/* ── License ── */}
      {/*
      {!effectiveCollapsed && (
        <div className="px-3 pb-3">
          <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fa195]">
            License
          </p>
          <div className="rounded-lg border border-white/8 bg-white/[0.035] p-3 text-[11px] leading-relaxed text-[#b7c4ba]">
            Glostar Trading Co Limited, Crescent Business Center, 8th floor,
            Parklands, Nairobi operates the ShilingiBet brand and is authorized
            and regulated by the BCLB (Betting Control and Licensing Board)
            under the Betting, Lotteries and Gaming Act, 1966. License Numbers:{" "}
            <span className="text-yellow-400 font-bold">BK-0001295</span>{" "}
            (Bookmaker) and{" "}
            <span className="text-yellow-400 font-bold">PG-0001060</span>{" "}
            (Public Gaming).
          </div>
        </div>
      )}
      */}

      {/* ── 18+ Only ── */}
      {!effectiveCollapsed && (
        <div className="px-3 pb-3">
          <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fa195]">
            18+ Only
          </p>
          <div className="rounded-lg border border-white/8 bg-white/[0.035] p-3 text-[11px] leading-relaxed text-[#b7c4ba]">
            Must be 18 years of age or older to register or play at ShilingiBet.
            Gambling may have adverse effects if not done with moderation. Learn
            more about{" "}
            <a
              href="#"
              className="text-yellow-400 font-bold hover:underline"
            >
              Responsible gambling policies!
            </a>
          </div>
        </div>
      )}

      {/* ── Responsible Gaming Policy ── */}
      {!effectiveCollapsed && (
        <div className="px-3 pb-3">
          <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fa195]">
            Responsible Gaming Policy
          </p>
          <div className="rounded-lg border border-white/8 bg-white/[0.035] p-3 text-[11px] leading-relaxed text-[#b7c4ba]">
            This is a real-money gambling app. Please gamble responsibly and
            only bet with what you can afford. For gambling addiction help and
            support, please contact our Responsible Gambling Toll Free hotline
            at <span className="font-semibold">0800 724835</span> or visit{" "}
            <a href="#" className="text-yellow-400 font-bold hover:underline">
              The Responsible Gaming Website.
            </a>{" "}
            For more information, please view our Responsible Gaming policy{" "}
            <a href="#" className="text-yellow-400 font-bold hover:underline">
              here.
            </a>
          </div>
        </div>
      )}

      {isAuth && !effectiveCollapsed && (
        <div className="px-3 pb-6">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-white/[0.035] py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/15"
          >
            <FiLogOut size={16} />
            logout
          </button>
        </div>
      )}
    </div>
  );

  /* ── Width ── */
  const desktopWidth = collapsed ? "w-18" : "w-[250px]";

  return (
    <>
      {isMobile ? (
        <div
          className={`fixed inset-0 z-50 transition ${
            showSidebar ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!showSidebar}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-black/70 transition-opacity ${
              showSidebar ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowSidebar(false)}
            aria-label="Close menu"
          />

          <aside
            className={`absolute left-0 w-[278px] overflow-hidden bg-[#051305] shadow-2xl transition-transform duration-300 ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
              top: `${mobileDrawerTop}px`,
              height: `calc(100dvh - ${mobileDrawerTop}px)`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <button
              type="button"
              className="absolute top-3 right-3 z-50 cursor-pointer rounded-full border border-white/10 bg-black/35 p-2 shadow-lg"
              onClick={() => setShowSidebar(false)}
              aria-label="Close menu"
            >
              <IoClose size={18} className="text-white" />
            </button>
            {sidebarInner}
          </aside>
        </div>
      ) : (
        <aside
          className={`${desktopWidth} h-full flex-shrink-0 overflow-hidden border-r border-white/5 bg-[#07110b] shadow-[12px_0_34px_rgba(0,0,0,0.2)] transition-all duration-300`}
        >
          {sidebarInner}
        </aside>
      )}
    </>
  );
}
