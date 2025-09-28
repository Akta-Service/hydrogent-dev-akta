/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
type CapiEvent = {
  eventTime: number
  eventId?: string
  userData: {
    clientIpAddress: string
    clientUserAgent: string
    email?: string
    phone?: string
    clickId?: string
    browserId?: string
    externalId?: string
    facebookLoginId?: string
    firstName?: string
    lastName?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  customData?: Record<string, any>
  eventSourceUrl?: string
  actionSource?: "email" | "website" | "phone_call" | "chat" | "physical_store" | "system_generated" | "other"
}

type LeadCapiEvent = CapiEvent & {
  customData: {
    currency: string
    value: string | number
  }
  attributionData?: {
    attribution_share: string
  }
  originalEventData?: {
    event_name: string
    event_time: number
  }
}

function extractClientIP(request: Request): string {
  const ipHeaders = [
    "cf-connecting-ip",
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "x-cluster-client-ip",
    "x-forwarded",
    "forwarded-for",
    "forwarded",
    "true-client-ip",
    "fastly-client-ip",
    "x-azure-clientip",
    "x-azure-socketip",
  ]

  for (const header of ipHeaders) {
    const value = request.headers.get(header)
    if (value) {
      const ips = value.split(",").map((ip) => ip.trim())
      for (const ip of ips) {
        const cleanIP = validateAndCleanIP(ip)
        if (cleanIP) {
          return cleanIP
        }
      }
    }
  }

  return "ip-not-available"
}

function validateAndCleanIP(ip: string): string | null {
  if (!ip || ip.trim() === "") return null

  const trimmedIP = ip.trim()
  const invalidValues = ["unknown", "undefined", "null", "0.0.0.0"]
  if (invalidValues.includes(trimmedIP.toLowerCase())) return null

  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$/

  if (ipv4Regex.test(trimmedIP) || ipv6Regex.test(trimmedIP)) {
    if (process.env.NODE_ENV === "development") {
      return trimmedIP
    }

    const privateIPRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ]

    const isPrivate = privateIPRanges.some((range) => range.test(trimmedIP))
    if (!isPrivate) {
      return trimmedIP
    }
  }

  return null
}

export function getClientIPWithFallback(request: Request): string {
  const detectedIP = extractClientIP(request)
  if (detectedIP && detectedIP !== "ip-not-available") {
    return detectedIP
  }

  if (process.env.NODE_ENV === "development") {
    return "203.0.113.1"
  }

  const vercelIP = request.headers.get("x-vercel-forwarded-for")
  const netlifyIP = request.headers.get("x-nf-client-connection-ip")

  if (vercelIP) return vercelIP.split(",")[0].trim()
  if (netlifyIP) return netlifyIP.split(",")[0].trim()

  return "ip-not-available"
}

export async function sendCapiEvent(context: any, eventName: string, data: CapiEvent) {
    if(!window.location.hostname.includes("bellodiamonds")) return;

  const accessToken = context.env.KLAVIYO_PUBLIC_API_KEY
  const pixelId = context.env.PUBLIC_META_PIXEL_ID
  
 

  if (!pixelId || !accessToken) {
    console.warn("Meta Pixel ID or Access Token not configured")
    return
  }

  try {
    const userData: any = {
      client_user_agent: data.userData.clientUserAgent,
      client_ip_address: data.userData.clientIpAddress || "ip-not-available",
    }

    if (data.userData.clickId) {
      userData.fbc = data.userData.clickId
    }

    if (data.userData.browserId) {
      userData.fbp = data.userData.browserId
    }

    if (data.userData.externalId) {
      userData.external_id = data.userData.externalId
    }

    if (data.userData.email) {
      userData.em = [await hashEmail(data.userData.email)]
    }

    if (data.userData.phone) {
      userData.ph = [await hashPhone(data.userData.phone)]
    }

    if (data.userData.firstName) {
      userData.fn = [await hashString(data.userData.firstName)]
    }

    if (data.userData.lastName) {
      userData.ln = [await hashString(data.userData.lastName)]
    }

    if (data.userData.city) {
      userData.ct = [await hashString(data.userData.city)]
    }

    if (data.userData.state) {
      userData.st = [await hashString(data.userData.state)]
    }

    if (data.userData.zipCode) {
      userData.zp = [await hashString(data.userData.zipCode)]
    }

    if (data.userData.country) {
      userData.country = [await hashString(data.userData.country)]
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: data.eventTime,
          event_id: `${eventName}_${data.eventTime}_${Date.now()}`,
          event_source_url: data.eventSourceUrl || "",
          action_source: data.actionSource || "website",
          user_data: userData,
          // custom_data: data.customData || {},
        },
      ],
      access_token: accessToken,
    }

    const response = await fetch(`https://graph.facebook.com/v23.0/${pixelId}/events`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("CAPI Error:", response.status, errorText)
      throw new Error(`CAPI request failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("CAPI Event sent successfully:", JSON.stringify(result, null, 2))
    return result
  } catch (error) {
    console.error("Failed to send CAPI event:", error)
    throw error
  }
}

export async function sendLeadCapiEvent(context: any, data: LeadCapiEvent) {
    if(!window.location.hostname.includes("bellodiamonds")) return;
  const accessToken = context.env.PUBLIC_META_CAPI_TOKEN
  const pixelId = context.env.PUBLIC_META_PIXEL_ID

  if (!pixelId || !accessToken) {
    console.warn("Meta Pixel ID or Access Token not configured")
    return
  }

  try {
    const userData: any = {
      client_user_agent: data.userData.clientUserAgent,
      client_ip_address: data.userData.clientIpAddress || "ip-not-available",
    }

    if (data.userData.email) {
      userData.em = [await hashEmail(data.userData.email)]
    } else {
      userData.em = [null]
    }

    if (data.userData.phone) {
      userData.ph = [await hashPhone(data.userData.phone)]
    } else {
      userData.ph = [null]
    }

    if (data.userData.clickId) {
      userData.fbc = data.userData.clickId
    }

    if (data.userData.facebookLoginId) {
      userData.fb_login_id = data.userData.facebookLoginId
    }

    if (data.userData.browserId) {
      userData.fbp = data.userData.browserId
    }

    if (data.userData.externalId) {
      userData.external_id = data.userData.externalId
    }

    const eventData: any = {
      event_name: "Lead",
      event_time: data.eventTime || null,
      event_id: `Lead_${data.eventTime}_${Date.now()}`,
      action_source: data.actionSource || "email",
      user_data: userData,
      // custom_data: {
        // currency: data.customData.currency,
        // value: data.customData.value.toString(),
      // },
    }

    if (data.attributionData) {
      eventData.attribution_data = data.attributionData
    }

    if (data.originalEventData) {
      eventData.original_event_data = data.originalEventData
    }

    const payload = {
      data: [eventData],
    }

    const response = await fetch(`https://graph.facebook.com/v23.0/${pixelId}/events`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Lead CAPI Error:", response.status, errorText)
      throw new Error(`Lead CAPI request failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("Enhanced Lead CAPI Event sent successfully:", JSON.stringify(result))
    return result
  } catch (error) {
    console.error("Failed to send Lead CAPI event:", error)
    throw error
  }
}

async function hashString(input: string): Promise<string> {
  if (!input) return ""
  const encoder = new TextEncoder()
  const data = encoder.encode(input.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

async function hashEmail(email: string): Promise<string> {
  if (!email) return ""
  return hashString(email.trim().toLowerCase())
}

async function hashPhone(phone: string): Promise<string> {
  if (!phone) return ""
  const cleanPhone = phone.replace(/\D/g, "")
  return hashString(cleanPhone)
}

export async function trackPurchase(
  context: any,
  data: CapiEvent & {
    customData: {
      value: number
      currency: string
      content_ids?: string[]
      content_type?: string
      num_items?: number
    }
  },
) {
    if(window.location.hostname.includes("bellodiamonds"))
  return sendCapiEvent(context, "Purchase", data)
}

export async function trackAddToCart(
  context: any,
  data: CapiEvent & {
    customData: {
      value: number
      currency: string
      content_ids?: string[]
      content_type?: string
    }
  },
) {
  return sendCapiEvent(context, "AddToCart", data)
}

export async function trackInitiateCheckout(
  context: any,
  data: CapiEvent & {
    customData: {
      value: number
      currency: string
      content_ids?: string[]
      num_items?: number
    }
  },
) {
    if(window.location.hostname.includes("bellodiamonds"))
  return sendCapiEvent(context, "InitiateCheckout", data)
}

export async function trackLead(context: any, data: LeadCapiEvent) {
  return sendLeadCapiEvent(context, data)
}

export async function trackPageView(context: any, data: CapiEvent) {
  if(window.location.hostname.includes("bellodiamonds"))
  return sendCapiEvent(context, "PageView", data)
}

export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

export function formatEventTime(timestamp?: number): number {
  if (timestamp) {
    // If timestamp is in milliseconds, convert to seconds
    if (timestamp > 9999999999) {
      return Math.floor(timestamp / 1000)
    }
    return timestamp
  }
  return getCurrentUnixTimestamp()
}

export function generateRandomValue(min = 50, max = 500): string {
  const randomValue = (Math.random() * (max - min) + min).toFixed(2)
  return randomValue
}