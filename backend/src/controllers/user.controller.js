import mongoose from "mongoose"
import User from "../models/User.model.js";
import notification from "../models/Notification.model.js"
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from "cloudinary"

export const getUserProfile = async (req, res) => {
  let {username} = req.params;
  try {
    const user = await User.findOne({username}).select("-password");
    
    if (!user) {
     return res.status(400).json({
        message: "profile not found"
      });
    }
    
    res.status(200).json(user);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: "Internal server error",
      error: e.message
    })
  }
}


export const getSiggetions = async (req, res) => {
  try {
    const userId = req.user._id;
  const userFollowedByMe = await user.findById(userId).select("following");
  
  const users = await User.aggregate([
    {
      $match:{
        _id: {$ne:userId}
      }
    },
 {$sample:{size:10}}
    ])
    
    const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0,4);
  
  suggestedUsers.forEach((user) => (user.password = null));
  
  res.status(200).json(suggestedUsers)
  } catch (e) {
    
  }
}

export const followUnfollowUser = async (req, res) => {
  const {id} = req.params;
  try {
    
    const userTomodify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    
    console.log(userTomodify);
    console.log(currentUser)
    
    if (!userTomodify || !currentUser) return res.status(400).json({
      message: "user not found"
    });
    
    if (id == req.user._id) {
      return res.status(400).json({
        message: "you can'nt follow/unfollow yourself"
      })
    }
    
    const isFollowing = currentUser.following.includes(id);
    
    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}})
      await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}})
      
      res.status(200).json({
        message: `successfully followed ${userTomodify.username}`
      })
    } else {
      // follow
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
      
      await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
      const newNotification = new notification({
        type: "follow",
        from: req.user._id,
        to: userTomodify._id
      })
    }
  
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: "Internal server error",
      error: e.message
    })
  }
}


export const updateUser = async (req, res) => {
	const {
  fullName = "",
  email = "",
  username = "",
  currentPassword = "",
  newPassword = "",
  bio = "",
  link = "",
} = req.body || {};

	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
		  	profileImg = uploadedResponse.secure_url;
		  	
		  	console.log(profileImg)
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profilePic = profileImg || user.profilePic;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};