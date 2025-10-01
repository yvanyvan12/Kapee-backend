"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPAndReset = exports.sendOTP = exports.testRoute = exports.getUserById = exports.getAllUsers = exports.signin = exports.signup = void 0;
const userModels_1 = require("../model/userModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokengenerator_1 = require("../utils/tokengenerator");
const nodemailer_1 = __importDefault(require("nodemailer"));
// ==========================
// Helper: Generate 6-digit OTP
// ==========================
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// ==========================
// SIGNUP
// ==========================
const signup = async (req, res, next) => {
    try {
        const { email, password, username, userRole } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: "Email, password, and username are required" });
        }
        const existingUser = await userModels_1.User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new userModels_1.User({
            username,
            email,
            password: hashedPassword,
            userRole: userRole || "user",
        });
        await newUser.save();
        const token = (0, tokengenerator_1.generateAccessToken)(newUser);
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
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Something went wrong during signup" });
    }
};
exports.signup = signup;
// ==========================
// SIGNIN
// ==========================
const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        const user = await userModels_1.User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ message: "Invalid email or password" });
        const token = (0, tokengenerator_1.generateAccessToken)(user);
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
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Server error during signin" });
    }
};
exports.signin = signin;
// ==========================
// GET ALL USERS
// ==========================
const getAllUsers = async (req, res) => {
    try {
        const users = await userModels_1.User.find({}, "-password -accessToken -otp -otpExpiry");
        res.status(200).json({ success: true, count: users.length, users });
    }
    catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
// ==========================
// GET USER BY ID
// ==========================
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ message: "User ID is required" });
        const user = await userModels_1.User.findById(id, "-password -accessToken -otp -otpExpiry");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("Get user by ID error:", error);
        if (error.name === "CastError")
            return res.status(400).json({ message: "Invalid user ID format" });
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserById = getUserById;
// ==========================
// TEST ROUTE
// ==========================
const testRoute = async (_req, res) => {
    res.status(200).json({ success: true, message: "GET request working!", timestamp: new Date().toISOString() });
};
exports.testRoute = testRoute;
// ==========================
// SEND OTP FOR FORGOT PASSWORD
// ==========================
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await userModels_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.sendOTP = sendOTP;
// ==========================
// VERIFY OTP AND RESET PASSWORD
// ==========================
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
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOTPAndReset = verifyOTPAndReset;
