/**
 * Centralized WebSocket Service
 * ISSUE 9.4 FIX: Centralized WebSocket room management and event emissions
 *
 * This service provides:
 * - Consistent room naming conventions
 * - Error handling for all emissions
 * - Logging and monitoring
 * - Rate limiting per connection (ISSUE 9.5)
 */

import jwt from "jsonwebtoken"

class WebSocketService {
  constructor() {
    this.io = null
    this.roomPrefix = {
      event: 'event_',
      organizer: 'organizer_',
      user: 'user_',
    }
    // Rate limiting per socket (ISSUE 9.5)
    this.socketEventCounts = new Map()
    this.RATE_LIMIT = 100 // max events per minute per socket
    this.RATE_WINDOW = 60000 // 1 minute in ms
  }

  /**
   * Initialize the WebSocket service with Socket.IO instance
   */
  initialize(io) {
    this.io = io
    console.log('✅ WebSocket service initialized')
  }

  /**
   * Get the Socket.IO instance
   */
  getIO() {
    return this.io
  }

  /**
   * Generate room name with consistent prefix
   */
  getRoomName(type, id) {
    if (!this.roomPrefix[type]) {
      console.warn(`⚠️ Unknown room type: ${type}`)
      return `${type}_${id}`
    }
    return `${this.roomPrefix[type]}${id}`
  }

  /**
   * ISSUE 9.5 FIX: Check rate limit for socket
   */
  checkRateLimit(socketId) {
    const now = Date.now()
    const socketData = this.socketEventCounts.get(socketId)

    if (!socketData) {
      // First event from this socket
      this.socketEventCounts.set(socketId, {
        count: 1,
        windowStart: now
      })
      return true
    }

    // Check if we're in a new window
    if (now - socketData.windowStart > this.RATE_WINDOW) {
      // Reset counter for new window
      this.socketEventCounts.set(socketId, {
        count: 1,
        windowStart: now
      })
      return true
    }

    // Increment counter
    socketData.count++

    // Check if over limit
    if (socketData.count > this.RATE_LIMIT) {
      console.warn(`⚠️ Rate limit exceeded for socket ${socketId}: ${socketData.count} events in ${this.RATE_WINDOW}ms`)
      return false
    }

    return true
  }

  /**
   * Clean up rate limit data for disconnected socket
   */
  cleanupSocket(socketId) {
    this.socketEventCounts.delete(socketId)
  }

  /**
   * ISSUE 9.3 FIX: Emit event with error handling and logging
   * @param {string} eventName - Name of the event
   * @param {object} data - Data to emit
   * @param {string} roomName - Optional room name to emit to specific room
   */
  emitEvent(eventName, data, roomName = null) {
    try {
      if (!this.io) {
        console.error('❌ WebSocket: IO instance not initialized')
        return false
      }

      // ISSUE 9.3 FIX: Wrap emission in try-catch
      if (roomName) {
        // Emit to specific room
        console.log(`\n[WebSocketService] 📤 Emitting event:`, {
          eventName,
          roomName,
          eventId: data?.event?._id || data?.eventId,
          changedFields: data?.changedFields ? Object.keys(data.changedFields) : []
        })

        // Check how many sockets are in this room
        const socketsInRoom = this.io.sockets.adapter.rooms.get(roomName)
        console.log(`[WebSocketService] 👥 Sockets in room '${roomName}':`, socketsInRoom ? socketsInRoom.size : 0)
        if (socketsInRoom && socketsInRoom.size > 0) {
          console.log(`[WebSocketService] 🔌 Socket IDs in room:`, Array.from(socketsInRoom))
        }

        this.io.to(roomName).emit(eventName, data)
        console.log(`[WebSocketService] ✅ Event '${eventName}' emitted to room '${roomName}'`)
      } else {
        // Broadcast to all connected clients
        console.log(`[WebSocketService] 📡 Broadcasting event '${eventName}' to all clients`)
        this.io.emit(eventName, data)
        console.log(`[WebSocketService] ✅ Event '${eventName}' broadcasted`)
      }

      return true
    } catch (error) {
      // ISSUE 9.3 FIX: Log but don't throw - WebSocket failures shouldn't break API
      console.error(`❌ WebSocket emission failed for '${eventName}':`, error.message)
      return false
    }
  }

  /**
   * ISSUE 9.1 FIX: Emit event creation
   */
  emitEventCreated(eventData) {
    return this.emitEvent('new_event', {
      success: true,
      event: eventData,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * ISSUE 9.1 FIX: Emit event update
   */
  emitEventUpdated(eventData, organizerId) {
    const success = this.emitEvent('organizer_event_update', {
      success: true,
      event: eventData,
      timestamp: new Date().toISOString()
    }, this.getRoomName('organizer', organizerId))

    // Also emit to event-specific room
    this.emitEvent('event_updated', {
      success: true,
      event: eventData,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventData._id || eventData.id))

    return success
  }

  /**
   * ISSUE 9.1 FIX: Emit event deletion (NEW)
   */
  emitEventDeleted(eventId, organizerId) {
    const success = this.emitEvent('event_deleted', {
      success: true,
      eventId: eventId,
      timestamp: new Date().toISOString()
    }, this.getRoomName('organizer', organizerId))

    // Also emit to event-specific room
    this.emitEvent('event_deleted', {
      success: true,
      eventId: eventId,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventId))

    return success
  }

  /**
   * ISSUE 9.1 FIX: Emit event status change (NEW)
   */
  emitEventStatusChanged(eventId, newStatus, organizerId) {
    const success = this.emitEvent('event_status_changed', {
      success: true,
      eventId: eventId,
      status: newStatus,
      timestamp: new Date().toISOString()
    }, this.getRoomName('organizer', organizerId))

    // Also emit to event-specific room
    this.emitEvent('event_status_changed', {
      success: true,
      eventId: eventId,
      status: newStatus,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventId))

    return success
  }

  /**
   * ISSUE 9.1 FIX: Emit capacity full notification (NEW)
   */
  emitEventCapacityFull(eventId, eventData) {
    return this.emitEvent('event_capacity_full', {
      success: true,
      eventId: eventId,
      event: eventData,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventId))
  }

  /**
   * Emit event registration
   */
  emitEventRegistration(eventId, registrationData) {
    return this.emitEvent('event_registration', {
      success: true,
      eventId: eventId,
      registrationCount: registrationData.registrationCount,
      attendeeCount: registrationData.attendeeCount,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventId))
  }

  /**
   * Emit event cancellation
   */
  emitEventCancellation(eventId, cancellationData) {
    return this.emitEvent('event_cancellation', {
      success: true,
      eventId: eventId,
      registrationCount: cancellationData.registrationCount,
      attendeeCount: cancellationData.attendeeCount,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventId))
  }

  /**
   * Emit capacity update
   */
  emitCapacityUpdated(eventId, capacityData) {
    return this.emitEvent('capacity_updated', capacityData, this.getRoomName('event', eventId))
  }

  /**
   * Emit overall capacity update
   */
  emitOverallCapacityUpdated(eventId, capacityData) {
    return this.emitEvent('overall_capacity_updated', {
      success: true,
      eventId: eventId,
      ...capacityData,
      timestamp: new Date().toISOString()
    }, this.getRoomName('event', eventId))
  }

  /**
   * Emit session expired notification to specific user
   * This is emitted when a user's session expires due to inactivity or token expiration
   */
  emitSessionExpired(userId, reason = 'inactivity') {
    // Provide user-friendly messages based on reason
    let message
    switch (reason) {
      case 'inactivity':
        message = 'Your session expired due to inactivity. Please log in again to continue.'
        break
      case 'token_expired':
        message = 'Your session has expired. Please log in again to continue.'
        break
      default:
        message = 'Your session has expired. Please log in again.'
    }

    return this.emitEvent('session_expired', {
      success: true,
      reason: reason,
      message: message,
      timestamp: new Date().toISOString()
    }, this.getRoomName('user', userId))
  }

  /**
   * Emit force logout notification to specific user
   * This can be used for admin-initiated logouts or security events
   */
  emitForceLogout(userId, reason = 'security') {
    return this.emitEvent('force_logout', {
      success: true,
      reason: reason,
      message: 'You have been logged out',
      timestamp: new Date().toISOString()
    }, this.getRoomName('user', userId))
  }

  /**
   * ISSUE 9.6 FIX: Verify JWT token for socket authentication
   */
  verifySocketToken(token) {
    try {
      if (!token) {
        return { valid: false, error: 'No token provided' }
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return { valid: false, error: 'Token expired' }
      }

      return { valid: true, decoded }
    } catch (error) {
      console.error('❌ WebSocket JWT verification failed:', error.message)
      return { valid: false, error: error.message }
    }
  }

  /**
   * RSVP WebSocket Events
   * Emit RSVP-related notifications for real-time updates
   */

  /**
   * Emit RSVP creation event
   * @param {string} eventId - Event ID
   * @param {object} rsvpData - RSVP data
   * @param {string} organizerId - Organizer ID
   */
  emitRSVPCreated(eventId, rsvpData, organizerId) {
    const payload = {
      success: true,
      eventId: eventId,
      rsvp: rsvpData,
      timestamp: new Date().toISOString()
    }

    // Emit to organizer room
    if (organizerId) {
      this.emitEvent('rsvp_created', payload, this.getRoomName('organizer', organizerId))
    }

    // Emit to event-specific room
    this.emitEvent('rsvp_created', payload, this.getRoomName('event', eventId))

    return true
  }

  /**
   * Emit RSVP confirmation event
   * @param {string} eventId - Event ID
   * @param {object} rsvpData - RSVP data
   * @param {string} organizerId - Organizer ID
   */
  emitRSVPConfirmed(eventId, rsvpData, organizerId) {
    const payload = {
      success: true,
      eventId: eventId,
      rsvp: rsvpData,
      timestamp: new Date().toISOString()
    }

    // Emit to organizer room
    if (organizerId) {
      this.emitEvent('rsvp_confirmed', payload, this.getRoomName('organizer', organizerId))
    }

    // Emit to event-specific room
    this.emitEvent('rsvp_confirmed', payload, this.getRoomName('event', eventId))

    return true
  }

  /**
   * Emit RSVP update event
   * @param {string} eventId - Event ID
   * @param {object} rsvpData - RSVP data
   * @param {string} organizerId - Organizer ID
   */
  emitRSVPUpdated(eventId, rsvpData, organizerId) {
    const payload = {
      success: true,
      eventId: eventId,
      rsvp: rsvpData,
      timestamp: new Date().toISOString()
    }

    // Emit to organizer room
    if (organizerId) {
      this.emitEvent('rsvp_updated', payload, this.getRoomName('organizer', organizerId))
    }

    // Emit to event-specific room
    this.emitEvent('rsvp_updated', payload, this.getRoomName('event', eventId))

    return true
  }

  /**
   * Emit RSVP cancellation event
   * @param {string} eventId - Event ID
   * @param {string} rsvpId - RSVP ID
   * @param {string} organizerId - Organizer ID
   */
  emitRSVPCanceled(eventId, rsvpId, organizerId) {
    const payload = {
      success: true,
      eventId: eventId,
      rsvpId: rsvpId,
      timestamp: new Date().toISOString()
    }

    // Emit to organizer room
    if (organizerId) {
      this.emitEvent('rsvp_canceled', payload, this.getRoomName('organizer', organizerId))
    }

    // Emit to event-specific room
    this.emitEvent('rsvp_canceled', payload, this.getRoomName('event', eventId))

    return true
  }

  /**
   * Emit RSVP settings update event (for RSVPModal settings tab)
   * @param {string} eventId - Event ID
   * @param {object} settings - RSVP settings data
   * @param {string} organizerId - Organizer ID
   */
  emitRSVPSettingsUpdated(eventId, settings, organizerId) {
    const payload = {
      success: true,
      eventId: eventId,
      settings: settings,
      timestamp: new Date().toISOString()
    }

    // Emit to organizer room
    if (organizerId) {
      this.emitEvent('rsvp_settings_updated', payload, this.getRoomName('organizer', organizerId))
    }

    // Emit to event-specific room
    this.emitEvent('rsvp_settings_updated', payload, this.getRoomName('event', eventId))

    return true
  }

  /**
   * SPRINT 2 FIX: Emit ticket expiration event
   * Notifies all clients viewing an event that a ticket has expired
   * @param {string} eventId - Event ID
   * @param {string} ticketId - Ticket ID that expired
   * @param {string} ticketTitle - Ticket title for display
   * @param {Date} expirationTime - When the ticket expired
   */
  emitTicketExpired(eventId, ticketId, ticketTitle, expirationTime) {
    const payload = {
      success: true,
      eventId: eventId,
      ticketId: ticketId,
      ticketTitle: ticketTitle,
      expirationTime: expirationTime,
      timestamp: new Date().toISOString()
    }

    console.log(`📤 [WebSocket] Emitting ticket_expired for ticket ${ticketId} (${ticketTitle}) in event ${eventId}`)

    // Emit to event-specific room so all viewers get notified
    return this.emitEvent('ticket_expired', payload, this.getRoomName('event', eventId))
  }

  /**
   * SPRINT 3 FIX: Emit ticket available event (when ticket sales start)
   * Notifies all clients viewing an event that a ticket has become available
   * @param {string} eventId - Event ID
   * @param {string} ticketId - Ticket ID that became available
   * @param {string} ticketTitle - Ticket title for display
   * @param {Date} startTime - When the ticket became available
   */
  emitTicketAvailable(eventId, ticketId, ticketTitle, startTime) {
    const payload = {
      success: true,
      eventId: eventId,
      ticketId: ticketId,
      ticketTitle: ticketTitle,
      startTime: startTime,
      timestamp: new Date().toISOString()
    }

    console.log(`📤 [WebSocket] Emitting ticket_available for ticket ${ticketId} (${ticketTitle}) in event ${eventId}`)

    // Emit to event-specific room so all viewers get notified
    return this.emitEvent('ticket_available', payload, this.getRoomName('event', eventId))
  }

  /**
   * Get statistics about WebSocket connections
   */
  getStats() {
    if (!this.io) {
      return { connected: 0, rooms: [] }
    }

    const sockets = this.io.sockets.sockets
    const connectedCount = sockets.size
    const rooms = Array.from(this.io.sockets.adapter.rooms.keys())
      .filter(room => !sockets.has(room)) // Filter out socket IDs (they're also in rooms)

    return {
      connected: connectedCount,
      rooms: rooms,
      rateLimitedSockets: this.socketEventCounts.size
    }
  }
}

// Export singleton instance
export const websocketService = new WebSocketService()
