export default function ChatFooterLinks({ onOpenRules }) {
  return (
    <div className="flex justify-between text-xs px-5 py-2 text-[#b7c4ba]  bg-secondary border-t border-primary/10">
      <h3
        onClick={onOpenRules}
        className="text-xs font-semibold cursor-pointer"
      >
        Chat Rules
      </h3>
    </div>
  );
}
