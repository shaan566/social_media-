import inactivityManager from './InactivityManager'
import tabCommunicator from './TabCommunicator'




const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const fetchWithAuth = async (url, options = {}) => {
  const fullUrl = url.startsWith("http") ? url  // fix: startsWith not startwith
    : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`

  // remove Content-Type for FormData so browser sets boundary automatically
  const headers = options.body instanceof FormData
    ? { ...(options.headers || {}) }
    : { "Content-Type": "application/json", ...(options.headers || {}) }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 401) {
    window.location.href = "/login"  // fix: href not herf
    throw new Error("Unauthorized")
  }

  if (response.status === 204) return null

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "API request failed")
  }

  return response.json()
}

export const get = (url, options = {}) => fetchWithAuth(url, { ...options, method: "GET" })

export const post = (url, body, options = {}) => fetchWithAuth(url, {
  ...options,
  method: "POST",
  body: body instanceof FormData ? body : JSON.stringify(body),
})

export const put = (url, body, options = {}) => fetchWithAuth(url, {
  ...options,
  method: "PUT",
  body: JSON.stringify(body),
})

export const patch = (url, body, options = {}) => fetchWithAuth(url, {
  ...options,
  method: "PATCH",
  body: JSON.stringify(body),
})


/**
 * Notify all subscribers when token refresh completes
 */
const onTokenRefreshed = (success) => {
  refreshSubscribers.forEach((callback) => callback(success))
  refreshSubscribers = []
}


/**
 * Stop automatic token refresh interval
 */

let refreshInterval = null
let lastActivityTime = Date.now()

// Track token refresh state
let isRefreshing = false
let refreshSubscribers = []

/**
 * Subscribe to token refresh completion
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}
// **
//  * Refreshes the authentication token by calling the refresh-token endpoint
//  * @returns {Promise<boolean>} - Whether the token refresh was successful
//  */
const refreshAuthToken = async () => {
  // If already refreshing, wait for the current refresh to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((success) => {
        resolve(success)
      })
    })
  }

  isRefreshing = true

  try {
    const baseUrl = import.meta.env.VITE_API_URL || ""
    const refreshUrl = `${baseUrl}/api/auth/refresh-token`

    // Call the refresh token endpoint
    const response = await fetch(refreshUrl, {
      method: "POST",
      credentials: "include", // Important for cookies
    })

    if (!response.ok) {
      // FIX: Check if this is a 401/403 (authentication failure) vs network issue
      if (response.status === 401 || response.status === 403) {
        console.error("[refreshAuthToken] Token refresh failed - authentication error")
        // Only clear expiry time on actual authentication failure
        localStorage.removeItem("tokenExpiryTime")
      } else {
        console.warn(`[refreshAuthToken] Token refresh failed with status ${response.status} - keeping expiry time`)
      }
      throw new Error("Token refresh failed")
    }

    // Store new token expiry time (use env config)
    const jwtExpiryMinutes = parseInt(import.meta.env.VITE_JWT_EXPIRES_IN_MINUTES || '10')
    const expiryTime = Date.now() + jwtExpiryMinutes * 60 * 1000
    localStorage.setItem("tokenExpiryTime", expiryTime.toString())

    // Broadcast token refresh to other tabs
    tabCommunicator.broadcastTokenRefresh(expiryTime)

    isRefreshing = false
    onTokenRefreshed(true)
    return true // Token refresh successful
  } catch (error) {
    isRefreshing = false
    onTokenRefreshed(false)
    // FIX: Only clear expiry time if it's a network error (fetch failed completely)
    // For HTTP errors, we handle it in the response check above
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.warn("[refreshAuthToken] Network error during token refresh - keeping expiry time")
      // Don't remove tokenExpiryTime on network errors - allow retry later
    }
    return false // Token refresh failed
  }
}


export const startTokenRefreshInterval = () => {
  // Clear any existing interval
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }


  // Check at configured interval (use env config)
  const checkIntervalSeconds = parseInt(import.meta.env.VITE_TOKEN_CHECK_INTERVAL_SECONDS || '30')
  refreshInterval = setInterval(async () => {
    const isGuest = localStorage.getItem("isGuest") === "true"
    const user = localStorage.getItem("user")
    const expiryTime = localStorage.getItem("tokenExpiryTime")

    // ISSUE 6.5 FIX: Refresh guest tokens every 12 hours to maintain session
    if (isGuest && user) {
      // Check if guest token needs refresh (refresh every 12 hours to extend 24h session)
      const lastRefresh = localStorage.getItem("guestTokenLastRefresh")
      const now = Date.now()
      const guestRefreshHours = parseInt(import.meta.env.VITE_GUEST_TOKEN_REFRESH_INTERVAL_HOURS || '12')

      if (!lastRefresh || now - parseInt(lastRefresh) > guestRefreshHours * 60 * 60 * 1000) {
        const success = await refreshAuthToken()
        if (success) {
          localStorage.setItem("guestTokenLastRefresh", now.toString())
        } else {
          console.warn("[TokenRefresh] Guest token refresh failed")
        }
      }
    }
    // Only refresh for authenticated non-guest users
    else if (!isGuest && user) {
      // INACTIVITY FIX: Check if user is inactive - DON'T refresh token if inactive
      // The inactivity manager will handle logout after 15 minutes
      const isUserInactive = inactivityManager.isInactive()

      if (isUserInactive) {
        return
      }

      // STRICT 24-HOUR SESSION: Check if session has exceeded 24 hours
      const loginTimestamp = localStorage.getItem("loginTimestamp")
      const now = Date.now()

      if (loginTimestamp) {
        const sessionAge = now - parseInt(loginTimestamp)
        const maxSessionAge = 24 * 60 * 60 * 1000 // 24 hours

        if (sessionAge > maxSessionAge) {
          console.error("⏰ STRICT 24-HOUR SESSION EXPIRED - Logging out...")
          localStorage.clear()
          sessionStorage.clear()
          window.location.href = "/login"
          return
        }
      }

      // ISSUE 6.3 FIX: Check if token expired or expiring soon
      if (expiryTime) {
        const expiry = parseInt(expiryTime)
        const timeUntilExpiry = expiry - now
        const timeSinceActivity = now - lastActivityTime

        // Log token status every minute for debugging Issue 6.3
        if (Math.floor(now / 60000) !== Math.floor((now - 30000) / 60000)) {
          const sessionRemaining = loginTimestamp
            ? Math.floor((24 * 60 * 60 * 1000 - (now - parseInt(loginTimestamp))) / (60 * 60 * 1000))
            : "unknown"
      
        }

        // INACTIVITY FIX: Only refresh token if user is ACTIVE
        // If inactive, let the inactivity manager handle the logout
        const refreshBeforeMinutes = parseInt(import.meta.env.VITE_TOKEN_REFRESH_BEFORE_EXPIRY_MINUTES || '2')
        if (timeUntilExpiry < refreshBeforeMinutes * 60 * 1000) {
          const success = await refreshAuthToken()

          if (!success) {
            console.error("[TokenRefresh] Failed to refresh token")
            localStorage.clear()
            window.location.href = "/login"
          }
        }
      } else {
        // ISSUE 6.3 FIX: No expiry time means potential issue - try to refresh (only if active)
        console.warn("[TokenRefresh] No token expiry time found - attempting refresh")
        await refreshAuthToken()
      }
    }
  }, checkIntervalSeconds * 1000) // Check at configured interval
}

export const stopTokenRefreshInterval = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Listen for token refresh from other tabs
tabCommunicator.on('TOKEN_REFRESHED', (data) => {
  if (data.expiryTime) {
    localStorage.setItem("tokenExpiryTime", data.expiryTime.toString())
  }
})

// Listen for logout from other tabs
tabCommunicator.on('LOGOUT', (data) => {
  stopTokenRefreshInterval()
  localStorage.clear()
  sessionStorage.clear()
  // Don't redirect here - let authStore handle it
})





export const del = (url, options = {}) => fetchWithAuth(url, { ...options, method: "DELETE" })