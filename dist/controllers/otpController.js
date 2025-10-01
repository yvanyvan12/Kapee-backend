"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPAndReset = exports.sendOTP = void 0;
const userModels_1 = require("../model/userModels");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
// Send OTP via email
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await userModels_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        // send email
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.sendOTP = sendOTP;
// Verify OTP and reset password
const verifyOTPAndReset = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        const user = await userModels_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!user.otp || !user.otpExpiry)
            return res.status(400).json({ message: "No OTP requested" });
        if (user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });
        if (new Date() > user.otpExpiry)
            return res.status(400).json({ message: "OTP expired" });
        // Reset password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        // Clear OTP fields
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOTPAndReset = verifyOTPAndReset;
