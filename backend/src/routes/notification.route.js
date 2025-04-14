import express from "express"
import {getAllNotifications, deleteMessage} from "../controllers/notification.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"

const router = express.Router();

router.get("/",ProtectRoute, getAllNotifications)
router.delete("/delete",ProtectRoute, deleteMessage)


export default router