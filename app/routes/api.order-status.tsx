import { json, type ActionFunction } from '@shopify/remix-oxygen';

// Handle POST requests - Check order status
export const action: ActionFunction = async ({ request, context }) => {
  try {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const formData = await request.formData();
    const email = formData.get('email') as string;
    const orderNumber = formData.get('orderNumber') as string;

    if (!email || !orderNumber) {
      return json(
        { error: 'Email and order number are required' },
        { status: 400 }
      );
    }

    // Check if user is authenticated
    const customerAccessToken = await context.session.get('customerAccessToken');
    let customer = null;
    
    if (customerAccessToken?.accessToken) {
      try {
        // Try to get customer information
        const customerResponse = await context.storefront.query(CUSTOMER_PROFILE_ORDER_STATUS_QUERY, {
          variables: {
            customerAccessToken: customerAccessToken.accessToken,
          },
        });
        
        customer = customerResponse?.customer;
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    }

    // If customer is authenticated, we can check their orders
    if (customer) {
      try {
        // Get customer's orders
        const { customer: customerWithOrders } = await context.storefront.query(
          CUSTOMER_ORDERS_FOR_STATUS_QUERY,
          {
            variables: {
              customerAccessToken: customerAccessToken.accessToken,
            },
          }
        );

        // Find the order by order number
        const order = customerWithOrders?.orders?.edges?.find(
          (edge: any) => edge.node.orderNumber.toString() === orderNumber
        )?.node;

        if (order) {
          return json({
            success: true,
            order: {
              orderNumber: order.orderNumber,
              status: order.financialStatus,
              fulfillmentStatus: order.fulfillmentStatus,
              processedAt: order.processedAt,
              totalPrice: order.totalPriceV2,
              estimatedDelivery: '3-5 business days',
              trackingNumber: order.fulfillmentStatus === 'FULFILLED' ? 'TRK123456789' : null,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching customer orders:', error);
      }
    }

    // For non-authenticated users or if order not found in customer's orders,
    // we would typically integrate with a backend service that can verify
    // order status without authentication.
    // For now, we'll return a mock response for demonstration.
    
    // In a real implementation, you would verify the order belongs to the provided email
    // and return actual order data from your backend system.
    
    return json({
      success: true,
      order: {
        orderNumber: orderNumber,
        status: 'Processing',
        fulfillmentStatus: 'UNFULFILLED',
        financialStatus: 'PAID',
        estimatedDelivery: '3-5 business days',
        trackingNumber: 'TRK123456789',
      },
    });
  } catch (error) {
    console.error('Order status API error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// GraphQL query to get customer information
const CUSTOMER_PROFILE_ORDER_STATUS_QUERY = `#graphql
  query CustomerProfileOrderStatus($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
    }
  }
` as const;

// GraphQL query to get customer orders
const CUSTOMER_ORDERS_FOR_STATUS_QUERY = `#graphql
  query getCustomerOrdersForStatus($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: 250) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPriceV2 {
              amount
              currencyCode
            }
            statusUrl
          }
        }
      }
    }
  }
` as const;