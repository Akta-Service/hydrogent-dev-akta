import { Money, type OptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

export function CartSummary({
  cart,
  layout,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>; // Use OptimisticCart type
  layout: 'page' | 'aside';
}) {
  const className = layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary " className={className}>
      <div className='pt-6'>
        <ul>
          <li className='mb-3 flex items-center justify-between text-[15px] outfit font-semibold text-primary uppercase'>
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
       </li>
       <li className='flex items-center justify-between text-[15px] outfit font-semibold text-primary uppercase'>
        <dt>Total</dt>
        <dd>
          {cart?.cost?.totalAmount?.amount ? (
            <Money data={cart.cost.totalAmount} />
          ) : (
            '-'
          )}
        </dd>
        </li>
        </ul>
      </div>
    </div>
  );
}