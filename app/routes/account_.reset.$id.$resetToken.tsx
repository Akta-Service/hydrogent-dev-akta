import {type ActionFunctionArgs, data, redirect} from '@shopify/remix-oxygen';
import {Form, useActionData, type MetaFunction, useNavigate} from '@remix-run/react';
import {useState, useEffect} from 'react';
import {CheckCircle2} from 'lucide-react';

type ActionResponse = {
  error: string | null;
  success?: boolean;
};

export const meta: MetaFunction = () => {
  return [{title: 'Reset Password'}];
};

export async function action({request, context, params}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }
  
  const {id, resetToken} = params;
  const {session, storefront} = context;

  try {
    if (!id || !resetToken) {
      throw new Error('Customer ID or reset token not found');
    }

    const form = await request.formData();
    const password = form.has('password') ? String(form.get('password')) : '';
    const passwordConfirm = form.has('passwordConfirm')
      ? String(form.get('passwordConfirm'))
      : '';
    
    // Validation
    if (!password || !passwordConfirm) {
      throw new Error('Please fill in all required fields');
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (password !== passwordConfirm) {
      throw new Error('Passwords do not match');
    }

    const resetUrl = `https://${request.headers.get('host')}/account/reset/${id}/${resetToken}`;
    
    const {customerResetByUrl} = await storefront.mutate(CUSTOMER_RESET_BY_URL_MUTATION, {
      variables: {
        password,
        resetUrl,
      },
    });

    if (customerResetByUrl?.customerUserErrors?.length) {
      const errorMessage = customerResetByUrl.customerUserErrors[0].message;
      
      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        throw new Error('This password reset link has expired or is invalid. Please request a new one.');
      } else if (errorMessage.includes('used')) {
        throw new Error('This password reset link has already been used. Please request a new one.');
      } else {
        throw new Error(errorMessage);
      }
    }

    if (!customerResetByUrl?.customerAccessToken) {
      throw new Error('Failed to reset password. Please try again.');
    }
    
    // Set the customer session
    session.set('customerAccessToken', customerResetByUrl.customerAccessToken);

    // Return success data instead of redirecting immediately
    return data({error: null, success: true}, {status: 200});
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.';
    console.error('Reset password error:', errorMessage);
    return data({error: errorMessage}, {status: 400});
  }
}

export default function Reset() {
  const action = useActionData<ActionResponse>();
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Show success popup when API succeeds
  useEffect(() => {
    if (action?.success && !showSuccess) {
      setShowSuccess(true);
    }
  }, [action?.success, showSuccess]);

  // Success Popup (same as your login success)
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-4 rounded-[18px] shadow-lg relative w-full max-w-[375px] overflow-hidden">
          {/* Header section */}
          <div className="bg-white text-primary flex flex-col items-center justify-center rounded-t-[18px]">
            <CheckCircle2 className="h-16 w-16 text-green-400" />
            <h2 className="text-[22px] palyfairsb mt-4">Success!</h2>
          </div>

          {/* Content section */}
          <div className="text-center">
            <p className="text-[15px] outfit text-primary mb-3">
              Your password has been reset successfully!
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate('/'); // Navigate to home
              }}
              className="w-full py-3 bg-[#0c0d0d] hover:bg-[#2a2e2b] text-base text-white outfit uppercase rounded-[8px] transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 bg-black text-primary min-h-screen">
      <div className="max-w-md mx-auto p-5 border-2 border-black rounded-lg relative font-sans bg-white text-black z-[9999]">
        <button
          className="absolute top-2 right-2 text-lg text-gray-600 hover:text-black"
          onClick={() => window.history.back()}
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-2 text-left">Reset Password</h1>
        <p className="text-sm text-gray-700 mb-5 text-left">
          Enter a new password for your account.
        </p>

        <Form method="POST">
          <fieldset className="border-none p-0">
            <label htmlFor="password" className="block text-sm mb-1 text-gray-700">
              New Password
            </label>
            <input
              aria-label="Password"
              autoComplete="new-password"
              id="password"
              minLength={8}
              name="password"
              placeholder="Enter new password"
              required
              type="password"
              className="w-full p-2 mb-4 border border-gray-300 rounded bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label htmlFor="passwordConfirm" className="block text-sm mb-1 text-gray-700">
              Confirm New Password
            </label>
            <input
              aria-label="Re-enter password"
              autoComplete="new-password"
              id="passwordConfirm"
              minLength={8}
              name="passwordConfirm"
              placeholder="Re-enter new password"
              required
              type="password"
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
            Reset Password
          </button>
        </Form>

        <div className="text-center mt-4 space-y-2">
          <a href="/account/login" className="text-blue-600 text-sm hover:underline block">
            Back to Login
          </a>
          <a href="/" className="text-blue-600 text-sm hover:underline block">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// Use customerResetByUrl mutation
const CUSTOMER_RESET_BY_URL_MUTATION = `#graphql
  mutation customerResetByUrl(
    $password: String!,
    $resetUrl: URL!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerResetByUrl(password: $password, resetUrl: $resetUrl) {
      customer {
        id
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