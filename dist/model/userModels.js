"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: String },
    otpExpiry: { type: Date },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
