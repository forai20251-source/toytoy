import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  variant?: 'navbar' | 'compact' | 'drawer';
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDarkMode,
  onToggle,
  variant = 'navbar'
}) => {
  if (variant === 'compact') {
    return (
      <button
        id="dark-mode-compact-btn"
        type="button"
        onClick={onToggle}
        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isDarkMode
            ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 border border-slate-700 shadow-xs'
            : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200 border border-amber-200/60'
        }`}
        title={isDarkMode ? 'تغییر به حالت روز' : 'تغییر به حالت شب (کاهش خستگی چشم در شب)'}
        aria-label={isDarkMode ? 'فعال‌سازی حالت روز' : 'فعال‌سازی حالت شب'}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </button>
    );
  }

  if (variant === 'drawer') {
    return (
      <div 
        id="dark-mode-drawer-row"
        onClick={onToggle}
        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200'
            : 'bg-amber-50/80 border-amber-200/70 hover:bg-amber-100/60 text-slate-800'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-label="تغییر حالت شب و روز"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isDarkMode 
              ? 'bg-amber-500/20 text-amber-400' 
              : 'bg-amber-200/70 text-amber-800'
          }`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-black">
              {isDarkMode ? 'حالت شب فعال است' : 'حالت روز'}
            </div>
            <div className="text-[11px] opacity-75">
              تنظیم نور ملایم جهت محافظت از چشم در شب
            </div>
          </div>
        </div>

        {/* Visual Switch Pill */}
        <div className={`w-12 h-6.5 rounded-full p-0.5 flex items-center transition-colors duration-300 ${
          isDarkMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
        }`}>
          <div className="w-5.5 h-5.5 rounded-full bg-white shadow-xs flex items-center justify-center text-[10px]">
            {isDarkMode ? '🌙' : '☀️'}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Navbar Variant
  return (
    <button
      id="dark-mode-toggle-btn"
      type="button"
      onClick={onToggle}
      className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border ${
        isDarkMode
          ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs ring-1 ring-amber-400/20'
          : 'bg-amber-50 hover:bg-amber-100/80 text-slate-700 border-amber-200/80 hover:text-slate-900 shadow-2xs'
      }`}
      title={isDarkMode ? 'تغییر به حالت روز (روشن)' : 'تغییر به حالت شب (مناسب مطالعه شبانه و کاهش خستگی چشم)'}
      aria-label={isDarkMode ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
    >
      <div className={`p-1 rounded-full transition-transform duration-300 ${
        isDarkMode 
          ? 'bg-amber-400/20 text-amber-400 group-hover:rotate-45' 
          : 'bg-amber-200/60 text-amber-800 group-hover:-rotate-12'
      }`}>
        {isDarkMode ? (
          <Sun className="w-3.5 h-3.5" />
        ) : (
          <Moon className="w-3.5 h-3.5" />
        )}
      </div>

      <span className="hidden xl:inline">
        {isDarkMode ? 'حالت شب' : 'حالت روز'}
      </span>

      {/* Subtle indicator dot */}
      <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-amber-400 animate-pulse' : 'bg-orange-400'}`}></span>
    </button>
  );
};
