import express from 'express';
import { 
    signup,
     } from '../controllers/AuthControllers.js';

const router = express.Router();

// User Registration Route
router.post("/signup", signup)

export default router;