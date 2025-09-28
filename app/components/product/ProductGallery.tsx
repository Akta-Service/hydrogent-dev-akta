'use client';

import {useMemo, useRef, useEffect, useState} from 'react';
import SliderGallery from '~/components/ui/slider/SliderGallery';
import {useCSVMedia} from '~/hooks/use-csv-media';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import RingVisualizer from './RingBuilder';

interface ProductGalleryProps {
  product: Product & {
    productType?: string;
    diamond_video_url?: {value: string};
  };
  selectedVariant: ProductVariant;
  thumbsSwiper: any;
  setThumbsSwiper: (swiper: any) => void;
  isRingBuilder?: boolean;
  threeDView?: string;
}

export default function ProductGallery({
  product,
  selectedVariant,
  isRingBuilder,
  thumbsSwiper,
  setThumbsSwiper,
  threeDView,
}: ProductGalleryProps) {
  const firstItemRef = useRef<HTMLImageElement>(null);
  const [itemHeight, setItemHeight] = useState<number>(0);
  const [previewActiveTab, setPreviewActiveTab] = useState<
    'preview' | 'video' | 'images'
  >('images');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const {
    mediaForSku,
    videosForSku,
    ringVisualizerForSku,
    loading: csvLoading,
    hasCSVMedia,
  } = useCSVMedia({
    // variantSku: ' BR0001-A-6x6-W-14k',
    variantSku: selectedVariant?.sku || '',
    imagesCsvPath: '/data/Rings Secondary Images.csv',
    videosCsvPath: '/data/Ring Videos PDP.csv',
    ringVisualizerCsvPath: '/data/Ring Hand Visualiser.csv',
  });
  const updateHeight = () => {
    const height = firstItemRef.current?.offsetHeight || 0;
    setItemHeight(height);
  };

  useEffect(() => {
    if (isRingBuilder && firstItemRef.current) {
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [isRingBuilder, selectedVariant]);

  const galleryImages = useMemo(() => {
    const images: any[] = [];

    if (hasCSVMedia) {
      const csvImages = mediaForSku.filter(
        (item) => item.type === 'image' && item.url?.startsWith('https'),
      );
      images.push(...csvImages);
    } else {
      if (
        selectedVariant?.image &&
        selectedVariant.image.url?.startsWith('https')
      ) {
        images.push(selectedVariant.image);
      }
      if (product.images?.edges) {
        const productImages = product.images.edges
          .map((edge) => edge.node)
          .filter(
            (image) =>
              image.url !== selectedVariant?.image?.url &&
              image.url?.startsWith('https'),
          );
        images.push(...productImages);
      }
    }

    if (threeDView) {
      images.push({
        url: threeDView,
        altText: '3D View',
        width: 546,
        height: 546,
        id: '3d-view',
        type: '3d',
      });
    }

    if (images.length === 0) {
      images.push({
        url: '/fallback-image.jpg',
        altText: 'Placeholder image',
        width: 546,
        height: 546,
        id: 'fallback-image',
        type: 'image',
      });
    }

    return images;
  }, [
    selectedVariant?.image,
    product.images,
    mediaForSku,
    hasCSVMedia,
    threeDView,
  ]);

  const galleryVideos = useMemo(() => {
    return videosForSku.filter(
      (item) =>
        item.type === 'video' &&
        typeof item.url === 'string' &&
        item.url.startsWith('https'),
    );
  }, [videosForSku]);

  const validRingVisualizers = useMemo(() => {
    return ringVisualizerForSku.filter(
      (item) => item?.url && item?.url.startsWith('https'),
    );
  }, [ringVisualizerForSku]);

  const productType = product?.productType;
  const diamondVideoUrl = product?.diamond_video_url?.value;

  // Append autoplay parameter to diamondVideoUrl if supported
  const iframeSrc = useMemo(() => {
    if (diamondVideoUrl?.startsWith('https')) {
      // Add autoplay parameter for Loupe360 or similar providers
      const url = new URL(diamondVideoUrl);
      url.searchParams.set('autoplay', '1'); // Attempt to enable autoplay
      return url.toString();
    }
    return diamondVideoUrl;
  }, [diamondVideoUrl]);

  const previewTabs = useMemo(() => {
    const tabs: {label: string; value: 'images' | 'video' | 'preview'}[] = [
      {label: 'Images', value: 'images'},
    ];

    if (
      galleryVideos.length > 0 ||
      (productType === 'Diamond' && diamondVideoUrl?.startsWith('https'))
    ) {
      tabs.push({label: 'Video', value: 'video'});
    }
    if (validRingVisualizers.length > 0) {
      tabs.push({label: 'Preview', value: 'preview'});
    }

    return tabs;
  }, [galleryVideos, validRingVisualizers, productType, diamondVideoUrl]);

  useEffect(() => {
    if (
      previewActiveTab === 'video' &&
      galleryVideos.length === 0 &&
      !(productType === 'Diamond' && diamondVideoUrl)
    ) {
      setPreviewActiveTab('images');
    }
  }, [previewActiveTab, galleryVideos, productType, diamondVideoUrl]);

  // Reset iframeLoaded when diamondVideoUrl changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [diamondVideoUrl]);

  if (csvLoading) {
    return (
      <div className="flex items-center justify-center h-[350px] sm:h-[500px] md:h-[540px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[48px] rounded-[8px] mb-4 overflow-hidden p-1">
        {previewTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPreviewActiveTab(tab.value)}
            className={`flex-1 rounded-[7px] h-[40px] text-[16px] outfit font-light transition-colors duration-200 ${
              previewActiveTab === tab.value
                ? 'bg-black text-white shadow-[0px_0px_8px_0px_#ffffff66]'
                : 'bg-transparent text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {previewActiveTab === 'preview' && (
          <div className="">
            <RingVisualizer
              csvMedia={null}
              fallbackRingImageUrl={ringVisualizerForSku[0]?.url}
              itemHeight={550}
              hasCSVMedia={false}
            />
          </div>
        )}

        {previewActiveTab === 'video' && (
          <div className="flex justify-center">
            <div className="w-full aspect-video flex items-center justify-center text-primary relative">
              {productType === 'Diamond' &&
              diamondVideoUrl?.startsWith('https') ? (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  )}
                  <div className="relative w-full pt-[84%] max-w-[490px] md:pt-[82%] overflow-hidden">
                    <iframe
                      src={iframeSrc}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      title="Diamond Video"
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      onLoad={() => setIframeLoaded(true)}
                    />
                  </div>
                </>
              ) : (
                <video
                  src={
                    galleryVideos[0]?.url ||
                    'https://cdn.shopify.com/videos/c/o/v/d1dfefb16419452297b70381ad90fecc.mp4'
                  }
                  className="w-full h-[526px] object-cover rounded-lg border cursor-pointer hover:border-white transition-all"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          </div>
        )}

        {previewActiveTab === 'images' && (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 flex justify-center items-center">
              <SliderGallery
                images={galleryImages}
                videos={galleryVideos}
                hasCSVMedia={hasCSVMedia}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
