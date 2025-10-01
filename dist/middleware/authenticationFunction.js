"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSignin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModels_1 = require("../model/userModels"); // corrected path & name (models, singular)
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const requireSignin = async (req, // allow attaching `user` to req
res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication is required" });
        }
        // support headers like "Bearer <token>"
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        // verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // look up user by id and token
        const rootUser = await userModels_1.User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        if (!rootUser) {
            return res.status(401).json({ message: "User not found" });
        }
        // attach user to request and proceed
        req.user = rootUser;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Authorization required" });
    }
};
exports.requireSignin = requireSignin;
