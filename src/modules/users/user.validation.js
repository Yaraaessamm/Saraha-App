import Joi from "joi";
import { genderEnum, roleEnum } from "../../common/enum/enum.js";

export const signupSchema = {
  body: Joi.object({
    fristName: Joi.string().min(3).max(20).trim().required(),
    lastName: Joi.string().min(3).max(20).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().valid(Joi.ref("confirmPassword")).min(6).trim().required(),
    confirmPassword: Joi.string().min(6).trim().required(),
    age: Joi.number().positive().min(18).max(100).required(),
    phone: Joi.string().trim().required(),
    gender: Joi.string().valid(...Object.values(genderEnum)),
  }).required(),
  query: Joi.object({
    x: Joi.string().trim(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).trim().required(),
  }).required(),
};