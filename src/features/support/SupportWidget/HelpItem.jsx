import { useState } from "react";

export default function HelpItem({ label, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="help-item-wrapper">
      <div className="help-item" onClick={() => setIsOpen(!isOpen)}>
        <p className="help-item-label">{label}</p>
        <span className={`help-item-arrow ${isOpen ? "open" : ""}`}>›</span>
      </div>
      {isOpen && answer && (
        <div className="help-item-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
