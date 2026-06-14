import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { compressImage, analyzeImageText, extractScoreAndRank } from './utils/imageUtils';

import HeaderTabs from './components/HeaderTabs';
import ScoreSummary from './components/ScoreSummary';
import SeasonNav from './components/SeasonNav';
import ScoreForm from './components/ScoreForm';

export default function App() {
  const [activeMode, setActiveMode] = useState('危局強襲');
  
  // モードごとの期を別々に管理する
  const [kikyokuSeason, setKikyokuSeason] = useState(38); // 危局強襲は初期値38
  const [gekihenSeason, setGekihenSeason] = useState(5);  // 激変ノードは初期値5

  // 現在のモードに応じて、表示する期を切り替える
  const currentSeason = activeMode === '危局強襲' ? kikyokuSeason : gekihenSeason;

  // 矢印ボタンが押された時、現在のモードの方だけ数字を更新する
  const setCurrentSeason = (updater) => {
    if (activeMode === '危局強襲') {
      setKikyokuSeason(updater);
    } else {
      setGekihenSeason(updater);
    }
  };
  
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [allScoresOfMode, setAllScoresOfMode] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchModeScores = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('critical_node_scores').select('*').eq('mode', activeMode);
    setAllScoresOfMode(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchModeScores(); }, [activeMode]);

  useEffect(() => {
    const targetRecord = allScoresOfMode.find(r => r.season === currentSeason);
    if (targetRecord) {
      setCurrentRecordId(targetRecord.id);
      setScore(targetRecord.score.toString());
      setRank(targetRecord.rank_percentage.toString());
      setImagePreview(targetRecord.image_url);
      setImageFile(null);
    } else {
      setCurrentRecordId(null);
      setScore('');
      setRank('');
      setImagePreview(null);
      setImageFile(null);
    }
  }, [currentSeason, allScoresOfMode]);

  const highestRecord = allScoresOfMode.length > 0 ? allScoresOfMode.reduce((max, r) => r.score > max.score ? r : max, allScoresOfMode[0]) : null;
  const averageScore = allScoresOfMode.length > 0 ? Math.round(allScoresOfMode.reduce((sum, r) => sum + r.score, 0) / allScoresOfMode.length) : 0;
  const averageRank = allScoresOfMode.length > 0 ? (allScoresOfMode.reduce((sum, r) => sum + r.rank_percentage, 0) / allScoresOfMode.length).toFixed(1) : "0.0";

  const processImageFile = async (file) => {
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      console.log('画像解析を開始します...');
      const text = await analyzeImageText(file);
      // ==========================================
      // F12のコンソールにOCRの解析結果を丸ごと表示する
      // ==========================================
      console.log('--- OCR解析テキスト ここから ---');
      console.log(text);
      console.log('--- OCR解析テキスト ここまで ---');
      // ==========================================
      const extracted = extractScoreAndRank(text);
      if (extracted.score) setScore(extracted.score);
      if (extracted.rank) setRank(extracted.rank);
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  const handleImageChange = (e) => {
    processImageFile(e.target.files[0]);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          processImageFile(file);
          e.preventDefault();
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleSave = async () => {
    if (!score || !rank) return alert("スコアと順位を入力してください。");
    setIsSubmitting(true);
    
    try {
      // 【追加】現在のDBに登録されている古いデータ（画像URL）を取得しておく
      const targetRecord = allScoresOfMode.find(r => r.season === currentSeason);
      const oldImageUrl = targetRecord ? targetRecord.image_url : null;

      let finalImageUrl = imagePreview;

      // 1. 新しい画像がセットされている場合はストレージにアップロード
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const safeModeName = activeMode === '危局強襲' ? 'kikyoku' : 'gekihen';
        const fileName = `${Date.now()}_${safeModeName}_${currentSeason}.${fileExt}`;
        const filePath = `results/${fileName}`;

        await supabase.storage.from('results').upload(filePath, imageFile);
        const { data: urlData } = supabase.storage.from('results').getPublicUrl(filePath);
        finalImageUrl = urlData.publicUrl;
      }

      // 【追加】2. 古い画像をストレージから削除する処理（お掃除機能）
      // 「以前の画像が存在する」かつ「今回の最終的なURLと違う（クリアされた or 別の画像になった）」場合
      if (oldImageUrl && oldImageUrl !== finalImageUrl) {
        // public URLからストレージ内のファイルパスだけを抽出する
        // 例: https://.../public/results/results/filename.jpg -> results/filename.jpg
        const urlParts = oldImageUrl.split('/public/results/');
        if (urlParts.length === 2) {
          const oldFilePath = decodeURIComponent(urlParts[1]); // 日本語名などの文字化け対策
          await supabase.storage.from('results').remove([oldFilePath]); // ストレージから物理削除
          console.log('古い画像をストレージから削除しました:', oldFilePath);
        }
      }

      // 3. データベースの更新または新規追加
      const payload = { mode: activeMode, season: currentSeason, score: parseInt(score, 10), rank_percentage: parseFloat(rank), image_url: finalImageUrl };

      if (currentRecordId) {
        await supabase.from('critical_node_scores').update(payload).eq('id', currentRecordId);
      } else {
        await supabase.from('critical_node_scores').insert([payload]);
      }

      alert(`第 ${currentSeason} 期 のデータを保存しました！`);
      await fetchModeScores();
    } catch (err) {
      console.error('保存エラー:', err.message);
      alert('エラーが発生しました: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ▼ ここから下がレイアウトの要（かなめ）です
  return (
    <div className="bg-[#050505] min-h-screen w-full flex justify-center items-start text-white font-sans select-none lg:p-8">
      
      <div className="w-full max-w-[450px] lg:max-w-5xl bg-[#111111] min-h-screen lg:min-h-fit lg:rounded-3xl border-x lg:border border-[#333] shadow-2xl p-4 sm:p-5 lg:p-8">

        <HeaderTabs activeMode={activeMode} setActiveMode={setActiveMode} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-6 lg:mt-8">
          {/* 左カラム：スコアサマリー ＆ 期の切り替え */}
          <div className="flex flex-col gap-4">
            <ScoreSummary highestRecord={highestRecord} averageScore={averageScore} averageRank={averageRank} />
            <SeasonNav currentSeason={currentSeason} setCurrentSeason={setCurrentSeason} />
            
            <div className="hidden lg:flex flex-1 items-center justify-center border border-dashed border-[#333] rounded-2xl bg-[#151515] text-[#444] font-bold tracking-widest mt-2 p-8">
              DATA MANAGEMENT CONSOLE
            </div>
          </div>

          {/* 右カラム：データ入力フォーム */}
          <div className="flex flex-col h-full">
            <ScoreForm 
              score={score} setScore={setScore} 
              rank={rank} setRank={setRank} 
              handleImageChange={handleImageChange} 
              handleSave={handleSave} 
              isSubmitting={isSubmitting} isLoading={isLoading} currentRecordId={currentRecordId} 
            />
          </div>
        </div>

        {/* 全幅の画像プレビューエリア */}
        <div className="mt-8 border border-dashed border-[#555] rounded-2xl min-h-[250px] lg:min-h-[400px] flex items-center justify-center p-4 bg-[#111] overflow-hidden relative">
          {imagePreview ? (
            // 【1. 追加】親要素に `group` クラスを追加してホバー状態を検知できるようにする
            <div className="relative group">
              <img src={imagePreview} alt="リザルトプレビュー" className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl shadow-black" />
              
              {/* 【2. 追加】opacity-100 lg:opacity-0 lg:group-hover:opacity-100 を追加 */}
              <button 
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 lg:top-4 lg:right-4 bg-black/70 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 active:scale-95 border border-[#333] hover:border-red-500"
              >
                ✕ 画像をクリア
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-xl font-bold mb-3 text-white tracking-widest">NO IMAGE</div>
              <div className="text-sm font-bold text-gray-500">
                クリップボードから画像をペースト <br />
                <span className="inline-block mt-3 bg-[#222] px-3 py-1.5 rounded text-gray-300 font-mono border border-[#444] shadow-inner">Ctrl + V</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}