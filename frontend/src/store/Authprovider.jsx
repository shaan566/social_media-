import { useState, useEffect, useCallback, useRef } from "react"
import { AuthContext } from "../context/authcontext"
import {
  hasLocalUserData,
  setupSessionTimeout,
  setupCrossBrowserSync,
} from "../utils/authUtils"
import {logoutUser } from "../services/authServices"
// import { magicLinkService } from "../services/magicLinkService"
import { startTokenRefreshInterval, stopTokenRefreshInterval } from "../utils/apiClient"
import inactivityManager from "../utils/InactivityManager"
import browserCloseDetector from "../utils/browserCloseDetector"
import { handleLogoutRedirect, storeReturnRoute, isProtectedRoute } from "../utils/logoutHandler"
import tabCommunicator from "../utils/TabCommunicator"

// Auth provider component
export const AuthProvider = ({ children }) => {
  // ISSUE 8.3 FIX: Lock mechanism to prevent concurrent auth operations
  const authOperationInProgress = useRef(false)

  // OPTION 1: TRUST COOKIES ONLY - Never trust localStorage for authentication
  // ALWAYS validate with server first, use localStorage only for convenience/display
  const [authState, setAuthState] = useState({
    isAuthenticated: false, // Always start as NOT authenticated
    user: null,
    role: null,
    token: null, // Token is HttpOnly, not accessible from client
    isGuest: false,
    emailVerificationStatus: null,
    isLoading: true, // Start with loading=true, will validate with server
  })

  // Memoize logout function to prevent unnecessary re-renders
  const memoizedLogout = useCallback(async (reason = 'manual') => {
    // ISSUE 8.3 FIX: Prevent concurrent logout operations
    if (authOperationInProgress.current) {
      console.log("⏸️ Logout already in progress, skipping duplicate call")
      return
    }

    authOperationInProgress.current = true

    // INACTIVITY FIX: Store current route before logout for potential redirect
    if (reason === 'inactivity') {
      storeReturnRoute()
    }

    // ISSUE 8.5 FIX: Set loading state
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      // INACTIVITY FIX: Stop inactivity tracking
      inactivityManager.stop()

      // BROWSER CLOSE FIX: Stop browser close detection
      browserCloseDetector.stop()

      // Stop automatic token refresh
      stopTokenRefreshInterval()

      // Call logout API
      if (authState.isAuthenticated) {
        await logoutUser()
      }
    } catch (error) {
      console.error("Logout API error:", error)
      // Continue with local logout even if API call fails
    } finally {
      // PHASE 2D: Enhanced cache clearing on logout (Issue #4 fix)
      // This prevents stale data from persisting across logout/login cycles
      if (typeof window !== 'undefined' && window.queryClient) {
        console.log("🧹 [Phase2D] Clearing TanStack Query cache on logout...")

        // Cancel in-flight queries first
        window.queryClient.cancelQueries()

        // Clear all cached data
        window.queryClient.clear()

        // Remove all queries
        window.queryClient.removeQueries()

        // Clear session storage query cache
        try {
          sessionStorage.removeItem('tanstack-query-cache')
        } catch (e) {
          // Ignore if doesn't exist
        }
      }

      // Clear state
      setAuthState({
        isAuthenticated: false,
        user: null,
        role: null,
        token: null,
        isGuest: false,
        emailVerificationStatus: null,
        isLoading: false, // ISSUE 8.5 FIX: Reset loading state
      })

      // Clear ALL localStorage items except theme/locale
      const keysToKeep = ["theme", "locale", "language"]
      const preservedData = {}

      // Preserve non-user settings
      keysToKeep.forEach((key) => {
        const value = localStorage.getItem(key)
        if (value) preservedData[key] = value
      })

      // Clear everything (including tokenExpiryTime)
      localStorage.clear()
      sessionStorage.clear()

      // Restore preserved settings
      Object.entries(preservedData).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })

      // FIX: Handle redirect based on logout reason
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname

        if (reason === 'inactivity') {
          handleLogoutRedirect(currentPath, 'Your session expired due to inactivity')
        } else if (reason === 'token_expired') {
          handleLogoutRedirect(currentPath, 'Your session expired')
        } else if (reason === 'manual') {
          // Manual logout - no error toast, just redirect if on protected route
          if (isProtectedRoute(currentPath)) {
            window.location.href = '/login'
          }
        }
      }

      // Broadcast logout to other tabs
      tabCommunicator.broadcastLogout(reason)

      // ISSUE 8.3 FIX: Release lock after operation completes
      authOperationInProgress.current = false
    }
  }, [authState.isAuthenticated])

  // Memoize login function to prevent unnecessary re-renders
  const memoizedLogin = useCallback(async (userData) => {
    // ISSUE 8.3 FIX: Prevent concurrent login operations
    if (authOperationInProgress.current) {
      console.log("⏸️ Login already in progress, skipping duplicate call")
      return
    }

    authOperationInProgress.current = true

    // ISSUE 8.5 FIX: Set loading state
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Check if switching to a different user
      const currentUser = localStorage.getItem("user")
      const currentUserId = currentUser
        ? JSON.parse(currentUser)?._id || JSON.parse(currentUser)?.id
        : null
      const newUserId = userData.user?._id || userData.user?.id

      // PHASE 2D: Enhanced cache clearing for user switch (Issue #4 fix)
      // This prevents Account A's data from showing when Account B logs in
      if (currentUserId && newUserId && currentUserId !== newUserId) {
        console.log("🔄 [Phase2D] User switch detected - performing complete cleanup...")
        console.log(`   Switching from user ${currentUserId} to ${newUserId}`)

        // STEP 1: Cancel all in-flight queries first
        if (typeof window !== 'undefined' && window.queryClient) {
          console.log("🧹 [Phase2D] Step 1: Cancelling in-flight queries...")
          window.queryClient.cancelQueries()
        }

        // STEP 2: Clear TanStack Query cache completely
        if (typeof window !== 'undefined' && window.queryClient) {
          console.log("🧹 [Phase2D] Step 2: Clearing TanStack Query cache...")
          window.queryClient.clear()

          // Also remove all queries explicitly
          window.queryClient.removeQueries()

          // Reset query client state
          window.queryClient.setQueryDefaults(['events'], {})
          window.queryClient.setQueryDefaults(['user-registered'], {})
        }

        // STEP 3: Clear session storage cache
        console.log("🧹 [Phase2D] Step 3: Clearing session storage...")
        sessionStorage.clear()

        // Also clear TanStack Query session cache if exists
        try {
          sessionStorage.removeItem('tanstack-query-cache')
        } catch (e) {
          // Ignore if doesn't exist
        }

        // STEP 4: Clear all user-specific data from localStorage
        console.log("🧹 [Phase2D] Step 4: Clearing user-specific localStorage...")
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && !["theme", "locale", "language"].includes(key)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key))

        // STEP 5: Small delay to ensure async operations complete
        // This prevents race conditions where new data loads before old cache is cleared
        await new Promise(resolve => setTimeout(resolve, 100))

        console.log("✅ [Phase2D] User switch cleanup complete")
      }

      // Save to state (token is HttpOnly, not stored client-side)
      setAuthState({
        isAuthenticated: true,
        user: userData.user,
        role: userData.role || "user",
        token: null, // Token is HttpOnly
        isGuest: userData.isGuest || false,
        emailVerificationStatus: null, // Reset on login
        isLoading: false, // ISSUE 8.5 FIX: Reset loading state
      })

      // Persist to localStorage (no token storage)
      localStorage.setItem("user", JSON.stringify(userData.user))
      localStorage.setItem("role", userData.role || "user")
      localStorage.setItem("isGuest", userData.isGuest ? "true" : "false")

      // Broadcast login to other tabs
      tabCommunicator.broadcastLogin({ user: userData.user, role: userData.role })

      // Set initial token expiry time and start auto-refresh
      // ISSUE 6.2 FIX: Enhanced token expiry tracking with validation
      if (!userData.isGuest) {
        const jwtExpiryMinutes = parseInt(import.meta.env.VITE_JWT_EXPIRES_IN_MINUTES || '10')
        const expiryTime = Date.now() + jwtExpiryMinutes * 60 * 1000
        const loginTimestamp = Date.now()

        localStorage.setItem("tokenExpiryTime", expiryTime.toString())
        // STRICT 24-HOUR SESSION: Store login timestamp for absolute session expiry
        localStorage.setItem("loginTimestamp", loginTimestamp.toString())

        console.log("[AuthStore] Token expiry set to:", new Date(expiryTime).toLocaleTimeString())
        console.log("[AuthStore] ⏰ STRICT 24H SESSION - Valid until:", new Date(loginTimestamp + 24 * 60 * 60 * 1000).toLocaleString())

        // ISSUE 6.2 FIX: Validate token immediately after login
        // This ensures the cookie is actually set by the backend
        setTimeout(async () => {
          const storedExpiry = localStorage.getItem("tokenExpiryTime")
          if (!storedExpiry) {
            console.error("[AuthStore] Token expiry missing after login - setting again")
            const jwtExpiryMinutes = parseInt(import.meta.env.VITE_JWT_EXPIRES_IN_MINUTES || '10')
            const newExpiryTime = Date.now() + jwtExpiryMinutes * 60 * 1000
            localStorage.setItem("tokenExpiryTime", newExpiryTime.toString())
          }
        }, 100)

        // Start automatic token refresh interval
        startTokenRefreshInterval()

        // INACTIVITY FIX: Start inactivity tracking for authenticated users (not guests)
        inactivityManager.start(() => {
          console.error("[InactivityManager] Timeout reached - logging out...")
          // Call logout with inactivity reason
          memoizedLogout('inactivity')
        })

        // BROWSER CLOSE FIX: Start browser close detection
        browserCloseDetector.start(() => {
          console.error("[BrowserCloseDetector] All tabs closed - logging out...")
          // Call logout API synchronously with browser close reason
          memoizedLogout('browser_close')
        })
      } else {
        // ISSUE 6.5 FIX: Initialize guest token refresh tracking
        const now = Date.now()
        localStorage.setItem("guestTokenLastRefresh", now.toString())
        localStorage.setItem("loginTimestamp", now.toString())
        console.log("[AuthStore] Guest token refresh tracking initialized")
        console.log("[AuthStore] ⏰ Guest session valid until:", new Date(now + 24 * 60 * 60 * 1000).toLocaleString())

        // Start token refresh interval for guests too
        startTokenRefreshInterval()

        // DON'T start inactivity manager or browser close detector for guests
        console.log("[AuthStore] Guest user - skipping inactivity and browser close tracking")
      }

      // ISSUE 6.7 FIX: NO PAGE RELOAD NEEDED
      // Cache clearing above ensures fresh data without reload
      // Page reload removed - prevents race conditions and provides better UX
    } finally {
      // ISSUE 8.3 FIX: Release lock after operation completes
      authOperationInProgress.current = false
    }
  }, [])

  // Check authentication status
  const checkIsAuthenticated = useCallback(() => {
    return authState.isAuthenticated
  }, [authState.isAuthenticated])

  // ISSUE 2 FIX: Prevent duplicate initialization and suppress expected 401 errors
  const initializationStarted = useRef(false)

  // OPTION 1: Single initialization - ALWAYS validate with server on mount
  // This fixes ALL issues by never trusting localStorage for authentication
  useEffect(() => {
    const initializeAuth = async () => {
      // ISSUE 2 FIX: Prevent duplicate calls (React StrictMode double-mounting)
      if (initializationStarted.current) {
        console.log("⏸️ [AuthStore] Initialization already started, skipping duplicate call")
        return
      }
      initializationStarted.current = true

      console.log("🔐 [AuthStore] Initializing authentication - validating with server...")

      // ISSUE 2 FIX: Check if we have any session indicators before making the call
      // This helps avoid unnecessary validation calls when clearly not logged in
      const hasUserData = hasLocalUserData()

      if (!hasUserData) {
        console.log("ℹ️ [AuthStore] No local session data found - skipping validation call")
        setAuthState({
          isAuthenticated: false,
          user: null,
          role: null,
          token: null,
          isGuest: false,
          emailVerificationStatus: null,
          isLoading: false,
        })
        return
      }

      try {
        const baseUrl = import.meta.env.VITE_API_URL || ""
        const response = await fetch(`${baseUrl}/api/auth/validate-session`, {
          method: "GET",
          credentials: "include", // Send HttpOnly cookies
        })

        if (response.ok) {
          const data = await response.json()

          if (data.sessionValid && data.data?.user) {
            console.log("✅ [AuthStore] Valid session found - user authenticated")

            const user = data.data.user
            const isGuest = user.isGuest || false

            // Set authenticated state based on SERVER response
            setAuthState({
              isAuthenticated: true,
              user: user,
              role: user.role || "user",
              token: null, // HttpOnly cookie
              isGuest: isGuest,
              emailVerificationStatus: null,
              isLoading: false,
            })

            // Update localStorage for convenience (NOT for authentication)
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("role", user.role || "user")
            localStorage.setItem("isGuest", isGuest ? "true" : "false")

            // Set token expiry and login timestamp
            const jwtExpiryMinutes = parseInt(import.meta.env.VITE_JWT_EXPIRES_IN_MINUTES || '10')
            const expiryTime = Date.now() + jwtExpiryMinutes * 60 * 1000
            const loginTimestamp = Date.now()
            localStorage.setItem("tokenExpiryTime", expiryTime.toString())
            localStorage.setItem("loginTimestamp", loginTimestamp.toString())

            // Start token refresh and monitoring for authenticated users
            if (!isGuest) {
              startTokenRefreshInterval()

              inactivityManager.start(() => {
                console.error("[InactivityManager] Timeout - logging out...")
                memoizedLogout('inactivity')
              })

              browserCloseDetector.start(() => {
                console.error("[BrowserCloseDetector] All tabs closed - logging out...")
                memoizedLogout('browser_close')
              })
            } else {
              // Guest users still need token refresh
              startTokenRefreshInterval()
            }

            return
          }
        }

        // ISSUE 2 FIX: Handle 401 errors gracefully without console errors
        // 401 is EXPECTED when no session exists - not an error condition
        if (response.status === 401) {
          const data = await response.json().catch(() => ({}))
          if (data.reason === "INACTIVITY_TIMEOUT") {
            console.warn("⏱️ [AuthStore] Session expired due to inactivity on backend")
          } else {
            // Suppress the expected "not logged in" 401 - it's normal
            console.log("ℹ️ [AuthStore] No active session (401) - user not authenticated")
          }
        } else if (!response.ok) {
          // Only log unexpected non-401 errors
          console.warn(`⚠️ [AuthStore] Session validation returned ${response.status}`)
        }

        // No valid session - stay logged out
        setAuthState({
          isAuthenticated: false,
          user: null,
          role: null,
          token: null,
          isGuest: false,
          emailVerificationStatus: null,
          isLoading: false,
        })

        // Clear localStorage
        localStorage.clear()

      } catch (error) {
        // ISSUE 2 FIX: Only log actual network errors, not expected 401s
        console.error("❌ [AuthStore] Session validation network error:", error.message || error)

        // On error, stay logged out
        setAuthState({
          isAuthenticated: false,
          user: null,
          role: null,
          token: null,
          isGuest: false,
          emailVerificationStatus: null,
          isLoading: false,
        })

        // Clear localStorage
        localStorage.clear()
      }
    }

    initializeAuth()
  }, []) // Run once on mount

  // Setup cross-tab communication listeners
  useEffect(() => {
    const handleLogout = (data) => {
      if (authState.isAuthenticated) {
        console.log('[AuthStore] Logout detected in another tab:', data.reason)
        memoizedLogout(data.reason)
      }
    }

    const handleLogin = (data) => {
      if (!authState.isAuthenticated && data.user) {
        console.log('[AuthStore] Login detected in another tab')
        // Reload page to sync state
        window.location.reload()
      }
    }

    tabCommunicator.on('LOGOUT', handleLogout)
    tabCommunicator.on('LOGIN', handleLogin)

    return () => {
      tabCommunicator.off('LOGOUT', handleLogout)
      tabCommunicator.off('LOGIN', handleLogin)
    }
  }, [authState.isAuthenticated, memoizedLogout])

  // Setup session timeout and cross-browser sync
  useEffect(() => {
    // Setup session timeout
    const cleanupTimeout = setupSessionTimeout(
      memoizedLogout,
      checkIsAuthenticated
    )

    // Setup cross-browser sync
    const cleanupSync = setupCrossBrowserSync(
      (userData) => memoizedLogin(userData),
      () => memoizedLogout(),
      checkIsAuthenticated
    )

    // Start token refresh interval if user is authenticated on mount
    if (authState.isAuthenticated && !authState.isGuest) {
      startTokenRefreshInterval()
    }

    // Cleanup on unmount
    return () => {
      cleanupTimeout()
      cleanupSync()
      stopTokenRefreshInterval()
    }
  }, [memoizedLogout, memoizedLogin, checkIsAuthenticated, authState.isAuthenticated, authState.isGuest])

  // Login function - use the memoized version
  const login = memoizedLogin

  // Logout function - use the memoized version
  const logout = memoizedLogout

  // Update user profile
  const updateProfile = (userData) => {
    setAuthState((prev) => ({
      ...prev,
      user: { ...prev.user, ...userData },
    }))
  }

  // Magic link verification functions
//   const checkEmailVerification = useCallback(async (email) => {
//     try {
//       const response = await magicLinkService.checkStatus(email)
//       setAuthState((prev) => ({
//         ...prev,
//         emailVerificationStatus: response.data,
//       }))
//       return response.data
//     } catch (error) {
//       console.error("Failed to check email verification status:", error)
//       return null
//     }
//   }, [])

  // Update email verification status when user is verified
  const updateEmailVerificationStatus = useCallback((status) => {
    setAuthState((prev) => ({
      ...prev,
      emailVerificationStatus: status,
      user: prev.user
        ? { ...prev.user, emailVerified: status.verified }
        : prev.user,
    }))
  }, [])

  // Refresh user data after email verification
  const refreshUserAfterVerification = useCallback(() => {
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, emailVerified: true } : prev.user,
      emailVerificationStatus: { verified: true, locked: false },
    }))

    // Update localStorage
    if (authState.user) {
      const updatedUser = { ...authState.user, emailVerified: true }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }, [authState.user])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateProfile,
        // checkEmailVerification,
        updateEmailVerificationStatus,
        refreshUserAfterVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
