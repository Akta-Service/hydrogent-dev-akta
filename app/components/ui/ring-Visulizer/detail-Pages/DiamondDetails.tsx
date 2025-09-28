/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/alt-text */
import React, {useState} from 'react';
import {CartForm, Image} from '@shopify/hydrogen';
import orderIcon from '~/assets/images/svg/freeship.svg';
import freeIcon from '~/assets/images/svg/free.svg';
import secureIcon from '~/assets/images/svg/secure.svg';
import guaranteeIcon from '~/assets/images/svg/gurantee.svg';
import shopifyIcon from '~/assets/images/svg/cartt.svg';

type Props = {
  product: any;
  selectedFrame: any;
  handleSelectDiamond: (product: any, isPendants?: boolean) => void;
  openCartDrawer: () => void;
};

const DiamondDetails: React.FC<Props> = ({
  product,
  selectedFrame,
  openCartDrawer,
  handleSelectDiamond,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const parseSafe = (value: string | undefined): string => {
    try {
      const parsed = value ? JSON.parse(value) : 'N/A';
      return typeof parsed === 'string' ? parsed : String(parsed);
    } catch {
      return value || 'N/A';
    }
  };

  return (
    <div className="flex-1 py-6 text-primary">
      <h2 className="text-[32px] playfairsb mb-4">
        {product.title || 'Diamond Title'}
      </h2>

      <p className="mb-6 outfit font-normal flex items-center flex-wrap gap-2">
        <span className="text-[#09090a]">Color:</span>{' '}
        {product.diamondColor || 'N/A'}
        <span className="text-[#09090a]">Clarity:</span>{' '}
        {parseSafe(product.clarity)}
        <span className="text-[#09090a]">Cut:</span> {parseSafe(product.cut)}
        <span className="text-[#09090a]">Certificate:</span>{' '}
        {parseSafe(product.report)}
      </p>

      <label className="text-[16px] text-primary outfit font-light">
        Price
      </label>
      <p className="text-[32px] playfairsb text-primary mb-4">
        ${product?.priceRange?.maxVariantPrice?.amount || 'N/A'}
      </p>

      {selectedFrame ? (
        <button
          className="w-full h-[45px] mt-[10px] border border-[#d1d1d1] text-primary outfit font-semibold text-[15px]"
          onClick={() => handleSelectDiamond(product)}
        >
          SELECT THIS DIAMOND
        </button>
      ) : (
        <>
          <button
            className="w-full h-[45px] mt-[10px] border border-[#d1d1d1] text-primary outfit font-semibold text-[15px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            SELECT THIS DIAMOND
          </button>
          {isOpen && (
            <div className="rounded-b-md  text-[15px] font-semibold outfit text-primary  border border-[#4b4e56] shadow-[inset_0_1px_8px_rgba(255,255,255,0.1)]">
              {/* Add to Ring Button */}
              <button
                className="w-full py-3 rounded-md   shadow-[inset_0_1px_6px_rgba(255,255,255,0.06)] transition"
                onClick={() => handleSelectDiamond(product)}
              >
                PLEASE ADD TO RING
              </button>

              {/* Add to Pendant Button */}
              <button
                // disabled
                className="w-full cursor-not-allowed py-3 rounded-md shadow-[inset_0_1px_6px_rgba(255,255,255,0.06)] transition"
                onClick={() => {
                  handleSelectDiamond(product, true);
                }}
              >
                PLEASE ADD TO PENDANT
              </button>

              {/* Add to Cart Form */}
              <CartForm
                route="/cart"
                inputs={{
                  lines: [
                    {
                      merchandiseId: product.variants[0].id,
                      quantity: 1,
                    },
                  ],
                }}
                action={CartForm.ACTIONS.LinesAdd}
              >
                {(fetcher) => (
                  <button
                    onClick={openCartDrawer}
                    type="submit"
                    className="w-full py-3 rounded-md hover:from-[#3a3d44] hover:to-[#222429] shadow-[inset_0_1px_6px_rgba(255,255,255,0.06)] transition uppercase"
                    disabled={fetcher.state !== 'idle'}
                  >
                    Please Add to Cart
                  </button>
                )}
              </CartForm>
            </div>
          )}
        </>
      )}

      <div className="w-full my-6 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

      <ul className="text-primary outfit text-[16px] space-y-2">
        <li className="flex items-center gap-2">
          <img src={orderIcon} className="w-[25px]" />
          Free Shipping for all orders
        </li>
        <li className="flex items-center gap-2">
          <img src={secureIcon} className="w-[25px]" />
          Secure payment
        </li>
        <li className="flex items-center gap-2">
          <img src={freeIcon} className="w-[25px]" />
          Free Signature Gift Box
        </li>
        <li className="flex items-center gap-2">
          <img src={guaranteeIcon} className="w-[25px]" />
          30 Day Full Money Back Guarantee
        </li>
        <li className="flex items-center gap-2">
          <img src={shopifyIcon} className="w-[25px]" />
          Shop with confidence: Encrypted shopping by Shopify
        </li>
      </ul>

      <h3 className="text-[18px] playfairsb mt-4">Product Details:</h3>
      <div className=" mt-4 border border-[#d1d1d1]">
        <div className="grid grid-cols-2 outfit text-primary text-[18px]">
          {product.shape && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Shape:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">{product.shape}</p>
            </>
          )}

          {product.carat && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Carat:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {parseSafe(product.carat)} ct
              </p>
            </>
          )}

          {product.diamondColor && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Color:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {product.diamondColor}
              </p>
            </>
          )}

          {product.cut && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Cut:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {parseSafe(product.cut)}
              </p>
            </>
          )}

          {product.clarity && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Clarity:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {parseSafe(product.clarity)}
              </p>
            </>
          )}

          {product.depth && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Depth %:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">{product.depth}%</p>
            </>
          )}

          {product.polish && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Polish:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {parseSafe(product.polish)}
              </p>
            </>
          )}

          {product.lwRatio && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                LW Ratio:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">{product.lwRatio}</p>
            </>
          )}

          {product.fluorescence && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Fluorescence:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {product.fluorescence}
              </p>
            </>
          )}

          {product.table && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Table %:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">{product.table}%</p>
            </>
          )}

          {product.symmetry && (
            <>
              <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
                Symmetry:
              </p>
              <p className="p-1 border-b border-[#d1d1d1]">
                {parseSafe(product.symmetry)}
              </p>
            </>
          )}

          {product.report && (
            <>
              <p className="p-1 font-light text-primary">Report:</p>
              <p>{parseSafe(product.report)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiamondDetails;
