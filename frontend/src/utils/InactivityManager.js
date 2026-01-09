/**
 * Inactivity Manager
 *
 * Manages user inactivity detection and automatic logout after configured minutes of zero interaction.
 * Features:
 * - Tracks mouse, keyboard, scroll, touch, and API call activity
 * - Cross-tab synchronization (activity in one tab resets timer in all tabs)
 * - Stops token refresh during inactivity
 * - Only applies to authenticated regular users (guests are excluded)
 * - Uses centralized configuration from .env
 */

import tabCommunicator from './tabCommunicator'

class InactivityManager {
  constructor() {
    // Configuration - Read from environment variables
    const timeoutMinutes = parseInt(import.meta.env.VITE_INACTIVITY_TIMEOUT_MINUTES || '30')
    this.INACTIVITY_TIMEOUT = timeoutMinutes * 60 * 1000 // Convert minutes to milliseconds
    this.STORAGE_KEY = 'lastActivityTime'
    this.TAB_ID_KEY = 'activeTabId'
    const checkIntervalSeconds = parseInt(import.meta.env.VITE_INACTIVITY_CHECK_INTERVAL_SECONDS || '10')
    this.CHECK_INTERVAL = checkIntervalSeconds * 1000 // Convert seconds to milliseconds

    // State
    this.inactivityTimer = null
    this.checkInterval = null
    this.isEnabled = false
    this.logoutCallback = null
    this.activityListeners = []
    this.tabId = this.generateTabId()

    // Bind methods
    this.handleActivity = this.handleActivity.bind(this)
    this.handleStorageChange = this.handleStorageChange.bind(this)
    this.checkInactivity = this.checkInactivity.bind(this)
  }

  /**
   * Generate unique tab ID
   */
  generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Initialize inactivity tracking
   * @param {Function} logoutCallback - Function to call when user is inactive
   */
  start(logoutCallback) {
    if (this.isEnabled) {
      console.warn('[InactivityManager] Already started')
      return
    }

    const timeoutMinutes = Math.floor(this.INACTIVITY_TIMEOUT / 60000)
    console.log(`[InactivityManager] Starting inactivity tracking (${timeoutMinutes} minute timeout)`)

    this.logoutCallback = logoutCallback
    this.isEnabled = true

    // Set initial activity time
    this.updateLastActivity()

    // Setup activity listeners
    this.setupActivityListeners()

    // Setup cross-tab synchronization
    window.addEventListener('storage', this.handleStorageChange)

    // Start checking for inactivity
    this.startInactivityCheck()

    console.log('[InactivityManager] ✅ Inactivity tracking started')

    // Setup cross-tab communication listeners
    tabCommunicator.on('USER_ACTIVITY', () => {
      if (this.isEnabled) {
        this.updateLastActivity()
        console.log('[InactivityManager] Activity detected in another tab')
      }
    })

    tabCommunicator.on('LOGOUT', (data) => {
      if (this.isEnabled && data.reason === 'inactivity') {
        console.log('[InactivityManager] Inactivity logout detected in another tab')
        this.stop()
      }
    })
  }

  /**
   * Stop inactivity tracking
   */
  stop() {
    if (!this.isEnabled) {
      return
    }

    console.log('[InactivityManager] Stopping inactivity tracking')

    this.isEnabled = false

    // Clear timers
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
      this.inactivityTimer = null
    }

    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }

    // Remove activity listeners
    this.removeActivityListeners()

    // Remove cross-tab communication listeners
    tabCommunicator.removeAllListeners('USER_ACTIVITY')
    tabCommunicator.removeAllListeners('LOGOUT')

    // Remove storage listener
    window.removeEventListener('storage', this.handleStorageChange)

    // Clean up storage
    localStorage.removeItem(this.STORAGE_KEY)

    console.log('[InactivityManager] ✅ Inactivity tracking stopped')
  }

  /**
   * Setup activity event listeners
   */
  setupActivityListeners() {
    // Activity events to track
    const events = [
      'mousedown',     // Mouse clicks
      'mousemove',     // Mouse movement
      'keydown',       // Keyboard input
      'scroll',        // Page scrolling
      'touchstart',    // Touch events (mobile)
      'touchmove',     // Touch movement
      'wheel',         // Mouse wheel
      'click'          // Clicks
    ]

    // Add listeners with passive flag for performance
    events.forEach(event => {
      const listener = { event, handler: this.handleActivity }
      window.addEventListener(event, this.handleActivity, { passive: true })
      this.activityListeners.push(listener)
    })

    console.log(`[InactivityManager] Listening for ${events.length} activity types`)
  }

  /**
   * Remove all activity listeners
   */
  removeActivityListeners() {
    this.activityListeners.forEach(({ event, handler }) => {
      window.removeEventListener(event, handler)
    })
    this.activityListeners = []
  }

  /**
   * Handle user activity
   */
  handleActivity() {
    if (!this.isEnabled) return

    // Update last activity time
    this.updateLastActivity()

    // Broadcast activity to other tabs
    tabCommunicator.broadcastActivity()
  }

  /**
   * Update last activity timestamp (shared across tabs)
   */
  updateLastActivity() {
    const now = Date.now()

    // Update localStorage to sync across tabs
    localStorage.setItem(this.STORAGE_KEY, now.toString())
    localStorage.setItem(this.TAB_ID_KEY, this.tabId)

    // Reset inactivity timer
    this.resetInactivityTimer()
  }

  /**
   * Handle storage changes from other tabs
   */
  handleStorageChange(event) {
    if (!this.isEnabled) return

    // Check if another tab updated activity time
    if (event.key === this.STORAGE_KEY && event.newValue) {
      const activityTime = parseInt(event.newValue)
      const now = Date.now()
      const timeSinceActivity = now - activityTime

      // If activity was recent (from another tab), reset our timer
      if (timeSinceActivity < this.INACTIVITY_TIMEOUT) {
        console.log('[InactivityManager] Activity detected in another tab, resetting timer')
        this.resetInactivityTimer()
      }
    }
  }

  /**
   * Reset the inactivity timer
   */
  resetInactivityTimer() {
    // Clear existing timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
    }

    // Note: We don't set a new timeout here because we use interval checking instead
    // This is more reliable for cross-tab synchronization
  }

  /**
   * Start periodic inactivity checking
   */
  startInactivityCheck() {
    // Clear any existing interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }

    // Check for inactivity every 10 seconds
    this.checkInterval = setInterval(this.checkInactivity, this.CHECK_INTERVAL)

    // Also do an immediate check
    this.checkInactivity()
  }

  /**
   * Notify backend about inactivity logout (triggers WebSocket notification)
   */
  async notifyInactivityLogout() {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      await fetch(`${baseUrl}/api/auth/notify-inactivity`, {
        method: 'POST',
        credentials: 'include', // Include HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      // Non-blocking - if notification fails, still proceed with logout
      console.warn('[InactivityManager] Failed to notify backend about inactivity:', error.message)
    }
  }

  /**
   * Check if user has been inactive for too long
   */
  async checkInactivity() {
    if (!this.isEnabled) return

    // Skip if user is guest
    const isGuest = localStorage.getItem('isGuest') === 'true'
    if (isGuest) {
      return
    }

    // Get last activity time
    const lastActivityStr = localStorage.getItem(this.STORAGE_KEY)
    if (!lastActivityStr) {
      // No activity recorded, set current time
      this.updateLastActivity()
      return
    }

    const lastActivity = parseInt(lastActivityStr)
    const now = Date.now()
    const timeSinceActivity = now - lastActivity

    // Check if inactive for more than 15 minutes
    if (timeSinceActivity >= this.INACTIVITY_TIMEOUT) {
      console.error(`⏰ INACTIVITY TIMEOUT: User inactive for ${Math.floor(timeSinceActivity / 1000)}s (${Math.floor(timeSinceActivity / 60000)} minutes)`)
      console.log('[InactivityManager] Triggering logout due to inactivity...')

      // Notify backend (which will emit WebSocket event to all user's tabs)
      await this.notifyInactivityLogout()

      // Stop tracking before logout
      this.stop()

      // Call logout callback
      if (this.logoutCallback) {
        this.logoutCallback()
      }
    } else {
      // Log remaining time every minute
      const remainingMs = this.INACTIVITY_TIMEOUT - timeSinceActivity
      const remainingMin = Math.floor(remainingMs / 60000)
      const remainingSec = Math.floor((remainingMs % 60000) / 1000)

      // Only log once per minute to avoid spam
      if (remainingSec === 0) {
        console.log(`[InactivityManager] Time until logout: ${remainingMin}m ${remainingSec}s`)
      }
    }
  }

  /**
   * Get time since last activity
   * @returns {number} Time in milliseconds since last activity
   */
  getTimeSinceActivity() {
    const lastActivityStr = localStorage.getItem(this.STORAGE_KEY)
    if (!lastActivityStr) return 0

    const lastActivity = parseInt(lastActivityStr)
    const now = Date.now()
    return now - lastActivity
  }

  /**
   * Check if user is currently inactive
   * @returns {boolean} True if inactive for 15+ minutes
   */
  isInactive() {
    return this.getTimeSinceActivity() >= this.INACTIVITY_TIMEOUT
  }

  /**
   * Get remaining time before logout
   * @returns {number} Time in milliseconds until logout
   */
  getRemainingTime() {
    const timeSinceActivity = this.getTimeSinceActivity()
    return Math.max(0, this.INACTIVITY_TIMEOUT - timeSinceActivity)
  }

  /**
   * Reset activity tracking (useful after login)
   */
  reset() {
    console.log('[InactivityManager] Resetting activity tracking')
    this.updateLastActivity()
  }
}

// Create singleton instance
const inactivityManager = new InactivityManager()

// Export singleton
export default inactivityManager

// Also export the class for testing
export { InactivityManager }
