import express from "express"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import notificationRoute from "./routes/notification.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDb.js"
import {v2 as cloudinary} from "cloudinary"
import cors from "cors"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const app = express();
const PORT = process.env.PORT;

app.use(cors({
origin: "http://localhost:3000",
credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/notifications", notificationRoute);

app.listen(PORT, () => {
  connectDB();
 console.log("server started on : ", PORT)
})

