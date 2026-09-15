import { useLocation, useNavigate } from "react-router-dom";

import BaseClass from "../services/BaseClass";

export default function BottomNav({
  closeAll,
  isSomethingOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const base = new BaseClass();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navItemClass = (active) =>
    `relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${active ? "pt-1" : ""
    }`;

  const iconClass = (active) =>
    `w-7 h-7 object-contain transition-all duration-300 ${active ? "scale-110 brightness-110" : "opacity-40 grayscale-[40%]"
    }`;

  const RenderNavItem = ({ icon, label, path, onClick, isAuthRequired }) => {
    const active = path ? isActive(path) : false;

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSomethingOpen) {
        closeAll?.();
        return;
      }
      if (onClick) {
        onClick();
      } else if (path) {
        if (isAuthRequired && !base.userId) {
          navigate("/login");
        } else {
          navigate(path);
        }
      }
    };

    return (
      <button onClick={handleClick} className={navItemClass(active)}>
        {/* Active Indicator Bar */}
        {active && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-primary rounded-b-lg shadow-[0_2px_8px_rgba(245,197,24,0.4)] animate-in fade-in slide-in-from-top-1 duration-300" />
        )}

        <img src={icon} alt={label} className={iconClass(active)} />
        <span className={`text-[11px] font-bold mt-1 ${active ? "text-primary" : "text-gray-500"}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-[#0a0a0a] border-t border-white/5 flex justify-around items-center md:hidden z-50 px-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <RenderNavItem icon="/icons/house.png" label="Home" path="/" />
      <RenderNavItem icon="/aviator.svg" label="Aviator" path="/aviator" isAuthRequired={true} />
      <RenderNavItem icon="/icons/add-payment.png" label="Deposit" path="/deposit" isAuthRequired={true} />
      <RenderNavItem icon="/icons/boy.png" label="Profile" path="/profile" isAuthRequired={true} />

    </div>
  );
}
