import dotenv from "dotenv";
import {resolve} from "node:path"
const NODE_ENV = process.env.NODE_ENV;

let envPath = {
  development: ".env.development",
  production: ".env.production",
};

dotenv.config({path:resolve(`src/config/${envPath[NODE_ENV]}`)})

export const port = +process.env.port;
export const saltRounds = process.env.saltRounds;
export const db_uri = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const refreshTokenSecret = process.env.refreshTokenSecret;
export const accessTokenSecret = process.env.accessTokenSecret;
export const Email = process.env.Email;
export const Password = process.env.Password; 
export const allowOrigins = process.env.allowOrigins.split(",");
export const applicationName = process.env.applicationName;
export const DB_Atlas_Url = process.env.DB_Atlas_Url;