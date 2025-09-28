// GraphQL queries
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!, $productsFirst: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            altText
            url
          }
          displayInTabs: metafield(namespace: "custom", key: "display_in_tabs") {
            value
          }
          defineShapeStyle: metafield(namespace: "custom", key: "define_shape_style") {
            value
          }
          products(first: $productsFirst) {
            edges {
              node {
                id
                title
                handle
                description
                featuredImage {
                  url
                  altText
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                media(first: 10) {
                  edges {
                    node {
                      __typename
                      id
                      mediaContentType
                      alt
                      ... on MediaImage {
                        image {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const BLOGS_QUERY = `
  query GetBlogs($firstBlogs: Int!) {
  blogs(first: 1) {
    edges {
      node {
        id
        handle
        articles(first: $firstBlogs, sortKey: PUBLISHED_AT, reverse: true) {
          edges {
            node {
              id
              handle
              title
              excerpt
              image {
                url
                altText
              }
              publishedAt
              metafield(namespace: "custom", key: "read_time") {
                value
              }
            }
          }
        }
      }
    }
  }
}
`;

export const FRESH_FINE_COLLECTION_QUERY = `query GetFreshFineCollection($cursor: String) {
  collections(first: 100, after: $cursor, query: "custom.fresh_n_fine_show_on_homepage:true") {
    edges {
      node {
        id
        title
        handle
        description
        fresh_n_fine:metafield(namespace: "custom", key: "fresh_n_fine_show_on_homepage") {
         value
        }
        image {
          altText
          url
          width
          height
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
    }
  }
}`
