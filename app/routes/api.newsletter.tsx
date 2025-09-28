import type { ActionFunctionArgs } from '@shopify/remix-oxygen';
import { json } from '@shopify/remix-oxygen';

// Define the expected shape of the request body
interface RequestBody {
  email?: string;
}

// Define the shape of the Klaviyo API response
interface KlaviyoProfileResponse {
  data: {
    type: string;
    attributes: {
      email: string;
    };
  };
}

// Define the response shape for the action
interface ActionResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

// Extend the context to include environment variables
// interface AppContext extends ActionFunctionArgs['context'] {
//   env: {
//     KLAVIYO_API_KEY?: string;
//   };
// }

export async function action({ request, context }: ActionFunctionArgs) {
  const body = (await request.json()) as RequestBody;
  const email = body?.email?.toString();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json<ActionResponse>({ error: 'A valid email is required' }, { status: 400 });
  }
// @ts-expect-error: KLAVIYO_API_KEY is injected by Oxygen environment
  const apiKey = context.env.KLAVIYO_API_KEY;

  // Check for API key
  if (!apiKey) {
    return json<ActionResponse>({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        revision: '2025-04-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email,
          },
        },
      }),
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      return json<ActionResponse>({ error: `Failed to create profile: ${errorText}` }, { status: profileResponse.status });
    }

    return json<ActionResponse>({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
    });
  } catch (err) {
    console.error('Klaviyo fetch exception:', err);
    return json<ActionResponse>({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}