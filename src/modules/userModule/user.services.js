import userModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/DB.service.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { successResponse } from "../../common/utils/success.response.js";
import jwt from "jsonwebtoken";
import { compare, hash } from "../../common/utils/security/hash.security.js";
import { OAuth2Client } from "google-auth-library";
import { providerEnum, roleEnum } from "../../common/enum/enum.js";
import {
  accessTokenSecret,
  refreshTokenSecret,
} from "../../config/env.sevices.js";
import cloudinary from "../../common/utils/cloudinary/cloudinary.service.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
import { randomUUID } from "crypto";
import {
  block_otp_key,
  deleteRedis,
  getAllRevokedKeys,
  getRedis,
  increment,
  max_otp_key,
  otpKey,
  revokedKey,
  setRedis,
  ttl,
} from "../../DB/redis/redis.service.js";
import { redisClient } from "../../DB/redis/redis.DB.js";
import { generateOTP, sendEmail } from "../../common/utils/nodemailer/sendEmail.js";
export const signup = async (req, res, next) => {
  const { fristName, lastName, email, password, age, gender, phone } = req.body;
  const emailExist = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (emailExist) {
    throw new Error("Email already exist", { cause: 400 });
  }

  const profilePicture = await cloudinary.uploader.upload(
    req.files.attachment[0].path,
  );

  const coverPictures = await Promise.all(
    req.files.attachments.map(async (file) => {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
      );
      return { public_id, secure_url };
    }),
  );

  const hashedPassword = hash({ plainText: password, saltRounds: 12 });
  const encryptedPhone = encrypt(phone);

  const user = await db_service.create({
    model: userModel,
    data: {
      fristName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
      phone: encryptedPhone,
      role: roleEnum.user,
      profilePicture: {
        public_id: profilePicture.public_id,
        secure_url: profilePicture.secure_url,
      },
      coverPicture: coverPictures,
    },
    options: {
      runValidators: true,
      select:
        "fristName lastName email age gender role profilePicture coverPicture",
    },
  });
  const otp =generateOTP()
  await sendEmail({to:user.email,subject:"OTP",html:`<h1>OTP:${otp}</h1>`})
  const otpHashed = hash({ plainText: otp.toString(), saltRounds: 12 });
  console.log(otpHashed);
  
  setRedis({ key: otpKey({email}), value: otpHashed , ttl: 60*2 });
  setRedis({key: max_otp_key({email}),value: 1 ,ttl:60});
  successResponse({
    res,
    status: 201,
    message: "User created successfully",
    data: user,
  });
};

export const confirmAccount = async (req, res, next) => {
  const {email,code} = req.body;
  const otpHashed = await getRedis(otpKey({email}));
  if (!otpHashed) {
    throw new Error("OTP not found", { cause: 400 });
  }
  const isOtpMatch = compare({ plainText: code, cipherText: otpHashed });
  if (!isOtpMatch) {
    throw new Error("OTP not match", { cause: 400 });
  }
  const user = await db_service.findOneAndUpdate({
    model: userModel,
    filter: { email , confirm: {$exists: false} },
    data: { confirm: true },
  });
  await deleteRedis(otpKey({email}));
  successResponse({
    res,
    status: 200,
    message: "Account confirmed successfully",
    data: user,
  });
}

export const resendConfirmationCode = async (req, res, next) => {
  const {email} = req.body;
  const userExist = await db_service.findOne({
    model: userModel,
    filter: { email , confirm: {$exists: false} },
  });
  if (!userExist) {
    throw new Error("User not found", { cause: 400 });
  }
  const bloackedOtp = await ttl(block_otp_key({email}));
  if(bloackedOtp>0){
    throw new Error(`you reached the limit of sending otp, you can resend after ${bloackedOtp} seconds`, { cause: 400 });
  }
  const otpTtl = await ttl(otpKey({email}));
  if(otpTtl>0){
    throw new Error(`you can resend otp after ${otpTtl} seconds`, { cause: 400 });
  }
  const maxOtpsend = await getRedis(max_otp_key({email}));
  if(maxOtpsend>=3){
    await setRedis({key: block_otp_key({email}),value: 1 ,ttl:60});
    await deleteRedis(max_otp_key({email}));
    throw new Error(`you can resend otp after ${maxOtpsend} seconds`, { cause: 400 });
  }

  const otp =generateOTP()
  await sendEmail({to:userExist.email,subject:"OTP",html:`<h1>OTP:${otp}</h1>`})
  const otpHashed = hash({ plainText: otp.toString(), saltRounds: 12 });
  setRedis({ key: otpKey({email}), value: otpHashed , ttl: 60*2 });
  increment(max_otp_key({email}));
  successResponse({
    res,
    status: 200,
    message: "OTP resent successfully",
  });
}

export const signUpWithGoogle = async (req, res, next) => {
  let user;
  const idToken = req.body.idToken;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "111602973559-p3bkbkanbp5nlg76ntubjok85t9oea2m.apps.googleusercontent.com",
    });
    const { given_name, family_name, email, picture } = ticket.getPayload();

    user = await db_service.findOne({
      model: userModel,
      filter: { email },
    });
    console.log("exist", user);
    if (!user) {
      user = await db_service.create({
        model: userModel,
        data: {
          fristName: given_name,
          lastName: family_name,
          email,
          confirm: true,
          provider: providerEnum.google,
          picture,
        },
        options: {
          runValidators: true,
          select: "fristName lastName email age gender ",
        },
      });
      console.log("not exist", user);
    }
    console.log(user);

    if (user.provider == providerEnum.system) {
      console.log("error");

      throw new Error("You must login with system", { cause: 400 });
    }
    const tokenId = randomUUID();
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      accessTokenSecret || "access_token_super_secret_key",
      { expiresIn: "1h", jwtid: tokenId },
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      refreshTokenSecret || "refresh_token_super_secret_key",
      { expiresIn: "7d", jwtid: tokenId },
    );
    verify().catch(console.error);
    successResponse({
      res,
      status: 200,
      message: "Login successfully",
      data: { accessToken, refreshToken },
    });
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const isPasswordMatch = compare({
    plainText: password,
    cipherText: user.password,
  });
  if (!isPasswordMatch) {
    throw new Error("Password not match", { cause: 400 });
  }
  const tokenId = randomUUID();
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    accessTokenSecret || "access_token_super_secret_key",
    { expiresIn: "1h", jwtid: tokenId },
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    refreshTokenSecret || "refresh_token_super_secret_key",
    { expiresIn: "7d", jwtid: tokenId },
  );
  successResponse({
    res,
    status: 200,
    message: "Login successfully",
    data: { accessToken, refreshToken },
  });
};
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new Error("Refresh token is required", { cause: 400 });
  }
  const decoded = jwt.verify(refreshToken, refreshTokenSecret);
  const user = await db_service.findById({ model: userModel, id: decoded.id });
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    accessTokenSecret || "access_token_super_secret_key",
    { expiresIn: "1h" },
  );
  successResponse({
    res,
    status: 200,
    message: "Refresh token successfully",
    data: { accessToken },
  });
};

export const getProfile = async (req, res, next) => {
  const profileKey = `profile:${req.decoded.id}`;
  const dataCashed = await getRedis(profileKey)
  if (dataCashed){
    console.log("from cash");
    
    return successResponse({
      res,
      status: 200,
      message: "Get profile successfully",
      data: { ...dataCashed, phone: decrypt(dataCashed.phone) },
    });
  }
  console.log("from db");
  
  await setRedis({ key: profileKey, value: req.userInfo, ttl: 60*2 }); 
  successResponse({
    res,
    status: 200,
    message: "Get profile successfully",
    data: req.userInfo,
  });
};

export const shareProfile = async (req, res, next) => {
  const userId = req.params.id;
  const userInfo = await db_service.findById({ model: userModel, id: userId });
  successResponse({
    res,
    status: 200,
    message: "Share profile successfully",
    data: { ...userInfo._doc, phone: decrypt(userInfo.phone) },
  });
};
export const updateProfile = async (req, res, next) => {
  const userId = req.params.id;
  const updateDataInfo = await db_service.findOneAndUpdate({
    model: userModel,
    filter: { _id: userId },
    data: req.body,
    options: { new: true },
  });
  successResponse({
    res,
    status: 200,
    message: "Profile updated successfully",
    data: { ...updateDataInfo._doc, phone: decrypt(updateDataInfo.phone) },
  });
};
export const updatePassword = async (req, res, next) => {
  if (
    !compare({
      plainText: req.body.oldPassword,
      cipherText: req.userInfo.password,
    })
  ) {
    throw new Error("Old password not match", { cause: 400 });
  }
  const hashedPassword = hash({
    plainText: req.body.newPassword,
    saltRounds: 12,
  });
  const updatedUser = await db_service.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.userInfo._id },
    data: { password: hashedPassword },
    options: { new: true },
  });
  successResponse({
    res,
    status: 200,
    message: "Password updated successfully",
    data: { ...updatedUser._doc, phone: decrypt(updatedUser.phone) },
  });
};

export const logout = async (req, res, next) => {
  const flag = req.query.flag;
  if (flag === "All") {
    req.userInfo.changeCradentials = new Date();
    await req.userInfo.save();
    const keys = await redisClient.keys(
      getAllRevokedKeys({ userId: req.decoded.id }),
    );
    console.log(keys);
    
    if (keys.length > 0) {
      await deleteRedis(keys);
    }
  } else {
    await setRedis({
      key: revokedKey({ userId: req.decoded.id, jti: req.decoded.jti }),
      value: `${req.decoded.jti}`,
      ttl: req.decoded.exp - Math.floor(Date.now() / 1000),
    });
  }
  successResponse({
    res,
    status: 200,
    message: "Logout successfully",
  });
};
