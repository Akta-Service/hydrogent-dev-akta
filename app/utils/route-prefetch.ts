/**
 * Route prefetching utilities for faster page transitions
 */

// Cache for prefetched data
const prefetchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Active prefetch promises to prevent duplicate requests
const activePrefetches = new Map<string, Promise<any>>();

interface PrefetchOptions {
  cacheKey?: string;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Prefetch and cache route data
 * @param url - The URL to prefetch
 * @param options - Prefetch options
 * @returns Promise that resolves with the prefetched data
 */
export async function prefetchRouteData(
  url: string,
  options: PrefetchOptions = {}
): Promise<any> {
  // Use provided cache key or generate one from URL
  const cacheKey = options.cacheKey || url;
  
  // Check if we already have a fresh cached version
  const cached = prefetchCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < (options.ttl || CACHE_DURATION)) {
    return cached.data;
  }
  
  // Check if we're already prefetching this URL
  if (activePrefetches.has(cacheKey)) {
    return activePrefetches.get(cacheKey);
  }
  
  // Create prefetch promise
  const prefetchPromise = fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-Prefetch': 'true', // Custom header to identify prefetch requests
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Prefetch failed: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Cache the data
      prefetchCache.set(cacheKey, {
        data,
        timestamp: now,
      });
      return data;
    })
    .catch(error => {
      console.warn(`Failed to prefetch ${url}:`, error);
      throw error;
    })
    .finally(() => {
      // Clean up active prefetch
      activePrefetches.delete(cacheKey);
    });
  
  // Store the active prefetch
  activePrefetches.set(cacheKey, prefetchPromise);
  
  return prefetchPromise;
}

/**
 * Clear prefetch cache
 * @param cacheKey - Specific cache key to clear, or clears all if not provided
 */
export function clearPrefetchCache(cacheKey?: string) {
  if (cacheKey) {
    prefetchCache.delete(cacheKey);
  } else {
    prefetchCache.clear();
  }
}

/**
 * Get cached data for a URL
 * @param url - The URL to check
 * @returns Cached data or null if not found or expired
 */
export function getCachedRouteData(url: string): any | null {
  const cached = prefetchCache.get(url);
  if (!cached) return null;
  
  const now = Date.now();
  if ((now - cached.timestamp) >= CACHE_DURATION) {
    prefetchCache.delete(url);
    return null;
  }
  
  return cached.data;
}

/**
 * Prefetch common navigation routes
 */
export function prefetchCommonRoutes() {
  const commonRoutes = [
    '/collections',
    '/collections/all',
    '/wishlist',
    '/account',
    '/search',
    '/blogs/news',
  ];
  
  // Prefetch common routes in background
  commonRoutes.forEach(route => {
    prefetchRouteData(route).catch(() => {
      // Ignore errors for background prefetching
    });
  });
}

/**
 * Prefetch based on viewport intersection (for links that are about to become visible)
 * @param element - The element to observe
 * @param url - The URL to prefetch when element becomes visible
 */
export function prefetchOnViewport(
  element: HTMLElement,
  url: string
): () => void {
  if (!('IntersectionObserver' in window)) {
    return () => {}; // No cleanup needed
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          prefetchRouteData(url).catch(() => {
            // Ignore errors
          });
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: '100px', // Start prefetching when element is 100px from viewport
    }
  );
  
  observer.observe(element);
  
  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Prefetch on hover for navigation links
 * @param element - The link element
 * @param url - The URL to prefetch
 */
export function prefetchOnHover(
  element: HTMLElement,
  url: string
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      prefetchRouteData(url).catch(() => {
        // Ignore errors
      });
    }, 50); // Small delay to avoid prefetching on accidental hover
  };
  
  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

// Export utilities
export default {
  prefetchRouteData,
  clearPrefetchCache,
  getCachedRouteData,
  prefetchCommonRoutes,
  prefetchOnViewport,
  prefetchOnHover,
};