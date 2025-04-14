import express from "express";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDb.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000; // Set default port if not available

// Middleware Setup
app.use(cors({
  origin: "http://localhost:3000",  // Adjust as needed
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoute);           // Authentication Routes
app.use("/api/user", userRoute);           // User Routes
app.use("/api/post", postRoute);           // Post Routes
app.use("/api/notifications", notificationRoute); // Notification Routes



// Start the server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on port ${PORT}`);
});
