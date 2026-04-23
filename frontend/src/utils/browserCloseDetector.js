/**
 * Browser Close Detector
 *
 * Detects when user closes browser tabs/windows and triggers logout when all tabs are closed.
 * Features:
 * - Track number of open tabs
 * - Immediate logout when last tab closes
 * - Multi-tab coordination via localStorage
 * - Handles browser refresh vs actual close
 */

class BrowserCloseDetector {
  constructor() {
    // Configuration
    this.TAB_COUNT_KEY = 'openTabsCount'
    this.TAB_ID_KEY = 'browserTabId'
    this.TAB_CLOSING_KEY = 'tabClosing'
    this.LAST_HEARTBEAT_KEY = 'lastTabHeartbeat'
    this.HEARTBEAT_INTERVAL = 5000 // 5 seconds

    // PHASE 3: Mobile-specific configuration (Issue #3 fix)
    this.MOBILE_HIDDEN_TIMEOUT = 5 * 60 * 1000 // 5 minutes for mobile
    this.isMobile = this.detectMobile()

    // State
    this.tabId = this.generateTabId()
    this.isEnabled = false
    this.logoutCallback = null
    this.heartbeatInterval = null
    this.isUnloading = false

    // PHASE 3: Mobile-specific state
    this.mobileHiddenTimer = null
    this.tabHiddenAt = null

    // Bind methods
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this)
    this.handleUnload = this.handleUnload.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.sendHeartbeat = this.sendHeartbeat.bind(this)
  }

  /**
   * PHASE 3: Detect if user is on mobile device
   * @returns {boolean} True if mobile device
   */
  detectMobile() {
    if (typeof navigator === 'undefined') return false

    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    // Check for mobile user agents
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    )

    // Check for touch capability and small screen
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth <= 768

    const isMobile = isMobileUA || (isTouchDevice && isSmallScreen)

    if (isMobile) {
      console.log('[BrowserCloseDetector] 📱 Mobile device detected')
    } else {
      console.log('[BrowserCloseDetector] 💻 Desktop device detected')
    }

    return isMobile
  }

  /**
   * Generate unique tab ID
   */
  generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Initialize browser close detection
   * @param {Function} logoutCallback - Function to call when all tabs close
   */
  start(logoutCallback) {
    if (this.isEnabled) {
      console.warn('[BrowserCloseDetector] Already started')
      return
    }

    console.log('[BrowserCloseDetector] Starting browser close detection')

    this.logoutCallback = logoutCallback
    this.isEnabled = true

    // Increment tab count when page loads
    this.incrementTabCount()

    // Setup event listeners
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('unload', this.handleUnload)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    // Start heartbeat to keep tab alive
    this.startHeartbeat()

    // Clean up stale tabs on startup
    this.cleanupStaleTabs()

    console.log(`[BrowserCloseDetector] ✅ Tab registered (ID: ${this.tabId})`)
  }

  /**
   * Stop browser close detection
   */
  stop() {
    if (!this.isEnabled) {
      return
    }

    console.log('[BrowserCloseDetector] Stopping browser close detection')

    this.isEnabled = false

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    // PHASE 3: Clear mobile hidden timer
    if (this.mobileHiddenTimer) {
      clearTimeout(this.mobileHiddenTimer)
      this.mobileHiddenTimer = null
    }

    // Remove event listeners
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('unload', this.handleUnload)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)

    console.log('[BrowserCloseDetector] ✅ Stopped')
  }

  /**
   * Increment tab count
   */
  incrementTabCount() {
    try {
      const currentCount = parseInt(localStorage.getItem(this.TAB_COUNT_KEY) || '0')
      const newCount = currentCount + 1
      localStorage.setItem(this.TAB_COUNT_KEY, newCount.toString())
      console.log(`[BrowserCloseDetector] Tab opened - Total tabs: ${newCount}`)

      // Store this tab's ID
      this.storeTabId()
    } catch (error) {
      console.error('[BrowserCloseDetector] Error incrementing tab count:', error)
    }
  }

  /**
   * Decrement tab count
   * @returns {number} New tab count
   */
  decrementTabCount() {
    try {
      const currentCount = parseInt(localStorage.getItem(this.TAB_COUNT_KEY) || '1')
      const newCount = Math.max(0, currentCount - 1)
      localStorage.setItem(this.TAB_COUNT_KEY, newCount.toString())
      console.log(`[BrowserCloseDetector] Tab closing - Remaining tabs: ${newCount}`)
      return newCount
    } catch (error) {
      console.error('[BrowserCloseDetector] Error decrementing tab count:', error)
      return 0
    }
  }

  /**
   * Store tab ID in a list
   */
  storeTabId() {
    try {
      const tabsListStr = localStorage.getItem('tabsList') || '[]'
      const tabsList = JSON.parse(tabsListStr)

      // Add this tab if not already in list
      if (!tabsList.includes(this.tabId)) {
        tabsList.push(this.tabId)
        localStorage.setItem('tabsList', JSON.stringify(tabsList))
      }
    } catch (error) {
      console.error('[BrowserCloseDetector] Error storing tab ID:', error)
    }
  }

  /**
   * Remove tab ID from list
   */
  removeTabId() {
    try {
      const tabsListStr = localStorage.getItem('tabsList') || '[]'
      const tabsList = JSON.parse(tabsListStr)

      // Remove this tab from list
      const filteredList = tabsList.filter(id => id !== this.tabId)
      localStorage.setItem('tabsList', JSON.stringify(filteredList))
    } catch (error) {
      console.error('[BrowserCloseDetector] Error removing tab ID:', error)
    }
  }

  /**
   * Start heartbeat to indicate tab is alive
   */
  startHeartbeat() {
    // Send initial heartbeat
    this.sendHeartbeat()

    // Send heartbeat every 5 seconds
    this.heartbeatInterval = setInterval(this.sendHeartbeat, this.HEARTBEAT_INTERVAL)
  }

  /**
   * Send heartbeat signal
   */
  sendHeartbeat() {
    try {
      const heartbeatData = {
        tabId: this.tabId,
        timestamp: Date.now()
      }
      localStorage.setItem(`${this.LAST_HEARTBEAT_KEY}_${this.tabId}`, JSON.stringify(heartbeatData))
    } catch (error) {
      console.error('[BrowserCloseDetector] Error sending heartbeat:', error)
    }
  }

  /**
   * Clean up stale tabs that didn't close properly
   */
  cleanupStaleTabs() {
    try {
      const tabsListStr = localStorage.getItem('tabsList') || '[]'
      const tabsList = JSON.parse(tabsListStr)
      const now = Date.now()
      const staleThreshold = 30000 // 30 seconds

      let activeTabs = 0

      tabsList.forEach(tabId => {
        const heartbeatStr = localStorage.getItem(`${this.LAST_HEARTBEAT_KEY}_${tabId}`)
        if (heartbeatStr) {
          try {
            const heartbeat = JSON.parse(heartbeatStr)
            const timeSinceHeartbeat = now - heartbeat.timestamp

            if (timeSinceHeartbeat < staleThreshold) {
              // Tab is still alive
              activeTabs++
            } else {
              // Tab is stale, remove it
              console.log(`[BrowserCloseDetector] Removing stale tab: ${tabId}`)
              localStorage.removeItem(`${this.LAST_HEARTBEAT_KEY}_${tabId}`)
            }
          } catch (e) {
            console.error('[BrowserCloseDetector] Error parsing heartbeat:', e)
          }
        }
      })

      // Update tab count to match active tabs
      if (activeTabs > 0) {
        localStorage.setItem(this.TAB_COUNT_KEY, activeTabs.toString())
        console.log(`[BrowserCloseDetector] Cleaned up stale tabs - Active tabs: ${activeTabs}`)
      }
    } catch (error) {
      console.error('[BrowserCloseDetector] Error cleaning up stale tabs:', error)
    }
  }

  /**
   * Handle beforeunload event (fires before page unloads)
   */
  handleBeforeUnload(event) {
    if (!this.isEnabled) return

    // Mark that we're unloading
    this.isUnloading = true

    // Don't decrement here - wait for unload event to be sure
    console.log('[BrowserCloseDetector] beforeunload triggered')
  }

  /**
   * Handle unload event (fires when page actually unloads)
   * REVERTED: Don't logout on unload - rely on backend timeout instead
   * This prevents logout on page refresh
   */
  handleUnload(event) {
    if (!this.isEnabled || !this.isUnloading) return

    console.log('[BrowserCloseDetector] unload triggered - cleaning up tab tracking')

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    // Remove this tab's heartbeat
    localStorage.removeItem(`${this.LAST_HEARTBEAT_KEY}_${this.tabId}`)

    // Remove tab ID from list
    this.removeTabId()

    // Decrement tab count
    const remainingTabs = this.decrementTabCount()

    console.log(`[BrowserCloseDetector] Tab cleanup done - Remaining tabs: ${remainingTabs}`)

    // DON'T trigger logout here - rely on backend session timeout instead
    // This prevents logout on page refresh which also fires unload event
    // The backend will clean up inactive sessions via cron job
  }

  /**
   * PHASE 3: Enhanced handle visibility change (tab becomes hidden/visible)
   * Includes mobile-specific timeout for Issue #3 fix
   */
  handleVisibilityChange() {
    if (!this.isEnabled) return

    if (document.hidden) {
      console.log('[BrowserCloseDetector] Tab hidden')
      this.tabHiddenAt = Date.now()

      // PHASE 3: Mobile-specific behavior - aggressive timeout when tab hidden
      if (this.isMobile) {
        console.log('[BrowserCloseDetector] 📱 Mobile tab hidden - starting 5-minute countdown')

        // Clear any existing timer
        if (this.mobileHiddenTimer) {
          clearTimeout(this.mobileHiddenTimer)
        }

        // Start countdown timer for mobile
        this.mobileHiddenTimer = setTimeout(() => {
          const isGuest = localStorage.getItem('isGuest') === 'true'

          if (isGuest) {
            console.log('[BrowserCloseDetector] 📱 Guest user - skipping mobile timeout logout')
            return
          }

          console.error('[BrowserCloseDetector] 📱 Mobile tab hidden for 5+ minutes - triggering logout')

          // Call logout callback (relies on frontend logout which calls backend)
          if (this.logoutCallback) {
            try {
              this.logoutCallback()
            } catch (error) {
              console.error('[BrowserCloseDetector] Error calling logout callback:', error)
            }
          }
        }, this.MOBILE_HIDDEN_TIMEOUT)

        console.log(`[BrowserCloseDetector] 📱 Mobile logout timer set for ${this.MOBILE_HIDDEN_TIMEOUT / 1000 / 60} minutes`)
      }
    } else {
      console.log('[BrowserCloseDetector] Tab visible')

      // PHASE 3: Cancel mobile timeout if tab becomes visible again
      if (this.isMobile && this.mobileHiddenTimer) {
        console.log('[BrowserCloseDetector] 📱 Mobile tab visible again - cancelling timeout')
        clearTimeout(this.mobileHiddenTimer)
        this.mobileHiddenTimer = null

        // Log how long tab was hidden
        if (this.tabHiddenAt) {
          const hiddenDuration = Date.now() - this.tabHiddenAt
          const hiddenMinutes = Math.floor(hiddenDuration / 1000 / 60)
          const hiddenSeconds = Math.floor((hiddenDuration % 60000) / 1000)
          console.log(`[BrowserCloseDetector] 📱 Tab was hidden for ${hiddenMinutes}m ${hiddenSeconds}s`)
        }
      }

      this.tabHiddenAt = null

      // Send heartbeat when tab becomes visible
      this.sendHeartbeat()
    }
  }

  /**
   * Get current tab count
   * @returns {number} Number of open tabs
   */
  getTabCount() {
    return parseInt(localStorage.getItem(this.TAB_COUNT_KEY) || '0')
  }

  /**
   * Reset tab count (useful for testing or after logout)
   */
  resetTabCount() {
    localStorage.setItem(this.TAB_COUNT_KEY, '0')
    localStorage.setItem('tabsList', '[]')
    console.log('[BrowserCloseDetector] Tab count reset')
  }
}

// Create singleton instance
const browserCloseDetector = new BrowserCloseDetector()

// Export singleton
export default browserCloseDetector

// Also export the class for testing
export { BrowserCloseDetector }
