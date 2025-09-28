import {Link} from '@remix-run/react';
import {Image, useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import Button from './ui/buttons/Button';

import cartArrowImg from '~/assets/images/svg/arrow_right_cart.svg';
import emptyCart from '~/assets/images/svg/emptycart.svg';
import {MultipassCheckoutButton} from './MultipassCheckoutButton';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity && cart?.totalQuantity > 0;
  console.log('firstffff', linesCount);
  return (
    <div className={`cart-main ${withDiscount ? 'with-discount' : ''}`}>
      {/* <h2 className='text-[24px] playfairsb text-primary'>Shopping Bag ({cart?.totalQuantity || 0} items)</h2> */}
      <CartEmpty hidden={linesCount} layout={layout} />

      <div className="cart-details">
        <div
          aria-labelledby="cart-lines gg"
          className="cart-scroll-wrapper max-h-[350px] overflow-y-auto pr-2"
        >
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && (
          <div className="cart-footer border-t border-[#d1d1d1] ">
            <CartSummary cart={cart} layout={layout} />
            <div className="checkout-actions text-center mt-4">
              <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
              {/* <Button className='w-full'>Proceed to Checkout </Button> */}
              <Link to="/">
                <p className="mt-6 text-[15px] outfit font-semibold text-center text-primary">
                  CONTINUE SHOPPING
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <MultipassCheckoutButton checkoutUrl={checkoutUrl}>
      <Button className="w-full px-10 flex justify-center">
        Proceed to checkout
      </Button>
    </MultipassCheckoutButton>
  );
}

function CartEmpty({
  hidden = false,
  layout = 'page',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden} className="flex items-center flex-col py-[60px]">
      <div className="gradient-border-cart flex justify-center h-[135px] w-[135px] items-center shadow-[0px_0px_10.08px_-2px_#ffffff]">
        <Image src={emptyCart} alt="" width="63px" />
      </div>
      <h4 className="text-[24px] text-primary playfairsb text-center mb-6 mt-8">
        Empty cart
      </h4>
      <p className="text-[14px] outfit text-center font-light text-primary mb-8 px-5">
        You didnt add any item to your cart. We invite you to visit our store to
        make your delightful choice!
      </p>
      <Link
        to="/collections"
        className="flex w-full continue-btn"
        prefetch="viewport"
      >
        <Button className="w-full flex items-center justify-center">
          Return to shop &nbsp;
          <Image width="11px" src={cartArrowImg} alt="" />
        </Button>
      </Link>
    </div>
  );
}
