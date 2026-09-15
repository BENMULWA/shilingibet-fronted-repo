import { useState } from "react";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useChatContext } from "../../../context/ChatProvider";

export default function ChatInput() {
  const { sendMessage, emitTyping, emitStopTyping } = useChatContext();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
    emitStopTyping();
  };

  return (
    <div className="md:px-4 px-2 pt-3 pb-1 border-t border-white/5 bg-secondary md:pb6">
      <div className="flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            emitTyping();
          }}
          onBlur={emitStopTyping}
          placeholder="Enter a message"
          className="
            flex-1 bg-[#07110b] text-[#b7c4ba]
            placeholder:text-[#9cae9f]
            px-4 py-2 rounded-xl border border-[#262250]
            outline-none
          "
        />

        <button
          onClick={handleSend}
          className="
            w-10 h-10 rounded-xl bg-[#262250]
            flex items-center justify-center
            hover:brightness-125 transition
          "
        >
          <RiSendPlane2Fill className="text-primary text-xl cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
