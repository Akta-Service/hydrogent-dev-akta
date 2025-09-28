import React from 'react';
import CartItem from '../CartItems';
import {CartForm, Image} from '@shopify/hydrogen';
import PreviewTabs from '../PreviewTabs';
import orderIcon from '~/assets/images/svg/freeeship.svg';
import freeIcon from '~/assets/images/svg/free.svg';
import secureIcon from '~/assets/images/svg/secure.svg';
import guaranteeIcon from '~/assets/images/svg/gurantee.svg';
import shopifyIcon from '~/assets/images/svg/ssecure.svg';
import { sortMetalColors } from '~/helpers/metalColorSorting';

interface FinalPreviewProps {
  previewActiveTab: 'preview' | 'video' | 'images';
  setPreviewActiveTab: (tab: 'preview' | 'video' | 'images') => void;
  ringVisualizerForSku: any[];
  hasCSVMedia: boolean;
  videosForSku: any[];
  imagesForSku: any[];
  fallbackImages: any[];
  selectedDiamond: any;
  selectedFrame: any;
  selectedRingSize: string | null;
  selectedFrameVariant: any;
  setSelectedRingSize: (size: string) => void;
  setSelectedFrameVariant: (variant: any) => void;
  openSection: string | null;
  toggleInfo: (section: string) => void;
  toggleSection: (section: string) => void;
  getCurrentStep: () => number;
  openCartDrawer: () => void;
}

const FinalPreview: React.FC<FinalPreviewProps> = ({
  previewActiveTab,
  setPreviewActiveTab,
  ringVisualizerForSku,
  hasCSVMedia,
  videosForSku,
  imagesForSku,
  fallbackImages,
  selectedDiamond,
  selectedFrame,
  selectedRingSize,
  setSelectedRingSize,
  setSelectedFrameVariant,
  selectedFrameVariant,
  openSection,
  toggleInfo,
  toggleSection,
  getCurrentStep,
  openCartDrawer,
}) => {
  const total =
    Number(selectedFrameVariant?.price?.amount) ||
    Number(selectedFrame?.priceRange?.maxVariantPrice?.amount) ||
    0;

  const diamondPrice =
    Number(selectedDiamond?.priceRange?.maxVariantPrice?.amount) || 0;

  const totalPrice = Number((total + diamondPrice).toFixed(2));

  const handleVariantSelect = (variant: any) => {
    setSelectedFrameVariant(variant);
    const sizeOption = variant.selectedOptions.find(
      (option: any) => option.name.toLowerCase() === 'size',
    );
    if (sizeOption) {
      setSelectedRingSize(sizeOption.value); 
    }
  };

  const metalGradients: Record<string, string> = {
    '14k white': 'bg-white-gold',
    '18k white': 'bg-white-gold',
    '14k yellow': 'bg-yellow-gold',
    '18k yellow': 'bg-yellow-gold',
    '14k rose': 'bg-rose-gold',
    '18k rose': 'bg-rose-gold',
    platinum: 'bg-platinum',
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-10">
      {getCurrentStep() === 3 && (selectedFrame || selectedDiamond) && (
        <PreviewTabs
          previewActiveTab={previewActiveTab}
          setPreviewActiveTab={setPreviewActiveTab}
          ringVisualizerForSku={ringVisualizerForSku}
          hasCSVMedia={hasCSVMedia}
          videosForSku={videosForSku}
          imagesForSku={imagesForSku}
          fallbackImages={fallbackImages}
        />
      )}

      <div className="flex-1 md:p-6 text-primary">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[24px] md:text-[32px] playfairsb text-primary">
            {selectedFrame?.title || 'Frame'} with{' '}
            {selectedDiamond?.title || 'Diamond'}
          </h2>
        </div>

        {/* {selectedDiamond && (
          <p className="mb-6 outfit font-normal flex items-center flex-wrap">
            <span className="text-[#B0B0B0] pr-2">Diamond:</span> {selectedDiamond?.diamondColor || 'N/A'}
            <span className="mx-2">•</span>
            <span className="text-[#B0B0B0] pr-2">Clarity:</span>{' '}
            {JSON?.parse(selectedDiamond?.clarity || '""') || 'N/A'}
            <span className="mx-2">•</span>
            <span className="text-[#B0B0B0] pr-2">Cut:</span>{' '}
            {JSON?.parse(selectedDiamond?.cut || '""') || 'N/A'}
            <span className="mx-2">•</span>
            <span className="text-[#B0B0B0] pr-2">Stock No:</span> {selectedDiamond?.variants?.[0]?.sku || 'N/A'}
          </p>
        )}

        {selectedFrame && (
          <p className="mb-6 outfit font-normal flex items-center flex-wrap">
            <span className="text-[#B0B0B0] pr-2">Frame:</span> {selectedFrame?.title || 'N/A'}
            <span className="mx-2">•</span>
            <span className="text-[#B0B0B0] pr-2">Metal:</span> {selectedFrame?.diamondColor || 'N/A'}
          </p>
        )} */}

        <div className="text-[24px] md:text-[32px] playfairsb text-primary mb-4">
          <p className="mt-5 text-[16px] text-primary outfit font-light">
            Total:
          </p>
          ${totalPrice}
          
        </div>

        {selectedFrame?.variants?.length > 0 && (
          <div>
            <span className="outfit text-[15px] text-primary">
              Select Variant:
            </span>
            <div className="flex items-center gap-3 flex-wrap mt-4 mb-4">
              {sortMetalColors(selectedFrame.variants).map((variant: any) => {
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
                      className={`w-18 h-6 rounded-sm ring-2 ${
                        selectedFrameVariant?.id === variant.id
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

         {/* {selectedFrame?.sizeProductOption && (
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
              {(
                JSON.parse(selectedFrame?.sizeProductOption || '[]') as string[]
              ).map((size) => (
                <option key={size} value={size} className=" text-primary">
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}  */}

        <div>
          {selectedFrame && (
            <CartItem
              type="frame"
              name={selectedFrame.title || selectedFrameVariant?.title || selectedFrame.title}
              imageData={
                selectedFrameVariant?.image?.url ||
                selectedFrame.featuredImage?.url
              }
              material={selectedFrame.diamondColor}
              price={selectedFrame.priceRange?.maxVariantPrice?.amount}
              details={{
                "Ring Size":selectedRingSize||'N/A'
              }}
            />
          )}
          {selectedDiamond && (
            <CartItem
              type="diamond"
              name={selectedDiamond.title}
              imageData={selectedDiamond.featuredImage?.url}
              material=""
              price={selectedDiamond.priceRange?.maxVariantPrice?.amount}
              details={{
                Color: selectedDiamond.diamondColor || 'N/A',
                Clarity: selectedDiamond.clarity || 'N/A',
                Cut: selectedDiamond.cut || 'N/A',
                'Stock No': selectedDiamond.sku || 'N/A',
              }}
            />
          )}
        </div>

        {selectedFrameVariant?.id && selectedDiamond?.variants?.[0]?.id ? (
          <CartForm
            route="/cart"
            inputs={{
              lines: [
                {
                  merchandiseId: selectedFrameVariant.id,
                  quantity: 1,
                  attributes: [
                    {key: 'RingSize', value: selectedRingSize || 'N/A'},
                    {
                      key: 'DiamondTitle',
                      value: selectedDiamond.title || 'N/A',
                    },
                    {
                      key: 'DiamondCarat',
                      value: selectedDiamond?.caratMetafield?.value || 'N/A',
                    },
                  ],
                },
                {
                  merchandiseId: selectedDiamond.variants[0].id,
                  quantity: 1,
                  attributes: [
                    {key: 'frame title', value: selectedFrame.title || 'N/A'},
                  ],
                },
              ],
            }}
            action={CartForm.ACTIONS.LinesAdd}
          >
            {(fetcher) => (
              <button
                onClick={openCartDrawer}
                type="submit"
                className="cursor-pointer mt-7 h-[50px] w-full rounded-tr-[9px] rounded-bl-[9px] border border-[#D1D1D1] text-[15px] outfit font-semibold uppercase text-primary"
                disabled={fetcher.state !== 'idle'}
              >
                Add to Cart
              </button>
            )}
          </CartForm>
        ) : (
          <p className="text-red-500 text-lg font-semibold mb-6">
            Please select a Metal Color for your Ring.
          </p>
        )}

        <div className="w-full my-6 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

        <ul className="mt-6">
          {[orderIcon, secureIcon, freeIcon, guaranteeIcon, shopifyIcon].map(
            (icon, idx) => (
              <li
                key={icon}
                className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]"
              >
                <span className="w-[25px]">
                  <img src={icon || '/placeholder.svg'} alt="" />
                </span>
                <span className="pl-2">
                  {
                    [
                      'Free Shipping for all orders',
                      'Secure payments',
                      'Free Signature Gift Box',
                      '30 Day Full Money Back Guarantee',
                      'Shop with confidence: Encrypted shopping by Shopify',
                    ][idx]
                  }
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};

export default FinalPreview;