import { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiSend, FiPaperclip } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";

export default function ChatScreen({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      text: "Welcome to ShilingiBet Support! How can we help you today?",
      time: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputValue.trim(),
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // TODO: Replace with your API call
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: "system",
        text: "Thank you for your message. Our support team will get back to you shortly. In the meantime, you can check our Help section for quick answers.",
        time: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-header">
        <button onClick={onBack} className="chat-back-btn">
          <FiArrowLeft size={18} />
        </button>
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <BiSupport size={20} />
          </div>
          <div>
            <p className="chat-header-name">ShilingiBet Support</p>
            <div className="chat-header-status">
              <span className="chat-header-status-dot"></span>
              <span className="chat-header-status-text">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.type}`}
          >
            <div className="chat-message-bubble">
              <p className="chat-message-text">{message.text}</p>
              <p className="chat-message-time">{formatTime(message.time)}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-typing">
            <div className="chat-typing-bubble">
              <div className="chat-typing-dots">
                <span className="chat-typing-dot"></span>
                <span className="chat-typing-dot"></span>
                <span className="chat-typing-dot"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <button className="chat-attach-btn">
            <FiPaperclip size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`chat-send-btn ${inputValue.trim() ? "active" : "inactive"}`}
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
