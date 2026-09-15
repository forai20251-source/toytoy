import React, { useState, useEffect } from 'react';
import { 
  Page, 
  Product, 
  PodcastEpisode, 
  ParentReview, 
  UsageAnalytics, 
  AgeGroup,
  AdminUser
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_PODCASTS, 
  INITIAL_REVIEWS, 
  INITIAL_ANALYTICS 
} from './data/initialData';
import { 
  initializeDatabaseSeed,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  addPodcastToDb,
  updatePodcastInDb,
  deletePodcastFromDb,
  addReviewToDb,
  updateReviewInDb,
  deleteReviewFromDb,
  updateAnalyticsInDb
} from './lib/dbService';
import { getStoredAdminUser, logoutAdmin } from './lib/authService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { HomePage } from './components/pages/HomePage';
import { ProductsPage } from './components/pages/ProductsPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { PodcastsPage } from './components/pages/PodcastsPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminPanelPage } from './components/pages/AdminPanelPage';
import { AdminLoginPage } from './components/pages/AdminLoginPage';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productsAgeFilter, setProductsAgeFilter] = useState<AgeGroup>('all');
  const [isDbLoading, setIsDbLoading] = useState(true);

  // Authenticated Admin User State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => getStoredAdminUser());

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // Products State with localStorage + cloud database fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('toyland_products_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Podcasts State with localStorage + cloud database fallback
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(() => {
    try {
      const saved = localStorage.getItem('toyland_podcasts_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PODCASTS;
  });

  // Reviews State with localStorage + cloud database fallback
  const [reviews, setReviews] = useState<ParentReview[]>(() => {
    try {
      const saved = localStorage.getItem('toyland_reviews_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REVIEWS;
  });

  // Analytics State
  const [analytics, setAnalytics] = useState<UsageAnalytics>(() => {
    try {
      const saved = localStorage.getItem('toyland_analytics_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ANALYTICS;
  });

  // Connect to Firestore cloud database on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadCloudDatabase() {
      try {
        const cloudData = await initializeDatabaseSeed();
        if (isMounted) {
          if (cloudData.products.length > 0) setProducts(cloudData.products);
          if (cloudData.podcasts.length > 0) setPodcasts(cloudData.podcasts);
          if (cloudData.reviews.length > 0) setReviews(cloudData.reviews);
          if (cloudData.analytics) setAnalytics(cloudData.analytics);
          setIsDbLoading(false);
        }
      } catch (err) {
        console.error('Failed to sync with cloud backend:', err);
        if (isMounted) setIsDbLoading(false);
      }
    }
    loadCloudDatabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // Global Audio Player State
  const [activePodcast, setActivePodcast] = useState<PodcastEpisode | null>(null);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);

  // Global Dark Mode (Evening Mode) State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('toyland_theme');
      if (savedTheme !== null) {
        return savedTheme === 'dark';
      }
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark mode class to <html>
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('toyland_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('toyland_theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('toyland_products_v1', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('toyland_podcasts_v1', JSON.stringify(podcasts));
    } catch {
      // ignore
    }
  }, [podcasts]);

  useEffect(() => {
    try {
      localStorage.setItem('toyland_reviews_v1', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('toyland_analytics_v1', JSON.stringify(analytics));
    } catch {
      // ignore
    }
  }, [analytics]);

  // Track site visit on mount
  useEffect(() => {
    setAnalytics(prev => ({
      ...prev,
      totalVisits: prev.totalVisits + 1
    }));
  }, []);

  // Navigation Handler
  const handleNavigate = (page: Page, extra?: { productId?: string; ageFilter?: AgeGroup }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (extra?.productId) {
      setSelectedProductId(extra.productId);
      // Increment product view count
      setProducts(prev => prev.map(p => {
        if (p.id === extra.productId) {
          return { ...p, viewsCount: (p.viewsCount || 0) + 1 };
        }
        return p;
      }));
      setAnalytics(prev => ({
        ...prev,
        totalProductViews: prev.totalProductViews + 1
      }));
    }
    if (extra?.ageFilter) {
      setProductsAgeFilter(extra.ageFilter);
    }
    setCurrentPage(page);
  };

  // Audio Handlers
  const handlePlayPodcast = (podcast: PodcastEpisode) => {
    if (activePodcast?.id === podcast.id) {
      setIsPlayingPodcast(!isPlayingPodcast);
    } else {
      setActivePodcast(podcast);
      setIsPlayingPodcast(true);

      // Increment podcast play counter
      const updatedPodcasts = podcasts.map(p => {
        if (p.id === podcast.id) {
          const updated = { ...p, playsCount: p.playsCount + 1 };
          updatePodcastInDb(updated).catch(console.error);
          return updated;
        }
        return p;
      });
      setPodcasts(updatedPodcasts);

      setAnalytics(prev => {
        const next = { ...prev, totalPodcastListens: prev.totalPodcastListens + 1 };
        updateAnalyticsInDb(next).catch(console.error);
        return next;
      });
    }
  };

  const handleLikePodcast = (podcastId: string) => {
    setPodcasts(prev => prev.map(p => {
      if (p.id === podcastId) {
        const updated = { ...p, likesCount: p.likesCount + 1 };
        updatePodcastInDb(updated).catch(console.error);
        return updated;
      }
      return p;
    }));
  };

  // Product CRUD
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    addProductToDb(newProduct).catch(console.error);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    updateProductInDb(updatedProduct).catch(console.error);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteProductFromDb(productId).catch(console.error);
  };

  // Podcast CRUD
  const handleAddPodcast = (newPodcast: PodcastEpisode) => {
    setPodcasts(prev => [newPodcast, ...prev]);
    addPodcastToDb(newPodcast).catch(console.error);
  };

  const handleUpdatePodcast = (updatedPodcast: PodcastEpisode) => {
    setPodcasts(prev => prev.map(p => p.id === updatedPodcast.id ? updatedPodcast : p));
    if (activePodcast?.id === updatedPodcast.id) {
      setActivePodcast(updatedPodcast);
    }
    updatePodcastInDb(updatedPodcast).catch(console.error);
  };

  const handleDeletePodcast = (podcastId: string) => {
    setPodcasts(prev => prev.filter(p => p.id !== podcastId));
    if (activePodcast?.id === podcastId) {
      setActivePodcast(null);
      setIsPlayingPodcast(false);
    }
    deletePodcastFromDb(podcastId).catch(console.error);
  };

  // Review CRUD
  const handleAddReview = (newReview: Omit<ParentReview, 'id' | 'date' | 'approved' | 'helpfulCount' | 'verifiedPurchase'>) => {
    const reviewItem: ParentReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'لحظاتی پیش',
      approved: false, // goes to admin moderation queue!
      helpfulCount: 0,
      verifiedPurchase: true
    };
    setReviews(prev => [reviewItem, ...prev]);
    addReviewToDb(reviewItem).catch(console.error);

    setAnalytics(prev => {
      const next = { ...prev, totalReviews: prev.totalReviews + 1 };
      updateAnalyticsInDb(next).catch(console.error);
      return next;
    });
  };

  const handleApproveReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const updated = { ...r, approved: true };
        updateReviewInDb(updated).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    deleteReviewFromDb(reviewId).catch(console.error);
  };

  const handleHelpfulReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const updated = { ...r, helpfulCount: r.helpfulCount + 1 };
        updateReviewInDb(updated).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  // Reset Sample Data
  const handleResetSampleData = () => {
    if (confirm('آیا از بازنشانی داده‌های محصولات و پادکست‌ها به حالت پیش‌فرض مطمئن هستید؟')) {
      setProducts(INITIAL_PRODUCTS);
      setPodcasts(INITIAL_PODCASTS);
      setReviews(INITIAL_REVIEWS);
      setAnalytics(INITIAL_ANALYTICS);
      localStorage.removeItem('toyland_products_v1');
      localStorage.removeItem('toyland_podcasts_v1');
      localStorage.removeItem('toyland_reviews_v1');
      localStorage.removeItem('toyland_analytics_v1');
      alert('داده‌ها با موفقیت به حالت پیش‌فرض اولیه بازنشانی شدند.');
    }
  };

  const pendingReviewsCount = reviews.filter(r => !r.approved).length;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        activePodcast={activePodcast}
        isPlayingPodcast={isPlayingPodcast}
        onTogglePodcastPlay={() => setIsPlayingPodcast(!isPlayingPodcast)}
        pendingReviewsCount={pendingReviewsCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentUser={currentUser}
        onLogout={handleAdminLogout}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            podcasts={podcasts}
            reviews={reviews}
            onNavigate={handleNavigate}
            onPlayPodcast={handlePlayPodcast}
            activePodcastId={activePodcast?.id}
            isPlayingPodcast={isPlayingPodcast}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            products={products}
            initialAgeFilter={productsAgeFilter}
            onSelectProduct={(id) => handleNavigate('product-detail', { productId: id })}
          />
        )}

        {currentPage === 'product-detail' && currentProduct && (
          <ProductDetailPage
            product={currentProduct}
            reviews={reviews}
            onBack={() => handleNavigate('products')}
            onAddReview={handleAddReview}
            onHelpfulReview={handleHelpfulReview}
          />
        )}

        {currentPage === 'podcasts' && (
          <PodcastsPage
            podcasts={podcasts}
            activePodcastId={activePodcast?.id}
            isPlaying={isPlayingPodcast}
            onPlayPodcast={handlePlayPodcast}
            onLikePodcast={handleLikePodcast}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'admin' && (
          currentUser ? (
            <AdminPanelPage
              products={products}
              podcasts={podcasts}
              reviews={reviews}
              analytics={analytics}
              currentUser={currentUser}
              onLogout={handleAdminLogout}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddPodcast={handleAddPodcast}
              onUpdatePodcast={handleUpdatePodcast}
              onDeletePodcast={handleDeletePodcast}
              onApproveReview={handleApproveReview}
              onDeleteReview={handleDeleteReview}
              onResetSampleData={handleResetSampleData}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={handleAdminLoginSuccess}
              onCancel={() => handleNavigate('home')}
            />
          )
        )}
      </main>

      {/* Global Bottom Audio Player for Stories & Podcasts */}
      <AudioPlayerBar
        podcast={activePodcast}
        isPlaying={isPlayingPodcast}
        onTogglePlay={() => setIsPlayingPodcast(!isPlayingPodcast)}
        onClose={() => {
          setIsPlayingPodcast(false);
          setActivePodcast(null);
        }}
        onNavigateToPodcasts={() => handleNavigate('podcasts')}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
