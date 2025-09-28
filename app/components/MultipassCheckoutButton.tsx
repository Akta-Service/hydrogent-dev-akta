// import React, {useCallback} from 'react';
// import {multipass} from '~/lib/multipass/multipass';

// type MultipassCheckoutButtonProps = {
//   checkoutUrl: string;
//   children: React.ReactNode;
//   onClick?: () => void;
//   redirect?: boolean;
// };

// /*
//   This component attempts to persist the customer session
//   state in the checkout by using multipass.
//   Note: multipass checkout is a Shopify Plus+ feature only.
// */
// export function MultipassCheckoutButton(props: MultipassCheckoutButtonProps) {
//   const {children, onClick, checkoutUrl, redirect = true} = props;

//   const checkoutHandler = useCallback(
//     async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//       event.preventDefault();
//       if (!checkoutUrl) return;

//       if (typeof onClick === 'function') {
//         onClick();
//       }

//       /*
//        * If they user is logged in we persist it in the checkout,
//        * otherwise we log them out of the checkout too.
//        */
//       return await multipass({return_to: checkoutUrl, redirect});
//     },
//     [redirect, checkoutUrl, onClick],
//   );

//   return <button onClick={checkoutHandler}>{children}</button>;
// }
import React, { useCallback } from 'react';
import { multipass } from '~/lib/multipass/multipass';

type MultipassCheckoutButtonProps = {
  checkoutUrl: string;
  children: React.ReactNode;
  onClick?: () => void;
  redirect?: boolean;
  guest?: boolean; // New prop to enable guest checkout
};

/*
  This component attempts to persist the customer session
  state in the checkout by using multipass, or allows guest checkout.
  Note: multipass checkout is a Shopify Plus+ feature only.
*/
export function MultipassCheckoutButton(props: MultipassCheckoutButtonProps) {
  const { children, onClick, checkoutUrl, redirect = true, guest = true } = props;

  const checkoutHandler = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      if (!checkoutUrl) return;

      if (typeof onClick === 'function') {
        onClick();
      }

      // For guest checkout, skip multipass and redirect to checkoutUrl
      if (guest) {
        if (redirect) {
          window.location.href = checkoutUrl;
          return;
        }
        return; // No data to return for guest checkout
      }

      /*
       * If the user is logged in, we persist it in the checkout using multipass,
       * otherwise we redirect to the checkout URL (guest checkout fallback).
       */
      return await multipass({ return_to: checkoutUrl, redirect });
    },
    [redirect, checkoutUrl, onClick, guest],
  );

  return <button onClick={checkoutHandler}>{children}</button>;
}