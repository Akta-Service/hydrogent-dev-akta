import { json, type LoaderFunction } from '@shopify/remix-oxygen';

const CUSTOMER_PROFILE_QUERY = `#graphql
  query CustomerProfile($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
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

export const loader: LoaderFunction = async ({ request, context }) => {
  try {
    const customerAccessToken = await context.session.get('customerAccessToken');
        
    if (!customerAccessToken?.accessToken) {
      return json({ error: 'Unauthorized - Please login to view profile' }, { status: 401 });
    }
    
    const { customer } = await context.storefront.query(CUSTOMER_PROFILE_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
      },
    });
    
    
    if (!customer) {
      return json({ error: 'Customer not found' }, { status: 401 });
    }
        
    return json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        acceptsMarketing: customer.acceptsMarketing,
        defaultAddress: customer.defaultAddress,
        customerAccessToken: customerAccessToken
      },
    });
    
  } catch (error) {
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};