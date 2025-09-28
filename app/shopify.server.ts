// app/shopify.server.ts
import { createStorefrontClient } from '@shopify/hydrogen';

export const shopify = (request: Request) => {
  const storefrontToken = process.env.PUBLIC_STOREFRONT_API_TOKEN;
  const storeDomain = process.env.PUBLIC_STORE_DOMAIN;

  if (!storefrontToken || !storeDomain) {
    throw new Error(
      'PUBLIC_STOREFRONT_API_TOKEN and PUBLIC_STORE_DOMAIN must be set in environment variables.'
    );
  }

  // Ensure storeDomain is a full URL (e.g., https://your-store.myshopify.com)
  const normalizedStoreDomain = storeDomain.startsWith('http')
    ? storeDomain
    : `https://${storeDomain}`;

  return createStorefrontClient({
    storeDomain: normalizedStoreDomain,
    publicStorefrontToken: storefrontToken,
    storefrontApiVersion: '2025-04',
    // Only include privateStorefrontToken if it's set and needed
    ...(process.env.PRIVATE_STOREFRONT_API_TOKEN && {
      privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
    }),
  });
};