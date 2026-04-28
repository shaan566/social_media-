import express from 'express';
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
    getMe ,
    validateSession
} from '../controllers/AuthControllers.js';

import { protect ,updateSessionActivity } from "../middleware/authMiddleware.js"

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,


} from "../utils/validationSchemas.js"
import { validateRequest  } from "../middleware/validateRequest.js"

const router = express.Router();

// --- Public Routes ---
router.post("/signup", validateRequest(registerSchema) ,signup);
router.post("/signin", validateRequest(loginSchema) , signin);
router.post("/verifyOtp", otpLimiter, verifyOtp);
router.post("/resendOtp", otpLimiter, resendOtp);
router.post("/forgotPassword",validateRequest(forgotPasswordSchema), otpLimiter, forgotPassword);
router.post("/resetPassword", validateRequest(resetPasswordSchema), otpLimiter, resetPassword);



// PHASE 1: Validate session route - NOT protected (used to check if cookies are valid)
// This fixes Issue #2 (Stripe redirect logout)
router.get("/validate-session", validateSession)


// --- Token Management ---
// Fixed the path and kept it public because it handles its own logic
router.post("/refreshToken", refreshToken); 

// --- Protected Routes ---
router.post("/logout", protect, updateSessionActivity, logout);


router.get("/getme",protect,updateSessionActivity,getMe )

export default router;