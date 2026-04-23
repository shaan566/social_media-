/**
 * Authentication utilities for managing tokens, cookies, and session persistence
 */

// Check if token is valid (not expired)
const isTokenValid = (token) => {
  if (!token) return false

  try {
    // For JWT tokens, you would decode and check expiration
    // This is a simplified version - in production, use a proper JWT library
    const parts = token.split(".")
    if (parts.length !== 3) return false // Basic check for JWT structure

    const base64Url = parts[1]
    if (!base64Url) return false

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    let payload
    try {
      payload = JSON.parse(window.atob(base64))
    } catch (e) {
      e.message
      return false // Invalid base64 or JSON
    }

    // Check if token is expired
    return (
      payload &&
      typeof payload.exp === "number" &&
      payload.exp > Date.now() / 1000
    )
  } catch (error) {
    error.message
    return false
  }
}

// Get auth token from different storage mechanisms
const getAuthToken = () => {
  // Try localStorage first
  const localToken = localStorage.getItem("token")
  if (localToken && isTokenValid(localToken)) {
    return localToken
  }

  // Try cookies next
  const cookies = document.cookie.split(";")
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("auth_token=")
  )
  if (authCookie) {
    const cookieToken = authCookie.split("=")[1]
    if (isTokenValid(cookieToken)) {
      // Sync with localStorage for consistency
      localStorage.setItem("token", cookieToken)
      return cookieToken
    }
  }

  // No valid token found
  return null
}

// Check if user is authenticated
/**
 * Authentication utilities for session management and cross-browser sync.
 * Token management is now primarily server-side via HttpOnly cookies.
 */

// Check if user data exists in localStorage, indicating potential authentication
const hasLocalUserData = () => {
  const user = localStorage.getItem("user")
  return !!user // Returns true if user string is not null or empty
}

// Set session timeout and renewal
// Session timeout is now managed by token expiry and automatic refresh mechanism
// Tokens expire in 10 minutes and automatically refresh at 8 minutes
// This provides proper authentication lifecycle without conflicting session timeouts
const setupSessionTimeout = (logoutCallback, checkIsAuthenticated) => {
  // Session is now controlled by:
  // 1. Token expiry (10 minutes)
  // 2. Automatic token refresh (at 8 minutes)
  // 3. Token refresh stops when user is inactive and tokens expire
  // 4. Failed token refresh triggers automatic logout

  // Return no-op cleanup function for backward compatibility
  return () => {
    // Session cleanup is handled by token refresh mechanism in apiClient.js
  }
}

// Setup cross-browser tab synchronization for logout
// This function's `isAuthenticated` check will now rely on the AuthContext state
const setupCrossBrowserSync = (
  loginCallback, // Callback to handle login sync
  logoutCallback, // Callback to handle logout sync
  checkIsAuthenticated // Callback to check current auth state
) => {
  const SYNC_KEY = "auth_sync"
  const USER_STORAGE_KEY = "user" // Key for user data in localStorage

  const handleStorageChange = (event) => {
    if (event.key === SYNC_KEY) {
      // Another tab triggered a logout
      if (event.newValue === "logout") {
        if (
          typeof checkIsAuthenticated === "function" &&
          checkIsAuthenticated()
        ) {
          if (typeof logoutCallback === "function") logoutCallback()
        }
      }
    } else if (event.key === USER_STORAGE_KEY) {
      // User data changed in another tab (e.g., login or profile update)
      if (event.newValue) {
        try {
          const userData = JSON.parse(event.newValue)
          // If not currently authenticated, or if user data differs, trigger login sync
          if (
            typeof checkIsAuthenticated === "function" &&
            !checkIsAuthenticated()
          ) {
            if (typeof loginCallback === "function")
              loginCallback({
                user: userData,
                role: localStorage.getItem("role"),
                isGuest: localStorage.getItem("isGuest") === "true",
              })
          } else {
            // Optionally, update user data if already logged in and data differs
            // This part depends on how you want to handle profile updates across tabs
          }
        } catch (e) {
          console.error("Error parsing user data from storage sync:", e)
        }
      } else {
        // User data was removed (logout)
        if (
          typeof checkIsAuthenticated === "function" &&
          checkIsAuthenticated()
        ) {
          if (typeof logoutCallback === "function") logoutCallback()
        }
      }
    } else if (event.key === "tokenExpiryTime") {
      // ISSUE 6.6 FIX: Token expiry changed in another tab
      // This ensures all tabs are aware of token refresh events
      if (event.newValue) {
        console.log("🔄 Token expiry updated in another tab - syncing...")
        // The new expiry time is automatically reflected via localStorage
        // No additional action needed as apiClient.js reads from localStorage
      }
    } else if (event.key === "lastActivityTime") {
      // INACTIVITY FIX: Activity detected in another tab
      // This ensures all tabs reset their inactivity timer when any tab has activity
      if (event.newValue) {
        console.log("🔄 Activity detected in another tab - inactivity timer synced")
        // The inactivity manager automatically reads from localStorage
      }
    } else if (event.key === "tabClosing" && event.newValue) {
      // BROWSER CLOSE FIX: Another tab triggered logout due to all tabs closing
      // This ensures all tabs are aware of the logout
      console.log("🚪 Tab closing event detected - checking if logout needed")
      const openTabsCount = parseInt(localStorage.getItem("openTabsCount") || "0")
      if (openTabsCount === 0) {
        console.log("🚪 All tabs closed - logging out this tab too")
        if (typeof logoutCallback === "function" && checkIsAuthenticated()) {
          logoutCallback()
        }
      }
    }
  }

  window.addEventListener("storage", handleStorageChange)

  // Announce logout to other tabs
  const originalLogout = window.logoutUserGlobally // Assuming a global logout trigger if needed
  window.logoutUserGlobally = () => {
    localStorage.setItem(SYNC_KEY, "logout") // Signal logout
    localStorage.removeItem(SYNC_KEY) // Clean up signal
    if (originalLogout) originalLogout()
  }

  // Cleanup function
  return () => {
    window.removeEventListener("storage", handleStorageChange)
    window.logoutUserGlobally = originalLogout // Restore original if it existed
  }
}

export { hasLocalUserData, setupSessionTimeout, setupCrossBrowserSync }
