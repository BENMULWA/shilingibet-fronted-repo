import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://api.ganjibets.com";

export function useChat(token, { enabled = true } = {}) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  // ✅ Load cached messages (before socket connects)
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // ✅ Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // SOCKET CONNECT
  useEffect(() => {
    if (!token || !enabled) return;

    const cleanToken = token.replace("Bearer ", "");

    const newSocket = io(SOCKET_URL, {
      auth: { token: cleanToken },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket error:", error.message);
    });

    newSocket.on("chat:history", (data) => {
      setCurrentUser(data.user);
      setMessages(data.messages);
      setActiveUsers(data.activeUsers);
    });

    newSocket.on("chat:new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("chat:user_joined", (data) => {
      setActiveUsers(data.activeUsers);
    });

    newSocket.on("chat:user_left", (data) => {
      setActiveUsers(data.activeUsers);
    });

    newSocket.on("chat:user_typing", (data) => {
      setTypingUsers((prev) =>
        prev.includes(data.username) ? prev : [...prev, data.username]
      );
    });

    newSocket.on("chat:user_stop_typing", (data) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.username));
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token, enabled]);

  // SEND MESSAGE
  const sendMessage = useCallback(
    (content, replyTo = null) => {
      if (!socket || !content.trim()) return;

      socket.emit("chat:send_message", {
        content,
        messageType: "text",
        ...(replyTo && { replyTo }),
      });
    },
    [socket]
  );

  const emitTyping = useCallback(() => {
    socket?.emit("chat:typing");
  }, [socket]);

  const emitStopTyping = useCallback(() => {
    socket?.emit("chat:stop_typing");
  }, [socket]);

  return {
    connected,
    messages,
    activeUsers,
    currentUser,
    typingUsers,
    sendMessage,
    emitTyping,
    emitStopTyping,
  };
}
