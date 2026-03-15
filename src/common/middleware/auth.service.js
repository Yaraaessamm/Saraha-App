import jwt from "jsonwebtoken";
import * as db_service from "../../DB/DB.service.js";
import userModel from "../../DB/models/user.model.js";
import { accessTokenSecret, JWT_SECRET } from "../../config/env.sevices.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
export const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new Error("Authorization header is required", { cause: 401 });
  }
  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      accessTokenSecret || "jwt_super_secret_key",
    );

    const userExist = await db_service.findById({
      model: userModel,
      id: decoded.id,
    });

    if (!userExist) {
      throw new Error("user not found", { cause: 401 });
    }

    if (userExist?.changeCradentials?.getTime() > decoded.iat * 1000) {
      throw new Error("Invalid Token", { cause: 401 });
    }
    const revokeToken = await db_service.findOne({
      model: revokeTokenModel,
      filter: { tokenId: decoded.jti },
    });
    if (revokeToken) {
      throw new Error("Invalid Token revoked", { cause: 401 });
    }
    req.userInfo = userExist;
    req.decoded = decoded;
    next();
  } catch (error) {
    throw new Error(error.message, { cause: 401 });
  }
};