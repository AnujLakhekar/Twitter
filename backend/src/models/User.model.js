import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  profilePic: {
    type: String,
    default: ""
  },
  coverImg: {
    type: String,
    default: ""
  },
  likedPosts: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Post"
}]

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
