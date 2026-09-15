import { FiSearch } from "react-icons/fi";
import HelpItem from "./HelpItem";

export default function SearchHelp() {
  return (
    <div className="bg-white text-black mx-4 rounded-lg p-4 mb-4 flex flex-col flex-1 overflow-hidden">
      {/* Search Bar (fixed) */}
      <div className="flex items-center bg-gray-100 justify-between mb-4 p-2 rounded-sm shrink-0">
        <p className="font-semibold">Search for help</p>
        <FiSearch size={18} className="text-gray-500" />
      </div>

      {/* Scrollable Items */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        <HelpItem label="Time Out, Self-Exclusion, and Account Deletion" />
        <HelpItem label="I Have Not Received My Withdrawal" />
        <HelpItem label="Rewards 2.0 Explained" />
        <HelpItem label="I Have Not Received My Crypto Deposit" />

        {/* More items */}
      </div>
    </div>
  );
}
