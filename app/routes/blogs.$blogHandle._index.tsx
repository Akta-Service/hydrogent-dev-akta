import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, getPaginationVariables } from '@shopify/hydrogen';
import type { ArticleItemFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import BlogCard from '~/components/ui/cards/BlogCard';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.blog.title ?? ''} blog` }];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 200, // Increased to support multiple pages (60 per page)
  });

  if (!params.blogHandle) {
    throw new Response(`Blog not found`, { status: 404 });
  }

  const [{ blog }] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, if needed
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 });
  }

  return { blog };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  return {};
}

export default function Blog() {
  const { blog } = useLoaderData<typeof loader>();
  const { articles } = blog;

  return (
    <>
      <div className="About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white">
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <div className="h-[212px] flex flex-col justify-center items-center collectionBanner bg-[url('/about.png')] bg-no-repeat bg-cover bg-center">
            <div className="breadcrum">
              <ul className="flex items-center">
                <li className="m-0 text-[14px] outfit font-light text-[#E7E7E7]">
                  <Link to="/">Home</Link>
                </li>
                <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-[#F6F6F6]">
                  /
                </li>
                <li className="m-0 text-[14px] outfit font-light text-[#F6F6F6]">
                  <Link to="/blogs">Blog</Link>
                </li>
              </ul>
            </div>
            <h1 className="text-center titleborder playfair font-normal md:text-[76px] text-[32px] text-white md:leading-[140%] pb-[10px] leading-[35px]">
              Blog & News
            </h1>
          </div>
        </div>
      </div>
      <div className="blog bg-white text-primary py-[30px]">
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <PaginatedResourceSection
            connection={articles}
            resourcesClassName=""
          >
            {({ node: article, index }) => (
              <ArticleItem
                article={article}
                key={article.id}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <div className="blog-article" key={article.id}>
      {article.image && (
        <div className="blog-article-image">
          <BlogCard
            key={article.publishedAt}
            image={article.image.url}
            title={article.title}
            date={publishedAt}
            time="5"
            to={`/blogs/${article.blog.handle}/${article.handle}`}
          />
        </div>
      )}
    </div>
  );
}

const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;