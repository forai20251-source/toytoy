import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Heart, 
  ShieldCheck, 
  Headphones, 
  Award, 
  Smile, 
  Star, 
  Play, 
  CheckCircle2, 
  Compass,
  Boxes,
  Layers,
  Baby
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Page, Product, PodcastEpisode, ParentReview, AgeGroup } from '../../types';
import { ProductCard } from '../ProductCard';
import { toPersianDigits, formatToman } from '../../utils/formatters';

interface HomePageProps {
  products: Product[];
  podcasts: PodcastEpisode[];
  reviews: ParentReview[];
  onNavigate: (page: Page, extra?: { productId?: string; ageFilter?: AgeGroup }) => void;
  onPlayPodcast: (podcast: PodcastEpisode) => void;
  activePodcastId?: string;
  isPlayingPodcast: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  podcasts,
  reviews,
  onNavigate,
  onPlayPodcast,
  activePodcastId,
  isPlayingPodcast
}) => {
  const featuredProducts = products.filter(p => p.isPopular || p.isNew).slice(0, 4);
  const featuredPodcast = podcasts[0] || null;
  const approvedReviews = reviews.filter(r => r.approved).slice(0, 3);

  const triggerPlayfulConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24']
    });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/70 via-orange-50/50 to-white pt-10 pb-20 rounded-b-[48px] border-b border-amber-100">
        {/* Floating playful background shapes */}
        <div className="absolute top-10 right-10 text-4xl select-none animate-float-slow opacity-80" role="img" aria-label="ستاره">
          ⭐
        </div>
        <div className="absolute bottom-12 right-1/4 text-3xl select-none animate-bounce opacity-70" role="img" aria-label="رنگین‌کمان">
          🌈
        </div>
        <div className="absolute top-24 left-16 text-4xl select-none animate-pulse-gentle opacity-75" role="img" aria-label="مکعب اسباب‌بازی">
          🧩
        </div>
        <div className="absolute bottom-16 left-12 text-3xl select-none animate-float-slow opacity-70" role="img" aria-label="خرس اسباب‌بازی">
          🧸
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Right text column */}
            <div className="lg:col-span-7 text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-amber-900 border border-amber-200 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
                <span className="text-xs sm:text-sm font-bold">بزرگ‌ترین تولیدکننده اسباب‌بازی‌های سلامت‌محور چوبی و مونته‌سوری</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.25] tracking-tight">
                دنیایی از <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-500 via-amber-500 to-rose-500">شادی، کشف و بازی</span> برای فرزند دلبند شما
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
                در کارخانه توی‌لند، ما اسباب‌بازی‌هایی می‌سازیم که از دل طبیعت روییده‌اند؛ بدون مواد شیمیایی مضر، با چوب طبیعی راش و رنگ‌های ارگانیک گیاهی. همراه با قصه‌های صوتی که شب‌ها خوابی آرام به کودکان هدیه می‌دهند.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-explore-products-btn"
                  onClick={() => onNavigate('products')}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-orange-300/50 hover:shadow-orange-400/60 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>مشاهده کاتالوگ اسباب‌بازی‌ها</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  id="hero-listen-podcasts-btn"
                  onClick={() => onNavigate('podcasts')}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-600 font-bold text-base border-2 border-amber-200 shadow-sm transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Headphones className="w-5 h-5 text-orange-500" />
                  <span>شنیدن قصه‌ها و پادکست‌ها</span>
                </button>

                <button
                  id="hero-confetti-btn"
                  onClick={triggerPlayfulConfetti}
                  className="px-4 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  title="جشن شادی اسباب‌بازی‌ها"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>کلیک شادمانه!</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200/60">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    +{toPersianDigits(120)}
                  </div>
                  <div className="text-xs text-slate-700 font-medium mt-0.5">مدل اسباب‌بازی تخصصی</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    +{toPersianDigits(25)} هزار
                  </div>
                  <div className="text-xs text-slate-700 font-medium mt-0.5">کودک شاد و خندان</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    ۱۰۰٪
                  </div>
                  <div className="text-xs text-slate-700 font-medium mt-0.5">طبیعی و بدون مواد سمی</div>
                </div>
              </div>
            </div>

            {/* Left visual column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80"
                    alt="کودک در حال بازی با اسباب‌بازی چوبی توی‌لند"
                    className="w-full h-[420px] object-cover object-center transform hover:scale-103 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating glass pill on image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-amber-100 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                        🪵
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">چوب راش طبیعی گرجستان</div>
                        <div className="text-[11px] text-slate-700">با رنگ‌های خوراکی بدون سرب</div>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Floating Podcast mini card */}
                <div 
                  onClick={() => featuredPodcast && onPlayPodcast(featuredPodcast)}
                  className="absolute -top-6 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform max-w-[220px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-current mr-0.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 block">پادکست اختصاصی</span>
                    <span className="text-xs font-extrabold text-slate-800 line-clamp-1">قصه شب کودک</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Age Group Navigator (کشف اسباب‌بازی بر اساس سن کودک) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
            هدایت هوشمند والدین
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            انتخاب اسباب‌بازی مناسب سن فرزندتان
          </h2>
          <p className="text-sm text-slate-700 mt-2">
            هر سن نیازمند تحریک بخش خاصی از هوش و مهارت‌های حرکتی کودک است.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              filter: '0-2' as AgeGroup,
              label: '۰ تا ۲ سال',
              sub: 'کشف حسی و لامسه',
              icon: Baby,
              color: 'from-amber-400 to-amber-500',
              bg: 'bg-amber-50',
              border: 'border-amber-200'
            },
            {
              filter: '3-5' as AgeGroup,
              label: '۳ تا ۵ سال',
              sub: 'خلاقیت و تخیل آزاد',
              icon: Boxes,
              color: 'from-rose-400 to-rose-500',
              bg: 'bg-rose-50',
              border: 'border-rose-200'
            },
            {
              filter: '6-8' as AgeGroup,
              label: '۶ تا ۸ سال',
              sub: 'ساختنی و حل معما',
              icon: Layers,
              color: 'from-sky-400 to-sky-500',
              bg: 'bg-sky-50',
              border: 'border-sky-200'
            },
            {
              filter: '9+' as AgeGroup,
              label: '۹ سال به بالا',
              sub: 'استراتژی و علم مهندسی',
              icon: Compass,
              color: 'from-emerald-400 to-emerald-500',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                id={`age-card-${item.filter}`}
                onClick={() => onNavigate('products', { ageFilter: item.filter })}
                className={`group p-6 rounded-3xl ${item.bg} border ${item.border} hover:shadow-xl transition-all duration-300 text-right flex flex-col justify-between cursor-pointer transform hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="mt-6">
                  <div className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-700 font-medium mt-1">
                    {item.sub}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-orange-600">
                  <span>مشاهده بازی‌ها</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">
              محبوب‌ترین اسباب‌بازی‌ها
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              برگزیده‌های کارخانه توی‌لند
            </h2>
          </div>
          <button
            id="home-view-all-products-btn"
            onClick={() => onNavigate('products')}
            className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>مشاهده همه {toPersianDigits(products.length)} محصول</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={(id) => onNavigate('product-detail', { productId: id })}
            />
          ))}
        </div>
      </section>

      {/* 4. Podcast & Audio Story Showcase */}
      {featuredPodcast && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 rounded-[36px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>استودیوی رادیو کودک و قصه‌های صوتی توی‌لند</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  {featuredPodcast.title}
                </h3>

                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {featuredPodcast.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <span className="bg-black/20 px-3 py-1 rounded-lg">گوینده: {featuredPodcast.narrator}</span>
                  <span className="bg-black/20 px-3 py-1 rounded-lg">مدت زمان: {toPersianDigits(featuredPodcast.duration)}</span>
                  <span className="bg-black/20 px-3 py-1 rounded-lg">رده سنی: {featuredPodcast.targetAge}</span>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    id="featured-podcast-play-btn"
                    onClick={() => onPlayPodcast(featuredPodcast)}
                    className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-orange-600 font-black text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {activePodcastId === featuredPodcast.id && isPlayingPodcast ? 'در حال پخش قصه...' : 'پخش قصه صوتی رایگان'}
                    </span>
                  </button>

                  <button
                    onClick={() => onNavigate('podcasts')}
                    className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition-colors cursor-pointer"
                  >
                    مشاهده سایر قصه‌ها ({toPersianDigits(podcasts.length)} قسمت)
                  </button>
                </div>
              </div>

              {/* Cover visual */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative group">
                  <img
                    src={featuredPodcast.coverImage}
                    alt={featuredPodcast.title}
                    className="w-56 h-56 rounded-3xl object-cover shadow-2xl border-4 border-white/30 transform group-hover:rotate-2 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-3 -left-3 bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-xl shadow-md">
                    قصه برگزیده هفته 🌟
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Production & Quality Standards Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-[40px] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              امنیت بالاتر از هرچیز
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              استانداردهای ساخت در کارخانه توی‌لند
            </h2>
            <p className="text-sm text-slate-700 mt-2">
              هر قطعه اسباب‌بازی پیش از رسیدن به دست کودک شما، از ۵ مرحله بازرسی فیزیکی و شیمیایی عبور می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
                🪵
              </div>
              <h3 className="text-lg font-black text-slate-900">چوب راش فرآوری‌شده</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                چوب‌های طبیعی بدون کوچکترین ترک یا پوسته با ماشین‌آلات پیشرفته آلمانی برش خورده و تمام گوشه‌ها با دست گرد و صیقلی می‌شوند.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl">
                🌿
              </div>
              <h3 className="text-lg font-black text-slate-900">رنگ‌های گیاهی خوراکی</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                رنگ‌آمیزی با فناوری آب‌پایه و روغن‌های گیاهی ارگانیک انجام می‌شود تا در صورت به دهان بردن اسباب‌بازی توسط کودک، هیچ خطری وجود نداشته باشد.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xl">
                🧠
              </div>
              <h3 className="text-lg font-black text-slate-900">طراحی شناختی مونته‌سوری</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                هر محصول با نظارت روانشناسان رشد کودک طراحی شده تا خلاقیت، خودکارآمدی، دست‌ورزی و حل مسئله را به صورت ناخودآگاه شکوفا کند.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 underline underline-offset-4 cursor-pointer"
            >
              <span>مشاهده جزئیات خط تولید و گواهی‌نامه‌های ایمنی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Parent Reviews & Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              دیدگاه‌های واقعی
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              تجربه مادران و پدران از توی‌لند
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
            <span className="text-amber-500 font-black text-base">۴.۹ از ۵</span>
            <span>میانگین رضایت بیش از ۲۴۰ خانواده</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-600">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.parentName}</h4>
                  <p className="text-[11px] text-amber-700 font-medium">{rev.productName}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>خریدار تاییدشده</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
