-- =========================================================
-- ToyLand MySQL Database Schema & Initial Data
-- Character Set: utf8mb4 (Full Persian & Emoji Support)
-- =========================================================

CREATE DATABASE IF NOT EXISTS `toyland_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `toyland_db`;

-- 1. Table: products
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(128) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `categoryName` VARCHAR(255) NOT NULL DEFAULT '',
  `ageRange` VARCHAR(50) NOT NULL DEFAULT '',
  `ageFilter` VARCHAR(20) NOT NULL DEFAULT '3-5',
  `price` INT NOT NULL DEFAULT 0,
  `oldPrice` INT DEFAULT NULL,
  `rating` DECIMAL(3, 1) NOT NULL DEFAULT 5.0,
  `reviewsCount` INT NOT NULL DEFAULT 0,
  `isPopular` BOOLEAN DEFAULT FALSE,
  `isNew` BOOLEAN DEFAULT FALSE,
  `inStock` BOOLEAN DEFAULT TRUE,
  `image` TEXT,
  `gallery` JSON,
  `description` TEXT,
  `shortDesc` TEXT,
  `features` JSON,
  `skillsDeveloped` JSON,
  `materials` VARCHAR(255) DEFAULT '',
  `dimensions` VARCHAR(100) DEFAULT '',
  `safetyCertificate` VARCHAR(255) DEFAULT '',
  `viewsCount` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: podcasts
CREATE TABLE IF NOT EXISTS `podcasts` (
  `id` VARCHAR(128) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `narrator` VARCHAR(255),
  `duration` VARCHAR(50),
  `durationSeconds` INT DEFAULT 0,
  `category` VARCHAR(100) DEFAULT 'story',
  `categoryName` VARCHAR(255) DEFAULT '',
  `coverImage` TEXT,
  `audioUrl` TEXT,
  `description` TEXT,
  `transcript` MEDIUMTEXT,
  `targetAge` VARCHAR(50) DEFAULT '',
  `playsCount` INT DEFAULT 0,
  `likesCount` INT DEFAULT 0,
  `releaseDate` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(128) NOT NULL PRIMARY KEY,
  `productId` VARCHAR(128) NOT NULL DEFAULT '',
  `productName` VARCHAR(255) NOT NULL DEFAULT '',
  `parentName` VARCHAR(255) NOT NULL,
  `childAge` VARCHAR(100) DEFAULT '',
  `rating` INT NOT NULL DEFAULT 5,
  `date` VARCHAR(50) DEFAULT '',
  `comment` TEXT NOT NULL,
  `approved` BOOLEAN DEFAULT TRUE,
  `helpfulCount` INT DEFAULT 0,
  `verifiedPurchase` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: analytics
CREATE TABLE IF NOT EXISTS `analytics` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `totalVisits` INT DEFAULT 0,
  `totalPodcastListens` INT DEFAULT 0,
  `totalProductViews` INT DEFAULT 0,
  `totalReviews` INT DEFAULT 0,
  `weeklyVisits` JSON,
  `categoryPopularity` JSON,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` VARCHAR(128) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `subject` VARCHAR(255),
  `message` TEXT NOT NULL,
  `date` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

