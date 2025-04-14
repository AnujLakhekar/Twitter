import notification from "../models/Notification.model.js";

export const getAllNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const notifications = await notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePic"
    });

    await notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ message: e.message });
  }
};

export const deleteMessage = async (req, res) => {
  const userId = req.user._id;
  try {
    await notification.deleteMany({ to: userId }); // <- Added await

    res.status(200).json({ message: "Deleted all notifications" });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ message: e.message });
  }
};
