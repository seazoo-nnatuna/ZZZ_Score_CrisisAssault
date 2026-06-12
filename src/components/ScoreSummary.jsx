import React from 'react';

export default function ScoreSummary({ highestRecord, averageScore, averageRank }) {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] mb-6 shadow-lg">
      <h2 className="text-sm font-black text-[#ffe800] mb-4 text-center tracking-widest drop-shadow-md">SCORE</h2>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-400 mb-2">最高スコア</span>
          <div className="text-3xl font-black tracking-tight text-white mb-2">
            {highestRecord ? highestRecord.score.toLocaleString() : 0}
          </div>
          <div className="bg-[#38bdf8] text-black text-[12px] font-extrabold px-3 py-1 rounded-sm transform -skew-x-6">
            <span className="transform skew-x-6 inline-block">TOP {highestRecord ? highestRecord.rank_percentage : 0}%</span>
          </div>
        </div>
        
        <div className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-400 mb-2">平均スコア</span>
          <div className="text-3xl font-black tracking-tight text-white mb-2">
            {averageScore.toLocaleString()}
          </div>
          <div className="bg-gray-600 text-white text-[12px] font-extrabold px-3 py-1 rounded-sm transform -skew-x-6">
            <span className="transform skew-x-6 inline-block">AVE {averageRank}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}