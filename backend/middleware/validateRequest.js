import { ZodError } from "zod"

/**
 * Middleware for validating request data against Zod schemas
 * @param {Object} schema - Zod schema to validate against
 * @param {String} source - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      // Add logging for reset-password validation
      if (req.url.includes('/reset-password')) {
        // console.log(`[validateRequest] Validating reset-password request:`, {
        //   source,
        //   data: req[source],
        //   hasData: !!req[source],
        //   dataKeys: req[source] ? Object.keys(req[source]) : []
        // })
      }

      // Parse and validate the request data against the schema
      const data = schema.parse(req[source])

      // Replace the request data with the validated data
      req[source] = data

      if (req.url.includes('/reset-password')) {
        // console.log(`[validateRequest] Reset-password validation successful`)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Enhanced logging for validation errors
        console.error(`[validateRequest] Validation failed for ${req.method} ${req.url}:`, {
          source,
          errors: error.errors,
          receivedData: req[source]
        })

        // Format Zod validation errors
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }))

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        })
      }

      // Pass other errors to the global error handler
      next(error)
    }
  }
}

// Named export for consistency with routes
export { validateRequest }

// Default export for backward compatibility
export default validateRequest
