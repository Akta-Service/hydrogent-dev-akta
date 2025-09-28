'use client';

import {useState} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {NavLink} from '@remix-run/react';

import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import Accordion from '~/components/ui/Accordion/Accordion';
import ArrowIcon from '~/assets/svg/ArrowIcon';
import ProductOptions from '~/components/product/ProductOptions';
import ProductBenefits from '~/components/product/ProductBenefits';
import RingCaratDropdown from '~/components/product/RingCaratDropdown';
import WishlistButton from '../WishlistButton';

// Extend the Product interface to include metafields
interface ProductWithMetafields extends Product {
  size?: {value: string};
  ringCarat?: {value: string};
  handcrafted_curated_prime_time_shipping_in?: {value: string};
  shape?: {value: string};
  carat?: {value: string};
  diamondColor?: {value: string};
  cut?: {value: string};
  clarity?: {value: string};
  depth?: {value: string};
  polish?: {value: string};
  lwRatio?: {value: string};
  fluorescence?: {value: string};
  table?: {value: string};
  symmetry?: {value: string};
  report?: {value: string};
  relatedProduct?: {value: string};
}

interface ProductInfoProps {
  product: ProductWithMetafields;
  selectedVariant: ProductVariant;
  productOptions: any;
  navigate: (path: string) => void;
  currentProduct: ProductWithMetafields;
  onProductsChange: (products: Product[]) => void;
  hasRingCarat: boolean;
  productsByCarat?: Product[];
  skuSearchMatch?: { title: string; imageUrl: string };
}

// Small component for SKU display
const ProductSKU = ({sku}: {sku?: string | null}) => (
  <p className="text-black text-[16px] outfit font-light">
    SKU: {sku || '123456789'}
  </p>
);

// Small component for Product Title
const ProductTitle = ({title}: {title?: string}) => (
  <h2 className="pt-[12px] pb-[10px] text-[24px] text-black playfairsb">
    {title}
  </h2>
);

// Small component for Product Price Section
const ProductPriceSection = ({selectedVariant}: {selectedVariant: ProductVariant}) => (
  <div className="w-full pt-[25px] flex items-center gap-2">
    <span className="text-[18px] outfit font-light text-primary">
      Price:
    </span>
    <span className="text-[20px] md:text-[28px] text-primary playfairsb">
      <ProductPrice
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
      />
    </span>
  </div>
);

// Small component for Product Description
const ProductDescription = ({descriptionHtml}: {descriptionHtml?: string}) => (
  <div
    className="mt-[15px] md:mt-[30px] text-[16px] outfit font-light text-primary"
    dangerouslySetInnerHTML={{__html: descriptionHtml || ''}}
  />
);

// Small component for Ring Size Selector
const RingSizeSelector = ({ringSizes, selectedSize, onSizeChange, productType}: {
  ringSizes: string[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  productType?: string;
}) => {
  if (ringSizes.length === 0) return null;

  return (
    <div className="w-full pt-[25px] mb-5 md:w-1/2">
      <label
        htmlFor="ring-size"
        className="text-[16px] outfit font-light text-black mb-[6px] block"
      >
        {productType === 'Bracelets'
          ? 'Select Bracelet Length'
          : productType === 'Necklaces'
            ? 'Select Necklace Length'
            : 'Select Ring Size'}
      </label>
      <select
        id="ring-size"
        className="text-primary h-[45px] w-full border border-[#454545] rounded-md p-2 text-[13px] outfit font-light focus:outline-none bg-no-repeat bg-[right_15px_center] pr-8"
        value={selectedSize || ''}
        onChange={(e) => onSizeChange(e.target.value)}
      >
        {ringSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

// Small component for Inscription Input
const InscriptionInput = ({inspiration, onInspirationChange}: {
  inspiration: string | null;
  onInspirationChange: (value: string | null) => void;
}) => (
  <div className="w-full pt-[25px] mb-5 md:w-1/2">
    <div className="flex items-center mb-[6px]">
      <label
        htmlFor="ring-inscription"
        className="text-[16px] outfit font-light text-black block"
      >
        Add an Inscription
      </label>
    </div>
    <input
      id="ring-inscription"
      type="text"
      placeholder="Max 15 characters"
      className="text-primary bg-white h-[45px] w-full border border-[#454545] rounded-md p-2 text-[13px] outfit font-light focus:outline-none"
      value={inspiration || ''}
      onChange={(e: any) => {
        const value = e.target.value;
        if (value.length <= 15) {
          onInspirationChange(value || null);
        }
      }}
    />
  </div>
);

// Small component for Shipping Info
const ShippingInfo = ({shippingTime}: {shippingTime?: string}) => {
  if (!shippingTime || shippingTime === '') return null;

  return (
    <div className="product-options mt-4">
      <h5 className="outfit text-center font-light text-primary text-[22px]">
        Ships In :{' '}
        <span className="font-semibold">
          {shippingTime}
        </span>
      </h5>
    </div>
  );
};

// Small component for Product Details Table
const ProductDetailsTable = ({product}: {product: ProductWithMetafields}) => (
  <div className="mt-4 mb-4 border border-[#d1d1d1]">
    <div className="grid grid-cols-2 outfit text-primary text-[18px]">
      {product?.shape?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Shape:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.shape.value}
          </p>
        </>
      )}
      {product?.carat?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Carat:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.carat.value} ct
          </p>
        </>
      )}
      {product?.diamondColor?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Color:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.diamondColor.value}
          </p>
        </>
      )}
      {product?.cut?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Cut:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.cut.value}
          </p>
        </>
      )}
      {product?.clarity?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Clarity:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.clarity.value}
          </p>
        </>
      )}
      {product?.depth?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Depth %:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.depth.value}%
          </p>
        </>
      )}
      {product?.polish?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Polish:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.polish.value}
          </p>
        </>
      )}
      {product?.lwRatio?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            LW Ratio:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.lwRatio.value}
          </p>
        </>
      )}
      {product?.fluorescence?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Fluorescence:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.fluorescence.value}
          </p>
        </>
      )}
      {product?.table?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Table %:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.table.value}%
          </p>
        </>
      )}
      {product?.symmetry?.value && (
        <>
          <p className="p-1 font-light text-primary border-b border-[#d1d1d1]">
            Symmetry:
          </p>
          <p className="p-1 border-b border-[#d1d1d1]">
            {product.symmetry.value}
          </p>
        </>
      )}
      {product?.report?.value && (
        <>
          <p className="p-1 font-light text-primary">Report:</p>
          <p className="p-1">{product.report.value}</p>
        </>
      )}
    </div>
  </div>
);

// Small component for Action Buttons
const ActionButtons = ({currentProduct}: {currentProduct: ProductWithMetafields}) => (
  <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
    <NavLink to={'/appointmentbooking'} className="w-full">
      <button
        className="cursor-pointer h-[50px] w-full rounded-[9px] bg-[#09090A] border-gradient-custom text-[15px] outfit font-semibold uppercase text-white"
        aria-label="Book an appointment"
      >
        BOOK A VIRTUAL APPOINTMENT
      </button>
    </NavLink>
    <WishlistButton
      product={{
        id: currentProduct.id,
        handle: currentProduct.handle,
        title: currentProduct.title,
        featuredImage: currentProduct.images?.edges?.[0]?.node
          ? {
              url: currentProduct.images.edges[0].node.url,
              altText:
                currentProduct.images.edges[0].node.altText ?? undefined,
            }
          : undefined,
        priceRange: currentProduct.priceRange
          ? {
              minVariantPrice: {
                amount: currentProduct.priceRange.minVariantPrice.amount,
                currencyCode:
                  currentProduct.priceRange.minVariantPrice.currencyCode,
              },
            }
          : undefined,
        variants: currentProduct.variants
          ? {
              nodes: currentProduct.variants.nodes.map((variant: any) => ({
                id: variant.id,
                price: {
                  amount: variant.price.amount,
                  currencyCode: variant.price.currencyCode,
                },
              })),
            }
          : undefined,
      }}
      variant="button"
    />
  </div>
);

export default function ProductInfo({
  product,
  selectedVariant,
  productOptions,
  navigate,
  currentProduct,
  onProductsChange,
  hasRingCarat,
  productsByCarat,
  skuSearchMatch,
}: ProductInfoProps) {
  let ringSizes: string[] = [];
  try {
    if (product.size?.value) {
      const parsed = JSON.parse(product.size.value);
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === 'string')
      ) {
        ringSizes = parsed;
      } else {
        console.error('Parsed ring sizes is not an array of strings:', parsed);
      }
    }
  } catch (error) {
    console.error('Error parsing ring sizes:', error);
  }

  let ringCaratOptions: string[] = [];
  try {
    if (product.ringCarat?.value) {
      let parsed;
      if (product.ringCarat?.value.includes('•')) {
        parsed = product?.ringCarat.value.split('•').map((item) => item.trim());
      } else {
        parsed = JSON.parse(product?.ringCarat.value || '');
      }

      if (Array.isArray(parsed)) {
        ringCaratOptions = parsed.map((item) => String(item).trim());
      } else {
        console.error('Parsed ring carat is not an array:', parsed);
      }
    }
  } catch (error) {
    console.error('Error parsing ring carat options:', error);
  }

  const [insipration, setInsipration] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(ringSizes[0] || null);
  const [selectedCarat, setSelectedCarat] = useState(
    ringCaratOptions[0] || null,
  );
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const handleCaratChange = (caratValue: string) => {
    setSelectedCarat(caratValue);
    const url = new URL(window.location.href);
    url.searchParams.set('carat', caratValue);
    window.history.replaceState({}, '', url.toString());
  };

  const renderChevronIcon = (isOpen: boolean) => (
    <div
      className={`bg-transparent transition-transform ${!isOpen ? 'rotate-180' : ''}`}
    >
      <ArrowIcon className="rotate-[270deg] w-[20px]" />
    </div>
  );

  return (
    <>
      <ProductSKU sku={selectedVariant?.sku} />
      <ProductTitle title={product?.title} />
      <ProductPriceSection selectedVariant={selectedVariant} />
      <ProductDescription descriptionHtml={product.descriptionHtml} />
      
      <div className="mt-4">
        <ProductOptions productOptions={productOptions} navigate={navigate} />
      </div>
      
      {currentProduct && currentProduct?.relatedProduct?.value && (
        <RingCaratDropdown
          currentProduct={currentProduct}
          onProductsChange={onProductsChange}
        />
      )}
      
      <div className="flex gap-5">
        <RingSizeSelector 
          ringSizes={ringSizes} 
          selectedSize={selectedSize} 
          onSizeChange={setSelectedSize}
          productType={product.productType}
        />
        {(product.productType === 'Rings' || product.productType === 'Engagement Rings') && (
          <InscriptionInput 
            inspiration={insipration} 
            onInspirationChange={(value) => setInsipration(value)}
          />
        )}
      </div>

      <ShippingInfo shippingTime={product?.handcrafted_curated_prime_time_shipping_in?.value} />
      
      <div className="w-full flex pt-[20px] pb-[25px] mb-[25px] border-bottom-gradient-white">
        <div className="w-full">
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant as any}
            selectedSize={selectedSize}
            insipration={insipration}
          />
        </div>
      </div>

      <ProductBenefits />

      {selectedCarat && relatedProducts.length > 0 && (
        <Accordion
          titleClasses="md:text-[18px] playfair"
          title={`Other ${selectedCarat} Carat Rings`}
          className="text-white productmemo text-[18px] md:text-[24px] w-full outfit font-normal pt-4 mb-4 border-0"
          renderIcon={renderChevronIcon}
          maxContentHeight={400}
        >
          <div className="border-bottom-gradient-white w-full" />
          <div className="py-2 pt-5">
            {loadingRelated ? (
              <div className="text-center py-4">
                <span className="text-[#B0B0B0]">
                  Loading related products...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.slice(0, 4).map((relatedProduct: any) => (
                  <NavLink
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.handle}`}
                    className="cursor-pointer group block"
                  >
                    <div className="aspect-square overflow-hidden rounded-md mb-2">
                      <img
                        src={
                          relatedProduct.images?.edges[0]?.node?.url ||
                          '/placeholder.svg?height=200&width=200'
                        }
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-[14px] text-white outfit font-light truncate">
                      {relatedProduct.title}
                    </h4>
                    <p className="text-[12px] text-[#B0B0B0] outfit font-light">
                      $
                      {
                        relatedProduct.selectedOrFirstAvailableVariant?.price
                          ?.amount
                      }
                    </p>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </Accordion>
      )}
      {/* **************************************************************************** */}
      {/* {
        skuSearchMatch && (
        <div className="mt-3 mb-4">
          <ProductTitle title={skuSearchMatch.title || product?.title} />
          {skuSearchMatch.imageUrl ? (
            <img
              src={skuSearchMatch.imageUrl}
              alt={skuSearchMatch.title || product?.title || 'Product'}
              className="w-full max-w-[100px] rounded-md mb-2"
            />
          ) : null}
        </div>
      )
      } */}
      <h3 className="text-[18px] playfairsb mt-4">Product Details:</h3>
      <ProductDetailsTable product={product} />
      <ActionButtons currentProduct={currentProduct} />
    </>
  );
}