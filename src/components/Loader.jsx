export default function Loader() {
  return (
    <div className="flex items-center justify-center py-10 w-full" role="status" aria-label="Loading">
      <div className="relative w-12 h-12">
        {/* Background ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
        {/* Animated track */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin shadow-[0_0_15px_rgba(245,197,24,0.1)]"></div>
      </div>
    </div>
  );
}
