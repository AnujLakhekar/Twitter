import mongoose from "mongoose"


const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String
  },
  img: {
    type: String
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users"
    }
    ],
  comments:[
    {
    text: {
    type: String
      },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
      },
    }
    ]
  }, {timestamps: true})

const Post = mongoose.model("posts", postSchema);

export default Post