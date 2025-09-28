import {Link} from '@remix-run/react';
import {
  CartForm,
  Image,
  Money,
  type OptimisticCartLine,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import deleteIcon from '~/assets/images/svg/delete.svg';
import {useVariantUrl} from '~/lib/variants';
type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
}: {
  layout: 'page' | 'aside';
  line: CartLine;
}) {
  const {id, merchandise, isOptimistic} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  return (
    <li key={id} className="cart-line flex items-start justify-between mb-4">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={80}
          loading="lazy"
          width={80}
        />
      )}
      <div className="cart-line-details px-6">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              window.location.href = lineItemUrl;
            }
          }}
        >
          <p className="text-[16px] text-primary outfit font-medium">
            {product.title}
          </p>
        </Link>
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <div className="text-[13px] leading-[15px] outfit font-light text-primary">
                <p>
                  {option.name}: {option.value}
                  {/* 18K White Gold Borealis Diamond 6mm  */}
                </p>
                {/* <p className='mt-2'>Size: 19.00</p> */}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-primary text-[16px] playfairsb text-right">
          <CartLinePrice line={line} as="p" />
        </p>
      </div>
      <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
    </li>
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
      fetcherKey={['LinesRemove', ...lineIds].join('-')}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="cursor-pointer w-[20px]"
      >
        <img src={deleteIcon} alt="dd" width="20px" />
      </button>
    </CartForm>
  );
}

function CartLinePrice({
  line,
  as: Component = 'p',
}: {
  line: CartLine;
  as?: React.ElementType;
}) {
  if (!line?.cost?.totalAmount) return null;

  return (
    <Component>
      <Money withoutTrailingZeros data={line.cost.totalAmount} />
    </Component>
  );
}
function getUpdateKey(action: string, lineIds: string[]) {
  return [action, ...lineIds].join('-');
}
