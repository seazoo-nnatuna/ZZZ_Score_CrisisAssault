import React from 'react';

export default function SeasonNav({ currentSeason, setCurrentSeason }) {
  return (
    <div className="flex items-center justify-center gap-6 mb-6">
      <button 
        onClick={() => setCurrentSeason(prev => Math.max(1, prev - 1))} 
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#222] border border-[#444] text-gray-300 hover:text-white hover:bg-[#333] active:scale-95 transition-all"
      >
        ◀
      </button>
      <div className="text-xl font-bold text-white tracking-widest">
        第 {currentSeason} 期
      </div>
      <button 
        onClick={() => setCurrentSeason(prev => prev + 1)} 
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#222] border border-[#444] text-gray-300 hover:text-white hover:bg-[#333] active:scale-95 transition-all"
      >
        ▶
      </button>
    </div>
  );
}