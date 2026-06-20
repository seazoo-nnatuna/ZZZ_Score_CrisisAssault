import React, { useState } from 'react';

export default function ResetPassword({ handlePasswordReset }) {
  const [newPassword, setNewPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) return;
    handlePasswordReset(newPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 relative z-10">
      <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#333] rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        <h2 className="text-2xl lg:text-3xl font-black text-white text-center tracking-widest mb-8 drop-shadow-md">
          RESET PASSWORD
        </h2>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 tracking-widest">NEW PASSWORD</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
              className="w-full bg-black/50 border border-[#444] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#ffe800] transition-colors shadow-inner" 
              placeholder="新しいパスワードを入力" 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#ffe800] hover:bg-[#ffdf00] text-black font-black tracking-widest text-lg py-4 rounded-xl mt-4 transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,232,0,0.2)]"
          >
            パスワードを更新する
          </button>
        </form>

      </div>
    </div>
  );
}