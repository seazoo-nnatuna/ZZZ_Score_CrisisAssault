import React from 'react';

export default function ScoreForm({ 
  score, setScore, rank, setRank, handleImageChange, handleSave, isSubmitting, isLoading, currentRecordId, imagePreview, setImagePreview, setImageFile
}) {
  return (
    <div className="bg-[#1a1a1a] border-[6px] border-[#0a0a0a] rounded-[2.5rem] p-4 lg:p-6 shadow-2xl flex flex-col gap-4 relative z-0">
      
      {/* 上段：スコアと順位（ガラス状） */}
      <div className="grid grid-cols-2 gap-4">
        {/* スコア入力 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-lg flex flex-col justify-center transition-colors focus-within:border-[#ffe800]/50 focus-within:bg-white/15">
          <div className="text-gray-300 font-bold text-sm mb-1 tracking-widest drop-shadow-md">スコア</div>
          <input 
            type="number" 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            className="w-full bg-transparent text-white font-black text-2xl lg:text-3xl text-center focus:outline-none placeholder-white/20 drop-shadow-md" 
            placeholder="0" 
          />
        </div>
        
        {/* 順位入力（％を追加） */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-lg flex flex-col justify-center transition-colors focus-within:border-[#ffe800]/50 focus-within:bg-white/15">
          <div className="text-gray-300 font-bold text-sm mb-1 tracking-widest drop-shadow-md">順位</div>
          {/* ↓ 入力欄と％を横並び(flex)にしてベースラインを揃える */}
          <div className="flex items-baseline justify-center gap-1 w-full">
            <input 
              type="number" 
              step="0.1" 
              value={rank} 
              onChange={(e) => setRank(e.target.value)} 
              // テキストを右寄せ(text-right)にして％に近づけ、幅を固定
              className="w-24 lg:w-28 bg-transparent text-white font-black text-2xl lg:text-3xl text-right focus:outline-none placeholder-white/20 drop-shadow-md" 
              placeholder="0.0" 
            />
            <span className="text-gray-300 font-bold text-lg lg:text-xl drop-shadow-md">%</span>
          </div>
        </div>
      </div>

      {/* 中段：ファイル選択と保存ボタン */}
      <div className="flex justify-between items-center px-1 mt-2">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="w-1/2 text-xs text-transparent file:mr-2 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-[#333] file:text-white file:font-bold hover:file:bg-[#555] cursor-pointer transition-colors" 
        />
        <button 
          onClick={handleSave} 
          disabled={isSubmitting || isLoading} 
          className={`px-8 py-3 rounded-xl text-black font-black tracking-widest transition-all ${
            isSubmitting || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#ffe800] hover:bg-[#ffdf00] active:scale-[0.98] shadow-lg'
          }`}
        >
          {isSubmitting ? '処理中...' : currentRecordId ? '更新' : '保存'}
        </button>
      </div>

      {/* 下段：プレビューエリア（白い下地を削除し、透明に） */}
      <div className={`w-full min-h-[300px] lg:min-h-[450px] flex items-center justify-center p-2 relative group mt-2 rounded-[1.5rem] transition-all ${
        !imagePreview ? 'border-2 border-dashed border-[#444] bg-black/20' : 'bg-transparent'
      }`}>
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="プレビュー" className="max-w-full max-h-[350px] lg:max-h-[600px] object-contain rounded-xl drop-shadow-2xl" />
            <button 
              onClick={() => { setImagePreview(null); setImageFile(null); }}
              className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
            >
              ✕ クリア
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-black mb-2 tracking-widest text-[#555]">NO IMAGE</div>
            <div className="text-xs font-bold text-[#444]">Ctrl + V で画像をペースト</div>
          </div>
        )}
      </div>

    </div>
  );
}