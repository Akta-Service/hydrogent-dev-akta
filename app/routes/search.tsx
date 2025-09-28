import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { SearchForm } from '~/components/SearchForm';
import { SearchResults } from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';
import Button from '~/components/ui/buttons/Button';

export const meta: MetaFunction = () => {
  return [{ title: `Hydrogen | Search` }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise: Promise<PredictiveSearchReturn | RegularSearchReturn> =
    isPredictive
      ? predictiveSearch({ request, context })
      : regularSearch({ request, context });

  searchPromise.catch((error: Error) => {
    console.error(error);
    return { term: '', result: null, error: error.message };
  });

  return await searchPromise;
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const { type, term, result, error } = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <>
      <div className="collection bg-white pt-[90px] sm:pt-[100px] md:pt-[235px]">
        <div className="collectionBanner">
          <div className="container max-w-[1350px] mx-auto px-[15px]">
            <div className="h-[212px] flex justify-center items-center bg-[url('/ring-catalogue-banner.png')] bg-no-repeat bg-cover bg-center">
              <h1 className="w-full text-center titleborder playfair font-normal md:text-[56px] text-[32px] text-white md:leading-[65px] pb-[10px] leading-[35px]">
                Search
              </h1>
            </div>
          </div>
        </div>
        <div className="search bg-white text-primary md:py-10 py-4">
          <div className="container max-w-[1350px] mx-auto px-[15px]">
            <div className=' w-full mx-auto flex flex-col items-center justify-center'>

              <SearchForm>
                {({ inputRef }) => (
                  <>
                  <div className='flex mb-10'>
                    <input
                      defaultValue={term}
                      name="q"
                      placeholder="Search…"
                      ref={inputRef}
                      className="md:mb-2 mt-[0.5px] lg:mb-0 md:max-w-[210px] sm:max-w-full rounded-l-[10px] h-[48px] outfit font-light bg-white border border-[rgba(69,69,69,1)] text-[13px] text-primary px-4 py-2 w-full border-r-0 md:w-[auto] focus:outline-none focus:border-black mr-[-1px]"
                      type="search"
                    />
                    &nbsp;
                    <Button
                      type="submit"
                      className="lg:min-w-[120px] min-w-full text-[15px] md:text-[16px] text-center footer-btn md:min-w-full w-full"

                    >Search</Button>
                    </div>
                  </>
                )}
              </SearchForm>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!term || !result?.total ? (
                <SearchResults.Empty />
              ) : (
                <SearchResults result={result} term={term}>
                  {({ articles, pages, products, term }) => (
                    <div>
                      <SearchResults.Products products={products} term={term} />
                      <SearchResults.Pages pages={pages} term={term} />
                      <SearchResults.Articles articles={articles} term={term} />
                    </div>
                  )}
                </SearchResults>
              )}
              <Analytics.SearchView data={{ searchTerm: term, searchResults: result }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    tags
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
async function regularSearch({ request, context }: Pick<LoaderFunctionArgs, 'request' | 'context'>): Promise<RegularSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, { pageBy: 8 });
  const term = String(url.searchParams.get('q') || '');

  // Exclude products with specific tags
  const excludeTags = ['Frames', 'Pendant Frames'];
  const termQuery = `${term} ${excludeTags.map(tag => `NOT tag:"${tag}"`).join(' ')}`;

  const { errors, ...items } = await storefront.query(SEARCH_QUERY, {
    variables: { ...variables, term: termQuery },
  });

  if (!items) throw new Error('No search data returned from Shopify API');

  const total = Object.values(items as Record<string, { nodes?: unknown[] }>).reduce(
    (acc: number, entry: { nodes?: unknown[] }) => acc + (Array.isArray(entry?.nodes) ? entry.nodes.length : 0),
    0,
  );

  const error = errors ? errors.map(({ message }) => message).join(', ') : undefined;

  return { type: 'regular', term, error, result: { total, items } };
}


/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({ 
  request,
  context,
}: Pick<
  ActionFunctionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return { type, term, result: getEmptyPredictiveSearchResult() };

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const { predictiveSearch: items, errors } = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({ message }) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return { type, term, result: { items, total } };
}
