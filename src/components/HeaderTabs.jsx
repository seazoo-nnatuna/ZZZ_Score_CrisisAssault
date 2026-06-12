import React from 'react';

export default function HeaderTabs({ activeMode, setActiveMode }) {
  return (
    // 黒いカプセル状の背景
    <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-6 border border-[#333]">
      <button 
        onClick={() => setActiveMode('危局強襲')} 
        className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${
          activeMode === '危局強襲' ? 'bg-[#ffe800] text-black shadow-md' : 'text-gray-400 hover:text-white'
        }`}
      >
        危局強襲
      </button>
      <button 
        onClick={() => setActiveMode('激変ノード')} 
        className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${
          activeMode === '激変ノード' ? 'bg-[#ffe800] text-black shadow-md' : 'text-gray-400 hover:text-white'
        }`}
      >
        激変ノード
      </button>
    </div>
  );
}