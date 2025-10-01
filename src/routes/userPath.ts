import { Router } from "express";
import { sendOTP, verifyOTPAndReset } from "../controllers/otpController";
import { signup, signin, getAllUsers, getUserById, testRoute } from "../controllers/Usercontroller";

const userRouter = Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully signed up
 *       400:
 *         description: Bad request
 */
userRouter.post("/signup", signup);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User signin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully signed in
 *       401:
 *         description: Unauthorized
 */
userRouter.post("/signin", signin);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send OTP to user email for password reset
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 */
userRouter.post("/forgot-password", sendOTP);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Verify OTP and reset password
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP or bad request
 */
userRouter.post("/reset-password", verifyOTPAndReset);

/**
 * @swagger
 * user/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 */
userRouter.get("/users", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 */
userRouter.get("/users/:id", getUserById);

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test route
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Test route successful
 */
userRouter.get("/test", testRoute);

export default userRouter;
