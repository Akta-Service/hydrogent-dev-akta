import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

function ErrorHandler({ error }: { error: Error }) {
  console.error('Hydration error:', error);
  return (
    <div style={{ color: 'red', padding: '20px' }}>
      <h1>Hydration Error</h1>
      <p>{error.message}</p>
    </div>
  );
}

function hydrate() {
  try {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <RemixBrowser />
        </StrictMode>,
      );
    });
  } catch (error) {
    console.error('Hydration failed:', error);
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <ErrorHandler error={error as Error} />
        </StrictMode>,
      );
    });
  }
}

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }
}