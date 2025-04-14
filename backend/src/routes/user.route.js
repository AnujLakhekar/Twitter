import express from "express"
import {getUserProfile, followUnfollowUser, updateUser, getSiggetions} from "../controllers/user.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"
import multer from "multer";


const router = express.Router();
const storage = multer.memoryStorage(); // to get buffer
const upload = multer({ storage });

router.post(
  "/updateProfile",
  ProtectRoute,
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "coverImg", maxCount: 1 }
  ]),
  updateUser
);
router.get("/profile/:username", ProtectRoute, getUserProfile);
router.post("/follow/:id", ProtectRoute, followUnfollowUser);
router.post("/getSuggested", ProtectRoute, getSiggetions);



export default router