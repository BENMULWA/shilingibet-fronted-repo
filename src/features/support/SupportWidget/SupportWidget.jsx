import { useState } from "react";
import { FiX } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import BottomNav from "./BottomNav";
import HomeScreen from "./HomeScreen";
import MessagesScreen from "./MessagesScreen";
import HelpScreen from "./HelpScreen";
import ChatScreen from "./ChatScreen";
import "./SupportWidget.css";

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
  };

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`support-fab ${isOpen ? "open" : ""}`}
      >
        {isOpen ? (
          <FiX size={24} className="support-fab-icon" />
        ) : (
          <BiSupport size={26} className="support-fab-icon" />
        )}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="support-panel-wrapper">
          <div className="support-panel">
            {/* Close button inside panel */}
            <button
              onClick={() => setIsOpen(false)}
              className="support-close-btn"
            >
              <FiX size={16} />
            </button>

            {showChat ? (
              <ChatScreen onBack={handleBackFromChat} />
            ) : (
              <>
                <div className="support-content">
                  {activeTab === "home" && (
                    <HomeScreen onStartChat={handleStartChat} />
                  )}
                  {activeTab === "messages" && (
                    <MessagesScreen onStartChat={handleStartChat} />
                  )}
                  {activeTab === "help" && <HelpScreen />}
                </div>
                <BottomNav active={activeTab} setActive={setActiveTab} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
