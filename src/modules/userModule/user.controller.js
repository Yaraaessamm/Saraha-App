import e, { Router } from "express";
import {
  getProfile,
  login,
  refreshToken,
  shareProfile,

  signup,
  signUpWithGoogle,

  updatePassword,
  updateProfile,
} from "./user.services.js";
import { validateData } from "../../common/middleware/verification.service.js";
import { loginSchema, signupSchema } from "./user.validation.js";
import { authorization } from "../../common/middleware/authorization.service.js";
import { fileTypeEnum, roleEnum } from "../../common/enum/enum.js";
import { multer_host_Middleware} from "../../common/middleware/multer.service.js";
import { authMiddleware } from "../../common/middleware/auth.service.js";

export const authRouter = Router();
export const userOperationRouter = Router();

authRouter.post("/login", validateData(loginSchema), login);
authRouter.post("/signup", multer_host_Middleware(fileTypeEnum.image).fields([
    {
        name:"attachment",
        maxCount:1
      },
      {
        name:"attachments",
        maxCount:3
      }
]), validateData(signupSchema), signup);
authRouter.post("/signup/google" ,signUpWithGoogle);
authRouter.post("/refresh-token", refreshToken);

userOperationRouter.get("/profile",authMiddleware, authorization(roleEnum.user), getProfile);
userOperationRouter.get("/shareProfile/:id", shareProfile);
userOperationRouter.put("/updateProfile/:id",authMiddleware, authorization(roleEnum.user), updateProfile);
userOperationRouter.put("/updatePassword/:id",authMiddleware, authorization(roleEnum.user), updatePassword);