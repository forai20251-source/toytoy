import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Headphones, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Users, 
  Eye, 
  Star, 
  Save, 
  X,
  Play,
  Pause,
  AlertTriangle,
  RefreshCw,
  Database,
  Server,
  HardDrive,
  Download,
  Upload,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Music,
  Image as ImageIcon,
  FileAudio,
  Loader2,
  Link as LinkIcon,
  FileText,
  BookOpen,
  AlignRight,
  LogOut,
  PhoneCall
} from 'lucide-react';
import { 
  Product, 
  PodcastEpisode, 
  ParentReview, 
  UsageAnalytics, 
  ProductCategory, 
  AgeGroup,
  AdminUser,
  AdminPermission
} from '../../types';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { UserManagementTab } from '../admin/UserManagementTab';
import { hasPermission } from '../../lib/authService';

interface AdminPanelPageProps {
  products: Product[];
  podcasts: PodcastEpisode[];
  reviews: ParentReview[];
  analytics: UsageAnalytics;
  currentUser?: AdminUser | null;
  onLogout?: () => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddPodcast: (podcast: PodcastEpisode) => void;
  onUpdatePodcast: (podcast: PodcastEpisode) => void;
  onDeletePodcast: (id: string) => void;
  onApproveReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onResetSampleData: () => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  products,
  podcasts,
  reviews,
  analytics,
  currentUser,
  onLogout,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddPodcast,
  onUpdatePodcast,
  onDeletePodcast,
  onApproveReview,
  onDeleteReview,
  onResetSampleData
}) => {
  const [deployMethod, setDeployMethod] = useState<'docker' | 'pm2' | 'nginx'>('docker');

  // RBAC Permission checks
  const canViewAnalytics = !currentUser || hasPermission(currentUser, 'view_analytics');
  const canManageProducts = !currentUser || hasPermission(currentUser, 'manage_products');
  const canManagePodcasts = !currentUser || hasPermission(currentUser, 'manage_podcasts');
  const canManageReviews = !currentUser || hasPermission(currentUser, 'moderate_reviews');
  const canViewUsers = !currentUser || hasPermission(currentUser, 'manage_users');
  const canViewSettings = !currentUser || hasPermission(currentUser, 'manage_system');

  // Determine initial accessible tab
  const getInitialTab = (): 'analytics' | 'products' | 'podcasts' | 'reviews' | 'self-host' | 'users' => {
    if (canViewAnalytics) return 'analytics';
    if (canManageProducts) return 'products';
    if (canManagePodcasts) return 'podcasts';
    if (canManageReviews) return 'reviews';
    if (canViewUsers) return 'users';
    if (canViewSettings) return 'self-host';
    return 'analytics';
  };

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'podcasts' | 'reviews' | 'self-host' | 'users'>(getInitialTab());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    status?: string;
    mode?: string;
    database?: {
      type?: string;
      mysql?: {
        connected: boolean;
        host: string;
        port: number;
        database: string;
        user: string;
        lastError?: string | null;
      };
      path?: string;
      productsCount?: number;
      podcastsCount?: number;
      reviewsCount?: number;
    };
    error?: string;
  } | null>(null);

  const [mysqlSyncLoading, setMysqlSyncLoading] = useState(false);
  const [mysqlSyncMessage, setMysqlSyncMessage] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const checkLiveServer = async () => {
    setHealthLoading(true);
    setHealthResult(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`کد خطا: ${res.status}`);
      const data = await res.json();
      setHealthResult(data);
    } catch (err: any) {
      setHealthResult({ error: err.message || 'عدم دسترسی به سرور Express' });
    } finally {
      setHealthLoading(false);
    }
  };

  const handleSyncMysql = async () => {
    setMysqlSyncLoading(true);
    setMysqlSyncMessage(null);
    try {
      const res = await fetch('/api/mysql/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMysqlSyncMessage(data.message || 'همگام‌سازی اطلاعات با MySQL با موفقیت انجام شد!');
        checkLiveServer();
      } else {
        setMysqlSyncMessage(`خطا: ${data.error || 'سرور MySQL در دسترس نیست'}`);
      }
    } catch (err: any) {
      setMysqlSyncMessage(`خطا در اتصال به سرور: ${err?.message}`);
    } finally {
      setMysqlSyncLoading(false);
    }
  };

  const handleDownloadSqlDump = () => {
    window.location.href = '/api/mysql/export-sql';
  };

  const handleDownloadBackupJson = () => {
    const backupData = {
      products,
      podcasts,
      reviews,
      analytics,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toyland-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadBackupJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.products || !Array.isArray(parsed.products)) {
          alert('فرمت فایل پشتیبان نامعتبر است.');
          return;
        }
        const res = await fetch('/api/db/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
        if (res.ok) {
          alert('اطلاعات پایگاه‌داده با موفقیت بازیابی شد!');
          window.location.reload();
        } else {
          alert('خطا در ذخیره‌سازی داده روی سرور محلی.');
        }
      } catch {
        alert('فایل پشتیبان ساختار JSON معتبر ندارد.');
      }
    };
    reader.readAsText(file);
  };

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'wooden' as ProductCategory,
    categoryName: 'چوبی و طبیعت‌محور',
    ageRange: '۳ تا ۵ سال',
    ageFilter: '3-5' as '0-2' | '3-5' | '6-8' | '9+',
    price: 350000,
    isCustomPrice: false,
    customPriceText: 'برای استعلام قیمت تماس بگیرید',
    shortDesc: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    materials: 'چوب راش طبیعی با رنگ ارگانیک',
    dimensions: '۲۰ × ۱۵ × ۵ سانتی‌متر',
    skills: 'خلاقیت، دست‌ورزی، تمرکز',
    safetyCertificate: 'استاندارد EN71 اروپا'
  });

  // Podcast Modal State
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<PodcastEpisode | null>(null);
  const [podcastForm, setPodcastForm] = useState({
    title: '',
    subtitle: '',
    narrator: 'خاله مریم',
    category: 'story' as 'story' | 'educational' | 'parenting' | 'lullaby',
    categoryName: 'قصه شب و داستان کودک',
    duration: '۱۰:۱۵',
    durationSeconds: 615,
    coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=kids-game-112615.mp3',
    description: '',
    transcript: '',
    targetAge: '۳ تا ۶ سال'
  });

  // Podcast Media Upload States
  const [podcastAudioSourceType, setPodcastAudioSourceType] = useState<'upload' | 'url'>('upload');
  const [podcastImageSourceType, setPodcastImageSourceType] = useState<'upload' | 'url'>('upload');
  
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [audioFileInfo, setAudioFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [isAudioDragging, setIsAudioDragging] = useState(false);
  
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageFileInfo, setImageFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [isImageDragging, setIsImageDragging] = useState(false);

  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const pendingCount = reviews.filter(r => !r.approved).length;

  // Open Product Modal
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'wooden',
      categoryName: 'چوبی و طبیعت‌محور',
      ageRange: '۳ تا ۵ سال',
      ageFilter: '3-5',
      price: 380000,
      isCustomPrice: false,
      customPriceText: 'برای استعلام قیمت تماس بگیرید',
      shortDesc: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      materials: 'چوب راش طبیعی با رنگ خوراکی',
      dimensions: '۲۰ × ۲۰ × ۵ سانتی‌متر',
      skills: 'تمرکز، هماهنگی چشم و دست',
      safetyCertificate: 'استاندارد ایمنی EN71'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      category: prod.category,
      categoryName: prod.categoryName,
      ageRange: prod.ageRange,
      ageFilter: prod.ageFilter,
      price: prod.price,
      isCustomPrice: Boolean(prod.isCustomPrice),
      customPriceText: prod.customPriceText || 'برای استعلام قیمت تماس بگیرید',
      shortDesc: prod.shortDesc,
      description: prod.description,
      image: prod.image,
      materials: prod.materials,
      dimensions: prod.dimensions,
      skills: prod.skillsDeveloped.join('، '),
      safetyCertificate: prod.safetyCertificate
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = productForm.skills.split('،').map(s => s.trim()).filter(Boolean);

    const categoryMap: Record<ProductCategory, string> = {
      all: 'همه',
      wooden: 'چوبی و طبیعت‌محور',
      building: 'ساختنی و مهندسی',
      sensory: 'حسی و مونته‌سوری',
      puzzle: 'فکری و معمایی',
      dolls: 'عروسک و داستان‌پردازی',
      creative: 'نقاشی و خلاقیت'
    };

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        title: productForm.title,
        category: productForm.category,
        categoryName: categoryMap[productForm.category] || 'سایر',
        ageRange: productForm.ageRange,
        ageFilter: productForm.ageFilter,
        price: Number(productForm.price),
        isCustomPrice: productForm.isCustomPrice,
        customPriceText: productForm.isCustomPrice ? (productForm.customPriceText || 'برای استعلام قیمت تماس بگیرید') : undefined,
        shortDesc: productForm.shortDesc,
        description: productForm.description,
        image: productForm.image,
        materials: productForm.materials,
        dimensions: productForm.dimensions,
        skillsDeveloped: skillsList.length ? skillsList : ['خلاقیت و رشد فکری'],
        safetyCertificate: productForm.safetyCertificate
      });
    } else {
      const newId = `toy-${Date.now()}`;
      onAddProduct({
        id: newId,
        title: productForm.title,
        category: productForm.category,
        categoryName: categoryMap[productForm.category] || 'سایر',
        ageRange: productForm.ageRange,
        ageFilter: productForm.ageFilter,
        price: Number(productForm.price),
        isCustomPrice: productForm.isCustomPrice,
        customPriceText: productForm.isCustomPrice ? (productForm.customPriceText || 'برای استعلام قیمت تماس بگیرید') : undefined,
        shortDesc: productForm.shortDesc,
        description: productForm.description,
        image: productForm.image,
        gallery: [productForm.image],
        features: [
          'چوب راش طبیعی با رنگ بدون بو',
          'لبه‌های ایمن و صیقلی',
          'ساخت کارخانه توی‌لند با ضمانت سلامت'
        ],
        skillsDeveloped: skillsList.length ? skillsList : ['خلاقیت و رشد فکری'],
        materials: productForm.materials,
        dimensions: productForm.dimensions,
        safetyCertificate: productForm.safetyCertificate,
        inStock: true,
        rating: 5.0,
        reviewsCount: 1,
        isNew: true,
        viewsCount: 1
      });
    }

    setIsProductModalOpen(false);
  };

  // Open Podcast Modal
  const openNewPodcastModal = () => {
    setEditingPodcast(null);
    setPodcastForm({
      title: '',
      subtitle: '',
      narrator: 'خاله نگار',
      category: 'story',
      categoryName: 'قصه شب و داستان کودک',
      duration: '۰۰:۰۰',
      durationSeconds: 0,
      coverImage: '',
      audioUrl: '',
      description: '',
      transcript: '',
      targetAge: '۳ تا ۷ سال'
    });
    setPodcastAudioSourceType('upload');
    setPodcastImageSourceType('upload');
    setAudioFileInfo(null);
    setImageFileInfo(null);
    setAudioUploadError(null);
    setImageUploadError(null);
    setIsPodcastModalOpen(true);
  };

  const openEditPodcastModal = (pod: PodcastEpisode) => {
    setEditingPodcast(pod);
    setPodcastForm({
      title: pod.title,
      subtitle: pod.subtitle,
      narrator: pod.narrator,
      category: pod.category,
      categoryName: pod.categoryName,
      duration: pod.duration,
      durationSeconds: pod.durationSeconds,
      coverImage: pod.coverImage,
      audioUrl: pod.audioUrl,
      description: pod.description,
      transcript: pod.transcript || '',
      targetAge: pod.targetAge
    });
    setPodcastAudioSourceType(pod.audioUrl?.startsWith('/uploads') ? 'upload' : 'url');
    setPodcastImageSourceType(pod.coverImage?.startsWith('/uploads') ? 'upload' : 'url');
    setAudioFileInfo(pod.audioUrl ? { name: pod.audioUrl.split('/').pop() || 'فایل صوتی پادکست', size: 'سرور توی‌لند' } : null);
    setImageFileInfo(pod.coverImage ? { name: pod.coverImage.split('/').pop() || 'تصویر کاور', size: 'سرور توی‌لند' } : null);
    setAudioUploadError(null);
    setImageUploadError(null);
    setIsPodcastModalOpen(true);
  };

  const handleAudioFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|aac|flac)$/i)) {
      setAudioUploadError('فرمت فایل صوتی نامعتبر است. لطفاً فایل صوتی (MP3, WAV, M4A, OGG) انتخاب کنید.');
      return;
    }
    if (file.size > 60 * 1024 * 1024) {
      setAudioUploadError('حجم فایل صوتی نباید بیشتر از ۶۰ مگابایت باشد.');
      return;
    }

    setAudioUploadError(null);
    setIsAudioUploading(true);

    // Auto-calculate duration using Audio element
    try {
      const audioEl = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audioEl.src = objectUrl;
      audioEl.onloadedmetadata = () => {
        const sec = Math.round(audioEl.duration);
        if (sec && !isNaN(sec) && sec > 0) {
          const m = Math.floor(sec / 60);
          const s = sec % 60;
          const durStr = `${toPersianDigits(String(m).padStart(2, '0'))}:${toPersianDigits(String(s).padStart(2, '0'))}`;
          setPodcastForm(prev => ({
            ...prev,
            duration: durStr,
            durationSeconds: sec
          }));
        }
        URL.revokeObjectURL(objectUrl);
      };
    } catch (err) {
      console.warn('Could not read audio metadata:', err);
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            fileData: base64Data,
            type: 'audio'
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setPodcastForm(prev => ({ ...prev, audioUrl: data.url }));
          setAudioFileInfo({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} مگابایت`
          });
        } else {
          setAudioUploadError(data.error || 'خطا در بارگذاری فایل صوتی به سرور');
        }
      } catch (err: any) {
        setAudioUploadError(`خطای شبکه: ${err?.message || 'ارتباط با سرور برقرار نشد'}`);
      } finally {
        setIsAudioUploading(false);
      }
    };
    reader.onerror = () => {
      setAudioUploadError('خطا در خواندن فایل از حافظه');
      setIsAudioUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      setImageUploadError('فرمت تصویر نامعتبر است. لطفاً یکی از فرمت‌های JPG, PNG, WebP را انتخاب کنید.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setImageUploadError('حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد.');
      return;
    }

    setImageUploadError(null);
    setIsImageUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            fileData: base64Data,
            type: 'cover'
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setPodcastForm(prev => ({ ...prev, coverImage: data.url }));
          setImageFileInfo({
            name: file.name,
            size: `${(file.size / 1024).toFixed(0)} کیلوبایت`
          });
        } else {
          setImageUploadError(data.error || 'خطا در بارگذاری تصویر کاور');
        }
      } catch (err: any) {
        setImageUploadError(`خطای شبکه: ${err?.message || 'ارتباط با سرور برقرار نشد'}`);
      } finally {
        setIsImageUploading(false);
      }
    };
    reader.onerror = () => {
      setImageUploadError('خطا در خواندن فایل تصویر');
      setIsImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePodcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catMap: Record<string, string> = {
      story: 'قصه شب و داستان کودک',
      lullaby: 'لالایی و آرامش خواب',
      parenting: 'ویژه والدین و فرزندپروری',
      educational: 'آموزشی و کنجکاوی علمی'
    };

    if (editingPodcast) {
      onUpdatePodcast({
        ...editingPodcast,
        title: podcastForm.title,
        subtitle: podcastForm.subtitle,
        narrator: podcastForm.narrator,
        category: podcastForm.category,
        categoryName: catMap[podcastForm.category] || 'سایر',
        duration: podcastForm.duration,
        coverImage: podcastForm.coverImage,
        audioUrl: podcastForm.audioUrl,
        description: podcastForm.description,
        transcript: podcastForm.transcript || '',
        targetAge: podcastForm.targetAge
      });
    } else {
      const newPodId = `pod-${Date.now()}`;
      onAddPodcast({
        id: newPodId,
        title: podcastForm.title,
        subtitle: podcastForm.subtitle,
        narrator: podcastForm.narrator,
        category: podcastForm.category,
        categoryName: catMap[podcastForm.category] || 'سایر',
        duration: podcastForm.duration,
        durationSeconds: podcastForm.durationSeconds,
        coverImage: podcastForm.coverImage,
        audioUrl: podcastForm.audioUrl,
        description: podcastForm.description,
        transcript: podcastForm.transcript || '',
        targetAge: podcastForm.targetAge,
        playsCount: 1,
        likesCount: 0,
        releaseDate: 'امروز'
      });
    }
    setIsPodcastModalOpen(false);
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    if (reviewFilter === 'pending') return !r.approved;
    if (reviewFilter === 'approved') return r.approved;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-[36px] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>پنل اختصاصی تیم کارخانه توی‌لند</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>دیتابیس ابری متصل و آنلاین</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            سامانه مدیریت محتوا، پادکست‌ها و آمار استفاده
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            بارگذاری آسان اسباب‌بازی‌های جدید، فایل‌های صوتی، بررسی دیدگاه‌های والدین و رصد ترافیک.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-2xl">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentUser.fullName}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    {currentUser.roleName || currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">@{currentUser.username}</div>
              </div>
            </div>
          )}

          {canViewSettings && (
            <button
              onClick={onResetSampleData}
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
              title="بازنشانی اطلاعات نمونه اولیه"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>بازنشانی نمونه‌ها</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
              title="خروج از حساب مدیریت"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-2xl shadow-xs gap-2">
        {canViewAnalytics && (
          <button
            id="admin-tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>آمار و میزان استفاده</span>
          </button>
        )}

        {canManageProducts && (
          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>مدیریت محصولات ({toPersianDigits(products.length)})</span>
          </button>
        )}

        {canManagePodcasts && (
          <button
            id="admin-tab-podcasts"
            onClick={() => setActiveTab('podcasts')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'podcasts'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>فایل‌های صوتی و پادکست ({toPersianDigits(podcasts.length)})</span>
          </button>
        )}

        {canManageReviews && (
          <button
            id="admin-tab-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>نظرات والدین ({toPersianDigits(reviews.length)})</span>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {toPersianDigits(pendingCount)} در انتظار
              </span>
            )}
          </button>
        )}

        {canViewUsers && (
          <button
            id="admin-tab-users"
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>مدیریت کاربران و نقش‌ها</span>
          </button>
        )}

        {canViewSettings && (
          <button
            id="admin-tab-self-host"
            onClick={() => setActiveTab('self-host')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'self-host'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>سرور شخصی و دیتابیس</span>
          </button>
        )}
      </div>

      {/* Tab 1: Analytics & Usage Stats */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold">کل بازدیدهای سایت</span>
                <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {toPersianDigits(analytics.totalVisits.toLocaleString())}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+۱۲٪ رشد نسبت به هفته گذشته</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold">دفعات پخش پادکست‌ها</span>
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                  <Headphones className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {toPersianDigits(analytics.totalPodcastListens.toLocaleString())}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>محبوب‌ترین زمان: ساعت ۲۱ تا ۲۳ شب</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold">مشاهده کاتالوگ اسباب‌بازی</span>
                <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {toPersianDigits(analytics.totalProductViews.toLocaleString())}
              </div>
              <div className="text-[11px] text-slate-700">
                پربازدیدترین: رده سنی ۳ تا ۵ سال
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold">دیدگاه‌های ثبت‌شده والدین</span>
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {toPersianDigits(analytics.totalReviews)}
              </div>
              <div className="text-[11px] text-amber-700 font-bold">
                میانگین رضایت: ۴.۹ از ۵ ستاره
              </div>
            </div>
          </div>

          {/* Weekly Interactive Bar Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  نمودار هفتگی بازدید سایت و شنیدن پادکست‌ها
                </h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  مقایسه میزان فعالیت کاربران در روزهای هفته
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-orange-500"></span>
                  بازدید صفحات
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-400"></span>
                  پخش پادکست
                </span>
              </div>
            </div>

            {/* Custom high performance visual bar chart */}
            <div className="pt-6 grid grid-cols-7 gap-2 sm:gap-6 items-end h-64 border-b border-slate-200 pb-2">
              {analytics.weeklyVisits.map((item, idx) => {
                const maxVisits = 6500;
                const visitHeight = Math.round((item.visits / maxVisits) * 100);
                const listenHeight = Math.round((item.listens / maxVisits) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                      {/* Visits Bar */}
                      <div 
                        className="w-4 sm:w-8 bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110 relative"
                        style={{ height: `${visitHeight}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                          {toPersianDigits(item.visits)}
                        </span>
                      </div>
                      {/* Podcast Listens Bar */}
                      <div 
                        className="w-4 sm:w-8 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110 relative"
                        style={{ height: `${listenHeight}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                          {toPersianDigits(item.listens)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Popularity Share */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">
                سهم دسته‌بندی‌ها از علاقه کاربران
              </h3>
              <div className="space-y-3">
                {analytics.categoryPopularity.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{cat.name}</span>
                      <span>{toPersianDigits(cat.percentage)}٪</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700" 
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top viewed toy products */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">
                محبوب‌ترین اسباب‌بازی‌های هفته جاری
              </h3>
              <div className="space-y-3">
                {products.slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px]">
                        {toPersianDigits(idx + 1)}
                      </span>
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-[200px]">{p.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">{toPersianDigits(p.viewsCount)} بازدید</span>
                      <span className="font-bold text-orange-600">
                        {p.isCustomPrice && p.customPriceText ? p.customPriceText : formatToman(p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-amber-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">فهرست اسباب‌بازی‌های شرکت</h3>
              <p className="text-xs text-slate-700">مدیریت قیمت، وضعیت موجودی و مشخصات اسباب‌بازی‌ها</p>
            </div>
            <button
              id="admin-add-product-btn"
              onClick={openNewProductModal}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن اسباب‌بازی جدید</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-amber-50/70 border-b border-amber-200 text-slate-700 font-extrabold">
                  <tr>
                    <th className="p-4">تصویر و عنوان اسباب‌بازی</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">رده سنی</th>
                    <th className="p-4">قیمت کارخانه</th>
                    <th className="p-4">وضعیت موجودی</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={prod.image} 
                          alt={prod.title} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{prod.title}</div>
                          <div className="text-[11px] text-slate-600">{prod.materials}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-medium">
                          {prod.categoryName}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-800">{prod.ageRange}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {prod.isCustomPrice && prod.customPriceText ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                            <PhoneCall className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>{prod.customPriceText}</span>
                          </span>
                        ) : (
                          formatToman(prod.price)
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => onUpdateProduct({ ...prod, inStock: !prod.inStock })}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                            prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.inStock ? 'موجود در انبار' : 'ناموجود'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title="ویرایش"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`آیا از حذف "${prod.title}" اطمینان دارید؟`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Podcasts & Audio Management */}
      {activeTab === 'podcasts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-amber-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">آرشیو پادکست‌ها و قصه‌های صوتی</h3>
              <p className="text-xs text-slate-700">بارگذاری، ویرایش و مدیریت پخش پادکست‌های رادیو کودک</p>
            </div>
            <button
              id="admin-add-podcast-btn"
              onClick={openNewPodcastModal}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن پادکست / قصه صوتی جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {podcasts.map((podcast) => (
              <div 
                key={podcast.id} 
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4"
              >
                <img
                  src={podcast.coverImage}
                  alt={podcast.title}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      {podcast.categoryName}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">{toPersianDigits(podcast.duration)}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 truncate">{podcast.title}</h4>
                  <p className="text-xs text-slate-700">گوینده: {podcast.narrator}</p>
                  <p className="text-[11px] text-slate-600">شنوندگان: {toPersianDigits(podcast.playsCount)} بار</p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-600">{podcast.targetAge}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditPodcastModal(podcast)}
                        className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer"
                        title="ویرایش"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`آیا از حذف پادکست "${podcast.title}" مطمئن هستید؟`)) {
                            onDeletePodcast(podcast.id);
                          }
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Parent Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-amber-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">مدیریت و نظارت بر دیدگاه‌های والدین</h3>
              <p className="text-xs text-slate-700">بررسی نظرات ارسالی از صفحه محصول، تایید یا حذف نظر</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  reviewFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                همه ({toPersianDigits(reviews.length)})
              </button>
              <button
                onClick={() => setReviewFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  reviewFilter === 'pending' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                در انتظار تایید ({toPersianDigits(pendingCount)})
              </button>
              <button
                onClick={() => setReviewFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  reviewFilter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                تایید شده‌ها
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                className={`p-5 rounded-3xl bg-white border transition-all ${
                  rev.approved ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                      {rev.parentName[0]}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{rev.parentName}</h4>
                      <p className="text-xs text-slate-700">برای اسباب‌بازی: <span className="text-orange-600 font-bold">{rev.productName}</span> • سن کودک: {rev.childAge}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      rev.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {rev.approved ? 'تایید و منتشر شده' : 'در انتظار بررسی'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-600">تاریخ: {rev.date}</span>
                  <div className="flex items-center gap-2">
                    {!rev.approved && (
                      <button
                        onClick={() => onApproveReview(rev.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>تایید و انتشار</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('آیا از حذف این دیدگاه مطمئن هستید؟')) {
                          onDeleteReview(rev.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      <span>حذف نظر</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Self-Hosted Server & Database Management */}
      {activeTab === 'self-host' && (
        <div className="space-y-8">
          {/* Top Banner */}
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                پایگاه‌داده انتخابی: MySQL 8.0 (آماده استقرار)
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                100% On-Premises • مستقل و بدون نیاز به اینترنت خارجی
              </span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                اجرای کامل برنامه (وب‌سایت + پایگاه‌داده MySQL) روی سرور اختصاصی
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
                برنامه به طور کامل به پایگاه‌داده رابطه‌ای <span className="text-amber-400 font-bold">MySQL 8.0</span> با انکودینگ پیشرفته <code className="bg-slate-950/60 px-2 py-0.5 rounded text-amber-300" dir="ltr">utf8mb4_unicode_ci</code> مجهز شده است. علاوه بر فایل پیکربندی کانتینر داکر، اسکریپت اولیه دیتابیس در فایل <code className="bg-slate-950/60 px-2 py-0.5 rounded text-emerald-300" dir="ltr">init-mysql.sql</code> و درایور مستقیم <code className="bg-slate-950/60 px-2 py-0.5 rounded text-indigo-300" dir="ltr">mysql2</code> روی سرور پیاده‌سازی شده است.
              </p>
            </div>

            {/* Live Diagnostic & Health Check */}
            <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={checkLiveServer}
                  disabled={healthLoading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 hover:text-black font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
                  <span>{healthLoading ? 'در حال پینگ وضعیت...' : 'تست اتصال زنده به سرور و وضعیت MySQL'}</span>
                </button>
              </div>

              {healthResult && (
                <div className={`text-xs px-3.5 py-2 rounded-xl border flex items-center gap-2 ${
                  healthResult.error 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : healthResult.database?.mysql?.connected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {healthResult.error ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>{healthResult.error}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>
                        نوع دیتابیس فعلی: <b>{healthResult.database?.type}</b> | وضعیت اتصال MySQL:{' '}
                        {healthResult.database?.mysql?.connected ? (
                          <b className="text-emerald-400">متصل (آنلاین)</b>
                        ) : (
                          <b className="text-amber-300">در انتظار اجرای سرویس MySQL سرور (فعلاً فایل دائم فعال است)</b>
                        )}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MySQL Dedicated Control & Sync Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
                    🐬
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    مدیریت و کنترل پایگاه‌داده MySQL (toyland_db)
                  </h3>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                    MySQL 8.0 & MariaDB Compatible
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  اطلاعات اتصال، انتقال داده‌ها بین فایل دائم و MySQL، و دریافت خروجی استاندارد SQL جهت ایمپورت به phpMyAdmin یا کنسول لینوکس.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSyncMysql}
                  disabled={mysqlSyncLoading}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${mysqlSyncLoading ? 'animate-spin' : ''}`} />
                  <span>{mysqlSyncLoading ? 'در حال همگام‌سازی...' : 'همگام‌سازی فوری با MySQL'}</span>
                </button>

                <button
                  onClick={handleDownloadSqlDump}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود اسکریپت خروجی MySQL (.sql)</span>
                </button>
              </div>
            </div>

            {mysqlSyncMessage && (
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{mysqlSyncMessage}</span>
              </div>
            )}

            {/* Connection Credentials Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">آدرس سرور MySQL (Host)</span>
                <span className="text-sm font-mono font-black text-slate-800" dir="ltr">
                  {healthResult?.database?.mysql?.host || 'mysql (در داکر) / localhost'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">پورت پیش‌فرض (Port)</span>
                <span className="text-sm font-mono font-black text-slate-800" dir="ltr">3306</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">نام پایگاه‌داده (Database)</span>
                <span className="text-sm font-mono font-black text-indigo-700" dir="ltr">toyland_db</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">کدگذاری زبان و اموجی</span>
                <span className="text-sm font-mono font-black text-emerald-700" dir="ltr">utf8mb4_unicode_ci</span>
              </div>
            </div>

            {/* MySQL Tables Schema Summary */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>جدول‌های ۵ گانه ساخته شده در MySQL:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-mono font-black text-indigo-900" dir="ltr">1. products</div>
                  <div className="text-[11px] text-slate-600 mt-1">شناسه، نام اسباب‌بازی، قیمت، رده سنی، صوت، عکس، ابعاد و اهداف رشدی</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-mono font-black text-indigo-900" dir="ltr">2. podcasts</div>
                  <div className="text-[11px] text-slate-600 mt-1">شناسه، عنوان داستان صوتی، گوینده، لینک صوت MP3، متن ترانه، تعداد پخش</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-mono font-black text-indigo-900" dir="ltr">3. reviews</div>
                  <div className="text-[11px] text-slate-600 mt-1">دیدگاه والدین، سن کودک، امتیاز ۵ ستاره، متن نظر و تایید خرید</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-mono font-black text-indigo-900" dir="ltr">4. analytics</div>
                  <div className="text-[11px] text-slate-600 mt-1">آمار کل بازدیدها، صوت‌های گوش داده شده، تحلیل گروه‌های سنی پرطرفدار</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-mono font-black text-indigo-900" dir="ltr">5. messages</div>
                  <div className="text-[11px] text-slate-600 mt-1">پیام‌های ارسال شده توسط والدین از طریق فرم تماس با پشتیبانی</div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture 3-Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">۱. وب و سرور فول‌استک</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                فرانت‌اند و بک‌اند به صورت بهینه در قالب یک سرور واحد بر روی پورت <b>3000</b> اجرا می‌شوند و بدون وابستگی به پراکسی خارجی به درخواست‌های کاربران پاسخ می‌دهند.
              </p>
              <div className="pt-2 text-[11px] text-amber-700 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                پورت پیش‌فرض: 3000 • هماهنگ با Nginx Reverse Proxy
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">۲. پایگاه‌داده MySQL اختصاصی</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                تمام داده‌ها در دیتابیس استاندارد <b>MySQL</b> ذخیره می‌شوند. همچنین در صورت قطعی موقت دیتابیس، سیستم با استفاده از کش خودکار دیسک مانع از قطع شدن دسترسی کاربران می‌شود.
              </p>
              <div className="pt-2 text-[11px] text-indigo-800 font-bold bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
                طراحی شده برای پایداری ۱۰۰٪ با درایور mysql2
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">۳. استقلال کامل و امنیت داده</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                شما مالک ۱۰۰٪ داده‌ها هستید. هیچ درخواستی برای ذخیره داده‌ها به خارج از سرور شما ارسال نمی‌شود و برنامه کاملاً در بستر شبکه ملی یا شبکه داخلی (LAN) کار می‌کند.
              </p>
              <div className="pt-2 text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                سازگار با اینترنت ملی و شبکه‌های ایزوله (Offline)
              </div>
            </div>
          </div>

          {/* Database Backup & Restore Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500" />
                  <span>پشتیبان‌گیری سریع JSON (Backup & Restore)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  می‌توانید کل اطلاعات پایگاه‌داده را علاوه بر فایل SQL به صورت فایل متنی JSON نیز دانلود یا بازیابی فرمایید.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadBackupJson}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل JSON Backup</span>
                </button>

                <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>بازیابی فایل پشتیبان (Restore)</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleUploadBackupJson}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">تعداد محصولات در دیتابیس</span>
                <span className="text-lg font-black text-slate-800">{toPersianDigits(products.length)} قلم</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">اپیزودهای رادیو</span>
                <span className="text-lg font-black text-slate-800">{toPersianDigits(podcasts.length)} فایل</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">دیدگاه‌های ثبت‌شده</span>
                <span className="text-lg font-black text-slate-800">{toPersianDigits(reviews.length)} نظر</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">فایل اسکریپت MySQL</span>
                <span className="text-xs font-mono font-bold text-slate-700" dir="ltr">init-mysql.sql</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Server Deployment Guides */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span>دستورالعمل‌های استقرار همراه با سرور دیتابیس MySQL</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  روش مورد نظر خود را برای استقرار روی سرور انتخاب کنید:
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => setDeployMethod('docker')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    deployMethod === 'docker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  داکر (Docker Compose + MySQL 8)
                </button>
                <button
                  onClick={() => setDeployMethod('pm2')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    deployMethod === 'pm2' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  نصب دستی MySQL و Node.js
                </button>
                <button
                  onClick={() => setDeployMethod('nginx')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    deployMethod === 'nginx' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  تنظیم دامنه و Nginx
                </button>
              </div>
            </div>

            {/* Docker Guide */}
            {deployMethod === 'docker' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed space-y-1">
                  <div className="font-bold">روش فوق‌العاده ساده با Docker Compose (هم وب و هم پایگاه‌داده MySQL):</div>
                  <p>
                    فایل‌های <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded">docker-compose.yml</code> و <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded">init-mysql.sql</code> هر دو در پروژه آماده شده‌اند. با اجرای یک خط دستور زیر، هم سرور وب روی پورت ۳۰۰۰ و هم کانتینر MySQL روی پورت ۳۳۰۶ با حجم دائم و جدول‌های ۵ گانه بالا می‌آیند.
                  </p>
                </div>

                <div className="relative bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto" dir="ltr">
                  <button
                    onClick={() => handleCopy('docker compose up -d --build', 'docker-cmd')}
                    className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === 'docker-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'docker-cmd' ? 'کپی شد' : 'کپی دستور'}</span>
                  </button>
                  <pre className="text-emerald-400 font-bold mb-2"># ۱. پوشه پروژه را باز کرده و سرویس‌های وب و MySQL را اجرا کنید:</pre>
                  <pre>docker compose up -d --build</pre>
                  <pre className="text-slate-500 mt-2"># بررسی اجرای کانتینرهای toyland_app و toyland_mysql:</pre>
                  <pre>docker ps</pre>
                </div>
              </div>
            )}

            {/* PM2 Guide */}
            {deployMethod === 'pm2' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                  اگر مایلید MySQL را مستقیماً روی سرور لینوکس (بدون داکر) نصب کنید:
                </div>

                <div className="relative bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto" dir="ltr">
                  <button
                    onClick={() => handleCopy(`sudo apt update && sudo apt install -y mysql-server
sudo mysql < init-mysql.sql
npm install
npm run build
pm2 start dist/server.cjs --name "toyland"
pm2 save`, 'pm2-cmd')}
                    className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === 'pm2-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'pm2-cmd' ? 'کپی شد' : 'کپی دستورات'}</span>
                  </button>
                  <pre className="text-emerald-400 font-bold mb-1"># ۱. نصب MySQL در اوبونتو و ایجاد ساختار جداول:</pre>
                  <pre>sudo apt update && sudo apt install -y mysql-server</pre>
                  <pre>sudo mysql &lt; init-mysql.sql</pre>
                  <pre className="text-emerald-400 font-bold my-2"># ۲. نصب وابستگی‌ها، ساخت پروژه و اجرای دائم با PM2:</pre>
                  <pre>npm install</pre>
                  <pre>npm run build</pre>
                  <pre>pm2 start dist/server.cjs --name "toyland"</pre>
                  <pre>pm2 save && pm2 startup</pre>
                </div>
              </div>
            )}

            {/* Nginx Guide */}
            {deployMethod === 'nginx' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs leading-relaxed">
                  برای اتصال به دامنه اختصاصی (مانند <code className="font-mono">yourdomain.ir</code>) و دریافت SSL رایگان، کانفیگ زیر را در Nginx قرار دهید:
                </div>

                <div className="relative bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto" dir="ltr">
                  <button
                    onClick={() => handleCopy(`server {
    server_name yourdomain.ir www.yourdomain.ir;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`, 'nginx-cmd')}
                    className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === 'nginx-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'nginx-cmd' ? 'کپی کانفیگ' : 'کپی کانفیگ'}</span>
                  </button>
                  <pre className="text-amber-400 font-bold mb-1"># فایل /etc/nginx/sites-available/toyland:</pre>
                  <pre>{`server {
    server_name yourdomain.ir www.yourdomain.ir;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: User Management and Role-Based Access Control (RBAC) */}
      {activeTab === 'users' && currentUser && (
        <UserManagementTab currentUser={currentUser} />
      )}

      {/* Product Edit/Add Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 border border-amber-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? 'ویرایش اطلاعات اسباب‌بازی' : 'افزودن اسباب‌بازی جدید به کاتالوگ'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-slate-600 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام اسباب‌بازی:</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="مثال: قطار چوبی حیوانات جنگل"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی:</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  >
                    <option value="wooden">چوبی و طبیعت‌محور</option>
                    <option value="building">ساختنی و مهندسی</option>
                    <option value="sensory">حسی و مونته‌سوری</option>
                    <option value="puzzle">فکری و معمایی</option>
                    <option value="dolls">عروسک و داستان‌پردازی</option>
                    <option value="creative">نقاشی و خلاقیت</option>
                  </select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>نحوه قیمت‌گذاری:</span>
                  </label>
                  
                  {/* Mode Toggle */}
                  <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-bold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, isCustomPrice: false })}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        !productForm.isCustomPrice 
                          ? 'bg-white text-orange-600 shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      قیمت مشخص (تومان)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, isCustomPrice: true })}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        productForm.isCustomPrice 
                          ? 'bg-orange-500 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      متن دلخواه (استعلام قیمت)
                    </button>
                  </div>
                </div>

                {!productForm.isCustomPrice ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">قیمت فروش مستقیم (تومان):</label>
                    <input
                      type="number"
                      required={!productForm.isCustomPrice}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      placeholder="مثال: ۳۵۰,۰۰۰"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        متن دلخواه به جای قیمت عددی:
                      </label>
                      <input
                        type="text"
                        required={productForm.isCustomPrice}
                        value={productForm.customPriceText}
                        onChange={(e) => setProductForm({ ...productForm, customPriceText: e.target.value })}
                        placeholder="مثال: برای استعلام قیمت تماس بگیرید"
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                    {/* Quick suggestion presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-medium">عبارت‌های پیشنهادی:</span>
                      {[
                        'برای استعلام قیمت تماس بگیرید',
                        'تماس بگیرید',
                        'استعلام تلفنی یا پیام‌رسان',
                        'قیمت روز (استعلام کارخانه)',
                        'به زودی موجود می‌شود'
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, customPriceText: preset })}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">متن رده سنی:</label>
                  <input
                    type="text"
                    required
                    value={productForm.ageRange}
                    onChange={(e) => setProductForm({ ...productForm, ageRange: e.target.value })}
                    placeholder="۳ تا ۷ سال"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">فیلتر سن:</label>
                  <select
                    value={productForm.ageFilter}
                    onChange={(e) => setProductForm({ ...productForm, ageFilter: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  >
                    <option value="0-2">۰ تا ۲ سال</option>
                    <option value="3-5">۳ تا ۵ سال</option>
                    <option value="6-8">۶ تا ۸ سال</option>
                    <option value="9+">۹ سال به بالا</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">آدرس اینترنتی تصویر اسباب‌بازی:</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  dir="ltr"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیح کوتاه معرفی:</label>
                <input
                  type="text"
                  required
                  value={productForm.shortDesc}
                  onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                  placeholder="تقویت مهارت حل مسئله و دست‌ورزی با چوب راش ضدحساسیت..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات کامل داستان و بازی:</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="توضیحات کامل درباره نوع بازی، مراحل ساخت و کاربرد آموزشی..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مهارت‌ها (با کاما یا ویرگول فارسی جدا کنید):</label>
                  <input
                    type="text"
                    value={productForm.skills}
                    onChange={(e) => setProductForm({ ...productForm, skills: e.target.value })}
                    placeholder="خلاقیت، حل مسئله، هماهنگی چشم و دست"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">جنس و متریال:</label>
                  <input
                    type="text"
                    value={productForm.materials}
                    onChange={(e) => setProductForm({ ...productForm, materials: e.target.value })}
                    placeholder="چوب راش طبیعی با رنگ‌های خوراکی"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'ذخیره تغییرات' : 'انتشار محصول جدید'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Podcast Edit/Add Modal */}
      {isPodcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 border border-amber-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingPodcast ? 'ویرایش پادکست / فایل صوتی' : 'افزودن فایل صوتی جدید به رادیو توی‌لند'}
              </h3>
              <button
                onClick={() => setIsPodcastModalOpen(false)}
                className="p-1 text-slate-600 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePodcastSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان پادکست / قصه:</label>
                <input
                  type="text"
                  required
                  value={podcastForm.title}
                  onChange={(e) => setPodcastForm({ ...podcastForm, title: e.target.value })}
                  placeholder="ماجرای روباه ناقلا و بادبادک رنگین‌کمان"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">گوینده یا راوی:</label>
                  <input
                    type="text"
                    required
                    value={podcastForm.narrator}
                    onChange={(e) => setPodcastForm({ ...podcastForm, narrator: e.target.value })}
                    placeholder="عمو پورنگ و خاله نگار"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی موضوعی:</label>
                  <select
                    value={podcastForm.category}
                    onChange={(e) => setPodcastForm({ ...podcastForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  >
                    <option value="story">قصه شب و داستان کودک</option>
                    <option value="lullaby">لالایی و آرامش خواب</option>
                    <option value="parenting">ویژه والدین و فرزندپروری</option>
                    <option value="educational">آموزشی و کنجکاوی علمی</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مدت زمان (دقیقه:ثانیه):</label>
                  <input
                    type="text"
                    required
                    value={podcastForm.duration}
                    onChange={(e) => setPodcastForm({ ...podcastForm, duration: e.target.value })}
                    placeholder="۱۲:۳۰"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رده سنی مخاطب:</label>
                  <input
                    type="text"
                    required
                    value={podcastForm.targetAge}
                    onChange={(e) => setPodcastForm({ ...podcastForm, targetAge: e.target.value })}
                    placeholder="۳ تا ۷ سال"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Audio File Selection / Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Music className="w-4 h-4 text-rose-500" />
                    <span>فایل صوتی پادکست:</span>
                  </label>
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPodcastAudioSourceType('upload')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        podcastAudioSourceType === 'upload'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>آپلود فایل صوتی</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPodcastAudioSourceType('url')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        podcastAudioSourceType === 'url'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>لینک اینترنتی</span>
                    </button>
                  </div>
                </div>

                {podcastAudioSourceType === 'upload' ? (
                  <div className="space-y-2">
                    {/* Drag and drop upload zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsAudioDragging(true); }}
                      onDragLeave={() => setIsAudioDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsAudioDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleAudioFileSelect(file);
                      }}
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                        isAudioDragging
                          ? 'border-rose-500 bg-rose-50/70 scale-[0.99]'
                          : podcastForm.audioUrl
                          ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
                          : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-rose-300'
                      }`}
                      onClick={() => document.getElementById('podcast-audio-input')?.click()}
                    >
                      <input
                        id="podcast-audio-input"
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAudioFileSelect(file);
                        }}
                      />

                      {isAudioUploading ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-2 text-rose-600">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-xs font-bold">در حال بارگذاری فایل صوتی بر روی سرور...</span>
                          <span className="text-[10px] text-slate-500">لطفاً چند لحظه شکیبا باشید</span>
                        </div>
                      ) : podcastForm.audioUrl ? (
                        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between text-right">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <FileAudio className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{audioFileInfo?.name || 'فایل صوتی بارگذاری شده'}</span>
                                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    ذخیره در سرور
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span>حجم: {audioFileInfo?.size || 'آماده پخش'}</span>
                                  <span>•</span>
                                  <span>مدت: {podcastForm.duration}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => document.getElementById('podcast-audio-input')?.click()}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                            >
                              تغییر فایل
                            </button>
                          </div>

                          {/* Instant in-modal audio preview player */}
                          <div className="pt-2 border-t border-emerald-100/60">
                            <audio
                              controls
                              src={podcastForm.audioUrl}
                              className="w-full h-8 rounded-lg outline-hidden"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 space-y-1.5">
                          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-black text-slate-800">
                            کلیک کنید یا فایل صوتی پادکست را به اینجا بکشید
                          </p>
                          <p className="text-[11px] text-slate-500">
                            فرمت‌های مجاز: MP3، WAV، M4A، OGG (حداکثر ۶۰ مگابایت)
                          </p>
                          <p className="text-[10px] text-rose-600 font-medium">
                            ★ مدت زمان و ثانیه‌ها به‌صورت خودکار تشخیص داده می‌شود
                          </p>
                        </div>
                      )}
                    </div>

                    {audioUploadError && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{audioUploadError}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      required
                      value={podcastForm.audioUrl}
                      onChange={(e) => setPodcastForm({ ...podcastForm, audioUrl: e.target.value })}
                      placeholder="https://domain.com/podcast.mp3"
                      dir="ltr"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden text-right"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">آدرس مستقیم فایل صوتی با پسوند mp3 یا wav</p>
                  </div>
                )}
              </div>

              {/* Cover Image Selection / Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>تصویر کاور پادکست:</span>
                  </label>
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPodcastImageSourceType('upload')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        podcastImageSourceType === 'upload'
                          ? 'bg-white text-amber-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>آپلود تصویر</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPodcastImageSourceType('url')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        podcastImageSourceType === 'url'
                          ? 'bg-white text-amber-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>لینک تصویر</span>
                    </button>
                  </div>
                </div>

                {podcastImageSourceType === 'upload' ? (
                  <div className="space-y-2">
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsImageDragging(true); }}
                      onDragLeave={() => setIsImageDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsImageDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFileSelect(file);
                      }}
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                        isImageDragging
                          ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
                          : podcastForm.coverImage
                          ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/70'
                          : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-amber-300'
                      }`}
                      onClick={() => document.getElementById('podcast-image-input')?.click()}
                    >
                      <input
                        id="podcast-image-input"
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFileSelect(file);
                        }}
                      />

                      {isImageUploading ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-2 text-amber-600">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-xs font-bold">در حال بارگذاری تصویر کاور بر روی سرور...</span>
                        </div>
                      ) : podcastForm.coverImage ? (
                        <div className="flex items-center justify-between text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            <img
                              src={podcastForm.coverImage}
                              alt="کاور پادکست"
                              className="w-14 h-14 rounded-xl object-cover border border-amber-200 shadow-xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {imageFileInfo?.name || 'تصویر کاور بارگذاری شده'}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {imageFileInfo?.size ? `حجم: ${imageFileInfo.size}` : 'آماده نمایش'}
                              </div>
                              <span className="inline-block px-1.5 py-0.5 mt-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                ذخیره روی سرور
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => document.getElementById('podcast-image-input')?.click()}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                          >
                            تعویض تصویر
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 space-y-1.5">
                          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-black text-slate-800">
                            کلیک کنید یا تصویر کاور را به اینجا بکشید
                          </p>
                          <p className="text-[11px] text-slate-500">
                            فرمت‌های مجاز: JPG، PNG، WebP، SVG (حداکثر ۱۵ مگابایت)
                          </p>
                        </div>
                      )}
                    </div>

                    {imageUploadError && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{imageUploadError}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      required
                      value={podcastForm.coverImage}
                      onChange={(e) => setPodcastForm({ ...podcastForm, coverImage: e.target.value })}
                      placeholder="https://domain.com/cover.jpg"
                      dir="ltr"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden text-right"
                    />
                    {podcastForm.coverImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={podcastForm.coverImage}
                          alt="پیش‌نمایش"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <span className="text-[11px] text-slate-600">پیش‌نمایش تصویر کاور</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">خلاصه قصه / پیام آموزشی:</label>
                <textarea
                  rows={2}
                  required
                  value={podcastForm.description}
                  onChange={(e) => setPodcastForm({ ...podcastForm, description: e.target.value })}
                  placeholder="داستان درباره همکاری دو خرگوش باهوش است که..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>متن کامل قصه یا شعر (اختیاری):</span>
                  </label>
                  <span className="text-[10px] text-slate-500">جهت مطالعه کودک یا والدین همزمان با پخش</span>
                </div>
                <textarea
                  rows={4}
                  value={podcastForm.transcript || ''}
                  onChange={(e) => setPodcastForm({ ...podcastForm, transcript: e.target.value })}
                  placeholder="متن کامل یا شعر و ترانه را اینجا وارد کنید..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPodcastModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPodcast ? 'ذخیره فایل صوتی' : 'افزودن به رادیو'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
