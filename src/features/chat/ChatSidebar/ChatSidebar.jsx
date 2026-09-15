import { useState } from "react";
import ChatFooterLinks from "./ChatFooterLinks";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import ChatRulesModal from "./ChatRulesModal";

export default function ChatSidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}) {
  const [showRules, setShowRules] = useState(false);
  return (
    <div
      className={`
        fixed top-0 right-0 h-full flex flex-col z-50 transition-all duration-300 md:border-l md:border-white/5 w-full max-w-full
        ${open ? "translate-x-0" : "translate-x-full"}
        ${collapsed ? "md:w-[320px]" : "md:w-[380px]"}
      `}
    >
      <ChatHeader
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        onClose={onClose}
      />
      <ChatMessageList />
      <ChatInput />
      <div className="pb-16 md:pb-0">
        <ChatFooterLinks onOpenRules={() => setShowRules(true)} />
      </div>{" "}
      {/* Chat Rules Modal */}
      {showRules && <ChatRulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
