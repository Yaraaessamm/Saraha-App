import mongoose from "mongoose";
import { genderEnum, providerEnum } from "../../common/enum/enum.js";
const userSchema = new mongoose.Schema({
  fristName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim:true
    },
    lastName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim:true
  },
    email: {
    type: String,
    required: true,
    unique: true,
    trim:true,
    
  },
    password: {
    type: String,
    required: function () {
      return this.provider === providerEnum.system ? true : false
    },
    minLength: 6,
    trim:true
  },
  age:{
    type:Number,
  },
  phone:{
    type:String,
  },
  gender:{
    type:String,
    enum:Object.values(genderEnum),
    default:genderEnum.male
  },
  role:{
    type:String,
    enum:["admin","user"],
    default:"user"
  },
  provider:{
    type:String,
    enum:Object.values(providerEnum),
    default:providerEnum.system
  },
  confirm:{
    type:Boolean,
  },
  profilePicture:{
    type:String,
  }
},
{
  timestamps:true,
  strictQuery:true,
  toJSON:true,
  toObject:true
});

userSchema.virtual("fullName").get(function () {
  return `${this.fristName} ${this.lastName}`;
}).set(function (value) {
  const [fristName, lastName] = value.split(" ");
  this.fristName = fristName;
  this.lastName = lastName;
});

const userModel =mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;