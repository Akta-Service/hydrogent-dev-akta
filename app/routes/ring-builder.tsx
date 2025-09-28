import { useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';
import { type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';

import { CollectionsData, BlogsData, FreshFineCollectionData } from '~/lib/types';
import {
  COLLECTIONS_QUERY,
  BLOGS_QUERY,
  FRESH_FINE_COLLECTION_QUERY,
} from '~/graphql/indexPage';

/**
 * Meta function for the ring builder page
 * Provides SEO metadata for the page
 * @returns Array of meta tags for the page
 */
export const meta: MetaFunction = () => {
  return [
    { title: 'Ring Builder | Bello Diamonds' },
    {
      name: 'description',
      content: 'Design your perfect engagement ring with our custom ring builder',
    },
  ];
};

/**
 * Loader function for the ring builder page
 * Fetches collections, blogs, and fresh fine collection data
 * @param context - Remix loader context containing storefront instance
 * @returns JSON response with fetched data
 */
export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  try {
    const [collectionsData, blogsData, freshFineData] = await Promise.all([
      storefront.query<CollectionsData>(COLLECTIONS_QUERY, {
        variables: {
          first: 20,
          productsFirst: 5,
        },
        cache: storefront.CacheLong(),
      }),
      storefront.query<BlogsData>(BLOGS_QUERY, {
        variables: {
          firstBlogs: 4,
        },
        cache: storefront.CacheLong(),
      }),
      storefront.query<FreshFineCollectionData>(FRESH_FINE_COLLECTION_QUERY, {
        variables: {
          handle: 'fresh-fine',
          productsFirst: 10,
        },
        cache: storefront.CacheLong(),
      }),
    ]);
    return json({
      collections: collectionsData.collections.edges,
      blogs: blogsData.blogs?.edges?.[0]?.node.articles.edges || [],
      freshFineCollection: freshFineData.collection ?? null,
    });
  } catch (error) {
    console.error('Error fetching collections or blogs:', error);
    // Return fallback data instead of throwing to improve user experience
    return json({
      collections: [],
      blogs: [],
      freshFineCollection: null,
    });
  }
}

/**
 * Ring Builder page component
 * Currently displays a placeholder - will be implemented with ring builder functionality
 * @returns JSX element containing the ring builder page content
 */
const RingBuilder = () => {
  // TODO: Implement ring builder functionality
  // const { collections, blogs, freshFineCollection } = useLoaderData<typeof loader>();
  
  return (
    <>
      <div className='pt-52 text-primary bg-black pb-34'>
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">Ring Builder</h1>
          <p className="text-lg opacity-75">Coming Soon - Design your perfect engagement ring</p>
        </div>
      </div>
    </>
  );
};

export default RingBuilder;


