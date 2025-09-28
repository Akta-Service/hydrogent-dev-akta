import type React from 'react';
import {Image} from '@shopify/hydrogen';
import type {Product} from '../ring-Visulizer/types';
import showMoreIcon from "~/assets/images/svg/showmoreicon.svg"


interface ComparableDiamondsProps {
  selectedProduct: any;
  comparableDiamonds: any;
  onClick?: (variant: any) => any;
}

const CLARITY_RANKS: Record<string, number> = {
  FL: 1,
  IF: 2,
  VVS1: 3,
  VVS2: 4,
  VS1: 5,
  VS2: 6,
  SI1: 7,
  SI2: 8,
  I1: 9,
  I2: 10,
  I3: 11,
};
const CUT_RANKS: Record<string, number> = {
  Excellent: 1,
  'Very Good': 2,
  Good: 3,
  Fair: 4,
  Poor: 5,
  Ideal: 1,
  EX: 1, // ✅ added mapping for Shopify shorthand
};

function getClarityRank(clarity: string): number {
  return CLARITY_RANKS[clarity] || Number.POSITIVE_INFINITY;
}

function getCutRank(cut: string): number {
  return CUT_RANKS[cut] || Number.POSITIVE_INFINITY;
}

export const getComparableDiamonds = (
  selectedProduct: any | null,
  allFilteredProducts: any,
): any => {
  if (
    !selectedProduct ||
    !allFilteredProducts ||
    allFilteredProducts.length === 0
  ) {
    return [];
  }

  const baseCarat = Number.parseFloat(selectedProduct.carat || '0');
  const baseShape = selectedProduct.shape;
  const baseColor = selectedProduct.diamondColor;
  const basePrice = Number.parseFloat(
    selectedProduct.priceRange?.maxVariantPrice?.amount || '0',
  );
  const baseClarity = selectedProduct.clarity;
  const baseCut = selectedProduct.cut;

  const caratTolerance = 0.1;

  const candidates = allFilteredProducts.filter((product: any) => {
    if (product.id === selectedProduct.id) return false;

    const productCarat = Number.parseFloat(product.carat || '0');
    const productClarity = product.clarity;
    const productCut = product.cut;

    const isSameShape = product.shape === baseShape;
    const isSimilarCarat =
      Math.abs(productCarat - baseCarat) / baseCarat <= caratTolerance;
    const isSameColor = product.diamondColor === baseColor;

    const hasValidClarity =
      productClarity &&
      Object.prototype.hasOwnProperty.call(CLARITY_RANKS, productClarity);
    const hasValidCut =
      productCut && Object.prototype.hasOwnProperty.call(CUT_RANKS, productCut);

    return (
      isSameShape &&
      isSimilarCarat &&
      isSameColor &&
      hasValidClarity &&
      hasValidCut
    );
  });

  const comparableDiamonds: Product[] = [];
  const selectedIds = new Set<string>();

  candidates.sort(
    (a: any, b: any) =>
      Number.parseFloat(a.priceRange?.maxVariantPrice?.amount || '0') -
      Number.parseFloat(b.priceRange?.maxVariantPrice?.amount || '0'),
  );

  let cheaperOption: Product | null = null;
  for (const candidate of candidates) {
    const candidatePrice = Number.parseFloat(
      candidate.priceRange?.maxVariantPrice?.amount || '0',
    );
    if (candidatePrice < basePrice) {
      cheaperOption = {...candidate, label: 'Slightly Cheaper'};
      break;
    }
  }
  if (cheaperOption) {
    comparableDiamonds.push(cheaperOption);
    selectedIds.add(cheaperOption.id);
  }

  // 2. More affordable
  let secondCheaperOption: Product | null = null;
  for (const candidate of candidates) {
    const candidatePrice = Number.parseFloat(
      candidate.priceRange?.maxVariantPrice?.amount || '0',
    );
    const priceDiff = (basePrice - candidatePrice) / basePrice;
    if (
      candidatePrice < basePrice &&
      priceDiff >= 0.07 &&
      !selectedIds.has(candidate.id)
    ) {
      secondCheaperOption = {...candidate, label: 'More Affordable'};
      break;
    }
  }
  if (secondCheaperOption) {
    comparableDiamonds.push(secondCheaperOption);
    selectedIds.add(secondCheaperOption.id);
  }

  // 3. Lower clarity or cut but similar price (±5%)
  let lowerQualityOption: Product | null = null;
  for (const candidate of candidates) {
    if (selectedIds.has(candidate.id)) continue;

    const candidateClarityRank = getClarityRank(candidate.clarity);
    const candidateCutRank = getCutRank(candidate.cut);
    const baseClarityRank = getClarityRank(baseClarity);
    const baseCutRank = getCutRank(baseCut);

    const isClarityWorse = candidateClarityRank > baseClarityRank;
    const isCutWorse = candidateCutRank > baseCutRank;

    const productPrice = Number.parseFloat(
      candidate.priceRange?.maxVariantPrice?.amount || '0',
    );
    const priceDiff = Math.abs(productPrice - basePrice) / basePrice;
    const isPriceSimilar = priceDiff <= 0.05;

    if ((isClarityWorse || isCutWorse) && isPriceSimilar) {
      lowerQualityOption = {...candidate, label: 'Lower Quality'};
      break;
    }
  }
  if (lowerQualityOption) {
    comparableDiamonds.push(lowerQualityOption);
    selectedIds.add(lowerQualityOption.id);
  }

  for (const candidate of candidates) {
    if (comparableDiamonds.length >= 1) break;
    if (selectedIds.has(candidate.id)) continue;
    comparableDiamonds.push({...candidate, label: 'Comparable'});
    selectedIds.add(candidate.id);
  }

  return comparableDiamonds;
};

const ComparableDiamonds: React.FC<ComparableDiamondsProps> = ({
  selectedProduct,
  comparableDiamonds,
  onClick,
}) => {
  if (!selectedProduct || comparableDiamonds.length === 0) {
    return null;
  }

  const basePrice = Number.parseFloat(
    selectedProduct.priceRange?.maxVariantPrice?.amount || '0',
  );
  const renderInfoRow = (label: string, value: string | undefined) => (
    <p className="flex justify-between text-[14px]">
      <span className="text-primary">{label}</span>
      <span className="text-primary">{value || 'N/A'}</span>
    </p>
  );

  return (
    <div className="w-full bg-transparent md:py-[50px]">
      <div className="container max-w-[792px] mx-auto  md:px-[40px]">
        <h2 className="text-center pb-6 border-b-2 border-white playfair text-primary text-[32px] md:text-[48px] lg:text-[64px] md:leading-normal font-normal">
          Comparable Choices
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:gap-10 md:gap-6 gap-2 text-primary lg:mt-4">
          <div className="relative rounded-md text-center  border border-[#333]  bg-white">
            <div className="absolute top-1 left-2 z-[9999] text-[13px] outfit font-light text-primary mb-2 bg-[#f6f6f6] px-1 rounded">
              {selectedProduct?.vendor || 'Lab Diamond'}
            </div>

            <div className="bg-white md:h-[250px] rounded-md flex items-center justify-center overflow-hidden">
              <Image
                src={selectedProduct.featuredImage?.url || '/Fallback-diamond.webp'}
                alt={selectedProduct.title}
                width={200}
                height={200}
              />
            </div>

            <h3 className="text-[20px] playfairsb mt-4 mb-2">Your Diamond</h3>
            <div className="text-sm px-2 outfit space-y-1 text-left mt-4">
              {renderInfoRow('Price', `$${basePrice.toFixed(2)}`)}
              {renderInfoRow('Difference', '-')}
              {renderInfoRow('Shape', selectedProduct.shape)}
              {renderInfoRow('Carat', `${selectedProduct.carat} ct`)}
              {renderInfoRow('Cut', selectedProduct.cut)}
              {renderInfoRow('Color', selectedProduct?.diamondColor)}
              {renderInfoRow('Clarity', selectedProduct?.clarity)}
            </div>

             <div className="w-full mt-5 h-[1px] bg-[linear-gradient(90deg,rgba(255,255,255,0.01)_-2%,#ffffff_50%,rgba(255,255,255,0.01)_102%)]"></div>
                <button
                  onClick={() => onClick?.(selectedProduct)}
                  className="my-3 flex items-center mx-auto space-x-4 text-[15px] outfit text-primary semibold"
                >
                  <span>SHOW MORE</span>
                  <Image src={showMoreIcon} alt="" width={10} />
                </button>
          </div>

          {/* Comparable Diamonds */}
          {comparableDiamonds.map((item: any) => {
            const itemPrice = Number.parseFloat(
              item.priceRange?.maxVariantPrice?.amount || '0',
            );
            const difference = itemPrice - basePrice;
            const differenceSign = difference > 0 ? '+' : '';
            const differenceText = `${differenceSign}${Math.abs(difference).toFixed(2)}`;

            return (
              <div
                key={item.id}
                className="rounded-md text-center relative border border-[#333]  bg-white"
              >
                <div className="absolute top-1 left-2 z-[9999] text-[13px] outfit font-light text-primary mb-2 bg-[#f6f6f6] px-1 rounded">
                  {item?.vendor || 'Lab Diamond'}
                </div>

                <div className="bg-white h-[250px] rounded-md flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.featuredImage?.url || '/Fallback-diamond.webp'}
                    alt={item.title}
                    width={200}
                    height={200}
                  />
                </div>

                <h3 className="text-[20px] playfairsb mt-4 mb-2">
                  {item?.label || 'Comparable'}
                </h3>

                <div className="text-sm px-2 outfit space-y-1 text-left mt-4">
                  {renderInfoRow('Price', `$${itemPrice.toFixed(2)}`)}
                  {renderInfoRow('Difference', differenceText)}
                  {renderInfoRow('Shape', item.shape)}
                  {renderInfoRow('Carat', `${item.carat} ct`)}
                  {renderInfoRow('Cut', item.cut)}
                  {renderInfoRow('Color', item.diamondColor)}
                  {renderInfoRow('Clarity', item.clarity)}
                </div>

                <div className="w-full mt-5 h-[1px] bg-[linear-gradient(90deg,rgba(255,255,255,0.01)_-2%,#ffffff_50%,rgba(255,255,255,0.01)_102%)]"></div>
                <button
                  onClick={() => onClick?.(item)}
                  className="my-3 flex items-center mx-auto space-x-4 text-[15px] outfit text-primary semibold"
                >
                  <span>SHOW MORE</span>
                  <Image src={showMoreIcon} alt="" width={10} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparableDiamonds;
