import jwt from "jsonwebtoken"

import Token from "../models/tokenModel.js"

import { websocketService } from "../services/websocketService.js"

/**
 * Middleware to protect routes that require authentication.
 * It expects the JWT to be in an HttpOnly cookie named 'token'.
 */
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Get token from Header or Cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4) Check if user changed password after the token was issued
    // (This works if you have a 'passwordChangedAt' field in your Schema)
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          success: false,
          message: "User recently changed password! Please log in again.",
        });
      }
    }

    // GRANT ACCESS
    req.user = currentUser;
    next();
  } catch (error) {
    // Handle specific JWT errors
    let message = "Authentication failed";
    if (error.name === "JsonWebTokenError") message = "Invalid token. Please log in again.";
    if (error.name === "TokenExpiredError") message = "Your session has expired. Please log in again.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

/**
 * PHASE 1: Middleware to update lastActiveAt timestamp for refresh tokens
 * This tracks user activity server-side for Issue #3 (Mobile logout fix)
 * Run this AFTER protect middleware to update session activity
 */
export const updateSessionActivity = async (req, res, next) => {
  try {
    // Only update activity for authenticated non-guest users
    if (!req.user || req.user.isGuest) {
      return next()
    }

    const { refreshToken: refreshTokenCookie } = req.cookies

    if (refreshTokenCookie) {
      // Update lastActiveAt for the current refresh token (non-blocking)
      Token.updateOne(
        { token: refreshTokenCookie, type: "refresh", userId: req.user._id },
        { lastActiveAt: new Date() }
      ).catch((err) => {
        // Log error but don't block the request
        console.error("[updateSessionActivity] Failed to update lastActiveAt:", err)
      })
    }

    next()
  } catch (error) {
    // Don't block requests if session activity update fails
    console.error("[updateSessionActivity] Error:", error)
    next()
  }
}

/**
 * Optional authentication middleware that populates req.user if token exists
 * but doesn't reject requests without authentication (for public routes that need user context)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    // Debug logging for checkout requests
    // console.log("[optionalAuth] Debug authentication:")
    // console.log(
    //   "  - Cookies:",
    //   req.cookies ? Object.keys(req.cookies) : "No cookies"
    // )
    // console.log(
    //   "  - Authorization header:",
    //   req.headers.authorization || "None"
    // )
    // console.log("  - Origin:", req.headers.origin || "None")

    // Check for token in cookie or header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token
      // console.log("[optionalAuth] Found token in cookie")
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization?.split(" ")?.[1]
      // console.log("[optionalAuth] Found token in Authorization header")
    }

    // If no token, continue without authentication
    if (!token) {
      // console.log(
      //   "[optionalAuth] No token found - continuing without authentication"
      // )
      return next()
    }

    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

      // Check if user still exists or is guest user
      const isGuestUserFromEnv = decoded.id === process.env.GUEST_USER_ID
      const isGuestUserFromToken = decoded.isGuest === true

      if (isGuestUserFromEnv) {
        // Handle legacy guest user
        req.user = {
          id: decoded.id,
          _id: decoded.id,
          sessionId: decoded.sessionId,
          name: "Guest",
          email: "guest@guest.com",
          role: "guest",
          isGuest: true,
        }
      } else if (isGuestUserFromToken) {
        // Handle new guest user from database
        const GuestUser = (await import("../models/guestUserModel.js")).default
        const guestUser = await GuestUser.findById(decoded.id)

        if (guestUser) {
          req.user = {
            id: guestUser._id,
            _id: guestUser._id,
            sessionId: decoded.sessionId,
            name: guestUser.name,
            email: guestUser.email,
            phoneNumber: guestUser.phoneNumber,
            role: "guest",
            isGuest: true,
          }
        }
      } else {
        // Handle regular user
        const currentUser = await User.findById(decoded.id).select("-password")
        if (currentUser) {
          // Check if user changed password after the token was issued
          if (
            !currentUser.passwordChangedAt ||
            currentUser.passwordChangedAt.getTime() / 1000 <= decoded.iat
          ) {
            req.user = currentUser
            // console.log(
            //   `[optionalAuth] Successfully authenticated regular user: ${currentUser.name} (${currentUser._id})`
            // )
          } else {
            // console.log(
            //   "[optionalAuth] User password changed after token was issued - not authenticating"
            // )
          }
        } else {
          // console.log(
          //   `[optionalAuth] User not found for decoded ID: ${decoded.id}`
          // )
        }
      }
    } catch (tokenError) {
      // Invalid token - just continue without authentication
      // console.log("Optional auth: Invalid token, continuing without auth")
    }

    next()
  } catch (error) {
    // On any error, just continue without authentication
    console.error("Optional auth error:", error.message)
    next()
  }
}
