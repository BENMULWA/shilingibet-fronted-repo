import { useEffect, useRef } from "react";
import { useChatContext } from "../../../context/ChatProvider";
import ChatMessage from "./ChatMessage";

export default function ChatMessageList() {
  const { messages } = useChatContext();
  const bottomRef = useRef(null);
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  // 🔥 Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-background">
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          avatar={msg.avatar}
          user={msg.senderUsername}
          text={msg.content}
          time={formatTime(msg.createdAt)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
