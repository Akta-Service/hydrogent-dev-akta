import React, {useRef} from 'react';
import UniversalRangeFilter from '~/components/filters/CustomeFilters';
import {ShopBySection} from '../ui/ring-Visulizer/ShopBySection';
import useIsMobile from '../Hooks/useIsMobile';
import Accordion from '../ui/Accordion/Accordion';
import {
  COLOROPTIONS,
  CUTOPTIONS,
  CLARITYOPTIONS,
  SYMMETRYOPTIONS,
  FLUORESCENCEOPTIONS,
  POLISHOPTIONS,
} from '~/helpers/constants';

type Props = {
  diamondShapeCollections: any[];
  selectedShape: string | null;
  handleShapeSelect: (shape: string) => void;
  handleFilterChange: (data: any) => void;
  renderChevronIcon: (isOpen: boolean) => JSX.Element;
};

const DiamondFilters: React.FC<Props> = ({
  diamondShapeCollections,
  selectedShape,
  handleShapeSelect,
  handleFilterChange,
  renderChevronIcon,
}) => {
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
  const isMobile =useIsMobile()

  const resetFilter = (ref: React.RefObject<any>) => {
    if (ref.current?.reset) {
      ref.current.reset();
    }
  };

  return (
    <div className="space-y-6 mt-6 text-primary mx-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <ShopBySection
          title="Shop By Shape"
          items={diamondShapeCollections.map((collection) => ({
            label: collection.title,
            image:
              collection.image?.url || '/placeholder.svg?height=68&width=68',
            handle: collection.handle.toUpperCase(),
          }))}
          gridCols={isMobile ?4 : 6}
          selectedItem={selectedShape}
          onItemSelect={handleShapeSelect}
        />

        {/* Price */}
        <div>
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
            onChange={handleFilterChange}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(priceRef)}>Reset</button> */}
        </div>

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
            onChange={handleFilterChange}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(caratRef)}>Reset</button> */}
        </div>

        {/* Color */}
        <div>
          <UniversalRangeFilter
            ref={colorRef}
            label="Color"
            type="categorical"
            options={COLOROPTIONS}
            defaultCategoricalRange={[0, 9]}
            tooltip="Diamond color refers to how white or colorless a diamond appears."
            onChange={handleFilterChange}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(colorRef)}>Reset</button> */}
        </div>

        {/* Cut */}
        <div>
          <UniversalRangeFilter
            ref={cutRef}
            label="Cut"
            type="categorical"
            options={CUTOPTIONS}
            defaultCategoricalRange={[0, 3]}
            tooltip="Cut is the most important factor in a diamond's beauty."
            onChange={handleFilterChange}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(cutRef)}>Reset</button> */}
        </div>

        {/* Clarity */}
        <div>
          <UniversalRangeFilter
            ref={clarityRef}
            label="Clarity"
            type="categorical"
            options={CLARITYOPTIONS}
            defaultCategoricalRange={[0, 9]}
            tooltip="Diamond clarity measures how clean a stone is from internal inclusions."
            onChange={handleFilterChange}
          />
          {/* <button className='mt-4' onClick={() => resetFilter(clarityRef)}>Reset</button> */}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-10">
        <Accordion
          title="Advanced Filters"
          className="text-[24px] playfair font-semibold text-primary mb-4"
          renderIcon={renderChevronIcon}
          maxContentHeight={600}
          titleClasses="text-[24px] original playfair font-semibold text-primary pb-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Depth */}
            <div>
              <UniversalRangeFilter
                ref={depthRef}
                label="Depth %"
                type="numeric"
                numericConfig={{
                  min: 0,
                  max: 100,
                  step: 0.1,
                  decimals: 0,
                  suffix: '%',
                  jump: true,
                }}
                defaultNumericRange={[0, 100]}
                tooltip="Depth percentage refers to how deep a diamond is in relation to its width."
                onChange={handleFilterChange}
              />
              {/* <button className='mt-4' onClick={() => resetFilter(depthRef)}>reset</button> */}
            </div>

            {/* Polish */}
            <div>
              <UniversalRangeFilter
                ref={polishRef}
                label="Polish"
                type="categorical"
                options={POLISHOPTIONS}
                defaultCategoricalRange={[0, 3]}
                tooltip="Polish refers to the smoothness of a diamond's surface."
                onChange={handleFilterChange}
              />
              {/* <button className='mt-4' onClick={() => resetFilter(polishRef)}>Reset</button> */}
            </div>

            {/* LW Ratio */}
            <div>
              <UniversalRangeFilter
                ref={lwRatioRef}
                label="LW Ratio"
                type="numeric"
                numericConfig={{
                  min: 0,
                  max: 2.5,
                  step: 1,
                  decimals: 1,
                  jump: true,
                }}
                defaultNumericRange={[0, 2.5]}
                tooltip="The Length-to-Width Ratio defines the outline of your diamond."
                onChange={handleFilterChange}
              />
              {/* <button className='mt-4' onClick={() => resetFilter(lwRatioRef)}>Reset</button> */}
            </div>

            {/* Fluorescence */}
            <div>
              <UniversalRangeFilter
                ref={fluorescenceRef}
                label="Fluorescence"
                type="categorical"
                options={FLUORESCENCEOPTIONS}
                defaultCategoricalRange={[0, 5]}
                tooltip="Fluorescence refers to a diamond's natural glow under UV light."
                onChange={handleFilterChange}
              />
              {/* <button className='mt-4' onClick={() => resetFilter(fluorescenceRef)}>Reset</button> */}
            </div>

            {/* Table */}
            <div>
              <UniversalRangeFilter
                ref={tableRef}
                label="Table %"
                type="numeric"
                numericConfig={{
                  min: 0,
                  max: 100,
                  step: 0.1,
                  decimals: 0,
                  suffix: '%',
                }}
                defaultNumericRange={[0, 100]}
                tooltip="Table percentage measures the size of a diamond's top facet."
                onChange={handleFilterChange}
              />
              {/* <button className='mt-4' onClick={() => resetFilter(tableRef)}>Reset</button> */}
            </div>

            {/* Symmetry */}
            <div>
              <UniversalRangeFilter
                ref={symmetryRef}
                label="Symmetry"
                type="categorical"
                options={SYMMETRYOPTIONS}
                defaultCategoricalRange={[0, 3]}
                tooltip="Symmetry of the diamond"
                onChange={handleFilterChange}
              />
              {/* <button className='mt-4' onClick={() => resetFilter(symmetryRef)}>Reset</button> */}
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default DiamondFilters;
