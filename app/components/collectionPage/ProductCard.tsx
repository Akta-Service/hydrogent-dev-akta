/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';

import {useState, memo, useCallback, useRef, useEffect, useMemo} from 'react';
import {Link, useSearchParams} from '@remix-run/react';
import {Image as HydrogenImage, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import ArrowIcon from '~/assets/svg/ArrowIcon';
import WishlistButton from '~/components/WishlistButton';
import {SHAPE_ICONS} from '~/helpers/constants';
import { sortMetalColors } from '~/helpers/metalColorSorting';

interface ProductCardProps {
  product: any;
  loading?: 'eager' | 'lazy';
  csvPaths?: {
    imagesCsvPath: string;
    videosCsvPath: string;
    ringVisualizerCsvPath: string;
  };
  selectedVariant: any;
  onVariantChange: (variant: any) => void;
  imagesForSku: Array<{
    url: string;
    altText: string;
    type: 'image' | 'video';
    id: string;
    width?: number;
    height?: number;
  }>;
  csvLoading: boolean;
}

//  Metal Color Options
const MetalColorOptions = memo(function MetalColorOptions({
  sortedMetalColors,
  selectedMetalColor,
  handleOptionClick,
  handleOptionHover,
  handleOptionLeave,
}: {
  sortedMetalColors: Array<{value: string; isCompatible: boolean}>;
  selectedMetalColor: string | null;
  handleOptionClick: (optionName: string, optionValue: string) => void;
  handleOptionHover: (optionName: string, optionValue: string) => void;
  handleOptionLeave: () => void;
}) {
  return (
    <>
      {sortedMetalColors
        .filter(
          ({value}) =>
            value.toLowerCase().includes('14k') ||
            value.toLowerCase().includes('platinum'),
        )
        .map(({value, isCompatible}) => {
          const lower = value.toLowerCase();

          const gradientClass = lower.includes('yellow')
            ? 'bg-yellow-gold'
            : lower.includes('rose')
              ? 'bg-rose-gold'
              : lower.includes('white')
                ? 'bg-white-gold'
                : lower.includes('platinum')
                  ? 'bg-platinum'
                  : 'bg-gray-400';

          return (
            <button
              key={value}
              className={`w-[16px] h-[16px] rounded-full outline outline-offset-3 transition-all duration-200 ${gradientClass} ${
                selectedMetalColor &&
                selectedMetalColor.toLowerCase() === value.toLowerCase()
                  ? 'outline-black'
                  : 'outline-transparent'
              }`}
              onClick={() =>
                isCompatible && handleOptionClick('Metal Color', value)
              }
              onMouseEnter={() =>
                isCompatible && handleOptionHover('Metal Color', value)
              }
              onMouseLeave={handleOptionLeave}
              disabled={!isCompatible}
              aria-label={`Select ${value} metal${
                !isCompatible ? ' (unavailable)' : ''
              }`}
            />
          );
        })}
    </>
  );
});

//  Diamond Shape Options
const DiamondShapeOptions = memo(function DiamondShapeOptions({
  diamondShapeOptions,
  selectedDiamondShape,
  handleOptionClick,
  handleOptionHover,
  handleOptionLeave,
}: {
  diamondShapeOptions: Array<{value: string; isCompatible: boolean}>;
  selectedDiamondShape: string | null;
  handleOptionClick: (optionName: string, optionValue: string) => void;
  handleOptionHover: (optionName: string, optionValue: string) => void;
  handleOptionLeave: () => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {diamondShapeOptions.map(({value, isCompatible}) => (
        <button
          key={value}
          className={`w-6 h-6 rounded-sm border transition-all duration-200 flex items-center justify-center ${
            selectedDiamondShape === value
              ? 'border-white bg-white/20 shadow-lg'
              : isCompatible
                ? 'border-gray-400 hover:border-white hover:bg-white/5'
                : 'border-gray-600 opacity-40 cursor-not-allowed'
          }`}
          onClick={() =>
            isCompatible &&
            handleOptionClick('Diamond shape', value)
          }
          onMouseEnter={() =>
            isCompatible &&
            handleOptionHover('Diamond shape', value)
          }
          onMouseLeave={handleOptionLeave}
          disabled={!isCompatible}
          aria-label={`Select ${value} diamond shape${
            !isCompatible ? ' (unavailable)' : ''
          }`}
        >
          <div
            className={`w-4 h-4 flex items-center justify-center ${
              !isCompatible ? 'opacity-40' : ''
            }`}
          >
            {SHAPE_ICONS[value.toLowerCase()] ? (
              <img
                src={SHAPE_ICONS[value.toLowerCase()]}
                alt={value}
                title={value}
                className="w-3 h-3"
              />
            ) : (
              <div
                className={`w-3 h-3 ${
                  isCompatible ? 'bg-white/80' : 'bg-white/30'
                }`}
              />
            )}
          </div>
        </button>
      ))}
    </div>
  );
});

// Product Image
const ProductImage = memo(function ProductImage({
  currentImage,
  imageLoading,
  csvLoading,
  handleImageLoad,
  handleImageError,
  product,
}: {
  currentImage: any;
  imageLoading: boolean;
  csvLoading: boolean;
  handleImageLoad: () => void;
  handleImageError: () => void;
  product: any;
}) {
  return (
    <div className="imgCard rounded-lg overflow-hidden border border-[#d1d1d1] relative">
      {imageLoading && !csvLoading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {csvLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="absolute top-0 left-0 flex items-center w-full justify-between p-2"></div>
      <HydrogenImage
        alt={currentImage.altText || product.title}
        aspectRatio="1/1"
        data={currentImage}
        loading="eager"
        sizes="(min-width: 45em) 400px, 350px"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`transition-opacity duration-200 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        decoding="async"
      />

      <div className="absolute top-0 left-0 flex items-center w-full justify-between md:p-2 p-[3px]">
        {product.productType && (
          <p className="text-primary bg-[#f6f6f6] rounded-sm py-0.5 px-2 font-light outfit text-[10px] md:text-sm">
            {product.productType === 'Diamond'
              ? 'Lab Diamond'
              : product?.vendor}
          </p>
        )}
        <WishlistButton product={product} variant="card" size="md" />
      </div>
    </div>
  );
});

//  Product Info
const ProductInfo = memo(function ProductInfo({
  product,
  selectedVariant,
  getSelectedOptionValue,
  productsType,
}: {
  product: any;
  selectedVariant: any;
  getSelectedOptionValue: (optionName: string) => string | null;
  productsType: string;
}) {
  return (
    <>
      <div className="mt-4 cardInfo flex justify-between items-start">
        <div>
          <h5 className="text-[14px] leading-[16px] md:leading-[19px] md:text-[16px] font-medium playfair text-primary">
            {product.title}
          </h5>
          {selectedVariant && (
            <div className="mt-1 text-[12px] md:text-xs text-primary outfit">
              {getSelectedOptionValue('Metal Color') && (
                <span>{getSelectedOptionValue('Metal Color')}</span>
              )}
              {getSelectedOptionValue('Metal Color') &&
                getSelectedOptionValue('Diamond shape') && (
                  <span> • </span>
                )}
              {getSelectedOptionValue('Diamond shape') && (
                <span>{getSelectedOptionValue('Diamond shape')}</span>
              )}
            </div>
          )}
        </div>
        <ArrowIcon rotate={0} size={24} className="text-primary" />
      </div>

      <p className="text-primary text-[14px] outfit">
        {productsType === 'diamond' &&
          [
            product?.diamondColor?.value,
            product?.clarity?.value,
            product?.cut?.value?.slice(0, 2)?.toUpperCase(),
            product?.report?.value,
          ]
            .filter(Boolean)
            .join(' | ')}
      </p>
      <div className="md:mt-2 outfit md:text-[18px] text-[16px] text-primary font-normal">
        <Money
          data={
            selectedVariant?.price || product.priceRange.minVariantPrice
          }
        />
      </div>
    </>
  );
});

const ProductCard = memo(function ProductCard({
  product,
  loading,
  csvPaths,
  selectedVariant,
  onVariantChange,
  imagesForSku,
  csvLoading,
}: ProductCardProps) {
  const [searchParams] = useSearchParams();

  const [selectedMetalColor, setSelectedMetalColor] = useState<string | null>(
    null,
  );
  const [selectedDiamondShape, setSelectedDiamondShape] = useState<
    string | null
  >(
    selectedVariant?.selectedOptions?.find(
      (opt: any) => opt.name.toLowerCase() === 'diamond shape',
    )?.value || null,
  );
  const [sortedMetalColors, setSortedMetalColors] = useState<any[]>([]);
  const hasSetDefaultRef = useRef(false);
  const [preloadedImages, setPreloadedImages] = useState<
    Map<string, HTMLImageElement>
  >(new Map());
  const [hoveredVariant, setHoveredVariant] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loadedImageUrl, setLoadedImageUrl] = useState<string | null>(null);
  const [imageLoadTimeout, setImageLoadTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();
  const imageLoadStartTime = useRef<number>(0);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  const productsType = product?.productType?.toLowerCase();

  const variantUrl = useVariantUrl(
    product.handle,
    selectedVariant?.selectedOptions,
  );

  useEffect(() => {
    if (hasUserSelected) return;

    const metalFromUrl = searchParams.get('filter.v.option.Metal Color');
    if (metalFromUrl && metalFromUrl.trim() !== '') {
      setSelectedMetalColor(metalFromUrl);

      let matchingVariant = getVariantForCombination(
        metalFromUrl,
        selectedDiamondShape,
      );

      if (!matchingVariant) {
        matchingVariant = product.variants?.nodes.find((variant: any) =>
          variant.selectedOptions?.some(
            (opt: any) =>
              opt.name.toLowerCase() === 'metal color' &&
              opt.value.toLowerCase() === metalFromUrl.toLowerCase(),
          ),
        );
      }

      if (matchingVariant && matchingVariant.id !== selectedVariant?.id) {
        const newImageUrl =
          matchingVariant.image?.url ||
          (matchingVariant.sku && imagesForSku?.length > 0
            ? imagesForSku[0]?.url
            : null);

        if (newImageUrl && newImageUrl !== loadedImageUrl) {
          handleImageLoadStart(newImageUrl);
        }

        onVariantChange(matchingVariant);
      }
    }
    else{
      setSelectedMetalColor(null);
      hasSetDefaultRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchParams,
    selectedDiamondShape,
    selectedVariant?.id,
    loadedImageUrl,
    hasUserSelected,
  ]);

  useEffect(() => {
    setHasUserSelected(false);
  }, [searchParams]);

  useEffect(() => {
    const metalFromUrl = searchParams.get('filter.v.option.Metal Color');
    if (!selectedMetalColor && !hasSetDefaultRef.current && product.variants?.nodes) {
      const uniqueValues = new Set<string>();
      const optionVariants: Array<{
        value: string;
        variant: any;
        isCompatible: boolean;
      }> = [];

      product.variants.nodes.forEach((variant: any) => {
        const option = variant.selectedOptions?.find(
          (opt: any) => opt.name.toLowerCase() === 'metal color',
        );
        if (option && !uniqueValues.has(option.value.toLowerCase())) {
          uniqueValues.add(option.value.toLowerCase());
          optionVariants.push({value: option.value, variant, isCompatible: true});
        }
      });

      const sortedOptions = sortMetalColors(optionVariants);
      setSortedMetalColors(sortedOptions);
      
      const filteredSortedMetalColors = sortedOptions.filter(
        ({value}) =>
          value.toLowerCase().includes('14k') ||
          value.toLowerCase().includes('platinum'),
      );
      
      const firstAvailableOption = filteredSortedMetalColors[0];
      
      if (firstAvailableOption) {
        hasSetDefaultRef.current = true;
        const { value, variant } = firstAvailableOption;
        setSelectedMetalColor(value);
        
        if (variant && variant.id !== selectedVariant?.id) {
          onVariantChange(variant);
        }
      }
    }
  }, [selectedMetalColor, selectedVariant?.id, onVariantChange, product.variants?.nodes, searchParams]);

  const getVariantForCombination = (
    metalColor: string | null,
    diamondShape: string | null,
  ) => {
    if (!product.variants?.nodes) return null;

    return product.variants.nodes.find((variant: any) => {
      const metalOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === 'metal color',
      );
      const shapeOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === 'diamond shape',
      );

      const metalMatches =
        !metalColor ||
        (metalOption?.value &&
          metalOption.value.toLowerCase() === metalColor.toLowerCase());
      const shapeMatches =
        !diamondShape ||
        (shapeOption?.value &&
          shapeOption.value.toLowerCase() === diamondShape.toLowerCase());

      return metalMatches && shapeMatches;
    });
  };

  const getUniqueOptions = (optionName: string) => {
    if (!product.variants?.nodes) return [];

    const uniqueValues = new Set<string>();
    const optionVariants: Array<{
      value: string;
      variant: any;
      isCompatible: boolean;
    }> = [];

    product.variants.nodes.forEach((variant: any) => {
      const option = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === optionName.toLowerCase(),
      );
      if (option && !uniqueValues.has(option.value.toLowerCase())) {
        uniqueValues.add(option.value.toLowerCase());

        let isCompatible = true;
        if (
          optionName.toLowerCase() === 'diamond shape' &&
          selectedMetalColor
        ) {
          isCompatible = !!getVariantForCombination(
            selectedMetalColor,
            option.value,
          );
        } else if (
          optionName.toLowerCase() === 'metal color' &&
          selectedDiamondShape
        ) {
          isCompatible = !!getVariantForCombination(
            option.value,
            selectedDiamondShape,
          );
        }

        optionVariants.push({value: option.value, variant, isCompatible});
      }
    });

    return optionVariants;
  };

  const preloadVariantImage = useCallback(
    (variant: any) => {
      if (!variant) return;

      const imageUrl = variant.image?.url || product.featuredImage?.url;
      if (!imageUrl || preloadedImages.has(variant.id)) return;

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        setPreloadedImages((prev) => new Map(prev).set(variant.id, img));
      };
      img.onerror = () => {};
    },
    [product.featuredImage?.url, preloadedImages],
  );

  const handleOptionHover = useCallback(
    (optionName: string, optionValue: string) => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }

      preloadTimeoutRef.current = setTimeout(() => {
        let targetMetalColor = selectedMetalColor;
        let targetDiamondShape = selectedDiamondShape;

        if (optionName.toLowerCase() === 'metal color') {
          targetMetalColor = optionValue;
        } else if (optionName.toLowerCase() === 'diamond shape') {
          targetDiamondShape = optionValue;
        }

        const matchingVariant = getVariantForCombination(
          targetMetalColor,
          targetDiamondShape,
        );
        if (matchingVariant) {
          setHoveredVariant(matchingVariant);
          preloadVariantImage(matchingVariant);
        }
      }, 150);
    },
    [selectedMetalColor, selectedDiamondShape, preloadVariantImage],
  );

  const handleOptionLeave = useCallback(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }
    setHoveredVariant(null);
  }, []);

  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  const handleOptionClick = (optionName: string, optionValue: string) => {
    setHasUserSelected(true);

    let newMetalColor = selectedMetalColor;
    let newDiamondShape = selectedDiamondShape;

    if (optionName.toLowerCase() === 'metal color') {
      newMetalColor = optionValue;
      setSelectedMetalColor(optionValue);
    } else if (optionName.toLowerCase() === 'diamond shape') {
      newDiamondShape = optionValue;
      setSelectedDiamondShape(optionValue);
    }

    const matchingVariant = getVariantForCombination(
      newMetalColor,
      newDiamondShape,
    );

    if (matchingVariant) {
      const currentImageUrl = getCurrentImage()?.url;
      const newImageUrl =
        matchingVariant.image?.url ||
        (matchingVariant.sku && imagesForSku.length > 0
          ? imagesForSku[0]?.url
          : null);

      if (
        newImageUrl &&
        newImageUrl !== currentImageUrl &&
        newImageUrl !== loadedImageUrl
      ) {
        setImageLoading(true);
      }

      onVariantChange(matchingVariant);
    }

    setHoveredVariant(null);
  };

  const getCurrentImage = () => {
    const targetVariant = selectedVariant;

    if (targetVariant?.sku && imagesForSku.length > 0) {
      const image = imagesForSku[0];
      return {
        id: image.id,
        altText: image.altText,
        url: image.url,
        width: image.width || 546,
        height: image.height || 546,
      };
    }

    const variantImage = targetVariant?.image;
    const featuredImage = product.featuredImage;
    if (variantImage?.url && variantImage.url.trim() !== '') {
      return variantImage;
    }

    if (featuredImage?.url && featuredImage.url.trim() !== '') {
      return featuredImage;
    }

    if (product.productType === 'Diamond' && product.title) {
      const title = product.title.toLowerCase();
      const diamondShapes = [
        'round',
        'asscher',
        'emerald',
        'pear',
        'princess',
        'cushion',
        'heart',
        'marquise',
        'oval',
        'radiant',
      ];

      for (const shape of diamondShapes) {
        if (title.includes(shape)) {
          return {
            id: `/Diamonds Placeholder/${shape.charAt(0).toUpperCase() + shape.slice(1)}.jpg`,
            altText: product.title,
            url: `/Diamonds Placeholder/${shape.charAt(0).toUpperCase() + shape.slice(1)}.jpg`,
            width: 546,
            height: 546,
          };
        }
      }
    }
    return {
      id: '/Fallback-Image.png',
      altText: null,
      url: '/Fallback-Image.png',
      width: 773,
      height: 609,
    };
  };

  const handleImageLoad = useCallback(() => {
    const loadTime = Date.now() - imageLoadStartTime.current;
    if (imageLoadTimeout) {
      clearTimeout(imageLoadTimeout);
      setImageLoadTimeout(null);
    }

    const delay = Math.min(Math.max(loadTime > 500 ? 100 : 0, 0), 300);
    setTimeout(() => {
      setImageLoading(false);
    }, delay);
  }, [imageLoadTimeout]);

  const handleImageError = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
    }
    if (imageLoadTimeout) {
      clearTimeout(imageLoadTimeout);
      setImageLoadTimeout(null);
    }
    setImageLoading(false);
  }, [imageLoadTimeout]);

  const handleImageLoadStart = useCallback(
    (imageUrl: string) => {
      if (loadedImageUrl !== imageUrl) {
        if (imageLoadTimeout) {
          clearTimeout(imageLoadTimeout);
        }

        imageLoadStartTime.current = Date.now();
        setImageLoading(true);
        setLoadedImageUrl(imageUrl);

        const timeout = setTimeout(() => {
          if (process.env.NODE_ENV === 'development') {
          }
          setImageLoading(false);
          setImageLoadTimeout(null);
        }, 5000);

        setImageLoadTimeout(timeout);
      }
    },
    [loadedImageUrl, imageLoadTimeout],
  );

  useEffect(() => {
    const currentImage = getCurrentImage();
    const newImageUrl = currentImage?.url;
    if (newImageUrl && newImageUrl !== loadedImageUrl) {
      handleImageLoadStart(newImageUrl);
    }
  }, [
    selectedVariant?.sku,
    imagesForSku.length,
    handleImageLoadStart,
    loadedImageUrl,
  ]);

  useEffect(() => {
    const currentImage = getCurrentImage();
    if (currentImage?.url && !loadedImageUrl) {
      setLoadedImageUrl(currentImage.url);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imageLoadTimeout) {
        clearTimeout(imageLoadTimeout);
      }
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [imageLoadTimeout]);

  const getSelectedOptionValue = (optionName: string) => {
    if (!selectedVariant) return null;
    return selectedVariant.selectedOptions?.find(
      (opt: any) => opt.name.toLowerCase() === optionName.toLowerCase(),
    )?.value;
  };

  const currentImage = useMemo(
    () => getCurrentImage(),
    [selectedVariant?.sku, imagesForSku],
  );
  const metalColorOptions = useMemo(
    () => getUniqueOptions('Metal Color'),
    [product.variants?.nodes, selectedDiamondShape],
  );
  
  useEffect(() => {
    if (metalColorOptions.length > 0) {
      const sorted = sortMetalColors(metalColorOptions);
      setSortedMetalColors(sorted);
      
      if (!selectedMetalColor && !hasSetDefaultRef.current) {
        const filteredSortedMetalColors = sorted.filter(
          ({value}) =>
            value.toLowerCase().includes('14k') ||
            value.toLowerCase().includes('platinum'),
        );
        
        const firstAvailableOption = filteredSortedMetalColors[0];
        
        if (firstAvailableOption) {
          hasSetDefaultRef.current = true;
          const { value, variant } = firstAvailableOption;
          setSelectedMetalColor(value);
          
          if (variant && variant.id !== selectedVariant?.id) {
            onVariantChange(variant);
          }
        }
      }
    }
  }, [metalColorOptions, selectedMetalColor, selectedVariant?.id, onVariantChange]);
  const diamondShapeOptions = useMemo(
    () => getUniqueOptions('Diamond shape'),
    [product.variants?.nodes, selectedMetalColor],
  );

  const productCardKey = `${product.id}-${selectedVariant?.id || 'no-variant'}`;

  return (
    <>
      {currentImage && (
        <Link
          className="product-item block"
          key={productCardKey}
          prefetch="intent"
          to={variantUrl}
          aria-label={`View ${product.title}`}
        >
          <div className="w-full">
            <ProductImage
              currentImage={currentImage}
              imageLoading={imageLoading}
              csvLoading={csvLoading}
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
              product={product}
            />

            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              getSelectedOptionValue={getSelectedOptionValue}
              productsType={productsType}
            />

            <div
              className="mt-3 space-x-2 kk"
              onClick={(e) => e.preventDefault()}
            >
              <MetalColorOptions
                sortedMetalColors={sortedMetalColors}
                selectedMetalColor={selectedMetalColor}
                handleOptionClick={handleOptionClick}
                handleOptionHover={handleOptionHover}
                handleOptionLeave={handleOptionLeave}
              />

              {diamondShapeOptions.length > 0 && (
                <DiamondShapeOptions
                  diamondShapeOptions={diamondShapeOptions}
                  selectedDiamondShape={selectedDiamondShape}
                  handleOptionClick={handleOptionClick}
                  handleOptionHover={handleOptionHover}
                  handleOptionLeave={handleOptionLeave}
                />
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  );
});

export default ProductCard;