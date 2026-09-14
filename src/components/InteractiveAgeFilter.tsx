import React, { useState, useMemo } from 'react';
import { 
  Baby, 
  Smile, 
  Blocks, 
  Rocket, 
  Sliders, 
  Layers, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  Info,
  Heart
} from 'lucide-react';
import { AgeGroup, Product } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface InteractiveAgeFilterProps {
  selectedAge: AgeGroup;
  onSelectAge: (age: AgeGroup) => void;
  products: Product[];
}

interface AgeStageMeta {
  key: AgeGroup;
  title: string;
  stageName: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBg: string;
  borderActive: string;
  textBadge: string;
  focusMilestone: string;
  pedagogicalTip: string;
}

const AGE_STAGES: AgeStageMeta[] = [
  {
    key: 'all',
    title: 'همه رده‌های سنی',
    stageName: 'از نوزادی تا نوجوانی',
    emoji: '🌈',
    icon: Layers,
    accentColor: 'from-amber-500 to-orange-500',
    activeBg: 'bg-amber-500 text-slate-950',
    borderActive: 'border-amber-500 ring-2 ring-amber-400/40',
    textBadge: 'bg-amber-100 text-amber-900',
    focusMilestone: 'مجموعه کامل اسباب‌بازی‌های کارخانه',
    pedagogicalTip: 'مشاهده تمامی اسباب‌بازی‌های استاندارد، چوبی و هوشمند توی‌لند برای همه گروه‌های سنی.'
  },
  {
    key: '0-2',
    title: '۰ تا ۲ سال',
    stageName: 'نوزادی و نوپایی',
    emoji: '👶',
    icon: Baby,
    accentColor: 'from-sky-400 to-blue-500',
    activeBg: 'bg-sky-500 text-white',
    borderActive: 'border-sky-500 ring-2 ring-sky-400/40',
    textBadge: 'bg-sky-100 text-sky-800',
    focusMilestone: 'تحریک حواس ۵گانه و گرفتن اشیاء',
    pedagogicalTip: 'در این سن لمس بافت‌های چوب طبیعی و رنگ‌های خوراکی بدون بو، مهارت‌های اولیه حرکتی را به امن‌ترین شکل تقویت می‌کند.'
  },
  {
    key: '3-5',
    title: '۳ تا ۵ سال',
    stageName: 'کشف، تخیل و مونته‌سوری',
    emoji: '🧸',
    icon: Smile,
    accentColor: 'from-amber-400 to-orange-500',
    activeBg: 'bg-orange-500 text-white',
    borderActive: 'border-orange-500 ring-2 ring-orange-400/40',
    textBadge: 'bg-orange-100 text-orange-800',
    focusMilestone: 'هماهنگی چشم و دست، خلاقیت باز',
    pedagogicalTip: 'دوران اوج کنجکاوی و یادگیری آزمون و خطا؛ بلوک‌ها و بازی‌های حسی پایه‌های تفکر مستقل را می‌سازند.'
  },
  {
    key: '6-8',
    title: '۶ تا ۸ سال',
    stageName: 'پیش‌دبستان و منطق',
    emoji: '🧩',
    icon: Blocks,
    accentColor: 'from-emerald-400 to-teal-500',
    activeBg: 'bg-teal-500 text-white',
    borderActive: 'border-teal-500 ring-2 ring-teal-400/40',
    textBadge: 'bg-teal-100 text-teal-800',
    focusMilestone: 'حل مسئله، پازل و سازه‌های هندسی',
    pedagogicalTip: 'تقویت تمرکز، صبر و توانایی تجسم سه‌بعدی از طریق حل معماها و ساخت سازه‌های ساختنی.'
  },
  {
    key: '9+',
    title: '۹ سال به بالا',
    stageName: 'هوش و ساخت پیشرفته',
    emoji: '🚀',
    icon: Rocket,
    accentColor: 'from-purple-500 to-indigo-600',
    activeBg: 'bg-purple-600 text-white',
    borderActive: 'border-purple-600 ring-2 ring-purple-400/40',
    textBadge: 'bg-purple-100 text-purple-800',
    focusMilestone: 'تفکر استراتژیک، تمرکز عمیق و مهندسی',
    pedagogicalTip: 'اسباب‌بازی‌های چندبخشی و چالش‌برانگیز که اعتماد به نفس حل چالش‌های فکری پیچیده را شکل می‌دهند.'
  }
];

const SLIDER_STEPS: AgeGroup[] = ['all', '0-2', '3-5', '6-8', '9+'];

export const InteractiveAgeFilter: React.FC<InteractiveAgeFilterProps> = ({
  selectedAge,
  onSelectAge,
  products
}) => {
  const [viewMode, setViewMode] = useState<'tabs' | 'slider'>('tabs');

  // Compute live count of products per age group
  const countsByAge = useMemo(() => {
    const counts: Record<AgeGroup, number> = {
      'all': products.length,
      '0-2': 0,
      '3-5': 0,
      '6-8': 0,
      '9+': 0
    };

    products.forEach((p) => {
      if (counts[p.ageFilter] !== undefined) {
        counts[p.ageFilter]++;
      }
    });

    return counts;
  }, [products]);

  // Current slider index
  const currentStepIndex = Math.max(0, SLIDER_STEPS.indexOf(selectedAge));

  const currentStageMeta = useMemo(() => {
    return AGE_STAGES.find(s => s.key === selectedAge) || AGE_STAGES[0];
  }, [selectedAge]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    const newAge = SLIDER_STEPS[idx] || 'all';
    onSelectAge(newAge);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs p-5 sm:p-7 space-y-6 text-right overflow-hidden relative">
      {/* Header with Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>فیلتر هوشمند رده‌های سنی</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>انتخاب اسباب‌بازی متناسب با سن کودک شما</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
              {toPersianDigits(countsByAge[selectedAge])} اسباب‌بازی
            </span>
          </h3>
          <p className="text-xs text-slate-700">
            برای رشد متوازن ذهنی و حرکتی، اسباب‌بازی‌ها را مطابق با دوره سنی فرزندتان فیلتر نمایید.
          </p>
        </div>

        {/* View Mode Switcher (Visual Tabs vs Interactive Slider) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-stretch sm:self-auto justify-center">
          <button
            id="age-filter-mode-tabs"
            type="button"
            onClick={() => setViewMode('tabs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'tabs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>کارت‌ها و تب‌ها</span>
          </button>

          <button
            id="age-filter-mode-slider"
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-orange-500" />
            <span>اسلایدر نوار سن</span>
          </button>
        </div>
      </div>

      {/* 1. Visual Tabbed Navigation Mode */}
      {viewMode === 'tabs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {AGE_STAGES.map((stage) => {
              const isSelected = selectedAge === stage.key;
              const Icon = stage.icon;
              const count = countsByAge[stage.key];

              return (
                <button
                  key={stage.key}
                  id={`age-tab-btn-${stage.key}`}
                  type="button"
                  onClick={() => onSelectAge(stage.key)}
                  className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border transition-all text-right cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? `${stage.borderActive} bg-amber-50/50 shadow-md scale-[1.02]`
                      : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  {/* Active highlight bar on top */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  )}

                  {/* Top row: Emoji & Count badge */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-2xl sm:text-3xl filter group-hover:scale-110 transition-transform">
                      {stage.emoji}
                    </span>
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200/70 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-900'
                      }`}
                    >
                      {toPersianDigits(count)} کالا
                    </span>
                  </div>

                  {/* Middle: Age title & Stage */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-slate-500'}`} />
                      <h4 className={`text-xs sm:text-sm font-black ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                        {stage.title}
                      </h4>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium line-clamp-1">
                      {stage.stageName}
                    </div>
                  </div>

                  {/* Bottom: Milestone Chip */}
                  <div className="pt-2 border-t border-slate-100 w-full text-[10px] text-slate-600 truncate flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-orange-500' : 'bg-slate-400'}`}></span>
                    <span className="truncate">{stage.focusMilestone}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Interactive Visual Slider Track Mode */}
      {viewMode === 'slider' && (
        <div className="space-y-6 pt-2">
          {/* Slider milestone steps row */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {SLIDER_STEPS.map((stepKey, idx) => {
              const stage = AGE_STAGES.find(s => s.key === stepKey)!;
              const isSelected = selectedAge === stepKey;
              return (
                <button
                  key={stepKey}
                  type="button"
                  onClick={() => onSelectAge(stepKey)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-amber-100/70 scale-105 font-black' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{stage.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800">{stage.title}</span>
                  <span className="text-[10px] text-slate-600 hidden sm:inline">{toPersianDigits(countsByAge[stepKey])} اسباب‌بازی</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Range Input Track */}
          <div className="relative px-3 py-4">
            {/* Custom Track Background */}
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 right-0 h-full bg-gradient-to-l from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${(currentStepIndex / (SLIDER_STEPS.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Step markers dots */}
            <div className="absolute top-1/2 -translate-y-1/2 right-3 left-3 flex justify-between pointer-events-none px-1">
              {SLIDER_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    idx <= currentStepIndex
                      ? 'bg-white border-orange-500 scale-110 shadow-xs'
                      : 'bg-white border-slate-300'
                  }`}
                ></div>
              ))}
            </div>

            {/* Native range slider for smooth keyboard & touch drag interaction */}
            <input
              id="interactive-age-range-slider"
              type="range"
              min="0"
              max={SLIDER_STEPS.length - 1}
              step="1"
              value={currentStepIndex}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="انتخاب سن اسباب‌بازی"
            />
          </div>

          <div className="flex justify-between text-[11px] font-bold text-slate-600 px-3">
            <span>همه کودکان (۰ سال)</span>
            <span>نوجوان و مهندسی (۹+ سال)</span>
          </div>
        </div>
      )}

      {/* Pedagogical Child Development Tip Card for the Selected Age */}
      <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl shrink-0 mt-0.5">
            {currentStageMeta.emoji}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-900">
              <span>نکته روانشناسی رشد برای «{currentStageMeta.title} - {currentStageMeta.stageName}»:</span>
            </div>
            <p className="text-slate-700 leading-relaxed max-w-2xl">
              {currentStageMeta.pedagogicalTip}
            </p>
          </div>
        </div>

        {selectedAge !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectAge('all')}
            className="text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-white hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            نمایش همه سنین
          </button>
        )}
      </div>
    </div>
  );
};
