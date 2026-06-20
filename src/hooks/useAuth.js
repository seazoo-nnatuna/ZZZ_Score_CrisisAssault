import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  // 【新規追加】パスワード再設定モードかどうかを判定するフラグ
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      // 【新規追加】リカバリー用のリンクから飛んできた場合の合図をキャッチ！
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) alert("登録失敗: " + error.message);
      else alert("確認メールを送りました（認証OFFならそのままログインできます）");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("ログイン失敗: " + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // 【新規追加】新しいパスワードを上書き保存する関数
  const handlePasswordReset = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert("パスワードの更新に失敗しました: " + error.message);
    } else {
      alert("パスワードが正常に更新されました！");
      setIsRecovery(false); // 更新が終わったらリカバリーモードを解除
    }
  };

  return {
    session,
    isSignUp,
    setIsSignUp,
    isRecovery,
    handleAuth,
    handleSignOut,
    handlePasswordReset
  };
};