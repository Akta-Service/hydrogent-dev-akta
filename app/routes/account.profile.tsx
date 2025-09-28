import type {CustomerFragment} from 'storefrontapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {
  data,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import {useEffect, useState} from 'react';
import { useWishlist } from '~/hooks/useWishlist';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {session, storefront} = context;
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  try {
    const {customer} = await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
      },
    });
    if (!customer) {
      throw new Error('Customer not found');
    }

    return {customer};
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return redirect('/account/login');
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return data({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const password = getPassword(form);
    const customer: CustomerUpdateInput = {
      firstName: String(form.get('firstName') || '').trim() || null,
      lastName: String(form.get('lastName') || '').trim() || null,
      email: String(form.get('email') || '').trim() || null,
      phone: String(form.get('phone') || '').trim() || null,
      acceptsMarketing: form.get('acceptsMarketing') === 'on',
    };

    if (password) {
      customer.password = password;
    }

    const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        customer,
      },
    });

    if (updated.customerUpdate?.customerUserErrors?.length) {
      const errorMessage = updated.customerUpdate.customerUserErrors[0].message;
      return data({error: errorMessage}, {status: 400});
    }

    if (updated.customerUpdate?.customerAccessToken?.accessToken) {
      session.set(
        'customerAccessToken',
        updated.customerUpdate.customerAccessToken,
      );
    }

    return {error: null, customer: updated.customerUpdate?.customer};
  } catch (error: any) {
    console.error('Update error:', error);
    return data(
      {error: error.message || 'Failed to update profile'},
      {status: 400},
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const [formStatus, setFormStatus] = useState<ActionResponse | null>(null);
  const { loadWishlist, state: wishlistState } = useWishlist();

  const [customer, setCustomer] = useState<CustomerFragment | null>(
    action?.customer ?? account?.customer,
  );
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});

  useEffect(() => {
    if (action?.customer) {
      setCustomer(action.customer);
    }
  }, [action]);

  useEffect(() => {
    setFormStatus(action ?? null);
  }, [action]);

  // Load wishlist when customer data is available
  useEffect(() => {
    if (customer?.email && !wishlistState.isInitialized) {
      loadWishlist();
    }
  }, [customer?.email, loadWishlist, wishlistState.isInitialized]);

  // Function to fetch fresh profile data
  const handleRefreshProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json() as {
          success: boolean;
          customer?: CustomerFragment;
          error?: string;
        };
        
        if (data.success && data.customer) {
          setCustomer(data.customer);
          // Reload wishlist with fresh user data
          loadWishlist();
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const validateForm = (formData: FormData) => {
    const errors: {firstName?: string; lastName?: string; email?: string} = {};
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const email = String(formData.get('email') || '').trim();

    if (firstName && firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (lastName && lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (!customer) {
    return <div>Loading customer data...</div>;
  }

  return (
    <div className="w-full md:max-w-[850px] max-w-full md:px-[20px] md:pt-0 pt-[25px] mx-auto">
      <Form
        method="PUT"
        className="space-y-6 pb-8"
        onSubmit={(event) => {
          const formData = new FormData(event.currentTarget);

          // Clear visual status immediately
          setFormStatus(null);
          setFormErrors({});

          if (!validateForm(formData)) {
            event.preventDefault();
          }
        }}
      >
        <div>
          <h4 className="text-primary mb-4 playfairsb md:text-[24px] text-[18px]">
            Profile
          </h4>
          <fieldset className="">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-[45px]">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder=" "
                  aria-label="First name"
                  defaultValue={customer.firstName ?? ''}
                  minLength={2}
                  className={`w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary focus:outline-none focus:ring-2 focus:ring-transparent peer ${
                    formErrors.firstName ? 'border-red-500' : ''
                  }`}
                />
                <label
                  htmlFor="firstName"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  First Name
                </label>
                {formErrors.firstName && (
                  <div className="text-red-500 text-[12px] mt-1">
                    {formErrors.firstName}
                  </div>
                )}
              </div>

              <div className="relative h-[45px]">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder=""
                  aria-label="Last name"
                  defaultValue={customer.lastName ?? ''}
                  minLength={2}
                  className={`w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer ${
                    formErrors.firstName ? 'border-red-500' : ''
                  }`}
                />
                <label
                  htmlFor="lastName"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Last Name
                </label>
                {formErrors.lastName && (
                  <div className="text-red-500 text-[12px] mt-1">
                    {formErrors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="relative h-[45px]">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder=""
                  aria-label="Email address"
                  defaultValue={customer.email ?? ''}
                  className={`w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer ${
                    formErrors.firstName ? 'border-red-500' : ''
                  }`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Email
                </label>
                {formErrors.email && (
                  <div className="text-red-500 text-[12px] mt-1">
                    {formErrors.email}
                  </div>
                )}
              </div>
              <div className="relative h-[45px]">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder=""
                  aria-label="Phone number"
                  defaultValue={customer.phone ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Phone number
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="relative h-[45px]">
                <select
                  id="country"
                  name="country"
                  defaultValue={customer.defaultAddress?.country ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  {/* <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option> */}
                  {/* Add more countries as needed */}
                </select>
                <label
                  htmlFor="country"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Country
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              {/* <div className='relative h-[45px]'>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder=""
                  aria-label="Company"
                  defaultValue={customer.defaultAddress?.company ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="company"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Company (optional)
                </label>
              </div> */}
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="relative h-[45px]">
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  placeholder=""
                  aria-label="Apartment, suite, etc."
                  defaultValue={customer.defaultAddress?.address2 ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="address2"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Apartment, suite, etc.
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="relative h-[45px]">
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder=""
                  aria-label="Postal code"
                  defaultValue={customer.defaultAddress?.zip ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="zip"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Postal code
                </label>
              </div>
              <div className="relative h-[45px]">
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder=""
                  aria-label="City"
                  defaultValue={customer.defaultAddress?.city ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="city"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  City
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="relative h-[45px]">
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  placeholder=""
                  aria-label="Address"
                  defaultValue={customer.defaultAddress?.address1 ?? ''}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="address1"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  Address
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <h4 className="text-primary mt-8 mb-4 playfairsb md:text-[24px] text-[18px]">
          Password
        </h4>
        <div className="flex md:items-center md:flex-row flex-col items-start md:space-x-4 space-x-2">
          <fieldset className="md:space-y-2 w-full md:mb-0 mb-4">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 gap-4">
              <div className="relative h-[45px]">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder=""
                  aria-label="new password"
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="newPassword"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  New Password
                </label>
              </div>
              <div className="relative h-[45px]">
                <input
                  id="newPasswordConfirm"
                  name="newPasswordConfirm"
                  type="password"
                  placeholder=""
                  autoComplete="new-password"
                  aria-label="New password"
                  minLength={8}
                  className="w-full px-4 pt-[14px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent peer"
                />
                <label
                  htmlFor="newPasswordConfirm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] outfit font-light text-[#6D6D6D] transition-all duration-300 ease-in-out peer-focus:-top-[-4px] peer-focus:text-[11px] peer-focus:text-[#686868] peer-focus:-translate-y-0 peer-not-placeholder-shown:-top-[-4px] peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-translate-y-0"
                >
                  New password (confirm)
                </label>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={state !== 'idle'}
            className="h-[45px] px-4 py-2 md:w-[300px] bg-[#09090a] text-[13px] outfit font-light text-white rounded-[8px] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {state !== 'idle' ? 'Updating' : 'Update Profile'}
          </button>
        </div>
        {formStatus?.error ? (
          <div className="text-red-500 outfit text-[12px] mt-2">
            {formStatus.error}
          </div>
        ) : formStatus?.customer ? (
          <div className="text-green-500 outfit text-[12px] mt-2">
            Profile updated successfully.
          </div>
        ) : (
          <br />
        )}
      </Form>

      {/* Wishlist Information Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="text-primary mb-4 playfairsb md:text-[24px] text-[18px]">
          Wishlist Information
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[14px] outfit font-light text-gray-600">Customer Email:</span>
            <span className="text-[14px] outfit font-medium text-primary">
              {customer?.email || 'Not available'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] outfit font-light text-gray-600">Wishlist Items:</span>
            <span className="text-[14px] outfit font-medium text-primary">
              {wishlistState.loading ? 'Loading...' : `${wishlistState.items.length} items`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] outfit font-light text-gray-600">Wishlist Status:</span>
            <span className="text-[14px] outfit font-medium text-primary">
              {wishlistState.isInitialized ? 'Loaded' : 'Not loaded'}
            </span>
          </div>
          {wishlistState.error && (
            <div className="flex justify-between items-center">
              <span className="text-[14px] outfit font-light text-gray-600">Error:</span>
              <span className="text-[12px] outfit font-medium text-red-500">
                {wishlistState.error}
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-[12px] outfit font-light text-gray-500 mb-2">
            Your wishlist is automatically synced using your email address ({customer?.email}) as the unique identifier.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => loadWishlist()}
              disabled={wishlistState.loading}
              className="px-3 py-1 bg-black text-white text-[12px] outfit rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {wishlistState.loading ? 'Refreshing...' : 'Refresh Wishlist'}
            </button>
            <button
              onClick={handleRefreshProfile}
              className="px-3 py-1 bg-blue-600 text-white text-[12px] outfit rounded hover:bg-blue-700"
            >
              Refresh Profile
            </button>
            <a
              href="/wishlist"
              className="px-3 py-1 bg-transparent border border-black text-black text-[12px] outfit rounded hover:bg-gray-100"
            >
              View Wishlist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPassword(form: FormData): string | undefined {
  const newPassword = form.get('newPassword');
  const newPasswordConfirm = form.get('newPasswordConfirm');

  if (!newPassword && !newPasswordConfirm) {
    return undefined;
  }

  if (newPassword !== newPasswordConfirm) {
    throw new Error('New passwords must match.');
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  return newPassword;
}

const CUSTOMER_QUERY = `#graphql
  query CustomerProfile($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      phone
      email
      acceptsMarketing
      defaultAddress {
        address1
        address2
        city
        company
        country
        zip
      }
    }
  }
` as const;

const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
        defaultAddress {
          address1
          address2
          city
          company
          country
          zip
        }
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
