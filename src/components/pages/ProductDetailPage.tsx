import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  MessageSquare, 
  Send,
  UserCheck,
  Check,
  Instagram,
  X,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, ParentReview } from '../../types';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { SocialShareSection } from '../SocialShareSection';

interface ProductDetailPageProps {
  product: Product;
  reviews: ParentReview[];
  onBack: () => void;
  onAddReview: (review: Omit<ParentReview, 'id' | 'date' | 'approved' | 'helpfulCount' | 'verifiedPurchase'>) => void;
  onHelpfulReview: (reviewId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  reviews,
  onBack,
  onAddReview,
  onHelpfulReview
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState<'details' | 'skills' | 'reviews'>('details');

  // Review Form State
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.approved
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !commentText.trim()) return;

    onAddReview({
      productId: product.id,
      productName: product.title,
      parentName: parentName.trim(),
      childAge: childAge.trim() || 'کودک',
      rating,
      comment: commentText.trim(),
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setReviewSubmitted(true);
    setParentName('');
    setChildAge('');
    setCommentText('');
    setRating(5);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-products-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به کاتالوگ محصولات</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Telegram Share */}
          <button
            id="top-share-telegram-btn"
            onClick={() => {
              const url = window.location.href;
              const priceText = product.isCustomPrice && product.customPriceText ? product.customPriceText : formatToman(product.price);
              const text = `🧸 اسباب‌بازی ${product.title}\n${product.shortDesc}\nقیمت: ${priceText}\nتوی‌لند:`;
              window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#229ED9] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            title="اشتراک مستقیم در تلگرام"
          >
            <Send className="w-3.5 h-3.5" />
            <span>تلگرام</span>
          </button>

          {/* Quick Instagram Share */}
          <button
            id="top-share-instagram-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            title="اشتراک‌گذاری در استوری اینستاگرام"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>اینستاگرام</span>
          </button>

          {/* General Share & Modal trigger */}
          <button
            id="top-share-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="اشتراک‌گذاری در شبکه‌های اجتماعی"
          >
            <Share2 className="w-4 h-4 text-orange-500" />
            <span>اشتراک‌گذاری</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-[36px] border border-amber-100 shadow-sm">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-amber-50/50 border border-amber-100 relative group">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {product.isPopular && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                محصول برگزیده
              </span>
            )}
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-extrabold px-3 py-1 rounded-xl shadow-xs border border-slate-100">
              {product.ageRange}
            </span>
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === imgUrl ? 'border-orange-500 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`عکس ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Simulation */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 text-right">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{toPersianDigits(product.rating)}</span>
                <span className="text-slate-600 font-normal">
                  ({toPersianDigits(product.reviewsCount)} نظر والدین)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Short Desc */}
            <p className="text-slate-700 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Quick Spec Highlights */}
            <div className="grid grid-cols-2 gap-3 py-2 text-xs">
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                <span className="text-slate-700 block mb-0.5">جنس و متریال:</span>
                <span className="font-bold text-slate-900">{product.materials}</span>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                <span className="text-slate-700 block mb-0.5">ابعاد محصول:</span>
                <span className="font-bold text-slate-900">{product.dimensions}</span>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                <span className="text-slate-700 block mb-0.5">رده سنی بهینه:</span>
                <span className="font-bold text-slate-900">{product.ageRange}</span>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                <span className="text-slate-700 block mb-0.5">گواهی ایمنی:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {product.safetyCertificate}
                </span>
              </div>
            </div>

            {/* Skills Pills */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                مهارت‌های تقویت‌شونده در کودک:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.skillsDeveloped.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200/60"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Box & Trust Guarantees */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            {product.isCustomPrice && product.customPriceText ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-400/30">
                <div>
                  <span className="block text-xs text-amber-900/80 font-bold mb-1">قیمت و استعلام:</span>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-900">
                      <PhoneCall className="w-5 h-5 text-amber-800" />
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-amber-950">
                      {product.customPriceText}
                    </span>
                  </div>
                </div>
                <span className="self-start sm:self-center text-xs font-bold text-amber-900 bg-amber-200/70 border border-amber-300 px-3 py-1 rounded-xl">
                  تولید سفارشی / استعلام مستقیم
                </span>
              </div>
            ) : (
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-700">قیمت فروش مستقیم کارخانه:</span>
                <div className="text-left">
                  {product.oldPrice && (
                    <span className="block text-xs text-slate-600 line-through">
                      {formatToman(product.oldPrice)}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-orange-600">
                    {formatToman(product.price)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {product.isCustomPrice && product.customPriceText ? (
                <>
                  <a
                    href="tel:02188889999"
                    id="inquiry-call-btn"
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-extrabold text-base shadow-lg shadow-amber-500/30 hover:scale-102 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
                  >
                    <PhoneCall className="w-5 h-5 shrink-0" />
                    <span>تماس فوری برای استعلام قیمت</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`سلام، برای استعلام قیمت اسباب‌بازی «${product.title}» از کارخانه توی‌لند پیام می‌دهم.\n${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="inquiry-whatsapp-btn"
                    className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-600/20 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>پیام در واتساپ</span>
                  </a>
                </>
              ) : (
                <button
                  id="inquiry-order-btn"
                  onClick={() => {
                    alert(`درخواست سفارش محصول "${product.title}" با موفقیت ثبت گردید. همکاران فروش کارخانه توی‌لند به زودی با شما تماس خواهند گرفت.`);
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-orange-300/40 hover:scale-102 transition-all text-center cursor-pointer"
                >
                  ثبت سفارش مستقیم از کارخانه
                </button>
              )}
            </div>

            {/* Trust perks */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>ارسال ایمن و بسته‌بندی ضدضربه</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>۷ روز ضمانت بازگشت و سلامت</span>
              </div>
            </div>

            {/* Social Media Sharing Section */}
            <div className="pt-2">
              <SocialShareSection product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Details / Skills / Parent Reviews */}
      <div className="bg-white rounded-[36px] border border-amber-100 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 bg-amber-50/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مشخصات کامل و مزایا
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ارزش‌های شناختی و آموزشی
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>نظرات والدین ({toPersianDigits(productReviews.length)})</span>
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'details' && (
          <div className="p-6 sm:p-10 space-y-6 text-right">
            <h3 className="text-lg font-black text-slate-900">ویژگی‌های برجسته محصول</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/70 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 2: Skills */}
        {activeTab === 'skills' && (
          <div className="p-6 sm:p-10 space-y-6 text-right">
            <h3 className="text-lg font-black text-slate-900">چرا این اسباب‌بازی به رشد کودک کمک می‌کند؟</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.skillsDeveloped.map((skill, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-black text-orange-800">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>{skill}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    با به کارگیری تمرین‌های عملی و تکرار لذت‌بخش، سلول‌های عصبی و حرکتی دست و ذهن کودک پیوندهای پایدارتری تشکیل می‌دهند.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Parent Reviews & Comment Submission Form */}
        {activeTab === 'reviews' && (
          <div className="p-6 sm:p-10 space-y-10 text-right">
            {/* Reviews list */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>دیدگاه‌های ثبت‌شده توسط والدین</span>
                <span className="text-xs font-bold text-slate-700">
                  {toPersianDigits(productReviews.length)} نظر تاییدشده
                </span>
              </h3>

              {productReviews.length > 0 ? (
                <div className="space-y-4">
                  {productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
                            {rev.parentName[0]}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{rev.parentName}</h4>
                            <span className="text-[11px] text-slate-700">سن فرزند: {rev.childAge}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-200/60">
                        <span className="text-slate-600 text-[11px]">{rev.date}</span>
                        <button
                          onClick={() => onHelpfulReview(rev.id)}
                          className="flex items-center gap-1 text-slate-700 hover:text-orange-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>مفید بود ({toPersianDigits(rev.helpfulCount)})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
                  <p className="text-xs text-slate-700">
                    هنوز نظری برای این اسباب‌بازی ثبت نشده است. اولین والدی باشید که تجربه خود را به اشتراک می‌گذارد!
                  </p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-amber-50/60 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-6">
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">ثبت دیدگاه شما به عنوان والد</h4>
                <p className="text-xs text-slate-700">
                  تجربه شما به سایر والدین در انتخاب بهترین و ایمن‌ترین اسباب‌بازی برای فرزندشان کمک می‌کند.
                </p>
              </div>

              {reviewSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>دیدگاه شما با موفقیت ثبت گردید و پس از بررسی تیم کنترل کیفی توی‌لند نمایش داده خواهد شد. ممنون از همراهی شما!</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        نام و نام‌خانوادگی والد:
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="مثال: مریم کریمی"
                        className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        سن فرزند شما:
                      </label>
                      <input
                        type="text"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                        placeholder="مثال: ۴ ساله"
                        className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      امتیاز شما به کیفیت و ایمنی محصول:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-all ${
                              starVal <= rating
                                ? 'text-amber-400 fill-amber-400 scale-110'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 mr-2">
                        {toPersianDigits(rating)} از ۵ ستاره
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      متن نظر، میزان استقبال کودک و تجربه بازی:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="کیفیت ساخت، سنباده‌کاری، میزان جذابیت برای فرزندتان و نکات بهداشتی..."
                      className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                    />
                  </div>

                  <button
                    id="submit-review-btn"
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال نظر والد</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Social Media Sharing Modal Dialog */}
      {isShareModalOpen && (
        <div 
          id="social-share-modal-backdrop"
          onClick={() => setIsShareModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            id="social-share-modal-content"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-amber-100 shadow-2xl relative text-right animate-in zoom-in-95 duration-200"
          >
            {/* Close button */}
            <button
              id="close-share-modal-btn"
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 left-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="بستن پنجره اشتراک‌گذاری"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold">
                <Share2 className="w-3.5 h-3.5 text-orange-600" />
                <span>اشتراک‌گذاری اسباب‌بازی</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                ارسال به دوستان و شبکه‌های اجتماعی
              </h3>
              <p className="text-xs text-slate-600">
                این اسباب‌بازی را به سادگی در تلگرام، استوری اینستاگرام یا واتس‌اپ به اشتراک بگذارید.
              </p>
            </div>

            {/* Toy Mini Preview Card */}
            <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-100/80">
              <img
                src={product.image}
                alt={product.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600">
                  <span>{product.ageRange}</span>
                  <span>•</span>
                  <span className="font-bold text-orange-600">
                    {product.isCustomPrice && product.customPriceText ? product.customPriceText : formatToman(product.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Sharing Component */}
            <SocialShareSection product={product} variant="expanded" />
          </div>
        </div>
      )}
    </div>
  );
};
