import e, { Router } from "express";
import {
  confirmAccount,
  forgetPassword,
  forgetPasswordUsingOTAL,
  getProfile,
  login,
  logout,
  refreshToken,
  resendConfirmationCode,
  resendLoginConfirmationCode,
  resetPassword,
  resetPasswordUsingOTAL,
  shareProfile,
  signup,
  signUpWithGoogle,
  updatePassword,
  updateProfile,
  verifyLoginOTP,
  verifyResetLinkUsingOTAL,
} from "./user.services.js";
import { validateData } from "../../common/middleware/verification.service.js";
import {
  confirmAccountSchema,
  confirmationResetPasswordSchema,
  forgetPasswordSchema,
  loginSchema,
  resendConfirmationCodeSchema,
  signupSchema,
  resetPasswordUsingOTALSchema,
  verifyResetLinkUsingOTALSchema,
  loginVerifyUsingOTALSchema,
} from "./user.validation.js";
import { authorization } from "../../common/middleware/authorization.service.js";
import { fileTypeEnum, roleEnum } from "../../common/enum/enum.js";
import { multer_host_Middleware } from "../../common/middleware/multer.service.js";
import { authMiddleware } from "../../common/middleware/auth.service.js";
import { messageRouter } from "../messageModule/message.controller.js";

export const authRouter = Router({strict: true ,caseSensitive: true});
export const userOperationRouter = Router({strict: true ,caseSensitive: true});
``;

userOperationRouter.use("/:id/messages", messageRouter);

authRouter.post("/login", validateData(loginSchema), login);
authRouter.post("/resendLoginConfirmationCode",validateData(resendConfirmationCodeSchema), resendLoginConfirmationCode);
authRouter.post(
  "/loginVerifyUsingOTAL",
  validateData(loginVerifyUsingOTALSchema),
  verifyLoginOTP,
);
authRouter.post(
  "/signup",
  multer_host_Middleware(fileTypeEnum.image).fields([
    {
      name: "attachment",
      maxCount: 1,
    },
    {
      name: "attachments",
      maxCount: 3,
    },
  ]),
  validateData(signupSchema),
  signup,
);
authRouter.patch(
  "/signupConfirmation",
  validateData(confirmAccountSchema),
  confirmAccount,
);
authRouter.post("/signup/google", signUpWithGoogle);
authRouter.post("/refresh-token", refreshToken);
authRouter.post(
  "/resend-otp",
  validateData(resendConfirmationCodeSchema),
  resendConfirmationCode,
);

userOperationRouter.get(
  "/profile",
  authMiddleware,
  authorization(roleEnum.user),
  getProfile,
);
userOperationRouter.get("/shareProfile/:id", shareProfile);
userOperationRouter.put(
  "/updateProfile/:id",
  authMiddleware,
  authorization(roleEnum.user),
  updateProfile,
);
userOperationRouter.put(
  "/updatePassword/:id",
  authMiddleware,
  authorization(roleEnum.user),
  updatePassword,
);
userOperationRouter.post(
  "/logout",
  authMiddleware,
  authorization(roleEnum.user),
  logout,
);
userOperationRouter.post(
  "/forget-password",
  validateData(forgetPasswordSchema),
  forgetPassword,
);
userOperationRouter.patch(
  "/confirm-reset-password",
  validateData(confirmationResetPasswordSchema),
  resetPassword,
);
userOperationRouter.post(
  "/forget-password-otal",
  validateData(forgetPasswordSchema),
  forgetPasswordUsingOTAL,
);
userOperationRouter.get(
  "/forget-password-otal/:token",validateData(verifyResetLinkUsingOTALSchema),
  verifyResetLinkUsingOTAL,
);
userOperationRouter.post(
  "/reset-password-otal/:token",
  validateData(resetPasswordUsingOTALSchema),
  resetPasswordUsingOTAL,
);