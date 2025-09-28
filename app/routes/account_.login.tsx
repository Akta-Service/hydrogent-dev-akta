import {
  data,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import LoginModal from '~/components/ui/forms/login';
import { useState } from 'react';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Login'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return redirect('/');
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { session, storefront } = context;

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please make sure to fill in both the email and password fields');
    }

    const { customerAccessTokenCreate } = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: { email, password },
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const { customerAccessToken } = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error: 'An unexpected error occurred' }, { status: 400 });
  }
}

export default function Login() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;
  const [isOpen,setIsOpen]= useState<boolean>(true)
  const close = ()=> {setIsOpen(false); redirect('/')}
  return (
    <LoginModal isOpen={isOpen} onClose={close}/>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
