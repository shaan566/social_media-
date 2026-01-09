import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["refresh", "reset", "verification"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    // Track last activity for session expiry (Issue #3 - Mobile logout fix)
    lastActiveAt: {
      type: Date,
      default: Date.now,
      index: true, // Index for efficient cleanup queries
    },
    // Track platform for potential platform-specific behavior
    platform: {
      type: String,
      enum: ["desktop", "mobile", "unknown"],
      default: "unknown",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d", // Automatically delete documents after 7 days
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
tokenSchema.index({ userId: 1, type: 1 })
tokenSchema.index({ token: 1 })
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index

const Token = mongoose.model("Token", tokenSchema)

export default Token
