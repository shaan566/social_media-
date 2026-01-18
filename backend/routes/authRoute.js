import express from 'express';
import { 
    signup,
    verfiyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    signin
     } from '../controllers/AuthControllers.js';

const router = express.Router();

// User Registration Route
router.post("/signup", signup)
router.post("/verfiyOtp",verfiyOtp)
router.post("/resendOtp", resendOtp)
router.post("/forgotPassword",forgotPassword)
router.post("/resetPassword",resetPassword)
router.post("/signin",signin)

export default router;