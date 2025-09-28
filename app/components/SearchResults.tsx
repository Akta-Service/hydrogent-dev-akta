import { Link } from '@remix-run/react';
import { Image, Money, Pagination } from '@shopify/hydrogen';
import doubleArrow from '~/assets/images/svg/doublechevy.svg';
import { urlWithTrackingParams, type RegularSearchReturn } from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & { term: string }) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({ ...result.items, term });
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className='text-[16px] playfairsb text-primary'>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({ term, pages }: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className='text-[16px] playfairsb text-primary'>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className='text-[16px] playfairsb text-primary'>Products</h2>
      <Pagination connection={products}>
        {({ nodes, isLoading, NextLink, PreviousLink }) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <div className="search-results-item border border-[#d1d1d1] p-2 rounded-lg" key={product.id}>
                <Link prefetch="intent" to={productUrl}>
                  {image && (
                    <Image
                      data={image}
                      alt={product.title}
                      width={350}
                      className="mb-2"
                    />
                  )}
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className="text-[18px] playfair font-medium">{product.title}</p>
                      <small className='text-[16px] outfit font-light mt-2 flex'>
                        {price && <Money data={price} />}
                      </small>
                    </div>
                    <div className='pt-2'>
                      <Image src={doubleArrow} alt='' width="30px"/>
                    </div>
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div className="space-y-6">
              <div className="text-center">
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {ItemsMarkup}
              </div>

              <div className="text-center">
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>

      <br />
    </div>
  );
}

function SearchResultsEmpty() {
  return <p className='outfit'>No results, try a different search.</p>;
}
