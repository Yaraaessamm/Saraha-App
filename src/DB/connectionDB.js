import mongoose from "mongoose";
import { db_uri } from "../config/env.services.js";
export const connectionDB = async () => {
  await mongoose.connect(db_uri , {
      serverSelectionTimeoutMS: 3000,
    })
    .then(() => {
      console.log("Data base connected successfully");
    })
    .catch((err) => {
      console.log("Data base connection failed", err);
    });
};