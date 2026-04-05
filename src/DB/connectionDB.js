import mongoose from "mongoose";
import { DB_Atlas_Url} from "../config/env.sevices.js";
export const connectionDB = async () => {
  await mongoose.connect(DB_Atlas_Url, {
      serverSelectionTimeoutMS: 3000,
    })
    .then(() => {
      console.log("Data base connected successfully");
    })
    .catch((err) => {
      console.log("Data base connection failed", err);
    });
};