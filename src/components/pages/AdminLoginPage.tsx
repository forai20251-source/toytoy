import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles,
  HelpCircle,
  Users
} from 'lucide-react';
import { AdminUser } from '../../types';
import { loginAdminApi } from '../../lib/authService';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onCancel: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onCancel
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await loginAdminApi(username.trim(), password.trim());
    setIsLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'اطلاعات ورود نامعتبر است.');
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background soft blurs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10" dir="rtl">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 text-right">
          
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
              <span>بازگشت به سایت</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>احراز هویت دومرحله‌ای ادمین</span>
            </div>
          </div>

          <div className="space-y-2 text-center pt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-amber-500 dark:to-orange-500 flex items-center justify-center mx-auto text-white shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              ورود به پنل مدیریت توی‌لند
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              دسترسی به بخش‌های مدیریت، ویرایش محصولات، پادکست‌ها، دیدگاه‌ها و پیکربندی سیستم با رمز عبور و مجوز نقش کاربری محافظت می‌شود.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>نام کاربری (Username)</span>
              </label>
              <input
                id="admin-login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: admin یا store_manager"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-left dir-ltr"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>کلمه عبور (Password)</span>
              </label>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-left dir-ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>در حال بررسی اعتبار...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ورود ایمن به پنل مدیریت</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ورود سریع آزمایشی با نقش‌های مختلف:</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin')}
                className="text-right p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-amber-50/60 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>مدیر ارشد (Super Admin)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    نام کاربری: <code className="text-amber-600 font-bold">admin</code> • رمز: <code className="text-amber-600 font-bold">admin</code> (دسترسی کامل)
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">انتخاب</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('store_manager', '123')}
                className="text-right p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-amber-50/60 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>مدیر فروشگاه (Store Manager)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    نام کاربری: <code className="text-amber-600 font-bold">store_manager</code> • رمز: <code className="text-amber-600 font-bold">123</code> (محصولات و نظرات)
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">انتخاب</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('content_writer', '123')}
                className="text-right p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-amber-50/60 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>سردبیر محتوا و رادیو (Content Editor)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    نام کاربری: <code className="text-amber-600 font-bold">content_writer</code> • رمز: <code className="text-amber-600 font-bold">123</code> (پادکست‌ها)
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">انتخاب</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security badge */}
        <div className="text-center text-[11px] text-slate-400 space-y-1">
          <p>سیستم امنیتی کنترل دسترسی بر اساس نقش (RBAC) شرکت توی‌لند</p>
          <p className="opacity-75">همگام‌سازی لحظه‌ای با دیتابیس MySQL و پایگاه‌داده محلی</p>
        </div>
      </div>
    </div>
  );
};
