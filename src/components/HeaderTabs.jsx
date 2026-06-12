import React from 'react';

export default function HeaderTabs({ activeMode, setActiveMode }) {
  return (
    <div className="flex bg-[#1a1a1a] rounded-2xl p-1.5 mb-6 border border-[#333] shadow-inner">
      <button 
        onClick={() => setActiveMode('危局強襲')} 
        className={`flex-1 py-4 text-lg font-black rounded-xl transition-all duration-200 ${
          activeMode === '危局強襲' ? 'bg-[#ffe800] text-black shadow-md scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
        }`}
      >
        危局強襲
      </button>
      <button 
        onClick={() => setActiveMode('激変ノード')} 
        className={`flex-1 py-4 text-lg font-black rounded-xl transition-all duration-200 ${
          activeMode === '激変ノード' ? 'bg-[#ffe800] text-black shadow-md scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
        }`}
      >
        激変ノード
      </button>
    </div>
  );
}