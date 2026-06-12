import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { compressImage, analyzeImageText, extractScoreAndRank } from './utils/imageUtils';

// 作成した4つのコンポーネントをインポート
import HeaderTabs from './components/HeaderTabs';
import ScoreSummary from './components/ScoreSummary';
import SeasonNav from './components/SeasonNav';
import ScoreForm from './components/ScoreForm';

export default function App() {
  // ------------------------------------
  // ▼ 状態管理（State）
  // ------------------------------------
  const [activeMode, setActiveMode] = useState('危局強襲');
  const [currentSeason, setCurrentSeason] = useState(38);
  
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [allScoresOfMode, setAllScoresOfMode] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------------------------
  // ▼ ロジック・処理関数
  // ------------------------------------
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

  // 【新規】画像ファイルを処理するコア機能（選択時とペースト時で共通で使う）
  const processImageFile = async (file) => {
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));

      console.log('画像解析を開始します...');
      const text = await analyzeImageText(file);
      
      const extracted = extractScoreAndRank(text);
      if (extracted.score) setScore(extracted.score);
      if (extracted.rank) setRank(extracted.rank);
      
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));

      console.log('画像解析を開始します...');
      const text = await analyzeImageText(file);
      
      const extracted = extractScoreAndRank(text);
      if (extracted.score) setScore(extracted.score);
      if (extracted.rank) setRank(extracted.rank);
      
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  // 【新規】画面上で「Ctrl+V (ペースト)」されたときの処理
  useEffect(() => {
    const handlePaste = (e) => {
      // クリップボードのデータからアイテムを取得
      const items = e.clipboardData?.items;
      if (!items) return;

      // アイテムの中に画像が含まれているか探す
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          processImageFile(file); // 見つけたら共通処理へ渡す
          e.preventDefault(); // デフォルトのペースト動作を防ぐ
          break; // 1枚見つけたら終了
        }
      }
    };

    // 画面全体(window)にペーストの監視を追加
    window.addEventListener('paste', handlePaste);
    
    // コンポーネントが破棄される時に監視を解除
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleSave = async () => {
    if (!score || !rank) return alert("スコアと順位を入力してください。");
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = imagePreview;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const safeModeName = activeMode === '危局強襲' ? 'kikyoku' : 'gekihen';
        const fileName = `${Date.now()}_${safeModeName}_${currentSeason}.${fileExt}`;
        const filePath = `results/${fileName}`;

        await supabase.storage.from('results').upload(filePath, imageFile);
        const { data: urlData } = supabase.storage.from('results').getPublicUrl(filePath);
        finalImageUrl = urlData.publicUrl;
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------
  // ▼ 画面の表示（UI）
  // ------------------------------------
  return (
    // bg-white を bg-[#111] に、text-gray-800 を text-gray-100 に変更しています
    <div className="max-w-md mx-auto p-4 bg-[#111111] min-h-screen text-gray-100 font-sans select-none">
      <HeaderTabs activeMode={activeMode} setActiveMode={setActiveMode} />
      <ScoreSummary highestRecord={highestRecord} averageScore={averageScore} averageRank={averageRank} />
      <SeasonNav currentSeason={currentSeason} setCurrentSeason={setCurrentSeason} />
      <ScoreForm 
        score={score} setScore={setScore} 
        rank={rank} setRank={setRank} 
        handleImageChange={handleImageChange} 
        imagePreview={imagePreview} 
        handleSave={handleSave} 
        isSubmitting={isSubmitting} isLoading={isLoading} currentRecordId={currentRecordId} 
      />
    </div>
  );
}