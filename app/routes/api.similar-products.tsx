import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen"

// Type for the SimpleProduct fragment
interface SimpleProduct {
  id: string
  title: string
  handle: string
  images: {
    edges: Array<{
      node: {
        __typename: string
        id: string
        url: string
        altText: string | null
        width: number | null
        height: number | null
      }
    }>
  }
  selectedOrFirstAvailableVariant: {
    id: string
    title: string
    price: {
      amount: string
      currencyCode: string
    }
    compareAtPrice?: {
      amount: string
      currencyCode: string
    } | null
  }
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const collectionHandle = url.searchParams.get("collectionHandle")
  const productId = url.searchParams.get("productId")

  if (!collectionHandle || !productId) {
    return json({ products: [] }, { status: 400 })
  }

  const { storefront } = context

  try {
    const { collection } = await storefront.query(SIMILAR_PRODUCTS_QUERY, {
      variables: {
        collectionHandle,
        first: 5, // Fetch 5 to allow filtering out current product
        country: context.storefront.i18n?.country || "US",
        language: context.storefront.i18n?.language || "EN",
      },
    })

    // Filter out the current product and limit to 4 products
    const products = (collection?.products.nodes || [])
      .filter((product: SimpleProduct) => product.id !== productId)
      .slice(0, 4)
      .map((product: SimpleProduct) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        featuredImage: product.images.edges[0]?.node || {
          url: "/placeholder.svg",
          altText: product.title,
          width: 500,
          height: 500,
        },
        priceRange: {
          minVariantPrice: product.selectedOrFirstAvailableVariant.price,
        },
        compareAtPriceRange: product.selectedOrFirstAvailableVariant.compareAtPrice
          ? {
              minVariantPrice: product.selectedOrFirstAvailableVariant.compareAtPrice,
            }
          : undefined,
      }))

    return json({ products })
  } catch (error) {
    console.error("Error fetching similar products:", error)
    return json({ products: [] }, { status: 500 })
  }
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
  }
` as const

const SIMPLE_PRODUCT_FRAGMENT = `#graphql
  fragment SimpleProduct on Product {
    id
    title
    handle
    images(first: 1) {
      edges {
        node {
          __typename
          id
          url
          altText
          width
          height
        }
      }
    }
    selectedOrFirstAvailableVariant {
      ...ProductVariant
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const

const SIMILAR_PRODUCTS_QUERY = `#graphql
  query SimilarProducts(
    $collectionHandle: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $collectionHandle) {
      products(first: $first) {
        nodes {
          ...SimpleProduct
        }
      }
    }
  }
  ${SIMPLE_PRODUCT_FRAGMENT}
` as const