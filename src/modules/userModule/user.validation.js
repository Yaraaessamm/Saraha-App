import joi from "joi";
import { genderEnum, roleEnum } from "../../common/enum/enum.js";
import { generalRules } from "../../common/utils/security/generalRules.js";

export const signupSchema = {
  body: joi
    .object({
      fristName: generalRules.fristName.required(),
      lastName: generalRules.lastName.required(),
      email: generalRules.email.required(),
      confirm: joi.boolean().default(false),
      password: generalRules.password
        .valid(joi.ref("confirmPassword"))
        .required(),
      confirmPassword: generalRules.confirmPassword.required(),
      age: joi.number().positive().min(18).max(100).required(),
      phone: generalRules.phone.required(),
      gender: joi
        .string()
        .valid(...Object.values(genderEnum))
        .required(),
    })
    .required(),

  files: joi.object({
    attachment: joi
      .array()
      .max(1)
      .items(generalRules.file)
      .required()
      .messages({
        "any.required": "attachment is required",
      }),
    attachments: joi
      .array()
      .max(3)
      .items(generalRules.file)
      .required()
      .messages({
        "any.required": "attachments is required",
      }),
  }),
  query: joi.object({
    x: joi.string().trim(),
  }),
};

export const loginSchema = {
  body: joi
    .object({
      email: generalRules.email.required(),
      password: generalRules.password.required(),
    })
    .required(),
};

export const updateUserSchema = {
  params: joi.number().required(),
  body: joi
    .object({
      fristName: generalRules.fristName,
      lastName: generalRules.lastName,
      email: generalRules.email,
      phone: generalRules.phone,
    })
    .required(),
};

export const updatePasswordSchema = {
  body: joi
    .object({
      newPassword: generalRules.password.required(),
      oldPassword: generalRules.password.required(),
    })
    .required(),
};

export const confirmAccountSchema = {
  body: joi
    .object({
      email: generalRules.email.required(),
      code: joi.string().regex(/^[0-9]{6}$/).required(),
    })
    .required(),
};
export const resendConfirmationCodeSchema = {
  body: joi
    .object({
      email: generalRules.email.required(),
    })
    .required(),
};