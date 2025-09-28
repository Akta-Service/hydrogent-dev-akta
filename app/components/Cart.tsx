import {Link} from '@remix-run/react';
import {
  CartForm,
  Image,
  Money,
  OptimisticCartLine,
  useOptimisticCart,
  type OptimisticCart,
} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import deleteSign from '~/assets/images/svg/delete.svg';
import signMain from '~/assets/images/svg/explabation.svg';
import {useVariantUrl} from '~/lib/variants';
// Icons
import backIcon from '~/assets/images/svg/backto.svg';
import shopifyIcon from '~/assets/images/svg/cartt.svg';
import freeIcon from '~/assets/images/svg/free.svg';
import orderIcon from '~/assets/images/svg/freeship.svg';
import guaranteeIcon from '~/assets/images/svg/ggurantee.svg';
import secureIcon from '~/assets/images/svg/secure.svg';
import {MultipassCheckoutButton} from './MultipassCheckoutButton';
import Button from './ui/buttons/Button';
// import { solitaireShape } from '~/assets/images/demo/solitaire.png';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(
      cart?.discountCodes?.filter((code: any) => code.applicable)?.length,
    );
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartDetails cart={cart} layout={layout} />
      here
      <CartEmpty hidden={linesCount} layout={layout} />
    </div>
  );
}

function CartDetails({
  layout,
  cart,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: 'page' | 'aside';
}) {
  const cartHasItems = cart?.totalQuantity && cart?.totalQuantity > 0;

  return (
    <>
      <div className="mb-6 text-[18px] md:text-[24px] cartintro pt-6 flex items-center playfairsb text-primary">
        <Link to="/" className="text-primary flex items-center">
          <Image src={backIcon} alt="" width="14px" />
          &nbsp; Shopping Bag
        </Link>
        &nbsp; ({cart?.totalQuantity} items)
      </div>
      <div className="cart-details flex w-full gap-x-4 md:flex-row flex-col">
        <div className="md:w-[70%] w-full">
          <div className="w-full py-2 px-6 border border-[#454545] rounded-[15px] mb-6">
            <h6 className="md:text-[18px] text-[16px] mb-3 outfit font-normal text-primary">
              Free exchange & return within 30 days except for personalised
              products and fragrances.
            </h6>
            <p className="text-[13px] md:text-[16px] outfit font-light text-primary">
              Please note that the carat weight, number of stones and product
              dimensions will vary based on the size of the creation you order.
              For detailed information please contact us.
            </p>
          </div>
          {cartHasItems && (
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesRemove}
              inputs={{
                lineIds: cart?.lines?.nodes?.map((line) => line.id) || [],
              }}
            >
              <button
                type="submit"
                className="flex items-center ml-auto mb-4 cursor-pointer text-[13px] outfit font-light text-[#FF2B2F]"
                disabled={!cartHasItems}
              >
                <Image width="20px" src={deleteSign} alt="delete" />
                <span className="pl-2">Delete all</span>
              </button>
            </CartForm>
          )}
          <CartLines lines={cart?.lines?.nodes} layout={layout} />
        </div>
        <div className="bg-[#f6f6f6] max-w-[344px] rounded-[8px] p-6 md:w-[30%] w-full">
          {cartHasItems && (
            <CartSummary cost={cart.cost} layout={layout}>
              <CartDiscounts discountCodes={cart.discountCodes} />
              <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
            </CartSummary>
          )}
          <div className=" md:max-w-[344px] max-w-full rounded-[8px] w-full mt-4">
            <ul>
              <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
                <span className="w-[35px]">
                  <img src={orderIcon} alt="" aria-hidden="true" />
                </span>
                <span>Free Shipping for all orders</span>
              </li>
              <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
                <span className="w-[35px]">
                  <img src={freeIcon} alt="" aria-hidden="true" />
                </span>
                <span>Secure payment</span>
              </li>
              <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
                <span className="w-[35px]">
                  <img src={secureIcon} alt="" aria-hidden="true" />
                </span>
                <span>Free Signature Gift Box</span>
              </li>
              <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
                <span className="w-[35px]">
                  <img src={guaranteeIcon} alt="" aria-hidden="true" />
                </span>
                <span>30 Day Full Money Back Guarantee</span>
              </li>
              <li className="flex items-center text-[16px] outfit font-light text-primary mb-[16px]">
                <span className="w-[45px]">
                  <img src={shopifyIcon} alt="" aria-hidden="true" />
                </span>
                <span>Shop with confidence: Encrypted shopping by Shopify</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartLine[];
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul>
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise, attributes} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  const ringSize =
    attributes?.find((attr) => attr.key === 'Ring Size')?.value ||
    'Not specified';

  return (
    <li
      key={id}
      className="cart-line bg-[#f6f6f6] p-[15px] rounded-[10px] mb-4"
    >
      <div className="flex align-start w-full">
        <div className="w-[80px] h-[80px]">
          {image && (
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={80}
              loading="lazy"
              width={80}
              className="rounded-md"
            />
          )}
        </div>

        <div className="w-full px-4">
          <div className="flex items-start justify-between">
            <div className="max-w-[672px] w-full">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                className="text-primary"
                onClick={() => {
                  if (layout === 'aside') {
                    window.location.href = lineItemUrl;
                  }
                }}
              >
                <p className="md:mb-2 text-[18px] outfit text-primary font-normal">
                  {product.title}
                </p>
              </Link>
              <p className="md:text-[16px] text-[13px] leading-[16px] outfit font-light text-primary">
                Ring Size: {ringSize}
              </p>
              <div className="flex gap-4">
                <p className="py-4 text-[14px] outfit font-light text-primary">
                  <Link to="/">+ Add Another</Link>
                </p>
              </div>
            </div>
            <div className="flex space-x-4 md:flex-row flex-col-reverse h-[87px] md:h-auto justify-between items-end md:justify-start md:items-start">
              <CartLinePrice line={line} as="span" />
              {/* <button className='cursor-pointer w-[20px]'><img src={deleteSign} alt='' /></button> */}
              <CartLineRemoveButton
                lineIds={[id]}
                disabled={!!line.isOptimistic}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border border-[#3D3D3D] rounded-md p-4 flex md:flex-row flex-col items-center justify-between">
        <div className="flex items-center w-full">
          <img src={signMain} alt="" />
          <p className="pl-2 text-[18px] outfit font-regular text-primary">
            Insurance
          </p>
        </div>
        <div className="flex items-center w-full justify-end">
          <p className="mr-[15px] total text-[16px] outfit font-light text-primary">
            from $100
          </p>
          <button className="cursor-pointer rounded-lg border  py-[13px] px-[18px] uppercase text-[16px] outfit font-semibold text-primary border-primary">
            Choose
          </button>
        </div>
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <MultipassCheckoutButton checkoutUrl={checkoutUrl}>
      <Button className="w-full flex">Proceed to checkout</Button>
    </MultipassCheckoutButton>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost?: OptimisticCart<CartApiQueryFragment | null>['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="mb-10">
        <ul>
          <li className="flex w-full items-center justify-between">
            <div className="text-[16px] outfit font-light text-primary">
              Subtotal
            </div>
            <div className="text-[18px] outfit font-regular text-primary">
              {' '}
              {cost?.subtotalAmount?.amount ? (
                <Money data={cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </div>
          </li>
          <li className="flex w-full items-center justify-between">
            <div className="text-[16px] outfit font-light text-primary">
              Delivery
            </div>
            <div className="text-[18px] outfit font-regular text-primary">
              Free
            </div>
          </li>
          <li className="flex w-full items-center justify-between">
            <div className="text-[16px] outfit font-light text-primary">
              Total
            </div>
            <div className="text-[18px] outfit font-regular text-primary">
              -
            </div>
          </li>
        </ul>
      </div>

      {children}
      <div className="flex items-center w-full py-6">
        <span className="h-[1px] w-[120px] bg-[#3D3D3D]"></span>
        <p className="px-4 text-[13px] outfit font-light text-[#B0B0B0]">Or</p>
        <span className="h-[1px] w-[120px] bg-[#3D3D3D]"></span>
      </div>
      <button className="flex items-center cursor-pointer h-[45px] w-full bg-[#454545] text-white text-[15px] outfit font-semibold uppercase rounded-md">
        Check out with PayPal
      </button>
      <div className="my-10 h-[1px] w-full bg-[#3D3D3D]"></div>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="cursor-pointer w-[20px]"
      >
        <img src={deleteSign} alt="dd" width="20px" />
      </button>
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount)
    return <div style={{visibility: 'hidden'}}>&nbsp;</div>;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return <div style={{visibility: 'hidden'}}>&nbsp;</div>;
  }

  return (
    <>
      <Money
        className="mr-[0] md:mr-2 md:ml-auto ml-[35px] playfairsb text-[18px] text-primary"
        withoutTrailingZeros
        {...passthroughProps}
        data={moneyV2}
      />
    </>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you havent added anything yet, lets get you started!
        uhuhunasdsad
      </p>
      <br />
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
