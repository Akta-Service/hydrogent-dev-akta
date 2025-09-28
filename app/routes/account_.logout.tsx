import {data, redirect, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Logout'}];
};

export async function loader() {
  return redirect('/account/login');
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;

  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  // Clear the customer access token
  session.unset('customerAccessToken');

  // Return headers to invalidate cache and force revalidation
  return redirect('/', {
    headers: {
      'Set-Cookie': await session.commit(), // Commit session changes
      'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching
    },
  });
}

export default function Logout() {
  return null;
}