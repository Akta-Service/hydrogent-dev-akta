import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const checkoutDomain =
    context.env.PUBLIC_CHECKOUT_DOMAIN || 'checkout.shopify.com';
  const storeDomain =
    context.env.PUBLIC_STORE_DOMAIN || 'mystore.myshopify.com';
  const metaPixelId = context.env.PUBLIC_META_PIXEL_ID || '';

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {checkoutDomain, storeDomain},
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'http://localhost:*',
      'https://assets.calendly.com',
      'https://static.klaviyo.com',
      'https://static-tracking.klaviyo.com',
      'https://connect.facebook.net',
      "'sha256-3bzWVxQE32IZQKH9eh8KzyHuhXOlMrboDVVBRd0fWTU='",
      "'sha256-kYPzjvO1Kc0pFQRynaue/HrMrLFfsMov2jicrdicK9k='",
      'https://code.tidio.co',
      'http://code.tidio.co',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      "'unsafe-eval'",
      'https://api.judge.me',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'http://localhost:*',
      'https://fonts.googleapis.com',
      'https://code.tidio.co',
      'http://code.tidio.co',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      'https://api.judge.me',
      'https://static.klaviyo.com',
      'https://use.typekit.net/',
      'https://p.typekit.net',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
      'https://cdn.shopify.com',
      'data:',
      'https://code.tidio.co',
      'http://code.tidio.co',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      'https://api.judge.me',
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://checkout.shopify.com',
      `https://${storeDomain}`,
      'http://localhost:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'ws://*.tryhydrogen.dev:*',
      'https://a.klaviyo.com',
      'https://fast.a.klaviyo.com',
      'https://static-forms.klaviyo.com',
      'https://graph.facebook.com',
      'https://*.facebook.com',
      'https://capig.datah04.com',
      'https://bellodiamonds.com',
      'https://inventory.nyc3.cdn.digitaloceanspaces.com/',
      'https://calendly.com',
      'https://code.tidio.co',
      'http://code.tidio.co',
      'wss://socket.tidio.co',
      'https://api.belloDiamonds.com',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      'https://tracking.aws.judge.me',
      'https://api.judge.me',
      'https://use.typekit.net',
      'https://p.typekit.net',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://*.facebook.com',
      'https://cdn.shopify.com',
      'https://connect.facebook.net',
      'https://cdnjs.cloudflare.com',
      'https://res.cloudinary.com',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      'https://judgeme-public-images.imgix.net',
      'https://api.judge.me',
    ],
    frameSrc: [
      "'self'",
      'https://inventory.nyc3.cdn.digitaloceanspaces.com/',
      'https://www.facebook.com/',
      'https://calendly.com',
      'https://loupe360.com',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      'https://api.judge.me',
      'https://www.youtube.com',
    ],
    mediaSrc: [
      "'self'",
      'https://code.tidio.co',
      'http://code.tidio.co',
      'https://cdn.shopify.com',
      'https://cdnwidget.judge.me',
      'https://cache.judge.me',
      'https://api.judge.me',
    ],
    upgradeInsecureRequests: false,
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <html lang="en">
        <head>
          <meta
            name="facebook-domain-verification"
            content="j9ud2zp41jo2gk19hl6ge92fg6zftx"
          />
          <script
            id="meta-pixel-init"
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
              `,
            }}
          />
          {typeof window !== 'undefined' &&
            window?.location?.hostname?.includes("bellodiamonds") &&
            metaPixelId && (
              <>
                <script
                  id="meta-pixel-track"
                  nonce={nonce}
                  dangerouslySetInnerHTML={{
                    __html: `fbq('init', '${metaPixelId}'); fbq('track', 'PageView');`,
                  }}
                />
                <noscript>
                  <img
                    height="1"
                    width="1"
                    style={{display: 'none'}}
                    src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                    alt=""
                  />
                </noscript>
              </>
            )}
        </head>
        <body>
          <RemixServer context={remixContext} url={request.url} nonce={nonce} />
        </body>
      </html>
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error('SSR Error:', error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);
  responseHeaders.set('Cache-Control', 'public, max-age=300');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
