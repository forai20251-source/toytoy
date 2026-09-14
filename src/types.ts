export type Page = 'home' | 'about' | 'contact' | 'products' | 'product-detail' | 'podcasts' | 'admin';

export type AgeGroup = 'all' | '0-2' | '3-5' | '6-8' | '9+';

export type ProductCategory = 
  | 'all'
  | 'wooden'        // اسباب‌بازی‌های چوبی و طبیعت‌محور
  | 'puzzle'        // فکری و بازی‌های رومیزی
  | 'building'      // ساختنی و بلوک‌های مهندسی
  | 'sensory'       // حسی و مونته‌سوری
  | 'dolls'         // عروسک و شخصیت‌های داستانی
  | 'creative';     // نقاشی، رنگ‌آمیزی و خلاقیت

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  categoryName: string;
  ageRange: string;
  ageFilter: '0-2' | '3-5' | '6-8' | '9+';
  price: number; // in Tomans
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  inStock: boolean;
  image: string;
  gallery: string[];
  description: string;
  shortDesc: string;
  features: string[];
  skillsDeveloped: string[];
  materials: string;
  dimensions: string;
  safetyCertificate: string;
  viewsCount: number;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  durationSeconds: number;
  narrator: string;
  category: 'story' | 'educational' | 'parenting' | 'lullaby';
  categoryName: string;
  coverImage: string;
  audioUrl: string; // real preview audio or generated chime
  description: string;
  transcript?: string; // full text / story / lyrics
  targetAge: string;
  playsCount: number;
  likesCount: number;
  releaseDate: string;
}

export interface ParentReview {
  id: string;
  productId: string;
  productName: string;
  parentName: string;
  childAge: string;
  rating: number;
  date: string;
  comment: string;
  approved: boolean;
  helpfulCount: number;
  verifiedPurchase: boolean;
}

export interface UsageAnalytics {
  totalVisits: number;
  totalPodcastListens: number;
  totalProductViews: number;
  totalReviews: number;
  weeklyVisits: { day: string; visits: number; listens: number }[];
  categoryPopularity: { name: string; percentage: number; color: string }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}
