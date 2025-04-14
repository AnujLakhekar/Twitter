import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["follow", "like"]
  },
  read: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

const notification = mongoose.model("notification", NotificationSchema);

export default notification