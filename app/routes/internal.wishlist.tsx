import { json, type ActionFunction, type LoaderFunction } from '@shopify/remix-oxygen';

// GraphQL query to get customer information
const CUSTOMER_QUERY = `#graphql
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
    }
  }
` as const;

// Helper function to get user email from session/auth (client-side only)
async function getUserEmail(request: Request, context: any): Promise<string> {
  try {
    // Get customer access token from session
    const customerAccessToken = await context.session.get('customerAccessToken');
    
    if (!customerAccessToken?.accessToken) {
      throw new Response('Unauthorized - Please login to manage wishlist', { status: 401 });
    }
    
    // Query customer information to get email
    const { customer } = await context.storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
      },
    });
    
    if (!customer) {
      throw new Response('Customer not found', { status: 401 });
    }
        return customer.email;
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Error getting user email:', error);
    throw new Response('Authentication error', { status: 401 });
  }
}

// Handle GET requests - Get current user's email for wishlist (client-side only)
export const loader: LoaderFunction = async ({ request, context }) => {
  try {
    const userEmail = await getUserEmail(request, context);
    
    return json({
      success: true,
      userEmail: userEmail,
    });
  } catch (error) {
    console.error('Internal Wishlist loader error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Handle POST requests - For any future wishlist operations if needed (client-side only)
export const action: ActionFunction = async ({ request, context }) => {
  try {
    const userEmail = await getUserEmail(request, context);
    
    return json({
      success: true,
      userEmail: userEmail,
      message: 'User email retrieved successfully',
    });
  } catch (error) {
    console.error('Internal Wishlist action error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};