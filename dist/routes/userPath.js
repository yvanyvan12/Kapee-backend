"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpController_1 = require("../controllers/otpController");
const Usercontroller_1 = require("../controllers/Usercontroller");
const userRouter = (0, express_1.Router)();
// Auth routes
userRouter.post("/signup", Usercontroller_1.signup);
userRouter.post("/signin", Usercontroller_1.signin);
// OTP routes
userRouter.post("/forgot-password", otpController_1.sendOTP); // send OTP
userRouter.post("/reset-password", otpController_1.verifyOTPAndReset); // verify OTP + reset password
// User queries
userRouter.get("/users", Usercontroller_1.getAllUsers);
userRouter.get("/users/:id", Usercontroller_1.getUserById);
userRouter.get("/test", Usercontroller_1.testRoute);
exports.default = userRouter;
