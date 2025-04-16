import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User.model.js";
import generateToken from "../libs/Token.js"

export const signup = async (req, res) => {
  try {
  const {fullName, username, email, password } = req.body;
  
  let isEmailValid = await User.findOne({email});
  
  let emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
  
  let existingUser = await User.findOne({ username })
  
  // bcryptjs
  
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  
  if(isEmailValid) {
    return res.status(400).json({
      message: "Invalid creditional",
      error: "Account found with this email"
    })
  }
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email"
    })
  }
  
  if (existingUser) {
    return res.status(400).json({
      message: "Account Found With This Username",
    });
  }

  const newUser = new User({
    fullName,
    username,
    email,
    password:hashedPassword,
  })
  
  if (newUser) {
    await newUser.save();
  const token = generateToken(newUser._id, res);
   
    res.status(200).json({
    client: {
      id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullName,
      email: newUser.email,
      followers: newUser.followers,
      followings: newUser.followings,
      profilePic: newUser.profilePic,
      coverImg: newUser.coverImg,
      token: token
    }
  })
  } else {
    return res.status(400).json({
      message: "Internal server error"
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
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const fetchedUser = await User.findOne({ username });

    const isPasswordValid = await bcrypt.compare(password, fetchedUser?.password || "");

    if (!fetchedUser || !isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    
  const token = generateToken(fetchedUser._id, res);
    res.status(200).json({
      client: {
        id: fetchedUser._id,
        username: fetchedUser.username,
        fullname: fetchedUser.fullname,
        email: fetchedUser.email,
        followers: fetchedUser.followers,
        followings: fetchedUser.followings,
        profilePic: fetchedUser.profilePic,
        coverImg: fetchedUser.coverImg,
        token: token
      }
    });

  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
      error: e.message
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({
      message: "user logout!"
    })
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
      error: e.message
    });
  }
};
export const getMe = async (req, res) => {
  try {
   const user = await User.findById(req.user._id).select("-password");
   res.status(200).json(user)
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
      error: e.message
    });
  }
};
