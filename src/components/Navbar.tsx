import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Headphones, 
  Info, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  Home,
  Music2,
  Volume2
} from 'lucide-react';
import { Page, PodcastEpisode } from '../types';
import { DarkModeToggle } from './DarkModeToggle';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page, extra?: { productId?: string }) => void;
  activePodcast: PodcastEpisode | null;
  isPlayingPodcast: boolean;
  onTogglePodcastPlay: () => void;
  pendingReviewsCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  activePodcast,
  isPlayingPodcast,
  onTogglePodcastPlay,
  pendingReviewsCount,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { page: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { page: 'home', label: 'خانه', icon: Home },
    { page: 'products', label: 'محصولات و اسباب‌بازی‌ها', icon: ShoppingBag },
    { page: 'podcasts', label: 'پادکست و قصه‌های صوتی', icon: Headphones },
    { page: 'about', label: 'درباره ما', icon: Info },
    { page: 'contact', label: 'ارتباط با ما', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>تولید ملی با استانداردهای بین‌المللی EN71 • ارسال به سراسر کشور با ضمانت سلامت کالا</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-right group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-md shadow-orange-200 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl" role="img" aria-label="toy-rocket">🚀</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  توی‌لند
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                  ToyLand
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">کارخانه اسباب‌بازی‌های هوشمند و خلاق</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-amber-50/60 p-1.5 rounded-full border border-amber-200/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => onNavigate(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-xs scale-102 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Area: Playing Podcast Pill, Dark Mode Toggle & Admin Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Active Podcast Mini Indicator */}
            {activePodcast && (
              <button
                id="active-podcast-quick-btn"
                onClick={onTogglePodcastPlay}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium cursor-pointer transition-colors"
                title="کنترل پخش پادکست جاری"
              >
                {isPlayingPodcast ? (
                  <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                ) : (
                  <Music2 className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="truncate max-w-[110px]">{activePodcast.title}</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </button>
            )}

            {/* Global Dark Mode / Evening Mode Toggle */}
            <DarkModeToggle
              isDarkMode={isDarkMode}
              onToggle={onToggleDarkMode}
              variant="navbar"
            />

            {/* Admin Panel Button */}
            <button
              id="admin-panel-btn"
              onClick={() => onNavigate('admin')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>پنل مدیریت</span>
              {pendingReviewsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {pendingReviewsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu trigger & Quick Dark Mode */}
          <div className="flex sm:hidden items-center gap-2">
            <DarkModeToggle
              isDarkMode={isDarkMode}
              onToggle={onToggleDarkMode}
              variant="compact"
            />
            <button
              id="mobile-admin-badge-btn"
              onClick={() => onNavigate('admin')}
              className="p-2 rounded-lg bg-slate-100 text-slate-700"
              title="پنل مدیریت"
            >
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-amber-100/70 text-amber-900 hover:bg-amber-200 transition-colors"
              aria-label="منوی اصلی"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-right cursor-pointer ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-slate-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Evening / Dark Mode Toggle inside Drawer */}
          <div className="pt-2">
            <DarkModeToggle
              isDarkMode={isDarkMode}
              onToggle={onToggleDarkMode}
              variant="drawer"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>ورود به پنل مدیریت محتوا و آمار</span>
              {pendingReviewsCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingReviewsCount} نظر جدید
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
