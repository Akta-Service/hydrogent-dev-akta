export interface OAuthUserData {
  id: string
  email: string
  name?: string
  first_name?: string
  last_name?: string
  given_name?: string
  family_name?: string
  picture?: string
}

export interface OAuthProvider {
  name: "google" | "facebook"
  clientId: string
  clientSecret: string
  redirectUri: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
}

export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    name: "google",
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/account/auth/google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
  },
  facebook: {
    name: "facebook",
    clientId: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/account/auth/facebook",
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    userInfoUrl: "https://graph.facebook.com/me",
  },
}

interface TokenResponse {
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

interface FacebookUserData {
  id: string
  email: string
  name?: string
  first_name?: string
  last_name?: string
}

export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string,
): Promise<{ access_token: string; token_type: string; expires_in?: number }> {
  const response = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: provider.redirectUri,
    }),
  })

  const data = (await response.json()) as TokenResponse

  if (!response.ok || !data.access_token) {
    throw new Error(`Failed to exchange code for token: ${data.error_description || data.error || "Unknown error"}`)
  }

  return {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
  }
}

export async function fetchUserInfo(provider: OAuthProvider, accessToken: string): Promise<OAuthUserData> {
  let url = provider.userInfoUrl

  if (provider.name === "facebook") {
    url += "?fields=id,name,email,first_name,last_name"
  }

  url += `${provider.name === "facebook" ? "&" : "?"}access_token=${accessToken}`

  const response = await fetch(url)

  const data =
    provider.name === "google"
      ? ((await response.json()) as GoogleUserData)
      : ((await response.json()) as FacebookUserData)

  if (!response.ok || !data.email) {
    throw new Error(`Failed to fetch user info: ${(data as any).error?.message || "Unknown error"}`)
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    first_name: provider.name === "facebook" ? (data as FacebookUserData).first_name : undefined,
    last_name: provider.name === "facebook" ? (data as FacebookUserData).last_name : undefined,
    given_name: provider.name === "google" ? (data as GoogleUserData).given_name : undefined,
    family_name: provider.name === "google" ? (data as GoogleUserData).family_name : undefined,
    picture: provider.name === "google" ? (data as GoogleUserData).picture : undefined,
  }
}

export function generateOAuthUrl(provider: OAuthProvider, state?: string): string {
  const url = new URL(provider.authUrl)
  url.searchParams.set("client_id", provider.clientId)
  url.searchParams.set("redirect_uri", provider.redirectUri)
  url.searchParams.set("response_type", "code")

  if (provider.name === "google") {
    url.searchParams.set("scope", "email profile")
    url.searchParams.set("access_type", "offline")
  } else if (provider.name === "facebook") {
    url.searchParams.set("scope", "email,public_profile")
  }

  if (state) {
    url.searchParams.set("state", state)
  }

  return url.toString()
}
