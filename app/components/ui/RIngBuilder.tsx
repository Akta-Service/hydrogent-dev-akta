// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type React from 'react';
import {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import crossModal from '~/assets/images/svg/rremove.svg';
import useIsMobile from '~/components/Hooks/useIsMobile';
import {useCSVMedia} from '~/hooks/use-csv-media';
import useDebounce from './ring-Visulizer/hooks/use-debounce';
import {useCollections} from './ring-Visulizer/hooks/useCollections';
import {useProductFiltering} from './ring-Visulizer/hooks/useProductFiltering';
import DiamondDetails from './ring-Visulizer/detail-Pages/DiamondDetails';
import {getCollectionsByType} from './ring-Visulizer/utils/collectionUtils';
import DiamondFilters from '../filters/DiamondFilters';
import FrameFilters from '../filters/FrameFilters';
import FrameDetails from './ring-Visulizer/detail-Pages/FrameDetails';
import FinalPreview from './ring-Visulizer/detail-Pages/FinalPreview';
import {useAside} from '../Aside';
import {StepIndicator} from './ring-Visulizer/StepIndicator';
import {ProductGrid} from './ring-Visulizer/ProductGrid';
import {TabSelection} from './ring-Visulizer/TabSelection';
import SliderGallery from './slider/SliderGallery';
import arrowDown from '~/assets/images/svg/upchev.svg';
import type {
  RingBuilderProps,
  NumericFilterData,
  CategoricalFilterData,
  Product,
} from './ring-Visulizer/types';
import ComparableDiamonds, {
  getComparableDiamonds,
} from './ring-Visulizer/ComparableDiamonds';

type FilterData = CategoricalFilterData | NumericFilterData;

const PRODUCTS_PER_PAGE_CLIENT = 30;

interface SelectionState {
  diamond: any | null;
  frame: any | null;
  frameVariant: any | null;
  ringSize: string | null;
  product: any | null;
  isPendants: boolean;
}

interface FilterState {
  shape: string | null;
  style: string | null;
  color: string | null;
  clarity: string | null;
  allFiltersData: Record<string, FilterData>;
}

interface UIState {
  activeTab: null | number;
  settingFirstFlow: boolean;
  showMobileFilter: boolean;
  viewingProductType: 'diamond' | 'frame' | null;
  currentPage: number;
  previewActiveTab: 'preview' | 'video' | 'images';
  openSection: any;
  openSections: {style: boolean; metal: boolean; price: boolean};
}

const RingBuilder: React.FC<RingBuilderProps & {pendant?: boolean}> = ({
  closeModal,
  pendant = false,
}) => {
  const {open} = useAside();
  const modalContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(768);
  const isDiamondListingScreen = true;

  const [selection, setSelection] = useState<SelectionState>({
    diamond: null,
    frame: null,
    frameVariant: null,
    ringSize: null,
    product: null,
    isPendants: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    shape: null,
    style: null,
    color: null,
    clarity: null,
    allFiltersData: {},
  });

  const [ui, setUI] = useState<UIState>({
    activeTab: pendant ? 0 : null,
    settingFirstFlow: pendant ? false : false,
    showMobileFilter: false,
    viewingProductType: null,
    currentPage: 1,
    previewActiveTab: 'images',
    openSection: null,
    openSections: {style: false, metal: false, price: false},
  });

  const [savedFilters, setSavedFilters] = useState<{
    diamond: {shape: string | null} | null;
    frame: {style: string | null; color: string | null} | null;
  }>({
    diamond: null,
    frame: null,
  });

  const [resetProducts, setResetProducts] = useState<boolean>(false);

  const [manualStep, setManualStep] = useState<number | null>(null);

  const [selectedProductsForComparison, setSelectedProductsForComparison] =
    useState<Product[]>([]);

  const csvMediaConfig = useMemo(
    () => ({
      // variantSku: `BR0001-R-6.5-W-14k-f-C637747BF/RN`,
      variantSku: `${selection.frameVariant?.sku}-${selection.diamond?.variants?.[0]?.sku}`,
      imagesCsvPath: '/data/Ring-Diamonds-images.csv',
      videosCsvPath: '/data/Ring-Diamonds-Video.csv',
      ringVisualizerCsvPath: '/data/Ring-Diamonds-Hand-Visualiser.csv',
    }),
    [selection.frameVariant?.sku, selection.diamond?.variants],
  );
  const {
    mediaForSku,
    imagesForSku,
    videosForSku,
    ringVisualizerForSku,
    loading: csvLoading,
    hasCSVMedia,
    error: errorCsv,
  } = useCSVMedia(csvMediaConfig);
  // console.log(
  //   'selection.frameVariant',
  //   ringVisualizerForSku,
  //   imagesForSku,
  //   videosForSku,
  // );

  const {
    imagesForSku: frameImagesForSku,
    loading: frameLoading,
    hasCSVMedia: frameHasCSVMedia,
    error: frameErrorCsv,
  } = useCSVMedia({
    variantSku: selection.frameVariant?.sku,
    imagesCsvPath: '/data/Frame-DetailPage-images.csv',
    videosCsvPath: '',
    ringVisualizerCsvPath: '',
  });

  const {
    imagesForSku: pendentImagesForSku,
    loading: pendentLoading,
    hasCSVMedia: pendentHasCSVMedia,
    error: pendentErrorCsv,
  } = useCSVMedia({
    variantSku: `${selection.frameVariant?.sku}-${selection.diamond?.variants?.[0]?.sku}`,
    imagesCsvPath: '/data/Pendent Images.csv',
    videosCsvPath: '',
    ringVisualizerCsvPath: '',
  });
  const isFilteringFrames = useMemo(() => {
    if (ui.activeTab === null) return undefined;

    if (ui.settingFirstFlow) return !selection.frame;
    return !!selection.diamond && !selection.frame;
  }, [ui.activeTab, ui.settingFirstFlow, selection.frame, selection.diamond]);

  const debouncedFilters = useDebounce(filters.allFiltersData, 400);
  const {
    isLoading,
    error,
    setError,
    products: allFilteredProducts,
  } = useProductFiltering({
    selectedShape: filters.shape,
    selectedStyle: filters.style,
    selectedColor: filters?.color ? String(filters.color).toUpperCase() : null,
    selectedClarity: filters.clarity,
    allFiltersData: debouncedFilters,
    isFrameFlow: isFilteringFrames, // Default to false when undefined
    selectedDiamond: selection.diamond,
    selectedFrame: selection.frame,
    selectedFrameVariant: selection.frameVariant,
    isPendants: selection.isPendants,
  });

  const pagination = useMemo(() => {
    const totalPages = Math.ceil(
      (allFilteredProducts?.length || 0) / PRODUCTS_PER_PAGE_CLIENT,
    );
    const startIndex = (ui.currentPage - 1) * PRODUCTS_PER_PAGE_CLIENT;
    const endIndex = startIndex + PRODUCTS_PER_PAGE_CLIENT;
    const paginatedProducts =
      allFilteredProducts?.slice(startIndex, endIndex) || [];

    return {
      totalPages,
      paginatedProducts,
      hasPreviousPage: ui.currentPage > 1,
      hasNextPage: ui.currentPage < totalPages,
    };
  }, [allFilteredProducts, ui.currentPage]);

  const {collections, collectionsLoading} = useCollections({
    tag: ui.settingFirstFlow ? 'Frames' : 'Diamond',
    products: allFilteredProducts,
    setProducts: () => {},
  });

  const collectionHelpers = useMemo(
    () => ({
      diamondShapes: getCollectionsByType(collections, 'Diamond Shape'),
      ringStyles: getCollectionsByType(collections, 'Ring Style'),
      diamondColors: getCollectionsByType(collections, 'Diamond Color'),
      clarities: getCollectionsByType(collections, 'Clarity'),
      pendant: getCollectionsByType(collections, 'Diamond Shape'),
    }),
    [collections],
  );

  const galleryImages = useMemo(() => {
    const images: any[] = [];

    if (selection.product?.images && Array.isArray(selection.product.images)) {
      const productImages = selection.product.images.map(
        (img: any, index: number) => ({
          ...img,
          id: `${selection.product.id}-img-${index}`,
          type: 'image' as const,
        }),
      );
      images.push(...productImages);
    }

    if (selection.product?.videoUrl) {
      images.push({
        url: selection.product.videoUrl,
        altText: '3d view',
        type: 'iframe' as const,
        id: `video-${selection.product.id || 'default'}`,
        title: '3d view Diamond',
      });
    }

    if (ui.viewingProductType === 'frame' && selection.frameVariant?.image) {
      images.unshift({
        url: selection.frameVariant.image.url,
        altText:
          selection.frameVariant.image.altText || 'Selected variant image',
        type: 'image' as const,
        id: `variant-${selection.frameVariant.id}`,
        title: selection.frameVariant.title,
      });
    }
    return images;
  }, [selection.product, ui.viewingProductType, selection.frameVariant]);

  const fallbackImages = [
    {
      url: '/Fallback-Image.png',
      altText: 'image',
      type: 'image' as const,
      id: '23',
      title: 'images fallback',
    },
  ];

  const updateSelection = useCallback((updates: Partial<SelectionState>) => {
    setSelection((prev) => ({...prev, ...updates}));
  }, []);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({...prev, ...updates}));
  }, []);

  const updateUI = useCallback((updates: Partial<UIState>) => {
    setUI((prev) => ({...prev, ...updates}));
  }, []);

  const toggleProductForComparison = useCallback((product: Product) => {
    setSelectedProductsForComparison((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length < 10) {
          return [...prev, product];
        } else {
          alert('You can only compare up to 2 products at a time.');
          return prev;
        }
      }
    });
  }, []);

  const handleNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      updateUI({currentPage: ui.currentPage + 1});
    }
  }, [pagination.hasNextPage, ui.currentPage, updateUI]);

  const handlePreviousPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      updateUI({currentPage: ui.currentPage - 1});
    }
  }, [pagination.hasPreviousPage, ui.currentPage, updateUI]);

  const toggleInfo = (section: any) => {
    updateUI({openSection: ui.openSection === section ? null : section});
  };

  const toggleSection = (section: string) => {
    if (section === 'style' || section === 'metal' || section === 'price') {
      const validSection = section as keyof UIState['openSections'];
      updateUI({
        openSections: {
          ...ui.openSections,
          [validSection]: !ui.openSections[validSection],
        },
      });
    }
  };

  const handleRemoveFilter = (filterType: string) => {
    if (filterType === 'price') {
      updateFilters({
        allFiltersData: Object.fromEntries(
          Object.entries(filters.allFiltersData).filter(
            ([key]) => key !== 'Price',
          ),
        ),
      });
    }
  };

  const handleClearAllFilters = () => {
    updateFilters({color: null, style: null, allFiltersData: {}});
  };

  const getSelectedLabel = (section: string) => {
    if (!(section === 'style' || section === 'metal' || section === 'price')) {
      return '';
    }

    const validSection = section as keyof UIState['openSections'];
    switch (validSection) {
      case 'style':
        return (
          collectionHelpers.ringStyles.find((c) => c.handle === filters.style)
            ?.title || 'Select Style'
        );

      case 'metal':
        return filters.color
          ? collectionHelpers.diamondColors.find(
              (c) => c.handle === filters.color,
            )?.title || 'Select Metal'
          : 'Select Metal';

      case 'price': {
        const priceData = filters.allFiltersData?.Price;
        if (priceData?.type === 'numeric') {
          const {minValue, maxValue} = priceData;

          const formatValue = (value: number) => {
            if (value >= 1000) {
              const k = value / 1000;
              const decimals = Number.isInteger(k) ? 0 : 1;
              return `$${k.toFixed(decimals)}k`;
            }
            return `$${value}`;
          };

          return `${formatValue(minValue)} - ${formatValue(maxValue)}`;
        }
        return 'Select Price Range';
      }

      default:
        return '';
    }
  };

  const handleShapeSelect = (shape: string) => {
    updateFilters({shape: shape === filters.shape ? null : shape});
  };

  const handleStyleSelect = (style: string | null) => {
    updateFilters({
      style:
        style &&
        filters.style &&
        style.toUpperCase() === filters.style.toUpperCase()
          ? null
          : style
            ? style.toUpperCase()
            : null,
    });
  };

  const handleColorSelect = (color: string | null) => {
    updateFilters({
      color: filters.color === color ? null : color,
    });
  };

  const handleClaritySelect = (clarity: string) => {
    updateFilters({clarity: clarity === filters.clarity ? null : clarity});
  };

  const handleFilterClick = useCallback(() => {
    if (isMobile) {
      updateUI({showMobileFilter: true});
    }
  }, [isMobile, updateUI]);

  const handleFilterChange = (filterData: FilterData) => {
    updateFilters({
      allFiltersData: {
        ...filters.allFiltersData,
        [filterData.label]: filterData,
      },
    });
  };

  const handleSelectDiamond = (product: any, isPendant?: boolean) => {
    const isStep1Complete = ui.settingFirstFlow
      ? !!selection.frame // Diamond is step 2 → require frame
      : true; // Diamond is step 1 → allow always

    if (!isStep1Complete) {
      setManualStep(1);
      updateSelection({product: selection.frame, isPendants: isPendant});
      return;
    }

    pagination.paginatedProducts = [];
    setSavedFilters((prev) => ({
      ...prev,
      diamond: {shape: filters.shape},
    }));

    updateSelection({diamond: product, product: null, isPendants: isPendant});

    if (!ui.settingFirstFlow && !selection.frame) {
      updateFilters({shape: null, color: null, clarity: null, style: null});
      updateSelection({
        frameVariant: null,
        ringSize: null,
        isPendants: isPendant,
      });
    }

    updateSelection({diamond: product, product: null, isPendants: isPendant});
  };
  const handleSelectFrame = (product: any) => {
    // Step 1 check — prevent moving to step 2 if step 1 (diamond/frame) is not selected
    const isStep1Complete = ui.settingFirstFlow
      ? !!selection.frame // Step 1 is frame
      : !!selection.diamond; // Step 1 is diamond

    if (!isStep1Complete) {
      // Reset viewed product
      setManualStep(1);
      updateSelection({
        product: ui.settingFirstFlow ? selection.frame : selection.diamond,
      });
      return;
    }

    setSavedFilters((prev) => ({
      ...prev,
      frame: {style: filters.style, color: filters.color},
    }));

    updateSelection({frame: product, product: null});

    if (ui.settingFirstFlow && !selection.diamond) {
      updateFilters({shape: null, color: null});
      //updateSelection({ringSize: null});
    }
  };

  const handleSelectFrameForProduct = (product: any) => {
    setSavedFilters((prev) => ({
      ...prev,
      frame: {style: filters.style, color: filters.color},
    }));

    updateSelection({frame: product, product: null});

    if (ui.settingFirstFlow && !selection.diamond) {
      updateFilters({shape: null, color: null});
      //updateSelection({ringSize: null});
    }
  };

  const handleResetFilters = () => {
    if (ui.settingFirstFlow) {
      updateFilters({style: null, color: null});
      updateSelection({frameVariant: null, ringSize: null});
    } else {
      updateFilters({shape: null, clarity: null});
    }
    updateFilters({allFiltersData: {}});
  };

  const handleClearFiltersAndRetry = () => {
    updateFilters({shape: null, style: null, color: null, clarity: null});
    setError(null);
  };

  const renderChevronIcon = (isOpen: boolean) => (
    <div className={`transition-transform ${!isOpen ? 'rotate-180' : ''}`}>
      <img
        src={arrowDown || '/placeholder.svg'}
        alt="Chevron Icon"
        className="ii"
      />
    </div>
  );

  const handleSelectProduct = (variant: any) => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }
    updateSelection({product: variant});
  };

  const handleProductClick = (product: any) => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }

    // updateSelection({frameVariant: null});

    if (!ui.settingFirstFlow && selection.diamond && !selection.frame) {
      if (selection.product) {
        handleSelectFrame(product);
        updateUI({viewingProductType: 'frame'});
      } else {
        updateSelection({product});
        updateUI({viewingProductType: 'frame'});
      }
    } else if (ui.settingFirstFlow && selection.frame && !selection.diamond) {
      updateSelection({product});
      updateUI({viewingProductType: null});
    } else {
      updateSelection({product});
      updateUI({viewingProductType: null});
    }
  };

  const handleBackToGrid = () => {
    updateSelection({product: null});
  };

  const getCurrentStep = () => {
    if (ui.settingFirstFlow) {
      if (selection.diamond) return 3;
      if (selection.frame) return 2;
      return 1;
    } else {
      if (selection.frame) return 3;
      if (selection.diamond) return 2;
      return 1;
    }
  };

  const comparableDiamonds = useMemo(() => {
    return getComparableDiamonds(selection.product, allFilteredProducts);
  }, [selection.product, allFilteredProducts]);

  const handleBack = () => {
    if (selection.product) {
      updateSelection({product: null, frameVariant: null}); // Reset frameVariant
      updateUI({viewingProductType: null});
    } else if (ui.settingFirstFlow) {
      if (selection.diamond) {
        updateSelection({diamond: null, frameVariant: null, ringSize: null});
        if (savedFilters.frame) {
          updateFilters({
            style: savedFilters.frame.style,
            color: savedFilters.frame.color,
          });
        }
      } else if (selection.frame) {
        updateSelection({frame: null, frameVariant: null, ringSize: null});
      } else {
        updateUI({activeTab: null});
      }
    } else {
      if (selection.frame) {
        updateSelection({
          frame: null,
          product: null,
          frameVariant: null,
          ringSize: null,
          isPendants: false,
        });
        if (savedFilters.diamond) {
          updateFilters({shape: savedFilters.diamond.shape});
        }
      } else if (selection.diamond) {
        updateSelection({diamond: null});
      } else {
        updateUI({activeTab: null});
      }
    }
  };

  const handleViewDiamond = () => {
    if (selection.diamond) {
      updateSelection({product: selection.diamond});
      updateUI({viewingProductType: 'diamond', previewActiveTab: 'images'});
      setManualStep(ui.settingFirstFlow ? 2 : 1);
    }
  };

  const handleViewFrame = () => {
    if (selection.frame) {
      updateSelection({product: selection.frame});
      updateUI({viewingProductType: 'frame', previewActiveTab: 'images'});
      setManualStep(ui.settingFirstFlow ? 1 : 2);
    }
  };

  const currentStep = manualStep ?? getCurrentStep();

  const handleEditDiamond = () => {
    if (ui.settingFirstFlow && selection.frame === null) {
      updateSelection({
        frame: null,
        product: null,
        frameVariant: null,
        ringSize: null,
        diamond: null,
      });
      setManualStep(1);
      return;
    } else {
      updateSelection({diamond: null, product: null});
      setManualStep(ui.settingFirstFlow ? 2 : 1);
    }
  };

  const handleEditFrame = () => {
    if (!ui.settingFirstFlow && selection.diamond === null) {
      updateSelection({
        frame: null,
        product: null,
        frameVariant: null,
        ringSize: null,
      });
      setManualStep(1);
      return;
    }
    updateSelection({
      frame: null,
      product: null,
      frameVariant: null,
      ringSize: null,
    });
    setManualStep(ui.settingFirstFlow ? 1 : 2);
  };

  useEffect(() => {
    if (selection.diamond && selection.frame) {
      setManualStep(null);
    }
  }, [selection.diamond, selection.frame]);

  useEffect(() => {
    if (resetProducts) setResetProducts(false);
  }, [allFilteredProducts]);

  const renderMainContent = () => {
    const paginatedProducts = resetProducts ? [] : pagination.paginatedProducts;

    const shouldUseFrameImages =
      (ui.viewingProductType === 'frame' ||
        (ui.settingFirstFlow &&
          !selection.diamond &&
          selection.product?.productType !== 'Diamond')) &&
      frameImagesForSku.length > 0;

    if (selection.product) {
      return (
        <>
          <div className="flex flex-col md:flex-row gap-6 mt-10">
            <div className="flex-1">
              {galleryImages && galleryImages.length > 0 ? (
                <SliderGallery
                  images={
                    shouldUseFrameImages ? frameImagesForSku : galleryImages
                  }
                  videos={[]}
                  hasCSVMedia={false}
                />
              ) : (
                <div className="w-full h-96 bg-gray-700 flex items-center justify-center text-primary rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-xl">No images available</p>
                  </div>
                </div>
              )}
            </div>
            {ui.viewingProductType === 'diamond' ? (
              <DiamondDetails
                product={selection.product}
                selectedFrame={selection.frame}
                handleSelectDiamond={handleSelectDiamond}
                openCartDrawer={() => open('cart')}
              />
            ) : ui.viewingProductType === 'frame' ? (
              <FrameDetails
                product={selection.product}
                selectedRingSize={selection.ringSize}
                selectedVariant={selection.frameVariant}
                setSelectedRingSize={(size) =>
                  updateSelection({ringSize: size})
                }
                setSelectedVariant={(variant) =>
                  updateSelection({frameVariant: variant})
                }
                handleSelectFrame={handleSelectFrame}
              />
            ) : ui.settingFirstFlow ? (
              selection.frame ? (
                <DiamondDetails
                  product={selection.product}
                  selectedFrame={selection.frame}
                  handleSelectDiamond={handleSelectDiamond}
                  openCartDrawer={() => open('cart')}
                />
              ) : (
                <FrameDetails
                  product={selection.product}
                  selectedRingSize={selection.ringSize}
                  selectedVariant={selection.frameVariant}
                  setSelectedRingSize={(size) =>
                    updateSelection({ringSize: size})
                  }
                  setSelectedVariant={(variant) =>
                    updateSelection({frameVariant: variant})
                  }
                  handleSelectFrame={
                    ui.settingFirstFlow
                      ? handleSelectFrameForProduct
                      : handleSelectFrame
                  }
                />
              )
            ) : selection.diamond ? (
              <FrameDetails
                product={selection.product}
                selectedRingSize={selection.ringSize}
                selectedVariant={selection.frameVariant}
                setSelectedRingSize={(size) =>
                  updateSelection({ringSize: size})
                }
                setSelectedVariant={(variant) =>
                  updateSelection({frameVariant: variant})
                }
                handleSelectFrame={handleSelectFrame}
              />
            ) : (
              <DiamondDetails
                product={selection.product}
                selectedFrame={selection.frame}
                handleSelectDiamond={handleSelectDiamond}
                openCartDrawer={() => open('cart')}
              />
            )}
          </div>

          {!ui.settingFirstFlow &&
            (ui.viewingProductType === 'diamond' ||
              (!ui.viewingProductType && !selection.diamond)) && (
              <ComparableDiamonds
                onClick={handleSelectProduct}
                selectedProduct={selection.product}
                comparableDiamonds={comparableDiamonds}
              />
            )}
        </>
      );
    }

    if (
      (selection.frame && selection.diamond) ||
      (!ui.settingFirstFlow && selection.diamond && selection.frame)
    ) {
      return (
        <FinalPreview
          previewActiveTab={ui.previewActiveTab}
          setPreviewActiveTab={(tab) => updateUI({previewActiveTab: tab})}
          ringVisualizerForSku={ringVisualizerForSku}
          hasCSVMedia={hasCSVMedia}
          videosForSku={videosForSku}
          imagesForSku={
            selection.isPendants ? pendentImagesForSku : imagesForSku
          }
          fallbackImages={fallbackImages}
          selectedDiamond={selection.diamond}
          selectedFrame={selection.frame}
          selectedFrameVariant={selection.frameVariant}
          selectedRingSize={selection.ringSize}
          setSelectedRingSize={(size) => updateSelection({ringSize: size})}
          setSelectedFrameVariant={(variant) =>
            updateSelection({frameVariant: variant})
          }
          openSection={ui.openSection}
          toggleInfo={toggleInfo}
          toggleSection={toggleSection}
          getCurrentStep={getCurrentStep}
          openCartDrawer={() => open('cart')}
        />
      );
    }

    if (!ui.settingFirstFlow && selection.diamond && !selection.frame) {
      return (
        <>
          <FrameFilters
            ringStyleCollections={
              selection.isPendants
                ? collectionHelpers.pendant
                : collectionHelpers.ringStyles
            }
            diamondColorCollections={collectionHelpers.diamondColors}
            selectedColor={filters.color}
            selectedStyle={filters.style}
            openSections={ui.openSections}
            toggleSection={toggleSection}
            getSelectedLabel={getSelectedLabel}
            handleStyleSelect={handleStyleSelect}
            handleColorSelect={handleColorSelect}
            handleFilterChange={handleFilterChange}
            allFiltersData={filters.allFiltersData}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
            isPendants={selection.isPendants}
          />
          <div className="py-6 text-primary">
            <ProductGrid
              products={paginatedProducts}
              isLoading={isLoading}
              error={error}
              productsType="frame"
              selectedShape={filters.shape}
              onResetFilters={handleResetFilters}
              onClearFiltersAndRetry={handleClearFiltersAndRetry}
              onProductClick={handleProductClick}
              hasPreviousPage={pagination.hasPreviousPage}
              hasNextPage={pagination.hasNextPage}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              currentPage={ui.currentPage}
              totalProducts={allFilteredProducts.length || 0}
              totalPages={pagination.totalPages}
              selectedProductsForComparison={selectedProductsForComparison}
              toggleProductForComparison={toggleProductForComparison}
              selectedFrameVariant={selection.frameVariant}
              selectedColorFilter={filters.color}
            />
          </div>
        </>
      );
    }

    if (ui.settingFirstFlow && selection.frame && !selection.diamond) {
      return (
        <>
          <DiamondFilters
            diamondShapeCollections={collectionHelpers.diamondShapes}
            selectedShape={filters.shape}
            handleShapeSelect={handleShapeSelect}
            handleFilterChange={handleFilterChange}
            renderChevronIcon={renderChevronIcon}
          />
          <div className="py-6 text-primary">
            <h2 className="text-2xl font-bold mb-4">
              Choose a Diamond for Your Setting
            </h2>
            <ProductGrid
              products={paginatedProducts}
              isLoading={isLoading}
              error={error}
              productsType="diamond"
              selectedShape={filters.shape}
              onResetFilters={handleResetFilters}
              onClearFiltersAndRetry={handleClearFiltersAndRetry}
              onProductClick={handleProductClick}
              hasPreviousPage={pagination.hasPreviousPage}
              hasNextPage={pagination.hasNextPage}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              currentPage={ui.currentPage}
              totalPages={pagination.totalPages}
              totalProducts={allFilteredProducts.length || 0}
              selectedProductsForComparison={selectedProductsForComparison}
              toggleProductForComparison={toggleProductForComparison}
              selectedFrameVariant={selection.frameVariant}
              selectedColorFilter={filters.color}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="shopoptions md:py-[30px] py-[10px]">
          {collectionsLoading ? (
            <div className="text-primary text-center py-8">
              Loading collections...
            </div>
          ) : ui.settingFirstFlow ? (
            <FrameFilters
              ringStyleCollections={collectionHelpers.ringStyles}
              diamondColorCollections={collectionHelpers.diamondColors}
              selectedColor={filters.color}
              selectedStyle={filters.style}
              openSections={ui.openSections}
              toggleSection={toggleSection}
              getSelectedLabel={getSelectedLabel}
              handleStyleSelect={handleStyleSelect}
              handleColorSelect={handleColorSelect}
              handleFilterChange={handleFilterChange}
              allFiltersData={filters.allFiltersData}
              onRemoveFilter={handleRemoveFilter}
              onClearAllFilters={handleClearAllFilters}
              isPendants={selection.isPendants}
            />
          ) : (
            <DiamondFilters
              diamondShapeCollections={collectionHelpers.diamondShapes}
              selectedShape={filters.shape}
              handleShapeSelect={handleShapeSelect}
              handleFilterChange={handleFilterChange}
              renderChevronIcon={renderChevronIcon}
            />
          )}
        </div>
        <div className="py-[12px] relative">
          <div>
            <ProductGrid
              products={paginatedProducts}
              isLoading={isLoading}
              error={error}
              productsType={ui.settingFirstFlow ? 'frame' : 'diamond'}
              selectedShape={filters.shape}
              onResetFilters={handleResetFilters}
              onClearFiltersAndRetry={handleClearFiltersAndRetry}
              onProductClick={handleProductClick}
              hasPreviousPage={pagination.hasPreviousPage}
              hasNextPage={pagination.hasNextPage}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              currentPage={ui.currentPage}
              totalPages={pagination.totalPages}
              totalProducts={allFilteredProducts.length || 0}
              selectedProductsForComparison={selectedProductsForComparison}
              toggleProductForComparison={toggleProductForComparison}
              selectedFrameVariant={selection.frameVariant}
              selectedColorFilter={filters.color}
            />
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    // Only reset page if isFilteringFrames is defined
    if (isFilteringFrames !== undefined) {
      updateUI({currentPage: 1});
    }
  }, [
    filters.shape,
    filters.style,
    filters.color,
    filters.clarity,
    filters.allFiltersData,
    isFilteringFrames,
  ]);

  useEffect(() => {
    const isOnInitialTabScreen =
      !selection.frame &&
      !selection.diamond &&
      !selection.product &&
      ui.activeTab !== null;

    if (isOnInitialTabScreen) {
      if (
        ui.settingFirstFlow &&
        !filters.style &&
        collectionHelpers.ringStyles.length > 0
      ) {
        updateFilters({style: null});
      } else if (
        !ui.settingFirstFlow &&
        !filters.shape &&
        collectionHelpers.diamondShapes.length > 0
      ) {
        updateFilters({shape: null});
      }
    }
  }, [
    ui.activeTab,
    selection.frame,
    selection.diamond,
    selection.product,
    ui.settingFirstFlow,
    collectionHelpers.ringStyles,
    collectionHelpers.diamondShapes,
    filters.style,
    filters.shape,
  ]);

  useEffect(() => {
    if (isDiamondListingScreen && savedFilters.diamond) {
      updateFilters({shape: savedFilters.diamond.shape});
    }
  }, [
    selection.diamond,
    selection.frame,
    selection.product,
    ui.activeTab,
    savedFilters.diamond,
  ]);

  useEffect(() => {
    if (ui.settingFirstFlow) {
      if (!selection.frame && !selection.diamond && !selection.product) {
        updateFilters({shape: null, clarity: null});
        if (!filters.style) {
          updateFilters({style: null});
        }
      } else if (selection.frame && !selection.diamond && !selection.product) {
        updateFilters({style: null, color: null});
        if (!filters.shape) {
          updateFilters({shape: null});
        }
      }
    } else {
      if (!selection.diamond && !selection.frame && !selection.product) {
        updateFilters({style: null});
        if (!filters.shape) {
          updateFilters({shape: null});
        }
      } else if (selection.diamond && !selection.frame && !selection.product) {
        updateFilters({shape: null, clarity: null});
        if (!filters.style && collectionHelpers.ringStyles.length > 0) {
          updateFilters({style: null});
        }
      }
    }
  }, [
    ui.settingFirstFlow,
    selection.diamond,
    selection.frame,
    selection.product,
    collectionHelpers.ringStyles,
    filters.style,
    filters.shape,
  ]);

  useEffect(() => {
    if (selection.product && ui.viewingProductType === 'frame') {
      updateSelection({frameVariant: null});
    }
  }, [selection.product, ui.viewingProductType]);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
        return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div
      ref={modalContentRef}
      className="fixed inset-0 bg-white flex items-center overflow-y-auto justify-center z-90"
    >
      <div className="h-screen w-full md:py-6 pt-[40px] pb-[30px] relative">
        <button
          onClick={closeModal}
          className="relative md:absolute top-[-18px] md:top-6 md:right-6 ml-auto md:mr-0 mr-4 h-[60px] w-[60px] bg-[#f6f6f6] rounded-full flex items-center justify-center text-primary text-lg font-bold cursor-pointer"
          aria-label="Close modal"
        >
          <img src={crossModal || '/placeholder.svg'} alt="Close" />
        </button>

        {ui.activeTab !== null && (
          <>
            <div className="max-w-[1000px] px-[15px] mx-auto text-center">
              <h2 className="md:text-[56px] sm:text-[45px] text-[25px] md:leading-[65px] sm:leading-[48px] leading-[38px] playfair font-normal mb-4 text-primary">
                Hand-Forged Rings, Designed by You
              </h2>
              <p className="text-primary md:text-[18px] text-[16px] outfit font-normal mb-6">
                {pendant
                  ? "This is YOUR moment — Let's start by choosing the PERFECT Diamond for your pendant."
                  : ui.settingFirstFlow
                    ? "This is YOUR moment — Let's start by choosing the PERFECT Setting."
                    : "This is YOUR moment — Let's start by choosing the PERFECT Diamond."}
              </p>
            </div>
            <StepIndicator
              currentStep={currentStep}
              diamondData={
                selection.diamond
                  ? {
                      carat: selection.diamond.carat || 'N/A',
                      shape: selection.diamond.shape,
                      color: selection.diamond.diamondColor,
                      clarity: selection.diamond.clarity || 'N/A',
                      price: `$${selection.diamond.priceRange?.maxVariantPrice?.amount || 'N/A'}`,
                    }
                  : undefined
              }
              frameData={
                selection.frame
                  ? {
                      metal: selection.frame.diamondColor || 'Yellow Gold',
                      style:
                        selection.frame.title?.split(' ').slice(1).join(' ') ||
                        'Classic',
                      size: '16.5',
                      price: `$${selection.frame.priceRange?.maxVariantPrice?.amount || 'N/A'}`,
                    }
                  : undefined
              }
              settingFirstFlow={ui.settingFirstFlow}
              onViewDiamond={handleViewDiamond}
              onViewFrame={handleViewFrame}
              onEditDiamond={handleEditDiamond}
              onEditFrame={handleEditFrame}
            />
          </>
        )}

        {ui.activeTab !== null &&
          (selection.product ||
            selection.diamond ||
            selection.frame ||
            ui.activeTab !== null) && (
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 h-[60px] w-[60px] bg-[#f6f6f6] rounded-full flex text-primary items-center justify-center"
            >
              ←
            </button>
          )}

        <div className="container md:max-w-[1440px] max-w-[1350px] mx-auto px-[15px] lg:px-[40px]">
          {ui.activeTab === null && !pendant ? (
            <TabSelection
              onTabSelect={(tabIndex) => {
                setResetProducts(true);
                updateUI({
                  activeTab: tabIndex,
                  settingFirstFlow: tabIndex === 1,
                });
                updateSelection({diamond: null, frame: null, product: null});
                updateFilters({
                  shape: tabIndex === 1 ? null : null,
                  style: null,
                  color: null,
                  clarity: null,
                });
                setSelectedProductsForComparison([]);
              }}
            />
          ) : (
            renderMainContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default RingBuilder;
