/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
  useNavigate,
  useLocation,
} from '@remix-run/react';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  startTransition,
} from 'react';
import {getPaginationVariables} from '@shopify/hydrogen';

import type {ProductItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import useIsMobile from '~/components/Hooks/useIsMobile';
import {useCSVCollection} from '~/hooks/use-csv-collection';
import DiamondFilters from '~/components/filters/CollectionDiamond';
import FrameFilters from '~/components/filters/CollectionFrame';
import PendantFilters from '~/components/filters/PendantFilters';
import ProductCard from '~/components/collectionPage/ProductCard';
import CollectionHeader from '~/components/collectionPage/CollectionHeader';
import CollectionControls from '~/components/collectionPage/CollectionControls';
import MobileFilterOverlay from '~/components/collectionPage/MobileFilterOverlay';
import {ChevronUp, ChevronDown} from 'lucide-react';
import {SORT_OPTIONS, RING_STYLE_COLLECTIONS, DIAMOND_COLOR_COLLECTIONS, DIAMOND_SHAPE_COLLECTIONS, PENDANT_SHAPE_COLLECTIONS} from '~/helpers/constants';

interface CollectionData {
  collection: {
    id: string;
    handle: string;
    title: string;
    description: string;
    products: {
      nodes: ProductItemFragment[];
      pageInfo: {
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        endCursor: string | null;
        startCursor: string | null;
      };
      filters: Array<{
        id: string;
        label: string;
        type: string;
        values: Array<{
          id: string;
          label: string;
          count: number;
          input: string;
        }>;
      }>;
    };
    metafields: Array<{
      key: string;
      namespace: string;
      value: string;
    } | null>;
  };
  sortValue: string;
}

interface FilterData {
  type: 'numeric' | 'categorical' | 'color' | 'style' | 'shape';
  label?: string;
  minValue?: number;
  maxValue?: number;
  allSelectedValues?: string[];
  range?: [number, number];
  config?: {
    min: number;
    max: number;
    step: number;
    suffix: string;
    decimals: number;
  };
}

type FiltersData = Record<string, FilterData>;

// Utility function for debouncing
function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): T & {cancel: () => void} {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & {cancel: () => void};

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
}

// Meta function for SEO
export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `${(data as CollectionData)?.collection.title ?? ''} Collection`,
    },
  ];
};

// Loader function for fetching collection data
export async function loader({
  params,
  request,
  context,
}: LoaderFunctionArgs): Promise<CollectionData> {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (!handle) throw redirect('/collections');

  const url = new URL(request.url);
  const sortValue = url.searchParams.get('sort') || '';

  const filters: Array<{
    productTag?: string;
    productType?: string;
    productVendor?: string;
    variantOption?: {name: string; value: string};
    price?: {min?: number; max?: number};
    productMetafield?: {namespace: string; key: string; value: string};
    variantMetafield?: {namespace: string; key: string; value: string};
  }> = [];

  for (const [key, value] of url.searchParams.entries()) {
    if (!key.startsWith('filter.')) continue;
    const filterKey = key.replace('filter.', '');

    if (filterKey === 'p.tag') {
      filters.push({productTag: value});
    } else if (filterKey === 'p.product_type') {
      filters.push({productType: value});
    } else if (filterKey === 'p.vendor') {
      filters.push({productVendor: value});
    } else if (filterKey.startsWith('v.option.')) {
      const optionName = filterKey.replace('v.option.', '');
      const values = value.includes(',')
        ? value.split(',').map((v) => v.trim())
        : [value.trim()];
      values.forEach((val) =>
        filters.push({variantOption: {name: optionName, value: val}}),
      );
    } else if (filterKey.startsWith('v.price.')) {
      const priceType = filterKey.replace('v.price.', '');
      if (priceType === 'gte') filters.push({price: {min: parseFloat(value)}});
      if (priceType === 'lte') filters.push({price: {max: parseFloat(value)}});
    } else if (filterKey.startsWith('p.m.')) {
      const metafieldPath = filterKey.replace('p.m.', '');
      if (metafieldPath.includes('.gte') || metafieldPath.includes('.lte')) {
        continue;
      } else {
        const parts = metafieldPath.split('.');
        const key = parts.pop()!;
        const namespace = parts.join('.');
        const values = value.includes(',')
          ? value.split(',').map((v) => v.trim())
          : [value.trim()];
        values.forEach((val) =>
          filters.push({productMetafield: {namespace, key, value: val}}),
        );
      }
    } else if (filterKey.startsWith('v.m.')) {
      const metafieldPath = filterKey.replace('v.m.', '');
      if (metafieldPath.includes('.gte') || metafieldPath.includes('.lte')) {
        const parts = metafieldPath.split('.');
        const rangeOperator = parts.pop()!;
        const key = parts.pop()!;
        const namespace = parts.join('.');
        filters.push({
          variantMetafield: {
            namespace,
            key,
            value: rangeOperator === 'gte' ? `>=${value}` : `<=${value}`,
          },
        });
      } else {
        const parts = metafieldPath.split('.');
        const key = parts.pop()!;
        const namespace = parts.join('.');
        const values = value.includes(',')
          ? value.split(',').map((v) => v.trim())
          : [value.trim()];
        values.forEach((val) =>
          filters.push({variantMetafield: {namespace, key, value: val}}),
        );
      }
    }
  }

  const priceLow = url.searchParams.get('filter.variant_price.low');
  const priceHigh = url.searchParams.get('filter.variant_price.high');
  if (priceLow || priceHigh) {
    filters.push({
      price: {
        min: priceLow ? parseFloat(priceLow) : undefined,
        max: priceHigh ? parseFloat(priceHigh) : undefined,
      },
    });
  }

  let sortKey: 'RELEVANCE' | 'PRICE' | 'CREATED' = 'RELEVANCE';
  let reverse = false;
  switch (sortValue) {
    case 'price-asc':
      sortKey = 'PRICE';
      reverse = false;
      break;
    case 'price-desc':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'price-ascending':
      sortKey = 'CREATED';
      reverse = false;
      break;
    case 'style-desc':
      sortKey = 'CREATED';
      reverse = true;
      break;
    default:
      sortKey = 'RELEVANCE';
      reverse = false;
      break;
  }
  console.log("filters added to collection",JSON.stringify(filters))
  const {collection} = await storefront.query<{
    collection: CollectionData['collection'] | null;
  }>(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables, sortKey, reverse, filters},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  for (const [key] of url.searchParams.entries()) {
    if (!key.startsWith('filter.p.m.custom.')) continue;
    if (!(key.endsWith('.gte') || key.endsWith('.lte'))) continue;

    const field = key.split('.')[4];
    const namespace = 'custom';
    const min = parseFloat(
      url.searchParams.get(`filter.p.m.custom.${field}.gte`) || '0',
    );
    const max = parseFloat(
      url.searchParams.get(`filter.p.m.custom.${field}.lte`) || '999999',
    );

    const filterObj = collection.products.filters.find(
      (f) => f.id === `filter.p.m.custom.${field}`,
    );

    if (filterObj) {
      filterObj.values.forEach((val) => {
        const num = parseFloat(val.label);
        if (!isNaN(num) && num >= min && num <= max) {
          filters.push({
            productMetafield: {namespace, key: field, value: val.label},
          });
        }
      });
    } else if (field === 'carat') {
      const start = Math.max(min, 0.9);
      for (let i = Math.round(start * 100); i <= Math.round(max * 100); i++) {
        const num = (i / 100).toFixed(2);
        filters.push({
          productMetafield: {namespace, key: field, value: num},
        });
      }
    }
  }

  return {collection, sortValue};
}

// Custom hook for managing collection state
function useCollectionState(collection: CollectionData['collection']) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedPendantStyle, setSelectedPendantStyle] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    style: false,
    metal: false,
    price: false,
  });
  const [allFiltersData, setAllFiltersData] = useState<FiltersData>({});

  // Initialize variants
  useEffect(() => {
    const initialVariants: Record<string, any> = {};
    collection.products.nodes.forEach((product) => {
      const productWithVariants = product as ProductItemFragment & {
        variants?: {
          nodes?: Array<{
            id: string;
            title: string;
            availableForSale: boolean;
            sku?: string;
            price: {amount: string; currencyCode: string};
            compareAtPrice?: {amount: string; currencyCode: string} | null;
            selectedOptions: Array<{name: string; value: string}>;
            image?: {
              id: string;
              altText?: string;
              url: string;
              width: number;
              height: number;
            } | null;
          }>;
        };
      };
      if (productWithVariants.variants?.nodes?.[0]) {
        initialVariants[product.id] = productWithVariants.variants.nodes[0];
      }
    });
    setSelectedVariants(initialVariants);
  }, [collection.products.nodes]);

  // Reset filters when collection changes
  const prevCollectionHandle = useRef<string | null>(null);
  useEffect(() => {
    if (
      prevCollectionHandle.current &&
      prevCollectionHandle.current !== collection.handle
    ) {
      setSelectedColor(null);
      setSelectedStyle(null);
      setSelectedPendantStyle(null);
      setSelectedShape(null);
      setAllFiltersData({});
    }
    prevCollectionHandle.current = collection.handle;
  }, [collection.handle]);

  return {
    selectedVariants,
    setSelectedVariants,
    selectedColor,
    setSelectedColor,
    selectedStyle,
    setSelectedStyle,
    selectedPendantStyle,
    setSelectedPendantStyle,
    selectedShape,
    setSelectedShape,
    openSections,
    setOpenSections,
    allFiltersData,
    setAllFiltersData,
  };
}

// Custom hook for URL management
function useUrlManager({
  allFiltersData,
  selectedColor,
  selectedStyle,
  selectedPendantStyle,
  selectedShape,
  selectedSort,
  location,
  navigate,
}: {
  allFiltersData: FiltersData;
  selectedColor: string | null;
  selectedStyle: string | null;
  selectedPendantStyle: string | null;
  selectedShape: string | null;
  selectedSort: string;
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const isNavigatingRef = useRef(false);
  const isPaginatingRef = useRef(false);
  const lastUrlUpdateRef = useRef<string>('');

  const updateUrlWithFilters = useCallback(() => {
    if (isNavigatingRef.current || isPaginatingRef.current) return;

    try {
      isNavigatingRef.current = true;
      const currentUrl = new URL(window.location.href);
      const newSearchParams = new URLSearchParams();

      // Preserve pagination parameters if they exist and we're not changing filters
      const cursor = currentUrl.searchParams.get('cursor');
      const direction = currentUrl.searchParams.get('direction');

      // Handle numeric and categorical filters from allFiltersData
      Object.entries(allFiltersData).forEach(([key, filter]) => {
        if (!filter || typeof filter !== 'object') return;

        if (filter.type === 'numeric') {
          if (key === 'Price') {
            if (filter.minValue != null && filter.minValue > 100) {
              newSearchParams.set(
                'filter.v.price.gte',
                String(filter.minValue),
              );
            }
            if (filter.maxValue != null && filter.maxValue < 100000) {
              newSearchParams.set(
                'filter.v.price.lte',
                String(filter.maxValue),
              );
            }
          } else {
            const cleanKey = key.replace(/^filter\.p\.m\.custom\./, '');
            const metafieldKey = cleanKey.toLowerCase().replace(/\s+/g, '_');
            if (filter.minValue != null) {
              newSearchParams.set(
                `filter.p.m.custom.${metafieldKey}.gte`,
                Number(filter.minValue).toFixed(2),
              );
            }
            if (filter.maxValue != null) {
              newSearchParams.set(
                `filter.p.m.custom.${metafieldKey}.lte`,
                Number(filter.maxValue).toFixed(2),
              );
            }
          }
        } else if (filter.type === 'categorical') {
          if (filter.allSelectedValues && filter.allSelectedValues.length > 0) {
            const cleanKey = key.replace(/^filter\.p\.m\.custom\./, '');
            const metafieldKey = cleanKey.toLowerCase().replace(/\s+/g, '_');
            newSearchParams.set(
              `filter.p.m.custom.${metafieldKey}`,
              filter.allSelectedValues.join(','),
            );
          }
        }
      });

      // Handle selectedColor
      if (selectedColor && selectedColor.trim() !== '') {
        newSearchParams.set('filter.v.option.Metal Color', selectedColor);
      }

      // Handle selectedStyle
      if (selectedStyle && selectedStyle.trim() !== '') {
        newSearchParams.set('filter.p.m.custom.style', selectedStyle);
      }

      // Handle other selections
      if (selectedPendantStyle && selectedPendantStyle.trim() !== '') {
        newSearchParams.set(
          'filter.v.option.Diamond shape',
          selectedPendantStyle,
        );
      }
      if (selectedShape && selectedShape.trim() !== '') {
        newSearchParams.set('filter.p.m.custom.shape', selectedShape);
      }
      if (selectedSort && selectedSort.trim() !== '') {
        newSearchParams.set('sort', selectedSort);
      }

      const hasActiveFilters = selectedColor || selectedStyle || selectedPendantStyle || 
                              selectedShape || Object.keys(allFiltersData).length > 0;

      if (!hasActiveFilters && cursor && direction) {
        newSearchParams.set('cursor', cursor);
        newSearchParams.set('direction', direction);
      }

      const newSearch = newSearchParams.toString();
      const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
      
      if (newUrl !== window.location.pathname + window.location.search && 
          newUrl !== lastUrlUpdateRef.current) {
        lastUrlUpdateRef.current = newUrl;
        navigate(newUrl, {replace: true, preventScrollReset: true});
      }
    } catch (error) {
      console.error('Error updating URL with filters:', error);
    } finally {
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 50);
    }
  }, [
    allFiltersData,
    selectedColor,
    selectedStyle,
    selectedPendantStyle,
    selectedShape,
    selectedSort,
    navigate,
    location.pathname,
  ]);

  return {
    updateUrlWithFilters,
    isNavigatingRef,
    isPaginatingRef,
  };
}


function useFilterOperations({
  setOpenSections,
  setSelectedStyle,
  setSelectedColor,
  setAllFiltersData,
  setSelectedPendantStyle,
  setSelectedShape,
  navigate,
  updateUrlWithFilters,
}: {
  setOpenSections: React.Dispatch<React.SetStateAction<{
    style: boolean;
    metal: boolean;
    price: boolean;
  }>>;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
  setAllFiltersData: React.Dispatch<React.SetStateAction<FiltersData>>;
  setSelectedPendantStyle: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: ReturnType<typeof useNavigate>;
  updateUrlWithFilters: () => void;
}) {
  // Create a debounced version of updateUrlWithFilters
  const debouncedUpdateUrl = useMemo(
    () => createDebounce(updateUrlWithFilters, 300),
    [updateUrlWithFilters]
  );

  const toggleSection = useCallback((section: 'style' | 'metal' | 'price') => {
    setOpenSections((prev) => ({...prev, [section]: !prev[section]}));
  }, [setOpenSections]);

  const getSelectedLabel = useCallback(
    (section: 'style' | 'metal' | 'price', selectedStyle: string | null, selectedColor: string | null, allFiltersData: FiltersData) => {
      switch (section) {
        case 'style':
          return selectedStyle
            ? RING_STYLE_COLLECTIONS.find((c) => c.handle === selectedStyle)
                ?.title || 'Select Style'
            : 'Select Style';
        case 'metal':
          return selectedColor || 'Select Metal';
        case 'price':
          if (allFiltersData.Price?.type === 'numeric') {
            const {minValue, maxValue} = allFiltersData.Price;
            const formatValue = (value: number) => {
              if (value >= 1000) {
                const k = value / 1000;
                const decimals = Number.isInteger(k) ? 0 : 1;
                return `$${k.toFixed(decimals)}k`;
              }
              return `$${value}`;
            };
            return `${formatValue(minValue ?? 0)} - ${formatValue(maxValue ?? 0)}`;
          }
          return 'Select Price';
        default:
          return 'Select';
      }
    },
    [],
  );

  const handleStyleSelect = useCallback(
    (style: string | null) => {
      setSelectedStyle((prev) => (prev === style ? null : style));
      setOpenSections((prev) => ({...prev, style: false}));
      // Use debounced URL update
      debouncedUpdateUrl();
    },
    [setSelectedStyle, setOpenSections, debouncedUpdateUrl],
  );

  const handlePendantStyleSelect = useCallback((style: string) => {
    setSelectedPendantStyle((prev) => (prev === style ? null : style));
    setOpenSections((prev) => ({...prev, style: false}));
    // Use debounced URL update
    debouncedUpdateUrl();
  }, [setSelectedPendantStyle, setOpenSections, debouncedUpdateUrl]);

  const handleColorSelect = useCallback(
    (color: string | null) => {
      setSelectedColor(color);
      // Use debounced URL update
      debouncedUpdateUrl();
    },
    [setSelectedColor, debouncedUpdateUrl],
  );

  const handleShapeSelect = useCallback(
    (shape: string) => {
      // Create shape to route mapping
      const shapeRouteMap: Record<string, string> = {
        ROUND: 'round-1',
        Round: 'round-1',
        Oval: 'oval-1',
        'CUSHION BRILLIANT': 'cushion-brilliant',
        Cushion: 'cushion-1',
        Radiant: 'radiant-1',
        Marquise: 'marquise',
        Emerald: 'emerald',
        Pear: 'pear',
        Princess: 'princess',
        Asscher: 'asscher-1',
        HEART: 'heart',
      };

      const targetRoute = shapeRouteMap[shape];

      if (targetRoute) {
        // Navigate to the specific diamond collection route
        navigate(`/collections/${targetRoute}`, {replace: false});
      } else {
        // Fallback: if shape not found in mapping, use existing logic
        setSelectedShape((prev) => (prev === shape ? null : shape));
        debouncedUpdateUrl();
      }
    },
    [navigate, setSelectedShape, debouncedUpdateUrl],
  );

  const handleFilterChange = useCallback((data: FilterData) => {
    setAllFiltersData((prev) => ({
      ...prev,
      [data.label || 'unknown']: data,
    }));
    // Use debounced URL update
    debouncedUpdateUrl();
  }, [setAllFiltersData, debouncedUpdateUrl]);

  const onRemoveFilter = useCallback((filterType: string) => {
    setAllFiltersData((prev) => {
      const newData = {...prev};
      delete newData[filterType];
      return newData;
    });
    // Use debounced URL update
    debouncedUpdateUrl();
  }, [setAllFiltersData, debouncedUpdateUrl]);

  const onClearAllFilters = useCallback(() => {
    setSelectedColor(null);
    setSelectedStyle(null);
    setSelectedPendantStyle(null);
    setSelectedShape(null);
    setAllFiltersData({});
    // Use debounced URL update
    debouncedUpdateUrl();
  }, [setSelectedColor, setSelectedStyle, setSelectedPendantStyle, setSelectedShape, setAllFiltersData, debouncedUpdateUrl]);

  const renderChevronIcon = useCallback(
    (isOpen: boolean) =>
      isOpen ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      ),
    [],
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateUrl.cancel();
    };
  }, [debouncedUpdateUrl]);

  return {
    toggleSection,
    getSelectedLabel,
    handleStyleSelect,
    handlePendantStyleSelect,
    handleColorSelect,
    handleShapeSelect,
    handleFilterChange,
    onRemoveFilter,
    onClearAllFilters,
    renderChevronIcon,
  };
}

// Filter renderer component
function FilterRenderer({
  collection,
  memoizedDiamondShapeCollections,
  memoizedRingStyleCollections,
  memoizedDiamondColorCollections,
  memoizedPendantShapeCollections,
  selectedShape,
  handleShapeSelect,
  handleFilterChange,
  renderChevronIcon,
  selectedColor,
  selectedStyle,
  selectedPendantStyle,
  openSections,
  toggleSection,
  getSelectedLabel,
  handleStyleSelect,
  handleColorSelect,
  handlePendantStyleSelect,
  allFiltersData,
  onRemoveFilter,
  onClearAllFilters,
}: {
  collection: CollectionData['collection'];
  memoizedDiamondShapeCollections: typeof DIAMOND_SHAPE_COLLECTIONS;
  memoizedRingStyleCollections: typeof RING_STYLE_COLLECTIONS;
  memoizedDiamondColorCollections: typeof DIAMOND_COLOR_COLLECTIONS;
  memoizedPendantShapeCollections: typeof PENDANT_SHAPE_COLLECTIONS;
  selectedShape: string | null;
  handleShapeSelect: (shape: string) => void;
  handleFilterChange: (data: FilterData) => void;
  renderChevronIcon: (isOpen: boolean) => JSX.Element;
  selectedColor: string | null;
  selectedStyle: string | null;
  selectedPendantStyle: string | null;
  openSections: { style: boolean; metal: boolean; price: boolean };
  toggleSection: (section: 'style' | 'metal' | 'price') => void;
  getSelectedLabel: (section: 'style' | 'metal' | 'price', selectedStyle: string | null, selectedColor: string | null, allFiltersData: FiltersData) => string;
  handleStyleSelect: (style: string | null) => void;
  handleColorSelect: (color: string | null) => void;
  handlePendantStyleSelect: (style: string) => void;
  allFiltersData: FiltersData;
  onRemoveFilter: (filterType: string) => void;
  onClearAllFilters: () => void;
}) {
  const isDiamondShapeRoute = useCallback(() => {
    const shapeRoutes = [
      'round-1',
      'oval-1',
      'cushion-brilliant',
      'cushion-1',
      'radiant-1',
      'marquise',
      'emerald',
      'pear',
      'princess',
      'asscher-1',
      'heart',
    ];
    return shapeRoutes.some((route) => collection.handle === route);
  }, [collection.handle]);

  const renderFilters = useCallback(() => {
    const filterMetafield = collection.metafields.find(
      (meta) => meta?.key === 'filter_keywords' && meta?.namespace === 'custom',
    );
    let filterType: string | null = null;

    try {
      const parsedValue = filterMetafield
        ? JSON.parse(filterMetafield.value)
        : [];
      filterType =
        Array.isArray(parsedValue) && parsedValue.length > 0
          ? (parsedValue[0] as string)
          : null;
    } catch (e) {
      console.error('Error parsing metafield value:', e);
    }

    const validFilterTypes = [
      'Diamond',
      'Ring',
      'Earring',
      'Jewellery',
      'Necklace',
      'Bracelet',
      'Pendants',
    ];

    if (
      (filterType &&
        validFilterTypes.includes(filterType) &&
        filterType === 'Diamond') ||
      isDiamondShapeRoute()
    ) {
      return (
        <DiamondFilters
          diamondShapeCollections={memoizedDiamondShapeCollections}
          selectedShape={selectedShape}
          handleShapeSelect={handleShapeSelect}
          handleFilterChange={handleFilterChange}
          renderChevronIcon={renderChevronIcon}
          filterType={filterType || 'Diamond'}
        />
      );
    } else if (filterType && validFilterTypes.includes(filterType)) {
      if (filterType === 'Pendants') {
        return (
          <PendantFilters
            diamondShapeCollections={memoizedPendantShapeCollections}
            diamondColorCollections={memoizedDiamondColorCollections}
            selectedColor={selectedColor}
            selectedStyle={selectedPendantStyle}
            openSections={openSections}
            toggleSection={toggleSection}
            getSelectedLabel={(section) => {
              switch (section) {
                case 'style':
                  return selectedPendantStyle
                    ? PENDANT_SHAPE_COLLECTIONS.find((c) => c.handle === selectedPendantStyle)
                        ?.title || 'Select Shape'
                    : 'Select Shape';
                case 'metal':
                  return selectedColor || 'Select Metal';
                case 'price':
                  if (allFiltersData.Price?.type === 'numeric') {
                    const {minValue, maxValue} = allFiltersData.Price;
                    const formatValue = (value: number) => {
                      if (value >= 1000) {
                        const k = value / 1000;
                        const decimals = Number.isInteger(k) ? 0 : 1;
                        return `$${k.toFixed(decimals)}k`;
                      }
                      return `$${value}`;
                    };
                    return `${formatValue(minValue ?? 0)} - ${formatValue(maxValue ?? 0)}`;
                  }
                  return 'Select Price';
                default:
                  return 'Select';
              }
            }}
            handleStyleSelect={handlePendantStyleSelect}
            handleColorSelect={handleColorSelect}
            handleFilterChange={handleFilterChange}
            allFiltersData={allFiltersData}
            onRemoveFilter={onRemoveFilter}
            onClearAllFilters={onClearAllFilters}
          />
        );
      } else if (filterType === 'Ring') {
        return (
          <FrameFilters
            ringStyleCollections={memoizedRingStyleCollections}
            diamondColorCollections={memoizedDiamondColorCollections}
            selectedColor={selectedColor}
            selectedStyle={selectedStyle}
            openSections={openSections}
            toggleSection={toggleSection}
            getSelectedLabel={getSelectedLabel}
            handleStyleSelect={handleStyleSelect}
            handleColorSelect={handleColorSelect}
            handleFilterChange={handleFilterChange}
            allFiltersData={allFiltersData}
            onRemoveFilter={onRemoveFilter}
            onClearAllFilters={onClearAllFilters}
          />
        );
      }
    }
    return (
     <PendantFilters
            diamondShapeCollections={memoizedPendantShapeCollections}
            diamondColorCollections={memoizedDiamondColorCollections}
            selectedColor={selectedColor}
            selectedStyle={selectedPendantStyle}
            openSections={openSections}
            toggleSection={toggleSection}
            getSelectedLabel={(section) => {
              switch (section) {
                case 'style':
                  return selectedPendantStyle
                    ? PENDANT_SHAPE_COLLECTIONS.find((c) => c.handle === selectedPendantStyle)
                        ?.title || 'Select Shape'
                    : 'Select Shape';
                case 'metal':
                  return selectedColor || 'Select Metal';
                case 'price':
                  if (allFiltersData.Price?.type === 'numeric') {
                    const {minValue, maxValue} = allFiltersData.Price;
                    const formatValue = (value: number) => {
                      if (value >= 1000) {
                        const k = value / 1000;
                        const decimals = Number.isInteger(k) ? 0 : 1;
                        return `$${k.toFixed(decimals)}k`;
                      }
                      return `$${value}`;
                    };
                    return `${formatValue(minValue ?? 0)} - ${formatValue(maxValue ?? 0)}`;
                  }
                  return 'Select Price';
                default:
                  return 'Select';
              }
            }}
            handleStyleSelect={handlePendantStyleSelect}
            handleColorSelect={handleColorSelect}
            handleFilterChange={handleFilterChange}
            allFiltersData={allFiltersData}
            onRemoveFilter={onRemoveFilter}
            onClearAllFilters={onClearAllFilters}
          />
    );
  }, [
    collection.metafields,
    memoizedDiamondShapeCollections,
    memoizedRingStyleCollections,
    memoizedDiamondColorCollections,
    memoizedPendantShapeCollections,
    selectedShape,
    handleShapeSelect,
    handleFilterChange,
    renderChevronIcon,
    selectedColor,
    selectedStyle,
    selectedPendantStyle,
    openSections,
    toggleSection,
    getSelectedLabel,
    handleStyleSelect,
    handleColorSelect,
    handlePendantStyleSelect,
    allFiltersData,
    onRemoveFilter,
    onClearAllFilters,
  ]);

  return renderFilters();
}

// Product grid component
function ProductGrid({
  collection,
  selectedVariants,
  csvPaths,
  getImagesForSku,
  csvLoading,
  updateProductVariant,
}: {
  collection: CollectionData['collection'];
  selectedVariants: Record<string, any>;
  csvPaths: {
    imagesCsvPath: string;
    videosCsvPath: string;
    ringVisualizerCsvPath: string;
  };
  getImagesForSku: (sku: string) => any[];
  csvLoading: boolean;
  updateProductVariant: (productId: string, variant: any) => void;
}) {
  return (
    <PaginatedResourceSection
      connection={collection.products}
      resourcesClassName=""
      onPageInfoChange={() => {
      }}
    >
      {({node: product, index}) => {
        const productWithVariants = product as ProductItemFragment & {
          variants?: {
            nodes?: Array<{
              id: string;
              title: string;
              availableForSale: boolean;
              sku?: string;
              price: {amount: string; currencyCode: string};
              compareAtPrice?: {
                amount: string;
                currencyCode: string;
              } | null;
              selectedOptions: Array<{name: string; value: string}>;
              image?: {
                id: string;
                altText?: string;
                url: string;
                width: number;
                height: number;
              } | null;
            }>;
          };
        };
        const selectedVariant =
          selectedVariants[product.id] ||
          productWithVariants.variants?.nodes?.[0] ||
          null;
        const imagesForSku =
          !csvLoading && selectedVariant?.sku
            ? getImagesForSku(selectedVariant.sku)
            : [];

        return (
          <ProductCard
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : 'lazy'}
            csvPaths={csvPaths}
            selectedVariant={selectedVariant}
            onVariantChange={(variant) =>
              updateProductVariant(product.id, variant)
            }
            imagesForSku={imagesForSku}
            csvLoading={csvLoading}
          />
        );
      }}
    </PaginatedResourceSection>
  );
}

// Main Collection Component
export default function Collection() {
  const {collection, sortValue} = useLoaderData<CollectionData>();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortValue);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const isMobile = useIsMobile(767);
  const navigate = useNavigate();
  const location = useLocation();
  const firstRenderRef = useRef(true);

  // Use custom hooks for state management
  const {
    selectedVariants,
    setSelectedVariants,
    selectedColor,
    setSelectedColor,
    selectedStyle,
    setSelectedStyle,
    selectedPendantStyle,
    setSelectedPendantStyle,
    selectedShape,
    setSelectedShape,
    openSections,
    setOpenSections,
    allFiltersData,
    setAllFiltersData,
  } = useCollectionState(collection);

  // Memoized values
  const memoizedRingStyleCollections = useMemo(() => RING_STYLE_COLLECTIONS, []);
  const memoizedDiamondColorCollections = useMemo(
    () => DIAMOND_COLOR_COLLECTIONS,
    [],
  );
  const memoizedDiamondShapeCollections = useMemo(
    () => DIAMOND_SHAPE_COLLECTIONS,
    [],
  );
  const memoizedPendantShapeCollections = useMemo(
    () => PENDANT_SHAPE_COLLECTIONS,
    [],
  );
  const memoizedSortOptions = useMemo(() => SORT_OPTIONS, []);

  // URL management
  const {updateUrlWithFilters, isPaginatingRef} = useUrlManager({
    allFiltersData,
    selectedColor,
    selectedStyle,
    selectedPendantStyle,
    selectedShape,
    selectedSort,
    location,
    navigate,
  });

  // Filter operations
  const {
    toggleSection,
    getSelectedLabel,
    handleStyleSelect,
    handlePendantStyleSelect,
    handleColorSelect,
    handleShapeSelect,
    handleFilterChange,
    onRemoveFilter,
    onClearAllFilters,
    renderChevronIcon,
  } = useFilterOperations({
    setOpenSections,
    setSelectedStyle,
    setSelectedColor,
    setAllFiltersData,
    setSelectedPendantStyle,
    setSelectedShape,
    navigate,
    updateUrlWithFilters,
  });

  // Parse URL on initial load
  useEffect(() => {
    const parseUrl = () => {
      const url = new URL(window.location.href);
      const newFiltersData: FiltersData = {};

      startTransition(() => {
        const priceGte = url.searchParams.get('filter.v.price.gte');
        const priceLte = url.searchParams.get('filter.v.price.lte');
        const priceLow = url.searchParams.get('filter.variant_price.low');
        const priceHigh = url.searchParams.get('filter.variant_price.high');

        if (priceGte || priceLte || priceLow || priceHigh) {
          newFiltersData.Price = {
            type: 'numeric',
            label: 'Price',
            range: [100, 100000],
            minValue: priceGte
              ? Number(priceGte)
              : priceLow
                ? Number(priceLow)
                : 100,
            maxValue: priceLte
              ? Number(priceLte)
              : priceHigh
                ? Number(priceHigh)
                : 100000,
            config: {
              min: 100,
              max: 100000,
              step: 100,
              suffix: 'k',
              decimals: 0,
            },
          };
        }

        const metalColor = url.searchParams.get('filter.v.option.Metal Color');
        if (metalColor) setSelectedColor(metalColor);

        const style = url.searchParams.get('filter.p.m.custom.style');
        if (style) setSelectedStyle(style);

        const pendantStyle = url.searchParams.get(
          'filter.v.option.Diamond shape',
        );
        if (pendantStyle) setSelectedPendantStyle(pendantStyle);

        const shape = url.searchParams.get('filter.p.m.custom.shape');
        if (shape) setSelectedShape(shape);

        for (const [key, value] of url.searchParams.entries()) {
          if (
            key.startsWith('filter.p.m.custom.') &&
            !['style', 'shape', 'Diamond shape'].includes(
              key.split('.').pop() || '',
            )
          ) {
            let filterName = key
              .toLowerCase()
              .replace('carat', 'carat')
              .replace('depth %', 'depth')
              .replace('lw ratio', 'lw_ratio')
              .replace('table %', 'table')
              .replace(' ', '_');

            if (value.includes('-') && !isNaN(Number(value.split('-')[0]))) {
              const [min, max] = value.split('-').map(Number);
              newFiltersData[filterName] = {
                type: 'numeric',
                label: filterName,
                minValue: Number(min.toFixed(2)),
                maxValue: Number(max.toFixed(2)),
              };
            } else {
              newFiltersData[filterName] = {
                type: 'categorical',
                label: filterName,
                allSelectedValues: value.split(','),
              };
            }
          }
        }

        setAllFiltersData(newFiltersData);
      });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(parseUrl, {timeout: 1000});
    } else {
      setTimeout(parseUrl, 0);
    }
  }, [setSelectedColor, setSelectedStyle, setSelectedPendantStyle, setSelectedShape, setAllFiltersData]);

  // Update URL when filters change
  useEffect(() => {
  if (firstRenderRef.current) {
    firstRenderRef.current = false;
    return;
  }

  // Don't update URL if we're currently paginating
  if (isPaginatingRef.current) {
    return;
  }

  // Call updateUrlWithFilters immediately when filters change
  const timeoutId = setTimeout(() => {
    updateUrlWithFilters();
  }, 100);

  return () => clearTimeout(timeoutId);
}, [
  allFiltersData,
  selectedColor,
  selectedStyle,
  selectedPendantStyle,
  selectedShape,
  selectedSort,
  updateUrlWithFilters,
]);
  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSelectedSort(value);
    setIsSortOpen(false);
  }, [setSelectedSort, setIsSortOpen]);

  // Handle filter click for mobile
  const handleFilterClick = useCallback(() => {
    if (isMobile) setShowMobileFilter(true);
  }, [isMobile, setShowMobileFilter]);

  // CSV paths configuration
  const csvPaths = {
    imagesCsvPath: '/data/Rings Secondary Images.csv',
    videosCsvPath: '/data/Frame Videos.csv',
    ringVisualizerCsvPath: '/data/Ring Hand Visualiser.csv',
  };

  // CSV collection hook
  const {getImagesForSku, loading: csvLoading} = useCSVCollection({
    imagesCsvPath: csvPaths.imagesCsvPath,
    videosCsvPath: csvPaths.videosCsvPath,
    ringVisualizerCsvPath: csvPaths.ringVisualizerCsvPath,
  });

  // Update product variant
  const updateProductVariant = useCallback(
    (productId: string, variant: any) => {
      setSelectedVariants((prev) => ({
        ...prev,
        [productId]: variant,
      }));
    },
    [setSelectedVariants],
  );

  return (
    <div className="collection bg-white pt-[90px] sm:pt-[100px] md:pt-[235px]">
      <CollectionHeader collection={collection} />
      <div className="w-full bg-white pt-6">
        <div className="container max-w-[1350px] mx-auto px-4">
          <CollectionControls
            productCount={collection.products.nodes.length}
            isSortOpen={isSortOpen}
            setIsSortOpen={setIsSortOpen}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
            onFilterClick={handleFilterClick}
            sortOptions={memoizedSortOptions}
          />
          <div className="hidden md:block w-full p-0">
            <FilterRenderer
              collection={collection}
              memoizedDiamondShapeCollections={memoizedDiamondShapeCollections}
              memoizedRingStyleCollections={memoizedRingStyleCollections}
              memoizedDiamondColorCollections={memoizedDiamondColorCollections}
              memoizedPendantShapeCollections={memoizedPendantShapeCollections}
              selectedShape={selectedShape}
              handleShapeSelect={handleShapeSelect}
              handleFilterChange={handleFilterChange}
              renderChevronIcon={renderChevronIcon}
              selectedColor={selectedColor}
              selectedStyle={selectedStyle}
              selectedPendantStyle={selectedPendantStyle}
              openSections={openSections}
              toggleSection={toggleSection}
              getSelectedLabel={(section) => getSelectedLabel(section, selectedStyle, selectedColor, allFiltersData)}
              handleStyleSelect={handleStyleSelect}
              handleColorSelect={handleColorSelect}
              handlePendantStyleSelect={handlePendantStyleSelect}
              allFiltersData={allFiltersData}
              onRemoveFilter={onRemoveFilter}
              onClearAllFilters={onClearAllFilters}
            />
          </div>
          <MobileFilterOverlay
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
          >
            <FilterRenderer
              collection={collection}
              memoizedDiamondShapeCollections={memoizedDiamondShapeCollections}
              memoizedRingStyleCollections={memoizedRingStyleCollections}
              memoizedDiamondColorCollections={memoizedDiamondColorCollections}
              memoizedPendantShapeCollections={memoizedPendantShapeCollections}
              selectedShape={selectedShape}
              handleShapeSelect={handleShapeSelect}
              handleFilterChange={handleFilterChange}
              renderChevronIcon={renderChevronIcon}
              selectedColor={selectedColor}
              selectedStyle={selectedStyle}
              selectedPendantStyle={selectedPendantStyle}
              openSections={openSections}
              toggleSection={toggleSection}
              getSelectedLabel={(section) => getSelectedLabel(section, selectedStyle, selectedColor, allFiltersData)}
              handleStyleSelect={handleStyleSelect}
              handleColorSelect={handleColorSelect}
              handlePendantStyleSelect={handlePendantStyleSelect}
              allFiltersData={allFiltersData}
              onRemoveFilter={onRemoveFilter}
              onClearAllFilters={onClearAllFilters}
            />
          </MobileFilterOverlay>
          <div className="flex w-full md:flex-row flex-col md:py-8 pb-8 pt-2.5">
            <div className="flex-1">
              <ProductGrid
                collection={collection}
                selectedVariants={selectedVariants}
                csvPaths={csvPaths}
                getImagesForSku={getImagesForSku}
                csvLoading={csvLoading}
                updateProductVariant={updateProductVariant}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    tags
    productType
    featuredImage {
      id
      altText
      url
      width
      height
    }
    caratMetafield: metafield(namespace: "custom", key: "carat") { value }
          shape: metafield(namespace: "custom", key: "shape") { value }
          diamondColor: metafield(namespace: "custom", key: "diamond_color") { value }
          cut: metafield(namespace: "custom", key: "cut") { value }
          clarity: metafield(namespace: "custom", key: "clarity") { value }
          depth: metafield(namespace: "custom", key: "depth") { value }
          polish: metafield(namespace: "custom", key: "polish") { value }
          lwRatio: metafield(namespace: "custom", key: "lw_ratio") { value }
          fluorescence: metafield(namespace: "custom", key: "fluorescence") { value }
          report: metafield(namespace: "custom", key: "report") { value }
          table: metafield(namespace: "custom", key: "table") { value }
          symmetry: metafield(namespace: "custom", key: "symmetry") { value }
          showOnCollection: metafield(namespace: "custom", key: "show_on_collection") { value }
          sizeProductOption: metafield(namespace: "custom", key: "size") { value }
          certification: metafield(namespace: "custom", key: "certification") { value }
          style: metafield(namespace: "custom", key: "style") { value }
          sliderEnable: metafield(namespace: "custom", key: "slider_enable") { value }
          pinned: metafield(namespace: "custom", key: "pinned") { value }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 250) {
      nodes {
        id
        title
        availableForSale
        price {
          ...MoneyProductItem
        }
        compareAtPrice {
          ...MoneyProductItem
        }
        selectedOptions {
          name
          value
        }
        image {
          id
          altText
          url
          width
          height
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
      metafields(identifiers: { key: "filter_keywords", namespace: "custom" }) {
        key
        namespace
        value
      }
    }
  }
`;
