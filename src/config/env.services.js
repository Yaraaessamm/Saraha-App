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