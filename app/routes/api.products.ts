// app/routes/api/products.ts
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {shopify} from '~/shopify.server';

interface Product {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    id: string;
    altText: string | null;
    url: string;
    width: number;
    height: number;
  };
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
    maxVariantPrice: {amount: string; currencyCode: string};
  };
}

const GET_PRODUCTS_BY_IDS = `
  query GetProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        handle
        title
        featuredImage {
          id
          altText
          url
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCTS_BY_COLLECTION = `
  query GetProductsByCollection($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              id
              altText
              url
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const handles = url.searchParams.get('collections')?.split(',').filter(Boolean) || [];
  const ids = url.searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const match = url.searchParams.get('match') || null;

  // Handle single product ID query
  if (ids.length === 1) {
    try {
      const {storefront} = shopify(request);
      
      const response = await storefront.query(GET_PRODUCTS_BY_IDS, {
        variables: {ids: ids},
      });
      
      const products = response.nodes?.filter((node: any) => node && node.__typename === 'Product') || [];
      
      if (products.length === 0) {
        return json({error: 'Product not found'}, {status: 404});
      }
      
      const product = products[0];
      return json({
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage ? {
          id: product.featuredImage.id,
          altText: product.featuredImage.altText,
          url: product.featuredImage.url,
          width: product.featuredImage.width,
          height: product.featuredImage.height,
        } : null,
        priceRange: product.priceRange,
        variants: product.variants?.nodes || [],
      }, {status: 200});
      
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return json({error: 'Failed to fetch product'}, {status: 500});
    }
  }

  // Handle multiple product IDs query
  if (ids.length > 1) {
    try {
      const {storefront} = shopify(request);
      
      const response = await storefront.query(GET_PRODUCTS_BY_IDS, {
        variables: {ids: ids},
      });
      
      const products = response.nodes?.filter((node: any) => node && node.__typename === 'Product') || [];
      
      const formattedProducts = products.map((product: any) => ({
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage ? {
          id: product.featuredImage.id,
          altText: product.featuredImage.altText,
          url: product.featuredImage.url,
          width: product.featuredImage.width,
          height: product.featuredImage.height,
        } : null,
        priceRange: product.priceRange,
        variants: product.variants?.nodes || [],
      }));
      
      return json({products: formattedProducts}, {status: 200});
      
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      return json({error: 'Failed to fetch products'}, {status: 500});
    }
  }

  // Original collection-based logic
  if (handles.length === 0) {
    return json(
      {
        error:
          'No collection handles or product IDs provided. Use ?collections=handle1,handle2 or ?ids=id1,id2',
      },
      {status: 400},
    );
  }

  if (match === 'both' && handles.length < 2) {
    return json(
      {error: 'At least two collections are required when match=both'},
      {status: 400},
    );
  }

  try {
    const {storefront} = shopify(request);

    const fetchProducts = async (handle: string): Promise<Product[]> => {
      const response = await storefront.query(GET_PRODUCTS_BY_COLLECTION, {
        variables: {handle, first: 120},
      });

      const collection = response.collectionByHandle;
      if (!collection) {
        console.warn(`Collection with handle "${handle}" not found.`);
        return [];
      }

      return collection.products.edges.map(({node}: {node: Product}) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        featuredImage: {
          id: node.featuredImage?.id || '',
          altText: node.featuredImage?.altText || null,
          url: node.featuredImage?.url || '',
          width: node.featuredImage?.width || 0,
          height: node.featuredImage?.height || 0,
        },
        priceRange: {
          minVariantPrice: {
            amount: node.priceRange.minVariantPrice.amount,
            currencyCode: node.priceRange.minVariantPrice.currencyCode,
          },
          maxVariantPrice: {
            amount: node.priceRange.maxVariantPrice.amount,
            currencyCode: node.priceRange.maxVariantPrice.currencyCode,
          },
        },
      }));
    };

    let products: Product[] = [];

    if (match === 'both' && handles.length > 1) {
      const productArrays = await Promise.all(handles.map(fetchProducts));
      const sets = productArrays.map((list) => new Set(list.map((p) => p.id)));
      const commonIds = [...sets[0]].filter((id) =>
        sets.every((set) => set.has(id)),
      );
      products = productArrays
        .flat()
        .filter((product) => commonIds.includes(product.id));
    } else {
      const productArrays = await Promise.all(handles.map(fetchProducts));
      products = productArrays.flat();
    }

    const uniqueProducts = Array.from(
      new Map(products.map((p) => [p.id, p])).values(),
    );
    return json({products: uniqueProducts}, {status: 200});
  } catch (error) {
    console.error('Error fetching products:', error);
    return json({error: 'Failed to fetch products'}, {status: 500});
  }
}
