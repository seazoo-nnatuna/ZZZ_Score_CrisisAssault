import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { compressImage, analyzeImageText, extractScoreAndRank } from './utils/imageUtils';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';

import HeaderTabs from './components/HeaderTabs';
import ScoreSummary from './components/ScoreSummary';
import SeasonNav from './components/SeasonNav';
import ScoreForm from './components/ScoreForm';
import ResetPassword from './components/ResetPassword';


export default function App() {
  // ▼ コンポーネントの先頭で useAuth を呼び出す
  const { session, isSignUp, setIsSignUp, handleAuth, handleSignOut } = useAuth();
  const { session, isSignUp, setIsSignUp, isRecovery, handleAuth, handleSignOut, handlePasswordReset } = useAuth();
  const [activeMode, setActiveMode] = useState('危局強襲');
  
  // モードごとの期を別々に管理する
  const [kikyokuSeason, setKikyokuSeason] = useState(38); // 危局強襲は初期値38
  const [gekihenSeason, setGekihenSeason] = useState(11);  // 激変ノードは初期値5

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


  // ▼ 【新規追加】リカバリーモードの時はパスワード再設定画面を表示
  if (isRecovery) {
    return (
      <div className="relative bg-[#050505] min-h-screen w-full flex justify-center items-center text-white font-sans select-none">
        <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-top opacity-30" style={{ backgroundImage: "url('https://[あなたのプロジェクトID].supabase.co/storage/v1/object/public/[バケット名]/main_bg.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
        </div>
        <ResetPassword handlePasswordReset={handlePasswordReset} />
      </div>
    );
  }

  // ▼ return の直前で、session が無い場合（未ログイン時）の画面を返すようにする
  if (!session) {
    return (
      <div className="relative bg-[#050505] min-h-screen w-full flex justify-center items-center text-white font-sans select-none">
        {/* 背景グラデーション（ログイン画面でも表示するとカッコいいです） */}
        <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-top opacity-30" style={{ backgroundImage: "url('https://[あなたのプロジェクトID].supabase.co/storage/v1/object/public/[バケット名]/main_bg.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
        </div>
        
        {/* ログインコンポーネントの呼び出し */}
        <Auth handleAuth={handleAuth} isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
      </div>
    );
  }

  // ▼ ここから下がレイアウトの要（かなめ）です
  return (
    // 一番外側の枠に `relative` を追加して、背景の基準にします
    <div className="relative bg-[#050505] min-h-screen w-full flex justify-center items-start text-white font-sans select-none lg:p-8">

      {/* 【新規】ログアウトボタン（右上に固定配置） */}
      <button 
        onClick={handleSignOut}
        className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-[#333] hover:border-red-500 backdrop-blur-md transition-all active:scale-95 tracking-widest"
      >
        LOGOUT
      </button>

      {/* ========================================== */}
      {/* 【新規】背後に敷く、グラデーションで消えるメイン背景 */}
      {/* ========================================== */}
      <div className="absolute top-0 left-0 w-full h-[400px] lg:h-[600px] z-0 pointer-events-none overflow-hidden">
        {/* 背景画像本体（ここにSupabaseの画像URLを入れます。opacityで少し暗くしています） */}
        <div 
          className="absolute inset-0 bg-cover bg-top opacity-50"
          style={{ backgroundImage: "url('https://jpchrhxnvjampvfvmpkc.supabase.co/storage/v1/object/public/results/BackGround/bg02.jpeg')" }}
        ></div>
        
        {/* 下に向かって背景色(#050505)に溶け込む魔法のグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]"></div>
      </div>
      {/* ========================================== */}

      {/* メインのコンテンツ枠（z-10 と relative を付けて、背景よりも手前に配置します） */}
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl bg-transparent min-h-screen lg:min-h-fit p-4 sm:p-5 flex flex-col gap-4 lg:gap-8">

        {/* ① レイヤー1：凸凹タブ ＆ サマリー */}
        <div className="w-full">
          <HeaderTabs activeMode={activeMode} setActiveMode={setActiveMode} />
          <ScoreSummary highestRecord={highestRecord} averageScore={averageScore} averageRank={averageRank} activeMode={activeMode} />
        </div>

        {/* ② ＆ ③：期ナビゲーションと入力パネルの間隔を狭めるためにグループ化 */}
        <div className="w-full flex flex-col gap-1 lg:gap-2">
          
          {/* ② レイヤー2：期の切り替え */}
          <div className="flex justify-center z-10">
            <SeasonNav currentSeason={currentSeason} setCurrentSeason={setCurrentSeason} />
          </div>

          {/* ③ レイヤー3：データ入力とプレビューの統合パネル */}
          <ScoreForm 
            score={score} setScore={setScore} 
            rank={rank} setRank={setRank} 
            handleImageChange={handleImageChange} 
            handleSave={handleSave} 
            isSubmitting={isSubmitting} isLoading={isLoading} currentRecordId={currentRecordId} 
            imagePreview={imagePreview} setImagePreview={setImagePreview} setImageFile={setImageFile}
          />
          
        </div>

      </div>
    </div>
  );
}