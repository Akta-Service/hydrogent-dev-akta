import { useState } from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import ArrowIcon from '~/assets/svg/ArrowIcon';
import type { CollectionFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import RingBuilder from '~/components/ui/RIngBuilder';

// Define the desired order of collections
const collectionsOrder = [
  {
    "title": "Ready To Wear Engagement Rings",
    "href": "/collections/ready-to-wear",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/1.__Ready-to-Wear_Engagement_Rings.jpg?v=1758024352"
  },
  {
    "title": "Create Your Own Engagement Ring",
    "href": "/collections/create-your-own-engagement-ring",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/2._Create_Your_Own_Engagement_Ring.jpg?v=1758024407"
  },
  {
    "title": "Women's Wedding Bands",
    "href": "/collections/women-wedding-bands-1",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/3._Womens_Wedding_Bands_f0eb40a4-1f27-4af8-ad52-24cb4b9e9c22.png?v=1758288302"
  },
  {
    "title": "Eternity Bands & More",
    "href": "/collections/eternity-bands-more",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/4.__Eternity_Bands_More__SKN2591.jpg?v=1758094832"
  },

  {
    "title": "Earrings",
    "href": "/collections/earring",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/5._Earrings_1b43acb9-43b3-405d-bf81-987b046fdd90.jpg?v=1758094814"
  },
  {
    "title": "Necklaces",
    "href": "/collections/necklace",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/7._Necklaces_9d32fb5d-bf0b-4a95-8948-f742dbb5a290.jpg?v=1758094885"
  },
  {
    "title": "Pendants",
    "href": "/collections/pendants",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/8._Pendants_465e9a22-6e01-428e-b27f-470c2cbde0e9.jpg?v=1758094988"
  },
  {
    "title": "Bracelets",
    "href": "/collections/bracelet-1",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/6._Bracelets_2b9fab9c-2141-430b-b4e1-ada7e1e32353.jpg?v=1758094796"
  },
  {
    "title": "Men Wedding Bands",
    "href": "/collections/men-wedding-bands-1",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/4.__Mens_Wedding_Bands.jpg?v=1758025465"
  },  
  {
    "title": "Men's Jewelry",
    "href": "/collections/mens-jewelry-1",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/10._Men_s_Jewelry_51af9912-2738-475c-aeb3-275ac403ccce.jpg?v=1758094928"
  },
  {
    "title": "Jewelry Sets",
    "href": "/collections/jewelry-set",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/11._Jewelry_Sets.jpg?v=1758025915"
  },
  {
    "title": "Placeholder",
    "href": "/collections/placeholder",
    "image": "https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Untitled-1.webp?v=1758313542"
  },
 
]



const COLLECTION_ORDER = [
  'ready-to-wear',
  'create-your-own-engagement-ring', 
  'womens-wedding-bands',
  'eternity-band-and-more',
  'earrings',
  'necklaces',
  'pendants',
  'bracelets',
  'mens-wedding-bands',
  'mens-jewelry', 
  'jewelry-sets',
  'tbd-placeholder'
];

export async function loader(args: LoaderFunctionArgs) {
  const { context, request } = args;

  // Fetch first 50 collections (adjust if needed)
  const paginationVariables = getPaginationVariables(request, { pageBy: 50 });

  const { collections } = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  // Sort collections according to COLLECTION_ORDER
  const sortedCollections = {
    ...collections,
    nodes: sortCollectionsByOrder(collections.nodes),
  };

  return { collections: sortedCollections };
}

/**
 * Sort collections based on the predefined order array
 */
function sortCollectionsByOrder(collections: CollectionFragment[]): CollectionFragment[] {
  const collectionMap = new Map(collections.map(c => [c.handle, c]));
  const ordered: CollectionFragment[] = [];

  COLLECTION_ORDER.forEach(handle => {
    const collection = collectionMap.get(handle);
    if (collection) {
      ordered.push(collection);
      collectionMap.delete(handle);
    }
  });

  // Add remaining collections not in COLLECTION_ORDER
  collectionMap.forEach(c => ordered.push(c));

  return ordered;
}

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="collection bg-white pt-[90px] sm:pt-[100px] md:pt-[235px]">
      <div className="collectionBanner">
        <div className="container max-w-[1350px] mx-auto px-[15px]">
          <div className="h-[212px] flex justify-center items-center bg-[url('/ring-catalogue-banner.png')] bg-no-repeat bg-cover bg-center">
            <h1 className="w-full text-center titleborder playfair font-normal md:text-[56px] text-[32px] text-white md:leading-[65px] pb-[10px] leading-[35px]">
              Signature Styles
            </h1>
          </div>
        </div>
      </div>

      <div className="py-[55px]">
        <div className="container max-w-[1350px] mx-auto px-[15px]">
          <div className="grid kk grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-[15px]">
            {collectionsOrder?.map((item: any, index) => (
              item.href === '/collections/create-your-own-engagement-ring' ? (
                <div
                  key={item.title}
                  className="collection-item cursor-pointer"
                  onClick={openModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openModal()} // Accessibility
                >
                  <Image
                    alt={item.title}
                    aspectRatio="1/1"
                    src={item.image}
                    loading={index < 3 ? 'eager' : undefined}
                    sizes="(min-width: 45em) 400px, 100vw"
                  />
                  <div className="mt-4 cardInfo w-full flex justify-between items-start">
                    <h5 className="text-[16px] playfairsb text-primary">{item.title}</h5>
                    <ArrowIcon rotate={0} size={24} className="text-primary" />
                  </div>
                </div>
              ) : (
                <Link
                  key={item.title}
                  className="collection-item"
                  to={item.href}
                  prefetch="intent"
                >
                  <Image
                    alt={item.title}
                    aspectRatio="1/1"
                    src={item.image}
                    loading={index < 3 ? 'eager' : undefined}
                    sizes="(min-width: 45em) 400px, 100vw"
                  />
                  <div className="mt-4 cardInfo w-full flex justify-between items-start">
                    <h5 className="text-[16px] playfairsb text-primary">{item.title}</h5>
                    <ArrowIcon rotate={0} size={24} className="text-primary" />
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && <RingBuilder closeModal={closeModal} />}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className="mt-4 cardInfo w-full flex justify-between items-start">
        <h5 className="text-[18px] playfairsb text-primary">{collection.title}</h5>
        <ArrowIcon rotate={0} size={24} className="text-primary" />
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    hide_on_collection_list: metafield(namespace: "custom", key: "hide_on_collection_list") { value }
    image {
      id
      url
      altText
      width
      height
    }
  }

  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;