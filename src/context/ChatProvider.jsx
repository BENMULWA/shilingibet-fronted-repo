// ChatProvider.jsx - Add safety check and debugging
import { createContext, useContext } from "react";
import { useChat } from "../hooks/useChat";

const ChatContext = createContext(null);

export function ChatProvider({ token, enabled = true, children }) {
  const chat = useChat(token, { enabled });

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
