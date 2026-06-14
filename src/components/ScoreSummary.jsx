import React from 'react';

export default function ScoreSummary({ highestRecord, averageScore, averageRank, activeMode }) {
  const roundedClass = activeMode === '危局強襲' ? 'rounded-tl-none' : 'rounded-tr-none';
  
  // ==========================================
  // 【重要】Supabaseの画像を直接読み込む設定
  // 以下のURLをご自身のSupabaseストレージの「Get URL」で取得したものに書き換えてください
  // ==========================================
  const kikyokuUrl = "https://jpchrhxnvjampvfvmpkc.supabase.co/storage/v1/object/public/results/banner/banner_01.avif";
  const gekihenUrl = "https://jpchrhxnvjampvfvmpkc.supabase.co/storage/v1/object/public/results/banner/banner_02.webp";

  // アクティブなタブに合わせてURLを切り替え
  const bgImage = activeMode === '危局強襲' ? `url('${kikyokuUrl}')` : `url('${gekihenUrl}')`;

  return (
    <div 
      className={`relative p-4 lg:p-6 border border-[#333] shadow-lg rounded-3xl ${roundedClass} z-0 overflow-hidden bg-cover bg-center transition-all duration-500`}
      style={{ backgroundImage: bgImage }}
    >
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

      <div className="grid grid-cols-2 gap-4 lg:gap-8 relative z-10">
        
        {/* ハイスコア */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-200 mb-1.5 tracking-widest drop-shadow-md">ハイスコア</span>
          <div className="w-full rounded-2xl py-4 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white">
            <span className="text-2xl lg:text-3xl font-black leading-none mb-1 drop-shadow-md">
              {highestRecord ? highestRecord.score.toLocaleString() : 0}
            </span>
            <span className="text-sm lg:text-base font-bold leading-none text-gray-200 drop-shadow-md">
              {highestRecord ? highestRecord.rank_percentage : 0} %
            </span>
          </div>
        </div>
        
        {/* 平均スコア */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-200 mb-1.5 tracking-widest drop-shadow-md">平均スコア</span>
          <div className="w-full rounded-2xl py-4 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white">
            <span className="text-2xl lg:text-3xl font-black leading-none mb-1 drop-shadow-md">
              {averageScore.toLocaleString()}
            </span>
            <span className="text-sm lg:text-base font-bold leading-none text-gray-200 drop-shadow-md">
              {averageRank} %
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}