import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiArrowLeft } from 'react-icons/fi';

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-center px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FiClock className="text-primary text-5xl animate-pulse" />
      </div>
      
      <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Sports Betting
      </h1>
      <div className="inline-block bg-primary text-black font-black text-sm px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
        Coming Soon
      </div>
      
      <p className="text-gray-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
        We are working hard to bring you the best sports betting experience. Stay tuned for exciting matches, live odds, and massive payouts!
      </p>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white bg-surface hover:bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold transition-colors"
      >
        <FiArrowLeft /> Go Back
      </button>
    </div>
  );
}
