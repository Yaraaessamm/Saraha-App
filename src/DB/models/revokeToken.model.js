import mongoose from "mongoose";
import { genderEnum, providerEnum } from "../../common/enum/enum.js";
import { Types } from "mongoose";
const revokeTokenSchema = new mongoose.Schema(
  {
    tokenId:{
      type:String,
      required:true,
      trim:true
    },
    userId:{
      type:Types.ObjectId,
      ref:"user",
      required:true
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: true,
    toObject: true,
  },
);

revokeTokenSchema.index({ expirationDate: 1 }, { expireAfterSeconds:0 });

const revokeTokenModel =
  mongoose.models.revokeTokenSchema ||
  mongoose.model("revokeToken", revokeTokenSchema);

export default revokeTokenModel;