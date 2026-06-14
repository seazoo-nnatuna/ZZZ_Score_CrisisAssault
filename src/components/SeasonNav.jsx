import React from 'react';

export default function SeasonNav({ currentSeason, setCurrentSeason }) {
  return (
    <div className="flex items-center justify-center gap-6 py-2">
      <button 
        onClick={() => setCurrentSeason(prev => Math.max(1, prev - 1))} 
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white active:scale-95 transition-all shadow-md"
      >
        ◀
      </button>
      <div className="text-xl font-bold text-white tracking-widest">
        第 {currentSeason} 期
      </div>
      <button 
        onClick={() => setCurrentSeason(prev => prev + 1)} 
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white active:scale-95 transition-all shadow-md"
      >
        ▶
      </button>
    </div>
  );
}