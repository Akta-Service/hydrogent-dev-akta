import React, { useState, useEffect } from 'react';
import Button from '~/components/ui/buttons/Button';
import handImg from '~/assets/images/demo/hand.png';
import RingBuilder from '../ui/RIngBuilder';
import {CollectionsData ,CollectionEdge} from '~/lib/types';


interface EngagementRingSectionProps {
  diamondShapes: CollectionEdge[];
  ringStyles: CollectionEdge[];
}
const EngagementRingSection: React.FC<EngagementRingSectionProps> = ({
  diamondShapes,
  ringStyles,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <div className="w-full bg-primary md:pt-[75px] pt-[35px]">
      <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="custom-border border-[1px] border-solid">
            <img
              src={handImg}
              alt="hand"
              className="hidden md:block shadow-[2px_8px_40px_0px_rgba(255,255,255,0.1)] custom-shadow"
            />
          </div>
          <div>
            <h2 className="pb-[10px] custom-border-bottom border-b border-[2px] border-solid playfair text-black text-[32px] md:text-[43px] md:leading-[50px] lg:text-[64px] lg:leading-[85px] font-normal">
              Design Your Own Engagement Ring
            </h2>
            <p className="mt-[15px] md:mt-[15px] outfit font-semibold md:font-light text-[16px] md:text-[18px] lg:text-[18px] text-[rgba(0,0,0,0.8)] md:max-w-[600px]">
              At Bello Diamonds, every engagement ring begins with a lab-grown diamond of extraordinary brilliance. Ethically created, masterfully cut, and destined to shine forever.</p>
            <p className="mt-[7px] md:mt-[15px] outfit font-semibold md:font-light text-[16px] md:text-[18px] lg:text-[18px] text-[rgba(0,0,0,0.8)] md:max-w-[600px]">
              {`Each ring is hand forged to order with unmatched precision and artistry. More than a ring, it's your forever, crafted the BELLO way.`}
            </p>
            <p className="mt-[7px] md:mt-[15px] outfit font-semibold md:font-light text-[16px] md:text-[18px] lg:text-[18px] text-[rgba(0,0,0,0.8)] md:max-w-[600px]">
              Begin your journey by selecting your diamond.
            </p>
            <p className="mt-[7px] italic md:mt-[15px] md:mb-[15px] mb-[25px] outfit font-semibold md:font-semibold text-[16px] md:text-[18px] lg:text-[18px] text-[rgba(0,0,0,0.8)] md:max-w-[600px]">
              “Forever Begins with Bello”
            </p>
            <img
              src={handImg}
              alt="hand"
              className="block md:hidden mb-[45px] md:mb-[0px] shadow-[2px_8px_40px_0px_rgba(255,255,255,0.1)]"
            />
            <Button onClick={openModal} className="sm:w-[242px] w-full">
             Design Your Ring
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <RingBuilder
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default EngagementRingSection;