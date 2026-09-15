import { ChevronRight } from "lucide-react";
import { BiMessageDetail } from "react-icons/bi";

export default function MessagesScreen({ onStartChat }) {
  return (
    <div className="messages-screen">
      <h2 className="messages-title">Messages</h2>

      <div className="messages-empty">
        <div className="messages-empty-content">
          <BiMessageDetail size={40} className="messages-empty-icon" />
          <p>No messages yet</p>
          <p className="messages-empty-subtitle">Start a conversation with our support team</p>
        </div>
      </div>

      <div className="messages-cta">
        <button onClick={onStartChat} className="messages-cta-btn">
          Start a conversation <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
