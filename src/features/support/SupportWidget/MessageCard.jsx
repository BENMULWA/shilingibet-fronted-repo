import { MdSend } from "react-icons/md";

export default function MessageCard({ onStartChat }) {
  return (
    <div onClick={onStartChat} className="message-card">
      <div>
        <p className="message-card-title">Send us a message</p>
        <p className="message-card-subtitle">
          We typically reply in under 2 minutes
        </p>
      </div>
      <div className="message-card-icon">
        <MdSend size={18} />
      </div>
    </div>
  );
}
