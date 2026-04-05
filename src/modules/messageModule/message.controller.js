import { Router } from "express";
import { getAllMessages, getMessage, sendMessage } from "./message.services.js";
import { validateData } from "../../common/middleware/verification.service.js";
import { getMessageSchema, sendMessageSchema } from "./message.validation.js";
import { authMiddleware } from "../../common/middleware/auth.service.js";
import { multer_host_Middleware } from "../../common/middleware/multer.service.js";
import { fileTypeEnum } from "../../common/enum/enum.js";

export const messageRouter = Router({ mergeParams: true });
messageRouter.post("/send",multer_host_Middleware(fileTypeEnum.image).array("attachments", 3) ,validateData(sendMessageSchema), sendMessage);
messageRouter.get(
  "/:messageId",
  authMiddleware,
  validateData(getMessageSchema),
  getMessage,
);
messageRouter.get("/", authMiddleware, getAllMessages);