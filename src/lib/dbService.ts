import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, PodcastEpisode, ParentReview, UsageAnalytics } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_PODCASTS, 
  INITIAL_REVIEWS, 
  INITIAL_ANALYTICS 
} from '../data/initialData';

const PRODUCTS_COLLECTION = 'products';
const PODCASTS_COLLECTION = 'podcasts';
const REVIEWS_COLLECTION = 'reviews';
const ANALYTICS_COLLECTION = 'analytics';
const ANALYTICS_DOC_ID = 'current';

/**
 * Initializes database seed:
 * 1. Attempts to load from the Self-Hosted Express server database (/api/all-data)
 * 2. If running standalone or API unavailable, falls back to Firestore / local seed
 */
export async function initializeDatabaseSeed(): Promise<{
  products: Product[];
  podcasts: PodcastEpisode[];
  reviews: ParentReview[];
  analytics: UsageAnalytics;
}> {
  // 1. Check self-hosted server API first
  try {
    const res = await fetch('/api/all-data', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        console.log('[Database] Loaded from Self-Hosted Server local database successfully.');
        return {
          products: json.data.products || INITIAL_PRODUCTS,
          podcasts: json.data.podcasts || INITIAL_PODCASTS,
          reviews: json.data.reviews || INITIAL_REVIEWS,
          analytics: json.data.analytics || INITIAL_ANALYTICS
        };
      }
    }
  } catch (apiErr) {
    console.log('[Database] Local API skipped, attempting fallback:', apiErr);
  }

  // 2. Fallback to Firestore
  try {
    const fetchWithTimeout = async () => {
      // 1. Check & Fetch Products
      const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      let products: Product[] = [];
      if (productsSnap.empty) {
        const batch = writeBatch(db);
        for (const prod of INITIAL_PRODUCTS) {
          const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
          batch.set(docRef, prod);
        }
        await batch.commit();
        products = [...INITIAL_PRODUCTS];
      } else {
        products = productsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
      }

      // 2. Check & Fetch Podcasts
      const podcastsSnap = await getDocs(collection(db, PODCASTS_COLLECTION));
      let podcasts: PodcastEpisode[] = [];
      if (podcastsSnap.empty) {
        const batch = writeBatch(db);
        for (const pod of INITIAL_PODCASTS) {
          const docRef = doc(db, PODCASTS_COLLECTION, pod.id);
          batch.set(docRef, pod);
        }
        await batch.commit();
        podcasts = [...INITIAL_PODCASTS];
      } else {
        podcasts = podcastsSnap.docs.map(d => ({ ...d.data(), id: d.id } as PodcastEpisode));
      }

      // 3. Check & Fetch Reviews
      const reviewsSnap = await getDocs(collection(db, REVIEWS_COLLECTION));
      let reviews: ParentReview[] = [];
      if (reviewsSnap.empty) {
        const batch = writeBatch(db);
        for (const rev of INITIAL_REVIEWS) {
          const docRef = doc(db, REVIEWS_COLLECTION, rev.id);
          batch.set(docRef, rev);
        }
        await batch.commit();
        reviews = [...INITIAL_REVIEWS];
      } else {
        reviews = reviewsSnap.docs.map(d => ({ ...d.data(), id: d.id } as ParentReview));
      }

      // 4. Check & Fetch Analytics
      const analyticsSnap = await getDocs(collection(db, ANALYTICS_COLLECTION));
      let analytics: UsageAnalytics = INITIAL_ANALYTICS;
      if (analyticsSnap.empty) {
        await setDoc(doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID), INITIAL_ANALYTICS);
      } else {
        const docData = analyticsSnap.docs.find(d => d.id === ANALYTICS_DOC_ID);
        if (docData) {
          analytics = docData.data() as UsageAnalytics;
        }
      }

      return { products, podcasts, reviews, analytics };
    };

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Database sync timeout - switching to local cache')), 4000)
    );

    return await Promise.race([fetchWithTimeout(), timeoutPromise]);
  } catch (error) {
    console.warn('[Database] Operating with local state:', error);
    return {
      products: INITIAL_PRODUCTS,
      podcasts: INITIAL_PODCASTS,
      reviews: INITIAL_REVIEWS,
      analytics: INITIAL_ANALYTICS
    };
  }
}

// ----------------- Product Operations -----------------

export async function addProductToDb(product: Product): Promise<void> {
  // Sync to self-hosted server
  fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product);
  } catch (err) {
    console.warn('Failed to sync added product to Firestore:', err);
  }
}

export async function updateProductInDb(product: Product): Promise<void> {
  // Sync to self-hosted server
  fetch(`/api/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await updateDoc(docRef, { ...product });
  } catch (err) {
    console.warn('Failed to sync updated product to Firestore:', err);
  }
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  // Sync to self-hosted server
  fetch(`/api/products/${productId}`, {
    method: 'DELETE'
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to sync deleted product to Firestore:', err);
  }
}

// ----------------- Review Operations -----------------

export async function addReviewToDb(review: ParentReview): Promise<void> {
  // Sync to self-hosted server
  fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, review.id);
    await setDoc(docRef, review);
  } catch (err) {
    console.warn('Failed to sync review to Firestore:', err);
  }
}

export async function updateReviewInDb(review: ParentReview): Promise<void> {
  // Sync to self-hosted server
  fetch(`/api/reviews/${review.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, review.id);
    await updateDoc(docRef, { ...review });
  } catch (err) {
    console.warn('Failed to sync review update to Firestore:', err);
  }
}

export async function deleteReviewFromDb(reviewId: string): Promise<void> {
  // Sync to self-hosted server
  fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to sync review deletion to Firestore:', err);
  }
}

// ----------------- Podcast Operations -----------------

export async function updatePodcastInDb(podcast: PodcastEpisode): Promise<void> {
  // Sync to self-hosted server
  fetch(`/api/podcasts/${podcast.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podcast)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, PODCASTS_COLLECTION, podcast.id);
    await updateDoc(docRef, { ...podcast });
  } catch (err) {
    console.warn('Failed to sync podcast update to Firestore:', err);
  }
}

export async function addPodcastToDb(podcast: PodcastEpisode): Promise<void> {
  // Sync to self-hosted server
  fetch('/api/podcasts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podcast)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, PODCASTS_COLLECTION, podcast.id);
    await setDoc(docRef, podcast);
  } catch (err) {
    console.warn('Failed to sync podcast add to Firestore:', err);
  }
}

export async function deletePodcastFromDb(podcastId: string): Promise<void> {
  // Sync to self-hosted server
  fetch(`/api/podcasts/${podcastId}`, {
    method: 'DELETE'
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, PODCASTS_COLLECTION, podcastId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to sync podcast deletion to Firestore:', err);
  }
}

// ----------------- Analytics Operations -----------------

export async function updateAnalyticsInDb(analytics: UsageAnalytics): Promise<void> {
  // Sync to self-hosted server
  fetch('/api/analytics', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analytics)
  }).catch(() => {});

  // Sync to Firestore fallback
  try {
    const docRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    await setDoc(docRef, analytics, { merge: true });
  } catch (err) {
    console.warn('Failed to sync analytics to Firestore:', err);
  }
}

// ----------------- Self-Hosted Server Operations -----------------

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return null;
}

export function exportDatabaseBackupUrl(): string {
  return '/api/db/export';
}

export async function importDatabaseBackup(jsonData: unknown): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/db/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function resetServerDatabase(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/db/reset', { method: 'POST' });
    return await res.json();
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

