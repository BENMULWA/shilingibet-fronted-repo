import { FiX } from "react-icons/fi";
import { MdKeyboardTab } from "react-icons/md";
import { useChatContext } from "../../../context/ChatProvider";

export default function ChatHeader({ onClose, collapsed, onToggleCollapse }) {
  const { activeUsers } = useChatContext();
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-secondary h-16 border-l-2 border-primary/40">
      {/* Language Selector */}
      <h1 className="text-[#b7c4ba] font-bold">
        {" "}
        Let's Chat • {activeUsers} Online
      </h1>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 rounded-xl border-4 border-black cursor-pointer"
        >
          {collapsed ? (
            <MdKeyboardTab className="text-xl text-[#b7c4ba] rotate-180" />
          ) : (
            <MdKeyboardTab className="text-xl text-[#b7c4ba]" />
          )}
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl  border-4 border-black"
        >
          <FiX className="text-xl text-[#b7c4ba] cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
