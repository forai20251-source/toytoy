import { AdminUser, AdminPermission, UserRole } from '../types';

export interface RoleDefinition {
  role: UserRole;
  name: string;
  badgeColor: string;
  description: string;
  defaultPermissions: AdminPermission[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  super_admin: {
    role: 'super_admin',
    name: 'مدیر کل (Super Admin)',
    badgeColor: 'bg-rose-500/15 text-rose-600 border-rose-200 dark:border-rose-900/40 dark:text-rose-400',
    description: 'دسترسی کامل و نامحدود به تمامی بخش‌ها، مدیریت اعضا، پیکربندی سرور و دیتابیس',
    defaultPermissions: [
      'view_analytics',
      'manage_products',
      'manage_podcasts',
      'moderate_reviews',
      'manage_users',
      'manage_system'
    ]
  },
  store_manager: {
    role: 'store_manager',
    name: 'مدیر فروشگاه (Store Manager)',
    badgeColor: 'bg-amber-500/15 text-amber-600 border-amber-200 dark:border-amber-900/40 dark:text-amber-400',
    description: 'مدیریت موجودی و اطلاعات اسباب‌بازی‌ها، تایید دیدگاه‌های والدین و بررسی آمار',
    defaultPermissions: [
      'view_analytics',
      'manage_products',
      'moderate_reviews'
    ]
  },
  content_editor: {
    role: 'content_editor',
    name: 'سردبیر محتوا و رادیو (Content Editor)',
    badgeColor: 'bg-indigo-500/15 text-indigo-600 border-indigo-200 dark:border-indigo-900/40 dark:text-indigo-400',
    description: 'بارگذاری و ویرایش پادکست‌ها، ترانه‌ها و قصه‌های صوتی و متن اشعار',
    defaultPermissions: [
      'view_analytics',
      'manage_podcasts'
    ]
  },
  support_agent: {
    role: 'support_agent',
    name: 'کارشناس پشتیبانی (Support Agent)',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:border-emerald-900/40 dark:text-emerald-400',
    description: 'بررسی و تایید نظرات والدین، پاسخ به سوالات مشتریان و تایید بازخوردها',
    defaultPermissions: [
      'moderate_reviews'
    ]
  },
  viewer: {
    role: 'viewer',
    name: 'ناظر و گزارش‌گیر (Auditor / Viewer)',
    badgeColor: 'bg-blue-500/15 text-blue-600 border-blue-200 dark:border-blue-900/40 dark:text-blue-400',
    description: 'مشاهده آمار، گزارش‌های فروش، ترافیک و شنوندگان بدون امکان تغییر اطلاعات',
    defaultPermissions: [
      'view_analytics'
    ]
  }
};

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, AdminPermission[]> = {
  super_admin: [
    'view_analytics',
    'manage_products',
    'manage_podcasts',
    'moderate_reviews',
    'manage_users',
    'manage_system'
  ],
  store_manager: [
    'view_analytics',
    'manage_products',
    'moderate_reviews'
  ],
  content_editor: [
    'view_analytics',
    'manage_podcasts'
  ],
  support_agent: [
    'moderate_reviews'
  ],
  viewer: [
    'view_analytics'
  ]
};

export const PERMISSION_DEFINITIONS: { key: AdminPermission; label: string; desc: string; iconName: string }[] = [
  {
    key: 'view_analytics',
    label: 'مشاهده آمار و گزارش‌ها',
    desc: 'رصد ترافیک، شنوندگان رادیو، پربازدیدترین محصولات و نمودارهای هفتگی',
    iconName: 'BarChart3'
  },
  {
    key: 'manage_products',
    label: 'مدیریت محصولات و اسباب‌بازی‌ها',
    desc: 'افزودن، ویرایش قیمت و مشخصات و حذف اسباب‌بازی‌ها در کاتالوگ',
    iconName: 'Package'
  },
  {
    key: 'manage_podcasts',
    label: 'مدیریت پادکست و قصه‌های صوتی',
    desc: 'آپلود فایل‌های صوتی، ویرایش کاور و متن قصه و مدیریت اپیزودها',
    iconName: 'Headphones'
  },
  {
    key: 'moderate_reviews',
    label: 'بررسی و تایید دیدگاه‌های والدین',
    desc: 'تایید یا رد نظرات ثبت‌شده توسط خانواده‌ها برای نمایش عمومی در سایت',
    iconName: 'MessageSquare'
  },
  {
    key: 'manage_users',
    label: 'مدیریت کاربران و نقش‌ها',
    desc: 'ایجاد حساب کاربری جدید برای کارمندان، تخصیص نقش و تنظیم دسترسی‌ها',
    iconName: 'Users'
  },
  {
    key: 'manage_system',
    label: 'تنظیمات سرور، بکاپ و MySQL',
    desc: 'پیکربندی پایگاه‌داده MySQL، خروجی SQL Dump، فایل‌های پشتیبان و راه‌اندازی سرور',
    iconName: 'Server'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    fullName: 'مدیر ارشد کارخانه (مهندس سعیدی)',
    email: 'admin@toyland.ir',
    role: 'super_admin',
    roleName: 'مدیر کل (Super Admin)',
    permissions: [
      'view_analytics',
      'manage_products',
      'manage_podcasts',
      'moderate_reviews',
      'manage_users',
      'manage_system'
    ],
    isActive: true,
    lastLogin: 'هم‌اکنون',
    createdAt: '۱۴۰۳/۰۱/۱۵',
    password: 'admin' // رمز پیش‌فرض اولیه
  },
  {
    id: 'user-admin-2',
    username: 'store_manager',
    fullName: 'مینا رحیمی (مسئول انبار و فروش)',
    email: 'store@toyland.ir',
    role: 'store_manager',
    roleName: 'مدیر فروشگاه',
    permissions: [
      'view_analytics',
      'manage_products',
      'moderate_reviews'
    ],
    isActive: true,
    lastLogin: 'دیروز ساعت ۱۶:۲۰',
    createdAt: '۱۴۰۳/۰۲/۱۰',
    password: '123'
  },
  {
    id: 'user-admin-3',
    username: 'content_writer',
    fullName: 'الهام سهرابی (نویسنده و تدوینگر صوتی)',
    email: 'radio@toyland.ir',
    role: 'content_editor',
    roleName: 'سردبیر محتوا و رادیو',
    permissions: [
      'view_analytics',
      'manage_podcasts'
    ],
    isActive: true,
    lastLogin: '۳ روز پیش',
    createdAt: '۱۴۰۳/۰۳/۰۱',
    password: '123'
  },
  {
    id: 'user-admin-4',
    username: 'support',
    fullName: 'علی رضوی (پشتیبانی و امور مشتریان)',
    email: 'support@toyland.ir',
    role: 'support_agent',
    roleName: 'کارشناس پشتیبانی',
    permissions: [
      'moderate_reviews'
    ],
    isActive: true,
    lastLogin: 'هفته گذشته',
    createdAt: '۱۴۰۳/۰۳/۱۵',
    password: '123'
  }
];
