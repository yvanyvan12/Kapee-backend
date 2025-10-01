"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModels_1 = require("../model/userModels");
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const Auth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const verifytoken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const rootuser = await userModels_1.User.findOne({
                _id: verifytoken._id,
                accessToken: token,
            });
            if (!rootuser) {
                throw "User not found";
            }
            req.user = rootuser; // full user object
            req.userId = rootuser._id;
            req.userRole = rootuser.userRole; // optional
            next();
        }
        else {
            throw "Authentication is required";
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Authorization required" });
    }
};
exports.Auth = Auth;
