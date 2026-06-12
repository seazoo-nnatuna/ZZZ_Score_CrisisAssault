import React from 'react';

export default function ScoreSummary({ highestRecord, averageScore, averageRank }) {
  return (
    <div className="bg-[#222222] p-5 rounded-xl border border-[#333] mb-6 shadow-lg">
      <h2 className="text-xs font-bold text-gray-400 mb-3 text-center tracking-widest">SCORE SUMMARY</h2>
      
      <div className="flex gap-4">
        {/* 最高スコア */}
        <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-xs font-bold text-gray-500 mb-1">最高スコア</span>
          <div className="text-2xl font-black tracking-tight text-white">
            {highestRecord ? highestRecord.score.toLocaleString() : 0}
          </div>
          {/* 水色のパーセンテージバッジ（少し斜めにする演出） */}
          <div className="mt-2 bg-[#38bdf8] text-black text-[11px] font-extrabold px-2 py-0.5 rounded-sm transform -skew-x-6">
            <span className="transform skew-x-6 inline-block">
              TOP {highestRecord ? highestRecord.rank_percentage : 0}%
            </span>
          </div>
        </div>
        
        {/* 平均スコア */}
        <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-xs font-bold text-gray-500 mb-1">平均スコア</span>
          <div className="text-2xl font-black tracking-tight text-gray-300">
            {averageScore.toLocaleString()}
          </div>
          <div className="mt-2 bg-gray-700 text-gray-300 text-[11px] font-extrabold px-2 py-0.5 rounded-sm transform -skew-x-6">
            <span className="transform skew-x-6 inline-block">
              AVE {averageRank}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}