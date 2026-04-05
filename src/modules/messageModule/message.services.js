import { successResponse } from "../../common/success.response.js";
import { create, find, findById } from "../../DB/DB.service.js";
import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import cloudinary from "../../common/utils/cloudinary/cloudinary.service.js";

export const sendMessage = async (req, res, next) => {
  const { message, receiverId } = req.body;
    console.log(message,receiverId);
    
  const userExist = await findById({ model:userModel, id: receiverId });
  if (!userExist){
        throw new Error("User not found", { cause: 401 });
  }

  let attachments = [];
  if (req.files && req.files.length > 0) {
    attachments = await Promise.all(
      req.files.map(async (file) => {
        const { secure_url } = await cloudinary.uploader.upload(file.path);
        return secure_url;
      })
    );
  }

  const send = await create({ 
    model: messageModel, 
    data: { message, receiverId, attachments } 
  });
  successResponse({ res, status: 200, message: "Message sent successfully" });
};
export const getMessage = async (req, res, next) => {
    const {messageId} = req.params;
    const message = await find({model: messageModel, filter: {_id: messageId, receiverId: req.userInfo.id}});
    if(!message){
        throw new Error("Message not found", { cause: 404 });
    }
    successResponse({ res, status: 200, message: "Message retrieved successfully", data: message });

};
export const getAllMessages = async (req, res, next) => {
    const messages = await find({model: messageModel, filter: {receiverId: req.userInfo.id || req}});
    if(messages.length === 0){
        throw new Error("No messages found", { cause: 404 });
    }
    successResponse({ res, status: 200, message: "Messages retrieved successfully", data: messages });
};