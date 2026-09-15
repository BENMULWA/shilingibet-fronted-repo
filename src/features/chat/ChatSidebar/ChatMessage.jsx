export default function ChatMessage({ avatar, user, time, text }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      {/* Avatar */}
      <img
        src={avatar || "https://ke-game.sirv.com/tower/av-18.png"}
        className="w-8 h-8 rounded-full"
        alt={user}
      />

      {/* Username + Message */}
      <div className="flex flex-col max-w-[80%]">
        {/* Username + Time */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-primary">{user}</span>

          <span className="text-xs text-[#b7c4ba]">{time}</span>
        </div>

        {/* Message Bubble */}
        <div className="inline-block w-fit bg-secondary text-sm text-[#b7c4ba] px-4 py-2 rounded-sm mt-1">
          {text}
        </div>
      </div>
    </div>
  );
}
