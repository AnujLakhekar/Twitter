import express from "express"
import {createPost, deletePost, commentPost, likeUnlikePost, getAllPosts, getAllLikedPosts, getFollwingsFeed, getUserPosts} from "../controllers/post.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"

const router = express.Router();

router.get("/", ProtectRoute , getAllPosts)
router.get("/following", ProtectRoute , getFollwingsFeed)
router.get("/liked/:id", ProtectRoute , getAllLikedPosts)
router.get("/user/:username", ProtectRoute , getUserPosts)
router.post("/create", ProtectRoute ,createPost)
router.post("/like/:id" , likeUnlikePost)
router.post("/comment/:id", ProtectRoute , commentPost)
router.delete("/delete/:id", ProtectRoute ,deletePost)


export default router