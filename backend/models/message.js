import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
