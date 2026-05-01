/**
 * Environment Variable Validation Utility
 * ISSUE 10.3 FIX: Comprehensive environment validation on startup
 *
 * Validates all required environment variables and their formats
 * Provides clear error messages for misconfiguration
 * Fails fast to prevent runtime issues
 */

/**
 * Parse time string to milliseconds (e.g., '10m' -> 600000)
 */
const parseTimeToMs = (timeStr) => {
  if (!timeStr) return null

  const match = timeStr.match(/^(\d+)(ms|s|m|h|d)$/)
  if (!match) return null

  const value = parseInt(match[1])
  const unit = match[2]

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }

  return value * multipliers[unit]
}

/**
 * Validate JWT expiry format
 */
const validateJwtExpiry = (value) => {
  if (!value) return { valid: false, error: 'JWT_EXPIRES_IN is required' }

  const timeInMs = parseTimeToMs(value)
  if (timeInMs === null) {
    return {
      valid: false,
      error: `Invalid JWT_EXPIRES_IN format: "${value}". Expected format: 10m, 1h, 7d, etc.`
    }
  }

  // Warn if token expiry is too long (> 1 hour)
  if (timeInMs > 60 * 60 * 1000) {
    return {
      valid: true,
      warning: `JWT_EXPIRES_IN is set to ${value} (${timeInMs}ms). Consider using shorter expiry for security (recommended: 10m)`
    }
  }

  return { valid: true, timeInMs }
}

/**
 * Validate cookie expiry matches JWT expiry
 */
const validateCookieExpiry = (jwtExpiry, cookieExpiry) => {
  if (!cookieExpiry) {
    return { valid: false, error: 'JWT_COOKIE_EXPIRES_IN_MS is required' }
  }

  const cookieMs = parseInt(cookieExpiry)
  if (isNaN(cookieMs)) {
    return {
      valid: false,
      error: `Invalid JWT_COOKIE_EXPIRES_IN_MS: "${cookieExpiry}". Expected number in milliseconds`
    }
  }

  const jwtMs = parseTimeToMs(jwtExpiry)
  if (jwtMs && Math.abs(jwtMs - cookieMs) > 1000) {
    return {
      valid: false,
      error: `Cookie expiry (${cookieMs}ms) doesn't match JWT expiry (${jwtMs}ms). These should be equal.`
    }
  }

  return { valid: true, cookieMs }
}

/**
 * Validate URL format (supports comma-separated URLs for CORS origins)
 */
const validateUrl = (value, name, allowMultiple = false) => {
  if (!value) return { valid: false, error: `${name} is required` }

  // Support comma-separated URLs for CORS origins
  if (allowMultiple && value.includes(',')) {
    const urls = value.split(',').map(url => url.trim())
    const invalidUrls = []

    for (const url of urls) {
      try {
        new URL(url)
      } catch (error) {
        invalidUrls.push(url)
      }
    }

    if (invalidUrls.length > 0) {
      return {
        valid: false,
        error: `Invalid ${name} format. Invalid URLs: ${invalidUrls.join(', ')}. Each URL should be valid (e.g., http://localhost:5173)`
      }
    }

    return { valid: true, urls }
  }

  // Single URL validation
  try {
    new URL(value)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: `Invalid ${name} format: "${value}". Expected valid URL (e.g., http://localhost:5173 or https://example.com)`
    }
  }
}

/**
 * Validate boolean string
 */
const validateBoolean = (value, name) => {
  if (!value) return { valid: true, value: false } // Optional, defaults to false

  if (value !== 'true' && value !== 'false') {
    return {
      valid: false,
      error: `Invalid ${name}: "${value}". Expected "true" or "false"`
    }
  }

  return { valid: true, value: value === 'true' }
}

/**
 * Validate SameSite cookie setting
 */
const validateSameSite = (value, name) => {
  if (!value) return { valid: true, value: 'lax' } // Default

  const validValues = ['strict', 'lax', 'none']
  if (!validValues.includes(value.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid ${name}: "${value}". Expected one of: strict, lax, none`
    }
  }

  return { valid: true, value: value.toLowerCase() }
}

/**
 * Check for ignored/deprecated environment variables
 */
const checkIgnoredVars = () => {
  const ignoredVars = [
    { name: 'TOKEN_EXPIRY', message: 'Use JWT_EXPIRES_IN instead' },
    { name: 'REFRESH_EXPIRY', message: 'Use REFRESH_TOKEN_EXPIRY instead' }
  ]

  const warnings = []

  ignoredVars.forEach(({ name, message }) => {
    if (process.env[name]) {
      warnings.push(`⚠️  ${name} is set but ignored. ${message}`)
    }
  })

  return warnings
}

/**
 * Main validation function
 */
export const validateEnvironment = () => {
  const errors = []
  const warnings = []

  console.log('\n🔍 Validating environment configuration...\n')

  // Required environment variables (basic)
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLIENT_URL',
    'JWT_EXPIRES_IN_MINUTES',
    'JWT_COOKIE_EXPIRES_IN_MS',
    'REFRESH_TOKEN_EXPIRES_DAYS',
    'REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS'
  ]

  // Check for missing required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`❌ Missing required environment variable: ${varName}`)
    }
  })

  // If basic vars missing, stop here
  if (errors.length > 0) {
    return { valid: false, errors, warnings }
  }

  // Note: JWT validation now uses JWT_EXPIRES_IN (legacy format) or JWT_EXPIRES_IN_MINUTES
  // Skip validation if using new centralized config (JWT_EXPIRES_IN_MINUTES)
  const usingNewConfig = process.env.JWT_EXPIRES_IN_MINUTES && process.env.REFRESH_TOKEN_EXPIRES_DAYS

  if (!usingNewConfig) {
    // Legacy validation - only if old format is used
    if (process.env.JWT_EXPIRES_IN) {
      const jwtValidation = validateJwtExpiry(process.env.JWT_EXPIRES_IN)
      if (!jwtValidation.valid) {
        errors.push(`❌ ${jwtValidation.error}`)
      } else if (jwtValidation.warning) {
        warnings.push(`⚠️  ${jwtValidation.warning}`)
      }

      const cookieValidation = validateCookieExpiry(
        process.env.JWT_EXPIRES_IN,
        process.env.JWT_COOKIE_EXPIRES_IN_MS
      )
      if (!cookieValidation.valid) {
        errors.push(`❌ ${cookieValidation.error}`)
      }
    }

    if (process.env.REFRESH_TOKEN_EXPIRY) {
      const refreshValidation = validateJwtExpiry(process.env.REFRESH_TOKEN_EXPIRY)
      if (!refreshValidation.valid) {
        errors.push(`❌ REFRESH_TOKEN_EXPIRY: ${refreshValidation.error}`)
      }

      const refreshCookieValidation = validateCookieExpiry(
        process.env.REFRESH_TOKEN_EXPIRY,
        process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS
      )
      if (!refreshCookieValidation.valid) {
        errors.push(`❌ REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS: ${refreshCookieValidation.error}`)
      }
    }
  } else {
    // New centralized config - just validate they're numbers
    const jwtMinutes = parseInt(process.env.JWT_EXPIRES_IN_MINUTES)
    if (isNaN(jwtMinutes) || jwtMinutes <= 0) {
      errors.push(`❌ JWT_EXPIRES_IN_MINUTES must be a positive number`)
    }

    const refreshDays = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS)
    if (isNaN(refreshDays) || refreshDays <= 0) {
      errors.push(`❌ REFRESH_TOKEN_EXPIRES_DAYS must be a positive number`)
    }
  }

  // Validate CLIENT_URL (allow comma-separated for CORS origins)
  const clientUrlValidation = validateUrl(process.env.CLIENT_URL, 'CLIENT_URL', true)
  if (!clientUrlValidation.valid) {
    errors.push(`❌ ${clientUrlValidation.error}`)
  }

  // Validate cookie security settings
  const cookieSecureValidation = validateBoolean(process.env.COOKIE_SECURE, 'COOKIE_SECURE')
  if (!cookieSecureValidation.valid) {
    errors.push(`❌ ${cookieSecureValidation.error}`)
  }

  const sameSiteValidation = validateSameSite(process.env.COOKIE_SAME_SITE, 'COOKIE_SAME_SITE')
  if (!sameSiteValidation.valid) {
    errors.push(`❌ ${sameSiteValidation.error}`)
  }

  // Check for ignored variables
  const ignoredWarnings = checkIgnoredVars()
  warnings.push(...ignoredWarnings)

  // Validate consistency between settings
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    // In production, cookies should be secure
    if (!cookieSecureValidation.value && cookieSecureValidation.value !== undefined) {
      warnings.push('⚠️  COOKIE_SECURE should be "true" in production')
    }

    // In production with HTTPS, SameSite should likely be "none"
    if (sameSiteValidation.value === 'lax' && process.env.CLIENT_URL?.startsWith('https://')) {
      warnings.push('⚠️  Consider setting COOKIE_SAME_SITE to "none" for production HTTPS')
    }
  }

  // Check Default Stripe configuration
  const stripeVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_SUCCESS_URL',
    'STRIPE_CANCEL_URL'
  ]

  const hasAnyStripe = stripeVars.some(v => process.env[v])
  const hasAllStripe = stripeVars.every(v => process.env[v])

  if (hasAnyStripe && !hasAllStripe) {
    const missingStripe = stripeVars.filter(v => !process.env[v])
    warnings.push(`⚠️  Incomplete default Stripe configuration. Missing: ${missingStripe.join(', ')}`)
  }

  // Check US Stripe configuration (optional for USD payments)
  const usStripeVars = [
    'US_STRIPE_SECRET_KEY',
    'US_STRIPE_PUBLISHABLE_KEY',
    'US_STRIPE_WEBHOOK_SECRET',
    'US_STRIPE_SUCCESS_URL',
    'US_STRIPE_CANCEL_URL'
  ]

  const hasAnyUSStripe = usStripeVars.some(v => process.env[v])
  const hasAllUSStripe = usStripeVars.every(v => process.env[v])

//   if (hasAnyUSStripe && !hasAllUSStripe) {
//     const missingUSStripe = usStripeVars.filter(v => !process.env[v])
//     warnings.push(`⚠️  Incomplete US Stripe configuration. Missing: ${missingUSStripe.join(', ')}. USD payments will use default Stripe.`)
//   }

//   if (!hasAnyUSStripe) {
//     warnings.push('ℹ️  US Stripe not configured - USD payments will use default Stripe account')
//   }

  // Check Cloudinary configuration
  const cloudinaryVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ]

  const hasAnyCloudinary = cloudinaryVars.some(v => process.env[v])
  const hasAllCloudinary = cloudinaryVars.every(v => process.env[v])

  if (hasAnyCloudinary && !hasAllCloudinary) {
    const missingCloudinary = cloudinaryVars.filter(v => !process.env[v])
    warnings.push(`⚠️  Incomplete Cloudinary configuration. Missing: ${missingCloudinary.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Print validation results
 */
export const printValidationResults = (results) => {
  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n')
    results.warnings.forEach(warning => console.log(`   ${warning}`))
    console.log('')
  }

  if (results.errors.length > 0) {
    console.error('❌ CONFIGURATION ERRORS:\n')
    results.errors.forEach(error => console.error(`   ${error}`))
    console.error('\n')
    console.error('Please fix the above errors in your .env file before starting the server.\n')
    return false
  }

  console.log('✅ Environment configuration is valid\n')

  // Print configuration summary
  console.log('📋 Configuration Summary:')
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
  if (process.env.JWT_EXPIRES_IN_MINUTES) {
    console.log(`   JWT_EXPIRES_IN_MINUTES: ${process.env.JWT_EXPIRES_IN_MINUTES}`)
    console.log(`   REFRESH_TOKEN_EXPIRES_DAYS: ${process.env.REFRESH_TOKEN_EXPIRES_DAYS}`)
    console.log(`   INACTIVITY_TIMEOUT_MINUTES: ${process.env.INACTIVITY_TIMEOUT_MINUTES || 'not set'}`)
  } else {
    console.log(`   JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}`)
    console.log(`   REFRESH_TOKEN_EXPIRY: ${process.env.REFRESH_TOKEN_EXPIRY}`)
  }
  console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}`)
  console.log(`   COOKIE_SECURE: ${process.env.COOKIE_SECURE || 'false'}`)
  console.log(`   COOKIE_SAME_SITE: ${process.env.COOKIE_SAME_SITE || 'lax'}`)
  console.log('')

  return true
}
