import express from 'express';
import { 
    signup,
    verfiyOtp,
    resendOtp
     } from '../controllers/AuthControllers.js';

const router = express.Router();

// User Registration Route
router.post("/signup", signup)
router.post("/verfiyOtp",verfiyOtp)
router.post("/resendOtp", resendOtp)

export default router;