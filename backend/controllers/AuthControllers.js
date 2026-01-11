import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from "../models/tokenModel.js"

import crypto from "crypto"
import { promisify } from "util"
import { JSDOM } from "jsdom"
import createDOMPurify from "isomorphic-dompurify"
import { genrateOtp } from "../services/otpService.js"

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

    // ✅ Create user (password should be hashed in model)
    const user = await User.create({
      name,
      email,
      password,
    });

     console.log("User created successfully:", user.id)

    

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

  try{

    const {email,Otp} = req.body

    if(!email || !Otp){
      return 
    }



    


  }
  catch(err){
    console.log(err)
  }

} 

   