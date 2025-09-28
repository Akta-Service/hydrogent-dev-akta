export function getFacebookClickId(): string | null {
  if (typeof window === "undefined") return null

  const urlParams = new URLSearchParams(window.location.search)
  const fbclid = urlParams.get("fbclid")

  if (fbclid) {
    localStorage.setItem("_fbc", `fb.1.${Date.now()}.${fbclid}`)
    return `fb.1.${Date.now()}.${fbclid}`
  }

  const storedFbc = localStorage.getItem("_fbc")
  return storedFbc
}

export function getFacebookBrowserId(): string | null {
  if (typeof window === "undefined") return null

  const fbp = getCookie("_fbp")
  if (fbp) return fbp

  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const generatedFbp = `fb.1.${timestamp}.${random}`

  setCookie("_fbp", generatedFbp, 90)
  return generatedFbp
}

export function getFacebookLoginId(): string | null {
  if (typeof window === "undefined") return null

  return localStorage.getItem("facebook_login_id") || null
}

export function generateExternalId(): string {
  let externalId = localStorage.getItem("external_id")

  if (!externalId) {
    externalId = `ext_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem("external_id", externalId)
  }

  return externalId
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

export function collectFacebookParams() {
  return {
    clickId: getFacebookClickId(),
    browserId: getFacebookBrowserId(),
    facebookLoginId: getFacebookLoginId(),
    externalId: generateExternalId(),
  }
}