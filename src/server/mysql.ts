import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { Product, PodcastEpisode, ParentReview, UsageAnalytics, ContactMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_PODCASTS, INITIAL_REVIEWS, INITIAL_ANALYTICS } from '../data/initialData';

let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

export function getMysqlConfig(): PoolOptions {
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'toyland_user',
    password: process.env.MYSQL_PASSWORD || 'toyland_pass',
    database: process.env.MYSQL_DATABASE || 'toyland_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 4000,
    charset: 'utf8mb4'
  };
}

export function isMysqlActive(): boolean {
  return isConnected;
}

export function getMysqlStatus() {
  const config = getMysqlConfig();
  return {
    connected: isConnected,
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    lastError
  };
}

/**
 * Initializes MySQL pool, tests connection and ensures schema & seed data.
 */
export async function initMysql(): Promise<boolean> {
  const config = getMysqlConfig();
  
  // First, connect without specifying database to create database if not exists
  try {
    const adminConnection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      connectTimeout: 3000
    });
    
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConnection.end();

    // Now create connection pool with target database
    pool = mysql.createPool(config);

    // Test ping
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnected = true;
    lastError = null;
    console.log(`[MySQL] Successfully connected to MySQL server at ${config.host}:${config.port}/${config.database}`);

    // Create tables and seed
    await ensureTables();
    return true;
  } catch (err: any) {
    isConnected = false;
    lastError = err?.message || 'Connection failed';
    console.log(`[MySQL] Notice: MySQL server at ${config.host}:${config.port} is not reachable (${lastError}). Operating in local persistent file mode until MySQL is launched.`);
    return false;
  }
}

async function ensureTables(): Promise<void> {
  if (!pool || !isConnected) return;

  // 1. Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`products\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`category\` VARCHAR(100) NOT NULL,
      \`categoryName\` VARCHAR(255) NOT NULL DEFAULT '',
      \`ageRange\` VARCHAR(50) NOT NULL DEFAULT '',
      \`ageFilter\` VARCHAR(20) NOT NULL DEFAULT '3-5',
      \`price\` INT NOT NULL DEFAULT 0,
      \`oldPrice\` INT DEFAULT NULL,
      \`rating\` DECIMAL(3, 1) NOT NULL DEFAULT 5.0,
      \`reviewsCount\` INT NOT NULL DEFAULT 0,
      \`isPopular\` BOOLEAN DEFAULT FALSE,
      \`isNew\` BOOLEAN DEFAULT FALSE,
      \`inStock\` BOOLEAN DEFAULT TRUE,
      \`image\` TEXT,
      \`gallery\` JSON,
      \`description\` TEXT,
      \`shortDesc\` TEXT,
      \`features\` JSON,
      \`skillsDeveloped\` JSON,
      \`materials\` VARCHAR(255) DEFAULT '',
      \`dimensions\` VARCHAR(100) DEFAULT '',
      \`safetyCertificate\` VARCHAR(255) DEFAULT '',
      \`viewsCount\` INT DEFAULT 0,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Podcasts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`podcasts\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`subtitle\` VARCHAR(255) DEFAULT '',
      \`narrator\` VARCHAR(255),
      \`duration\` VARCHAR(50),
      \`durationSeconds\` INT DEFAULT 0,
      \`category\` VARCHAR(100) DEFAULT 'story',
      \`categoryName\` VARCHAR(255) DEFAULT '',
      \`coverImage\` TEXT,
      \`audioUrl\` TEXT,
      \`description\` TEXT,
      \`transcript\` MEDIUMTEXT,
      \`targetAge\` VARCHAR(50) DEFAULT '',
      \`playsCount\` INT DEFAULT 0,
      \`likesCount\` INT DEFAULT 0,
      \`releaseDate\` VARCHAR(50) DEFAULT '',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Reviews table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`reviews\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`productId\` VARCHAR(128) NOT NULL DEFAULT '',
      \`productName\` VARCHAR(255) NOT NULL DEFAULT '',
      \`parentName\` VARCHAR(255) NOT NULL,
      \`childAge\` VARCHAR(100) DEFAULT '',
      \`rating\` INT NOT NULL DEFAULT 5,
      \`date\` VARCHAR(50) DEFAULT '',
      \`comment\` TEXT NOT NULL,
      \`approved\` BOOLEAN DEFAULT TRUE,
      \`helpfulCount\` INT DEFAULT 0,
      \`verifiedPurchase\` BOOLEAN DEFAULT TRUE,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Analytics table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`analytics\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`totalVisits\` INT DEFAULT 0,
      \`totalPodcastListens\` INT DEFAULT 0,
      \`totalProductViews\` INT DEFAULT 0,
      \`totalReviews\` INT DEFAULT 0,
      \`weeklyVisits\` JSON,
      \`categoryPopularity\` JSON,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Messages table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`messages\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255),
      \`phone\` VARCHAR(50),
      \`subject\` VARCHAR(255),
      \`message\` TEXT NOT NULL,
      \`date\` VARCHAR(50),
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed initial products if empty
  const [prodRows]: any = await pool.query('SELECT COUNT(*) as count FROM products');
  if (prodRows[0].count === 0) {
    console.log('[MySQL] Seeding initial products...');
    for (const p of INITIAL_PRODUCTS) {
      await mysqlSaveProduct(p);
    }
  }

  // Seed initial podcasts if empty
  const [podRows]: any = await pool.query('SELECT COUNT(*) as count FROM podcasts');
  if (podRows[0].count === 0) {
    console.log('[MySQL] Seeding initial podcasts...');
    for (const pod of INITIAL_PODCASTS) {
      await mysqlSavePodcast(pod);
    }
  }

  // Seed initial reviews if empty
  const [revRows]: any = await pool.query('SELECT COUNT(*) as count FROM reviews');
  if (revRows[0].count === 0) {
    console.log('[MySQL] Seeding initial reviews...');
    for (const rev of INITIAL_REVIEWS) {
      await mysqlSaveReview(rev);
    }
  }

  // Seed initial analytics if empty
  const [anRows]: any = await pool.query('SELECT COUNT(*) as count FROM analytics WHERE id = "current"');
  if (anRows[0].count === 0) {
    console.log('[MySQL] Seeding initial analytics...');
    await mysqlSaveAnalytics(INITIAL_ANALYTICS);
  }

  // Safe migration: Ensure transcript column exists on podcasts table
  try {
    await pool.query('ALTER TABLE `podcasts` ADD COLUMN `transcript` MEDIUMTEXT');
    console.log('[MySQL] Successfully ensured transcript column exists in podcasts table.');
  } catch (err: any) {
    // Column already exists, safe to continue
  }
}

// ==========================================
// MySQL CRUD Operations
// ==========================================

export async function mysqlGetAllProducts(): Promise<Product[]> {
  if (!pool || !isConnected) return [];
  const [rows]: any = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    categoryName: r.categoryName || '',
    ageRange: r.ageRange || '',
    ageFilter: r.ageFilter || '3-5',
    price: Number(r.price || 0),
    oldPrice: r.oldPrice ? Number(r.oldPrice) : undefined,
    rating: Number(r.rating || 5),
    reviewsCount: Number(r.reviewsCount || 0),
    isPopular: Boolean(r.isPopular),
    isNew: Boolean(r.isNew),
    inStock: Boolean(r.inStock),
    image: r.image || '',
    gallery: typeof r.gallery === 'string' ? JSON.parse(r.gallery || '[]') : (r.gallery || []),
    description: r.description || '',
    shortDesc: r.shortDesc || '',
    features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : (r.features || []),
    skillsDeveloped: typeof r.skillsDeveloped === 'string' ? JSON.parse(r.skillsDeveloped || '[]') : (r.skillsDeveloped || []),
    materials: r.materials || '',
    dimensions: r.dimensions || '',
    safetyCertificate: r.safetyCertificate || '',
    viewsCount: Number(r.viewsCount || 0)
  }));
}

export async function mysqlSaveProduct(p: Product): Promise<void> {
  if (!pool || !isConnected) return;
  const sql = `
    INSERT INTO products (
      id, title, category, categoryName, ageRange, ageFilter, price, oldPrice, rating, reviewsCount,
      isPopular, isNew, inStock, image, gallery, description, shortDesc, features, skillsDeveloped,
      materials, dimensions, safetyCertificate, viewsCount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      category = VALUES(category),
      categoryName = VALUES(categoryName),
      ageRange = VALUES(ageRange),
      ageFilter = VALUES(ageFilter),
      price = VALUES(price),
      oldPrice = VALUES(oldPrice),
      rating = VALUES(rating),
      reviewsCount = VALUES(reviewsCount),
      isPopular = VALUES(isPopular),
      isNew = VALUES(isNew),
      inStock = VALUES(inStock),
      image = VALUES(image),
      gallery = VALUES(gallery),
      description = VALUES(description),
      shortDesc = VALUES(shortDesc),
      features = VALUES(features),
      skillsDeveloped = VALUES(skillsDeveloped),
      materials = VALUES(materials),
      dimensions = VALUES(dimensions),
      safetyCertificate = VALUES(safetyCertificate),
      viewsCount = VALUES(viewsCount)
  `;
  await pool.execute(sql, [
    p.id,
    p.title,
    p.category || 'wooden',
    p.categoryName || '',
    p.ageRange || '',
    p.ageFilter || '3-5',
    p.price || 0,
    p.oldPrice !== undefined ? p.oldPrice : null,
    p.rating || 5,
    p.reviewsCount || 0,
    p.isPopular ? 1 : 0,
    p.isNew ? 1 : 0,
    p.inStock !== false ? 1 : 0,
    p.image || '',
    JSON.stringify(p.gallery || []),
    p.description || '',
    p.shortDesc || '',
    JSON.stringify(p.features || []),
    JSON.stringify(p.skillsDeveloped || []),
    p.materials || '',
    p.dimensions || '',
    p.safetyCertificate || '',
    p.viewsCount || 0
  ]);
}

export async function mysqlDeleteProduct(id: string): Promise<void> {
  if (!pool || !isConnected) return;
  await pool.execute('DELETE FROM products WHERE id = ?', [id]);
}

export async function mysqlGetAllPodcasts(): Promise<PodcastEpisode[]> {
  if (!pool || !isConnected) return [];
  const [rows]: any = await pool.query('SELECT * FROM podcasts ORDER BY created_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || '',
    duration: r.duration || '',
    durationSeconds: Number(r.durationSeconds || 0),
    narrator: r.narrator || '',
    category: r.category || 'story',
    categoryName: r.categoryName || '',
    coverImage: r.coverImage || '',
    audioUrl: r.audioUrl || '',
    description: r.description || '',
    transcript: r.transcript || '',
    targetAge: r.targetAge || '',
    playsCount: Number(r.playsCount || 0),
    likesCount: Number(r.likesCount || 0),
    releaseDate: r.releaseDate || ''
  }));
}

export async function mysqlSavePodcast(pod: PodcastEpisode): Promise<void> {
  if (!pool || !isConnected) return;
  const sql = `
    INSERT INTO podcasts (
      id, title, subtitle, narrator, duration, durationSeconds, category, categoryName, coverImage, audioUrl,
      description, transcript, targetAge, playsCount, likesCount, releaseDate
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      subtitle = VALUES(subtitle),
      narrator = VALUES(narrator),
      duration = VALUES(duration),
      durationSeconds = VALUES(durationSeconds),
      category = VALUES(category),
      categoryName = VALUES(categoryName),
      coverImage = VALUES(coverImage),
      audioUrl = VALUES(audioUrl),
      description = VALUES(description),
      transcript = VALUES(transcript),
      targetAge = VALUES(targetAge),
      playsCount = VALUES(playsCount),
      likesCount = VALUES(likesCount),
      releaseDate = VALUES(releaseDate)
  `;
  await pool.execute(sql, [
    pod.id,
    pod.title,
    pod.subtitle || '',
    pod.narrator || '',
    pod.duration || '',
    pod.durationSeconds || 0,
    pod.category || 'story',
    pod.categoryName || '',
    pod.coverImage || '',
    pod.audioUrl || '',
    pod.description || '',
    pod.transcript || '',
    pod.targetAge || '',
    pod.playsCount || 0,
    pod.likesCount || 0,
    pod.releaseDate || ''
  ]);
}

export async function mysqlDeletePodcast(id: string): Promise<void> {
  if (!pool || !isConnected) return;
  await pool.execute('DELETE FROM podcasts WHERE id = ?', [id]);
}

export async function mysqlGetAllReviews(): Promise<ParentReview[]> {
  if (!pool || !isConnected) return [];
  const [rows]: any = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    productId: r.productId || '',
    productName: r.productName || '',
    parentName: r.parentName || '',
    childAge: r.childAge || '',
    rating: Number(r.rating || 5),
    date: r.date || '',
    comment: r.comment || '',
    approved: Boolean(r.approved),
    helpfulCount: Number(r.helpfulCount || 0),
    verifiedPurchase: Boolean(r.verifiedPurchase)
  }));
}

export async function mysqlSaveReview(rev: ParentReview): Promise<void> {
  if (!pool || !isConnected) return;
  const sql = `
    INSERT INTO reviews (
      id, productId, productName, parentName, childAge, rating, date, comment, approved, helpfulCount, verifiedPurchase
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      productId = VALUES(productId),
      productName = VALUES(productName),
      parentName = VALUES(parentName),
      childAge = VALUES(childAge),
      rating = VALUES(rating),
      date = VALUES(date),
      comment = VALUES(comment),
      approved = VALUES(approved),
      helpfulCount = VALUES(helpfulCount),
      verifiedPurchase = VALUES(verifiedPurchase)
  `;
  await pool.execute(sql, [
    rev.id,
    rev.productId || '',
    rev.productName || '',
    rev.parentName,
    rev.childAge || '',
    rev.rating || 5,
    rev.date || '',
    rev.comment || '',
    rev.approved !== false ? 1 : 0,
    rev.helpfulCount || 0,
    rev.verifiedPurchase !== false ? 1 : 0
  ]);
}

export async function mysqlDeleteReview(id: string): Promise<void> {
  if (!pool || !isConnected) return;
  await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
}

export async function mysqlGetAnalytics(): Promise<UsageAnalytics | null> {
  if (!pool || !isConnected) return null;
  const [rows]: any = await pool.query('SELECT * FROM analytics WHERE id = "current" LIMIT 1');
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    totalVisits: Number(r.totalVisits || 0),
    totalPodcastListens: Number(r.totalPodcastListens || 0),
    totalProductViews: Number(r.totalProductViews || 0),
    totalReviews: Number(r.totalReviews || 0),
    weeklyVisits: typeof r.weeklyVisits === 'string' ? JSON.parse(r.weeklyVisits || '[]') : (r.weeklyVisits || []),
    categoryPopularity: typeof r.categoryPopularity === 'string' ? JSON.parse(r.categoryPopularity || '[]') : (r.categoryPopularity || [])
  };
}

export async function mysqlSaveAnalytics(an: UsageAnalytics): Promise<void> {
  if (!pool || !isConnected) return;
  const sql = `
    INSERT INTO analytics (id, totalVisits, totalPodcastListens, totalProductViews, totalReviews, weeklyVisits, categoryPopularity)
    VALUES ("current", ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      totalVisits = VALUES(totalVisits),
      totalPodcastListens = VALUES(totalPodcastListens),
      totalProductViews = VALUES(totalProductViews),
      totalReviews = VALUES(totalReviews),
      weeklyVisits = VALUES(weeklyVisits),
      categoryPopularity = VALUES(categoryPopularity)
  `;
  await pool.execute(sql, [
    an.totalVisits || 0,
    an.totalPodcastListens || 0,
    an.totalProductViews || 0,
    an.totalReviews || 0,
    JSON.stringify(an.weeklyVisits || []),
    JSON.stringify(an.categoryPopularity || [])
  ]);
}

export async function mysqlSaveMessage(m: ContactMessage): Promise<void> {
  if (!pool || !isConnected) return;
  const sql = `
    INSERT INTO messages (id, name, email, phone, subject, message, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [
    m.id,
    m.name || '',
    m.email || '',
    m.phone || '',
    m.subject || '',
    m.message || '',
    m.date || ''
  ]);
}

export async function mysqlGetAllMessages(): Promise<ContactMessage[]> {
  if (!pool || !isConnected) return [];
  const [rows]: any = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

/**
 * Generates an SQL dump file string with full INSERT statements
 */
export function generateSqlDump(
  products: Product[],
  podcasts: PodcastEpisode[],
  reviews: ParentReview[],
  analytics: UsageAnalytics
): string {
  let sql = `-- =========================================================\n`;
  sql += `-- ToyLand Full MySQL Database Backup & Seed Export\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n`;
  sql += `-- =========================================================\n\n`;

  sql += `CREATE DATABASE IF NOT EXISTS \`toyland_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
  sql += `USE \`toyland_db\`;\n\n`;

  // Products
  if (products.length > 0) {
    sql += `-- ---------------------------------------------------------\n`;
    sql += `-- Products (${products.length} records)\n`;
    sql += `-- ---------------------------------------------------------\n`;
    for (const p of products) {
      const title = (p.title || '').replace(/'/g, "''");
      const cat = (p.category || '').replace(/'/g, "''");
      const catName = (p.categoryName || '').replace(/'/g, "''");
      const ageRange = (p.ageRange || '').replace(/'/g, "''");
      const ageFilter = (p.ageFilter || '').replace(/'/g, "''");
      const img = (p.image || '').replace(/'/g, "''");
      const gal = JSON.stringify(p.gallery || []).replace(/'/g, "''");
      const desc = (p.description || '').replace(/'/g, "''");
      const shortDesc = (p.shortDesc || '').replace(/'/g, "''");
      const feat = JSON.stringify(p.features || []).replace(/'/g, "''");
      const skills = JSON.stringify(p.skillsDeveloped || []).replace(/'/g, "''");
      const mat = (p.materials || '').replace(/'/g, "''");
      const dim = (p.dimensions || '').replace(/'/g, "''");
      const cert = (p.safetyCertificate || '').replace(/'/g, "''");

      sql += `INSERT INTO \`products\` (\`id\`, \`title\`, \`category\`, \`categoryName\`, \`ageRange\`, \`ageFilter\`, \`price\`, \`oldPrice\`, \`rating\`, \`reviewsCount\`, \`isPopular\`, \`isNew\`, \`inStock\`, \`image\`, \`gallery\`, \`description\`, \`shortDesc\`, \`features\`, \`skillsDeveloped\`, \`materials\`, \`dimensions\`, \`safetyCertificate\`, \`viewsCount\`) VALUES ('${p.id}', '${title}', '${cat}', '${catName}', '${ageRange}', '${ageFilter}', ${p.price || 0}, ${p.oldPrice !== undefined ? p.oldPrice : 'NULL'}, ${p.rating || 5}, ${p.reviewsCount || 0}, ${p.isPopular ? 1 : 0}, ${p.isNew ? 1 : 0}, ${p.inStock !== false ? 1 : 0}, '${img}', '${gal}', '${desc}', '${shortDesc}', '${feat}', '${skills}', '${mat}', '${dim}', '${cert}', ${p.viewsCount || 0}) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`);\n`;
    }
    sql += `\n`;
  }

  // Podcasts
  if (podcasts.length > 0) {
    sql += `-- ---------------------------------------------------------\n`;
    sql += `-- Podcasts (${podcasts.length} records)\n`;
    sql += `-- ---------------------------------------------------------\n`;
    for (const pod of podcasts) {
      const title = (pod.title || '').replace(/'/g, "''");
      const subtitle = (pod.subtitle || '').replace(/'/g, "''");
      const narr = (pod.narrator || '').replace(/'/g, "''");
      const dur = (pod.duration || '').replace(/'/g, "''");
      const cat = (pod.category || '').replace(/'/g, "''");
      const catName = (pod.categoryName || '').replace(/'/g, "''");
      const cov = (pod.coverImage || '').replace(/'/g, "''");
      const audio = (pod.audioUrl || '').replace(/'/g, "''");
      const desc = (pod.description || '').replace(/'/g, "''");
      const targetAge = (pod.targetAge || '').replace(/'/g, "''");
      const rel = (pod.releaseDate || '').replace(/'/g, "''");

      sql += `INSERT INTO \`podcasts\` (\`id\`, \`title\`, \`subtitle\`, \`narrator\`, \`duration\`, \`durationSeconds\`, \`category\`, \`categoryName\`, \`coverImage\`, \`audioUrl\`, \`description\`, \`targetAge\`, \`playsCount\`, \`likesCount\`, \`releaseDate\`) VALUES ('${pod.id}', '${title}', '${subtitle}', '${narr}', '${dur}', ${pod.durationSeconds || 0}, '${cat}', '${catName}', '${cov}', '${audio}', '${desc}', '${targetAge}', ${pod.playsCount || 0}, ${pod.likesCount || 0}, '${rel}') ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`);\n`;
    }
    sql += `\n`;
  }

  // Reviews
  if (reviews.length > 0) {
    sql += `-- ---------------------------------------------------------\n`;
    sql += `-- Reviews (${reviews.length} records)\n`;
    sql += `-- ---------------------------------------------------------\n`;
    for (const r of reviews) {
      const prodId = (r.productId || '').replace(/'/g, "''");
      const prodName = (r.productName || '').replace(/'/g, "''");
      const name = (r.parentName || '').replace(/'/g, "''");
      const age = (r.childAge || '').replace(/'/g, "''");
      const dt = (r.date || '').replace(/'/g, "''");
      const comm = (r.comment || '').replace(/'/g, "''");

      sql += `INSERT INTO \`reviews\` (\`id\`, \`productId\`, \`productName\`, \`parentName\`, \`childAge\`, \`rating\`, \`date\`, \`comment\`, \`approved\`, \`helpfulCount\`, \`verifiedPurchase\`) VALUES ('${r.id}', '${prodId}', '${prodName}', '${name}', '${age}', ${r.rating || 5}, '${dt}', '${comm}', ${r.approved !== false ? 1 : 0}, ${r.helpfulCount || 0}, ${r.verifiedPurchase !== false ? 1 : 0}) ON DUPLICATE KEY UPDATE \`comment\`=VALUES(\`comment\`);\n`;
    }
    sql += `\n`;
  }

  return sql;
}
