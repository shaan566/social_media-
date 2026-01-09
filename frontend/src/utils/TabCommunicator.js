/**
 * Tab Communicator - Real-time Cross-Tab Communication
 *
 * Uses BroadcastChannel API for instant communication between browser tabs.
 * This solves the multi-tab synchronization issues where one tab's actions
 * (token refresh, activity, logout) need to be immediately reflected in other tabs.
 *
 * Benefits over localStorage events:
 * - Instant delivery (no polling required)
 * - Doesn't require writing to storage
 * - More reliable across different browsers
 * - Cleaner API
 *
 * Fallback to localStorage events for browsers that don't support BroadcastChannel.
 */

class TabCommunicator {
  constructor() {
    this.channel = null
    this.listeners = new Map()
    this.useFallback = false

    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('eventzus_auth_sync')
        this.channel.onmessage = (event) => {
          this.handleMessage(event.data)
        }
        console.log('[TabCommunicator] Using BroadcastChannel API for cross-tab sync')
      } catch (error) {
        console.warn('[TabCommunicator] BroadcastChannel failed, using localStorage fallback:', error.message)
        this.useFallback = true
        this.setupFallback()
      }
    } else {
      console.warn('[TabCommunicator] BroadcastChannel not supported, using localStorage fallback')
      this.useFallback = true
      this.setupFallback()
    }
  }

  /**
   * Setup localStorage fallback for browsers without BroadcastChannel
   */
  setupFallback() {
    this.storageKey = 'eventzus_tab_sync'
    this.handleStorageEvent = (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const data = JSON.parse(event.newValue)
          this.handleMessage(data)
          // Clean up immediately
          localStorage.removeItem(this.storageKey)
        } catch (error) {
          console.error('[TabCommunicator] Failed to parse fallback message:', error)
        }
      }
    }
    window.addEventListener('storage', this.handleStorageEvent)
  }

  /**
   * Handle incoming messages
   */
  handleMessage(data) {
    const { type, payload, timestamp } = data

    // Ignore old messages (older than 5 seconds)
    if (timestamp && Date.now() - timestamp > 5000) {
      console.warn('[TabCommunicator] Ignored stale message:', type)
      return
    }

    // Call all registered listeners for this message type
    const handlers = this.listeners.get(type) || []
    handlers.forEach(handler => {
      try {
        handler(payload)
      } catch (error) {
        console.error(`[TabCommunicator] Error in handler for ${type}:`, error)
      }
    })
  }

  /**
   * Broadcast token refresh to all tabs
   * @param {number} expiryTime - New token expiry timestamp
   */
  broadcastTokenRefresh(expiryTime) {
    this.broadcast('TOKEN_REFRESHED', {
      expiryTime,
      timestamp: Date.now()
    })
    console.log('[TabCommunicator] Broadcasted token refresh to all tabs')
  }

  /**
   * Broadcast user activity to all tabs
   */
  broadcastActivity() {
    this.broadcast('USER_ACTIVITY', {
      timestamp: Date.now()
    })
  }

  /**
   * Broadcast logout to all tabs
   * @param {string} reason - Logout reason ('manual', 'inactivity', 'token_expired', etc.)
   */
  broadcastLogout(reason) {
    this.broadcast('LOGOUT', {
      reason,
      timestamp: Date.now()
    })
    console.log(`[TabCommunicator] Broadcasted logout (${reason}) to all tabs`)
  }

  /**
   * Broadcast login to all tabs
   * @param {Object} userData - User data
   */
  broadcastLogin(userData) {
    this.broadcast('LOGIN', {
      user: userData,
      timestamp: Date.now()
    })
    console.log('[TabCommunicator] Broadcasted login to all tabs')
  }

  /**
   * Broadcast session expired event
   * @param {string} reason - Expiry reason
   */
  broadcastSessionExpired(reason) {
    this.broadcast('SESSION_EXPIRED', {
      reason,
      timestamp: Date.now()
    })
    console.log(`[TabCommunicator] Broadcasted session expired (${reason}) to all tabs`)
  }

  /**
   * Generic broadcast method
   * @param {string} type - Message type
   * @param {any} payload - Message payload
   */
  broadcast(type, payload) {
    const message = {
      type,
      payload,
      timestamp: Date.now()
    }

    if (this.useFallback) {
      // Use localStorage fallback
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(message))
        // Immediately remove to trigger storage event in other tabs
        setTimeout(() => {
          localStorage.removeItem(this.storageKey)
        }, 100)
      } catch (error) {
        console.error('[TabCommunicator] Fallback broadcast failed:', error)
      }
    } else if (this.channel) {
      // Use BroadcastChannel
      try {
        this.channel.postMessage(message)
      } catch (error) {
        console.error('[TabCommunicator] BroadcastChannel message failed:', error)
      }
    }
  }

  /**
   * Register a listener for a specific message type
   * @param {string} type - Message type to listen for
   * @param {Function} handler - Handler function
   */
  on(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push(handler)
    console.log(`[TabCommunicator] Registered listener for '${type}'`)
  }

  /**
   * Unregister a listener for a specific message type
   * @param {string} type - Message type
   * @param {Function} handler - Handler function to remove
   */
  off(type, handler) {
    if (!this.listeners.has(type)) return

    const handlers = this.listeners.get(type)
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
      console.log(`[TabCommunicator] Unregistered listener for '${type}'`)
    }

    // Clean up empty listener arrays
    if (handlers.length === 0) {
      this.listeners.delete(type)
    }
  }

  /**
   * Remove all listeners for a specific type
   * @param {string} type - Message type
   */
  removeAllListeners(type) {
    if (type) {
      this.listeners.delete(type)
      console.log(`[TabCommunicator] Removed all listeners for '${type}'`)
    } else {
      this.listeners.clear()
      console.log('[TabCommunicator] Removed all listeners')
    }
  }

  /**
   * Cleanup and destroy the communicator
   */
  destroy() {
    if (this.channel) {
      this.channel.close()
      this.channel = null
    }

    if (this.useFallback && this.handleStorageEvent) {
      window.removeEventListener('storage', this.handleStorageEvent)
    }

    this.listeners.clear()
    console.log('[TabCommunicator] Destroyed')
  }

  /**
   * Get info about current communication method
   */
  getInfo() {
    return {
      method: this.useFallback ? 'localStorage' : 'BroadcastChannel',
      supported: !this.useFallback,
      listenerCount: Array.from(this.listeners.values()).reduce((sum, handlers) => sum + handlers.length, 0),
      types: Array.from(this.listeners.keys())
    }
  }
}

// Create and export singleton instance
const tabCommunicator = new TabCommunicator()

export default tabCommunicator

// Also export the class for testing
export { TabCommunicator }
