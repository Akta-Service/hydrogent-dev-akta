import React from 'react';
import Accordion from '~/components/ui/Accordion/Accordion';
import arrowDown from '~/assets/images/svg/down.svg';

const PriceFilterAccordion: React.FC = () => {
  const renderChevronIcon = (isOpen: boolean) => (
    <div className={`transition-transform ${!isOpen ? 'rotate-180' : ''}`}>
      <img src={arrowDown} alt="Chevron Icon" className='mm' />
    </div>
  );

  return (
    <Accordion
      title="Price"
      className="text-primary text-[18px] outfit font-normal mb-4"
      renderIcon={renderChevronIcon}
      maxContentHeight={300}
    >
      <div className="py-2">
        <div className="flex p-0 w-full gap-2">
          <div className="gradient-border w-full">
            <input
              type="number"
              placeholder="Min price"
              className="appearance-none box-border px-[10px] outline-none focus:outline-none bg-black w-full h-[45px] text-[13px] outfit font-light"
            />
          </div>
          <div className="gradient-border w-full">
            <input
              type="number"
              placeholder="Max price"
              className="appearance-none box-border w-full outline-none px-[10px] focus:outline-none bg-black h-[45px] text-[13px] outfit font-light"
            />
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default PriceFilterAccordion;
