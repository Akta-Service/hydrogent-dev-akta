import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, Link} from '@remix-run/react';

import {Image} from '@shopify/hydrogen';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params}: LoaderFunctionArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <>
      <div className="About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white">
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <div className="breadcrum mb-4">
            <ul className="flex items-center">
              <li className="m-0 text-[14px] outfit font-light text-primary">
                <Link to="/">Home</Link>
              </li>
              <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">
                /
              </li>
              <li className="m-0 text-[14px] outfit font-light text-primary">
                <Link to="/">Blog</Link>
              </li>
              <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">
                /
              </li>
              <li className="m-0 text-[14px] outfit font-light text-primary">
                <Link to="/">{title}</Link>
              </li>
            </ul>
          </div>
          <div className="md:pb-[35px] pb-[20px] md:h-[459px] h-[215px] flex flex-col justify-end items-center collectionBanner bg-[url('/blog-detail.png')] bg-no-repeat bg-cover bg-center">
            <h1 className="text-center playfair font-normal md:text-[76px] text-[32px] text-white md:leading-[140%] pb-[10px] leading-[35px] ">
              {/* {collection.title} */}
              {title}
            </h1>
            <ul className="flex items-center ">
              <li className="md:text-[16px] text-[14px] outfit font-light text-[#B0B0B0]">
                {publishedDate}
              </li>
              <li>
                <span className="block mx-2 bg-[#D9D9D9] rounded-full h-[4px] w-[4px]"></span>
              </li>
              <li className="md:text-[16px] text-[14px] outfit font-light text-[#B0B0B0]">
                {article?.read_time?.value}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="article bg-white md:py-[25px] py-[55px]">
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <div
                dangerouslySetInnerHTML={{__html: contentHtml}}
                className="article outfit text-[16px] text-primary"
              />
        </div>
      </div>
    </>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
       publishedAt
              read_time: metafield(namespace: "custom", key: "read_time") {
                value
              }
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
