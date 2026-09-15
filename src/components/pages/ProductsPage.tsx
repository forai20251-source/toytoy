import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  X, 
  SlidersHorizontal,
  Tag,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { Product, ProductCategory, AgeGroup } from '../../types';
import { ProductCard } from '../ProductCard';
import { InteractiveAgeFilter } from '../InteractiveAgeFilter';
import { formatToman, toPersianDigits } from '../../utils/formatters';

interface ProductsPageProps {
  products: Product[];
  initialAgeFilter?: AgeGroup;
  onSelectProduct: (productId: string) => void;
}

// Popular search tags for quick discovery by parents
const POPULAR_SEARCH_TAGS = [
  { label: 'چوب راش طبیعی', icon: '🌿', query: 'چوب راش' },
  { label: 'مونته‌سوری و حسی', icon: '🧩', query: 'مونته‌سوری' },
  { label: 'تقویت تمرکز', icon: '🎯', query: 'تمرکز' },
  { label: 'حل مسئله و منطق', icon: '🧠', query: 'حل مسئله' },
  { label: 'رنگ‌های گیاهی خوراکی', icon: '🍃', query: 'رنگ' },
  { label: 'هماهنگی چشم و دست', icon: '✋', query: 'هماهنگی' },
  { label: 'مهندسی و چرخ‌دنده', icon: '⚙️', query: 'مهندسی' },
];

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  initialAgeFilter = 'all',
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAgeFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Escape to clear search or close dropdown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
        }
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: 'همه دسته‌ها' },
    { key: 'wooden', label: 'چوبی و طبیعت‌محور' },
    { key: 'building', label: 'ساختنی و مهندسی' },
    { key: 'sensory', label: 'حسی و مونته‌سوری' },
    { key: 'puzzle', label: 'فکری و معمایی' },
    { key: 'dolls', label: 'عروسک و داستان‌پردازی' },
    { key: 'creative', label: 'نقاشی و خلاقیت' },
  ];

  const ageGroups: { key: AgeGroup; label: string }[] = [
    { key: 'all', label: 'همه رده‌های سنی' },
    { key: '0-2', label: '۰ تا ۲ سال' },
    { key: '3-5', label: '۳ تا ۵ سال' },
    { key: '6-8', label: '۶ تا ۸ سال' },
    { key: '9+', label: '۹ سال به بالا' },
  ];

  // Deep Real-time Filter
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        // Age filter
        if (selectedAge !== 'all' && p.ageFilter !== selectedAge) return false;
        // In stock
        if (onlyInStock && !p.inStock) return false;
        // Real-time Search query (Deep attribute matching)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchShortDesc = p.shortDesc.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSkills = p.skillsDeveloped.some(s => s.toLowerCase().includes(q));
          const matchMaterials = p.materials.toLowerCase().includes(q);
          const matchFeatures = p.features.some(f => f.toLowerCase().includes(q));
          const matchSafety = p.safetyCertificate.toLowerCase().includes(q);
          const matchCategory = p.categoryName.toLowerCase().includes(q);
          const matchAge = p.ageRange.toLowerCase().includes(q);

          if (
            !matchTitle && 
            !matchShortDesc && 
            !matchDesc && 
            !matchSkills && 
            !matchMaterials && 
            !matchFeatures && 
            !matchSafety && 
            !matchCategory && 
            !matchAge
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviewsCount - a.reviewsCount;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, selectedAge, searchQuery, sortBy, onlyInStock]);

  // Top 4 live preview items for the search dropdown
  const livePreviewItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filteredProducts.slice(0, 4);
  }, [filteredProducts, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedAge('all');
    setSearchQuery('');
    setOnlyInStock(false);
    setSortBy('popular');
  };

  const handleSelectPopularTag = (query: string) => {
    setSearchQuery(query);
    setIsSearchFocused(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-8 sm:p-10 rounded-[36px] border border-amber-200/70 space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-800 text-xs font-black shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>کاتالوگ اسباب‌بازی‌های هوشمند، چوبی و آموزشی</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          محصولات تولیدی کارخانه توی‌لند
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed">
          تمامی اسباب‌بازی‌ها دارای تاییدیه بهداشتی، بدون لبه‌های تیز و ساخته شده از متریال باکیفیت و دوستدار کودک هستند تا خیال شما از بابت سلامت و امنیت بازی راحت باشد.
        </p>
      </div>

      {/* Interactive Age Range Filter (Slider & Tabbed Navigation) */}
      <InteractiveAgeFilter
        selectedAge={selectedAge}
        onSelectAge={setSelectedAge}
        products={products}
      />

      {/* Real-time Search & Filters Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-100 shadow-xs space-y-6">
        {/* Top search input and controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Real-Time Search Box with Instant Feedback and Dropdown */}
          <div ref={searchContainerRef} className="lg:col-span-6 relative">
            <div className="relative">
              {/* Search Icon or Live Indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-slate-400">
                {searchQuery ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                  </span>
                ) : (
                  <Search className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <input
                ref={searchInputRef}
                id="product-realtime-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی لحظه‌ای: نام اسباب‌بازی، ویژگی (مثل چوب راش، تمرکز، مونته‌سوری)..."
                className="w-full pl-24 pr-11 py-3.5 bg-amber-50/50 border border-amber-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-orange-400 transition-all text-right shadow-inner"
              />

              {/* Action Buttons inside search input (Clear & Esc hint) */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="پاک کردن جستجو (Esc)"
                    aria-label="پاک کردن متن جستجو"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="hidden sm:inline-block text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  Esc
                </span>
              </div>
            </div>

            {/* Instant Real-Time Search Results Dropdown Preview */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl border border-amber-200 shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span>نتایج لحظه‌ای برای «{searchQuery}»</span>
                  </div>
                  <span className="font-bold text-orange-600">
                    {toPersianDigits(filteredProducts.length)} محصول منطبق
                  </span>
                </div>

                {livePreviewItems.length > 0 ? (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {livePreviewItems.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod.id);
                          setIsSearchFocused(false);
                        }}
                        className="p-3 hover:bg-amber-50/50 flex items-center gap-3 cursor-pointer transition-colors group"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-orange-600 truncate">
                              {prod.title}
                            </h4>
                            <span className="text-xs font-black text-orange-600 shrink-0 mr-2">
                              {prod.isCustomPrice && prod.customPriceText ? prod.customPriceText : formatToman(prod.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {prod.ageRange}
                            </span>
                            <span className="text-[10px] text-slate-600 truncate">
                              {prod.materials}
                            </span>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:-translate-x-1 transition-all shrink-0" />
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setIsSearchFocused(false)}
                      className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-center text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      مشاهده همه {toPersianDigits(filteredProducts.length)} محصول در کاتالوگ پایینی
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-600 space-y-2">
                    <p>هیچ اسباب‌بازی‌ای با عبارت «{searchQuery}» پیدا نشد.</p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      پیشنهاد: عبارات کلی‌تر مثل «چوب»، «فکری» یا «۳ سال» را امتحان کنید.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sort Selector */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">مرتب‌سازی:</span>
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
              <option value="popular">محبوب‌ترین و پرفروش‌ترین</option>
              <option value="newest">جدیدترین تولیدات</option>
              <option value="price-asc">ارزان‌ترین قیمت</option>
              <option value="price-desc">گران‌ترین قیمت</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <div className="lg:col-span-2 flex items-center justify-end h-full pt-2 lg:pt-0">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-2xl hover:bg-slate-100 transition-colors w-full justify-center">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>فقط موجودی انبار</span>
            </label>
          </div>
        </div>

        {/* Quick Popular Search Tags for Parents */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>جستجوهای پرطرفدار والدین:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCH_TAGS.map((tag) => {
              const isActive = searchQuery === tag.query;
              return (
                <button
                  key={tag.query}
                  type="button"
                  onClick={() => handleSelectPopularTag(isActive ? '' : tag.query)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-xs font-bold' 
                      : 'bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200/60'
                  }`}
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-600 mb-2">دسته‌بندی موضوعی:</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`cat-filter-${cat.key}`}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Groups Pills */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-600 mb-2">رده سنی کودک:</div>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((age) => {
              const isSelected = selectedAge === age.key;
              return (
                <button
                  key={age.key}
                  id={`age-filter-${age.key}`}
                  onClick={() => setSelectedAge(age.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs scale-102'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900'
                  }`}
                >
                  {age.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
        <div className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2 flex-wrap">
          <span>نتایج جستجوی لحظه‌ای:</span>
          <span className="text-orange-600 font-black px-2 py-0.5 bg-orange-50 rounded-lg border border-orange-200">
            {toPersianDigits(filteredProducts.length)} اسباب‌بازی
          </span>
          {searchQuery && (
            <span className="text-slate-600 text-xs font-normal">
              مطابق با عبارت «<span className="font-bold text-slate-900">{searchQuery}</span>» در نام، مهارت‌ها یا ویژگی‌ها
            </span>
          )}
        </div>

        {(selectedCategory !== 'all' || selectedAge !== 'all' || searchQuery || onlyInStock) && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>پاک کردن همه فیلترها و جستجو</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      ) : (
        /* Empty State with Helpful Recommendations */
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-dashed border-amber-200 max-w-lg mx-auto space-y-5">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-4xl">
            🔍
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              هیچ اسباب‌بازی با این عبارت پیدا نشد!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              عبارت «<span className="font-bold text-slate-900">{searchQuery}</span>» در نام، ویژگی‌ها و مهارت‌های هیچ کالایی وجود ندارد.
            </p>
          </div>

          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-600 mb-3">
              والدین معمولاً این کلمات را جستجو می‌کنند:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['چوب راش', 'مونته‌سوری', 'تمرکز', 'پازل', 'زیر ۳ سال'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSearchQuery(s)}
                  className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors font-medium cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              مشاهده همه اسباب‌بازی‌ها
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
