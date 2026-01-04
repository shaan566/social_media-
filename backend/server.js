import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'

import connectDB from './config/db.js';



dotenv.config();const app = express();

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

// 🔥 TEST DATABASE ROUTE
app.get("/test-db", async (req, res) => {
  try {
    const user = await User.create({
      name: "Shaan",
      email: "shaan@test.com",
      password: "12345678",
    });

    res.json({
      success: true,
      message: "Database connected & user created",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
