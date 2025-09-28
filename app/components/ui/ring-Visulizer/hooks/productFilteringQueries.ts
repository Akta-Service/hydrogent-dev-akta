/**
 * GraphQL queries for product filtering functionality
 * Extracted from useProductFiltering hook for better organization
 */

export const GET_PRODUCTS_BY_TAG = `
  query GetProductsByTag($query: String, $first: Int, $after: String) {
    products(first: $first, query: $query, after: $after) {
      edges {
        cursor
        node {
          id
          handle
          title
          featuredImage {
            id
            url
            altText
            width
            height
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          videoUrlMetafield: metafield(namespace: "custom", key: "360_video_url") { value }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          caratMetafield: metafield(namespace: "custom", key: "carat") { value }
          shapeMetafield: metafield(namespace: "custom", key: "shape") { value }
          diamondColorMetafield: metafield(namespace: "custom", key: "diamond_color") { value }
          cutMetafield: metafield(namespace: "custom", key: "cut") { value }
          clarityMetafield: metafield(namespace: "custom", key: "clarity") { value }
          depthMetafield: metafield(namespace: "custom", key: "depth") { value }
          polishMetafield: metafield(namespace: "custom", key: "polish") { value }
          lwRatioMetafield: metafield(namespace: "custom", key: "lw_ratio") { value }
          fluorescenceMetafield: metafield(namespace: "custom", key: "fluorescence") { value }
          reportMetafield: metafield(namespace: "custom", key: "report") { value }
          tableMetafield: metafield(namespace: "custom", key: "table") { value }
          symmetryMetafield: metafield(namespace: "custom", key: "symmetry") { value }
          showOnCollectionMetafield: metafield(namespace: "custom", key: "show_on_collection") { value }
          sizeProductOptionMetafield: metafield(namespace: "custom", key: "size") { value }
          certificationMetafield: metafield(namespace: "custom", key: "certification") { value }
          styleMetafield: metafield(namespace: "custom", key: "style") { value }
          sliderEnableMetafield: metafield(namespace: "custom", key: "slider_enable") { value }
          pinnedMetafield: metafield(namespace: "custom", key: "pinned") { value }
          description
          productType
          vendor
          tags
          createdAt
          updatedAt
          publishedAt
          onlineStoreUrl
          options {
            name
            optionValues {
              name
              firstSelectableVariant {
                id
                title
                sku
                price { amount currencyCode }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
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
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                price { amount currencyCode }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COLLECTION = `
  query GetProducts($handle: String!, $filters: [ProductFilter!], $first: Int, $after: String) {
    collection(handle: $handle) {
      products(first: $first, filters: $filters, after: $after) {
        edges {
          cursor
          node {
            id
            handle
            title
            featuredImage {
              id
              url
              altText
              width
              height
            }
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            videoUrlMetafield: metafield(namespace: "custom", key: "360_video_url") { value }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            caratMetafield: metafield(namespace: "custom", key: "carat") { value }
            shapeMetafield: metafield(namespace: "custom", key: "shape") { value }
            diamondColorMetafield: metafield(namespace: "custom", key: "diamond_color") { value }
            cutMetafield: metafield(namespace: "custom", key: "cut") { value }
            clarityMetafield: metafield(namespace: "custom", key: "clarity") { value }
            depthMetafield: metafield(namespace: "custom", key: "depth") { value }
            polishMetafield: metafield(namespace: "custom", key: "polish") { value }
            lwRatioMetafield: metafield(namespace: "custom", key: "lw_ratio") { value }
            fluorescenceMetafield: metafield(namespace: "custom", key: "fluorescence") { value }
            reportMetafield: metafield(namespace: "custom", key: "report") { value }
            tableMetafield: metafield(namespace: "custom", key: "table") { value }
            symmetryMetafield: metafield(namespace: "custom", key: "symmetry") { value }
            showOnCollectionMetafield: metafield(namespace: "custom", key: "show_on_collection") { value }
            sizeProductOptionMetafield: metafield(namespace: "custom", key: "size") { value }
            certificationMetafield: metafield(namespace: "custom", key: "certification") { value }
            styleMetafield: metafield(namespace: "custom", key: "style") { value }
            sliderEnableMetafield: metafield(namespace: "custom", key: "slider_enable") { value }
            pinnedMetafield: metafield(namespace: "custom", key: "pinned") { value }
            description
            productType
            vendor
            tags
            createdAt
            updatedAt
            publishedAt
            onlineStoreUrl
            options {
              name
              optionValues {
                name
                firstSelectableVariant {
                  id
                  title
                  sku
                  price { amount currencyCode }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
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
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  sku
                  price { amount currencyCode }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/**
 * Fragment for common product fields used in both queries
 * This can be used to reduce duplication in the future
 */
export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    videoUrlMetafield: metafield(namespace: "custom", key: "360_video_url") { value }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    caratMetafield: metafield(namespace: "custom", key: "carat") { value }
    shapeMetafield: metafield(namespace: "custom", key: "shape") { value }
    diamondColorMetafield: metafield(namespace: "custom", key: "diamond_color") { value }
    cutMetafield: metafield(namespace: "custom", key: "cut") { value }
    clarityMetafield: metafield(namespace: "custom", key: "clarity") { value }
    depthMetafield: metafield(namespace: "custom", key: "depth") { value }
    polishMetafield: metafield(namespace: "custom", key: "polish") { value }
    lwRatioMetafield: metafield(namespace: "custom", key: "lw_ratio") { value }
    fluorescenceMetafield: metafield(namespace: "custom", key: "fluorescence") { value }
    reportMetafield: metafield(namespace: "custom", key: "report") { value }
    tableMetafield: metafield(namespace: "custom", key: "table") { value }
    symmetryMetafield: metafield(namespace: "custom", key: "symmetry") { value }
    showOnCollectionMetafield: metafield(namespace: "custom", key: "show_on_collection") { value }
    sizeProductOptionMetafield: metafield(namespace: "custom", key: "size") { value }
    certificationMetafield: metafield(namespace: "custom", key: "certification") { value }
    styleMetafield: metafield(namespace: "custom", key: "style") { value }
    sliderEnableMetafield: metafield(namespace: "custom", key: "slider_enable") { value }
    pinnedMetafield: metafield(namespace: "custom", key: "pinned") { value }
    description
    productType
    vendor
    tags
    createdAt
    updatedAt
    publishedAt
    onlineStoreUrl
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          id
          title
          sku
          price { amount currencyCode }
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
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
    variants(first: 10) {
      edges {
        node {
          id
          title
          sku
          price { amount currencyCode }
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;