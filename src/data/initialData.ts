import { Product, PodcastEpisode, ParentReview, UsageAnalytics } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'toy-1',
    title: 'برج تعادل چوبی جنگلی (حیوانات راش)',
    category: 'wooden',
    categoryName: 'چوبی و طبیعت‌محور',
    ageRange: '۲ تا ۶ سال',
    ageFilter: '3-5',
    price: 485000,
    oldPrice: 590000,
    rating: 4.9,
    reviewsCount: 42,
    isPopular: true,
    isNew: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'برج تعادل حیوانات جنگلی از چوب طبیعی راش گرجستان با رنگ‌های گیاهی خوراکی و بدون هیچ‌گونه ماده سمی ساخته شده است. این اسباب‌بازی به کودک شما کمک می‌کند مهارت حفظ تعادل، تمرکز چشم و دست و شناخت حیوانات را به شیوه‌ای شاد و چالش‌برانگیز تجربه کند.',
    shortDesc: 'تقویت تعادل، هماهنگی حسی حرکتی با چوب طبیعی راش ضدحساسیت',
    features: [
      'ساخته شده از چوب راش ۱۰۰٪ طبیعی بدون پرز',
      'رنگ‌آمیزی با پیگمنت‌های آلمانی فاقد سرب و فتالات',
      'لبه‌های گرد و سنباده‌خورده با دقت دست',
      'دارای کیسه کتان طبیعی برای نگهداری و حمل آسان'
    ],
    skillsDeveloped: ['تمرکز و پایداری', 'هماهنگی دست و چشم', 'مهارت‌های حرکتی ظریف', 'صبر و حل مسئله'],
    materials: 'چوب راش طبیعی گرجستان + روغن‌های گیاهی ارگانیک',
    dimensions: '۲۴ × ۱۸ × ۶ سانتی‌متر',
    safetyCertificate: 'استاندارد ایمنی اروپا EN71 و گواهی ملی استاندارد ایران',
    viewsCount: 1420
  },
  {
    id: 'toy-2',
    title: 'مجموعه ساختنی مهندسی چرخ‌دنده‌های رنگین‌کمان',
    category: 'building',
    categoryName: 'ساختنی و مهندسی',
    ageRange: '۴ تا ۸ سال',
    ageFilter: '3-5',
    price: 620000,
    oldPrice: 750000,
    rating: 4.8,
    reviewsCount: 38,
    isPopular: true,
    isNew: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'کیت مهندسی چرخ‌دنده‌ها یک ابزار فوق‌العاده برای پرورش هوش مکانیکی و منطقی کودکان است. کودک با چیدمان آزاد چرخ‌دنده‌ها روی صفحه پایه و چرخاندن دسته اصلی، متوجه رابطه انتقال نیرو و حرکت همگام می‌شود.',
    shortDesc: 'آشنایی با قوانین مکانیک و فیزیک پایه به روش بازی عملی',
    features: [
      '۸۲ قطعه ماژولار با قابلیت اتصال در جهات گوناگون',
      'پلاستیک ABS فودگرید بسیار مقاوم در برابر ضربه',
      'دفترچه راهنمای تمام‌رنگی تصویری با ۲۵ پروژه خلاق',
      'توسعه تفکر علت و معلولی در کودکان پیش‌دبستانی'
    ],
    skillsDeveloped: ['هوش فضایی-مکانیکی', 'تفکر منطقی', 'خلاقیت در ساخت', 'حل مسئله'],
    materials: 'پلاستیک باکیفیت ABS بدون BPA',
    dimensions: '۳۰ × ۲۵ × ۸ سانتی‌متر',
    safetyCertificate: 'گواهینامه CE اروپا و تست عدم سمیت ASTM F963',
    viewsCount: 1190
  },
  {
    id: 'toy-3',
    title: 'جعبه هوش و کشف حسی مونته‌سوری (مکعب ۶ وجهی)',
    category: 'sensory',
    categoryName: 'حسی و مونته‌سوری',
    ageRange: '۱۰ ماه تا ۳ سال',
    ageFilter: '0-2',
    price: 540000,
    rating: 5.0,
    reviewsCount: 56,
    isPopular: true,
    isNew: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'طراحی شده بر مبنای فلسفه آموزشی مونته‌سوری برای کشف جهان پیرامون توسط نوزادان و خردسالان. دارای ۶ فعالیت حسی گوناگون شامل چرخ‌دنده نرم، آینه ایمن نشکن، کلید و قفل پلاستیکی ایمن، زیپ پارچه‌ای و زنگوله آرام‌بخش.',
    shortDesc: 'بهترین هدیه برای یک تا ۳ سالگی جهت تقویت کنجکاوی و حس لامسه',
    features: [
      'آینه آکریلیک مقاوم و نشکن مخصوص ایمنی نوزاد',
      'بافت‌های متنوع لمسی برای غنی‌سازی حس لامسه',
      'فاقد قطعات ریز جداشونده با قابلیت خفگی',
      'رنگ‌های ملایم پاستلی جهت عدم خستگی چشم کودک'
    ],
    skillsDeveloped: ['تقویت ادراک حسی', 'دست‌ورزی ظریف', 'کشف پدیده‌ها', 'استقلال فردی'],
    materials: 'چوب چندلای توس صیقلی + پارچه کتان ضدحساسیت',
    dimensions: '۱۵ × ۱۵ × ۱۵ سانتی‌متر',
    safetyCertificate: 'گواهی عدم وجود فتالات و رنگ بر پایه آب استاندارد جهانی',
    viewsCount: 1850
  },
  {
    id: 'toy-4',
    title: 'پازل سه‌بعدی نقشه جغرافیای کهکشان و منظومه شمسی',
    category: 'puzzle',
    categoryName: 'فکری و معمایی',
    ageRange: '۶ تا ۱۲ سال',
    ageFilter: '6-8',
    price: 395000,
    oldPrice: 470000,
    rating: 4.7,
    reviewsCount: 29,
    isPopular: false,
    isNew: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'سفری هیجان‌انگیز به دل فضا! این پازل صد قطعه‌ای همراه با ۸ سیاره برجسته چوبی و دفترچه علمی حقایق شگفت‌انگیز نجوم طراحی شده است تا ساعت‌ها سرگرمی همراه با یادگیری علمی را برای کودکان رقم بزند.',
    shortDesc: 'آموزش نجوم و منظومه شمسی با پازل لمسی و سیارات چوبی',
    features: [
      'چاپ باکیفیت و ضدخش با روکش لمینت مات ضد انعکاس',
      'سیاره‌های سه بعدی چوبی با پایه‌های مدرج',
      'پوستر بزرگ راهنمای نجومی به زبان فارسی',
      'مناسب بازی انفرادی و تیمی خانوادگی'
    ],
    skillsDeveloped: ['دانش عمومی نجوم', 'هوش فضایی', 'دقت و تمرکز دیداری', 'حافظه بلندمدت'],
    materials: 'مقوای بازیافتی فشرده چندلایه و چوب صنوبر',
    dimensions: '۵۰ × ۷۰ سانتی‌متر',
    safetyCertificate: 'استاندارد ملی دوستدار محیط زیست FSC',
    viewsCount: 930
  },
  {
    id: 'toy-5',
    title: 'عروسک ارگانیک دست‌ساز «خرس دانا، باران» با البسه تعویضی',
    category: 'dolls',
    categoryName: 'عروسک و داستان‌پردازی',
    ageRange: '۱ تا ۹ سال',
    ageFilter: '3-5',
    price: 510000,
    rating: 4.9,
    reviewsCount: 31,
    isPopular: true,
    isNew: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'باران، خرس دانای قصه‌های توی‌لند است! این عروسک تماماً از الیاف پنبه خالص ۱۰۰٪ ارگانیک و الیاف ضدحساسیت پر شده است. چهره خرس گلدوزی شده و فاقد دکمه یا پلاستیک خطرناک است؛ بنابراین حتی برای خواب نوزادان کاملاً امن است.',
    shortDesc: 'همراه صمیمی شب‌های کودک و شخصیت اصلی پادکست‌های قصه‌گویی',
    features: [
      'پارچه نخ پنبه خالص بدون هرگونه مواد نفتی یا آلرژی‌زا',
      'قابل شستشو در ماشین لباسشویی با دور ملایم',
      'همراه با ۲ دست لباس فصلی کتان قابل تعویض',
      'متصل به پادکست‌های صوتی اختصاصی خرس باران'
    ],
    skillsDeveloped: ['هوش هیجانی و همدلی', 'پرورش تخیل و قصه‌پردازی', 'آرامش عاطفی در خواب', 'مهارت بیان احساسات'],
    materials: 'کتان ارگانیک ۱۰۰٪ طبیعی + پشم شیشه ضدآلرژی گرید بهداشتی',
    dimensions: 'ارتفاع ۳۵ سانتی‌متر',
    safetyCertificate: 'گواهینامه استاندارد OEKO-TEX Standard 100',
    viewsCount: 1640
  },
  {
    id: 'toy-6',
    title: 'استودیوی کارگاهی نجار کوچولو (میز ابزار چوبی)',
    category: 'wooden',
    categoryName: 'چوبی و طبیعت‌محور',
    ageRange: '۳ تا ۷ سال',
    ageFilter: '3-5',
    price: 890000,
    oldPrice: 1100000,
    rating: 4.9,
    reviewsCount: 64,
    isPopular: true,
    isNew: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'یک میز کار کامل با اره چوبی بی‌خطر، چکش ارگونومیک، پیچ‌گوشتی، خط‌کش مدرج و ۲۴ قطعه پیچ و مهره چوبی. این اسباب‌بازی لذت ساختن و تعمیر کردن را بدون کوچکترین خطر تیز یا برنده در اختیار فرزندتان می‌گذارد.',
    shortDesc: 'تقویت احساس توانمندی و خودکارآمدی همراه با ابزارهای واقعی چوبی',
    features: [
      'پیچ و مهره‌های چوبی با رزوه دقیق و روان',
      'میز کار جمع‌وجور با کشوی نگهداری ابزار',
      'تحمل وزن بالا و ضد واژگونی',
      'رنگ‌های شاداب ضد خش و قابل تمیزکاری آسان'
    ],
    skillsDeveloped: ['هماهنگی دو دستی', 'اعتماد به نفس عملی', 'درک ابزارها و اتصالات', 'تمرکز مکانیکی'],
    materials: 'چوب چندلای راش و زبان‌گنجشک طبیعی',
    dimensions: '۳۸ × ۲۸ × ۲۲ سانتی‌متر',
    safetyCertificate: 'استاندارد ملی اسباب‌بازی ایران شماره ۱۴۴۵',
    viewsCount: 2150
  },
  {
    id: 'toy-7',
    title: 'مجموعه خمیربازی ارگانیک با عصاره میوه‌ای و شابلون‌های جنگلی',
    category: 'creative',
    categoryName: 'نقاشی و خلاقیت',
    ageRange: '۲ تا ۹ سال',
    ageFilter: '3-5',
    price: 240000,
    rating: 4.6,
    reviewsCount: 22,
    isPopular: false,
    isNew: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'خمیربازی کاملاً خوراکی تهیه شده از آرد گندم مرغوب، نمک دریا و اسانس‌های طبیعی خوراکی (توت‌فرنگی، پرتقال، نعناع، بلوبری). بدون هیچ‌گونه ماده شیمیایی نفتی، مناسب کودکانی که عادت به دهان بردن اشیا دارند.',
    shortDesc: 'خمیر بازی کاملا خوراکی و بهداشتی با شابلون‌ها و غلطک چوبی',
    features: [
      'نرم و انعطاف‌پذیر بدون سفت شدن سریع',
      'شامل ۶ رنگ شاداب با رایحه طبیعی میوه‌ها',
      'همراه با ۴ شابلون چوبی حیوانات و یک غلطک منبت‌کاری شده',
      'قابلیت پاک شدن فوری از روی فرش و لباس با آب ولرم'
    ],
    skillsDeveloped: ['دست‌ورزی و تقویت عضلات انگشتان', 'حس بویایی و تمایز رنگ‌ها', 'خلاقیت مجسمه‌سازی', 'کاهش استرس'],
    materials: 'پایه آرد گندم خوراکی، رنگ گیاهی، روغن نارگیل',
    dimensions: 'قوطی‌های ۱۰۰ گرمی (مجموع ۶۰۰ گرم)',
    safetyCertificate: 'مجوز بهداشت و سلامت سازمان غذا و دارو (سیب سلامت)',
    viewsCount: 840
  },
  {
    id: 'toy-8',
    title: 'بازی فکری استراتژیک «دژ قلمرو روباه و کلاغ»',
    category: 'puzzle',
    categoryName: 'فکری و معمایی',
    ageRange: '۷ سال به بالا',
    ageFilter: '6-8',
    price: 430000,
    rating: 4.8,
    reviewsCount: 19,
    isPopular: false,
    isNew: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'یک بازی رومیزی دو نفره اصیل بر پایه ادبیات کهن فارسی با طراحی مینیمال و متریال لوکس چوبی. قوانین ساده ولی تاکتیک‌های بی‌نهایت که هوش پیش‌بینی حرکات حریف و تصمیم‌گیری کودک را به چالش می‌کشد.',
    shortDesc: 'بازی استراتژیک خانوادگی با الهام از داستان‌های مثنوی و کلیله و دمنه',
    features: [
      'صفحه بازی تمام‌چوب تاشو مجهز به قفل آهنربایی مخفی',
      'مهره‌های تراش‌خورده با نمادهای روباه و پرنده',
      'مدت زمان بازی: ۱۵ الی ۲۵ دقیقه مهیج',
      'ایده‌آل برای دورهمی‌های آخر هفته والدین با فرزندان'
    ],
    skillsDeveloped: ['تفکر استراتژیک', 'پیش‌بینی و ریسک‌پذیری', 'پذیرش برد و باخت', 'تمرکز بلندمدت'],
    materials: 'چوب گردو و چنار فرآوری شده',
    dimensions: '۲۲ × ۲۲ × ۳ سانتی‌متر',
    safetyCertificate: 'برگزیده جشنواره ملی اسباب‌بازی کانون پرورش فکری',
    viewsCount: 1050
  }
];

export const INITIAL_PODCASTS: PodcastEpisode[] = [
  {
    id: 'pod-1',
    title: 'ماجرای خرس قهوه‌ای و چرخ‌دنده‌های گم‌شده',
    subtitle: 'قصه آموزنده درباره همکاری و حل مسئله در دل جنگل بلوط',
    duration: '۱۲:۴۵',
    durationSeconds: 765,
    narrator: 'خاله نگار و عمو پویا',
    category: 'story',
    categoryName: 'قصه شب و داستان کودک',
    coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=kids-game-112615.mp3',
    description: 'در این قسمت، باران خرس کوچولوی مهربان متوجه می‌شود که ساعت برج شهر جنگلی از کار افتاده است. او با کمک دوستانش و اسباب‌بازی‌های ساختنی سعی می‌کند علت را بیابد و ارزش صبر و کار گروهی را کشف کند.',
    transcript: `یکی بود، یکی نبود. زیر گنبد کبود، در دل یک جنگل سرسبز و قشنگ، خرس کوچولویی زندگی می‌کرد به اسم باران. باران عاشق ساختن و سرهم کردن چیزهای جدید با چوب‌های جنگلی بود.

یک روز صبح که خورشید خانم نور طلایی‌اش را روی درخت‌های بلوط پهن کرد، باران متوجه شد ساعت بزرگ بالای برج جنگل تیک‌تاک نمی‌کند! تمام پرنده‌ها و خرگوش‌ها نگران شده بودند؛ چون نمی‌دانستند وقت صبحانه کی است و کی باید به مدرسه بروند.

باران جعبه ابزار اسباب‌بازی‌اش را برداشت و با گام‌های استوار به سمت برج رفت. وقتی در ساعت را باز کرد، دید یکی از چرخ‌دنده‌های چوبی از جایش درآمده و به گوشه‌ای افتاده است. روباه باهوش و سنجاب کوچولو هم به کمک باران آمدند.

باران گفت: «تنهایی نمی‌توانم این چرخ‌دنده سنگین را سر جایش بگذارم، بیایید با هم تلاش کنیم!» 
سنجاب اهرم را گرفت، روباه با چراغ‌قوه راه را روشن کرد و باران چرخ‌دنده را در جای خودش محکم بست. با اولین چرخش، صدای دلنشین دینگ‌دانگ ساعت در تمام جنگل طنین‌انداز شد. 

درس قشنگ این قصه این بود که وقتی دست‌هایمان را به هم می‌دهیم و با همفکری تلاش می‌کنیم، هیچ مشکلی حل‌نشده باقی نمی‌ماند.`,
    targetAge: '۳ تا ۷ سال',
    playsCount: 3840,
    likesCount: 512,
    releaseDate: '۱۵ اسفند ۱۴۰۴'
  },
  {
    id: 'pod-2',
    title: 'لالایی ستاره‌های درخشان و باد ملایم',
    subtitle: 'آهنگ و کلام آرام‌بخش برای خواب راحت و رفع اضطراب شبانه',
    duration: '۱۸:۱۰',
    durationSeconds: 1090,
    narrator: 'مریم رضایی (روانشناس کودک)',
    category: 'lullaby',
    categoryName: 'لالایی و آرامش خواب',
    coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lullaby-goodnight-10777.mp3',
    description: 'موسیقی ملایم هارپ و پیانو به همراه زمزمه‌های شاعرانه که ریتم ضربان قلب و تنفس کودک را آرام کرده و زمینه یک خواب ژرف و بدون کابوس را برای کودک فراهم می‌کند.',
    transcript: `لالا لالا گل پونه،
خدا مهربونه،
ستاره توی آسمون،
چراغ راه خونه...

لالا لالا گل شب‌بو،
بخواب ای بره و آهو،
زمین آروم، هوا آروم،
دوباره قصه می‌گه قو...

چشم‌های قشنگت رو ببند کوچولوی من. به نفس‌های آرومت گوش بده؛ دم... و بازدم... 
همه اسباب‌بازی‌های مهربونت الان توی قفسه نشستن و دارن استراحت می‌کنن تا فردا دوباره با تو همبازی بشن. فرشته‌های خواب بال‌های نرم و ابریشمی‌شون رو روی سرت می‌کشن. 
شب پر از ستاره‌های نقره‌ای، شب پر از رویاهای شیرین، شبت بخیر عزیز دلم...`,
    targetAge: '۰ تا ۵ سال',
    playsCount: 6200,
    likesCount: 945,
    releaseDate: '۸ اسفند ۱۴۰۴'
  },
  {
    id: 'pod-3',
    title: 'چگونه از طریق اسباب‌بازی خلاقیت فرزندمان را شکوفا کنیم؟',
    subtitle: 'راهنمای کاربردی برای والدین و مربیان مهدکودک',
    duration: '۱۵:۲۰',
    durationSeconds: 920,
    narrator: 'دکتر علیرضا کاظمی (متخصص رشد شناختی)',
    category: 'parenting',
    categoryName: 'ویژه والدین و فرزندپروری',
    coverImage: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c3c3a44d82.mp3?filename=uplifting-day-126469.mp3',
    description: 'آیا خرید اسباب‌بازی‌های زیاد به نفع هوش کودک است؟ در این گفتگوی صمیمی بررسی می‌کنیم که چگونه اسباب‌بازی‌های بازپاسخ (Open-ended) مانند لگوها و مکعب‌های چوبی می‌توانند خلاقیت را چندین برابر افزایش دهند.',
    targetAge: 'والدین کودکان ۰ تا ۱۰ سال',
    playsCount: 2950,
    likesCount: 420,
    releaseDate: '۲۸ بهمن ۱۴۰۴'
  },
  {
    id: 'pod-4',
    title: 'سفر علمی به درون سیاره‌ها و کهکشان اسباب‌بازی‌ها',
    subtitle: 'کشف راز و رمزهای جهان علم با لحنی شاد و کودکانه',
    duration: '۱۴:۰۵',
    durationSeconds: 845,
    narrator: 'کیوان رحیمی',
    category: 'educational',
    categoryName: 'آموزشی و کنجکاوی علمی',
    coverImage: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a77d54.mp3?filename=fun-and-quirky-10291.mp3',
    description: 'در این پادکست همراه با صداگذاری‌های بامزه فضایی، به همراه فضاپیمای چوبی کوچولو به ملاقات مریخ، حلقه‌های زحل و ستارگان چشمک‌زن می‌رویم.',
    targetAge: '۵ تا ۱۰ سال',
    playsCount: 2180,
    likesCount: 310,
    releaseDate: '۱۸ بهمن ۱۴۰۴'
  }
];

export const INITIAL_REVIEWS: ParentReview[] = [
  {
    id: 'rev-1',
    productId: 'toy-1',
    productName: 'برج تعادل چوبی جنگلی',
    parentName: 'سارا حسینی (مادر کیان ۴ ساله)',
    childAge: '۴ سال',
    rating: 5,
    date: '۲ روز پیش',
    comment: 'بسیار از کیفیت چوب و سنباده‌کاری شگفت‌زده شدم. هیچ لبه تیزی ندارد و رنگش اصلاً بوی رنگ شیمیایی نمی‌دهد. پسرم ساعت‌ها با تمرکز حیوانات را روی هم می‌چیند و بعد از هر بار افتادن دوباره تلاش می‌کند.',
    approved: true,
    helpfulCount: 28,
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'toy-3',
    productName: 'جعبه هوش و کشف حسی مونته‌سوری',
    parentName: 'مهندس محمدرضا شریفی',
    childAge: '۱.۵ سال',
    rating: 5,
    date: '۵ روز پیش',
    comment: 'من به عنوان پدر همیشه نگران مواد سمی در اسباب‌بازی‌های خارجی پلاستیکی بودم. این محصول ایرانی با چوب طبیعی کیفیت فوق‌العاده‌ای دارد. دخترم عاشق چرخ‌دنده‌ها و آینه نشکن آن شده.',
    approved: true,
    helpfulCount: 19,
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'toy-2',
    productName: 'مجموعه ساختنی چرخ‌دنده‌های رنگین‌کمان',
    parentName: 'فاطمه احمدی (مادر دوقلوها)',
    childAge: '۵ سال',
    rating: 5,
    date: '۱ هفته پیش',
    comment: 'دوقلوهای من معمولاً سر اسباب‌بازی دعوا می‌کردند اما قطعات زیاد این بسته باعث شد با همدیگر یک قلعه چرخشی بسازند! پادکست داستانی شرکت هم همراه بسیار خوبی برای بازی‌شان است.',
    approved: true,
    helpfulCount: 14,
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'toy-5',
    productName: 'عروسک ارگانیک باران خرس دانا',
    parentName: 'الهام مقدسی',
    childAge: '۲ سال',
    rating: 4,
    date: '۱۰ روز پیش',
    comment: 'جنس پنبه‌ای و فوق‌العاده لطیفی دارد. برای دخترم که به الیاف مصنوعی حساسیت پوستی داشت بهترین انتخاب بود. هر شب با قصه خرس باران می‌خوابد.',
    approved: true,
    helpfulCount: 9,
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'toy-6',
    productName: 'استودیوی کارگاهی نجار کوچولو',
    parentName: 'دکتر پژمان نوری',
    childAge: '۴ سال',
    rating: 5,
    date: '۲ هفته پیش',
    comment: 'دقت در ساخت پیچ و مهره‌های چوبی کم‌نظیر است. هم پسرم و هم دخترم عاشق بستن پیچ‌ها با آچار هستند. هماهنگی دست و چشم را به وضوح در فرزندم تقویت کرده است.',
    approved: true,
    helpfulCount: 32,
    verifiedPurchase: true
  }
];

export const INITIAL_ANALYTICS: UsageAnalytics = {
  totalVisits: 28450,
  totalPodcastListens: 15170,
  totalProductViews: 9240,
  totalReviews: 248,
  weeklyVisits: [
    { day: 'شنبه', visits: 3820, listens: 2150 },
    { day: 'یکشنبه', visits: 4100, listens: 2310 },
    { day: 'دوشنبه', visits: 3950, listens: 2040 },
    { day: 'سه‌شنبه', visits: 4420, listens: 2680 },
    { day: 'چهارشنبه', visits: 4890, listens: 2990 },
    { day: 'پنج‌شنبه', visits: 5600, listens: 3450 },
    { day: 'جمعه', visits: 6200, listens: 4100 }
  ],
  categoryPopularity: [
    { name: 'چوبی و طبیعت‌محور', percentage: 38, color: '#f59e0b' },
    { name: 'حسی و مونته‌سوری', percentage: 26, color: '#ec4899' },
    { name: 'ساختنی و مهندسی', percentage: 20, color: '#3b82f6' },
    { name: 'فکری و معمایی', percentage: 16, color: '#10b981' }
  ]
};
