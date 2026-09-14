import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('سفارش عمده و مهدکودک');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  const faqs = [
    {
      q: 'چگونه اسباب‌بازی‌های چوبی را تمیز و ضدعفونی کنیم؟',
      a: 'کافی است با یک دستمال نم‌دار نخی آغشته به چند قطره سرکه سفید طبیعی یا آب ولرم سطح چوب را پاک کرده و سریعاً خشک نمایید. از خیساندن اسباب‌بازی چوبی در آب یا قرار دادن در ماشین ظرفشویی خودداری فرمایید.'
    },
    {
      q: 'اگر یکی از قطعات پازل یا اسباب‌بازی گم شود، چه کنیم؟',
      a: 'ما در توی‌لند طرح پشتیبانی مادام‌العمر قطعات داریم! کافی است با امور مشتریان تماس بگیرید یا عکس محصول را بفرستید تا قطعه مفقودی را به صورت رایگان برای شما ارسال کنیم.'
    },
    {
      q: 'آیا مهدکودک‌ها و مراکز بازی می‌توانند خرید عمده با تخفیف داشته باشند؟',
      a: 'بله، برای مدارس، پیش‌دبستانی‌ها و مهدکودک‌ها پکیج‌های تجهیز ویژه بازی‌های گروهی با تخفیف‌های ویژه سازمانی و آموزش رایگان مربیان در نظر گرفته شده است.'
    },
    {
      q: 'امکان بازدید از کارخانه و شووم برای خانواده‌ها وجود دارد؟',
      a: 'بله، روزهای پنج‌شنبه هر هفته با هماهنگی قبلی، تورهای کودکانه «کارآگاه نجاری» در شووروم کارخانه برگزار می‌شود که کودکان می‌توانند فرآیند ساخت را از نزدیک ببینند.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 rounded-[40px] p-8 sm:p-14 text-white shadow-xl text-right space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>پاسخگویی سریع و دوستانه</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight">
          ارتباط با کارخانه و امور مشتریان توی‌لند
        </h1>
        <p className="text-white/95 text-sm sm:text-base max-w-3xl leading-relaxed">
          مشتاق شنیدن نظرات، پیشنهادات و سفارش‌های ویژه شما والدین، مربیان و همکاران گرامی هستیم. تیم ما در تمامی روزهای کاری آماده ارائه مشاوره انتخاب اسباب‌بازی است.
        </p>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6 text-right">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              اطلاعات تماس مستقیم
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">آدرس دفتر مرکزی و کارخانه:</h4>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    تهران، بزرگراه فتح (جاده قدیم کرج)، کیلومتر ۱۵، شهرک صنعتی نور، بلوار سرو، پلاک ۴۸، مجتمع تولیدی توی‌لند
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700 shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">تلفن‌های تماس مستقیم:</h4>
                  <p dir="ltr" className="text-slate-700 mt-1 font-mono">۰۲۱-۴۴۹۸۲۱۰۰</p>
                  <p dir="ltr" className="text-slate-700 font-mono">۰۲۱-۴۴۹۸۲۱۰۱</p>
                  <p className="text-[11px] text-amber-800 font-medium mt-1">سامانه پیامکی: ۳۰۰۰۸۴۲۰</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">پست الکترونیک رسمی:</h4>
                  <p className="text-slate-700 mt-1 font-mono">info@toyland-factory.ir</p>
                  <p className="text-slate-700 font-mono">sales@toyland-factory.ir</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">ساعات کاری و پذیرش:</h4>
                  <p className="text-slate-700 mt-1">شنبه تا چهارشنبه: ۸:۳۰ صبح الی ۱۷:۰۰</p>
                  <p className="text-slate-700">پنج‌شنبه‌ها: ۸:۳۰ صبح الی ۱۳:۳۰ (تور شووروم)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-amber-100 shadow-xs space-y-6 text-right">
            <div>
              <h3 className="text-xl font-black text-slate-900">فرم ارسال پیام به مدیریت</h3>
              <p className="text-xs text-slate-700 mt-1">
                پیام‌های شما مستقیماً توسط تیم مدیریت و پشتیبانی فروش بررسی می‌شود.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-base">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>پیام شما با موفقیت دریافت شد!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  کارشناسان توی‌لند حداکثر ظرف ۲۴ ساعت کاری با شماره ثبت شده با شما تماس خواهند گرفت. با سپاس از اعتماد شما.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام و نام خانوادگی: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: علی رضایی"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شماره تماس همراه: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      dir="ltr"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ایمیل (اختیاری):
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      dir="ltr"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      موضوع پیام:
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-400 focus:outline-hidden cursor-pointer"
                    >
                      <option value="سفارش عمده و مهدکودک">سفارش عمده، مدارس و مهدکودک‌ها</option>
                      <option value="اخذ نمایندگی فروش">تقاضای اخذ نمایندگی شهرستان‌ها</option>
                      <option value="پیگیری سفارش خرد">مشاوره خرید و سفارش تک</option>
                      <option value="انتقاد یا پیشنهاد کیفی">انتقاد، پیشنهاد یا خدمات پس از فروش</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    متن پیام شما: <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="لطفاً توضیحات، تعداد مورد نیاز یا پرسش خود را به طور کامل بنویسید..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ارسال پیام</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-amber-50/60 p-8 sm:p-12 rounded-[40px] border border-amber-200 text-right space-y-6">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase">
          <HelpCircle className="w-4 h-4" />
          <span>پرسش‌های متداول والدین</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900">
          پاسخ به سوالات رایج شما درباره اسباب‌بازی‌ها
        </h3>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-right cursor-pointer"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
