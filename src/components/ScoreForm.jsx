import React from 'react';

export default function ScoreForm({ 
  score, setScore, rank, setRank, handleImageChange, imagePreview, handleSave, isSubmitting, isLoading, currentRecordId 
}) {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] shadow-lg mb-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-full space-y-4">
          
          <div className="flex items-center justify-between bg-[#222] p-3 rounded-xl border border-[#444] focus-within:border-[#ffe800] transition-colors">
            <span className="w-16 text-left text-sm font-bold text-[#ffe800]">スコア</span>
            <input 
              type="number" 
              value={score} 
              onChange={(e) => setScore(e.target.value)} 
              className="flex-1 bg-transparent px-2 text-right text-2xl text-white font-black focus:outline-none placeholder-gray-600" 
              placeholder="0" 
            />
          </div>
          
          <div className="flex items-center justify-between bg-[#222] p-3 rounded-xl border border-[#444] focus-within:border-[#ffe800] transition-colors">
            <span className="w-16 text-left text-sm font-bold text-[#ffe800]">順位</span>
            <div className="flex-1 flex items-center gap-2">
              <input 
                type="number" 
                step="0.1" 
                value={rank} 
                onChange={(e) => setRank(e.target.value)} 
                className="w-full bg-transparent px-2 text-right text-2xl text-white font-black focus:outline-none placeholder-gray-600" 
                placeholder="0.0" 
              />
              <span className="font-bold text-gray-400 text-xl">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-gray-300 font-bold text-sm whitespace-nowrap mr-2">画像</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full text-xs text-gray-300 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#333] file:text-white file:font-bold hover:file:bg-[#444] cursor-pointer transition-colors" 
            />
          </div>

        </div>
      </div>

      <div className="border border-dashed border-[#666] rounded-xl min-h-[200px] flex items-center justify-center p-2 mb-6 bg-[#111] overflow-hidden relative">
        {imagePreview ? (
          <img src={imagePreview} alt="リザルトプレビュー" className="max-w-full max-h-[250px] object-contain rounded-lg shadow-black/50 shadow-inner" />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-lg font-bold mb-2 text-white">NO IMAGE</div>
            <div className="text-xs font-bold text-gray-500">
              クリップボードから画像をペースト <br />
              <span className="inline-block mt-2 bg-[#333] px-2 py-1 rounded text-gray-200 font-mono border border-[#444]">Ctrl + V</span>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleSave} 
        disabled={isSubmitting || isLoading} 
        className={`w-full py-4 rounded-xl text-black text-lg font-black tracking-widest transition-all ${
          isSubmitting || isLoading ? 'bg-gray-500 cursor-not-allowed text-gray-300' : 'bg-[#ffe800] hover:bg-[#ffdf00] active:scale-[0.98] shadow-[0_0_15px_rgba(255,232,0,0.2)]'
        }`}
      >
        {isSubmitting ? 'UPLOADING...' : currentRecordId ? 'データを更新' : 'データを保存'}
      </button>
    </div>
  );
}