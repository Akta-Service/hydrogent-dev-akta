'use client';

import {useState, useEffect, useMemo, useCallback} from 'react';

interface CSVImageData {
  'Variant SKU': string;
  [key: `Image ${number}`]: string | undefined;
}

interface MediaItem {
  url: string;
  altText: string;
  type: 'image' | 'video';
  id: string;
  width?: number;
  height?: number;
}

interface UseCSVCollectionOptions {
  imagesCsvPath: string;
  videosCsvPath: string;
  ringVisualizerCsvPath: string;
}

export function useCSVCollection({
  imagesCsvPath,
  videosCsvPath,
  ringVisualizerCsvPath,
}: UseCSVCollectionOptions) {
  const [imageData, setImageData] = useState<CSVImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback((csvText: string): any[] => {
    const lines = csvText.trim().split('\n');
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

        // skip if Variant SKU is missing
        if (!obj['Variant SKU']) return null;
        return obj;
      })
      .filter(Boolean);
  }, []);

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        setLoading(true);

        const fetchIfPath = async (path: string) => {
          if (!path || path.trim() === '') return '';
          const res = await fetch(path);
          return await res.text();
        };

        const imagesText = await fetchIfPath(imagesCsvPath);

        if (imagesText) {
          setImageData(parseCSV(imagesText) as CSVImageData[]);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading CSV data:', err);
        setError('Failed to load media data');
      } finally {
        setLoading(false);
      }
    };

    loadCSVData();
  }, [imagesCsvPath, parseCSV]);

  const getImagesForSku = useCallback((variantSku: string): MediaItem[] => {
    if (!variantSku || loading || !imageData.length) return [];
    
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
  }, [imageData, loading]);


  const hasMediaForSku = useCallback((variantSku: string): boolean => {
    return getImagesForSku(variantSku).length > 0;
  }, [getImagesForSku]);

  return {
    getImagesForSku,
    hasMediaForSku,
    loading,
    error,
    dataSize: imageData.length,
  };
}