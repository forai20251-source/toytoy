import React, { useState } from 'react';
import { 
  Share2, 
  Send, 
  Instagram, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { formatToman } from '../utils/formatters';

interface SocialShareSectionProps {
  product: Product;
  variant?: 'compact' | 'expanded';
}

export const SocialShareSection: React.FC<SocialShareSectionProps> = ({ 
  product,
  variant = 'expanded'
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate share URL and caption text
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `اسباب‌بازی ${product.title} - توی‌لند`;
  const priceDisplay = product.isCustomPrice && product.customPriceText ? product.customPriceText : formatToman(product.price);
  const shareCaption = `🧸 اسباب‌بازی: ${product.title}
✨ رده سنی: ${product.ageRange}
🌿 جنس: ${product.materials}
🎯 مهارت‌ها: ${product.skillsDeveloped.join('، ')}
💰 وضعیت قیمت: ${priceDisplay}

خرید مستقیم از کارخانه اسباب‌بازی‌های توی‌لند:
${shareUrl}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedLink(true);
      showToast('لینک مستقیم اسباب‌بازی کپی شد!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('خطا در کپی کردن لینک.');
    }
  };

  const handleCopyCaption = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareCaption);
      }
      setCopiedCaption(true);
      showToast('متن و مشخصات اسباب‌بازی برای استوری یا دایرکت کپی شد!');
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch {
      showToast('خطا در کپی متن.');
    }
  };

  const handleShareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
      `🧸 ${product.title}\n${product.shortDesc}\nقیمت: ${priceDisplay}\n`
    )}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = `${shareTitle}\n${product.shortDesc}\nقیمت: ${priceDisplay}\nمشاهده و سفارش:\n${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = async () => {
    // If mobile Web Share API is available with files/url support, try it first
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle} - ساخت کارخانه توی‌لند`,
          url: shareUrl,
        });
        showToast('با موفقیت ارسال شد!');
        return;
      } catch {
        // User cancelled or share failed, fallback to copy + open instagram
      }
    }

    // Fallback: Copy formatted caption & open Instagram
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareCaption);
      }
      setCopiedCaption(true);
      showToast('متن و لینک اسباب‌بازی کپی شد! در حال انتقال به اینستاگرام...');
      setTimeout(() => setCopiedCaption(false), 3000);
    } catch {
      // ignore
    }

    // Open Instagram in new window
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-white dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 p-5 sm:p-6 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-4 text-right relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-3 left-3 right-3 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl z-20 flex items-center justify-between animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900">
              اشتراک‌گذاری این اسباب‌بازی با دیگران
            </h4>
            <p className="text-[11px] text-slate-700">
              معرفی به دوستان و خانواده در تلگرام، اینستاگرام و واتس‌اپ
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          id="quick-copy-link-btn"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="کپی کردن آدرس اینترنتی این صفحه"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">کپی شد</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>کپی لینک</span>
            </>
          )}
        </button>
      </div>

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Telegram Button */}
        <button
          id="share-telegram-btn"
          onClick={handleShareTelegram}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#229ED9] hover:bg-[#1E88E5] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group"
          title="ارسال مستقیم به تلگرام"
        >
          <Send className="w-4 h-4 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>اشتراک در تلگرام</span>
        </button>

        {/* Instagram Button */}
        <button
          id="share-instagram-btn"
          onClick={handleShareInstagram}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group"
          title="اشتراک‌گذاری در استوری یا دایرکت اینستاگرام"
        >
          <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>استوری و اینستاگرام</span>
        </button>

        {/* WhatsApp Button */}
        <button
          id="share-whatsapp-btn"
          onClick={handleShareWhatsApp}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group"
          title="ارسال در واتس‌اپ"
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>واتس‌اپ</span>
        </button>
      </div>

      {/* Caption Preview Box (Available in expanded variant) */}
      {variant === 'expanded' && (
        <div className="pt-2">
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-100/90 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-100 pb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>متن آماده برای کپشن استوری یا پست:</span>
              </span>
              <button
                onClick={handleCopyCaption}
                className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'کپی شد' : 'کپی متن'}</span>
              </button>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
              «🧸 {product.title} • مناسب {product.ageRange} • {product.materials} • خرید مستقیم از کارخانه توی‌لند»
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
