import { Router } from "express";
import {
  getProfile,
  login,
  signup,
  signUpWithGoogle,
} from "./user.services.js";
import { validateData } from "../../common/middleware/verification.service.js";
import { loginSchema, signupSchema } from "./user.validation.js";
import { authorization } from "../../common/middleware/authorization.service.js";
import { roleEnum } from "../../common/enum/enum.js";

export const authRouter = Router();
export const userOperationRouter = Router();

authRouter.post("/login", validateData(loginSchema), login);
authRouter.post("/signup", validateData(signupSchema), signup);
authRouter.post("/signup/google" ,signUpWithGoogle);

userOperationRouter.get("/profile", authorization(roleEnum.user), getProfile);