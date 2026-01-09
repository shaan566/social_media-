/**
 * Frontend Error Context Utility
 *
 * PURPOSE: Track errors end-to-end with correlation IDs and structured logging
 *
 * ENTERPRISE SOLUTION:
 * - Generates unique correlation IDs for each user session/request
 * - Tracks error context (user actions, page, component, etc.)
 * - Provides user-friendly error messages
 * - Logs detailed error info for developers (development mode)
 * - Enables tracing errors from frontend to backend
 *
 * ROOT CAUSE FIX:
 * Without correlation tracking, impossible to connect user-reported issues
 * to backend logs. This utility bridges that gap.
 */

import { v4 as uuidv4 } from "uuid"

/**
 * Generate a correlation ID for tracking requests
 * @returns {string} Correlation ID
 */
export const generateCorrelationId = () => {
  return `req-${Date.now()}-${uuidv4()}`
}

/**
 * Get or create session correlation ID
 * Persists across page loads for the same session
 */
let sessionCorrelationId = null
export const getSessionCorrelationId = () => {
  if (!sessionCorrelationId) {
    // Try to get from sessionStorage first
    const stored = sessionStorage.getItem("sessionCorrelationId")
    if (stored) {
      sessionCorrelationId = stored
    } else {
      sessionCorrelationId = `session-${Date.now()}-${uuidv4()}`
      sessionStorage.setItem("sessionCorrelationId", sessionCorrelationId)
    }
  }
  return sessionCorrelationId
}

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: "low", // User can continue, non-critical
  MEDIUM: "medium", // User can continue but should be notified
  HIGH: "high", // User action failed, needs retry
  CRITICAL: "critical", // App is broken, needs immediate attention
}

/**
 * User-friendly error messages by category
 */
export const ErrorMessages = {
  NETWORK: {
    title: "Connection Issue",
    message:
      "We're having trouble connecting to our servers. Please check your internet connection and try again.",
    severity: ErrorSeverity.HIGH,
  },
  TIMEOUT: {
    title: "Request Timed Out",
    message:
      "This is taking longer than expected. Please try again in a moment.",
    severity: ErrorSeverity.MEDIUM,
  },
  AUTH_EXPIRED: {
    title: "Session Expired",
    message: "Your session has expired. Please log in again to continue.",
    severity: ErrorSeverity.HIGH,
  },
  FORBIDDEN: {
    title: "Access Denied",
    message: "You don't have permission to perform this action.",
    severity: ErrorSeverity.MEDIUM,
  },
  NOT_FOUND: {
    title: "Not Found",
    message: "We couldn't find what you're looking for. It may have been removed or doesn't exist.",
    severity: ErrorSeverity.MEDIUM,
  },
  VALIDATION: {
    title: "Invalid Input",
    message: "Please check your information and try again.",
    severity: ErrorSeverity.LOW,
  },
  SERVER_ERROR: {
    title: "Technical Issue",
    message:
      "We encountered a technical issue. Our team has been notified and is working on it.",
    severity: ErrorSeverity.HIGH,
  },
  PAYMENT_ERROR: {
    title: "Payment Issue",
    message:
      "We encountered an issue processing your payment. Please try again or contact support if the problem persists.",
    severity: ErrorSeverity.HIGH,
  },
  PROMO_CODE_ERROR: {
    title: "Promo Code Issue",
    message: "There was a problem applying your promo code. Please verify the code and try again.",
    severity: ErrorSeverity.MEDIUM,
  },
  UNKNOWN: {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
    severity: ErrorSeverity.MEDIUM,
  },
}

/**
 * Categorize error based on status code or error type
 * @param {Error} error - Error object
 * @param {number} statusCode - HTTP status code (if available)
 * @returns {Object} Error category info
 */
export const categorizeError = (error, statusCode = null) => {
  // Network errors
  if (!statusCode && (error.message?.includes("network") || error.message?.includes("fetch"))) {
    return ErrorMessages.NETWORK
  }

  // Timeout errors
  if (error.name === "AbortError" || error.message?.includes("timeout")) {
    return ErrorMessages.TIMEOUT
  }

  // HTTP status code based categorization
  switch (statusCode) {
    case 401:
      return ErrorMessages.AUTH_EXPIRED
    case 403:
      return ErrorMessages.FORBIDDEN
    case 404:
      return ErrorMessages.NOT_FOUND
    case 400:
      return ErrorMessages.VALIDATION
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorMessages.SERVER_ERROR
    default:
      break
  }

  // Error message based categorization
  const message = error.message?.toLowerCase() || ""
  if (message.includes("payment") || message.includes("stripe") || message.includes("checkout")) {
    return ErrorMessages.PAYMENT_ERROR
  }
  if (message.includes("promo") || message.includes("coupon") || message.includes("discount")) {
    return ErrorMessages.PROMO_CODE_ERROR
  }
  if (message.includes("session") || message.includes("expired") || message.includes("log in")) {
    return ErrorMessages.AUTH_EXPIRED
  }

  return ErrorMessages.UNKNOWN
}

/**
 * Create structured error context for logging
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Structured error object
 */
export const createErrorContext = (error, context = {}) => {
  const correlationId = context.correlationId || generateCorrelationId()
  const timestamp = new Date().toISOString()
  const statusCode = context.statusCode || error.response?.status || null
  const category = categorizeError(error, statusCode)

  return {
    // Correlation tracking
    correlationId,
    sessionId: getSessionCorrelationId(),
    timestamp,

    // Error details
    errorName: error.name,
    errorMessage: error.message,
    statusCode,
    category: category.title,
    severity: category.severity,

    // User-friendly message
    userMessage: context.userMessage || category.message,
    userTitle: context.userTitle || category.title,

    // Technical details (for developers)
    stack: error.stack,
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,

    // Additional context
    ...context,

    // Response data (if available)
    responseData: error.response?.data || null,
    backendCorrelationId: error.response?.data?.correlationId || null,
  }
}

/**
 * Log error to console (development mode) or error reporting service (production)
 * @param {Object} errorContext - Structured error context
 */
export const logError = (errorContext) => {
  const isDevelopment = import.meta.env.MODE === "development"

  if (isDevelopment) {
    // Development: Log detailed error info
    console.group(`❌ [ERROR] ${errorContext.category}`)
    console.error("Message:", errorContext.errorMessage)
    console.error("User Message:", errorContext.userMessage)
    console.error("Correlation ID:", errorContext.correlationId)
    if (errorContext.backendCorrelationId) {
      console.error(
        "Backend Correlation ID:",
        errorContext.backendCorrelationId
      )
    }
    console.error("Status Code:", errorContext.statusCode)
    console.error("Severity:", errorContext.severity)
    console.error("Context:", {
      component: errorContext.component,
      action: errorContext.action,
      userId: errorContext.userId,
      pathname: errorContext.pathname,
    })
    if (errorContext.responseData) {
      console.error("Response Data:", errorContext.responseData)
    }
    console.error("Stack:", errorContext.stack)
    console.groupEnd()
  } else {
    // Production: Log concise error (could integrate with Sentry, Rollbar, etc.)
    console.error(
      JSON.stringify({
        correlationId: errorContext.correlationId,
        backendCorrelationId: errorContext.backendCorrelationId,
        category: errorContext.category,
        message: errorContext.errorMessage,
        statusCode: errorContext.statusCode,
        severity: errorContext.severity,
        timestamp: errorContext.timestamp,
        pathname: errorContext.pathname,
      })
    )

    // TODO: Send to error monitoring service
    // Example: Sentry.captureException(error, { extra: errorContext })
  }
}

/**
 * Handle error with full context and user-friendly messaging
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Error context with user message
 */
export const handleError = (error, context = {}) => {
  const errorContext = createErrorContext(error, context)
  logError(errorContext)
  return errorContext
}

/**
 * Format error for display to user
 * @param {Object} errorContext - Error context from handleError()
 * @returns {Object} Display-ready error
 */
export const formatErrorForDisplay = (errorContext) => {
  const isDevelopment = import.meta.env.MODE === "development"

  return {
    title: errorContext.userTitle,
    message: errorContext.userMessage,
    correlationId: errorContext.correlationId,
    severity: errorContext.severity,
    // In development, show technical details
    ...(isDevelopment && {
      technicalDetails: {
        error: errorContext.errorMessage,
        statusCode: errorContext.statusCode,
        backendCorrelationId: errorContext.backendCorrelationId,
      },
    }),
  }
}

/**
 * Extract user-actionable information from backend error
 * @param {Object} backendError - Error response from backend
 * @returns {string} User-friendly message
 */
export const extractUserMessage = (backendError) => {
  // Backend provides message
  if (backendError?.message) {
    return backendError.message
  }

  // Backend provides validation errors
  if (backendError?.errors && Array.isArray(backendError.errors)) {
    return backendError.errors.map(err => err.message || err).join(". ")
  }

  // Fallback
  return null
}
