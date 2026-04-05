import joi from "joi";
import { generalRules } from "../../common/utils/security/generalRules.js";
export const sendMessageSchema = {
  body: joi
    .object({
      message: generalRules.message.required(),
      receiverId: generalRules.id.required(),
    })
    .required(),
  files: joi.array().max(3).items(generalRules.file).messages({
    "any.required": "attachments is required",
  }),
};
export const getMessageSchema = {
  params: joi
    .object({
      messageId: generalRules.id.required(),
    })
    .required(),
};