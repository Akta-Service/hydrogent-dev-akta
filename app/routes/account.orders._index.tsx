import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Money, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import { data, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useState } from 'react';
import thumbring from '~/assets/images/demo/Productimage.png';
import type {
  CustomerOrdersFragment,
  OrderItemFragment as GeneratedOrderItemFragment,
} from 'storefrontapi.generated';
import OrderCard from '~/components/ui/Accordion/OrderCard';

// Extend the OrderItemFragment type to include billingAddress
interface OrderItemFragment extends GeneratedOrderItemFragment {
  billingAddress?: {
    address1?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    name?: string | null;
  } | null;
}

export const meta: MetaFunction = () => {
  return [{ title: 'Orders' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { session, storefront } = context;

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken?.accessToken) {
    return redirect('/account/login');
  }

  try {
    const paginationVariables = getPaginationVariables(request, {
      pageBy: 20,
    });

    const { customer } = await storefront.query(CUSTOMER_ORDERS_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        ...paginationVariables,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return { customer };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error }, { status: 400 });
  }
}

export default function Orders() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  const { orders, numberOfOrders } = customer;
  return (
    <>
      <div className="w-full md:max-w-[850px] max-w-full md:px-[20px] md:pt-0 pt-[25px] mx-auto">
        <div className="orders">
          <h4 className='text-primary mb-4 playfairsb md:text-[24px] text-[18px]'>Orders</h4>
          {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
        </div>
      </div>
    </>
  );
}

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="account-orders">
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span className="text-[#ffffff]">↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((order) => {
                  return <OrderItem key={order.id} order={order} />;
                })}
                <NextLink>
                  {isLoading ? 'Loading...' : <span className="text-[#ffffff]">Load more ↓</span>}
                </NextLink>
              </>
            );
          }}
        </Pagination>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {

  return (
    <>
      <p className="text-[14px] outfit font-light text-primary">You haven't placed any orders yet.</p>
      <br />
      <p>
        <Link to="/collections" className="text-primary mb-4 playfairsb md:text-[19px] text-[16px]">Start Shopping →</Link>
      </p>
    </>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-[#F6F6F6] border-l-2 border-white rounded-[8px] p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className='text-[13px] outfit font-light text-[#454545]'>
          <div className='flex items-center space-x-3'>
            <div className='flex items-center'>
              {/* <Link to={`/account/orders/${btoa(order.id)}`}> */}
                Order Number:-
              {/* </Link> */}
              <span> #{order.orderNumber}</span>
            </div>
            <div className='flex items-center'>
              <Link to={`/account/orders/${btoa(order.id)}`}>
                Date:-
              </Link>
              <span> {new Date(order.processedAt).toDateString()}</span>
            </div>
          </div>

          <p className="text-white capitalise mt-4 bg-[#462800] py-[5px] rounded-[35px] text-[13px] outfit font-light w-[110px] text-center">{order.fulfillmentStatus.toLowerCase().replace('_', ' ')}</p>
        </div>
        <div className="text-right">
          <Money data={order.currentTotalPrice} as="span" className="text-[#454545] text-[18px] outfit" />
          <br />
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[#454545] outfit mt-2"
          >
            {showDetails ? 'Hide Details' : 'Order Details'}
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="mt-4 flex flex-col md:flex-row justify-between">
          <div className='p-4'>
            {order.lineItems.nodes.map((item, index) => (
              <div key={index} className="flex  mb-4">
                {item.variant?.image?.url ? (
                  <img
                    src={item.variant.image.url}
                    alt={item.variant.image.altText || item.title}
                    className="w-16 h-16 mr-4 rounded-[8px]"
                  />
                ) : (
                  <div className="w-16 h-16 mr-4 rounded-[8px] bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
                <div className='outfit flex items-start justify-between w-full'>
                  <div>
                    <p className="text-primary text-[18px] leading-[19px] font-normal">{item.title}</p>
                    <p className='text-[14px] outfit font-light text-primary'>18K White Gold Borealis Diamond 6mm </p>
                    <p className="text-[#B0B0B0] flex items-center space-x-2.5 text-[12px]">
                      <div>Size: 19.00</div>
                      <div>1 item</div>
                    </p>
                  </div>
                  <Money data={order.currentTotalPrice} as="span" className="text-primary font-semibold" />
                </div>
              </div>
            ))}
            <div className="mt-4 outfit">
              <p className="text-primary mb-3 text-[16px] outfit font-light">Order Summary</p>
              <div className="flex justify-between text-primary">
                <span className='text-[14px] font-light outfit text-[#6D6D6D]'>Subtotal</span>
                <Money data={order.currentTotalPrice} as="span" />
              </div>
              <div className="flex justify-between text-primary">
                <span className='text-[14px] font-light outfit text-[#6D6D6D]'>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-primary font-semibold mt-2">
                <span className='text-[14px] font-light outfit'>Order Total</span>
                <Money className='text-[18px] outfit font-normal' data={order.currentTotalPrice} as="span" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-[220px] gradient-border-input font-light outfit p-3.5 bg-[#f6f6f6] border-[#D1D1D1]">
            <p className="outfit text-primary text-[16px]">Order Details</p>
            <div className='mb-3'>
              <p className="text-[#6D6D6D] text-[14px]">Full Name:</p>
              <p className='text-primary text-[16px]'>
                {order.billingAddress?.firstName} {order.billingAddress?.lastName}
              </p>
            </div>
            <div className='mb-3'>
              <p className="text-[#6D6D6D] text-[14px]">Phone number:</p>
              <p className='text-primary text-[16px]'>{order.billingAddress?.phone || ''}</p>
            </div>
            <div className='mb-3'>
              <p className="text-[#6D6D6D] text-[14px]">Address:</p>
              <p className='text-primary text-[16px]'>
                {order.billingAddress?.address1 || ''}
              </p>
            </div>
            <div className='mb-3'>
              <p className="text-[#6D6D6D] text-[14px]">Payment Method:</p>
              <p className='text-primary text-[16px]'>
                {order.financialStatus?.toLowerCase().replace('_', ' ') || ''}
              </p>
            </div>
            <div className='mb-3'>
              <p className="text-[#6D6D6D] text-[14px]">Shipping method:</p>
              <p className='text-primary text-[16px]'>
                {order.fulfillmentStatus?.toLowerCase().replace('_', ' ') || ''}
              </p>
            </div>
          </div>  
        </div>
      )}
    </div>
  );
}

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    currentTotalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    id
    lineItems(first: 10) {
      nodes {
        title
        variant {
          image {
            url
            altText
            height
            width
          }
        }
      }
    }
    orderNumber
    customerUrl
    statusUrl
    processedAt
    billingAddress {
      address1
      firstName
      lastName
      phone
      name
    }
  }
` as const;

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    numberOfOrders
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_FRAGMENT}
  query CustomerOrders(
    $country: CountryCode
    $customerAccessToken: String!
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerOrders
    }
  }
` as const;