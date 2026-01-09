import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
// import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";


import authRoutes from "./routes/authRoute.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

/* =======================
   DATABASE
======================= */
connectDB();


/* =======================
   SECURITY MIDDLEWARE
======================= */
app.use(helmet());
app.use(compression());
// app.use(mongoSanitize({
//   sanitizeQuery: false,
// }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later",
});
app.use("/api", limiter);

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

app.use("/api/auth", authRoutes);

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
