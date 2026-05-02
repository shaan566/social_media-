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



// ========== PERFORMANCE FIX: Request-Level Timeout Middleware ==========
// Add timeout handler for individual requests (especially for /api/create creation)
app.use((req, res, next) => {
  // Set request timeout to 120 seconds
  req.setTimeout(120000, () => {
    console.error(`⏱️  Request timeout: ${req.method} ${req.url}`)
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message:
          "Request timeout - the operation took too long. Please try again.",
        hint: "If publishing an event, ensure your images are optimized (< 5MB each)",
      })
    }
  })
  next()
})


// Rate limiting for specific auth routes (excluding refresh-token)
const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX || 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})


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

// Apply rate limiting to specific auth endpoints (refresh-token excluded)
app.use("/api/auth", limiter, authRoutes);




// Health check endpoint
app.get("/api/health", (req, res) => {
  const now = new Date()
  const formattedTimestamp = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: true,
  }).format(now)

  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: formattedTimestamp,
  })
})



app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});
/* =======================
   ERROR HANDLER (LAST)
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
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