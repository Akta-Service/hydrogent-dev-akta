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

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/account/auth/google"

interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
  error?: string
  error_description?: string
}

interface GoogleUserData {
  id: string
  email: string
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error) {
    return redirect("/account/login?error=oauth_cancelled")
  }

  if (!code) {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID || "")
    googleAuthUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI)
    googleAuthUrl.searchParams.set("response_type", "code")
    googleAuthUrl.searchParams.set("scope", "email profile")
    googleAuthUrl.searchParams.set("access_type", "offline")

    return redirect(googleAuthUrl.toString())
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID || "",
        client_secret: GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse

    if (!tokenData.access_token) {
      throw new Error("Failed to get access token")
    }

    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
    )

    const userData = (await userResponse.json()) as GoogleUserData

    if (!userData.email) {
      throw new Error("Failed to get user email")
    }

    const { session, storefront } = context

    // Check if we have any existing customer tokens that match this email
    // Since we can't query customers by email directly, we'll just create a new customer
    // In a real implementation, you might want to use a different method to check for existing customers
    
    try {
      // Always create a new customer for OAuth flows
      // In production, you might implement a better customer lookup mechanism
      
      const { customerCreate } = await storefront.mutate(CUSTOMER_CREATE_OAUTH_MUTATION, {
        variables: {
          input: {
            email: userData.email,
            firstName: userData.given_name || userData.name?.split(" ")[0] || "",
            lastName: userData.family_name || userData.name?.split(" ").slice(1).join(" ") || "",
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

      const customerAccessToken = {
        accessToken: `oauth_${Date.now()}_${userData.id}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      session.set("customerAccessToken", customerAccessToken)
      session.set("oauthProvider", "google")
      session.set("oauthUserData", userData)

      return redirect("/account", {
        headers: {
          "Set-Cookie": await session.commit(),
        },
      })
    } catch (error) {
      console.error("Google OAuth error:", error)
      return redirect("/account/login?error=oauth_failed")
    }
  } catch (error) {
    console.error("Google OAuth outer error:", error)
    return redirect("/account/login?error=oauth_failed")
  }
}
