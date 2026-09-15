import { FiX } from "react-icons/fi";

export default function ChatRulesModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[999]">
      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-surface border-b border-black/30">
          <h2 className="text-lg font-bold text-[#b7c4ba]">
            Chat Rules
          </h2>

          <button onClick={onClose}>
            <FiX className="text-xl text-[#b7c4ba] cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-3 bg-secondary text-[#b7c4ba] text-sm space-y-2 overflow-y-auto max-h-[55vh]">
          <ul className="space-y-2 list-disc pl-4">
            <li>No spamming</li>
            <li>No begging (Includes asking for rains)</li>
            <li>No advertising</li>
            <li>
              Zero tolerance for harassment (including racism, sexism, and other
              hate speech)
            </li>
            <li>No slandering website, staff, or other players</li>
            <li>No sharing of socials or personal info</li>
          </ul>
        </div>

        {/* Bottom Button */}
        <div className="py-4 bg-background flex justify-center">
          <button
            onClick={onClose}
            className="w-11/12 bg-primary text-black font-bold py-2 rounded-xl text-lg "
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
