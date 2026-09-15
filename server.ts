import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_PODCASTS, INITIAL_REVIEWS, INITIAL_ANALYTICS } from './src/data/initialData';
import { Product, PodcastEpisode, ParentReview, UsageAnalytics, ContactMessage, AdminUser } from './src/types';
import { INITIAL_ADMIN_USERS } from './src/data/authData';
import {
  initMysql,
  isMysqlActive,
  getMysqlStatus,
  mysqlGetAllProducts,
  mysqlSaveProduct,
  mysqlDeleteProduct,
  mysqlGetAllPodcasts,
  mysqlSavePodcast,
  mysqlDeletePodcast,
  mysqlGetAllReviews,
  mysqlSaveReview,
  mysqlDeleteReview,
  mysqlGetAnalytics,
  mysqlSaveAnalytics,
  mysqlSaveMessage,
  mysqlGetAllMessages,
  mysqlGetAllAdminUsers,
  mysqlSaveAdminUser,
  mysqlDeleteAdminUser,
  generateSqlDump
} from './src/server/mysql';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'toyland_database.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure data storage directory and uploads directory exist for self-hosting
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface LocalDatabase {
  products: Product[];
  podcasts: PodcastEpisode[];
  reviews: ParentReview[];
  analytics: UsageAnalytics;
  messages: ContactMessage[];
  adminUsers: AdminUser[];
  updatedAt: string;
}

let localDb: LocalDatabase = {
  products: INITIAL_PRODUCTS,
  podcasts: INITIAL_PODCASTS,
  reviews: INITIAL_REVIEWS,
  analytics: INITIAL_ANALYTICS,
  messages: [],
  adminUsers: INITIAL_ADMIN_USERS,
  updatedAt: new Date().toISOString()
};

function saveDbToFile(): void {
  try {
    localDb.updatedAt = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(localDb, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[Self-Hosted DB] Error writing database to disk:', err);
  }
}

function loadDbFromFile(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      localDb = {
        products: Array.isArray(parsed.products) ? parsed.products : INITIAL_PRODUCTS,
        podcasts: Array.isArray(parsed.podcasts) ? parsed.podcasts : INITIAL_PODCASTS,
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : INITIAL_REVIEWS,
        analytics: parsed.analytics || INITIAL_ANALYTICS,
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
        adminUsers: Array.isArray(parsed.adminUsers) && parsed.adminUsers.length > 0 ? parsed.adminUsers : INITIAL_ADMIN_USERS,
        updatedAt: parsed.updatedAt || new Date().toISOString()
      };
      console.log(`[Self-Hosted DB] Loaded ${localDb.products.length} products, ${localDb.podcasts.length} podcasts, ${localDb.adminUsers.length} users from ${DB_FILE}`);
    } else {
      console.log(`[Self-Hosted DB] No existing database found at ${DB_FILE}. Initializing with factory data...`);
      saveDbToFile();
    }
  } catch (err) {
    console.error('[Self-Hosted DB] Error reading database file:', err);
    saveDbToFile();
  }
}

// Initial DB load
loadDbFromFile();

async function startServer() {
  const app = express();

  // Middleware for parsing JSON & URL-encoded requests (supports media uploads)
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ limit: '60mb', extended: true }));

  // Serve persistent uploaded files (podcasts, covers, products)
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ==========================================
  // Self-Hosted REST API Routes (Server & DB)
  // ==========================================

  // 1. Health and Server Information
  app.get('/api/health', (req: Request, res: Response) => {
    const mysqlStatus = getMysqlStatus();
    res.json({
      status: 'ok',
      mode: 'self-hosted',
      serverTime: new Date().toISOString(),
      database: {
        type: mysqlStatus.connected ? 'MySQL 8.0 (toyland_db)' : 'Local Persistent JSON (Fallback Ready)',
        mysql: mysqlStatus,
        path: DB_FILE,
        productsCount: localDb.products.length,
        podcastsCount: localDb.podcasts.length,
        reviewsCount: localDb.reviews.length,
        messagesCount: localDb.messages.length,
        lastUpdated: localDb.updatedAt
      }
    });
  });

  // 2. Fetch all initial/cached data in one call
  app.get('/api/all-data', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const [mysqlProducts, mysqlPodcasts, mysqlReviews, mysqlAnalytics] = await Promise.all([
          mysqlGetAllProducts(),
          mysqlGetAllPodcasts(),
          mysqlGetAllReviews(),
          mysqlGetAnalytics()
        ]);
        if (mysqlProducts.length > 0) localDb.products = mysqlProducts;
        if (mysqlPodcasts.length > 0) localDb.podcasts = mysqlPodcasts;
        if (mysqlReviews.length > 0) localDb.reviews = mysqlReviews;
        if (mysqlAnalytics) localDb.analytics = mysqlAnalytics;
      } catch (err) {
        console.error('[MySQL Read Error]:', err);
      }
    }
    res.json({
      success: true,
      databaseType: isMysqlActive() ? 'mysql' : 'json',
      data: {
        products: localDb.products,
        podcasts: localDb.podcasts,
        reviews: localDb.reviews,
        analytics: localDb.analytics
      },
      updatedAt: localDb.updatedAt
    });
  });

  // 3. Products Endpoints
  app.get('/api/products', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const prods = await mysqlGetAllProducts();
        if (prods.length > 0) return res.json(prods);
      } catch (err) {
        console.error('[MySQL Get Products]:', err);
      }
    }
    res.json(localDb.products);
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    const newProduct: Product = req.body;
    if (!newProduct || !newProduct.id || !newProduct.title) {
      return res.status(400).json({ error: 'اطلاعات محصول ناقص است' });
    }
    // Remove if already exists then prepend
    localDb.products = [newProduct, ...localDb.products.filter(p => p.id !== newProduct.id)];
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveProduct(newProduct); } catch (e) { console.error('[MySQL Save Product Error]:', e); }
    }
    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedProduct: Product = req.body;
    const index = localDb.products.findIndex(p => p.id === id);
    if (index === -1) {
      localDb.products.unshift(updatedProduct);
    } else {
      localDb.products[index] = { ...localDb.products[index], ...updatedProduct };
    }
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveProduct(updatedProduct); } catch (e) { console.error('[MySQL Update Product Error]:', e); }
    }
    res.json({ success: true, product: updatedProduct });
  });

  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    localDb.products = localDb.products.filter(p => p.id !== id);
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlDeleteProduct(id); } catch (e) { console.error('[MySQL Delete Product Error]:', e); }
    }
    res.json({ success: true, message: 'محصول با موفقیت حذف شد' });
  });

  // 4. Podcasts Endpoints
  app.get('/api/podcasts', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const pods = await mysqlGetAllPodcasts();
        if (pods.length > 0) return res.json(pods);
      } catch (err) {
        console.error('[MySQL Get Podcasts]:', err);
      }
    }
    res.json(localDb.podcasts);
  });

  app.post('/api/podcasts', async (req: Request, res: Response) => {
    const newPodcast: PodcastEpisode = req.body;
    if (!newPodcast || !newPodcast.id || !newPodcast.title) {
      return res.status(400).json({ error: 'اطلاعات پادکست ناقص است' });
    }
    localDb.podcasts = [newPodcast, ...localDb.podcasts.filter(p => p.id !== newPodcast.id)];
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSavePodcast(newPodcast); } catch (e) { console.error('[MySQL Save Podcast Error]:', e); }
    }
    res.status(201).json({ success: true, podcast: newPodcast });
  });

  app.put('/api/podcasts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedPodcast: PodcastEpisode = req.body;
    const index = localDb.podcasts.findIndex(p => p.id === id);
    if (index === -1) {
      localDb.podcasts.unshift(updatedPodcast);
    } else {
      localDb.podcasts[index] = { ...localDb.podcasts[index], ...updatedPodcast };
    }
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSavePodcast(updatedPodcast); } catch (e) { console.error('[MySQL Update Podcast Error]:', e); }
    }
    res.json({ success: true, podcast: updatedPodcast });
  });

  app.delete('/api/podcasts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    localDb.podcasts = localDb.podcasts.filter(p => p.id !== id);
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlDeletePodcast(id); } catch (e) { console.error('[MySQL Delete Podcast Error]:', e); }
    }
    res.json({ success: true, message: 'اپیزود با موفقیت حذف شد' });
  });

  // 4.1 Media File Upload Endpoint (Podcasts Audio & Cover Images)
  app.post('/api/upload', async (req: Request, res: Response) => {
    try {
      const { filename, fileData, type } = req.body;
      if (!filename || !fileData) {
        return res.status(400).json({ error: 'نام فایل و محتوای آن الزامی است' });
      }

      // Determine extension
      const rawExt = path.extname(filename).toLowerCase();
      const ext = rawExt || (type === 'audio' ? '.mp3' : '.jpg');
      
      // Clean prefix type
      const safePrefix = type === 'audio' ? 'podcast-audio' : type === 'cover' ? 'podcast-cover' : 'media';
      const cleanBase = path.basename(filename, rawExt).replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, '_').substring(0, 30);
      const uniqueName = `${safePrefix}-${Date.now()}-${cleanBase}${ext}`;
      const targetFilePath = path.join(UPLOADS_DIR, uniqueName);

      // Strip Data URI scheme if present (e.g. data:audio/mp3;base64,...)
      let base64String = fileData;
      if (fileData.includes(';base64,')) {
        base64String = fileData.split(';base64,')[1];
      }

      const fileBuffer = Buffer.from(base64String, 'base64');
      fs.writeFileSync(targetFilePath, fileBuffer);

      const publicUrl = `/uploads/${uniqueName}`;
      console.log(`[Upload] Successfully stored ${uniqueName} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

      res.status(201).json({
        success: true,
        url: publicUrl,
        filename: uniqueName,
        originalName: filename,
        size: fileBuffer.length
      });
    } catch (err: any) {
      console.error('[Upload Error]:', err);
      res.status(500).json({ error: `خطا در ذخیره‌سازی فایل: ${err?.message || 'نامشخص'}` });
    }
  });

  // 5. Parent Reviews Endpoints
  app.get('/api/reviews', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const revs = await mysqlGetAllReviews();
        if (revs.length > 0) return res.json(revs);
      } catch (err) {
        console.error('[MySQL Get Reviews]:', err);
      }
    }
    res.json(localDb.reviews);
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    const review: ParentReview = req.body;
    if (!review || !review.id || !review.comment) {
      return res.status(400).json({ error: 'اطلاعات نظر ناقص است' });
    }
    localDb.reviews = [review, ...localDb.reviews.filter(r => r.id !== review.id)];
    localDb.analytics.totalReviews = (localDb.analytics.totalReviews || 0) + 1;
    saveDbToFile();
    if (isMysqlActive()) {
      try {
        await mysqlSaveReview(review);
        await mysqlSaveAnalytics(localDb.analytics);
      } catch (e) { console.error('[MySQL Save Review Error]:', e); }
    }
    res.status(201).json({ success: true, review });
  });

  app.put('/api/reviews/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedReview: ParentReview = req.body;
    const index = localDb.reviews.findIndex(r => r.id === id);
    if (index === -1) {
      localDb.reviews.unshift(updatedReview);
    } else {
      localDb.reviews[index] = { ...localDb.reviews[index], ...updatedReview };
    }
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveReview(updatedReview); } catch (e) { console.error('[MySQL Update Review Error]:', e); }
    }
    res.json({ success: true, review: updatedReview });
  });

  app.delete('/api/reviews/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    localDb.reviews = localDb.reviews.filter(r => r.id !== id);
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlDeleteReview(id); } catch (e) { console.error('[MySQL Delete Review Error]:', e); }
    }
    res.json({ success: true, message: 'دیدگاه با موفقیت حذف شد' });
  });

  // 6. Usage Analytics Endpoints
  app.get('/api/analytics', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const a = await mysqlGetAnalytics();
        if (a) return res.json(a);
      } catch (err) {
        console.error('[MySQL Get Analytics]:', err);
      }
    }
    res.json(localDb.analytics);
  });

  app.put('/api/analytics', async (req: Request, res: Response) => {
    localDb.analytics = { ...localDb.analytics, ...req.body };
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveAnalytics(localDb.analytics); } catch (e) { console.error('[MySQL Update Analytics Error]:', e); }
    }
    res.json({ success: true, analytics: localDb.analytics });
  });

  // 7. Contact Form Messages
  app.post('/api/contact', async (req: Request, res: Response) => {
    const message: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: req.body.name || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      subject: req.body.subject || 'پیام عمومی',
      message: req.body.message || '',
      date: new Date().toLocaleDateString('fa-IR')
    };
    localDb.messages.unshift(message);
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveMessage(message); } catch (e) { console.error('[MySQL Save Message Error]:', e); }
    }
    res.status(201).json({ success: true, message });
  });

  app.get('/api/contact', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const msgs = await mysqlGetAllMessages();
        if (msgs.length > 0) return res.json(msgs);
      } catch (err) {
        console.error('[MySQL Get Messages]:', err);
      }
    }
    res.json(localDb.messages);
  });

  // 8. Admin Users & Authentication Endpoints
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'نام کاربری و کلمه عبور الزامی است' });
    }

    let users = localDb.adminUsers;
    if (isMysqlActive()) {
      try {
        const mysqlUsers = await mysqlGetAllAdminUsers();
        if (mysqlUsers.length > 0) users = mysqlUsers;
      } catch (err) {
        console.error('[MySQL Get Users for Login]:', err);
      }
    }

    const user = users.find(u => u.username.toLowerCase() === String(username).toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'کاربری با این نام کاربری یافت نشد' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'حساب کاربری شما غیرفعال شده است. لطفاً با مدیر کل تماس بگیرید.' });
    }

    // Check password (supports default admin/admin or user defined password)
    const expectedPassword = user.password || (user.username === 'admin' ? 'admin' : '123');
    if (password !== expectedPassword) {
      return res.status(401).json({ error: 'رمز عبور وارد شده نادرست است' });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date().toLocaleDateString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveAdminUser(user); } catch (e) { console.error('[MySQL Save User Login]:', e); }
    }

    // Exclude password in response
    const { password: _, ...userSafe } = user;
    res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      user: userSafe
    });
  });

  app.get('/api/users', async (req: Request, res: Response) => {
    if (isMysqlActive()) {
      try {
        const mysqlUsers = await mysqlGetAllAdminUsers();
        if (mysqlUsers.length > 0) {
          localDb.adminUsers = mysqlUsers;
        }
      } catch (err) {
        console.error('[MySQL Get Users]:', err);
      }
    }
    // Return users without plaintext passwords
    const safeUsers = localDb.adminUsers.map(({ password, ...rest }) => rest);
    res.json(safeUsers);
  });

  app.post('/api/users', async (req: Request, res: Response) => {
    const newUser: AdminUser = req.body;
    if (!newUser || !newUser.username || !newUser.fullName || !newUser.role) {
      return res.status(400).json({ error: 'اطلاعات کاربر (نام کاربری، نام کامل و نقش) الزامی است' });
    }

    // Check duplicate username
    if (localDb.adminUsers.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      return res.status(409).json({ error: 'این نام کاربری قبلاً در سامانه ثبت شده است' });
    }

    const createdUser: AdminUser = {
      id: newUser.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: newUser.username.trim(),
      fullName: newUser.fullName.trim(),
      email: newUser.email || '',
      role: newUser.role,
      roleName: newUser.roleName || 'کاربر سیستم',
      permissions: Array.isArray(newUser.permissions) ? newUser.permissions : [],
      isActive: newUser.isActive !== false,
      lastLogin: 'تاکنون وارد نشده',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      password: newUser.password || '123'
    };

    localDb.adminUsers.push(createdUser);
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveAdminUser(createdUser); } catch (e) { console.error('[MySQL Save User]:', e); }
    }

    const { password, ...safeUser } = createdUser;
    res.status(201).json({ success: true, user: safeUser });
  });

  app.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const index = localDb.adminUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'کاربر مورد نظر یافت نشد' });
    }

    // Prevent changing admin username of default super_admin to empty
    const existing = localDb.adminUsers[index];
    const updated: AdminUser = {
      ...existing,
      ...updates,
      id: existing.id,
      password: updates.password ? updates.password : existing.password
    };

    localDb.adminUsers[index] = updated;
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlSaveAdminUser(updated); } catch (e) { console.error('[MySQL Update User]:', e); }
    }

    const { password, ...safeUser } = updated;
    res.json({ success: true, user: safeUser });
  });

  app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = localDb.adminUsers.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'کاربر مورد نظر یافت نشد' });
    }

    // Protect master super_admin from deletion
    if (user.username === 'admin') {
      return res.status(403).json({ error: 'امکان حذف مدیر ارشد سیستم وجود ندارد' });
    }

    localDb.adminUsers = localDb.adminUsers.filter(u => u.id !== id);
    saveDbToFile();
    if (isMysqlActive()) {
      try { await mysqlDeleteAdminUser(id); } catch (e) { console.error('[MySQL Delete User]:', e); }
    }

    res.json({ success: true, message: 'کاربر با موفقیت حذف شد' });
  });

  // 9. MySQL Specific Endpoints (Status, Test Connection, Sync, SQL Dump)
  app.get('/api/mysql/status', (req: Request, res: Response) => {
    res.json(getMysqlStatus());
  });

  app.post('/api/mysql/test', async (req: Request, res: Response) => {
    const success = await initMysql();
    const status = getMysqlStatus();
    res.json({
      success,
      status
    });
  });

  app.post('/api/mysql/sync', async (req: Request, res: Response) => {
    if (!isMysqlActive()) {
      const connected = await initMysql();
      if (!connected) {
        return res.status(503).json({
          error: 'پایگاه‌داده MySQL در حال حاضر در دسترس نیست. لطفاً بررسی کنید سرور MySQL روشن باشد.'
        });
      }
    }
    try {
      for (const p of localDb.products) await mysqlSaveProduct(p);
      for (const pod of localDb.podcasts) await mysqlSavePodcast(pod);
      for (const rev of localDb.reviews) await mysqlSaveReview(rev);
      await mysqlSaveAnalytics(localDb.analytics);
      res.json({
        success: true,
        message: 'تمامی اطلاعات محصولات، پادکست‌ها و نظرات با موفقیت به پایگاه‌داده MySQL منتقل و همگام شد!'
      });
    } catch (err: any) {
      res.status(500).json({ error: `خطا در همگام‌سازی MySQL: ${err?.message}` });
    }
  });

  app.get('/api/mysql/export-sql', (req: Request, res: Response) => {
    const dump = generateSqlDump(
      localDb.products,
      localDb.podcasts,
      localDb.reviews,
      localDb.analytics
    );
    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=toyland-mysql-dump-${Date.now()}.sql`);
    res.send(dump);
  });

  // 8. Database Management (Backup, Restore, Factory Reset)
  app.get('/api/db/export', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=toyland-backup-${Date.now()}.json`);
    res.send(JSON.stringify(localDb, null, 2));
  });

  app.post('/api/db/import', (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data || !Array.isArray(data.products)) {
        return res.status(400).json({ error: 'فرمت فایل پشتیبان نامعتبر است' });
      }
      localDb = {
        products: data.products,
        podcasts: Array.isArray(data.podcasts) ? data.podcasts : INITIAL_PODCASTS,
        reviews: Array.isArray(data.reviews) ? data.reviews : INITIAL_REVIEWS,
        analytics: data.analytics || INITIAL_ANALYTICS,
        messages: Array.isArray(data.messages) ? data.messages : [],
        adminUsers: Array.isArray(data.adminUsers) && data.adminUsers.length > 0 ? data.adminUsers : localDb.adminUsers,
        updatedAt: new Date().toISOString()
      };
      saveDbToFile();
      res.json({ success: true, message: 'پایگاه‌داده با موفقیت بازیابی شد' });
    } catch {
      res.status(500).json({ error: 'خطا در بازیابی نسخه پشتیبان' });
    }
  });

  app.post('/api/db/reset', (req: Request, res: Response) => {
    localDb = {
      products: [...INITIAL_PRODUCTS],
      podcasts: [...INITIAL_PODCASTS],
      reviews: [...INITIAL_REVIEWS],
      analytics: { ...INITIAL_ANALYTICS },
      messages: [],
      adminUsers: [...INITIAL_ADMIN_USERS],
      updatedAt: new Date().toISOString()
    };
    saveDbToFile();
    res.json({ success: true, message: 'پایگاه‌داده به مقادیر اولیه کارخانه بازگردانی شد' });
  });

  // ==========================================
  // Vite Integration (Development & Production)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🧸 ToyLand Self-Hosted Web Server & Database Running!`);
    console.log(`🌐 Web App: http://0.0.0.0:${PORT}`);
    console.log(`💾 Local Database: ${DB_FILE}`);
    console.log(`📡 Health Check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`=======================================================`);

    // Asynchronously initialize MySQL if configured/available
    initMysql().then(connected => {
      if (connected) {
        console.log(`[MySQL] Operational & Synchronized.`);
      } else {
        console.log(`[MySQL] Offline/Not connected yet. Running on resilient local database.`);
      }
    }).catch(err => {
      console.log(`[MySQL] Background connect attempt caught:`, err?.message);
    });
  });
}

startServer();
