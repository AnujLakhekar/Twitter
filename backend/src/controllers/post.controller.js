import mongoose from "mongoose"
import Post from "../models/post.model.js"
import User from "../models/User.model.js"
import notification from "../models/Notification.model.js"
import {v2 as cloudinary} from "cloudinary"


export const createPost = async (req, res) => {
  const {text} = req.body;
  let {img} = req.body;
  const userId = req.user._id.toString()
  
  try {
    const user = await User.findById(userId);
    
    if (!user) return res.status(400).json({
      message: "User not found"
      })
    
    if (!text) return res.status(400).json({
      message: "Provide atleast text before uploading"
    })
    
    if (img) {
      const res = await cloudinary.uploader.upload(img);
      img = res.secure_url;
    }
    
    const newPost = new Post({
      user: userId,
      text,
      img,
    })
    
    await newPost.save()
    
    res.status(200).json(newPost)
    
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: e.message
    })
  }
}
export const deletePost = async (req, res) => {
  const _id = req.params.id;
  
  try {
  const post = await Post.findOne({_id});
  
  if (post.img) {
    const imgId = post.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgId);
  }
  
  await Post.findByIdAndDelete(req.params.id)
    
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: e.message
    })
  }
}
export const commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; 
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const post = await Post.findById(postId); 
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: e.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isPostLiked = post.likes.includes(userId);

    if (isPostLiked) {
      // Unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}})
      return res.status(200).json({
        message: "Unliked successfully",
      });
      
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      await User.updateOne({_id: userId}, {$push: {likedPosts: postId}})

      const newNotification = new notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await newNotification.save();

      return res.status(200).json({
        message: "Liked successfully",
      });
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};


export const share = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.shareid;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(400).json({message: "user not found"})
    }
    
    res.status(200).json({
      message: "ok"
    })

  } catch (e) {
    res.status(400).json({message: "internal serval error"})
  }
}


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1}).populate({
      path: "user",
      select: "-password"
    })
    .populate({
      path: "comments.user",
      select: "-password"
    })
    
    if (posts.length === 0) {
      return res.status(200).json([])
    }
    
    res.status(200).json(posts)
    
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

export const getAllLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
    const likedPosts = await Post.findOne({_id: {$in : user.likedPosts}}).populate({
      path: "user",
      select: "-password"
    })
    .populate({
      path: "comments.user",
      select: "-password"
    })
    
    res.status(200).json(likedPosts)
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const {username} = req.params;
    
    const user = User.findOne({username});
    
    const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
      path: "user",
      select: "-password"
    })
    .populate({
      path: "comments.user",
      select: "-password"
    })
    
  
    res.status(200).json(posts)
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

export const getFollwingsFeed = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

