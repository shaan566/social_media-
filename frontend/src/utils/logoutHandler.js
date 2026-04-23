/**
 * Logout Handler Utility
 *
 * Handles logout redirect logic based on current route.
 * - Protected routes → Redirect to /login
 * - Public routes → Stay on same page (just clear auth state)
 */

/**
 * Check if a route is protected (requires authentication)
 * @param {string} pathname - Current path
 * @returns {boolean} True if route is protected
 */
export const isProtectedRoute = (pathname) => {
  // List of protected route patterns
  const protectedPatterns = [
    '/dashboard',
    '/organizer',
    '/attendee',
    '/create-event',
    '/create-tickets',
    '/publish-event',
    '/account',
    '/settings',
    '/analytics',
    '/attendees',
    '/assets',
    '/my-tickets',
    '/checkout'
  ]

  // Check if current path matches any protected pattern
  return protectedPatterns.some(pattern => pathname.startsWith(pattern))
}

/**
 * Handle logout redirect based on current route
 * @param {string} currentPath - Current path (from window.location.pathname)
 * @param {boolean|string} isInactivityLogout - Whether logout was due to inactivity, or a custom message
 */
export const handleLogoutRedirect = (currentPath, isInactivityLogout = false) => {
  const isProtected = isProtectedRoute(currentPath)

  // Support both boolean and custom message string
  let message = "Please log in to continue"
  if (typeof isInactivityLogout === 'string') {
    // Custom message passed (e.g., from WebSocket)
    message = isInactivityLogout
  } else if (isInactivityLogout === true) {
    // Default inactivity message
    message = "Your session expired due to inactivity"
  }

  if (isProtected) {
    // Protected route → Redirect to login
    console.log(`[LogoutHandler] Protected route detected - redirecting to /login`)

    // Use setTimeout to ensure state is updated before redirect
    setTimeout(() => {
      window.location.href = `/login?message=${encodeURIComponent(message)}&from=${encodeURIComponent(currentPath)}`
    }, 100)
  } else {
    // Public route → Stay on same page
    console.log(`[LogoutHandler] Public route detected - staying on: ${currentPath}`)

    // Show toast notification if on public page
    if (isInactivityLogout && typeof window !== 'undefined') {
      // Simple toast notification without external dependencies
      const toast = document.createElement('div')
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        max-width: 300px;
      `
      toast.textContent = message
      document.body.appendChild(toast)

      // Remove toast after 5 seconds
      setTimeout(() => {
        toast.remove()
      }, 5000)
    }

    // Force re-render by triggering storage event
    window.dispatchEvent(new Event('storage'))
  }
}

/**
 * Store current route before logout (for potential redirect after re-login)
 */
export const storeReturnRoute = () => {
  const currentPath = window.location.pathname
  if (isProtectedRoute(currentPath)) {
    sessionStorage.setItem('returnRoute', currentPath)
  }
}

/**
 * Get and clear stored return route
 * @returns {string|null} Return route or null
 */
export const getReturnRoute = () => {
  const route = sessionStorage.getItem('returnRoute')
  sessionStorage.removeItem('returnRoute')
  return route
}

export default {
  isProtectedRoute,
  handleLogoutRedirect,
  storeReturnRoute,
  getReturnRoute
}
