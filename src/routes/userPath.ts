import { Router } from "express";
import { sendOTP, verifyOTPAndReset } from "../controllers/otpController";
import { signup, signin, getAllUsers, getUserById, testRoute } from "../controllers/Usercontroller";

const userRouter = Router();

// Auth routes
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

// OTP routes
userRouter.post("/forgot-password", sendOTP);            // send OTP
userRouter.post("/reset-password", verifyOTPAndReset);   // verify OTP + reset password

// User queries
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.get("/test", testRoute);

export default userRouter;
