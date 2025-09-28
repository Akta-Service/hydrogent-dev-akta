import { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { Link, useNavigate } from '@remix-run/react';
import { MappedProductOptions } from '@shopify/hydrogen';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from 'react';

// Define a custom type for ProductVariant that matches the GraphQL fragment
interface CustomProductVariant {
  title: string;
  id: string;
  availableForSale: boolean;
  sku?: string | null;
  compareAtPrice?: Maybe<{
    currencyCode: string;
    amount: string;
  }> | undefined;
  image?: Maybe<{
    __typename?: 'Image' | undefined; 
    url: string;
    id: string;
    altText?: string | null;
    height?: number | null;
    width?: number | null;
  }> | undefined;
  price: {
    currencyCode: string;
    amount: string;
  };
  product: {
    title: string;
    handle: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  unitPrice?: Maybe<{
    currencyCode: string;
    amount: string;
  }> | undefined;
  metafields?: Array<{
    key: string;
    value: string;
    namespace: string;
  }> | null;
}

interface ProductFormProps {
  productOptions: MappedProductOptions[];
  selectedVariant?: Maybe<CustomProductVariant>;
  selectedSize?: string | null; 
  selectedColor?: string;
  selectedShape?: string;
  insipration?: string | null;
}

export function ProductForm({
  productOptions,
  selectedVariant,
  selectedSize,
  insipration
}: ProductFormProps) {
  const navigate = useNavigate();
  const { open } = useAside();

  // Create custom attributes for the cart
  const customAttributes: { key: string; value: string }[] = [];
  
  if (selectedSize) {
    customAttributes.push({ key: 'Ring Size', value: selectedSize });
  }
  if (insipration) {
    customAttributes.push({ key: 'Add an Inscription', value: insipration });
  }
  
  // if (selectedColor) {
  //   customAttributes.push({ key: 'Ring Color', value: selectedColor });
  // }
  
  // if (selectedShape) {
  //   customAttributes.push({ key: 'Diamond Shape', value: selectedShape });
  // }

  return (
    <div className="product-form">
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  attributes: customAttributes,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Buy' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image || "/placeholder.svg"} alt={name} />}
    </div>
  );
}