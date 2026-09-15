import { ChatProvider } from "../../context/ChatProvider";
import ChatSidebar from "./ChatSidebar/ChatSidebar";

export default function ChatPanel({
  token,
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}) {
  return (
    <ChatProvider token={token} enabled={open}>
      <ChatSidebar
        open={open}
        onClose={onClose}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </ChatProvider>
  );
}
