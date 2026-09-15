import { TbHome } from "react-icons/tb";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

export default function BottomNav({ active, setActive }) {
  return (
    <div className="support-bottom-nav">
      <NavItem
        label="Home"
        icon={<TbHome size={20} />}
        active={active === "home"}
        onClick={() => setActive("home")}
      />

      <NavItem
        label="Messages"
        icon={<BiMessageSquareDetail size={20} />}
        active={active === "messages"}
        onClick={() => setActive("messages")}
      />

      <NavItem
        label="Help"
        icon={<HiOutlineQuestionMarkCircle size={20} />}
        active={active === "help"}
        onClick={() => setActive("help")}
      />
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-item ${active ? "active" : ""}`}
    >
      <div className="nav-item-icon">{icon}</div>
      <span className="nav-item-label">{label}</span>
    </button>
  );
}
