import {
  data,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';

type ActionResponse = {
  error?: string;
  resetRequested?: boolean;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email address.');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email address.');
    }

    const {customerRecover} = await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email: email.toLowerCase().trim()},
    });

    // Handle any errors from Shopify
    if (customerRecover?.customerUserErrors?.length) {
      const errorMessage = customerRecover.customerUserErrors[0].message;
      // Don't reveal if email exists or not for security
      return {resetRequested: true};
    }

    return {resetRequested: true};
  } catch (error: unknown) {
    const resetRequested = false;
    if (error instanceof Error) {
      return data({error: error.message, resetRequested}, {status: 400});
    }
    return data({error: 'An unexpected error occurred. Please try again.', resetRequested}, {status: 400});
  }
}

export default function Recover() {
  const action = useActionData<ActionResponse>();

  return (
    <div className="pt-64 bg-black text-primary min-h-screen">
      <div className="max-w-md mx-auto p-5 border-2 border-black rounded-lg relative font-sans bg-white text-black z-[9999]">
        <button
          className="absolute top-2 right-2 text-lg text-gray-600 hover:text-black"
          onClick={() => window.history.back()}
        >
          ✕
        </button>

        {action?.resetRequested ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-600">Request Sent</h1>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <p className="text-sm text-green-700">
                If that email address is in our system, you will receive an email
                with instructions to reset your password in a few minutes.
              </p>
            </div>
            <div className="space-y-3">
              <Link 
                to="/account/login" 
                className="block w-full py-3 bg-black text-white rounded font-bold text-sm uppercase hover:bg-gray-800 transition duration-200 text-center"
              >
                Return to Login
              </Link>
              <Link 
                to="/" 
                className="block text-blue-600 text-sm hover:underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2 text-left">Forgot Password</h1>
            <p className="text-sm text-gray-700 mb-5 text-left">
              Enter the email address associated with your account to receive a
              link to reset your password.
            </p>

            <Form method="POST">
              <fieldset className="border-none p-0">
                <label htmlFor="email" className="block text-sm mb-1 text-gray-700">
                  Email Address
                </label>
                <input
                  aria-label="Email address"
                  autoComplete="email"
                  autoFocus
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  type="email"
                  className="w-full p-2 mb-4 border border-gray-300 rounded bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </fieldset>

              {action?.error ? (
                <div className="text-center mb-4">
                  <div className="bg-red-100 text-red-700 py-2 px-3 rounded text-sm border border-red-200">
                    {action.error}
                  </div>
                </div>
              ) : null}

              <button 
                type="submit"
                className="w-full py-3 bg-black text-white rounded font-bold text-sm uppercase hover:bg-gray-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Request Reset Link
              </button>
            </Form>

            <div className="text-center mt-4 space-y-2">
              <Link to="/account/login" className="text-blue-600 text-sm hover:underline block">
                Back to Login
              </Link>
              <Link to="/" className="text-blue-600 text-sm hover:underline block">
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;