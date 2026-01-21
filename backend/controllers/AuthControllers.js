import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from "../models/tokenModel.js"

import crypto from "crypto"
import { promisify } from "util"
import { JSDOM } from "jsdom"
import createDOMPurify from "isomorphic-dompurify"
import { genrateOtp } from "../services/otpService.js"
import { sendEmail } from "../services/emailService.js"
import AUTH_CONFIG from "../config/auth.config.js"

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)
import rateLimit from 'express-rate-limit';


const genrateToken = (userId) => {
   try{
    return jwt.sign({id : userId}, process.env.JWT_SECRET, {
        expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
    });
   }catch(error){
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");

   }
}

const generateAndSaveRefreshToken = async (userId) => {
  try {
    const refreshToken = crypto.randomBytes(40).toString("hex")
    const expiresAt = new Date(
      Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_MS // Use centralized config
    )

    await Token.create({
      userId,
      token: refreshToken,
      type: "refresh",
      expiresAt,
    })
    return refreshToken
  } catch (error) {
    console.error("Error generating or saving refresh token:", error)
    throw new Error("Could not generate refresh token.")
  }
}

// Helper to set cookies - using centralized config
const setAuthCookies = (res, token, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: AUTH_CONFIG.COOKIE_SECURE, // Use centralized config
    sameSite: AUTH_CONFIG.COOKIE_SAME_SITE, // Use centralized config
    path: "/",
  }

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: AUTH_CONFIG.JWT_COOKIE_EXPIRES_IN_MS, // Use centralized config
  })

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: AUTH_CONFIG.REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS, // Use centralized config
  })
}

// Refresh access token (Example - can be added as a new route)
// ISSUE 6.5 FIX: Enhanced to support guest token refresh
export const refreshToken = async (req, res) => {
  const { refreshToken: requestRefreshToken, token: currentToken } = req.cookies

  // ISSUE 6.5 FIX: Check if this is a guest user trying to refresh
  if (!requestRefreshToken && currentToken) {
    try {
      const decoded = await promisify(jwt.verify)(currentToken, process.env.JWT_SECRET)

      // If it's a guest user, refresh their token
      if (decoded.isGuest || decoded.id === process.env.GUEST_USER_ID) {
        console.log("[refreshToken] Refreshing guest token")

        // Generate new guest token with same data
        const guestPayload = {
          id: decoded.id,
          sessionId: decoded.sessionId,
          isGuest: true,
        }

        const newGuestToken = jwt.sign(guestPayload, process.env.JWT_SECRET, {
          expiresIn: process.env.GUEST_SESSION_DURATION || "24h",
        })

        // Set new guest token cookie
        // const isProduction = process.env.NODE_ENV === "production"
        // res.cookie("token", newGuestToken, {
        //   httpOnly: true,
        //   secure: isProduction,
        //   sameSite: isProduction ? "none" : "lax",
        //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
        //   path: "/",
        // })

        return res.status(200).json({
          success: true,
          message: "Guest token refreshed successfully.",
          isGuest: true,
        })
      }
    } catch (tokenError) {
      console.error("[refreshToken] Guest token refresh failed:", tokenError.message)
      // Fall through to regular error handling
    }
  }

  if (!requestRefreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token not found." })
  }

  try {
    const storedToken = await Token.findOne({
      token: requestRefreshToken,
      type: "refresh",
    })

    if (!storedToken || storedToken.expiresAt < new Date()) {
      await Token.deleteOne({ token: requestRefreshToken, type: "refresh" }) // Clean up expired/invalid token
      // Clear cookies as refresh token is invalid
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      })
      res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      })
      return res.status(403).json({
        success: false,
        message: "Refresh token invalid or expired. Please log in again.",
      })
    }

    // Generate new access token
    const newAccessToken = genrateToken(storedToken.userId)

    // Implement token rotation: generate new refresh token and invalidate old one
    const newRefreshToken = await generateAndSaveRefreshToken(storedToken.userId)

    // Delete the old refresh token from database
    await Token.deleteOne({ token: requestRefreshToken, type: 'refresh' })

    // Set both new access token and new refresh token cookies
    // const isProduction = process.env.NODE_ENV === "production"
    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: isProduction,
    //   sameSite: isProduction ? "none" : "lax",
    //   path: "/",
    // }

    res.cookie("token", newAccessToken, {
      ...cookieOptions,
      maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN_MS || 10 * 60 * 1000), // 10 mins
    })

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS || 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    // PHASE 1: Return user data with successful refresh (Issue #2 fix)
    // This allows client to restore full session state after token refresh
    const user = await User.findById(storedToken.userId).select("-password")

    if (user) {
      // Sanitize user data
      user.name = DOMPurify.sanitize(user.name, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      })
      if (user.bio)
        user.bio = DOMPurify.sanitize(user.bio, {
          USE_PROFILES: { html: true },
        })
    }

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: user
        ? {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
           
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        }
        : undefined,
    })
  } catch (error) {
    console.error("Error refreshing token:", error)
    res
      .status(500)
      .json({ success: false, message: "Could not refresh token." })
  }
}

// BROWSER CLOSE DETECTION: Enhanced logout - Supports sendBeacon API calls
// This ensures clean logout when switching accounts AND when browser closes
export const logout = async (req, res) => {
  try {
    const { refreshToken: requestRefreshToken } = req.cookies

    // BROWSER CLOSE: Log the reason for logout (for debugging/analytics)
    let logoutReason = 'user_action'
    try {
      // Handle sendBeacon data (sent as text/plain or FormData)
      if (req.body && req.body.reason) {
        logoutReason = req.body.reason
      } else if (req.body && typeof req.body === 'string') {
        // Parse text/plain data from sendBeacon
        const parsed = JSON.parse(req.body)
        logoutReason = parsed.reason || 'user_action'
      }
    } catch (parseError) {
      // Ignore parse errors - reason is just for logging
    }

    console.log(`[logout] Logout triggered - Reason: ${logoutReason}`)

    // Delete ALL refresh tokens for this user (not just current one)
    // This prevents issues when switching accounts
    if (req.user && req.user._id) {
      const result = await Token.deleteMany({
        userId: req.user._id,
        type: "refresh",
      })
      console.log(`[logout] Deleted ${result.deletedCount} refresh tokens for user ${req.user._id}`)
    } else if (requestRefreshToken) {
      // Fallback: if user not available, delete just the current token
      await Token.deleteOne({ token: requestRefreshToken, type: "refresh" })
    }

    // Clear cookies with proper settings
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.COOKIE_SAME_SITE || "Strict",
      secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
      path: "/",
    }

    res.cookie("token", "", cookieOptions)
    res.cookie("refreshToken", "", cookieOptions)

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      reason: logoutReason,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Logout error:", error)
    // Even if DB operation fails, still attempt to clear cookies as a best effort
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.COOKIE_SAME_SITE || "Strict",
      secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
      path: "/",
    }

    res.cookie("token", "", cookieOptions)
    res.cookie("refreshToken", "", cookieOptions)

    res.status(500).json({ success: false, message: "Error logging out" })
  }
}


// Register a new user (OTP based)
export const signup = async (req, res) => {
  // console.log("Signup request body:", req.body);
  try {
    // ✅ Sanitize inputs
    const name = DOMPurify.sanitize(req.body.name, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;

    // console.log("Sanitized inputs:", { name, email, password });
    //  Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    
    const Otp = genrateOtp()

    const hashedOtp = crypto
      .createHash("sha256")
      .update(Otp.toString())
      .digest("hex");
    // ✅ Create user (password should be hashed in model)
    const user = await User.create({
      name,
      email,
      password,
      otp:hashedOtp,
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
      emailVerified: false,
    });

     console.log("User created successfully:", user.id)

     await sendEmail({
      email: email,
      subject: "Verify your account - OTP",
      message: `
        <h2>Welcome to Social media app </h2>
        <p>Your OTP is:</p>
        <h1>${Otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    })
    // 🔐 Remove sensitive fields from response
    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Mongo duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Email already registered`,
      });
    }

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Request Body", req.body)
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email }).select("+otp");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ CHECK OTP EXISTS
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    // ✅ CHECK EXPIRY
    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // ✅ HASH & MATCH OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString().trim())
      .digest("hex");

    console.log("that is OTP ",hashedOtp)
    console.log("that is user OTP ", user.otp)
    if (hashedOtp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP VERIFIED (FOR PASSWORD RESET)
    user.otp = null;
    user.otpExpiresAt = null;
    user.emailVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying OTP",
    });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    const otp = genrateOtp();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    user.otp = hashedOtp;
    user.otpAttempts = 0;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await user.save();

    // console.log("Resending OTP to:", email);
    // console.log("OTP:", otp);

    await sendEmail({
      email,
      subject: "Resend OTP - Verify your account",
      message: `
        <h2>OTP Verification</h2>
        <p>Your new OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};



export const forgotPassword = async (req, res) => {
  console.log("email",req.body)
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Generate OTP
    const otp = genrateOtp()
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex")
    console.log(otp)

    // Save OTP in database (separate field)
    user.otp = hashedOtp
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes expiry
    await user.save()

    // Send OTP email
    await sendEmail({
      email,
      subject: "Reset Password OTP",
      message: `
        <h2>Password Reset</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    })

    return res.status(200).json({ success: true, message: "OTP sent to email" })

  } catch (error) {
    console.error("Forgot password error:", error)
    return res.status(500).json({ success: false, message: "Failed to send OTP" })
  }
}
   


export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Set new password
    user.password = password;

    // 4️⃣ Clear OTP-related fields
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;

    // 5️⃣ Mark email verified (optional but recommended)
    user.emailVerified = true;

   
    // 6️⃣ Save user
    await user.save(); // 🔥 password auto-hashed here

    await Token.deleteMany({ userId: user._id })

    return res.status(200).json({
      success: true,
      message: "Password reset successful, Please login again.",
    });

  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password +emailVerified")

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }
    

    // OPTIONAL: email verification check
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
      })
    }

    const token = genrateToken(user._id)
    const refreshToken = await generateAndSaveRefreshToken(user._id)

    setAuthCookies(res, token, refreshToken)


    user.password = undefined

    // ✅ VERY IMPORTANT
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {user},
    })

    

  } catch (error) {
    console.error("Signin error:", error)

    return res.status(500).json({
      success: false,
      message: "Error logging in. Please try again.",
    })
  }
}


export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many attempts. Try again later."
  }
});



