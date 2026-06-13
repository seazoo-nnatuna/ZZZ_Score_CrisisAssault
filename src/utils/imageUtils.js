import imageCompression from 'browser-image-compression';
import { createWorker } from 'tesseract.js';

// 画像を圧縮する関数
export const compressImage = async (file) => {
  const options = { maxSizeMB: 1.0, maxWidthOrHeight: 1280, useWebWorker: true };
  return await imageCompression(file, options);
};

// 画像からテキストを読み取る関数（OCR）
export const analyzeImageText = async (file) => {
  const worker = await createWorker('eng', 1);
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789.%',
  });
  
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
};

// テキストからスコアと順位を抽出する関数
export const extractScoreAndRank = (text) => {
  let extractedScore = '';
  let extractedRank = '';

  const scoreMatch = text.match(/\b(1[0-9]{5}|[1-9][0-9]{4})\b/);
  if (scoreMatch) extractedScore = scoreMatch[0];

  const rankMatch = text.match(/([0-9]{1,2}\.[0-9]{1,2})/);
  if (rankMatch) {
    const parsedRank = parseFloat(rankMatch[1]);
    if (parsedRank > 0 && parsedRank <= 100) {
      extractedRank = rankMatch[1];
    }
  }

  return { score: extractedScore, rank: extractedRank };
};
