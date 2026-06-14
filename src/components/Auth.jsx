import React from 'react';

export default function Auth({ handleAuth, isSignUp, setIsSignUp }) {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 relative z-10">
      
      {/* ガラス状のログインパネル */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#333] rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        <h2 className="text-2xl lg:text-3xl font-black text-white text-center tracking-widest mb-8 drop-shadow-md">
          {isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
        </h2>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          {/* メールアドレス入力 */}
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 tracking-widest">EMAIL</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-black/50 border border-[#444] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#ffe800] transition-colors shadow-inner" 
              placeholder="user@example.com" 
            />
          </div>
          
          {/* パスワード入力 */}
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 tracking-widest">PASSWORD</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-black/50 border border-[#444] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#ffe800] transition-colors shadow-inner" 
              placeholder="••••••••" 
            />
          </div>
          
          {/* アクションボタン */}
          <button 
            type="submit" 
            className="w-full bg-[#ffe800] hover:bg-[#ffdf00] text-black font-black tracking-widest text-lg py-4 rounded-xl mt-4 transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,232,0,0.2)]"
          >
            {isSignUp ? '新規登録' : 'ログイン'}
          </button>
        </form>

        {/* モード切り替え */}
        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-gray-400 hover:text-white text-sm font-bold tracking-wider transition-colors border-b border-transparent hover:border-white pb-1"
          >
            {isSignUp ? '既にアカウントをお持ちの方はこちら' : '新規登録はこちら'}
          </button>
        </div>

      </div>
    </div>
  );
}