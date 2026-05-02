import express from "express";
import {
  signup,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  signin,
  otpLimiter,
  refreshToken,
  logout,
  getMe,
  validateSession,
} from "../controllers/AuthControllers.js";

import { protect, updateSessionActivity } from "../middleware/authMiddleware.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validationSchemas.js";

import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

/* =======================
   PUBLIC ROUTES
======================= */

// Auth
router.post("/signup", validateRequest(registerSchema), signup);
router.post("/signin", validateRequest(loginSchema), signin);

// OTP (clean grouping)
router.post("/otp/verify", otpLimiter, verifyOtp);
router.post("/otp/resend", otpLimiter, resendOtp);

// Password reset
router.post(
  "/forgot-password",
  otpLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password",
  otpLimiter,

  resetPassword
);

// Session check
router.get("/validate-session", validateSession);

// Token refresh
router.post("/refresh-token", refreshToken);

/* =======================
   PROTECTED ROUTES
======================= */

router.post("/logout", protect, updateSessionActivity, logout);

router.get("/me", protect, updateSessionActivity, getMe);

export default router;