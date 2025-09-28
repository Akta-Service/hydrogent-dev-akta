import React from 'react';
import {
  useNonce,
  getShopAnalytics,
  Analytics,
} from '@shopify/hydrogen';
import {
  data,
  type HeadersFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  useRouteLoaderData,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import type { CustomerAccessToken } from '@shopify/hydrogen/storefront-api-types';
import tailwindCss from './styles/tailwind.css?url';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import { PageLayout } from '~/components/PageLayout';
import {FOOTER_QUERY} from '~/lib/fragments';
// Import font loader utility
import { loadNonCriticalFonts } from '~/utils/fontLoader';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // Revalidate for mutations (e.g., POST requests)
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // Revalidate after logout action
  if (actionResult?.status === 302 && currentUrl.pathname === '/account/logout') {
    return true;
  }

  // Revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    { rel: 'preconnect', href: 'https://shop.app' },
    { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap', as: 'style' },
    { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap', as: 'style' },
    { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap', as: 'style' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon_io/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon_io/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon_io/apple-touch-icon.png' },
    { rel: 'manifest', href: '/favicon_io/site.webmanifest' },
  ];
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers = new Headers(loaderHeaders);
  // Add custom headers if needed
  return headers;
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, customerAccount, cart, env } = context;
  const publicStoreDomain = env.PUBLIC_STORE_DOMAIN;

  const customerAccessToken = await context.session.get('customerAccessToken');

  // Validate the customer access token
  const { isLoggedIn, headers } = await validateCustomerAccessToken(
    context.session,
    customerAccessToken,
  );

  const cartPromise = cart.get();

  // Optimize footer query with longer cache and defer it completely
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer',
    },
  });

  // Optimize header query with better caching strategy
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu',
    },
  });

  return data(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      isLoggedIn,
      publicStoreDomain,
      klaviyoCompanyId:env.KLAVIYO_PUBLIC_API_KEY,
      shop: getShopAnalytics({
        storefront,
        publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || publicStoreDomain || 'checkout.shopify.com',
        storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        withPrivacyBanner: true,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
    { headers },
  );
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  // Load non-critical fonts after page load
  React.useEffect(() => {
    loadNonCriticalFonts();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="facebook-domain-verification" content="j9ud2zp41jo2gk19hl6ge92fg6zftx" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Preload all CSS files */}
        <link rel="preload" href={tailwindCss} as="style" />
        <link rel="preload" href={resetStyles} as="style" />
        <link rel="preload" href={appStyles} as="style" />
        
        {/* Load CSS files normally */}
        <link rel="stylesheet" href={tailwindCss} />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <link rel="preload" href="https://code.tidio.co/widget-v4/fonts/inter_UcCo3FwrK3iLTcviYwYZ8UA3.woff2" as="font" crossOrigin="anonymous"></link>
        <Meta />
        <Links />
        {/* Load third-party scripts with better optimization */}
        <script 
          src="//code.tidio.co/prmnpkrtl5sbqnxmun6gwnp77a5hb94g.js" 
          async
        ></script>
        <script 
          type="text/javascript" 
          src="https://assets.calendly.com/assets/external/widget.js" 
          async
        ></script>
      {/* Klaviyo Onsite script - loads only if company ID is provided */}
      {data?.klaviyoCompanyId ? (
        <script
          async
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(String(data.klaviyoCompanyId))}`}
        />
      ) : null}
      </head>
      <body className="">
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout
              cart={data.cart}
              footer={data.footer}
              header={data.header}
              isLoggedIn={data.isLoggedIn}
              publicStoreDomain={data.publicStoreDomain}
              shop={data.shop}
            >
              {children}
            </PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      {/* Global Klaviyo form mount - remove or move as needed */}
      <div className="klaviyo-form-YkJvpA" />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error pt-52  text-primary">
      <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-red-500">
              {errorStatus}
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-primary">
              {errorMessage && (
                <fieldset>
                  <pre>{errorMessage}</pre>
                </fieldset>
              )}
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              {`Sorry, we can't find that page. You'll find lots to explore on the home page.`}
            </p>
            <a
              href="/"
              className="inline-flex text-primary bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-red-900 my-4"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 */
async function validateCustomerAccessToken(
  session: LoaderFunctionArgs['context']['session'],
  customerAccessToken?: CustomerAccessToken,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return { isLoggedIn, headers };
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
  } else {
    isLoggedIn = true;
  }

  return { isLoggedIn, headers };
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const CollectionWithImage = `#graphql
  fragment CollectionWithImage on Collection {
    id
    title
    handle
    image {
      url
      altText
    }
  }
` as const;

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
      items {
        id
        resourceId
        tags
        title
        type
        url
        resource {
          __typename
          ... on Collection {
            ...CollectionWithImage
          }
        }
        items {
          id
          resourceId
          tags
          title
          type
          url
          resource {
            __typename
            ... on Collection {
              ...CollectionWithImage
            }
          }
        }
      }
    }
  }
  ${MENU_FRAGMENT}
  ${CollectionWithImage}
` as const;