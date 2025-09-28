'use client';

import {useState, useEffect} from 'react';
import {useNavigate} from '@remix-run/react';
import {fetchStorefront} from '~/utils/shopifyClient';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface RingCaratDropdownProps {
  currentProduct: Product;
  onProductsChange: (products: Product[]) => void;
  onProductChange: (product: Product) => void;
}

const RELATED_PRODUCTS_QUERY = `
  query RelatedProducts($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      nodes {
        id
        handle
        title
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        selectedOrFirstAvailableVariant {
          price {
            amount
            currencyCode
          }
        }
        tags
        ringCarat: metafield(namespace: "custom", key: "ring_carat") {
          value
        }
        caratSize: metafield(namespace: "custom", key: "carat_size") {
          value
        }
        relatedProduct: metafield(namespace: "custom", key: "related_products") { value }
        carat: metafield(namespace: "custom", key: "carat") { value }
      }
    }
  }
`;

export default function RingCaratDropdown({
  currentProduct,
  onProductsChange,
  onProductChange,
}: any) {
  const [selectedCarat, setSelectedCarat] = useState<string>(currentProduct?.carat?.value || '');
  const [availableCarats, setAvailableCarats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<[]>([]);
  const navigate = useNavigate();

  const currentCarat = currentProduct.ringCarat?.value;
  const relatedProductsTag = currentProduct.relatedProduct?.value;
  const fetchRelatedProducts = async (
    relatedValue: string,
    selectedCaratValue?: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const queryString = `tag:${relatedValue}`;

      const variables = {
        query: queryString,
        first: 250,
      };

      const response = await fetchStorefront(RELATED_PRODUCTS_QUERY, variables,null);
      const products = response.products?.nodes || [];
      setRelatedProducts(products)

      const carats:any = Array.from(
        new Set(
          products
            .map((p: any) => p.carat?.value)
            .filter(Boolean)
        )
      );

      //Sorted in Ascending order
      const sortedArr = carats
      .map(Number)          // convert to numbers
      .sort((a:any, b:any) => a - b) // sort numerically
      .map(String);         // convert back to strings

      setAvailableCarats(sortedArr);
    } catch (err) {
      setError('Failed to fetch related products');
      console.error('Error fetching related products:', err);
      onProductsChange([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCaratChange = (caratValue: string) => {
    if (caratValue === selectedCarat) return;
    setSelectedCarat(caratValue);

    const url = new URL(window.location.href);
    url.searchParams.set('carat', caratValue);
    url.searchParams.set('handle', currentProduct.handle);
    window.history.replaceState({}, '', url.toString());

    if (caratValue) {
      const matchedProduct: any = relatedProducts.find(
          (p: any) => p.carat?.value === caratValue
        );

        if (matchedProduct) {
          // redirect to that product
            navigate(
            `/products/${matchedProduct.handle}?carat=${caratValue}`,
            {replace: true},
            );
          navigate(`/products/${matchedProduct.handle}`);
        } else {
          // fallback: maybe just update selected state
          setError(`No product found with carat ${caratValue}`);
        }
    }
  };

  useEffect(() => {
    fetchRelatedProducts(relatedProductsTag);
  }, [relatedProductsTag]);

  if (availableCarats.length === 0) {
    return null;
  }

  return (
   <div className="ring-carat-dropdown my-4">
    <div className="flex items-center mb-2">
      <span className="text-primary outfit text-[16px] mr-2">Diamond Carat Size:</span>
      <span className="text-secondary outfit text-[16px] font-bold">{selectedCarat} Ct</span>
    </div>
    <div className="flex space-x-2">
      {availableCarats.map((carat) => (
        <button
          key={carat}
          onClick={() => handleCaratChange(carat)}
          className={`md:px-4 md:py-2 p-2 border rounded-sm md:text-[16px] text-[14px] outfit text-primary focus:outline-none ${
            selectedCarat === carat ? 'border-[#09090a]' : 'border-gray-300'
          }`}
        >
          {carat} Ct
        </button>
      ))}
    </div>
    {loading && (
      <p className="text-xs text-gray-400 mt-1">Loading products...</p>
    )}
    {error && <p className="text-xs text-red-400 mt-1">Error: {error}</p>}
  </div>
  );
}
