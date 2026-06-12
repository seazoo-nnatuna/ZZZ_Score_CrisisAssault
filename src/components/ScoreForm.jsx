import React from 'react';

export default function ScoreForm({ 
  score, setScore, rank, setRank, handleImageChange, imagePreview, handleSave, isSubmitting, isLoading, currentRecordId 
}) {
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="w-full max-w-[300px] space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="w-16 text-left text-sm font-bold text-gray-400">スコア</span>
            <input 
              type="number" 
              value={score} 
              onChange={(e) => setScore(e.target.value)} 
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-right text-lg text-white font-bold focus:outline-none focus:border-[#ffe800] transition-colors" 
              placeholder="0" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="w-16 text-left text-sm font-bold text-gray-400">順位</span>
            <div className="flex-1 flex items-center gap-2">
              <input 
                type="number" 
                step="0.1" 
                value={rank} 
                onChange={(e) => setRank(e.target.value)} 
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-right text-lg text-white font-bold focus:outline-none focus:border-[#ffe800] transition-colors" 
                placeholder="0.0" 
              />
              <span className="font-bold text-gray-400">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-gray-400 font-bold text-sm whitespace-nowrap mr-2">画像</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full text-xs text-gray-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#333] file:text-white file:font-bold hover:file:bg-[#444] cursor-pointer" 
            />
          </div>

        </div>
      </div>

      {/* 点線の画像プレビュー領域 */}
      <div className="border border-dashed border-[#555] rounded-xl min-h-[250px] flex items-center justify-center p-2 mb-6 bg-[#1a1a1a] overflow-hidden relative">
        {imagePreview ? (
          <img src={imagePreview} alt="リザルトプレビュー" className="max-w-full max-h-[300px] object-contain rounded-lg shadow-black/50 shadow-inner" />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-lg font-bold mb-2">NO IMAGE</div>
            <div className="text-xs font-bold text-gray-600">
              クリップボードから画像をペースト <br />
              <span className="inline-block mt-1 bg-[#333] px-2 py-1 rounded text-white font-mono">Ctrl + V</span>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleSave} 
        disabled={isSubmitting || isLoading} 
        className={`w-full py-4 rounded-xl text-black text-lg font-black tracking-widest transition-all ${
          isSubmitting || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#ffe800] hover:bg-[#ffdf00] active:scale-[0.98] shadow-lg shadow-[#ffe800]/20'
        }`}
      >
        {isSubmitting ? 'UPLOADING...' : currentRecordId ? 'データを更新' : 'データを保存'}
      </button>
    </>
  );
}