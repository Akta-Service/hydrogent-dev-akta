import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import {
  data,
  type HeadersFunction,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type { CustomerFragment } from 'storefrontapi.generated';
import { useEffect } from 'react';

export function shouldRevalidate() {
  return true;
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { session, storefront } = context;
  const { pathname } = new URL(request.url);
  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = !!customerAccessToken?.accessToken;
  const isAccountHome = pathname === '/account' || pathname === '/account/';
  const isPrivateRoute =
    /^\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
      pathname,
    );

  if (!isLoggedIn) {
    if (isPrivateRoute || isAccountHome) {
      session.unset('customerAccessToken');
      return redirect('/account/login');
    } else {
      return {
        isLoggedIn: false,
        isAccountHome,
        isPrivateRoute,
        customer: null,
      };
    }
  } else {
    if (isAccountHome) {
      return redirect('/account/orders');
    }
  }

  try {
    const { customer } = await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return data(
      { isLoggedIn, isPrivateRoute, isAccountHome, customer },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('There was a problem loading account', error);
    session.unset('customerAccessToken');
    return redirect('/account/login');
  }
}

export default function Account() {
  const { customer, isPrivateRoute, isAccountHome, isLoggedIn } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Client-side redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && (isPrivateRoute || isAccountHome)) {
      navigate('/account/login');
    }
  }, [isLoggedIn, isPrivateRoute, isAccountHome, navigate]);

  if (!isPrivateRoute && !isAccountHome) {
    return <Outlet context={{ customer }} />;
  }

  return (
    <AccountLayout customer={customer as CustomerFragment}>
      <Outlet context={{ customer }} />
    </AccountLayout>
  );
}

function AccountLayout({
  customer,
  children,
}: {
  customer: CustomerFragment;
  children: React.ReactNode;
}) {
  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="flex account pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white">
      <div className="container max-w-[1350px] mx-auto px-[15px]">
        <div className='flex items-start md:flex-row flex-col'>
          <AccountMenu />
          {children}
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (
    <nav role="navigation" className="flex flex-col p-4 rounded-lg md:max-w-[206px] max-w-full w-full bg-[#f6f6f6]">
      <NavLink
        to="/account/profile"
        className={({ isActive }) =>
          `py-2 px-4 mb-2 text-primary playfairsb rounded-lg ${isActive ? 'gradient-border-shade bg-transparent' : 'bg-transparent'}`
        }
      >
        Profile
      </NavLink>
      <NavLink
        to="/account/orders"
        className={({ isActive }) =>
          `py-2 px-4 mb-2 text-primary playfairsb rounded-lg ${isActive ? 'gradient-border-shade bg-transparent' : 'bg-transparent'}`
        }
      >
        Orders
      </NavLink>
      <NavLink
        to="/account/addresses"
        className={({ isActive }) =>
          `py-2 px-4 mb-2 text-primary playfairsb rounded-lg ${isActive ? 'gradient-border-shade bg-transparent' : 'bg-transparent'}`
        }
      >
        Addresses
      </NavLink>
       <button className="mt-4 py-2 px-4 mb-2 text-primary outfit rounded-lg bg-transparent border border-solid">
        <Logout />
      </button> 
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      &nbsp;<button type="submit">Sign out</button>
    </Form>
  );
}

export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    acceptsMarketing
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
    defaultAddress {
      ...Address
    }
    email
    firstName
    lastName
    numberOfOrders
    phone
  }
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_QUERY = `#graphql
  query CustomerAccount(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
