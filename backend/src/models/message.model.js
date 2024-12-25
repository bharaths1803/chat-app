import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: String,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);

export default Message;
