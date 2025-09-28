const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantType on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    ringBandColorImage: metafield(namespace: "custom", key: "ring_band_color") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    diamondShapeImage: metafield(namespace: "custom", key: "diamond_shape") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    handImageForRingBuilder: metafield(namespace: "custom", key: "hand_image_for_ring_builder") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

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
      ...ProductVariantType
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    tags 
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariantType
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariantType
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariantType
    }
    images(first: 10) {
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
    seo {
      description
      title
    }
    variants(first: 1) {
      nodes {
        ...ProductVariantType
      }
    }
    collections(first: 1) {
      nodes {
        handle
      }
    }
    size: metafield(namespace: "custom", key: "size") {
      value
    }
    ringCarat: metafield(namespace: "custom", key: "ring_carat") {
      value
    }
    relatedProduct: metafield(namespace: "custom", key: "related_products") {
      value
    }
    carat: metafield(namespace: "custom", key: "carat") {
      value
    }
    handcrafted_curated_prime_time_shipping_in: metafield(namespace: "custom", key: "handcrafted_curated_prime_time_shipping_in") {
      value
    }
      caratMetafield: metafield(namespace: "custom", key: "carat") { value }
          shape: metafield(namespace: "custom", key: "shape") { value }
          er_sku: metafield(namespace: "custom", key: "er_sku") { value }
          diamond_video_url: metafield(namespace: "custom", key: "360_video_url") { value }
          diamondColor: metafield(namespace: "custom", key: "diamond_color") { value }
          cut: metafield(namespace: "custom", key: "cut") { value }
          clarity: metafield(namespace: "custom", key: "clarity") { value }
          depth: metafield(namespace: "custom", key: "depth") { value }
          polish: metafield(namespace: "custom", key: "polish") { value }
          lwRatio: metafield(namespace: "custom", key: "lw_ratio") { value }
          fluorescence: metafield(namespace: "custom", key: "fluorescence") { value }
          report: metafield(namespace: "custom", key: "report") { value }
          table: metafield(namespace: "custom", key: "table") { value }
          symmetry: metafield(namespace: "custom", key: "symmetry") { value }
          showOnCollection: metafield(namespace: "custom", key: "show_on_collection") { value }
          sizeProductOption: metafield(namespace: "custom", key: "size") { value }
          certification: metafield(namespace: "custom", key: "certification") { value }
          style: metafield(namespace: "custom", key: "style") { value }
          sliderEnable: metafield(namespace: "custom", key: "slider_enable") { value }
          pinned: metafield(namespace: "custom", key: "pinned") { value }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const SIMILAR_PRODUCTS_QUERY = `#graphql
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
` as const;

export const PRODUCTS_BY_CARAT_QUERY = `#graphql
  query ProductsByCarat(
    $caratValue: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      query: $caratValue
    ) {
      nodes {
        id
        title
        handle
        images(first: 1) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        selectedOrFirstAvailableVariant {
          ...ProductVariantType
        }
        ringCarat: metafield(namespace: "custom", key: "ring_carat") {
          value
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
