import React, { useState } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Heart, 
  Sparkles, 
  Search, 
  Clock, 
  Radio, 
  Volume2, 
  Share2, 
  Moon, 
  BookOpen, 
  Users,
  Compass
} from 'lucide-react';
import { PodcastEpisode } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface PodcastsPageProps {
  podcasts: PodcastEpisode[];
  activePodcastId?: string;
  isPlaying: boolean;
  onPlayPodcast: (podcast: PodcastEpisode) => void;
  onLikePodcast: (podcastId: string) => void;
}

export const PodcastsPage: React.FC<PodcastsPageProps> = ({
  podcasts,
  activePodcastId,
  isPlaying,
  onPlayPodcast,
  onLikePodcast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'همه قسمت‌ها', icon: Sparkles },
    { key: 'story', label: 'قصه شب و داستان', icon: Moon },
    { key: 'lullaby', label: 'لالایی و آرامش خواب', icon: BookOpen },
    { key: 'parenting', label: 'ویژه والدین', icon: Users },
    { key: 'educational', label: 'آموزشی و علمی', icon: Compass },
  ];

  const filteredPodcasts = podcasts.filter((pod) => {
    if (selectedCategory !== 'all' && pod.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pod.title.toLowerCase().includes(q) ||
        pod.subtitle.toLowerCase().includes(q) ||
        pod.narrator.toLowerCase().includes(q) ||
        pod.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featuredEpisode = podcasts[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-[40px] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-right">
        <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>رادیو پادکست اختصاصی توی‌لند برای شب‌های آرام و روزهای شاد</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            شنیدنی‌ترین قصه‌های کودکانه و راهنمای صوتی فرزندپروری
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            ما علاوه بر اسباب‌بازی‌های ملموس، داستان‌ها و اصواتی می‌سازیم که تخیل کودک را به پرواز درآورده و به والدین در درک بهتر نیازهای روانی و رشدی فرزندانشان یاری می‌رساند.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-bold text-white/80">
            <span>✨ کاملاً رایگان برای تمام خانواده‌ها</span>
            <span>🎧 کیفیت صدای استودیویی ۳۲۰</span>
          </div>
        </div>
      </div>

      {/* Featured Episode Spotlight */}
      {featuredEpisode && (
        <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-full md:w-64 aspect-square rounded-3xl overflow-hidden shadow-md shrink-0">
            <img
              src={featuredEpisode.coverImage}
              alt={featuredEpisode.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
              پیشنهاد این هفته
            </div>
          </div>

          <div className="flex-1 space-y-3 text-right">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
              <span>{featuredEpisode.categoryName}</span>
              <span>•</span>
              <span>رده سنی: {featuredEpisode.targetAge}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {featuredEpisode.title}
            </h2>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {featuredEpisode.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>مدت: {toPersianDigits(featuredEpisode.duration)}</span>
              </span>
              <span>گوینده: {featuredEpisode.narrator}</span>
              <span>شنوندگان: {toPersianDigits(featuredEpisode.playsCount)} بار</span>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                id="featured-spotlight-play-btn"
                onClick={() => onPlayPodcast(featuredEpisode)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-black shadow-md hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
              >
                {activePodcastId === featuredEpisode.id && isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>توقف پخش</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>پخش این قصه</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onLikePodcast(featuredEpisode.id)}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="پسندیدم"
              >
                <Heart className="w-4 h-4 fill-current text-rose-500" />
                <span>{toPersianDigits(featuredEpisode.likesCount)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`podcast-cat-${cat.key}`}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در قصه‌ها..."
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden text-right"
            />
          </div>
        </div>

        {/* Podcast List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPodcasts.map((podcast) => {
            const isThisPlaying = activePodcastId === podcast.id && isPlaying;
            return (
              <div
                key={podcast.id}
                className={`p-5 rounded-3xl bg-white border transition-all duration-300 flex items-start gap-4 text-right ${
                  isThisPlaying
                    ? 'border-rose-400 shadow-md ring-2 ring-rose-100'
                    : 'border-slate-200/80 hover:border-amber-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Cover & Play Overlay */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 group">
                  <img
                    src={podcast.coverImage}
                    alt={podcast.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => onPlayPodcast(podcast)}
                    className="absolute inset-0 bg-black/40 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="پخش پادکست"
                  >
                    {isThisPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current mr-0.5" />
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      {podcast.categoryName}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {podcast.releaseDate}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                    {podcast.title}
                  </h3>

                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {podcast.subtitle}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-700">
                    <span>گوینده: {podcast.narrator}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {toPersianDigits(podcast.duration)}
                      </span>
                      <button
                        onClick={() => onLikePodcast(podcast.id)}
                        className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{toPersianDigits(podcast.likesCount)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
