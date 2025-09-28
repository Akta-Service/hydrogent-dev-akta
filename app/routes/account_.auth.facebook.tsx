import { redirect, type LoaderFunctionArgs } from "@shopify/remix-oxygen"

// GraphQL mutation for creating OAuth customers
const CUSTOMER_CREATE_OAUTH_MUTATION = `#graphql
  mutation customerCreateOAuth($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const

// Facebook OAuth configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/account/auth/facebook"

interface FacebookTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
  error?: string
  error_description?: string
}

interface FacebookUserData {
  id: string
  email: string
  name?: string
  first_name?: string
  last_name?: string
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error) {
    return redirect("/account/login?error=oauth_cancelled")
  }

  if (!code) {
    // Redirect to Facebook OAuth
    const facebookAuthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth")
    facebookAuthUrl.searchParams.set("client_id", FACEBOOK_APP_ID || "")
    facebookAuthUrl.searchParams.set("redirect_uri", FACEBOOK_REDIRECT_URI)
    facebookAuthUrl.searchParams.set("scope", "email,public_profile")
    facebookAuthUrl.searchParams.set("response_type", "code")

    return redirect(facebookAuthUrl.toString())
  }

  // Exchange code for access token
  try {
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: FACEBOOK_APP_ID || "",
        client_secret: FACEBOOK_APP_SECRET || "",
        code,
        redirect_uri: FACEBOOK_REDIRECT_URI,
      }),
    })

    const tokenData = (await tokenResponse.json()) as FacebookTokenResponse

    if (!tokenData.access_token) {
      throw new Error("Failed to get access token")
    }

    // Get user info from Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name&access_token=${tokenData.access_token}`,
    )

    const userData = (await userResponse.json()) as FacebookUserData

    if (!userData.email) {
      throw new Error("Failed to get user email")
    }

    // Try to find existing customer or create new one
    const { session, storefront } = context

    // Check if we have any existing customer tokens that match this email
    // Since we can't query customers by email directly, we'll just create a new customer
    // In a real implementation, you might want to use a different method to check for existing customers
    
    const { customerCreate } = await storefront.mutate(CUSTOMER_CREATE_OAUTH_MUTATION, {
      variables: {
        input: {
          email: userData.email,
          firstName: userData.first_name || userData.name?.split(" ")[0] || "",
          lastName: userData.last_name || userData.name?.split(" ").slice(1).join(" ") || "",
          acceptsMarketing: false,
        },
      },
    })

    if (customerCreate?.customerUserErrors?.length) {
      // If customer already exists, that's fine - just continue with login
      if (customerCreate.customerUserErrors[0].message.includes('taken')) {
      } else {
        throw new Error(customerCreate.customerUserErrors[0].message)
      }
    }

    // Create session for new customer
    const customerAccessToken = {
      accessToken: `oauth_${Date.now()}_${userData.id}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    session.set("customerAccessToken", customerAccessToken)
    session.set("oauthProvider", "facebook")
    session.set("oauthUserData", userData)

    return redirect("/account", {
      headers: {
        "Set-Cookie": await session.commit(),
      },
    })
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    return redirect("/account/login?error=oauth_failed")
  }
}
