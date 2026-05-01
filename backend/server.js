import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/authRoute.js";
import connectDB from "./config/db.js";

// Env validation
import {
  validateEnvironment,
  printValidationResults,
} from "./utils/envValidator.js";

import { validateAuthConfig } from "./config/auth.config.js";

dotenv.config();

const app = express();

/* =======================
   VALIDATIONS
======================= */
const validationResults = validateEnvironment();
const isValid = printValidationResults(validationResults);

if (!isValid && process.env.NODE_ENV === "production") {
  console.error("💥 Invalid config in production");
  process.exit(1);
}

if (!isValid) {
  console.warn("⚠️ Running with warnings (dev mode)\n");
}

try {
  validateAuthConfig();
} catch (error) {
  console.error("💥 Auth config error:", error.message);
  process.exit(1);
}

/* =======================
   DATABASE
======================= */
connectDB();

/* =======================
   MIDDLEWARE
======================= */
app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(
  mongoSanitize({
    sanitizeQuery: false,
  })
);
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later",
});

/* =======================
   CORS
======================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =======================
   BODY PARSER
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES
======================= */
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

app.use("/api/auth", limiter, authRoutes);

/* =======================
   ERROR HANDLER (LAST)
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   START SERVER (LAST)
======================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});