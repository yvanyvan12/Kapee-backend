import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/userModels";
const JWT_SECRET = process.env.JWT_SECRET ?? "";
export const Auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const verifytoken: any = jwt.verify(token, JWT_SECRET);
      const rootuser = await User.findOne({
        _id: verifytoken._id,
        accessToken: token,
      });
      if (!rootuser) {
        throw "User not found";
      }
      req.user = rootuser;           // full user object
      req.userId = rootuser._id;
      req.userRole = rootuser.userRole; // optional
      next();
    } else {
      throw "Authentication is required";
    }
  } catch (error) {
    return res.status(401).json({ message: "Authorization required" });
  }
}; 