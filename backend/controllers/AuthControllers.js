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


export const verfiyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

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

    if (hashedOtp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP VERIFIED (FOR PASSWORD RESET)
    user.otp = null;
    user.otpExpiresAt = null;
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

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
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

    user.password = undefined

    // ✅ VERY IMPORTANT
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    })


  } catch (error) {
    console.error("Signin error:", error)

    return res.status(500).json({
      success: false,
      message: "Error logging in. Please try again.",
    })
  }
}




