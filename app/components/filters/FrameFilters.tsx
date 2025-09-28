import React, {useEffect, useRef, useState, useCallback} from 'react';
import {ChevronUp, ChevronDown, X} from 'lucide-react';
import UniversalRangeFilter from '~/components/filters/CustomeFilters';
import {ShopBySection} from '../ui/ring-Visulizer/ShopBySection';
import useIsMobile from '../Hooks/useIsMobile';

type Props = {
  ringStyleCollections: any[];
  diamondColorCollections: any[];
  selectedColor: any | null;
  selectedStyle: string | null;
  openSections: {style: boolean; metal: boolean; price: boolean};
  toggleSection: (section: 'style' | 'metal' | 'price') => void;
  getSelectedLabel: (section: 'style' | 'metal' | 'price') => string;
  handleStyleSelect: (style: string | null) => void;
  handleColorSelect: (color: string | null) => void;
  handleFilterChange: (data: any) => void;
  allFiltersData?: Record<string, any>;
  onRemoveFilter?: (filterType: string) => void;
  onClearAllFilters?: () => void;
  isPendants: boolean;
};

const FrameFilters: React.FC<Props> = ({
  ringStyleCollections,
  diamondColorCollections,
  selectedColor,
  selectedStyle,
  openSections,
  toggleSection,
  getSelectedLabel,
  handleStyleSelect,
  handleColorSelect,
  handleFilterChange,
  allFiltersData = {},
  onRemoveFilter,
  onClearAllFilters,
  isPendants,
}) => {
  const metalRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(790)
  const priceResetRef = useRef<any>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 100000]);
  const [showStyleWarning, setShowStyleWarning] = useState(false);

  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const debouncedHandleFilterChange = useCallback(
    (data: any, delay: number = 300) => {
      if (debounceTimers.current[data.label]) {
        clearTimeout(debounceTimers.current[data.label]);
      }

      debounceTimers.current[data.label] = setTimeout(() => {
        handleFilterChange(data);
        delete debounceTimers.current[data.label];
      }, delay);
    },
    [handleFilterChange],
  );

  const handleFilterChangeWithDebounce = useCallback(
    (data: any) => {
      if (data.type === 'numeric') {
        debouncedHandleFilterChange(data, 300);
      } else {
        handleFilterChange(data);
      }
    },
    [handleFilterChange, debouncedHandleFilterChange],
  );

  const handlePriceChange = (data: any) => {
    if (data.type === 'numeric') {
      setPriceRange([data.minValue, data.maxValue]);
    }
    handleFilterChangeWithDebounce(data);
  };

  const getAppliedFilters = () => {
    const filters = [];

    if (Array.isArray(selectedColor) && selectedColor.length > 0) {
      selectedColor.forEach((color) => {
        const colorLabel =
          diamondColorCollections.find((c) => c.handle === color)?.title ||
          color;
        filters.push({
          type: 'color',
          label: colorLabel,
          value: color,
        });
      });
    } else if (typeof selectedColor === 'string' && selectedColor) {
      const colorLabel =
        diamondColorCollections.find((c) => c.handle === selectedColor)
          ?.title || selectedColor;
      filters.push({
        type: 'color',
        label: colorLabel,
        value: selectedColor,
      });
    }

    if (selectedStyle) {
      const styleLabel =
        ringStyleCollections.find((c) => c.handle === selectedStyle)?.title ||
        selectedStyle;
      filters.push({
        type: 'style',
        label: styleLabel,
        value: selectedStyle,
      });
    }

    if (allFiltersData.Price) {
      const priceData = allFiltersData.Price;
      if (priceData.type === 'numeric') {
        const {minValue, maxValue} = priceData;

        const formatValue = (value: number) => {
          if (value >= 1000) {
            const k = value / 1000;
            const decimals = Number.isInteger(k) ? 0 : 1;
            return `$${k.toFixed(decimals)}k`;
          }
          return `$${value}`;
        };

        filters.push({
          type: 'price',
          label: `${formatValue(minValue)} - ${formatValue(maxValue)}`,
          value: 'price',
        });
      }
    }

    return filters;
  };

  useEffect(() => {
    const refs: Record<
      'metal' | 'style' | 'price',
      React.RefObject<HTMLDivElement>
    > = {
      metal: metalRef,
      style: styleRef,
      price: priceRef,
    };

    const handleClickOutside = (event: MouseEvent) => {
      (['metal', 'style', 'price'] as const).forEach((section) => {
        const ref = refs[section];
        if (
          openSections[section] &&
          ref.current &&
          !ref.current.contains(event.target as Node)
        ) {
          toggleSection(section);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    openSections.metal,
    openSections.style,
    openSections.price,
    toggleSection,
  ]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      // Clear all pending timers
      Object.values(debounceTimers.current).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  const appliedFilters = getAppliedFilters();
  return (
    <div className="relative space-y-6 mt-6">
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pb-4">
          <span className="text-primary text-sm outfit font-medium">
            Applied Filters:
          </span>
          {appliedFilters.map((filter: any) => (
            <div
              key={`${filter.label}`}
              className="flex items-center gap-2 bg-[#09090a] outfit rounded-full px-3 py-1.5 text-white text-sm"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => {
                  if (filter.type === 'color') {
                    handleColorSelect(null);
                  } else if (filter.type === 'style') {
                    handleStyleSelect('');
                  } else if (filter.type === 'price' && onRemoveFilter) {
                    {
                      onRemoveFilter('Price');
                      setPriceRange([100, 100000]);
                    }
                  }
                }}
                className="bg-white rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${filter.label} filter`}
                title={`Remove ${filter.type} filter`}
              >
                <X className="h-3 w-3 text-primary" />
              </button>
            </div>
          ))}
          {appliedFilters.length > 1 && onClearAllFilters && (
            <button
              onClick={onClearAllFilters}
              className="text-black hover:text-primary outfit text-sm underline transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Existing Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!isPendants && (
          <>
            <div className="relative" ref={styleRef}>
              <button
                onClick={() => {
                  toggleSection('style');
                  setShowStyleWarning(false);
                }}
                className="w-full flex items-center justify-between mb-0 border border-[#454545] text-primary px-4 py-[6px] rounded-lg transition-colors"
              >
                <div className="text-left outfit font-light">
                  <div className="text-[13px] leading-[15px] text-black">
                    Style
                  </div>
                  <div className="text-black text-[14px] leading-[16px]">
                    {getSelectedLabel('style')}
                  </div>
                </div>
                {openSections.style ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {openSections.style && (
                <div className="absolute top-full left-0 right-0 z-90 bg-white rounded-[8px] p-4 border border-[#454545] animate-in slide-in-from-top-2 duration-200">
                  <ShopBySection
                    title=""
                    items={ringStyleCollections.map((collection) => ({
                      label: collection.title,
                      image:
                        collection.image?.url ||
                        '/placeholder.svg?height=68&width=68',
                      handle: collection.handle,
                    }))}
                    gridCols={isMobile? 4 : 4 }
                    selectedItem={selectedStyle}
                    onItemSelect={handleStyleSelect}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Metal Filter */}
        <div className="relative" ref={metalRef}>
          <button
            onClick={() => {
              toggleSection('metal');
            }}
            className="w-full flex items-center justify-between border border-[#454545] text-primary px-4 py-[6px] rounded-lg transition-colors"
          >
            <div className="text-left outfit font-light">
              <div className="text-[13px] leading-[15px] text-black">
                Metal Color
              </div>
              <div className="text-black text-[14px] leading-[16px]">
                {getSelectedLabel('metal')}
              </div>
            </div>
            {openSections.metal ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {openSections.metal && (
            <div className="absolute top-full left-0 right-0 z-90 bg-white rounded-[8px] p-4 border border-[#454545] animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-wrap gap-4">
                {diamondColorCollections.map(({title, handle, image}) => (
                  <button
                    key={handle}
                    onClick={() => handleColorSelect(handle)}
                    className={`w-18 h-18 rounded-xl overflow-hidden flex items-center justify-center  transition 
                    ${selectedColor === handle ? 'ring-1 ring-black' : ''}`}
                  >
                    <img
                      src={image?.url}
                      alt={title}
                      className="shadow-md rounded-xl"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          {showStyleWarning && (
            <div className="text-red-600 text-sm mt-2 ml-1">
              Please select a style before selecting the metal color.
            </div>
          )}
        </div>

        <div className="relative" ref={priceRef}>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between mb-0 border border-[#454545] text-primary px-4 py-[6px] rounded-lg transition-colors"
          >
            <div className="text-left outfit font-light">
              <div className="text-[13px] leading-[15px] text-black">Price</div>
              <div className="text-black text-[14px] leading-[16px]">
                {getSelectedLabel('price')}
              </div>
            </div>
            {openSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {openSections.price && (
            <div
              className={`absolute top-full left-0 right-0 z-80 bg-white rounded-[8px] p-4 border border-[#454545] animate-in slide-in-from-top-2 duration-200 ${
                openSections.price ? '' : 'hidden'
              }`}
            >
              <UniversalRangeFilter
                ref={priceResetRef}
                label="Price"
                type="numeric"
                numericConfig={{
                  min: 100,
                  max: 100000,
                  step: 100,
                  suffix: 'k',
                  decimals: 0,
                }}
                defaultNumericRange={priceRange}
                tooltip=""
                onChange={handlePriceChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameFilters;
