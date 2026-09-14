import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Award, 
  Sparkles, 
  TreePine, 
  Wrench, 
  CheckCircle2, 
  Users, 
  Target, 
  Eye
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

export const AboutPage: React.FC = () => {
  const productionSteps = [
    {
      step: '۱',
      title: 'انتخاب چوب پایدار و بدون گره',
      desc: 'تهیه الوارهای مرغوب راش و چنار از جنگل‌های پایدار با نظارت سازمان منابع طبیعی و بدون آسیب به اکوسیستم.',
      icon: TreePine,
    },
    {
      step: '۲',
      title: 'برش و تراش CNC مهندسی‌شده',
      desc: 'تبدیل الوارها به قطعات دقیق هندسی با تلرانس کمتر از ۰.۱ میلی‌متر برای جفت شدن روان بدون لقی.',
      icon: Wrench,
    },
    {
      step: '۳',
      title: 'سنباده‌کاری و لبه‌گردانی دست‌ساز',
      desc: 'سه مرحله سنباده‌کاری دستی توسط استادکاران برای از بین بردن هرگونه برآمدگی، تیزی و پرز چوب.',
      icon: Sparkles,
    },
    {
      step: '۴',
      title: 'رنگ‌آمیزی با پیگمنت‌های گیاهی خوراکی',
      desc: 'پوشش با روغن‌های طبیعی کتان و موم زنبور عسل با استانداردهای فودگرید EN71 بدون بوی شیمیایی.',
      icon: Award,
    },
    {
      step: '۵',
      title: 'تست فیزیکی مقاومت و کنترل کیفی نهایی',
      desc: 'آزمون سقوط از ارتفاع، مقاومت کششی و تست عدم جدا شدن قطعات ریز پیش از بسته‌بندی در پاکت‌های بازیافتی.',
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 rounded-[40px] p-8 sm:p-14 text-white shadow-xl text-right space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>داستان ما و عشق به کودکان</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight">
          درباره کارخانه اسباب‌بازی‌های توی‌لند
        </h1>
        <p className="text-white/95 text-sm sm:text-base max-w-3xl leading-relaxed">
          ما در سال ۱۳۹۵ با یک کارگاه کوچک نجاری سنتی و آرزویی بزرگ آغاز کردیم: نجات بازی‌های کودکان از صفحات سرد گوشی و تبلت، و پیوند زدن دوباره دستان کودک با گرمای چوب طبیعی و کنجکاوی‌های بی‌پایان.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-xs space-y-4 text-right">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">ماموریت ما</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            طراحی و تولید باکیفیت‌ترین اسباب‌بازی‌های خلاقانه و ایمن در ایران با تکیه بر دانش متخصصان رشد کودک و روانشناسی یادگیری، به گونه‌ای که هر خانواده بتواند محصولاتی در سطح برترین برندهای بین‌المللی با قیمتی منصفانه تهیه کند.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-xs space-y-4 text-right">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">چشم‌انداز ما</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            تبدیل شدن به الهام‌بخش‌ترین برند آموزش و سرگرمی کودک در خاورمیانه، به طوری که نام توی‌لند برای هر والد یادآور آرامش خاطر، دوستی با طبیعت، و خاطرات شیرین دوران کودکی فرزندان باشد.
          </p>
        </div>
      </div>

      {/* Production Pipeline Process */}
      <div className="space-y-8 text-right">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">
            سفر خلق یک اسباب‌بازی
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            فرآیند تولید از درخت تا اتاق کودک
          </h2>
          <p className="text-xs sm:text-sm text-slate-700">
            مراحل پنج‌گانه دقیق و وسواس‌گونه تیم تولیدی توی‌لند برای اطمینان از سلامت فرزندان شما.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {productionSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-base">
                    {toPersianDigits(step.step)}
                  </div>
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-sm text-slate-900 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standards & Certifications */}
      <div className="bg-amber-50/70 p-8 sm:p-12 rounded-[40px] border border-amber-200 space-y-6 text-right">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-center">
          گواهی‌نامه‌ها و استانداردهای بین‌المللی ما
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 text-center space-y-2">
            <div className="text-3xl">🏅</div>
            <h4 className="font-bold text-sm text-slate-900">استاندارد EN 71 اروپا</h4>
            <p className="text-xs text-slate-700">تست کامل عدم اشتعال‌پذیری، سمیت شیمیایی و استحکام مکانیکی</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-amber-100 text-center space-y-2">
            <div className="text-3xl">🌿</div>
            <h4 className="font-bold text-sm text-slate-900">نشان FSC بین‌المللی</h4>
            <p className="text-xs text-slate-700">تضمین چوب‌های پرورشی بدون تخریب جنگل‌های بومی طبیعی</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-amber-100 text-center space-y-2">
            <div className="text-3xl">🔬</div>
            <h4 className="font-bold text-sm text-slate-900">تاییدیه کانون پرورش فکری</h4>
            <p className="text-xs text-slate-700">دارای هولوگرام اصالت و تطابق ارزش‌های پرورشی کودک ایرانی</p>
          </div>
        </div>
      </div>
    </div>
  );
};
