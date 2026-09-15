import { ChevronRight } from "lucide-react";

export default function HelpCategory({ title, subtitle, count, highlighted }) {
  return (
    <div
      className={`py-3 px-2 rounded-lg border-b cursor-pointer ${
        highlighted ? "bg-green-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
          <p className="text-gray-400 text-xs mt-1">{count} articles</p>
        </div>

        <ChevronRight size={18} className="text-green-600" />
      </div>
    </div>
  );
}
