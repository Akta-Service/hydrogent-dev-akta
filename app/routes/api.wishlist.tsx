import { json, type ActionFunction, type LoaderFunction } from '@shopify/remix-oxygen';
import { wishlistService } from '~/lib/wishlist.service';

// Helper function to get user ID from session/auth
async function getUserId(request: Request, context: any): Promise<string> {
  try {
    // Get customer access token from session
    const customerAccessToken = await context.session.get('customerAccessToken');
    
    if (!customerAccessToken?.accessToken) {
      throw new Response('Unauthorized - Please login to manage wishlist', { status: 401 });
    }
    
    // Query customer information to get email or ID
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
    console.error('Error getting user ID:', error);
    throw new Response('Authentication error', { status: 401 });
  }
}

// Handle GET requests - Load user's wishlist
export const loader: LoaderFunction = async ({ request, context }) => {
  try {
    const userId = await getUserId(request, context);
    const response = await wishlistService.getWishlist(userId);
    
    if (!response.success) {
      return json(
        { error: response.message || 'Failed to load wishlist' },
        { status: 500 }
      );
    }
    
    return json({
      success: true,
      data: response.data || [],
      count: response.data?.length || 0,
    });
  } catch (error) {
    console.error('Wishlist loader error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

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

// Handle POST/DELETE requests - Add/Remove wishlist items
export const action: ActionFunction = async ({ request, context }) => {
  const method = request.method;
  
  try {
    const userId = await getUserId(request, context);
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    
    // Handle JSON body as well
    let requestData = body;
    if (request.headers.get('content-type')?.includes('application/json')) {
      requestData = await request.json() as Record<string, any>;
    }
    
    switch (method) {
      case 'POST': {
        // Add item to wishlist
        const { productId, title, handle, price, imageUrl, imageAlt } = requestData;
        
        if (!productId || !title || !handle) {
          return json(
            { error: 'Missing required fields: productId, title, handle' },
            { status: 400 }
          );
        }
        
        const productData = {
          productId: productId.toString(),
          title: title.toString(),
          handle: handle.toString(),
          price: price?.toString() || '0',
          image: imageUrl ? {
            url: imageUrl.toString(),
            altText: imageAlt?.toString() || title.toString(),
          } : undefined,
        };
        
        const response = await wishlistService.addToWishlist(userId, productData);
        
        if (!response.success) {
          return json(
            { error: response.message || 'Failed to add to wishlist' },
            { status: 500 }
          );
        }
        
        return json({
          success: true,
          message: 'Product added to wishlist',
          data: response.data,
        });
      }
      
      case 'DELETE': {
        // Remove item from wishlist
        const { productId } = requestData;
        
        if (!productId) {
          return json(
            { error: 'Missing productId' },
            { status: 400 }
          );
        }
        
        const response = await wishlistService.removeFromWishlist(userId, productId.toString());
        
        if (!response.success) {
          return json(
            { error: response.message || 'Failed to remove from wishlist' },
            { status: 500 }
          );
        }
        
        return json({
          success: true,
          message: 'Product removed from wishlist',
          data: response.data,
        });
      }
      
      case 'PUT': {
        // Toggle item in wishlist
        const { productId, title, handle, price, imageUrl, imageAlt } = requestData;
        
        if (!productId || !title || !handle) {
          return json(
            { error: 'Missing required fields: productId, title, handle' },
            { status: 400 }
          );
        }
        
        const productData = {
          productId: productId.toString(),
          title: title.toString(),
          handle: handle.toString(),
          price: price?.toString() || '0',
          image: imageUrl ? {
            url: imageUrl.toString(),
            altText: imageAlt?.toString() || title.toString(),
          } : undefined,
        };
        
        const response = await wishlistService.toggleWishlist(userId, productData);
        
        if (!response.success) {
          return json(
            { error: response.message || 'Failed to toggle wishlist' },
            { status: 500 }
          );
        }
        
        return json({
          success: true,
          message: 'Wishlist updated',
          data: response.data,
        });
      }
      
      default:
        return json(
          { error: `Method ${method} not allowed` },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error('Wishlist action error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};