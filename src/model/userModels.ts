import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  accessToken?: string;
  userRole?: "user" | "admin";
  otp?: string;       // store OTP
  otpExpiry?: Date;   // OTP expiration time
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
