import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Headphones, 
  CheckCircle2, 
  Instagram, 
  Send
} from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">چوب طبیعی و ضدحساسیت</h4>
              <p className="text-xs text-slate-400 mt-1">فاقد هرگونه مواد نفتی، سرب یا رنگ‌های شیمیایی آلرژی‌زا</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">طراحی با روانشناسان کودک</h4>
              <p className="text-xs text-slate-400 mt-1">توسعه خلاقیت، تفکر منطقی و هوش هیجانی متناسب با سن</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">پادکست و قصه‌های صوتی</h4>
              <p className="text-xs text-slate-400 mt-1">آرشیو صوتی قصه‌های شبانه و لالایی‌های آرامش‌بخش رایگان</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">گارانتی سلامت و تعویض قطعه</h4>
              <p className="text-xs text-slate-400 mt-1">تامین قطعات مفقودی اسباب‌بازی و ضمانت بازگشت ۷ روزه</p>
            </div>
          </div>
        </div>

        {/* Links & Brand section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md">
                🚀
              </div>
              <span className="text-2xl font-black text-white">توی‌لند</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pl-4">
              شرکت تولیدی توی‌لند با بیش از ۱۰ سال سابقه، پیشگام طراحی و ساخت اسباب‌بازی‌های چوبی، حسی و مونته‌سوری در ایران است. ما بر این باوریم که بازی، زبان طبیعی رشد و شادمانی کودکان است.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                onClick={(e) => e.preventDefault()} 
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#telegram" 
                onClick={(e) => e.preventDefault()} 
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="تلگرام"
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} 
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="تماس"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              بخش‌های سایت
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  کاتالوگ اسباب‌بازی‌ها
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('podcasts')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  رادیو و پادکست‌های صوتی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  درباره کارخانه و فرآیند تولید
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  ارتباط و امور نمایندگی‌ها
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              دسته‌بندی‌ها
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>اسباب‌بازی‌های چوبی راش</li>
              <li>کیت‌های مهندسی و چرخ‌دنده</li>
              <li>محصولات حسی مونته‌سوری</li>
              <li>پازل‌های سه‌بعدی و نجوم</li>
              <li>عروسک‌های ارگانیک ضدحساسیت</li>
              <li>خمیربازی‌های ارگانیک خوراکی</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              دفتر مرکزی و کارخانه
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>تهران، کیلومتر ۱۵ بزرگراه فتح، شهرک صنعتی نور، بلوار صنعت، کارخانه توی‌لند</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr" className="font-mono">۰۲۱-۴۴۹۸۲۱۰۰</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@toyland-factory.ir</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© تمامی حقوق مادی و معنوی متعلق به شرکت تولیدی اسباب‌بازی توی‌لند است.</p>
          <div className="flex items-center gap-2">
            <span>ساخته شده با</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>برای کودکان شاد و کنجکاو ایران‌زمین</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
