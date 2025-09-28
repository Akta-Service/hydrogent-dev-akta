'use client';

import {useState, useEffect, useMemo, useRef, useCallback} from 'react';

interface CSVImageData {
  'Variant SKU': string;
  [key: `Image ${number}`]: string | undefined;
}

interface CSVVideoData {
  'Variant SKU': string;
  'Video URL': string;
}

interface RingVisualizerData {
  'Variant SKU': string;
  'Ring Visualizer URL': string;
}

interface MediaItem {
  url: string;
  altText: string;
  type: 'image' | 'video';
  id: string;
  width?: number;
  height?: number;
}

interface UseCSVMediaOptions {
  variantSku?: string;
  imagesCsvPath: string;
  videosCsvPath: string;
  ringVisualizerCsvPath: string;
}

// Add caching for CSV data
const csvCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

export function useCSVMedia({
  variantSku,
  imagesCsvPath,
  videosCsvPath,
  ringVisualizerCsvPath,
}: UseCSVMediaOptions) {
  const [imageData, setImageData] = useState<CSVImageData[]>([]);
  const [videoData, setVideoData] = useState<CSVVideoData[]>([]);
  const [ringVisualizerData, setRingVisualizerData] = useState<
    RingVisualizerData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const prevVariantSkuRef = useRef<string | undefined>(variantSku);

  // Parse CSV with better error handling
  const parseCSV = useCallback((csvText: string): any[] => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return [];
      
      const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());

      return lines
        .slice(1)
        .map((line) => {
          const values: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = (values[index] || '').trim();
          });

          if (!obj['Variant SKU']) return null;
          return obj;
        })
        .filter(Boolean);
    } catch (err) {
      console.error('Error parsing CSV:', err);
      return [];
    }
  }, []);

  // Optimized CSV loading with caching and lazy loading
  useEffect(() => {
    isMountedRef.current = true;
    
    // Clear cache if variantSku changes
    if (prevVariantSkuRef.current !== variantSku) {
      const cacheKey = `${imagesCsvPath}-${videosCsvPath}-${ringVisualizerCsvPath}`;
      csvCache.delete(cacheKey);
      prevVariantSkuRef.current = variantSku;
    }

    const loadCSVData = async () => {
      if (!imagesCsvPath && !videosCsvPath && !ringVisualizerCsvPath) {
        if (isMountedRef.current) {
          setLoading(false);
        }
        return;
      }

      try {
        const cacheKey = `${imagesCsvPath}-${videosCsvPath}-${ringVisualizerCsvPath}`;
        const cachedData = csvCache.get(cacheKey);
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
          if (isMountedRef.current) {
            setImageData(cachedData.data?.imageData || []);
            setVideoData(cachedData.data?.videoData || []);
            setRingVisualizerData(cachedData.data?.ringVisualizerData || []);
            setLoading(false);
          }
          return;
        }

        if (isMountedRef.current) {
          setLoading(true);
        }

        const fetchIfPath = async (path: string) => {
          if (!path || path.trim() === '') return '';
          
          const pathCacheKey = `csv_${path}`;
          const pathCachedData = csvCache.get(pathCacheKey);
          
          if (pathCachedData && (now - pathCachedData.timestamp) < CACHE_DURATION) {
            return pathCachedData.data;
          }
          
          try {
            const res = await fetch(path);
            const data = await res.text();
            
            csvCache.set(pathCacheKey, {
              data,
              timestamp: now
            });
            
            return data;
          } catch (err) {
            console.error(`Error fetching CSV from ${path}:`, err);
            return '';
          }
        };

        const [imagesText, videosText, ringText] = await Promise.all([
          fetchIfPath(imagesCsvPath),
          fetchIfPath(videosCsvPath),
          fetchIfPath(ringVisualizerCsvPath),
        ]);

        if (!isMountedRef.current) return;

        let newImageData: CSVImageData[] = [];
        let newVideoData: CSVVideoData[] = [];
        let newRingVisualizerData: RingVisualizerData[] = [];

        if (imagesText) {
          newImageData = parseCSV(imagesText) as CSVImageData[];
        }
        if (videosText) {
          newVideoData = parseCSV(videosText) as CSVVideoData[];
        }
        if (ringText) {
          newRingVisualizerData = parseCSV(ringText) as RingVisualizerData[];
        }

        if (isMountedRef.current) {
          setImageData(newImageData);
          setVideoData(newVideoData);
          setRingVisualizerData(newRingVisualizerData);
          setError(null);
          
          csvCache.set(cacheKey, {
            data: {
              imageData: newImageData,
              videoData: newVideoData,
              ringVisualizerData: newRingVisualizerData,
            },
            timestamp: now
          });
        }
      } catch (err) {
          console.error('Error loading CSV data:', err);
        if (isMountedRef.current) {
          setError('Failed to load media data');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadCSVData();

    return () => {
      isMountedRef.current = false;
    };
  }, [imagesCsvPath, videosCsvPath, ringVisualizerCsvPath, variantSku, parseCSV]);

  const imagesForSku = useMemo((): MediaItem[] => {
    if (!variantSku || loading || !imageData.length) return [];
    
    if (!imageData || imageData.length === 0) return [];

    const match = imageData.find(
      (item) =>
        item['Variant SKU'] &&
        item['Variant SKU'].trim() === variantSku.trim(),
    );
    
    if (!match) return [];

    const images: MediaItem[] = [];
    for (let i = 1; i <= 8; i++) {
      const key = `Image ${i}` as keyof CSVImageData;
      const imageUrl = match[key];
      if (imageUrl && imageUrl.trim()) {
        images.push({
          url: imageUrl,
          altText: `Product image ${i}`,
          type: 'image',
          id: `csv-image-${variantSku}-${i}`,
          width: 546,
          height: 546,
        });
      }
    }
    return images;
  }, [variantSku, imageData, loading]);

  const videosForSku = useMemo((): MediaItem[] => {
    if (!variantSku || loading || !videoData.length) return [];
    
    if (!videoData || videoData.length === 0) return [];

    const match = videoData.find(
      (item) =>
        item['Variant SKU'] &&
        item['Variant SKU'].trim() === variantSku.trim(),
    );

    if (!match || !match['Video URL']) return [];

    return [
      {
        url: match['Video URL'],
        altText: 'Product video',
        type: 'video',
        id: `csv-video-${variantSku}`,
      },
    ];
  }, [variantSku, videoData, loading]);

  const ringVisualizerForSku = useMemo((): MediaItem[] => {
    if (!variantSku || loading || !ringVisualizerData.length) return [];
    
    if (!ringVisualizerData || ringVisualizerData.length === 0) return [];

    const match = ringVisualizerData.find(
      (item) =>
        item['Variant SKU'] &&
        item['Variant SKU'].trim() === variantSku.trim(),
    );
    if (!match || !match['Ring Visualizer URL']) return [];

    const url = match['Ring Visualizer URL'];
    const isVideo =
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.includes('youtube') ||
      url.includes('vimeo');

    return [
      {
        url,
        altText: 'Ring Visualizer',
        type: isVideo ? 'video' : 'image',
        id: `csv-ring-${variantSku}`,
      },
    ];
  }, [variantSku, ringVisualizerData, loading]);

  const mediaForSku = useMemo(() => {
    if (imagesForSku.length === 0 && videosForSku.length === 0 && ringVisualizerForSku.length === 0) {
      return [];
    }
    return [...imagesForSku, ...videosForSku, ...ringVisualizerForSku];
  }, [imagesForSku, videosForSku, ringVisualizerForSku]);

  const hasCSVMedia = useMemo(() => {
    return mediaForSku.length > 0;
  }, [mediaForSku]);

  return {
    mediaForSku,
    imagesForSku,
    videosForSku,
    ringVisualizerForSku,
    loading,
    error,
    hasCSVMedia,
  };
}