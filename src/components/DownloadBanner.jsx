

import { useState } from "react";
import { toast } from "react-hot-toast";

export const BANNER_DISMISSED_KEY = "downloadBannerDismissed";

export default function DownloadBanner({
  title = "Get ShilingiBet App",
  href = "",
  sticky = true,
}) {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem(BANNER_DISMISSED_KEY) !== "true";
  });

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div className={`${sticky ? "sticky top-0 z-50" : ""} w-full md:hidden`}>
      <style>
        {`
          @keyframes bounce-arrow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          @keyframes bounce-icon {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-bounce-arrow {
            animation: bounce-arrow 1s ease-in-out infinite;
          }
          .animate-bounce-icon {
            animation: bounce-icon 1.5s ease-in-out infinite;
          }
          .shimmer-btn {
            background: linear-gradient(90deg, #f9ce36 0%, #ffe066 50%, #f9ce36 100%);
            background-size: 200% 100%;
            animation: shimmer 2s linear infinite;
          }
        `}
      </style>
      <div className="w-full bg-secondary border-b border-primary/20">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="p-1 text-[#75877a] hover:text-primary transition-colors"
            aria-label="Dismiss banner"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Title with Android icon */}
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-primary animate-bounce-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5765.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1286 1.0989L4.8491 5.4467a.4161.4161 0 00-.5765-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
            </svg>
            <span className="text-[#b7c4ba] font-medium text-sm">
              {title}
            </span>
          </div>

          {/* Animated Open button */}
          <a
            href={href}
            download
            onClick={(e) => {
              e.preventDefault();
              toast.success("Coming Soon!");
            }}
            className="flex items-center gap-1.5 rounded-full shimmer-btn px-4 py-1.5 hover:scale-105 transition-transform cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5 text-black animate-bounce-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="text-black font-semibold text-xs uppercase tracking-wide">
              Open
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
