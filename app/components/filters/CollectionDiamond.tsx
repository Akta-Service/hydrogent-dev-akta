import React, {useRef, useCallback} from 'react';
import UniversalRangeFilter from '~/components/filters/CustomeFilters';
import {ShopBySection} from '../ui/ring-Visulizer/ShopBySection';
import Accordion from '../ui/Accordion/Accordion';
import useIsMobile from '../Hooks/useIsMobile';
import {
  COLOROPTIONS,
  COLLECTIONCUTOPTION,
  CLARITYOPTIONS,
  COLLECTIONSYMMETRYOPTIONS,
  COLLECTIONFLUORESCENCEOPTIONS,
  COLLECTIONPOLISHOPTION,
} from '~/helpers/constants';

type Props = {
  diamondShapeCollections: any[];
  selectedShape: string | null;
  handleShapeSelect: (shape: string) => void;
  handleFilterChange: (data: any) => void;
  renderChevronIcon: (isOpen: boolean) => JSX.Element;
  filterType?: any
};

const DiamondFilters: React.FC<Props> = ({
  diamondShapeCollections,
  selectedShape,
  handleShapeSelect,
  handleFilterChange,
  renderChevronIcon,
  filterType
}) => {
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  const debouncedHandleFilterChange = useCallback((data: any, delay: number = 300) => {
    if (debounceTimers.current[data.label]) {
      clearTimeout(debounceTimers.current[data.label]);
    }
    
    debounceTimers.current[data.label] = setTimeout(() => {
      handleFilterChange(data);
      delete debounceTimers.current[data.label];
    }, delay);
  }, [handleFilterChange]);

  const handleFilterChangeWithDebounce = useCallback((data: any) => {
    if (data.type === 'numeric') {
      debouncedHandleFilterChange(data, 300); 
    } else {
      handleFilterChange(data);
    }
  }, [handleFilterChange, debouncedHandleFilterChange]);

  const priceRef = useRef<any>(null);
  const caratRef = useRef<any>(null);
  const colorRef = useRef<any>(null);
  const cutRef = useRef<any>(null);
  const clarityRef = useRef<any>(null);
  const depthRef = useRef<any>(null);
  const polishRef = useRef<any>(null);
  const lwRatioRef = useRef<any>(null);
  const fluorescenceRef = useRef<any>(null);
  const tableRef = useRef<any>(null);
  const symmetryRef = useRef<any>(null);
  const isMobile = useIsMobile(790)

  const resetFilter = (ref: React.RefObject<any>) => {
    if (ref.current?.reset) {
      ref.current.reset();
    }
  };

  // Clean up timers on unmount
  React.useEffect(() => {
    return () => {
      // Clear all pending timers
      Object.values(debounceTimers.current).forEach(timer => {
        clearTimeout(timer);
      });
    };
  }, []);

  return (
    <div className="space-y-6 mt-6 text-white px-10 mx-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
        {/* grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 */}
        <ShopBySection
          title="Shop By Shape"
          items={diamondShapeCollections.map((collection) => ({
            label: collection.title,
            image:
              collection.image?.url || '/placeholder.svg?height=68&width=68',
            handle: collection.handle,
          }))}
          gridCols={isMobile ? 4 : 12}
          
          selectedItem={selectedShape}
          onItemSelect={handleShapeSelect}
        />

        {/* Price */}
        {/* <div>
          <UniversalRangeFilter
            ref={priceRef}
            label="Price"
            type="numeric"
            numericConfig={{
              min: 100,
              max: 100000,
              step: 100,
              suffix: 'k',
              decimals: 0,
            }}
            defaultNumericRange={[100, 100000]}
            tooltip=""
            onChange={handleFilterChangeWithDebounce}
          />
          
        </div> */}
      {
        filterType !== 'Diamond' ? (
          <>
           {/* Carat */}
        <div>
          <UniversalRangeFilter
            ref={caratRef}
            label="Carat"
            type="numeric"
            numericConfig={{
              min: 0,
              max: 5,
              step: 1,
              suffix: 'ct',
              decimals: 0,
              jump: true,
            }}
            defaultNumericRange={[0, 5]}
            tooltip="Carat refers to a diamond's weight, not its size."
            onChange={handleFilterChangeWithDebounce}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(caratRef)}>Reset</button> */}
        </div>

        {/* Color */}
        <div>
          <UniversalRangeFilter
            ref={colorRef}
            label="diamond color"
            type="categorical"
            options={COLOROPTIONS}
            defaultCategoricalRange={[0, 9]}
            tooltip="Diamond color refers to how white or colorless a diamond appears."
            onChange={handleFilterChangeWithDebounce}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(colorRef)}>Reset</button> */}
        </div>

        {/* Cut */}
        <div>
          <UniversalRangeFilter
            ref={cutRef}
            label="Cut"
            type="categorical"
            options={COLLECTIONCUTOPTION}
            defaultCategoricalRange={[0, 3]}
            tooltip="Cut is the most important factor in a diamond's beauty."
            onChange={handleFilterChangeWithDebounce}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(cutRef)}>Reset</button> */}
        </div>

        {/* Clarity */}
        <div>
          <UniversalRangeFilter
            ref={clarityRef}
            label="clarity"
            type="categorical"
            options={CLARITYOPTIONS}
            defaultCategoricalRange={[0, 9]}
            tooltip="Diamond clarity measures how clean a stone is from internal inclusions."
            onChange={handleFilterChangeWithDebounce}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(clarityRef)}>Reset</button> */}
        </div>
          </>
        ) : ''
      }
       
      </div>

      {/* Advanced Filters 
      commented as per https://www.notion.so/Manual-Diamond-Collections-2718070f645680caa4d0f8f35e1c0f28?v=2478070f645680b2a688000c54bafe44&source=copy_link
      */}
      {/* <div className="mt-10">
        <Accordion
          title="Advanced Filters"
          className="text-[24px] playfair font-semibold text-black mb-4"
          renderIcon={renderChevronIcon}
          maxContentHeight={600}
          titleClasses="text-[24px] original playfair font-semibold text-white pb-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <UniversalRangeFilter
                ref={polishRef}
                label="Polish"
                type="categorical"
                options={COLLECTIONPOLISHOPTION}
                defaultCategoricalRange={[0, 3]}
                tooltip="Polish refers to the smoothness of a diamond's surface."
                onChange={handleFilterChangeWithDebounce}
              />
            </div>

            <div>
              <UniversalRangeFilter
                ref={fluorescenceRef}
                label="Fluorescence"
                type="categorical"
                options={COLLECTIONFLUORESCENCEOPTIONS}
                defaultCategoricalRange={[0, 5]}
                tooltip="Fluorescence refers to a diamond's natural glow under UV light."
                onChange={handleFilterChangeWithDebounce}
              />
            </div>

            <div>
              <UniversalRangeFilter
                ref={symmetryRef}
                label="Symmetry"
                type="categorical"
                options={COLLECTIONSYMMETRYOPTIONS}
                defaultCategoricalRange={[0, 3]}
                tooltip="Symmetry of the diamond"
                onChange={handleFilterChangeWithDebounce}
              />
            </div>
          </div>
        </Accordion>
      </div> */}
    </div>
  );
};

export default DiamondFilters;