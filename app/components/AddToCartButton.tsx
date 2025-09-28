import { CartForm } from '@shopify/hydrogen';
import { ReactNode } from 'react';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'primary',
  width = 'full',
  disabled,
  analytics,
  ...props
}: {
  children: ReactNode;
  lines: any[];
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  analytics?: unknown;
  [key: string]: any;
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => (
        <button
          type="submit"
          className={`cursor-pointer h-[50px] bg-[#09090A] w-full rounded-[9px] border-gradient-custom text-[15px] outfit font-semibold uppercase text-white ${className}`}
          disabled={disabled ?? fetcher.state !== 'idle'}
          {...props}
        >
          {children}
        </button>
      )}
    </CartForm>
  );
}