import nodemailer from "nodemailer";
import { Email, Password } from "../../../config/env.sevices.js";

export const sendEmail = async ({ to, subject, attachments, html }={}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user:Email,
      pass: Password,
    },
  });

  const info = await transporter.sendMail({
    from: `"yara" <${Email}>`,
    to: to ||  "jonydeep2018@gmail.com",
    subject: subject || "Hello",
    html: html || "<b>Hello world?</b>",
  });

  
  console.log("Message sent:", info);
  return info.accepted.length > 0 ? true : false;
};


export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);