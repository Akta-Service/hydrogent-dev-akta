/**
 * Performance monitoring utilities for the Bello Diamonds storefront
 */

// Performance metrics storage
interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  pageLoadTime?: number; // Total page load time
  routeChangeTime?: number; // Time for route changes
}

// Performance monitoring class
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer: PerformanceObserver | null = null;
  private isMonitoring = false;
  private routeChangeStart = 0;

  /**
   * Start monitoring performance metrics
   */
  startMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Measure page load time
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    }
    
    // Observe paint entries for FCP and LCP
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              this.metrics.lcp = entry.startTime;
            }
          }
        });
        
        this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('PerformanceObserver not supported:', e);
      }
    }
    
    // Measure CLS
    this.observeCLS();
    
    // Measure FID
    this.observeFID();
    
    // Monitor route changes
    this.observeRouteChanges();
  }

  /**
   * Stop monitoring and clean up
   */
  stopMonitoring() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isMonitoring = false;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Send metrics to analytics service
   */
  sendMetricsToAnalytics() {
    if (typeof window === 'undefined') return;
    
    // In a real implementation, you would send these metrics to your analytics service
    console.log('Performance Metrics:', this.metrics);
    
    // Example implementation with a custom event
    if (typeof CustomEvent !== 'undefined' && typeof window.dispatchEvent !== 'undefined') {
      const event = new CustomEvent('performanceMetrics', { detail: this.metrics });
      window.dispatchEvent(event);
    }
  }

  /**
   * Mark the start of a route change
   */
  startRouteChange() {
    if (typeof performance !== 'undefined') {
      this.routeChangeStart = performance.now();
    }
  }

  /**
   * Mark the end of a route change and record the time
   */
  endRouteChange() {
    if (typeof performance !== 'undefined' && this.routeChangeStart > 0) {
      this.metrics.routeChangeTime = performance.now() - this.routeChangeStart;
      this.routeChangeStart = 0;
    }
  }

  private observeCLS() {
    if (!('PerformanceObserver' in window) || !('LayoutShift' in window)) return;
    
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value || 0;
        }
      }
      this.metrics.cls = clsValue;
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observation failed:', e);
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID() {
    if (!('PerformanceObserver' in window) || !('firstInput' in PerformanceObserver.supportedEntryTypes)) return;
    
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0] as PerformanceEventTiming;
      
      if (firstInput) {
        this.metrics.fid = firstInput.processingStart - firstInput.startTime;
      }
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observation failed:', e);
    }
  }

  /**
   * Observe route changes using the History API
   */
  private observeRouteChanges() {
    if (typeof window === 'undefined' || !window.history) return;
    
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = (...args) => {
      this.startRouteChange();
      const result = originalPushState.apply(window.history, args);
      setTimeout(() => this.endRouteChange(), 0);
      return result;
    };
    
    window.history.replaceState = (...args) => {
      this.startRouteChange();
      const result = originalReplaceState.apply(window.history, args);
      setTimeout(() => this.endRouteChange(), 0);
      return result;
    };
    
    window.addEventListener('popstate', () => {
      this.startRouteChange();
      setTimeout(() => this.endRouteChange(), 0);
    });
  }

  /**
   * Measure component render time
   */
  measureComponentRender(componentName: string, callback: () => void) {
    if (typeof performance === 'undefined') {
      return callback();
    }
    
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  }

  /**
   * Mark a performance milestone
   */
  mark(name: string) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark: string) {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        if (entries.length > 0) {
          console.log(`${name}: ${entries[0].duration}ms`);
        }
      } catch (e) {
        console.warn('Performance measurement failed:', e);
      }
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export types
export type { PerformanceMetrics };