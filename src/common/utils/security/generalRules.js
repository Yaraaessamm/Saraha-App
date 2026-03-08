import joi from "joi";
import { genderEnum, providerEnum, roleEnum } from "../../enum/enum.js";
import { Types } from "mongoose";

export const generalRules = {   
    id: joi.string().custom((value, helpers) => {
        const isValid = Types.ObjectId.isValid(value);
        return isValid ? value : helpers.error("any.invalid");
    }),
    email: joi.string().email().trim(),
    password: joi.string()
          .min(6)
          .trim()
          .required(),
    fristName: joi.string().min(3).max(20).trim(),
    lastName: joi.string().min(3).max(20).trim(),
    confirmPassword: joi.string().min(6).trim(),
    age: joi.number().positive().min(18).max(100),
    phone: joi.string().trim(),
    gender: joi.string().valid(...Object.values(genderEnum)),
    role: joi.string().valid(...Object.values(roleEnum)),
    provider: joi.string().valid(...Object.values(providerEnum)),
    file:joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
    }).messages({
        "any.required": "file is required",
    }),

}