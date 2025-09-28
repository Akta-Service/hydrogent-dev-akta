'use client';

import type React from 'react';

interface ShopBySectionProps {
  title: string;
  items: Array<{
    label: string;
    image?: string;
    handle?: string;
    className?: string;
  }>;
  gridCols: number;
  linkPrefix?: string;
  selectedItem: string | null;
  onItemSelect: (value: string) => void;
}

export const ShopBySection: React.FC<ShopBySectionProps> = ({
  title,
  items,
  gridCols = 4,
  selectedItem,
  onItemSelect,
}) => {
  const gramIdClassMap: {[key: number]: string} = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  const gridClass = gramIdClassMap[gridCols] || 'grid-cols-5';
  //  borderImageSource:
  //           "linear-gradient(322.35deg, rgba(255, 255, 255, 0) 4.11%, rgba(255, 255, 255, 0.5) 46.05%, rgba(255, 255, 255, 0) 87.99%)",
  return (
    <div
      className="w-full">
      <p className="text-[18px] outfit font-regular text-primary mb-3 bv">{title}</p>
      <div className={`mt-[1px] grid ${gridClass} gap-2`}>
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onItemSelect(item.handle || item.label)}
            className={`cursor-pointer justify-start text-center flex pt-2 pb-[5px] px-2 items-center flex-col ${
              selectedItem === (item.handle || item.label) ? 'outline-box' : ''
            }`}
            aria-label={`Select ${item.label}`}
          >
            {/* <div className='min-h-[36px]'> */}
            <div className='min-h-[40px]'>
            <img src={item.image || "/placeholder.svg"} alt={item.label} className={item.className || ""} />
            </div>
            {/* </div> */}
            <p className="text-[13px] leading-[15px] outfit font-light text-primary">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
