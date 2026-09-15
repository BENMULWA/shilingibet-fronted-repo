import { Link } from "react-router-dom";

export default function AuthToggle() {
  return (
    <div className="flex gap-3 justify-center items-center">
      {/* Login Button */}
      <Link to="/login">
        <button className="group relative px-5 py-2 bg-transparent border-2 border-primary/60 text-[#d7e1d9] font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20">
          <span className="relative z-10">Login</span>
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </Link>
      {/* Register Button */}
      <Link to="/register">
        <button className="group relative px-5 py-2 bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_100%] text-black font-bold rounded-xl overflow-hidden shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95">
          <span className="relative z-10 flex items-center gap-1.5">
            Register
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        </button>
      </Link>
    </div>
  );
}
