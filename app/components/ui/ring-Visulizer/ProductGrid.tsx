/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

'use client';

import React, {useState, useEffect} from 'react';
import {ChevronLeft, ChevronRight, Check} from 'lucide-react';
import type {Product} from './types';
import WishlistButton from '../../WishlistButton';
import { sortMetalColors } from '~/helpers/metalColorSorting';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-48 text-primary">
    <svg
      className="animate-spin h-8 w-8 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span className="ml-2">Loading products...</span>
  </div>
);

interface EmptyStateProps {
  onReset: () => void;
  isLoading?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onReset, isLoading }) => {
  return (
    <>
      {!isLoading && (
        <div className="flex flex-col items-center justify-center w-full h-64 text-primary text-center">
          <p className="text-lg mb-4 playfairsb">
            No products found matching your criteria.
          </p>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
};

interface ComparisonTableProps {
  products: Product[];
  onProductClick: (product: Product) => any;
  onRemoveProduct: (product: Product) => void;
  toggleProductForComparison: (product: Product) => void;
  selectedProductsForComparison: Product[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  toggleProductForComparison,
  onRemoveProduct,
  onProductClick,
  selectedProductsForComparison,
}) => (
  <div className="text-primary">
    <h2 className="text-[22px] md:text-[45px] playfairsb">
      Product Comparison
    </h2>
    {products.length === 0 ? (
      <p className="outfit font-normal">
        Select products to compare them here.
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            toggleProductForComparison={toggleProductForComparison}
            selectedProductsForComparison={selectedProductsForComparison}
          />
        ))}
      </div>
    )}
  </div>
);

interface ProductCardProps {
  product: any;
  productsType?: 'diamond' | 'frame';
  onProductClick: (product: any) => any;
  toggleProductForComparison: (product: any) => void;
  selectedProductsForComparison: any[];
  selectedColorFilters?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productsType,
  onProductClick,
  selectedProductsForComparison,
  toggleProductForComparison,
  selectedColorFilters,
}) => {
  const [selectedMetalCarat, setSelectedMetalCarat] = useState<string | null>(
    null,
  );
  const [price, setPrice] = useState<string | null>(
    product.priceRange?.minVariantPrice?.amount || null,
  );

  const isSelected = selectedProductsForComparison.some(
    (p) => p.id === product.id,
  );

  function capitalize(str: any) {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str.toUpperCase();
  }

  let filter_color = selectedColorFilters?.toLowerCase();

  // Add fallback image function similar to ProductCard
  const getFallbackImage = (title: string) => {
    const diamondShapes = ['round', 'asscher', 'emerald', 'pear', 'princess', 'cushion', 'heart', 'marquise', 'oval', 'radiant'];
    
    for (const shape of diamondShapes) {
      if (title.toLowerCase().includes(shape)) {
        return `/Diamonds Placeholder/${shape.charAt(0).toUpperCase() + shape.slice(1)}.jpg`;
      }
    }
    
    return '/placeholder.svg';
  };

  useEffect(() => {
    if (!product.variants) return;

    let matchingVariant = null;

    if (selectedMetalCarat) {
      matchingVariant = product.variants.find((variant: any) =>
        variant.selectedOptions?.some(
          (opt: any) =>
            opt.name === 'Metal Color' && opt.value === selectedMetalCarat,
        ),
      );
    } else if (filter_color) {
      matchingVariant = product.variants.find((variant: any) =>
        variant.selectedOptions?.some(
          (opt: any) =>
            opt.name === 'Metal Color' && opt.value === filter_color,
        ),
      );
    }

    if (matchingVariant?.price?.amount) {
      setPrice(matchingVariant.price.amount);
    } else if (product.priceRange?.minVariantPrice?.amount) {
      setPrice(product.priceRange.minVariantPrice.amount);
    }
  }, [selectedMetalCarat, filter_color, product]);

  if (selectedColorFilters && selectedColorFilters.includes('-')) {
    const parts = selectedColorFilters.split('-');
    filter_color = `${parts[0].toUpperCase()} ${capitalize(parts[1])}`;
  } else if (selectedColorFilters) {
    filter_color = capitalize(selectedColorFilters);
  }

  const allColorOptions =
    product.options?.find((opt: any) => opt.name === 'Metal Color')
      ?.optionValues || [];
  const getSelectedVariantImage = () => {
    if (!product.variants) return null;

    if (selectedMetalCarat) {
      const variantBySelection = product.variants.find((variant: any) =>
        variant.selectedOptions?.some(
          (opt: any) =>
            opt.name === 'Metal Color' && opt.value === selectedMetalCarat,
        ),
      );

      if (variantBySelection?.image?.url) {
        return variantBySelection.image.url;
      }
    }
    if (filter_color && !selectedMetalCarat) {
      const variantByFilter = product.variants.find((variant: any) =>
        variant.selectedOptions?.some(
          (opt: any) =>
            opt.name === 'Metal Color' && opt.value === filter_color,
        ),
      );
      if (variantByFilter?.image?.url) {
        return variantByFilter.image.url;
      }
    }

    return null;
  };

  useEffect(() => {
    if (selectedColorFilters && selectedMetalCarat) {
      setSelectedMetalCarat(null);
    }
  }, [selectedColorFilters]);

  const selectedVariantImage = getSelectedVariantImage();
  
  // Update imageToShow to include fallback images only for Diamond products
  const imageToShow =
    selectedVariantImage || 
    product.featuredImage?.url || 
    (product.productType === 'Diamond' && product.title ? getFallbackImage(product.title) : '/placeholder.svg');

  return (
    <div
      className=" text-primary relative rounded-[8px] overflow-hidden cursor-pointer border border-[#d1d1d1]"
      onClick={(e) => {
        const isCheckboxClick = (e.target as HTMLElement).closest(
          "[data-type='compare-checkbox']",
        );
        if (!isCheckboxClick) {
          onProductClick(product);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onProductClick(product)}
    >
      <div className="mb-0">
        <div className="bg-white md:py-16 py-[20px]">
          <div className="aspect-[9/9] w-full flex">
            <img
              src={imageToShow}
              alt={product.featuredImage?.altText || 'Product Image'}
              className="object-cover h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 p-2 md:p-3 relative z-50">
        <div className="flex items-start justify-between">
          <p className="text-[16px] md:text-[18px] text-primary playfairsb max-w-[185px] leading-tight">
            {productsType === 'frame'
              ? product.title
              : `${Number(product.carat).toFixed(2)} Carat ${product.shape} Diamond`}
          </p>
          <WishlistButton
            product={{
              id: product.id,
              handle: product.handle || product.id,
              title: product.title,
              featuredImage: product.featuredImage
                ? {
                    url: product.featuredImage.url,
                    altText: product.featuredImage.altText || product.title,
                  }
                : undefined,
              priceRange: product.priceRange,
              variants: product.variants
                ? {
                    nodes: product.variants.map((variant: any) => ({
                      id: variant.id,
                      price: variant.price,
                    })),
                  }
                : undefined,
            }}
            variant="icon"
            size="md"
            className="p-1"
          />
        </div>

        <p className="text-primary text-[14px] outfit">
          {productsType === 'diamond' &&
            [
              product.diamondColor,
              product.clarity,
              product.cut?.slice(0, 2)?.toUpperCase(),
              product.report,
            ]
              .filter(Boolean)
              .join(' | ')}
        </p>

        <div className="flex flex-col mt-1">
          <p className="text-[16px] md:text-[18px] mb-1 outfit font-normal">
            ${Number(price || 0).toFixed(2)}
          </p>

          {/* Compare Checkbox */}
          <div data-type="compare-checkbox" className="relative flex justify-end rounded-md">
            <input
              type="checkbox"
              id={`compare-${product.id}`}
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                toggleProductForComparison(product);
              }}
              onClick={(e) => e.stopPropagation()}
              className="sr-only bg-[#09090a]"
            />
            <label
              htmlFor={`compare-${product.id}`}
              className={`flex items-center justify-center w-5 h-5 rounded border-1 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-white border-[#9b9b9b] text-primary'
                  : 'bg-transparent border-[#9b9b9b]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {isSelected && (
                <Check size={13} strokeWidth={2} className="text-primary" />
              )}
            </label>
          </div>
        </div>

        <div className="flex md:space-x-2 space-x-1 mt-1">
          {sortMetalColors(allColorOptions)
            .filter(
              (optionValue: any) =>
                optionValue.name.includes('14K') ||
                optionValue.name.includes('PLATINUM'),
            )
            .map((optionValue: any) => {
              const colorName = optionValue.name;
              const isActive = selectedMetalCarat === colorName;
              const isFilteredColor =
                !selectedMetalCarat && filter_color === colorName;

              return (
                <button
                  key={colorName}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMetalCarat(colorName);
                  }}
                  className={`w-[16px] h-[16px] rounded-full outline outline-offset-3 ${
                    isActive || isFilteredColor
                      ? 'outline-black'
                      : 'outline-transparent'
                  } ${
                    colorName.toLowerCase().includes('white')
                      ? 'bg-white-gold'
                      : colorName.toLowerCase().includes('yellow')
                        ? 'bg-yellow-gold'
                        : colorName.toLowerCase().includes('rose')
                          ? 'bg-rose-gold'
                          : colorName.toLowerCase().includes('platinum')
                            ? 'bg-platinum'
                            : 'bg-gray-400'
                  }`}
                />
              );
            })}
        </div>
      </div>

      <div className="bg-[#f6f6f6] absolute top-1 left-1 rounded-[4px] py-[1px] px-[8px]">
        <p className="text-primary text-[13px] outfit font-light">
          {product.productType === 'Diamond' ? "Lab Diamond" : product.vendor}
        </p>
      </div>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedShape: string | null;
  onResetFilters: () => void;
  onClearFiltersAndRetry?: () => void;
  onProductClick: (product: Product) => any;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  currentPage: number;
  totalPages: number;
  productsType?: 'diamond' | 'frame';
  totalProducts: number;
  selectedProductsForComparison: Product[];
  selectedFrameVariant: any;
  selectedColorFilter: any;
  toggleProductForComparison: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  totalProducts,
  error,
  productsType,
  selectedShape,
  onResetFilters,
  onClearFiltersAndRetry,
  onProductClick,
  hasPreviousPage,
  hasNextPage,
  onNextPage,
  onPreviousPage,
  currentPage,
  totalPages,
  selectedProductsForComparison,
  selectedFrameVariant,
  selectedColorFilter,
  toggleProductForComparison,
}) => {
  const [currentProductGridTab, setCurrentProductGridTab] = useState<
    'products' | 'compare'
  >('products');

  if (products.length < 1 && isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && products.length < 1 && currentProductGridTab === 'products') {
    setTimeout(() => {
      
      return <EmptyState onReset={onResetFilters} isLoading={isLoading} />;
    }, 500);
  }

  const generatePaginationItems = (currentPage: number, totalPages: number) => {
    const items: (number | 'ellipsis')[] = [];
    if (totalPages <= 1) {
      return [];
    }

    items.push(1);

    if (currentPage > 2) {
      items.push('ellipsis');
    }
    if (currentPage > 1 && currentPage < totalPages) {
      items.push(currentPage);
    }
    if (currentPage < totalPages - 1 && currentPage !== totalPages) {
      items.push('ellipsis');
    }

    if (totalPages > 1 && items[items.length - 1] !== totalPages) {
      items.push(totalPages);
    }

    const finalItems: (number | 'ellipsis')[] = [];
    let lastPushed: number | 'ellipsis' | null = null;
    for (const item of items) {
      if (item === 'ellipsis' && lastPushed === 'ellipsis') {
        continue;
      }
      if (
        typeof item === 'number' &&
        typeof lastPushed === 'number' &&
        item === lastPushed
      ) {
        continue;
      }
      finalItems.push(item);
      lastPushed = item;
    }
    return finalItems;
  };

  const paginationItems = generatePaginationItems(currentPage, totalPages);

  return (
    <>
      <div className="mb-4 text-primary max-w-[400px] text-[13px] outfit font-light rounded-lg overflow-hidden">
        <div className="flex p-1">
          <button
            onClick={() => setCurrentProductGridTab('products')}
            className={`px-[24px] py-[11px] rounded-[8px] ${currentProductGridTab === 'products' ? 'bg-[#E7E7E7] text-primary shadow-[0px_0px_8px_0px_#ffffff66]' : 'bg-transparent text-primary'}`}
          >
            {totalProducts} products
          </button>
          <button
            onClick={() => setCurrentProductGridTab('compare')}
            className={`px-[24px] py-[11px] rounded-[8px] ${currentProductGridTab === 'compare' ? 'bg-[#E7E7E7] text-primary shadow-[0px_0px_8px_0px_#ffffff66]' : 'bg-transparent text-primary'}`}
          >
            Compare ({selectedProductsForComparison.length})
          </button>
        </div>
      </div>
      {currentProductGridTab === 'products' ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 nn">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productsType={productsType}
                product={product}
                onProductClick={onProductClick}
                selectedProductsForComparison={selectedProductsForComparison}
                toggleProductForComparison={toggleProductForComparison}
                selectedColorFilters={selectedColorFilter}
              />
            ))}
          </div>
          <div className="flex justify-center outfit items-center gap-2 my-8">
            <button
              onClick={onPreviousPage}
              disabled={!hasPreviousPage}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-black bg-white border border-[#d1d1d1] disabled:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {paginationItems.map((item, index) => (
              <React.Fragment key={item}>
                {item === 'ellipsis' ? (
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center text-primary bg-[#f6f6f6] text-lg">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => {}}
                    disabled={item === currentPage || isLoading}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-[16px] transition-colors ${item === currentPage ? 'bg-[#09090a] text-white' : 'bg-[#f6f6f6] text-primary'}                ${isLoading ? 'cursor-not-allowed' : ''}`}
                    aria-current={item === currentPage ? 'page' : undefined}
                  >
                    {item}
                  </button>
                )}
              </React.Fragment>
            ))}
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-black bg-white disabled:text-primary border border-[#d1d1d1] transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <ComparisonTable
          products={selectedProductsForComparison}
          onProductClick={onProductClick}
          toggleProductForComparison={toggleProductForComparison}
          onRemoveProduct={toggleProductForComparison}
          selectedProductsForComparison={selectedProductsForComparison}
        />
      )}
    </>
  );
};
