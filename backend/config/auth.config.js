/**
 * Centralized Authentication Configuration
 *
 * All authentication-related timeouts and configurations are centralized here
 * to prevent hardcoded values and ensure consistency across the application.
 *
 * Environment Variables Used:
 * - JWT_EXPIRES_IN_MINUTES: JWT token expiry in minutes (default: 10)
 * - REFRESH_TOKEN_EXPIRES_DAYS: Refresh token expiry in days (default: 7)
 * - INACTIVITY_TIMEOUT_MINUTES: User inactivity timeout in minutes (default: 30)
 * - JWT_COOKIE_EXPIRES_IN_MS: JWT cookie max age in milliseconds (calculated from JWT_EXPIRES_IN_MINUTES)
 * - REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS: Refresh token cookie max age in milliseconds (calculated from REFRESH_TOKEN_EXPIRES_DAYS)
 */

export const AUTH_CONFIG = {
  // JWT Token Configuration
  JWT_EXPIRES_IN_MINUTES: parseInt(process.env.JWT_EXPIRES_IN_MINUTES || '10'),
  get JWT_EXPIRES_IN_MS() {
    return this.JWT_EXPIRES_IN_MINUTES * 60 * 1000
  },
  get JWT_EXPIRES_IN() {
    return `${this.JWT_EXPIRES_IN_MINUTES}m`
  },

  // Refresh Token Configuration
  REFRESH_TOKEN_EXPIRES_DAYS: parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7'),
  get REFRESH_TOKEN_EXPIRES_MS() {
    return this.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  },

  // Inactivity Timeout Configuration
  INACTIVITY_TIMEOUT_MINUTES: parseInt(process.env.INACTIVITY_TIMEOUT_MINUTES || '30'),
  get INACTIVITY_TIMEOUT_MS() {
    return this.INACTIVITY_TIMEOUT_MINUTES * 60 * 1000
  },

  // Cookie Configuration
  get JWT_COOKIE_EXPIRES_IN_MS() {
    // Use env var if provided, otherwise calculate from JWT_EXPIRES_IN_MINUTES
    return parseInt(process.env.JWT_COOKIE_EXPIRES_IN_MS) || this.JWT_EXPIRES_IN_MS
  },
  get REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS() {
    // Use env var if provided, otherwise calculate from REFRESH_TOKEN_EXPIRES_DAYS
    return parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS) || this.REFRESH_TOKEN_EXPIRES_MS
  },

  // Session Cleanup Configuration
  CLEANUP_CHECK_INTERVAL_MS: 2 * 60 * 1000, // 2 minutes - hardcoded as it's internal

  // Guest Session Configuration
  GUEST_SESSION_DURATION: process.env.GUEST_SESSION_DURATION || '24h',
  get GUEST_SESSION_MS() {
    const duration = this.GUEST_SESSION_DURATION
    if (duration.endsWith('h')) {
      return parseInt(duration) * 60 * 60 * 1000
    } else if (duration.endsWith('d')) {
      return parseInt(duration) * 24 * 60 * 60 * 1000
    }
    return 24 * 60 * 60 * 1000 // Default 24 hours
  },

  // JWT Algorithm
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',

  // Cookie Security Settings
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
}

/**
 * Validate authentication configuration on startup
 * Ensures JWT expiry is not greater than inactivity timeout
 */
export const validateAuthConfig = () => {
  const errors = []
  const warnings = []

  // Critical validation: JWT expiry must be <= inactivity timeout
  if (AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES > AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES) {
    errors.push(
      `JWT_EXPIRES_IN_MINUTES (${AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES}) must be <= INACTIVITY_TIMEOUT_MINUTES (${AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES}). ` +
      `Users will be logged out due to inactivity before their tokens expire, causing unexpected behavior.`
    )
  }

  // Warning: JWT expiry should not be too close to inactivity timeout
  const buffer = AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES - AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES
  if (buffer < 2 && buffer >= 0) {
    warnings.push(
      `JWT_EXPIRES_IN_MINUTES (${AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES}) is very close to INACTIVITY_TIMEOUT_MINUTES (${AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES}). ` +
      `Consider increasing the gap to at least 2 minutes for better user experience.`
    )
  }

  // Warning: Very short JWT expiry
  if (AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES < 5) {
    warnings.push(
      `JWT_EXPIRES_IN_MINUTES (${AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES}) is very short. ` +
      `This may cause excessive token refresh requests. Consider setting it to at least 5 minutes.`
    )
  }

  // Warning: Very long inactivity timeout
  if (AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES > 60) {
    warnings.push(
      `INACTIVITY_TIMEOUT_MINUTES (${AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES}) is quite long. ` +
      `Consider reducing it for better security.`
    )
  }

  // Print validation results
  console.log('\n' + '='.repeat(80))
  console.log('🔐 Authentication Configuration Validation')
  console.log('='.repeat(80))

  if (errors.length > 0) {
    console.error('\n❌ CRITICAL CONFIGURATION ERRORS:')
    errors.forEach(error => console.error(`   - ${error}`))
    console.log('\n' + '='.repeat(80) + '\n')
    throw new Error('Authentication configuration validation failed. Please fix the errors above.')
  }

  console.log('\n✅ Configuration Valid')
  console.log('\n📊 Current Settings:')
  console.log(`   - JWT Token Expiry:           ${AUTH_CONFIG.JWT_EXPIRES_IN_MINUTES} minutes`)
  console.log(`   - Refresh Token Expiry:       ${AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_DAYS} days`)
  console.log(`   - Inactivity Timeout:         ${AUTH_CONFIG.INACTIVITY_TIMEOUT_MINUTES} minutes`)
  console.log(`   - Guest Session Duration:     ${AUTH_CONFIG.GUEST_SESSION_DURATION}`)
  console.log(`   - Cookie Secure Flag:         ${AUTH_CONFIG.COOKIE_SECURE}`)
  console.log(`   - Cookie SameSite:            ${AUTH_CONFIG.COOKIE_SAME_SITE}`)
  console.log(`   - JWT Algorithm:              ${AUTH_CONFIG.JWT_ALGORITHM}`)

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:')
    warnings.forEach(warning => console.warn(`   - ${warning}`))
  }

  console.log('\n' + '='.repeat(80) + '\n')

  return {
    valid: true,
    errors: [],
    warnings
  }
}

export default AUTH_CONFIG
