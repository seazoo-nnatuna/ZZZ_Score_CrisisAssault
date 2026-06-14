import React from 'react';

export default function HeaderTabs({ activeMode, setActiveMode }) {
  return (
    <div className="flex px-4 items-end relative z-10 -mb-1">
      <button 
        onClick={() => setActiveMode('危局強襲')} 
        className={`w-1/2 rounded-t-2xl font-black tracking-widest transition-all duration-200 ${
          activeMode === '危局強襲' 
            ? 'bg-[#ffe800] text-black h-14 shadow-md z-10' 
            : 'bg-[#0a0a0a] text-gray-500 h-11 shadow-inner border border-[#111] hover:text-gray-300'
        }`}
      >
        危局強襲
      </button>
      <button 
        onClick={() => setActiveMode('激変ノード')} 
        className={`w-1/2 rounded-t-2xl font-black tracking-widest transition-all duration-200 ${
          activeMode === '激変ノード' 
            ? 'bg-[#ffe800] text-black h-14 shadow-md z-10' 
            : 'bg-[#0a0a0a] text-gray-500 h-11 shadow-inner border border-[#111] hover:text-gray-300'
        }`}
      >
        激変ノード
      </button>
    </div>
  );
}