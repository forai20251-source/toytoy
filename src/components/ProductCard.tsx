import React from 'react';
import { Star, CheckCircle, Sparkles, ArrowLeft, Heart, PhoneCall } from 'lucide-react';
import { Product } from '../types';
import { formatToman, toPersianDigits } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (productId: string) => void;
  searchQuery?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, searchQuery }) => {
  // Check if search matched a specific skill, material or feature
  const matchedAttribute = React.useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    
    // Check skills
    const matchedSkill = product.skillsDeveloped.find(s => s.toLowerCase().includes(q));
    if (matchedSkill) return { type: 'مهارت', label: matchedSkill };
    
    // Check materials
    if (product.materials.toLowerCase().includes(q)) {
      return { type: 'متریال', label: product.materials };
    }
    
    // Check features
    const matchedFeat = product.features.find(f => f.toLowerCase().includes(q));
    if (matchedFeat) return { type: 'ویژگی', label: matchedFeat };
    
    return null;
  }, [product, searchQuery]);
  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product.id)}
      className="group bg-white rounded-3xl overflow-hidden border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-square overflow-hidden bg-amber-50/50">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              جدید
            </span>
          )}
          {product.isPopular && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
              پرفروش‌ترین
            </span>
          )}
        </div>

        {/* Age Range Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-xs border border-slate-100">
            {product.ageRange}
          </span>
        </div>

        {/* Discount badge if oldPrice */}
        {product.oldPrice && product.oldPrice > product.price && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs">
              {toPersianDigits(Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100))}% تخفیف
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{toPersianDigits(product.rating)}</span>
              <span className="text-slate-600 font-normal">({toPersianDigits(product.reviewsCount)})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
            {product.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-3">
            {product.shortDesc}
          </p>

          {/* Skills tags preview */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.skillsDeveloped.slice(0, 2).map((skill, idx) => (
              <span 
                key={idx} 
                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {product.skillsDeveloped.length > 2 && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                +{toPersianDigits(product.skillsDeveloped.length - 2)}
              </span>
            )}
          </div>

          {/* Matched Feature / Skill Badge during real-time search */}
          {matchedAttribute && (
            <div className="mb-3 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-amber-800 font-bold shrink-0">تطابق {matchedAttribute.type}:</span>
              <span className="truncate text-slate-800 font-semibold">{matchedAttribute.label}</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            {product.isCustomPrice && product.customPriceText ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl max-w-full">
                <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="truncate">{product.customPriceText}</span>
              </span>
            ) : (
              <>
                {product.oldPrice && (
                  <span className="block text-[11px] text-slate-600 line-through">
                    {toPersianDigits(product.oldPrice.toLocaleString())}
                  </span>
                )}
                <span className="text-base font-black text-slate-900">
                  {formatToman(product.price)}
                </span>
              </>
            )}
          </div>

          <button 
            type="button"
            className="w-9 h-9 rounded-xl bg-amber-100 group-hover:bg-orange-500 text-amber-900 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:shadow-md shrink-0"
            aria-label="مشاهده مشخصات کامل"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
