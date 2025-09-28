import React from 'react';
import {Link} from '@remix-run/react';
import Accordion from '~/components/ui/Accordion/Accordion';
import arrowDown from '~/assets/images/svg/upchev.svg';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  image?: string;
  gradient?: string;
}

interface FilterAccordionProps {
  title: string;
  options: FilterOption[];
  isShapeOrColor?: boolean;
  gridCols?: number;
}

const  FilterAccordion: React.FC<FilterAccordionProps> = ({
  title,
  options,
  isShapeOrColor = false,
  gridCols = 3,
}) => {
  const renderChevronIcon = (isOpen: boolean) => (
    <div className={`transition-transform ${!isOpen ? 'rotate-180' : ''}`}>
      <img src={arrowDown} alt="Chevron Icon" className='kk' />
    </div>
  );

  return (
    <Accordion
      title={title}
      className="text-primary text-[18px] outfit font-normal mb-4"
      renderIcon={renderChevronIcon}
      maxContentHeight={300}
    >
      <div className="py-2">
        {isShapeOrColor ? (
          <div
            className={`h-[194px] overflow-y-scroll p-2 custom-scroll grid grid-cols-3 sm:grid-cols-${gridCols} gap-[10px]`}
          >
            {options.map((option) => (
              <div key={option.value} className="bg-transparent">
                <Link to={`/collections/${option.value}`}>
                  <div className="thumbimg text-center flex flex-col gap-1">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.label}
                        className="mx-auto"
                      />
                    ) : (
                      <div
                        className="h-[68px] w-[68px] mx-auto rounded-full"
                        style={{background: option.gradient}}
                      />
                    )}
                    <p className="text-[12px] outfit font-light text-primary">
                      {option.label}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex space-y-[13px] flex-col max-w-[238px]">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer justify-between"
              >
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="checkbox-custom" />
                  <span className="text-[14px] outfit font-light">
                    {option.label}
                  </span>
                </div>
                {option.count && (
                  <p className="text-[13px] text-[#6D6D6D] font-light">
                    ({option.count})
                  </p>
                )}
              </label>
            ))}
          </div>
        )}
      </div>
    </Accordion>
  );
};

export default FilterAccordion;
