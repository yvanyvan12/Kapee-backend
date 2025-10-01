import { Request, Response, NextFunction } from "express";
import { User } from "../model/userModels";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/tokengenerator";
import nodemailer from "nodemailer";

// ==========================
// Helper: Generate 6-digit OTP
// ==========================
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================
// SIGNUP
// ==========================
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username, userRole } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email, password, and username are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userRole: userRole || "user",
    });

    await newUser.save();

    const token = generateAccessToken(newUser);
    newUser.accessToken = token;
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userRole: newUser.userRole,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong during signup" });
  }
};

// ==========================
// SIGNIN
// ==========================
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateAccessToken(user);
    user.accessToken = token;
    await user.save();

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userRole: user.userRole,
      },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error during signin" });
  }
};

// ==========================
// GET ALL USERS
// ==========================
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "-password -accessToken -otp -otpExpiry");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET USER BY ID
// ==========================
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(id, "-password -accessToken -otp -otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error("Get user by ID error:", error);
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid user ID format" });
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// TEST ROUTE
// ==========================
export const testRoute = async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "GET request working!", timestamp: new Date().toISOString() });
};

// ==========================
// SEND OTP FOR FORGOT PASSWORD
// ==========================
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Password Reset",
      html: `<p>Hello ${user.username},</p>
             <p>Your OTP for password reset is: <b>${otp}</b></p>
             <p>It expires in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// VERIFY OTP AND RESET PASSWORD
// ==========================
export const verifyOTPAndReset = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Email, OTP, and new password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiry) return res.status(400).json({ message: "No OTP requested" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
