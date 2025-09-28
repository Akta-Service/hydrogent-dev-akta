import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { useLoaderData,json } from '@remix-run/react';

export async function loader({request}: LoaderFunctionArgs) {
  const pathname = new URL(request.url).pathname;
  return json({pathname}, {status: 404});
}

export default function CatchAllPage() {
  const {pathname} = useLoaderData<typeof loader>();
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black transition-colors duration-300">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 text-center">
        <h1 className="mb-6 text-8xl lg:text-9xl font-extrabold tracking-tight animate-pulse text-primary-600 dark:text-primary-400">
          404
        </h1>
        <p className="mb-4 text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Page Not Found: {pathname}
        </p>
        <p className="mb-8 text-lg font-light text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {`Sorry, we couldn't find the page you're looking for. Explore our homepage to find what you need!`}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400"
        >
          Back to Homepage
        </a>
      </div>
    </section>
  );
}