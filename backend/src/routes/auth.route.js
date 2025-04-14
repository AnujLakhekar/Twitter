import express from "express"
import {getMe, logout, signup, login} from "../controllers/auth.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"

const router = express.Router();

router.get("/me", ProtectRoute ,getMe)
router.post("/signup", signup)
router.post("/logout", logout)
router.post("/login", login)

export default router