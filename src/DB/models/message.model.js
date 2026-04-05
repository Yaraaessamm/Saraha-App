import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message:{
        type: String,
        required: true,
        minLength: 1,
    },
    attachments:{
        type: [String],
        default: [],
    }
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: true,
    toObject: true,
  },
);


const messageModel =mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;