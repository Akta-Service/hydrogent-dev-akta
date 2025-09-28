import type {MetaFunction} from '@remix-run/react';
import {useLoaderData} from '@remix-run/react';
import {
  ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';

import {
  BLOGS_QUERY,
  COLLECTIONS_QUERY,
  FRESH_FINE_COLLECTION_QUERY,
} from '~/graphql/indexPage';
import {BlogsData, CollectionsData} from '~/lib/types';

import {
  generateRandomValue,
  getClientIPWithFallback,
  getCurrentUnixTimestamp,
  trackLead,
} from '~/utils/capi.server';

import BelloDiamondsBanner from '~/components/BelloDiamondsBanner';
import CollectionsSection from '~/components/home/CollectionsSection';
import EngagementRingSection from '~/components/home/EngagementRingSection';
import FreshFineSection from '~/components/home/FreshFineSection';
import HeroSection from '~/components/home/HeroSection';
import LatestNewsSection from '~/components/home/LatestNewsSection';
import LoveStorySection from '~/components/home/LoveStorySection';

const CUSTOMER_EMAIL_QUERY = `#graphql
  query getCustomerEmail(
    $customerAccessToken: String!
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      email
    }
  }
`;

// -------------------------
// JudgeMe Script & Carousel
// -------------------------

function JudgeMeScript() {
  useEffect(() => {
    const initializeJudgeMe = () => {
      window.jdgm = window.jdgm || {};
      window.jdgm.SHOP_DOMAIN = 'azt0aw-u9.myshopify.com';
      window.jdgm.PLATFORM = 'shopify';
      window.jdgm.PUBLIC_TOKEN = 'cjMJ7p22gOY6t_vL0gej7y60PBI';

      if (!document.querySelector('script[src*="widget_preloader.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdnwidget.judge.me/widget_preloader.js';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.type = 'text/javascript';

        script.onload = () => {
          setTimeout(() => {
            if (window.jdgm && window.jdgm.customInitialize) {
              window.jdgm.customInitialize();
            }
          }, 500);
        };

        document.head.appendChild(script);
      } else {
        setTimeout(() => {
          if (window.jdgm && window.jdgm.customInitialize) {
            window.jdgm.customInitialize();
          }
        }, 300);
      }
    };

    if (typeof window !== 'undefined') {
      initializeJudgeMe();
    }
  }, []);

  return null;
}

function JudgeMeCarousel() {
  useEffect(() => {
    const initializeCarousel = () => {
      const existingCarousels = document.querySelectorAll('.jdgm-carousel');
      existingCarousels.forEach((carousel) => {
        if (carousel.innerHTML) {
          carousel.innerHTML = '';
        }
      });

      setTimeout(() => {
        if (window.jdgm && window.jdgm.customInitialize) {
          window.jdgm.customInitialize();
        }

        if (window.jdgm) {
          if (window.jdgm.reloadWidgets) {
            window.jdgm.reloadWidgets();
          }
          if (window.jdgm.initialize) {
            window.jdgm.initialize();
          }
        }
      }, 2000);
    };

    initializeCarousel();
  }, []);

  return (
    <div className="reviews-carousel md:py-[55px] py-[35px]">
      <div className="container max-w-[1350px] px-[15px] mx-auto">
        <h3 className="text-center playfairsb text-primary text-[32px] md:text-[48px] lg:text-[64px]">
          What Our Customers Say
        </h3>
        <div
          className="jdgm-carousel-wrapper jdgm-widget jdgm-carousel"
          data-auto-install="false"
        />
      </div>
    </div>
  );
}

// -------------------------
// Meta Function
// -------------------------

export const meta: MetaFunction = () => {
  return [
    {title: 'Bello Diamonds'},
    {
      name: 'description',
      content: 'Discover our exquisite diamond collections',
    },
  ];
};

type CollectionNode = {
  id: string;
  title: string;
  handle: string;
  defineShapeStyle?: {
    value: string;
  };
  fresh_n_fine?: {
    value: string;
  };
};

type CollectionEdge = {
  node: CollectionNode;
};

// Loader function
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, session} = context;
  try {
    const [collectionsData, blogsData, freshFineData] = await Promise.all([
      storefront.query<CollectionsData>(COLLECTIONS_QUERY, {
        variables: {
          first: 200,
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
      storefront.query<any>(FRESH_FINE_COLLECTION_QUERY, {
        cache: storefront.CacheLong(),
      }),
    ]);

    const collections = collectionsData.collections.edges;

    const diamondShapeCollections = collections.filter((collection) => {
      const defineShapeStyleValue = collection.node.defineShapeStyle?.value;
      if (!defineShapeStyleValue) return false;
      try {
        const styles = JSON.parse(defineShapeStyleValue);
        return Array.isArray(styles) && styles.includes('Diamond Shape');
      } catch (error) {
        console.error(
          `Error parsing defineShapeStyle for collection ${collection.node.id}:`,
          error,
        );
        return false;
      }
    });

    const ringStyleCollections = collections.filter((collection) => {
      const defineShapeStyleValue = collection.node.defineShapeStyle?.value;
      if (!defineShapeStyleValue) return false;
      try {
        const styles = JSON.parse(defineShapeStyleValue);
        return Array.isArray(styles) && styles.includes('Ring Style');
      } catch (error) {
        console.error(`Error defineShapeStyle ${collection.node.id}:`, error);
        return false;
      }
    });

    // Get customer email from session
    const customerAccessTokenObj = await session.get('customerAccessToken');
    const customerAccessToken = customerAccessTokenObj?.accessToken || null;
    let email = null;
    let isSubscribed: boolean | null = null;

    if (customerAccessToken) {
      try {
        const {customer} = await storefront.query(CUSTOMER_EMAIL_QUERY, {
          variables: {
            customerAccessToken,
          },
        });
        email = customer?.email || null;
      } catch (error) {
        console.error('Error fetching customer email:', error);
      }
    }

    // Use localStorage email if available, fallback to session email
    const localStorageEmail =
      typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
    const emailToCheck = localStorageEmail || email;

    // Klaviyo subscription check
    const listId = 'WAjmdB';
    const apiKey = context.env.KLAVIYO_API_KEY;

    if (emailToCheck && apiKey) {
      try {
        const url = `https://a.klaviyo.com/api/lists/${listId}/profiles?filter=equals(email,"${encodeURIComponent(emailToCheck)}")`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Klaviyo-API-Key ${apiKey}`,
            Accept: 'application/json',
            revision: '2024-10-15',
          },
        });
        if (response.ok) {
          const data: any = await response.json();
          isSubscribed = data.data?.length > 0;
        } else {
          console.error('Klaviyo API error:', await response.text());
        }
      } catch (error) {
        console.error('Klaviyo subscription check failed:', error);
      }
    }

    return json({
      collections,
      diamondShapeCollections,
      ringStyleCollections,
      blogs: blogsData.blogs?.edges?.[0]?.node.articles.edges || [],
      freshFineCollection: freshFineData.collections.edges ?? null,
      isSubscribed,
      isLoggedIn: !!customerAccessToken,
    });
  } catch (error) {
    console.error('Error fetching collections or blogs:', error);
    throw new Response('Error fetching data', {status: 500});
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();

  // Capture Facebook parameters from form
  const fbc = formData.get('fbc')?.toString();
  const fbp = formData.get('fbp')?.toString();
  const fbLoginId = formData.get('fb_login_id')?.toString();
  const externalId = formData.get('external_id')?.toString();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({error: 'A valid email is required'}, {status: 400});
  }

  const apiKey = context.env.KLAVIYO_API_KEY;

  if (!apiKey) {
    return json({error: 'Server configuration error'}, {status: 500});
  }

  const ipAddress = getClientIPWithFallback(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const randomValue = generateRandomValue(100, 300);
  const payloadEmail = email;

  try {
    await trackLead(context, {
      eventTime: getCurrentUnixTimestamp(),
      eventId: `Lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userData: {
        clientIpAddress: ipAddress,
        clientUserAgent: userAgent,
        email: payloadEmail,
        clickId: fbc || undefined,
        browserId: fbp || undefined,
        facebookLoginId: fbLoginId || undefined,
        externalId: externalId || undefined,
      },
      eventSourceUrl: request.url,
      actionSource: 'email',
      customData: {
        currency: 'USD',
        value: randomValue,
      },
    });
  } catch (error) {
    console.error('Failed to send Enhanced Lead CAPI event:', error);
  }

  try {
    // Create Klaviyo profile
    const profileResponse = await fetch(
      'https://a.klaviyo.com/api/profile-import?additional-fields[profile]=predictive_analytics,subscriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          revision: '2025-04-15',
        },
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email,
              properties: {
                'Accepts Marketing': true,
                'Shopify Tags': [],
              },
            },
          },
        }),
      },
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      return json(
        {error: `Failed to create profile: ${errorText}`},
        {status: profileResponse.status},
      );
    }

    type KlaviyoProfileResponse = {
      data?: {
        id?: string;
      };
    };
    const profileData =
      (await profileResponse.json()) as KlaviyoProfileResponse;
    const profileId = profileData?.data?.id;

    if (!profileId) {
      return json({error: 'Failed to retrieve profile ID'}, {status: 500});
    }

    // Subscribe to Klaviyo list
    const listId = 'WAjmdB';
    const subscribeResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          revision: '2025-04-15',
        },
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: profileId,
            },
          ],
        }),
      },
    );

    if (!subscribeResponse.ok) {
      const errorText = await subscribeResponse.text();
      return json(
        {error: `Failed to subscribe to list: ${errorText}`},
        {status: subscribeResponse.status},
      );
    }

    return json({
      success: 'Thank you for entering the giveaway! You have been subscribed.',
      data: {email, leadValue: randomValue},
    });
  } catch (err) {
    console.error('Klaviyo fetch exception:', err);
    return json({error: 'Unexpected error occurred'}, {status: 500});
  }
}

// -------------------------
// Home Component
// -------------------------

const Home = () => {
  const {
    collections,
    blogs,
    freshFineCollection,
    diamondShapeCollections,
    ringStyleCollections,
    isSubscribed,
    isLoggedIn,
  } = useLoaderData<typeof loader>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const productsPerPage = 5;

  const freshAndFineCollections = freshFineCollection.filter(
    (item: CollectionEdge) => item.node.fresh_n_fine?.value === 'true',
  );
  return (
    <>
      {!isLoggedIn && (!isSubscribed || isSubscribed === null) && (
        <BelloDiamondsBanner />
      )}
      <div
        className="
          pt-[220px] sm:pt-[100px] md:pt-[160px]
          w-full
          bg-no-repeat 
          bg-top 
          bg-[length:100%] 
          bg-[url('/mobile-Hero-Banner.png')]
          max-[480px]:bg-[url('/mobile_ban.jpg')] 
          md:bg-[url('/new_hero_banner_laptop1.jpg')]
          2xl:bg-[url('/new_hero_banner_laptop1.jpg')]
          md:bg-top
          2xl:bg-center
          sm:bg-cover
          adjustheight
        "
      >
        <HeroSection />
        <CollectionsSection collections={collections} />
      </div>

      <FreshFineSection freshFineCollection={freshAndFineCollections} />

      <EngagementRingSection
        diamondShapes={diamondShapeCollections}
        ringStyles={ringStyleCollections}
      />

      <div>
        <JudgeMeScript />
        <JudgeMeCarousel />
        <LoveStorySection />
        <LatestNewsSection blogs={blogs} />
      </div>
    </>
  );
};

export default Home;
