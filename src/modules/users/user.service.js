import userModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/DB.service.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { successResponse } from "../../common/success.response.js";
import jwt from "jsonwebtoken";
import { compare, hash } from "../../common/utils/security/hash.security.js";
import { OAuth2Client } from "google-auth-library";
import { providerEnum, roleEnum } from "../../common/enum/enum.js";

export const signup = async (req, res, next) => {
  const {
    fristName,
    lastName,
    email,
    password,
    age,
    gender,
    phone,
    confirmPassword,
  } = req.body;
  const emailExist = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (emailExist) {
    throw new Error("Email already exist", { cause: 400 });
  }
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
      confirm: true,
      role:roleEnum.user
    },
    options: {
      runValidators: true,
      select: "fristName lastName email age gender role",
    },
  });
  successResponse({
    res,
    status: 201,
    message: "User created successfully",
    data: user,
  });
};
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
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "jwt_super_secret_key",
      { expiresIn: "1h" },
    );
    verify().catch(console.error);
    successResponse({
      res,
      status: 200,
      message: "Login successfully",
      data: { token },
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
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "jwt_super_secret_key",
    { expiresIn: "1h" },
  );
  successResponse({
    res,
    status: 200,
    message: "Login successfully",
    data: { token },
  });
};

export const getProfile = async (req, res, next) => {
  const userInfo = await req.userInfo;
  successResponse({
    res,
    status: 200,
    message: "Get profile successfully",
    data: { ...userInfo._doc, phone: decrypt(userInfo.phone) },
  });
};