'use client';

import type React from 'react';
import {useEffect, useState} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import orderIcon from '~/assets/images/svg/freeeship.svg';
import freeIcon from '~/assets/images/svg/free.svg';
import secureIcon from '~/assets/images/svg/secure.svg';
import guaranteeIcon from '~/assets/images/svg/gurantee.svg';
import shopifyIcon from '~/assets/images/svg/cartt.svg';
import { sortMetalColors } from '~/helpers/metalColorSorting';

type Props = {
  product: any;
  selectedRingSize: string | null;
  selectedVariant: any | null;
  handleSelectFrame: (frame: Product, variant: any) => void;
  setSelectedRingSize: (size: string) => void;
  setSelectedVariant: (variant: any) => void;
};

const FrameDetails: React.FC<Props> = ({
  product,
  selectedRingSize,
  selectedVariant,
  handleSelectFrame,
  setSelectedRingSize,
  setSelectedVariant,
}) => {
  const [isSelectedVariant, setIsSelectedVariant] = useState<any>(null);
  useEffect(() => {
    if (!selectedRingSize && product?.options?.length > 0) {
      const ringSizeOption = product.options.find(
        (option: any) => option.name.toLowerCase() === 'size',
      );
      if (ringSizeOption && ringSizeOption.values.length > 0) {
        setSelectedRingSize(ringSizeOption.values[0]);
      }
    }

    if (!selectedVariant && product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [
    product,
    selectedRingSize,
    selectedVariant,
    setSelectedRingSize,
    setSelectedVariant,
  ]);

  useEffect(() => {
    if (selectedVariant) {
      setIsSelectedVariant(null);
    }
  }, [selectedVariant]);

  const handleFrame = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant) {
      setIsSelectedVariant('Please select a variant option');
    } else {
      setIsSelectedVariant(null);
      handleSelectFrame(product, selectedVariant);
    }
  };

  const ringSizeOption = product?.options?.find(
    (option: any) => option.name.toLowerCase() === 'size',
  );

  const metalGradients: Record<string, string> = {
    '14k white': 'bg-white-gold',
    '18k white': 'bg-white-gold',
    '14k yellow': 'bg-yellow-gold',
    '18k yellow': 'bg-yellow-gold',
    '14k rose': 'bg-rose-gold',
    '18k rose': 'bg-rose-gold',
    platinum: 'bg-platinum',
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    const sizeOption = variant.selectedOptions.find(
      (option: any) => option.name.toLowerCase() === 'size',
    );
    if (sizeOption) {
      setSelectedRingSize(sizeOption.value);
    }
  };

  return (
    <div className="text-primary space-y-6 w-full md:w-1/2">
      <h2 className="text-[32px] playfairsb">{product?.title}</h2>
      {/* <span className="text-[#B0B0B0]">Metal:</span>
        <span>{product?.diamondColor || 'N/A'}</span> */}
      <div className="mb-6 outfit font-normal flex flex-wrap ml-0 gap-2 items-center">
        <span className="text-primary">Style:</span>
        <span>{product?.style || 'N/A'}</span>

        {/* <span className="text-primary">Size:</span>
        <span>{selectedRingSize || "Select Size"}</span> */}
      </div>
      <div className="text-[16px] text-primary outfit font-light">Price</div>
      <p className="text-[32px] playfairsb text-primary">
        $
        {selectedVariant?.price?.amount ||
          product?.priceRange?.maxVariantPrice?.amount}
      </p>

      {product?.variants?.length > 0 && (
        <div className="flex flex-col gap-2">
          {selectedVariant?.options?.['Metal Color'] && (
            <div className="outfit text-[15px] text-primary">
              Metal: {selectedVariant.options['Metal Color']}
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            {sortMetalColors(product.variants).map((variant: any) => {
              const gradientClass =
                metalGradients[
                  variant.options?.['Metal Color']?.toLowerCase()
                ] || 'bg-gray-400';
              return (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  className="flex flex-col items-center focus:outline-none p-1"
                >
                  <div
                    className={`w-18 h-6 rounded-sm ring-1  ${
                      selectedVariant?.id === variant.id
                        ? 'ring-[#09090a]'
                        : 'ring-transparent'
                    } ${gradientClass}`}
                  />
                  <span className="text-[14px] text-primary mt-1 outfit">
                    {variant.title.replace(/^\d{2}K\s/i, '$&')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product?.sizeProductOption && (
        <div className="mb-4">
          <label
            htmlFor="ring-size"
            className="text-[16px] text-primary outfit font-light block mb-2"
          >
            Select Ring Size
          </label>
          <select
            id="ring-size"
            value={selectedRingSize || ''}
            onChange={(e) => setSelectedRingSize(e.target.value)}
            className="w-full text-[13px] bg-transparent border border-[#454545] h-[45px] text-primary p-2 rounded outfit"
          >
            <option value="" disabled>
              Select ring size
            </option>
            {(JSON.parse(product?.sizeProductOption || '[]') as string[]).map(
              (size) => (
                <option key={size} value={size} className=" text-primary">
                  {size}
                </option>
              ),
            )}
          </select>
        </div>
      )}
      {ringSizeOption && ringSizeOption.values.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="outfit text-[15px] text-primary">
            Select Ring Size:
          </span>
          {ringSizeOption.values.map((size: string) => (
            <button
              key={size}
              onClick={() => setSelectedRingSize(size)}
              className={`px-4 py-[6px] border text-sm rounded-md outfit ${
                selectedRingSize === size
                  ? 'bg-white text-black border-white'
                  : 'border-[#ccc] text-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
      {isSelectedVariant && (
        <div className="text-red-500 text-center">{isSelectedVariant}</div>
      )}
      <button
        className="w-full h-[45px] mt-[10px] border border-[#D1D1D1] text-primary outfit font-semibold text-[15px]"
        onClick={handleFrame}
        // disabled={!selectedVariant}
      >
        SELECT THIS SETTING
      </button>
      <div className="max-w-full w-full mt-4 mm">
        <ul>
          <li className="flex  items-center text-[16px] outfit font-light text-primary mb-[16px]">
            <span className="w-[35px]">
              <img
                src={orderIcon || '/placeholder.svg'}
                alt=""
                className='w-[25px]'
                aria-hidden="true"
              />
            </span>
            <span>Free Shipping for all orders</span>
          </li>
          <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
            <span className="w-[35px]">
              <img
                src={secureIcon || '/placeholder.svg'}
                alt=""
                className='w-[25px]'
                aria-hidden="true"
              />
            </span>
            <span>Secure payment</span>
          </li>
          <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
            <span className="w-[35px]">
              <img
                src={freeIcon || '/placeholder.svg'}
                alt=""
                className='w-[25px]'
                aria-hidden="true"
              />
            </span>
            <span>Free Signature Gift Box</span>
          </li>
          <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
            <span className="w-[35px]">
              <img
                src={guaranteeIcon || '/placeholder.svg'}
                alt=""
                className='w-[25px]'
                aria-hidden="true"
              />
            </span>
            <span>30 Day Full Money Back Guarantee</span>
          </li>
          <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
            <span className="w-[35px]">
              <img
                src={shopifyIcon || '/placeholder.svg'}
                alt=""
                className='w-[25px]'
                aria-hidden="true"
              />
            </span>
            <span>Shop with confidence: Encrypted shopping by Shopify</span>
          </li>
        </ul>
      </div>
      {/* <h3 className="text-[18px] playfairsb mb-2">Frame Details</h3>
      <div className="mt-4 border border-[#d1d1d1]">
        <div className="grid grid-cols-2 outfit text-primary text-[18px]">
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Metal Type:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.diamondColor || '14K Yellow Gold'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Style:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.title?.split(' ').slice(1).join(' ') || 'Classic'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Ring Size:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {selectedRingSize || 'Not selected'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Setting Type:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.settingType || 'Prong'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Band Width:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.bandWidth || '2.0mm'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Profile:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.profile || 'Comfort Fit'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Finish:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.finish || 'Polished'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Weight:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product?.weight || '3.2g'}
          </p>

          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Warranty:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">Lifetime</p>

          <p className="p-1 font-light text-primary">Customizable:</p>
          <p className="p-1">Yes</p>
        </div>
      </div> */}

      <div
        className="w-full my-6 h-px"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 9.58%, #FFFFFF 50.38%, rgba(255,255,255,0) 91.18%)`,
        }}
      ></div>
    </div>
  );
};

export default FrameDetails;