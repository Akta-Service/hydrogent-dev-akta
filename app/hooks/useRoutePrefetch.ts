/**
 * Custom hook for route prefetching
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from '@remix-run/react';
import { prefetchRouteData, prefetchOnHover, prefetchOnViewport } from '~/utils/route-prefetch';

/**
 * Hook for prefetching route data
 * @param url - The URL to prefetch
 * @param options - Prefetch options
 * @returns Function to trigger prefetch manually
 */
export function useRoutePrefetch(url: string, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  
  useEffect(() => {
    if (!enabled || !url) return;
    
    // Prefetch in background
    prefetchRouteData(url).catch(() => {
      // Ignore errors in useEffect
    });
  }, [url, enabled]);
  
  // Return function to trigger prefetch manually
  return () => prefetchRouteData(url);
}

/**
 * Hook for prefetching on hover
 * @param url - The URL to prefetch
 * @returns Ref to attach to the element that should trigger prefetch on hover
 */
export function usePrefetchOnHover(url: string) {
  const elementRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (!url || !elementRef.current) return;
    
    // Clean up previous hover listeners
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    
    // Set up new hover prefetch
    cleanupRef.current = prefetchOnHover(elementRef.current, url);
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [url]);
  
  return elementRef;
}

/**
 * Hook for prefetching when element enters viewport
 * @param url - The URL to prefetch
 * @returns Ref to attach to the element that should trigger prefetch when visible
 */
export function usePrefetchOnViewport(url: string) {
  const elementRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (!url || !elementRef.current) return;
    
    // Clean up previous viewport listeners
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    
    // Set up new viewport prefetch
    cleanupRef.current = prefetchOnViewport(elementRef.current, url);
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [url]);
  
  return elementRef;
}

/**
 * Hook that combines navigation with prefetching
 * @param url - The URL to navigate to
 * @returns Navigation function that also handles prefetching
 */
export function usePrefetchingNavigate() {
  const navigate = useNavigate();
  
  return (url: string, options?: { replace?: boolean; state?: any }) => {
    // Navigate immediately
    navigate(url, options);
    
    // Prefetch for potential back navigation
    setTimeout(() => {
      prefetchRouteData(window.location.pathname).catch(() => {
        // Ignore errors
      });
    }, 100);
  };
}